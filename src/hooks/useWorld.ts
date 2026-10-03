"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useProgressStore } from "@/stores/progressStore";
import { computeGrowth, roomStatuses, visibleObjects, type ProgressSnapshot } from "@/features/progression/growth";
import type { RoomDefinition } from "@/types/world";

export function useProgressSnapshot(): ProgressSnapshot {
  return useProgressStore(
    useShallow((s) => ({
      completed: s.completed,
      visitDays: s.visitDays,
      roomVisits: s.roomVisits,
      drawing: s.drawing,
      growthBonus: s.growthBonus,
    })),
  );
}

export function useWorld() {
  const snap = useProgressSnapshot();
  const seen = useProgressStore((s) => s.seenObjects);
  const discovered = useProgressStore((s) => s.discoveredRooms);
  return useMemo(() => {
    const growth = computeGrowth(snap);
    const rooms = roomStatuses(snap);
    const objectsFor = (room: RoomDefinition) =>
      visibleObjects(room, snap).map((o) => ({ ...o, isNew: !seen.includes(o.id) && discovered.includes(room.id) }));
    return { growth, rooms, objectsFor, discovered, snap };
  }, [snap, seen, discovered]);
}
