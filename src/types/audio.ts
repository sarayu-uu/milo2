export type SoundCategory = "ambient" | "character" | "interaction" | "success" | "environment";
export type AudioBus = "voice" | "sfx" | "ambience" | "activity";

export type SoundId = import("@/lib/audio/scenes/home").HomeRecordingId
  | import("@/lib/audio/scenes/screens").ScreenRecordingId
  | import("@/lib/audio/scenes/shadow").ShadowRecordingId
  | import("@/lib/audio/scenes/world").WorldRecordingId
  | import("@/lib/audio/scenes/common").CommonRecordingId
  | `vo-auto-${string}`
  | "vo-milo-hmm"
  | "vo-milo-i-had-two"
  | "vo-milo-tummy"
  | "vo-milo-two"
  | "vo-milo-together"
  | "vo-milo-high-five"
  | "vo-milo-little-help"
  | "vo-milo-surprise"
  | "milo-mrrp"
  | "milo-curious"
  | "milo-happy"
  | "milo-surprised"
  | "milo-high-five"
  | "sock-pull"
  | "amb-city-window"
  // interaction / UI
  | "paper-rustle"
  | "page-flip"
  | "tap"
  | "pop"
  | "tape"
  | "pencil"
  | "fold"
  | "whoosh"
  // success
  | "wood-click"
  | "bell"
  | "clap"
  | "slap"
  | "wrong-gentle"
  // character
  | "coo"
  | "footstep"
  | "boing"
  | "squeak"
  | "yawn"
  | "woof"
  | "comedic-pause"
  // environment
  | "water"
  | "cup-clink"
  | "bird-chirp"
  | "leaves"
  | "switch"
  | "blink"
  // ambient loops
  | "amb-living-room"
  | "amb-kitchen"
  | "amb-garden"
  | "amb-washroom"
  | "amb-rain"
  // real recorded effects, for listening games (public/audio/sfx)
  | "sfx-dog-bark"
  | "sfx-bell-ring"
  | "sfx-tap-water"
  | "sfx-cups-clink"
  | "sfx-mystery-clatter";

export interface SoundLicense {
  /** e.g. "self-made (procedural)", "Pixabay", "Freesound" */
  source: string;
  author?: string;
  license: string;
  url?: string;
  attributionRequired: boolean;
}

export interface SoundDefinition {
  id: SoundId;
  category: SoundCategory;
  /** Independent mixer channel; legacy categories remain useful for metadata. */
  bus?: AudioBus;
  /** File sources under /public/audio. If omitted, a procedural recipe is used. */
  src?: string[];
  /** Procedural recipe id (lib/audio/synth). Used when no file exists. */
  synth?: SoundId;
  volume: number;
  rate?: number;
  loop?: boolean;
  license: SoundLicense;
}

/** A clip made by the voice pipeline (src/lib/audio/scenes/generated.json). */
export interface GeneratedClip {
  id: `vo-auto-${string}`;
  speaker: string;
  folder: string;
  file: string;
  lines: string[];
  durationMs: number;
}
