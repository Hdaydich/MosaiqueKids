import s from "./style.module.css";

export function ReadingOutput({ segments }) {
  if (!segments || segments.length === 0) {
    return <p className={s.emptyText}>⏳ Aucun texte à afficher...</p>;
  }

  return (
    <div className={s.scrollContainer} dir="rtl" lang="ar">
      <div className={s.textBlock}>
        {segments.map((seg, i) => (
          <span key={i} className={s.segment}>
            {seg}
          </span>
        ))}
      </div>
    </div>
  );
}
