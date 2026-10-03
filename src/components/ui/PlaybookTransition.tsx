"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { listThemes } from "@/data/themes";
import { useSessionStore } from "@/stores/sessionStore";
import { sound } from "@/lib/audio/soundManager";

/**
 * Play Book transition (simple version): the coloured vertical dividers
 * cover the whole screen, hold for a moment, then the Play Book is revealed.
 *
 * Lives in the AppShell, above every page, so it stays put while the route
 * changes underneath. No movement — only a quick fade — so it also shows
 * for people with reduced motion turned on.
 */
const COVER_MS = 650; // how long the colours fill the screen before navigating
const REVEAL_DELAY_MS = 250; // settle time on the Play Book before revealing
const FADE_MS = 220;

export function PlaybookTransition() {
  const phase = useSessionStore((s) => s.playbookPhase);
  const setPhase = useSessionStore((s) => s.setPlaybookPhase);
  const router = useRouter();
  const pathname = usePathname();
  const themes = listThemes();
  const n = themes.length;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // cover → navigate
  useEffect(() => {
    if (phase !== "in") return;
    void sound.play("paper-rustle");
    timers.current.push(
      setTimeout(() => {
        setPhase("hold");
        router.push("/learn");
      }, COVER_MS),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // once the Play Book is on screen → reveal it
  useEffect(() => {
    if (phase !== "hold" || pathname !== "/learn") return;
    const t = setTimeout(() => setPhase("out"), REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [phase, pathname, setPhase]);

  useEffect(() => {
    if (phase !== "out") return;
    const t = setTimeout(() => setPhase("idle"), FADE_MS + 30);
    return () => clearTimeout(t);
  }, [phase, setPhase]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  if (phase === "idle") return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[95] flex"
      style={{
        opacity: phase === "out" ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
        animation: phase === "in" ? `pb-fade-in ${FADE_MS}ms ease both` : undefined,
      }}
      aria-hidden
    >
      {themes.map((t) => (
        <div key={t.id} className="h-full rounded-t-[0.6rem]" style={{ width: `${100 / n}%`, background: t.color }} />
      ))}
    </div>
  );
}
