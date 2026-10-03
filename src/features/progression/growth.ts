import type { RevealRule, RoomDefinition, RoomObjectDefinition } from "@/types/world";
import { MILO_HOME } from "@/data/worlds/rooms";

/**
 * World progression.
 *
 * Milo's world grows quietly from play. There are no points on screen —
 * only rooms that open and objects that appear. "Growth" is internal:
 *   2 per distinct activity finished
 * + 1 per extra day the child came back
 * + 1 per 4 room visits (just wandering counts a little)
 * + parent/researcher preview bonus
 */
export interface ProgressSnapshot {
  completed: Record<string, { count: number }>;
  visitDays: string[];
  roomVisits: Record<string, number>;
  drawing: string | null;
  growthBonus: number;
}

export function computeGrowth(p: ProgressSnapshot): number {
  const unique = Object.keys(p.completed).length;
  const days = Math.max(0, p.visitDays.length - 1);
  const visits = Object.values(p.roomVisits).reduce((a, b) => a + b, 0);
  return unique * 2 + days + Math.floor(visits / 4) + p.growthBonus;
}

export function meetsRule(rule: RevealRule | undefined, p: ProgressSnapshot, growth = computeGrowth(p)): boolean {
  if (!rule) return true;
  if (rule.minGrowth !== undefined && growth < rule.minGrowth) return false;
  if (rule.minDays !== undefined && p.visitDays.length < rule.minDays) return false;
  if (rule.afterActivity && !p.completed[rule.afterActivity]) return false;
  if (rule.needsDrawing && !p.drawing) return false;
  return true;
}

export type RoomStatus = "open" | "teased" | "hidden";

/** Open rooms are enterable; exactly one next room is "teased" (taped doorway). */
export function roomStatuses(p: ProgressSnapshot): { room: RoomDefinition; status: RoomStatus }[] {
  const growth = computeGrowth(p);
  const rooms = [...MILO_HOME.rooms].sort((a, b) => a.stage - b.stage);
  let teased = false;
  return rooms.map((room) => {
    if (meetsRule(room.reveal, p, growth)) return { room, status: "open" as const };
    if (!teased) {
      teased = true;
      return { room, status: "teased" as const };
    }
    return { room, status: "hidden" as const };
  });
}

export function visibleObjects(room: RoomDefinition, p: ProgressSnapshot): RoomObjectDefinition[] {
  const growth = computeGrowth(p);
  return room.objects.filter((o) => meetsRule(o.reveal, p, growth));
}

/** Everything currently present in the world, for "what's new?" detection. */
export function allVisibleObjectIds(p: ProgressSnapshot): string[] {
  return roomStatuses(p)
    .filter((r) => r.status === "open")
    .flatMap((r) => visibleObjects(r.room, p).map((o) => o.id));
}
