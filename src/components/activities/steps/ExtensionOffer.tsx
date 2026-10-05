"use client";

import { useEffect } from "react";
import { Clock, Package, Users, TreePine } from "lucide-react";
import type { ActivityStep, ExtensionOfferStep } from "@/types/activity";
import { useActivity } from "@/features/activities/ActivityContext";
import { activityAnalyticsProps } from "@/features/activities/labels";
import { pick } from "@/features/curriculum/age";
import type { AgeBand } from "@/types/activity";
import { analytics } from "@/lib/analytics/analytics";
import { useSpeech } from "@/hooks/useSpeech";
import { Paper, PaperButton } from "@/components/scrapbook/primitives";
import { StepFrame } from "./StepFrame";

/**
 * Optional real-world / parent extension. Both answers are fine:
 * "Not now" carries no penalty and is tracked as a research signal.
 */
export function ExtensionOffer({
  step,
  band,
  onAccept,
  onSkip,
}: {
  step: ExtensionOfferStep;
  band: AgeBand;
  onAccept: (steps: ActivityStep[]) => void;
  onSkip: () => void;
}) {
  const { activity } = useActivity();
  const speaker = step.speaker ?? "milo";
  const voice = useSpeech(speaker, { expression: "curious" });

  useEffect(() => {
    analytics.track("real_world_extension_offered", { ...activityAnalyticsProps(activity, band), stepId: step.id, isRealWorldExtension: true });
    voice.say(pick(step.prompt, band), { expression: "curious", action: "headTilt" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parent = step.badge === "parent-child";

  return (
    <StepFrame speaker={speaker} line={voice.text} expression={voice.expression} action={voice.action} talking={voice.talking}>
      <Paper className="relative flex w-[min(100%,40rem)] flex-col gap-4 p-[2.2rem]" tilt={-1} tape="corners">
        <span className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-[0.95rem] font-bold tracking-wider text-paper uppercase ${parent ? "bg-coral" : "bg-moss"}`}>
          {parent ? <Users className="h-4 w-4" /> : <TreePine className="h-4 w-4" />}
          {parent ? "Parent + Child" : "Real world"}
        </span>
        <h2 className="font-display text-[2.8rem] leading-none text-ink">{step.title}</h2>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[1rem] text-ink-soft">
          {step.meta?.minutes && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> about {step.meta.minutes} min
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Package className="h-4 w-4" /> {step.meta?.materials?.length ? step.meta.materials.join(", ") : "No materials"}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <PaperButton size="lg" color="#d8b45e" sfx="page-flip" onClick={() => onAccept(step.steps)} data-hint="tap">
            Let&apos;s do it!
          </PaperButton>
          <PaperButton size="lg" color="#fbf8f1" onClick={onSkip}>
            Not now
          </PaperButton>
        </div>
      </Paper>
    </StepFrame>
  );
}
