/**
 * Quick per-activity feedback from a grown-up, given on the activity's end
 * screen. Sent with the parent survey answers (/api/feedback, the same
 * feedback_response event) under a fresh random id, never linked to usage analytics.
 */
export const MOODS = [
  { id: "loved", emoji: "😊", label: "Loved it" },
  { id: "enjoyed", emoji: "🙂", label: "Enjoyed it" },
  { id: "okay", emoji: "😐", label: "Was okay" },
  { id: "lost_interest", emoji: "😕", label: "Lost interest" },
  { id: "difficult", emoji: "😣", label: "Found it difficult" },
] as const;

export const NOTICED = [
  { id: "independent", label: "Did it independently" },
  { id: "little_help", label: "Needed a little help" },
  { id: "lot_of_help", label: "Needed a lot of help" },
  { id: "didnt_understand", label: "Didn't understand the activity" },
  { id: "already_knew", label: "Already knew this" },
  { id: "unexpected", label: "Tried something unexpected" },
] as const;

export type MoodId = (typeof MOODS)[number]["id"];
export type NoticedId = (typeof NOTICED)[number]["id"];

export const MAX_NOTE = 1000;

export interface ActivityFeedback {
  id: string;
  activityId: string;
  activityTitle: string;
  at: number;
  mood: MoodId;
  noticed: NoticedId[];
  note: string;
}

export async function sendActivityFeedback(f: ActivityFeedback): Promise<boolean> {
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "activity",
        responseId: f.id,
        appVersion: "0.1.0-mvp",
        submittedAt: new Date(f.at).toISOString(),
        activityId: f.activityId,
        mood: f.mood,
        noticed: f.noticed,
        note: f.note,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
