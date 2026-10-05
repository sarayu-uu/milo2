import type { GeneratedClip, SoundDefinition, SoundId, SoundLicense } from "@/types/audio";
import GENERATED from "./scenes/generated.json";
import type { SoundscapeId } from "@/types/activity";
import { HOME_RECORDINGS, type HomeRecordingId } from "./scenes/home";
import { SCREEN_RECORDINGS, type ScreenRecordingId } from "./scenes/screens";
import { SHADOW_RECORDINGS, type ShadowRecordingId } from "./scenes/shadow";
import { WORLD_RECORDINGS, type WorldRecordingId } from "./scenes/world";
import { COMMON_RECORDINGS, type CommonRecordingId } from "./scenes/common";

/**
 * Sound registry + licence metadata.
 *
 * To replace a procedural sound with a recorded one, drop the file in
 * /public/audio and add `src: ["/audio/file.webm", "/audio/file.mp3"]` plus
 * its licence. Never add a file whose licence is unclear.
 */
const SELF_MADE: SoundLicense = {
  source: "Milomi (procedural, synthesised in-browser)",
  license: "Owned by Milomi",
  attributionRequired: false,
};

const def = (
  id: SoundId,
  category: SoundDefinition["category"],
  volume: number,
  extra: Partial<SoundDefinition> = {},
): SoundDefinition => ({ id, category, volume, synth: id, license: SELF_MADE, ...extra });

const recording = (id: SoundId, filename: string): SoundDefinition => ({
  id, category: "character", bus: "voice", volume: 1,
  src: [`/audio/scenes/${filename}.mp3`],
  license: { source: "User-supplied Milo dialogue recording", license: "User-provided", attributionRequired: false },
});

export const SOUNDS: Record<SoundId, SoundDefinition> = {
  ...Object.fromEntries(HOME_RECORDINGS.map((clip) => [clip.id, recording(clip.id, `home/${clip.file.replace(/\.mp3$/, "")}`)])) as Record<HomeRecordingId, SoundDefinition>,
  ...Object.fromEntries(SCREEN_RECORDINGS.map((clip) => [clip.id, recording(clip.id, `${clip.folder}/${clip.file.replace(/\.mp3$/, "")}`)])) as Record<ScreenRecordingId, SoundDefinition>,
  ...Object.fromEntries(SHADOW_RECORDINGS.map((clip) => [clip.id, recording(clip.id, `${clip.folder}/${clip.file.replace(/\.mp3$/, "")}`)])) as Record<ShadowRecordingId, SoundDefinition>,
  ...Object.fromEntries(WORLD_RECORDINGS.map((clip) => [clip.id, recording(clip.id, `${clip.folder}/${clip.file.replace(/\.mp3$/, "")}`)])) as Record<WorldRecordingId, SoundDefinition>,
  ...Object.fromEntries(COMMON_RECORDINGS.map((clip) => [clip.id, recording(clip.id, `${clip.folder}/${clip.file.replace(/\.mp3$/, "")}`)])) as Record<CommonRecordingId, SoundDefinition>,
  // made by the voice pipeline: npm run voice:generate
  ...Object.fromEntries((GENERATED as GeneratedClip[]).map((clip) => [clip.id, recording(clip.id, `${clip.folder}/${clip.file.replace(/\.mp3$/, "")}`)])),
  "vo-milo-high-five": recording("vo-milo-high-five", "celebrations/high-five"),
  "milo-mrrp": def("milo-mrrp", "character", 0.5, { synth: "coo", rate: 0.85 }),
  "milo-curious": def("milo-curious", "character", 0.6, { synth: "coo", rate: 1.12 }),
  "milo-happy": def("milo-happy", "character", 0.6, { synth: "coo", rate: 1.3 }),
  "milo-surprised": def("milo-surprised", "character", 0.4, { synth: "squeak", rate: 0.8 }),
  "milo-high-five": def("milo-high-five", "character", 0.6, { synth: "slap" }),
  "sock-pull": def("sock-pull", "environment", 0.4, { synth: "fold", bus: "activity" }),
  "amb-city-window": def("amb-city-window", "ambient", 0.5, { loop: true }),
  "paper-rustle": def("paper-rustle", "interaction", 0.5),
  "page-flip": def("page-flip", "interaction", 0.5),
  tap: def("tap", "interaction", 0.45),
  pop: def("pop", "interaction", 0.5),
  tape: def("tape", "interaction", 0.45),
  pencil: def("pencil", "interaction", 0.4, { bus: "activity" }),
  fold: def("fold", "interaction", 0.55),
  whoosh: def("whoosh", "interaction", 0.4),

  "wood-click": def("wood-click", "success", 0.6),
  bell: def("bell", "success", 0.5),
  clap: def("clap", "success", 0.7),
  slap: def("slap", "success", 0.8),
  "wrong-gentle": def("wrong-gentle", "interaction", 0.4),

  coo: def("coo", "character", 0.6),
  footstep: def("footstep", "character", 0.45, { bus: "sfx" }),
  boing: def("boing", "character", 0.4, { bus: "sfx" }),
  squeak: def("squeak", "character", 0.4),
  yawn: def("yawn", "character", 0.5),
  woof: def("woof", "character", 0.5),
  "comedic-pause": def("comedic-pause", "character", 0.6, { bus: "sfx" }),

  water: def("water", "environment", 0.5),
  "cup-clink": def("cup-clink", "environment", 0.5),
  "bird-chirp": def("bird-chirp", "environment", 0.45, { bus: "ambience" }),
  leaves: def("leaves", "environment", 0.5, { bus: "ambience" }),
  switch: def("switch", "environment", 0.5, { bus: "sfx" }),
  blink: def("blink", "character", 0.22, { bus: "sfx" }),

  "amb-living-room": def("amb-living-room", "ambient", 0.6, { loop: true }),
  "amb-kitchen": def("amb-kitchen", "ambient", 0.6, { loop: true }),
  "amb-garden": def("amb-garden", "ambient", 0.7, { loop: true }),
  "amb-washroom": def("amb-washroom", "ambient", 0.6, { loop: true }),
  "amb-rain": def("amb-rain", "ambient", 0.5, { loop: true }),
};

export const SOUNDSCAPES: Record<SoundscapeId, SoundId | null> = {
  none: null,
  quiet: null,
  "living-room": "amb-living-room",
  kitchen: "amb-kitchen",
  garden: "amb-garden",
  washroom: "amb-washroom",
};

/** For the parent area "sound credits" list. */
export function attributionList() {
  return Object.values(SOUNDS)
    .filter((s) => s.license.attributionRequired)
    .map((s) => ({ id: s.id, ...s.license }));
}
