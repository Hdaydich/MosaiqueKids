import { useState } from "react";
import s from "./style.module.css";

export function StoriesList({ stories, title, onSelect }) {
  const [showAll, setShowAll] = useState(false);

  // On limite à 3 contes si showAll = false
  const visibleStories = showAll ? stories : stories.slice(0, 4);

  return (
    <div className={s.sidebar}>
      <h5 className={s.sidebarTitle}>{title}</h5>

      {visibleStories.map((story, idx) => (
        <div
          key={idx}
          className={s.sidebarStory}
          onClick={() => onSelect(story)}
        >
          {story.icon} {story.title}
        </div>
      ))}

      {stories.length > 3 && (
        <div className={s.showMoreLink} onClick={() => setShowAll(!showAll)}>
          {showAll ? "▲ " : "▼ "}
        </div>
      )}
    </div>
  );
}
