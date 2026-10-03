"use client";

import type { CharacterProps } from "@/types/character";
import { CharacterSvg, CritterEye, Pivot, useCritterRig } from "./critterKit";

const C = {
  fur: "#efdfc2",
  patch: "#c98a52",
  muzzle: "#f8f0e0",
  nose: "#3e3230",
  tongue: "#e8949a",
  collar: "#6f8fb4",
  tag: "#e2b33f",
  ink: "#4a3f36",
};

/** Fast Dog — a cream capsule with tan floppy ears. Always slightly too excited. */
export function Dog(props: CharacterProps) {
  const r = useCritterRig(props);
  const { f, flat, detail } = r;
  return (
    <CharacterSvg crayon={r.crayon} flip={props.flip} className={props.className} title={props.title} viewBox="0 0 220 200" width={220}>
      <Pivot x={110} y={192} rig={r.root}>
        {/* wagging tail */}
        <Pivot x={142} y={150} rig={r.tail}>
          <g className="sway-base-left">
            <rect x={130} y={104} width={14} height={48} rx={7} fill={f(C.patch)} transform="rotate(32 137 150)" />
          </g>
        </Pivot>
        {/* body + stubby legs */}
        <Pivot x={110} y={170} rig={r.legs}>
          <rect x={84} y={170} width={20} height={22} rx={8} fill={flat(C.fur)} />
          <rect x={116} y={170} width={20} height={22} rx={8} fill={flat(C.fur)} />
        </Pivot>
        <rect x={78} y={112} width={64} height={68} rx={28} fill={f(C.fur)} />
        <rect x={84} y={118} width={52} height={10} rx={5} fill={flat(C.collar)} />
        <circle cx={110} cy={132} r={6} fill={flat(C.tag)} />

        {/* head */}
        <Pivot x={110} y={116} rig={r.head}>
          <rect x={66} y={22} width={88} height={98} rx={44} fill={f(C.fur)} />
          {/* a tan patch over one eye */}
          {detail && <ellipse cx={132} cy={62} rx={20} ry={22} fill={C.patch} opacity={0.85} />}
          {/* floppy ears */}
          <Pivot x={70} y={40} rig={r.earL}>
            <rect x={50} y={34} width={24} height={54} rx={12} fill={f(C.patch)} transform="rotate(14 62 40)" />
          </Pivot>
          <Pivot x={150} y={40} rig={r.earR}>
            <rect x={146} y={34} width={24} height={54} rx={12} fill={f(C.patch)} transform="rotate(-14 158 40)" />
          </Pivot>
          {detail && (
            <>
              <CritterEye cx={92} cy={64} r={14} lid={r.lid} lidColor={C.fur} id={`dgL-${r.uid}`} />
              <CritterEye cx={130} cy={64} r={14} lid={r.lid2} lidColor={C.patch} id={`dgR-${r.uid}`} />
              <ellipse cx={110} cy={96} rx={24} ry={17} fill={C.muzzle} />
              <ellipse cx={110} cy={88} rx={8} ry={6} fill={C.nose} />
              <g transform="translate(110 100)">
                <g ref={r.mouth}>
                  <path d="M-8 0 Q0 6 8 0" stroke={C.ink} strokeWidth={2.2} fill="none" strokeLinecap="round" />
                  <rect x={-5} y={2} width={10} height={10} rx={5} fill={C.tongue} />
                </g>
              </g>
            </>
          )}
        </Pivot>
      </Pivot>
    </CharacterSvg>
  );
}
