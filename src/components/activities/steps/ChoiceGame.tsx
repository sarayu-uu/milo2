"use client";

import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import { Volume2 } from "lucide-react";
import type { ChoiceStep } from "@/types/activity";
import { useActivity, type StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { Art } from "@/components/art/Art";
import { Paper, Sticker } from "@/components/scrapbook/primitives";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";
import { speak } from "@/lib/audio/voice";
import { recordingDuration } from "@/lib/audio/recordings";
import { sayAloudLine } from "@/features/activities/spokenLines";
import { StepFrame } from "./StepFrame";

/**
 * Pick from options where several can be right.
 * Finding one that fits is celebrated; finding another is celebrated too.
 */
export function ChoiceGame({ step, band, onDone }: StepProps<ChoiceStep>) {
  const { answer } = useActivity();
  const speaker = step.speaker ?? "milo";
  const voice = useSpeech(speaker, { expression: "curious" });
  const options = band === "younger" && step.options.length > 4 && !step.tapAll ? step.options.slice(0, 4) : step.options;
  const need = step.tapAll ? options.length : pick(step.findCount ?? 1, band);
  const [found, setFound] = useState<string[]>([]);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    voice.say(pick(step.prompt, band));
    // a listening round: the sound plays once Milo has finished asking
    const asked = (recordingDuration(pick(step.prompt, band), speaker) ?? 2000) + 400;
    const t = step.sound ? setTimeout(() => void sound.play(step.sound!), asked) : undefined;
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = found.length >= need;

  const choose = (o: ChoiceStep["options"][number]) => {
    // already solved, or tapped before: just hear what it's about again
    if (done || found.includes(o.label)) {
      if (o.reaction) voice.say(o.reaction, { expression: "curious", action: "idle" });
      return;
    }
    if (step.tapAll) {
      const next = [...found, o.label];
      setFound(next);
      answer(step.id, true, next.length);
      void sound.play(o.fits ? "pop" : "bell");
      voice.say(o.reaction ?? "", { expression: o.fits ? "suspicious" : "happy", action: next.length >= need ? "wingsUp" : "headTilt" });
      return;
    }
    const t = tries + 1;
    setTries(t);
    answer(step.id, o.fits, t);
    if (o.fits) {
      void sound.play("bell");
      const next = [...found, o.label];
      setFound(next);
      const more = next.length < need ? " Can you find another?" : "";
      voice.say((o.reaction ?? "That fits!") + more, { expression: "happy", action: next.length >= need ? "wingsUp" : "idle" });
    } else {
      void sound.play("wrong-gentle");
      voice.say(o.reaction ?? "Hmm, I'm not sure that one fits.", { expression: "thinking", action: "headTilt" });
    }
  };

  return (
    <StepFrame speaker={speaker} line={voice.text} expression={voice.expression} action={voice.action} talking={voice.talking} onNext={done ? onDone : null}>
      <div className="flex w-full flex-col items-center gap-[5vh]">
        {step.sayAloud && (
          <button
            type="button"
            onClick={() => speak(sayAloudLine(step.sayAloud!), speaker)}
            className="paper font-display inline-flex min-h-[var(--touch-min)] items-center gap-3 px-6 py-2 text-[2.4rem]"
            aria-label={`Hear the sound ${step.sayAloud}`}
          >
            <Volume2 className="h-7 w-7" /> {step.sayAloud}…
          </button>
        )}
        {step.sound && (
          <button
            type="button"
            onClick={() => void sound.play(step.sound!)}
            className="paper inline-flex h-[var(--touch-big)] w-[var(--touch-big)] items-center justify-center rounded-full"
            aria-label="Hear the sound again"
            data-hint={found.length === 0 ? "tap" : undefined}
          >
            <Volume2 className="h-1/2 w-1/2" />
          </button>
        )}
        {step.focus && (
          <Paper className="flex aspect-square w-[clamp(6rem,14vw,11rem)] items-center justify-center p-3" tilt={-2} tape="top">
            <Art k={step.focus.art} silhouette={step.focus.silhouette} className="h-full w-full" />
          </Paper>
        )}
        <div className="flex w-full flex-wrap justify-center gap-[3%]">
          {options.map((o, i) => (
            <Option
              key={o.label}
              index={i}
              art={o.art}
              label={o.label}
              scale={o.scale}
              showLabel={!step.noLabels}
              picked={found.includes(o.label)}
              onPick={() => choose(o)}
              fits={o.fits || !!step.tapAll}
              mark={step.tapAll ? (o.fits ? "maybe" : "out") : "yes"}
            />
          ))}
        </div>
      </div>
    </StepFrame>
  );
}

function Option({
  art,
  label,
  picked,
  onPick,
  fits,
  index,
  scale = 1,
  showLabel = true,
  mark = "yes",
}: {
  art: string;
  label: string;
  picked: boolean;
  onPick: () => void;
  fits: boolean;
  index: number;
  scale?: number;
  showLabel?: boolean;
  /** The sticker once picked: a tick, a cross (ruled out) or a "?" (still a suspect). */
  mark?: "yes" | "out" | "maybe";
}) {
  const controls = useAnimationControls();
  return (
    <motion.button
      type="button"
      aria-label={label}
      data-hint={picked ? undefined : "tap"}
      data-hint-priority="1"
      animate={controls}
      whileTap={{ scale: 0.92 }}
      onClick={() => {
        if (!fits) void controls.start({ rotate: [0, -6, 6, -3, 0], transition: { duration: 0.45 } });
        onPick();
      }}
      className="relative w-[clamp(6.5rem,13vw,10.5rem)]"
      style={{ rotate: `${[-2, 1.5, -1, 2, -1.5][index % 5]}deg` }}
    >
      <Paper className="flex flex-col items-center p-[8%]">
        {/* the box stays the same size; `scale` shrinks the picture inside it (big vs little) */}
        <div className="flex aspect-square w-full items-end justify-center">
          <div style={{ width: `${scale * 100}%` }}>
            <Art k={art} className="h-auto w-full" />
          </div>
        </div>
        {showLabel && <span className="font-display mt-1 text-[1.35rem] leading-none">{label}</span>}
      </Paper>
      {picked && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-3 -right-3">
          <Sticker className="h-12 w-12" color={mark === "out" ? "#df917a" : mark === "maybe" ? "#d8b45e" : "#92b97e"}>
            <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
              {mark === "out" ? (
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#fbf8f1" strokeWidth={3.5} strokeLinecap="round" />
              ) : mark === "maybe" ? (
                <text x={12} y={19} textAnchor="middle" fontSize={20} fontWeight={800} fill="#fbf8f1">?</text>
              ) : (
                <path d="M5 12l4 4 10-10" fill="none" stroke="#fbf8f1" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </Sticker>
        </motion.span>
      )}
    </motion.button>
  );
}
