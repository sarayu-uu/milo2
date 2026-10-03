export type SoundCategory = "ambient" | "character" | "interaction" | "success" | "environment";
export type AudioBus = "voice" | "sfx" | "ambience" | "activity";

export type SoundId =
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
  // ambient loops
  | "amb-living-room"
  | "amb-kitchen"
  | "amb-garden"
  | "amb-washroom"
  | "amb-rain";

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
