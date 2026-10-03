import type { ActivityMeta, ParentParticipation } from "@/types/activity";

/** Parent-facing commitment labels shown on cards and intros. */
export const PARTICIPATION_LABEL: Record<ParentParticipation, string> = {
  none: "Mostly independent",
  nearby: "Parent nearby",
  optional: "Parent + Child (optional)",
  required: "Parent + Child",
};

export function materialsLabel(a: Pick<ActivityMeta, "materials" | "materialsShort">) {
  if (!a.materials.length) return "No materials";
  return a.materialsShort ?? a.materials[0];
}

export function activityAnalyticsProps(a: ActivityMeta, band: string) {
  return {
    activityId: a.id,
    activityType: a.activityType,
    flow: a.flow,
    parentParticipation: a.parentParticipation,
    band,
  };
}
