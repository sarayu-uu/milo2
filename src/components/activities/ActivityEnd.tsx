"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import type { ActivityMeta } from "@/types/activity";
import { Milo } from "@/components/characters/Milo";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { PaperButton } from "@/components/scrapbook/primitives";
import { Doodle } from "@/components/scrapbook/Doodle";
import { useSpeech } from "@/hooks/useSpeech";
import { ActivityFeedbackButton } from "@/components/feedback/ActivityFeedback";

/**
 * Activities have endings. No autoplay into the next thing —
 * just clear, calm choices.
 */
export function ActivityEnd({
  meta,
  worldChanged,
  backKind,
  onBack,
  onWorld,
  onAgain,
}: {
  meta: ActivityMeta;
  worldChanged: boolean;
  backKind: "learn" | "room";
  onBack: () => void;
  onWorld: () => void;
  onAgain: () => void;
}) {
  const milo = useSpeech("milo", { expression: "happy" });
  useEffect(() => {
    const t = setTimeout(
      () =>
        milo.say(worldChanged ? "Psst. I think something changed in my house…" : "That was fun. What now?", {
          expression: worldChanged ? "suspicious" : "happy",
          action: worldChanged ? "lookRight" : "idle",
          holdMs: Infinity,
        }),
      400,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center gap-[6%] px-[8%]">
      <div className="relative w-[30%]">
        <div className="absolute bottom-[94%] left-[10%] w-[150%]">
          <SpeechBubble text={milo.text} />
        </div>
        <Milo expression={milo.expression} action={milo.action} talking={milo.talking} className="h-auto w-full" />
      </div>
      <motion.div className="flex flex-col items-start gap-[3vh]" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
        <span className="font-hand text-[1.4rem] text-ink-soft">{meta.title}</span>
        <PaperButton size="lg" color={worldChanged ? "#fbf8f1" : "#d8b45e"} onClick={onBack} tilt={-1}>
          <Doodle name={backKind === "room" ? "house" : "stories"} className="h-8 w-8" />
          {backKind === "room" ? "Back to the room" : "Back to activities"}
        </PaperButton>
        <PaperButton size="lg" color={worldChanged ? "#d8b45e" : "#a9b89a"} onClick={onWorld} tilt={1}>
          <Doodle name="house" className="h-8 w-8" />
          Visit Milo&apos;s World
          {worldChanged && <span className="ml-1 h-3 w-3 rounded-full bg-coral" aria-label="something new" />}
        </PaperButton>
        <button type="button" onClick={onAgain} className="font-display min-h-[48px] px-2 text-[1.2rem] text-ink-soft underline decoration-dashed underline-offset-4">
          Play again
        </button>
      </motion.div>

      {/* for grown-ups: how did it go? */}
      <ActivityFeedbackButton activityId={meta.id} activityTitle={meta.title} />
    </div>
  );
}
