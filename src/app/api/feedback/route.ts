import { NextResponse } from "next/server";
import { SURVEY, MAX_TEXT } from "@/features/feedback/survey";
import { MAX_NOTE, MOODS, NOTICED } from "@/features/feedback/activityFeedback";
import { FREQUENCIES, HABIT_QUESTIONS } from "@/features/feedback/habits";
import { insertRow, supabaseConfigured } from "@/lib/server/supabase";

/**
 * Receives parent survey responses, and quick per-activity feedback
 * (kind: "activity", sent from an activity's end screen), and the
 * "You & your child" habits self-check (kind: "habits").
 *
 * Where it goes (first match wins):
 *  1. Supabase (SUPABASE_URL + SUPABASE_SECRET_KEY) → a row in public.feedback
 *     (table: supabase/migrations). This is the main store.
 *  2. FEEDBACK_WEBHOOK_URL → POST the response there
 *  3. NEXT_PUBLIC_POSTHOG_KEY → a `feedback_response` event (fallback only, until
 *     Supabase is set up), under a random one-off id not linked to analytics
 *  4. otherwise → server log (development)
 *
 * No IP, user agent or cookies are forwarded.
 */
const ALLOWED = new Map(SURVEY.map((q) => [q.id, q]));
const MOOD_IDS = new Set<string>(MOODS.map((m) => m.id));
const NOTICED_IDS = new Set<string>(NOTICED.map((n) => n.id));
const HABIT_IDS = new Set(HABIT_QUESTIONS.map((q) => q.id));
const FREQUENCY_IDS = new Set<string>(FREQUENCIES.map((f) => f.id));

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { kind, responseId, answers, appVersion, submittedAt, activityId, mood, noticed, note } = (body ?? {}) as Record<string, unknown>;
  const isActivity = kind === "activity";
  const isHabits = kind === "habits";
  if (typeof responseId !== "string") return NextResponse.json({ ok: false }, { status: 400 });

  const clean: Record<string, string> = {};
  if (isActivity) {
    // Per-activity feedback: known ids only; cap the note.
    if (typeof activityId !== "string" || typeof mood !== "string" || !MOOD_IDS.has(mood)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    clean.activity_id = activityId.slice(0, 64);
    clean.mood = mood;
    clean.noticed = (Array.isArray(noticed) ? noticed : []).filter((n): n is string => typeof n === "string" && NOTICED_IDS.has(n)).join(",");
    if (typeof note === "string" && note.trim()) clean.note = note.slice(0, MAX_NOTE).trim();
  } else if (isHabits) {
    // Habits self-check: known questions, Often / Sometimes / Rarely only.
    if (typeof answers !== "object" || answers === null) return NextResponse.json({ ok: false }, { status: 400 });
    for (const [id, value] of Object.entries(answers as Record<string, unknown>)) {
      if (HABIT_IDS.has(id) && typeof value === "string" && FREQUENCY_IDS.has(value)) clean[id] = value;
    }
    if (!Object.keys(clean).length) return NextResponse.json({ ok: false }, { status: 400 });
  } else {
    if (typeof answers !== "object" || answers === null) return NextResponse.json({ ok: false }, { status: 400 });
    // Keep only known questions; validate options; cap free text.
    for (const [id, value] of Object.entries(answers as Record<string, unknown>)) {
      const q = ALLOWED.get(id);
      if (!q || typeof value !== "string") continue;
      if (q.kind === "single" && !q.options.includes(value)) continue;
      clean[id] = value.slice(0, MAX_TEXT).trim();
    }
  }

  const record = {
    kind: isActivity ? "activity" : isHabits ? "habits" : "survey",
    responseId: responseId.slice(0, 64),
    appVersion: typeof appVersion === "string" ? appVersion.slice(0, 32) : "unknown",
    submittedAt: typeof submittedAt === "string" ? submittedAt.slice(0, 40) : new Date().toISOString(),
    answers: clean,
  };

  if (process.env.NODE_ENV !== "production") console.info("[feedback] received", JSON.stringify(record));

  try {
    const hook = process.env.FEEDBACK_WEBHOOK_URL;
    const phKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const phHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
    if (supabaseConfigured) {
      const { activity_id, mood: m, noticed: n, note: text, ...surveyAnswers } = record.answers;
      await insertRow(
        "feedback",
        {
          response_id: record.responseId,
          source: record.kind,
          activity_id: activity_id ?? null,
          mood: m ?? null,
          noticed: isActivity ? (n ? n.split(",") : []) : null,
          note: text ?? null,
          answers: isActivity ? null : surveyAnswers,
          app_version: record.appVersion,
          submitted_at: record.submittedAt,
        },
        "response_id",
      );
    } else if (hook) {
      await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) });
    } else if (phKey) {
      await fetch(`${phHost.replace(/\/$/, "")}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: phKey,
          // one event for all parent feedback; "source" tells survey and after-activity answers apart
          event: "feedback_response",
          distinct_id: `survey-${record.responseId}`,
          properties: { ...record.answers, source: record.kind, app_version: record.appVersion, $process_person_profile: false, $ip: null },
          timestamp: record.submittedAt,
        }),
      });
    }
  } catch (err) {
    console.error("[feedback] forward failed", err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
