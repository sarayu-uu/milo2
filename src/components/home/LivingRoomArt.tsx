"use client";

import { useEffect, type ReactNode } from "react";
import { motion, useAnimationControls, type TargetAndTransition } from "motion/react";
import { leaf, paperBlob, paperRect } from "./paper";

/**
 * MILO'S LIVING ROOM — editorial cut-paper collage (1600×900 scene).
 *
 * No dark outlines: shapes are separated by value, with tiny paper shadows,
 * slightly wobbly cut edges and a few pencil accents. Scene palette:
 * cream · terracotta · sage · dusty blue · mustard, with lavender/pink accents.
 *
 * Characters (Milo, the cat) and the sock story are layered on top by
 * HomeScreen; this component is the room itself plus its tappable hotspots.
 */
export const K = {
  wall: "#cfd8c0",
  wallLight: "#dbe3cd",
  wallDark: "#bfcbaf",
  cream: "#f6ecd7",
  creamDark: "#e9d8b8",
  terra: "#d4694a",
  terraDark: "#b95640",
  terraLight: "#e2876a",
  sofa: "#d98972",
  sofaLight: "#e0957d",
  sofaDark: "#c97864",
  sage: "#8fae7e",
  sageDark: "#6c905f",
  sageLight: "#b6cca5",
  leaf: "#5e8c56",
  leafDark: "#4a7445",
  blue: "#6f8fb4",
  blueDark: "#52729b",
  blueLight: "#aac6de",
  sky: "#a9d0ea",
  skyLight: "#d4e8f4",
  mustard: "#e2b33f",
  mustardDark: "#c99a2c",
  mustardLight: "#f1d580",
  wood: "#b9814f",
  woodDark: "#91603a",
  woodLight: "#d4a476",
  floor: "#c99662",
  lav: "#ab9ed2",
  pink: "#e8a2ad",
  pinkDark: "#d8879a",
  pencil: "#5a4636",
  linen: "#d8c19a",
  linenDark: "#c4aa80",
  rug: "#a8b596",
  rugDark: "#93a181",
  ochre: "#d7ae55",
  ochreDark: "#c39a45",
  ochreLight: "#ecd7a3",
  shade: "rgba(90, 60, 30, 0.14)",
};

export type HotId =
  | "window"
  | "curtain"
  | "frames"
  | "bird-drawing"
  | "hanging-plant"
  | "plant-left"
  | "bookshelf"
  | "big-plant"
  | "pouf"
  | "books"
  | "toy-block"
  | "pencil"
  | "ball"
  | "car"
  | "sun-drawing"
  | "cushions";

export const HOT_LABELS: Record<HotId, string> = {
  window: "Window",
  curtain: "Curtain",
  frames: "Pictures",
  "bird-drawing": "A drawing of a bird",
  "hanging-plant": "Hanging plant",
  "plant-left": "Plant",
  bookshelf: "Bookshelf",
  "big-plant": "Big plant",
  pouf: "Pink cushion",
  books: "Books",
  "toy-block": "Toy block",
  pencil: "Pencil",
  ball: "Marble",
  car: "Toy car",
  "sun-drawing": "Sun drawing",
  cushions: "Cushions",
};

/** One-off reactions — never continuous motion. */
const WIGGLES: Partial<Record<HotId, TargetAndTransition>> = {
  window: { rotate: [0, 0.6, -0.4, 0], transition: { duration: 0.6 } },
  curtain: { skewX: [0, 4, -3, 1.5, 0], transition: { duration: 1 } },
  frames: { rotate: [0, 2.5, -2, 1, 0], transition: { duration: 0.8 } },
  "bird-drawing": { rotate: [0, -4, 3, 0], transition: { duration: 0.7 } },
  "hanging-plant": { rotate: [0, 4, -3, 1.5, 0], transition: { duration: 1.4 } },
  "plant-left": { rotate: [0, 3, -2, 0], transition: { duration: 0.9 } },
  bookshelf: { x: [0, -6, 0], transition: { duration: 0.6 } },
  "big-plant": { rotate: [0, 2.5, -2, 1, 0], transition: { duration: 1 } },
  pouf: { scaleY: [1, 0.86, 1.04, 1], transition: { duration: 0.5 } },
  books: { y: [0, -10, 0], transition: { duration: 0.45 } },
  "toy-block": { y: [0, -18, 0, -6, 0], transition: { duration: 0.7 } },
  pencil: { rotate: [0, 20, -10, 0], transition: { duration: 0.6 } },
  ball: { x: [0, 30, 22], transition: { duration: 0.8, ease: "easeOut" } },
  car: { x: [0, -60, -40], transition: { duration: 0.9, ease: "easeOut" } },
  "sun-drawing": { rotate: [0, 8, -5, 0], transition: { duration: 0.8 } },
  cushions: { y: [0, -6, 0], transition: { duration: 0.4 } },
};

