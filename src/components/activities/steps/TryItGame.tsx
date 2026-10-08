"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { TryBench, TryItStep, TryObject, TryResult } from "@/types/activity";
import type { CharacterAction, Expression } from "@/types/character";
import type { SoundId } from "@/types/audio";
import { useActivity, type StepProps } from "@/features/activities/ActivityContext";
import { Art } from "@/components/art/Art";
import { Character } from "@/components/characters/Character";
import { Paper } from "@/components/scrapbook/primitives";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";
import { StepFrame } from "./StepFrame";

/** Which results count as the "yes" group (stayed up / stuck / rolled / drank the water). */
const YES: TryResult[] = ["float", "stick", "roll", "wobble", "soak", "soggy"];
const isYes = (r: TryResult) => YES.includes(r);

/** The two groups per bench: an icon a child can read, and a word for grown-ups. */
const GROUPS: Record<TryBench, [{ icon: string; label: string }, { icon: string; label: string }]> = {
  bowl: [{ icon: "⬆️", label: "Stayed up" }, { icon: "⬇️", label: "Went down" }],
  magnet: [{ icon: "🧲", label: "Stuck" }, { icon: "✋", label: "Didn't stick" }],
  push: [{ icon: "➡️", label: "Rolled" }, { icon: "✋", label: "Didn't roll" }],
  puddle: [{ icon: "💧", label: "Drank the water" }, { icon: "✋", label: "Didn't" }],
};

/** The two guesses, per bench that supports predicting. */
const GUESSES: Partial<Record<TryBench, [TryResult, TryResult]>> = { bowl: ["float", "sink"], magnet: ["stick", "none"] };

/** Milo's face for each result. */
type Face = { expression: Expression; action: CharacterAction };
const FACE: Record<TryResult, Face> = {
  float: { expression: "happy", action: "wingsUp" },
  stick: { expression: "surprised", action: "wingsUp" },
  roll: { expression: "happy", action: "wingsUp" },
  wobble: { expression: "happy", action: "headTilt" },
  soak: { expression: "surprised", action: "wingsUp" },
  sink: { expression: "surprised", action: "peek" },
  none: { expression: "suspicious", action: "investigate" },
  slide: { expression: "confused", action: "headTilt" },
  stay: { expression: "confused", action: "investigate" },
  soggy: { expression: "surprised", action: "idle" },
};

/** The sound layer: Milo says the words, these make the noises. */
const SFX: Record<TryResult, SoundId> = {
  float: "sfx-splash",
  sink: "sfx-plop",
  soak: "sfx-squish",
  soggy: "sfx-squish",
  stay: "sfx-thunk",
  roll: "sfx-roll",
  wobble: "sfx-roll",
  slide: "sfx-thunk",
  stick: "sfx-magnet-click",
  none: "sfx-thunk",
};

const ANIM_MS = 2300;
/** The magnet: up, touch, (stick or) fall back onto the desk and rest there a moment. */
const MAGNET_MS = 3500;

/**
 * Where things are, in % of the play area, lined up with the activity corners
 * (components/world/scenes/corners): the counter top is at 58% down, the floor
 * starts around 74%. The bowl and the magnet stand ON the counter; puddles and
 * pushing happen ON the floor. Whatever isn't the experiment waits on the other one.
 */
const ON_COUNTER: TryBench[] = ["magnet"];
const BENCH_BOX = { counter: "top-0 h-[58%]", floor: "top-[60%] bottom-0" };
const TRAY_BOX = { counter: "top-[30%] h-[28%] items-end", floor: "bottom-[1%] h-[26%] items-end" };

type Act = "race" | "ending" | "final" | "outro";
type Phase = "predict" | "try" | "testing" | "race" | "ending" | "outro" | "done";

/**
 * "Try it": the experiment bench behind the Milo Mysteries. Results are
 * scripted (the same object always does the same thing), so what a child
 * sees is clear and repeatable. Age 3 tries freely; with `predict`, each
 * object comes out from behind Milo, gets a guess (never wrong), then goes in.
 */
