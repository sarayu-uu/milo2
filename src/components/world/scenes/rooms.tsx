/**
 * ROOM SCENES for Milo's World: the painted background of each room
 * (walls, tiles, counters, stove, the brick garden wall…), 1600×900, vector,
 * so they scale to any screen and to the house-map miniatures.
 *
 * The things you can TAP are not drawn here: they're room objects
 * (data/worlds/rooms.ts) drawn by SCENE_ART below, so they keep their
 * wiggles, reveal rules and activity links.
 */
import type { ReactNode } from "react";
import type { RoomArt } from "../roomArt";

/* ---------- shared bits ---------- */

const C = {
  ink: "#3a3833",
  wood: "#b9814f",
  woodDark: "#91603a",
  woodLight: "#d4a476",
  cream: "#f6ecd7",
  terra: "#d4694a",
  terraDark: "#b95640",
  mustard: "#e8b84a",
  mustardDark: "#c99a2c",
  leaf: "#5e8c56",
  leafLight: "#7cae6c",
  blue: "#6f8fb4",
  blueDark: "#5f7da1",
  sky: "#a9d6f0",
  pink: "#e8a2ad",
  lav: "#b4a8cd",
};

function Leaf({ x, y, r = 0, s = 1, fill = C.leaf }: { x: number; y: number; r?: number; s?: number; fill?: string }) {
  return <path d="M0 0 C-10 -18 -6 -34 0 -40 C6 -34 10 -18 0 0 Z" fill={fill} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />;
}

/** A trailing plant in a pot (pot top-centre at x,y). */
function TrailingPlant({ x, y, pot = C.terra, s = 1 }: { x: number; y: number; pot?: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-34 0 H34 L26 46 H-26 Z" fill={pot} />
      <rect x={-38} y={-6} width={76} height={12} rx={4} fill={pot} opacity={0.85} />
      {[-40, -20, 0, 20, 40].map((a, i) => (
        <Leaf key={a} x={(i - 2) * 12} y={-4} r={a} s={1.1} fill={i % 2 ? C.leaf : C.leafLight} />
      ))}
      <path d="M-30 4 C-44 40 -40 80 -50 110 M30 4 C40 40 36 70 44 96" stroke={C.leaf} strokeWidth={4} fill="none" />
      {[[-46, 40], [-44, 70], [-50, 100], [40, 36], [38, 62], [44, 90]].map(([lx, ly]) => (
        <Leaf key={`${lx}-${ly}`} x={lx} y={ly} r={lx < 0 ? -120 : 120} s={0.7} />
      ))}
    </g>
  );
}

function Tiles({ id, fill, grout, size = 80, h }: { id: string; fill: string; grout: string; size?: number; h: number }) {
  return (
    <>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <rect width={size} height={size} fill={fill} />
          <path d={`M0 0 H${size} M0 0 V${size}`} stroke={grout} strokeWidth={4} />
        </pattern>
      </defs>
      <rect width={1600} height={h} fill={`url(#${id})`} />
    </>
  );
}

