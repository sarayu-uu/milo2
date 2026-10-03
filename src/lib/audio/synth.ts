/**
 * Procedural "self-made Foley".
 *
 * Every MVP sound is synthesised in the browser with an OfflineAudioContext,
 * encoded as a tiny WAV and handed to Howler. That means:
 *  - zero licensing ambiguity (we made them),
 *  - zero bytes of audio shipped until a sound is first needed,
 *  - real recorded files can replace any recipe later via the registry `src`.
 */
import type { SoundId } from "@/types/audio";

const SR = 22050;

type Recipe = { dur: number; build: (ctx: OfflineAudioContext, out: AudioNode) => void };

/* ------------------------------ helpers ------------------------------ */

function noiseBuffer(ctx: BaseAudioContext, dur: number, kind: "white" | "brown" | "pink" = "white") {
  const len = Math.max(1, Math.floor(dur * ctx.sampleRate));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  let b0 = 0,
    b1 = 0,
    b2 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (kind === "brown") {
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    } else if (kind === "pink") {
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.963 * b1 + w * 0.2965164;
      b2 = 0.57 * b2 + w * 1.0526913;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.18;
    } else d[i] = w;
  }
  return buf;
}

function noise(ctx: BaseAudioContext, dur: number, kind: "white" | "brown" | "pink" = "white") {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, dur, kind);
  return src;
}

function filter(ctx: BaseAudioContext, type: BiquadFilterType, freq: number, q = 1) {
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  return f;
}

function gain(ctx: BaseAudioContext, v = 0) {
  const g = ctx.createGain();
  g.gain.value = v;
  return g;
}

/** Attack / decay envelope on a gain param. */
function env(p: AudioParam, t: number, peak: number, attack: number, decay: number) {
  p.setValueAtTime(0.0001, t);
  p.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + attack);
  p.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function tone(
  ctx: BaseAudioContext,
  out: AudioNode,
  t: number,
  type: OscillatorType,
  f0: number,
  f1: number,
  peak: number,
  attack: number,
  decay: number,
) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + attack + decay);
  const g = gain(ctx);
  env(g.gain, t, peak, attack, decay);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + attack + decay + 0.02);
}

function burst(
  ctx: BaseAudioContext,
  out: AudioNode,
  t: number,
  ftype: BiquadFilterType,
  freq: number,
  q: number,
  peak: number,
  attack: number,
  decay: number,
  kind: "white" | "pink" | "brown" = "white",
) {
  const n = noise(ctx, attack + decay + 0.05, kind);
  const f = filter(ctx, ftype, freq, q);
  const g = gain(ctx);
  env(g.gain, t, peak, attack, decay);
  n.connect(f).connect(g).connect(out);
  n.start(t);
}

function chirp(ctx: BaseAudioContext, out: AudioNode, t: number, peak = 0.25, base = 2600) {
  const o = ctx.createOscillator();
  o.type = "sine";
  const g = gain(ctx);
  o.frequency.setValueAtTime(base, t);
  o.frequency.exponentialRampToValueAtTime(base * 1.55, t + 0.06);
  o.frequency.exponentialRampToValueAtTime(base * 1.1, t + 0.11);
  env(g.gain, t, peak, 0.01, 0.1);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 0.14);
}

function bed(ctx: BaseAudioContext, out: AudioNode, dur: number, kind: "brown" | "pink", freq: number, level: number) {
  const n = noise(ctx, dur, kind);
  const f = filter(ctx, "lowpass", freq, 0.5);
  const g = gain(ctx, level);
  n.connect(f).connect(g).connect(out);
  n.start(0);
}

/* ------------------------------ recipes ------------------------------ */

