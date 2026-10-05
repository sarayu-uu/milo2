"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DndContext, KeyboardSensor, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import type { AgeVariant, InteractiveStep } from "@/types/activity";
import { useActivity, type StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { Art } from "@/components/art/Art";
import { Paper } from "@/components/scrapbook/primitives";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";
import { StepFrame } from "@/components/activities/steps/StepFrame";
import { BIN_FOR, SHAPE_WORD, sortedLine, wrongBinLine } from "./shapes";

/**
 * Shape → real objects. Sort everyday things into circle / rectangle /
 * cylinder baskets. Drag, or tap an object then tap a basket.
 */
export function ShapeSort({ step, band, onDone }: StepProps<InteractiveStep>) {
  const { answer } = useActivity();
  const bins = pick(step.props?.bins as AgeVariant<string[]>, band);
  const items = pick(step.props?.items as AgeVariant<string[]>, band);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongItem, setWrongItem] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const squirrel = useSpeech("squirrel", { expression: "happy" });
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor));
  const remaining = items.filter((i) => !placed[i]);
  const done = remaining.length === 0;

  useEffect(() => {
    squirrel.say(band === "younger" ? "Help me tidy! Round things here, rectangle things there." : "Let's sort! Circles, rectangles, cylinders.", { action: "hop" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drop = (item: string, bin: string) => {
    const ok = BIN_FOR[item] === bin;
    const t = tries + 1;
    setTries(t);
    answer(`${step.id}:${item}`, ok, t);
    setSelected(null);
    if (ok) {
      void sound.play("wood-click");
      const next = { ...placed, [item]: bin };
      setPlaced(next);
      if (Object.keys(next).length === items.length) squirrel.say("All tidy! I've never been this organised.", { expression: "proud", action: "hop" });
      else squirrel.say(sortedLine(item), { expression: "happy" });
    } else {
      void sound.play("wrong-gentle");
      setWrongItem(item);
      setTimeout(() => setWrongItem(null), 450);
      squirrel.say(wrongBinLine(bin), { expression: "confused" });
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    if (e.over) drop(String(e.active.id), String(e.over.id));
  };

  return (
    <StepFrame speaker="squirrel" line={squirrel.text} expression={squirrel.expression} action={squirrel.action} talking={squirrel.talking} onNext={done ? onDone : null}>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex h-full w-full flex-col justify-between gap-[3vh]">
          <div className="flex min-h-[40%] flex-wrap justify-center gap-[3%]">
            <AnimatePresence>
              {remaining.map((it, i) => (
                <Item key={it} id={it} index={i} selected={selected === it} wrong={wrongItem === it} onTap={() => setSelected(selected === it ? null : it)} />
              ))}
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-[3%]">
            {bins.map((b) => (
              <Bin key={b} id={b} items={items.filter((i) => placed[i] === b)} armed={!!selected} onTap={() => selected && drop(selected, b)} />
            ))}
          </div>
        </div>
      </DndContext>
    </StepFrame>
  );
}

function Item({ id, index, selected, wrong, onTap }: { id: string; index: number; selected: boolean; wrong: boolean; onTap: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={wrong ? { x: [0, -8, 8, -4, 0], opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4, y: 60 }}
      className="w-[clamp(4.6rem,9vw,7rem)]"
    >
      <button
        ref={setNodeRef}
        type="button"
        {...listeners}
        {...attributes}
        onClick={onTap}
        aria-label={id}
        aria-pressed={selected}
        data-hint={selected ? undefined : "tap"}
        data-hint-priority="1"
        className={`paper block w-full touch-none p-[10%] ${selected ? "ring-4 ring-mustard" : ""}`}
        style={{
          transform: transform ? `translate(${transform.x}px, ${transform.y}px) scale(1.08)` : `rotate(${[-3, 2, -1, 3, -2][index % 5]}deg)`,
          zIndex: isDragging ? 50 : 1,
          position: "relative",
        }}
      >
        <Art k={id} className="aspect-square h-auto w-full" />
      </button>
    </motion.div>
  );
}

function Bin({ id, items, armed, onTap }: { id: string; items: string[]; armed: boolean; onTap: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <button ref={setNodeRef} type="button" onClick={onTap} aria-label={`${SHAPE_WORD[id]} basket`} data-hint={armed ? "tap" : undefined} data-hint-priority="2" className="relative w-[clamp(8rem,17vw,13rem)]">
      <Paper className={`flex flex-col items-center gap-1 p-[6%] transition-transform ${isOver || armed ? "scale-[1.04]" : ""}`} color={isOver ? "#f3e7c9" : "#efe4cc"}>
        <Art k={id} className="h-[clamp(3rem,7vw,5rem)] w-[clamp(3rem,7vw,5rem)]" />
        <span className="font-display text-[1.3rem] leading-none">{SHAPE_WORD[id]}</span>
        <div className="flex min-h-[2.2rem] flex-wrap justify-center gap-1">
          {items.map((i) => (
            <motion.div key={i} initial={{ scale: 0, y: -30 }} animate={{ scale: 1, y: 0 }} className="h-[2.2rem] w-[2.2rem]">
              <Art k={i} className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      </Paper>
    </button>
  );
}
