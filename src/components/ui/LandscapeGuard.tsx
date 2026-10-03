"use client";

import { useEffect } from "react";
import { Milo } from "@/components/characters/Milo";
import { analytics } from "@/lib/analytics/analytics";

/**
 * Portrait blocker. Pure CSS decides visibility (see .orientation-blocker in
 * globals.css) so there's never a squeezed flash; JS only reports it.
 */
export function LandscapeGuard() {
  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const report = () => mq.matches && analytics.trackOnce("orientation", "orientation_blocked", {});
    report();
    mq.addEventListener("change", report);
    return () => mq.removeEventListener("change", report);
  }, []);

  return (
    <div
      className="orientation-blocker fixed inset-0 z-[var(--z-gate)] flex-col items-center justify-center gap-6 bg-cream px-8 text-center"
      role="dialog"
      aria-label="Please turn your screen sideways"
    >
      <div className="relative h-[46vw] w-[46vw]">
        {/* Milo, awkwardly lying sideways */}
        <div className="absolute inset-0 rotate-90">
          <Milo expression="confused" action="idle" className="h-full w-full" />
        </div>
      </div>
      <p className="font-hand text-[8vw] leading-tight text-ink">Oops! Milo is sideways.</p>
      <p className="max-w-[80vw] text-[5vw] text-ink-soft">Turn your screen so we can keep exploring.</p>
      <svg viewBox="0 0 120 120" className="h-[24vw] w-[24vw]" aria-hidden>
        <g className="rotate-device">
          <rect x="38" y="18" width="44" height="80" rx="8" fill="#fbf8f1" stroke="#3a3833" strokeWidth="3" />
          <circle cx="60" cy="88" r="3" fill="#3a3833" />
        </g>
        <path d="M18 70 A44 44 0 0 1 40 26" fill="none" stroke="#df917a" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 6" />
        <path d="M34 22 L42 25 L38 33" fill="none" stroke="#df917a" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
