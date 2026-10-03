import type { ActivityDefinition, ActivityMeta, ActivityStep } from "@/types/activity";
import { meta as shadowMystery } from "./shadow-mystery/meta";
import { meta as mysteryBag } from "./squirrel-mystery-bag/meta";
import { meta as howManyCups } from "./how-many-cups/meta";
import { meta as snailPattern } from "./snail-pattern-path/meta";
import { meta as drawLamp } from "./draw-a-lamp/meta";
import { meta as zoomyLines } from "./dog-zoomy-lines/meta";
import { meta as paperBoat } from "./paper-boat/meta";
import { meta as dogFreeze } from "./dog-says-freeze/meta";
import { meta as catStory } from "./sleepy-cat-story/meta";
import { meta as mmmHunt } from "./mmm-hunt/meta";
import { meta as sockPairs } from "./sock-pairs/meta";

/**
 * Activity catalog.
 *
 * Cards and navigation only need `meta` (small, bundled). The step content
 * of each activity is code-split and loaded when the activity opens.
 *
 * To add an activity:
 *   1. create data/activities/<id>/meta.ts + steps.ts
 *   2. add it to CATALOG + LOADERS below
 *   3. reference its id from a theme (data/themes) and/or a room object
 * Later this module can be backed by a CMS / Supabase table without UI changes.
 */
const CATALOG: ActivityMeta[] = [
  shadowMystery,
  mysteryBag,
  howManyCups,
  snailPattern,
  drawLamp,
  zoomyLines,
  paperBoat,
  dogFreeze,
  catStory,
  mmmHunt,
  sockPairs,
];

const LOADERS: Record<string, () => Promise<{ steps: ActivityStep[] }>> = {
  "shadow-mystery": () => import("./shadow-mystery/steps"),
  "squirrel-mystery-bag": () => import("./squirrel-mystery-bag/steps"),
  "how-many-cups": () => import("./how-many-cups/steps"),
  "snail-pattern-path": () => import("./snail-pattern-path/steps"),
  "draw-a-lamp": () => import("./draw-a-lamp/steps"),
  "dog-zoomy-lines": () => import("./dog-zoomy-lines/steps"),
  "paper-boat": () => import("./paper-boat/steps"),
  "dog-says-freeze": () => import("./dog-says-freeze/steps"),
  "sleepy-cat-story": () => import("./sleepy-cat-story/steps"),
  "mmm-hunt": () => import("./mmm-hunt/steps"),
  "sock-pairs": () => import("./sock-pairs/steps"),
};

const BY_ID = new Map(CATALOG.map((a) => [a.id, a]));

export function listActivities(): ActivityMeta[] {
  return CATALOG;
}

export function getActivityMeta(id: string): ActivityMeta | undefined {
  return BY_ID.get(id);
}

export async function loadActivity(id: string): Promise<ActivityDefinition | null> {
  const meta = BY_ID.get(id);
  const load = LOADERS[id];
  if (!meta || !load) return null;
  const { steps } = await load();
  return { ...meta, steps };
}

export function activityIds(): string[] {
  return CATALOG.map((a) => a.id);
}
