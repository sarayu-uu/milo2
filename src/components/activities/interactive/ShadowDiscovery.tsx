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
  const [pos, setPos] = useState(0.5); // Milo: 0 = left end, 1 = by the wall
  const [torch, setTorch] = useState(0); // torch: 0 = far left, 1 = as far right as it slides
  const torchTrack = useRef<HTMLDivElement>(null);
  const torchDrag = useRef<{ x: number; moved: boolean } | null>(null);
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

  // Stage positions (% of width) of the torch's lens and Milo's middle.
  const torchAt = (t: number) => 8.5 + 16 * t;
  const miloAt = (p: number) => 26.7 + 29.6 * p;
  // Closer together → bigger shadow (whichever of them moves).
  const scaleFor = (p: number, t: number) => Math.min(2.4, Math.max(0.95, 0.4 + 36 / Math.max(3, miloAt(p) - torchAt(t))));
  const shadowScale = scaleFor(pos, torch);
  // The light moves one way, the shadow slides the other (and follows Milo a little).
  const shadowShift = Math.max(-40, Math.min(40, -(torch - 0.3) * 50 + (pos - 0.5) * 20));
  // keep them from overlapping
  const minPos = (t: number) => Math.max(0, (torchAt(t) + 12 - 26.7) / 29.6);
  const maxTorch = (p: number) => Math.min(1, Math.max(0, (miloAt(p) - 12 - 8.5) / 16));

  const react = (scale: number) => {
    const zone = scale >= 1.8 ? "near" : scale <= 1.2 ? "far" : "mid";
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
    const p = Math.min(1, Math.max(minPos(torch), (clientX - r.left) / r.width));
    setPos(p);
    react(scaleFor(p, torch));
  };

  const moveTorch = (clientX: number) => {
    const r = torchTrack.current!.getBoundingClientRect();
    const t = Math.min(maxTorch(pos), Math.max(0, (clientX - r.left) / r.width - 0.45));
    setTorch(t);
    react(scaleFor(pos, t));
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
      {/* the wall the shadow falls on: a bright patch where the torch hits it */}
      <div
        className="absolute top-[4%] right-[3%] bottom-[24%] w-[30%] overflow-hidden rounded-sm"
        style={{ background: lit ? "radial-gradient(ellipse at 50% 70%, #fffaea 0%, #f6ead0 60%, #eadcbd 100%)" : "#e6dcc6" }}
      >
        {/* Milo's shadow (no light, no shadow) */}
        {lit && (
          <motion.div
            className="absolute bottom-0 w-[62%] -translate-x-1/2"
            animate={{ scale: shadowScale, left: `${50 + shadowShift}%` }}
            style={{ transformOrigin: "50% 100%", opacity: 0.82, filter: "blur(1.5px)" }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
          >
            <Milo silhouette action={wing ? "wingsUp" : "idle"} flip={turned} className="h-auto w-full" />
          </motion.div>
        )}
      </div>

      {/* the torch, lying on the floor: slide it along, or tap to switch off */}
      <div ref={torchTrack} className="pointer-events-none absolute bottom-[16%] left-[1%] h-0 w-[16%]">
        <button
          type="button"
          aria-label={lit ? "Torch: slide it, or tap to switch it off" : "Switch the torch on"}
          className="pointer-events-auto absolute bottom-0 z-10 w-[93.75%] cursor-grab touch-none active:cursor-grabbing"
          style={{ left: `${torch * 100}%` }}
          onPointerDown={(e) => {
            if (!lit) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            torchDrag.current = { x: e.clientX, moved: false };
          }}
          onPointerMove={(e) => {
            const d = torchDrag.current;
            if (!d) return;
            if (Math.abs(e.clientX - d.x) > 6) d.moved = true;
            if (d.moved) moveTorch(e.clientX);
          }}
          onPointerUp={() => {
            const d = torchDrag.current;
            torchDrag.current = null;
            if (!d?.moved) switchTorch(); // a tap, not a slide
          }}
          onPointerCancel={() => (torchDrag.current = null)}
          onKeyDown={(e) => {
            const nudge = e.key === "ArrowLeft" ? -0.15 : e.key === "ArrowRight" ? 0.15 : 0;
            if (nudge) {
              const t = Math.min(maxTorch(pos), Math.max(0, torch + nudge));
              setTorch(t);
              react(scaleFor(pos, t));
            }
            if (e.key === "Enter" || e.key === " ") (e.preventDefault(), switchTorch());
          }}
        >
          <Art k={lit ? "torch-glow" : "torch"} className="h-auto w-full" />
        </button>
      </div>

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
          // help hand: first toward the torch (big), then away (small)
          data-hint={!lit ? undefined : !madeBig ? "drag-left" : !enough ? "drag-right" : undefined}
          data-hint-priority="1"
          role="slider"
          aria-label="Move Milo closer or farther from the torch"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos * 100)}
          tabIndex={0}
          onKeyDown={(e) => {
            const nudge = e.key === "ArrowLeft" ? -0.1 : e.key === "ArrowRight" ? 0.1 : 0;
            if (nudge) {
              const p = Math.min(1, Math.max(minPos(torch), pos + nudge));
              setPos(p);
              react(scaleFor(p, torch));
            }
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
          data-hint="tap"
          data-hint-priority="2"
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
