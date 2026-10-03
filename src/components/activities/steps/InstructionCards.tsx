"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { InstructionsStep } from "@/types/activity";
import type { StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { Art } from "@/components/art/Art";
import { Label, Paper, PaperButton } from "@/components/scrapbook/primitives";
import { Doodle } from "@/components/scrapbook/Doodle";
import { speak } from "@/lib/audio/voice";
import { sound } from "@/lib/audio/soundManager";
import { SceneStage } from "@/components/world/SceneStage";

/**
 * Scrapbook how-to cards: origami, crafts, hand shadows, building.
 * One card at a time, big picture, one short spoken line.
 */
export function InstructionCards({ step, band, onDone }: StepProps<InstructionsStep>) {
  const [i, setI] = useState(-1); // -1 = "what you need" card
  const card = i >= 0 ? step.cards[i] : null;
  const last = i === step.cards.length - 1;

  useEffect(() => {
    if (card) speak(pick(card.text, band), "milo");
    else if (step.intro) speak(pick(step.intro, band), "milo");
    void sound.play(step.medium === "origami" ? "fold" : "page-flip");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <SceneStage>
      <div className="paper absolute inset-0 rounded-none" />
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2">
        <Label className="text-[1.8rem]" tilt={-1.5}>
          {step.title}
        </Label>
      </div>

      <div className="absolute inset-x-[8%] top-[16%] bottom-[16%] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {card ? (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 60, rotate: 3 }}
              animate={{ opacity: 1, x: 0, rotate: i % 2 ? 1 : -1 }}
              exit={{ opacity: 0, x: -60, rotate: -3 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="flex h-full w-full items-center gap-[4%]"
            >
              <Paper className="flex aspect-square h-[88%] shrink-0 items-center justify-center p-[3%]" color="#fdfbf5" tape="top">
                <span className="font-display absolute top-2 left-3 text-[1.8rem] text-coral">{i + 1}</span>
                <Art k={card.art} className="h-[86%] w-[86%]" />
              </Paper>
              {card.result && (
                <>
                  <Doodle name="arrow" className="h-16 w-16 shrink-0 text-ink-soft" />
                  <Paper className="flex aspect-square h-[58%] shrink-0 items-center justify-center p-[3%]" color="#efe2c8" tilt={2}>
                    <Art k={card.result} className="h-[80%] w-[80%]" />
                  </Paper>
                </>
              )}
              <p className="font-display min-w-[12rem] flex-1 text-[2rem] leading-snug text-ink">{pick(card.text, band)}</p>
            </motion.div>
          ) : (
            <motion.div key="need" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -60 }} className="flex w-full items-center gap-[5%]">
              <Paper className="w-[46%] p-[4%]" color="#fdfbf5" tilt={-1.5} tape="corners">
                <h3 className="font-display text-[2rem]">You need</h3>
                <ul className="mt-2 space-y-1 text-[1.25rem]">
                  {(step.materials?.length ? step.materials : ["Just you!"]).map((m) => (
                    <li key={m} className="flex items-start gap-2">
                      <Doodle name="star" className="mt-1 h-5 w-5 shrink-0 text-mustard" /> {m}
                    </li>
                  ))}
                </ul>
                {step.intro && <p className="font-display mt-3 text-[1.4rem] text-ink-soft">{pick(step.intro, band)}</p>}
              </Paper>
              {step.parentTip && (
                <div className="notebook w-[40%] rotate-[1.5deg] rounded-md p-[3%] text-[1.05rem] shadow-[var(--shadow-paper)]">
                  <span className="mb-1 block text-[0.85rem] font-bold tracking-wider text-brick uppercase">For grown-ups</span>
                  {step.parentTip}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-[6%] bottom-[4%] flex items-center justify-between">
        <PaperButton onClick={() => setI(Math.max(-1, i - 1))} disabled={i < 0} aria-label="Previous card" className="disabled:opacity-0">
          <span className="text-[1.6rem]">←</span>
        </PaperButton>
        <div className="flex gap-2" aria-hidden>
          {[-1, ...step.cards.map((_, k) => k)].map((k) => (
            <span key={k} className={`h-3 w-3 rounded-full ${k === i ? "bg-coral" : "bg-warm-grey/40"}`} />
          ))}
        </div>
        {last ? (
          <PaperButton color="#92b97e" size="lg" onClick={onDone} sfx="bell">
            We did it!
          </PaperButton>
        ) : (
          <PaperButton color="#d8b45e" size="lg" onClick={() => setI(i + 1)} aria-label="Next card">
            {i < 0 ? "Let's start" : "Next"} <span className="text-[1.6rem]">→</span>
          </PaperButton>
        )}
      </div>
    </SceneStage>
  );
}
