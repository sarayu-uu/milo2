/**
 * "You & your child" self-check: how screens show up around the child.
 *
 * Not a score. Answers go to /api/feedback (source "habits") under a fresh
 * random id, never linked to usage analytics, so the team can see which
 * everyday moments parents most want help with.
 */
export const FREQUENCIES = [
  { id: "often", label: "Often" },
  { id: "sometimes", label: "Sometimes" },
  { id: "rarely", label: "Rarely" },
] as const;

export type FrequencyId = (typeof FREQUENCIES)[number]["id"];

export interface HabitQuestion {
  id: string;
  text: string;
  /** A habit we'd like more of: "rarely" is the answer worth a gentle nudge. */
  positive?: boolean;
  /** Shown to the parent when this one came up. One small, doable idea. */
  tip: string;
  /** Admin only: which part of Milomi could help with this moment. */
  buildHint: string;
}

export const HABIT_QUESTIONS: HabitQuestion[] = [
  {
    id: "phone_while_talking",
    text: "I check my phone while my child is talking to me.",
    tip: "When they start talking, try putting the phone face down until they finish. They notice.",
    buildHint: "Conversation prompts, story retelling, 'tell me about…' activities",
  },
  {
    id: "phone_at_meals",
    text: "I use my phone during meals with my child.",
    tip: "Try one phone-free meal this week. Ask: “What was the best bit of your day?”",
    buildHint: "Mealtime games: counting, colours, 'I spy' at the table",
  },
  {
    id: "screen_to_keep_quiet",
    text: "I give my child a screen when I need them to stay quiet.",
    tip: "Keep a small ‘busy box’ ready (crayons, a puzzle, a few blocks) for the moments you need quiet.",
    buildHint: "Offline solo activities a child can do while a parent is busy",
  },
  {
    id: "phone_when_bored",
    text: "I reach for my phone when I'm bored or waiting.",
    tip: "Next time you're waiting together, try ‘Can you find three red things?’ instead.",
    buildHint: "Waiting games: travel, queues, waiting rooms",
  },
  {
    id: "phone_while_limiting_theirs",
    text: "I use my phone while asking my child to stop using theirs.",
    tip: "Try putting both phones away at the same time, together. It turns a rule into a team thing.",
    buildHint: "Shared 'screens away' routines and wind-down moments",
  },
  {
    id: "seen_without_screen",
    text: "My child sees me reading, playing or doing activities without a screen.",
    positive: true,
    tip: "Let them catch you reading, drawing or cooking, and invite them to join in.",
    buildHint: "Do-it-together activities that model the parent playing too",
  },
  {
    id: "phones_away_moments",
    text: "We have moments during the day where phones are completely away.",
    positive: true,
    tip: "Pick one small daily moment (bath time, bedtime story, a walk) and make it phone-free.",
    buildHint: "Daily rituals: bedtime, bath, walks",
  },
];

export type HabitAnswers = Record<string, FrequencyId>;

/** Did this answer come up as something worth a gentle nudge? */
export const needsNudge = (q: HabitQuestion, a: FrequencyId | undefined) => (q.positive ? a === "rarely" : a === "often");

export async function submitHabits(answers: HabitAnswers): Promise<boolean> {
  const responseId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "habits", responseId, answers, appVersion: "0.1.0-mvp", submittedAt: new Date().toISOString() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
