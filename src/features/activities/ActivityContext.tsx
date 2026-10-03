"use client";

import { createContext, useContext } from "react";
import type { ActivityDefinition, AgeBand } from "@/types/activity";

/** What every step component can reach without prop-drilling. */
export interface ActivityRuntime {
  activity: ActivityDefinition;
  band: AgeBand;
  /** Is the current step part of an optional real-world extension? */
  inExtension: boolean;
  /** Record an answer for research analytics (no content, just fit/attempt). */
  answer: (stepId: string, fits: boolean, attempt: number) => void;
}

export const ActivityContext = createContext<ActivityRuntime | null>(null);

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be used inside an ActivityFlow");
  return ctx;
}

/** Common props for every step component. */
export interface StepProps<S> {
  step: S;
  band: AgeBand;
  onDone: () => void;
}
