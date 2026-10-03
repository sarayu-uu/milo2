import type { AgeBand, AgeVariant, BroadAge } from "@/types/activity";

/**
 * Internal difficulty band from broad age + demonstrated play.
 * Never shown to children. A 4 year old who has finished a few
 * activities gets the slightly stretchier versions.
 */
export function resolveBand(age: BroadAge | null, completedCount: number): AgeBand {
  if (age === 5) return "older";
  if (age === 4 && completedCount >= 3) return "older";
  return "younger";
}

function isVariant<T>(v: AgeVariant<T>): v is { younger: T; older: T } {
  return typeof v === "object" && v !== null && !Array.isArray(v) && "younger" in v && "older" in v;
}

export function pick<T>(value: AgeVariant<T>, band: AgeBand): T {
  return isVariant(value) ? value[band] : value;
}
