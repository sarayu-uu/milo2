"use client";

import { useEffect, useId, useMemo, useState, type ReactNode, type RefObject } from "react";
import type { CharacterProps } from "@/types/character";
import { usePart } from "@/lib/animation/rig";
import { critterPose, type CritterPart } from "@/features/characters/critterPoses";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CrayonPalette } from "@/lib/animation/texture";

/**
 * Shared kit for Milo's friends. Style: simple geometric shapes (capsules,
 * circles), big friendly eyes with dark pupils, stubby limbs, flat colour
 * with subtle paper grain, no outlines.
 */
export const INK = "#4a3f36";
export const SIL = "#3d3f4a";

/** Shared rig + blink for supporting characters. */
export function useCritterRig({ expression = "neutral", action = "idle", talking = false, silhouette = false }: CharacterProps) {
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (silhouette || action === "sleep" || expression === "sleepy") return;
    let t: ReturnType<typeof setTimeout>;
    const next = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        next();
      }, 2600 + Math.random() * 3600);
    };
    next();
    return () => clearTimeout(t);
  }, [silhouette, action, expression]);

  const pose = useMemo(() => {
    const p = critterPose(expression, action, talking);
    if (blink) p.lid = { scaleY: 1, t: { duration: 0.06 } };
    return p;
  }, [expression, action, talking, blink]);

  const part = (k: CritterPart) => pose[k];
  const crayon = new CrayonPalette(uid, "soft");
  return {
    uid,
    outlined: !silhouette,
    crayon: silhouette ? null : crayon,
    f: (c: string) => (silhouette ? SIL : crayon.paint(c)),
    flat: (c: string) => (silhouette ? SIL : c),
    detail: !silhouette,
    root: usePart(part("root"), reduced),
    head: usePart(part("head"), reduced),
    lid: usePart(part("lid") ?? { scaleY: 0.06 }, reduced),
    lid2: usePart(part("lid") ?? { scaleY: 0.06 }, reduced),
    brow: usePart(part("brow"), reduced),
    mouth: usePart(part("mouth"), reduced),
    tail: usePart(part("tail"), reduced),
    earL: usePart(part("earL"), reduced),
    earR: usePart(part("earR"), reduced),
    extraA: usePart(part("extraA") ?? part("earL"), reduced),
    extraB: usePart(part("extraB") ?? part("earR"), reduced),
    legs: usePart(part("legs"), reduced),
  };
}

export function Pivot({ x, y, rig, children }: { x: number; y: number; rig: RefObject<SVGGElement | null>; children: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g ref={rig}>
        <g transform={`translate(${-x} ${-y})`}>{children}</g>
      </g>
    </g>
  );
}

/**
 * The shared eye: a white circle with a big dark pupil looking to the side.
 * The lid closes from the top for blinks and sleep.
 */
export function CritterEye({
  cx,
  cy,
  r,
  lid,
  lidColor,
  id,
  look = 0.22,
}: {
  cx: number;
  cy: number;
  r: number;
  lid: RefObject<SVGGElement | null>;
  lidColor: string;
  id: string;
  /** Pupil offset as a fraction of r (+ = right). */
  look?: number;
}) {
  return (
    <g stroke="none">
      <defs>
        <clipPath id={id}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="#fbf7ee" />
      <g clipPath={`url(#${id})`}>
        <circle cx={cx + r * look} cy={cy + r * 0.04} r={r * 0.6} fill="#2f2c2a" />
        <g transform={`translate(${cx - r - 1} ${cy - r - 1})`}>
          <g ref={lid}>
            <rect width={r * 2 + 2} height={r * 2 + 2} fill={lidColor} />
          </g>
        </g>
      </g>
    </g>
  );
}

/** Closed sleeping eye: a soft downward arc. */
export function SleepyEye({ cx, cy, r, color = "#4a3f36" }: { cx: number; cy: number; r: number; color?: string }) {
  return <path d={`M${cx - r} ${cy} Q${cx} ${cy + r * 0.8} ${cx + r} ${cy}`} stroke={color} strokeWidth={r * 0.32} fill="none" strokeLinecap="round" />;
}

export function CharacterSvg({
  children,
  crayon,
  flip,
  className,
  title,
  viewBox = "0 0 200 200",
  width = 200,
}: {
  children: ReactNode;
  /** Kept for API compatibility; characters have no outlines. */
  outlined?: boolean;
  crayon?: CrayonPalette | null;
  flip?: boolean;
  className?: string;
  title?: string;
  viewBox?: string;
  width?: number;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ overflow: "visible" }}
    >
      <g transform={flip ? `translate(${width} 0) scale(-1 1)` : undefined}>{children}</g>
      {crayon?.defs()}
    </svg>
  );
}
