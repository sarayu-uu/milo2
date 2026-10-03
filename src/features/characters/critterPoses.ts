import type { PartTarget } from "@/lib/animation/rig";
import type { CharacterAction, Expression } from "@/types/character";

/**
 * Shared pose grammar for supporting characters. Same idea as Milo's:
 * expression layer + action layer → targets per named part.
 * Characters read the generic parts (root/head/lid/brow/mouth) and their
 * own extras (tail, ears, antennae…).
 */
export type CritterPart = "root" | "head" | "lid" | "brow" | "mouth" | "tail" | "earL" | "earR" | "extraA" | "extraB" | "legs";
export type CritterPose = Partial<Record<CritterPart, PartTarget>>;

const loop = (duration: number, extra: object = {}) => ({ duration, repeat: Infinity, ease: "easeInOut", ...extra }) as const;
const once = (duration: number) => ({ duration, ease: "easeInOut" }) as const;

export function critterExpression(e: Expression): CritterPose {
  switch (e) {
    case "happy":
    case "proud":
      return { lid: { scaleY: 0.2 }, brow: { y: -3 }, mouth: { scaleY: 1.3 } };
    case "surprised":
      return { lid: { scaleY: 0 }, brow: { y: -6 }, mouth: { scaleY: 1.8, scaleX: 0.7 } };
    case "sleepy":
      return { lid: { scaleY: 0.7 }, brow: { y: 2 } };
    case "suspicious":
      return { lid: { scaleY: 0.5 }, brow: { rotate: 8, y: 2 } };
    case "confused":
    case "thinking":
      return { lid: { scaleY: 0.1 }, brow: { rotate: -10, y: -3 }, head: { rotate: 7 } };
    case "curious":
      return { lid: { scaleY: 0 }, brow: { y: -4 }, head: { rotate: -6 } };
    default:
      return { lid: { scaleY: 0.08 } };
  }
}

export function critterAction(a: CharacterAction): CritterPose {
  switch (a) {
    case "idle":
      return { root: { y: [0, -1.2, 0], t: loop(3) }, tail: { rotate: [0, 6, 0], t: loop(2.6) } };
    case "talk":
      return { mouth: { scaleY: [1, 2, 1, 1.8, 1], t: loop(0.55) }, head: { rotate: [0, 3, 0, -2, 0], t: loop(1.3) } };
    case "walk":
      return { root: { y: [0, -4, 0], t: loop(0.4) }, legs: { rotate: [-8, 8, -8], t: loop(0.4) }, tail: { rotate: [0, 10, 0], t: loop(0.4) } };
    case "run":
      return { root: { y: [0, -8, 0], rotate: [0, -4, 0], t: loop(0.26) }, legs: { rotate: [-18, 18, -18], t: loop(0.26) }, tail: { rotate: [-10, 20, -10], t: loop(0.26) }, earL: { rotate: [0, -20, 0], t: loop(0.26) } };
    case "hop":
      return { root: { y: [0, -26, 0, -18, 0], t: once(0.9) } };
    case "waddle":
      return { root: { rotate: [0, -6, 6, -6, 0], t: once(1) }, tail: { rotate: [0, 25, -10, 25, 0], t: once(1) } };
    case "wingsUp":
    case "clap":
    case "thumbsUp":
    case "bellyPuff":
      return { root: { y: [0, -12, 0], scaleY: [1, 1.06, 1], t: once(0.7) }, tail: { rotate: [0, 30, 0], t: once(0.7) } };
    case "headTilt":
      return { head: { rotate: 14 } };
    case "lookLeft":
      return { head: { rotate: -8, x: -3 } };
    case "lookRight":
      return { head: { rotate: 8, x: 3 } };
    case "stumble":
      return { root: { rotate: [0, 14, -6, 0], t: once(0.8) } };
    case "sleep":
      return { lid: { scaleY: 1 }, root: { scaleY: [1, 1.025, 1], t: loop(3.6) }, head: { rotate: 6, y: 3 } };
    default:
      return {};
  }
}

export function critterPose(e: Expression, a: CharacterAction, talking: boolean): CritterPose {
  const p = { ...critterExpression(e), ...critterAction(a) };
  if (talking && a !== "talk") p.mouth = { scaleY: [1, 2, 1, 1.8, 1], t: loop(0.55) };
  return p;
}
