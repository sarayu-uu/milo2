"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CharacterAction, CharacterId, Expression } from "@/types/character";
import { speak, stopSpeaking } from "@/lib/audio/voice";
import { recordingDuration } from "@/lib/audio/recordings";

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

  const lineId = useRef(0);

  const say = useCallback(
    (text: string, opts: { expression?: Expression; action?: CharacterAction; holdMs?: number; silent?: boolean } = {}) => {
      clear();
      const id = ++lineId.current;
      const current = () => lineId.current === id;
      const clipMs = opts.silent ? undefined : recordingDuration(text, who);
      const talkMs = clipMs === undefined ? Math.min(3200, 500 + text.length * 55) : clipMs + 200;
      const hideAfter = (from: number) => {
        if (opts.holdMs === Infinity) return;
        timers.current.push(setTimeout(() => current() && setState((s) => ({ ...s, text: null })), Math.max(opts.holdMs ?? talkMs + 4200, talkMs) - from));
      };
      const stopTalking = () => current() && setState((s) => ({ ...s, talking: false }));

      // Show the line and pose now; the beak waits until the voice is actually audible.
      setState((s) => ({ ...s, text, expression: opts.expression ?? s.expression, action: opts.action ?? "idle", talking: false }));

      const audible =
        !opts.silent &&
        speak(text, who, {
          onStart: () => {
            if (!current()) return;
            setState((s) => ({ ...s, talking: true }));
            // safety net in case the engine never reports the end
            timers.current.push(setTimeout(stopTalking, talkMs + 1500));
          },
          onEnd: stopTalking,
        });

      if (!audible) {
        // No sound (muted / voice off): animate the beak for roughly the line's length.
        setState((s) => ({ ...s, talking: !opts.silent }));
        timers.current.push(setTimeout(stopTalking, talkMs));
      }
      hideAfter(0);
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
