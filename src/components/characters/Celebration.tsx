"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import type { CelebrationType } from "@/types/activity";
import type { CharacterAction, Expression } from "@/types/character";
import { Milo } from "./Milo";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { sound } from "@/lib/audio/soundManager";
import { speak } from "@/lib/audio/voice";
import { analytics } from "@/lib/analytics/analytics";

/**
 * Celebrations: the character's reaction IS the reward.
 * Short (≈0.7–1.5s), soft sounds, no confetti, no flashing.
 */
const SCRIPT: Record<Exclude<CelebrationType, "highFive">, { action: CharacterAction; expression: Expression; line: string; ms: number }> = {
  thumbsUp: { action: "thumbsUp", expression: "proud", line: "Nice!", ms: 1500 },
  clap: { action: "clap", expression: "happy", line: "We got it!", ms: 1300 },
  wingsUp: { action: "wingsUp", expression: "happy", line: "Yesss!", ms: 1300 },
  waddle: { action: "waddle", expression: "happy", line: "Happy dance!", ms: 1400 },
  bellyPuff: { action: "bellyPuff", expression: "proud", line: "Whoa—!", ms: 1600 },
};

export function Celebration({
  type,
  line,
  activityId = null,
  onDone,
  className = "",
}: {
  type: CelebrationType;
  line?: string;
  activityId?: string | null;
  onDone?: () => void;
  className?: string;
}) {
  useEffect(() => {
    analytics.track("celebration_triggered", { activityId, celebration: type });
  }, [activityId, type]);

  if (type === "highFive") return <HighFive line={line} activityId={activityId} onDone={onDone} className={className} />;
  return <SimpleCelebration type={type} line={line} onDone={onDone} className={className} />;
}

function SimpleCelebration({ type, line, onDone, className }: { type: Exclude<CelebrationType, "highFive">; line?: string; onDone?: () => void; className: string }) {
  const s = SCRIPT[type];
  const text = line ?? s.line;
  useEffect(() => {
    speak(text, "milo");
    const timers: ReturnType<typeof setTimeout>[] = [];
    // sounds synced to the animation's contact points
    if (type === "clap") [250, 750].forEach((ms) => timers.push(setTimeout(() => void sound.play("clap"), ms)));
    if (type === "thumbsUp") timers.push(setTimeout(() => void sound.play("wood-click"), 350));
    if (type === "wingsUp") timers.push(setTimeout(() => void sound.play("bell"), 300));
    if (type === "waddle") [0, 300, 600, 900].forEach((ms) => timers.push(setTimeout(() => void sound.play("footstep"), ms)));
    if (type === "bellyPuff") {
      timers.push(setTimeout(() => void sound.play("boing"), 350));
      timers.push(setTimeout(() => void sound.play("pop"), 1200));
    }
    timers.push(setTimeout(() => onDone?.(), s.ms + 900));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute bottom-[92%] left-[30%] w-[120%]">
        <SpeechBubble text={text} size="lg" />
      </div>
      <Milo expression={s.expression} action={s.action} className="h-auto w-full" />
    </div>
  );
}

/**
 * HIGH FIVE — an explicit, interactive gesture.
 * Milo turns to the child, says "High five!", brings a big wing forward
 * and shows a clear touch target. The child's tap completes it.
 */
export function HighFive({ line, activityId, onDone, className = "" }: { line?: string; activityId: string | null; onDone?: () => void; className?: string }) {
  const [phase, setPhase] = useState<"ask" | "hit" | "done">("ask");
  const [text, setText] = useState("HIGH FIVE!");
  const squash = useAnimationControls();
  const askedAt = useRef(Date.now());
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    sound.preload(["slap"]);
    speak("High five!", "milo");
    askedAt.current = Date.now();
    // Gentle fallback so nobody gets stuck: Milo settles for an "air five".
    const t = setTimeout(() => {
      if (phaseRef.current !== "ask") return;
      setPhase("done");
      setText("Air five! That counts.");
      speak("Air five! That counts.", "milo");
      setTimeout(() => onDone?.(), 1600);
    }, 12000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hit = () => {
    if (phase !== "ask") return;
    setPhase("hit");
    void sound.play("slap");
    analytics.track("high_five_completed", { activityId, reactionMs: Date.now() - askedAt.current });
    void squash.start({ scaleX: [1, 1.1, 0.96, 1], scaleY: [1, 0.88, 1.04, 1], transition: { duration: 0.35 } });
    const msg = line ?? "Yes! Good one!";
    setText(msg);
    setTimeout(() => speak(msg, "milo"), 250);
    setTimeout(() => setPhase("done"), 450);
    setTimeout(() => onDone?.(), 1700);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute bottom-[92%] left-[38%] w-[120%]">
        <SpeechBubble text={text} size="lg" />
      </div>
      <motion.div animate={squash} style={{ originY: 1 }}>
        <Milo
          expression={phase === "ask" ? "happy" : "proud"}
          action={phase === "done" ? "wingsUp" : "highFive"}
          onWingTap={hit}
          className="h-auto w-full"
        />
      </motion.div>
      {phase === "ask" && (
        <motion.button
          type="button"
          aria-label="High five Milo!"
          onClick={hit}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="target-ring absolute aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: "35%", top: "43%" }}
        >
          <span className="font-hand pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 text-[1.4rem] whitespace-nowrap text-coral">tap!</span>
        </motion.button>
      )}
    </div>
  );
}
