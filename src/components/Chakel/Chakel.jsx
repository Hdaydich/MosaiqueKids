import { Card, CardImg, CardTitle } from "react-bootstrap";
import s from "./style.module.css";
export function Chakel({ name, color, img }) {
  return (
    <Card className={`${s.CardContainer} border-0`}>
      <CardImg variant="bottom" src={img} fluid />
      <CardTitle
        style={{
          color: color,
          textAlign: "center",
          fontSize: "24px",
          margin: "0px",
          paddingTop: "10px",
        }}
      >
        {name}
      </CardTitle>
    </Card>
  );
}
