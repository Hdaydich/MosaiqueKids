export function Shapes({
  shape = "circle",
  size = 48,
  rotation = 0,
  stroke = 1,
  color = "white",
}) {
  const half = size / 2;
  const pointsTriangle = `${half},6 ${size - 6},${size - 6} 6,${size - 6}`;
  const pointsDiamond = `${half},6 ${size - 6},${half} ${half},${
    size - 6
  } 6,${half}`;
  const pointsHexagon = (() => {
    const r = half - 6;
    const cx = half;
    const cy = half;
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(" ");
  })();

  const pointsStar = (() => {
    const cx = half;
    const cy = half;
    const outer = half - 6;
    const inner = outer * 0.5;
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(" ");
  })();

  const common = {
    stroke: "#000000a5",
    strokeWidth: stroke,
    fill: color,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {shape === "circle" && (
        <circle cx={half} cy={half} r={half - 6} {...common} />
      )}
      {shape === "square" && (
        <rect
          x={6}
          y={6}
          width={size - 12}
          height={size - 12}
          rx={0}
          {...common}
        />
      )}
      {shape === "triangle" && <polygon points={pointsTriangle} {...common} />}
      {shape === "star" && <polygon points={pointsStar} {...common} />}
      {shape === "hexagon" && <polygon points={pointsHexagon} {...common} />}
      {shape === "diamond" && <polygon points={pointsDiamond} {...common} />}
    </svg>
  );
}
