/**
 * ACTIVITY CORNERS: calm close-ups of each room, used behind activities
 * (stories, games, experiments). Busy rooms are for exploring; corners are
 * for playing, so the middle stays quiet.
 *
 * Every corner's floor starts at FLOOR_Y (1600×900), so characters and props
 * stand on the floor the same way everywhere. Games bring their own table or
 * shelf (TryItGame), so a corner can be laid out however the room wants.
 */
import type { ReactNode } from "react";

export const FLOOR_Y = 612;
/** The kitchen counter's top (the kitchen corner keeps a counter on its left). */
export const SURFACE_Y = 505;

const INK = "#3a3833";

function Svg({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-label={label} role="img">
      {children}
    </svg>
  );
}

function Leaf({ x, y, r = 0, s = 1, fill = "#5e8c56" }: { x: number; y: number; r?: number; s?: number; fill?: string }) {
  return <path d="M0 0 C-10 -18 -6 -34 0 -40 C6 -34 10 -18 0 0 Z" fill={fill} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />;
}

/** A window looking out at the city (water tower, coloured blocks, trees), with curtains. */
export function CityWindow({
  x,
  y,
  w,
  h,
  curtain = "check",
  tieback = false,
  dusk = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  curtain?: "check" | "gingham" | "plain" | "none";
  tieback?: boolean;
  /** Getting dark outside: a deep blue sky, the moon and a few stars. */
  dusk?: boolean;
}) {
  const g = 18;
  const ix = x + g;
  const iy = y + g;
  const iw = w - g * 2;
  const ih = h - g * 2;
  const id = `cw-${x}-${y}`;
  const fill = curtain === "check" ? `url(#${id}-check)` : curtain === "gingham" ? `url(#${id}-gingham)` : "#f6ecd7";
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={ix} y={iy} width={iw} height={ih} />
        </clipPath>
        <pattern id={`${id}-check`} width="26" height="26" patternUnits="userSpaceOnUse">
          <rect width="26" height="26" fill="#f6ecd7" />
          <path d="M13 0 V26 M0 13 H26" stroke="#e3cfa6" strokeWidth="6" opacity="0.8" />
        </pattern>
        <pattern id={`${id}-gingham`} width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#fbe7a6" />
          <path d="M12 0 V24 M0 12 H24" stroke="#f1c24a" strokeWidth="7" opacity="0.8" />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="#c99662" />
      <g clipPath={`url(#${id})`}>
        <rect x={ix} y={iy} width={iw} height={ih} fill={dusk ? "#3d4772" : "#a9d6f0"} />
        {dusk ? (
          <>
            {/* a crescent moon and a few stars */}
            <circle cx={ix + iw * 0.8} cy={iy + ih * 0.2} r={ih * 0.08} fill="#f3e7b5" />
            <circle cx={ix + iw * 0.8 + ih * 0.035} cy={iy + ih * 0.2 - ih * 0.02} r={ih * 0.07} fill="#3d4772" />
            {[
              [0.12, 0.12],
              [0.3, 0.2],
              [0.55, 0.1],
              [0.66, 0.3],
              [0.2, 0.36],
              [0.92, 0.38],
            ].map(([sx, sy]) => (
              <circle key={`${sx}`} cx={ix + iw * sx} cy={iy + ih * sy} r={3.5} fill="#fbf3d6" />
            ))}
          </>
        ) : (
          <>
            <path d={`M${ix + iw * 0.14} ${iy + ih * 0.22} c-26 0 -30 -30 -6 -34 6 -22 44 -22 50 -6 24 -6 42 18 24 34 Z`} fill="#ffffff" />
            <circle cx={ix + iw * 0.82} cy={iy + ih * 0.2} r={ih * 0.09} fill="#f6d04d" />
          </>
        )}
        {[
          [0, 0.56, 0.18, "#e8a6b4"],
          [0.16, 0.62, 0.2, "#a8c4e8"],
          [0.34, 0.5, 0.14, "#f1dfb6"],
          [0.5, 0.58, 0.18, "#c5b1df"],
          [0.68, 0.46, 0.16, "#a8c4e8"],
          [0.84, 0.6, 0.2, "#e8a6b4"],
        ].map(([bx, by, bw, c]) => (
          <rect key={`${bx}`} x={ix + iw * (bx as number)} y={iy + ih * (by as number)} width={iw * (bw as number)} height={ih} fill={c as string} />
        ))}
        <g transform={`translate(${ix + iw * 0.3} ${iy + ih * 0.32})`} fill="#5f6b7a">
          <rect x={-18} y={0} width={36} height={30} rx={4} />
          <path d="M-22 0 L0 -14 L22 0 Z" />
          <path d="M-12 30 L-16 70 M12 30 L16 70 M-14 50 H14" stroke="#5f6b7a" strokeWidth="4" />
        </g>
        <path d={`M${ix} ${iy + ih * 0.84} C${ix + iw * 0.25} ${iy + ih * 0.68} ${ix + iw * 0.6} ${iy + ih * 0.78} ${ix + iw} ${iy + ih * 0.66} V${iy + ih} H${ix} Z`} fill="#6fa463" />
        {/* evening: the town goes dim under the sky */}
        {dusk && <rect x={ix} y={iy + ih * 0.44} width={iw} height={ih * 0.56} fill="#1d2444" opacity={0.45} />}
      </g>
      <path d={`M${x + w / 2} ${iy} V${iy + ih}`} stroke="#c99662" strokeWidth="14" />
      <rect x={x - 14} y={y + h - 6} width={w + 28} height="20" rx="5" fill="#d4a476" />
      {curtain !== "none" && (
        <>
          <rect x={x - 30} y={y - 34} width={w + 60} height="10" rx="5" fill="#b9814f" />
          <circle cx={x - 32} cy={y - 29} r="11" fill="#b9814f" />
          <circle cx={x + w + 32} cy={y - 29} r="11" fill="#b9814f" />
          {tieback ? (
            <>
              <path d={`M${x - 24} ${y - 26} H${x + w * 0.14} C${x + w * 0.1} ${y + h * 0.4} ${x + w * 0.02} ${y + h * 0.55} ${x + w * 0.1} ${y + h + 10} H${x - 24} Z`} fill={fill} />
              <path d={`M${x + w + 24} ${y - 26} H${x + w * 0.86} C${x + w * 0.9} ${y + h * 0.4} ${x + w * 0.98} ${y + h * 0.55} ${x + w * 0.9} ${y + h + 10} H${x + w + 24} Z`} fill={fill} />
              <rect x={x - 26} y={y + h * 0.5} width={w * 0.14} height={10} rx={5} fill="#e8b84a" />
              <rect x={x + w * 0.88} y={y + h * 0.5} width={w * 0.14} height={10} rx={5} fill="#e8b84a" />
            </>
          ) : (
            <>
              <path d={`M${x - 20} ${y - 26} H${x + w * 0.16} C${x + w * 0.13} ${y + h * 0.5} ${x + w * 0.16} ${y + h * 0.8} ${x + w * 0.1} ${y + h + 6} H${x - 20} Z`} fill={fill} />
              <path d={`M${x + w + 20} ${y - 26} H${x + w * 0.84} C${x + w * 0.87} ${y + h * 0.5} ${x + w * 0.84} ${y + h * 0.8} ${x + w * 0.9} ${y + h + 6} H${x + w + 20} Z`} fill={fill} />
            </>
          )}
        </>
      )}
    </g>
  );
}

