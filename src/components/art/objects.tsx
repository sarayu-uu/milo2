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
  "silly-lamp": () => (
    <g>
      {/* the funny lamp: wobbly neck, crooked hat */}
      <path d="M50 88 C40 70 64 60 52 44" stroke={P.woodDark} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M30 26 L66 14 L78 38 L36 48 Z" fill={P.coral} />
      <circle cx={46} cy={34} r={3} fill={P.cream} />
      <circle cx={60} cy={30} r={3} fill={P.cream} />
      <ellipse cx={50} cy={90} rx={20} ry={6} fill={P.woodDark} />
      <path d="M30 26 L66 14 L78 38 L36 48 Z" {...line} />
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
  zigzag: () => <path d="M10 70 L28 30 L46 70 L64 30 L82 70" stroke={P.coral} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />,

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
  "hand-bird": () => (
    <g>
      <path d="M36 66 L8 40 C4 36 8 30 14 34 L40 52 L14 26 C10 20 16 16 20 20 L46 46 L50 70 Z" fill={P.peach} />
      <path d="M64 66 L92 40 C96 36 92 30 86 34 L60 52 L86 26 C90 20 84 16 80 20 L54 46 L50 70 Z" fill="#e3ab84" />
      <path d="M40 66 C44 80 56 80 60 66 L56 92 H44 Z" fill={P.peach} />
      <path d="M36 66 L8 40 C4 36 8 30 14 34 L40 52 M64 66 L92 40 C96 36 92 30 86 34 L60 52 M44 92 L40 66 M56 92 L60 66" {...line} />
    </g>
  ),
  "shadow-bird": () => (
    <g fill={P.ink}>
      <path d="M50 60 C30 40 14 30 4 34 C16 44 26 56 40 66 Z" />
      <path d="M50 60 C70 40 86 30 96 34 C84 44 74 56 60 66 Z" />
      <ellipse cx={50} cy={64} rx={11} ry={8} />
      <path d="M46 70 L50 88 L54 70 Z" />
    </g>
  ),
  "hand-dog": () => (
    <g>
      <path d="M14 46 C14 38 22 36 30 36 H78 C86 36 88 44 82 48 L58 50 L76 58 C82 62 78 70 72 68 L30 66 C20 66 14 58 14 46 Z" fill={P.peach} />
      <path d="M30 36 L24 14 C22 8 30 6 32 12 L40 36 Z" fill="#e3ab84" />
      <path d="M14 46 C14 38 22 36 30 36 H78 C86 36 88 44 82 48 L58 50 L76 58 C82 62 78 70 72 68 L30 66 C20 66 14 58 14 46 Z M30 36 L24 14 C22 8 30 6 32 12 L40 36" {...line} />
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
