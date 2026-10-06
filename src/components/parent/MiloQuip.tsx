"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CharacterAction, Expression } from "@/types/character";
import { Milo } from "@/components/characters/Milo";

/**
 * Milo, off to the side of the grown-up pages, with a small handwritten aside.
 * Decorative: the line is a joke, never information a parent needs.
 *
 *   <MiloQuip line="I copy everything." expression="proud" />           standing beside content
 *   <MiloQuip peek line="Not peeking." className="absolute -top-…" />   just his head, over a card's top edge
 */
export function MiloQuip({
  line,
  expression = "curious",
  action = "idle",
  peek = false,
  flip = false,
  bubble = "left",
  compact = false,
  className = "",
}: {
  line: string;
  expression?: Expression;
  action?: CharacterAction;
  /** Only his head shows, as if he's peeking over an edge. */
  peek?: boolean;
  flip?: boolean;
  /** Which side of Milo the note sits on. */
  bubble?: "left" | "right";
  /** Smaller Milo and note, for tight spots. */
  compact?: boolean;
  className?: string;
}) {
  // his beak moves for a moment whenever he says something new
  const [talking, setTalking] = useState(false);
  useEffect(() => {
    setTalking(true);
    const t = setTimeout(() => setTalking(false), 1300);
    return () => clearTimeout(t);
  }, [line]);

  const milo = <Milo expression={expression} action={action} flip={flip} talking={talking} className="h-auto w-full" />;

  return (
    <div className={`pointer-events-none flex items-end gap-1 select-none ${bubble === "left" ? "flex-row" : "flex-row-reverse"} ${className}`} aria-hidden>
      <AnimatePresence mode="wait">
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className={`font-hand relative ${peek ? "mb-1" : "mb-[1.2rem]"} ${compact ? "max-w-[12rem] text-[1.05rem]" : "max-w-[15rem] text-[1.2rem]"} rounded-2xl bg-paper px-3 py-2 leading-snug text-ink shadow-[var(--shadow-paper)] ${bubble === "left" ? "rotate-[-1.5deg]" : "rotate-[1.5deg]"}`}
        >
          {line}
        </motion.p>
      </AnimatePresence>
      {peek ? (
        // just the top of his head to under his beak; the card below hides the rest of him
        <div className={`${compact ? "h-[2.85rem] w-[8rem]" : "h-[3.5rem] w-[10rem]"} shrink-0 overflow-hidden`}>
          <div className={compact ? "-mt-[1.8rem]" : "-mt-[2.25rem]"}>{milo}</div>
        </div>
      ) : (
        <div className={`${compact ? "w-[6.5rem]" : "w-[9rem]"} shrink-0`}>{milo}</div>
      )}
    </div>
  );
}