export function TryItGame({ step, onDone }: StepProps<TryItStep>) {
  const { answer } = useActivity();
  const speaker = step.speaker ?? "milo";
  const voice = useSpeech(speaker, { expression: "curious" });
  const area = useRef<HTMLDivElement>(null);
  const target = useRef<HTMLDivElement>(null);
  const objects = useMemo(() => (step.final ? [...step.objects, step.final] : step.objects), [step]);
  const finalIndex = step.final ? step.objects.length : -1;
  const predicting = !!step.predict && !!GUESSES[step.bench];
  const benchOnCounter = ON_COUNTER.includes(step.bench);

  const [tested, setTested] = useState<Record<number, TryResult>>({});
  const [phase, setPhase] = useState<Phase>(predicting ? "predict" : "try");
  const [seq, setSeq] = useState(0); // predict mode: which object is up
  const [guess, setGuess] = useState<TryResult | null>(null);
  const [testing, setTesting] = useState<number | null>(null); // object in the experiment right now
  const [pushReady, setPushReady] = useState<number | null>(null); // push bench: object waiting on the start line
  const [acts, setActs] = useState<Act[] | null>(null);
  const [puddle, setPuddle] = useState(1); // puddle size (1 = full)
  const [sorted, setSorted] = useState<Record<number, boolean>>({});
  const [raced, setRaced] = useState(false);
  const [rolled, setRolled] = useState(false);

  const triedCount = Object.keys(tested).filter((k) => Number(k) !== finalIndex).length;
  const current = phase === "predict" || (predicting && phase === "try") ? (acts?.[0] === "final" ? finalIndex : seq) : null;
  const canMoveOn = !predicting && phase === "try" && triedCount >= step.tries && !acts;

  const say = (text: string, face: Face = { expression: "curious", action: "headTilt" }) => voice.say(text, face);

  useEffect(() => {
    say(step.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- moving through the acts (race → ending → final → outro) ---------- */

  const startActs = () => {
    const list: Act[] = [];
    if (step.race) list.push("race");
    if (step.ending) list.push("ending");
    if (step.final) list.push("final");
    if (step.outro) list.push("outro");
    runAct(list);
  };

  const runAct = (list: Act[]) => {
    setActs(list);
    const next = list[0];
    if (!next) {
      setPhase("done");
      return;
    }
    if (next === "race") {
      setPhase("race");
      say(step.race!.prompt);
    } else if (next === "ending") {
      setPhase("ending");
      say(step.ending!.prompt);
    } else if (next === "final") {
      setGuess(null);
      setPhase("predict");
      say(step.final!.prompt, { expression: "curious", action: "investigate" });
    } else {
      setPhase("outro");
      say(step.outro!.prompt, { expression: "proud", action: "bellyPuff" });
    }
  };
  const nextAct = () => runAct((acts ?? []).slice(1));

  /* ---------- one test ---------- */

  const lineFor = (o: TryObject) => o.line ?? step.results.find((r) => r.result === o.result)?.line ?? "";

  const runTest = (i: number) => {
    const o = objects[i];
    setTesting(i);
    setPhase("testing");
    if (step.bench === "puddle") setPuddle(1);
    setTimeout(() => {
      void sound.play(SFX[o.result]);
      if (step.bench === "puddle") setPuddle(o.result === "soak" ? 0 : o.result === "soggy" ? 0.5 : 1);
    }, step.bench === "push" ? 50 : step.bench === "magnet" ? 560 : 450);
    setTimeout(() => {
      setTesting(null);
      setPushReady(null);
      setTested((t) => ({ ...t, [i]: o.result }));
      const face = FACE[o.result];
      if (predicting && guess) {
        const right = guess === o.result;
        answer(`${step.id}-${i}`, right, 1);
        say(right ? step.predict!.right : step.predict!.wrong, right ? { expression: "happy", action: "wingsUp" } : { expression: "surprised", action: "headTilt" });
        // then what actually happened ("It stuck!"), then the next one
        setTimeout(() => say(lineFor(o), face), 2000);
        setTimeout(() => afterPredictedTest(i), 4600);
      } else {
        say(lineFor(o), face);
        setPhase("try");
      }
      // the puddle comes back for the next try
      if (step.bench === "puddle") setTimeout(() => setPuddle(1), 2400);
    }, step.bench === "magnet" ? MAGNET_MS : ANIM_MS);
  };

  const afterPredictedTest = (i: number) => {
    setGuess(null);
    if (i === finalIndex) {
      nextAct();
      return;
    }
    if (seq + 1 < Math.min(step.tries, step.objects.length)) {
      setSeq(seq + 1);
      setPhase("predict");
      say(step.predict!.prompt);
    } else {
      startActs();
    }
  };

  const pickGuess = (r: TryResult) => {
    setGuess(r);
    setPhase("try");
    void sound.play("tap");
    say(step.predict!.go, { expression: "happy", action: "wingsUp" });
  };

  /** Dropped on the experiment? */
  const dropped = (i: number, point: { x: number; y: number }) => {
    const box = target.current?.getBoundingClientRect();
    if (!box || point.x < box.left || point.x > box.right || point.y < box.top || point.y > box.bottom) return;
    runTest(i);
  };

  /* ---------- push bench ---------- */
  const placeOnLine = (i: number) => {
    if (phase !== "try") return;
    void sound.play("tap");
    setPushReady(i);
    if (triedCount === 0) voice.say("Now press Push!", { expression: "happy", action: "wingsUp" });
  };

  /* ---------- sorting ---------- */
  const groupRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const toSort = Object.keys(tested)
    .map(Number)
    .filter((i) => i !== finalIndex);
  const sortDrop = (i: number, point: { x: number; y: number }) => {
    const g = groupRefs.findIndex((ref) => {
      const b = ref.current?.getBoundingClientRect();
      return b && point.x >= b.left && point.x <= b.right && point.y >= b.top && point.y <= b.bottom;
    });
    if (g < 0) return;
    const right = (g === 0) === isYes(objects[i].result);
    answer(`${step.id}-sort-${i}`, right, 1);
    if (right) {
      void sound.play("pop");
      const next = { ...sorted, [i]: true };
      setSorted(next);
      if (toSort.every((k) => next[k])) say(step.ending!.line, { expression: "happy", action: "wingsUp" });
    } else {
      void sound.play("wrong-gentle");
      voice.say("Hmm, look again! What did it do?", { expression: "thinking", action: "headTilt" });
    }
  };
  const sortDone = step.ending?.sort ? toSort.every((k) => sorted[k]) : true;

  // the grouped ending (no sorting): Milo says the line once the groups appear
  useEffect(() => {
    if (phase === "ending" && step.ending && !step.ending.sort) {
      const t = setTimeout(() => say(step.ending!.line, { expression: "happy", action: "wingsUp" }), 2600);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* ---------- what's on the page ---------- */

  const onNext =
    phase === "done"
      ? onDone
      : canMoveOn
        ? startActs
        : phase === "ending" && sortDone
          ? nextAct
          : phase === "race" && raced
            ? nextAct
            : phase === "outro" && rolled
              ? nextAct
              : null;

  const showTray = phase === "try" && !predicting;
  const solo = current !== null && phase !== "testing" ? current : null; // predict mode: the one object up next
  const trayBox = benchOnCounter ? TRAY_BOX.floor : TRAY_BOX.counter;
  // waiting on the shelf: right-aligned, like the shelf
  const trayAlign = benchOnCounter || step.bench === "bowl" ? "justify-center" : "justify-end";
  const floating = step.bench === "bowl";
  // the drag tutorial: first try only (and the first guessed object)
  const teach = step.bench !== "push" && phase === "try" && testing === null && (predicting ? seq === 0 && !acts : triedCount === 0);

  return (
    <StepFrame
      backdrop={step.backdrop}
      // in the outro Milo is the experiment, so he's drawn in the scene instead
      speaker={phase === "outro" ? undefined : speaker}
      speakerWidth="27%"
      line={voice.text}
      expression={voice.expression}
      action={voice.action}
      talking={voice.talking}
      onNext={onNext}
    >
      <div ref={area} className="relative h-full w-full">
        {/* the games bring their own furniture, so any room works: a little table for the
            bowl / magnet stand, a wall shelf for the things waiting their turn */}
        {benchOnCounter && phase !== "ending" && phase !== "race" && phase !== "outro" && <Table />}
        {/* puddles and pushing: the waiting things stand on a shelf. The bowl: they float above it. */}
        {!benchOnCounter && step.bench !== "bowl" && (showTray || solo !== null) && <Shelf count={solo !== null ? 1 : step.objects.length} />}

        {/* the experiment */}
        {phase !== "ending" && phase !== "race" && phase !== "outro" && (
          <div ref={target} data-drop="experiment" className={`absolute inset-x-[10%] ${benchOnCounter ? BENCH_BOX.counter : BENCH_BOX.floor}`}>
            <Bench bench={step.bench} puddle={puddle} />
            <AnimatePresence>
              {testing !== null && <Actor key={`t-${testing}`} bench={step.bench} o={objects[testing]} />}
            </AnimatePresence>
            {step.bench === "bowl" && <BowlFront />}
            {/* push: the object waiting on the start line; tap (or swipe) it to push */}
            {step.bench === "push" && pushReady !== null && testing === null && (
              <>
                <motion.button
                  type="button"
                  aria-label={`Push the ${objects[pushReady].label}`}
                  onClick={() => runTest(pushReady)}
                  className="absolute bottom-[23%] left-[4%] w-[11%]"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Art k={objects[pushReady].art} className="h-auto w-full" />
                </motion.button>
                <PushButton className="absolute bottom-[30%] left-[18%]" onPush={() => runTest(pushReady)} tutorial={triedCount === 0} />
              </>
            )}
          </div>
        )}

        {/* free play: every object, tried or not, can go in (again) */}
        {showTray && (
          <div className={`absolute flex gap-[2%] ${floating ? "right-[2%] left-[22%]" : "right-[6%] left-[4%]"} ${trayAlign} ${trayBox}`}>
            {step.objects.map((o, i) =>
              step.bench === "push" ? (
                <button
                  key={o.label}
                  type="button"
                  aria-label={o.label}
                  onClick={() => placeOnLine(i)}
                  className="relative w-[12%] min-w-[56px]"
                  data-hint={pushReady === null && !(i in tested) ? "tap" : undefined}
                  data-tap-hint={i === 0 && pushReady === null && triedCount === 0 ? "" : undefined}
                >
                  <TrayArt o={o} tried={tested[i]} bench={step.bench} />
                </button>
              ) : (
                <Draggable key={o.label} label={o.label} onDrop={(p) => dropped(i, p)} hint={!(i in tested)} src={i === 0} bob={floating ? i : undefined}>
                  <TrayArt o={o} tried={tested[i]} bench={step.bench} />
                </Draggable>
              ),
            )}
          </div>
        )}

        {/* predict mode: the next object comes out from behind Milo, gets a guess, then goes in */}
        {solo !== null && (
          <div className={`absolute inset-x-0 flex justify-center gap-[5%] ${trayBox}`}>
            {phase === "predict" && GUESSES[step.bench] && <GuessButton r={GUESSES[step.bench]![0]} bench={step.bench} onPick={pickGuess} />}
            <motion.div
              key={`solo-${solo}`}
              className="relative flex w-[14%] min-w-[64px] flex-col items-center"
              initial={{ x: "-480%", rotate: -12 }}
              animate={{ x: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 60, damping: 13, delay: 0.4 }}
            >
              {phase === "predict" ? (
                <TrayArt o={objects[solo]} bench={step.bench} />
              ) : (
                <Draggable label={objects[solo].label} onDrop={(p) => dropped(solo, p)} hint src full>
                  <TrayArt o={objects[solo]} bench={step.bench} />
                </Draggable>
              )}
            </motion.div>
            {phase === "predict" && GUESSES[step.bench] && <GuessButton r={GUESSES[step.bench]![1]} bench={step.bench} onPick={pickGuess} />}
          </div>
        )}

        {teach && <DragHint area={area} target={target} />}
        {/* guessing tutorial: the first time, a hand goes back and forth between the two guesses */}
        {phase === "predict" && seq === 0 && !acts && <GuessHint area={area} />}
        {/* push tutorial: tap an object, then tap Push (and Push for the race) */}
        {step.bench === "push" && testing === null && (phase === "try" ? triedCount === 0 : phase === "race" && !raced) && (
          <TapHint area={area} watch={`${phase}-${pushReady}`} />
        )}

        {/* race: two lanes on the floor, both pushed at once */}
        {phase === "race" && step.race && (
          <Race
            a={objects[step.race.a]}
            b={objects[step.race.b]}
            done={raced}
            onGo={() => {
              void sound.play("sfx-roll");
              setRaced(true);
              setTimeout(() => say(step.race!.line, { expression: "happy", action: "wingsUp" }), 1800);
            }}
          />
        )}

        {/* ending: grouped, or sorted by the child */}
        {phase === "ending" && step.ending && (
          <Groups
            bench={step.bench}
            objects={objects}
            items={step.ending.sort ? toSort : step.objects.map((_, i) => i)}
            sorting={step.ending.sort}
            sorted={sorted}
            refs={groupRefs}
            onDrop={sortDrop}
          />
        )}

        {/* outro: big Milo himself tips over and rolls across the floor */}
        {phase === "outro" && step.outro && (
          <RollingMilo
            rolled={rolled}
            text={voice.text}
            expression={voice.expression}
            talking={voice.talking}
            onPush={() => {
              if (rolled) return;
              setRolled(true);
              void sound.play("sfx-roll");
              setTimeout(() => void sound.play("sfx-thunk"), 2300);
              setTimeout(() => say(step.outro!.line, { expression: "proud", action: "idle" }), 2600);
            }}
          />
        )}
      </div>
    </StepFrame>
  );
}

/* ------------------------------------------------------------------ */

function Draggable({
  label,
  onDrop,
  hint,
  src,
  full,
  bob,
  children,
}: {
  label: string;
  onDrop: (p: { x: number; y: number }) => void;
  hint?: boolean;
  /** Where the drag tutorial's hand starts. */
  src?: boolean;
  /** Fill the parent (instead of being one of a row). */
  full?: boolean;
  /** Float gently up and down (each index a little out of step with the others). */
  bob?: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      aria-label={label}
      role="button"
      className={`relative ${full ? "w-full" : "w-[12%] min-w-[56px]"} cursor-grab touch-none active:cursor-grabbing`}
      drag
      dragSnapToOrigin
      dragElastic={1}
      whileDrag={{ scale: 1.2, zIndex: 30 }}
      // info.point works for mouse and touch alike
      onDragEnd={(_, info) => onDrop(info.point)}
      data-hint={hint ? "tap" : undefined}
      data-hint-priority="1"
      data-drag-src={src ? "" : undefined}
    >
      {bob !== undefined ? (
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: (bob % 4) * 0.35 }}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
}

/** A tray object with its name underneath, and a small badge once it's been tried (a wet cloth stays wet). */
function TrayArt({ o, tried, bench }: { o: TryObject; tried?: TryResult; bench: TryBench }) {
  const wet = tried === "soak" || tried === "soggy";
  return (
    <div className="relative flex flex-col items-center">
      <div className="w-full" style={wet ? { filter: "brightness(0.72) saturate(1.3)" } : undefined}>
        <Art k={o.art} className="pointer-events-none h-auto w-full" />
      </div>
      <span className="font-display pointer-events-none -mt-1 rounded-full bg-paper/90 px-2 text-center text-[clamp(0.8rem,1.15vw,1.1rem)] leading-tight whitespace-nowrap text-ink shadow-[var(--shadow-pressed)]">
        {o.label}
      </span>
      {tried && (
        <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-paper text-[1rem] shadow-[var(--shadow-paper)]" aria-hidden>
          {GROUPS[bench][isYes(tried) ? 0 : 1].icon}
        </span>
      )}
    </div>
  );
}

function GuessButton({ r, bench, onPick }: { r: TryResult; bench: TryBench; onPick: (r: TryResult) => void }) {
  const g = GROUPS[bench][isYes(r) ? 0 : 1];
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={() => onPick(r)}
      aria-label={g.label}
      data-hint="tap"
      data-guess=""
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="paper flex min-h-[var(--touch-big)] min-w-[7.5rem] flex-col items-center justify-center gap-1 self-center px-5 py-3"
    >
      <span className="text-[2.6rem] leading-none" aria-hidden>
        {g.icon}
      </span>
      <span className="font-display text-[1.25rem] leading-none text-ink">{g.label}</span>
    </motion.button>
  );
}

/** A hand showing where to drag: from the first object to the experiment, over and over. */
function DragHint({ area, target }: { area: React.RefObject<HTMLDivElement | null>; target: React.RefObject<HTMLDivElement | null> }) {
  const [path, setPath] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const a = area.current?.getBoundingClientRect();
      const s = area.current?.querySelector("[data-drag-src]")?.getBoundingClientRect();
      const t = target.current?.getBoundingClientRect();
      if (!a || !s || !t) return;
      setPath({ x0: s.left + s.width / 2 - a.left, y0: s.top + s.height / 2 - a.top, x1: t.left + t.width / 2 - a.left, y1: t.top + t.height * 0.55 - a.top });
    };
    // wait for the object to slide out from behind Milo
    const t = setTimeout(measure, 1600);
    return () => clearTimeout(t);
  }, [area, target]);
  if (!path) return null;
  return (
    <motion.span
      className="pointer-events-none absolute z-30 text-[3rem] leading-none drop-shadow-md"
      style={{ left: 0, top: 0 }}
      initial={{ x: path.x0, y: path.y0, opacity: 0 }}
      animate={{ x: [path.x0, path.x0, path.x1, path.x1], y: [path.y0, path.y0, path.y1, path.y1], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.2, times: [0, 0.15, 0.75, 1], repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
      aria-hidden
    >
      👆
    </motion.span>
  );
}

/* ---------- the benches (drawn to fill their box, sitting on its bottom edge) ---------- */

function Bench({ bench, puddle }: { bench: TryBench; puddle: number }) {
  if (bench === "bowl")
    // a blue ceramic bowl on the floor, seen from a little above: rim + water here, its body in BowlFront
    return (
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="bw-water" cx="45%" cy="40%" r="65%">
            <stop offset="0" stopColor="#c9e6f3" />
            <stop offset="1" stopColor="#8fc0dc" />
          </radialGradient>
        </defs>
        <ellipse cx={200} cy={252} rx={150} ry={9} fill="#3a3833" opacity={0.14} />
        <ellipse cx={200} cy={120} rx={152} ry={30} fill="#f6efe1" />
        <ellipse cx={200} cy={124} rx={138} ry={22} fill="url(#bw-water)" />
        <path d="M130 120 C150 114 170 114 190 120 M220 130 C240 124 262 124 280 130 M160 134 C176 130 192 130 206 134" stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.7} strokeLinecap="round" />
      </svg>
    );
  if (bench === "puddle")
    return (
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full" aria-hidden>
        <motion.path
          d="M80 200 C80 178 130 170 170 174 C210 164 290 166 318 184 C346 200 330 226 290 230 C250 236 190 232 160 230 C110 232 80 222 80 200 Z"
          fill="#8fb6cc"
          style={{ transformOrigin: "200px 200px", transformBox: "view-box" }}
          animate={{ scale: puddle, opacity: puddle ? 0.92 : 0 }}
          transition={{ duration: puddle === 1 ? 0.4 : 1.4, ease: "easeInOut" }}
        />
      </svg>
    );
  if (bench === "magnet")
    return (
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full" aria-hidden>
        {/* a little wooden stand on the counter, with the magnet hanging from its arm */}
        <rect x={262} y={244} width={120} height={16} rx={5} fill="#a8723f" />
        <rect x={326} y={18} width={16} height={230} rx={4} fill="#c48e5c" />
        <rect x={186} y={10} width={156} height={16} rx={5} fill="#c48e5c" />
        <path d="M200 26 V44" stroke="#8d8270" strokeWidth={3} />
        {/* horseshoe, opening down: things touch the silver ends */}
        <path
          d="M170 104 V72 C170 50 184 40 200 40 C216 40 230 50 230 72 V104 H216 V72 C216 62 210 56 200 56 C190 56 184 62 184 72 V104 Z"
          fill="#c9634f"
        />
        <rect x={170} y={92} width={14} height={14} fill="#cfd4d8" />
        <rect x={216} y={92} width={14} height={14} fill="#cfd4d8" />
      </svg>
    );
  // push: just the floor line and a flag, across the whole floor
  return (
    <div className="absolute inset-0" aria-hidden>
      <div className="absolute inset-x-0 bottom-[22%] h-[5px] rounded-full bg-ink/15" />
      <span className="absolute right-[1%] bottom-[23%] text-[2.6rem] leading-none">🚩</span>
    </div>
  );
}

/** The front of the bowl, drawn over the water so things that sink go INTO it. */
function BowlFront() {
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <path d="M48 120 A152 30 0 0 0 352 120 C346 206 282 250 200 250 C118 250 54 206 48 120 Z" fill="#7fa6cf" />
      <path d="M48 120 A152 30 0 0 0 352 120" fill="none" stroke="#f6efe1" strokeWidth={9} />
      {/* a band of little dots, and a soft highlight */}
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={96 + i * 26} cy={186 + Math.abs(i - 4) * -2.2} r={5} fill="#f6efe1" opacity={0.85} />
      ))}
      <path d="M74 150 C82 190 110 222 150 236" stroke="#ffffff" strokeWidth={7} fill="none" opacity={0.35} strokeLinecap="round" />
      <rect x={156} y={244} width={88} height={10} rx={5} fill="#5f86b2" />
    </svg>
  );
}