/** A tappable group: pointer + one wiggle when tapped or hinted. */
function Hot({
  id,
  poke,
  onTap,
  origin = "50% 100%",
  children,
}: {
  id: HotId;
  poke: Record<string, number>;
  onTap: (id: HotId) => void;
  origin?: string;
  children: ReactNode;
}) {
  const c = useAnimationControls();
  const n = poke[id];
  useEffect(() => {
    if (n) void c.start(WIGGLES[id] ?? { scale: [1, 1.04, 1] });
  }, [n, c, id]);
  return (
    <motion.g
      animate={c}
      style={{ transformBox: "fill-box", transformOrigin: origin, cursor: "pointer" }}
      onClick={() => onTap(id)}
      role="button"
      aria-label={HOT_LABELS[id]}
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onTap(id)}
    >
      {children}
    </motion.g>
  );
}

const P = { fill: "none", stroke: K.pencil, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/* ------------------------------------------------------------------ */

export function LivingRoomArt({
  poke = {},
  onTap = () => {},
  sill,
  drawing,
}: {
  poke?: Record<string, number>;
  onTap?: (id: HotId) => void;
  /** Optional little daily object on the window sill. */
  sill?: ReactNode;
  /** The child's own drawing, taped to the wall (data URL). */
  drawing?: string | null;
}) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-label="Milo's living room">
      <defs>
        {/* soft paper shadow under cut shapes */}
        <filter id="lr-ps" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#5a3c1e" floodOpacity="0.22" />
        </filter>
        <filter id="lr-ps-sm" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="#5a3c1e" floodOpacity="0.2" />
        </filter>
        <pattern id="lr-check" width="18" height="18" patternUnits="userSpaceOnUse">
          <rect width="18" height="18" fill={K.cream} />
          <path d="M9 0 V18 M0 9 H18" stroke="#d9c39b" strokeWidth="2.2" />
        </pattern>
        <pattern id="lr-plaid" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={K.mustard} />
          <path d="M8 0 V16 M0 8 H16" stroke={K.mustardLight} strokeWidth="2" />
        </pattern>
        <pattern id="lr-plaid-linen" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#d8c19a" />
          <path d="M8 0 V16 M0 8 H16" stroke="#c4aa80" strokeWidth="2" />
        </pattern>
        {/* depth: edge vignette + warm light pool for the hero */}
        <radialGradient id="lr-vignette" cx="55%" cy="62%" r="75%">
          <stop offset="60%" stopColor="#3a2a1a" stopOpacity="0" />
          <stop offset="100%" stopColor="#3a2a1a" stopOpacity="0.28" />
        </radialGradient>
        <radialGradient id="lr-spot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4d6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff4d6" stopOpacity="0" />
        </radialGradient>
        <pattern id="lr-rug-grain" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="4" r="0.9" fill="#8f9c7e" opacity="0.5" />
          <circle cx="10" cy="10" r="0.8" fill="#bcc8ab" opacity="0.6" />
          <path d="M2 11 h4" stroke="#9aa888" strokeWidth="0.8" opacity="0.5" />
        </pattern>
        <pattern id="lr-dots-y" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill={K.mustard} />
          <circle cx="6" cy="6" r="2.8" fill={K.mustardLight} />
          <circle cx="16" cy="15" r="2.4" fill={K.mustardLight} />
        </pattern>
        <pattern id="lr-dots-b" width="22" height="22" patternUnits="userSpaceOnUse">
          <rect width="22" height="22" fill={K.blue} />
          <circle cx="6" cy="7" r="3" fill={K.cream} />
          <circle cx="16" cy="16" r="2.4" fill={K.cream} />
        </pattern>
        <pattern id="lr-terra-grain" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill={K.sofa} />
          <circle cx="3" cy="3" r="0.9" fill={K.sofaDark} opacity="0.45" />
          <circle cx="8" cy="7" r="0.7" fill={K.sofaLight} opacity="0.6" />
        </pattern>
      </defs>

      {/* ============================ WALL ============================ */}
      <rect width="1600" height="900" fill={K.wall} />
      {/* layered wall paper patches */}
      <path d={paperRect(-10, -10, 560, 420, { seed: 3, j: 6 })} fill={K.wallLight} opacity="0.6" />
      <path d={paperRect(1180, 60, 260, 360, { seed: 8, j: 6 })} fill={K.wallLight} opacity="0.5" />
      <path d={paperRect(520, 430, 300, 220, { seed: 11, j: 6 })} fill={K.wallDark} opacity="0.35" />
      {/* tiny wall doodles */}
      <g opacity="0.55">
        <path d="M24 300 l10 10 m0 -10 l-10 10 m5 -14 v18 m-9 -9 h18" {...P} stroke={K.blue} strokeWidth="2.5" />
        <path d="M640 340 l10 10 m0 -10 l-10 10 m5 -14 v18 m-9 -9 h18" {...P} stroke={K.terraLight} strokeWidth="2.5" />
        <path d="M1225 470 l8 8 m0 -8 l-8 8" {...P} stroke={K.blue} strokeWidth="2" />
        <path d="M770 470 q12 -14 24 0" {...P} stroke={K.blueLight} strokeWidth="5" />
        <path d={leaf(530, 330, 34, 9, -120)} fill={K.sageLight} />
        <path d={leaf(1350, 345, 30, 8, -60)} fill={K.mustardLight} />
        <path d="M1336 100 h40 v10 h-40 z" fill={K.blueLight} transform="rotate(-20 1356 105)" />
        <path d="M60 560 h46 v10 h-46 z" fill={K.blueLight} transform="rotate(25 83 565)" />
      </g>

      {/* ============================ FLOOR ============================ */}
      <path d="M0 640 L1600 650 V900 H0 Z" fill={K.floor} />
      <path d="M0 640 L1600 650 L1600 662 L0 652 Z" fill={K.woodDark} opacity="0.35" />
      <g stroke={K.woodDark} strokeWidth="2" opacity="0.25">
        <path d="M0 720 L1600 730 M0 800 L1600 812" />
        <path d="M220 652 V720 M760 656 V726 M1180 660 V730 M480 724 V804 M1400 732 V812" />
      </g>

      {/* ============================ WALL ART (left) ============================ */}
      <Hot id="frames" poke={poke} onTap={onTap} origin="50% 0%">
        {/* small wooden frame with a plant print */}
        <g filter="url(#lr-ps-sm)">
          <path d={paperRect(116, 206, 80, 118, { seed: 21 })} fill={K.wood} />
          <path d={paperRect(127, 218, 58, 94, { seed: 22, j: 1.5 })} fill={K.cream} />
          <path d="M156 300 V236" stroke={K.sageDark} strokeWidth="3" />
          {[[156, 252, -150], [156, 252, -30], [156, 270, -150], [156, 270, -30], [156, 288, -150], [156, 288, -30]].map(([x, y, a], i) => (
            <path key={i} d={leaf(x, y, 18, 6, a)} fill={K.sage} />
          ))}
        </g>
        {/* pink frame with a little city painting */}
        <g filter="url(#lr-ps-sm)">
          <path d={paperRect(222, 192, 166, 140, { seed: 23 })} fill={K.pink} />
          <path d={paperRect(236, 206, 138, 112, { seed: 24, j: 1.5 })} fill={K.skyLight} />
          <path d="M236 318 V270 H262 V246 H286 V280 H310 V256 H334 V286 H354 V262 H374 V318 Z" fill={K.terraLight} />
          <path d="M262 318 V290 H290 V318 Z M318 318 V296 H344 V318 Z" fill={K.mustard} />
          <path d="M290 318 V300 H318 V318 Z" fill={K.sage} />
          <path d="M346 318 V280 H374 V318 Z" fill={K.blue} />
          {[248, 268, 296, 322, 352].map((x) => (
            <rect key={x} x={x} y={300} width="6" height="7" fill={K.cream} opacity="0.8" />
          ))}
        </g>
        {/* mustard-orange frame with one big leaf */}
        <g filter="url(#lr-ps-sm)">
          <path d={paperRect(398, 82, 96, 120, { seed: 25 })} fill={K.mustardDark} />
          <path d={paperRect(410, 94, 72, 96, { seed: 26, j: 1.5 })} fill={K.cream} />
          <path d={leaf(446, 180, 70, 20, -90)} fill={K.sage} />
          <path d="M446 182 V116" stroke={K.sageDark} strokeWidth="2.5" />
          {[130, 146, 162].map((y) => (
            <path key={y} d={`M446 ${y} l-12 -8 M446 ${y} l12 -8`} stroke={K.sageDark} strokeWidth="1.8" />
          ))}
        </g>
      </Hot>

      {/* taped bird drawing (a blue bird + sun, drawn by "someone") */}
      <Hot id="bird-drawing" poke={poke} onTap={onTap} origin="50% 0%">
        <g filter="url(#lr-ps-sm)" transform="rotate(-4 455 300)">
          <path d={paperRect(410, 250, 92, 96, { seed: 27, j: 2 })} fill="#fbf6ea" />
          <path d={paperBlob(446, 310, 20, 16, { seed: 4 })} fill={K.blueLight} />
          <circle cx="462" cy="296" r="10" fill={K.blueLight} />
          <circle cx="465" cy="294" r="2" fill={K.pencil} />
          <path d="M472 297 l8 3 l-8 3" fill={K.terraLight} />
          <path d="M432 308 q8 -12 18 -2" stroke={K.blue} strokeWidth="3" fill="none" />
          <circle cx="484" cy="268" r="8" fill={K.mustardLight} />
          <path d="M440 330 v8 M452 330 v8" stroke={K.terraLight} strokeWidth="2" />
          <rect x="440" y="244" width="34" height="11" fill="rgba(230,212,160,0.85)" transform="rotate(4 457 249)" />
        </g>
      </Hot>
      {drawing && (
        // the child's own drawing joins the wall
        <g transform="rotate(5 560 400)" filter="url(#lr-ps-sm)">
          <rect x="520" y="360" width="86" height="82" fill="#fbf6ea" />
          <image href={drawing} x="526" y="366" width="74" height="70" preserveAspectRatio="xMidYMid meet" />
          <rect x="544" y="354" width="34" height="11" fill="rgba(232,162,173,0.8)" />
        </g>
      )}

      {/* hanging plant in a terracotta pot */}
      <Hot id="hanging-plant" poke={poke} onTap={onTap} origin="50% 0%">
        <path d="M566 0 V70 M536 104 L566 70 L596 104" {...P} stroke={K.woodDark} strokeWidth="2" />
        <g filter="url(#lr-ps-sm)">
          <path d="M530 100 H602 L594 140 H538 Z" fill={K.terra} />
          <path d="M530 100 H602 V110 H530 Z" fill={K.terraDark} />
        </g>
        {[
          [534, 110, 300, -1],
          [552, 130, 340, 1],
          [584, 130, 320, -1],
          [600, 112, 260, 1],
        ].map(([x, y, end, s], i) => (
          <g key={i}>
            <path d={`M${x} ${y} C${x + 12 * s} ${y + 60} ${x - 10 * s} ${(y + end) / 2} ${x + 6 * s} ${end}`} stroke={K.leafDark} strokeWidth="2.2" fill="none" />
            {Array.from({ length: 6 }, (_, k) => {
              const t = (k + 1) / 7;
              const yy = y + (end - y) * t;
              return <path key={k} d={leaf(x + (k % 2 ? 8 : -8) * s, yy, 20, 7, k % 2 ? 60 : 120)} fill={k % 2 ? K.sage : K.leaf} />;
            })}
          </g>
        ))}
      </Hot>

      {/* big leafy plant cropped at the top-left edge */}
      <Hot id="plant-left" poke={poke} onTap={onTap} origin="0% 100%">
        {[[-10, 320, -60, 120], [10, 330, -80, 110], [-20, 300, -30, 90], [30, 340, -100, 90], [0, 260, -50, 70]].map(([x, y, a, l], i) => (
          <path key={i} d={leaf(x, y, l, l * 0.22, a)} fill={i % 2 ? K.leaf : K.sageDark} />
        ))}
      </Hot>

      {/* ============================ WINDOW ============================ */}
      <Hot id="window" poke={poke} onTap={onTap} origin="50% 50%">
        <g filter="url(#lr-ps)">
          <path d={paperRect(690, 40, 500, 396, { seed: 31, j: 2 })} fill={K.wood} />
        </g>
        <path d={paperRect(712, 58, 456, 356, { seed: 32, j: 1 })} fill={K.sky} />
        <rect x="712" y="58" width="456" height="120" fill={K.skyLight} opacity="0.5" />
        {/* clouds */}
        <path d={paperBlob(800, 118, 46, 18, { seed: 5 })} fill="#fdfaf3" />
        <path d={paperBlob(836, 104, 30, 18, { seed: 6 })} fill="#fdfaf3" />
        <path d={paperBlob(1060, 150, 54, 20, { seed: 7 })} fill="#fdfaf3" />
        <path d={paperBlob(1098, 136, 32, 20, { seed: 9 })} fill="#fdfaf3" />
        {/* far buildings */}
        <path d="M712 300 V230 H760 V250 H800 V214 H840 V240 H900 V226 H960 V250 H1020 V220 H1080 V244 H1130 V210 H1168 V300 Z" fill={K.blueLight} />
        {/* the water tank on stilts */}
        <g>
          <path d="M800 230 L796 300 M846 230 L850 300 M806 270 H840" stroke="#4f6378" strokeWidth="5" />
          <path d={paperRect(792, 176, 64, 56, { seed: 33, j: 1.5 })} fill="#5d7088" />
          <path d="M788 178 L824 156 L860 178 Z" fill="#4f6378" />
          <path d="M800 192 H848 M800 210 H848" stroke="#4f6378" strokeWidth="3" />
        </g>
        {/* nearer buildings: pink, cream, blue with balconies */}
        <path d={paperRect(724, 236, 70, 150, { seed: 34 })} fill={K.pink} />
        <path d={paperRect(860, 222, 96, 170, { seed: 35 })} fill="#f1dcc1" />
        <path d={paperRect(960, 252, 70, 140, { seed: 36 })} fill={K.pinkDark} />
        <path d={paperRect(1040, 214, 86, 180, { seed: 37 })} fill="#9db3d6" />
        <path d={paperRect(1126, 250, 50, 140, { seed: 38 })} fill={K.pink} />
        {[
          [734, 252],
          [760, 252],
          [734, 282],
          [760, 282],
          [872, 240],
          [902, 240],
          [930, 240],
          [872, 270],
          [902, 270],
          [930, 270],
          [970, 268],
          [998, 268],
          [1052, 232],
          [1084, 232],
          [1052, 262],
          [1084, 262],
          [1136, 268],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="14" height="16" fill="#fbf3e2" opacity="0.85" />
        ))}
        {/* balcony rails */}
        <path d="M866 300 H952 M1046 290 H1122" stroke="#fbf3e2" strokeWidth="4" opacity="0.8" />
        {/* washing line with clothes */}
        <path d="M940 296 Q1050 318 1160 290" stroke={K.pencil} strokeWidth="1.6" fill="none" opacity="0.7" />
        {[
          [960, K.terra],
          [992, K.blue],
          [1022, K.mustard],
          [1056, K.sage],
          [1090, K.terraLight],
          [1124, K.blueLight],
        ].map(([x, c], i) => (
          <path key={i} d={`M${x} ${300 + (i % 3) * 3} h${18} v${22} l-9 -5 l-9 5 Z`} fill={c as string} />
        ))}
        {/* trees in front */}
        <path d={paperBlob(760, 380, 70, 50, { seed: 12 })} fill={K.sageDark} />
        <path d={paperBlob(850, 392, 60, 40, { seed: 13 })} fill={K.leaf} />
        <path d={paperBlob(960, 396, 70, 40, { seed: 14 })} fill={K.sage} />
        <path d={paperBlob(1070, 388, 70, 48, { seed: 15 })} fill={K.leaf} />
        <path d={paperBlob(1150, 380, 50, 50, { seed: 16 })} fill={K.sageDark} />
        {/* birds */}
        <path d="M1050 92 q8 -9 16 0 q8 -9 16 0 M1100 116 q6 -7 12 0 q6 -7 12 0 M1012 122 q6 -6 12 0 q6 -6 12 0" {...P} stroke="#4c5566" strokeWidth="3" />
        {/* frame bars + sill */}
        <path d={paperRect(932, 58, 16, 356, { seed: 39, j: 1 })} fill={K.wood} />
        <path d={paperRect(712, 226, 456, 12, { seed: 40, j: 1 })} fill={K.wood} opacity="0" />
        <g filter="url(#lr-ps-sm)">
          <path d={paperRect(676, 420, 528, 22, { seed: 41, j: 1.5 })} fill={K.woodLight} />
        </g>
      </Hot>
      {sill}

      {/* checked cream curtains, tied back */}
      <Hot id="curtain" poke={poke} onTap={onTap} origin="50% 0%">
        <path d="M640 30 H1240" stroke={K.woodDark} strokeWidth="9" strokeLinecap="round" />
        <circle cx="640" cy="30" r="9" fill={K.woodDark} />
        <circle cx="1240" cy="30" r="9" fill={K.woodDark} />
        <g filter="url(#lr-ps-sm)">
          <path d="M648 34 H738 C736 120 722 220 706 272 C716 330 728 380 738 430 H654 C660 380 668 320 674 272 C660 200 650 110 648 34 Z" fill="url(#lr-check)" />
          <path d="M1142 34 H1232 C1230 110 1220 200 1206 272 C1212 320 1220 380 1226 430 H1142 C1152 380 1164 330 1174 272 C1158 220 1144 120 1142 34 Z" fill="url(#lr-check)" />
          {/* tie-backs */}
          <path d="M668 268 Q692 280 716 266" stroke={K.mustardDark} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M1162 266 Q1186 280 1212 268" stroke={K.mustardDark} strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      </Hot>

      {/* taped sun + plant drawings on the right wall */}
      <Hot id="sun-drawing" poke={poke} onTap={onTap} origin="50% 0%">
        <g filter="url(#lr-ps-sm)" transform="rotate(4 1296 190)">
          <path d={paperRect(1250, 134, 92, 106, { seed: 51, j: 2 })} fill="#fbf6ea" />
          <circle cx="1296" cy="186" r="20" fill={K.mustardLight} />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return <path key={i} d={`M${1296 + Math.cos(a) * 26} ${186 + Math.sin(a) * 26} L${1296 + Math.cos(a) * 36} ${186 + Math.sin(a) * 36}`} stroke={K.mustard} strokeWidth="3.5" strokeLinecap="round" />;
          })}
          <path d="M1288 190 q8 6 16 0" stroke={K.mustardDark} strokeWidth="2" fill="none" />
          <rect x="1278" y="128" width="34" height="11" fill="rgba(170,198,222,0.8)" transform="rotate(-6 1295 133)" />
        </g>
        <g filter="url(#lr-ps-sm)" transform="rotate(-3 1272 352)">
          <path d={paperRect(1238, 296, 70, 112, { seed: 52, j: 2 })} fill="#fbf6ea" />
          <path d="M1273 396 V320" stroke={K.sageDark} strokeWidth="2.4" />
          {[330, 348, 366, 382].map((y, i) => (
            <path key={y} d={leaf(1273, y, 16, 5, i % 2 ? -30 : -150)} fill={K.sage} />
          ))}
          <circle cx="1273" cy="316" r="7" fill={K.mustardLight} />
          <rect x="1256" y="290" width="30" height="10" fill="rgba(230,212,160,0.85)" />
        </g>
      </Hot>

      {/* ============================ BOOKSHELF (cropped right) ============================ */}
      <Hot id="bookshelf" poke={poke} onTap={onTap} origin="100% 100%">
        <g filter="url(#lr-ps)">
          <path d={paperRect(1384, 164, 240, 530, { seed: 61, j: 2 })} fill={K.wood} />
          <path d={paperRect(1400, 180, 230, 498, { seed: 62, j: 1 })} fill={K.woodDark} />
          {[336, 496, 658].map((y, i) => (
            <path key={y} d={paperRect(1384, y, 240, 16, { seed: 63 + i, j: 1 })} fill={K.woodLight} />
          ))}
        </g>
        {/* top shelf: books + a framed bird picture */}
        <Books x={1408} y={232} h={104} colors={[K.terraDark, K.blue, K.mustard, K.cream]} />
        <g filter="url(#lr-ps-sm)">
          <path d={paperRect(1500, 230, 92, 104, { seed: 66 })} fill={K.woodDark} />
          <path d={paperRect(1508, 240, 76, 86, { seed: 67, j: 1.5 })} fill={K.cream} />
          <path d={paperBlob(1546, 292, 18, 15, { seed: 17 })} fill={K.blue} />
          <circle cx="1556" cy="276" r="10" fill={K.blue} />
          <circle cx="1559" cy="274" r="2" fill="#2a2420" />
          <path d="M1566 277 l7 3 l-7 3" fill={K.mustard} />
          <path d="M1546 308 v8 M1552 308 v8" stroke={K.terra} strokeWidth="2" />
        </g>
        {/* middle shelf: a full row of books */}
        <Books x={1406} y={384} h={112} colors={[K.blue, K.mustard, K.terra, K.sage, K.terraDark, K.blueLight, K.mustardDark, K.sageDark, K.terraLight]} />
        {/* bottom shelf: books + a woven basket */}
        <Books x={1406} y={556} h={102} colors={[K.terra, K.blueDark, K.mustard]} />
        <g filter="url(#lr-ps-sm)">
          <path d={paperRect(1470, 566, 130, 92, { seed: 68 })} fill={K.mustardDark} />
          <g stroke={K.mustard} strokeWidth="3" opacity="0.8">
            {[584, 604, 624, 644].map((y) => (
              <path key={y} d={`M1474 ${y} H1600`} />
            ))}
          </g>
        </g>
        {/* trailing plant on top */}
        <g>
          <path d="M1440 166 H1500 L1494 132 H1446 Z" fill={K.terra} />
          {[[1450, 132, -120], [1470, 126, -90], [1490, 132, -60], [1446, 150, 140], [1500, 150, 40]].map(([x, y, a], i) => (
            <path key={i} d={leaf(x, y, 40, 12, a)} fill={i % 2 ? K.sage : K.leaf} />
          ))}
          <path d="M1446 166 C1430 200 1440 230 1424 260" stroke={K.leafDark} strokeWidth="2" fill="none" />
          {[186, 212, 238].map((y, i) => (
            <path key={y} d={leaf(1434 + (i % 2 ? 6 : -6), y, 16, 6, i % 2 ? 40 : 140)} fill={K.sage} />
          ))}
        </g>
      </Hot>

      {/* ============================ BIG PLANT in a blue spotty pot ============================ */}
      <Hot id="big-plant" poke={poke} onTap={onTap} origin="50% 100%">
        {[
          [1330, 590, -150, 140],
          [1330, 590, -115, 170],
          [1330, 590, -90, 190],
          [1330, 590, -65, 165],
          [1330, 590, -30, 140],
          [1330, 590, -170, 110],
          [1330, 590, -10, 110],
        ].map(([x, y, a, l], i) => (
          <g key={i}>
            <path d={leaf(x, y, l, l * 0.2, a)} fill={i % 2 ? K.leaf : K.sageDark} />
            <path
              d={`M${x} ${y} L${x + Math.cos((a * Math.PI) / 180) * l * 0.9} ${y + Math.sin((a * Math.PI) / 180) * l * 0.9}`}
              stroke={K.sageLight}
              strokeWidth="1.6"
              opacity="0.6"
            />
          </g>
        ))}
        <g filter="url(#lr-ps)">
          <path d="M1280 580 H1380 L1368 694 H1292 Z" fill="url(#lr-dots-b)" />
          <path d={paperRect(1274, 570, 112, 18, { seed: 69, j: 1 })} fill={K.blueDark} />
        </g>
      </Hot>

      {/* ============================ DEPTH: the background recedes ============================ */}
      <rect width="1600" height="900" fill="#eef1e4" opacity="0.3" style={{ pointerEvents: "none" }} />

      {/* ============================ RUG ============================ */}
      {/* muted dusty sage, hand-cut edge, flat fill + paper grain (no outline, no gradient) */}
      <g filter="url(#lr-ps)">
        <path
          d="M268 708 L410 703 L560 707 L700 702 L860 706 L1010 701 L1160 705 L1342 700 L1360 742 L1374 778 L1391 820 L1412 862 L1240 866 L1080 863 L900 868 L720 864 L540 869 L360 865 L190 870 L208 830 L226 792 L246 750 Z"
          fill={K.rug}
        />
        <path
          d="M268 708 L410 703 L560 707 L700 702 L860 706 L1010 701 L1160 705 L1342 700 L1360 742 L1374 778 L1391 820 L1412 862 L1240 866 L1080 863 L900 868 L720 864 L540 869 L360 865 L190 870 L208 830 L226 792 L246 750 Z"
          fill="url(#lr-rug-grain)"
        />
      </g>
      {/* fringe */}
      <g stroke={K.rugDark} strokeWidth="3">
        {Array.from({ length: 62 }, (_, i) => {
          const x = 196 + i * 19.6;
          return <path key={i} d={`M${x} 868 v14`} />;
        })}
      </g>
      {/* a few scattered paper shapes (fewer than before), kept away from Milo's spot */}
      {(
        [
          [340, 742, K.cream],
          [560, 736, K.mustardLight],
          [1180, 742, K.blueLight],
          [430, 826, K.terraLight],
          [640, 838, K.lav],
          [1110, 832, K.mustardLight],
          [1290, 818, K.cream],
          [1010, 754, K.lav],
          [1340, 846, K.terraLight],
        ] as const
      ).map(([x, y, c], i) => (
        <path key={i} d={`M${x} ${y - 16} l34 16 l-34 16 l-34 -16 Z`} fill={c} opacity="0.9" />
      ))}

      {/* ============================ SOFA (cropped left) ============================ */}
      <g filter="url(#lr-ps)">
        {/* back */}
        <path d="M-40 380 C-40 352 -10 340 30 340 L640 346 C680 346 704 362 704 392 L700 560 L-40 560 Z" fill="url(#lr-terra-grain)" />
        {/* seat cushions */}
        <path d={paperRect(-30, 520, 340, 112, { seed: 71, j: 2 })} fill={K.sofaLight} />
        <path d={paperRect(316, 520, 330, 112, { seed: 72, j: 2 })} fill={K.sofaLight} />
        {/* right arm */}
        <path d="M612 450 C612 428 632 418 666 418 C704 418 752 428 752 456 L748 660 L612 660 Z" fill={K.sofa} />
        <path d="M612 450 C612 430 640 424 676 424 C716 424 744 434 748 452" stroke={K.sofaDark} strokeWidth="2" fill="none" opacity="0.5" />
        {/* base */}
        <path d={paperRect(-40, 624, 790, 54, { seed: 73, j: 1.5 })} fill={K.sofaDark} />
      </g>
      {/* stitched pencil seams */}
      <path d="M-20 520 H640 M316 526 V626" {...P} strokeWidth="1.5" strokeDasharray="5 6" opacity="0.4" />
      {/* legs */}
      <path d="M40 678 l6 30 h14 l4 -30 Z M600 678 l6 30 h14 l4 -30 Z M716 678 l4 30 h12 l4 -30 Z" fill={K.woodDark} />
      {/* the dark gap under the sofa */}
      <path d="M-40 678 H748 V692 H-40 Z" fill="#6a4a36" opacity="0.35" />

      {/* cushions + blue throw (tappable) */}
      <Hot id="cushions" poke={poke} onTap={onTap} origin="50% 100%">
        <g filter="url(#lr-ps-sm)">
          {/* cream cushion with leaves */}
          <path d="M14 404 C10 386 26 378 60 380 L166 386 C182 388 188 400 184 418 L172 536 C170 552 158 556 140 554 L36 548 C20 546 16 536 16 522 Z" fill={K.linen} />
          {[[60, 430, -60], [110, 444, -120], [70, 490, -40], [130, 500, -140], [96, 470, -90]].map(([x, y, a], i) => (
            <path key={i} d={leaf(x, y, 34, 10, a)} fill={i % 2 ? K.sage : K.sageDark} />
          ))}
          {/* mustard plaid cushion */}
          <path d="M176 430 C176 418 186 414 206 416 L318 422 C334 424 338 434 334 448 L322 516 C320 526 312 530 298 528 L192 522 C180 520 176 512 176 500 Z" fill="url(#lr-plaid-linen)" />
          {/* blue throw with fringe, draped over the back */}
          <path d="M404 360 C440 352 560 352 604 362 L612 540 L404 540 Z" fill={K.ochre} />
          <path d="M404 360 L604 362 L606 384 L404 384 Z" fill={K.ochreDark} opacity="0.6" />
          <g stroke={K.ochreLight} strokeWidth="3" opacity="0.8">
            <path d="M412 410 H604 M412 500 H606" />
            <path d="M440 396 V530 M574 396 V530" />
          </g>
          {/* little bird embroidered on the throw */}
          <path d={paperBlob(512, 452, 22, 16, { seed: 18 })} fill={K.cream} />
          <circle cx="528" cy="438" r="10" fill={K.cream} />
          <circle cx="531" cy="436" r="2" fill={K.pencil} />
          <path d="M538 440 l7 2 l-7 3" fill={K.terra} />
          <g stroke={K.cream} strokeWidth="2.5">
            {Array.from({ length: 18 }, (_, i) => (
              <path key={i} d={`M${410 + i * 11} 540 v18`} />
            ))}
          </g>
        </g>
      </Hot>

      {/* ============================ FOREGROUND ============================ */}
      {/* pink pouf, cropped bottom-right */}
      <Hot id="pouf" poke={poke} onTap={onTap} origin="50% 100%">
        <g filter="url(#lr-ps)">
          <path d={paperBlob(1546, 714, 100, 66, { seed: 19, j: 0.04 })} fill={K.pink} />
          <path d={paperBlob(1546, 696, 80, 34, { seed: 20, j: 0.05 })} fill="#f0b7c0" />
          {[1490, 1520, 1550, 1580].map((x) => (
            <path key={x} d={`M${x} 680 Q${x - 6} 720 ${x} 770`} stroke={K.pinkDark} strokeWidth="2.5" fill="none" opacity="0.7" />
          ))}
        </g>
      </Hot>

      {/* stack of picture books, bottom-left */}
      <Hot id="books" poke={poke} onTap={onTap} origin="50% 100%">
        <g filter="url(#lr-ps)">
          <path d={paperRect(232, 846, 280, 46, { seed: 81 })} fill={K.sageDark} />
          <path d={paperRect(218, 810, 262, 40, { seed: 82 })} fill={K.mustard} />
          <path d={paperRect(226, 778, 248, 36, { seed: 83 })} fill={K.sage} />
          <g transform="rotate(-4 330 750)">
            <path d={paperRect(202, 724, 220, 56, { seed: 84 })} fill={K.blue} />
            <path d="M202 772 H422" stroke={K.cream} strokeWidth="4" opacity="0.8" />
            {/* a little mustard bird on the cover */}
            <path d={paperBlob(300, 750, 22, 13, { seed: 21 })} fill={K.mustardLight} />
            <circle cx="320" cy="740" r="8" fill={K.mustardLight} />
            <path d="M327 741 l6 2 l-6 2" fill={K.terra} />
          </g>
          {[812, 852].map((y) => (
            <path key={y} d={`M226 ${y + 16} H470`} stroke={K.cream} strokeWidth="2" opacity="0.6" />
          ))}
        </g>
      </Hot>

      {/* pink toy block */}
      <Hot id="toy-block" poke={poke} onTap={onTap} origin="50% 100%">
        <g filter="url(#lr-ps-sm)">
          <path d="M544 820 V780 H610 V820 H592 C592 806 562 806 562 820 Z" fill={K.pinkDark} />
          <path d="M544 780 L556 770 H620 L610 780 Z" fill={K.pink} />
        </g>
      </Hot>

      {/* yellow pencil */}
      <Hot id="pencil" poke={poke} onTap={onTap} origin="50% 50%">
        <g transform="rotate(38 644 780)" filter="url(#lr-ps-sm)">
          <rect x="606" y="772" width="76" height="14" fill={K.mustard} />
          <path d="M682 772 L700 779 L682 786 Z" fill={K.creamDark} />
          <path d="M694 777 L700 779 L694 781 Z" fill={K.pencil} />
          <rect x="598" y="772" width="10" height="14" fill={K.pink} />
        </g>
      </Hot>

      {/* green marble */}
      <Hot id="ball" poke={poke} onTap={onTap} origin="50% 50%">
        <g filter="url(#lr-ps-sm)">
          <circle cx="1194" cy="766" r="28" fill={K.sage} />
          <path d="M1170 760 C1184 744 1204 784 1218 766" stroke={K.sageLight} strokeWidth="5" fill="none" />
          <circle cx="1184" cy="754" r="5" fill="#fff" opacity="0.6" />
        </g>
      </Hot>

      {/* red toy car */}
      <Hot id="car" poke={poke} onTap={onTap} origin="50% 100%">
        <g filter="url(#lr-ps-sm)">
          <path d="M1064 840 V818 C1064 808 1072 804 1082 804 L1100 784 H1138 L1156 804 C1166 806 1170 812 1170 820 V840 Z" fill={K.terra} />
          <path d="M1104 790 H1134 L1146 804 H1094 Z" fill={K.skyLight} />
          <path d="M1119 790 V804" stroke={K.terra} strokeWidth="3" />
          <circle cx="1090" cy="842" r="12" fill="#3f3a40" />
          <circle cx="1146" cy="842" r="12" fill="#3f3a40" />
          <circle cx="1090" cy="842" r="4" fill={K.cream} />
          <circle cx="1146" cy="842" r="4" fill={K.cream} />
        </g>
      </Hot>

      {/* foreground plant, bottom-left (cropped) */}
      <g style={{ pointerEvents: "none" }}>
        {[
          [-20, 900, -60, 220],
          [10, 900, -78, 250],
          [-30, 860, -30, 170],
          [40, 900, -95, 190],
          [70, 900, -110, 160],
        ].map(([x, y, a, l], i) => (
          <path key={i} d={leaf(x, y, l, l * 0.22, a)} fill={i % 2 ? K.leaf : K.sageDark} />
        ))}
      </g>
      {/* soft edge vignette: the eye settles in the middle, on Milo */}
      <rect width="1600" height="900" fill="url(#lr-vignette)" style={{ pointerEvents: "none" }} />
    </svg>
  );
}

/** A row of books with slightly varied heights and a pencil spine line. */
function Books({ x, y, h, colors }: { x: number; y: number; h: number; colors: string[] }) {
  let cx = x;
  return (
    <g filter="url(#lr-ps-sm)">
      {colors.map((c, i) => {
        const w = 18 + ((i * 7) % 3) * 6;
        const bh = h - ((i * 5) % 3) * 12;
        const el = (
          <g key={i}>
            <path d={paperRect(cx, y + (h - bh), w, bh, { seed: 90 + i, j: 1, step: 30 })} fill={c} />
            <path d={`M${cx + 4} ${y + (h - bh) + 12} H${cx + w - 4}`} stroke="#fbf6ea" strokeWidth="2" opacity="0.6" />
          </g>
        );
        cx += w + 2;
        return el;
      })}
    </g>
  );
}
