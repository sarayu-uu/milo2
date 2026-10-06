"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { Expression } from "@/types/character";
import { FREQUENCIES, HABIT_QUESTIONS, needsNudge, submitHabits, type FrequencyId, type HabitAnswers } from "@/features/feedback/habits";
import { analytics } from "@/lib/analytics/analytics";
import { MiloQuip } from "./MiloQuip";
import { CommunityStrip } from "@/components/community/Community";

/** What a child picks up from what they see us do. */
const WATCHING = [
  { emoji: "📱", you: "You scroll when you're bored", verb: "They learn", lesson: "“Boredom means I need a screen.”" },
  { emoji: "🍽️", you: "You use your phone during meals", verb: "They learn", lesson: "“Eating and scrolling go together.”" },
  { emoji: "💬", you: "You check your phone while they're talking", verb: "They learn", lesson: "“Phones can be more important than conversations.”" },
  { emoji: "😶", you: "You hand them a phone whenever they're upset", verb: "They may learn", lesson: "“A screen is how I calm down.”" },
  { emoji: "📲", you: "You constantly check notifications", verb: "They see", lesson: "“Phones deserve our attention all the time.”" },
  { emoji: "📖", you: "You put your phone away and read or play with them", verb: "They learn", lesson: "“Being together is fun.”", good: true },
];

/** What 20 minutes could also have been. */
const INSTEAD = [
  { emoji: "🗣️", title: "Talking", text: "Building vocabulary and communication" },
  { emoji: "🧩", title: "Solving", text: "Practising reasoning and problem-solving" },
  { emoji: "🏃", title: "Moving", text: "Building coordination and physical skills" },
  { emoji: "🎨", title: "Creating", text: "Using imagination and self-expression" },
  { emoji: "🤝", title: "Playing together", text: "Building social skills and connection" },
  { emoji: "📖", title: "Reading a story", text: "Developing listening and early literacy" },
  { emoji: "🔢", title: "Counting & sorting", text: "Developing early mathematical thinking" },
];

const MOMENTS = ["🍳 Cooking together", "🚗 Travelling", "🛒 Shopping", "🧸 Playing", "📖 Reading", "🧹 Cleaning up", "🌳 Going outside", "🍽️ Eating together"];

const EXAMPLES = [
  { ask: "Can you find three red things?", skills: "Colour recognition + counting + observation" },
  { ask: "What do you think happens next?", skills: "Reasoning + prediction + language" },
  { ask: "How would you solve this?", skills: "Problem-solving + communication" },
  { ask: "Tell me what happened in the story.", skills: "Memory + sequencing + language" },
];

/** Milo, peeking at the habits check. A little cheeky, never cruel. Keyed by question, then answer. */
const PEEK: Record<string, Record<FrequencyId, string>> = {
  phone_while_talking: {
    often: "I once told a whole story to the top of someone's head.",
    sometimes: "Phones ARE very shiny. I get it.",
    rarely: "Ooh. Eye contact. Fancy.",
  },
  phone_at_meals: {
    often: "The phone gets a seat at dinner? Does it eat crumbs too?",
    sometimes: "Half chewing, half scrolling. Tricky.",
    rarely: "Proper mealtimes! Pass the seeds.",
  },
  screen_to_keep_quiet: {
    often: "Hmm. I also go quiet when someone hands me a shiny thing.",
    sometimes: "Everyone needs five quiet minutes. Even pigeons.",
    rarely: "How is it SO quiet in your house?",
  },
  phone_when_bored: {
    often: "When I'm bored I stare at a wall. Highly recommended.",
    sometimes: "Queues are SO boring. Fair.",
    rarely: "You just… wait? Like a statue? Impressive.",
  },
  phone_while_limiting_theirs: {
    often: "“Screens off!” *keeps scrolling*. I saw that.",
    sometimes: "Ah, the classic. I won't tell.",
    rarely: "Same rules for everyone. Very fair. Very pigeon.",
  },
  seen_without_screen: {
    often: "Reading where they can see? Sneaky teaching. I like it.",
    sometimes: "More of that, please. They're watching.",
    rarely: "Let them catch you drawing. Even badly. ESPECIALLY badly.",
  },
  phones_away_moments: {
    often: "Phone-free moments! My favourite kind.",
    sometimes: "Even five minutes counts. I counted.",
    rarely: "Start tiny. Bath time. Phones hate water anyway.",
  },
};

