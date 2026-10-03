"use client";

import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import { DndContext, KeyboardSensor, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import type { AgeVariant, InteractiveStep } from "@/types/activity";
import { useActivity, type StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { Art } from "@/components/art/Art";
import { drawObject } from "@/components/art/objects";
import { Paper, Sticker } from "@/components/scrapbook/primitives";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";
import { StepFrame } from "@/components/activities/steps/StepFrame";
import { SHAPE_WORD, SILHOUETTE_FITS } from "./shapes";

type Round = { shape: string; options: string[] };

/**
 * SQUIRREL'S MYSTERY BAG — Shape Detective.
 * A shape pushes against the bag. What could it be? Several answers fit.
 * Drag an object onto the bag, or just tap it.
 */
export function ShapeDetective({ step, band, onDone }: StepProps<InteractiveStep>) {
  const { answer } = useActivity();
  const rounds = pick(step.props?.rounds as AgeVariant<Round[]>, band);
  const [r, setR] = useState(0);
  const [found, setFound] = useState<string[]>([]);
  const [tries, setTries] = useState(0);
  const milo = useSpeech("milo", { expression: "curious" });
  const bagShake = useAnimationControls();
  const round = rounds[r];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor));

  useEffect(() => {
    setFound([]);
    void bagShake.start({ rotate: [0, -3, 3, -2, 0], transition: { duration: 0.6 } });
    void sound.play("paper-rustle");
    milo.say(r === 0 ? "Hmm… what could THIS be?" : "Ooh, another one. What could this be?", { expression: "thinking", action: "headTilt" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r]);

  const choose = (obj: string) => {
    if (found.includes(obj)) return;
    const fits = SILHOUETTE_FITS[round.shape]?.includes(obj) ?? false;
    const t = tries + 1;
    setTries(t);
    answer(`${step.id}:${round.shape}`, fits, t);
    if (fits) {
      void sound.play("bell");
      const next = [...found, obj];
      setFound(next);
      const lines = ["That WOULD fit!", "That could fit too!", "That fits as well! Hmm!"];
      const tail = band === "older" && next.length === 1 ? " Could anything else fit?" : "";
      milo.say(lines[Math.min(next.length - 1, 2)] + tail, { expression: "happy", action: next.length === 1 ? "wingsUp" : "idle" });
    } else {
      void sound.play("wrong-gentle");
      void bagShake.start({ x: [0, -8, 8, 0], transition: { duration: 0.35 } });
      milo.say(`Hmm… is a ${obj} ${SHAPE_WORD[round.shape]}?`, { expression: "confused", action: "headTilt" });
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    if (e.over?.id === "bag") choose(String(e.active.id));
  };

  const next = () => {
    if (r + 1 < rounds.length) setR(r + 1);
    else onDone();
  };

  return (
    <StepFrame speaker="milo" line={milo.text} expression={milo.expression} action={milo.action} talking={milo.talking} onNext={found.length ? next : null}>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex h-full w-full flex-col items-center justify-between gap-[3vh]">
          <motion.div animate={bagShake}>
            <Bag shape={round.shape} />
          </motion.div>
          <div className="flex flex-wrap justify-center gap-[2.5%]">
            {round.options.map((o, i) => (
              <Draggable key={`${r}-${o}`} id={o} index={i} picked={found.includes(o)} onTap={() => choose(o)} />
            ))}
          </div>
        </div>
      </DndContext>
    </StepFrame>
  );
}

function Bag({ shape }: { shape: string }) {
  const { setNodeRef, isOver } = useDroppable({ id: "bag" });
  return (
    <div ref={setNodeRef} className={`relative w-[clamp(11rem,22vw,17rem)] transition-transform ${isOver ? "scale-105" : ""}`}>
      <svg viewBox="0 0 200 180" className="h-auto w-full" aria-label="Squirrel's bag">
        <path d="M30 50 C6 80 10 150 46 170 C80 182 120 182 154 170 C190 150 194 80 170 50 Z" fill="#a9b89a" />
        <path d="M30 50 C60 38 140 38 170 50 L156 30 C120 20 80 20 44 30 Z" fill="#7e8f63" />
        <path d="M84 30 C76 6 124 6 116 30" stroke="#8d6a43" strokeWidth={7} fill="none" />
        {/* the mystery shape pushing against the fabric */}
        <g transform="translate(55 62) scale(0.9)" opacity={0.55}>
          {drawObject(shape)}
        </g>
        <path d="M30 50 C6 80 10 150 46 170 C80 182 120 182 154 170 C190 150 194 80 170 50" fill="none" stroke="#3a3833" strokeWidth={3} opacity={0.5} />
      </svg>
      {isOver && <span className="absolute inset-0 rounded-full ring-8 ring-mustard/50" />}
    </div>
  );
}

function Draggable({ id, index, picked, onTap }: { id: string; index: number; picked: boolean; onTap: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={onTap}
      aria-label={id}
      className="relative w-[clamp(5.5rem,11vw,8.5rem)] touch-none"
      style={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px) scale(1.08)` : `rotate(${[-3, 2, -1, 3][index % 4]}deg)`,
        zIndex: isDragging ? 50 : 1,
        transition: isDragging ? undefined : "transform 0.25s",
      }}
    >
      <Paper className="flex flex-col items-center p-[10%]">
        <Art k={id} className="aspect-square h-auto w-full" />
        <span className="font-display text-[1.2rem] leading-none">{id}</span>
      </Paper>
      {picked && (
        <span className="absolute -top-3 -right-3">
          <Sticker className="h-10 w-10" color="#92b97e">
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
              <path d="M5 12l4 4 10-10" fill="none" stroke="#fbf8f1" strokeWidth={3.5} strokeLinecap="round" />
            </svg>
          </Sticker>
        </span>
      )}
    </button>
  );
}
