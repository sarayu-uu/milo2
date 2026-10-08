"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CastMember, StoryStep } from "@/types/activity";
import type { CharacterId } from "@/types/character";
import type { StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { Character } from "@/components/characters/Character";
import { Art } from "@/components/art/Art";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { NextArrow } from "@/components/scrapbook/primitives";
import { SceneStage } from "@/components/world/SceneStage";
import { CHARACTERS } from "@/data/characters";
import { speak } from "@/lib/audio/voice";
import { recordingDuration } from "@/lib/audio/recordings";
import { sound } from "@/lib/audio/soundManager";
import { Backdrop } from "./Backdrop";

/** Story lines move on by themselves: at least this long after a line starts… */
const AUTO_MIN_MS = 5000;
/** …and never sooner than this after Milo stops talking. */
const AFTER_LINE_MS = 1500;

/**
 * A data-driven story scene: backdrop + cast + props, advanced beat by beat.
 * Each beat can change expressions/actions/positions, show/hide props,
 * play a sound, and hold a comedic pause before the next arrow appears.
 */
export function StoryStage({ step, band, onDone }: StepProps<StoryStep>) {
  const [beat, setBeat] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const [talking, setTalking] = useState(false);

  // Fold beats 0..current over the initial cast/props to get the scene state.
  const scene = useMemo(() => {
    const cast = new Map<CharacterId, CastMember>(step.cast.map((c) => [c.id, { ...c }]));
    const visible = new Set((step.props ?? []).filter((p) => !p.hidden).map((p) => p.id));
    for (let i = 0; i <= beat; i++) {
      const b = step.beats[i];
      Object.entries(b.actors ?? {}).forEach(([id, patch]) => {
        const c = cast.get(id as CharacterId);
        if (c) cast.set(c.id, { ...c, ...patch });
      });
      b.show?.forEach((id) => visible.add(id));
      b.hide?.forEach((id) => visible.delete(id));
    }
    return { cast: [...cast.values()], visible };
  }, [beat, step]);

  const current = step.beats[beat];
  const nextRef = useRef<() => void>(() => {});
  const text = pick(current.text, band);

  useEffect(() => {
    setCanNext(false);
    setTalking(false);
    if (current.sfx) void sound.play(current.sfx);
    let live = true;
    const talkMs = Math.min(2600, 400 + text.length * 50);
    let t1: ReturnType<typeof setTimeout> | undefined;
    let t3: ReturnType<typeof setTimeout> | undefined;
    const startedAt = Date.now();
    // Kids can tap ahead whenever they like; otherwise the story carries on.
    const armAuto = (delay?: number) => {
      if (!live || t3) return;
      t3 = setTimeout(() => nextRef.current(), delay ?? Math.max(AUTO_MIN_MS - (Date.now() - startedAt), AFTER_LINE_MS));
    };
    const stop = () => {
      if (!live) return;
      setTalking(false);
      armAuto();
    };
    // The beak starts when the voice is actually audible, and stops when it ends.
    const audible =
      !!text &&
      text !== "…" &&
      speak(text, current.speaker, {
        onStart: () => {
          if (!live) return;
          setTalking(true);
          // backup in case the end is never reported: the clip's real length (long, slow lines too)
          t1 = setTimeout(stop, (recordingDuration(text, current.speaker) ?? talkMs) + 1500);
        },
        onEnd: stop,
      });
    if (!audible && text && text !== "…") {
      // sound off: animate for roughly the line's length
      setTalking(true);
      t1 = setTimeout(stop, talkMs);
    }
    const t2 = setTimeout(() => setCanNext(true), Math.max(650, current.pause ?? 0));
    // a silent beat ("…"): keep the comic timing snappy
    if (!text || text === "…") armAuto(Math.max(650, current.pause ?? 0) + 1000);
    return () => {
      live = false;
      if (t1) clearTimeout(t1);
      if (t3) clearTimeout(t3);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat]);

  const advance = () => {
    if (beat + 1 < step.beats.length) setBeat(beat + 1);
    else onDone();
  };
  const next = () => {
    if (canNext) advance();
  };
  nextRef.current = advance;

  const speaker = current.speaker === "narrator" ? null : scene.cast.find((c) => c.id === current.speaker);
  const bubbleX = speaker ? Math.min(62, Math.max(4, speaker.x - 6)) : 30;

  return (
    <SceneStage>
      <button type="button" aria-label="Continue the story" className="absolute inset-0 cursor-default" onClick={next}>
        <Backdrop k={step.backdrop} />

        {(step.props ?? []).filter((p) => !p.front).map((p) => (
          <AnimatePresence key={p.id}>
            {scene.visible.has(p.id) && (
              <motion.div
                className="absolute"
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}%`, translateX: "-50%", rotate: p.rotate ?? 0 }}
                initial={p.grow ? { opacity: 0, scaleX: 0.15, scaleY: 0.3, y: 0 } : { opacity: 0, scale: 0.6, y: 20 }}
                animate={p.grow ? { opacity: 1, scaleX: 1, scaleY: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={p.grow ? { duration: 1.4, ease: "easeOut" } : { type: "spring", stiffness: 260, damping: 18 }}
              >
                <Art k={p.art} silhouette={p.silhouette} className="h-auto w-full" />
              </motion.div>
            )}
          </AnimatePresence>
        ))}

        {scene.cast.map((c) => (
          <CastFigure key={c.id} c={c} talking={talking && current.speaker === c.id} />
        ))}

        {(step.props ?? []).filter((p) => p.front).map((p) => (
          <AnimatePresence key={p.id}>
            {scene.visible.has(p.id) && (
              <motion.div
                className="absolute"
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}%`, translateX: "-50%", rotate: p.rotate ?? 0 }}
                initial={p.grow ? { opacity: 0, scaleX: 0.15, scaleY: 0.3, y: 0 } : { opacity: 0, scale: 0.6, y: 20 }}
                animate={p.grow ? { opacity: 1, scaleX: 1, scaleY: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={p.grow ? { duration: 1.4, ease: "easeOut" } : { type: "spring", stiffness: 260, damping: 18 }}
              >
                <Art k={p.art} silhouette={p.silhouette} className="h-auto w-full" />
              </motion.div>
            )}
          </AnimatePresence>
        ))}

      </button>

      {/* speech */}
      <div className="pointer-events-none absolute top-[5%] z-40 w-[36%]" style={{ left: `${bubbleX}%` }}>
        <SpeechBubble
          text={text}
          tail={current.speaker === "narrator" ? "none" : "bottom-left"}
          speakerName={current.speaker !== "milo" && current.speaker !== "narrator" ? CHARACTERS[current.speaker].name : undefined}
        />
      </div>

      <AnimatePresence>
        {canNext && (
          <motion.div className="absolute right-[3%] bottom-[5%] z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <NextArrow onClick={next} label={beat + 1 < step.beats.length ? "Next" : "Continue"} />
          </motion.div>
        )}
      </AnimatePresence>
    </SceneStage>
  );
}

function CastFigure({ c, talking }: { c: CastMember; talking: boolean }) {
  const size = c.size ?? 48;
  return (
    <AnimatePresence>
      {!c.hidden && (
        <motion.div
          className="pointer-events-none absolute bottom-[6%]"
          style={{ height: `${size}%`, aspectRatio: "1.1 / 1", translateX: "-50%" }}
          initial={{ opacity: 0, left: `${c.x + (c.flip ? 12 : -12)}%` }}
          animate={{ opacity: 1, left: `${c.x}%` }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
        >
          {c.shadow === "wall" && (
            // projected on the wall: bigger, softer, mimicking every move
            <div className="absolute bottom-[22%] left-[62%] h-[130%] w-[130%]" style={{ opacity: 0.6, filter: "blur(1.5px)" }}>
              <Character id={c.id} silhouette expression={c.expression} action={c.action} flip={!c.flip} className="h-full w-full" />
            </div>
          )}
          {c.shadow === "floor" && (
            <div className="absolute -bottom-[4%] left-[10%] h-[30%] w-[80%] opacity-25" style={{ transform: "scaleY(0.35) skewX(-30deg)" }}>
              <Character id={c.id} silhouette action={c.action} flip={c.flip} className="h-full w-full" />
            </div>
          )}
          <Character id={c.id} expression={c.expression} action={c.action} flip={c.flip} talking={talking} className="relative h-full w-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
