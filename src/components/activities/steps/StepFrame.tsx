"use client";

import type { ReactNode } from "react";
import type { BackdropKey } from "@/types/activity";
import type { CharacterAction, CharacterId, Expression } from "@/types/character";
import { Character } from "@/components/characters/Character";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { NextArrow } from "@/components/scrapbook/primitives";
import { SceneStage } from "@/components/world/SceneStage";
import { Backdrop } from "./Backdrop";

/**
 * Shared layout for game-like steps: optional backdrop, a speaker in the
 * bottom-left with their line, the play area, and the big next arrow.
 */
export function StepFrame({
  backdrop = "paper",
  speaker,
  line,
  expression = "curious",
  action = "idle",
  talking,
  onNext,
  children,
  wide = false,
}: {
  backdrop?: BackdropKey;
  speaker?: CharacterId;
  line?: string | null;
  expression?: Expression;
  action?: CharacterAction;
  talking?: boolean;
  onNext?: (() => void) | null;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <SceneStage>
      <Backdrop k={backdrop} />
      {backdrop !== "paper" && <div className="absolute inset-0 bg-cream/35" />}
      <div className={`absolute inset-y-[12%] right-[4%] flex items-center justify-center ${wide ? "left-[4%]" : "left-[24%]"}`}>{children}</div>
      {speaker && (
        <div className="absolute bottom-[3%] left-[2%] z-20 w-[19%]">
          <div className="absolute bottom-[96%] left-[8%] w-[190%] max-w-[24rem]">
            <SpeechBubble text={line ?? null} size="sm" />
          </div>
          <Character id={speaker} expression={expression} action={action} talking={talking} className="h-auto w-full" />
        </div>
      )}
      {onNext && (
        <div className="absolute right-[3%] bottom-[5%] z-30">
          <NextArrow onClick={onNext} />
        </div>
      )}
    </SceneStage>
  );
}
