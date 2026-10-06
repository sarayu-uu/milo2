"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { GiveStep } from "@/types/activity";
import { useActivity, type StepProps } from "@/features/activities/ActivityContext";
import { Art } from "@/components/art/Art";
import { Character } from "@/components/characters/Character";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";
import { speak } from "@/lib/audio/voice";
import { StepFrame } from "./StepFrame";

const WORDS = ["zero", "one", "two", "three", "four", "five"];
/** Extra things in the pile, so there's always more than asked for. */
const EXTRA = 2;
/** Where the pile sits (% of the play area), a loose heap. */
const PILE = [
  { x: 14, y: 30, r: -12 },
  { x: 30, y: 22, r: 8 },
  { x: 22, y: 50, r: 20 },
  { x: 38, y: 46, r: -6 },
  { x: 10, y: 66, r: 4 },
  { x: 30, y: 70, r: -18 },
  { x: 44, y: 66, r: 12 },
];

/**
 * "Can I have ONE seed?" The child drags things to a character, a set number
 * each round. Quantity first: the number is heard and felt, not read.
 */
export function GiveGame({ step, onDone }: StepProps<GiveStep>) {
  const { answer } = useActivity();
  const speaker = step.speaker ?? "milo";
  const voice = useSpeech(speaker, { expression: "curious" });
  const target = useRef<HTMLDivElement>(null);
  const [round, setRound] = useState(0);
  const [given, setGiven] = useState(0);
  const [eaten, setEaten] = useState<number[]>([]);
  const [chomp, setChomp] = useState(0);
  const r = step.rounds[round];
  const roundDone = !!r && given >= r.count;
  const allDone = round >= step.rounds.length;
  const pile = (r?.count ?? 0) + EXTRA;

  useEffect(() => {
    if (!r) return;
    voice.say(r.prompt, { expression: "curious", action: "headTilt" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const drop = (i: number, point: { x: number; y: number }) => {
    const box = target.current?.getBoundingClientRect();
    const inside = box && point.x >= box.left && point.x <= box.right && point.y >= box.top && point.y <= box.bottom;
    if (!inside || !r) return;
    if (roundDone) {
      // more than he asked for: it goes back to the pile
      void sound.play("wrong-gentle");
      voice.say("I'm full! That's enough for now.", { expression: "happy", action: "bellyPuff" });
      return;
    }
    const n = given + 1;
    setGiven(n);
    setEaten((e) => [...e, i]);
    setChomp((c) => c + 1);
    void sound.play("pop");
    speak(WORDS[n] ?? String(n), speaker);
    if (n === r.count) {
      answer(`${step.id}-${round}`, true, 1);
      setTimeout(() => {
        void sound.play("bell");
        voice.say(r.line, { expression: "happy", action: "wingsUp" });
      }, 700);
      setTimeout(() => {
        setRound((x) => x + 1);
        setGiven(0);
        setEaten([]);
      }, 3600);
    }
  };

  return (
    <StepFrame wide backdrop={step.backdrop} onNext={allDone ? onDone : null}>
      <div className="relative h-full w-full">
        {/* the pile */}
        <AnimatePresence>
          {!allDone &&
            Array.from({ length: pile }, (_, i) =>
              eaten.includes(i) ? null : (
                <motion.div
                  key={`${round}-${i}`}
                  className="absolute w-[11%] min-w-[56px] cursor-grab touch-none active:cursor-grabbing"
                  style={{ left: `${PILE[i % PILE.length].x}%`, top: `${PILE[i % PILE.length].y}%`, rotate: PILE[i % PILE.length].r }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.2, opacity: 0, transition: { duration: 0.2 } }}
                  drag
                  dragSnapToOrigin
                  dragElastic={1}
                  whileDrag={{ scale: 1.2, zIndex: 20 }}
                  // info.point works for mouse and touch alike
                  onDragEnd={(_, info) => drop(i, info.point)}
                  data-hint={i === eaten.length && !roundDone ? "drag-right" : undefined}
                  data-hint-priority="1"
                  aria-label={step.art}
                >
                  <Art k={step.art} className="pointer-events-none h-auto w-full" />
                </motion.div>
              ),
            )}
        </AnimatePresence>

        {/* the hungry one */}
        <div ref={target} className="absolute right-[4%] bottom-0 w-[36%]">
          <div className="absolute bottom-[92%] right-[30%] w-[150%] max-w-[24rem]">
            <SpeechBubble text={voice.text} size="sm" />
          </div>
          <motion.div key={chomp} animate={chomp ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 0.35 }} className="origin-bottom">
            <Character id={speaker} expression={voice.expression} action={voice.action} talking={voice.talking} flip className="h-auto w-full" />
          </motion.div>
          {/* how many he's had this round: dots, not numerals */}
          {r && (
            <div className="mt-1 flex justify-center gap-2" aria-hidden>
              {Array.from({ length: r.count }, (_, i) => (
                <span key={i} className={`h-4 w-4 rounded-full border-2 border-ink/40 ${i < given ? "bg-mustard" : "bg-paper"}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </StepFrame>
  );
}
