/**
 * The cut-away house (1600×900 = the 16:9 stage), in the neat sticker-book
 * style: flat colours, one soft outline.
 *
 * Layout: a stair column and an entrance hall on the left; washroom + two
 * sleeping rooms upstairs; living room, kitchen + a sleeping room downstairs;
 * the garden outside on the right.
 *
 * Room interiors are NOT drawn here. They are live miniatures placed on top
 * of each room's cell (HOUSE_LAYOUT below; the garden uses its rooms.ts plot).
 */
export const LINE = "rgba(140, 110, 80, 0.3)";
const FRAME = "#e8c08f";
const FRAME_DARK = "#d4a571";
const ROOF = "#d9785e";
const ROOF_DARK = "#c4644b";
const WALL_IN = "#faefdf";

/** Kept for code that still offsets by it (the house is now drawn where it sits). */
export const HOUSE_SHIFT = 0;
export const HOUSE_SHIFT_PCT = 0;

/** Interior cells, px in the 1600×900 scene. Rooms snap to these. */
export const HOUSE_LAYOUT = {
  wall: 16,
  /** upstairs row */
  top: { y: 279, h: 230 },
  /** downstairs row */
  bottom: { y: 525, h: 235 },
  upper: [
    { id: "washroom", x: 268, w: 366 },
    { id: "bedroom", x: 650, w: 322 },
    { id: "playroom", x: 988, w: 271 },
  ],
  lower: [
    { id: "living-room", x: 208, w: 410 },
    { id: "kitchen", x: 634, w: 362 },
    { id: "dining", x: 1012, w: 247 },
  ],
  /** not rooms: the stairs (upstairs, left) and the entrance hall (downstairs, left) */
  stairs: { x: 126, w: 126 },
  hall: { x: 42, w: 150 },
  /** outer walls: upstairs block and the (wider) downstairs block */
  upperBlock: { x: 110, y: 263, w: 1165 },
  lowerBlock: { x: 26, y: 509, w: 1249 },
} as const;

/** % plot of a cell (for absolutely positioned HTML on top). */
export function cellPlot(id: string) {
  const L = HOUSE_LAYOUT;
  const up = L.upper.find((c) => c.id === id);
  const lo = L.lower.find((c) => c.id === id);
  const c = up ?? lo;
  if (!c) return null;
  const row = up ? L.top : L.bottom;
  return { x: (c.x / 1600) * 100, y: (row.y / 900) * 100, w: (c.w / 1600) * 100, h: (row.h / 900) * 100 };
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 44 C-8 20 18 6 36 16 C44 -6 88 -6 96 16 C116 6 136 22 128 44 Z"
      fill="#ffffff"
      stroke={LINE}
      strokeWidth={4}
      strokeLinejoin="round"
    />
  );
}

function Leaf({ x, y, r = 0, s = 1, fill = "#5e8c56" }: { x: number; y: number; r?: number; s?: number; fill?: string }) {
  return <path d="M0 0 C-10 -18 -6 -34 0 -40 C6 -34 10 -18 0 0 Z" fill={fill} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />;
}

