"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BroadAge } from "@/types/activity";
import { milomiStorage, STORAGE_PREFIX } from "@/lib/storage/persist";

export interface AudioSettings {
  /** Global mute. */
  muted: boolean;
  ambient: boolean;
  effects: boolean;
  /** Spoken character lines (speech-synthesis placeholder until recorded VO). */
  voice: boolean;
  ambientVolume: number;
  effectsVolume: number;
  voiceVolume: number;
  activity: boolean;
  activityVolume: number;
  masterVolume: number;
}

export type MotionPreference = "system" | "reduced" | "full";

interface SettingsState {
  age: BroadAge | null;
  audio: AudioSettings;
  motion: MotionPreference;
  textSize: "normal" | "large";
  setAge: (age: BroadAge | null) => void;
  setAudio: (patch: Partial<AudioSettings>) => void;
  toggleMute: () => void;
  setMotion: (m: MotionPreference) => void;
  setTextSize: (s: "normal" | "large") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      age: null,
      audio: {
        muted: false,
        ambient: true,
        effects: true,
        voice: true,
        ambientVolume: 0.35,
        effectsVolume: 0.8,
        voiceVolume: 0.9,
        activity: true,
        activityVolume: 0.8,
        masterVolume: 1,
      },
      motion: "system",
      textSize: "normal",
      setAge: (age) => set({ age }),
      setAudio: (patch) => set((s) => ({ audio: { ...s.audio, ...patch } })),
      toggleMute: () => set((s) => ({ audio: { ...s.audio, muted: !s.audio.muted } })),
      setMotion: (motion) => set({ motion }),
      setTextSize: (textSize) => set({ textSize }),
    }),
    {
      name: `${STORAGE_PREFIX}settings`,
      version: 1,
      storage: milomiStorage,
      // Older profiles have only ambient/effects volumes. Retain their settings
      // while supplying defaults for the new mixer channels.
      merge: (persisted, current) => {
        const saved = persisted as Partial<SettingsState> | undefined;
        return { ...current, ...saved, audio: { ...current.audio, ...saved?.audio } };
      },
      skipHydration: true,
    },
  ),
);
