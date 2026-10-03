/** A tiny pencil sketch of Milo's cut-away house; rooms "light up" as they open. */
const CELLS: Record<string, [number, number, number, number]> = {
  "living-room": [82, 74, 50, 32],
  kitchen: [38, 74, 42, 32],
  washroom: [38, 40, 46, 30],
  garden: [2, 80, 30, 26],
};

export function HouseSketch({ openRooms, className }: { openRooms: string[]; className?: string }) {
  return (
    <svg viewBox="0 0 140 112" className={className} aria-hidden>
      <rect x={0} y={0} width={140} height={112} fill="#dbe8ec" />
      <path d="M0 104 H140 V112 H0 Z" fill="#a9b89a" />
      {/* roof + walls */}
      <path d="M30 38 L84 8 L138 38 Z" fill="#c9634f" stroke="#2b2a40" strokeWidth={1.6} strokeLinejoin="round" />
      <rect x={34} y={36} width={102} height={70} fill="#e7d3b3" stroke="#2b2a40" strokeWidth={1.6} />
      <path d="M34 71 H136" stroke="#2b2a40" strokeWidth={1.6} />
      <rect x={112} y={12} width={8} height={14} fill="#b46b56" />
      {/* tree */}
      <path d="M14 104 V84" stroke="#8d6a43" strokeWidth={3} />
      <circle cx={14} cy={78} r={10} fill="#8fa37f" />
      {/* room cells */}
      {Object.entries(CELLS).map(([id, [x, y, w, h]]) =>
        id === "garden" ? null : (
          <rect
            key={id}
            x={x}
            y={y}
            width={w}
            height={h}
            fill={openRooms.includes(id) ? (id === "living-room" ? "#d6ddc8" : id === "kitchen" ? "#e4ead8" : "#d3e3ea") : "#9aa0ad"}
            stroke="#2b2a40"
            strokeWidth={1.2}
          />
        ),
      )}
      <rect x={86} y={40} width={46} height={30} fill="#9aa0ad" stroke="#2b2a40" strokeWidth={1.2} />
      {/* tiny sofa in the living room */}
      {openRooms.includes("living-room") && <rect x={100} y={94} width={22} height={8} rx={3} fill="#df917a" />}
      {/* a tiny round Milo by the door */}
      <ellipse cx={26} cy={100} rx={6} ry={6.5} fill="#4b4a8e" />
      <circle cx={28} cy={97} r={2} fill="#f6f1df" />
    </svg>
  );
}
