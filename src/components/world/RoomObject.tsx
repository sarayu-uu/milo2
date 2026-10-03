"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import type { RoomObjectDefinition } from "@/types/world";
import { Art } from "@/components/art/Art";
import { ROOM_ART } from "./roomArt";
import { useProgressStore } from "@/stores/progressStore";
import { dayKey, hashString } from "@/lib/storage/dates";
import { Tape } from "@/components/scrapbook/primitives";

const DAILY = ["feather", "button", "leaf", "marble", "acorn", "paper-plane", "pebble", "coin"];

/** Today's little surprise on the window sill. Same all day, different tomorrow. */
export function dailySurpriseArt(date = new Date()) {
  return DAILY[hashString(dayKey(date)) % DAILY.length];
}

export function RoomObject({
  obj,
  isNew,
  hint,
  still = false,
  onTap,
}: {
  obj: RoomObjectDefinition & { isNew?: boolean };
  isNew?: boolean;
  /** Changing this number makes the object give ONE tiny "tap me?" cue. */
  hint?: number;
  /** Render as plain decoration (e.g. inside a miniature that is itself a button). */
  still?: boolean;
  onTap?: (obj: RoomObjectDefinition) => void;
}) {
  const controls = useAnimationControls();
  const drawing = useProgressStore((s) => s.drawing);
  const art = ROOM_ART[obj.art];
  const ratio = art ? art.h / art.w : 1;
  const interactive = !!obj.interaction && !still;
  const [circle, setCircle] = useState(false);

  const wiggle = async () => {
    switch (obj.interaction?.wiggle) {
      case "shake":
        return controls.start({ rotate: [0, -5, 5, -3, 0], transition: { duration: 0.5 } });
      case "bounce":
        return controls.start({ y: [0, -14, 0, -5, 0], transition: { duration: 0.6 } });
      case "spin":
        return controls.start({ rotate: [0, 360], transition: { duration: 0.8, ease: "easeInOut" } });
      case "swing":
        return controls.start({ rotate: [0, 4, -3, 1.5, 0], transition: { duration: 0.9 } });
      case "glow":
        return controls.start({ filter: ["brightness(1)", "brightness(1.18)", "brightness(1)"], transition: { duration: 0.8 } });
      default:
        return controls.start({ scale: [1, 1.04, 1], transition: { duration: 0.3 } });
    }
  };

  // one-off hint: a single wiggle and a pencil circle, never continuous
  useEffect(() => {
    if (!hint) return;
    void wiggle();
    setCircle(true);
    const t = setTimeout(() => setCircle(false), 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const content = (() => {
    if (obj.art === "child-drawing") return <TapedDrawing src={drawing} />;
    if (obj.art === "daily-surprise") return <Art k={dailySurpriseArt()} className="h-full w-full" />;
    if (art)
      return (
        <svg viewBox={`0 0 ${art.w} ${art.h}`} className="h-full w-full" style={{ overflow: "visible", filter: "drop-shadow(0 2px 1px rgba(90, 70, 45, 0.16))" }} aria-hidden>
          {art.draw()}
        </svg>
      );
    return <Art k={obj.art} className="h-full w-full" />;
  })();

  const style = {
    left: `${obj.x}%`,
    top: `${obj.y}%`,
    width: `${obj.w}%`,
    zIndex: obj.layer === "front" ? 30 : obj.layer === "mid" ? 12 : 5,
  } as const;

  const box = (
    <motion.div animate={controls} className={`relative w-full ${isNew ? "is-new" : ""}`} style={{ aspectRatio: `1 / ${ratio}` }}>
      {content}
      <AnimatePresence>
        {circle && (
          <motion.svg
            key="circle"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute -inset-[8%] h-[116%] w-[116%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            aria-hidden
          >
            <motion.path
              d="M12 52 C10 22 40 6 62 10 C88 14 96 44 88 66 C78 92 36 96 18 76 C10 66 14 56 22 50"
              fill="none"
              stroke="#b46b56"
              strokeWidth={2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (!interactive) {
    return (
      <div className="pointer-events-none absolute" style={style}>
        {box}
      </div>
    );
  }

  return (
    <button
      type="button"
      className="absolute min-h-[44px] min-w-[44px] cursor-pointer rounded-xl"
      style={style}
      aria-label={obj.label}
      onClick={() => {
        void wiggle();
        onTap?.(obj);
      }}
    >
      {box}
    </button>
  );
}

function TapedDrawing({ src }: { src: string | null }) {
  return (
    <div className="paper relative h-full w-full rotate-[3deg] p-[6%]" style={{ aspectRatio: "1 / 1.1" }}>
      {/* drawn by the child; kept on this device only */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt="" className="h-full w-full object-contain" draggable={false} /> : null}
      <Tape className="-top-2 left-1/2 -translate-x-1/2 rotate-2 scale-75" />
    </div>
  );
}
