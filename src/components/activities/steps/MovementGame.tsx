"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import type { MovementStep } from "@/types/activity";
import type { StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { Character } from "@/components/characters/Character";
import { Art } from "@/components/art/Art";
import { NextArrow, Paper } from "@/components/scrapbook/primitives";
import { SceneStage } from "@/components/world/SceneStage";
import { speak } from "@/lib/audio/voice";
import { sound } from "@/lib/audio/soundManager";
import { Backdrop } from "./Backdrop";

/** After the leader finishes a line: time to do the move… */
const MOVE_MS = 6000;
/** …time to hold still on FREEZE… */
const FREEZE_MS = 3000;
/** …and time to stand up and get ready before the first move. */
const READY_MS = 4000;

/**
 * Movement game led by a character. Hands-free: once it starts, each move
 * plays on its own timer so the child can keep moving without touching the
 * device. "FREEZE!" moments are big and obvious. A grown-up can pause, or
 * tap Start to skip the get-ready wait.
 */
export function MovementGame({ step, band, onDone }: StepProps<MovementStep>) {
  const [i, setI] = useState(-1);
  const [lineDone, setLineDone] = useState(false);
  const [paused, setPaused] = useState(false);
  const move = i >= 0 ? step.moves[i] : null;
  const text = move ? pick(move.text, band) : pick(step.intro, band);
  const freeze = /freeze/i.test(text);
  const holdMs = i < 0 ? READY_MS : freeze ? FREEZE_MS : MOVE_MS;
  const nextRef = useRef(() => {});
  nextRef.current = () => (i + 1 < step.moves.length ? setI(i + 1) : onDone());

  // Say the line; the hold timer starts once it's finished.
  useEffect(() => {
    setLineDone(false);
    let live = true;
    const done = () => live && setLineDone(true);
    if (freeze) void sound.play("whoosh");
    else if (i >= 0) void sound.play(step.leader === "dog" ? "woof" : "boing");
    const audible = speak(text, step.leader, { onEnd: done });
    // no voice (sound off): give roughly the time it would take to read
    const t = audible ? undefined : setTimeout(done, Math.min(2500, 500 + text.length * 45));
    return () => {
      live = false;
      if (t) clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  // Hands-free: move on by itself after the hold.
  useEffect(() => {
    if (!lineDone || paused) return;
    const t = setTimeout(() => nextRef.current(), holdMs);
    return () => clearTimeout(t);
  }, [lineDone, paused, holdMs, i]);

  // Leaving the app pauses the game.
  useEffect(() => {
    const onHide = () => document.hidden && setPaused(true);
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  return (
    <SceneStage>
      <span data-hint-off hidden />
      <Backdrop k="pavement" />
      <div className={`absolute inset-0 transition-colors duration-300 ${freeze ? "bg-sky/45" : "bg-cream/30"}`} />

      <div className="absolute bottom-[6%] left-[8%] h-[62%]" style={{ aspectRatio: "1.1/1" }}>
        <Character id={step.leader} expression={freeze ? "surprised" : "happy"} action={freeze ? "idle" : move?.action ?? "idle"} className="h-full w-full" key={i} />
      </div>

      <div className="absolute top-[12%] right-[6%] flex w-[48%] flex-col items-center gap-[4vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ scale: 0.7, opacity: 0, rotate: -6 }}
            animate={{ scale: freeze ? [1, 1.12, 1] : 1, opacity: 1, rotate: freeze ? -3 : -1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            // springs can't do 3-step keyframes, so the FREEZE pulse uses a plain tween
            transition={{ type: "spring", stiffness: 260, damping: 18, scale: freeze ? { duration: 0.45, ease: "easeInOut" } : undefined }}
          >
            <Paper className="flex flex-col items-center gap-3 px-[3rem] py-[2rem]" color={freeze ? "#e9f2f6" : "#fbf8f1"} tape="top">
              {move?.art && <Art k={move.art} className="h-[clamp(5rem,14vh,9rem)] w-[clamp(5rem,14vh,9rem)]" />}
              <span className={`font-display text-center leading-tight text-ink ${freeze ? "text-[4.2rem] tracking-wider" : "text-[2.6rem]"}`}>{text}</span>
              {/* how long until the next move (drains while the child moves) */}
              <div className="h-[6px] w-full overflow-hidden rounded-full bg-ink/10" aria-hidden>
                {lineDone && (
                  <div
                    key={`${i}-${paused}`}
                    className="h-full rounded-full bg-ink/35"
                    style={{ animation: `move-timer ${holdMs}ms linear forwards`, animationPlayState: paused ? "paused" : "running" }}
                  />
                )}
              </div>
            </Paper>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* grown-up controls: Start (skip the wait) / pause */}
      <div className="absolute right-[3%] bottom-[5%] flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Resume" : "Pause"}
          className="paper flex h-[calc(var(--touch-big)*0.75)] w-[calc(var(--touch-big)*0.75)] items-center justify-center rounded-full text-ink"
        >
          {paused ? <Play className="h-1/2 w-1/2" /> : <Pause className="h-1/2 w-1/2" />}
        </button>
        {i < 0 && <NextArrow onClick={() => nextRef.current()} label="Start" />}
      </div>
    </SceneStage>
  );
}
