import s from "./style.module.css";
import { Logo } from "../Logo/Logo";
import { Col, Container, Row } from "react-bootstrap";

export function Header(test) {
  return (
    <Container className={` text-center ${s.header}`}>
      <Row>
        <Col xs={4} md={4} lg={4}></Col>
        <Col xs={4} md={4} lg={4}>
          <Logo />
        </Col>
        <Col xs={4} md={4} lg={4}></Col>
      </Row>
    </Container>
  );
}
