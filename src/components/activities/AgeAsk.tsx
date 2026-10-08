"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import type { BroadAge } from "@/types/activity";
import { AGES } from "@/features/curriculum/age";
import { Milo } from "@/components/characters/Milo";
import { Tape } from "@/components/scrapbook/primitives";
import { sound } from "@/lib/audio/soundManager";
import { speak } from "@/lib/audio/voice";
import { recordingDuration } from "@/lib/audio/recordings";

/** One colour per age button, borrowed from the Play Book strips. */
const COLORS: Record<BroadAge, string> = { 3: "#a3c486", 4: "#f0c24f", 5: "#8fcbeb", 6: "#f2896b" };

/** Milo on the subject of ages. One per visit. */
const QUIPS = [
  "I'm three and a half. The half is VERY important.",
  "I'm 4. In pigeon years that's… also 4.",
  "How old am I? Old enough to lose a sock. Twice.",
  "I'm 5. I can count to 5. Coincidence? No.",
];

/** Milo, once the grown-up picks an age: for 3, 4, 5 and 6+, in that order. */
const REACTIONS = [
  "Three! I'm three and a half, so I'm in charge. Mostly.",
  "Four! Same as me. Probably. I lost count.",
  "Five! Older than me. Please be gentle with my socks.",
  "Six?! You're practically a grown-up. Can you find my other sock?",
];

/** After an age is picked, the card stays this long (longer if Milo's line is), then closes. */
const SHOW_MIN_MS = 5000;
const SHOW_MAX_MS = 8000;

/**
 * Over the Play Book, the first time: a grown-up says how old the child is,
 * and the Play Book shows the games that fit (see isForAge). Milo reacts to
 * the age for a few seconds, then the card closes by itself.
 */
export function AgeAsk({ onPick, onSkip, onClose }: { onPick: (age: BroadAge) => void; onSkip: () => void; onClose: () => void }) {
  const [quipIndex] = useState(() => Math.floor(Math.random() * QUIPS.length));
  const [picked, setPicked] = useState<BroadAge | null>(null);
  const [talking, setTalking] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const line = picked ? REACTIONS[picked - 3] : QUIPS[quipIndex];

  // his beak moves while he speaks (or briefly, with sound off). speak() is called with the line
  // lists directly so `npm run voice:scan` finds them.
  const beak = { onStart: () => setTalking(true), onEnd: () => setTalking(false) };
  const silentBeak = (audible: boolean) => {
    if (audible) return;
    setTalking(true);
    setTimeout(() => setTalking(false), 1500);
  };

  useEffect(() => {
    const t = setTimeout(() => silentBeak(speak(QUIPS[quipIndex], "milo", beak)), 700);
    return () => {
      clearTimeout(t);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (a: BroadAge) => {
    if (picked) return;
    void sound.play("pop");
    setPicked(a);
    onPick(a);
    silentBeak(speak(REACTIONS[a - 3], "milo", beak));
    const ms = (recordingDuration(REACTIONS[a - 3], "milo") ?? 0) + 1500;
    closeTimer.current = setTimeout(onClose, Math.min(SHOW_MAX_MS, Math.max(SHOW_MIN_MS, ms)));
  };

  return (
    <motion.div
      className="absolute inset-0 z-[70] flex items-center justify-center bg-ink/35 p-[4%] backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-ask-title"
    >
      <motion.div
        className="paper relative flex max-h-full w-[min(50rem,100%)] items-end gap-[3%] overflow-y-auto px-[4%] py-6"
        style={{ "--paper-bg": "#fffdf7", rotate: "-0.8deg", boxShadow: "var(--shadow-lift)" } as React.CSSProperties}
        initial={{ y: 30, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <Tape className="-top-3 left-[30%] rotate-2" />
        {/* Milo, most of the card's height: feet on the bottom edge, half hidden behind the right
            edge. Every few seconds his upper body wiggles in for a better look; his feet stay put. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-start" aria-hidden>
          <motion.p
            key={line}
            className="font-hand relative z-10 mt-[3.5rem] -mr-[5rem] max-w-[11rem] rotate-[-2deg] rounded-2xl bg-paper px-3 py-2 text-[1.1rem] leading-snug text-ink shadow-[var(--shadow-paper)]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: picked ? 0 : 0.7 }}
          >
            {line}
          </motion.p>
          {/* the window he peeks through: sized from the card's height (cqh = 1% of it) */}
          <div className="relative h-full overflow-hidden" style={{ aspectRatio: "0.46", containerType: "size" }}>
            <motion.div
              className="absolute bottom-0"
              // his drawing has empty space above his head, so it's drawn a bit taller than the card.
              // The window's right edge runs down his middle; its left edge stays well clear of his
              // wing, with room for the wiggle
              style={{ height: "120cqh", left: "-26cqh", transformOrigin: "50% 92%" }}
              // skewing from his feet bends only his top half: a little wiggle towards the buttons
              animate={{ skewX: [0, 0, 9, 3, 8, 0] }}
              transition={{ duration: 3.6, times: [0, 0.5, 0.62, 0.72, 0.82, 1], repeat: Infinity, ease: "easeInOut" }}
            >
              <Milo expression={picked ? "happy" : "suspicious"} action="idle" lookAt={{ x: -1, y: 0.2 }} talking={talking} className="h-full w-auto" />
            </motion.div>
          </div>
        </div>
        <div className="min-w-0 flex-1 pr-[15rem] sm:pr-[17rem]">
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1 text-sm font-bold tracking-wider text-paper uppercase">
            <Lock className="h-4 w-4" /> For grown-ups
          </span>
          <h2 id="age-ask-title" className="font-display mt-3 text-[clamp(1.6rem,3.4vw,2.4rem)] leading-tight text-ink">
            How old is your little one?
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {AGES.map((a) => (
              <motion.button
                key={a}
                type="button"
                whileTap={{ scale: 0.92 }}
                disabled={picked !== null}
                onClick={() => pick(a)}
                aria-label={a === 6 ? "6 or older" : `${a} years old`}
                className={`font-display flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full text-[2rem] text-ink shadow-[var(--shadow-paper)] transition-opacity ${picked && picked !== a ? "opacity-35" : ""} ${picked === a ? "ring-4 ring-ink/70" : ""}`}
                style={{ background: COLORS[a] }}
              >
                {a === 6 ? "6+" : a}
              </motion.button>
            ))}
          </div>
          <p className="mt-4 text-ink-soft">
            We&apos;ll show the games made for their age. Then explore around together: tap a colour and see what&apos;s inside!
          </p>
          <p className="mt-1 text-sm text-ink-soft">You can change this any time in the grown-ups area.</p>
          {picked ? (
            <button
              type="button"
              onClick={() => {
                if (closeTimer.current) clearTimeout(closeTimer.current);
                onClose();
              }}
              className="mt-3 min-h-[48px] rounded-full bg-moss px-6 font-bold text-paper"
            >
              Let&apos;s play!
            </button>
          ) : (
            <button type="button" onClick={onSkip} className="mt-3 min-h-[44px] text-ink-soft underline underline-offset-4">
              Skip, show every game
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
