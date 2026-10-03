"use client";

import { useEffect, useRef } from "react";
import { animate, motionValue, type AnimationPlaybackControls, type MotionValue, type Transition } from "motion/react";

/**
 * A tiny SVG "rig" for layered characters.
 *
 * Each animated part is a <g ref={usePart(target)}> whose `transform`
 * ATTRIBUTE is written directly (translate → rotate → scale around the
 * group's local origin). Pivots are therefore exact — wings rotate at the
 * shoulder, feathers fold at their base — with no CSS transform-origin
 * guesswork and no React re-renders per frame.
 *
 * The same rig can later be driven by Rive / Lottie state machines by
 * swapping the pose source, not the artwork API.
 */
export type KF = number | number[];

export interface PartTarget {
  x?: KF;
  y?: KF;
  rotate?: KF;
  scale?: KF;
  scaleX?: KF;
  scaleY?: KF;
  opacity?: KF;
  t?: Transition;
}

const PROPS = ["x", "y", "rotate", "scale", "scaleX", "scaleY", "opacity"] as const;
type Prop = (typeof PROPS)[number];
const REST: Record<Prop, number> = { x: 0, y: 0, rotate: 0, scale: 1, scaleX: 1, scaleY: 1, opacity: 1 };

const SETTLE: Transition = { type: "spring", stiffness: 240, damping: 22, mass: 0.8 };

export function usePart(target: PartTarget | undefined, reduced: boolean) {
  const ref = useRef<SVGGElement>(null);
  const values = useRef<Record<Prop, MotionValue<number>> | null>(null);
  if (!values.current) {
    values.current = Object.fromEntries(PROPS.map((p) => [p, motionValue(REST[p])])) as Record<Prop, MotionValue<number>>;
  }
  const key = JSON.stringify(target ?? null) + (reduced ? "r" : "");

  useEffect(() => {
    const el = ref.current;
    const mv = values.current!;
    if (!el) return;

    const write = () => {
      const s = (p: Prop) => mv[p].get();
      const sc = s("scale");
      el.setAttribute(
        "transform",
        `translate(${s("x").toFixed(2)} ${s("y").toFixed(2)}) rotate(${s("rotate").toFixed(2)}) scale(${(sc * s("scaleX")).toFixed(3)} ${(sc * s("scaleY")).toFixed(3)})`,
      );
      const o = s("opacity");
      if (o !== 1 || el.hasAttribute("opacity")) el.setAttribute("opacity", o.toFixed(3));
    };

    const unsubs = PROPS.map((p) => mv[p].on("change", write));
    const controls: AnimationPlaybackControls[] = [];
    const tgt = target ?? {};

    for (const p of PROPS) {
      const kf = tgt[p] ?? REST[p];
      const looping = !!tgt.t && (tgt.t.repeat ?? 0) > 0;
      if (reduced) {
        // Reduced motion: no loops, jump to the meaningful pose.
        mv[p].jump(Array.isArray(kf) ? (looping ? kf[0] : kf[kf.length - 1]) : kf);
        continue;
      }
      if (!Array.isArray(kf) && kf === mv[p].get()) continue;
      const explicit = tgt[p] !== undefined;
      controls.push(animate(mv[p], kf as number | number[], explicit && tgt.t ? tgt.t : SETTLE));
    }
    write();

    return () => {
      controls.forEach((c) => c.stop());
      unsubs.forEach((u) => u());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return ref;
}