/** How Milo looks at an answer: a raised eyebrow for the struggles, proud for the good stuff. */
function peekFace(positive: boolean | undefined, a: FrequencyId): { expression: Expression; action: "headTilt" | "investigate" | "bellyPuff" } {
  const good = positive ? a === "often" : a === "rarely";
  const hard = positive ? a === "rarely" : a === "often";
  if (good) return { expression: "proud", action: "bellyPuff" };
  if (hard) return { expression: "suspicious", action: "investigate" };
  return { expression: "thinking", action: "headTilt" };
}

const LOOP = ["Discover", "Play together", "Observe", "Give feedback", "Understand", "Try the next activity"];

/** Each section fades up as it scrolls into view. */
function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

/** One large line that carries a section. */
function Big({ children }: { children: ReactNode }) {
  return <p className="font-display text-[clamp(1.6rem,3.2vw,2.4rem)] leading-tight">{children}</p>;
}

/**
 * Parents → You & your child: a guided, non-judgemental look at how everyday
 * screen habits around a child shape their 3–5 years, ending with Milomi.
 * Question → reflection → realisation → your role → Milomi. (Development areas,
 * why 3–5 and NCF-FS live on Why Milomi, so they aren't repeated here.)
 */
export function ParentAwareness({ onWhy, onPlay }: { onWhy: () => void; onPlay: () => void }) {
  const checkRef = useRef<HTMLElement>(null);

  return (
    <article className="flex flex-col gap-16 pb-10 leading-relaxed text-ink">
      {/* 1. the uncomfortable question */}
      <Reveal className="rounded-2xl bg-cream p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-[16rem] flex-1">
            <p className="text-ink-soft">Before we look at your child&apos;s screen time…</p>
            <h2 className="font-display mt-1 text-[clamp(2.2rem,4.5vw,3.4rem)] leading-tight">Let&apos;s look at ours.</h2>
          </div>
          <MiloQuip line="Don't look at me. I don't even have thumbs." expression="suspicious" action="lookLeft" className="shrink-0" />
        </div>
        <p className="mt-5 text-lg">
          Children don&apos;t just learn from what we tell them. <b>They learn from what they see us do.</b>
        </p>
        <p className="mt-3 text-ink-soft">
          A child who often sees a parent scrolling may start to see the phone as the default thing to reach for: for fun, for comfort, or whenever they&apos;re bored.
        </p>
        <p className="mt-3">
          This isn&apos;t about blaming parents. It&apos;s about noticing the little world we create around our children.
        </p>
        <button
          type="button"
          onClick={() => checkRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-moss px-6 py-2 font-bold text-paper"
        >
          Take a look at your habits <ArrowRight className="h-5 w-5" />
        </button>
      </Reveal>

      {/* 2. your child is watching you */}
      <Reveal>
        <Big>Your child is watching you.</Big>
        <p className="mt-2 text-ink-soft">They copy more than we realise.</p>
        <div className="relative mt-20 grid gap-3 sm:grid-cols-2">
          <MiloQuip peek line="I copy everything. Yesterday I copied a kettle." expression="proud" className="absolute right-4 bottom-full" />
          {WATCHING.map((w) => (
            <div key={w.you} className={`rounded-xl border-2 p-4 ${w.good ? "border-moss bg-sage/30" : "border-paper-shade bg-cream"}`}>
              <p className="font-bold">
                <span aria-hidden className="mr-2 text-xl">
                  {w.emoji}
                </span>
                {w.you}
              </p>
              <p className="mt-2 text-sm text-ink-soft">{w.verb}:</p>
              <p className="font-hand text-xl">{w.lesson}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-xl bg-mustard/30 px-5 py-4 text-xl font-bold">Children don&apos;t need perfect parents. They need consistent examples.</p>
      </Reveal>

      {/* before the self-check: a small invite to the parents' community */}
      <Reveal>
        <CommunityStrip />
      </Reveal>

      {/* 3. the self-check */}
      <section ref={checkRef} className="scroll-mt-6">
        <HabitsCheck />
      </section>

      {/* 4. what is screen time replacing? */}
      <Reveal>
        <Big>It&apos;s not only about how much screen time.</Big>
        <p className="mt-2 text-lg">It&apos;s also about what happens instead.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <div className="flex flex-col items-center gap-1 text-center">
          <span className="rounded-full bg-ink/80 px-5 py-2 font-bold text-paper">📺 20 minutes of watching</span>
          <ArrowDown className="mt-2 h-6 w-6 text-ink-soft" aria-hidden />
          <span className="font-hand text-xl text-ink-soft">could have been</span>
          <ArrowDown className="mb-2 h-6 w-6 text-ink-soft" aria-hidden />
          </div>
          <MiloQuip line="I'd pick Moving. Mostly waddling." expression="happy" action="headTilt" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INSTEAD.map((i) => (
            <div key={i.title} className="rounded-xl border-2 border-paper-shade bg-cream p-4">
              <p className="text-lg font-bold">
                <span aria-hidden className="mr-2">
                  {i.emoji}
                </span>
                {i.title}
              </p>
              <p className="mt-1 text-ink-soft">{i.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-ink-soft">The question isn&apos;t “Are screens bad?”</p>
        <p className="mt-1 text-xl font-bold">The better question is: “Is my child getting enough chances to do everything else?”</p>
      </Reveal>

      {/* 5. the parent, back in the picture */}
      <Reveal className="rounded-2xl bg-cream p-6 sm:p-8">
        <p className="text-ink-soft">And here&apos;s the part that matters most.</p>
        <Big>You are already your child&apos;s first teacher.</Big>
        <p className="mt-3">You don&apos;t need to sit down and “teach” your 4-year-old for an hour. Skills grow while you&apos;re:</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MOMENTS.map((m) => (
            <span key={m} className="rounded-full border-2 border-paper-shade bg-paper px-3 py-1">
              {m}
            </span>
          ))}
        </div>
        <div className="relative mt-20 grid gap-3 sm:grid-cols-2">
          <MiloQuip peek line="Three red things? I found one. Then I sat on it." expression="confused" className="absolute right-4 bottom-full" />
          {EXAMPLES.map((e) => (
            <div key={e.ask} className="rounded-xl bg-paper p-4 shadow-[var(--shadow-paper)]">
              <p className="font-hand text-xl">“{e.ask}”</p>
              <p className="mt-1 text-sm text-ink-soft">can become</p>
              <p className="font-bold text-moss">{e.skills}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xl font-bold">Everyday moments can become developmental moments.</p>
      </Reveal>

      {/* 6. where Milomi fits (the full story is on Why Milomi) */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-[16rem] flex-1">
            <Big>That&apos;s where Milomi comes in.</Big>
            <p className="mt-3 text-lg">
              Milomi isn&apos;t here to replace you. <b>It&apos;s here to help you play, understand and grow together.</b>
            </p>
          </div>
          <MiloQuip line="Finally. The part about me." expression="proud" action="bellyPuff" className="shrink-0" />
        </div>
        <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2">
          {LOOP.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              {i > 0 && <ArrowRight className="h-4 w-4 text-moss" aria-hidden />}
              <span className="rounded-full border-2 border-paper-shade bg-cream px-3 py-1 font-bold">{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-ink-soft">
          <b className="text-ink">Parents know their child better than an algorithm does.</b> After each activity, press and hold <b>Make Milo Better With Us 🌱</b> to
          tell us what you noticed. It helps us shape what Milo suggests next.
        </p>
      </Reveal>

      {/* 7. the payoff */}
      <Reveal className="text-center">
        <p className="text-lg">Your child doesn&apos;t need another entertainer.</p>
        <p className="mt-1 text-lg">They need chances to talk, think, move, create and connect.</p>
        <p className="mt-1 text-lg">And sometimes, they simply need you to put the phone down and play.</p>
        <MiloQuip line="Phones down. Wings up!" expression="happy" action="wingsUp" className="mt-8 justify-center" />
        <p className="font-display mt-4 text-[clamp(1.8rem,3.6vw,2.8rem)] leading-tight">
          You don&apos;t need to be a perfect parent.
          <br />
          Just a present one.
        </p>
        <p className="mx-auto mt-8 max-w-xl text-ink-soft">
          Milomi gives you the activities, ideas and understanding. You bring the most important part: you.
        </p>
        <p className="mt-4 font-bold">Less passive watching. More doing. More talking. More playing. More growing together.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button type="button" onClick={onPlay} className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-moss px-7 py-2 text-lg font-bold text-paper">
            Start playing with your child <ArrowRight className="h-5 w-5" />
          </button>
          <button type="button" onClick={onWhy} className="min-h-[48px] px-3 text-ink-soft underline underline-offset-4">
            Read why we built Milomi
          </button>
        </div>
      </Reveal>
    </article>
  );
}

/** Section 3: seven cards, Often / Sometimes / Rarely. A reflection, never a score. */
function HabitsCheck() {
  const [answers, setAnswers] = useState<HabitAnswers>({});
  const [state, setState] = useState<"asking" | "sending" | "done">("asking");
  const [saved, setSaved] = useState(true);
  const [last, setLast] = useState<string | null>(null);
  const answered = Object.keys(answers).length;
  const complete = answered === HABIT_QUESTIONS.length;

  const finish = async () => {
    setState("sending");
    const ok = await submitHabits(answers);
    if (ok) analytics.track("habits_check_submitted", {});
    setSaved(ok);
    setState("done");
  };

  if (state === "done") {
    const nudges = HABIT_QUESTIONS.filter((q) => needsNudge(q, answers[q.id])).slice(0, 3);
    return (
      <motion.div className="rounded-2xl bg-sage/30 p-6 sm:p-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-[16rem] flex-1">
            <Big>This isn&apos;t a score. It&apos;s a reflection.</Big>
            <p className="mt-3 text-lg">There&apos;s no “bad parent” result here. Just noticing is already a big step.</p>
          </div>
          <MiloQuip line="I wasn't judging. Much." expression="happy" action="clap" className="shrink-0" />
        </div>
        {nudges.length > 0 ? (
          <>
            <p className="mt-5 font-bold">A few small things you could try this week:</p>
            <ul className="mt-2 flex flex-col gap-2">
              {nudges.map((q) => (
                <li key={q.id} className="rounded-xl bg-paper p-4">
                  {q.tip}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-5 rounded-xl bg-paper p-4">It sounds like your child already sees a lot of screen-free time with you. Keep those moments going.</p>
        )}
        <p className="mt-5 rounded-xl bg-mustard/30 px-5 py-4 font-bold">
          The goal isn&apos;t zero screen time. It&apos;s creating more chances for your child to talk, play, move, explore and connect.
        </p>
        {!saved && <p className="mt-3 text-sm text-brick">We couldn&apos;t send your answers to the Milomi team this time, but your reflection above is still yours.</p>}
      </motion.div>
    );
  }

  return (
    <div>
      <Big>How are your screen habits around your child?</Big>
      <p className="mt-2 text-ink-soft">Seven quick cards. Pick whatever feels most true. Nobody is judging.</p>
      <div className="mt-5 flex flex-col gap-3">
        {HABIT_QUESTIONS.map((q, n) => {
          const a = answers[q.id];
          // Milo peeks at the card just answered (and at the first one, before anything is answered)
          const peeking = last ? last === q.id && a : n === 0;
          const line = a ? PEEK[q.id][a] : "I'm not peeking. (I'm peeking.)";
          const face = a ? peekFace(q.positive, a) : { expression: "suspicious" as Expression, action: "investigate" as const };
          return (
          <fieldset key={q.id} className={`relative overflow-hidden rounded-xl border-2 p-4 lg:pr-[21rem] ${a ? "border-sage bg-sage/15" : "border-paper-shade bg-cream"}`}>
            {peeking && (
              // wide screens: beside the question; smaller ones: below the answers (see the end of the card)
              <motion.div className="absolute right-3 bottom-0 hidden lg:block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
                <MiloQuip peek compact line={line} expression={face.expression} action={face.action} />
              </motion.div>
            )}
            <legend className="sr-only">{q.text}</legend>
            <p className="font-bold" aria-hidden>
              <span className="mr-2 text-ink-soft">{n + 1}.</span>
              {q.text}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FREQUENCIES.map((f) => {
                const on = answers[q.id] === f.id;
                return (
                  <label
                    key={f.id}
                    // relative: keeps the hidden radio inside this scroll area, so focusing it can't scroll the whole app away
                    className={`relative inline-flex min-h-[44px] min-w-[7rem] cursor-pointer items-center justify-center rounded-full border-2 px-4 py-1.5 font-bold ${on ? "border-moss bg-moss text-paper" : "border-paper-shade bg-paper text-ink"}`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={f.id}
                      checked={on}
                      onChange={() => {
                        setAnswers((cur) => ({ ...cur, [q.id]: f.id as FrequencyId }));
                        setLast(q.id);
                      }}
                      className="sr-only"
                    />
                    {f.label}
                  </label>
                );
              })}
            </div>
            {/* smaller screens: no room for Milo in the card, so his comment is a note instead */}
            {peeking && (
              <motion.div className="-mb-4 flex justify-end pt-2 lg:hidden" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
                <MiloQuip peek compact line={line} expression={face.expression} action={face.action} />
              </motion.div>
            )}
          </fieldset>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="button" disabled={!complete || state === "sending"} onClick={() => void finish()} className="min-h-[48px] rounded-full bg-moss px-6 py-2 font-bold text-paper disabled:opacity-50">
          {state === "sending" ? "One moment…" : complete ? "See my reflection" : `${answered} of ${HABIT_QUESTIONS.length} answered`}
        </button>
        <span className="text-sm text-ink-soft">Your answers go to the Milomi team anonymously to help us decide what to build. Not linked to your child&apos;s usage data.</span>
      </div>
    </div>
  );
}