/** The magnet stand's drawing box (Bench, magnet) and where the silver tips end. */
const MAG_VIEW = { w: 400, h: 260, tipX: 200, leftTipX: 177, tipBottom: 106, span: 60 };

/**
 * The magnet: the object rises until its top edge TOUCHES the silver tips, then
 * either sticks, or touches… waits… and drops back. Measured in pixels, because
 * the stand is drawn "meet" (it scales with the box) and every picture has a
 * different amount of empty space above it.
 */
function MagnetActor({ o }: { o: TryObject }) {
  const ref = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState<{ left: number; width: number; touch: number; land: number; originY: number } | null>(null);
  useLayoutEffect(() => {
    const box = ref.current?.parentElement;
    const svg = ref.current?.querySelector("svg");
    if (!box || !svg) return;
    const W = box.clientWidth;
    const H = box.clientHeight;
    const scale = Math.min(W / MAG_VIEW.w, H / MAG_VIEW.h);
    const ox = (W - MAG_VIEW.w * scale) / 2;
    const oy = H - MAG_VIEW.h * scale;
    const width = 64 * scale;
    // where the drawing actually is inside its 100×100 box
    let bb = { x: 0, y: 0, width: 100, height: 100 };
    try {
      bb = svg.getBBox();
    } catch {}
    const top = Math.max(0, bb.y);
    const above = (top / 100) * width;
    // wide things touch both tips; narrow ones (a paper clip) would slip up between them, so they go under one tip
    const wide = (bb.width / 100) * width >= MAG_VIEW.span * 0.75 * scale;
    const centre = (wide ? MAG_VIEW.tipX : MAG_VIEW.leftTipX) * scale + ox;
    const contentCentre = ((bb.x + bb.width / 2) / 100) * width;
    setAt({
      left: centre - contentCentre,
      width,
      touch: oy + MAG_VIEW.tipBottom * scale - above - 1,
      // resting on the desk: the bottom of the box is the desktop
      land: H - ((Math.min(100, bb.y + bb.height)) / 100) * width,
      originY: Math.max(0, top),
    });
  }, []);
  const r = o.result;
  return (
    <motion.div
      ref={ref}
      className="pointer-events-none absolute"
      style={at ? { left: at.left, width: at.width, transformOrigin: `50% ${at.originY}%` } : { left: "43.5%", width: "13%", visibility: "hidden" }}
      initial={{ top: at?.land ?? 0, opacity: 0 }}
      animate={
        !at
          ? { opacity: 0 }
          : r === "stick"
            ? { top: [at.land, at.land, at.touch, at.touch], opacity: 1, rotate: [0, 0, -4, -4] }
            : // up to the tips… nothing… it drops back onto the desk with a little bounce, and stays there
              { top: [at.land, at.touch, at.touch, at.land, at.land - 10, at.land], opacity: 1, rotate: [0, 0, 4, -6, -2, 0] }
      }
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={
        r === "stick"
          ? { duration: 0.9, times: [0, 0.3, 0.62, 1], ease: "backOut", opacity: { duration: 0.15 } }
          : { duration: 2.1, times: [0, 0.28, 0.55, 0.78, 0.88, 1], ease: ["easeOut", "linear", "easeIn", "easeOut", "easeIn"], opacity: { duration: 0.15 } }
      }
    >
      <Art k={o.art} className="h-auto w-full" />
    </motion.div>
  );
}

