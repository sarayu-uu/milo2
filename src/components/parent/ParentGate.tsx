"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import { Milo } from "@/components/characters/Milo";
import { analytics } from "@/lib/analytics/analytics";
import { sound } from "@/lib/audio/soundManager";

const HOLD_MS = 3000;

/**
 * Lightweight parent gate: press and HOLD for 3 seconds.
 * Easy for an adult reading the text, unlikely for a preschooler tapping.
 */
export function ParentGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef(0);

  useEffect(() => {
    analytics.track("parent_gate_opened", {});
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const tick = () => {
    const p = Math.min(1, (performance.now() - start.current) / HOLD_MS);
    setProgress(p);
    if (p >= 1) {
      void sound.play("bell");
      analytics.track("parent_gate_passed", {});
      onPass();
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const down = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    start.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };
  const up = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    setProgress(0);
  };

  const R = 46;
  const C = 2 * Math.PI * R;

  return (
    <div className="flex h-full w-full items-center justify-center gap-[6%] px-[8%]">
      <div className="w-[22%] opacity-90">
        <Milo expression="suspicious" action="lookRight" className="h-auto w-full" />
      </div>
      <div className="flex max-w-[30rem] flex-col items-start gap-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1 text-sm font-bold tracking-wider text-paper uppercase">
          <Lock className="h-4 w-4" /> For grown-ups
        </span>
        <h1 className="text-[2rem] leading-tight font-bold text-ink">Press and hold the circle for 3 seconds.</h1>
        <p className="text-ink-soft">Settings, progress and a short feedback survey are inside.</p>
        <div className="flex items-center gap-6">
          <motion.button
            type="button"
            aria-label="Press and hold for 3 seconds"
            onPointerDown={down}
            onPointerUp={up}
            onPointerCancel={up}
            onPointerLeave={up}
            onContextMenu={(e) => e.preventDefault()}
            whileTap={{ scale: 0.96 }}
            className="relative h-28 w-28 touch-none rounded-full bg-paper shadow-[var(--shadow-lift)]"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
              <circle cx={50} cy={50} r={R} fill="none" stroke="#e7dcc4" strokeWidth={6} />
              <circle cx={50} cy={50} r={R} fill="none" stroke="#7e8f63" strokeWidth={6} strokeDasharray={C} strokeDashoffset={C * (1 - progress)} strokeLinecap="round" />
            </svg>
            <span className="relative text-sm font-bold text-ink-soft">{progress > 0 ? `${Math.ceil((1 - progress) * 3)}…` : "hold"}</span>
          </motion.button>
          <button
            type="button"
            onClick={() => {
              analytics.track("parent_gate_cancelled", {});
              onCancel();
            }}
            className="min-h-[48px] px-3 text-ink-soft underline underline-offset-4"
          >
            Back to Milo
          </button>
        </div>
      </div>
    </div>
  );
}
