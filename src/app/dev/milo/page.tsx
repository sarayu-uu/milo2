"use client";

import { useState } from "react";
import { Milo } from "@/components/characters/Milo";
import type { CharacterAction, Expression } from "@/types/character";

/**
 * MILO — CHARACTER SHEET (internal, not linked from the child UI).
 * Judge Milo here, in isolation, before putting him back into scenes.
 */
const POSES: { name: string; note: string; expression: Expression; action: CharacterAction }[] = [
  { name: "Neutral", note: "slight lean, one foot out, head tilted, eyes up", expression: "neutral", action: "idle" },
  { name: "Curious", note: "neck forward, eyes on the thing, wing tucked", expression: "curious", action: "investigate" },
  { name: "Confused", note: "head turned, one brow up, wings apart", expression: "confused", action: "idle" },
  { name: "Proud", note: "belly out, eyes closed, wings on hips", expression: "proud", action: "idle" },
  { name: "Excited", note: "both wings up, squashed", expression: "happy", action: "excited" },
  { name: "Trying to reach", note: "stretches up; the belly stays put", expression: "curious", action: "reach" },
  { name: "Running", note: "pitched forward, feet going very fast", expression: "surprised", action: "run" },
  { name: "High five", note: "wing forward, four feathers", expression: "happy", action: "highFive" },
  { name: "Thumbs up", note: "feathers fold, one stays up", expression: "proud", action: "thumbsUp" },
  { name: "Bend down", note: "the tummy gets in the way", expression: "thinking", action: "peek" },
];

export default function MiloSheet() {
  const [n, setN] = useState(0);
  return (
    <div className="h-full overflow-y-auto bg-[#f3ead8] p-6">
      <div className="mb-4 flex items-baseline gap-4">
        <h1 className="font-display text-4xl text-ink">Milo</h1>
        <p className="font-hand text-xl text-ink-soft">character sheet · tap a pose to replay it</p>
      </div>

      <div className="mb-8 flex items-end gap-10">
        <figure className="w-[22rem]">
          <Milo expression="neutral" action="idle" className="h-auto w-full" />
          <figcaption className="font-display text-center text-lg">Neutral model</figcaption>
        </figure>
        <figure className="w-[14rem]">
          <Milo silhouette action="idle" className="h-auto w-full" />
          <figcaption className="font-display text-center text-lg">Silhouette</figcaption>
        </figure>
        <figure className="w-[14rem]">
          <Milo expression="curious" action="idle" satchel className="h-auto w-full" />
          <figcaption className="font-display text-center text-lg">With backpack</figcaption>
        </figure>
      </div>

      <div className="grid grid-cols-5 gap-x-6 gap-y-8">
        {POSES.map((p) => (
          <button key={p.name} type="button" className="text-left" onClick={() => setN((x) => x + 1)}>
            <Milo key={`${p.name}-${n}`} expression={p.expression} action={p.action} className="h-auto w-full" />
            <span className="font-display block text-lg text-ink">{p.name}</span>
            <span className="block text-sm text-ink-soft">{p.note}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
