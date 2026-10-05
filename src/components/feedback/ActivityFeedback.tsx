"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, MessageSquareHeart, X } from "lucide-react";
import { MAX_NOTE, MOODS, NOTICED, sendActivityFeedback, type ActivityFeedback as Entry, type MoodId, type NoticedId } from "@/features/feedback/activityFeedback";
import { analytics } from "@/lib/analytics/analytics";

/** Press and hold this long to open (a light grown-up check; taps from little fingers don't open it). */
const HOLD_MS = 1000;

/**
 * Floating "Give feedback" button for grown-ups, shown after an activity.
 * Opens a short form; answers go to the same place as the parent survey
 * (unlinked from usage data).
 */
export function ActivityFeedbackButton({ activityId, activityTitle }: { activityId: string; activityTitle: string }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [hold, setHold] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef(0);

  useEffect(() => () => void (raf.current && cancelAnimationFrame(raf.current)), []);

  const tick = () => {
    const p = Math.min(1, (performance.now() - start.current) / HOLD_MS);
    setHold(p);
    if (p >= 1) {
      raf.current = null;
      setHold(0);
      setOpen(true);
      analytics.track("activity_feedback_opened", { activityId });
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };
  const down = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };
  const up = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    setHold(0);
  };

  return (
    <>
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        disabled={done}
        onPointerDown={done ? undefined : down}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
        onKeyDown={(e) => {
          if (!done && (e.key === "Enter" || e.key === " ")) (e.preventDefault(), setOpen(true));
        }}
        aria-label={done ? "Feedback sent, thank you" : "Give feedback (for grown-ups: press and hold)"}
        className="absolute right-[2.5%] bottom-[4%] z-40 flex touch-none items-center gap-2 overflow-hidden rounded-full bg-cream px-4 py-2.5 text-[1rem] font-bold text-ink shadow-[var(--shadow-paper)] select-none"
      >
        {/* hold progress */}
        <span className="absolute inset-y-0 left-0 bg-sage/60" style={{ width: `${hold * 100}%` }} aria-hidden />
        <span className="relative flex items-center gap-2">
          {done ? <Check className="h-5 w-5 text-moss" /> : <MessageSquareHeart className="h-5 w-5 text-coral" />}
          {done ? "Thanks for the feedback!" : "Give feedback"}
          {!done && <span className="text-[0.8rem] font-normal text-ink-soft">hold</span>}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <FeedbackForm
            activityId={activityId}
            activityTitle={activityTitle}
            onClose={() => setOpen(false)}
            onDone={() => {
              setOpen(false);
              setDone(true);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function FeedbackForm({ activityId, activityTitle, onClose, onDone }: { activityId: string; activityTitle: string; onClose: () => void; onDone: () => void }) {
  const [mood, setMood] = useState<MoodId | null>(null);
  const [noticed, setNoticed] = useState<NoticedId[]>([]);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  const submit = async () => {
    if (!mood) return;
    setSending(true);
    const entry: Entry = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
      activityId,
      activityTitle,
      at: Date.now(),
      mood,
      noticed,
      note: note.trim(),
    };
    if (await sendActivityFeedback(entry)) {
      analytics.track("activity_feedback_submitted", { activityId });
      onDone();
    } else {
      setSending(false);
      setFailed(true);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 z-[150] flex items-center justify-center bg-ink/40 p-[3%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        role="dialog"
        aria-modal="true"
        aria-labelledby="fb-title"
        className="relative flex max-h-full w-[min(44rem,100%)] flex-col gap-4 overflow-y-auto rounded-2xl bg-cream p-6 text-[1rem] text-ink shadow-xl select-text"
        initial={{ y: 24, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 24, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full text-ink-soft">
          <X className="h-5 w-5" />
        </button>
        <div>
          <h2 id="fb-title" className="text-2xl font-bold">How did this activity go?</h2>
          <p className="text-ink-soft">{activityTitle}</p>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-bold">For your child:</legend>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <label
                key={m.id}
                className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-1.5 ${mood === m.id ? "border-moss bg-sage/40" : "border-paper-shade bg-paper"}`}
              >
                <input type="radio" name="mood" value={m.id} checked={mood === m.id} onChange={() => setMood(m.id)} className="sr-only" />
                <span aria-hidden>{m.emoji}</span> {m.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-bold">What did you notice?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {NOTICED.map((n) => {
              const on = noticed.includes(n.id);
              return (
                <label key={n.id} className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-1.5 ${on ? "border-moss bg-sage/30" : "border-paper-shade bg-paper"}`}>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => setNoticed((cur) => (on ? cur.filter((x) => x !== n.id) : [...cur, n.id]))}
                    className="h-5 w-5 accent-[var(--color-moss)]"
                  />
                  {n.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="flex flex-col gap-2">
          <span className="font-bold">Anything else?</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={MAX_NOTE}
            rows={3}
            placeholder="Tell us what you noticed…"
            className="notebook w-full rounded-md border-2 border-paper-shade p-3 text-base"
          />
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={!mood || sending} className="min-h-[48px] rounded-full bg-moss px-6 py-2 font-bold text-paper disabled:opacity-50">
            {sending ? "Sending…" : "Submit feedback"}
          </button>
          {failed ? (
            <span className="text-sm text-brick">Couldn&apos;t send. Please check your connection and try again.</span>
          ) : (
            <span className="text-sm text-ink-soft">Goes to the Milomi team with your survey answers. Not linked to your child&apos;s usage data.</span>
          )}
        </div>
      </motion.form>
    </motion.div>
  );
}
