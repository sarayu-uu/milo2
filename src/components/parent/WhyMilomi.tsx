"use client";

import type { ReactNode } from "react";
import { Brain, Calculator, Handshake, Heart, MessageCircle, Palette, PersonStanding, Shirt } from "lucide-react";
import type { Domain } from "@/types/activity";
import { listActivities } from "@/data/activities";
import { MiloQuip } from "./MiloQuip";

/** The eight areas of development, and which Milomi activities practise each. */
const AREAS: { icon: ReactNode; title: string; text: string; domains: Domain[] }[] = [
  { icon: <MessageCircle />, title: "Communicate", text: "Express thoughts, ask questions and understand instructions.", domains: ["communication", "stories"] },
  { icon: <Brain />, title: "Think & solve problems", text: "Remember, reason, match, sort, sequence and figure things out.", domains: ["reasoning", "memory", "classification", "sequencing", "problem-solving", "observation"] },
  { icon: <Heart />, title: "Understand emotions", text: "Recognise feelings, express them and gradually learn to manage them.", domains: ["social-emotional"] },
  { icon: <Handshake />, title: "Build relationships", text: "Share, take turns, cooperate and communicate with others.", domains: ["social-emotional"] },
  { icon: <PersonStanding />, title: "Develop physically", text: "Build coordination, balance, strength and fine-motor control.", domains: ["gross-motor", "fine-motor", "movement"] },
  { icon: <Shirt />, title: "Become independent", text: "Follow routines, take responsibility and manage simple self-care.", domains: ["independence"] },
  { icon: <Palette />, title: "Create & imagine", text: "Draw, sing, pretend, tell stories and express ideas.", domains: ["creativity", "stories"] },
  { icon: <Calculator />, title: "Early maths & literacy", text: "Counting, quantity, sounds, letters, patterns and early reading.", domains: ["numbers", "quantity", "early-mathematics", "patterns", "shapes", "phonological-awareness", "early-literacy"] },
];

/** Developmental skills turned into things you can actually do. */
const TRY_THIS = [
  {
    title: "Hide 3 objects",
    doThis: "Hide three small things around the room and ask your child to remember where they are.",
    practising: "Memory, observation and problem-solving",
    together: "Ask questions, give hints and celebrate every attempt.",
  },
  {
    title: "Shadow play (Shadow Mystery)",
    doThis: "Shine a torch at a wall and make shadows with your hands, a toy, or your whole body.",
    practising: "Observation and cause and effect",
    together: "Ask “What changed when you moved closer?” rather than explaining.",
  },
  {
    title: "Sock pairs (Lonely Socks)",
    doThis: "Mix up a few pairs of socks and ask your child to find the ones that match.",
    practising: "Matching, sorting and memory, plus a real everyday job",
    together: "Ask “How do you know they match?” and let them check your pairs too.",
  },
];