/** A potted plant (drawn standing on y). `woven` = a basket-pattern pot. */
export function PotPlant({ x, y, s = 1, pot = "#d4694a", woven = false }: { x: number; y: number; s?: number; pot?: string; woven?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-70, -40, -14, 14, 40, 70].map((a, i) => (
        <Leaf key={a} x={(i - 2.5) * 8} y={-58} r={a} s={1.9} fill={i % 2 ? "#5e8c56" : "#7cae6c"} />
      ))}
      <path d="M-36 -62 H36 L28 0 H-28 Z" fill={pot} />
      {woven && <path d="M-34 -48 L-20 -34 L-6 -48 L8 -34 L22 -48 L34 -36 M-32 -24 L-18 -10 L-4 -24 L10 -10 L24 -24 L32 -16" stroke="#fbe7cf" strokeWidth={4} fill="none" />}
      <rect x={-40} y={-68} width={80} height={12} rx={4} fill={pot} opacity={0.85} />
    </g>
  );
}

/** A trailing plant in a pot, vines hanging down (pot top-centre at x,y). */
function TrailingPlant({ x, y, s = 1, pot = "#d4694a" }: { x: number; y: number; s?: number; pot?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-40, -20, 0, 20, 40].map((a, i) => (
        <Leaf key={a} x={(i - 2) * 12} y={-4} r={a} s={1.1} fill={i % 2 ? "#5e8c56" : "#7cae6c"} />
      ))}
      <path d="M-30 0 H30 L24 42 H-24 Z" fill={pot} />
      <path d="M-26 6 C-40 50 -36 100 -46 150 M24 6 C36 50 30 90 40 130 M0 40 C-4 80 4 110 -2 140" stroke="#5e8c56" strokeWidth={4} fill="none" />
      {[[-42, 50], [-40, 90], [-46, 134], [36, 40], [34, 80], [40, 120], [-2, 80], [0, 124]].map(([lx, ly]) => (
        <Leaf key={`${lx}-${ly}`} x={lx} y={ly} r={lx < 0 ? -120 : 120} s={0.75} />
      ))}
    </g>
  );
}

