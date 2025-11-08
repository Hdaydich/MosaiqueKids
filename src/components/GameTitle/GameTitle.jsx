import s from "./style.module.css";

export function GameTitle({ name = "" }) {
  return (
    <>
      <h2 className={s.title}> {name}</h2>
    </>
  );
}
