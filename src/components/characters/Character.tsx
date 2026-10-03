"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { CharacterId, CharacterProps } from "@/types/character";
import { Milo } from "./Milo";

/**
 * Generic character entry point:  <Character id="cat" expression="sleepy" action="sleep" />
 *
 * Milo is always bundled (he's everywhere). Supporting characters are
 * lazy-loaded so a screen only downloads who actually appears.
 * A future Rive-backed implementation can be dropped in per id.
 */
const registry: Record<CharacterId, ComponentType<CharacterProps>> = {
  milo: Milo,
  snail: dynamic(() => import("./Snail").then((m) => m.Snail), { ssr: false }),
  squirrel: dynamic(() => import("./Squirrel").then((m) => m.Squirrel), { ssr: false }),
  cat: dynamic(() => import("./Cat").then((m) => m.Cat), { ssr: false }),
  dog: dynamic(() => import("./Dog").then((m) => m.Dog), { ssr: false }),
};

export function Character({ id, ...props }: CharacterProps & { id: CharacterId }) {
  const Comp = registry[id];
  return <Comp {...props} />;
}
