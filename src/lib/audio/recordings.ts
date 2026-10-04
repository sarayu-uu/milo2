import type { SoundId } from "@/types/audio";
import type { CharacterId } from "@/types/character";
import { HOME_RECORDINGS } from "./scenes/home";

/** Exact dialogue matches; punctuation/case variants share the same recording. */
const MILO_LINES = [
  ...HOME_RECORDINGS.flatMap((clip) => clip.lines.map((line) => [line, clip.id, clip.durationMs] as const)),
  ["High five!", "vo-milo-high-five", 1306],
] as const satisfies ReadonlyArray<readonly [string, SoundId, number]>;

const normalize = (text: string) => text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const miloRecordings = new Map<string, SoundId>(MILO_LINES.map(([text, id]) => [normalize(text), id]));
const durations = new Map<string, number>(MILO_LINES.map(([text, , ms]) => [normalize(text), ms]));

export function recordingFor(text: string, who: CharacterId | "narrator") {
  return who === "milo" ? miloRecordings.get(normalize(text)) : undefined;
}

/** Measured from the supplied files; keeps the talking pose alive for the clip. */
export function recordingDuration(text: string, who: CharacterId | "narrator") {
  return who === "milo" ? durations.get(normalize(text)) : undefined;
}
