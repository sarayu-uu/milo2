"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/** How long a child can be stuck (no touches) before a hint appears. */
const IDLE_MS = 7000;
/** How long the hint plays before fading (then the wait starts again). */
const SHOW_MS = 4200;

type Kind = "tap" | "drag-left" | "drag-right" | "draw";
type Spot = { x: number; y: number; kind: Kind };

/**
 * A gentle "here's what to do" hand for stuck children, in any activity step.
 *
 * Steps mark what to do next with data attributes; this picks the best one:
 *   data-hint="tap" | "drag-left" | "drag-right" | "draw"
 *   data-hint-priority="2"   (higher wins; default 0; the Next arrow is -1)
 * Mark a container with data-hint-off to switch hints off (e.g. hands-free games).
 */
export function IdleHint({ resetKey }: { resetKey: string }) {
  const [spot, setSpot] = useState<Spot | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const schedule = () => {
      clear();
      setSpot(null);
      timers.current.push(
        setTimeout(() => {
          const next = findSpot();
          if (next) {
            setSpot(next);
            timers.current.push(setTimeout(schedule, SHOW_MS));
          } else schedule();
        }, IDLE_MS),
      );
    };
    schedule();
    window.addEventListener("pointerdown", schedule, true);
    window.addEventListener("keydown", schedule, true);
    return () => {
      clear();
      window.removeEventListener("pointerdown", schedule, true);
      window.removeEventListener("keydown", schedule, true);
    };
  }, [resetKey]);

  return (
    <AnimatePresence>
      {spot && (
        <motion.div
          key={`${spot.x}-${spot.y}-${spot.kind}`}
          className="pointer-events-none fixed z-[200]"
          style={{ left: spot.x, top: spot.y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden
        >
          <HintHand kind={spot.kind} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function findSpot(): Spot | null {
  if (document.querySelector("[data-hint-off]")) return null;
  let best: { el: HTMLElement; p: number } | null = null;
  for (const el of document.querySelectorAll<HTMLElement>("[data-hint]")) {
    if ((el as HTMLButtonElement).disabled) continue;
    const r = el.getBoundingClientRect();
    const visible = r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
    if (!visible || getComputedStyle(el).visibility === "hidden" || Number(getComputedStyle(el).opacity) < 0.2) continue;
    const p = Number(el.dataset.hintPriority ?? 0);
    if (!best || p > best.p) best = { el, p };
  }
  if (!best) return null;
  const r = best.el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, kind: (best.el.dataset.hint as Kind) || "tap" };
}

/** A soft cartoon hand; the fingertip sits on the target point. */
function HintHand({ kind }: { kind: Kind }) {
  const dx = kind === "drag-left" ? -140 : kind === "drag-right" ? 140 : 0;
  const path =
    kind === "draw"
      ? { x: [0, 40, 70, 30, 0], y: [0, -30, 10, 35, 0] }
      : dx
        ? { x: [0, 0, dx, dx], y: [0, 0, 0, 0] }
        : { x: [0, 0, 0], y: [0, 6, 0] };
  return (
    <>
      {/* tap ripple at the target */}
      {kind === "tap" && (
        <motion.span
          className="absolute block rounded-full border-4 border-white/90"
          style={{ width: 60, height: 60, left: -30, top: -30, boxShadow: "0 0 0 3px rgba(58,56,51,0.25)" }}
          animate={{ scale: [0.4, 1.3], opacity: [0.9, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      {/* drag direction dots */}
      {dx !== 0 && (
        <svg className="absolute overflow-visible" style={{ left: 0, top: 0 }} width="1" height="1">
          {[0.25, 0.5, 0.75].map((t) => (
            <circle key={t} cx={dx * t} cy={0} r={5} fill="white" opacity={0.85} stroke="rgba(58,56,51,0.35)" strokeWidth={2} />
          ))}
        </svg>
      )}
      <motion.svg
        viewBox="0 0 64 80"
        width={58}
        height={72}
        className="absolute overflow-visible"
        style={{ left: -14, top: -4, filter: "drop-shadow(0 3px 4px rgba(58,56,51,0.35))" }}
        animate={path}
        transition={{ duration: dx ? 1.6 : kind === "draw" ? 1.8 : 1.1, repeat: Infinity, ease: "easeInOut", times: dx ? [0, 0.2, 0.8, 1] : undefined }}
      >
        <path
          d="M14 6c0-4 7-4 7 0v26c1-3 7-3 7 1 1-3 7-3 7 1 1-3 7-2 7 2v18c0 12-7 22-19 22-9 0-14-5-18-12L1 47c-2-4 3-7 6-4l7 8z"
          fill="#fff8ef"
          stroke="#3a3833"
          strokeWidth={2.6}
          strokeLinejoin="round"
        />
      </motion.svg>
    </>
  );
}
