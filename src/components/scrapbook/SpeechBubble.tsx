"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";

/**
 * Speech bubble cut from notebook paper. Text is short; it's also spoken.
 * `tail` points toward the speaker.
 */
export function SpeechBubble({
  text,
  tail = "bottom-left",
  className = "",
  color = "#fdfbf5",
  size = "md",
  speakerName,
}: {
  text: string | null;
  tail?: "bottom-left" | "bottom-right" | "left" | "right" | "none";
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  speakerName?: string;
}) {
  const fs = size === "lg" ? "text-[2rem]" : size === "sm" ? "text-[1.2rem]" : "text-[1.55rem]";
  return (
    <AnimatePresence mode="wait">
      {text && (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 8, scale: 0.94, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: -1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.15 } }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className={`relative z-[var(--z-speech)] w-fit max-w-full ${className}`}
          role="status"
          aria-live="polite"
        >
          <div
            className={`paper font-display relative px-5 py-3 leading-snug text-ink ${fs}`}
            style={{ "--paper-bg": color, borderRadius: "1.2rem 1.4rem 1.1rem 1.5rem" } as CSSProperties}
          >
            {speakerName && <span className="mb-0.5 block text-[0.85rem] tracking-wide text-ink-soft/80 uppercase">{speakerName}</span>}
            {text}
          </div>
          {tail !== "none" && <BubbleTail tail={tail} color={color} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BubbleTail({ tail, color }: { tail: string; color: string }) {
  const pos: Record<string, string> = {
    "bottom-left": "-bottom-[1.05rem] left-8",
    "bottom-right": "-bottom-[1.05rem] right-8 -scale-x-100",
    left: "top-1/2 -left-[1.1rem] -translate-y-1/2 rotate-90",
    right: "top-1/2 -right-[1.1rem] -translate-y-1/2 -rotate-90",
  };
  return (
    <svg viewBox="0 0 30 22" className={`absolute h-[1.4rem] w-[2rem] ${pos[tail]}`} aria-hidden>
      <path d="M2 0 C6 10 4 16 0 22 C10 18 20 10 26 0 Z" fill={color} />
      <path d="M2 0 C6 10 4 16 0 22 C10 18 20 10 26 0" fill="none" stroke="rgba(58,56,51,0.12)" strokeWidth={1.5} />
    </svg>
  );
}
