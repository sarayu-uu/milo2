import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "pavement",
    cast: [
      { id: "dog", x: 68, size: 44, flip: true, expression: "happy" },
      { id: "milo", x: 28, size: 46 },
    ],
    beats: [
      { speaker: "dog", text: "Let's play! I say a move. You do it!", actors: { dog: { action: "hop" } } },
      { speaker: "dog", text: "And when I say FREEZE… you stop like a statue!", actors: { dog: { action: "idle", expression: "surprised" } } },
      { speaker: "milo", text: "I'm not very fast. But I'm VERY good at stopping.", actors: { milo: { expression: "proud" } } },
    ],
  },
  {
    id: "moves",
    type: "movement",
    leader: "dog",
    intro: "Stand up! Make some space.",
    moves: [
      { text: "Run on the spot!", action: "run", art: "footprints" },
      { text: "FREEZE!", art: "snowflake" },
      { text: "Hop like Squirrel!", action: "hop", art: "char:squirrel:happy" },
      { text: "FREEZE!", art: "snowflake" },
      { text: "Tiptoe quietly, like Old Cat.", action: "walk", art: "tiptoe" },
      { text: { younger: "Waddle like Milo!", older: "Waddle like Milo… backwards!" }, action: "waddle", art: "char:milo:happy" },
      { text: "FREEZE!", art: "snowflake" },
      { text: { younger: "Flap your arms like wings!", older: "Stand on one foot like a pigeon on a wire!" }, action: "wingsUp", art: "feather" },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "bellyPuff" },
];
