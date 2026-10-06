import type { AgeBand, AgeVariant, BroadAge } from "@/types/activity";

/**
 * Internal difficulty band from broad age + demonstrated play.
 * Never shown to children. A 4 year old who has finished a few
 * activities gets the slightly stretchier versions.
 */
export function resolveBand(age: BroadAge | null, completedCount: number): AgeBand {
  if (age !== null && age >= 5) return "older";
  if (age === 4 && completedCount >= 3) return "older";
  return "younger";
}

/** The ages a grown-up can pick. 6 means "6 or older". */
export const AGES: BroadAge[] = [3, 4, 5, 6];

/**
 * Which games a child sees: everything up to their age. A 3 year old gets the
 * 3+ games, a 4 year old the 3+ and 4+ games, and so on; 6 sees everything.
 * No age given (the grown-up skipped) → everything.
 */
export function isForAge(activity: { ageMin: number }, age: BroadAge | null): boolean {
  return age === null || activity.ageMin <= age;
}

function isVariant<T>(v: AgeVariant<T>): v is { younger: T; older: T } {
  return typeof v === "object" && v !== null && !Array.isArray(v) && "younger" in v && "older" in v;
}

export function pick<T>(value: AgeVariant<T>, band: AgeBand): T {
  return isVariant(value) ? value[band] : value;
}
