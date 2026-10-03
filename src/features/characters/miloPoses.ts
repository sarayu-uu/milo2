import type { PartTarget } from "@/lib/animation/rig";
import type { CharacterAction, Expression } from "@/types/character";

/**
 * Milo's state machine expressed as data.
 *   pose = expression layer  +  action layer (action wins on conflicts)
 *
 * Part names map 1:1 to rig groups in <Milo />.
 */
export type MiloPart =
  | "root"
  | "body"
  | "belly"
  | "head"
  | "wingL"
  | "wingR"
  | "fL0"
  | "fL1"
  | "fL2"
  | "fL3"
  | "fL4"
  | "fR0"
  | "fR1"
  | "fR2"
  | "fR3"
  | "fR4"
  | "footL"
  | "footR"
  | "beak"
  | "pupilL"
  | "pupilR"
  | "lidL"
  | "lidR"
  | "smileL"
  | "smileR"
  | "browL"
  | "browR"
  | "blush";

export type MiloPose = Partial<Record<MiloPart, PartTarget>>;

/** Feather base angles (deg). Index 4 is the outermost "thumb" feather. */
/** Feather tip angles (deg). Four clearly separated tips; the last is the outer "thumb". */
export const FEATHER_ANGLES = [-20, -7, 7, 20];

const loop = (duration: number, extra: object = {}) => ({ duration, repeat: Infinity, ease: "easeInOut", ...extra }) as const;
const once = (duration: number, extra: object = {}) => ({ duration, ease: "easeInOut", ...extra }) as const;

/* -------------------------------- expressions -------------------------------- */

const lid = (v: number): PartTarget => ({ scaleY: v, t: { duration: 0.18 } });
const SMILE_HIDDEN = 30;

export function expressionPose(e: Expression): MiloPose {
  const base: MiloPose = {
    // eyes wide open and friendly
    lidL: lid(0.02),
    lidR: lid(0.02),
    smileL: { y: SMILE_HIDDEN },
    smileR: { y: SMILE_HIDDEN },
    pupilL: { y: -3 },
    pupilR: { y: -3 },
    blush: { opacity: 0 },
  };
  switch (e) {
    case "neutral":
      return { ...base, head: { rotate: 8 } };
    case "curious":
      // looking at the thing; one brow up
      return { ...base, lidL: lid(0.1), lidR: lid(0.1), browL: { rotate: 2 }, browR: { rotate: -6, y: -4 }, pupilL: { x: 5, y: -1 }, pupilR: { x: 5, y: -1 }, head: { rotate: -5 } };
    case "confused":
      // head turned ~20°, one eyebrow raised
      return { ...base, lidL: lid(0.22), lidR: lid(0.1), browL: { rotate: 4, y: 2 }, browR: { rotate: -10, y: -8 }, pupilL: { x: 4, y: -2 }, pupilR: { x: -4, y: 0 }, head: { rotate: 20 } };
    case "happy":
      return { ...base, smileL: { y: 2 }, smileR: { y: 2 }, browL: { y: -4 }, browR: { y: -4 } };
    case "surprised":
      return { ...base, lidL: lid(0), lidR: lid(0), browL: { y: -9 }, browR: { y: -9 }, pupilL: { scale: 0.7 }, pupilR: { scale: 0.7 }, beak: { y: 3 } };
    case "sleepy":
      return { ...base, lidL: lid(0.62), lidR: lid(0.55), browL: { y: 3 }, browR: { y: 3 }, pupilL: { y: 2 }, pupilR: { y: 2 } };
    case "thinking":
      return { ...base, lidL: lid(0.25), browL: { rotate: 6, y: 2 }, browR: { rotate: -6, y: -6 }, pupilL: { x: -3, y: -5 }, pupilR: { x: -3, y: -5 }, head: { rotate: -8 } };
    case "suspicious":
      return { ...base, lidL: lid(0.5), lidR: lid(0.45), browL: { rotate: 10, y: 4 }, browR: { rotate: -8, y: 3 }, pupilL: { x: 6 }, pupilR: { x: 6 } };
    case "proud":
      // chest/belly puffed absurdly forward, eyes closed, chin up
      return { ...base, lidL: lid(1), lidR: lid(1), browL: { y: -3 }, browR: { y: -3 }, head: { rotate: -8, y: -3 }, belly: { scale: 1.2 } };
    default:
      return base;
  }
}

/* ---------------------------------- actions ---------------------------------- */

function feathers(side: "L" | "R", fn: (i: number, base: number) => PartTarget | undefined): MiloPose {
  const out: MiloPose = {};
  FEATHER_ANGLES.forEach((a, i) => {
    const t = fn(i, a);
    if (t) out[`f${side}${i}` as MiloPart] = t;
  });
  return out;
}

