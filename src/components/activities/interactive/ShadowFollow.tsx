"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { InteractiveStep } from "@/types/activity";
import type { StepProps } from "@/features/activities/ActivityContext";
import { Milo } from "@/components/characters/Milo";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { NextArrow } from "@/components/scrapbook/primitives";
import { SceneStage } from "@/components/world/SceneStage";
import { Backdrop } from "@/components/activities/steps/Backdrop";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";
import { recordingDuration } from "@/lib/audio/recordings";
import type { CharacterAction, Expression } from "@/types/character";

/**
 * SHADOW MYSTERY — Part 1.
 * Milo walks; something follows. He stops; it stops. He turns around:
 * nothing obvious. Then the child moves Milo and the shadow follows,
 * until Milo notices the child has one too.
 */
type Beat = { x: number; text: string; action: CharacterAction; expression: Expression; flip?: boolean; wait: number };

const SCRIPT: Beat[] = [
  { x: 22, text: "La la la. Just walking.", action: "walk", expression: "happy", wait: 1800 },
  { x: 40, text: "…", action: "idle", expression: "neutral", wait: 1300 },
  { x: 40, text: "Wait.", action: "lookRight", expression: "suspicious", wait: 1500 },
  { x: 58, text: "Hmm.", action: "walk", expression: "suspicious", wait: 1700 },
  { x: 58, text: "…", action: "idle", expression: "suspicious", flip: true, wait: 1400 },
  { x: 46, text: "I'm walking backwards. Nothing can follow me now.", action: "walk", expression: "thinking", flip: true, wait: 2300 },
  { x: 46, text: "Why does this pigeon keep following me?", action: "headTilt", expression: "confused", wait: 1800 },
];

export function ShadowFollow({ onDone }: StepProps<InteractiveStep>) {
  useEffect(() => sound.preload(["vo-shadow-la-la-la", "vo-shadow-wait", "vo-shadow-walking-backwards", "vo-shadow-keep-following-me", "vo-shadow-can-you-move-me"]), []);
  const [beat, setBeat] = useState(0);
  const [x, setX] = useState(6);
  const [phase, setPhase] = useState<"story" | "play" | "reveal">("story");
  const [moves, setMoves] = useState(0);
  const milo = useSpeech("milo", { expression: "happy" });
  const stage = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = useState(false);
  const [canLeave, setCanLeave] = useState(false);
  const beatAt = useRef(0);
  const heardReveal = useRef(false);

  const advance = () => {
    if (beat + 1 < SCRIPT.length) setBeat(beat + 1);
    else {
      setPhase("play");
      milo.say("Can you move me? Tap where I should go.", { expression: "curious", action: "idle", holdMs: Infinity });
    }
  };

  // scripted part
  useEffect(() => {
    if (phase !== "story") return;
    const b = SCRIPT[beat];
    setX(b.x);
    setFlip(!!b.flip);
    if (b.action === "walk") void sound.play("footstep");
    beatAt.current = Date.now();
    // never cut a recorded line short
    const wait = Math.max(b.wait, (recordingDuration(b.text, "milo") ?? 0) + 400);
    milo.say(b.text, { action: b.action, expression: b.expression, holdMs: wait + 600, silent: b.text === "…" });
    const t = setTimeout(advance, wait);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat, phase]);

  // After "You have one too?!" has been said, a tap anywhere moves on.
  useEffect(() => {
    if (phase !== "reveal") return;
    if (milo.talking) heardReveal.current = true;
    else if (heardReveal.current) setCanLeave(true);
  }, [phase, milo.talking]);
  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(() => setCanLeave(true), 5000); // sound off / voice never started
    return () => clearTimeout(t);
  }, [phase]);

  const tapStage = (e: React.PointerEvent) => {
    // story: a tap skips ahead to the next line (not by accident straight away)
    if (phase === "story") {
      if (Date.now() - beatAt.current > 500) advance();
      return;
    }
    if (phase === "reveal") {
      if (canLeave) onDone();
      return;
    }
    if (phase !== "play") return;
    const r = stage.current!.getBoundingClientRect();
    const nx = Math.min(80, Math.max(6, ((e.clientX - r.left) / r.width) * 100 - 10));
    setFlip(nx < x);
    setX(nx);
    void sound.play("footstep");
    const m = moves + 1;
    setMoves(m);
    milo.say(m === 1 ? "It's following me AGAIN!" : m === 2 ? "It copies everything!" : "Still there…", { action: "walk", expression: m === 1 ? "surprised" : "suspicious" });
    setTimeout(() => milo.pose({ action: "idle" }), 900);
    if (m >= 3) {
      setTimeout(() => {
        setPhase("reveal");
        milo.say("Wait… is that YOURS? You have one too?!", { expression: "surprised", action: "hop", holdMs: Infinity });
      }, 1300);
    }
  };

  return (
    <SceneStage>
      <div ref={stage} className="absolute inset-0" onPointerDown={tapStage}>
        <Backdrop k="pavement" />
        {/* the sun, low and to the left: shadows fall to the right */}
        <svg viewBox="0 0 100 100" className="absolute top-[4%] left-[3%] w-[9%]" aria-hidden>
          <circle cx={50} cy={50} r={26} fill="#d8b45e" />
        </svg>

        <motion.div
          className="absolute bottom-[8%] w-[22%]"
          animate={{ left: `${x}%` }}
          transition={{ type: "spring", stiffness: 40, damping: 14 }}
        >
          {/* the long shadow on the ground: pinned to his feet, falling away from the sun */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ transformOrigin: "55% 96%", transform: "skewX(-58deg) scaleY(0.42)", opacity: 0.55, filter: "blur(1.2px)" }}
          >
            <Milo silhouette action={milo.action} flip={flip} className="h-auto w-full" />
          </div>
          <Milo expression={milo.expression} action={milo.action} talking={milo.talking} flip={flip} className="relative h-auto w-full" />
          <div className="pointer-events-none absolute bottom-[96%] left-[20%] w-[200%] max-w-[26rem]">
            <SpeechBubble text={milo.text} />
          </div>
        </motion.div>

        {/* where the help hand points: an empty bit of pavement to tap */}
        {(phase === "play" || (phase === "reveal" && canLeave)) && (
          <div
            className="pointer-events-none absolute bottom-[14%] h-[10%] w-[6%]"
            style={{ left: `${x < 45 ? x + 38 : x - 22}%` }}
            data-hint="tap"
            data-hint-priority="1"
            aria-hidden
          />
        )}
        {phase === "play" && (
          <div className="font-hand pointer-events-none absolute right-[4%] bottom-[30%] rotate-[-4deg] text-[1.6rem] text-ink-soft">tap anywhere ↓</div>
        )}
      </div>
      {phase === "reveal" && (
        <div className="absolute right-[3%] bottom-[5%] z-30">
          <NextArrow onClick={onDone} />
        </div>
      )}
    </SceneStage>
  );
}
