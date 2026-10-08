import type { CharacterAction, CharacterId, Expression } from "./character";
import type { SoundId } from "./audio";

/* ------------------------------------------------------------------ */
/* Age adaptation                                                      */
/* ------------------------------------------------------------------ */

export type BroadAge = 3 | 4 | 5 | 6;

/**
 * Internal difficulty band. Children never see this.
 * "younger" ≈ 3–4, "older" ≈ 4½–5 (or a 4 year old with demonstrated play).
 */
export type AgeBand = "younger" | "older";

/** A value that may differ by age band while keeping the activity's identity. */
export type AgeVariant<T> = T | { younger: T; older: T };

/* ------------------------------------------------------------------ */
/* Curriculum metadata                                                 */
/* ------------------------------------------------------------------ */

export type Domain =
  | "communication"
  | "early-literacy"
  | "stories"
  | "phonological-awareness"
  | "early-mathematics"
  | "numbers"
  | "quantity"
  | "colours"
  | "shapes"
  | "classification"
  | "patterns"
  | "sequencing"
  | "memory"
  | "reasoning"
  | "problem-solving"
  | "observation"
  | "sensory"
  | "gross-motor"
  | "fine-motor"
  | "social-emotional"
  | "independence"
  | "creativity"
  | "environment"
  | "movement";

export type ActivityEnvironment = "digital" | "indoor" | "outdoor";
export type ParentParticipation = "none" | "nearby" | "optional" | "required";
export type ActivityKind =
  | "digital"
  | "story"
  | "creative"
  | "making"
  | "movement"
  | "real-world"
  | "parent-child"
  | "hybrid";
/** Which of the four flow shapes (A–D) this activity follows. Informational + analytics. */
export type FlowShape = "A" | "B" | "C" | "D";

export type CelebrationType =
  | "thumbsUp"
  | "clap"
  | "highFive"
  | "wingsUp"
  | "waddle"
  | "bellyPuff";

/* ------------------------------------------------------------------ */
/* Art keys — resolved by the illustration registry                    */
/* ------------------------------------------------------------------ */

/** Key into the object-illustration registry (components/art/objects). */
export type ArtKey = string;

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

interface StepBase {
  id: string;
  /** Only include this step for these bands. Omitted = everyone. */
  bands?: AgeBand[];
}

export interface CastMember {
  id: CharacterId;
  /** Horizontal position, % of stage width (centre of character). */
  x: number;
  /** Size, % of stage height. */
  size?: number;
  flip?: boolean;
  expression?: Expression;
  action?: CharacterAction;
  /** Draw a shadow for this character: on the floor or projected on the wall. */
  shadow?: "floor" | "wall";
  /** Hidden until a beat shows it. */
  hidden?: boolean;
}

export interface PropPlacement {
  id: string;
  art: ArtKey;
  x: number;
  y: number;
  size: number;
  rotate?: number;
  hidden?: boolean;
  silhouette?: boolean;
  /** Spread out slowly when it appears (e.g. a puddle forming), instead of popping in. */
  grow?: boolean;
  /** Drawn in front of the characters (e.g. crumbs on someone's face, something in their hands). */
  front?: boolean;
}

export interface StoryBeat {
  speaker: CharacterId | "narrator";
  text: AgeVariant<string>;
  /** Per-actor state changes that take effect on this beat. */
  actors?: Partial<
    Record<
      CharacterId,
      {
        expression?: Expression;
        action?: CharacterAction;
        x?: number;
        flip?: boolean;
        hidden?: boolean;
      }
    >
  >;
  show?: string[];
  hide?: string[];
  sfx?: SoundId;
  /** Comedic pause (ms) before the "next" control appears. */
  pause?: number;
}

export interface StoryStep extends StepBase {
  type: "story";
  backdrop: BackdropKey;
  cast: CastMember[];
  props?: PropPlacement[];
  beats: StoryBeat[];
}

/** Bespoke interactive component, lazy-loaded from the interactive registry. */
export interface InteractiveStep extends StepBase {
  type: "interactive";
  component: InteractiveKey;
  props?: Record<string, unknown>;
}

export interface CountStep extends StepBase {
  type: "count";
  prompt: AgeVariant<string>;
  art: ArtKey;
  count: AgeVariant<number>;
  speaker?: CharacterId;
  backdrop?: BackdropKey;
}

export interface PatternStep extends StepBase {
  type: "pattern";
  prompt: AgeVariant<string>;
  /** The visible sequence; the next item is what the child picks. */
  sequence: AgeVariant<ArtKey[]>;
  answer: AgeVariant<ArtKey>;
  options: AgeVariant<ArtKey[]>;
  speaker?: CharacterId;
}