/** Parents → Why Milomi: why play-based development matters at 3–5, and how Milomi helps. */
export function WhyMilomi() {
  const activities = listActivities();
  const practisedBy = (domains: Domain[]) => activities.filter((a) => a.domains.some((d) => domains.includes(d))).map((a) => a.title);

  return (
    <article className="flex flex-col gap-10 leading-relaxed text-ink">
      {/* 1. the opening */}
      <section className="relative mt-20 rounded-2xl bg-cream p-6">
        <MiloQuip peek line="Watching than doing? I watch clouds. Professionally." expression="suspicious" action="lookLeft" className="absolute right-6 bottom-full" />
        <h2 className="text-3xl font-bold">Is your child spending more time watching than doing?</h2>
        <p className="mt-3 font-bold">Is your child:</p>
        <ul className="mt-1 list-disc pl-6 text-ink-soft">
          <li>Spending a lot of time on screens?</li>
          <li>Finding it difficult to express thoughts or use new words?</li>
          <li>Struggling with simple puzzles or problem-solving?</li>
          <li>Finding it difficult to wait, share or take turns?</li>
          <li>Still developing everyday skills like dressing, cleaning up or following instructions?</li>
        </ul>
        <p className="mt-4">
          Every child develops at their own pace. But children also need opportunities to talk, think, move, explore and interact. Too much passive screen time can take
          away from some of those opportunities.
        </p>
        <p className="mt-3 font-bold">That&apos;s where Milomi comes in.</p>
        <p className="mt-1">Instead of simply giving your child another screen, Milomi turns screen time into shared playtime with you.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {["Your child plays.", "You take part.", "They practise important skills.", "You build a stronger bond."].map((l) => (
            <span key={l} className="rounded-lg bg-sage/30 px-4 py-2 font-bold">
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* 2. development is more than ABCs */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-[16rem] flex-1">
            <h2 className="text-2xl font-bold">Development is more than ABCs &amp; 123s</h2>
            <p className="mt-1 text-ink-soft">Between ages 3 and 5, children are developing much more than academic skills. They are learning how to:</p>
          </div>
          <MiloQuip line="I'm on “Become independent”. I opened a drawer today." expression="thinking" action="headTilt" className="shrink-0" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {AREAS.map((a) => {
            const inMilomi = practisedBy(a.domains);
            return (
              <div key={a.title} className="rounded-xl border-2 border-paper-shade bg-cream p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage/40 text-moss [&_svg]:h-5 [&_svg]:w-5">{a.icon}</span>
                  <h3 className="text-lg font-bold">{a.title}</h3>
                </div>
                <p className="mt-2 text-ink-soft">{a.text}</p>
                {inMilomi.length > 0 && (
                  <p className="mt-2 text-sm">
                    <span className="font-bold">In Milomi:</span> {inMilomi.join(", ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. why 3–5 */}
      <section>
        <h2 className="text-2xl font-bold">Why does this matter at 3–5?</h2>
        <p className="mt-2">
          Think of these years as building blocks. A child who gets opportunities to talk, play, solve, move, create and connect is practising skills that support what comes
          next.
        </p>
        <p className="mt-3 font-bold">And the most important part? You don&apos;t have to be a teacher.</p>
        <p className="mt-1">Your everyday interaction with your child can become a learning opportunity.</p>
        <div className="mt-4 flex flex-wrap items-end justify-end gap-4">
          <p className="min-w-[16rem] flex-1 rounded-xl bg-mustard/30 px-5 py-4 text-xl font-bold">5 minutes of playing together is worth more than another 20 minutes of passive watching.</p>
          <MiloQuip line="I'm not biased. (I'm very biased.)" expression="proud" action="bellyPuff" flip bubble="right" className="shrink-0" />
        </div>
      </section>

      {/* 4. connect it to Milomi */}
      <section>
        <h2 className="text-2xl font-bold">We turn developmental skills into things you can actually do</h2>
        <p className="mt-1 text-ink-soft">
          Instead of telling you “your child needs to improve cognitive development”, Milomi shows you something to try, what it practises and how to join in.
        </p>
        <div className="relative mt-20 flex flex-col gap-3">
          <MiloQuip peek line="Hide 3 things? I hid my sock. Still looking." expression="confused" action="investigate" className="absolute right-4 bottom-full" />
          {TRY_THIS.map((t) => (
            <div key={t.title} className="rounded-xl border-2 border-paper-shade bg-cream p-4">
              <h3 className="text-lg font-bold">🧩 Try this: {t.title}</h3>
              <p className="mt-1">{t.doThis}</p>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-bold text-ink-soft">What they&apos;re practising</dt>
                  <dd>{t.practising}</dd>
                </div>
                <div>
                  <dt className="text-sm font-bold text-ink-soft">What you can do together</dt>
                  <dd>{t.together}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* 5. how we think about it */}
      <section className="rounded-2xl bg-cream p-6">
        <MiloQuip line="No tests. Good. I'd fail them." expression="happy" action="thumbsUp" className="mb-2 justify-end lg:float-right lg:ml-4" />
        <h2 className="text-2xl font-bold">Understand where your child is. Discover what they&apos;re ready to practise. Grow together.</h2>
        <p className="mt-3 text-ink-soft">
          Milomi isn&apos;t a test, and there&apos;s no “behind”. Every activity can be played at your child&apos;s own pace, and after each one you can tell us how it went
          (press and hold <b>Make Milo Better With Us 🌱</b> on the end screen). That helps us shape what Milo suggests next.
        </p>
        <p className="mt-3 text-sm text-ink-soft">
          Milomi&apos;s activities are inspired by India&apos;s National Curriculum Framework for the Foundational Stage (NCF-FS 2022), which looks beyond academics at
          children&apos;s physical, cognitive, language, socio-emotional and creative development, and early literacy and numeracy. Milomi is not officially endorsed by NCERT.
        </p>
      </section>
    </article>
  );
}
