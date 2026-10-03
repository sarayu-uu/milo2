import type { SoundId } from "@/types/audio";
import type { CharacterId } from "@/types/character";

/** Exact dialogue matches; punctuation/case variants share the same recording. */
const MILO_LINES = [
  ["Hmm…", "vo-milo-hmm", 1306],
  ["I had TWO.", "vo-milo-i-had-two", 2116],
  ["My tummy is in the way.", "vo-milo-tummy", 2116],
  ["TWO!", "vo-milo-two", 914],
  ["We found it. Together.", "vo-milo-together", 1724],
  ["High five!", "vo-milo-high-five", 1306],
  ["Umm… little help?", "vo-milo-little-help", 2351],
  ["Hmm, that wasn't there before.", "vo-milo-surprise", 2847],
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
