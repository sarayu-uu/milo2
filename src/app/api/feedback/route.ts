import { NextResponse } from "next/server";
import { SURVEY, MAX_TEXT } from "@/features/feedback/survey";

/**
 * Receives parent survey responses.
 *
 * Routing (first match wins):
 *  1. FEEDBACK_WEBHOOK_URL  → POST the response there (Sheets, Supabase, Zapier…)
 *  2. NEXT_PUBLIC_POSTHOG_KEY → a `feedback_response` event under a random,
 *     one-off distinct id (deliberately NOT linked to behavioural analytics)
 *  3. otherwise → server log (development)
 *
 * No IP, user agent or cookies are forwarded.
 */
const ALLOWED = new Map(SURVEY.map((q) => [q.id, q]));

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { responseId, answers, appVersion, submittedAt } = (body ?? {}) as Record<string, unknown>;
  if (typeof responseId !== "string" || typeof answers !== "object" || answers === null) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Keep only known questions; validate options; cap free text.
  const clean: Record<string, string> = {};
  for (const [id, value] of Object.entries(answers as Record<string, unknown>)) {
    const q = ALLOWED.get(id);
    if (!q || typeof value !== "string") continue;
    if (q.kind === "single" && !q.options.includes(value)) continue;
    clean[id] = value.slice(0, MAX_TEXT).trim();
  }

  const record = {
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
    if (hook) {
      await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) });
    } else if (phKey) {
      await fetch(`${phHost.replace(/\/$/, "")}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: phKey,
          event: "feedback_response",
          distinct_id: `survey-${record.responseId}`,
          properties: { ...record.answers, app_version: record.appVersion, $process_person_profile: false, $ip: null },
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
