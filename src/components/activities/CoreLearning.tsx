"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { listThemes } from "@/data/themes";
import { getActivityMeta } from "@/data/activities";
import type { ActivityMeta } from "@/types/activity";
import { ThemeStrip } from "./ThemeStrip";
import { TopBar } from "@/components/ui/TopBar";
import { Label } from "@/components/scrapbook/primitives";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { Milo } from "@/components/characters/Milo";
import { useSessionStore } from "@/stores/sessionStore";
import { useProgressStore } from "@/stores/progressStore";
import { useSpeech } from "@/hooks/useSpeech";
import { analytics } from "@/lib/analytics/analytics";
import { sound } from "@/lib/audio/soundManager";
import { Doodle } from "@/components/scrapbook/Doodle";
import { Tape } from "@/components/scrapbook/primitives";

/**
 * CORE LEARNING ("Play Book" for children).
 * Vertical coloured strips side by side, scrolled horizontally.
 * Tapping a strip expands it sideways to reveal its activities.
 */
export function CoreLearning() {
  const router = useRouter();
  const themes = useMemo(() => listThemes(), []);
  const openId = useSessionStore((s) => s.openThemeId);
  const setOpen = useSessionStore((s) => s.setOpenTheme);
  const completed = useProgressStore((s) => s.completed);
  const milo = useSpeech("milo", { expression: "curious" });
  const scroller = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const activitiesFor = (ids: string[]) => ids.map((id) => getActivityMeta(id)).filter(Boolean) as ActivityMeta[];

  useEffect(() => {
    // Deep link (e.g. "back to activities" from an activity) re-opens a strip.
    const want = new URLSearchParams(window.location.search).get("theme");
    if (want && themes.some((t) => t.id === want)) setOpen(want);
    sound.preload(["vo-playbook-pick-a-colour"]);
    analytics.track("core_learning_opened", {});
    const t = setTimeout(() => {
      if (!useSessionStore.getState().openThemeId) milo.say("Pick a colour. Any colour!", { expression: "curious", action: "headTilt" });
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // theme_viewed: which strips actually come into view.
  useEffect(() => {
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const id = (e.target as HTMLElement).dataset.themeId;
          if (e.isIntersecting && id && !seen.has(id)) {
            seen.add(id);
            analytics.track("theme_viewed", { themeId: id, position: themes.findIndex((t) => t.id === id) });
          }
        });
      },
      { root: scroller.current, threshold: 0.6 },
    );
    Object.values(stripRefs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [themes]);

  const toggle = (id: string, position: number) => {
    void sound.play("paper-rustle");
    if (openId === id) {
      setOpen(null);
      analytics.track("theme_collapsed", { themeId: id });
      return;
    }
    setOpen(id);
    analytics.track("theme_expanded", { themeId: id, position });
  };

  const bringIntoView = (id: string) => {
    const el = stripRefs.current[id];
    const sc = scroller.current;
    if (!el || !sc) return;
    const elBox = el.getBoundingClientRect();
    const scBox = sc.getBoundingClientRect();
    if (elBox.left < scBox.left + 16 || elBox.right > scBox.right - 16) {
      sc.scrollBy({ left: elBox.left - scBox.left - Math.max(16, (scBox.width - elBox.width) / 2), behavior: "smooth" });
    }
  };

  const openActivity = (a: ActivityMeta, themeId: string) => {
    void sound.play("page-flip");
    router.push(`/activity/${a.id}?from=learn:${themeId}`);
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      <NotebookBackdrop />
      <div className="h-[calc(var(--touch-big)+var(--gutter)*1.2)] shrink-0" />
      <Label className="absolute top-[calc(var(--gutter)+0.9rem)] left-[calc(var(--gutter)+var(--touch-big)+1rem)] text-[1.7rem] z-10" tilt={-2}>
        Play Book
      </Label>

      <div
        ref={scroller}
        className="no-scrollbar relative flex min-h-0 flex-1 snap-x items-stretch gap-[0.55rem] overflow-x-auto overflow-y-hidden px-[var(--gutter)] pt-3"
        style={{ scrollPaddingInline: "var(--gutter)" }}
      >
        {/* Milo peeks in from the side */}
        <div className="relative flex w-[clamp(9rem,15vw,14rem)] shrink-0 flex-col justify-end pb-4">
          <div className="absolute bottom-[60%] left-0 w-[17rem]">
            <SpeechBubble text={milo.text} size="sm" />
          </div>
          <motion.button
            type="button"
            aria-label="Milo"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              void sound.play("coo");
              milo.say("Ooh, I like the yellow one. Or the green one. Or…", { expression: "thinking", action: "headTilt" });
            }}
          >
            <Milo expression={milo.expression} action={milo.action} talking={milo.talking} className="h-auto w-full" />
          </motion.button>
        </div>

        {themes.map((t, i) => (
          <ThemeStrip
            key={t.id}
            ref={(el) => {
              stripRefs.current[t.id] = el;
            }}
            theme={t}
            index={i}
            activities={activitiesFor(t.activityIds)}
            expanded={openId === t.id}
            completed={completed}
            onToggle={() => toggle(t.id, i)}
            onOpenActivity={(a) => openActivity(a, t.id)}
            onExpandedDone={() => bringIntoView(t.id)}
          />
        ))}
        <div className="w-[var(--gutter)] shrink-0" />
      </div>
      <TopBar back="/" />
    </div>
  );
}

/** The Play Book itself: a desk, an open spiral notebook, a few doodles. */
function NotebookBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="construction absolute inset-0" style={{ "--paper-bg": "#9fb7c4" } as React.CSSProperties} />
      <div
        className="notebook absolute inset-x-[2%] top-[13%] bottom-[2%] -rotate-[0.4deg] rounded-[0.5rem] shadow-[var(--shadow-lift)]"
        style={{ backgroundPosition: "0 0.6rem, 0 0" }}
      >
        {/* red margin line */}
        <div className="absolute inset-y-0 left-[13%] w-[2px] bg-coral/50" />
        {/* spiral binding */}
        <div className="absolute -top-[1.1rem] inset-x-[3%] flex justify-between">
          {Array.from({ length: 22 }, (_, i) => (
            <span key={i} className="h-[2.2rem] w-[0.8rem] rounded-full border-[3px] border-[#5f6b7a] bg-transparent" />
          ))}
        </div>
      </div>
      <Tape className="top-[12%] right-[6%] rotate-12" variant="pink" />
      <Doodle name="sun" className="absolute right-[3%] bottom-[4%] h-12 w-12 text-mustard" />
      <Doodle name="paw" className="absolute bottom-[5%] left-[15%] h-8 w-8 text-brick/60" />
      <span className="font-hand absolute bottom-[3%] left-[19%] -rotate-2 text-[1.2rem] text-ink-soft">pick a colour →</span>
    </div>
  );
}

