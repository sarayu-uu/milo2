/**
 * The cut-away house (1600×900 = the 16:9 stage), in the neat sticker-book
 * style: flat colours, one bold outline, a strict symmetric structure.
 *
 * Room interiors are NOT drawn here. They are live miniatures placed on top
 * at each room's `house` plot (see data/worlds/rooms + HOUSE_LAYOUT below).
 */
export const LINE = "rgba(140, 110, 80, 0.3)";
const FRAME = "#e2bb8f";
const FRAME_DARK = "#cfa173";
const ROOF = "#e9a998";
const ROOF_DARK = "#dc9281";

/**
 * The house (and its little garden) sits this far right of where it is drawn,
 * leaving the left edge clear for Milo. Everything on top shifts with it.
 */
export const HOUSE_SHIFT = 150;
export const HOUSE_SHIFT_PCT = (HOUSE_SHIFT / 1600) * 100;

/** Interior cells (px in the 1600×900 scene, before HOUSE_SHIFT). Rooms snap to these. */
export const HOUSE_LAYOUT = {
  frame: { x: 240, y: 262, w: 1120, h: 540 },
  wall: 18,
  floorY: 525, // middle floor beam top
  upper: [
    { id: "washroom", x: 258, w: 304 },
    { id: "bedroom", x: 580, w: 440 },
    { id: "playroom", x: 1038, w: 304 },
  ],
  lower: [
    { id: "kitchen", x: 258, w: 304 },
    { id: "dining", x: 580, w: 196 },
    { id: "living-room", x: 794, w: 548 },
  ],
} as const;

