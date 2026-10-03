"use client";

import { useEffect, useId, useMemo, useState, type ReactNode, type RefObject } from "react";
import type { CharacterProps } from "@/types/character";
import { usePart } from "@/lib/animation/rig";
import { CrayonPalette } from "@/lib/animation/texture";
import { FEATHER_ANGLES, miloPose, type MiloPart } from "@/features/characters/miloPoses";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { sound } from "@/lib/audio/soundManager";

/** Shared across every Milo on screen, so several Milos never chatter at once. */
let lastBlinkSound = 0;
function blinkSound() {
  const now = Date.now();
  if (now - lastBlinkSound < 1500) return;
  lastBlinkSound = now;
  void sound.play("blink");
}

/**
 * MILO — geometric, friendly pigeon.
 *
 * One soft capsule body (head and body are the same shape), not fat:
 * about 0.6 wide : 1 tall. Blue-grey top, a sage + lavender band where a
 * pigeon's neck shimmer is, a cream lower belly. Big simple eyes with dark
 * pupils looking to the side, a small two-piece beak, two tiny head
 * feathers, stubby capsule wings with four feather tips, little orange
 * feet and a tiny satchel. Flat colour + subtle paper grain, no outlines.
 *
 *   <Milo expression="curious" action="headTilt" />
 */
const C = {
  body: "#62739c",
  wing: "#4b5c85",
  tail: "#43537a",
  belly: "#ece4d1",
  sage: "#86a78c",
  lav: "#9a8fbe",
  beak: "#e07a4c",
  beakLower: "#c76541",
  cere: "#f2ebdc",
  feet: "#e07a4c",
  eye: "#fbf7ee",
  pupil: "#2f2c2a",
  brow: "#323f60",
  pack: "#a8743f",
  packDark: "#7f5530",
  silhouette: "#2d2e3c",
};

const EYE_L = { cx: 121, cy: 106, r: 16 };
const EYE_R = { cx: 155, cy: 106, r: 16 };
/** The capsule body: round top, softly rounded bottom. */
const BODY = "M82 114 A56 56 0 0 1 194 114 L196 214 Q196 252 158 252 L118 252 Q80 252 80 214 Z";

interface MiloProps extends CharacterProps {
  /** His little explorer satchel. */
  satchel?: boolean;
  /** Fires when the child taps the high-five wing. */
  onWingTap?: () => void;
}

