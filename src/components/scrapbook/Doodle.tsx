/**
 * Hand-drawn doodles: decoration + theme marks. Pencil strokes, 48×48.
 */
const S = { fill: "none", stroke: "currentColor", strokeWidth: 2.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const DOODLES: Record<string, React.ReactNode> = {
  sun: (
    <g {...S}>
      <circle cx={24} cy={24} r={8} />
      <path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M15 33l-4 4" />
    </g>
  ),
  cloud: <path {...S} d="M12 32c-5 0-7-6-3-9 0-6 7-8 10-5 2-6 12-6 13 1 6-1 8 7 3 10-1 2-3 3-6 3Z" />,
  arrow: <path {...S} d="M6 30c8-10 20-14 32-10M32 14l7 6-8 5" />,
  star: <path {...S} d="M24 6l5 11 12 1-9 8 3 12-11-7-11 7 3-12-9-8 12-1Z" />,
  swirl: <path {...S} d="M24 24c2-2 0-5-3-4-4 1-4 7 0 9 6 2 11-3 10-9-2-8-13-10-18-4-5 7-2 17 6 20" />,
  leaf: <path {...S} d="M10 38C10 20 22 10 40 10c0 18-12 28-30 28ZM10 38 30 18" />,
  paw: (
    <g {...S}>
      <ellipse cx={24} cy={30} rx={8} ry={7} />
      <circle cx={13} cy={19} r={3.5} />
      <circle cx={21} cy={12} r={3.5} />
      <circle cx={30} cy={12} r={3.5} />
      <circle cx={37} cy={19} r={3.5} />
    </g>
  ),
  heart: <path {...S} d="M24 40C10 30 6 22 9 15c3-6 12-6 15 1 3-7 12-7 15-1 3 7-1 15-15 25Z" />,
  spark: <path {...S} d="M24 6v10M24 32v10M6 24h10M32 24h10" />,
  // theme marks
  explore: (
    <g {...S}>
      <circle cx={20} cy={20} r={11} />
      <path d="M28 28l12 12" strokeWidth={4} />
    </g>
  ),
  think: (
    <g {...S}>
      <path d="M17 30c-5-3-7-8-6-13 1-7 7-11 13-11s12 4 13 11c1 5-1 10-6 13v5H17Z" />
      <path d="M18 40h12M21 22l3 3 3-3" />
    </g>
  ),
  numbers: (
    <g {...S}>
      <path d="M8 16l4-3v22" />
      <path d="M18 17c1-4 9-5 9 1 0 5-9 9-9 17h10" />
      <path d="M32 14h8l-5 8c4 0 6 2 6 6 0 5-6 8-10 5" />
    </g>
  ),
  stories: (
    <g {...S}>
      <path d="M24 12c-6-4-12-4-18-2v26c6-2 12-2 18 2 6-4 12-4 18-2V10c-6-2-12-2-18 2Z" />
      <path d="M24 12v26" />
    </g>
  ),
  make: (
    <g {...S}>
      <path d="M8 38 24 8l16 30Z" />
      <path d="M24 8v30M16 24h16" />
    </g>
  ),
  draw: (
    <g {...S}>
      <path d="M10 38l4-12L34 6l8 8-20 20Z" />
      <path d="M14 26l8 8M30 10l8 8" />
    </g>
  ),
  move: (
    <g {...S}>
      <ellipse cx={15} cy={30} rx={5} ry={8} />
      <ellipse cx={33} cy={16} rx={5} ry={8} />
      <path d="M12 42h6M30 28h6" />
    </g>
  ),
  helpers: (
    <g {...S}>
      <path d="M14 8c-4 4-4 12 0 14v18M14 8v8M10 8v8M18 8v8" />
      <path d="M34 8c-5 0-6 8-6 12s2 6 6 6v14" />
    </g>
  ),
  house: (
    <g {...S}>
      <path d="M8 22 24 8l16 14" />
      <path d="M12 20v20h24V20" />
      <path d="M20 40V28h8v12" />
    </g>
  ),
};

export function Doodle({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {DOODLES[name] ?? DOODLES.star}
    </svg>
  );
}
