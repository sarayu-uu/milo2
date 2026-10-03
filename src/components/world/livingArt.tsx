/**
 * Living-room pieces in the neat sticker-book style: flat colour, one bold
 * outline, a few inner lines. A warm, lived-in, ordinary room.
 */
import type { RoomArt } from "./roomArt";

/** Soft warm edge: paper cut-outs, not colouring-book lines. */
const LINE = "rgba(140, 110, 80, 0.28)";
const o = { stroke: LINE, strokeWidth: 1.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const thin = { stroke: LINE, strokeWidth: 0.9, strokeLinecap: "round" as const, fill: "none" };

const BOOK_COLORS = ["#eda393", "#9dbad3", "#f2d68a", "#a7c99a", "#cdbfe9", "#f2c3cc", "#8eaac1", "#efbb93"];

function Books({ x, y, h, n, start = 0 }: { x: number; y: number; h: number; n: number; start?: number }) {
  let cx = x;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const w = 12 + ((i * 7 + start) % 3) * 4;
        const bh = h - ((i * 5 + start) % 3) * 6;
        const el = <rect key={i} x={cx} y={y + (h - bh)} width={w} height={bh} fill={BOOK_COLORS[(i + start) % BOOK_COLORS.length]} {...o} strokeWidth={0.9} />;
        cx += w + 1;
        return el;
      })}
    </g>
  );
}

function Leaf({ x, y, r, s = 1, c = "#9cc28c" }: { x: number; y: number; r: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0 C12 -14 34 -14 44 0 C34 14 12 14 0 0 Z" fill={c} {...o} strokeWidth={1} />
      <path d="M4 0 H38" {...thin} strokeWidth={0.8} />
    </g>
  );
}

