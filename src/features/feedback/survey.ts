/**
 * Parent research survey definition + submission.
 *
 * Survey answers are kept SEPARATE from behavioural analytics: they go to
 * /api/feedback with a fresh random response id that is never linked to
 * the anonymous analytics id. Behavioural analytics only learns that a
 * survey was opened / started / submitted.
 */
export type SurveyQuestion =
  | { id: string; kind: "single"; text: string; options: string[] }
  | { id: string; kind: "text"; text: string; hint?: string; important?: boolean };

export const SURVEY: SurveyQuestion[] = [
  { id: "child_age", kind: "single", text: "How old is the child using Milomi?", options: ["3", "4", "5", "Other"] },
  {
    id: "who_uses",
    kind: "single",
    text: "Who usually uses Milomi?",
    options: ["Child independently", "Mostly child, occasional help", "Parent and child together"],
  },
  {
    id: "enjoyed_most",
    kind: "single",
    text: "Which part did your child enjoy most?",
    options: ["Milo's World", "Stories", "Games", "Making / drawing", "Real-world activities", "Not sure yet"],
  },
  { id: "needed_help", kind: "single", text: "Did your child need help understanding the activity?", options: ["No", "A little", "A lot"] },
  { id: "use_again", kind: "single", text: "Would you use Milomi again with your child?", options: ["Yes", "Maybe", "No"] },
  {
    id: "child_said",
    kind: "text",
    text: "What did your child do or say while using Milomi?",
    hint: "Little moments help us most — a laugh, a question, something they copied.",
    important: true,
  },
  { id: "change", kind: "text", text: "What would you change?" },
];

export type SurveyAnswers = Record<string, string>;

export const MAX_TEXT = 2000;

export async function submitSurvey(answers: SurveyAnswers): Promise<boolean> {
  const responseId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responseId, answers, appVersion: "0.1.0-mvp", submittedAt: new Date().toISOString() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
