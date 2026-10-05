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

/** What Milo says when the torch goes off (in turn). */
const DARK_LINES = ["Who turned off the sun?!", "Shadow? Shadow, where did you go?", "I can't see my toes. Are they still there?"];

/**
 * SHADOW MYSTERY — Part 2: experiment.
 * Drag Milo between the torch and the wall. Closer to the torch → bigger
 * shadow. Raise a wing, turn around, switch the torch off (no light, no
 * shadow: only Milo's eyes are left). Milo asks; he doesn't explain.
 */
export function ShadowDiscovery({ step, band, onDone }: StepProps<InteractiveStep>) {
  const { answer } = useActivity();
  const goal = pick((step.props?.goal as AgeVariant<string>) ?? "Can you make it BIG?", band);
  const milo = useSpeech("milo", { expression: "curious" });
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0.5); // 0 = by the torch, 1 = by the wall
  const [wing, setWing] = useState(false);
  const [turned, setTurned] = useState(false);
  const [lit, setLit] = useState(true);
  const [tries, setTries] = useState(0);
  const [madeBig, setMadeBig] = useState(false);
  const dragging = useRef(false);
  const lastZone = useRef<"near" | "mid" | "far">("mid");
  const darkCount = useRef(0);

  useEffect(() => {
    milo.say(goal, { expression: "curious", action: "headTilt", holdMs: 6000 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Shadow size: big near the torch, about life-size near the wall.
  const shadowScale = 1 + (1 - pos) * 1.3;

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

  const switchTorch = () => {
    void sound.play("switch");
    if (lit) {
      setLit(false);
      dragging.current = false;
      milo.say(DARK_LINES[darkCount.current++ % DARK_LINES.length], { expression: "surprised", action: "idle" });
    } else {
      setLit(true);
      setTries((t) => t + 1);
      milo.say("Phew! Light's back… and so is my shadow!", { expression: "happy", action: "hop" });
    }
  };

  const enough = madeBig && tries >= 2;

  return (
    <SceneStage>
      <Backdrop k="shadow-wall" />
      {/* the wall the shadow falls on */}
      <div className="absolute top-[4%] right-[3%] bottom-[24%] w-[30%] rounded-sm bg-paper/40" />

      {/* shadow on the wall (no light, no shadow) */}
      {lit && (
        <motion.div
          className="absolute right-[12%] bottom-[24%] w-[13%] opacity-40"
          animate={{ scale: shadowScale }}
          style={{ transformOrigin: "50% 100%" }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
        >
          <Milo silhouette action={wing ? "wingsUp" : "idle"} flip={turned} className="h-auto w-full" />
        </motion.div>
      )}

      {/* the torch, lying on the floor: tap to switch off */}
      <button
        type="button"
        aria-label={lit ? "Switch the torch off" : "Switch the torch on"}
        onClick={switchTorch}
        className="absolute bottom-[16%] left-[1%] z-10 w-[15%]"
      >
        <Art k={lit ? "torch-glow" : "torch"} className="h-auto w-full" />
      </button>

      {/* draggable Milo */}
      <div ref={track} className="absolute right-[33%] bottom-[6%] left-[16%] h-[72%]">
        <motion.div
          className="absolute bottom-0 z-30 w-[42%] cursor-grab touch-none active:cursor-grabbing"
          style={{ left: `${pos * 58}%` }}
          onPointerDown={(e) => {
            if (!lit) return;
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            dragging.current = true;
          }}
          onPointerMove={(e) => dragging.current && move(e.clientX)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
          role="slider"
          aria-label="Move Milo closer or farther from the torch"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos * 100)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") (setPos((p) => Math.max(0, p - 0.1)), react(Math.max(0, pos - 0.1)));
            if (e.key === "ArrowRight") (setPos((p) => Math.min(1, p + 0.1)), react(Math.min(1, pos + 0.1)));
          }}
        >
          <div className="pointer-events-none absolute bottom-[92%] left-[10%] w-[180%] max-w-[22rem]">
            <SpeechBubble text={milo.text} size="sm" />
          </div>
          {/* lights out: only his eyes are left */}
          <div className={lit ? undefined : "eyes-only"}>
            <Milo expression={milo.expression} action={wing ? "wingsUp" : milo.action} talking={milo.talking} flip={turned} className="h-auto w-full" />
          </div>
          {lit && (
            <span className="font-hand pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 text-[1.2rem] whitespace-nowrap text-ink-soft">← drag me →</span>
          )}
        </motion.div>
      </div>

      {/* simple experiments */}
      <div className="absolute top-[4%] left-1/2 flex -translate-x-1/2 gap-3">
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

      {/* the dark: tap anywhere to switch the torch back on */}
      {!lit && (
        <motion.button
          type="button"
          aria-label="Switch the torch back on"
          onClick={switchTorch}
          className="absolute inset-0 z-20 cursor-default bg-[#14131c]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.96 }}
          transition={{ duration: 0.12 }}
        />
      )}

      {enough && lit && (
        <div className="absolute right-[3%] bottom-[5%] z-30">
          <NextArrow onClick={onDone} />
        </div>
      )}
    </SceneStage>
  );
}
