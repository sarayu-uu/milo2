"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CharacterAction, CharacterId, Expression } from "@/types/character";
import { speak, stopSpeaking } from "@/lib/audio/voice";

export interface SpeechState {
  text: string | null;
  expression: Expression;
  action: CharacterAction;
  talking: boolean;
}

/**
 * A character's "voice line" state: shows a bubble, speaks the line,
 * animates talking briefly, then settles. Lines fade after `holdMs`.
 */
export function useSpeech(who: CharacterId = "milo", initial: Partial<SpeechState> = {}) {
  const [state, setState] = useState<SpeechState>({
    text: null,
    expression: "neutral",
    action: "idle",
    talking: false,
    ...initial,
  });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const say = useCallback(
    (text: string, opts: { expression?: Expression; action?: CharacterAction; holdMs?: number; silent?: boolean } = {}) => {
      clear();
      const talkMs = Math.min(3200, 500 + text.length * 55);
      setState((s) => ({
        text,
        expression: opts.expression ?? s.expression,
        action: opts.action ?? "idle",
        talking: true,
      }));
      if (!opts.silent) speak(text, who);
      timers.current.push(setTimeout(() => setState((s) => ({ ...s, talking: false })), talkMs));
      if (opts.holdMs !== Infinity) {
        timers.current.push(setTimeout(() => setState((s) => ({ ...s, text: null })), opts.holdMs ?? talkMs + 4200));
      }
    },
    [who],
  );

  const pose = useCallback((p: { expression?: Expression; action?: CharacterAction }) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  useEffect(
    () => () => {
      clear();
      stopSpeaking();
    },
    [],
  );

  return { ...state, say, pose };
}