/** Pick from options where SEVERAL can be right. Supports flexible reasoning. */
export interface ChoiceStep extends StepBase {
  type: "choice";
  prompt: AgeVariant<string>;
  speaker?: CharacterId;
  /** Optional thing shown above the options (e.g. a silhouette). */
  focus?: { art: ArtKey; silhouette?: boolean; label?: string };
  options: { art: ArtKey; label: string; fits: boolean; reaction?: string; scale?: number }[];
  /** How many fitting answers to find before moving on. Default 1. */
  findCount?: AgeVariant<number>;
  /** Spoken sound for literacy prompts, e.g. "mmm". */
  sayAloud?: string;
  /** A sound to listen to (played at the start, with a "hear it again" button). */
  sound?: SoundId;
  /** Pictures only, no word labels (when the words would give the answer away). */
  noLabels?: boolean;
  /**
   * Detective clues: tap EVERY option to hear its clue; done once all are tapped.
   * `fits: false` = ruled out (a cross), `fits: true` = still a suspect (a "?").
   */
  tapAll?: boolean;
}

/** One option in a ChoiceStep. `scale` draws the picture smaller (e.g. "the little one"). */
export type ChoiceOption = ChoiceStep["options"][number];

export interface MatchStep extends StepBase {
  type: "match";
  prompt: AgeVariant<string>;
  speaker?: CharacterId;
  /** Pairs to match; each art key appears twice. */
  pairs: AgeVariant<ArtKey[]>;
}

export interface DrawStep extends StepBase {
  type: "draw";
  prompt: AgeVariant<string>;
  speaker?: CharacterId;
  mode: "free" | "trace";
  /** Trace guide key (registered in DrawCanvas). */
  guide?: AgeVariant<string>;
  /** Keep the drawing so it can appear in Milo's World. */
  keepFor?: "living-room-wall";
}

/**
 * Drawing with a purpose: each dotted stroke the child follows becomes part of
 * a little scene (rain falls, a fence goes up, a road appears). Coordinates are
 * in a 1000×600 box. Optional free strokes at the end ("now make lots of rain!").
 */
export interface GuidedDrawStep extends StepBase {
  type: "guided-draw";
  scene: GuidedScene;
  prompt: AgeVariant<string>;
  speaker?: CharacterId;
  /** Followed one at a time, in order. `line` is said when that stroke is done. */
  strokes: { guide: string; line?: string }[];
  /** After the guides: draw freely, this many strokes. */
  free?: { count: AgeVariant<number>; prompt: string };
  /** Said when the scene is finished. */
  line: string;
}

export type GuidedScene = "rain" | "fence" | "road" | "road-bendy" | "lamp";

/**
 * Drag things to a character, a set number at a time: "Can I have ONE seed?"
 * Quantity before numerals.
 */
export interface GiveStep extends StepBase {
  type: "give";
  speaker?: CharacterId;
  /** What gets dragged (e.g. "seed"). */
  art: ArtKey;
  backdrop?: BackdropKey;
  rounds: { count: number; prompt: string; line: string }[];
}

/* ---------- Milo Mysteries ---------- */

/** Where the experiment happens: a bowl of water, a puddle on the floor, a floor to push things along, a magnet. */
export type TryBench = "bowl" | "puddle" | "push" | "magnet";
export type TryResult = "float" | "sink" | "soak" | "stay" | "soggy" | "roll" | "wobble" | "slide" | "stick" | "none";
export interface TryObject {
  art: ArtKey;
  label: string;
  /** What happens, every time: a scripted result, not physics. */
  result: TryResult;
  /** Milo's reaction for this object (otherwise the bench's line for its result). */
  line?: string;
}

/**
 * "Try it": the child drags (or pushes) an object into the experiment and
 * watches what happens. Age 3 tries freely; age 4+ predicts first (no wrong
 * answers). Optional endings: the results grouped, a sort, one new object to
 * predict (transfer), a race, a silly outro.
 */
export interface TryItStep extends StepBase {
  type: "try-it";
  bench: TryBench;
  speaker?: CharacterId;
  backdrop?: BackdropKey;
  prompt: string;
  objects: TryObject[];
  /** Milo's reaction to each kind of result. */
  results: { result: TryResult; line: string }[];
  /** Predict before each try (objects then come one at a time, in order). */
  predict?: { prompt: string; go: string; right: string; wrong: string };
  /** How many tries before moving on (free play continues meanwhile). */
  tries: number;
  /** Two objects pushed side by side (push bench). */
  race?: { a: number; b: number; prompt: string; line: string };
  /** Show what happened, grouped. `sort`: the child drags the tried objects into the groups. */
  ending?: { sort: boolean; prompt: string; line: string };
  /** One object not tried before: predict, then try. */
  final?: TryObject & { prompt: string };
  /** Push bench: Milo tries to roll himself. */
  outro?: { prompt: string; line: string };
}