/** % plot of a cell (for absolutely positioned HTML on top). */
export function cellPlot(id: string) {
  const L = HOUSE_LAYOUT;
  const top = { y: L.frame.y + L.wall, h: L.floorY - (L.frame.y + L.wall) };
  const bottom = { y: L.floorY + L.wall, h: L.frame.y + L.frame.h - L.wall - (L.floorY + L.wall) };
  const up = L.upper.find((c) => c.id === id);
  const lo = L.lower.find((c) => c.id === id);
  const c = up ?? lo;
  if (!c) return null;
  const row = up ? top : bottom;
  return { x: ((c.x + HOUSE_SHIFT) / 1600) * 100, y: (row.y / 900) * 100, w: (c.w / 1600) * 100, h: (row.h / 900) * 100 };
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

export function HouseBackdrop() {
  const L = HOUSE_LAYOUT;
  const fx = L.frame.x;
  const fr = L.frame.x + L.frame.w;
  const fb = L.frame.y + L.frame.h;
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      {/* sky */}
      <rect width="1600" height="900" fill="#dbedf4" />
      <rect width="1600" height="200" fill="#e8f4f8" />
      <Cloud x={40} y={90} s={1.3} />
      <Cloud x={1400} y={60} s={1.1} />
      <Cloud x={1330} y={180} s={0.8} />

      {/* rolling hills + lawn */}
      <path d="M0 640 C200 560 420 600 600 640 L600 900 H0 Z" fill="#c5ddb6" stroke={LINE} strokeWidth={1.4} />
      <path d="M1000 640 C1180 580 1420 560 1600 620 V900 H1000 Z" fill="#c5ddb6" stroke={LINE} strokeWidth={1.4} />
      <path d="M0 760 C400 730 1200 730 1600 760 V900 H0 Z" fill="#b2d0a3" stroke={LINE} strokeWidth={1.4} />

      <g transform={`translate(${HOUSE_SHIFT} 0)`}>
      {/* chimneys (behind roof) */}
      {[430, 1130].map((x) => (
        <g key={x}>
          <rect x={x} y={34} width={56} height={100} fill="#dea291" stroke={LINE} strokeWidth={1.4} />
          <rect x={x - 8} y={26} width={72} height={18} fill="#cf8f7e" stroke={LINE} strokeWidth={1.4} />
          <path d={`M${x} 70 H${x + 56} M${x} 102 H${x + 56} M${x + 28} 44 V70 M${x + 14} 70 V102 M${x + 42} 70 V102`} stroke={LINE} strokeWidth={0.9} />
        </g>
      ))}

      {/* roof: a big tiled hip roof */}
      <path d="M180 270 L330 86 H1270 L1420 270 Z" fill={ROOF} stroke={LINE} strokeWidth={1.8} strokeLinejoin="round" />
      {[118, 150, 182, 214, 246].map((y) => {
        const t = (y - 86) / 184;
        const x0 = 330 - t * 150;
        const x1 = 1270 + t * 150;
        return <path key={y} d={`M${x0} ${y} H${x1}`} stroke={ROOF_DARK} strokeWidth={4} />;
      })}
      {/* vertical tile joints, staggered */}
      {Array.from({ length: 34 }, (_, i) => (
        <path key={i} d={`M${360 + i * 28} ${i % 2 ? 118 : 150} v32`} stroke={ROOF_DARK} strokeWidth={2.5} opacity={0.8} />
      ))}
      <rect x="320" y="76" width="960" height="16" rx="4" fill={ROOF_DARK} stroke={LINE} strokeWidth={1.4} />

      {/* small arched dormer windows with flower boxes */}
      {[400, 560, 1040, 1200].map((x) => (
        <g key={x}>
          <path d={`M${x - 46} 220 V176 A46 46 0 0 1 ${x + 46} 176 V220 Z`} fill="#ffffff" stroke={LINE} strokeWidth={1.6} />
          <path d={`M${x - 34} 220 V180 A34 34 0 0 1 ${x + 34} 180 V220 Z`} fill="#cfe6ee" stroke={LINE} strokeWidth={1} />
          <path d={`M${x} 146 V220 M${x - 34} 190 H${x + 34}`} stroke={LINE} strokeWidth={1} />
          <rect x={x - 52} y={218} width={104} height={20} rx={4} fill="#c0997a" stroke={LINE} strokeWidth={1.2} />
          <path d={`M${x - 48} 220 q8 -14 16 0 q8 -14 16 0 q8 -14 16 0 q8 -14 16 0 q8 -14 16 0 q8 -14 16 0`} fill="#a9cf9b" stroke={LINE} strokeWidth={1} />
        </g>
      ))}
      {/* the big arched centre window */}
      <path d="M680 262 V196 A120 120 0 0 1 920 196 V262 Z" fill="#ffffff" stroke={LINE} strokeWidth={1.8} />
      <path d="M700 262 V200 A100 100 0 0 1 900 200 V262 Z" fill="#cfe6ee" stroke={LINE} strokeWidth={1.2} />
      <path d="M800 100 V262 M700 210 H900" stroke={LINE} strokeWidth={1.2} />
      <path d="M730 160 L760 130 M745 175 L790 128" stroke="#ffffff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />

      {/* house frame: back wall colour behind rooms, then the wooden frame */}
      <rect x={fx} y={L.frame.y} width={L.frame.w} height={L.frame.h} fill="#faefdf" />
      {/* outer frame */}
      <rect x={fx} y={L.frame.y} width={L.frame.w} height={L.frame.h} fill="none" stroke={FRAME} strokeWidth={L.wall * 2} />
      <rect x={fx - L.wall} y={L.frame.y - L.wall} width={L.frame.w + L.wall * 2} height={L.frame.h + L.wall * 2} fill="none" stroke={LINE} strokeWidth={1.8} />
      <rect x={fx + L.wall} y={L.frame.y + L.wall} width={L.frame.w - L.wall * 2} height={L.frame.h - L.wall * 2} fill="none" stroke={LINE} strokeWidth={1.4} />
      {/* middle floor beam */}
      <rect x={fx} y={L.floorY} width={L.frame.w} height={L.wall} fill={FRAME} stroke={LINE} strokeWidth={1.4} />
      {/* inner walls */}
      {[...L.upper.slice(1).map((c) => ({ x: c.x - L.wall, top: L.frame.y + L.wall, bot: L.floorY })), ...L.lower.slice(1).map((c) => ({ x: c.x - L.wall, top: L.floorY + L.wall, bot: fb - L.wall }))].map(
        (w, i) => (
          <rect key={i} x={w.x} y={w.top} width={L.wall} height={w.bot - w.top} fill={FRAME} stroke={LINE} strokeWidth={1.4} />
        ),
      )}
      {/* ground beam + front steps */}
      <rect x={fx - 30} y={fb + 10} width={L.frame.w + 60} height={22} rx={4} fill={FRAME_DARK} stroke={LINE} strokeWidth={1.4} />
      <rect x={fx - 70} y={fb + 22} width={60} height={14} rx={3} fill="#e2dace" stroke={LINE} strokeWidth={1.2} />

      {/* garden by the house: flower bed + a little tree */}
      <path d="M118 772 V700" stroke="#c0997a" strokeWidth={14} strokeLinecap="round" />
      <circle cx="118" cy="660" r="56" fill="#a9cf9b" stroke={LINE} strokeWidth={1.4} />
      <circle cx="96" cy="646" r="7" fill="#eba79a" />
      <circle cx="140" cy="672" r="7" fill="#eba79a" />
      {[40, 70, 170, 200].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 800 V776`} stroke="#93b885" strokeWidth={4} />
          <circle cx={x} cy={770} r={9} fill={["#f3c9d1", "#f3dc9c", "#d3c7ec", "#f3c9d1"][i]} stroke={LINE} strokeWidth={1} />
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
    ...L.upper.map((c) => ({ id: c.id as string, cx: c.x + c.w / 2, top: L.frame.y + L.wall })),
    ...L.lower.map((c) => ({ id: c.id as string, cx: c.x + c.w / 2, top: L.floorY + L.wall })),
  ];
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden>
      {cells.map((c, i) => (
        <g key={i} transform={`translate(${HOUSE_SHIFT} 0)`}>
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
