import s from "./style.module.css";

export function Button({
  name = "",
  icon: IconComponent,
  variant,
  size = 24,
  fontsize = 12,
  action,
}) {
  // Fonction wrapper pour s'assurer que l'action est bien appelée
  const handleClick = (e) => {
    e.preventDefault(); // empêche certains comportements par défaut
    if (typeof action === "function") {
      action();
    }
  };

  return (
    <button
      type="button"
      className={`${s.button} ${s[variant]}`}
      onClick={handleClick}
    >
      {IconComponent && <IconComponent size={size} className={s.buttonIcon} />}
      {name !== "" && (
        <span style={{ paddingRight: "5px", fontsize: { fontsize } }}>
          {name}
        </span>
      )}
    </button>
  );
}