const recipes: Partial<Record<SoundId, Recipe>> = {
  "amb-city-window": {
    dur: 8,
    build: (c, o) => {
      bed(c, o, 8, "brown", 420, 0.09);
      chirp(c, o, 1.4, 0.035);
      chirp(c, o, 5.8, 0.025);
      // A distant, softened street horn beneath the room's quiet atmosphere.
      tone(c, o, 3.4, "sine", 300, 290, 0.015, 0.15, 0.35);
      tone(c, o, 3.4, "sine", 375, 365, 0.012, 0.15, 0.35);
    },
  },
  "paper-rustle": {
    dur: 0.45,
    build: (c, o) => {
      for (let i = 0; i < 5; i++) burst(c, o, i * 0.07 + Math.random() * 0.02, "bandpass", 2500 + Math.random() * 1500, 0.9, 0.35, 0.005, 0.06);
    },
  },
  "page-flip": {
    dur: 0.4,
    build: (c, o) => {
      const n = noise(c, 0.4);
      const f = filter(c, "bandpass", 700, 0.8);
      f.frequency.exponentialRampToValueAtTime(4200, 0.28);
      const g = gain(c);
      env(g.gain, 0, 0.5, 0.06, 0.28);
      n.connect(f).connect(g).connect(o);
      n.start(0);
    },
  },
  tap: { dur: 0.12, build: (c, o) => tone(c, o, 0, "sine", 700, 420, 0.35, 0.004, 0.08) },
  pop: { dur: 0.16, build: (c, o) => tone(c, o, 0, "sine", 620, 180, 0.5, 0.004, 0.12) },
  tape: {
    dur: 0.35,
    build: (c, o) => {
      for (let i = 0; i < 9; i++) burst(c, o, i * 0.032, "highpass", 2600, 0.7, 0.25, 0.002, 0.025);
    },
  },
  pencil: {
    dur: 0.5,
    build: (c, o) => {
      for (let i = 0; i < 12; i++) burst(c, o, i * 0.038, "bandpass", 4200 + Math.random() * 800, 2, 0.22, 0.004, 0.03);
    },
  },
  fold: {
    dur: 0.45,
    build: (c, o) => {
      const n = noise(c, 0.45);
      const f = filter(c, "lowpass", 600, 0.7);
      f.frequency.exponentialRampToValueAtTime(2500, 0.3);
      const g = gain(c);
      env(g.gain, 0, 0.35, 0.12, 0.2);
      n.connect(f).connect(g).connect(o);
      n.start(0);
      burst(c, o, 0.33, "bandpass", 1800, 1.5, 0.4, 0.002, 0.05);
    },
  },
  whoosh: {
    dur: 0.5,
    build: (c, o) => {
      const n = noise(c, 0.5, "pink");
      const f = filter(c, "bandpass", 350, 1.2);
      f.frequency.exponentialRampToValueAtTime(1800, 0.4);
      const g = gain(c);
      env(g.gain, 0, 0.6, 0.18, 0.28);
      n.connect(f).connect(g).connect(o);
      n.start(0);
    },
  },
  "wood-click": {
    dur: 0.15,
    build: (c, o) => {
      tone(c, o, 0, "triangle", 1250, 1100, 0.45, 0.002, 0.06);
      tone(c, o, 0, "sine", 1900, 1800, 0.18, 0.002, 0.04);
      burst(c, o, 0, "bandpass", 3000, 2, 0.2, 0.001, 0.015);
    },
  },
  bell: {
    dur: 1.5,
    build: (c, o) => {
      tone(c, o, 0, "sine", 880, 878, 0.3, 0.005, 1.3);
      tone(c, o, 0, "sine", 2218, 2214, 0.08, 0.005, 0.8);
      tone(c, o, 0, "sine", 1320, 1318, 0.06, 0.005, 1.0);
    },
  },
  clap: {
    dur: 0.2,
    build: (c, o) => {
      burst(c, o, 0, "bandpass", 1400, 0.9, 0.7, 0.002, 0.03);
      burst(c, o, 0.012, "bandpass", 1100, 0.8, 0.6, 0.002, 0.09);
    },
  },
  slap: {
    dur: 0.22,
    build: (c, o) => {
      burst(c, o, 0, "lowpass", 2200, 0.7, 0.8, 0.002, 0.08);
      tone(c, o, 0, "sine", 210, 90, 0.5, 0.003, 0.12);
      burst(c, o, 0.01, "bandpass", 1200, 0.8, 0.4, 0.002, 0.1);
    },
  },
  "wrong-gentle": {
    dur: 0.45,
    build: (c, o) => {
      tone(c, o, 0, "sine", 420, 400, 0.2, 0.01, 0.14);
      tone(c, o, 0.17, "sine", 330, 300, 0.2, 0.01, 0.2);
    },
  },
  coo: {
    dur: 0.75,
    build: (c, o) => {
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(260, 0);
      osc.frequency.linearRampToValueAtTime(330, 0.18);
      osc.frequency.linearRampToValueAtTime(240, 0.6);
      const vib = c.createOscillator();
      vib.frequency.value = 22;
      const vg = gain(c, 14);
      vib.connect(vg).connect(osc.frequency);
      const lp = filter(c, "lowpass", 900, 3);
      const g = gain(c);
      g.gain.setValueAtTime(0.0001, 0);
      g.gain.exponentialRampToValueAtTime(0.45, 0.06);
      g.gain.setValueAtTime(0.4, 0.2);
      g.gain.exponentialRampToValueAtTime(0.12, 0.3);
      g.gain.exponentialRampToValueAtTime(0.38, 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, 0.72);
      osc.connect(lp).connect(g).connect(o);
      osc.start(0);
      vib.start(0);
      osc.stop(0.75);
      vib.stop(0.75);
    },
  },
  footstep: { dur: 0.12, build: (c, o) => burst(c, o, 0, "lowpass", 500, 0.7, 0.5, 0.003, 0.07, "brown") },
  boing: {
    dur: 0.5,
    build: (c, o) => {
      const osc = c.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, 0);
      osc.frequency.exponentialRampToValueAtTime(520, 0.12);
      const lfo = c.createOscillator();
      lfo.frequency.value = 14;
      const lg = gain(c, 40);
      lfo.connect(lg).connect(osc.frequency);
      const g = gain(c);
      env(g.gain, 0, 0.35, 0.01, 0.42);
      osc.connect(g).connect(o);
      osc.start(0);
      lfo.start(0);
      osc.stop(0.5);
      lfo.stop(0.5);
    },
  },
  squeak: { dur: 0.2, build: (c, o) => tone(c, o, 0, "sine", 1300, 2100, 0.25, 0.01, 0.15) },
  yawn: {
    dur: 1.1,
    build: (c, o) => {
      const osc = c.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(330, 0);
      osc.frequency.linearRampToValueAtTime(400, 0.3);
      osc.frequency.linearRampToValueAtTime(210, 1.0);
      const f = filter(c, "lowpass", 500, 4);
      f.frequency.linearRampToValueAtTime(1300, 0.4);
      f.frequency.linearRampToValueAtTime(400, 1.0);
      const g = gain(c);
      env(g.gain, 0, 0.18, 0.2, 0.85);
      osc.connect(f).connect(g).connect(o);
      osc.start(0);
      osc.stop(1.1);
    },
  },
  woof: {
    dur: 0.3,
    build: (c, o) => {
      const osc = c.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(240, 0);
      osc.frequency.exponentialRampToValueAtTime(140, 0.18);
      const f = filter(c, "lowpass", 900, 2);
      const g = gain(c);
      env(g.gain, 0, 0.3, 0.01, 0.2);
      osc.connect(f).connect(g).connect(o);
      osc.start(0);
      osc.stop(0.3);
      burst(c, o, 0, "bandpass", 700, 1, 0.3, 0.005, 0.12);
    },
  },
  "comedic-pause": {
    // A lone cricket in the awkward silence.
    dur: 1.2,
    build: (c, o) => {
      for (const start of [0.1, 0.65]) {
        for (let i = 0; i < 4; i++) tone(c, o, start + i * 0.045, "sine", 4600, 4500, 0.12, 0.004, 0.03);
      }
    },
  },
  water: {
    dur: 1.6,
    build: (c, o) => {
      const n = noise(c, 1.6, "pink");
      const f = filter(c, "bandpass", 900, 0.6);
      const g = gain(c);
      g.gain.setValueAtTime(0.0001, 0);
      g.gain.exponentialRampToValueAtTime(0.35, 0.2);
      g.gain.setValueAtTime(0.35, 1.2);
      g.gain.exponentialRampToValueAtTime(0.0001, 1.58);
      n.connect(f).connect(g).connect(o);
      n.start(0);
      for (let i = 0; i < 9; i++) {
        const t = 0.1 + Math.random() * 1.3;
        const b = 500 + Math.random() * 700;
        tone(c, o, t, "sine", b, b * 1.8, 0.08, 0.004, 0.05);
      }
    },
  },
  "cup-clink": {
    dur: 0.6,
    build: (c, o) => {
      tone(c, o, 0, "sine", 2480, 2470, 0.18, 0.002, 0.45);
      tone(c, o, 0, "sine", 3720, 3700, 0.08, 0.002, 0.3);
      tone(c, o, 0, "sine", 5300, 5290, 0.04, 0.002, 0.2);
    },
  },
  "bird-chirp": {
    dur: 0.6,
    build: (c, o) => {
      chirp(c, o, 0, 0.2);
      chirp(c, o, 0.16, 0.18, 2900);
      chirp(c, o, 0.34, 0.16, 2700);
    },
  },
  leaves: {
    dur: 1.2,
    build: (c, o) => {
      const n = noise(c, 1.2);
      const f = filter(c, "bandpass", 2600, 0.6);
      const g = gain(c);
      g.gain.setValueAtTime(0.0001, 0);
      for (let i = 1; i <= 8; i++) g.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.2, i * 0.13);
      g.gain.linearRampToValueAtTime(0.0001, 1.18);
      n.connect(f).connect(g).connect(o);
      n.start(0);
    },
  },
  // Milo blinking: a tiny, soft, rounded "blip"
  blink: { dur: 0.1, build: (c, o) => tone(c, o, 0, "sine", 1500, 1150, 0.12, 0.004, 0.05) },
  switch: { dur: 0.1, build: (c, o) => burst(c, o, 0, "bandpass", 2500, 3, 0.5, 0.001, 0.02) },

  /* ---------------- ambient loops (low, sparse, seamless-ish) ---------------- */
  "amb-living-room": {
    dur: 8,
    build: (c, o) => {
      bed(c, o, 8, "brown", 260, 0.08);
      // (no clock tick — it was too noticeable on repeat)
      chirp(c, o, 3.2, 0.04, 3000);
      chirp(c, o, 3.36, 0.035, 3300);
    },
  },
  "amb-kitchen": {
    dur: 8,
    build: (c, o) => {
      bed(c, o, 8, "brown", 300, 0.08);
      for (const t of [1.1, 4.7]) {
        tone(c, o, t, "sine", 2480, 2470, 0.05, 0.002, 0.35);
        tone(c, o, t, "sine", 3720, 3700, 0.02, 0.002, 0.25);
      }
      for (const t of [2.6, 3.4, 6.1]) tone(c, o, t, "sine", 900, 1500, 0.05, 0.003, 0.06);
    },
  },
  "amb-garden": {
    dur: 10,
    build: (c, o) => {
      const n = noise(c, 10, "pink");
      const f = filter(c, "bandpass", 1600, 0.4);
      const g = gain(c, 0.04);
      for (let i = 0; i <= 10; i++) g.gain.linearRampToValueAtTime(0.025 + Math.random() * 0.05, i);
      n.connect(f).connect(g).connect(o);
      n.start(0);
      for (const [t, b] of [
        [0.8, 2600],
        [1.0, 3000],
        [3.9, 2400],
        [4.05, 2800],
        [4.2, 2500],
        [7.3, 3200],
        [7.5, 2900],
      ] as const)
        chirp(c, o, t, 0.06, b);
    },
  },
  "amb-washroom": {
    dur: 8,
    build: (c, o) => {
      bed(c, o, 8, "brown", 220, 0.05);
      for (const t of [0.7, 2.6, 4.1, 6.3]) {
        tone(c, o, t, "sine", 1100, 1900, 0.09, 0.002, 0.07);
        tone(c, o, t + 0.12, "sine", 1100, 1900, 0.025, 0.002, 0.07);
      }
    },
  },
  "amb-rain": {
    dur: 8,
    build: (c, o) => {
      bed(c, o, 8, "pink", 2400, 0.12);
      for (let i = 0; i < 40; i++) burst(c, o, Math.random() * 7.8, "highpass", 3000, 0.7, 0.04, 0.001, 0.015);
    },
  },
};

