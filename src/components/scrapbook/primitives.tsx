"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { sound } from "@/lib/audio/soundManager";
import type { SoundId } from "@/types/audio";

/* ------------------------------------------------------------------ */
/* Paper — the base material                                           */
/* ------------------------------------------------------------------ */

export function Paper({
  children,
  className = "",
  color,
  tilt = 0,
  tape,
  torn,
  style,
}: {
  children?: ReactNode;
  className?: string;
  /** CSS colour for the sheet. */
  color?: string;
  tilt?: number;
  tape?: "top" | "corners" | "left" | "none";
  torn?: "bottom" | "right";
  style?: CSSProperties;
}) {
  return (
    <div
      className={`paper relative ${torn === "bottom" ? "torn-bottom" : torn === "right" ? "torn-right" : ""} ${className}`}
      style={{ ...(color ? ({ "--paper-bg": color } as CSSProperties) : null), rotate: tilt ? `${tilt}deg` : undefined, ...style }}
    >
      {children}
      {tape === "top" && <Tape className="-top-2.5 left-1/2 -translate-x-1/2 -rotate-3" />}
      {tape === "left" && <Tape className="top-3 -left-6 -rotate-[70deg]" />}
      {tape === "corners" && (
        <>
          <Tape className="-top-2 -left-4 -rotate-[35deg]" />
          <Tape className="-top-2 -right-4 rotate-[35deg]" variant="pink" />
        </>
      )}
    </div>
  );
}

export function Tape({ className = "", variant }: { className?: string; variant?: "pink" | "blue" }) {
  return <span aria-hidden className={`tape ${variant ? `tape--${variant}` : ""} ${className}`} />;
}

/** Handwritten paper label, like a strip of masking tape with writing. */
export function Label({ children, className = "", color = "#fbf8f1", tilt = -2 }: { children: ReactNode; className?: string; color?: string; tilt?: number }) {
  return (
    <span
      className={`paper font-hand inline-block px-3 py-0.5 text-[1.05rem] leading-tight text-ink ${className}`}
      style={{ "--paper-bg": color, rotate: `${tilt}deg`, borderRadius: 3 } as CSSProperties}
    >
      {children}
    </span>
  );
}

/** Round sticker with white die-cut border. */
export function Sticker({ children, className = "", color = "#d8b45e" }: { children: ReactNode; className?: string; color?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-[0.22rem] border-paper shadow-[var(--shadow-paper)] ${className}`}
      style={{ background: color }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type PaperButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  color?: string;
  tilt?: number;
  size?: "md" | "lg" | "xl";
  sfx?: SoundId | null;
};

/**
 * The child-facing button: a chunky piece of paper that presses down.
 * Always ≥ 48px, works on touch, no hover dependence.
 */
export function PaperButton({ children, className = "", color = "#fbf8f1", tilt = 0, size = "md", sfx = "tap", onClick, ...rest }: PaperButtonProps) {
  const pad = size === "xl" ? "px-8 py-5 text-[1.9rem]" : size === "lg" ? "px-6 py-3.5 text-[1.45rem]" : "px-4 py-2.5 text-[1.15rem]";
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95, y: 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 26 }}
      className={`paper font-display relative inline-flex min-h-[var(--touch-min)] min-w-[var(--touch-min)] items-center justify-center gap-2 text-ink ${pad} ${className}`}
      style={{ "--paper-bg": color, rotate: tilt ? `${tilt}deg` : undefined } as CSSProperties}
      onClick={(e) => {
        if (sfx) void sound.play(sfx);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

/** Small, quiet utility button for grown-up controls (sound, parent, a11y). */
export function UtilityButton({
  children,
  label,
  className = "",
  ...rest
}: Omit<HTMLMotionProps<"button">, "children"> & { children: ReactNode; label: string }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.92 }}
      className={`inline-flex h-[var(--touch-min)] w-[var(--touch-min)] items-center justify-center rounded-full bg-paper/80 text-ink-soft shadow-[var(--shadow-pressed)] backdrop-blur-sm ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

/** The big hand-drawn "next" arrow used through stories and steps. */
export function NextArrow({ onClick, label = "Next", className = "", pulse = true }: { onClick: () => void; label?: string; className?: string; pulse?: boolean }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      data-hint="tap"
      data-hint-priority="-1"
      onClick={() => {
        void sound.play("page-flip");
        onClick();
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={pulse ? { opacity: 1, scale: [1, 1.06, 1] } : { opacity: 1, scale: 1 }}
      transition={pulse ? { scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.3 } } : { duration: 0.3 }}
      whileTap={{ scale: 0.9 }}
      className={`paper inline-flex h-[var(--touch-big)] w-[var(--touch-big)] items-center justify-center rounded-full ${className}`}
      style={{ "--paper-bg": "#d8b45e" } as CSSProperties}
    >
      <svg viewBox="0 0 48 48" className="h-3/5 w-3/5" aria-hidden>
        <path d="M8 25c10-1 20-1 30-1M28 13l11 11-11 11" fill="none" stroke="#3a3833" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  );
}
