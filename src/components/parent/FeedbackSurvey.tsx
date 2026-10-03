"use client";

import { useEffect, useRef, useState } from "react";
import { SURVEY, MAX_TEXT, submitSurvey, type SurveyAnswers } from "@/features/feedback/survey";
import { analytics } from "@/lib/analytics/analytics";

/** Short research survey (7 questions). Free text is the most valuable part. */
export function FeedbackSurvey() {
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const started = useRef(false);

  useEffect(() => {
    analytics.track("survey_opened", {});
  }, []);

  const set = (id: string, v: string) => {
    if (!started.current) {
      started.current = true;
      analytics.track("survey_started", {});
    }
    setAnswers((a) => ({ ...a, [id]: v }));
  };

  const answered = Object.values(answers).filter((v) => v.trim()).length;

  const submit = async () => {
    setState("sending");
    const ok = await submitSurvey(answers);
    if (ok) {
      analytics.track("survey_submitted", { answered });
      setState("sent");
    } else setState("error");
  };

  if (state === "sent") {
    return (
      <div className="rounded-lg bg-sage/30 p-6">
        <h3 className="text-xl font-bold">Thank you!</h3>
        <p className="mt-1 text-ink-soft">This genuinely shapes what Milo does next.</p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <p className="text-ink-soft">7 quick questions. Answers are stored separately from usage data and are never linked to your child.</p>
      {SURVEY.map((q, n) => (
        <fieldset key={q.id} className="flex flex-col gap-2">
          <legend className="mb-1 font-bold text-ink">
            {n + 1}. {q.text}
          </legend>
          {q.kind === "single" ? (
            <div className="flex flex-wrap gap-2">
              {q.options.map((o) => {
                const on = answers[q.id] === o;
                return (
                  <label
                    key={o}
                    className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-full border-2 px-4 py-1.5 ${on ? "border-moss bg-sage/40" : "border-paper-shade bg-paper"}`}
                  >
                    <input type="radio" name={q.id} value={o} checked={on} onChange={() => set(q.id, o)} className="sr-only" />
                    {o}
                  </label>
                );
              })}
            </div>
          ) : (
            <>
              {q.hint && <span className="text-sm text-ink-soft">{q.hint}</span>}
              <textarea
                value={answers[q.id] ?? ""}
                onChange={(e) => set(q.id, e.target.value)}
                maxLength={MAX_TEXT}
                rows={q.important ? 4 : 3}
                className="notebook w-full rounded-md border-2 border-paper-shade p-3 text-base select-text"
                placeholder="Type here…"
              />
            </>
          )}
        </fieldset>
      ))}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={answered === 0 || state === "sending"}
          className="min-h-[48px] rounded-full bg-moss px-6 py-2 font-bold text-paper disabled:opacity-50"
        >
          {state === "sending" ? "Sending…" : "Send feedback"}
        </button>
        {state === "error" && <span className="text-brick">Couldn&apos;t send — please check your connection and try again.</span>}
      </div>
    </form>
  );
}
