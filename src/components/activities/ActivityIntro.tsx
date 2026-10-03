"use client";

import { motion } from "motion/react";
import { Clock, Package, Users } from "lucide-react";
import type { ActivityMeta } from "@/types/activity";
import { Art } from "@/components/art/Art";
import { Character } from "@/components/characters/Character";
import { Paper, PaperButton, Tape } from "@/components/scrapbook/primitives";
import { BackButton } from "@/components/ui/TopBar";
import { PARTICIPATION_LABEL, materialsLabel } from "@/features/activities/labels";

/**
 * Activity intro: one big "Let's go!" for the child; a quiet strip of
 * facts for the grown-up (time, who's involved, materials).
 */
export function ActivityIntro({ meta, ready, onStart, onBack }: { meta: ActivityMeta; ready: boolean; onStart: () => void; onBack: () => void }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center gap-[5%] px-[8%]">
      <div className="absolute top-[var(--gutter)] left-[var(--gutter)]">
        <BackButton onClick={onBack} />
      </div>

      <motion.div initial={{ rotate: -6, y: 20, opacity: 0 }} animate={{ rotate: -2.5, y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 20 }} className="relative w-[34%]">
        <Paper className="p-[5%]" color="#fbf8f1">
          <div className="construction flex aspect-square items-center justify-center rounded-md" style={{ "--paper-bg": "#e9dcc0" } as React.CSSProperties}>
            <Art k={meta.thumbnail} className="h-[70%] w-[70%]" />
          </div>
        </Paper>
        <Tape className="-top-2 left-[18%] -rotate-12" />
        <Tape className="-top-2 right-[18%] rotate-12" variant="pink" />
        <div className="absolute -right-[18%] -bottom-[8%] w-[46%]">
          <Character id={meta.character === "milo" ? "milo" : meta.character} expression="happy" action="idle" className="h-auto w-full" />
        </div>
      </motion.div>

      <div className="flex w-[46%] flex-col items-start gap-[3vh]">
        <h1 className="font-display text-[3.4rem] leading-[0.95] text-ink">{meta.title}</h1>
        <p className="font-display text-[1.6rem] leading-snug text-ink-soft">{meta.tagline}</p>

        <PaperButton size="xl" color="#d8b45e" sfx="page-flip" onClick={onStart} disabled={!ready} aria-label="Let's go" className="disabled:opacity-60">
          Let&apos;s go!
          <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
            <path d="M8 25c10-1 20-1 30-1M28 13l11 11-11 11" fill="none" stroke="#3a3833" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </PaperButton>

        {/* for grown-ups */}
        <div className="notebook mt-[1vh] w-full rounded-md px-4 py-3 text-[max(12px,0.98rem)] text-ink-soft shadow-[var(--shadow-pressed)]">
          <div className="flex flex-wrap gap-x-5 gap-y-1 font-bold text-ink">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {meta.duration} min
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {PARTICIPATION_LABEL[meta.parentParticipation]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Package className="h-4 w-4" /> {materialsLabel(meta)}
            </span>
          </div>
          <p className="mt-1 leading-snug">{meta.parentSummary}</p>
        </div>
      </div>
    </div>
  );
}