export const LIVING_ART: Record<string, RoomArt> = {
  /** Tall window onto the city: buildings, a water tank on legs, birds, a washing line. */
  "window-city": {
    w: 340,
    h: 300,
    draw: () => (
      <g>
        <rect x={14} y={8} width={312} height={268} rx={6} fill="#d2a77b" {...o} />
        <rect x={30} y={24} width={280} height={236} fill="#d6ecf5" {...o} strokeWidth={1} />
        {/* city */}
        <path d="M30 150 H62 V112 H96 V138 H120 V96 H156 V128 H176 V108 H214 V140 H246 V100 H282 V132 H310 V260 H30 Z" fill="#dde0ee" {...o} strokeWidth={0.9} />
        {[70, 130, 190, 256].map((x, i) => (
          <g key={x}>
            <rect x={x} y={170 - (i % 2) * 20} width={42} height={90 + (i % 2) * 20} fill={["#f5d8c1", "#f0c4b8", "#f7e6bd", "#e5d8ef"][i]} {...o} strokeWidth={1} />
            {[0, 1, 2].map((r) => (
              <rect key={r} x={x + 8} y={182 - (i % 2) * 20 + r * 24} width={10} height={12} fill="#fff8e6" {...o} strokeWidth={0.8} />
            ))}
            {[0, 1, 2].map((r) => (
              <rect key={`b${r}`} x={x + 24} y={182 - (i % 2) * 20 + r * 24} width={10} height={12} fill="#fff8e6" {...o} strokeWidth={0.8} />
            ))}
          </g>
        ))}
        {/* rooftop water tank on legs */}
        <path d="M128 92 L124 124 M152 92 L156 124" {...thin} strokeWidth={1} />
        <path d="M122 70 C122 60 158 60 158 70 V92 H122 Z" fill="#9aa5b0" {...o} strokeWidth={1} />
        <path d="M120 70 L140 56 L160 70" fill="#8794a0" {...o} strokeWidth={1} />
        {/* trees */}
        <circle cx={44} cy={236} r={22} fill="#a7c99a" {...o} strokeWidth={1} />
        <circle cx={292} cy={232} r={24} fill="#9cc28c" {...o} strokeWidth={1} />
        {/* washing line with clothes */}
        <path d="M30 150 Q170 176 310 146" {...thin} strokeWidth={0.8} />
        <path d="M70 158 h18 v24 l-9 -5 l-9 5 Z" fill="#eda393" {...o} strokeWidth={0.8} />
        <path d="M110 162 h22 l-3 20 h-16 Z" fill="#9dbad3" {...o} strokeWidth={0.8} />
        <rect x={160} y={164} width={16} height={22} fill="#f2d68a" {...o} strokeWidth={0.8} />
        <path d="M206 160 h22 v18 h-22 Z" fill="#a7c99a" {...o} strokeWidth={0.8} />
        <path d="M252 156 h16 v26 l-8 -4 l-8 4 Z" fill="#f2c3cc" {...o} strokeWidth={0.8} />
        {/* birds */}
        <path d="M200 52 q7 -7 14 0 q7 -7 14 0 M240 76 q6 -6 12 0 q6 -6 12 0 M90 60 q6 -6 12 0 q6 -6 12 0" {...thin} strokeWidth={0.9} />
        {/* frame bars */}
        <rect x={164} y={24} width={12} height={236} fill="#d2a77b" {...o} strokeWidth={1} />
        <rect x={30} y={136} width={280} height={10} fill="#d2a77b" {...o} strokeWidth={1} />
        {/* sill */}
        <rect x={0} y={268} width={340} height={20} rx={4} fill="#e2bd93" {...o} />
        {/* soft cream curtains */}
        <path d="M-6 0 C30 80 10 190 34 292 H-14 Z" fill="#fbf3e0" {...o} />
        <path d="M346 0 C304 90 326 200 302 292 H354 Z" fill="#fbf3e0" {...o} />
        <path d="M10 40 C18 120 10 200 20 280 M330 40 C320 130 328 210 318 280" {...thin} strokeWidth={0.8} opacity={0.5} />
        <rect x={-14} y={-6} width={368} height={12} rx={5} fill="#b98d66" {...o} strokeWidth={1} />
      </g>
    ),
  },

  /** Coral sofa (back layer) with a blue throw. Pair with "sofa-front" at the same box. */
  sofa: {
    w: 380,
    h: 230,
    draw: () => (
      <g>
        <path d="M40 40 C40 16 340 16 340 40 V150 H40 Z" fill="#eba792" {...o} />
        {/* cushions */}
        <path d="M66 76 C66 50 136 48 146 74 C150 100 76 104 66 76 Z" fill="#f6efe1" {...o} strokeWidth={1} />
        <path d="M86 70 l12 6 l12 -8 M100 60 l6 18" {...thin} stroke="#9cc28c" strokeWidth={1} />
        <path d="M150 80 C152 58 210 58 214 82 C216 104 154 106 150 80 Z" fill="#f2d68a" {...o} strokeWidth={1} />
        <path d="M160 74 H206 M162 86 H206 M182 64 V100" {...thin} stroke="#e3c271" strokeWidth={0.9} />
        {/* the throw blanket over the back + arm */}
        <path d="M232 26 H306 L312 150 L300 168 L292 150 L282 170 L272 150 L262 168 L254 150 L246 166 L238 150 Z" fill="#a9c3d9" {...o} strokeWidth={1} />
        <path d="M244 40 H300 M246 60 H302 M248 80 H304" {...thin} stroke="#f6efe1" strokeWidth={1.4} />
        {/* seat */}
        <rect x={34} y={118} width={312} height={46} rx={14} fill="#e3967f" {...o} />
        <path d="M190 122 V160" {...thin} strokeWidth={0.9} />
        {/* arms */}
        <rect x={6} y={84} width={56} height={98} rx={24} fill="#eba792" {...o} />
        <rect x={318} y={84} width={56} height={98} rx={24} fill="#eba792" {...o} />
        {/* the dark gap underneath (things get lost here) */}
        <rect x={44} y={176} width={292} height={34} fill="#9c8a78" />
      </g>
    ),
  },
  /** The front rail + legs of the sofa, drawn in front of anything under it. */
  "sofa-front": {
    w: 380,
    h: 230,
    draw: () => (
      <g>
        <rect x={30} y={158} width={320} height={24} rx={8} fill="#e3967f" {...o} />
        {/* under-sofa shadow hides whatever pokes into it */}
        <rect x={44} y={184} width={292} height={24} fill="#9c8a78" opacity={0.93} />
        <rect x={34} y={180} width={14} height={40} rx={3} fill="#b98d66" {...o} strokeWidth={1} />
        <rect x={332} y={180} width={14} height={40} rx={3} fill="#b98d66" {...o} strokeWidth={1} />
      </g>
    ),
  },

  /** Floor lamp with a warm shade. */
  "floor-lamp": {
    w: 120,
    h: 330,
    draw: () => (
      <g>
        <circle cx={60} cy={60} r={56} fill="#fff3c4" opacity={0.5} />
        <path d="M24 90 L38 20 H82 L96 90 Z" fill="#f6d78a" {...o} />
        <path d="M60 90 V312" stroke={LINE} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M60 90 V312" stroke="#b98d66" strokeWidth={5} strokeLinecap="round" />
        <ellipse cx={60} cy={316} rx={34} ry={9} fill="#b98d66" {...o} strokeWidth={1} />
      </g>
    ),
  },

  /** A big leafy floor plant in a terracotta pot. */
  "plant-floor": {
    w: 160,
    h: 260,
    draw: () => (
      <g>
        <path d="M80 190 C70 140 60 90 40 50 M80 190 C84 130 96 80 120 40 M80 190 C76 150 80 110 82 70" {...thin} stroke="#86ab77" strokeWidth={1.4} />
        <Leaf x={40} y={52} r={-140} s={1.3} />
        <Leaf x={118} y={44} r={-40} s={1.3} c="#a7c99a" />
        <Leaf x={82} y={70} r={-90} s={1.2} c="#8db87d" />
        <Leaf x={60} y={110} r={-160} s={1.1} c="#a7c99a" />
        <Leaf x={104} y={104} r={-20} s={1.1} />
        <Leaf x={66} y={150} r={-170} s={0.9} />
        <path d="M40 186 H120 L108 256 H52 Z" fill="#e8a487" {...o} />
        <rect x={34} y={176} width={92} height={18} rx={4} fill="#efbb93" {...o} strokeWidth={1} />
      </g>
    ),
  },

  /** A plant hanging from the ceiling, trailing down. */
  "plant-hanging": {
    w: 140,
    h: 260,
    draw: () => (
      <g>
        <path d="M70 0 V60 M40 92 L70 60 L100 92" {...thin} strokeWidth={0.9} />
        <path d="M36 92 H104 C104 120 92 132 70 132 C48 132 36 120 36 92 Z" fill="#f6efe1" {...o} />
        <path d="M42 104 C30 150 34 200 40 250 M98 104 C112 150 106 190 102 230 M70 132 C66 170 72 200 68 220" {...thin} stroke="#86ab77" strokeWidth={1} />
        {[
          [38, 130, -70],
          [36, 170, 100],
          [40, 210, -80],
          [104, 140, -110],
          [108, 180, 80],
          [70, 170, -100],
          [70, 206, 90],
          [44, 96, -160],
          [96, 96, -20],
        ].map(([x, y, r], i) => (
          <Leaf key={i} x={x} y={y} r={r} s={0.55} c={i % 2 ? "#a7c99a" : "#8db87d"} />
        ))}
      </g>
    ),
  },

  /** Low cubby shelf under the window: books, a plant, a mug. */
  "cubby-shelf": {
    w: 280,
    h: 150,
    draw: () => (
      <g>
        <rect x={6} y={16} width={268} height={128} rx={6} fill="#f6efe1" {...o} />
        <path d="M95 16 V144 M185 16 V144 M6 80 H274" stroke={LINE} strokeWidth={1.4} />
        <Books x={16} y={30} h={44} n={4} />
        <Books x={196} y={92} h={44} n={4} start={3} />
        <rect x={110} y={92} width={60} height={44} rx={6} fill="#a9c3d9" {...o} strokeWidth={1} />
        <rect x={20} y={100} width={56} height={36} rx={6} fill="#f2d68a" {...o} strokeWidth={1} />
        {/* plant + mug on top */}
        <path d="M200 0 C190 -20 196 -40 210 -50 M210 0 C214 -24 226 -40 240 -44" {...thin} stroke="#86ab77" strokeWidth={1} />
        <Leaf x={204} y={-40} r={-120} s={0.6} />
        <Leaf x={232} y={-40} r={-40} s={0.6} c="#a7c99a" />
        <path d="M196 16 L200 -4 H236 L240 16 Z" fill="#e8a487" {...o} strokeWidth={1} />
        <rect x={40} y={-6} width={26} height={22} rx={4} fill="#ffffff" {...o} strokeWidth={1} />
        <path d="M66 0 c9 0 9 12 0 12" {...thin} strokeWidth={1} />
      </g>
    ),
  },

  /** Tall bookshelf at the edge of the room. */
  "bookshelf-tall": {
    w: 150,
    h: 420,
    draw: () => (
      <g>
        <rect x={6} y={6} width={140} height={410} rx={4} fill="#d2a77b" {...o} />
        {[86, 172, 258, 344].map((y) => (
          <rect key={y} x={6} y={y} width={140} height={10} fill="#b98d66" {...o} strokeWidth={1} />
        ))}
        <Books x={16} y={30} h={56} n={7} />
        <Books x={16} y={116} h={56} n={6} start={2} />
        <Books x={16} y={202} h={56} n={7} start={4} />
        <Books x={16} y={288} h={56} n={5} start={1} />
        <rect x={16} y={360} width={110} height={44} rx={6} fill="#f6efe1" {...o} strokeWidth={1} />
      </g>
    ),
  },

  /** Round coffee table with a mug and a little plant. */
  "coffee-table": {
    w: 260,
    h: 140,
    draw: () => (
      <g>
        <path d="M44 60 L30 136 M216 60 L230 136 M100 64 L96 130 M160 64 L164 130" stroke={LINE} strokeWidth={3.2} strokeLinecap="round" />
        <path d="M44 60 L30 136 M216 60 L230 136 M100 64 L96 130 M160 64 L164 130" stroke="#b98d66" strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={130} cy={52} rx={124} ry={22} fill="#d9b089" {...o} />
        {/* mug with a tiny pigeon on it */}
        <rect x={64} y={14} width={28} height={30} rx={5} fill="#ffffff" {...o} strokeWidth={1} />
        <path d="M92 20 c10 0 10 14 0 14" {...thin} strokeWidth={1} />
        <ellipse cx={78} cy={30} rx={6} ry={5} fill="#56616c" />
        {/* small potted plant */}
        <path d="M168 44 L172 20 H198 L202 44 Z" fill="#a9c3d9" {...o} strokeWidth={1} />
        <Leaf x={176} y={16} r={-120} s={0.55} />
        <Leaf x={192} y={16} r={-50} s={0.55} c="#a7c99a" />
        {/* a book lying flat */}
        <rect x={112} y={34} width={42} height={10} rx={2} fill="#f2d68a" {...o} strokeWidth={0.9} />
      </g>
    ),
  },

  /** Patchwork rug of soft squares. */
  "rug-patchwork": {
    w: 800,
    h: 100,
    draw: () => {
      const colors = ["#f5d8c1", "#cfe0b8", "#f7e6bd", "#e5d8ef", "#bfdcef", "#f2b8b0"];
      return (
        <g>
          <path d="M40 6 H760 L796 94 H4 Z" fill="#f6efe1" {...o} />
          {Array.from({ length: 18 }, (_, i) =>
            Array.from({ length: 2 }, (_, r) => {
              const x0 = 40 + i * 40 - r * 18;
              const y0 = 12 + r * 40;
              return (
                <path
                  key={`${i}-${r}`}
                  d={`M${x0 + 4} ${y0} h34 l${8} 36 h-34 Z`}
                  fill={colors[(i + r * 3) % colors.length]}
                  stroke={LINE}
                  strokeWidth={1.6}
                  strokeOpacity={0.5}
                />
              );
            }),
          )}
        </g>
      );
    },
  },

  /** A stack of picture books ("BIG IDEAS"). */
  "books-stack": {
    w: 150,
    h: 110,
    draw: () => (
      <g>
        <rect x={10} y={76} width={130} height={26} rx={4} fill="#eda393" {...o} strokeWidth={1} />
        <rect x={18} y={50} width={116} height={26} rx={4} fill="#a9c3d9" {...o} strokeWidth={1} />
        <rect x={6} y={24} width={126} height={26} rx={4} fill="#f2d68a" {...o} strokeWidth={1} />
        <text x={70} y={43} textAnchor="middle" fontSize={15} fontWeight={700} fontFamily="var(--font-display)" fill={LINE}>
          BIG IDEAS
        </text>
        <rect x={30} y={4} width={90} height={20} rx={4} fill="#a7c99a" {...o} strokeWidth={1} />
      </g>
    ),
  },

  /** Picture frames on the wall: a house, a leaf, a pigeon family. */
  frames: {
    w: 220,
    h: 200,
    draw: () => (
      <g>
        <rect x={10} y={10} width={86} height={96} fill="#d2a77b" {...o} />
        <rect x={20} y={20} width={66} height={76} fill="#d6ecf5" {...o} strokeWidth={0.9} />
        <path d="M30 96 V62 L52 44 L74 62 V96 Z" fill="#f5d8c1" {...o} strokeWidth={0.9} />
        <rect x={46} y={72} width={12} height={24} fill="#eda393" {...o} strokeWidth={0.8} />
        <rect x={120} y={4} width={70} height={84} fill="#f6efe1" {...o} />
        <Leaf x={138} y={66} r={-60} s={0.9} />
        <rect x={110} y={110} width={100} height={78} fill="#d2a77b" {...o} />
        <rect x={120} y={120} width={80} height={58} fill="#fbe9d6" {...o} strokeWidth={0.9} />
        {/* a pigeon family portrait */}
        <ellipse cx={146} cy={160} rx={14} ry={15} fill="#aab3bb" {...o} strokeWidth={0.8} />
        <circle cx={146} cy={142} r={9} fill="#56616c" {...o} strokeWidth={0.8} />
        <ellipse cx={176} cy={164} rx={10} ry={11} fill="#aab3bb" {...o} strokeWidth={0.8} />
        <circle cx={176} cy={150} r={7} fill="#56616c" {...o} strokeWidth={0.8} />
      </g>
    ),
  },

  /** Kept for other rooms/uses. */
  "taped-drawings": {
    w: 170,
    h: 140,
    draw: () => (
      <g>
        <g transform="rotate(-6 50 60)">
          <rect x={8} y={14} width={84} height={100} fill="#ffffff" {...o} strokeWidth={1} />
          <circle cx={70} cy={36} r={10} fill="none" stroke="#f2d68a" strokeWidth={4} />
          <path d="M22 100 V64 L46 44 L70 64 V100 Z" fill="none" stroke="#eda393" strokeWidth={4} strokeLinejoin="round" />
          <rect x={36} y={8} width={28} height={10} fill="rgba(232,214,160,0.9)" />
        </g>
        <g transform="rotate(5 128 70)">
          <rect x={92} y={28} width={72} height={88} fill="#ffffff" {...o} strokeWidth={1} />
          <path d="M100 98 C110 54 150 54 158 98" stroke="#eda393" strokeWidth={5} fill="none" />
          <path d="M108 98 C116 66 144 66 150 98" stroke="#f2d68a" strokeWidth={5} fill="none" />
          <path d="M116 98 C122 78 138 78 142 98" stroke="#9dbad3" strokeWidth={5} fill="none" />
          <rect x={114} y={22} width={28} height={10} fill="rgba(242,167,184,0.9)" />
        </g>
      </g>
    ),
  },

  /** A drawing of Milo taped to the wall (made by "someone"). */
  "pigeon-drawing": {
    w: 120,
    h: 130,
    draw: () => (
      <g transform="rotate(-4 60 65)">
        <rect x={8} y={10} width={104} height={114} fill="#ffffff" {...o} strokeWidth={1} />
        <ellipse cx={60} cy={82} rx={28} ry={24} fill="none" stroke="#cdbfe9" strokeWidth={4} />
        <circle cx={60} cy={50} r={16} fill="none" stroke="#9dbad3" strokeWidth={4} />
        <circle cx={64} cy={47} r={3} fill={LINE} />
        <path d="M76 50 l8 3 l-8 3" stroke="#efbb93" strokeWidth={3} fill="none" />
        <circle cx={96} cy={28} r={8} fill="none" stroke="#f2d68a" strokeWidth={4} />
        <path d="M48 106 v10 M70 106 v10" stroke="#efbb93" strokeWidth={3} />
        <rect x={42} y={2} width={36} height={12} fill="rgba(232,214,160,0.9)" />
      </g>
    ),
  },

  /** Tiny side table with a mug. */
  "side-table": {
    w: 120,
    h: 150,
    draw: () => (
      <g>
        <rect x={6} y={40} width={108} height={16} rx={4} fill="#d9b089" {...o} />
        <rect x={16} y={56} width={12} height={90} rx={3} fill="#b98d66" {...o} strokeWidth={1} />
        <rect x={92} y={56} width={12} height={90} rx={3} fill="#b98d66" {...o} strokeWidth={1} />
        <rect x={34} y={8} width={30} height={32} rx={5} fill="#ffffff" {...o} strokeWidth={1} />
        <path d="M64 14 c10 0 10 14 0 14" {...thin} strokeWidth={1} />
        <ellipse cx={49} cy={24} rx={7} ry={6} fill="#56616c" />
        <rect x={70} y={28} width={36} height={12} rx={2} fill="#a9c3d9" {...o} strokeWidth={0.9} />
      </g>
    ),
  },

  /** Floor toys: a dotty ball and blocks. */
  toys: {
    w: 160,
    h: 80,
    draw: () => (
      <g>
        <rect x={6} y={40} width={30} height={30} fill="#eda393" {...o} strokeWidth={1} />
        <rect x={20} y={14} width={26} height={26} fill="#9dbad3" transform="rotate(8 33 27)" {...o} strokeWidth={1} />
        <rect x={38} y={44} width={26} height={26} fill="#a7c99a" {...o} strokeWidth={1} />
        {/* toy car */}
        <path d="M80 54 h56 l12 12 v8 h-80 v-8 Z" fill="#f2d68a" {...o} strokeWidth={1} />
        <path d="M92 54 l10 -16 h24 l10 16 Z" fill="#8fd0e0" {...o} strokeWidth={1} />
        <circle cx={96} cy={74} r={7} fill="#9c8a78" {...o} strokeWidth={0.8} />
        <circle cx={132} cy={74} r={7} fill="#9c8a78" {...o} strokeWidth={0.8} />
      </g>
    ),
  },

  "rug-crooked": {
    w: 420,
    h: 110,
    draw: () => (
      <g transform="rotate(-3 210 55)">
        <rect x={10} y={14} width={400} height={82} rx={10} fill="#cdbfe9" {...o} />
        {[34, 58, 82].map((y, i) => (
          <rect key={y} x={10} y={y} width={400} height={8} fill={i === 1 ? "#f2d68a" : "#ffffff"} />
        ))}
      </g>
    ),
  },

  "floor-cushion": {
    w: 120,
    h: 60,
    draw: () => (
      <g>
        <path d="M8 40 C8 14 112 10 114 36 C116 56 10 60 8 40 Z" fill="#a7c99a" {...o} />
        <circle cx={60} cy={34} r={4} fill="#86ab77" />
      </g>
    ),
  },

  "bookshelf-low": {
    w: 240,
    h: 190,
    draw: () => (
      <g>
        <rect x={8} y={20} width={224} height={164} rx={4} fill="#d2a77b" {...o} />
        <rect x={8} y={96} width={224} height={9} fill="#b98d66" {...o} strokeWidth={1} />
        <Books x={20} y={36} h={58} n={6} />
        <Books x={20} y={118} h={60} n={5} start={3} />
      </g>
    ),
  },
};