/** The object in the experiment, doing its (scripted) thing. Positions are % of the bench box. */
function Actor({ bench, o }: { bench: TryBench; o: TryObject }) {
  const r = o.result;
  if (bench === "bowl")
    return (
      <>
        <motion.div
          className="pointer-events-none absolute w-[8%]"
          style={{ left: "46%" }}
          initial={{ top: "-150%", opacity: 0 }}
          animate={
            r === "float"
              ? { top: ["-150%", "30%", "22%", "26%"], opacity: 1, rotate: [0, 8, -5, 0] }
              : { top: ["-150%", "28%", "56%"], opacity: [0, 1, 1], rotate: [0, 10, 24] }
          }
          exit={{ opacity: 0 }}
          transition={{ duration: 1.7, times: r === "float" ? [0, 0.35, 0.7, 1] : [0, 0.35, 1], ease: "easeOut" }}
        >
          <Art k={o.art} className="h-auto w-full" />
        </motion.div>
        {/* a few bubbles where something sank */}
        {r === "sink" &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute h-[9%] w-[1.6%] rounded-full border-2 border-white/80"
              style={{ left: `${47 + i * 2}%`, top: "44%" }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: [0, -18, -30] }}
              transition={{ delay: 0.9 + i * 0.25, duration: 0.9 }}
            />
          ))}
      </>
    );
  if (bench === "puddle")
    return (
      <motion.div
        className="pointer-events-none absolute w-[11%]"
        style={{ left: "44.5%" }}
        initial={{ top: "-150%", opacity: 0 }}
        animate={
          r === "stay"
            ? { top: ["-150%", "46%", "46%", "10%"], opacity: 1 }
            : r === "soak"
              ? { top: ["-150%", "46%"], opacity: 1, filter: ["brightness(1)", "brightness(1)", "brightness(0.7)"] }
              : { top: ["-150%", "46%", "48%"], opacity: 1, skewX: [0, 0, 12], scaleY: [1, 1, 0.8], filter: ["brightness(1)", "brightness(1)", "brightness(0.78)"] }
        }
        exit={{ opacity: 0 }}
        transition={{ duration: 1.9, ease: "easeInOut" }}
      >
        <Art k={o.art} className="h-auto w-full" />
      </motion.div>
    );
  if (bench === "magnet") return <MagnetActor o={o} />;
  // push: rolling objects turn as far as they travel (no sliding wheels)
  return (
    <motion.div
      className="pointer-events-none absolute bottom-[23%] w-[11%]"
      initial={{ left: "4%" }}
      animate={
        r === "roll"
          ? { left: "80%", rotate: 760 }
          : r === "wobble"
            ? { left: ["4%", "28%", "48%"], rotate: [0, 160, 300, 330], y: [0, -6, 0, -3, 0] }
            : { left: ["4%", "16%", "18%"] }
      }
      exit={{ opacity: 0 }}
      transition={{ duration: r === "roll" ? 1.8 : r === "wobble" ? 1.7 : 0.6, ease: "easeOut" }}
    >
      <Art k={o.art} className="h-auto w-full" />
    </motion.div>
  );
}

