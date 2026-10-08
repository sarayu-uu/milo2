"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * The paper boat, fold by fold, animated. Each card loops: the paper sits
 * still, a hand takes the moving corner, the paper folds over its crease
 * (projected, so it really looks like it's turning over), then it holds.
 *
 * Two tones: one side of the paper is darker than the other, so you can
 * always see what got folded.
 */

type Pt = [number, number];
const FRONT = "#8cc0e3";
const BACK = "#5d97c4";
const LIGHT = "#c4e1f3";
const INK = "#3a3833";

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
/** Progress (eased) of a phase that runs from a to b of the card's timeline. */
const seg = (t: number, a: number, b: number) => ease(clamp01((t - a) / (b - a)));
const active = (t: number, a: number, b: number) => (t > a - 0.06 && t < b + 0.04 ? 1 : 0);
const lerp = (p: Pt, q: Pt, k: number): Pt => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
const lerpPts = (a: Pt[], b: Pt[], k: number) => a.map((p, i) => lerp(p, b[i], k));

/** Where point p is when the paper is folded k of the way over the crease ab (seen from above). */
function foldPt(p: Pt, a: Pt, b: Pt, k: number): Pt {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s = (p[0] - a[0]) * ux + (p[1] - a[1]) * uy;
  const f: Pt = [a[0] + s * ux, a[1] + s * uy];
  const c = Math.cos(Math.PI * k);
  return [f[0] + (p[0] - f[0]) * c, f[1] + (p[1] - f[1]) * c];
}

const path = (pts: Pt[]) => "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L") + " Z";

function Poly({ pts, fill }: { pts: Pt[]; fill: string }) {
  return <path d={path(pts)} fill={fill} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />;
}

/** A flap of paper folding over the crease ab. Shows its other side once it's past halfway. */
function Flap({ pts, a, b, k, front, back }: { pts: Pt[]; a: Pt; b: Pt; k: number; front: string; back: string }) {
  return <Poly pts={pts.map((p) => foldPt(p, a, b, k))} fill={k < 0.5 ? front : back} />;
}

