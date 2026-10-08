"use client";

import { forwardRef, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ThemeDefinition } from "@/types/theme";
import type { ActivityMeta } from "@/types/activity";
import { Doodle } from "@/components/scrapbook/Doodle";
import { Tape } from "@/components/scrapbook/primitives";
import { ActivityCard } from "./ActivityCard";
import { STRIP_COLLAPSED } from "./sizes";


/* Strip widths in px so Motion can spring between them smoothly. */
const clamp = (min: number, v: number, max: number) => Math.min(max, Math.max(min, v));
function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
function useViewportKey() {
  return useSyncExternalStore(
    subscribe,
    () => `${window.innerWidth}x${parseFloat(getComputedStyle(document.documentElement).fontSize)}`,
    () => "1280x16",
  );
}
function stripSizes(key: string, cards: number) {
  const [vw, rem] = key.split("x").map(Number);
  const collapsed = clamp(4.4 * rem, 0.072 * vw, 6.6 * rem);
  const card = clamp(12 * rem, 0.17 * vw, 16 * rem);
  const content = 1.6 * rem + 2.2 * rem + cards * card + (cards - 1) * 1.6 * rem;
  const expanded = Math.min(0.86 * vw, collapsed + Math.max(content, 22 * rem));
  return { collapsed, expanded };
}

/** Accordion spring: ~400ms, settles without bouncing. */
export const STRIP_SPRING = { type: "spring", stiffness: 230, damping: 32, mass: 1 } as const;

/**
 * One vertical theme strip — a scrapbook divider / book spine.
 * Collapsed: a narrow coloured spine. Expanded: it grows sideways and
 * shows its activity cards in a row.
 */
export const ThemeStrip = forwardRef<
  HTMLDivElement,
  {
    theme: ThemeDefinition;
    activities: ActivityMeta[];
    expanded: boolean;
    index: number;
    completed: Record<string, unknown>;
    onToggle: () => void;
    onOpenActivity: (a: ActivityMeta) => void;
    onExpandedDone?: () => void;
  }
>(function ThemeStrip({ theme, activities, expanded, index, completed, onToggle, onOpenActivity, onExpandedDone }, ref) {
  const size = stripSizes(useViewportKey(), Math.max(1, activities.length));
  const tilt = index % 2 ? 0.6 : -0.5;

  return (
    <motion.div
      ref={ref}
      data-theme-id={theme.id}
      className="construction relative h-full shrink-0 overflow-hidden rounded-t-[0.6rem] shadow-[var(--shadow-paper)]"
      style={{ "--paper-bg": theme.color, color: theme.ink, rotate: `${tilt}deg` } as React.CSSProperties}
      initial={false}
      animate={{ width: expanded ? size.expanded : size.collapsed }}
      transition={STRIP_SPRING}
      onAnimationComplete={() => expanded && onExpandedDone?.()}
    >
      {/* the spine (always present, acts as the toggle) */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={theme.label}
        className="absolute inset-y-0 left-0 z-10 flex flex-col items-center gap-3 pt-[1.6rem] pb-4"
        style={{ width: STRIP_COLLAPSED }}
      >
        <span className="flex h-[3.1rem] w-[3.1rem] items-center justify-center rounded-full bg-paper/70">
          <Doodle name={theme.doodle} className="h-8 w-8" />
        </span>
        <span
          className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-none whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {theme.label}
        </span>
        {/* little dots: how many things live in here */}
        <span className="mt-auto flex flex-col gap-1.5">
          {activities.map((a) => (
            <span key={a.id} className="h-2 w-2 rounded-full bg-paper/80" />
          ))}
        </span>
      </button>
      {/* stitched edge between spine and page */}
      <div
        className="pointer-events-none absolute inset-y-4 border-l-[3px] border-dashed opacity-30"
        style={{ left: STRIP_COLLAPSED, borderColor: theme.ink }}
      />
      <Tape className="-top-1 left-1/2 -translate-x-1/2 scale-75" variant={index % 3 === 1 ? "pink" : index % 3 === 2 ? "blue" : undefined} />

      {/* the opened page */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.16, duration: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="absolute inset-y-0 right-0 flex flex-col justify-center gap-[3vh] pr-[2.2rem] pl-[1.6rem]"
            style={{ left: STRIP_COLLAPSED }}
          >
            <div>
              <h2 className="font-display text-[clamp(2.2rem,3.6vw,3.2rem)] leading-none">{theme.label}</h2>
              <p className="font-display mt-1 text-[1.25rem] opacity-80">{theme.line}</p>
            </div>
            {activities.length ? (
              // more cards than fit: the row scrolls sideways (the cut-off card at the edge says "there's more")
              <div className="no-scrollbar -mr-[2.2rem] flex items-start gap-[1.6rem] overflow-x-auto overscroll-x-contain pr-[2.2rem] pb-3">
                {activities.map((a, i) => (
                  <ActivityCard key={a.id} activity={a} color={theme.color} done={!!completed[a.id]} index={i} onOpen={() => onOpenActivity(a)} />
                ))}
              </div>
            ) : (
              <p className="font-display text-[1.4rem]">Milo is still making these. Come back soon!</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
