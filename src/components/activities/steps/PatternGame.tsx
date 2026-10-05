"use client";

import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import type { PatternStep } from "@/types/activity";
import { useActivity, type StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { Art } from "@/components/art/Art";
import { Paper } from "@/components/scrapbook/primitives";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";
import { StepFrame } from "./StepFrame";

/** "What comes next?" — continue a repeating pattern. */
export function PatternGame({ step, band, onDone }: StepProps<PatternStep>) {
  const { answer } = useActivity();
  const seq = pick(step.sequence, band);
  const right = pick(step.answer, band);
  const options = pick(step.options, band);
  const speaker = step.speaker ?? "snail";
  const voice = useSpeech(speaker, { expression: "thinking" });
  const [placed, setPlaced] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const shake = useAnimationControls();

  useEffect(() => {
    voice.say(pick(step.prompt, band));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (k: string) => {
    if (placed) return;
    const a = attempt + 1;
    setAttempt(a);
    answer(step.id, k === right, a);
    if (k === right) {
      setPlaced(k);
      void sound.play("bell");
      voice.say(a === 1 ? "Yes! That's it. I remember now." : "That's it! Thank you.", { expression: "happy" });
    } else {
      void sound.play("wrong-gentle");
      void shake.start({ x: [0, -10, 10, -6, 0], transition: { duration: 0.4 } });
      voice.say(`Hmm. Let's say it together: ${seq.slice(-3).join(", ")}…`, { expression: "confused" });
    }
  };

  return (
    <StepFrame backdrop="garden" speaker={speaker} line={voice.text} expression={voice.expression} talking={voice.talking} onNext={placed ? onDone : null}>
      <div className="flex w-full flex-col items-center gap-[6vh]">
        <motion.div animate={shake} className="flex items-end justify-center gap-[1.5%]">
          {seq.map((k, i) => (
            <Paper key={i} className="flex aspect-square w-[clamp(4rem,9vw,8rem)] items-center justify-center p-2" tilt={i % 2 ? 2 : -2}>
              <Art k={k} className="h-full w-full" />
            </Paper>
          ))}
          <Paper
            className="flex aspect-square w-[clamp(4.6rem,10vw,9rem)] items-center justify-center border-[3px] border-dashed border-coral p-2"
            tilt={3}
            color={placed ? "#fbf8f1" : "#fdf3e6"}
          >
            {placed ? (
              <motion.div initial={{ scale: 0.4, y: 80 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="h-full w-full">
                <Art k={placed} className="h-full w-full" />
              </motion.div>
            ) : (
              <span className="font-display text-[3.4rem] text-coral">?</span>
            )}
          </Paper>
        </motion.div>

        <div className="flex gap-[3%]">
          {options.map((k) => (
            <motion.button
              key={k}
              type="button"
              aria-label={k}
              data-hint={placed ? undefined : "tap"}
              data-hint-priority="1"
              onClick={() => choose(k)}
              whileTap={{ scale: 0.9 }}
              className={`paper flex aspect-square w-[clamp(4.4rem,9vw,8rem)] items-center justify-center p-2 ${placed === k ? "opacity-30" : ""}`}
            >
              <Art k={k} className="h-full w-full" />
            </motion.button>
          ))}
        </div>
      </div>
    </StepFrame>
  );
}