/** Ice: watch it melt (age 3), or compare what keeps it cold (age 5). */
export interface MeltStep extends StepBase {
  type: "melt";
  speaker?: CharacterId;
  backdrop?: BackdropKey;
  prompt: string;
  /** watch: said as the ice gets smaller (big → smaller → tiny → water). */
  stages?: { line: string }[];
  /** compare: what's around each cube, and how much ice is left after time passes (0–1). */
  wraps?: { id: string; art: ArtKey; label: string; left: number }[];
  compare?: {
    run: string;
    most: { prompt: string; right: string; wrong: string };
    what: { prompt: string; right: string; wrong: string };
    change: string;
    again: string;
  };
  /** Said at the very end. */
  line: string;
}

export interface InstructionCard {
  art: ArtKey;
  text: AgeVariant<string>;
  /** Optional result illustration (e.g. what the shadow should look like). */
  result?: ArtKey;
  /** An animated how-to instead of the still picture (components/activities/steps/BoatFolds). */
  anim?: string;
}

export interface InstructionsStep extends StepBase {
  type: "instructions";
  medium: "origami" | "craft" | "hand-shadow" | "build" | "recipe";
  title: string;
  intro?: AgeVariant<string>;
  cards: InstructionCard[];
  materials?: string[];
  parentTip?: string;
}

export interface MovementStep extends StepBase {
  type: "movement";
  leader: CharacterId;
  intro: AgeVariant<string>;
  moves: { text: AgeVariant<string>; action?: CharacterAction; art?: ArtKey }[];
}

export interface ParentChildStep extends StepBase {
  type: "parent-child";
  title: string;
  /** What the grown-up does. Tiny and actionable. */
  yourJob: string[];
  /** Things to say. */
  tryAsking?: string[];
  /** Big prompts for the child (read aloud). */
  childPrompts: AgeVariant<string>[];
  materials?: string[];
  where?: "indoor" | "outdoor" | "either";
  returnText?: string;
}

/** Optional real-world / parent extension; skippable without penalty. */
export interface ExtensionOfferStep extends StepBase {
  type: "extension-offer";
  title: string;
  prompt: AgeVariant<string>;
  speaker?: CharacterId;
  badge: "parent-child" | "real-world";
  meta?: { minutes?: number; materials?: string[] };
  steps: ActivityStep[];
}

export interface ReflectionStep extends StepBase {
  type: "reflection";
  speaker: CharacterId;
  questions: AgeVariant<string>[];
  parentNote?: string;
}

export interface CelebrationStep extends StepBase {
  type: "celebration";
  celebration: CelebrationType;
  line?: string;
}

export type ActivityStep =
  | StoryStep
  | InteractiveStep
  | CountStep
  | PatternStep
  | ChoiceStep
  | MatchStep
  | DrawStep
  | GuidedDrawStep
  | GiveStep
  | TryItStep
  | MeltStep
  | InstructionsStep
  | MovementStep
  | ParentChildStep
  | ExtensionOfferStep
  | ReflectionStep
  | CelebrationStep;

export type StepType = ActivityStep["type"];

/* ------------------------------------------------------------------ */
/* Registries referenced by data                                       */
/* ------------------------------------------------------------------ */

export type BackdropKey =
  | "paper"
  | "living-room"
  /** The living room without its window (when the window would be busy behind the activity). */
  | "living-room-plain"
  /** The living room in the evening: dark outside the window. */
  | "living-room-dusk"
  | "kitchen"
  | "garden"
  | "washroom"
  | "shadow-wall"
  | "pavement"
  | "night";

export type InteractiveKey =
  | "shadow-follow"
  | "shadow-discovery"
  | "shape-detective"
  | "shape-sort";

/* ------------------------------------------------------------------ */
/* Activity definition                                                 */
/* ------------------------------------------------------------------ */

export interface ActivityDefinition {
  id: string;
  title: string;
  /** One-line hook for the activity card (child-friendly). */
  tagline: string;
  /** For grown-ups: what this is quietly building. Shown on the intro screen. */
  parentSummary: string;
  ageMin: number;
  ageMax: number;
  domains: Domain[];
  skills: string[];
  /** 1 = gentle … 3 = stretchy. Internal only. */
  difficulty: 1 | 2 | 3;
  /** Approx minutes. */
  duration: number;
  environments: ActivityEnvironment[];
  materials: string[];
  /** Short materials label for cards, e.g. "Paper needed". */
  materialsShort?: string;
  parentParticipation: ParentParticipation;
  character: CharacterId;
  activityType: ActivityKind;
  flow: FlowShape;
  /** Thumbnail art for the card. */
  thumbnail: ArtKey;
  steps: ActivityStep[];
  reflectionQuestions: string[];
  celebrationType: CelebrationType;
  soundscape: SoundscapeId;
  unlockRequirements: null | { minGrowth?: number; afterActivity?: string };
  /** Room this activity "belongs" to inside Milo's World, if any. */
  homeRoom?: string;
}

export type SoundscapeId = "quiet" | "living-room" | "kitchen" | "garden" | "washroom" | "none";

/** Card/catalog metadata (steps are loaded lazily per activity). */
export type ActivityMeta = Omit<ActivityDefinition, "steps">;
