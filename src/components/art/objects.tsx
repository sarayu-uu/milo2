/**
 * Object illustrations — custom paper-cut SVG, 100×100 viewBox each.
 * Children-facing artwork is always custom (never icon fonts).
 *
 * Add new objects here; reference them anywhere by key (ArtKey).
 * Parameterised keys: "sock:<colour>:<pattern>".
 */
import type { ReactNode } from "react";

export const P = {
  ink: "#3a3833",
  cream: "#fbf8f1",
  paper: "#efe4cc",
  sage: "#a9b89a",
  moss: "#7e8f63",
  olive: "#6c6d3d",
  blue: "#8fa7ba",
  grey: "#a7a198",
  brick: "#b46b56",
  mustard: "#d8b45e",
  coral: "#df917a",
  pink: "#d8a5aa",
  lavender: "#b4a8cd",
  sky: "#9fc2d6",
  peach: "#edba92",
  leaf: "#92b97e",
  wood: "#b98e5f",
  woodDark: "#8d6a43",
};

const line = { stroke: "#b49a7c", strokeWidth: 1.1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none", opacity: 0.75 };

type Draw = () => ReactNode;

const SKIN_A = P.peach;
const SKIN_B = "#e3ab84";
const SKIN_EDGE = "#c9946c";

/** One finger (or forearm): a thick rounded stroke with a soft edge. */
function Finger({ d, w = 7, color }: { d: string; w?: number; color: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={SKIN_EDGE} strokeWidth={w + 2} />
      <path d={d} stroke={color} strokeWidth={w} />
    </g>
  );
}

function torch(on: boolean): ReactNode {
  return (
    <g>
      {on && <path d="M80 70 L150 30 L150 118 L80 88 Z" fill="#fff3c4" opacity={0.7} />}
      <ellipse cx={46} cy={97} rx={38} ry={4} fill="rgba(90, 60, 30, 0.18)" />
      <rect x={12} y={70} width={52} height={20} rx={6} fill={P.coral} />
      <rect x={18} y={70} width={4} height={20} fill={P.brick} opacity={0.5} />
      <rect x={26} y={70} width={4} height={20} fill={P.brick} opacity={0.5} />
      <rect x={38} y={65} width={12} height={6} rx={2} fill={on ? P.ink : P.grey} />
      <path d="M60 67 L80 60 V100 L60 93 Z" fill={P.mustard} />
      <ellipse cx={80} cy={80} rx={4.5} ry={20} fill={on ? "#fffbe6" : "#cfc8b6"} />
      <path d="M12 76 Q12 70 18 70 H64 V90 H18 Q12 90 12 84 Z M60 67 L80 60 V100 L60 93 Z" {...line} />
    </g>
  );
}

const SOCK_COLORS: Record<string, string> = { coral: P.coral, blue: P.blue, mustard: P.mustard, sage: P.sage, lavender: P.lavender, pink: P.pink };

function sock(color: string, pattern: string): ReactNode {
  const fill = SOCK_COLORS[color] ?? color;
  return (
    <g>
      <path d="M38 10 H64 V56 C64 66 70 70 78 74 C90 80 88 96 74 94 L44 90 C32 88 30 78 34 68 C36 62 38 56 38 50 Z" fill={fill} />
      <rect x={36} y={8} width={30} height={10} rx={3} fill={P.cream} />
      {pattern === "stripes" && (
        <g stroke={P.cream} strokeWidth={5} opacity={0.9}>
          <path d="M38 30 H64" />
          <path d="M38 44 H64" />
        </g>
      )}
      {pattern === "dots" && (
        <g fill={P.cream}>
          <circle cx={46} cy={32} r={3.5} />
          <circle cx={57} cy={42} r={3.5} />
          <circle cx={46} cy={54} r={3.5} />
          <circle cx={70} cy={82} r={3.5} />
        </g>
      )}
      {pattern === "heel" && <path d="M34 72 C36 86 48 90 58 90 L44 90 C34 88 30 80 34 72 Z" fill={P.ink} opacity={0.25} />}
      <path d="M38 18 V50 C38 56 36 62 34 68 C30 78 32 88 44 90 L74 94 C88 96 90 80 78 74" {...line} />
    </g>
  );
}

export const OBJECTS: Record<string, Draw> = {
  /* ---------- round things ---------- */
  ball: () => (
    <g>
      <circle cx={50} cy={52} r={34} fill={P.coral} />
      <path d="M18 46 C36 58 64 58 82 44" stroke={P.cream} strokeWidth={7} fill="none" />
      <path d="M50 18 C40 36 40 68 50 86" stroke={P.mustard} strokeWidth={6} fill="none" />
      <circle cx={50} cy={52} r={34} {...line} />
    </g>
  ),
  orange: () => (
    <g>
      <circle cx={50} cy={54} r={32} fill="#e7a35f" />
      <g fill="#c98543" opacity={0.6}>
        <circle cx={38} cy={50} r={1.6} />
        <circle cx={58} cy={64} r={1.6} />
        <circle cx={46} cy={70} r={1.6} />
        <circle cx={64} cy={44} r={1.6} />
      </g>
      <path d="M50 22 C48 16 52 12 54 12" stroke={P.woodDark} strokeWidth={3} fill="none" />
      <path d="M54 20 C64 10 76 14 76 18 C70 24 60 24 54 20 Z" fill={P.leaf} />
      <circle cx={50} cy={54} r={32} {...line} />
    </g>
  ),
  plate: () => (
    <g>
      <ellipse cx={50} cy={54} rx={40} ry={36} fill={P.cream} />
      <ellipse cx={50} cy={54} rx={26} ry={23} fill="#f3ecdc" stroke={P.sky} strokeWidth={3} />
      <ellipse cx={50} cy={54} rx={40} ry={36} {...line} />
    </g>
  ),
  clock: () => (
    <g>
      <circle cx={50} cy={52} r={36} fill={P.mustard} />
      <circle cx={50} cy={52} r={28} fill={P.cream} />
      <path d="M50 52 V32 M50 52 L64 58" stroke={P.ink} strokeWidth={4} strokeLinecap="round" />
      <g fill={P.ink}>
        <circle cx={50} cy={28} r={2} />
        <circle cx={74} cy={52} r={2} />
        <circle cx={50} cy={76} r={2} />
        <circle cx={26} cy={52} r={2} />
      </g>
      <circle cx={50} cy={52} r={36} {...line} />
    </g>
  ),
  coin: () => (
    <g>
      <circle cx={50} cy={52} r={26} fill={P.mustard} />
      <circle cx={50} cy={52} r={19} fill="none" stroke="#b8963f" strokeWidth={3} />
      <text x={50} y={60} textAnchor="middle" fontSize={22} fontFamily="var(--font-hand)" fill="#8d6a2f">
        ₹
      </text>
      <circle cx={50} cy={52} r={26} {...line} />
    </g>
  ),
  wheel: () => (
    <g>
      <circle cx={50} cy={52} r={36} fill={P.ink} opacity={0.85} />
      <circle cx={50} cy={52} r={24} fill={P.grey} />
      <g stroke={P.cream} strokeWidth={3}>
        <path d="M50 30 V74 M28 52 H72 M35 37 L65 67 M65 37 L35 67" />
      </g>
      <circle cx={50} cy={52} r={6} fill={P.brick} />
    </g>
  ),
  moon: () => (
    <g>
      <path d="M60 14 C36 18 22 40 26 62 C30 82 52 92 72 86 C52 80 42 62 44 46 C46 30 54 20 60 14 Z" fill={P.mustard} />
      <circle cx={44} cy={58} r={3} fill="#c29a45" />
      <circle cx={38} cy={40} r={2} fill="#c29a45" />
      <path d="M60 14 C36 18 22 40 26 62 C30 82 52 92 72 86" {...line} />
    </g>
  ),
  sun: () => (
    <g>
      <g stroke={P.mustard} strokeWidth={5} strokeLinecap="round">
        <path d="M50 8 V20 M50 82 V94 M8 50 H20 M80 50 H92 M20 20 L28 28 M72 72 L80 80 M80 20 L72 28 M28 72 L20 80" />
      </g>
      <circle cx={50} cy={50} r={24} fill={P.mustard} />
      <path d="M40 54 Q50 62 60 54" {...line} />
    </g>
  ),
  mango: () => (
    <g>
      <path d="M30 40 C30 20 56 14 70 28 C86 44 84 74 64 86 C44 96 26 80 26 62 C26 54 30 48 30 40 Z" fill="#e8b24f" />
      <path d="M62 30 C70 34 76 46 76 56" stroke="#f2cf7c" strokeWidth={6} strokeLinecap="round" fill="none" />
      <path d="M48 20 C46 12 50 8 54 8" stroke={P.woodDark} strokeWidth={3} fill="none" />
      <path d="M54 12 C66 4 80 10 80 14 C72 20 62 20 54 12 Z" fill={P.leaf} />
      <path d="M30 40 C30 20 56 14 70 28 C86 44 84 74 64 86 C44 96 26 80 26 62 C26 54 30 48 30 40 Z" {...line} />
    </g>
  ),
  mug: () => (
    <g>
      <path d="M24 30 H70 V78 C70 86 64 90 56 90 H38 C30 90 24 86 24 78 Z" fill={P.sky} />
      <path d="M70 42 C86 42 86 70 70 70" stroke={P.sky} strokeWidth={8} fill="none" />
      <path d="M24 30 H70 V78 C70 86 64 90 56 90 H38 C30 90 24 86 24 78 Z" {...line} />
      <text x={47} y={68} textAnchor="middle" fontSize={22} fontFamily="var(--font-hand)" fill={P.cream}>
        m
      </text>
    </g>
  ),

  /* ---------- rectangles ---------- */
  book: () => (
    <g>
      <rect x={22} y={16} width={56} height={72} rx={4} fill={P.brick} />
      <rect x={28} y={16} width={4} height={72} fill="#8f4f3e" />
      <rect x={40} y={32} width={30} height={12} rx={2} fill={P.cream} />
      <rect x={22} y={16} width={56} height={72} rx={4} {...line} />
    </g>
  ),
  phone: () => (
    <g>
      <rect x={32} y={12} width={36} height={76} rx={8} fill={P.ink} opacity={0.85} />
      <rect x={36} y={20} width={28} height={56} rx={3} fill={P.sky} />
      <circle cx={50} cy={82} r={2.5} fill={P.cream} />
    </g>
  ),
  door: () => (
    <g>
      <rect x={26} y={8} width={48} height={86} rx={3} fill={P.wood} />
      <rect x={32} y={16} width={36} height={30} rx={2} fill="none" stroke={P.woodDark} strokeWidth={3} />
      <rect x={32} y={54} width={36} height={32} rx={2} fill="none" stroke={P.woodDark} strokeWidth={3} />
      <circle cx={64} cy={52} r={3.5} fill={P.mustard} />
      <rect x={26} y={8} width={48} height={86} rx={3} {...line} />
    </g>
  ),
  box: () => (
    <g>
      <path d="M16 36 L50 24 L84 36 L84 78 L50 90 L16 78 Z" fill="#cfa776" />
      <path d="M16 36 L50 48 L84 36 M50 48 V90" stroke="#a5814f" strokeWidth={3} fill="none" />
      <path d="M33 30 L67 42" stroke={P.mustard} strokeWidth={6} opacity={0.8} />
      <path d="M16 36 L50 24 L84 36 L84 78 L50 90 L16 78 Z" {...line} />
    </g>
  ),

  /* ---------- cylinders ---------- */
  bottle: () => (
    <g>
      <rect x={42} y={8} width={16} height={12} rx={2} fill={P.coral} />
      <path d="M42 20 H58 V30 C68 34 70 40 70 48 V86 C70 90 66 92 62 92 H38 C34 92 30 90 30 86 V48 C30 40 32 34 42 30 Z" fill={P.sky} opacity={0.9} />
      <rect x={32} y={52} width={36} height={18} fill={P.cream} />
      <path d="M42 20 H58 V30 C68 34 70 40 70 48 V86 C70 90 66 92 62 92 H38 C34 92 30 90 30 86 V48 C30 40 32 34 42 30 Z" {...line} />
    </g>
  ),
  cup: () => (
    <g>
      <path d="M26 30 H74 L68 86 C67 90 64 92 60 92 H40 C36 92 33 90 32 86 Z" fill={P.peach} />
      <ellipse cx={50} cy={30} rx={24} ry={6} fill="#c98e6a" />
      <path d="M30 52 H70" stroke={P.cream} strokeWidth={5} opacity={0.8} />
      <path d="M26 30 H74 L68 86 C67 90 64 92 60 92 H40 C36 92 33 90 32 86 Z" {...line} />
    </g>
  ),
  jar: () => (
    <g>
      <rect x={30} y={14} width={40} height={12} rx={3} fill={P.moss} />
      <path d="M28 26 H72 C76 30 78 36 78 44 V82 C78 88 74 92 68 92 H32 C26 92 22 88 22 82 V44 C22 36 24 30 28 26 Z" fill="#e9dfc6" />
      <g fill={P.coral}>
        <circle cx={40} cy={66} r={6} />
        <circle cx={56} cy={74} r={6} />
        <circle cx={60} cy={58} r={6} />
      </g>
      <path d="M28 26 H72 C76 30 78 36 78 44 V82 C78 88 74 92 68 92 H32 C26 92 22 88 22 82 V44 C22 36 24 30 28 26 Z" {...line} />
    </g>
  ),

  /* ---------- long & thin / curved ---------- */
  spoon: () => (
    <g transform="rotate(30 50 50)">
      <ellipse cx={50} cy={22} rx={12} ry={16} fill={P.grey} />
      <rect x={46} y={36} width={8} height={56} rx={4} fill={P.grey} />
      <ellipse cx={50} cy={22} rx={12} ry={16} {...line} />
      <path d="M46 38 V90 M54 38 V90" {...line} opacity={0.4} />
    </g>
  ),
  pencil: () => (
    <g transform="rotate(35 50 50)">
      <rect x={43} y={14} width={14} height={60} fill={P.mustard} />
      <rect x={43} y={8} width={14} height={8} rx={2} fill={P.pink} />
      <path d="M43 74 L50 92 L57 74 Z" fill="#e7d2b0" />
      <path d="M48 87 L50 92 L52 87 Z" fill={P.ink} />
      <rect x={43} y={14} width={14} height={60} {...line} />
    </g>
  ),
  banana: () => (
    <g>
      <path d="M20 30 C18 64 46 88 82 74 C86 72 86 66 80 66 C52 72 32 56 30 30 C30 24 22 24 20 30 Z" fill="#ecd06a" />
      <path d="M20 30 C18 64 46 88 82 74" {...line} />
      <path d="M22 28 L18 20" stroke={P.woodDark} strokeWidth={4} strokeLinecap="round" />
    </g>
  ),

  /* ---------- abstract shapes (mystery bag silhouettes) ---------- */
  "shape-round": () => <circle cx={50} cy={50} r={34} fill={P.ink} />,
  "shape-long": () => <rect x={44} y={6} width={13} height={88} rx={6.5} fill={P.ink} transform="rotate(30 50 50)" />,
  "shape-rect": () => <rect x={24} y={16} width={52} height={68} rx={4} fill={P.ink} />,
  "shape-curved": () => <path d="M20 30 C18 64 46 88 82 74 C86 72 86 66 80 66 C52 72 32 56 30 30 C30 24 22 24 20 30 Z" fill={P.ink} />,
  "shape-circle-outline": () => <circle cx={50} cy={50} r={36} fill="none" stroke={P.ink} strokeWidth={5} strokeDasharray="10 7" />,
  "shape-rect-outline": () => <rect x={22} y={16} width={56} height={68} rx={4} fill="none" stroke={P.ink} strokeWidth={5} strokeDasharray="10 7" />,
  "shape-cylinder-outline": () => (
    <g fill="none" stroke={P.ink} strokeWidth={5} strokeDasharray="10 7">
      <ellipse cx={50} cy={22} rx={24} ry={8} />
      <path d="M26 22 V80 C26 92 74 92 74 80 V22" />
    </g>
  ),

  /* ---------- nature / pattern pieces ---------- */
  leaf: () => (
    <g>
      <path d="M18 80 C18 40 46 16 84 16 C84 54 58 82 18 80 Z" fill={P.leaf} />
      <path d="M18 80 C40 60 56 42 76 24" stroke={P.moss} strokeWidth={3} fill="none" />
      <path d="M18 80 C18 40 46 16 84 16 C84 54 58 82 18 80 Z" {...line} />
    </g>
  ),
  flower: () => (
    <g>
      <g fill={P.pink}>
        <circle cx={50} cy={28} r={15} />
        <circle cx={72} cy={46} r={15} />
        <circle cx={64} cy={72} r={15} />
        <circle cx={36} cy={72} r={15} />
        <circle cx={28} cy={46} r={15} />
      </g>
      <circle cx={50} cy={52} r={12} fill={P.mustard} />
    </g>
  ),
  acorn: () => (
    <g>
      <path d="M28 44 C28 74 40 90 50 92 C60 90 72 74 72 44 Z" fill="#c4935f" />
      <path d="M22 44 C22 28 36 20 50 20 C64 20 78 28 78 44 Z" fill={P.woodDark} />
      <path d="M50 20 C50 14 54 10 58 10" stroke={P.woodDark} strokeWidth={4} strokeLinecap="round" fill="none" />
      <path d="M28 44 C28 74 40 90 50 92 C60 90 72 74 72 44" {...line} />
    </g>
  ),
  pebble: () => <path d="M18 62 C16 42 36 28 56 30 C78 32 88 48 82 64 C76 78 52 82 36 78 C26 76 18 72 18 62 Z" fill={P.grey} />,
  feather: () => (
    <g transform="rotate(-30 50 50)">
      <path d="M50 8 C70 26 70 64 50 92 C30 64 30 26 50 8 Z" fill={P.blue} />
      <path d="M50 14 V96" stroke={P.ink} strokeWidth={2} opacity={0.6} />
      <path d="M50 40 L38 32 M50 54 L36 46 M50 40 L62 32 M50 54 L64 46" stroke={P.cream} strokeWidth={2} />
    </g>
  ),
  button: () => (
    <g>
      <circle cx={50} cy={50} r={26} fill={P.coral} />
      <g fill={P.cream}>
        <circle cx={43} cy={43} r={4} />
        <circle cx={57} cy={43} r={4} />
        <circle cx={43} cy={57} r={4} />
        <circle cx={57} cy={57} r={4} />
      </g>
      <circle cx={50} cy={50} r={26} {...line} />
    </g>
  ),
  "paper-plane": () => (
    <g>
      <path d="M10 56 L90 22 L58 88 L46 62 Z" fill={P.cream} />
      <path d="M46 62 L90 22 L36 58 Z" fill="#e3d9c3" />
      <path d="M10 56 L90 22 L58 88 L46 62 Z M46 62 L90 22" {...line} />
    </g>
  ),
  marble: () => (
    <g>
      <circle cx={50} cy={50} r={20} fill={P.sky} />
      <path d="M36 52 C44 40 56 62 64 48" stroke={P.lavender} strokeWidth={5} fill="none" />
      <circle cx={43} cy={42} r={4} fill="#fff" opacity={0.8} />
    </g>
  ),

  /* ---------- story props ---------- */
  "bulging-bag": () => (
    <g>
      <path d="M22 40 C10 56 12 84 28 92 C46 98 64 98 76 92 C92 84 92 56 80 40 Z" fill={P.sage} />
      {/* things pushing the fabric */}
      <circle cx={38} cy={66} r={13} fill="#97a789" />
      <rect x={58} y={50} width={18} height={30} rx={3} fill="#97a789" />
      <path d="M44 84 C50 72 62 74 70 86" stroke="#97a789" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M22 40 C34 34 68 34 80 40 L72 30 C60 26 42 26 30 30 Z" fill={P.moss} />
      <path d="M44 30 C40 18 60 18 56 30" stroke={P.woodDark} strokeWidth={4} fill="none" />
      <path d="M22 40 C10 56 12 84 28 92 C46 98 64 98 76 92 C92 84 92 56 80 40" {...line} />
    </g>
  ),
  "open-bag": () => (
    <g>
      <path d="M18 50 C10 64 14 88 28 94 C46 100 64 100 76 94 C90 88 94 64 84 50 Z" fill={P.sage} />
      <ellipse cx={51} cy={50} rx={33} ry={9} fill={P.moss} />
      <path d="M18 50 C10 64 14 88 28 94 C46 100 64 100 76 94 C90 88 94 64 84 50" {...line} />
    </g>
  ),
  lamp: () => (
    <g>
      <path d="M30 16 H70 L80 44 H20 Z" fill={P.mustard} />
      <rect x={47} y={44} width={6} height={38} fill={P.woodDark} />
      <ellipse cx={50} cy={86} rx={20} ry={6} fill={P.woodDark} />
      <path d="M30 16 H70 L80 44 H20 Z" {...line} />
    </g>
  ),
  "lamp-glow": () => (
    <g>
      <path d="M20 44 L-10 100 H110 L80 44 Z" fill="#fff3c4" opacity={0.6} />
      <path d="M30 16 H70 L80 44 H20 Z" fill={P.mustard} />
      <rect x={47} y={4} width={6} height={12} fill={P.woodDark} />
      <path d="M30 16 H70 L80 44 H20 Z" {...line} />
    </g>
  ),
  /** A torch lying on the floor, pointing right. "torch-glow" is switched on. */
  torch: () => torch(false),
  "torch-glow": () => torch(true),
  "silly-lamp": () => (
    <g>
      {/* the funny lamp: wobbly neck, crooked hat. Mustard + dark outlines so it reads on coloured cards too */}
      <path d="M50 88 C40 70 64 60 52 44" stroke="#5a4128" strokeWidth={6.5} fill="none" strokeLinecap="round" />
      <path d="M30 26 L66 14 L78 38 L36 48 Z" fill={P.mustard} stroke="#5a4128" strokeWidth={2.4} strokeLinejoin="round" />
      <circle cx={46} cy={34} r={3.2} fill={P.ink} />
      <circle cx={60} cy={30} r={3.2} fill={P.ink} />
      <ellipse cx={50} cy={90} rx={20} ry={6} fill="#5a4128" />
    </g>
  ),
  boat: () => (
    <g>
      <path d="M50 14 L50 58 L22 58 Z" fill={P.cream} />
      <path d="M50 22 L76 58 L50 58 Z" fill="#e8dfcb" />
      <path d="M10 60 H90 L76 82 H24 Z" fill={P.sky} />
      <path d="M10 60 H90 L76 82 H24 Z M50 14 L50 58 L22 58 Z" {...line} />
      <path d="M6 90 C20 84 30 96 44 90 C58 84 68 96 94 88" stroke={P.blue} strokeWidth={3} fill="none" />
    </g>
  ),
  footprints: () => (
    <g fill={P.coral}>
      <ellipse cx={34} cy={70} rx={9} ry={14} />
      <ellipse cx={66} cy={36} rx={9} ry={14} />
      <g>
        <circle cx={28} cy={50} r={3.5} />
        <circle cx={35} cy={49} r={3.5} />
        <circle cx={42} cy={52} r={3.5} />
      </g>
      <g>
        <circle cx={60} cy={16} r={3.5} />
        <circle cx={67} cy={15} r={3.5} />
        <circle cx={74} cy={18} r={3.5} />
      </g>
    </g>
  ),
  star: () => <path d="M50 10 L61 38 L90 40 L67 58 L75 88 L50 71 L25 88 L33 58 L10 40 L39 38 Z" fill={P.mustard} />,
  heart: () => <path d="M50 86 C20 64 12 46 18 32 C24 18 44 18 50 34 C56 18 76 18 82 32 C88 46 80 64 50 86 Z" fill={P.pink} />,
  question: () => (
    <text x={50} y={74} textAnchor="middle" fontSize={72} fontFamily="var(--font-hand)" fill={P.ink} opacity={0.75}>
      ?
    </text>
  ),
  snowflake: () => (
    <g stroke={P.blue} strokeWidth={5} strokeLinecap="round">
      <path d="M50 12 V88 M17 31 L83 69 M83 31 L17 69" />
      <path d="M42 18 L50 26 L58 18 M42 82 L50 74 L58 82" fill="none" />
    </g>
  ),
  "tiptoe": () => (
    <g fill={P.lavender}>
      <ellipse cx={40} cy={74} rx={8} ry={5} />
      <ellipse cx={62} cy={44} rx={8} ry={5} />
      <circle cx={34} cy={66} r={2.5} />
      <circle cx={40} cy={64} r={2.5} />
      <circle cx={46} cy={66} r={2.5} />
      <circle cx={56} cy={36} r={2.5} />
      <circle cx={62} cy={34} r={2.5} />
      <circle cx={68} cy={36} r={2.5} />
    </g>
  ),
  zigzag: () => (
    // dark line on a cream edge, so it shows up on any coloured card
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 70 L28 30 L46 70 L64 30 L82 70" stroke={P.cream} strokeWidth={13} />
      <path d="M10 70 L28 30 L46 70 L64 30 L82 70" stroke={P.brick} strokeWidth={7} />
    </g>
  ),

  /* ---------- age 3 games ---------- */
  seed: () => (
    <g>
      <ellipse cx={50} cy={52} rx={20} ry={30} fill={P.mustard} transform="rotate(18 50 52)" />
      <ellipse cx={44} cy={42} rx={6} ry={11} fill="#ecd28f" transform="rotate(18 44 42)" />
      <ellipse cx={50} cy={52} rx={20} ry={30} {...line} transform="rotate(18 50 52)" />
    </g>
  ),
  biscuit: () => (
    <g>
      <circle cx={50} cy={50} r={34} fill="#d9a35e" />
      <circle cx={50} cy={50} r={27} fill="#e4b56f" />
      <g fill="#8d6a43">
        <circle cx={40} cy={40} r={3} />
        <circle cx={60} cy={44} r={3} />
        <circle cx={46} cy={60} r={3} />
        <circle cx={62} cy={62} r={2.5} />
      </g>
      <circle cx={50} cy={50} r={34} {...line} />
    </g>
  ),
  /** Half a biscuit: a bite-shaped edge. */
  "biscuit-half": () => (
    <g>
      <path d="M50 16 A34 34 0 0 0 50 84 C56 76 46 70 54 62 C60 56 50 50 56 42 C60 34 50 28 56 22 Z" fill="#d9a35e" />
      <path d="M50 23 A27 27 0 0 0 50 77 C52 70 44 66 50 60 C54 54 46 48 51 42 C54 36 46 30 50 23 Z" fill="#e4b56f" />
      <g fill="#8d6a43">
        <circle cx={36} cy={42} r={3} />
        <circle cx={40} cy={62} r={3} />
      </g>
    </g>
  ),
  crumbs: () => (
    <g fill="#f0cf8e" stroke="#7a5532" strokeWidth={2.2}>
      <circle cx={30} cy={44} r={6} />
      <circle cx={52} cy={36} r={4.5} />
      <circle cx={68} cy={52} r={5.5} />
      <circle cx={42} cy={62} r={4} />
      <circle cx={60} cy={70} r={3.5} />
      <rect x={20} y={58} width={7} height={6} rx={1.5} transform="rotate(20 23 61)" />
      <rect x={74} y={34} width={6} height={5} rx={1.5} transform="rotate(-15 77 36)" />
    </g>
  ),
  shoe: () => (
    <g>
      <path d="M12 70 C12 52 22 40 34 40 L44 40 C46 50 56 54 66 56 C80 58 90 62 90 72 L90 78 L12 78 Z" fill={P.coral} />
      <rect x={10} y={76} width={82} height={10} rx={5} fill={P.ink} opacity={0.8} />
      <path d="M44 46 L56 44 M47 52 L60 50" stroke={P.cream} strokeWidth={3} strokeLinecap="round" />
      <path d="M12 70 C12 52 22 40 34 40 L44 40 C46 50 56 54 66 56 C80 58 90 62 90 72 L90 78 L12 78 Z" {...line} />
    </g>
  ),
  bell: () => (
    <g>
      <path d="M50 14 C30 14 26 34 26 52 C26 64 18 70 16 76 L84 76 C82 70 74 64 74 52 C74 34 70 14 50 14 Z" fill={P.mustard} />
      <circle cx={50} cy={84} r={8} fill={P.woodDark} />
      <rect x={45} y={6} width={10} height={10} rx={4} fill={P.woodDark} />
      <path d="M36 30 C34 40 34 50 34 58" stroke="#ecd28f" strokeWidth={5} strokeLinecap="round" fill="none" />
      <path d="M50 14 C30 14 26 34 26 52 C26 64 18 70 16 76 L84 76 C82 70 74 64 74 52 C74 34 70 14 50 14 Z" {...line} />
    </g>
  ),
  tap: () => (
    // a kitchen tap, with a drip
    <g>
      <rect x={14} y={26} width={22} height={14} rx={4} fill={P.grey} />
      <path d="M30 22 H62 C72 22 76 30 76 40 V52 H64 V40 C64 36 62 34 58 34 H30 Z" fill="#c9c3b6" />
      <rect x={40} y={12} width={12} height={12} rx={3} fill={P.blue} />
      <path d="M70 60 C64 70 64 76 70 80 C76 76 76 70 70 60 Z" fill={P.sky} />
      <path d="M30 22 H62 C72 22 76 30 76 40 V52 H64 V40 C64 36 62 34 58 34 H30 Z" {...line} />
    </g>
  ),
  "cloud-rain": () => (
    <g>
      <g fill="#9aa6b2">
        <ellipse cx={50} cy={36} rx={34} ry={14} />
        <circle cx={36} cy={30} r={14} />
        <circle cx={54} cy={24} r={18} />
      </g>
      <g stroke="#5f8fb8" strokeWidth={6} strokeLinecap="round">
        <path d="M30 58 V72 M50 58 V80 M70 58 V72" />
      </g>
    </g>
  ),
  fence: () => (
    <g>
      <path d="M50 70 C49 54 51 44 50 32" stroke={P.moss} strokeWidth={4} fill="none" strokeLinecap="round" />
      <circle cx={50} cy={28} r={9} fill={P.peach} />
      <g fill={P.wood}>
        <rect x={18} y={34} width={10} height={54} rx={3} />
        <rect x={45} y={34} width={10} height={54} rx={3} />
        <rect x={72} y={34} width={10} height={54} rx={3} />
        <rect x={12} y={46} width={76} height={8} rx={3} />
        <rect x={12} y={68} width={76} height={8} rx={3} />
      </g>
    </g>
  ),
  road: () => (
    <g>
      <rect x={6} y={56} width={88} height={20} rx={10} fill="#8f8a90" />
      <path d="M16 66 H30 M42 66 H56 M68 66 H82" stroke={P.cream} strokeWidth={3} strokeLinecap="round" />
      <path d="M68 30 L82 20 L96 30 V50 H68 Z" fill={P.coral} />
      <rect x={78} y={38} width={8} height={12} fill={P.woodDark} />
    </g>
  ),

  /* ---------- Milo Mysteries ---------- */
  cap: () => (
    // a plastic bottle cap
    <g>
      <rect x={24} y={38} width={52} height={30} rx={6} fill={P.sky} />
      <rect x={20} y={32} width={60} height={10} rx={5} fill="#86adc4" />
      <path d="M32 44 V64 M42 44 V64 M52 44 V64 M62 44 V64" stroke="#86adc4" strokeWidth={3} />
      <rect x={24} y={38} width={52} height={30} rx={6} {...line} />
    </g>
  ),
  twig: () => (
    <g fill="none" strokeLinecap="round">
      <path d="M14 78 C34 66 58 50 86 26" stroke={P.woodDark} strokeWidth={7} />
      <path d="M44 58 C46 46 42 38 36 32 M64 42 C72 40 78 42 82 46" stroke={P.woodDark} strokeWidth={4} />
      <path d="M36 32 C30 26 32 20 38 22 C42 24 40 30 36 32 Z" fill={P.leaf} stroke="none" />
    </g>
  ),
  cloth: () => (
    <g>
      <path d="M18 26 C30 20 44 30 56 24 C66 20 76 22 84 28 L82 74 C70 80 58 72 46 78 C34 82 24 78 16 74 Z" fill={P.coral} />
      <path d="M24 38 H78 M22 50 H80 M22 62 H78" stroke="#c9705c" strokeWidth={2} strokeDasharray="5 5" />
      <path d="M18 26 C30 20 44 30 56 24 C66 20 76 22 84 28 L82 74 C70 80 58 72 46 78 C34 82 24 78 16 74 Z" {...line} />
    </g>
  ),
  "plastic-block": () => (
    // a toy building brick
    <g>
      <rect x={18} y={40} width={64} height={36} rx={4} fill={P.blue} />
      <rect x={26} y={30} width={14} height={12} rx={3} fill="#7d97ab" />
      <rect x={60} y={30} width={14} height={12} rx={3} fill="#7d97ab" />
      <rect x={18} y={40} width={64} height={36} rx={4} {...line} />
    </g>
  ),
  "paper-sheet": () => (
    <g>
      <path d="M26 16 H64 L76 28 V84 H26 Z" fill={P.cream} />
      <path d="M64 16 V28 H76" fill="#e8dcc2" />
      <path d="M34 40 H66 M34 50 H66 M34 60 H58" stroke="#cdbb9a" strokeWidth={2.5} strokeLinecap="round" />
      <path d="M26 16 H64 L76 28 V84 H26 Z" {...line} />
    </g>
  ),
  block: () => (
    // a wooden toy block
    <g>
      <path d="M22 34 L50 22 L78 34 L50 46 Z" fill="#d6b48a" />
      <path d="M22 34 V70 L50 82 V46 Z" fill={P.wood} />
      <path d="M78 34 V70 L50 82 V46 Z" fill="#a37b50" />
      <path d="M22 34 L50 22 L78 34 V70 L50 82 L22 70 Z M50 46 V82 M22 34 L50 46 L78 34" {...line} />
    </g>
  ),
  magnet: () => (
    <g>
      <path d="M22 18 H44 V58 C44 66 50 72 56 72 C62 72 68 66 68 58 V18 H90 V58 C90 78 76 90 56 90 C36 90 22 78 22 58 Z" fill={P.coral} />
      <rect x={22} y={18} width={22} height={12} fill="#cfd4d8" />
      <rect x={68} y={18} width={22} height={12} fill="#cfd4d8" />
      <path d="M22 18 H44 V58 C44 66 50 72 56 72 C62 72 68 66 68 58 V18 H90 V58 C90 78 76 90 56 90 C36 90 22 78 22 58 Z" {...line} />
    </g>
  ),
  key: () => (
    <g>
      <circle cx={32} cy={50} r={16} fill={P.mustard} />
      <circle cx={32} cy={50} r={6} fill={P.cream} />
      <path d="M46 46 H86 V54 H80 V62 H72 V54 H66 V60 H58 V54 H46 Z" fill={P.mustard} />
      <circle cx={32} cy={50} r={16} {...line} />
    </g>
  ),
  paperclip: () => (
    <path
      d="M34 70 V30 C34 20 50 20 50 30 V64 C50 70 42 70 42 64 V34 M50 30 V24 C50 12 70 12 70 24 V72 C70 84 34 84 34 72"
      fill="none"
      stroke="#8f9aa3"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  ice: () => (
    <g>
      <ellipse cx={50} cy={82} rx={30} ry={6} fill="#9fc2d6" opacity={0.6} />
      <rect x={24} y={26} width={52} height={52} rx={9} fill="#dff0f7" stroke="#9fc2d6" strokeWidth={3} />
      <path d="M34 36 L46 36 M34 44 L40 44" stroke="#ffffff" strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  "ice-kevin": () => (
    // Kevin. An ice cube with a face. It was a terrible decision.
    <g>
      <ellipse cx={50} cy={82} rx={30} ry={6} fill="#9fc2d6" opacity={0.6} />
      <rect x={24} y={26} width={52} height={52} rx={9} fill="#dff0f7" stroke="#9fc2d6" strokeWidth={3} />
      <circle cx={41} cy={50} r={3.5} fill={P.ink} />
      <circle cx={59} cy={50} r={3.5} fill={P.ink} />
      <path d="M43 62 Q50 58 57 62" stroke={P.ink} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M70 70 C68 76 68 80 72 82 C76 80 76 76 70 70 Z" fill={P.sky} />
    </g>
  ),
  foil: () => (
    <g>
      <path d="M16 30 L30 20 L50 28 L68 18 L86 30 L82 78 L60 84 L40 78 L18 82 Z" fill="#cfd4d8" />
      <path d="M26 40 L40 48 L56 38 L72 50 M24 62 L42 56 L60 66 L78 58" stroke="#ffffff" strokeWidth={2.5} fill="none" />
      <path d="M16 30 L30 20 L50 28 L68 18 L86 30 L82 78 L60 84 L40 78 L18 82 Z" {...line} />
    </g>
  ),
  puddle: () => (
    <g>
      <path d="M8 62 C8 48 26 44 40 46 C52 40 70 40 82 46 C94 50 96 62 86 68 C74 76 52 74 40 72 C24 74 8 72 8 62 Z" fill="#8fb6cc" opacity={0.9} />
      <path d="M26 56 C34 52 44 52 50 54" stroke="#cfe2ea" strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  ),
  // the same bowl with nothing in it yet (for stories where something gets dropped in)
  "water-bowl-plain": () => (
    <g>
      <path d="M14 42 H86 C84 70 70 84 50 84 C30 84 16 70 14 42 Z" fill={P.sky} />
      <ellipse cx={50} cy={42} rx={36} ry={7} fill="#b9d6e4" />
      <path d="M10 40 H90 C88 72 72 88 50 88 C28 88 12 72 10 40 Z" fill="none" stroke="#e7dcc4" strokeWidth={4} />
    </g>
  ),
  "water-bowl": () => (
    <g>
      <path d="M14 42 H86 C84 70 70 84 50 84 C30 84 16 70 14 42 Z" fill={P.sky} />
      <ellipse cx={50} cy={42} rx={36} ry={7} fill="#b9d6e4" />
      <path d="M58 30 C56 36 60 40 64 38 C66 34 62 30 58 30 Z" fill={P.leaf} />
      <path d="M10 40 H90 C88 72 72 88 50 88 C28 88 12 72 10 40 Z" fill="none" stroke="#e7dcc4" strokeWidth={4} />
    </g>
  ),

  /* ---------- hand shadows ---------- */
  "hand-rabbit": () => (
    <g>
      <path d="M30 92 C26 72 28 56 36 50 L36 18 C36 12 44 12 44 18 L46 44 L50 14 C50 8 58 8 58 14 L56 48 C66 50 72 58 70 70 C68 82 60 92 54 96 Z" fill={P.peach} />
      <path d="M42 54 C48 58 56 58 62 54" {...line} />
      <path d="M30 92 C26 72 28 56 36 50 L36 18 C36 12 44 12 44 18 L46 44 L50 14 C50 8 58 8 58 14 L56 48 C66 50 72 58 70 70 C68 82 60 92 54 96" {...line} />
    </g>
  ),
  "shadow-rabbit": () => (
    <g fill={P.ink}>
      <ellipse cx={50} cy={66} rx={26} ry={20} />
      <ellipse cx={40} cy={30} rx={7} ry={22} transform="rotate(-12 40 30)" />
      <ellipse cx={58} cy={28} rx={7} ry={22} transform="rotate(10 58 28)" />
      <circle cx={42} cy={60} r={3} fill={P.cream} />
    </g>
  ),
  /* Bird: wrists crossed (tail), thumbs hooked at the top (head), four fingers each side (wings). */
  "hand-bird": () => (
    <g>
      {/* back hand */}
      <Finger d="M58 64 L38 99" w={16} color={SKIN_B} />
      <ellipse cx={60} cy={58} rx={11} ry={10} fill={SKIN_B} stroke={SKIN_EDGE} strokeWidth={1} />
      <Finger d="M64 54 L92 26" color={SKIN_B} />
      <Finger d="M67 58 L97 39" color={SKIN_B} />
      <Finger d="M68 62 L97 52" color={SKIN_B} />
      <Finger d="M66 66 L92 65" w={6} color={SKIN_B} />
      <Finger d="M56 51 C55 45 53 41 47 38" color={SKIN_B} />
      {/* front hand */}
      <Finger d="M42 64 L62 99" w={16} color={SKIN_A} />
      <ellipse cx={40} cy={58} rx={11} ry={10} fill={SKIN_A} stroke={SKIN_EDGE} strokeWidth={1} />
      <Finger d="M36 54 L8 26" color={SKIN_A} />
      <Finger d="M33 58 L3 39" color={SKIN_A} />
      <Finger d="M32 62 L3 52" color={SKIN_A} />
      <Finger d="M34 66 L8 65" w={6} color={SKIN_A} />
      <Finger d="M44 51 C45 45 47 41 53 38" color={SKIN_A} />
      {/* flap! */}
      <path d="M2 16 Q-4 24 0 30 M98 16 Q104 24 100 30" {...line} strokeWidth={1.6} />
    </g>
  ),
  "shadow-bird": () => (
    <g fill={P.ink}>
      <path d="M50 58 C34 40 16 26 2 28 C10 38 8 44 20 50 C14 54 22 60 40 66 Z" />
      <path d="M50 58 C66 40 84 26 98 28 C90 38 92 44 80 50 C86 54 78 60 60 66 Z" />
      <ellipse cx={50} cy={64} rx={11} ry={9} />
      <circle cx={50} cy={50} r={7} />
      <path d="M48 44 L50 36 L53 44 Z" />
      <path d="M45 70 L50 90 L55 70 Z" />
    </g>
  ),
  /* Dog: thumb up (ear), pointer + middle finger on top (head), ring + little finger below (mouth). */
  "hand-dog": () => (
    <g>
      <Finger d="M0 64 L30 58" w={20} color={SKIN_A} />
      <ellipse cx={38} cy={56} rx={14} ry={14} fill={SKIN_A} stroke={SKIN_EDGE} strokeWidth={1} />
      <Finger d="M36 46 L29 18" w={8} color={SKIN_B} />
      <Finger d="M44 46 L88 41" color={SKIN_A} />
      <Finger d="M44 53 L90 50" color={SKIN_A} />
      <Finger d="M44 62 L82 67" color={SKIN_A} />
      <Finger d="M42 68 L76 77" w={6} color={SKIN_A} />
      {/* wiggle the bottom fingers */}
      <path d="M84 72 Q92 78 86 86 M83 86 L86 86 L86 82" {...line} strokeWidth={1.6} />
    </g>
  ),
  "shadow-dog": () => (
    <g fill={P.ink}>
      <path d="M12 48 C12 34 26 30 40 32 L74 34 C86 36 92 46 84 50 L56 52 L74 60 C80 64 76 72 68 70 L34 68 C20 68 12 60 12 48 Z" />
      <path d="M30 34 L22 8 L42 32 Z" />
      <circle cx={42} cy={42} r={3} fill={P.cream} />
    </g>
  ),
  /** Milo's attempt. It is a potato. */
  "shadow-potato": () => <path d="M14 58 C10 36 32 22 54 26 C80 30 92 48 84 66 C76 82 46 86 28 78 C20 74 16 68 14 58 Z" fill={P.ink} />,

  /* ---------- origami: paper boat ---------- */
  "fold-1": () => (
    <g>
      <rect x={14} y={24} width={72} height={52} fill={P.sky} />
      <path d="M14 50 H86" stroke={P.ink} strokeWidth={2.5} strokeDasharray="6 5" />
      <path d="M50 30 C66 30 70 40 70 46 M66 40 L70 46 L74 40" {...line} />
      <rect x={14} y={24} width={72} height={52} {...line} />
    </g>
  ),
  "fold-2": () => (
    <g>
      <rect x={14} y={40} width={72} height={36} fill={P.sky} />
      <path d="M50 40 L32 58 M50 40 L68 58" stroke={P.ink} strokeWidth={2.5} strokeDasharray="6 5" />
      <path d="M22 44 C28 40 34 40 38 46 M78 44 C72 40 66 40 62 46" {...line} />
      <rect x={14} y={40} width={72} height={36} {...line} />
    </g>
  ),
  "fold-3": () => (
    <g>
      <path d="M14 76 V58 L50 22 L86 58 V76 Z" fill={P.sky} />
      <path d="M14 58 H86" stroke={P.ink} strokeWidth={2.5} strokeDasharray="6 5" />
      <path d="M50 70 C50 62 50 60 50 58 M46 62 L50 58 L54 62" {...line} />
      <path d="M14 76 V58 L50 22 L86 58 V76 Z" {...line} />
    </g>
  ),
  "fold-4": () => (
    <g>
      <path d="M8 58 L50 16 L92 58 Z" fill={P.sky} />
      <rect x={8} y={58} width={84} height={12} fill="#86adc4" />
      <path d="M8 58 L50 16 L92 58 Z" {...line} />
      <path d="M30 80 C40 90 60 90 70 80 M64 78 L70 80 L68 86" {...line} />
    </g>
  ),
  "fold-5": () => (
    <g>
      <path d="M26 26 L50 50 L74 26 L74 74 L50 50 L26 74 Z" fill={P.sky} />
      <path d="M8 50 C2 50 2 50 8 50 M18 50 H6 M82 50 H94 M12 46 L6 50 L12 54 M88 46 L94 50 L88 54" {...line} />
      <path d="M50 10 V90" stroke={P.ink} strokeWidth={2.5} strokeDasharray="6 5" />
    </g>
  ),
};

/** Resolve parameterised keys like "sock:coral:stripes". */
export function drawObject(key: string): ReactNode | null {
  if (key.startsWith("sock:")) {
    const [, color, pattern] = key.split(":");
    return sock(color, pattern ?? "plain");
  }
  const fn = OBJECTS[key];
  return fn ? fn() : null;
}
