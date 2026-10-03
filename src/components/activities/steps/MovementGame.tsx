"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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

/**
 * Movement game led by a character. No timers or countdowns: a grown-up
 * or child taps on when ready. "FREEZE!" moments are big and obvious.
 */
export function MovementGame({ step, band, onDone }: StepProps<MovementStep>) {
  const [i, setI] = useState(-1);
  const move = i >= 0 ? step.moves[i] : null;
  const text = move ? pick(move.text, band) : pick(step.intro, band);
  const freeze = /freeze/i.test(text);

  useEffect(() => {
    speak(text, step.leader);
    if (freeze) void sound.play("whoosh");
    else if (i >= 0) void sound.play(step.leader === "dog" ? "woof" : "boing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const next = () => (i + 1 < step.moves.length ? setI(i + 1) : onDone());

  return (
    <SceneStage>
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
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <Paper className="flex flex-col items-center gap-3 px-[3rem] py-[2rem]" color={freeze ? "#e9f2f6" : "#fbf8f1"} tape="top">
              {move?.art && <Art k={move.art} className="h-[clamp(5rem,14vh,9rem)] w-[clamp(5rem,14vh,9rem)]" />}
              <span className={`font-display text-center leading-tight text-ink ${freeze ? "text-[4.2rem] tracking-wider" : "text-[2.6rem]"}`}>{text}</span>
            </Paper>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute right-[3%] bottom-[5%]">
        <NextArrow onClick={next} label={i < 0 ? "Start" : "Next move"} />
      </div>
    </SceneStage>
  );
}
