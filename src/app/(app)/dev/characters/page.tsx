"use client";

import { useState } from "react";
import { Character } from "@/components/characters/Character";
import type { CharacterAction, CharacterId, Expression } from "@/types/character";

const EXPRESSIONS: Expression[] = ["neutral", "curious", "confused", "happy", "surprised", "sleepy", "thinking", "suspicious", "proud"];
const ACTIONS: CharacterAction[] = ["idle", "blink", "headTilt", "walk", "waddle", "clap", "thumbsUp", "highFive", "wingsUp", "bellyPuff", "lookLeft", "lookRight", "stumble", "talk", "hop", "run", "sleep"];
const IDS: CharacterId[] = ["milo", "snail", "squirrel", "cat", "dog"];

/** Internal character workbench (not linked from the child UI). */
export default function CharacterWorkbench() {
  const [expression, setExpression] = useState<Expression>(() => (new URLSearchParams(window.location.search).get("e") as Expression) || "neutral");
  const [action, setAction] = useState<CharacterAction>(() => (new URLSearchParams(window.location.search).get("a") as CharacterAction) || "idle");
  const [run, setRun] = useState(0);
  const only = new URLSearchParams(window.location.search).get("only") as CharacterId | null;
  if (only) {
    return (
      <div className="flex h-full items-end justify-center gap-8 p-8">
        <Character id={only} expression={expression} action={action} className="h-[38rem] w-[38rem]" />
        <Character id={only} expression={expression} action={action} silhouette className="h-[20rem] w-[20rem] opacity-70" />
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col gap-3 overflow-auto p-4">
      <div className="flex flex-wrap gap-1 text-sm">
        {EXPRESSIONS.map((e) => (
          <button key={e} onClick={() => setExpression(e)} className={`rounded px-2 py-1 ${e === expression ? "bg-sage" : "bg-paper"}`}>
            {e}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 text-sm">
        {ACTIONS.map((a) => (
          <button
            key={a}
            onClick={() => {
              setAction(a);
              setRun((n) => n + 1);
            }}
            className={`rounded px-2 py-1 ${a === action ? "bg-mustard" : "bg-paper"}`}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-5 items-end gap-4">
        {IDS.map((id) => (
          <div key={`${id}-${run}`} className="flex flex-col items-center">
            <Character id={id} expression={expression} action={action} className="h-56 w-56" />
            <span className="font-hand text-xl">{id}</span>
          </div>
        ))}
      </div>
      <div className="flex h-40 items-end gap-6">
        <Character id="milo" silhouette action={action} className="h-40 w-40 opacity-70" />
        <Character id="milo" expression={expression} action={action} flip className="h-40 w-40" />
      </div>
    </div>
  );
}