/** Dotted line: where to fold. Drawn over the paper; fades as the fold happens (k = fold progress). */
function Crease({ a, b, o = 1, k = 0 }: { a: Pt; b: Pt; o?: number; k?: number }) {
  return (
    <path
      d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`}
      stroke="#c0392b"
      strokeWidth={2}
      strokeDasharray="5 4"
      strokeLinecap="round"
      opacity={o * clamp01(1 - k * 2.5)}
    />
  );
}

/** A hand on the bit that moves (fingertip at the point). */
function Hand({ at, o, emoji = "👆" }: { at: Pt; o: number; emoji?: string }) {
  return (
    <text x={at[0]} y={at[1] + 19} fontSize={22} textAnchor="middle" opacity={o} style={{ transition: "opacity 0.2s" }}>
      {emoji}
    </text>
  );
}

/** "Turn it over": a curved arrow over the paper. */
function TurnOver({ o }: { o: number }) {
  return (
    <g opacity={o} style={{ transition: "opacity 0.2s" }}>
      <path d="M62 16 C80 2 120 2 138 16" fill="none" stroke="#df917a" strokeWidth={3} strokeLinecap="round" />
      <path d="M130 9 L139 17 L127 20" fill="none" stroke="#df917a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** Flip the whole thing over, like turning a page (around x = 100). */
function Flip({ k, front, back }: { k: number; front: ReactNode; back: ReactNode }) {
  const c = Math.cos(Math.PI * k);
  const sx = Math.sign(c || 1) * Math.max(Math.abs(c), 0.02);
  return <g transform={`translate(100 0) scale(${sx} 1) translate(-100 0)`}>{k < 0.5 ? front : back}</g>;
}

/* ---------- the shapes (viewBox 200 × 160) ---------- */

// the folded-in-half paper, fold at the top
const X0 = 30.5;
const X1 = 169.5;
const Y0 = 31;
const Y1 = 129;
const YS = 100.5; // where the corners come down to; below this is the strip
const STRIP: Pt[] = [[X0, YS], [X1, YS], [X1, Y1], [X0, Y1]];
const HOUSE_TOP: Pt[] = [[X0, YS], [100, Y0], [X1, YS]];
// the big diamond
const DIAMOND_TOP: Pt[] = [[40, 85], [100, 25], [160, 85]];
const DIAMOND_BOTTOM: Pt[] = [[40, 85], [160, 85], [100, 145]];

type Card = { ms: number; draw: (t: number, secs: number) => ReactNode };

export const BOAT_FOLDS: Record<string, Card> = {
  /* 1. tall paper, top half down */
  "boat-1": {
    ms: 2600,
    draw: (t) => {
      const k = seg(t, 0.15, 0.85);
      const a: Pt = [50.5, 80];
      const b: Pt = [149.5, 80];
      return (
        <>
          <Poly pts={[[50.5, 80], [149.5, 80], [149.5, 150], [50.5, 150]]} fill={FRONT} />
          <Flap pts={[[50.5, 10], [149.5, 10], [149.5, 80], [50.5, 80]]} a={a} b={b} k={k} front={FRONT} back={BACK} />
          <Crease a={a} b={b} k={k} />
          <Hand at={foldPt([100, 10], a, b, k)} o={active(t, 0.15, 0.85)} />
        </>
      );
    },
  },

  /* 2. fold in half sideways and open again: a line down the middle */
  "boat-2": {
    ms: 3400,
    draw: (t) => {
      const k = t < 0.5 ? seg(t, 0.1, 0.42) : 1 - seg(t, 0.58, 0.9);
      const a: Pt = [100, Y0];
      const b: Pt = [100, Y1];
      return (
        <>
          <Poly pts={[[100, Y0], [X1, Y0], [X1, Y1], [100, Y1]]} fill={BACK} />
          <Flap pts={[[X0, Y0], [100, Y0], [100, Y1], [X0, Y1]]} a={a} b={b} k={k} front={BACK} back={FRONT} />
          {t < 0.42 ? <Crease a={a} b={b} k={k} /> : <path d={`M100 ${Y0} V${Y1}`} stroke={INK} strokeWidth={1.2} opacity={0.55} />}
          <Hand at={foldPt([X0, 80], a, b, k)} o={active(t, 0.1, 0.9)} />
        </>
      );
    },
  },

  /* 3. top corners down to the middle line */
  "boat-3": {
    ms: 3400,
    draw: (t) => {
      const kl = seg(t, 0.1, 0.42);
      const kr = seg(t, 0.52, 0.84);
      const top: Pt = [100, Y0];
      const left: Pt = [X0, YS];
      const right: Pt = [X1, YS];
      return (
        <>
          {/* under the corners there's no more paper: the folded corners ARE those triangles */}
          <Poly pts={[left, top, right, [X1, Y1], [X0, Y1]]} fill={BACK} />
          <path d={`M100 ${Y0} V${Y1}`} stroke={INK} strokeWidth={1.2} opacity={0.55} />
          <Flap pts={[[X0, Y0], top, left]} a={top} b={left} k={kl} front={BACK} back={FRONT} />
          <Flap pts={[[X1, Y0], top, right]} a={top} b={right} k={kr} front={BACK} back={FRONT} />
          <Crease a={top} b={left} k={kl} />
          <Crease a={top} b={right} k={kr} />
          <Hand at={foldPt([X0, Y0], top, left, kl)} o={active(t, 0.1, 0.42)} />
          <Hand at={foldPt([X1, Y0], top, right, kr)} o={active(t, 0.52, 0.84)} />
        </>
      );
    },
  },

  /* 4. strip up, turn over, other strip up: a hat */
  "boat-4": {
    ms: 4600,
    draw: (t) => {
      const k1 = seg(t, 0.05, 0.3);
      const turn = seg(t, 0.38, 0.6);
      const k2 = seg(t, 0.68, 0.93);
      const a: Pt = [X0, YS];
      const b: Pt = [X1, YS];
      const front = (
        <>
          <Poly pts={HOUSE_TOP} fill={FRONT} />
          <path d={`M100 ${Y0} L100 ${YS}`} stroke={INK} strokeWidth={1.2} />
          <Flap pts={STRIP} a={a} b={b} k={k1} front={BACK} back={FRONT} />
          <Crease a={a} b={b} k={k1} />
        </>
      );
      const back = (
        <>
          <Poly pts={HOUSE_TOP} fill={BACK} />
          <Flap pts={STRIP} a={a} b={b} k={k2} front={BACK} back={FRONT} />
          <Crease a={a} b={b} k={k2} />
        </>
      );
      return (
        <>
          <Flip k={turn} front={front} back={back} />
          <TurnOver o={active(t, 0.38, 0.6)} />
          <Hand at={foldPt([100, Y1], a, b, k1)} o={active(t, 0.05, 0.3)} />
          <Hand at={foldPt([100, Y1], a, b, k2)} o={active(t, 0.68, 0.93)} />
        </>
      );
    },
  },

  /* 5. open the hat, ends together, flat: a diamond */
  "boat-5": {
    ms: 3200,
    draw: (t) => {
      const k = seg(t, 0.15, 0.85);
      const band0: Pt[] = [[X0, 72], [X1, 72], [X1, YS], [X0, YS]];
      const band1: Pt[] = [[40, 85], [160, 85], [100, 145], [100, 145]];
      return (
        <>
          <Poly pts={lerpPts(HOUSE_TOP, DIAMOND_TOP, k)} fill={BACK} />
          <Poly pts={lerpPts(band0, band1, k)} fill={FRONT} />
          <path d="M100 85 L100 145" stroke={INK} strokeWidth={1.2} opacity={k} />
          <Hand at={lerp([X0, YS], [100, 145], k)} o={active(t, 0.15, 0.85)} emoji="👉" />
          <Hand at={lerp([X1, YS], [100, 145], k)} o={active(t, 0.15, 0.85)} emoji="👈" />
        </>
      );
    },
  },

  /* 6. bottom point up, turn over, the other one up: a triangle */
  "boat-6": {
    ms: 4600,
    draw: (t) => {
      const k1 = seg(t, 0.05, 0.3);
      const turn = seg(t, 0.38, 0.6);
      const k2 = seg(t, 0.68, 0.93);
      const a: Pt = [40, 85];
      const b: Pt = [160, 85];
      const side = (k: number) => (
        <>
          <Poly pts={DIAMOND_TOP} fill={BACK} />
          <Flap pts={DIAMOND_BOTTOM} a={a} b={b} k={k} front={FRONT} back={LIGHT} />
          <Crease a={a} b={b} k={k} />
        </>
      );
      return (
        <>
          <Flip k={turn} front={side(k1)} back={side(k2)} />
          <TurnOver o={active(t, 0.38, 0.6)} />
          <Hand at={foldPt([100, 145], a, b, k1)} o={active(t, 0.05, 0.3)} />
          <Hand at={foldPt([100, 145], a, b, k2)} o={active(t, 0.68, 0.93)} />
        </>
      );
    },
  },

  /* 7. open again, ends together, flat: a smaller diamond */
  "boat-7": {
    ms: 3200,
    draw: (t) => {
      const k = seg(t, 0.15, 0.85);
      const from: Pt[] = [[40, 85], [70, 55], [100, 25], [130, 55], [160, 85], [100, 85]];
      const to: Pt[] = [[100, 135], [50, 85], [100, 35], [150, 85], [100, 135], [100, 135]];
      return (
        <>
          <Poly pts={lerpPts(from, to, k)} fill={LIGHT} />
          <path d="M50 85 L150 85 M100 85 L100 135" stroke={INK} strokeWidth={1.2} opacity={k} />
          <Hand at={lerp([40, 85], [100, 135], k)} o={active(t, 0.15, 0.85)} emoji="👉" />
          <Hand at={lerp([160, 85], [100, 135], k)} o={active(t, 0.15, 0.85)} emoji="👈" />
        </>
      );
    },
  },

  /* 8. pull the sides apart: a boat, and it floats */
  "boat-8": {
    ms: 3600,
    draw: (t, secs) => {
      const k = seg(t, 0.1, 0.5);
      const water = seg(t, 0.5, 0.65);
      const diamond: Pt[] = [[50, 85], [75, 60], [100, 35], [125, 60], [150, 85], [125, 110], [100, 135], [75, 110]];
      const boat: Pt[] = [[15, 78], [80, 78], [100, 28], [120, 78], [185, 78], [148, 120], [100, 120], [52, 120]];
      const bob = water * Math.sin(secs * 2.4);
      return (
        <>
          <g transform={`translate(0 ${bob * 2.5}) rotate(${bob * 3} 100 100)`}>
            <Poly pts={lerpPts(diamond, boat, k)} fill={LIGHT} />
            <path d="M100 28 L100 78 M80 78 L120 78" stroke={INK} strokeWidth={1.2} opacity={k} />
          </g>
          <g opacity={water}>
            <path d="M0 118 Q12 112 25 118 T50 118 T75 118 T100 118 T125 118 T150 118 T175 118 T200 118 V160 H0 Z" fill="#9fc2d6" opacity={0.75} />
          </g>
          <Hand at={lerp([50, 85], [15, 78], k)} o={active(t, 0.1, 0.5)} emoji="✋" />
          <Hand at={lerp([150, 85], [185, 78], k)} o={active(t, 0.1, 0.5)} emoji="✋" />
        </>
      );
    },
  },
};

/** Plays one fold on a loop: a still moment, the fold, a hold, again. */
export function BoatFold({ id, className }: { id: string; className?: string }) {
  const card = BOAT_FOLDS[id];
  const [now, setNow] = useState({ t: 0, secs: 0 });

  useEffect(() => {
    if (!card) return;
    let raf = 0;
    const start = performance.now();
    const cycle = 600 + card.ms + 1800;
    const tick = (time: number) => {
      const e = time - start;
      setNow({ t: clamp01(((e % cycle) - 600) / card.ms), secs: e / 1000 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [card]);

  if (!card) return null;
  return (
    <svg viewBox="0 0 200 160" className={className} style={{ overflow: "visible" }} aria-hidden>
      {card.draw(now.t, now.secs)}
    </svg>
  );
}
