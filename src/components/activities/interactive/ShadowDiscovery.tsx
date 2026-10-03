"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { AgeVariant, InteractiveStep } from "@/types/activity";
import { useActivity, type StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { Milo } from "@/components/characters/Milo";
import { Art } from "@/components/art/Art";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { NextArrow, PaperButton } from "@/components/scrapbook/primitives";
import { SceneStage } from "@/components/world/SceneStage";
import { Backdrop } from "@/components/activities/steps/Backdrop";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";

/**
 * SHADOW MYSTERY — Part 2: experiment.
 * Drag Milo between the lamp and the wall. Closer to the lamp → bigger
 * shadow. Raise a wing, turn around. Milo asks; he doesn't explain.
 */
export function ShadowDiscovery({ step, band, onDone }: StepProps<InteractiveStep>) {
  const { answer } = useActivity();
  const goal = pick((step.props?.goal as AgeVariant<string>) ?? "Can you make it BIG?", band);
  const milo = useSpeech("milo", { expression: "curious" });
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0.5); // 0 = by the lamp, 1 = by the wall
  const [wing, setWing] = useState(false);
  const [turned, setTurned] = useState(false);
  const [tries, setTries] = useState(0);
  const [madeBig, setMadeBig] = useState(false);
  const dragging = useRef(false);
  const lastZone = useRef<"near" | "mid" | "far">("mid");

  useEffect(() => {
    milo.say(goal, { expression: "curious", action: "headTilt", holdMs: 6000 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Shadow size: big near the lamp, about life-size near the wall.
  const shadowScale = 1 + (1 - pos) * 1.6;

  const react = (p: number) => {
    const zone = p < 0.28 ? "near" : p > 0.72 ? "far" : "mid";
    if (zone === lastZone.current) return;
    lastZone.current = zone;
    setTries((t) => t + 1);
    if (zone === "near") {
      void sound.play("boing", { rate: 0.8 });
      milo.say(madeBig ? "HUGE again!" : "Whoa! Mine got HUGE!", { expression: "surprised", action: "stumble" });
      if (!madeBig) answer(step.id, true, tries + 1);
      setMadeBig(true);
    } else if (zone === "far") {
      void sound.play("squeak");
      milo.say("Now it's small. What did I do?", { expression: "confused", action: "headTilt" });
    } else {
      milo.say("What happened?", { expression: "thinking", action: "idle" });
    }
  };

  const move = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setPos(p);
    react(p);
  };

  const enough = madeBig && tries >= 2;

  return (
    <SceneStage>
      <Backdrop k="shadow-wall" />
      {/* lamp on the left */}
      <div className="absolute top-[22%] left-[2%] w-[13%]">
        <Art k="lamp-glow" className="h-auto w-full" />
      </div>
      {/* the wall the shadow falls on */}
      <div className="absolute top-[4%] right-[3%] bottom-[24%] w-[30%] rounded-sm bg-paper/40" />

      {/* shadow on the wall */}
      <motion.div
        className="absolute right-[13%] bottom-[24%] w-[10%] opacity-40"
        animate={{ scale: shadowScale }}
        style={{ transformOrigin: "50% 100%" }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
      >
        <Milo silhouette action={wing ? "wingsUp" : "idle"} flip={turned} className="h-auto w-full" />
      </motion.div>

      {/* draggable Milo */}
      <div ref={track} className="absolute right-[36%] bottom-[6%] left-[16%] h-[58%]">
        <motion.div
          className="absolute bottom-0 w-[30%] cursor-grab touch-none active:cursor-grabbing"
          style={{ left: `${pos * 70}%` }}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            dragging.current = true;
          }}
          onPointerMove={(e) => dragging.current && move(e.clientX)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
          role="slider"
          aria-label="Move Milo closer or farther from the lamp"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos * 100)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") (setPos((p) => Math.max(0, p - 0.1)), react(Math.max(0, pos - 0.1)));
            if (e.key === "ArrowRight") (setPos((p) => Math.min(1, p + 0.1)), react(Math.min(1, pos + 0.1)));
          }}
        >
          <div className="pointer-events-none absolute bottom-[96%] left-[10%] w-[230%] max-w-[22rem]">
            <SpeechBubble text={milo.text} size="sm" />
          </div>
          <Milo expression={milo.expression} action={wing ? "wingsUp" : milo.action} talking={milo.talking} flip={turned} className="h-auto w-full" />
          <span className="font-hand pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 text-[1.2rem] whitespace-nowrap text-ink-soft">← drag me →</span>
        </motion.div>
      </div>

      {/* simple experiments */}
      <div className="absolute bottom-[4%] left-1/2 flex -translate-x-1/2 gap-3">
        <PaperButton
          onClick={() => {
            setWing((w) => !w);
            setTries((t) => t + 1);
            milo.say(wing ? "Wing down." : "My shadow waved too!", { expression: "surprised" });
          }}
        >
          {wing ? "Wing down" : "Raise wing"}
        </PaperButton>
        <PaperButton
          onClick={() => {
            setTurned((t) => !t);
            setTries((t) => t + 1);
            milo.say("It turned around too. Copycat.", { expression: "suspicious" });
          }}
        >
          Turn around
        </PaperButton>
      </div>

      {enough && (
        <div className="absolute right-[3%] bottom-[5%] z-30">
          <NextArrow onClick={onDone} />
        </div>
      )}
    </SceneStage>
  );
}
