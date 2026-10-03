/** Every character in the Milomi universe. Add new ids here + register in data/characters. */
export type CharacterId = "milo" | "snail" | "squirrel" | "cat" | "dog";

export type Expression =
  | "neutral"
  | "curious"
  | "confused"
  | "happy"
  | "surprised"
  | "sleepy"
  | "thinking"
  | "suspicious"
  | "proud";

export type CharacterAction =
  | "idle"
  | "blink"
  | "headTilt"
  | "walk"
  | "waddle"
  | "clap"
  | "thumbsUp"
  | "highFive"
  | "wingsUp"
  | "bellyPuff"
  | "lookLeft"
  | "lookRight"
  | "stumble"
  | "talk"
  | "hop"
  | "run"
  | "sleep"
  | "peek"
  | "hold"
  | "investigate"
  | "reach"
  | "excited";

export interface CharacterProps {
  expression?: Expression;
  action?: CharacterAction;
  /** Mirror horizontally (face the other way). */
  flip?: boolean;
  /** Render as a flat shadow silhouette (used for shadow play). */
  silhouette?: boolean;
  /** Is the character currently speaking? Animates beak/mouth. */
  talking?: boolean;
  className?: string;
  /** Accessible label; decorative if omitted. */
  title?: string;
}

export interface CharacterDefinition {
  id: CharacterId;
  name: string;
  /** Short personality note — used by writers/tools, never shown to children. */
  personality: string;
  bestFor: string[];
  /** Voice settings for the speech placeholder (until recorded VO exists). */
  voice: { pitch: number; rate: number };
  /** Accent colour used in speech bubbles. */
  colorToken: string;
}
