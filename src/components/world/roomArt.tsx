/**
 * Room-object illustrations (paper-cut SVG). Each entry declares its own
 * viewBox so objects keep their proportions; the Room positions them by
 * width %. Keys not found here fall back to the generic object kit.
 */
import type { ReactNode } from "react";
import { P } from "@/components/art/objects";
import { LIVING_ART } from "./livingArt";
import { SCENE_ART } from "./scenes/rooms";

const line = { stroke: "#b49a7c", strokeWidth: 1.1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none", opacity: 0.6 };

export interface RoomArt {
  w: number;
  h: number;
  draw: () => ReactNode;
}

const BASE_ART: Record<string, RoomArt> = {
  window: {
    w: 220,
    h: 200,
    draw: () => (
      <g>
        <rect x={6} y={6} width={208} height={170} rx={6} fill="#f5ead3" />
        <rect x={18} y={18} width={184} height={146} fill="#cfe2ea" />
        {/* the city outside: rooftops, a tree, a wire with a bird */}
        <path d="M18 120 H60 V96 H86 V112 H120 V84 H150 V106 H202 V164 H18 Z" fill="#b9c9d2" />
        <rect x={128} y={92} width={8} height={8} fill="#f1e5c2" />
        <rect x={66} y={102} width={8} height={8} fill="#f1e5c2" />
        <circle cx={182} cy={92} r={18} fill="#a9b89a" />
        <path d="M18 60 C80 74 140 70 202 56" stroke={P.ink} strokeWidth={1.5} fill="none" opacity={0.5} />
        <ellipse cx={92} cy={66} rx={7} ry={5} fill={P.blue} />
        <path d="M18 18 H202 M110 18 V164 M18 90 H202" stroke="#f5ead3" strokeWidth={8} />
        {/* curtains */}
        <path d="M6 6 C26 60 20 120 30 176 H6 Z" fill={P.coral} opacity={0.85} />
        <path d="M214 6 C194 60 200 120 190 176 H214 Z" fill={P.coral} opacity={0.85} />
        <rect x={0} y={174} width={220} height={16} rx={3} fill="#e6d6b4" />
        <rect x={6} y={6} width={208} height={170} rx={6} {...line} />
      </g>
    ),
  },
  "small-window": {
    w: 160,
    h: 130,
    draw: () => (
      <g>
        <rect x={6} y={6} width={148} height={110} rx={6} fill="#f5ead3" />
        <rect x={16} y={16} width={128} height={90} fill="#d6e7ec" />
        <circle cx={120} cy={40} r={12} fill={P.mustard} opacity={0.7} />
        <path d="M16 80 C50 70 90 86 144 72 V106 H16 Z" fill={P.sage} />
        <path d="M80 16 V106" stroke="#f5ead3" strokeWidth={6} />
        <rect x={0} y={114} width={160} height={12} rx={3} fill="#e6d6b4" />
        <rect x={6} y={6} width={148} height={110} rx={6} {...line} />
      </g>
    ),
  },
  armchair: {
    w: 240,
    h: 200,
    draw: () => (
      <g>
        <path d="M30 40 C30 14 210 14 210 40 V130 H30 Z" fill={P.sage} />
        <path d="M60 46 C60 34 180 34 180 46 V110 H60 Z" fill="#b8c6aa" />
        <rect x={6} y={84} width={50} height={84} rx={22} fill="#97a888" />
        <rect x={184} y={84} width={50} height={84} rx={22} fill="#97a888" />
        <rect x={44} y={110} width={152} height={52} rx={14} fill="#b8c6aa" />
        {/* a cushion, slightly squashed */}
        <path d="M70 70 C80 50 120 54 124 74 C126 92 84 98 70 70 Z" fill={P.mustard} />
        <rect x={22} y={164} width={14} height={30} rx={3} fill={P.woodDark} />
        <rect x={204} y={164} width={14} height={30} rx={3} fill={P.woodDark} />
        <path d="M30 40 C30 14 210 14 210 40 M6 120 V150 M234 120 V150" {...line} />
      </g>
    ),
  },
  rug: {
    w: 400,
    h: 70,
    draw: () => (
      <g>
        <ellipse cx={200} cy={36} rx={196} ry={32} fill={P.coral} opacity={0.75} />
        <ellipse cx={200} cy={36} rx={160} ry={22} fill="none" stroke={P.mustard} strokeWidth={6} strokeDasharray="14 10" />
        <ellipse cx={200} cy={36} rx={100} ry={12} fill={P.peach} opacity={0.8} />
      </g>
    ),
  },
  bookshelf: {
    w: 170,
    h: 300,
    draw: () => (
      <g>
        <rect x={6} y={6} width={158} height={290} rx={4} fill={P.wood} />
        {[70, 150, 230].map((y) => (
          <rect key={y} x={6} y={y} width={158} height={10} fill={P.woodDark} />
        ))}
        {/* books */}
        <g>
          <rect x={20} y={24} width={16} height={46} fill={P.blue} />
          <rect x={38} y={30} width={14} height={40} fill={P.mustard} />
          <rect x={54} y={20} width={18} height={50} fill={P.brick} />
          <rect x={76} y={34} width={40} height={14} rx={2} fill={P.sage} transform="rotate(-24 96 41)" />
          <rect x={20} y={104} width={20} height={46} fill={P.lavender} />
          <rect x={42} y={98} width={14} height={52} fill={P.coral} />
          <rect x={58} y={110} width={16} height={40} fill={P.sky} />
          <circle cx={130} cy={132} r={16} fill={P.moss} />
          <rect x={118} y={140} width={24} height={10} fill={P.brick} />
          <rect x={22} y={186} width={60} height={44} rx={3} fill={P.cream} />
          <path d="M30 200 H72 M30 212 H64" stroke={P.grey} strokeWidth={3} />
          <rect x={100} y={180} width={16} height={50} fill={P.mustard} />
          <rect x={118} y={184} width={16} height={46} fill={P.blue} />
          <rect x={138} y={176} width={14} height={54} fill={P.pink} />
        </g>
        <rect x={6} y={6} width={158} height={290} rx={4} {...line} />
      </g>
    ),
  },
  plant: {
    w: 100,
    h: 180,
    draw: () => (
      <g>
        <path d="M50 110 C30 80 10 70 8 40 C30 50 44 70 50 100 C50 60 40 30 52 4 C64 30 58 70 52 104 C60 70 74 50 94 44 C92 72 72 86 52 112 Z" fill={P.leaf} />
        <path d="M50 110 C46 70 50 30 52 6" stroke={P.moss} strokeWidth={3} fill="none" />
        <path d="M22 110 H78 L70 176 H30 Z" fill={P.brick} />
        <rect x={18} y={104} width={64} height={14} rx={3} fill="#c27b64" />
        <path d="M22 110 H78 L70 176 H30 Z" {...line} />
      </g>
    ),
  },
  counter: {
    w: 440,
    h: 230,
    draw: () => (
      <g>
        <rect x={0} y={0} width={440} height={26} rx={4} fill="#e9dcc0" />
        <rect x={6} y={26} width={428} height={200} fill={P.blue} opacity={0.8} />
        <path d="M150 26 V226 M290 26 V226" stroke="#7690a3" strokeWidth={4} />
        <circle cx={130} cy={110} r={6} fill={P.cream} />
        <circle cx={170} cy={110} r={6} fill={P.cream} />
        <circle cx={310} cy={110} r={6} fill={P.cream} />
        <rect x={0} y={0} width={440} height={26} rx={4} {...line} />
      </g>
    ),
  },
  kettle: {
    w: 120,
    h: 110,
    draw: () => (
      <g>
        <path d="M24 100 C14 60 30 34 60 34 C90 34 106 60 96 100 Z" fill={P.coral} />
        <path d="M96 60 C112 50 118 38 116 28" stroke={P.coral} strokeWidth={9} strokeLinecap="round" fill="none" />
        <path d="M36 34 C36 10 84 10 84 34" stroke={P.ink} strokeWidth={6} fill="none" opacity={0.7} />
        <ellipse cx={60} cy={34} rx={14} ry={5} fill="#c4705c" />
        <path d="M24 100 C14 60 30 34 60 34 C90 34 106 60 96 100 Z" {...line} />
      </g>
    ),
  },
  "cup-shelf": {
    w: 200,
    h: 120,
    draw: () => (
      <g>
        <rect x={0} y={96} width={200} height={12} rx={3} fill={P.wood} />
        <path d="M20 108 L30 120 M180 108 L170 120" stroke={P.woodDark} strokeWidth={5} />
        {[14, 62, 110, 154].map((x, i) => (
          <g key={x} transform={`translate(${x} ${i % 2 ? 46 : 40})`}>
            <path d="M0 6 H32 L28 50 H4 Z" fill={[P.peach, P.sky, P.mustard, P.pink][i]} />
            <path d="M32 18 C44 18 44 36 30 36" stroke={[P.peach, P.sky, P.mustard, P.pink][i]} strokeWidth={5} fill="none" />
            <path d="M0 6 H32 L28 50 H4 Z" {...line} />
          </g>
        ))}
      </g>
    ),
  },
  "fruit-bowl": {
    w: 140,
    h: 90,
    draw: () => (
      <g>
        <circle cx={46} cy={40} r={18} fill="#e7a35f" />
        <path d="M66 50 C64 22 86 14 98 26 C110 40 104 56 92 60 Z" fill="#e8b24f" />
        <circle cx={84} cy={30} r={3} fill={P.leaf} />
        <path d="M30 32 C40 12 60 10 70 22" stroke="#ecd06a" strokeWidth={12} strokeLinecap="round" fill="none" />
        <path d="M8 52 H132 C128 76 104 88 70 88 C36 88 12 76 8 52 Z" fill={P.lavender} />
        <path d="M8 52 H132 C128 76 104 88 70 88 C36 88 12 76 8 52 Z" {...line} />
      </g>
    ),
  },
  sink: {
    w: 200,
    h: 150,
    draw: () => (
      <g>
        <path d="M84 30 V10 H120" stroke={P.grey} strokeWidth={10} strokeLinecap="round" fill="none" />
        <rect x={74} y={22} width={20} height={14} rx={3} fill={P.grey} />
        <rect x={0} y={40} width={200} height={20} rx={5} fill="#f0ebe0" />
        <path d="M30 60 H170 L160 110 H40 Z" fill="#e3dccd" />
        <rect x={86} y={110} width={28} height={40} fill="#d6cfbf" />
        <rect x={0} y={40} width={200} height={20} rx={5} {...line} />
      </g>
    ),
  },
  fridge: {
    w: 130,
    h: 300,
    draw: () => (
      <g>
        <rect x={6} y={6} width={118} height={290} rx={14} fill="#eef0ea" />
        <path d="M6 110 H124" stroke={P.grey} strokeWidth={4} />
        <rect x={100} y={40} width={8} height={50} rx={4} fill={P.grey} />
        <rect x={100} y={130} width={8} height={70} rx={4} fill={P.grey} />
        {/* magnets */}
        <circle cx={34} cy={54} r={8} fill={P.coral} />
        <rect x={52} y={140} width={30} height={36} fill={P.cream} transform="rotate(-6 67 158)" />
        <path d="M58 152 L76 150 M58 162 L72 161" stroke={P.blue} strokeWidth={3} />
        <rect x={6} y={6} width={118} height={290} rx={14} {...line} />
      </g>
    ),
  },
  fence: {
    w: 1000,
    h: 120,
    draw: () => (
      <g>
        <rect x={0} y={40} width={1000} height={14} fill="#d9c7a3" />
        <rect x={0} y={86} width={1000} height={14} fill="#d9c7a3" />
        {Array.from({ length: 25 }, (_, i) => (
          <path key={i} d={`M${i * 40 + 8} 120 V16 L${i * 40 + 20} 4 L${i * 40 + 32} 16 V120 Z`} fill="#e8dabb" stroke="#bfa985" strokeWidth={2} />
        ))}
      </g>
    ),
  },
  tree: {
    w: 260,
    h: 380,
    draw: () => (
      <g>
        <path d="M110 380 C116 300 112 240 100 200 L150 200 C138 250 140 310 150 380 Z" fill={P.woodDark} />
        <path d="M120 230 C90 200 70 196 60 180" stroke={P.woodDark} strokeWidth={10} fill="none" strokeLinecap="round" />
        <circle cx={80} cy={140} r={70} fill={P.moss} />
        <circle cx={170} cy={120} r={80} fill="#8a9c6e" />
        <circle cx={128} cy={70} r={66} fill={P.leaf} />
        <circle cx={196} cy={190} r={46} fill={P.moss} />
        <circle cx={60} cy={200} r={36} fill="#8a9c6e" />
        <circle cx={150} cy={60} r={6} fill={P.coral} />
        <circle cx={90} cy={120} r={6} fill={P.coral} />
        <circle cx={196} cy={140} r={6} fill={P.coral} />
      </g>
    ),
  },
  flowerbed: {
    w: 240,
    h: 110,
    draw: () => (
      <g>
        {[20, 60, 100, 140, 180, 214].map((x, i) => (
          <g key={x} transform={`translate(${x} ${i % 2 ? 20 : 8})`}>
            <path d="M0 30 V90" stroke={P.moss} strokeWidth={4} />
            <circle cx={0} cy={20} r={12} fill={[P.pink, P.mustard, P.lavender, P.coral, P.pink, P.sky][i]} />
            <circle cx={0} cy={20} r={4} fill={P.cream} />
          </g>
        ))}
        <path d="M0 96 C60 84 180 84 240 96 V110 H0 Z" fill="#8d7a5e" />
      </g>
    ),
  },
  birdbath: {
    w: 120,
    h: 160,
    draw: () => (
      <g>
        <ellipse cx={60} cy={30} rx={56} ry={16} fill="#d6cfbf" />
        <ellipse cx={60} cy={26} rx={44} ry={9} fill={P.sky} />
        <path d="M50 40 H70 L76 140 H44 Z" fill="#cfc7b6" />
        <rect x={28} y={138} width={64} height={16} rx={4} fill="#c3bba9" />
      </g>
    ),
  },
  "leaf-path": {
    w: 300,
    h: 70,
    draw: () => (
      <g>
        {["leaf", "flower", "leaf", "flower", "leaf"].map((k, i) => (
          <g key={i} transform={`translate(${i * 60 + 6} ${i % 2 ? 14 : 6}) scale(0.5)`}>
            {k === "leaf" ? (
              <path d="M18 80 C18 40 46 16 84 16 C84 54 58 82 18 80 Z" fill={P.leaf} />
            ) : (
              <g fill={P.pink}>
                <circle cx={50} cy={28} r={15} />
                <circle cx={72} cy={46} r={15} />
                <circle cx={64} cy={72} r={15} />
                <circle cx={36} cy={72} r={15} />
                <circle cx={28} cy={46} r={15} />
                <circle cx={50} cy={52} r={12} fill={P.mustard} />
              </g>
            )}
          </g>
        ))}
        <text x={290} y={50} textAnchor="end" fontSize={40} fontFamily="var(--font-hand)" fill={P.ink} opacity={0.5}>
          ?
        </text>
      </g>
    ),
  },
  mirror: {
    w: 150,
    h: 200,
    draw: () => (
      <g>
        <ellipse cx={75} cy={100} rx={70} ry={94} fill={P.wood} />
        <ellipse cx={75} cy={100} rx={58} ry={82} fill="#dceaf0" />
        <path d="M44 60 L66 40 M44 84 L84 46" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
      </g>
    ),
  },
  tub: {
    w: 360,
    h: 190,
    draw: () => (
      <g>
        <path d="M10 40 H350 C350 120 300 160 180 160 C60 160 10 120 10 40 Z" fill="#f4f1ea" />
        <rect x={0} y={30} width={360} height={18} rx={9} fill="#e9e4d8" />
        {/* bubbles */}
        {[
          [60, 30, 18],
          [90, 18, 14],
          [130, 26, 20],
          [250, 22, 16],
          [290, 30, 22],
          [210, 14, 10],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#fff" stroke={P.sky} strokeWidth={3} opacity={0.9} />
        ))}
        <path d="M70 160 L60 186 M290 160 L300 186" stroke={P.mustard} strokeWidth={10} strokeLinecap="round" />
        <path d="M10 40 H350 C350 120 300 160 180 160 C60 160 10 120 10 40 Z" {...line} />
      </g>
    ),
  },
  duck: {
    w: 100,
    h: 90,
    draw: () => (
      <g>
        <path d="M10 56 C10 40 30 40 44 46 C40 20 70 10 80 30 C86 40 82 50 76 54 C90 56 94 66 88 76 C76 92 24 90 10 56 Z" fill={P.mustard} />
        <path d="M80 34 L98 38 L82 44 Z" fill={P.coral} />
        <circle cx={68} cy={30} r={3.5} fill={P.ink} />
      </g>
    ),
  },
  "laundry-basket": {
    w: 150,
    h: 130,
    draw: () => (
      <g>
        <path d="M30 30 C40 10 60 30 70 16 C84 30 100 6 120 26" stroke={P.coral} strokeWidth={14} strokeLinecap="round" fill="none" />
        <path d="M60 26 C70 4 90 14 96 26" stroke={P.blue} strokeWidth={12} strokeLinecap="round" fill="none" />
        <path d="M10 36 H140 L126 126 H24 Z" fill="#d9c7a3" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M14 ${56 + i * 18} H136`} stroke="#bfa985" strokeWidth={4} />
        ))}
        <path d="M10 36 H140 L126 126 H24 Z" {...line} />
      </g>
    ),
  },
};

export const ROOM_ART: Record<string, RoomArt> = { ...BASE_ART, ...LIVING_ART, ...SCENE_ART };
