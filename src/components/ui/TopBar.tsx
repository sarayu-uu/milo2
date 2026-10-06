"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Accessibility, Users, Volume2, VolumeX, X } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import { UtilityButton } from "@/components/scrapbook/primitives";
import { analytics } from "@/lib/analytics/analytics";
import { sound } from "@/lib/audio/soundManager";
import { CommunityButton } from "@/components/community/Community";

/** Floating top bar: a child "back" control on the left, quiet grown-up utilities on the right. */
export function TopBar({ back, left, hideParent = false }: { back?: string; left?: ReactNode; hideParent?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[var(--z-ui)] flex items-start justify-between p-[var(--gutter)]">
      <div className="pointer-events-auto flex items-center gap-3">
        {back && <BackButton href={back} />}
        {left}
      </div>
      <div className="pointer-events-auto flex items-center gap-2 opacity-90">
        <CommunityButton />
        <SoundToggle />
        <AccessibilityMenu />
        {!hideParent && <ParentButton />}
      </div>
    </div>
  );
}

export function BackButton({ href, onClick }: { href?: string; onClick?: () => void }) {
  const router = useRouter();
  return (
    <motion.button
      type="button"
      aria-label="Back"
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        void sound.play("paper-rustle");
        if (onClick) onClick();
        else if (href) router.push(href);
      }}
      className="paper inline-flex h-[var(--touch-big)] w-[var(--touch-big)] -rotate-3 items-center justify-center rounded-full"
      style={{ "--paper-bg": "#fbf8f1" } as React.CSSProperties}
    >
      <svg viewBox="0 0 48 48" className="h-1/2 w-1/2" aria-hidden>
        <path d="M40 25c-10-1-20-1-30-1M20 13 9 24l11 11" fill="none" stroke="#3a3833" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  );
}

function ParentButton() {
  const router = useRouter();
  return (
    <motion.button
      type="button"
      aria-label="Parents"
      whileTap={{ scale: 0.94 }}
      onClick={() => router.push("/parent")}
      className="inline-flex h-[var(--touch-min)] items-center gap-2 rounded-full bg-paper/90 px-4 text-[max(14px,0.95rem)] font-semibold text-ink-soft shadow-[var(--shadow-pressed)] backdrop-blur-sm"
    >
      <Users className="h-5 w-5" /> Parents
    </motion.button>
  );
}

function SoundToggle() {
  const muted = useSettingsStore((s) => s.audio.muted);
  const toggle = useSettingsStore((s) => s.toggleMute);
  return (
    <UtilityButton
      label={muted ? "Turn sound on" : "Turn sound off"}
      onClick={() => {
        toggle();
        analytics.track("setting_changed", { setting: "muted", value: String(!muted) });
      }}
    >
      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </UtilityButton>
  );
}

function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const motionPref = useSettingsStore((s) => s.motion);
  const setMotion = useSettingsStore((s) => s.setMotion);
  const textSize = useSettingsStore((s) => s.textSize);
  const setTextSize = useSettingsStore((s) => s.setTextSize);
  const ambient = useSettingsStore((s) => s.audio.ambient);
  const setAudio = useSettingsStore((s) => s.setAudio);

  return (
    <div className="relative">
      <UtilityButton label="Accessibility" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Accessibility className="h-5 w-5" />
      </UtilityButton>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            className="paper absolute top-[calc(100%+0.5rem)] right-0 w-72 p-4 text-base"
            role="dialog"
            aria-label="Accessibility"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-hand text-xl">Comfort</span>
              <button type="button" aria-label="Close" className="flex h-10 w-10 items-center justify-center" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <Toggle
              label="Less movement"
              on={motionPref === "reduced"}
              onChange={(v) => {
                setMotion(v ? "reduced" : "system");
                analytics.track("setting_changed", { setting: "motion", value: v ? "reduced" : "system" });
              }}
            />
            <Toggle
              label="Bigger text"
              on={textSize === "large"}
              onChange={(v) => {
                setTextSize(v ? "large" : "normal");
                analytics.track("setting_changed", { setting: "textSize", value: v ? "large" : "normal" });
              }}
            />
            <Toggle
              label="Background sounds"
              on={ambient}
              onChange={(v) => {
                setAudio({ ambient: v });
                analytics.track("setting_changed", { setting: "ambient", value: String(v) });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Toggle({ label, on, onChange, hint }: { label: string; on: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex min-h-[48px] w-full items-center justify-between gap-3 text-left"
    >
      <span>
        <span className="block">{label}</span>
        {hint && <span className="block text-sm text-ink-soft">{hint}</span>}
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-moss" : "bg-warm-grey/50"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-paper shadow transition-all ${on ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}
