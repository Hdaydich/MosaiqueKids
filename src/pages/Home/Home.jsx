import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { ItemList } from "../../components/ItemList/ItemList";
import s from "./style.module.css";
import kids from "../../assets/kids.png";
import { useRef } from "react";

export function Home() {
  // Référence vers la section ItemList
  const itemListRef = useRef(null);

  // Scroll fluide vers ItemList
  const scrollToItemList = () => {
    itemListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container className={s.mainContainer}>
      {/* 🎨 HERO */}
      <Row className={`${s.hero} align-items-center`}>
        <Col xs={12} lg={6} className="text-center text-lg-start">
          <h1>🌈 Apprendre devient un jeu d’enfant </h1>
          <p className={s.heroText}>
            Des activités ludiques, colorées et stimulantes pour éveiller chaque
            enfant à son rythme.
          </p>
          <Button className={s.ctaBtn} onClick={scrollToItemList}>
            Découvrir maintenant
          </Button>
        </Col>
        <Col xs={12} lg={6} className="text-center mt-4 mt-lg-0">
          <img src={kids} alt="Enfants apprenant" className={s.kidsImg} />
        </Col>
      </Row>

      {/* 🌟 ACTIVITÉS */}
      <section ref={itemListRef} className={s.activitiesSection}>
        <h1>Nos activités Mosaïque </h1>
        <p className={s.sectionText}>
          Explore les univers qui développent la curiosité, la mémoire et la
          joie d’apprendre.
        </p>
        <ItemList />
      </section>

      {/* 💚 VALEURS */}
      <section className={s.valuesSection}>
        <Row className="justify-content-center text-center g-4">
          {[
            {
              icon: "🎨",
              title: "Créativité",
              text: "Des activités pleines de couleurs et d’imagination.",
            },
            {
              icon: "🧠",
              title: "Apprentissage doux",
              text: "Des contenus conçus avec des experts TDAH.",
            },
            {
              icon: "💚",
              title: "Bienveillance",
              text: "Encourager plutôt que juger, à chaque étape.",
            },
          ].map((val, i) => (
            <Col key={i} xs={12} md={4}>
              <Card className={s.valueCard}>
                <div className={s.cardIcon}>{val.icon}</div>
                <Card.Body>
                  <Card.Title className={s.valueTitle}>{val.title}</Card.Title>
                  <Card.Text className={s.valueText}>{val.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 🚀 CALL TO ACTION */}
      <section className={s.ctaSection}>
        <h3>Prêt à rejoindre l’aventure Mosaïque ? 🌟</h3>
        <Button className={s.ctaBtnLarge}>Commencer maintenant</Button>
      </section>
    </Container>
  );
}
