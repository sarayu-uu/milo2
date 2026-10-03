import type { SoundId } from "@/types/audio";
import type { CharacterId } from "@/types/character";

/** Exact dialogue matches; punctuation/case variants share the same recording. */
const MILO_LINES = [
  ["Hmm…", "vo-milo-hmm"],
  ["I had TWO.", "vo-milo-i-had-two"],
  ["My tummy is in the way.", "vo-milo-tummy"],
  ["TWO!", "vo-milo-two"],
  ["We found it. Together.", "vo-milo-together"],
  ["High five!", "vo-milo-high-five"],
  ["Umm… little help?", "vo-milo-little-help"],
  ["Hmm, that wasn't there before.", "vo-milo-surprise"],
] as const satisfies ReadonlyArray<readonly [string, SoundId]>;

const normalize = (text: string) => text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const miloRecordings = new Map<string, SoundId>(MILO_LINES.map(([text, id]) => [normalize(text), id]));

export function recordingFor(text: string, who: CharacterId | "narrator") {
  return who === "milo" ? miloRecordings.get(normalize(text)) : undefined;
}
