import type { CharacterId, Expression } from "./character";
import type { SoundId } from "./audio";
import type { SoundscapeId } from "./activity";

/**
 * When something in Milo's world appears. All conditions must hold.
 * "growth" is the quiet world-growth score (see features/progression).
 */
export interface RevealRule {
  minGrowth?: number;
  minDays?: number;
  afterActivity?: string;
  /** Needs a stored drawing (e.g. the child's drawing taped to the wall). */
  needsDrawing?: boolean;
}

export interface RoomObjectDefinition {
  id: string;
  /** Key into the room-object illustration registry. */
  art: string;
  label: string;
  /** Position/size in % of the room scene. */
  x: number;
  y: number;
  w: number;
  /** Layer: back = behind characters, front = in front. */
  layer?: "back" | "mid" | "front";
  reveal?: RevealRule;
  /** What happens on tap. */
  interaction?: {
    sound?: SoundId;
    /** Milo's reaction line(s); one is picked. */
    milo?: string[];
    expression?: Expression;
    /** Little animation on the object itself. */
    wiggle?: "shake" | "bounce" | "spin" | "swing" | "glow";
    /** Opens an activity (contextual play). */
    activityId?: string;
  };
}

export interface RoomDefinition {
  id: string;
  name: string;
  /** Order of appearance in the house. */
  stage: number;
  reveal: RevealRule;
  /** A painted room background (components/world/scenes/rooms). Without one, a plain wall + floor box is drawn from the palette. */
  scene?: "kitchen" | "washroom" | "garden";
  /** Visual tokens for the scene shell. */
  palette: { wall: string; wallAccent: string; floor: string; floorAccent: string; motif?: "stripe" | "sprig" | "tile" | "dots"; /** Where the wall meets the floor, in the 900-high scene. Default 640. */ floorY?: number };
  /** Where this room sits in the cut-away house view (% of the house scene). */
  house: { x: number; y: number; w: number; h: number };
  soundscape: SoundscapeId;
  /** Where Milo stands, % of scene width. */
  miloX: number;
  /** How big Milo is here (1 = 20% of the scene width). Rooms with big furniture need a bigger Milo. */
  miloScale?: number;
  /** Milo's greeting lines; first visit uses the first one. */
  greetings: string[];
  /** The teaser line while the room is still taped shut. */
  teaser: string;
  /** Characters who might be hanging around. */
  visitors?: { id: CharacterId; x: number; reveal?: RevealRule }[];
  objects: RoomObjectDefinition[];
  /** Small icon art for the house map. */
  doorArt: string;
}

export interface WorldDefinition {
  id: string;
  name: string;
  rooms: RoomDefinition[];
}
