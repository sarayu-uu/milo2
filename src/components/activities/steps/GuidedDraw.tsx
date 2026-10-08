"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { GuidedDrawStep, GuidedScene } from "@/types/activity";
import type { StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";
import type { SoundId } from "@/types/audio";
import { Character } from "@/components/characters/Character";
import { Paper } from "@/components/scrapbook/primitives";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { StepFrame } from "./StepFrame";

type Pt = { x: number; y: number };

/** How close (in the 1000×600 box) a finger must pass to count a dot as followed. Generous: these are 3 year olds. */
const NEAR = 62;
/** Share of a dotted line that must be covered. */
const COVER = 0.72;
/** A free stroke counts once it's at least this long. */
const FREE_MIN = 70;

/** What each scene looks like, and how it answers each finished stroke. */
const SCENES: Record<GuidedScene, { crayon: string; sound: SoundId; back: (done: number, finished: boolean) => ReactNode }> = {
  rain: { crayon: "#5f8fb8", sound: "water", back: (_d, finished) => <RainBack finished={finished} /> },
  fence: { crayon: "#8d6a43", sound: "wood-click", back: (_d, finished) => <FenceBack safe={finished} /> },
  road: { crayon: "#6b6a70", sound: "footstep", back: () => <RoadBack /> },
  "road-bendy": { crayon: "#6b6a70", sound: "footstep", back: () => <RoadBack tree /> },
  lamp: { crayon: "#e0a83a", sound: "pop", back: (_d, finished) => <LampBack lit={finished} /> },
};

/**
 * Drawing with a purpose. The child follows one big dotted line at a time;
 * once most of it is covered, their own crayon line becomes part of the scene
 * (rain, a fence, a road) and Milo reacts. Lifting a finger halfway is fine:
 * every stroke on the current line counts towards it.
 */
export function GuidedDraw({ step, band, onDone }: StepProps<GuidedDrawStep>) {
  const scene = SCENES[step.scene];
  const isRoad = step.scene.startsWith("road");
  const speaker = step.speaker ?? "milo";
  const voice = useSpeech(speaker, { expression: "curious" });
  const svg = useRef<SVGSVGElement>(null);
  const guidePath = useRef<SVGPathElement>(null);
  const samples = useRef<Pt[]>([]);

  const [g, setG] = useState(0); // which dotted line we're on
  const [kept, setKept] = useState<Pt[][]>([]); // finished strokes (part of the scene now)
  // strokes on the line in progress; mirrored in a ref so pointer-up always sees the latest points
  const [current, setCurrentState] = useState<Pt[][]>([]);
  const currentRef = useRef<Pt[][]>([]);
  const setCurrent = (next: Pt[][]) => {
    currentRef.current = next;
    setCurrentState(next);
  };
  const [free, setFree] = useState(0); // free strokes drawn
  const [finished, setFinished] = useState(false);
  const drawing = useRef(false);
  const lastSound = useRef(0);

  const guiding = g < step.strokes.length;
  const freeTarget = step.free ? pick(step.free.count, band) : 0;

  useEffect(() => {
    voice.say(pick(step.prompt, band));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // points along the current dotted line, to check how much of it the finger has followed
  useLayoutEffect(() => {
    const p = guidePath.current;
    if (!p) return;
    const len = p.getTotalLength();
    const n = Math.max(12, Math.round(len / 25));
    samples.current = Array.from({ length: n + 1 }, (_, i) => {
      const q = p.getPointAtLength((len * i) / n);
      return { x: q.x, y: q.y };
    });
  }, [g]);

  const toBox = (e: React.PointerEvent): Pt => {
    const el = svg.current!;
    const pt = el.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = el.getScreenCTM();
    const q = m ? pt.matrixTransform(m.inverse()) : pt;
    return { x: q.x, y: q.y };
  };

  const covered = (strokes: Pt[][]) => {
    const pts = strokes.flat();
    if (!pts.length || !samples.current.length) return 0;
    const hit = samples.current.filter((s) => pts.some((p) => (p.x - s.x) ** 2 + (p.y - s.y) ** 2 < NEAR * NEAR)).length;
    return hit / samples.current.length;
  };

  const finish = () => {
    setFinished(true);
    void sound.play("bell");
    voice.say(step.line, { expression: "happy", action: "wingsUp" });
  };

  const completeGuide = (strokes: Pt[][]) => {
    setKept((k) => [...k, ...strokes]);
    setCurrent([]);
    void sound.play(scene.sound);
    const line = step.strokes[g].line;
    const next = g + 1;
    setG(next);
    if (next < step.strokes.length) {
      if (line) voice.say(line, { expression: "happy", action: "headTilt" });
    } else if (step.free) {
      voice.say(step.free.prompt, { expression: "happy" });
    } else {
      finish();
    }
  };

  const down = (e: React.PointerEvent) => {
    if (finished) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    setCurrent([...currentRef.current, [toBox(e)]]);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const p = toBox(e);
    const next = currentRef.current.slice();
    next[next.length - 1] = [...next[next.length - 1], p];
    setCurrent(next);
    const now = Date.now();
    if (now - lastSound.current > 380) {
      lastSound.current = now;
      void sound.play("pencil", { volume: 0.6 });
    }
  };

  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const strokes = currentRef.current;
    if (guiding) {
      if (covered(strokes) >= COVER) completeGuide(strokes);
      return;
    }
    // free drawing: every proper stroke stays and counts
    const s = strokes[strokes.length - 1] ?? [];
    const length = s.reduce((sum, p, i) => (i ? sum + Math.hypot(p.x - s[i - 1].x, p.y - s[i - 1].y) : 0), 0);
    setKept((k) => [...k, ...strokes]);
    setCurrent([]);
    if (length < FREE_MIN) return;
    void sound.play(scene.sound);
    const n = free + 1;
    setFree(n);
    if (n >= freeTarget) finish();
  };

  // if a finger wandered off the dots, a gentle nudge (only once per line)
  const nudged = useRef(-1);
  useEffect(() => {
    if (!guiding || drawing.current || current.length < 3 || nudged.current === g) return;
    nudged.current = g;
    voice.say("Follow the dots, from the green spot!", { expression: "curious", action: "headTilt" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.length]);

  const guide = guiding ? step.strokes[g].guide : null;
  const start = guide?.match(/M\s*([\d.]+)[ ,]+([\d.]+)/);
  const walked = isRoad && finished;

  const paths = (strokes: Pt[][], key: string) =>
    strokes.map((s, i) => (
      <g key={`${key}-${i}`}>
        <path d={toD(s)} fill="none" stroke={scene.crayon} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" opacity={0.45} />
        <path d={toD(s)} fill="none" stroke={scene.crayon} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      </g>
    ));

  return (
    <StepFrame
      speaker={isRoad ? undefined : speaker}
      line={voice.text}
      expression={voice.expression}
      action={voice.action}
      talking={voice.talking}
      onNext={finished ? onDone : null}
      wide={isRoad}
    >
      <Paper className="relative flex h-full w-full items-center justify-center overflow-hidden p-[2%]" tilt={-0.5} tape="corners">
        <div className="relative max-h-full w-full" style={{ aspectRatio: "1000 / 600" }}>
          <svg
            ref={svg}
            viewBox="0 0 1000 600"
            className="absolute inset-0 h-full w-full touch-none"
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onPointerLeave={up}
            aria-label="Drawing paper"
            data-hint={!finished && kept.length + current.length === 0 ? "draw" : undefined}
            data-hint-priority="1"
          >
            {scene.back(g, finished)}
            {/* the road itself appears under the child's line once it's drawn */}
            {isRoad && !guiding && <path d={step.strokes[0].guide} fill="none" stroke="#c9c3b6" strokeWidth={70} strokeLinecap="round" />}
            {guide && (
              <g pointerEvents="none">
                <path d={guide} fill="none" stroke="#b9ae98" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} />
                <path ref={guidePath} d={guide} fill="none" stroke="#8d8270" strokeWidth={6} strokeDasharray="16 16" strokeLinecap="round" />
                {start && (
                  <motion.circle
                    cx={start[1]}
                    cy={start[2]}
                    r={22}
                    fill="#92b97e"
                    animate={{ r: [20, 26, 20] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}
              </g>
            )}
            {paths(kept, "k")}
            {paths(current, "c")}
          </svg>

          {/* road scenes: Milo is in the picture, and walks home along the child's road */}
          {isRoad && (
            <>
              <motion.div
                className="pointer-events-none absolute bottom-[10%] w-[17%]"
                initial={{ left: "1%" }}
                animate={{ left: walked ? "70%" : "1%" }}
                transition={{ duration: 3.2, ease: "easeInOut" }}
              >
                <div className="absolute bottom-[96%] left-[40%] w-[22rem] max-w-[60vw]">
                  <SpeechBubble text={voice.text} size="sm" />
                </div>
                <Character id="milo" expression={voice.expression} action={walked ? "waddle" : voice.action} talking={voice.talking} className="h-auto w-full" />
              </motion.div>
            </>
          )}
        </div>
        <AnimatePresence>
          {!guiding && step.free && !finished && (
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-display absolute top-[4%] right-[4%] rounded-full bg-paper px-4 py-1 text-[1.6rem] text-ink shadow-[var(--shadow-paper)]"
              aria-live="polite"
            >
              {free} / {freeTarget}
            </motion.span>
          )}
        </AnimatePresence>
      </Paper>
    </StepFrame>
  );
}

const toD = (s: Pt[]) => (s.length === 1 ? `M${s[0].x} ${s[0].y} l0.1 0.1` : `M${s.map((p) => `${p.x} ${p.y}`).join(" L")}`);

/* ------------------------------------------------------------------ */
/* Scene backgrounds (1000×600)                                        */
/* ------------------------------------------------------------------ */

/** Milo's window: a grey cloud; when the rain is done, drops keep falling. */
function RainBack({ finished }: { finished: boolean }) {
  return (
    <g pointerEvents="none">
      <rect width={1000} height={600} fill="#dfeaf0" />
      <rect y={530} width={1000} height={70} fill="#a9c49a" />
      {/* the cloud */}
      <g fill="#9aa6b2">
        <ellipse cx={500} cy={130} rx={250} ry={62} />
        <circle cx={390} cy={105} r={70} />
        <circle cx={510} cy={80} r={90} />
        <circle cx={630} cy={110} r={66} />
      </g>
      <g fill="#3a3833">
        <circle cx={460} cy={130} r={7} />
        <circle cx={540} cy={130} r={7} />
      </g>
      {finished &&
        Array.from({ length: 14 }, (_, i) => (
          <motion.line
            key={i}
            x1={160 + i * 50}
            x2={160 + i * 50}
            y1={200}
            y2={235}
            stroke="#5f8fb8"
            strokeWidth={7}
            strokeLinecap="round"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [0, 300], opacity: [0, 1, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: (i % 5) * 0.22, ease: "easeIn" }}
          />
        ))}
    </g>
  );
}

/** A little plant that wobbles (nervously) until the fence is up. */
function FenceBack({ safe }: { safe: boolean }) {
  return (
    <g pointerEvents="none">
      <rect width={1000} height={600} fill="#eef2e4" />
      <rect y={500} width={1000} height={100} fill="#a9c49a" />
      <motion.g
        style={{ transformOrigin: "500px 500px", transformBox: "view-box" }}
        animate={safe ? { rotate: 0 } : { rotate: [-7, 7, -7] }}
        transition={safe ? { duration: 0.4 } : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M500 500 C495 420 505 360 500 270" stroke="#7e8f63" strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d="M500 410 C450 380 430 350 440 330 C470 340 495 370 500 410 Z" fill="#92b97e" />
        <path d="M500 360 C550 330 570 300 560 280 C530 290 505 320 500 360 Z" fill="#92b97e" />
        <circle cx={500} cy={250} r={34} fill="#edba92" />
        <circle cx={500} cy={250} r={14} fill="#d8b45e" />
      </motion.g>
      {safe && (
        <text x={500} y={200} textAnchor="middle" fontSize={56} aria-hidden>
          💚
        </text>
      )}
    </g>
  );
}

/** Milo's side of the page and his house on the other. */
function RoadBack({ tree = false }: { tree?: boolean }) {
  return (
    <g pointerEvents="none">
      <rect width={1000} height={600} fill="#eef0e6" />
      <rect y={500} width={1000} height={100} fill="#a9c49a" />
      {/* house */}
      <g transform="translate(800 250)">
        <rect x={0} y={90} width={170} height={150} fill="#e7d3b3" />
        <path d="M-15 95 L85 10 L185 95 Z" fill="#c9634f" />
        <rect x={65} y={160} width={44} height={80} rx={6} fill="#8d6a43" />
        <rect x={20} y={115} width={36} height={32} fill="#9fc2d6" />
      </g>
      {tree && (
        <g transform="translate(560 250)">
          <rect x={-10} y={90} width={20} height={165} fill="#8d6a43" />
          <circle cx={0} cy={70} r={60} fill="#92b97e" />
        </g>
      )}
    </g>
  );
}

/** A dim room; a little picture of a lamp in the corner (what we're making). When it's done, the lamp lights up the room. */
function LampBack({ lit }: { lit: boolean }) {
  return (
    <g pointerEvents="none">
      <motion.rect width={1000} height={600} initial={false} animate={{ fill: lit ? "#fbf0cf" : "#b8b6c4" }} transition={{ duration: 1 }} />
      <rect y={540} width={1000} height={60} fill="#c9a77f" />
      {/* "this is a lamp" */}
      <g transform="translate(40 40)">
        <rect width={150} height={180} rx={10} fill="#fbf8f1" stroke="#d9cdb6" strokeWidth={3} />
        <path d="M45 30 H105 L120 72 H30 Z" fill="#d8b45e" />
        <rect x={72} y={72} width={6} height={58} fill="#8d6a43" />
        <ellipse cx={75} cy={136} rx={30} ry={8} fill="#8d6a43" />
        <text x={75} y={166} textAnchor="middle" fontSize={24} fontWeight={700} fill="#3a3833">
          a lamp
        </text>
      </g>
      {/* the light, once it's switched on */}
      {lit && (
        <motion.ellipse
          cx={500}
          cy={300}
          rx={260}
          ry={200}
          fill="#ffe28a"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.35, 0.55, 0.35], scale: 1 }}
          transition={{ opacity: { duration: 2.4, repeat: Infinity }, scale: { duration: 0.8 } }}
          style={{ transformOrigin: "500px 300px", transformBox: "view-box" }}
        />
      )}
    </g>
  );
}