export function HouseBackdrop() {
  const L = HOUSE_LAYOUT;
  const W = L.wall;
  const top = L.top;
  const bot = L.bottom;
  const ub = L.upperBlock;
  const lb = L.lowerBlock;
  const right = ub.x + ub.w; // 1275
  const base = bot.y + bot.h; // 760
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe2f3" />
          <stop offset="1" stopColor="#e4f3f8" />
        </linearGradient>
      </defs>
      {/* sky, clouds, the city far off */}
      <rect width="1600" height="900" fill="url(#hb-sky)" />
      <Cloud x={70} y={110} s={1.2} />
      <Cloud x={1370} y={90} s={1.1} />
      {[
        [1300, 320, 70, "#d8cfe8"],
        [1380, 300, 80, "#c7d6ec"],
        [1470, 340, 60, "#efcfd6"],
        [1540, 310, 70, "#d8cfe8"],
        [20, 340, 60, "#c7d6ec"],
        [90, 370, 50, "#d8cfe8"],
      ].map(([x, y, w, c]) => (
        <g key={`${x}`}>
          <rect x={x as number} y={y as number} width={w as number} height={560 - (y as number)} fill={c as string} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={(x as number) + 12 + (i % 2) * ((w as number) / 2)} y={(y as number) + 18 + Math.floor(i / 2) * 36} width={14} height={16} fill="#ffffff" opacity={0.6} />
          ))}
        </g>
      ))}
      {/* trees and bushes behind the house */}
      <path d="M0 470 C30 420 90 420 120 460 V600 H0 Z" fill="#8fbf7c" />
      <path d="M1270 470 C1310 400 1390 400 1420 450 C1470 400 1560 410 1600 450 V640 H1270 Z" fill="#8fbf7c" />
      <path d="M1270 520 C1330 480 1400 490 1440 530 C1500 490 1570 500 1600 530 V660 H1270 Z" fill="#7cae6c" />

      {/* lawn */}
      <path d="M0 640 C300 610 700 620 1000 640 C1250 655 1450 630 1600 640 V900 H0 Z" fill="#a8cf92" />
      <path d="M0 780 C400 770 1200 770 1600 785 V900 H0 Z" fill="#9cc585" />
      {Array.from({ length: 22 }, (_, i) => (
        <path key={i} d={`M${40 + i * 74} ${820 + (i % 3) * 22} l-5 -12 M${45 + i * 74} ${820 + (i % 3) * 22} l5 -13`} stroke="#82b06f" strokeWidth={4} strokeLinecap="round" />
      ))}

      {/* chimney (behind the roof) */}
      <rect x={1020} y={22} width={70} height={110} fill="#e8c08f" stroke={LINE} strokeWidth={1.4} />
      <rect x={1010} y={14} width={90} height={20} fill="#c4644b" stroke={LINE} strokeWidth={1.4} />

      {/* the roof (tile lines clipped to its shape) */}
      <clipPath id="hb-roof">
        <path d={`M80 ${ub.y + 6} L290 72 H1110 L1300 ${ub.y + 6} Z`} />
      </clipPath>
      <path d={`M80 ${ub.y + 6} L290 72 H1110 L1300 ${ub.y + 6} Z`} fill={ROOF} stroke={LINE} strokeWidth={1.8} strokeLinejoin="round" />
      <g clipPath="url(#hb-roof)">
        {Array.from({ length: 6 }, (_, row) => {
          const y = 78 + row * 32;
          return (
            <g key={row}>
              <path d={`M0 ${y + 32} H1600`} stroke={ROOF_DARK} strokeWidth={4} />
              {Array.from({ length: 34 }, (_, i) => (
                <path key={i} d={`M${60 + i * 44 + (row % 2) * 22} ${y} v32`} stroke={ROOF_DARK} strokeWidth={2.5} opacity={0.7} />
              ))}
            </g>
          );
        })}
      </g>
      <rect x={280} y={64} width={840} height={14} rx={4} fill={ROOF_DARK} stroke={LINE} strokeWidth={1.2} />

      {/* dormers with flower boxes, and the big arched window in the middle */}
      {[408, 543, 921, 1055].map((x) => (
        <g key={x}>
          <path d={`M${x - 46} 236 V186 A46 46 0 0 1 ${x + 46} 186 V236 Z`} fill="#ffffff" stroke={LINE} strokeWidth={1.6} />
          <path d={`M${x - 34} 236 V190 A34 34 0 0 1 ${x + 34} 190 V236 Z`} fill="#cfe6ee" stroke={LINE} strokeWidth={1} />
          <path d={`M${x} 156 V236 M${x - 34} 200 H${x + 34}`} stroke={LINE} strokeWidth={1} />
          <rect x={x - 54} y={232} width={108} height={20} rx={4} fill="#b9814f" stroke={LINE} strokeWidth={1.2} />
          <path d={`M${x - 50} 234 q8 -14 16 0 q8 -14 16 0 q8 -14 16 0 q8 -14 16 0 q8 -14 16 0 q8 -14 16 0`} fill="#7cae6c" stroke={LINE} strokeWidth={1} />
        </g>
      ))}
      <path d="M640 262 V196 A95 95 0 0 1 830 196 V262 Z" fill="#ffffff" stroke={LINE} strokeWidth={1.8} />
      <path d="M658 262 V200 A77 77 0 0 1 812 200 V262 Z" fill="#cfe6ee" stroke={LINE} strokeWidth={1.2} />
      <path d="M735 123 V262 M658 214 H812" stroke={LINE} strokeWidth={1.2} />
      <path d="M680 180 L708 152 M690 200 L736 150" stroke="#ffffff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />

      {/* walls: the inside colour behind everything, then the wooden frame */}
      <rect x={ub.x} y={ub.y} width={ub.w} height={lb.y - ub.y} fill={WALL_IN} />
      <rect x={lb.x} y={lb.y} width={lb.w} height={base + W - lb.y} fill={WALL_IN} />
      {/* outer frame: upstairs block + the wider downstairs block */}
      <path
        d={`M${ub.x} ${lb.y} V${ub.y} H${right} V${base + W} H${lb.x} V${lb.y} Z`}
        fill="none"
        stroke={FRAME}
        strokeWidth={W * 2}
        strokeLinejoin="miter"
      />
      <path d={`M${ub.x - W} ${lb.y - W} V${ub.y - W} H${right + W} V${base + W * 2} H${lb.x - W} V${lb.y - W} Z`} fill="none" stroke={LINE} strokeWidth={1.8} />
      {/* the hall's little roof ledge, where the upstairs block stops */}
      <rect x={lb.x - 26} y={lb.y - W - 4} width={ub.x - lb.x + 40} height={14} rx={4} fill={ROOF_DARK} stroke={LINE} strokeWidth={1.2} />
      {/* middle floor beam */}
      <rect x={ub.x} y={lb.y} width={right - ub.x} height={W} fill={FRAME} stroke={LINE} strokeWidth={1.2} />
      {/* inner walls */}
      {[
        ...[L.upper[0].x, L.upper[1].x, L.upper[2].x].map((x) => ({ x: x - W, y: top.y, h: top.h })),
        ...[L.lower[0].x, L.lower[1].x, L.lower[2].x].map((x) => ({ x: x - W, y: bot.y, h: bot.h })),
      ].map((w, i) => (
        <rect key={i} x={w.x} y={w.y} width={W} height={w.h} fill={FRAME} stroke={LINE} strokeWidth={1.2} />
      ))}

      {/* the stairs (upstairs, left): steps, a banister, a plant, a little picture */}
      <g>
        <rect x={L.stairs.x} y={top.y} width={L.stairs.w} height={top.h} fill="#f6e3c8" />
        {(() => {
          // six steps going up to the right; the rail runs parallel, 46px above the step fronts
          const steps = Array.from({ length: 6 }, (_, i) => ({ x: L.stairs.x + 8 + i * 19, y: top.y + top.h - 30 - i * 30 }));
          const rail = (p: { x: number; y: number }) => ({ x: p.x + 10, y: p.y - 46 });
          const first = rail(steps[0]);
          const last = rail(steps[5]);
          return (
            <>
              {steps.map((p, i) => (
                <rect key={i} x={p.x} y={p.y} width={L.stairs.x + L.stairs.w - p.x} height={30} fill="#c48e5c" stroke={LINE} strokeWidth={1} />
              ))}
              {steps.map((p, i) => (
                <path key={`b${i}`} d={`M${p.x + 10} ${p.y} V${p.y - 46}`} stroke="#8a5e33" strokeWidth={3} />
              ))}
              <path d={`M${first.x - 4} ${first.y + 3} L${last.x + 8} ${last.y - 5}`} stroke="#8a5e33" strokeWidth={6} strokeLinecap="round" />
              <rect x={steps[0].x + 4} y={steps[0].y - 56} width={12} height={56} rx={3} fill="#8a5e33" />
            </>
          );
        })()}
        <rect x={L.stairs.x + 30} y={top.y + 24} width={40} height={50} rx={3} fill="#b9814f" />
        <rect x={L.stairs.x + 36} y={top.y + 30} width={28} height={38} fill="#f6ecd7" />
        <Leaf x={L.stairs.x + 50} y={top.y + 64} r={-30} s={0.6} />
      </g>

      {/* the entrance hall (downstairs, left): arched front door, a wall lamp, a plant */}
      <g>
        <rect x={L.hall.x} y={bot.y} width={L.hall.w} height={bot.h} fill="#f6e3c8" />
        <path d={`M${L.hall.x + 14} ${base} V${bot.y + 90} A44 44 0 0 1 ${L.hall.x + 102} ${bot.y + 90} V${base} Z`} fill="#a8723f" stroke={LINE} strokeWidth={1.4} />
        <path d={`M${L.hall.x + 58} ${bot.y + 50} V${base}`} stroke="#8a5e33" strokeWidth={3} />
        <circle cx={L.hall.x + 88} cy={bot.y + 150} r={5} fill="#e8b84a" />
        <path d={`M${L.hall.x + 130} ${bot.y + 30} v18`} stroke="#8d8a8f" strokeWidth={2} />
        <path d={`M${L.hall.x + 118} ${bot.y + 62} L${L.hall.x + 124} ${bot.y + 46} H${L.hall.x + 136} L${L.hall.x + 142} ${bot.y + 62} Z`} fill="#e8b84a" />
        <path d={`M${L.hall.x + 112} ${base} L${L.hall.x + 116} ${base - 34} H${L.hall.x + 144} L${L.hall.x + 148} ${base} Z`} fill="#d4694a" />
        {[-30, 0, 30].map((a, i) => (
          <Leaf key={a} x={L.hall.x + 130 + (i - 1) * 6} y={base - 34} r={a} s={1.1} fill={i % 2 ? "#5e8c56" : "#7cae6c"} />
        ))}
      </g>

      {/* ground beam + front step */}
      <rect x={lb.x - 30} y={base + W + 2} width={right - lb.x + 60} height={20} rx={4} fill={FRAME_DARK} stroke={LINE} strokeWidth={1.4} />
      <rect x={lb.x + 4} y={base + W + 18} width={120} height={14} rx={3} fill="#e2dace" stroke={LINE} strokeWidth={1.2} />

      {/* the garden outside, on the right: a low brick wall with pots, the big tree with its birdhouse, stones */}
      <g>
        <rect x={1290} y={672} width={280} height={74} fill="#dcae7e" stroke={LINE} strokeWidth={1.2} />
        <path d="M1290 696 H1570 M1290 720 H1570 M1340 672 V696 M1400 672 V696 M1460 672 V696 M1520 672 V696 M1310 696 V720 M1370 696 V720 M1430 696 V720 M1490 696 V720 M1550 696 V720 M1340 720 V746 M1400 720 V746 M1460 720 V746 M1520 720 V746" stroke="#c99a6c" strokeWidth={2} />
        <rect x={1284} y={662} width={292} height={12} rx={3} fill="#ead8b6" stroke={LINE} strokeWidth={1.2} />
        <path d="M1320 672 c-4 16 4 28 0 40 M1544 672 c4 14 -4 24 2 36" stroke="#5e8c56" strokeWidth={3} fill="none" />
        {([[1360, "#d4694a", "#fbf8f1"], [1540, "#e8b84a", "#f2a6b0"]] as const).map(([x, pot, petal]) => (
          <g key={x} transform={`translate(${x} 662)`}>
            <path d="M-14 0 L-16 -20 H16 L14 0 Z" fill={pot} stroke={LINE} strokeWidth={1} />
            {[-8, 0, 8].map((dx) => (
              <g key={dx}>
                <path d={`M${dx} -20 V-32`} stroke="#5e8c56" strokeWidth={2} />
                <circle cx={dx} cy={-34} r={5} fill={petal} stroke={LINE} strokeWidth={0.8} />
              </g>
            ))}
          </g>
        ))}
        <path d="M1428 760 C1434 700 1432 640 1422 560 C1440 576 1458 572 1468 556 C1462 640 1462 700 1474 760 Z" fill="#8d6a43" stroke={LINE} strokeWidth={1.2} />
        <path d="M1330 500 C1316 440 1360 392 1420 392 C1440 350 1510 344 1540 384 C1590 384 1612 434 1592 476 C1612 520 1572 566 1524 556 C1500 586 1440 586 1420 562 C1380 584 1330 566 1330 530 Z" fill="#6fa463" stroke={LINE} strokeWidth={1.4} />
        <path d="M1360 480 C1352 444 1384 418 1420 424 C1438 396 1494 396 1508 426 C1546 424 1566 456 1552 484 C1538 512 1500 510 1484 498 C1462 518 1414 518 1400 500 C1384 508 1364 500 1360 480 Z" fill="#7cae6c" />
        <path d="M1520 556 V580" stroke="#6f5233" strokeWidth={2} />
        <path d="M1504 590 L1520 576 L1536 590 Z" fill="#d4694a" stroke={LINE} strokeWidth={0.8} />
        <rect x={1508} y={589} width={24} height={22} fill="#e8b84a" stroke={LINE} strokeWidth={0.8} />
        <circle cx={1520} cy={598} r={4} fill="#6f5233" />
        {[[1330, 800, 22], [1400, 812, 20], [1470, 804, 18]].map(([x, y, r]) => (
          <ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.4} fill="#c7c0b4" stroke={LINE} strokeWidth={1} />
        ))}
        {[[1300, 760, "#fbf8f1"], [1580, 770, "#f2a6b0"]].map(([x, y, c]) => (
          <g key={`${x}`} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx={0} cy={-7} rx={5} ry={7} fill={c as string} transform={`rotate(${a})`} />
            ))}
            <circle r={4} fill="#e8b84a" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Hanging lamps with soft light halos, one per room (drawn over the rooms). */
export function HouseLamps({ lit = [] }: { lit?: string[] }) {
  const L = HOUSE_LAYOUT;
  const cells = [
    ...L.upper.map((c) => ({ id: c.id as string, cx: c.x + c.w / 2, top: L.top.y })),
    ...L.lower.map((c) => ({ id: c.id as string, cx: c.x + c.w / 2, top: L.bottom.y })),
  ];
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden>
      {cells.map((c, i) => (
        <g key={i}>
          {lit.includes(c.id) && (
            <>
              <circle cx={c.cx} cy={c.top + 44} r={70} fill="#fff6c8" opacity={0.18} />
              <circle cx={c.cx} cy={c.top + 44} r={44} fill="#fff6c8" opacity={0.22} />
            </>
          )}
          <path d={`M${c.cx} ${c.top} V${c.top + 26}`} stroke={LINE} strokeWidth={1} />
          <path d={`M${c.cx - 22} ${c.top + 44} L${c.cx - 12} ${c.top + 26} H${c.cx + 12} L${c.cx + 22} ${c.top + 44} Z`} fill={lit.includes(c.id) ? "#f3dc9c" : "#c9c3b0"} stroke={LINE} strokeWidth={1.2} strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
}
