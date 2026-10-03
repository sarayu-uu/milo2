"use client";

import { create } from "zustand";

/** Non-persisted, per-tab state. */
interface SessionState {
  hydrated: boolean;
  /** Parent gate passed in this session. Cleared when leaving the parent area. */
  parentUnlocked: boolean;
  /** The Core Learning strip that was open, so "back to activities" returns there. */
  openThemeId: string | null;
  /** Play Book transition phase (see PlaybookTransition). */
  playbookPhase: "idle" | "in" | "hold" | "out";
  setHydrated: () => void;
  setParentUnlocked: (v: boolean) => void;
  setOpenTheme: (id: string | null) => void;
  setPlaybookPhase: (p: "idle" | "in" | "hold" | "out") => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  hydrated: false,
  parentUnlocked: false,
  openThemeId: null,
  playbookPhase: "idle",
  setHydrated: () => set({ hydrated: true }),
  setParentUnlocked: (parentUnlocked) => set({ parentUnlocked }),
  setOpenTheme: (openThemeId) => set({ openThemeId }),
  setPlaybookPhase: (playbookPhase) => set({ playbookPhase }),
}));