function Boards({ fill, seam, id }: { fill: string; seam: string; id: string }) {
  return (
    <>
      <defs>
        <pattern id={id} width="260" height="72" patternUnits="userSpaceOnUse" y={FLOOR_Y}>
          <rect width="260" height="72" fill={fill} />
          <path d="M0 71 H260 M170 0 V72" stroke={seam} strokeWidth="2.5" />
        </pattern>
      </defs>
      <rect y={FLOOR_Y} width="1600" height={900 - FLOOR_Y} fill={`url(#${id})`} />
      <rect y={FLOOR_Y} width="1600" height="10" fill={INK} opacity="0.06" />
    </>
  );
}

function FloorTiles({ id, fill, grout, w = 200, h = 96 }: { id: string; fill: string; grout: string; w?: number; h?: number }) {
  return (
    <>
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse" y={FLOOR_Y}>
          <rect width={w} height={h} fill={fill} />
          <path d={`M0 0 H${w} M0 0 V${h}`} stroke={grout} strokeWidth="4" />
        </pattern>
      </defs>
      <rect y={FLOOR_Y} width="1600" height={900 - FLOOR_Y} fill={`url(#${id})`} />
      <rect y={FLOOR_Y} width="1600" height="10" fill={INK} opacity="0.06" />
    </>
  );
}

