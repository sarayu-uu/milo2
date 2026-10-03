"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { ActivityDefinition, ActivityStep, AgeBand } from "@/types/activity";
import { ActivityContext, type ActivityRuntime } from "@/features/activities/ActivityContext";
import { activityAnalyticsProps } from "@/features/activities/labels";
import { analytics } from "@/lib/analytics/analytics";
import { stopSpeaking } from "@/lib/audio/voice";
import { useProgressStore } from "@/stores/progressStore";
import { StepRenderer } from "./steps/StepRenderer";

interface QueuedStep {
  step: ActivityStep;
  extension: boolean;
}

/**
 * The generic activity engine.
 *
 * Walks a list of typed steps (story, interactive, count, pattern, choice,
 * match, draw, instructions, movement, parent-child, extension-offer,
 * reflection, celebration). Supports all four flow shapes because the
 * shape is just the order of steps in data. Optional extensions splice
 * their own steps in when accepted.
 */
export function ActivityFlow({
  activity,
  band,
  onComplete,
  onExit,
}: {
  activity: ActivityDefinition;
  band: AgeBand;
  onComplete: () => void;
  onExit: () => void;
}) {
  const initial = useMemo<QueuedStep[]>(
    () => activity.steps.filter((s) => !s.bands || s.bands.includes(band)).map((step) => ({ step, extension: false })),
    [activity, band],
  );
  const [queue, setQueue] = useState(initial);
  const [index, setIndex] = useState(0);
  const stepStart = useRef(Date.now());
  const activityStart = useRef(Date.now());
  const usedExtension = useRef(false);
  const finished = useRef(false);

  const props = useMemo(() => activityAnalyticsProps(activity, band), [activity, band]);
  const current = queue[index];

  // Drop-off tracking if the page is closed mid-activity.
  const live = useRef({ index, current });
  live.current = { index, current };
  useEffect(() => {
    const onHide = () => {
      if (finished.current) return;
      const { index: i, current: c } = live.current;
      analytics.track(
        "activity_exited",
        { ...props, step: i, stepId: c?.step.id ?? "", stepType: c?.step.type ?? "", durationSec: secs(activityStart.current), reason: "pagehide" },
        { beacon: true },
      );
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [props]);

  useEffect(() => {
    stepStart.current = Date.now();
    return () => stopSpeaking();
  }, [index]);

  const runtime: ActivityRuntime = {
    activity,
    band,
    inExtension: !!current?.extension,
    answer: (stepId, fits, attempt) => analytics.track("answer_given", { activityId: activity.id, stepId, fits, attempt }),
  };

  const advance = () => {
    const c = queue[index];
    analytics.track("activity_step_completed", {
      ...props,
      step: index,
      stepId: c.step.id,
      stepType: c.step.type,
      isRealWorldExtension: c.extension,
      durationSec: secs(stepStart.current),
    });
    if (index + 1 >= queue.length) {
      finished.current = true;
      analytics.track("activity_completed", { ...props, durationSec: secs(activityStart.current), usedExtension: usedExtension.current });
      onComplete();
      return;
    }
    setIndex(index + 1);
  };

  const acceptExtension = (steps: ActivityStep[]) => {
    const c = queue[index];
    usedExtension.current = true;
    useProgressStore.getState().setExtension(activity.id, "started");
    analytics.track("real_world_extension_started", { ...props, stepId: c.step.id, isRealWorldExtension: true });
    const inserted = steps.filter((s) => !s.bands || s.bands.includes(band)).map((step) => ({ step, extension: true }));
    setQueue((q) => [...q.slice(0, index + 1), ...inserted, ...q.slice(index + 1)]);
    // advance after queue update
    setTimeout(() => setIndex((i) => i + 1), 0);
  };

  const skipExtension = () => {
    const c = queue[index];
    useProgressStore.getState().setExtension(activity.id, "skipped");
    analytics.track("real_world_extension_skipped", { ...props, stepId: c.step.id, isRealWorldExtension: true });
    advance();
  };

  const exit = () => {
    finished.current = true;
    analytics.track("activity_exited", {
      ...props,
      step: index,
      stepId: current?.step.id ?? "",
      stepType: current?.step.type ?? "",
      durationSec: secs(activityStart.current),
      reason: "exit-button",
    });
    onExit();
  };

  return (
    <ActivityContext.Provider value={runtime}>
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${index}-${current?.step.id}`}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 40, rotate: 0.6 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -40, rotate: -0.6 }}
            transition={{ duration: 0.38, ease: [0.3, 0.7, 0.3, 1] }}
          >
            {current && (
              <StepRenderer
                step={current.step}
                band={band}
                onDone={advance}
                onAcceptExtension={acceptExtension}
                onSkipExtension={skipExtension}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* exit + a quiet trail of footprints for progress (no numbers, no pressure) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[var(--z-ui)] flex items-start justify-between p-[var(--gutter)]">
          <button
            type="button"
            aria-label="Stop and go back"
            onClick={exit}
            className="paper pointer-events-auto inline-flex h-[var(--touch-min)] w-[var(--touch-min)] items-center justify-center rounded-full text-ink-soft"
          >
            <X className="h-5 w-5" />
          </button>
          <Trail total={queue.length} at={index} />
        </div>
      </div>
    </ActivityContext.Provider>
  );
}

function Trail({ total, at }: { total: number; at: number }) {
  return (
    <div className="mt-2 flex items-center gap-1.5 opacity-70" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} viewBox="0 0 20 24" className={`h-4 w-3.5 ${i % 2 ? "translate-y-1" : ""}`}>
          <ellipse cx={10} cy={14} rx={6} ry={8} fill={i <= at ? "#b46b56" : "#d9cdb4"} />
        </svg>
      ))}
    </div>
  );
}

function secs(since: number) {
  return Math.round((Date.now() - since) / 1000);
}