function Race({ a, b, done, onGo }: { a: TryObject; b: TryObject; done: boolean; onGo: () => void }) {
  const lane = (o: TryObject, top: string) => (
    <div className="absolute inset-x-[4%] h-[16%]" style={{ top }}>
      <div className="absolute inset-x-0 bottom-0 h-[5px] rounded-full bg-ink/15" />
      <motion.div
        className="absolute bottom-[4%] flex w-[11%] flex-col items-center"
        initial={{ left: "0%" }}
        animate={done ? (o.result === "roll" ? { left: "82%" } : o.result === "wobble" ? { left: "50%" } : { left: "12%" }) : {}}
        transition={{ duration: o.result === "roll" ? 1.5 : 1.2, ease: "easeOut" }}
      >
        <motion.div className="w-full" animate={done && o.result === "roll" ? { rotate: 760 } : {}} transition={{ duration: 1.5, ease: "easeOut" }}>
          <Art k={o.art} className="h-auto w-full" />
        </motion.div>
      </motion.div>
      <span className="absolute right-0 bottom-[6px] text-[1.8rem]" aria-hidden>
        🏁
      </span>
    </div>
  );
  return (
    <div className="absolute inset-0">
      {/* both lanes on the floor */}
      {lane(a, "62%")}
      {lane(b, "82%")}
      {!done && <PushButton className="absolute top-[38%] left-[42%]" onPush={onGo} label="Push both" tutorial />}
    </div>
  );
}

