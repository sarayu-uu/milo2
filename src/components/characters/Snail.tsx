"use client";

import type { CharacterProps } from "@/types/character";
import { CharacterSvg, CritterEye, Pivot, useCritterRig } from "./critterKit";

const C = {
  body: "#e9cba2",
  shell: "#a99bd0",
  swirl: "#c7bce5",
  dot: "#e2b33f",
  ink: "#4a3f36",
};

/** Snail — thoughtful, slow, loves patterns. A big round shell and eyes on stalks. */
export function Snail(props: CharacterProps) {
  const r = useCritterRig(props);
  const { f, flat, detail } = r;
  return (
    <CharacterSvg crayon={r.crayon} flip={props.flip} className={props.className} title={props.title}>
      <Pivot x={100} y={192} rig={r.root}>
        {/* foot */}
        <rect x={24} y={162} width={168} height={28} rx={14} fill={f(C.body)} />
        {/* head + stalks */}
        <Pivot x={52} y={164} rig={r.head}>
          <rect x={32} y={100} width={42} height={80} rx={21} fill={f(C.body)} />
          <g className="sway">
            <rect x={36} y={60} width={8} height={46} rx={4} fill={flat(C.body)} />
            {detail ? <CritterEye cx={40} cy={56} r={12} lid={r.lid} lidColor={C.body} id={`snl-${r.uid}`} /> : <circle cx={40} cy={56} r={12} fill={flat(C.body)} />}
          </g>
          <g className="sway-alt">
            <rect x={62} y={60} width={8} height={46} rx={4} fill={flat(C.body)} />
            {detail ? <CritterEye cx={66} cy={56} r={12} lid={r.lid2} lidColor={C.body} id={`snr-${r.uid}`} /> : <circle cx={66} cy={56} r={12} fill={flat(C.body)} />}
          </g>
          {detail && (
            <g transform="translate(53 132)">
              <g ref={r.mouth}>
                <path d="M-6 0 Q0 5 6 0" stroke={C.ink} strokeWidth={2.2} fill="none" strokeLinecap="round" />
              </g>
            </g>
          )}
        </Pivot>
        {/* shell */}
        <circle cx={124} cy={120} r={52} fill={f(C.shell)} />
        {detail && (
          <>
            <path
              d="M124 126 C118 126 116 118 122 115 C130 112 136 120 133 128 C129 138 114 139 108 129 C100 115 112 100 126 100 C146 100 156 118 150 136"
              fill="none"
              stroke={C.swirl}
              strokeWidth={6}
              strokeLinecap="round"
            />
            <circle cx={96} cy={150} r={4} fill={C.dot} />
            <circle cx={112} cy={158} r={4} fill={C.dot} />
            <circle cx={130} cy={160} r={4} fill={C.dot} />
          </>
        )}
      </Pivot>
    </CharacterSvg>
  );
}
