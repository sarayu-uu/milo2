"use client";

import { useSettingsStore } from "@/stores/settingsStore";
import { useProgressStore } from "@/stores/progressStore";
import { resolveBand } from "@/features/curriculum/age";

/** The child's internal difficulty band (never displayed). */
export function useBand() {
  const age = useSettingsStore((s) => s.age);
  const completedCount = useProgressStore((s) => Object.keys(s.completed).length);
  return resolveBand(age, completedCount);
}