export function Milo({
  expression = "curious",
  action = "idle",
  flip = false,
  silhouette = false,
  talking = false,
  satchel = false,
  className,
  title,
  onWingTap,
}: MiloProps) {
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (silhouette || expression === "sleepy" || expression === "proud" || action === "sleep") return;
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        setBlink(true);
        blinkSound();
        setTimeout(() => setBlink(false), 130);
        schedule();
      }, 2400 + Math.random() * 3200);
    };
    schedule();
    return () => clearTimeout(t);
  }, [silhouette, expression, action]);

  const pose = useMemo(() => {
    const p = miloPose(expression, action, talking);
    if (blink || action === "blink") {
      p.lidL = { scaleY: 1, t: { duration: 0.06 } };
      p.lidR = { scaleY: 1, t: { duration: 0.06 } };
    }
    return p;
  }, [expression, action, talking, blink]);

  const r = (part: MiloPart) => pose[part];
  const rig = {
    root: usePart(r("root"), reduced),
    body: usePart(r("body"), reduced),
    belly: usePart(r("belly"), reduced),
    head: usePart(r("head"), reduced),
    wingL: usePart(r("wingL"), reduced),
    wingR: usePart(r("wingR"), reduced),
    footL: usePart(r("footL"), reduced),
    footR: usePart(r("footR"), reduced),
    beak: usePart(r("beak"), reduced),
    pupilL: usePart(r("pupilL"), reduced),
    pupilR: usePart(r("pupilR"), reduced),
    lidL: usePart(r("lidL"), reduced),
    lidR: usePart(r("lidR"), reduced),
    smileL: usePart(r("smileL"), reduced),
    smileR: usePart(r("smileR"), reduced),
    browL: usePart(r("browL"), reduced),
    browR: usePart(r("browR"), reduced),
  };
  const featherL = [usePart(r("fL0"), reduced), usePart(r("fL1"), reduced), usePart(r("fL2"), reduced), usePart(r("fL3"), reduced)];
  const featherR = [usePart(r("fR0"), reduced), usePart(r("fR1"), reduced), usePart(r("fR2"), reduced), usePart(r("fR3"), reduced)];

  const paper = new CrayonPalette(uid, "soft");
  // Wings render in child components after defs are built: register their paints up front.
  paper.paint(C.wing);
  const f = (c: string) => (silhouette ? C.silhouette : paper.paint(c));
  const flat = (c: string) => (silhouette ? C.silhouette : c);
  const detail = !silhouette;

  return (
    <svg
      viewBox="-50 -40 340 310"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ overflow: "visible" }}
    >
      {title && <title>{title}</title>}
      <defs>
        <clipPath id={`body-${uid}`}>
          <path d={BODY} />
        </clipPath>
        <clipPath id={`eyeL-${uid}`}>
          <circle cx={EYE_L.cx} cy={EYE_L.cy} r={EYE_L.r} />
        </clipPath>
        <clipPath id={`eyeR-${uid}`}>
          <circle cx={EYE_R.cx} cy={EYE_R.cy} r={EYE_R.r} />
        </clipPath>
      </defs>

      <g transform={flip ? "translate(276 0) scale(-1 1)" : undefined}>
        {/* soft paper shadow */}
        {detail && <ellipse cx={138} cy={260} rx={66} ry={7} fill="rgba(120, 95, 60, 0.16)" />}

        <Pivot x={138} y={258} rig={rig.root}>
          <Pivot x={138} y={252} rig={rig.body}>
            {/* tiny tail peeking out behind */}
            <path d="M84 222 C70 222 58 228 54 236 C62 240 74 238 86 232 Z" fill={f(C.tail)} />
            <path d="M86 232 C74 238 66 246 64 252 C74 252 82 246 90 240 Z" fill={f(C.wing)} />

            {/* far wing */}
            <g transform="translate(194 156) scale(-1 1)">
              <Wing rig={rig.wingR} feathers={featherR} f={f} />
            </g>

            {/* the capsule */}
            <path d={BODY} fill={f(C.body)} />
            <g clipPath={`url(#body-${uid})`}>
              {/* cream lower belly */}
              <Pivot x={138} y={252} rig={rig.belly}>
                <path d="M70 186 Q138 172 206 186 L206 270 L70 270 Z" fill={f(C.belly)} />
              </Pivot>
            </g>

            {/* little satchel on a strap */}
            {satchel && (
              <g>
                <path d="M92 158 L180 214" stroke={flat(C.packDark)} strokeWidth={4.5} strokeLinecap="round" />
                <rect x={172} y={204} width={26} height={22} rx={6} fill={flat(C.pack)} />
                <rect x={172} y={204} width={26} height={8} rx={4} fill={flat(C.packDark)} />
              </g>
            )}

            {/* ---------- head (top of the capsule) ---------- */}
            <Pivot x={138} y={150} rig={rig.head}>
              <circle cx={138} cy={114} r={56} fill={f(C.body)} />
              {/* two tiny head feathers */}
              <path d="M134 60 C130 52 131 46 135 44 C136 50 139 54 140 59 Z" fill={f(C.wing)} />
              <path d="M142 59 C145 53 150 50 154 51 C150 55 147 58 145 61 Z" fill={f(C.wing)} />

              {detail && (
                <>
                  <Eye {...EYE_L} clip={`eyeL-${uid}`} pupil={rig.pupilL} lid={rig.lidL} smile={rig.smileL} />
                  <Eye {...EYE_R} clip={`eyeR-${uid}`} pupil={rig.pupilR} lid={rig.lidR} smile={rig.smileR} />
                  <Pivot x={EYE_L.cx} y={84} rig={rig.browL}>
                    <path d="M112 85 Q121 81 130 84" stroke={C.brow} strokeWidth={2.4} fill="none" strokeLinecap="round" />
                  </Pivot>
                  <Pivot x={EYE_R.cx} y={84} rig={rig.browR}>
                    <path d="M146 84 Q155 81 164 85" stroke={C.brow} strokeWidth={2.4} fill="none" strokeLinecap="round" />
                  </Pivot>
                </>
              )}

              {/* small two-piece beak with a pale cere */}
              <g ref={rig.beak}>
                <path d="M133 131 L143 131 L138 139 Z" fill={flat(C.beakLower)} />
              </g>
              <path d="M130 126 C134 124 142 124 146 126 L138 136 Z" fill={flat(C.beak)} />
              {detail && <ellipse cx={138} cy={125.5} rx={4.4} ry={2.3} fill={C.cere} />}
            </Pivot>

            {/* neck shimmer band: sits over the bottom of the head, so head turns stay seamless */}
            <g clipPath={`url(#body-${uid})`}>
              <path d="M70 150 Q138 162 206 150 L206 166 Q138 178 70 166 Z" fill={flat(C.sage)} />
              <path d="M70 162 Q138 174 206 162 L206 170 Q138 182 70 170 Z" fill={flat(C.lav)} />
            </g>

            {/* near wing */}
            <g transform="translate(82 156)">
              <Wing rig={rig.wingL} feathers={featherL} f={f} onTap={onWingTap} />
            </g>
          </Pivot>

          {/* little orange feet */}
          <Pivot x={122} y={254} rig={rig.footL}>
            <Foot x={122} y={254} color={flat(C.feet)} />
          </Pivot>
          <Pivot x={154} y={254} rig={rig.footR}>
            <Foot x={154} y={254} color={flat(C.feet)} />
          </Pivot>
        </Pivot>
      </g>
      {!silhouette && paper.defs()}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

