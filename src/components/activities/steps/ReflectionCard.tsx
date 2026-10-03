"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ReflectionStep } from "@/types/activity";
import type { StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { useSpeech } from "@/hooks/useSpeech";
import { Paper } from "@/components/scrapbook/primitives";
import { Doodle } from "@/components/scrapbook/Doodle";
import { StepFrame } from "./StepFrame";

/** Show / tell / talk. No answers are collected — the conversation is the point. */
export function ReflectionCard({ step, band, onDone }: StepProps<ReflectionStep>) {
  const qs = step.questions.map((q) => pick(q, band));
  const [i, setI] = useState(0);
  const voice = useSpeech(step.speaker, { expression: "curious" });

  useEffect(() => {
    voice.say(qs[i], { expression: "curious", action: "headTilt" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <StepFrame
      speaker={step.speaker}
      line={voice.text}
      expression={voice.expression}
      action={voice.action}
      talking={voice.talking}
      onNext={() => (i + 1 < qs.length ? setI(i + 1) : onDone())}
    >
      <div className="flex w-full flex-col items-center gap-[4vh]">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Paper className="flex max-w-[38rem] items-center gap-5 px-8 py-7" tilt={-1.2} tape="top">
              <Doodle name="heart" className="h-14 w-14 shrink-0 text-coral" />
              <p className="font-display text-[2.4rem] leading-tight text-ink">{qs[i]}</p>
            </Paper>
          </motion.div>
        </AnimatePresence>
        <p className="font-hand text-[1.4rem] text-ink-soft">Tell someone near you!</p>
        {step.parentNote && (
          <div className="notebook max-w-[34rem] rotate-[1deg] rounded-md px-5 py-3 text-[1rem] text-ink-soft shadow-[var(--shadow-pressed)]">
            <span className="mr-2 text-[0.8rem] font-bold tracking-wider text-brick uppercase">For grown-ups</span>
            {step.parentNote}
          </div>
        )}
      </div>
    </StepFrame>
  );
}
