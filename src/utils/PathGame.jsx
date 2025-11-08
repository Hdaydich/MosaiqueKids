import { useState, useEffect } from "react";

// Paramètres du jeu
const ROWS = 7;
const COLS = 7;
const icons = ["🔴", "🔵", "🟢"]; // suite répétitive
const distractors = ["⭐", "💜", "🟡"]; // distracteurs
const startIcon = "🚀";
const endIcon = "🏁";

// Générer un chemin aléatoire continu de [0,0] à [6,6]
const generateRandomPath = () => {
  const path = [];
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  let current = { row: 0, col: 0 };
  path.push(current);
  visited[current.row][current.col] = true;

  while (!(current.row === ROWS - 1 && current.col === COLS - 1)) {
    const moves = [];
    if (current.row < ROWS - 1 && !visited[current.row + 1][current.col])
      moves.push({ row: current.row + 1, col: current.col });
    if (current.col < COLS - 1 && !visited[current.row][current.col + 1])
      moves.push({ row: current.row, col: current.col + 1 });

    if (moves.length === 0) break;

    const next = moves[Math.floor(Math.random() * moves.length)];
    path.push(next);
    visited[next.row][next.col] = true;
    current = next;
  }

  return path;
};

// Générer matrice avec chemin et suite répétitive
const generateMatrix = (path) => {
  const matrix = Array.from({ length: ROWS }, () =>
    Array.from(
      { length: COLS },
      () => distractors[Math.floor(Math.random() * distractors.length)]
    )
  );

  // Suite répétitive : minimum 2 icônes
  const sequence = [];
  const seqLength = Math.floor(Math.random() * (icons.length - 1)) + 2; // entre 2 et 3
  for (let i = 0; i < seqLength; i++) {
    sequence.push(icons[Math.floor(Math.random() * icons.length)]);
  }

  // Placer suite sur le chemin (hors start & end)
  for (let i = 1; i < path.length - 1; i++) {
    const pos = path[i];
    matrix[pos.row][pos.col] = sequence[(i - 1) % sequence.length];
  }

  // Placer icônes départ et arrivée
  matrix[0][0] = startIcon;
  matrix[ROWS - 1][COLS - 1] = endIcon;

  return { matrix, sequence };
};

export function PathGame() {
  const [matrix, setMatrix] = useState([]);
  const [path, setPath] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [selection, setSelection] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");
  const [playerCorrect, setPlayerCorrect] = useState(false);

  const startGame = () => {
    const p = generateRandomPath();
    setPath(p);
    const { matrix: m, sequence: seq } = generateMatrix(p);
    setMatrix(m);
    setSequence(seq);
    setSelection([]);
    setShowResult(false);
    setMessage("");
    setPlayerCorrect(false);
  };

  useEffect(() => startGame(), []);

  const handleClick = (r, c) => {
    if (showResult) return;
    const exists = selection.find((s) => s.row === r && s.col === c);
    if (exists)
      setSelection(selection.filter((s) => s.row !== r || s.col !== c));
    else setSelection([...selection, { row: r, col: c }]);
  };

  const confirm = () => {
    setShowResult(true);

    // Vérifier départ et arrivée
    if (
      selection.length === 0 ||
      matrix[selection[0].row][selection[0].col] !== startIcon ||
      matrix[selection[selection.length - 1].row][
        selection[selection.length - 1].col
      ] !== endIcon
    ) {
      setPlayerCorrect(false);
      setMessage(
        "❌ Chemin incorrect ! Il faut commencer par 🚀 et finir par 🏁 !"
      );
      return;
    }

    // Extraire icônes sélectionnées (hors départ/arrivée)
    const selectedIcons = selection
      .map((s) => matrix[s.row][s.col])
      .filter((icon) => icon !== startIcon && icon !== endIcon);

    // Vérifier longueur du chemin
    if (selectedIcons.length !== path.length - 2) {
      setPlayerCorrect(false);
      setMessage("❌ Chemin incomplet !");
      return;
    }

    // Vérifier la suite répétitive
    let correct = true;
    let seqIndex = 0;
    for (let icon of selectedIcons) {
      if (icon !== sequence[seqIndex % sequence.length]) {
        correct = false;
        break;
      }
      seqIndex++;
    }

    setPlayerCorrect(correct);
    setMessage(
      correct ? "🎉 Bravo ! Chemin correct !" : "❌ Chemin incorrect !"
    );
  };

  const isPathCell = (r, c) => path.some((p) => p.row === r && p.col === c);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Jeu : Trouve le chemin 🚀 → 🏁</h2>
      <div style={{ margin: 10 }}>
        <button onClick={startGame}>🔄 Recommencer</button>
        <button onClick={confirm} style={{ marginLeft: 10 }}>
          ✅ Confirmer
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <strong>Suite à suivre :</strong>
        {sequence.map((icon, idx) => (
          <div key={idx} style={{ fontSize: 24 }}>
            {icon}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 50px)`,
          gap: 5,
          justifyContent: "center",
        }}
      >
        {matrix.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const selected = selection.find(
              (s) => s.row === rIdx && s.col === cIdx
            );
            const showCorrect =
              showResult && !playerCorrect && isPathCell(rIdx, cIdx);
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => handleClick(rIdx, cIdx)}
                style={{
                  width: 50,
                  height: 50,
                  fontSize: 24,
                  border:
                    cell === startIcon
                      ? "3px solid red"
                      : showCorrect
                      ? "3px solid green"
                      : selected
                      ? "3px solid orange"
                      : "1px solid #555",
                  backgroundColor: cell === startIcon ? "#ffcccc" : "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: showResult ? "default" : "pointer",
                }}
              >
                {cell}
              </div>
            );
          })
        )}
      </div>

      <h3 style={{ marginTop: 20 }}>{message}</h3>
    </div>
  );
}