function Scene({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

/* ================================================================== */
/* KITCHEN                                                             */
/* ================================================================== */

const K_FLOOR = 745;
const K_TOP = 505;

export function KitchenScene() {
  return (
    <Scene label="Kitchen">
      <Tiles id="ks-tile" fill="#e2ecd6" grout="#cfddc1" h={K_FLOOR} />

      {/* top shelf: a trailing plant, stacked bowls, the big red pot */}
      <rect x={340} y={200} width={380} height={14} rx={4} fill={C.wood} />
      <path d="M380 214 l14 26 M680 214 l-14 26" stroke={C.woodDark} strokeWidth={9} strokeLinecap="round" />
      <TrailingPlant x={410} y={154} pot="#5f7da1" s={0.85} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${474 + i * 3} ${196 - i * 14} H${558 - i * 3} C${552 - i * 3} ${184 - i * 14} ${480 + i * 3} ${184 - i * 14} ${474 + i * 3} ${196 - i * 14} Z`} fill={i % 2 ? "#ece2cc" : C.cream} />
      ))}
      <g transform="translate(640 200)">
        <path d="M-56 0 V-58 C-56 -70 56 -70 56 -58 V0 Z" fill={C.terra} />
        <path d="M-60 -60 C-60 -78 60 -78 60 -60 Z" fill={C.terraDark} />
        <rect x={-8} y={-86} width={16} height={12} rx={4} fill={C.terraDark} />
        <rect x={-74} y={-44} width={18} height={10} rx={4} fill={C.terraDark} />
        <rect x={56} y={-44} width={18} height={10} rx={4} fill={C.terraDark} />
      </g>

      {/* the range hood + its chimney */}
      <rect x={1388} y={0} width={86} height={128} fill="#3f4656" />
      <path d="M1296 236 L1340 122 H1522 L1566 236 Z" fill="#3f4656" />
      <rect x={1290} y={228} width={282} height={22} rx={6} fill="#353b49" />
      <rect x={1500} y={234} width={34} height={6} rx={3} fill="#5c6474" />

      {/* utensil rail: pan, spatula, ladle */}
      <rect x={1330} y={268} width={210} height={10} rx={5} fill="#8d8a8f" />
      <circle cx={1330} cy={273} r={9} fill="#8d8a8f" />
      <circle cx={1540} cy={273} r={9} fill="#8d8a8f" />
      <path d="M1384 278 V326" stroke="#5f6b7a" strokeWidth={8} />
      <circle cx={1384} cy={370} r={48} fill="#2f3a4f" />
      <circle cx={1384} cy={370} r={35} fill="#46536b" />
      <rect x={1446} y={278} width={10} height={86} rx={4} fill={C.wood} />
      <path d="M1434 362 H1468 L1464 414 H1438 Z" fill={C.wood} />
      <path d="M1444 372 V404 M1451 372 V404 M1458 372 V404" stroke={C.woodDark} strokeWidth={3} />
      <rect x={1502} y={278} width={9} height={86} rx={4} fill={C.terra} />
      <ellipse cx={1506} cy={378} rx={24} ry={16} fill={C.terra} />

      {/* cutting board, spoon jar, soap: on the counter */}
      <g transform={`translate(340 ${K_TOP})`}>
        <path d="M-40 0 V-104 C-40 -116 40 -116 40 -104 V0 Z" fill={C.woodLight} />
        <rect x={-14} y={-150} width={28} height={50} rx={14} fill={C.woodLight} />
        <circle cx={0} cy={-132} r={7} fill="#e2ecd6" />
        <path d="M-24 -86 V-10 M0 -90 V-14 M24 -86 V-10" stroke={C.wood} strokeWidth={2} opacity={0.5} />
      </g>
      <g transform={`translate(424 ${K_TOP})`}>
        <path d="M-26 0 V-62 H26 V0 Z" fill="#f4f0ea" />
        <path d="M-10 -62 C-14 -100 0 -116 6 -98 C8 -86 0 -72 -6 -62 Z M12 -62 C18 -100 34 -104 34 -88 C32 -78 22 -70 16 -62 Z" fill={C.wood} />
      </g>
      <g transform={`translate(800 ${K_TOP})`}>
        <path d="M-20 0 V-56 C-20 -66 20 -66 20 -56 V0 Z" fill="#7cae6c" />
        <rect x={-6} y={-82} width={12} height={20} fill="#5e8c56" />
        <path d="M-6 -80 H-22" stroke="#5e8c56" strokeWidth={8} strokeLinecap="round" />
      </g>
      {/* a pot plant to the right of the sink */}
      <g transform={`translate(1154 ${K_TOP})`}>
        <path d="M-34 0 L-40 -60 H40 L34 0 Z" fill={C.terra} />
        {[-50, -25, 0, 25, 50].map((a, i) => (
          <Leaf key={a} x={(i - 2) * 9} y={-58} r={a} s={1.5} fill={i % 2 ? C.leaf : C.leafLight} />
        ))}
      </g>

      {/* the counter: worktop, blue cupboards (drawers on the left) */}
      <rect x={270} y={K_TOP - 4} width={1030} height={28} rx={6} fill="#f1e4cc" />
      <rect x={1536} y={K_TOP - 4} width={70} height={28} rx={6} fill="#f1e4cc" />
      <rect x={280} y={K_TOP + 24} width={1012} height={K_FLOOR - K_TOP - 24} fill="#eac46a" />
      <rect x={1540} y={K_TOP + 24} width={66} height={K_FLOOR - K_TOP - 24} fill="#eac46a" />
      <path d={`M520 ${K_TOP + 24} V${K_FLOOR} M770 ${K_TOP + 24} V${K_FLOOR} M1030 ${K_TOP + 24} V${K_FLOOR} M1160 ${K_TOP + 24} V${K_FLOOR} M280 ${K_TOP + 96} H520 M280 ${K_TOP + 168} H520`} stroke="#d2a845" strokeWidth={6} />
      {[[400, K_TOP + 62], [400, K_TOP + 134], [400, K_TOP + 202], [548, K_TOP + 110], [1004, K_TOP + 110], [1058, K_TOP + 110], [1186, K_TOP + 110]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={10} fill="#fbf8f1" />
      ))}

      {/* the stove: cooktop, knobs, oven with a yellow tea towel */}
      <defs>
        <pattern id="ks-gingham" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={C.mustard} />
          <path d="M8 0 V16 M0 8 H16" stroke="#f6dc8a" strokeWidth="4" opacity="0.9" />
        </pattern>
      </defs>
      <rect x={1300} y={K_TOP + 14} width={236} height={K_FLOOR - K_TOP + 6} fill="#56657f" />
      <rect x={1294} y={K_TOP - 2} width={248} height={22} rx={4} fill="#2f3a4f" />
      {[1350, 1418, 1486].map((x) => (
        <circle key={x} cx={x} cy={K_TOP + 58} r={15} fill="#2f3a4f" />
      ))}
      <rect x={1318} y={K_TOP + 104} width={200} height={128} rx={8} fill="#2f3a4f" />
      <rect x={1336} y={K_TOP + 124} width={164} height={90} rx={4} fill="#1f2738" />
      <rect x={1336} y={K_TOP + 108} width={164} height={9} rx={4} fill="#c7ccd3" />
      <path d={`M1398 ${K_TOP + 106} H1462 V${K_TOP + 232} H1398 Z`} fill="url(#ks-gingham)" />

      {/* floor */}
      <defs>
        <pattern id="ks-floor" width="260" height="56" patternUnits="userSpaceOnUse" y={K_FLOOR}>
          <rect width="260" height="56" fill="#d6a877" />
          <path d="M0 55 H260 M170 0 V56" stroke="#c4955f" strokeWidth="3" />
        </pattern>
      </defs>
      <rect y={K_FLOOR} width={1600} height={900 - K_FLOOR} fill="url(#ks-floor)" />
      <rect y={K_FLOOR} width={1600} height={10} fill={C.ink} opacity={0.07} />
      {/* a little striped rug in front of the sink */}
      <rect x={700} y={820} width={300} height={52} rx={8} fill="#f1e4cc" />
      <path d="M730 820 V872 M780 820 V872 M830 820 V872 M880 820 V872 M930 820 V872" stroke={C.terra} strokeWidth={10} opacity={0.75} />
    </Scene>
  );
}

/* ================================================================== */
/* WASHROOM                                                            */
/* ================================================================== */

const W_FLOOR = 700;

export function WashroomScene() {
  return (
    <Scene label="Washroom">
      <Tiles id="ws-tile" fill="#f7e1d2" grout="#ecc9b4" size={84} h={W_FLOOR} />

      {/* towel shelf: plant, folded towels, bottles */}
      <rect x={40} y={238} width={400} height={14} rx={4} fill={C.wood} />
      <path d="M80 252 l12 22 M400 252 l-12 22" stroke={C.woodDark} strokeWidth={8} strokeLinecap="round" />
      <TrailingPlant x={90} y={192} s={0.8} />
      {[["#e8b84a", 0], ["#d4694a", 22], ["#6f8fb4", 44]].map(([c, dy]) => (
        <rect key={`${dy}`} x={160} y={170 + (dy as number)} width={110} height={22} rx={8} fill={c as string} />
      ))}
      <rect x={300} y={168} width={32} height={70} rx={9} fill={C.pink} />
      <rect x={310} y={156} width={12} height={14} fill="#c98a92" />
      <rect x={346} y={180} width={32} height={58} rx={9} fill="#8fae7e" />
      <rect x={356} y={168} width={12} height={14} fill="#6f8f60" />

      {/* towel ring with a yellow towel */}
      <circle cx={880} cy={300} r={26} fill="none" stroke="#8d8a8f" strokeWidth={8} />
      <rect x={872} y={258} width={16} height={18} rx={4} fill="#8d8a8f" />
      <path d="M848 320 H912 L918 470 H842 Z" fill={C.mustard} />
      <g fill="#f6dc8a">
        {[[860, 350], [890, 380], [866, 420], [898, 446]].map(([x, y]) => (
          <circle key={`${x}`} cx={x} cy={y} r={5} />
        ))}
      </g>

      {/* window with blinds (right) */}
      <rect x={1440} y={80} width={190} height={320} rx={8} fill={C.wood} />
      <rect x={1460} y={100} width={150} height={280} fill="#cfe8d0" />
      <path d="M1460 300 C1500 260 1560 280 1610 250 V380 H1460 Z" fill="#7cae6c" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={1460} y={104 + i * 16} width={150} height={7} fill="#e6d6b4" opacity={0.85} />
      ))}
      {/* small shelf on the right: soap + plant */}
      <rect x={1290} y={312} width={130} height={12} rx={4} fill={C.wood} />
      <rect x={1302} y={262} width={26} height={50} rx={8} fill={C.pink} />
      <TrailingPlant x={1384} y={278} s={0.55} />

      {/* bidet spray + paper roll, by the toilet */}
      <path d="M96 470 C80 520 90 600 130 640" stroke="#8d8a8f" strokeWidth={8} fill="none" />
      <rect x={84} y={452} width={26} height={40} rx={8} fill="#a7a198" />
      <rect x={378} y={470} width={42} height={12} rx={4} fill="#8d8a8f" />
      <rect x={384} y={482} width={34} height={44} rx={6} fill="#fbf8f1" />

      {/* floor tiles, a pink bath mat, a big plant */}
      <defs>
        <pattern id="ws-floor" width="120" height="50" patternUnits="userSpaceOnUse" y={W_FLOOR}>
          <rect width="120" height="50" fill="#dba98f" />
          <path d="M0 0 H120 M0 0 V50" stroke="#c99179" strokeWidth="4" />
        </pattern>
      </defs>
      <rect y={W_FLOOR} width={1600} height={900 - W_FLOOR} fill="url(#ws-floor)" />
      <rect y={W_FLOOR} width={1600} height={10} fill={C.ink} opacity={0.08} />
      <rect x={880} y={790} width={360} height={64} rx={22} fill="#a8c49a" />
      {/* a green step stool */}
      <path d="M50 650 H190 V666 H178 V704 H160 V666 H80 V704 H62 V666 H50 Z" fill="#7cae6c" />
      {/* big plant in a woven pot */}
      <g transform="translate(1530 700)">
        <path d="M-56 0 L-64 -96 H64 L56 0 Z" fill="#d68a5c" />
        <path d="M-60 -70 H60 M-58 -44 H58 M-56 -20 H56" stroke="#b96f45" strokeWidth={4} />
        {[-60, -35, -12, 12, 35, 60].map((a, i) => (
          <Leaf key={a} x={(i - 2.5) * 14} y={-94} r={a} s={2.6} fill={i % 2 ? C.leaf : C.leafLight} />
        ))}
      </g>
    </Scene>
  );
}

/* ================================================================== */
/* GARDEN                                                              */
/* ================================================================== */

const G_WALL = 400;
const G_GRASS = 610;

export function GardenScene() {
  return (
    <Scene label="Garden">
      <defs>
        <linearGradient id="gs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd3f2" />
          <stop offset="1" stopColor="#d5eef8" />
        </linearGradient>
        <pattern id="gs-brick" width="120" height="44" patternUnits="userSpaceOnUse" y={G_WALL + 18}>
          <rect width="120" height="44" fill="#dcae7e" />
          <path d="M0 21 H120 M0 43 H120 M60 0 V21 M0 21 V43 M120 21 V43" stroke="#c99a6c" strokeWidth="3" />
        </pattern>
      </defs>
      <rect width={1600} height={G_GRASS} fill="url(#gs-sky)" />
      <path d="M560 110 c-36 0 -44 -40 -10 -48 8 -32 62 -32 70 -6 34 -8 58 26 32 54 Z" fill="#ffffff" />
      <path d="M980 70 c-30 0 -36 -34 -8 -40 6 -26 52 -26 58 -6 28 -6 48 22 26 46 Z" fill="#ffffff" opacity={0.9} />

      {/* the city beyond: blocks, a water tower, a palm */}
      {[
        [390, 250, 110, "#e8a6b4"],
        [510, 290, 80, "#a8c4e8"],
        [720, 230, 120, "#c5b1df"],
        [850, 270, 90, "#f1dfb6"],
        [950, 240, 110, "#c5b1df"],
        [1070, 290, 80, "#e8a6b4"],
      ].map(([x, y, w, c]) => (
        <g key={`${x}`}>
          <rect x={x as number} y={y as number} width={w as number} height={G_WALL - (y as number)} fill={c as string} />
          {Array.from({ length: 4 }, (_, i) => (
            <rect key={i} x={(x as number) + 16 + (i % 2) * ((w as number) / 2)} y={(y as number) + 20 + Math.floor(i / 2) * 40} width={18} height={20} fill="#fbf8f1" opacity={0.7} />
          ))}
        </g>
      ))}
      <g transform="translate(640 180)" fill="#5f7d9b">
        <rect x={-34} y={0} width={68} height={56} rx={6} />
        <path d="M-40 0 L0 -26 L40 0 Z" />
        <path d="M-22 56 L-28 150 M22 56 L28 150 M-26 100 H26" stroke="#5f7d9b" strokeWidth={7} />
      </g>
      <g transform="translate(1210 400)">
        <path d="M0 0 C4 -60 8 -110 14 -160" stroke="#8d6a43" strokeWidth={10} fill="none" />
        {[-70, -30, 10, 50, 90, 140].map((a) => (
          <path key={a} d="M14 -160 C40 -170 70 -160 90 -140" stroke="#5e8c56" strokeWidth={12} fill="none" strokeLinecap="round" transform={`rotate(${a} 14 -160)`} />
        ))}
      </g>
      {/* trees and bushes behind the wall */}
      <path d="M0 360 C80 300 180 300 240 350 C320 290 420 300 470 360 C560 320 640 330 700 370 C760 330 860 330 920 370 C1000 320 1100 320 1160 370 C1240 320 1340 310 1400 360 C1470 310 1560 320 1600 350 V420 H0 Z" fill="#6fa463" />
      <path d="M0 390 C120 360 260 380 400 390 C600 370 800 392 1000 384 C1200 370 1400 392 1600 380 V420 H0 Z" fill="#5e8c56" />

      {/* the brick wall with a stone top, and vines over it */}
      <rect y={G_WALL + 18} width={1600} height={G_GRASS - G_WALL - 18} fill="url(#gs-brick)" />
      <rect x={-10} y={G_WALL} width={1620} height={22} rx={5} fill="#ead8b6" />
      {[160, 520, 880, 1060, 1420].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${G_WALL + 20} c-12 40 12 70 -2 110 M${x + 34} ${G_WALL + 20} c10 34 -8 54 6 90`} stroke={C.leaf} strokeWidth={6} fill="none" strokeLinecap="round" />
          {[30, 60, 92].map((dy, j) => (
            <Leaf key={dy} x={x + (j % 2 ? 10 : -10)} y={G_WALL + 20 + dy} r={j % 2 ? 140 : -140} s={0.8} fill={i % 2 ? C.leafLight : C.leaf} />
          ))}
          {i % 2 === 0 && (
            <g transform={`translate(${x + 18} ${G_WALL + 50})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx={0} cy={-7} rx={5} ry={7} fill={C.pink} transform={`rotate(${a})`} />
              ))}
              <circle r={4} fill={C.mustard} />
            </g>
          )}
        </g>
      ))}
      {/* pots on top of the wall */}
      <TrailingPlant x={760} y={G_WALL - 34} s={0.7} />
      <TrailingPlant x={1310} y={G_WALL - 34} pot={C.mustard} s={0.7} />

      {/* grass */}
      <rect y={G_GRASS} width={1600} height={900 - G_GRASS} fill="#8fc277" />
      <rect y={G_GRASS} width={1600} height={26} fill="#7cae6c" />
      {Array.from({ length: 30 }, (_, i) => (
        <path key={i} d={`M${30 + i * 54} ${700 + ((i * 37) % 3) * 70} l-6 -16 M${36 + i * 54} ${700 + ((i * 37) % 3) * 70} l6 -18`} stroke="#6fa463" strokeWidth={5} strokeLinecap="round" />
      ))}
      {[[640, 860, "#fbf8f1"], [980, 820, "#fbf8f1"], [1110, 880, "#f2a6b0"], [560, 760, "#f2a6b0"], [1500, 870, "#fbf8f1"]].map(([x, y, c]) => (
        <g key={`${x}`} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-9} rx={6} ry={9} fill={c as string} transform={`rotate(${a})`} />
          ))}
          <circle r={5} fill={C.mustard} />
        </g>
      ))}
      {/* bushes in the front corners */}
      <path d="M1440 900 C1420 830 1470 790 1520 810 C1550 770 1610 780 1610 820 V900 Z" fill={C.leaf} />
      <path d="M-10 900 V820 C30 790 80 800 90 840 C120 830 150 860 140 900 Z" fill={C.leafLight} />
    </Scene>
  );
}

/* ================================================================== */
/* TAPPABLE OBJECTS (merged into ROOM_ART)                             */
/* ================================================================== */

export const SCENE_ART: Record<string, RoomArt> = {
  /* ---------- kitchen ---------- */
  "k-fridge": {
    w: 270,
    h: 600,
    draw: () => (
      <g>
        <rect x={10} y={40} width={250} height={556} rx={34} fill="#7fa6cf" />
        <rect x={10} y={40} width={250} height={556} rx={34} fill="none" stroke="#5f86b2" strokeWidth={6} />
        <path d="M10 250 H260" stroke="#5f86b2" strokeWidth={6} />
        <rect x={50} y={300} width={22} height={130} rx={11} fill="#3f4656" />
        {/* notes and magnets */}
        <g transform="rotate(-6 100 140)">
          <rect x={60} y={100} width={80} height={90} rx={4} fill="#f6f1e6" />
          <path d="M100 160 C80 146 80 124 100 134 C120 124 120 146 100 160 Z" fill={C.terra} />
          <circle cx={100} cy={100} r={9} fill={C.blue} />
        </g>
        <g transform="rotate(5 190 330)">
          <rect x={150} y={290} width={84} height={100} rx={4} fill="#f6ecd7" />
          <path d="M162 320 H222 M162 340 H222 M162 360 H206" stroke="#cdbb9a" strokeWidth={4} />
          <circle cx={192} cy={290} r={9} fill={C.terra} />
        </g>
        <g transform="translate(190 470)">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-14} rx={9} ry={14} fill="#f6dc8a" transform={`rotate(${a})`} />
          ))}
          <circle r={8} fill={C.terra} />
        </g>
        {/* the plant on top, trailing over the edge */}
        <TrailingPlant x={120} y={-6} s={0.9} />
      </g>
    ),
  },
  "k-cups": {
    w: 380,
    h: 110,
    draw: () => (
      <g>
        <rect x={0} y={84} width={380} height={14} rx={4} fill={C.wood} />
        <path d="M40 98 l12 12 M340 98 l-12 12" stroke={C.woodDark} strokeWidth={7} strokeLinecap="round" />
        {["#efb08c", "#7fa6cf", "#e8b84a", "#e8a2ad"].map((c, i) => (
          <g key={c} transform={`translate(${14 + i * 62} 30)`}>
            <path d="M0 0 H44 L40 54 H4 Z" fill={c} />
            <path d="M44 14 C62 14 62 38 42 38" stroke={c} strokeWidth={7} fill="none" />
          </g>
        ))}
        {/* jars of biscuits and flour */}
        <g transform="translate(286 10)">
          <rect x={0} y={10} width={40} height={64} rx={8} fill="#e9f1f4" opacity={0.9} />
          <rect x={4} y={0} width={32} height={12} rx={4} fill={C.wood} />
          {[[12, 30], [26, 40], [14, 54], [28, 60]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={6} fill="#b9814f" />
          ))}
        </g>
        <g transform="translate(334 14)">
          <rect x={0} y={10} width={40} height={60} rx={8} fill="#e9f1f4" opacity={0.9} />
          <rect x={4} y={0} width={32} height={12} rx={4} fill={C.wood} />
          <rect x={4} y={34} width={32} height={34} rx={4} fill="#f6f1e6" />
        </g>
      </g>
    ),
  },
  "k-window": {
    w: 560,
    h: 380,
    draw: () => (
      <g>
        <defs>
          <pattern id="kw-check" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="#f6ecd7" />
            <path d="M15 0 V30 M0 15 H30" stroke="#e3cfa6" strokeWidth="7" opacity="0.85" />
          </pattern>
          <clipPath id="kw-glass">
            <rect x={110} y={56} width={340} height={292} />
          </clipPath>
        </defs>
        <rect x={92} y={38} width={376} height={328} rx={8} fill={C.wood} />
        <g clipPath="url(#kw-glass)">
          <rect x={110} y={56} width={340} height={292} fill="#a9d6f0" />
          <path d="M150 110 c-26 0 -30 -30 -6 -34 6 -22 44 -22 50 -6 24 -6 42 18 24 34 Z" fill="#ffffff" />
          <circle cx={392} cy={112} r={28} fill="#f6d04d" />
          {[
            [110, 230, 70, "#e8a6b4"],
            [176, 260, 60, "#a8c4e8"],
            [240, 216, 60, "#f1dfb6"],
            [300, 250, 70, "#c5b1df"],
            [372, 220, 80, "#a8c4e8"],
          ].map(([x, y, w, c]) => (
            <rect key={`${x}`} x={x as number} y={y as number} width={w as number} height={160} fill={c as string} />
          ))}
          <g transform="translate(212 170)" fill="#5f6b7a">
            <rect x={-20} y={0} width={40} height={34} rx={4} />
            <path d="M-24 0 L0 -16 L24 0 Z" />
            <path d="M-12 34 L-16 80 M12 34 L16 80 M-14 58 H14" stroke="#5f6b7a" strokeWidth={4} />
          </g>
          <path d="M110 320 C180 280 240 300 300 296 C360 292 410 270 450 290 V348 H110 Z" fill="#6fa463" />
        </g>
        <path d="M280 56 V348 M110 56 H450" stroke={C.wood} strokeWidth={16} />
        <rect x={80} y={354} width={400} height={20} rx={5} fill={C.woodLight} />
        {/* rod + checked curtains */}
        <rect x={28} y={12} width={504} height={12} rx={6} fill={C.wood} />
        <circle cx={24} cy={18} r={14} fill={C.wood} />
        <circle cx={536} cy={18} r={14} fill={C.wood} />
        <path d="M44 22 H150 C142 140 150 260 136 372 H44 Z" fill="url(#kw-check)" />
        <path d="M516 22 H410 C418 140 410 260 424 372 H516 Z" fill="url(#kw-check)" />
      </g>
    ),
  },
  "k-fruit": {
    w: 190,
    h: 120,
    draw: () => (
      <g>
        <path d="M118 66 C120 30 148 12 168 18 C160 26 150 46 146 70 Z" fill="#f2cd3d" />
        <circle cx={66} cy={56} r={26} fill="#d94a3e" />
        <path d="M66 30 C66 22 72 16 78 14" stroke="#5e8c56" strokeWidth={4} fill="none" />
        <circle cx={108} cy={64} r={22} fill="#ef9a3e" />
        <path d="M12 72 H178 C172 102 140 118 95 118 C50 118 18 102 12 72 Z" fill={C.lav} />
        <path d="M12 72 H178" stroke="#9a8cbd" strokeWidth={6} />
      </g>
    ),
  },
  "k-sink": {
    w: 240,
    h: 110,
    draw: () => (
      <g>
        {/* tap, handles, and the sink's rim in the worktop */}
        <path d="M120 96 V26 C120 6 160 6 160 26 V40" stroke="#8d8a8f" strokeWidth={14} fill="none" strokeLinecap="round" />
        <rect x={74} y={76} width={26} height={20} rx={5} fill="#8d8a8f" />
        <rect x={140} y={76} width={26} height={20} rx={5} fill="#8d8a8f" />
        <rect x={10} y={94} width={220} height={14} rx={6} fill="#e6e1d6" />
      </g>
    ),
  },
  "k-towel": {
    w: 100,
    h: 190,
    draw: () => (
      <g>
        <defs>
          <pattern id="kt-gingham" width="18" height="18" patternUnits="userSpaceOnUse">
            <rect width="18" height="18" fill="#f6ecd7" />
            <path d="M9 0 V18 M0 9 H18" stroke="#e05a52" strokeWidth="6" opacity="0.85" />
          </pattern>
        </defs>
        <path d="M6 0 H94 V176 C94 186 86 190 78 186 H22 C14 190 6 186 6 176 Z" fill="url(#kt-gingham)" />
        <rect x={6} y={0} width={88} height={16} fill="#e05a52" opacity={0.85} />
      </g>
    ),
  },
  "k-pot": {
    w: 150,
    h: 90,
    draw: () => (
      <g>
        <path d="M22 86 V36 H128 V86 Z" fill={C.terra} />
        <path d="M16 38 C16 18 134 18 134 38 Z" fill={C.terraDark} />
        <rect x={64} y={6} width={22} height={14} rx={5} fill={C.terraDark} />
        <rect x={0} y={46} width={24} height={12} rx={5} fill={C.terraDark} />
        <rect x={126} y={46} width={24} height={12} rx={5} fill={C.terraDark} />
      </g>
    ),
  },

  /* ---------- washroom ---------- */
  "w-toilet": {
    w: 200,
    h: 330,
    draw: () => (
      <g>
        <rect x={30} y={0} width={140} height={110} rx={16} fill="#fbf8f1" />
        <rect x={30} y={0} width={140} height={110} rx={16} fill="none" stroke="#d6cfbf" strokeWidth={4} />
        <rect x={130} y={20} width={24} height={10} rx={4} fill="#c7ccd3" />
        <path d="M10 140 H190 C190 220 150 250 130 256 L140 330 H60 L70 256 C50 250 10 220 10 140 Z" fill="#fbf8f1" />
        <path d="M10 140 H190 C190 220 150 250 130 256 L140 330 H60 L70 256 C50 250 10 220 10 140 Z" fill="none" stroke="#d6cfbf" strokeWidth={4} />
        <ellipse cx={100} cy={136} rx={94} ry={18} fill="#f1ece0" stroke="#d6cfbf" strokeWidth={4} />
      </g>
    ),
  },
  "w-mirror": {
    w: 200,
    h: 200,
    draw: () => (
      <g>
        <circle cx={100} cy={100} r={96} fill={C.wood} />
        <circle cx={100} cy={100} r={80} fill="#e8f3f8" />
        <path d="M58 76 L88 46 M66 104 L120 50" stroke="#ffffff" strokeWidth={10} strokeLinecap="round" />
      </g>
    ),
  },
  "w-vanity": {
    w: 320,
    h: 320,
    draw: () => (
      <g>
        {/* tap, basin, cabinet with two doors; toothbrush cup + a little plant */}
        <path d="M160 92 V56 C160 40 188 40 188 56 V66" stroke="#8d8a8f" strokeWidth={10} fill="none" strokeLinecap="round" />
        <rect x={132} y={80} width={18} height={14} rx={4} fill="#8d8a8f" />
        <rect x={172} y={80} width={18} height={14} rx={4} fill="#8d8a8f" />
        <path d="M70 96 H250 C246 122 210 134 160 134 C110 134 74 122 70 96 Z" fill="#fbf8f1" />
        <rect x={20} y={124} width={280} height={24} rx={6} fill="#f6f1e6" />
        <rect x={30} y={148} width={260} height={160} fill={C.wood} />
        <path d="M160 160 V296" stroke={C.woodDark} strokeWidth={5} />
        <rect x={42} y={160} width={106} height={136} rx={6} fill="none" stroke={C.woodDark} strokeWidth={4} />
        <rect x={172} y={160} width={106} height={136} rx={6} fill="none" stroke={C.woodDark} strokeWidth={4} />
        <circle cx={136} cy={228} r={7} fill="#fbf8f1" />
        <circle cx={184} cy={228} r={7} fill="#fbf8f1" />
        <rect x={38} y={302} width={18} height={18} fill={C.woodDark} />
        <rect x={264} y={302} width={18} height={18} fill={C.woodDark} />
        <path d="M34 124 V84 H66 V124 Z" fill={C.mustard} />
        <path d="M42 84 V54 M52 84 V48 M60 84 V58" stroke="#7fa6cf" strokeWidth={6} strokeLinecap="round" />
        <path d="M252 124 L248 96 H292 L288 124 Z" fill={C.terra} />
        {[-40, -15, 15, 40].map((a, i) => (
          <Leaf key={a} x={262 + i * 6} y={96} r={a} s={1.2} fill={i % 2 ? C.leaf : C.leafLight} />
        ))}
      </g>
    ),
  },
  "w-shower": {
    w: 380,
    h: 560,
    draw: () => (
      <g>
        <defs>
          <pattern id="wsh-curtain" width="380" height="140" patternUnits="userSpaceOnUse">
            <rect width="380" height="140" fill="#fbf8f1" />
          </pattern>
        </defs>
        {/* the tub, peeking out under the curtain */}
        <rect x={20} y={440} width={350} height={100} rx={26} fill="#fbf8f1" stroke="#d6cfbf" strokeWidth={4} />
        <rect x={52} y={536} width={16} height={22} fill="#c7ccd3" />
        <rect x={322} y={536} width={16} height={22} fill="#c7ccd3" />
        {/* rail + whale curtain, pulled a little to one side */}
        <rect x={0} y={0} width={380} height={12} rx={6} fill="#8d8a8f" />
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={20 + i * 30} cy={14} r={6} fill="none" stroke="#8d8a8f" strokeWidth={3} />
        ))}
        <path d="M10 18 H270 C266 160 274 300 268 450 C220 462 70 458 14 450 C20 300 6 160 10 18 Z" fill="url(#wsh-curtain)" />
        <path d="M14 420 C40 404 66 436 92 420 C118 404 144 436 170 420 C196 404 222 436 248 420 V452 H14 Z" fill="#a8cfe8" />
        <path d="M50 18 C46 160 54 300 48 450 M110 18 C106 160 114 300 108 450 M180 18 C176 160 184 300 178 450 M236 18 C232 160 240 300 234 450" stroke="#e6e1d6" strokeWidth={3} fill="none" />
        {[[80, 120], [190, 140], [90, 290], [196, 310]].map(([x, y]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            <path d="M-34 6 C-34 -18 4 -26 22 -10 C30 -16 40 -14 40 -6 C34 -4 30 2 30 8 C30 22 10 28 -10 26 C-26 24 -34 16 -34 6 Z" fill="#8fbfe0" />
            <circle cx={-14} cy={0} r={3.5} fill={C.ink} />
            <path d="M-4 -24 C-8 -34 -2 -40 4 -34 M-4 -24 C0 -36 10 -36 10 -28" stroke="#8fbfe0" strokeWidth={4} fill="none" />
          </g>
        ))}
      </g>
    ),
  },
  "w-basket": {
    w: 180,
    h: 180,
    draw: () => (
      <g>
        <path d="M58 40 C70 20 110 20 124 44 L132 60 H52 Z" fill="#fbf8f1" />
        <path d="M14 56 H166 L152 176 H28 Z" fill="#d6a46c" />
        <path d="M20 84 H160 M24 112 H156 M28 140 H152" stroke="#b9814f" strokeWidth={5} />
        <path d="M50 56 L58 176 M90 56 V176 M130 56 L122 176" stroke="#c4925a" strokeWidth={4} />
        <rect x={10} y={50} width={160} height={14} rx={6} fill="#c4925a" />
      </g>
    ),
  },

  /* ---------- garden ---------- */
  "g-bigtree": {
    w: 520,
    h: 700,
    draw: () => (
      <g>
        <path d="M200 700 C214 600 210 480 186 380 C230 420 264 400 280 370 C276 470 270 590 290 700 Z" fill="#8d6a43" />
        <path d="M222 520 C240 500 260 500 270 470" stroke="#6f5233" strokeWidth={8} fill="none" />
        <path d="M0 330 C-20 220 40 130 140 120 C170 30 300 10 380 70 C470 60 540 150 510 240 C560 320 500 420 410 410 C380 470 280 470 240 420 C180 460 70 450 40 390 C10 390 0 360 0 330 Z" fill="#6fa463" />
        <path d="M60 300 C50 220 120 170 190 190 C230 120 330 120 360 180 C430 170 480 230 450 290 C420 350 340 350 300 320 C250 360 150 360 110 320 C80 330 64 320 60 300 Z" fill="#7cae6c" />
        {/* a birdhouse hanging from a branch */}
        <path d="M340 380 V420" stroke="#6f5233" strokeWidth={4} />
        <path d="M300 440 L340 410 L380 440 Z" fill={C.terra} />
        <rect x={308} y={438} width={64} height={60} rx={4} fill={C.mustard} />
        <circle cx={340} cy={464} r={10} fill="#6f5233" />
        <rect x={338} y={482} width={4} height={12} fill="#6f5233" />
      </g>
    ),
  },
  "g-planters": {
    w: 640,
    h: 160,
    draw: () => (
      <g>
        {[
          [60, C.terra, "#fbf8f1"],
          [220, "#c48e5c", C.pink],
          [380, C.terra, "#fbf8f1"],
          [540, C.mustard, C.pink],
        ].map(([x, pot, petal], i) => (
          <g key={i} transform={`translate(${x} 160)`}>
            <path d="M-58 0 L-66 -60 H66 L58 0 Z" fill={pot as string} />
            <rect x={-70} y={-70} width={140} height={14} rx={5} fill={pot as string} opacity={0.85} />
            {[-46, -20, 6, 32].map((dx, j) => (
              <g key={dx}>
                <path d={`M${dx} -70 V${-104 - (j % 2) * 14}`} stroke={C.leaf} strokeWidth={4} />
                <Leaf x={dx} y={-80} r={j % 2 ? 60 : -60} s={0.7} />
                <g transform={`translate(${dx} ${-108 - (j % 2) * 14})`}>
                  {[0, 72, 144, 216, 288].map((a) => (
                    <ellipse key={a} cx={0} cy={-7} rx={5} ry={8} fill={petal as string} transform={`rotate(${a})`} />
                  ))}
                  <circle r={4} fill={C.mustard} />
                </g>
              </g>
            ))}
          </g>
        ))}
      </g>
    ),
  },
  "g-clothesline": {
    w: 380,
    h: 300,
    draw: () => (
      <g>
        <rect x={10} y={20} width={12} height={280} rx={4} fill="#8d6a43" />
        <rect x={358} y={20} width={12} height={280} rx={4} fill="#8d6a43" />
        <path d="M16 40 C120 70 260 70 364 40" stroke="#a7a198" strokeWidth={3} fill="none" />
        <path d="M70 58 H170 V190 H70 Z" fill="#f6ecd7" />
        <g fill={C.mustard}>
          {[[96, 90], [140, 110], [100, 150], [146, 166]].map(([x, y]) => (
            <circle key={`${x}`} cx={x} cy={y} r={7} />
          ))}
        </g>
        <path d="M206 64 H310 V210 H206 Z" fill={C.pink} />
        <path d="M206 100 H310 M206 140 H310 M206 180 H310" stroke="#d98a96" strokeWidth={6} />
        {[80, 160, 214, 302].map((x) => (
          <rect key={x} x={x - 4} y={x < 200 ? 52 : 58} width={8} height={18} rx={2} fill={C.wood} />
        ))}
      </g>
    ),
  },
  "g-bench": {
    w: 360,
    h: 150,
    draw: () => (
      <g>
        <rect x={0} y={70} width={300} height={20} rx={5} fill="#a8723f" />
        <rect x={20} y={90} width={18} height={60} fill="#8a5e33" />
        <rect x={262} y={90} width={18} height={60} fill="#8a5e33" />
        {/* a pot of flowers on the bench, and the watering can beside it */}
        <path d="M40 70 L34 30 H90 L84 70 Z" fill={C.terra} />
        {[44, 62, 80].map((x) => (
          <g key={x} transform={`translate(${x} 20)`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx={0} cy={-6} rx={4} ry={6} fill={C.pink} transform={`rotate(${a})`} />
            ))}
            <circle r={3} fill={C.mustard} />
          </g>
        ))}
        <g transform="translate(210 70)">
          <path d="M-40 0 V-56 C-40 -66 30 -66 30 -56 V0 Z" fill={C.mustard} />
          <path d="M30 -40 L70 -76" stroke={C.mustard} strokeWidth={12} strokeLinecap="round" />
          <rect x={62} y={-90} width={22} height={14} rx={4} fill={C.mustardDark} transform="rotate(-40 73 -83)" />
          <path d="M-30 -60 C-30 -96 20 -96 20 -60" stroke={C.mustardDark} strokeWidth={8} fill="none" />
          <g transform="translate(-6 -28)">
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx={0} cy={-6} rx={4} ry={6} fill="#fbf8f1" transform={`rotate(${a})`} />
            ))}
            <circle r={3} fill={C.terra} />
          </g>
        </g>
      </g>
    ),
  },
  "g-stones": {
    w: 520,
    h: 200,
    draw: () => (
      <g>
        {[
          [80, 160, 70],
          [220, 120, 64],
          [360, 90, 58],
          [480, 60, 48],
        ].map(([x, y, r]) => (
          <g key={x}>
            <ellipse cx={x} cy={y + 6} rx={r} ry={r * 0.36} fill="#3a3833" opacity={0.1} />
            <ellipse cx={x} cy={y} rx={r} ry={r * 0.36} fill="#c7c0b4" />
            <ellipse cx={x - r * 0.2} cy={y - r * 0.06} rx={r * 0.5} ry={r * 0.14} fill="#d8d2c6" />
          </g>
        ))}
      </g>
    ),
  },
};
