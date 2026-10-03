"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { MatchStep } from "@/types/activity";
import { useActivity, type StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { Art } from "@/components/art/Art";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";
import { StepFrame } from "./StepFrame";

/** Visible matching (not hidden memory): tap two that are the same. */
export function MatchGame({ step, band, onDone }: StepProps<MatchStep>) {
  const { answer } = useActivity();
  const speaker = step.speaker ?? "squirrel";
  const voice = useSpeech(speaker, { expression: "happy" });
  const pairs = pick(step.pairs, band);
  const tiles = useMemo(() => {
    const t = pairs.flatMap((k, i) => [
      { id: `${i}a`, k },
      { id: `${i}b`, k },
    ]);
    // Seeded shuffle, then nudge apart any pair that ended up side by side.
    let seed = t.length * 9301 + 49297;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
    for (let i = 1; i < t.length; i++) {
      if (t[i].k === t[i - 1].k) {
        const k = t.findIndex((x, n) => n > i && x.k !== t[i].k);
        if (k > 0) [t[i], t[k]] = [t[k], t[i]];
      }
    }
    return t;
  }, [pairs]);
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [tries, setTries] = useState(0);
  const done = matched.length === tiles.length;

  useEffect(() => {
    voice.say(pick(step.prompt, band));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tap = (id: string, k: string) => {
    if (matched.includes(id) || done) return;
    if (!selected) {
      setSelected(id);
      void sound.play("tap");
      return;
    }
    if (selected === id) {
      setSelected(null);
      return;
    }
    const other = tiles.find((t) => t.id === selected)!;
    const ok = other.k === k;
    const t = tries + 1;
    setTries(t);
    answer(step.id, ok, t);
    if (ok) {
      const next = [...matched, id, selected];
      setMatched(next);
      void sound.play("clap");
      if (next.length === tiles.length) voice.say("Every sock has a friend!", { expression: "proud", action: "hop" });
      else voice.say(["A pair!", "Together again!", "Sock friends!"][next.length % 3], { expression: "happy" });
    } else {
      setWrong([id, selected]);
      void sound.play("wrong-gentle");
      voice.say("Hmm, look at the colours… and the stripes.", { expression: "thinking" });
      setTimeout(() => setWrong([]), 500);
    }
    setSelected(null);
  };

  const cols = tiles.length > 6 ? 5 : tiles.length > 4 ? 3 : 3;

  return (
    <StepFrame backdrop="living-room" speaker={speaker} line={voice.text} expression={voice.expression} action={voice.action} talking={voice.talking} onNext={done ? onDone : null}>
      <div className="grid gap-[1.2rem]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, width: `min(100%, ${cols * 9.5}rem)` }}>
        {tiles.map((t, i) => {
          const isMatched = matched.includes(t.id);
          return (
            <motion.button
              key={t.id}
              type="button"
              aria-label={isMatched ? "Matched sock" : "Sock"}
              onClick={() => tap(t.id, t.k)}
              animate={
                wrong.includes(t.id)
                  ? { x: [0, -8, 8, -4, 0] }
                  : { scale: selected === t.id ? 1.08 : 1, y: selected === t.id ? -8 : 0, opacity: isMatched ? 0.45 : 1 }
              }
              whileTap={{ scale: 0.92 }}
              className={`paper relative aspect-square p-[10%] ${selected === t.id ? "ring-4 ring-mustard" : ""}`}
              style={{ rotate: `${[-3, 2, -1, 3, -2][i % 5]}deg` }}
            >
              <Art k={t.k} className="h-full w-full" />
              <AnimatePresence>
                {isMatched && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="font-hand absolute -top-2 -right-2 text-[1.6rem] text-moss">
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </StepFrame>
  );
}
