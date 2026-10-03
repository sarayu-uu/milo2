import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "kitchen",
    cast: [
      { id: "milo", x: 30, size: 50, expression: "happy" },
      { id: "dog", x: 110, size: 44, flip: true, hidden: true },
    ],
    beats: [
      { speaker: "milo", text: "I'm putting out cups for our friends. Carefully.", actors: { milo: { action: "idle" } } },
      { speaker: "dog", text: "I'LL HELP!", sfx: "woof", actors: { dog: { hidden: false, x: 70, action: "run", expression: "happy" }, milo: { expression: "surprised" } } },
      { speaker: "milo", text: "Wait—", sfx: "cup-clink", actors: { milo: { action: "stumble", expression: "surprised" }, dog: { action: "idle" } } },
      { speaker: "milo", text: "Now the cups are everywhere. How many are there?", actors: { milo: { action: "headTilt", expression: "confused" } } },
    ],
  },
  {
    id: "count",
    type: "count",
    speaker: "milo",
    backdrop: "kitchen",
    prompt: { younger: "Tap each cup and count with me!", older: "Count the cups. Tap each one just once!" },
    art: "cup",
    count: { younger: 3, older: 6 },
  },
  {
    id: "reflect",
    type: "reflection",
    speaker: "dog",
    questions: [{ younger: "How many cups at your table today?", older: "If one more friend comes, how many cups then?" }],
    parentNote: "At the next meal, let your child count the cups or plates out loud.",
  },
  { id: "celebrate", type: "celebration", celebration: "thumbsUp" },
];
