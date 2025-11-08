import { Container, Nav, Navbar } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import s from "./style.module.css";
import { Logo } from "../Logo/Logo";

export function NavBar() {
  return (
    <Navbar expand="lg">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/">
          <Logo
            subtitle="Chaque enfant, une pièce unique"
            width={120}
            police={9}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className={s.toggler} />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex flex-column flex-lg-row align-items-center gap-3 gap-lg-4">
            <Nav.Link href="#home" className={s.navLink}>
              Accueil
            </Nav.Link>
            <Nav.Link href="#about" className={s.navLink}>
              Activités
            </Nav.Link>
            <Nav.Link href="#services" className={s.navLink}>
              Qui sommes-nous ?
            </Nav.Link>
            <Nav.Link href="/signup" className={s.icon}>
              <PersonCircle size={22} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
