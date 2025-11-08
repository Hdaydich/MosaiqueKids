import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import s from "./style.module.css";
import { ShapeGame } from "../ShapeGame/ShapeGame";
import { PuzzleGame } from "../PuzzleGame/PuzzleGame";
import { MemoryGame } from "../MemoryGame/MemoryGame";

const themes = [
  {
    title: "Attention",
    subtitle: "Ameliorer la concentration",
    icon: <Icon.EyeFill size={46} color="#E74C3C" />,
    component: <ShapeGame />,
    bgc: "#ffe2a9ba",
  },
  {
    title: "Logique",
    subtitle: "Stimuler l'esprit logique",
    icon: <Icon.PuzzleFill size={46} color="#06b4c4ff" />,
    component: <PuzzleGame />,
    bgc: "#fffbaba8",
  },
  {
    title: "Chiffres",
    subtitle: "Joue  et améliore tes calculs mentaux",
    icon: <Icon.CalculatorFill size={46} color="#27AE60" />,
    component: <MemoryGame />,
    bgc: "#9fffe78f",
  },
  {
    title: "Lettres",
    subtitle: "Amuse-toi avec les lettres et améliore ton vocabulaire.",
    icon: <Icon.TypeBold size={46} color="#F1C40F" />,
    component: <MemoryGame />,
    bgc: "#d0fc8495",
  },
];

export function SpecificLearn() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };

  const renderSidebar = () => (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        marginBottom: isMobile ? "20px" : "0px",
        position: isMobile ? "static" : "fixed",
        top: isMobile ? "auto" : "50%",
        left: isMobile ? "auto" : "0",
        transform: isMobile ? "none" : "translateY(-50%)",
        marginLeft: isMobile ? 0 : "10px",
      }}
    >
      {themes.map((t, i) => (
        <div
          key={i}
          onClick={() => handleThemeSelect(t)}
          style={{
            width: "55px",
            height: "55px",
            borderRadius: "12px",
            backgroundColor: t.bgc,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          {t.icon}
        </div>
      ))}
    </div>
  );

  return (
    <Container>
      {!selectedTheme ? (
        <div
          className={s.themeContainer}
          style={{
            width: isMobile ? "90%" : "70%",
            padding: "20px",
          }}
        >
          <h2 style={{ marginBottom: "30px" }}> Choisis un thème</h2>
          <Row className="justify-content-center">
            {themes.map((t, i) => (
              <Col key={i} xs={6} sm={6} md={6} lg={6} className="mb-3">
                <Card
                  style={{
                    backgroundColor: t.bgc,
                    cursor: "pointer",
                    border: "none",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                    minHeight: isMobile ? "150px" : "220px",
                  }}
                  onClick={() => handleThemeSelect(t)}
                >
                  <Card.Body>
                    <div style={{ fontSize: "26px", margin: "10px auto" }}>
                      {t.icon}
                    </div>
                    <h4 className="mt-4">{t.title}</h4>

                    <p style={{ fontSize: "14px", marginTop: "4px" }}>
                      {t.subtitle}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <div
          style={{
            alignItems: "center",
            margin: "0px auto",
            textAlign: "center",
          }}
        >
          {renderSidebar()}
          <div
            style={{
              minWidth: isMobile ? "100%" : "70%",
              maxWidth: isMobile ? "100%" : "100%",
              margin: isMobile ? "20px auto" : "0px auto",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {React.cloneElement(selectedTheme.component, { isMobile })}
          </div>
        </div>
      )}
    </Container>
  );
}