/** A small wooden table standing on the floor; its top is where the bowl / magnet stand sits (58% down). */
function Table() {
  return (
    <div className="pointer-events-none absolute inset-x-[22%] top-[57%] h-[30%]" aria-hidden>
      <div className="absolute inset-x-0 top-0 h-[12%] rounded-md bg-[#c48e5c] shadow-[0_3px_0_#a8723f]" />
      <div className="absolute top-[12%] left-[6%] h-[88%] w-[4%] rounded-b-sm bg-[#a8723f]" />
      <div className="absolute top-[12%] right-[6%] h-[88%] w-[4%] rounded-b-sm bg-[#a8723f]" />
    </div>
  );
}

/** A wall shelf the waiting objects stand on (its top is 58% down), as wide as they need, on the right. */
function Shelf({ count }: { count: number }) {
  const width = count * 12 + (count - 1) * 2 + 5;
  return (
    <div className="pointer-events-none absolute top-[57.5%] right-[3.5%] h-[8%]" style={{ width: `${width}%` }} aria-hidden>
      <div className="absolute inset-x-0 top-0 h-[34%] rounded-md bg-[#c48e5c] shadow-[0_3px_0_#a8723f]" />
      <div className="absolute top-[34%] left-[8%] h-[66%] w-[2%] rotate-[-30deg] bg-[#a8723f]" />
      <div className="absolute top-[34%] right-[8%] h-[66%] w-[2%] rotate-[30deg] bg-[#a8723f]" />
    </div>
  );
}