const WALK = 0.5;
const footStep = (phase: 0 | 1, d = WALK): PartTarget => ({
  y: phase ? [0, 0, -9, 0] : [0, -9, 0, 0],
  rotate: phase ? [0, 0, -12, 0] : [0, -12, 0, 0],
  t: loop(d, { times: [0, 0.25, 0.5, 1], ease: "easeOut" }),
});

export function actionPose(a: CharacterAction): MiloPose {
  switch (a) {
    case "idle":
      return {
        root: { y: [0, -1.5, 0], t: loop(3.2) },
        belly: { scale: [1, 1.03, 1], t: loop(3.2) },
        wingL: { rotate: 16 },
        wingR: { rotate: 16 },
      };
    case "headTilt":
      return { head: { rotate: [0, 16, 14], t: once(0.6, { times: [0, 0.6, 1] }) }, wingL: { rotate: 6 }, wingR: { rotate: 6 } };
    case "lookLeft":
      return { head: { rotate: -6, x: -4 }, pupilL: { x: -5 }, pupilR: { x: -5 } };
    case "lookRight":
      return { head: { rotate: 6, x: 4 }, pupilL: { x: 5 }, pupilR: { x: 5 } };
    case "talk":
      return { beak: { y: [0, 4, 1, 4.5, 0], t: loop(0.55) }, head: { rotate: [0, 2, 0, -2, 0], t: loop(1.4) } };
    case "walk":
    case "run": {
      const d = a === "run" ? 0.3 : WALK;
      return {
        root: { y: [0, -4, 0], rotate: a === "run" ? 10 : 2, t: loop(d / 2) },
        head: { x: [0, 7, 7, 0], t: loop(d, { times: [0, 0.3, 0.6, 1] }) },
        footL: footStep(0, d),
        footR: footStep(1, d),
        wingL: { rotate: [8, 14, 8], t: loop(d) },
        wingR: { rotate: [8, 14, 8], t: loop(d) },
      };
    }
    case "waddle":
      return {
        root: { x: [0, -9, 9, -9, 9, 0], rotate: [0, -7, 7, -7, 7, 0], t: once(1.2) },
        footL: { y: [0, -8, 0, -8, 0, 0], t: once(1.2) },
        footR: { y: [0, 0, -8, 0, -8, 0], t: once(1.2) },
        wingL: { rotate: [6, 24, 6, 24, 6], t: once(1.2) },
        wingR: { rotate: [6, 6, 24, 6, 24], t: once(1.2) },
      };
    case "hop":
      return {
        root: { y: [0, -28, 0, -20, 0], scaleY: [1, 1.05, 0.92, 1.04, 1], t: once(0.9) },
        wingL: { rotate: [6, 40, 6, 30, 6], t: once(0.9) },
        wingR: { rotate: [6, 40, 6, 30, 6], t: once(0.9) },
      };
    case "stumble":
      return {
        root: { rotate: [0, 16, -7, 3, 0], x: [0, 12, -4, 0, 0], t: once(0.9) },
        wingL: { rotate: [6, 70, -10, 40, 6], t: once(0.9) },
        wingR: { rotate: [6, 20, 60, 10, 6], t: once(0.9) },
        footR: { y: [0, -10, 0, 0, 0], t: once(0.9) },
      };
    case "clap":
      // Wings meet at ~25% and ~75% (the sound is synced to these points).
      return {
        wingL: { rotate: [6, -52, 6, -52, 6], t: once(1.0, { times: [0, 0.25, 0.5, 0.75, 1] }) },
        wingR: { rotate: [6, -52, 6, -52, 6], t: once(1.0, { times: [0, 0.25, 0.5, 0.75, 1] }) },
        head: { rotate: [0, -4, 0, -4, 0], t: once(1.0) },
      };
    case "thumbsUp":
      // Four feathers fold into the "fist"; the outer feather stays up: 👍
      return {
        wingL: { rotate: 84, scaleX: 1.15, scaleY: 0.72, t: { type: "spring", stiffness: 260, damping: 16 } },
        ...feathers("L", (i) =>
          i === FEATHER_ANGLES.length - 1
            ? { rotate: 70, scaleX: 2.3, scaleY: 2.3, t: { type: "spring", stiffness: 300, damping: 14, delay: 0.15 } }
            : { scale: 0.3, rotate: 10, t: { duration: 0.22, delay: 0.1 } },
        ),
        head: { rotate: -6 },
      };
    case "highFive":
      return {
        root: { rotate: -4, scale: 1.03 },
        wingL: { rotate: 150, scale: 1.55, t: { type: "spring", stiffness: 200, damping: 15 } },
        ...feathers("L", (_, base) => ({ rotate: base * 0.6, scale: 1.08 })),
        head: { rotate: -10, x: -3 },
        pupilL: { x: -3, y: -2 },
        pupilR: { x: -3, y: -2 },
      };
    case "wingsUp":
      return {
        wingL: { rotate: [6, 160, 148, 160], t: once(0.9, { times: [0, 0.4, 0.7, 1] }) },
        wingR: { rotate: [6, 160, 148, 160], t: once(0.9, { times: [0, 0.4, 0.7, 1] }) },
        ...feathers("L", (_, b) => ({ rotate: b * 0.5 })),
        ...feathers("R", (_, b) => ({ rotate: b * 0.5 })),
        root: { y: [0, -10, 0], t: once(0.6) },
      };
    case "bellyPuff":
      // Inflate → lean back → nearly topple → recover.
      return {
        belly: { scale: [1, 1.32, 1.34, 1.3, 1], t: once(1.5, { times: [0, 0.3, 0.6, 0.8, 1] }) },
        body: { scale: [1, 1.09, 1.1, 1.08, 1], t: once(1.5, { times: [0, 0.3, 0.6, 0.8, 1] }) },
        root: { rotate: [0, -8, -15, -5, -10, 0], x: [0, 3, 6, 0, 2, 0], t: once(1.5) },
        wingL: { rotate: [6, 30, 55, 20, 6], t: once(1.5) },
        wingR: { rotate: [6, 30, 10, 35, 6], t: once(1.5) },
        head: { rotate: [0, -10, -14, -4, 0], t: once(1.5) },
      };
    case "investigate":
      // neck stretched forward, one wing tucked behind
      return {
        root: { rotate: 5 },
        head: { x: 12, y: -10, rotate: -6 },
        wingR: { rotate: -34 },
        wingL: { rotate: 12 },
      };
    case "reach":
      // body stretches up; the belly stays comically grounded
      return {
        body: { scaleY: [1, 1.16, 1.13], scaleX: [1, 0.95, 0.96], t: once(0.7) },
        belly: { scaleY: [1, 0.86, 0.88], t: once(0.7) },
        head: { y: [0, -8, -6], rotate: -6, t: once(0.7) },
        wingR: { rotate: 176, scale: 1.1, t: { type: "spring", stiffness: 160, damping: 14 } },
        ...feathers("R", (_, b) => ({ rotate: b * 0.8 })),
        wingL: { rotate: 24 },
        footL: { y: -3 },
        footR: { y: -3 },
      };
    case "excited":
      // both wings up, body squashed a little shorter
      return {
        root: { scaleY: 0.9, y: 2 },
        wingL: { rotate: 150 },
        wingR: { rotate: 150 },
        ...feathers("L", (_, b) => ({ rotate: b * 0.7 })),
        ...feathers("R", (_, b) => ({ rotate: b * 0.7 })),
      };
    case "hold":
      // far wing raised out to the side, holding something up to show you
      return {
        root: { y: [0, -1.2, 0], t: loop(3.2) },
        wingR: { rotate: 112, t: { type: "spring", stiffness: 180, damping: 16 } },
        ...feathers("R", () => ({ scale: 0.55, rotate: 8 })),
        wingL: { rotate: 16 },
        head: { rotate: -7, x: -2 },
        pupilL: { x: -4 },
        pupilR: { x: -4 },
      };
    case "peek":
      // bends forward to look under something — the tummy gets in the way
      return {
        body: { rotate: [0, 34, 30, 33, 30], t: once(3, { times: [0, 0.25, 0.5, 0.8, 1] }) },
        head: { rotate: [0, 16, 22, 16], t: once(3) },
        wingL: { rotate: [6, -30, -20, -30], t: once(3) },
        wingR: { rotate: [6, -20, -30, -20], t: once(3) },
        footR: { rotate: [0, -6, 0], t: once(0.6) },
      };
    case "sleep":
      return { root: { y: [0, 1.5, 0], t: loop(4) }, lidL: lid(1), lidR: lid(1), head: { rotate: 8, y: 3 } };
    case "blink":
      return {};
    default:
      return {};
  }
}

export function miloPose(expression: Expression, action: CharacterAction, talking: boolean): MiloPose {
  const pose = { ...expressionPose(expression), ...actionPose(action) };
  if (expression === "proud" && action === "idle") {
    // tiny wings on hips, leaning back, belly out
    pose.wingL = { rotate: -30 };
    pose.wingR = { rotate: -30 };
    pose.root = { rotate: -7 };
    pose.belly = { scale: 1.2 };
  }
  if (expression === "confused" && action === "idle") {
    // wings slightly separated from the body
    pose.wingL = { rotate: 38 };
    pose.wingR = { rotate: 22 };
  }
  if (talking && action !== "talk") {
    pose.beak = { y: [0, 4, 1, 4.5, 0], t: loop(0.55) };
  }
  return pose;
}
