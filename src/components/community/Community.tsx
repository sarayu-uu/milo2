"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { analytics } from "@/lib/analytics/analytics";

/** The Little Years parents' community (WhatsApp group). */
export const COMMUNITY_URL = "https://chat.whatsapp.com/Cb3jppeRLieJF2hukcZ2c6";
const EMOJIS = ["👨‍👩‍👧", "💬", "🌱"];

/** Collapses back to just the emojis if nobody taps the text. */
const COLLAPSE_MS = 6000;

/** What the community is, and the button to join (the top-bar pop-up). */
export function CommunityInvite({ from }: { from: "bubble" | "awareness" }) {
  return (
    <div>
      <p className="text-3xl" aria-hidden>
        {EMOJIS.join(" ")}
      </p>
      <h2 className="font-display mt-2 text-[clamp(1.5rem,3vw,2.1rem)] leading-tight text-ink">Join the Little Years community</h2>
      <p className="mt-3 text-ink">
        We&apos;re building a community for parents of 3–6 year olds: a place to talk things through, find your circle, and work together towards a better future for our
        kids.
      </p>
      <a
        href={COMMUNITY_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => analytics.track("community_join_clicked", { from })}
        className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-moss px-6 py-2 font-bold text-paper shadow-[var(--shadow-paper)]"
      >
        Join on WhatsApp
      </a>
      <p className="mt-2 text-sm break-all text-ink-soft">{COMMUNITY_URL}</p>
    </div>
  );
}

/** A small one-row version of the invite, for Parents → You & your child. */
export function CommunityStrip() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border-2 border-sage bg-sage/20 px-5 py-4">
      <span className="text-3xl" aria-hidden>
        {EMOJIS.join("")}
      </span>
      <div className="min-w-[14rem] flex-1">
        <p className="font-bold text-ink">Join the Little Years community</p>
        <p className="text-sm text-ink-soft">Parents of 3–6 year olds: talking things through, finding our circle, and working towards a better future for our kids.</p>
      </div>
      <a
        href={COMMUNITY_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => analytics.track("community_join_clicked", { from: "awareness" })}
        className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-moss px-5 font-bold text-paper shadow-[var(--shadow-paper)]"
      >
        Join on WhatsApp
      </a>
    </div>
  );
}

/** The 🌱, softened to sit with the paper buttons: less green, more beige. */
const BEIGE: React.CSSProperties = { filter: "sepia(0.55) saturate(0.75) brightness(1.05)" };

/**
 * A small 🌱 button in the top bar, next to sound / accessibility / Parents.
 * Tap → it opens up to "Join Little Years community"; tap that → a pop-up with the invite.
 */
export function CommunityButton() {
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const collapse = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (collapse.current && clearTimeout(collapse.current)), []);

  const onTap = () => {
    if (collapse.current) clearTimeout(collapse.current);
    if (!expanded) {
      setExpanded(true);
      analytics.track("community_bubble_opened", {});
      collapse.current = setTimeout(() => setExpanded(false), COLLAPSE_MS);
      return;
    }
    setExpanded(false);
    setOpen(true);
    analytics.track("community_invite_viewed", { from: "bubble" });
  };

  return (
    <>
      <motion.button
        type="button"
        layout
        onClick={onTap}
        aria-label={expanded ? "Join Little Years community" : "Little Years community"}
        title="Little Years community"
        whileTap={{ scale: 0.94 }}
        className="inline-flex h-[var(--touch-min)] min-w-[var(--touch-min)] items-center justify-center gap-2 overflow-hidden rounded-full bg-paper/80 px-2.5 whitespace-nowrap text-ink-soft shadow-[var(--shadow-pressed)] backdrop-blur-sm"
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        <AnimatePresence>
          {expanded && (
            <motion.span
              key="label"
              className="pl-1 text-[max(14px,0.95rem)] font-semibold"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
            >
              Join Little Years community
            </motion.span>
          )}
        </AnimatePresence>
        <motion.span layout className="text-[1.2rem] leading-none" style={BEIGE} aria-hidden>
          🌱
        </motion.span>
      </motion.button>

      {/* rendered on <body>, so it covers the whole screen whatever the top bar sits in */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[96] flex items-center justify-center bg-ink/35 p-[4%] backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              >
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Little Years community"
                  className="paper relative max-h-full w-[min(34rem,100%)] overflow-y-auto px-7 py-6 select-text"
                  style={{ "--paper-bg": "#fffdf7", rotate: "-0.6deg", boxShadow: "var(--shadow-lift)" } as React.CSSProperties}
                  initial={{ y: 24, scale: 0.97 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full text-ink-soft">
                    <X className="h-5 w-5" />
                  </button>
                  <CommunityInvite from="bubble" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
