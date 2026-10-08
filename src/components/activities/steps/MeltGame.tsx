"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { MeltStep } from "@/types/activity";
import { useActivity, type StepProps } from "@/features/activities/ActivityContext";
import { Art } from "@/components/art/Art";
import { Paper } from "@/components/scrapbook/primitives";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";
import { StepFrame } from "./StepFrame";

/** How big the cube is at each stage of melting (the last stage is just water). */
const STAGES = [1, 0.72, 0.46, 0.22, 0];
/** In the sun, the ice shrinks a stage this often (ms). */
const SUN_MS = 1500;
/** "Time passing" in the compare experiment (ms). */
const RUN_MS = 4000;

/**
 * Ice, two ways. watch (age 3): touch it and it shrinks; put it in the sun
 * and it melts by itself, until it's water. compare (age 5): the same ice
 * with different things around it; let time pass, see which has the most
 * left, change one thing and run it again.
 */
export function MeltGame(props: StepProps<MeltStep>) {
  return props.step.wraps ? <Compare {...props} /> : <Watch {...props} />;
}

/* ------------------------------------------------------------------ */

function Watch({ step, onDone }: StepProps<MeltStep>) {
  const speaker = step.speaker ?? "milo";
  const voice = useSpeech(speaker, { expression: "curious" });
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);
  const [inSun, setInSun] = useState(false);
  const [drip, setDrip] = useState(0);
  const [done, setDone] = useState(false);
  const sun = useRef<HTMLDivElement>(null);
  const lines = (step.stages ?? []).map((st) => st.line);

  useEffect(() => {
    voice.say(step.prompt, { expression: "curious", action: "headTilt" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Milo notices each change; the last line is for when it's all water. */
  const reached = (s: number) => {
    const water = s === STAGES.length - 1;
    const line = water ? lines[lines.length - 1] : s < lines.length ? lines[s - 1] : null;
    if (line) voice.say(line, { expression: water ? "confused" : "surprised", action: water ? "headTilt" : "investigate" });
  };

  const shrink = () => {
    const s = stageRef.current;
    if (s >= STAGES.length - 1) return;
    const n = s + 1;
    stageRef.current = n;
    setStage(n);
    void sound.play("sfx-drip");
    setDrip((d) => d + 1);
    reached(n);
  };

  // in the sun it keeps melting by itself
  useEffect(() => {
    if (!inSun || stage >= STAGES.length - 1) return;
    const t = setTimeout(shrink, SUN_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inSun, stage]);

  const water = stage === STAGES.length - 1;

  return (
    <StepFrame backdrop={step.backdrop} speaker={speaker} line={voice.text} expression={voice.expression} action={voice.action} talking={voice.talking} onNext={done ? onDone : null}>
      <div className="relative h-full w-full">
        {/* sunlight from the kitchen window, falling on the floor: the warm spot */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <polygon points="74,32 96,32 100,82 58,82" fill="#ffe08a" opacity="0.28" />
        </svg>
        <div
          ref={sun}
          data-drop="sun"
          className="absolute right-0 bottom-[2%] h-[32%] w-[44%] rounded-[50%]"
          style={{ background: "radial-gradient(closest-side, rgba(255,214,102,0.75), rgba(255,214,102,0.35) 60%, rgba(255,214,102,0))" }}
        />
        <motion.div
          className="absolute bottom-[10%] w-[34%] cursor-grab touch-none active:cursor-grabbing"
          style={{ left: "6%" }}
          animate={inSun ? { left: "60%" } : { left: "6%" }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
          drag={!inSun && !water}
          dragSnapToOrigin
          dragElastic={1}
          onDragEnd={(_, info) => {
            const b = sun.current?.getBoundingClientRect();
            if (b && info.point.x >= b.left && info.point.x <= b.right && info.point.y >= b.top && info.point.y <= b.bottom) {
              setInSun(true);
              void sound.play("tap");
            }
          }}
          onTap={() => {
            if (water) {
              if (!done) {
                setDone(true);
                voice.say(step.line, { expression: "confused", action: "headTilt" });
              }
              return;
            }
            shrink();
          }}
          aria-label={water ? "The water" : "The ice"}
          role="button"
          data-hint={stage === 0 ? "tap" : water && !done ? "tap" : undefined}
          data-hint-priority="1"
        >
          <Plate>
            <IceCube size={STAGES[stage]} water={water} />
            <AnimatePresence>
              {drip > 0 && !water && (
                <motion.span
                  key={drip}
                  className="absolute top-[45%] left-[62%] h-4 w-3 rounded-full bg-sky"
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: 40, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </AnimatePresence>
          </Plate>
        </motion.div>
      </div>
    </StepFrame>
  );
}

/* ------------------------------------------------------------------ */

type ComparePhase = "ready" | "running" | "most" | "what" | "change" | "rerun" | "done";

function Compare({ step, onDone }: StepProps<MeltStep>) {
  const { answer } = useActivity();
  const speaker = step.speaker ?? "milo";
  const voice = useSpeech(speaker, { expression: "curious" });
  const wraps = step.wraps!;
  const c = step.compare!;
  const [slots, setSlots] = useState(wraps.map((_, i) => i)); // which wrap each cube has
  const [phase, setPhase] = useState<ComparePhase>("ready");
  const [ran, setRan] = useState(false); // ice shows its after-time size
  const [runs, setRuns] = useState(0);
  const best = () => slots.reduce((b, w, i) => (wraps[w].left > wraps[slots[b]].left ? i : b), 0);

  useEffect(() => {
    voice.say(step.prompt, { expression: "curious", action: "headTilt" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = () => {
    setRan(false);
    setPhase("running");
    void sound.play("whoosh");
    requestAnimationFrame(() => setRan(true));
    setTimeout(() => {
      const n = runs + 1;
      setRuns(n);
      if (n === 1) {
        setPhase("most");
        voice.say(c.most.prompt, { expression: "curious", action: "investigate" });
      } else {
        setPhase("done");
        voice.say(c.again, { expression: "happy", action: "wingsUp" });
        setTimeout(() => voice.say(step.line, { expression: "happy", action: "wingsUp" }), 3500);
      }
    }, RUN_MS);
  };

  const pickCube = (i: number) => {
    if (phase === "most") {
      const right = slots[i] === slots[best()];
      answer(`${step.id}-most`, right, 1);
      if (right) {
        void sound.play("bell");
        voice.say(c.most.right, { expression: "happy", action: "wingsUp" });
        setTimeout(() => {
          setPhase("what");
          voice.say(c.what.prompt, { expression: "curious", action: "headTilt" });
        }, 2600);
      } else {
        void sound.play("wrong-gentle");
        voice.say(c.most.wrong, { expression: "thinking", action: "headTilt" });
      }
    } else if (phase === "change") {
      // swap what's around this cube for the next thing
      void sound.play("paper-rustle");
      setSlots((s) => s.map((w, k) => (k === i ? (w + 1) % wraps.length : w)));
      setRan(false);
      setPhase("rerun");
    } else if (phase === "rerun") {
      void sound.play("paper-rustle");
      setSlots((s) => s.map((w, k) => (k === i ? (w + 1) % wraps.length : w)));
    }
  };

  const pickWrap = (w: number) => {
    const right = w === slots[best()];
    answer(`${step.id}-what`, right, 1);
    if (right) {
      void sound.play("bell");
      voice.say(c.what.right, { expression: "proud", action: "bellyPuff" });
      setTimeout(() => {
        setRan(false);
        setPhase("change");
        voice.say(c.change, { expression: "curious", action: "headTilt" });
      }, 3000);
    } else {
      void sound.play("wrong-gentle");
      voice.say(c.what.wrong, { expression: "thinking", action: "headTilt" });
    }
  };

  const tappable = phase === "most" || phase === "change" || phase === "rerun";

  return (
    <StepFrame backdrop={step.backdrop} speaker={speaker} line={voice.text} expression={voice.expression} action={voice.action} talking={voice.talking} onNext={phase === "done" ? onDone : null}>
      <div className="relative flex h-full w-full flex-col items-center justify-between">
        <div className="flex h-[62%] w-full items-end justify-center gap-[3%]">
          {slots.map((w, i) => (
            <motion.button
              key={i}
              type="button"
              disabled={!tappable}
              onClick={() => pickCube(i)}
              whileTap={tappable ? { scale: 0.95 } : undefined}
              aria-label={`Ice with ${wraps[w].label}`}
              data-hint={tappable ? "tap" : undefined}
              className="relative flex w-[22%] flex-col items-center"
            >
              <Plate>
                <IceCube size={ran ? Math.max(0.12, wraps[w].left) : 1} water={false} slow={ran} wrap={wraps[w].id} />
              </Plate>
              <span className="font-display mt-1 text-[1.1rem] leading-none text-ink-soft">{wraps[w].label}</span>
            </motion.button>
          ))}
        </div>

        <div className="flex h-[30%] w-full items-center justify-center gap-[3%]">
          {(phase === "ready" || phase === "rerun") && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={run}
              className="paper font-display flex min-h-[var(--touch-big)] items-center gap-3 px-7 text-[1.6rem] text-ink"
              data-hint="tap"
              aria-label={c.run}
            >
              <span aria-hidden>⏳</span> {c.run}
            </motion.button>
          )}
          {phase === "what" &&
            wraps.map((wrap, w) => (
              <motion.button key={wrap.id} type="button" whileTap={{ scale: 0.92 }} onClick={() => pickWrap(w)} aria-label={wrap.label} className="w-[14%]">
                <Paper className="flex flex-col items-center p-[8%]">
                  <Art k={wrap.art} className="aspect-square h-auto w-full" />
                  <span className="font-display mt-1 text-[1.05rem] leading-none">{wrap.label}</span>
                </Paper>
              </motion.button>
            ))}
        </div>
      </div>
    </StepFrame>
  );
}

/* ---------- drawing ---------- */

function Plate({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative aspect-[5/4] w-full">
      <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden>
        <ellipse cx={50} cy={64} rx={46} ry={12} fill="#e7dcc4" />
        <ellipse cx={50} cy={62} rx={34} ry={8} fill="#fbf8f1" />
      </svg>
      {children}
    </div>
  );
}

/** The ice cube (its size shrinks as it melts; the melt water grows), with whatever is wrapped around it. */
function IceCube({ size, water, slow = false, wrap }: { size: number; water: boolean; slow?: boolean; wrap?: string }) {
  const melt = 1 - size;
  return (
    <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      {/* melt water on the plate */}
      <motion.ellipse cx={50} cy={62} rx={10} ry={4} fill="#9fc2d6" opacity={0.85} animate={{ rx: 10 + melt * 22, ry: 3 + melt * 4 }} transition={{ duration: slow ? RUN_MS / 1000 : 0.6 }} />
      {!water && (
        <motion.g
          style={{ transformOrigin: "50px 62px", transformBox: "view-box" }}
          animate={{ scale: size }}
          transition={{ duration: slow ? RUN_MS / 1000 : 0.6, ease: "easeInOut" }}
        >
          <rect x={30} y={22} width={40} height={40} rx={7} fill="#dff0f7" stroke="#9fc2d6" strokeWidth={2.5} />
          <path d="M38 30 L46 30 M38 36 L42 36" stroke="#ffffff" strokeWidth={3.5} strokeLinecap="round" />
          {wrap === "cloth" && <path d="M26 30 C34 18 66 18 74 30 L76 64 L24 64 Z" fill="#df917a" opacity={0.92} />}
          {wrap === "cloth" && <path d="M30 40 H70 M30 50 H70" stroke="#c9705c" strokeWidth={2} strokeDasharray="4 4" />}
          {wrap === "paper" && <path d="M26 26 L72 22 L76 64 L24 64 Z" fill="#fbf8f1" stroke="#cdbb9a" strokeWidth={1.5} opacity={0.95} />}
          {wrap === "foil" && <path d="M26 28 L36 20 L52 26 L66 19 L76 30 L74 64 L24 64 Z" fill="#cfd4d8" stroke="#a7a198" strokeWidth={1.5} />}
          {wrap === "foil" && <path d="M34 34 L44 40 L56 34 L66 42 M32 50 L46 46 L60 54" stroke="#ffffff" strokeWidth={1.8} fill="none" />}
        </motion.g>
      )}
    </svg>
  );
}
