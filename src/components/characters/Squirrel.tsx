"use client";

import type { CharacterProps } from "@/types/character";
import { CharacterSvg, CritterEye, Pivot, useCritterRig } from "./critterKit";

const C = {
  fur: "#d97c46",
  tail: "#e08a50",
  light: "#f5e2c6",
  ear: "#f0b38f",
  nose: "#5a3326",
  tooth: "#fbf7ee",
  ink: "#4a3f36",
};

/** Squirrel — energetic collector: round head, small body, enormous curly tail. */
export function Squirrel(props: CharacterProps) {
  const r = useCritterRig(props);
  const { f, flat, detail } = r;
  return (
    <CharacterSvg crayon={r.crayon} flip={props.flip} className={props.className} title={props.title}>
      <Pivot x={100} y={192} rig={r.root}>
        {/* the big curly tail */}
        <Pivot x={124} y={170} rig={r.tail}>
          <circle cx={150} cy={104} r={44} fill={f(C.tail)} />
          <circle cx={146} cy={110} r={24} fill={flat(C.light)} opacity={0.6} />
          <rect x={118} y={128} width={34} height={52} rx={17} fill={f(C.tail)} />
        </Pivot>
        {/* small body */}
        <rect x={70} y={100} width={60} height={80} rx={28} fill={f(C.fur)} />
        <rect x={82} y={118} width={36} height={56} rx={18} fill={flat(C.light)} />
        {/* paws + feet */}
        <rect x={80} y={124} width={16} height={14} rx={7} fill={flat(C.fur)} />
        <rect x={104} y={124} width={16} height={14} rx={7} fill={flat(C.fur)} />
        <rect x={72} y={176} width={26} height={14} rx={7} fill={flat(C.fur)} />
        <rect x={104} y={176} width={26} height={14} rx={7} fill={flat(C.fur)} />
        {/* head */}
        <Pivot x={100} y={104} rig={r.head}>
          <Pivot x={70} y={36} rig={r.earL}>
            <circle cx={68} cy={34} r={14} fill={f(C.fur)} />
            {detail && <circle cx={68} cy={35} r={7} fill={C.ear} />}
          </Pivot>
          <Pivot x={130} y={36} rig={r.earR}>
            <circle cx={132} cy={34} r={14} fill={f(C.fur)} />
            {detail && <circle cx={132} cy={35} r={7} fill={C.ear} />}
          </Pivot>
          <circle cx={100} cy={66} r={42} fill={f(C.fur)} />
          {detail && (
            <>
              <CritterEye cx={84} cy={62} r={13} lid={r.lid} lidColor={C.fur} id={`sqL-${r.uid}`} />
              <CritterEye cx={116} cy={62} r={13} lid={r.lid2} lidColor={C.fur} id={`sqR-${r.uid}`} />
              <ellipse cx={100} cy={88} rx={20} ry={13} fill={C.light} />
              <ellipse cx={100} cy={82} rx={6} ry={4.5} fill={C.nose} />
              <g transform="translate(100 91)">
                <g ref={r.mouth}>
                  <rect x={-4} y={0} width={8} height={7} rx={2} fill={C.tooth} />
                </g>
              </g>
            </>
          )}
        </Pivot>
      </Pivot>
    </CharacterSvg>
  );
}
