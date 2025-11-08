import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Modal } from "react-bootstrap";
import { CheckCircle, XCircle, Stopwatch } from "react-bootstrap-icons";
import s from "./style.module.css";
import { Button } from "../../components/Button/Button";

const COLOR_SETS = {
  facile: ["#FF5722", "#2196F3"],
  medium: ["#FF5722", "#2196F3", "#4CAF50", "#FFEB3B"],
  hard: ["#FF5722", "#2196F3", "#4CAF50", "#FFEB3B", "#9C27B0"],
};

const GRID_SIZE = {
  facile: 3,
  medium: 4,
  hard: 5,
};

export function PuzzleGame({ isMobile = false }) {
  const [level, setLevel] = useState("facile");
  const [gridModel, setGridModel] = useState([]);
  const [gridPlayer, setGridPlayer] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [score, setScore] = useState(0);
  const [failScore, setFailScore] = useState(0);
  const [time, setTime] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Génère la grille quand le niveau change
  useEffect(() => {
    generateGrid(level);
    setTime(0);
  }, [level]);

  // Chronomètre
  useEffect(() => {
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const generateGrid = (lvl) => {
    const size = GRID_SIZE[lvl];
    const colors = COLOR_SETS[lvl];
    const newGrid = Array(size * size)
      .fill()
      .map(() => colors[Math.floor(Math.random() * colors.length)]);
    setGridModel(newGrid);
    setGridPlayer(Array(size * size).fill("#fff"));
    setSelectedColor(null);
  };

  const handleCellClick = (index) => {
    if (!selectedColor) return;
    const newGrid = [...gridPlayer];
    newGrid[index] = selectedColor;
    setGridPlayer(newGrid);
  };

  const handleCheck = () => {
    const correct = gridModel.every((color, i) => color === gridPlayer[i]);
    setIsCorrect(correct);
    setShowModal(true);

    if (correct) setScore((s) => s + 1);
    else setFailScore((f) => f + 1);
  };

  const size = GRID_SIZE[level];
  const colors = COLOR_SETS[level];

  // ====== Calcul taille cellule responsive ======
  const containerWidth = isMobile
    ? window.innerWidth - 100 // petit padding autour
    : window.innerWidth / 4; // largeur fixe PC
  const cellSize = Math.floor(containerWidth / size) - 8; // 6px gap

  return (
    <Container
      className="mb-5"
      style={{
        width: isMobile ? "100%" : "80%",
      }}
    >
      {/* ====== SCORE + TEMPS + NIVEAUX ====== */}
      <Row className="justify-content-center mb-4">
        <Col lg={6}>
          <Card className={s.scoreCard}>
            <h6 className="fw-bold text-center border-bottom pb-2 mb-3">
              Niveaux 🎯
            </h6>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <Button
                name="Niveau 1"
                variant={level === "facile" ? "success" : "outlineSuccess"}
                action={() => setLevel("facile")}
              />
              <Button
                name="Niveau 2"
                variant={level === "medium" ? "warning" : "outlineWarning"}
                action={() => setLevel("medium")}
              />
              <Button
                name="Niveau 3"
                variant={level === "hard" ? "danger" : "outlineDanger"}
                action={() => setLevel("hard")}
              />
            </div>
          </Card>
        </Col>
        <Col lg={6} className="mt-3">
          <Card className={s.scoreCard}>
            <h6 className="fw-bold text-center border-bottom pb-2 mb-3">
              Score 🏆
            </h6>
            <Row className="text-center">
              <Col>
                <CheckCircle color="green" size={22} /> {score}
              </Col>
              <Col>
                <XCircle color="red" size={22} /> {failScore}
              </Col>
              <Col>
                <Stopwatch color="blue" size={22} /> {time}s
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {isMobile ? (
        <Row>
          <Card className={s.gameCard} style={{ padding: "20px" }}>
            <Row className="g-4 align-items-start">
              {/* Modèle à reproduire */}
              <Col xs={12} md={6}>
                <Card className={`${s.gridBox} ${s.modelGrid}`}>
                  <div
                    className={s.grid}
                    style={{
                      gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
                      gap: "6px",
                      justifyContent: "center",
                    }}
                  >
                    {gridModel.map((color, i) => (
                      <div
                        key={i}
                        className={s.cell}
                        style={{
                          width: cellSize,
                          height: cellSize,
                          backgroundColor: color,
                        }}
                      ></div>
                    ))}
                  </div>
                </Card>
              </Col>

              {/* Zone joueur */}
              <Col xs={12}>
                <div className="text-center mb-3 mt-3">
                  <div className={s.colorGrid}>
                    {colors.map((color) => (
                      <div
                        key={color}
                        className={`${s.colorSwatch} ${
                          selectedColor === color ? s.active : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      ></div>
                    ))}
                  </div>
                </div>
                <Card className={s.gridBox}>
                  <div
                    className={s.grid}
                    style={{
                      gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
                      gap: "6px",
                      justifyContent: "center",
                    }}
                  >
                    {gridPlayer.map((color, i) => (
                      <div
                        key={i}
                        className={s.cell}
                        style={{
                          width: cellSize,
                          height: cellSize,
                          backgroundColor: color,
                        }}
                        onClick={() => handleCellClick(i)}
                      ></div>
                    ))}
                  </div>
                </Card>

                <div className="text-center mt-4 d-flex justify-content-center flex-wrap gap-2">
                  <Button
                    name="Vérifier"
                    variant="addButton"
                    action={handleCheck}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Row>
      ) : (
        <Row>
          <Card className={s.gameCard}>
            <Row className="align-items-start">
              {/* Zone joueur */}
              <Col lg={6}>
                <div className="text-center mb-3 mt-3">
                  <div className={s.colorGrid}>
                    {colors.map((color) => (
                      <div
                        key={color}
                        className={`${s.colorSwatch} ${
                          selectedColor === color ? s.active : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      ></div>
                    ))}
                  </div>
                </div>
                <Card className={s.gridBox}>
                  <div
                    className={s.grid}
                    style={{
                      gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
                      gap: "6px",
                      justifyContent: "center",
                    }}
                  >
                    {gridPlayer.map((color, i) => (
                      <div
                        key={i}
                        className={s.cell}
                        style={{
                          width: cellSize,
                          height: cellSize,
                          backgroundColor: color,
                        }}
                        onClick={() => handleCellClick(i)}
                      ></div>
                    ))}
                  </div>
                </Card>

                <div className="text-center mt-4 d-flex justify-content-center flex-wrap gap-2">
                  <Button
                    name="Vérifier"
                    variant="addButton"
                    action={handleCheck}
                  />
                </div>
              </Col>
              {/* Modèle à reproduire */}
              <Col lg={6}>
                <Card
                  className={`${s.gridBox} ${s.modelGrid}`}
                  style={{ marginTop: "70px" }}
                >
                  <div
                    className={s.grid}
                    style={{
                      gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
                      gap: "6px",
                      justifyContent: "center",
                    }}
                  >
                    {gridModel.map((color, i) => (
                      <div
                        key={i}
                        className={s.cell}
                        style={{
                          width: cellSize,
                          height: cellSize,
                          backgroundColor: color,
                        }}
                      ></div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Row>
      )}
      {/* ====== ZONE DE JEU ====== */}

      {/* ===== MODALE DE RÉSULTAT ===== */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Body className="text-center p-4">
          {isCorrect ? (
            <>
              <CheckCircle color="green" size={48} />
              <h4 className="mt-3 text-success fw-bold">Bravo ! 🎉</h4>
              <p>Tu as bien reproduit le modèle.</p>
              <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                <Button
                  name="Suivant ➡️"
                  variant="success"
                  action={() => {
                    generateGrid(level);
                    setShowModal(false);
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <XCircle color="red" size={48} />
              <h4 className="mt-3 text-danger fw-bold">Oups ! Erreur 😅</h4>
              <p>Essaie encore ou passe au suivant.</p>
              <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                <Button
                  name="Refaire 🔄"
                  variant="errorButton"
                  action={() => {
                    setGridPlayer(Array(size * size).fill("#fff"));
                    setShowModal(false);
                  }}
                />
                <Button
                  name="Suivant ➡️"
                  variant="success"
                  action={() => {
                    generateGrid(level);
                    setShowModal(false);
                  }}
                />
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