function Pivot({ x, y, rig, children }: { x: number; y: number; rig: RefObject<SVGGElement | null>; children: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g ref={rig}>
        <g transform={`translate(${-x} ${-y})`}>{children}</g>
      </g>
    </g>
  );
}

function Foot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={color}>
      <rect x={-3} y={-4} width={6} height={8} rx={3} />
      <rect x={-13} y={2} width={26} height={7} rx={3.5} />
    </g>
  );
}

function Wing({
  rig,
  feathers,
  f,
  onTap,
}: {
  rig: RefObject<SVGGElement | null>;
  feathers: RefObject<SVGGElement | null>[];
  f: (c: string) => string;
  onTap?: () => void;
}) {
  return (
    <g ref={rig} onPointerDown={onTap} style={onTap ? { cursor: "pointer" } : undefined}>
      {/* four feather tips (thumbs-up / high-five language) */}
      {FEATHER_ANGLES.map((a, i) => (
        <g key={i} transform={`translate(${(i - 1.5) * 5.5} 38) rotate(${a})`}>
          <g ref={feathers[i]}>
            <rect x={-3.5} y={0} width={7} height={13} rx={3.5} fill={f(C.wing)} />
          </g>
        </g>
      ))}
      {/* stubby capsule wing */}
      <rect x={-12} y={-4} width={24} height={46} rx={12} fill={f(C.wing)} />
      {onTap && <circle cx={0} cy={22} r={40} fill="transparent" />}
    </g>
  );
}

function Eye({
  cx,
  cy,
  r,
  clip,
  pupil,
  lid,
  smile,
}: {
  cx: number;
  cy: number;
  r: number;
  clip: string;
  pupil: RefObject<SVGGElement | null>;
  lid: RefObject<SVGGElement | null>;
  smile: RefObject<SVGGElement | null>;
}) {
  const k = r / 23; // poses are tuned for a 23-unit eye
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={C.eye} />
      <g clipPath={`url(#${clip})`}>
        <g transform={`translate(${cx} ${cy}) scale(${k})`}>
          <g ref={pupil}>
            {/* big dark pupil, looking to the side */}
            <circle cx={5} cy={2} r={13} fill={C.pupil} />
          </g>
        </g>
        <g transform={`translate(${cx - r - 2} ${cy - r - 2})`}>
          <g ref={lid}>
            <rect width={r * 2 + 4} height={r * 2 + 4} fill={C.body} />
          </g>
        </g>
        <g transform={`translate(${cx} ${cy}) scale(${k})`}>
          <g ref={smile}>
            <ellipse cx={0} cy={24} rx={34} ry={23} fill={C.body} />
          </g>
        </g>
      </g>
    </g>
  );
}
