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
    props: [
      // Milo's careful row…
      { id: "row-1", art: "cup", x: 47, y: 77, size: 6 },
      { id: "row-2", art: "cup", x: 52, y: 77, size: 6 },
      { id: "row-3", art: "cup", x: 57, y: 77, size: 6 },
      // …and where they end up after Dog "helps"
      { id: "mess-1", art: "cup", x: 7, y: 80, size: 7, rotate: -18, hidden: true },
      { id: "mess-2", art: "cup", x: 48, y: 84, size: 7, rotate: 84, hidden: true },
      { id: "mess-3", art: "cup", x: 53, y: 72, size: 7, rotate: 8, hidden: true },
      { id: "mess-4", art: "cup", x: 89, y: 82, size: 7, rotate: 24, hidden: true },
      { id: "mess-5", art: "cup", x: 95, y: 70, size: 7, rotate: -76, hidden: true },
      { id: "mess-6", art: "cup", x: 12, y: 66, size: 7, rotate: 160, hidden: true },
    ],
    beats: [
      { speaker: "milo", text: "I'm putting out cups for our friends. Carefully.", actors: { milo: { action: "idle" } } },
      { speaker: "dog", text: "I'LL HELP!", sfx: "woof", actors: { dog: { hidden: false, x: 70, action: "run", expression: "happy" }, milo: { expression: "surprised" } } },
      {
        speaker: "milo",
        text: "Wait—",
        sfx: "cup-clink",
        hide: ["row-1", "row-2", "row-3"],
        show: ["mess-1", "mess-2", "mess-3", "mess-4", "mess-5", "mess-6"],
        actors: { milo: { action: "stumble", expression: "surprised" }, dog: { action: "idle" } },
      },
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
