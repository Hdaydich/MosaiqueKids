import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  CheckCircle,
  XCircle,
  ArrowRightCircle,
  ArrowClockwise,
} from "react-bootstrap-icons";
import { Shapes } from "./Shapes";
import { Button } from "../../components/Button/Button";
import s from "./style.module.css";
import { GameTitle } from "../../components/GameTitle/GameTitle";

const SHAPES = ["circle", "square", "triangle", "star", "hexagon", "diamond"];

const LEVEL_STYLE = {
  facile: { color: "#01de09ff", rows: 5, cols: 5, size: 70 },
  medium: { color: "#ffd500ff", rows: 6, cols: 7, size: 60 },
  hard: { color: "#ff1100ff", rows: 7, cols: 9, size: 60 },
};

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function buildRows(targetShape, level) {
  const { rows, cols } = LEVEL_STYLE[level];
  const result = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const shape = Math.random() > 0.5 ? targetShape : randomFrom(SHAPES);
      row.push({ shape, key: `${i}-${j}` });
    }
    result.push(row);
  }
  return result;
}

export function ShapeGame({
  level: initialLevel = "facile",
  isMobile = false,
}) {
  const [level, setLevel] = useState(initialLevel);
  const [score, setScore] = useState(0);
  const [failScore, setFailScore] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [target, setTarget] = useState(randomFrom(SHAPES));
  const [rows, setRows] = useState(buildRows(target, level));
  const [clickedPositions, setClickedPositions] = useState({});
  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState({});

  // Timer
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  // Rebuild grid on level change
  useEffect(() => {
    const newTarget = randomFrom(SHAPES);
    setTarget(newTarget);
    setRows(buildRows(newTarget, level));
    setClickedPositions({});
    setChecked(false);
    setFeedback({});
    setTime(0);
    setTimerActive(true);
  }, [level]);

  const handleClick = (rowIndex, colIndex) => {
    if (checked) return;
    const key = `${rowIndex}-${colIndex}`;
    setClickedPositions((prev) => ({
      ...prev,
      [key]: prev[key] ? null : "#1536c7a2",
    }));
  };

  const checkAnswers = () => {
    const newFeedback = {};
    let correct = true;

    rows.forEach((row, rowIndex) =>
      row.forEach((item, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        const clicked = clickedPositions[key];

        if (item.shape === target && clicked) newFeedback[key] = "correct";
        else if (item.shape === target && !clicked) {
          newFeedback[key] = "missed";
          correct = false;
        } else if (item.shape !== target && clicked) {
          newFeedback[key] = "wrong";
          correct = false;
        }
      })
    );

    setFeedback(newFeedback);
    setChecked(true);
    if (correct) setScore((s) => s + 1);
    else setFailScore((f) => f + 1);
    setTimerActive(false);
  };

  const replay = () => {
    const newTarget = randomFrom(SHAPES);
    setTarget(newTarget);
    setRows(buildRows(newTarget, level));
    setClickedPositions({});
    setChecked(false);
    setFeedback({});
    setTime(0);
    setTimerActive(true);
  };

  const { cols: colCount, size: baseShapeSize } = LEVEL_STYLE[level];
  const gap = 3;
  const containerMaxWidth = isMobile
    ? window.innerWidth - 70
    : window.innerWidth;
  const maxShapeSize = Math.min(
    baseShapeSize,
    Math.floor((containerMaxWidth - (colCount - 1) * gap) / colCount)
  );

  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${colCount}, ${maxShapeSize}px)`,
    gap: `${gap}px`,
    justifyContent: "center",
    margin: "10px auto",
  };

  return (
    <Container
      style={{
        width: isMobile ? "100%" : "80%",
      }}
    >
      <Row>
        {/* Zone du jeu */}
        <Col xs={12} lg={9} className={s.gameCard}>
          <Row>
            <Col className="mb-2 mt-1">
              <GameTitle name="Jeu d'attention 🎯" />
              <hr></hr>
            </Col>
          </Row>

          {isMobile && (
            <>
              <Row>
                <Card className={s.scoreCard}>
                  <Row>
                    <Col>
                      <CheckCircle color="green" size={22} /> : {score}
                    </Col>
                    <Col>
                      <XCircle color="red" size={22} /> : {failScore}
                    </Col>
                    <Col>⏱️ {time}s</Col>
                  </Row>
                </Card>
              </Row>
              <Row>
                <Card className={s.scoreCard}>
                  <h6 className="mb-3 fw-bold">Niveaux</h6>
                  <Row>
                    <Col xs={4}>
                      <Button
                        name="Niveau 1"
                        variant={
                          level === "facile" ? "success" : "outlineSuccess"
                        }
                        action={() => setLevel("facile")}
                      />
                    </Col>
                    <Col xs={4}>
                      <Button
                        name="Niveau 2"
                        variant={
                          level === "medium" ? "warning" : "outlineWarning"
                        }
                        action={() => setLevel("medium")}
                      />
                    </Col>
                    <Col xs={4}>
                      <Button
                        name="Niveau 3"
                        variant={level === "hard" ? "danger" : "outlineDanger"}
                        action={() => setLevel("hard")}
                      />
                    </Col>
                  </Row>
                </Card>
              </Row>
            </>
          )}

          <Card className={s.gridBox}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <Shapes shape={target} size={maxShapeSize} color="#05155aff" />
            </div>

            <div style={gridContainerStyle}>
              {rows.map((row, rowIndex) =>
                row.map((item, colIndex) => {
                  const key = `${rowIndex}-${colIndex}`;
                  const clickedColor = clickedPositions[key];
                  const state = feedback[key];
                  let Color = "transparent";
                  if (state === "correct") Color = "#00cb2f7e";
                  if (state === "wrong" || state === "missed")
                    Color = "#f8071f96";

                  return (
                    <div
                      key={key}
                      onClick={() => handleClick(rowIndex, colIndex)}
                      style={{
                        borderRadius: "12px",
                        cursor: checked ? "default" : "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: maxShapeSize,
                        height: maxShapeSize,
                        backgroundColor: Color,
                      }}
                    >
                      <Shapes
                        shape={item.shape}
                        size={maxShapeSize - 1}
                        color={clickedColor || "#ffffff"}
                      />
                    </div>
                  );
                })
              )}
            </div>

            <div className="d-flex justify-content-center gap-3 mt-3">
              {!checked ? (
                <Button
                  name="Confirmer"
                  icon={CheckCircle}
                  variant="confirmButtonSmall"
                  size={22}
                  action={checkAnswers}
                />
              ) : (
                <>
                  <Button
                    name="Rejouer"
                    icon={ArrowClockwise}
                    variant="errorButton"
                    size={22}
                    action={replay}
                  />
                  <Button
                    name="Suivant"
                    icon={ArrowRightCircle}
                    variant="confirmButtonSmall"
                    size={22}
                    action={replay}
                  />
                </>
              )}
            </div>
          </Card>
        </Col>
        {!isMobile && (
          <Col xs={12} lg={3} className="text-center mt-3">
            <Card className={s.scoreCard}>
              <div className="d-flex gap-3 " style={{ margin: "0px auto" }}>
                <div>
                  <CheckCircle color="green" size={22} /> : {score}
                </div>
                <div>
                  <XCircle color="red" size={22} /> : {failScore}
                </div>
              </div>
              <hr />
              <div>⏱️ {time}s</div>
            </Card>

            <Card className={s.scoreCard}>
              <h6 className="mb-3 fw-bold">Niveaux</h6>
              <div>
                <div style={{ marginBottom: "10px" }}>
                  <Button
                    name="Niveau 1"
                    variant={level === "facile" ? "success" : "outlineSuccess"}
                    action={() => setLevel("facile")}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <Button
                    name="Niveau 2"
                    variant={level === "medium" ? "warning" : "outlineWarning"}
                    action={() => setLevel("medium")}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <Button
                    name="Niveau 3"
                    variant={level === "hard" ? "danger" : "outlineDanger"}
                    action={() => setLevel("hard")}
                  />
                </div>
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}
