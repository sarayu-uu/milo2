"use client";

import type { CharacterProps } from "@/types/character";
import { CharacterSvg, CritterEye, Pivot, SleepyEye, useCritterRig } from "./critterKit";

const C = {
  fur: "#7d7c83",
  stripe: "#5c5b62",
  light: "#f4f0ea",
  ear: "#e9b5b3",
  nose: "#d98f93",
  ink: "#4a3f36",
};

/**
 * Old Cat — a grey tabby with a cream muzzle: big round head, triangle ears, small body.
 * Asleep, she's a loaf. `tailDangle` hangs her tail off the edge of
 * whatever she's sleeping on (it's part of her drawing, so it stays attached).
 */
export function Cat(props: CharacterProps & { tailDangle?: boolean }) {
  const r = useCritterRig(props);
  const { f, flat, detail } = r;
  const asleep = props.action === "sleep";

  if (asleep) {
    return (
      <CharacterSvg crayon={r.crayon} flip={props.flip} className={props.className} title={props.title} viewBox="0 0 220 200" width={220}>
        <Pivot x={110} y={190} rig={r.root}>
          {/* tail: dangling off the edge, or curled round the front */}
          {props.tailDangle ? (
            <path d="M44 168 C30 176 34 210 28 236 C26 246 34 250 38 242" stroke={flat(C.fur)} strokeWidth={13} fill="none" strokeLinecap="round" />
          ) : (
            <path d="M40 176 C26 186 50 196 90 192" stroke={flat(C.fur)} strokeWidth={13} fill="none" strokeLinecap="round" />
          )}
          {/* the loaf */}
          <rect x={30} y={118} width={150} height={72} rx={36} fill={f(C.fur)} />
          {detail && (
            <g stroke={C.stripe} strokeWidth={7} strokeLinecap="round">
              <path d="M70 120 V136 M92 118 V134 M114 118 V134" />
            </g>
          )}
          {/* cream underside so she stands out from the sofa */}
          <path d="M44 168 Q105 196 176 168 L176 172 Q176 190 150 190 L66 190 Q40 190 40 172 Z" fill={flat(C.light)} />
          {/* tucked paws */}
          <rect x={108} y={176} width={30} height={16} rx={8} fill={flat(C.light)} />
          <rect x={140} y={176} width={30} height={16} rx={8} fill={flat(C.light)} />
          {/* head */}
          <Pivot x={156} y={150} rig={r.head}>
            <path d="M126 106 L132 74 L152 98 Z" fill={f(C.fur)} />
            <path d="M162 98 L182 74 L188 106 Z" fill={f(C.fur)} />
            {detail && (
              <>
                <path d="M133 98 L135 84 L145 96 Z" fill={C.ear} />
                <path d="M170 96 L180 84 L182 98 Z" fill={C.ear} />
              </>
            )}
            <ellipse cx={157} cy={132} rx={42} ry={36} fill={f(C.fur)} />
            {detail && (
              <>
                <path d="M146 100 v10 M157 98 v11 M168 100 v10" stroke={C.stripe} strokeWidth={4} strokeLinecap="round" />
                <SleepyEye cx={142} cy={128} r={8} color={C.ink} />
                <SleepyEye cx={172} cy={128} r={8} color={C.ink} />
                <ellipse cx={157} cy={148} rx={13} ry={9} fill={C.light} />
                <path d="M153 142 h8 l-4 4 Z" fill={C.nose} />
              </>
            )}
          </Pivot>
        </Pivot>
        {detail && (
          <g className="font-hand" fill={C.ink} opacity={0.6}>
            <text x={186} y={84} fontSize={20} className="zzz">
              z
            </text>
            <text x={198} y={66} fontSize={15} className="zzz" style={{ animationDelay: "1.4s" }}>
              z
            </text>
          </g>
        )}
      </CharacterSvg>
    );
  }

  return (
    <CharacterSvg crayon={r.crayon} flip={props.flip} className={props.className} title={props.title} viewBox="0 0 220 200" width={220}>
      <Pivot x={110} y={192} rig={r.root}>
        {/* curly tail */}
        <Pivot x={134} y={176} rig={r.tail}>
          <path d="M132 176 C170 176 182 140 166 112 C160 102 150 106 156 116" stroke={flat(C.fur)} strokeWidth={13} fill="none" strokeLinecap="round" />
        </Pivot>
        {/* small body + legs */}
        <rect x={82} y={116} width={56} height={70} rx={26} fill={f(C.fur)} />
        <rect x={94} y={130} width={32} height={46} rx={16} fill={flat(C.light)} />
        <rect x={86} y={176} width={20} height={16} rx={8} fill={flat(C.light)} />
        <rect x={114} y={176} width={20} height={16} rx={8} fill={flat(C.light)} />
        {/* big round head */}
        <Pivot x={110} y={124} rig={r.head}>
          <Pivot x={74} y={48} rig={r.earL}>
            <path d="M58 56 L68 16 L92 44 Z" fill={f(C.fur)} />
            {detail && <path d="M66 46 L70 28 L82 42 Z" fill={C.ear} />}
          </Pivot>
          <Pivot x={146} y={48} rig={r.earR}>
            <path d="M128 44 L152 16 L162 56 Z" fill={f(C.fur)} />
            {detail && <path d="M138 42 L150 28 L154 46 Z" fill={C.ear} />}
          </Pivot>
          <ellipse cx={110} cy={80} rx={58} ry={50} fill={f(C.fur)} />
          {detail && (
            <>
              <path d="M98 34 v12 M110 32 v13 M122 34 v12" stroke={C.stripe} strokeWidth={5} strokeLinecap="round" />
              <CritterEye cx={88} cy={80} r={15} lid={r.lid} lidColor={C.fur} id={`ctL-${r.uid}`} />
              <CritterEye cx={132} cy={80} r={15} lid={r.lid2} lidColor={C.fur} id={`ctR-${r.uid}`} />
              <ellipse cx={110} cy={106} rx={20} ry={13} fill={C.light} />
              <path d="M105 99 h10 l-5 5 Z" fill={C.nose} />
              <g transform="translate(110 108)">
                <g ref={r.mouth}>
                  <path d="M-7 0 Q-3.5 4 0 0 Q3.5 4 7 0" stroke={C.ink} strokeWidth={2} fill="none" strokeLinecap="round" />
                </g>
              </g>
            </>
          )}
        </Pivot>
      </Pivot>
    </CharacterSvg>
  );
}
