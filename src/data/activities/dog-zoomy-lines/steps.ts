import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "pavement",
    cast: [
      { id: "dog", x: 66, size: 44, flip: true, expression: "happy" },
      { id: "milo", x: 26, size: 46 },
    ],
    beats: [
      { speaker: "dog", text: "I ran SO fast! Look at my path!", actors: { dog: { action: "run" } } },
      { speaker: "milo", text: "That's… very wiggly.", actors: { milo: { expression: "confused", action: "headTilt" }, dog: { action: "idle" } } },
      { speaker: "milo", text: "Can you follow Dog's path with your finger?", actors: { milo: { expression: "curious", action: "idle" } } },
    ],
  },
  {
    id: "trace-1",
    type: "draw",
    mode: "trace",
    guide: "zigzag",
    speaker: "dog",
    prompt: "Follow the zig-zag!",
  },
  {
    id: "trace-2",
    type: "draw",
    mode: "trace",
    guide: { younger: "wave", older: "loops" },
    speaker: "dog",
    prompt: { younger: "Now a wavy one!", older: "Now loop-de-loops!" },
  },
  { id: "celebrate", type: "celebration", celebration: "thumbsUp" },
];
