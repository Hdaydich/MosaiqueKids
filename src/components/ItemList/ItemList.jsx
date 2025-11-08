import { Col, Container, Row } from "react-bootstrap";
import { Item } from "../../components/Item/Item";
import s from "./style.module.css";
import livre from "../../assets/livre.png";
import caring from "../../assets/caring.png";
import jeux from "../../assets/jeux.png";
import dys from "../../assets/dys.png";

export function ItemList() {
  return (
    <Container className={s.mainContainer}>
      <Row>
        <Col xs={12} sm={6} md={6} lg={3}>
          <Item
            title="Lecture en couleur"
            subtitle="Lis joyeusement"
            content="القراءة ممتعة وسهلة بالألوان"
            bgc="#b1ffa1ff"
            img={dys}
            direction="/reading"
          />
        </Col>

        <Col xs={12} sm={6} md={6} lg={3}>
          <Item
            title="Apprentissage"
            subtitle="Lettres et chiffres amusants"
            content="ألوان + حروف + أرقام = مرح"
            bgc="#ffd575ff"
            img={livre}
            direction="/SpecificLearn"
          />
        </Col>

        <Col xs={12} sm={6} md={6} lg={3}>
          <Item
            title="Logique"
            subtitle="Défis et jeux"
            content="ألغاز + تفكير = ذكاء"
            bgc="#f1ffa3ff"
            img={jeux}
            direction="/Logic"
          />
        </Col>

        <Col xs={12} sm={6} md={6} lg={3}>
          <Item
            title="Parent/Enfant"
            subtitle="Apprends et joue ensemble"
            content="تعلم ومرح مع العائلة"
            bgc="#ff8989ff"
            img={caring}
            direction="/Parent"
          />
        </Col>
      </Row>
    </Container>
  );
}
