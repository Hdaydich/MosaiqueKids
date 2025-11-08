import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { SegmentColor } from "../../utils/SegmentColor";
import { exportToWord } from "../../utils/exportToWord";
import { PlusCircleFill, CloudArrowDownFill } from "react-bootstrap-icons";
import s from "./style.module.css";
import storiesData from "../../data/stories";
import { Button } from "../../components/Button/Button";
import { StoriesList } from "../../components/StoriesList/StoriesList";
import { ReadingOutput } from "../../components/ReadingOutput/ReadingOutput";
import fatha from "../../assets/fatha.png";
import kasra from "../../assets/kasra.png";
import dhamma from "../../assets/dhamma.png";
import soukoun from "../../assets/skoun.png";
import { Chakel } from "../../components/Chakel/Chakel";

export function Reading() {
  const [mode, setMode] = useState("list"); // "list" | "story"
  const [segments, setSegments] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);

  // S'assurer que stories existe
  const stories = storiesData || [];
  const defaultStories = stories.filter((s) => !s.userCreated);
  const myStories = stories.filter((s) => s.userCreated);

  const handleSelectStory = (story) => {
    setSelectedStory(story);
    setSegments(SegmentColor(story?.text || ""));
    setMode("story");
  };

  // Liste des chakels
  const chakels = [
    { name: "الفَتْحَة", color: "#ff0073", img: fatha },
    { name: "الكَسْرَة", color: "#009bee", img: kasra },
    { name: "الضَمَّة", color: "#04cf1f", img: dhamma },
    { name: "السُّكُون", color: "#962dc0", img: soukoun },
  ];

  return (
    <Container className={s.container}>
      {/* === MODE LISTE DES CONTES === */}
      {mode === "list" && (
        <>
          <Row>
            <Col xs={12} md={6} lg={6}>
              <div className={s.listBox}>
                <StoriesList
                  stories={defaultStories}
                  title="📘 Contes par défaut"
                  onSelect={handleSelectStory}
                />
              </div>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <div className={s.listBox}>
                <StoriesList
                  stories={myStories}
                  title="✍️ Mes contes"
                  onSelect={handleSelectStory}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <div className={s.centerButton}>
              <Button
                icon={PlusCircleFill}
                name=" Ajouter un nouveau conte"
                variant="confirmButtonSmall"
                action={() => alert("Ajout de conte à venir")}
              />
            </div>
          </Row>
        </>
      )}

      {/* === MODE CONTE CHOISI === */}
      {mode === "story" && selectedStory && (
        <Row>
          {/* COLONNE GAUCHE */}
          <Col lg={4}>
            <Row className={s.listHalf}>
              <StoriesList
                stories={defaultStories}
                title="📘 Contes par défaut"
                onSelect={handleSelectStory}
              />
            </Row>
            <Row>
              <StoriesList
                stories={myStories}
                title="✍️ Mes contes"
                onSelect={handleSelectStory}
              />
            </Row>
          </Col>

          {/* COLONNE DROITE */}
          <Col lg={8}>
            <Row className={s.chakelRow}>
              {chakels.map((c, i) => (
                <Col key={i} xs={3} className={s.chakelCol}>
                  <Chakel
                    name={c.name}
                    color={c.color}
                    img={c.img}
                    size={22} // passer en number pour éviter problème
                  />
                </Col>
              ))}
            </Row>

            <Row className={s.titleRow}>
              <div className={s.title}>
                <ReadingOutput
                  segments={SegmentColor(selectedStory?.title || "")}
                />
              </div>
            </Row>

            <Row className={s.resultBox}>
              <ReadingOutput segments={segments} />
              <div className={s.showMoreLink}>▼</div>
            </Row>

            <div className={s.downloadBox}>
              <Button
                icon={CloudArrowDownFill}
                variant="downloadCuteButton"
                action={() => exportToWord(segments)}
              />
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}
