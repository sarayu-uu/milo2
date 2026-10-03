/**
 * Cut-paper geometry helpers. Shapes get small, deterministic irregularities
 * (like scissors cut them), so nothing is a perfect rectangle or ellipse —
 * controlled irregularity, not sloppiness.
 */
function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const f = (n: number) => n.toFixed(1);

/** A rectangle with slightly wobbly edges (optionally rounded corners). */
export function paperRect(x: number, y: number, w: number, h: number, opts: { j?: number; seed?: number; step?: number } = {}) {
  const { j = 2.5, seed = 1, step = 46 } = opts;
  const r = rng(seed);
  const jit = () => (r() - 0.5) * 2 * j;
  const pts: [number, number][] = [];
  const edge = (x0: number, y0: number, x1: number, y1: number) => {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.max(1, Math.round(len / step));
    const nx = -(y1 - y0) / len;
    const ny = (x1 - x0) / len;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const d = i === 0 ? jit() * 0.4 : jit();
      pts.push([x0 + (x1 - x0) * t + nx * d, y0 + (y1 - y0) * t + ny * d]);
    }
  };
  edge(x, y, x + w, y);
  edge(x + w, y, x + w, y + h);
  edge(x + w, y + h, x, y + h);
  edge(x, y + h, x, y);
  return "M" + pts.map(([a, b]) => `${f(a)} ${f(b)}`).join(" L") + " Z";
}

/** A blob around an ellipse with radial wobble (cut-paper circle/oval). */
export function paperBlob(cx: number, cy: number, rx: number, ry: number, opts: { j?: number; seed?: number; n?: number } = {}) {
  const { j = 0.06, seed = 1, n = 22 } = opts;
  const r = rng(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (r() - 0.5) * 2 * j;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  // smooth through midpoints
  let d = "";
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % n];
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    d += i === 0 ? `M${f(m[0])} ${f(m[1])}` : "";
    const nq = pts[(i + 1) % n];
    const nm = [(nq[0] + pts[(i + 2) % n][0]) / 2, (nq[1] + pts[(i + 2) % n][1]) / 2];
    d += ` Q${f(nq[0])} ${f(nq[1])} ${f(nm[0])} ${f(nm[1])}`;
  }
  return d + " Z";
}

/** A leaf: pointed oval along an angle. */
export function leaf(x: number, y: number, len: number, wid: number, angle: number) {
  const a = (angle * Math.PI) / 180;
  const ex = x + Math.cos(a) * len;
  const ey = y + Math.sin(a) * len;
  const px = -Math.sin(a) * wid;
  const py = Math.cos(a) * wid;
  const mx = (x + ex) / 2;
  const my = (y + ey) / 2;
  return `M${f(x)} ${f(y)} Q${f(mx + px)} ${f(my + py)} ${f(ex)} ${f(ey)} Q${f(mx - px)} ${f(my - py)} ${f(x)} ${f(y)} Z`;
}
