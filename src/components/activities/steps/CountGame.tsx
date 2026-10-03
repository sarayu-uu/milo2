"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CountStep } from "@/types/activity";
import { useActivity, type StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { Art } from "@/components/art/Art";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";
import { speak } from "@/lib/audio/voice";
import { StepFrame } from "./StepFrame";

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** Tap-to-count with one-to-one correspondence, then "how many?" */
export function CountGame({ step, band, onDone }: StepProps<CountStep>) {
  const { answer } = useActivity();
  const total = pick(step.count, band);
  const speaker = step.speaker ?? "milo";
  const voice = useSpeech(speaker, { expression: "curious" });
  const [counted, setCounted] = useState<number[]>([]);
  const [phase, setPhase] = useState<"count" | "ask" | "done">("count");
  const [attempt, setAttempt] = useState(0);

  // Scattered, slightly tilted, but never overlapping.
  const spots = useMemo(() => {
    const cols = Math.min(total, total > 4 ? 3 : total);
    return Array.from({ length: total }, (_, i) => ({
      x: 8 + ((i % cols) + 0.5) * (84 / cols),
      y: (total > cols ? (Math.floor(i / cols) ? 56 : 14) : 34) + (i % 2 ? 4 : -2),
      r: [-8, 6, -3, 9, -6, 4][i % 6],
    }));
  }, [total]);

  useEffect(() => {
    voice.say(pick(step.prompt, band), { expression: "curious" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tap = (i: number) => {
    if (phase !== "count") return;
    if (counted.includes(i)) {
      void sound.play("wrong-gentle");
      voice.say("We already counted that one!", { expression: "thinking", holdMs: 2500 });
      return;
    }
    const n = counted.length + 1;
    setCounted([...counted, i]);
    void sound.play("wood-click", { rate: 0.9 + n * 0.05 });
    speak(WORDS[n] ?? String(n), speaker);
    if (n === total) {
      setTimeout(() => {
        setPhase("ask");
        voice.say("So… how many are there?", { expression: "thinking", action: "headTilt" });
      }, 900);
    }
  };

  const options = useMemo(() => [...new Set([Math.max(1, total - 1), total, total + 1])].sort((a, b) => a - b), [total]);

  const choose = (n: number) => {
    const a = attempt + 1;
    setAttempt(a);
    answer(step.id, n === total, a);
    if (n === total) {
      void sound.play("bell");
      setPhase("done");
      voice.say(`${cap(WORDS[total])}! We got it!`, { expression: "happy", action: "wingsUp" });
    } else {
      void sound.play("wrong-gentle");
      voice.say("Hmm. Let's count again, slowly.", { expression: "confused" });
      setCounted([]);
      setPhase("count");
    }
  };

  return (
    <StepFrame backdrop={step.backdrop} speaker={speaker} line={voice.text} expression={voice.expression} action={voice.action} talking={voice.talking} onNext={phase === "done" ? onDone : null}>
      <div className="relative h-full w-full">
        {spots.map((s, i) => {
          const order = counted.indexOf(i);
          return (
            <motion.button
              key={i}
              type="button"
              aria-label={order >= 0 ? `Counted ${order + 1}` : "Count this"}
              onClick={() => tap(i)}
              className="absolute w-[17%] min-w-[64px]"
              style={{ left: `${s.x}%`, top: `${s.y}%`, translateX: "-50%", rotate: s.r }}
              whileTap={{ scale: 0.9 }}
              animate={order >= 0 ? { y: [0, -12, 0] } : {}}
            >
              <Art k={step.art} className="h-auto w-full" />
              <AnimatePresence>
                {order >= 0 && (
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: -8 }}
                    className="font-display absolute -top-[18%] -right-[10%] flex h-[2.8rem] w-[2.8rem] items-center justify-center rounded-full border-[3px] border-paper bg-mustard text-[1.8rem] text-ink shadow-[var(--shadow-paper)]"
                  >
                    {order + 1}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}

        <AnimatePresence>
          {phase !== "count" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-x-0 bottom-0 flex justify-center gap-[4%]">
              {options.map((n) => (
                <motion.button
                  key={n}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => phase === "ask" && choose(n)}
                  className={`paper font-display flex min-h-[var(--touch-big)] min-w-[var(--touch-big)] flex-col items-center justify-center px-6 py-2 text-[2.6rem] leading-none ${phase === "done" && n === total ? "ring-4 ring-moss" : ""}`}
                  aria-label={WORDS[n]}
                >
                  {n}
                  <span className="mt-1 flex gap-1">
                    {Array.from({ length: n }, (_, i) => (
                      <span key={i} className="h-2 w-2 rounded-full bg-ink-soft/60" />
                    ))}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StepFrame>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
