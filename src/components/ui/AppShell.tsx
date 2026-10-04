"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSettingsStore } from "@/stores/settingsStore";
import { useProgressStore } from "@/stores/progressStore";
import { useSessionStore } from "@/stores/sessionStore";
import { analytics } from "@/lib/analytics/analytics";
import { sound } from "@/lib/audio/soundManager";
import { setVoiceEnabled, setVoiceVolume, stopSpeaking } from "@/lib/audio/voice";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LandscapeGuard } from "./LandscapeGuard";
import { PlaybookTransition } from "./PlaybookTransition";
import { WorldCrayonDefs } from "@/lib/animation/texture";

let booted = false;

/**
 * App shell: hydrates persisted state, wires settings into the document,
 * audio and analytics, and enforces the landscape-only stage.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useSessionStore((s) => s.hydrated);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  // 1. Hydrate persisted stores (client only, avoids SSR mismatch).
  useEffect(() => {
    if (booted) return; // StrictMode runs effects twice in dev
    booted = true;
    Promise.all([useSettingsStore.persist.rehydrate(), useProgressStore.persist.rehydrate()]).then(() => {
      const progress = useProgressStore.getState();
      const returning = progress.visitDays.length > 0;
      progress.recordDay();
      useSessionStore.getState().setHydrated();
      analytics.init();
      analytics.track("app_opened", { returning, daysVisited: useProgressStore.getState().visitDays.length });
    });
  }, []);

  // 2. Settings → document attributes, audio mix, voice.
  useEffect(() => {
    const apply = (s: ReturnType<typeof useSettingsStore.getState>) => {
      const root = document.documentElement;
      root.dataset.motion = s.motion === "system" ? "" : s.motion;
      root.dataset.text = s.textSize;
      sound.setMix({
        muted: s.audio.muted,
        ambient: s.audio.ambient,
        effects: s.audio.effects,
        ambientVolume: s.audio.ambientVolume,
        effectsVolume: s.audio.effectsVolume,
        voice: s.audio.voice,
        voiceVolume: s.audio.voiceVolume,
        activity: s.audio.activity,
        activityVolume: s.audio.activityVolume,
        masterVolume: s.audio.masterVolume,
      });
      setVoiceVolume(s.audio.voiceVolume, s.audio.masterVolume);
      setVoiceEnabled(s.audio.voice && !s.audio.muted);
    };
    apply(useSettingsStore.getState());
    return useSettingsStore.subscribe(apply);
  }, []);

  // Prepare Howler's automatic mobile unlock without introducing a new screen.
  useEffect(() => {
    void sound.initialize();
    const unlock = () => sound.unlock();
    const unlockKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") unlock();
    };
    window.addEventListener("pointerup", unlock);
    window.addEventListener("keydown", unlockKey);
    return () => {
      window.removeEventListener("pointerup", unlock);
      window.removeEventListener("keydown", unlockKey);
    };
  }, []);

  // 3. Show focus rings only for keyboard users, never for taps/clicks.
  useEffect(() => {
    const root = document.documentElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") root.dataset.input = "keyboard";
    };
    const onPointer = () => (root.dataset.input = "pointer");
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  // 4. Leaving the app (tab hidden / browser closed or minimised) silences it.
  useEffect(() => {
    const onVisibility = () => {
      const hidden = document.visibilityState === "hidden";
      if (hidden) stopSpeaking();
      sound.setHidden(hidden);
    };
    const onPageHide = () => {
      stopSpeaking();
      sound.setHidden(true);
    };
    const onPageShow = () => sound.setHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("blur", onVisibility);
    // Android Chrome "freezes" background tabs; treat it like leaving.
    document.addEventListener("freeze", onPageHide);
    return () => {
      document.removeEventListener("freeze", onPageHide);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("blur", onVisibility);
    };
  }, []);

  // 5. Count screens for session analytics.
  useEffect(() => {
    analytics.screenViewed();
  }, [pathname]);

  // The mobile landscape frame owns navigation; mirror its URL to the browser.
  useEffect(() => {
    if (window.parent === window) return;
    const report = () => window.parent.postMessage({ type: "milomi:location", href: window.location.href }, window.location.origin);
    report();
    window.addEventListener("popstate", report);
    window.addEventListener("hashchange", report);
    return () => {
      window.removeEventListener("popstate", report);
      window.removeEventListener("hashchange", report);
    };
  }, [pathname]);

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      <WorldCrayonDefs />
      <LandscapeGuard />
      <div className="app-stage relative h-dvh w-dvw overflow-hidden">
        {hydrated ? children : <PaperLoading />}
      </div>
      <PlaybookTransition />
    </MotionConfig>
  );
}

function PaperLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="paper font-hand rotate-[-2deg] px-8 py-4 text-2xl text-ink-soft">Opening the scrapbook…</div>
    </div>
  );
}
