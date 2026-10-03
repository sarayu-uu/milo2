"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { milomiStorage, STORAGE_PREFIX } from "@/lib/storage/persist";
import { dayKey } from "@/lib/storage/dates";

export interface CompletionRecord {
  count: number;
  first: number;
  last: number;
}

interface ProgressState {
  completed: Record<string, CompletionRecord>;
  started: Record<string, number>;
  roomVisits: Record<string, number>;
  /** Distinct local days Milomi was opened. */
  visitDays: string[];
  /** World objects the child has already seen (so new ones can be "new"). */
  seenObjects: string[];
  /** Rooms the child has entered at least once. */
  discoveredRooms: string[];
  /** Rooms whose "tape peels off" reveal moment has played. */
  announcedRooms: string[];
  /** The child's latest kept drawing. Stays on this device; never sent anywhere. */
  drawing: string | null;
  extensions: Record<string, "started" | "skipped">;
  /** Researcher/parent preview: pretend extra growth (parent area only). */
  growthBonus: number;
  /** Home micro-mystery: which day's lost thing has been found. */
  foundMystery: string | null;

  recordDay: () => void;
  recordRoomVisit: (roomId: string) => void;
  markSeen: (objectIds: string[]) => void;
  startActivity: (id: string) => void;
  completeActivity: (id: string) => void;
  markAnnounced: (roomIds: string[]) => void;
  saveDrawing: (dataUrl: string) => void;
  setExtension: (activityId: string, state: "started" | "skipped") => void;
  addGrowthBonus: (n: number) => void;
  setFoundMystery: (dayItem: string) => void;
  reset: () => void;
}

const initial = {
  completed: {},
  started: {},
  roomVisits: {},
  visitDays: [] as string[],
  seenObjects: [] as string[],
  discoveredRooms: [] as string[],
  announcedRooms: [] as string[],
  drawing: null,
  extensions: {},
  growthBonus: 0,
  foundMystery: null as string | null,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial,
      recordDay: () =>
        set((s) => {
          const today = dayKey();
          return s.visitDays.includes(today) ? s : { visitDays: [...s.visitDays, today].slice(-120) };
        }),
      recordRoomVisit: (roomId) =>
        set((s) => ({
          roomVisits: { ...s.roomVisits, [roomId]: (s.roomVisits[roomId] ?? 0) + 1 },
          discoveredRooms: s.discoveredRooms.includes(roomId) ? s.discoveredRooms : [...s.discoveredRooms, roomId],
        })),
      markSeen: (ids) =>
        set((s) => {
          const fresh = ids.filter((id) => !s.seenObjects.includes(id));
          return fresh.length ? { seenObjects: [...s.seenObjects, ...fresh] } : s;
        }),
      startActivity: (id) => set((s) => ({ started: { ...s.started, [id]: (s.started[id] ?? 0) + 1 } })),
      completeActivity: (id) =>
        set((s) => {
          const now = Date.now();
          const prev = s.completed[id];
          return {
            completed: {
              ...s.completed,
              [id]: prev ? { ...prev, count: prev.count + 1, last: now } : { count: 1, first: now, last: now },
            },
          };
        }),
      markAnnounced: (ids) => set((s) => ({ announcedRooms: [...new Set([...s.announcedRooms, ...ids])] })),
      saveDrawing: (drawing) => set({ drawing }),
      setExtension: (activityId, state) => set((s) => ({ extensions: { ...s.extensions, [activityId]: state } })),
      addGrowthBonus: (n) => set((s) => ({ growthBonus: Math.max(0, s.growthBonus + n) })),
      setFoundMystery: (foundMystery) => set({ foundMystery }),
      reset: () => set({ ...initial }),
    }),
    {
      name: `${STORAGE_PREFIX}progress`,
      version: 1,
      storage: milomiStorage,
      skipHydration: true,
    },
  ),
);
