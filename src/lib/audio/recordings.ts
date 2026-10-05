import type { GeneratedClip, SoundId } from "@/types/audio";
import type { CharacterId } from "@/types/character";
import { HOME_RECORDINGS } from "./scenes/home";
import { SCREEN_RECORDINGS } from "./scenes/screens";
import { SHADOW_RECORDINGS } from "./scenes/shadow";
import { WORLD_RECORDINGS } from "./scenes/world";
import { COMMON_RECORDINGS } from "./scenes/common";
import GENERATED from "./scenes/generated.json";

/** Exact dialogue matches; punctuation/case variants share the same recording. */
const MILO_LINES = [
  ...HOME_RECORDINGS.flatMap((clip) => clip.lines.map((line) => [line, clip.id, clip.durationMs] as const)),
  ...SCREEN_RECORDINGS.flatMap((clip) => clip.lines.map((line) => [line, clip.id, clip.durationMs] as const)),
  ...SHADOW_RECORDINGS.flatMap((clip) => clip.lines.map((line) => [line, clip.id, clip.durationMs] as const)),
  ...WORLD_RECORDINGS.flatMap((clip) => clip.lines.map((line) => [line, clip.id, clip.durationMs] as const)),
  ...COMMON_RECORDINGS.flatMap((clip) => clip.lines.map((line) => [line, clip.id, clip.durationMs] as const)),
  ["High five!", "vo-milo-high-five", 1306],
] as const satisfies ReadonlyArray<readonly [string, SoundId, number]>;

const normalize = (text: string) => text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const miloRecordings = new Map<string, SoundId>(MILO_LINES.map(([text, id]) => [normalize(text), id]));
const durations = new Map<string, number>(MILO_LINES.map(([text, , ms]) => [normalize(text), ms]));

/** Clips made by the voice pipeline (npm run voice:generate), for any character. */
const generated = new Map<string, { id: SoundId; ms: number }>(
  (GENERATED as GeneratedClip[]).flatMap((clip) => clip.lines.map((line) => [`${clip.speaker}|${normalize(line)}`, { id: clip.id, ms: clip.durationMs }] as const)),
);

export function recordingFor(text: string, who: CharacterId | "narrator") {
  const auto = generated.get(`${who}|${normalize(text)}`);
  if (auto) return auto.id;
  return who === "milo" ? miloRecordings.get(normalize(text)) : undefined;
}

/** Measured from the supplied files; keeps the talking pose alive for the clip. */
export function recordingDuration(text: string, who: CharacterId | "narrator") {
  const auto = generated.get(`${who}|${normalize(text)}`);
  if (auto) return auto.ms;
  return who === "milo" ? durations.get(normalize(text)) : undefined;
}
