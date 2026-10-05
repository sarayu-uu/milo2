"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Users } from "lucide-react";
import type { ParentChildStep } from "@/types/activity";
import type { StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { Paper, PaperButton, Tape } from "@/components/scrapbook/primitives";
import { Doodle } from "@/components/scrapbook/Doodle";
import { SceneStage } from "@/components/world/SceneStage";
import { speak } from "@/lib/audio/voice";

/**
 * PARENT + CHILD. Tiny, actionable grown-up instructions on the right;
 * big spoken challenges for the child on the left. No timers.
 */
export function ParentChildCard({ step, band, onDone }: StepProps<ParentChildStep>) {
  const prompts = step.childPrompts.map((p) => pick(p, band));
  const [i, setI] = useState(0);

  useEffect(() => {
    speak(prompts[i], "milo");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <SceneStage>
      <div className="paper absolute inset-0 rounded-none" style={{ "--paper-bg": "#f4ecda" } as React.CSSProperties} />
      <div className="absolute inset-[6%] flex gap-[4%]">
        {/* child side */}
        <div className="flex flex-[1.3] flex-col items-center justify-center gap-[4vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: -1.5 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="w-full"
            >
              <Paper className="px-[8%] py-[10%] text-center" color="#fbf8f1" tape="top">
                <Doodle name={step.where === "outdoor" ? "sun" : "spark"} className="mx-auto mb-3 h-12 w-12 text-mustard" />
                <p className="font-display text-[2.6rem] leading-tight text-ink">{prompts[i]}</p>
              </Paper>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-4">
            {i < prompts.length - 1 ? (
              <PaperButton size="lg" color="#d8b45e" onClick={() => setI(i + 1)} data-hint="tap">
                Next challenge →
              </PaperButton>
            ) : (
              <PaperButton size="lg" color="#92b97e" onClick={onDone} sfx="bell" data-hint="tap">
                We&apos;re back!
              </PaperButton>
            )}
            {i < prompts.length - 1 && (
              <button type="button" onClick={onDone} className="font-display min-h-[48px] px-2 text-[1.2rem] text-ink-soft underline decoration-dashed underline-offset-4">
                We&apos;re done
              </button>
            )}
          </div>
          {step.returnText && i === prompts.length - 1 && <p className="font-display text-[1.3rem] text-ink-soft">{step.returnText}</p>}
        </div>

        {/* grown-up side */}
        <div className="notebook relative flex flex-1 rotate-[1deg] flex-col gap-3 rounded-md p-[4%] text-[1.05rem] leading-snug text-ink shadow-[var(--shadow-paper)]">
          <Tape className="-top-2 left-6 -rotate-6" variant="blue" />
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-coral/80 px-3 py-1 text-[0.85rem] font-bold tracking-wider text-paper uppercase">
            <Users className="h-4 w-4" /> Parent + Child
          </span>
          <div>
            <h4 className="font-bold tracking-wide text-brick uppercase">Your job</h4>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {step.yourJob.map((j) => (
                <li key={j}>{j}</li>
              ))}
            </ul>
          </div>
          {step.tryAsking && (
            <div>
              <h4 className="font-bold tracking-wide text-brick uppercase">Try asking</h4>
              <ul className="mt-1 space-y-1">
                {step.tryAsking.map((q) => (
                  <li key={q} className="font-display text-[1.3rem]">
                    “{q}”
                  </li>
                ))}
              </ul>
            </div>
          )}
          {step.materials && <p className="text-ink-soft">You&apos;ll need: {step.materials.join(", ")}.</p>}
          <p className="mt-auto text-ink-soft">Help only if needed. That&apos;s enough.</p>
        </div>
      </div>
    </SceneStage>
  );
}
