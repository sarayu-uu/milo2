"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Eraser, RotateCcw } from "lucide-react";
import type { DrawStep } from "@/types/activity";
import type { StepProps } from "@/features/activities/ActivityContext";
import { pick } from "@/features/curriculum/age";
import { useSpeech } from "@/hooks/useSpeech";
import { useProgressStore } from "@/stores/progressStore";
import { sound } from "@/lib/audio/soundManager";
import { Paper, PaperButton, Tape } from "@/components/scrapbook/primitives";
import { StepFrame } from "./StepFrame";

const CRAYONS = ["#3a3833", "#df917a", "#d8b45e", "#92b97e", "#8fa7ba", "#b4a8cd", "#b46b56", "#d8a5aa"];

/** Trace guides (pre-writing strokes). Coordinates in a 1000×600 box. */
const GUIDES: Record<string, string> = {
  zigzag: "M80 420 L240 160 L400 420 L560 160 L720 420 L900 160",
  wave: "M60 300 C160 120 260 120 360 300 C460 480 560 480 660 300 C760 120 860 120 940 300",
  loops: "M60 380 C120 160 260 160 240 300 C220 420 160 380 200 300 C260 180 420 160 420 300 C420 420 360 400 380 300 C420 180 580 160 580 300 C580 420 520 400 540 300 C580 180 740 160 740 300 C740 420 680 400 700 300 C740 200 880 200 940 380",
};

/**
 * Finger drawing on a sheet of paper, with crayon-ish strokes.
 * Free mode, or trace mode over a dashed guide.
 */
export function DrawCanvas({ step, band, onDone }: StepProps<DrawStep>) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(CRAYONS[1]);
  const [eraser, setEraser] = useState(false);
  const [marks, setMarks] = useState(0);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const lastSound = useRef(0);
  const voice = useSpeech(step.speaker ?? "milo", { expression: "curious" });
  const guide = step.mode === "trace" && step.guide ? GUIDES[pick(step.guide, band)] : null;

  useEffect(() => {
    voice.say(pick(step.prompt, band));
    const c = canvas.current!;
    const resize = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const snapshot = marks ? c.toDataURL() : null;
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      const ctx = c.getContext("2d")!;
      ctx.scale(dpr, dpr);
      if (snapshot) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height);
        img.src = snapshot;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const point = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const stroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const ctx = canvas.current!.getContext("2d")!;
    const w = Math.max(6, canvas.current!.getBoundingClientRect().width / 90);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (eraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 1;
      ctx.lineWidth = w * 3;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
      return;
    }
    // crayon: a few slightly offset, semi-transparent passes
    ctx.strokeStyle = color;
    for (let i = 0; i < 3; i++) {
      const j = () => (Math.random() - 0.5) * w * 0.35;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = w * (0.7 + Math.random() * 0.35);
      ctx.beginPath();
      ctx.moveTo(from.x + j(), from.y + j());
      ctx.lineTo(to.x + j(), to.y + j());
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const down = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drawing.current = true;
    const p = point(e);
    last.current = p;
    stroke(p, { x: p.x + 0.1, y: p.y + 0.1 });
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return;
    const p = point(e);
    stroke(last.current, p);
    last.current = p;
    const now = Date.now();
    if (now - lastSound.current > 380) {
      lastSound.current = now;
      void sound.play("pencil", { volume: 0.6 });
    }
  };
  const up = () => {
    if (drawing.current) setMarks((m) => m + 1);
    drawing.current = false;
    last.current = null;
  };

  const clear = () => {
    const c = canvas.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setMarks(0);
    void sound.play("paper-rustle");
  };

  const finish = () => {
    if (step.keepFor && marks > 0) {
      // Keep a small copy on this device only (taped into Milo's room).
      const src = canvas.current!;
      const out = document.createElement("canvas");
      const scale = 360 / src.width;
      out.width = 360;
      out.height = Math.round(src.height * scale);
      const ctx = out.getContext("2d")!;
      ctx.fillStyle = "#fbf8f1";
      ctx.fillRect(0, 0, out.width, out.height);
      ctx.drawImage(src, 0, 0, out.width, out.height);
      useProgressStore.getState().saveDrawing(out.toDataURL("image/jpeg", 0.8));
    }
    onDone();
  };

  return (
    <StepFrame speaker={step.speaker ?? "milo"} line={voice.text} expression={voice.expression} talking={voice.talking}>
      <div className="flex h-full w-full items-stretch gap-[2%]">
        <Paper className="relative flex-1 overflow-hidden" tilt={-0.6} tape="corners">
          {guide && (
            <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="pointer-events-none absolute inset-[6%] h-[88%] w-[88%]" aria-hidden>
              <path d={guide} fill="none" stroke="#b9ae98" strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
              <path d={guide} fill="none" stroke="#8d8270" strokeWidth={5} strokeDasharray="14 14" strokeLinecap="round" />
              <circle cx={guide.split(" ")[0].slice(1)} cy={guide.split(" ")[1]} r={20} fill="#92b97e" />
            </svg>
          )}
          <canvas
            ref={canvas}
            className="absolute inset-0 h-full w-full touch-none"
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onPointerLeave={up}
            aria-label="Drawing paper"
            data-hint={marks === 0 ? "draw" : undefined}
            data-hint-priority="1"
          />
        </Paper>

        {/* crayon box */}
        <div className="flex w-[clamp(4.5rem,8vw,6.5rem)] flex-col items-center gap-2">
          <div className="grid grid-cols-2 gap-2">
            {CRAYONS.map((c) => (
              <motion.button
                key={c}
                type="button"
                aria-label={`Crayon ${c}`}
                onClick={() => {
                  setColor(c);
                  setEraser(false);
                  void sound.play("tap");
                }}
                whileTap={{ scale: 0.9 }}
                className="relative h-[max(44px,2.8rem)] w-[max(26px,1.8rem)] rounded-t-full rounded-b-md shadow-[var(--shadow-pressed)]"
                style={{ background: c, outline: !eraser && color === c ? "3px solid #3a3833" : "none", outlineOffset: 2 }}
              />
            ))}
          </div>
          <button type="button" aria-label="Eraser" onClick={() => setEraser(true)} className={`paper flex h-12 w-12 items-center justify-center rounded-full ${eraser ? "ring-4 ring-ink/60" : ""}`}>
            <Eraser className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Start again" onClick={clear} className="paper flex h-12 w-12 items-center justify-center rounded-full">
            <RotateCcw className="h-5 w-5" />
          </button>
          <div className="relative mt-auto">
            <PaperButton color="#d8b45e" size="lg" onClick={finish} disabled={marks === 0} aria-label="I'm done" data-hint={marks > 0 ? "tap" : undefined} className="disabled:opacity-50">
              Done!
            </PaperButton>
            <Tape className="-top-2 left-1/2 -translate-x-1/2 scale-50" />
          </div>
        </div>
      </div>
    </StepFrame>
  );
}