/** The big "Push!" button (the arrow says which way things will go). */
function PushButton({ onPush, className = "", label = "Push", tutorial = false }: { onPush: () => void; className?: string; label?: string; tutorial?: boolean }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onPush}
      whileTap={{ scale: 0.92 }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      data-tap-hint={tutorial ? "" : undefined}
      className={`paper font-display z-10 flex min-h-[var(--touch-big)] items-center gap-2 px-6 text-[clamp(1.4rem,2.4vw,2rem)] text-ink ${className}`}
      style={{ "--paper-bg": "#f6d36b", boxShadow: "var(--shadow-lift)" } as React.CSSProperties}
    >
      Push!
      <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em]" aria-hidden>
        <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  );
}

/** A hand that points at one guess, then the other ("pick one of these"), tapping each. */
function GuessHint({ area }: { area: React.RefObject<HTMLDivElement | null> }) {
  const [pts, setPts] = useState<{ x: number; y: number }[] | null>(null);
  useLayoutEffect(() => {
    // after the object has come out from behind Milo and the buttons have appeared
    const t = setTimeout(() => {
      const a = area.current?.getBoundingClientRect();
      const btns = [...(area.current?.querySelectorAll("[data-guess]") ?? [])].map((b) => b.getBoundingClientRect());
      if (a && btns.length === 2) setPts(btns.map((b) => ({ x: b.left + b.width / 2 - a.left, y: b.top + b.height * 0.62 - a.top })));
    }, 2000);
    return () => clearTimeout(t);
  }, [area]);
  if (!pts) return null;
  const [l, r] = pts;
  return (
    <motion.span
      className="pointer-events-none absolute z-30 text-[3rem] leading-none drop-shadow-md"
      style={{ left: 0, top: 0 }}
      initial={{ x: l.x, y: l.y, opacity: 0 }}
      animate={{
        x: [l.x, l.x, l.x, r.x, r.x, r.x],
        y: [l.y + 20, l.y, l.y + 20, r.y + 20, r.y, r.y + 20],
        scale: [1, 0.85, 1, 1, 0.85, 1],
        opacity: 1,
      }}
      transition={{ duration: 3, times: [0, 0.15, 0.3, 0.6, 0.75, 0.9], repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      👆
    </motion.span>
  );
}

/** A hand that taps on whatever is marked data-tap-hint (re-found whenever `watch` changes). */
function TapHint({ area, watch }: { area: React.RefObject<HTMLDivElement | null>; watch: string }) {
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    setAt(null);
    const t = setTimeout(() => {
      const a = area.current?.getBoundingClientRect();
      const el = area.current?.querySelector("[data-tap-hint]")?.getBoundingClientRect();
      if (a && el) setAt({ x: el.left + el.width / 2 - a.left, y: el.top + el.height * 0.6 - a.top });
    }, 700);
    return () => clearTimeout(t);
  }, [area, watch]);
  if (!at) return null;
  return (
    <motion.span
      key={watch}
      className="pointer-events-none absolute z-30 text-[3rem] leading-none drop-shadow-md"
      style={{ left: at.x, top: at.y }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: [24, 4, 24], scale: [1, 0.86, 1] }}
      transition={{ y: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 1.1, repeat: Infinity }, opacity: { duration: 0.3 } }}
      aria-hidden
    >
      👆
    </motion.span>
  );
}

