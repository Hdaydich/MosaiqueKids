import s from "./style.module.css";
import { Card, CardFooter, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function Item({ title, subtitle, content, bgc, bgcff, img, direction }) {
  const navigate = useNavigate();
  const handleRedirect = (direction) => {
    navigate(direction); //
  };
  return (
    <Card
      className={`${s.itemContainer} shadow-lg border-0`}
      onClick={() => handleRedirect(direction)}
    >
      <Card.Header style={{ backgroundColor: bgc, border: "none" }}>
        <Card.Title
          className={s.title}
          style={{
            paddingTop: "20px",
            textTransform: "uppercase",
            fontSize: "18px",
            height: "50px",
            color: "#303030ff",
          }}
        >
          {title}
        </Card.Title>
      </Card.Header>
      <Card.Body
        style={{
          paddingBottom: "20px",
        }}
      >
        <Card.Img
          variant="top"
          src={img}
          fluid
          style={{ width: "70%", margin: "0px auto", height: "150px" }}
        />

        <Card.Subtitle
          style={{
            paddingTop: "15px",
            paddingBottom: "5px",
          }}
        >
          <i>{subtitle}</i>
        </Card.Subtitle>
        <Card.Text>{content}</Card.Text>
      </Card.Body>
    </Card>
  );
}
