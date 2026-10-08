/**
 * The complete, typed list of product-research events.
 * Components call `analytics.track("event_name", props)` and TypeScript
 * makes sure the properties match. No PII ever goes in here:
 * no names, voices, photos, drawings, free text or precise location.
 */
export interface ActivityProps {
  activityId: string;
  activityType: string;
  flow: string;
  parentParticipation: string;
  /** Internal band at the time (younger/older), never shown to kids. */
  band: string;
}

export interface AnalyticsEvents {
  app_opened: { returning: boolean; daysVisited: number };
  session_ended: { durationSec: number; screens: number };
  orientation_blocked: Record<string, never>;

  home_viewed: Record<string, never>;
  home_mystery_found: { item: string; secondsToFind: number };
  world_opened: { roomsAvailable: number; growth: number };
  room_opened: { roomId: string; visitCount: number; firstVisit: boolean };
  room_teaser_tapped: { roomId: string };
  room_revealed: { roomId: string };
  world_object_tapped: { roomId: string; objectId: string; isNew: boolean };
  world_change_noticed: { roomId: string; objectId: string };

  core_learning_opened: Record<string, never>;
  theme_viewed: { themeId: string; position: number };
  theme_expanded: { themeId: string; position: number };
  theme_collapsed: { themeId: string };

  activity_viewed: ActivityProps & { source: string };
  activity_started: ActivityProps & { source: string };
  activity_step_completed: ActivityProps & {
    step: number;
    stepId: string;
    stepType: string;
    isRealWorldExtension: boolean;
    durationSec: number;
  };
  activity_exited: ActivityProps & { step: number; stepId: string; stepType: string; durationSec: number; reason: string };
  activity_completed: ActivityProps & { durationSec: number; usedExtension: boolean };
  activity_end_choice: { activityId: string; choice: "activities" | "world" | "again" | "age-3" | "age-4" | "age-5" };

  real_world_extension_offered: ActivityProps & { stepId: string; isRealWorldExtension: true };
  real_world_extension_started: ActivityProps & { stepId: string; isRealWorldExtension: true };
  real_world_extension_skipped: ActivityProps & { stepId: string; isRealWorldExtension: true };

  answer_given: { activityId: string; stepId: string; fits: boolean; attempt: number };
  celebration_triggered: { activityId: string | null; celebration: string };
  high_five_completed: { activityId: string | null; reactionMs: number };

  parent_gate_opened: Record<string, never>;
  parent_gate_passed: Record<string, never>;
  parent_gate_cancelled: Record<string, never>;
  setting_changed: { setting: string; value: string };

  survey_opened: Record<string, never>;
  survey_started: Record<string, never>;
  survey_submitted: { answered: number };

  // per-activity feedback (answers themselves go to /api/feedback, unlinked)
  activity_feedback_opened: { activityId: string };
  characters_opened: Record<string, never>;
  character_tapped: { characterId: string };
  activity_feedback_submitted: { activityId: string };

  // "You & your child" habits self-check (answers go to /api/feedback, unlinked)
  habits_check_submitted: Record<string, never>;

  // Little Years community (WhatsApp group)
  community_bubble_opened: Record<string, never>;
  community_invite_viewed: { from: "bubble" | "awareness" };
  community_join_clicked: { from: "bubble" | "awareness" };
}

export type AnalyticsEventName = keyof AnalyticsEvents;