/**
 * Milo, as big as he always is, standing where he always stands: push him and
 * he tips over and rolls across the floor, then stays there, on his side.
 * (Positions are relative to the play area; he starts where StepFrame draws him.)
 */
function RollingMilo({ rolled, text, expression, talking, onPush }: { rolled: boolean; text: string | null; expression: Expression; talking: boolean; onPush: () => void }) {
  return (
    <div className="absolute" style={{ left: "-30.5%", bottom: "-11.8%", width: "37.5%" }}>
      <div className="absolute bottom-[96%] left-[8%] w-[190%] max-w-[24rem]">
        <SpeechBubble text={text} size="sm" />
      </div>
      <motion.button
        type="button"
        aria-label="Push Milo"
        data-hint={rolled ? undefined : "tap"}
        onClick={onPush}
        className="relative block w-full"
        style={{ transformOrigin: "50% 55%" }}
        // first he tips over onto his side (lying down, head to the right), then rolls along the
        // floor like a log: each half-turn he squashes thin (side-on) and back, bobbing as he goes
        animate={
          rolled
            ? {
                rotate: [0, -8, 90, 90, 90, 90, 90, 90, 90, 90],
                x: ["0%", "-4%", "10%", "40%", "70%", "100%", "130%", "160%", "190%", "196%"],
                y: ["0%", "0%", "22%", "20%", "22%", "20%", "22%", "20%", "22%", "22%"],
                scaleY: [1, 1, 1, 0.35, 1, 0.35, 1, 0.35, 1, 1],
              }
            : { rotate: [0, -3, 3, 0] }
        }
        transition={
          rolled
            ? { duration: 3, times: [0, 0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92, 1], ease: "easeInOut" }
            : { duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }
        }
      >
        <Character id="milo" expression={rolled ? "surprised" : expression} action="idle" talking={talking} className="h-auto w-full" />
      </motion.button>
    </div>
  );
}

function Groups({
  bench,
  objects,
  items,
  sorting,
  sorted,
  refs,
  onDrop,
}: {
  bench: TryBench;
  objects: TryObject[];
  items: number[];
  sorting: boolean;
  sorted: Record<number, boolean>;
  refs: React.RefObject<HTMLDivElement | null>[];
  onDrop: (i: number, p: { x: number; y: number }) => void;
}) {
  const inGroup = (g: number) => items.filter((i) => (g === 0) === isYes(objects[i].result) && (!sorting || sorted[i]));
  const loose = sorting ? items.filter((i) => !sorted[i]) : [];
  return (
    <div className="absolute inset-0 flex flex-col gap-[3%]">
      <div className="flex h-[66%] gap-[4%]">
        {[0, 1].map((g) => (
          <div key={g} ref={refs[g]} data-drop={`group-${g}`} className="flex-1">
            <Paper className="flex h-full flex-col items-center gap-2 p-3" tilt={g ? 1 : -1}>
              <span className="text-[2.2rem] leading-none" aria-hidden>
                {GROUPS[bench][g].icon}
              </span>
              <span className="font-display text-[1.2rem] leading-none text-ink-soft">{GROUPS[bench][g].label}</span>
              <div className="flex flex-wrap justify-center gap-2">
                {inGroup(g).map((i) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: sorting ? 0 : 0.3 + i * 0.25 }} className="w-[clamp(3rem,7vw,5rem)]">
                    <Art k={objects[i].art} className="h-auto w-full" />
                  </motion.div>
                ))}
              </div>
            </Paper>
          </div>
        ))}
      </div>
      {sorting && (
        <div className="flex flex-1 items-center justify-center gap-[3%]">
          {loose.map((i) => (
            <Draggable key={i} label={objects[i].label} onDrop={(p) => onDrop(i, p)} hint>
              <TrayArt o={objects[i]} bench={bench} />
            </Draggable>
          ))}
        </div>
      )}
    </div>
  );
}