function TileWall({ fill, grout, id, size = 80 }: { fill: string; grout: string; id: string; size?: number }) {
  return (
    <>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <rect width={size} height={size} fill={fill} />
          <path d={`M0 0 H${size} M0 0 V${size}`} stroke={grout} strokeWidth="4" />
        </pattern>
      </defs>
      <rect width="1600" height={FLOOR_Y} fill={`url(#${id})`} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* LIVING ROOM: sofa on the left, window, bookshelf, green rug         */
/* ------------------------------------------------------------------ */

export function LivingCorner({ window = true, dusk = false }: { window?: boolean; dusk?: boolean }) {
  return (
    <Svg label="Living room">
      <defs>
        <pattern id="lc-wall" width="90" height="90" patternUnits="userSpaceOnUse">
          <rect width="90" height="90" fill="#fbecd6" />
          <path d="M22 30 q5 -9 0 -16 M22 30 q-6 -4 -9 -10 M22 30 q6 -3 10 -9" stroke="#efd4b2" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M67 75 q5 -9 0 -16 M67 75 q-6 -4 -9 -10 M67 75 q6 -3 10 -9" stroke="#efd4b2" strokeWidth="3" fill="none" strokeLinecap="round" />
        </pattern>
        <pattern id="lc-plaid" width="22" height="22" patternUnits="userSpaceOnUse">
          <rect width="22" height="22" fill="#f1cf6b" />
          <path d="M11 0 V22 M0 11 H22" stroke="#f8e3a3" strokeWidth="5" />
        </pattern>
      </defs>
      <rect width="1600" height={FLOOR_Y} fill="url(#lc-wall)" />
      <rect y={FLOOR_Y - 18} width="1600" height="18" fill="#efd9b8" />

      {/* framed leaf prints */}
      <rect x={140} y={150} width={130} height={160} rx={4} fill="#b9814f" />
      <rect x={154} y={164} width={102} height={132} fill="#f6ecd7" />
      <path d="M205 280 V190" stroke="#5e8c56" strokeWidth="5" />
      <Leaf x={205} y={240} r={-50} s={1.2} />
      <Leaf x={205} y={222} r={50} s={1.2} fill="#7cae6c" />
      <Leaf x={205} y={200} r={0} s={1.1} />
      <rect x={560} y={240} width={110} height={130} rx={4} fill="#b9814f" />
      <rect x={572} y={252} width={86} height={106} fill="#f6ecd7" />
      <path d="M615 350 V280" stroke="#5e8c56" strokeWidth="4" />
      <Leaf x={615} y={322} r={-50} s={0.9} />
      <Leaf x={615} y={306} r={50} s={0.9} fill="#7cae6c" />

      {/* macramé hanging plant */}
      <path d="M430 0 V120 M430 120 L395 200 M430 120 L465 200 M430 120 L430 200" stroke="#c49a6c" strokeWidth="3" />
      <TrailingPlant x={430} y={200} s={1.1} pot="#d4694a" />

      {/* window with tied-back checked curtains */}
      {window && <CityWindow x={880} y={70} w={460} h={420} tieback dusk={dusk} />}

      <Boards id="lc-floor" fill="#d6a877" seam="#c4955f" />

      {/* bookshelf on the right, standing on the floor, a plant on top */}
      <rect x={1420} y={300} width={200} height={420} rx={6} fill="#a8723f" />
      {[340, 460, 580].map((y, row) => (
        <g key={y}>
          <rect x={1436} y={y} width={190} height={100} fill="#8a5e33" />
          {["#d4694a", "#6f8fb4", "#e8b84a", "#8fae7e", "#b4a8cd", "#d4694a"].map((c, i) => (
            <rect key={i} x={1442 + i * 26} y={y + 14 + ((i + row) % 3) * 8} width={22} height={86 - ((i + row) % 3) * 8} rx={3} fill={c} />
          ))}
        </g>
      ))}
      <TrailingPlant x={1500} y={260} s={0.8} pot="#d4694a" />


      {/* the sofa (deep green, like Milo's living room), with a plaid and a leaf cushion */}
      <path d="M-20 450 C-20 420 0 410 30 410 H620 C650 410 670 420 670 450 V600 H-20 Z" fill="#739a72" />
      <rect x={-20} y={560} width={720} height={90} rx={18} fill="#83aa80" />
      <path d="M640 470 C640 448 660 440 690 440 C720 440 740 450 740 476 V660 H640 Z" fill="#739a72" />
      <path d="M300 560 V646" stroke="#5f8560" strokeWidth="4" />
      <rect x={-20} y={640} width={760} height={24} rx={8} fill="#5f8560" />
      <rect x={20} y={664} width={22} height={50} fill="#8a5e33" />
      <rect x={660} y={664} width={22} height={50} fill="#8a5e33" />
      <rect x={60} y={460} width={150} height={130} rx={18} fill="url(#lc-plaid)" transform="rotate(-8 135 525)" />
      <rect x={220} y={470} width={140} height={120} rx={18} fill="#5e8c56" transform="rotate(5 290 530)" />
      <path d="M290 570 V500" stroke="#f6ecd7" strokeWidth="5" transform="rotate(5 290 530)" />
      <Leaf x={290} y={548} r={-50} s={1.1} fill="#f6ecd7" />
      <Leaf x={290} y={528} r={50} s={1.1} fill="#f6ecd7" />

      {/* green rug with tassels */}
      <path d="M330 770 H1290 L1340 880 H280 Z" fill="#8fae7e" />
      <path d="M360 790 H1270 L1306 862 H322 Z" fill="none" stroke="#7c9b6b" strokeWidth="4" strokeDasharray="12 10" />
      {Array.from({ length: 22 }, (_, i) => (
        <path key={i} d={`M${290 + i * 48} 880 v14`} stroke="#7c9b6b" strokeWidth="4" strokeLinecap="round" />
      ))}
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* KITCHEN: a counter on the left (kettle, fruit, sink), window right  */
/* ------------------------------------------------------------------ */

export function KitchenCorner() {
  return (
    <Svg label="Kitchen">
      <TileWall id="kc-tile" fill="#e2ecd6" grout="#d0ddc4" />

      {/* cups on a shelf */}
      <rect x={300} y={232} width={360} height={14} rx={4} fill="#b9814f" />
      <path d="M340 246 l12 22 M620 246 l-12 22" stroke="#91603a" strokeWidth="8" strokeLinecap="round" />
      {["#efb08c", "#7fa6cf", "#e8b84a", "#e8a2ad"].map((c, i) => (
        <g key={c} transform={`translate(${318 + i * 82} 180)`}>
          <path d="M0 0 H46 L42 52 H4 Z" fill={c} />
          <path d="M46 12 C64 12 64 36 44 36" stroke={c} strokeWidth="7" fill="none" />
        </g>
      ))}

      <CityWindow x={1170} y={60} w={320} h={300} curtain="gingham" />

      {/* the counter: worktop + yellow cupboards (like the kitchen itself) */}
      <rect x={-10} y={SURFACE_Y - 14} width={630} height={24} rx={5} fill="#f1e4cc" />

      {/* kettle, fruit bowl, tap on the counter */}
      <g transform={`translate(110 ${SURFACE_Y - 14})`}>
        <path d="M-60 0 C-70 -50 -50 -84 0 -84 C50 -84 70 -50 60 0 Z" fill="#df6f55" />
        <path d="M58 -50 C86 -60 96 -80 92 -96" stroke="#df6f55" strokeWidth="13" strokeLinecap="round" fill="none" />
        <path d="M-34 -84 C-34 -122 34 -122 34 -84" stroke="#3f4656" strokeWidth="8" fill="none" />
        <rect x={-12} y={-96} width={24} height={14} rx={5} fill="#c4523e" />
      </g>
      <g transform={`translate(330 ${SURFACE_Y - 14})`}>
        <path d="M30 -30 C32 -66 60 -84 80 -78 C72 -70 62 -50 58 -26 Z" fill="#f2cd3d" />
        <circle cx={-20} cy={-38} r={26} fill="#d94a3e" />
        <circle cx={22} cy={-32} r={22} fill="#ef9a3e" />
        <path d="M-84 -20 H84 C78 4 46 14 0 14 C-46 14 -78 4 -84 -20 Z" fill="#b4a8cd" />
      </g>
      <g transform={`translate(520 ${SURFACE_Y - 14})`}>
        <path d="M0 0 V-62 C0 -84 40 -84 40 -62 V-48" stroke="#8d8a8f" strokeWidth="12" fill="none" strokeLinecap="round" />
        <rect x={-50} y={-4} width={130} height={10} rx={5} fill="#e6e1d6" />
      </g>

      <FloorTiles id="kc-floor" fill="#dcae7e" grout="#c99a6c" />
      {/* the counter stands on the floor, in front of the wall line */}
      <rect x={-10} y={SURFACE_Y + 10} width={620} height={730 - SURFACE_Y - 10} fill="#eac46a" />
      {[200, 410].map((x) => (
        <path key={`f${x}`} d={`M${x} ${SURFACE_Y + 18} V720`} stroke="#d2a845" strokeWidth="6" />
      ))}
      {[[160, 600], [240, 600], [450, 600]].map(([x, y]) => (
        <circle key={`f${x}`} cx={x} cy={y} r="11" fill="#fbf8f1" />
      ))}
      <rect x={-10} y={718} width={620} height={12} fill="#c9a03e" />
      <PotPlant x={1500} y={730} s={1.3} pot="#df6f55" woven />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* WASHROOM: shelf, round mirror, toilet, towel ring, whale curtain    */
/* (warm peach tiles, so blue Milo stands out)                          */
/* ------------------------------------------------------------------ */

export function WashroomCorner() {
  return (
    <Svg label="Washroom">
      <TileWall id="wc-tile" fill="#f7e1d2" grout="#ecc9b4" size={84} />
      <FloorTiles id="wc-floor" fill="#dba98f" grout="#c99179" w={150} h={80} />

      {/* shelf: trailing plant + towels */}
      <rect x={60} y={250} width={340} height={14} rx={4} fill="#b9814f" />
      <path d="M100 264 l12 20 M360 264 l-12 20" stroke="#91603a" strokeWidth="8" strokeLinecap="round" />
      <TrailingPlant x={120} y={206} s={0.85} />
      {[["#e8b84a", 0], ["#6f8fb4", 26]].map(([c, dy]) => (
        <rect key={`${dy}`} x={200} y={198 + (dy as number)} width={130} height={26} rx={9} fill={c as string} />
      ))}

      {/* round mirror */}
      <circle cx={640} cy={220} r={104} fill="#c99662" />
      <circle cx={640} cy={220} r={86} fill="#e8f3f8" />
      <path d="M594 182 L622 154 M604 210 L658 156" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />

      {/* towel ring + yellow towel */}
      <circle cx={960} cy={270} r={28} fill="none" stroke="#8d8a8f" strokeWidth="8" />
      <rect x={952} y={226} width={16} height={18} rx={4} fill="#8d8a8f" />
      <path d="M926 292 H994 L1000 470 H920 Z" fill="#e8b84a" />
      {[[940, 330], [972, 360], [946, 404], [980, 436]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={6} fill="#f6dc8a" />
      ))}

      {/* toilet with spray + paper; a green stool */}
      <path d="M150 470 C130 530 140 610 186 650" stroke="#8d8a8f" strokeWidth="9" fill="none" />
      <rect x={138} y={450} width={28} height={44} rx={8} fill="#a7a198" />
      <rect x={220} y={430} width={150} height={110} rx={16} fill="#fbf8f1" stroke="#d6cfbf" strokeWidth="4" />
      <path d="M200 560 H390 C390 640 350 668 330 674 L340 740 H250 L260 674 C240 668 200 640 200 560 Z" fill="#fbf8f1" stroke="#d6cfbf" strokeWidth="4" />
      <ellipse cx={295} cy={556} rx={98} ry={18} fill="#f1ece0" stroke="#d6cfbf" strokeWidth="4" />
      <rect x={430} y={500} width={46} height={12} rx={4} fill="#8d8a8f" />
      <rect x={436} y={512} width={36} height={50} rx={6} fill="#fbf8f1" />
      <path d="M410 690 H560 V708 H546 V752 H524 V708 H446 V752 H424 V708 H410 Z" fill="#7cae6c" />

      {/* rail + whale shower curtain */}
      <rect x={1100} y={70} width={520} height={12} rx={6} fill="#8d8a8f" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={1120 + i * 40} cy={84} r={7} fill="none" stroke="#8d8a8f" strokeWidth="3" />
      ))}
      <path d="M1110 88 H1610 V740 C1560 754 1460 742 1360 752 C1260 762 1180 744 1110 748 Z" fill="#fbf8f1" />
      <path d="M1112 690 C1160 670 1200 706 1250 690 C1300 674 1340 706 1390 690 C1440 674 1480 706 1530 690 C1560 682 1590 690 1610 698 V748 C1560 754 1460 742 1360 752 C1260 762 1180 744 1110 748 Z" fill="#a8cfe8" />
      {[[1230, 220], [1430, 250], [1250, 460], [1450, 490]].map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(1.5)`}>
          <path d="M-34 6 C-34 -18 4 -26 22 -10 C30 -16 40 -14 40 -6 C34 -4 30 2 30 8 C30 22 10 28 -10 26 C-26 24 -34 16 -34 6 Z" fill="#8fbfe0" />
          <circle cx={-14} cy={0} r={3.5} fill={INK} />
          <path d="M-4 -24 C-8 -34 -2 -40 4 -34 M-4 -24 C0 -36 10 -36 10 -28" stroke="#8fbfe0" strokeWidth={4} fill="none" />
        </g>
      ))}

      <rect x={560} y={800} width={460} height={64} rx={16} fill="#f6ecd7" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* GARDEN: the big tree, the city over the wall, grass and stones      */
/* ------------------------------------------------------------------ */

export function GardenCorner() {
  const WALL = 430;
  const base = FLOOR_Y + 4;
  return (
    <Svg label="Garden">
      <defs>
        <linearGradient id="gc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd3f2" />
          <stop offset="1" stopColor="#d5eef8" />
        </linearGradient>
        <pattern id="gc-brick" width="120" height="44" patternUnits="userSpaceOnUse" y={WALL + 14}>
          <rect width="120" height="44" fill="#e3b57f" />
          <path d="M0 21 H120 M0 43 H120 M60 0 V21 M0 21 V43 M120 21 V43" stroke="#d6a56f" strokeWidth="3" opacity="0.7" />
        </pattern>
      </defs>
      <rect width="1600" height={FLOOR_Y} fill="url(#gc-sky)" />
      <path d="M940 120 c-36 0 -44 -40 -10 -48 8 -32 62 -32 70 -6 34 -8 58 26 32 54 Z" fill="#ffffff" />
      <path d="M1420 110 c-30 0 -36 -34 -8 -40 6 -26 52 -26 58 -6 28 -6 48 22 26 46 Z" fill="#ffffff" />
      <circle cx={1290} cy={140} r={56} fill="#f6d04d" />

      {/* the city beyond, a water tower among the blocks */}
      {[
        [560, 260, 100, "#e8a6b4"],
        [670, 300, 80, "#c5b1df"],
        [860, 250, 110, "#f1dfb6"],
        [980, 290, 90, "#c5b1df"],
        [1080, 310, 80, "#e8a6b4"],
      ].map(([x, y, w, c]) => (
        <g key={`${x}`}>
          <rect x={x as number} y={y as number} width={w as number} height={WALL - (y as number)} fill={c as string} />
          {Array.from({ length: 4 }, (_, i) => (
            <rect key={i} x={(x as number) + 14 + (i % 2) * ((w as number) / 2)} y={(y as number) + 20 + Math.floor(i / 2) * 40} width={18} height={20} fill="#fbf8f1" opacity={0.7} />
          ))}
        </g>
      ))}
      <g transform="translate(790 200)" fill="#5f7d9b">
        <rect x={-32} y={0} width={64} height={54} rx={6} />
        <path d="M-38 0 L0 -24 L38 0 Z" />
        <path d="M-20 54 L-26 150 M20 54 L26 150 M-24 100 H24" stroke="#5f7d9b" strokeWidth="7" />
      </g>
      {/* trees and bushes beyond the wall */}
      <path d="M380 400 C440 340 520 340 560 380 C640 330 720 340 760 390 C840 350 920 350 960 390 C1040 340 1140 340 1180 390 C1260 330 1360 330 1420 380 C1480 340 1560 340 1610 370 V450 H380 Z" fill="#6fa463" />
      <path d="M380 420 C520 400 700 420 900 412 C1100 400 1300 420 1610 404 V450 H380 Z" fill="#5e8c56" />

      {/* the garden wall, vines hanging over it on the right */}
      <rect x={300} y={WALL + 14} width={1310} height={FLOOR_Y - WALL - 14} fill="url(#gc-brick)" />
      <rect x={290} y={WALL} width={1330} height={18} rx={5} fill="#ecd3a6" />
      {[1150, 1260, 1380, 1490].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${WALL + 16} c-10 40 10 70 -2 110 M${x + 28} ${WALL + 16} c8 30 -6 50 4 84`} stroke="#5e8c56" strokeWidth="6" fill="none" strokeLinecap="round" />
          {[28, 58, 92].map((dy, j) => (
            <Leaf key={dy} x={x + (j % 2 ? 10 : -8)} y={WALL + 16 + dy} r={j % 2 ? 140 : -140} s={0.9} fill={i % 2 ? "#7cae6c" : "#5e8c56"} />
          ))}
        </g>
      ))}
      {/* low bushes along the bottom of the wall */}
      <path d={`M560 ${base} C590 560 650 560 670 600 C700 570 760 580 770 ${base} Z`} fill="#6fa463" />
      <path d={`M980 ${base} C1000 570 1050 566 1070 600 C1100 580 1140 590 1150 ${base} Z`} fill="#7cae6c" />

      {/* grass */}
      <rect y={FLOOR_Y} width="1600" height={900 - FLOOR_Y} fill="#8fc277" />
      <rect y={FLOOR_Y} width="1600" height="16" fill="#7cae6c" />
      {Array.from({ length: 24 }, (_, i) => (
        <path key={i} d={`M${120 + i * 62} ${690 + ((i * 37) % 3) * 64} l-6 -16 M${126 + i * 62} ${690 + ((i * 37) % 3) * 64} l6 -18`} stroke="#6fa463" strokeWidth="5" strokeLinecap="round" />
      ))}
      {/* stepping stones and a potted plant on the right */}
      {[[1330, 790, 70], [1440, 740, 60], [1380, 860, 66]].map(([x, y, r]) => (
        <g key={x}>
          <ellipse cx={x} cy={y + 6} rx={r} ry={r * 0.36} fill={INK} opacity={0.1} />
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.36} fill="#c7c0b4" />
        </g>
      ))}
      <PotPlant x={1520} y={700} s={1.3} pot="#df6f55" woven />
      {[[110, 820, "#fbf8f1"], [240, 870, "#fbf8f1"], [1470, 850, "#f2a6b0"], [1560, 800, "#f2a6b0"]].map(([x, y, c]) => (
        <g key={`${x}`} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-9} rx={6} ry={9} fill={c as string} transform={`rotate(${a})`} />
          ))}
          <circle r={5} fill="#e8b84a" />
        </g>
      ))}

      {/* the big tree on the left, leaning over */}
      <path d="M40 900 C70 760 84 600 80 360 L118 360 C124 420 140 380 170 340 L196 356 C160 420 150 470 158 560 C162 680 172 790 200 900 Z" fill="#8d6a43" />
      <path d="M100 520 C120 500 140 498 150 470 M96 700 C110 690 124 690 132 676" stroke="#6f5233" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M-40 360 C-60 240 0 150 100 140 C140 50 280 30 360 90 C460 80 540 170 500 260 C540 340 470 420 390 400 C340 450 240 450 200 410 C140 450 40 440 0 390 C-30 390 -40 380 -40 360 Z" fill="#6fa463" />
      <path d="M10 320 C0 250 70 200 140 216 C180 150 290 150 320 210 C390 200 440 260 410 316 C380 370 300 370 260 340 C210 380 110 380 70 340 C40 350 14 340 10 320 Z" fill="#7cae6c" />
      <path d="M-20 900 V800 C20 770 80 780 100 820 C140 800 180 840 170 900 Z" fill="#5e8c56" />
    </Svg>
  );
}
