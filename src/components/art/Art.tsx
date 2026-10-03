"use client";

import type { CharacterId } from "@/types/character";
import { Character } from "@/components/characters/Character";
import { drawObject, P } from "./objects";

/**
 * Render any illustration by key.
 *   <Art k="ball" />            object
 *   <Art k="char:cat" />        a character (thumbnail use)
 *   <Art k="ball" silhouette /> dark shape only
 */
export function Art({
  k,
  className,
  silhouette = false,
  title,
}: {
  k: string;
  className?: string;
  silhouette?: boolean;
  title?: string;
}) {
  if (k.startsWith("char:")) {
    const [, id, expression] = k.split(":");
    return (
      <Character
        id={id as CharacterId}
        expression={(expression as never) ?? "neutral"}
        action={id === "cat" ? "sleep" : "idle"}
        silhouette={silhouette}
        className={className}
        title={title}
      />
    );
  }
  const drawn = drawObject(k);
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ overflow: "visible", filter: silhouette ? "brightness(0) opacity(0.78)" : undefined }}
    >
      {drawn ?? <circle cx={50} cy={50} r={30} fill={P.paper} />}
    </svg>
  );
}