/* ------------------------------ render + encode ------------------------------ */

const cache = new Map<SoundId, Promise<string>>();

export function hasRecipe(id: SoundId) {
  return id in recipes;
}

export function renderSound(id: SoundId): Promise<string> {
  const hit = cache.get(id);
  if (hit) return hit;
  const recipe = recipes[id];
  if (!recipe) return Promise.reject(new Error(`No recipe for ${id}`));
  const p = (async () => {
    const ctx = new OfflineAudioContext(1, Math.ceil(recipe.dur * SR), SR);
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    recipe.build(ctx, master);
    const buf = await ctx.startRendering();
    return URL.createObjectURL(encodeWav(buf));
  })();
  cache.set(id, p);
  return p;
}

function encodeWav(buf: AudioBuffer): Blob {
  const data = buf.getChannelData(0);
  const len = data.length;
  const out = new DataView(new ArrayBuffer(44 + len * 2));
  const w = (o: number, s: string) => [...s].forEach((ch, i) => out.setUint8(o + i, ch.charCodeAt(0)));
  w(0, "RIFF");
  out.setUint32(4, 36 + len * 2, true);
  w(8, "WAVE");
  w(12, "fmt ");
  out.setUint32(16, 16, true);
  out.setUint16(20, 1, true);
  out.setUint16(22, 1, true);
  out.setUint32(24, buf.sampleRate, true);
  out.setUint32(28, buf.sampleRate * 2, true);
  out.setUint16(32, 2, true);
  out.setUint16(34, 16, true);
  w(36, "data");
  out.setUint32(40, len * 2, true);
  for (let i = 0; i < len; i++) {
    const s = Math.max(-1, Math.min(1, data[i]));
    out.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([out], { type: "audio/wav" });
}
