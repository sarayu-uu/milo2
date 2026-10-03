import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  // PART 1 — STORY
  {
    id: "arrive",
    type: "story",
    backdrop: "living-room",
    cast: [
      { id: "milo", x: 30, size: 50, expression: "neutral" },
      { id: "squirrel", x: 72, size: 46, hidden: true, flip: true },
    ],
    props: [{ id: "bag", art: "bulging-bag", x: 80, y: 52, size: 24, hidden: true }],
    beats: [
      { speaker: "milo", text: "Do you hear that?", actors: { milo: { expression: "curious", action: "lookRight" } } },
      {
        speaker: "squirrel",
        text: "Coming through! Very busy!",
        sfx: "boing",
        show: ["bag"],
        actors: { squirrel: { hidden: false, action: "hop", expression: "happy" }, milo: { expression: "surprised", action: "idle" } },
      },
      { speaker: "milo", text: "What did you PUT in there?", actors: { milo: { expression: "suspicious", action: "headTilt" }, squirrel: { action: "idle" } } },
      { speaker: "squirrel", text: "I forgot.", actors: { squirrel: { expression: "neutral", action: "idle" } } },
      { speaker: "milo", text: "How do you forget what's inside your own bag?", actors: { milo: { expression: "confused", action: "idle" } } },
      { speaker: "squirrel", text: "Easily.", actors: { squirrel: { action: "headTilt", expression: "happy" } } },
      { speaker: "milo", text: "Let's look at the shapes. Maybe we can guess!", actors: { milo: { expression: "curious", action: "idle" } } },
    ],
  },

  // PART 2 — SHAPE DETECTIVE (silhouettes, multiple valid answers)
  {
    id: "detective",
    type: "interactive",
    component: "shape-detective",
    props: {
      rounds: {
        younger: [
          { shape: "shape-round", options: ["ball", "orange", "book"] },
          { shape: "shape-rect", options: ["book", "box", "ball"] },
        ],
        older: [
          { shape: "shape-round", options: ["ball", "orange", "plate", "spoon"] },
          { shape: "shape-long", options: ["spoon", "pencil", "plate", "banana"] },
          { shape: "shape-curved", options: ["banana", "ball", "spoon", "moon"] },
        ],
      },
    },
  },

  // PART 3 — SHAPE → REAL OBJECTS (sorting)
  {
    id: "sort",
    type: "interactive",
    component: "shape-sort",
    props: {
      bins: {
        younger: ["shape-circle-outline", "shape-rect-outline"],
        older: ["shape-circle-outline", "shape-rect-outline", "shape-cylinder-outline"],
      },
      items: {
        younger: ["clock", "book", "plate", "door"],
        older: ["clock", "phone", "bottle", "coin", "box", "cup", "wheel", "door", "jar"],
      },
    },
  },

  // PART 4 — BAG REVEAL
  {
    id: "reveal",
    type: "story",
    backdrop: "living-room",
    cast: [
      { id: "milo", x: 26, size: 50, expression: "curious" },
      { id: "squirrel", x: 74, size: 46, flip: true, expression: "happy" },
    ],
    props: [
      { id: "bag", art: "open-bag", x: 52, y: 64, size: 20 },
      { id: "ball", art: "ball", x: 40, y: 40, size: 13, hidden: true, rotate: -8 },
      { id: "spoon", art: "spoon", x: 53, y: 34, size: 13, hidden: true },
      { id: "book", art: "book", x: 66, y: 40, size: 13, hidden: true, rotate: 8 },
    ],
    beats: [
      { speaker: "squirrel", text: "Okay! Let's see!", actors: { squirrel: { action: "hop" } }, sfx: "paper-rustle" },
      { speaker: "squirrel", text: "A ball…", show: ["ball"], sfx: "pop", actors: { squirrel: { action: "idle" } } },
      { speaker: "squirrel", text: "a spoon…", show: ["spoon"], sfx: "pop" },
      { speaker: "squirrel", text: "and a book!", show: ["book"], sfx: "pop" },
      { speaker: "milo", text: "Ohhhh.", pause: 900, actors: { milo: { expression: "surprised" } } },
      { speaker: "milo", text: "That round shape could've been LOTS of things.", actors: { milo: { expression: "thinking", action: "headTilt" } } },
    ],
  },

  // PART 5 — OPTIONAL REAL-WORLD EXTENSION
  {
    id: "bag-offer",
    type: "extension-offer",
    title: "Make your own Mystery Bag",
    prompt: "Want to make a REAL mystery bag?",
    speaker: "squirrel",
    badge: "parent-child",
    meta: { minutes: 5, materials: ["a cloth bag or pillowcase", "3 safe things from home"] },
    steps: [
      {
        id: "bag-play",
        type: "parent-child",
        title: "Mystery Bag",
        where: "indoor",
        yourJob: [
          "Secretly put 3 safe household things in a cloth bag or pillowcase.",
          "Your child reaches in WITHOUT looking.",
          "Ask one question at a time.",
        ],
        tryAsking: ["Hard or soft?", "Round or pointy?", "Smooth or bumpy?", "Can it bend?", "What do you think it is?"],
        childPrompts: [
          "No peeking! Put your hand in the bag.",
          { younger: "Is it soft or hard?", older: "Is it round or pointy? Smooth or bumpy?" },
          { younger: "What do you think it is?", older: "What could it be? Could it be something else too?" },
        ],
        materials: ["a cloth bag or pillowcase", "3 safe objects (spoon, sock, ball…)"],
        returnText: "Tell Squirrel what was in your bag!",
      },
    ],
  },

  // ENDING
  {
    id: "ending",
    type: "story",
    backdrop: "living-room",
    cast: [
      { id: "milo", x: 28, size: 50, expression: "neutral" },
      { id: "squirrel", x: 72, size: 46, flip: true, expression: "proud" },
    ],
    beats: [
      { speaker: "squirrel", text: "I knew what was in there ALL along.", actors: { squirrel: { expression: "proud", action: "idle" } } },
      { speaker: "squirrel", text: "I remembered everything.", actors: { squirrel: { action: "headTilt" } } },
      { speaker: "milo", text: "…", pause: 1300, actors: { milo: { expression: "neutral", action: "idle" } } },
      { speaker: "milo", text: "She absolutely did not.", actors: { milo: { expression: "suspicious", action: "idle" } } },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "clap" },
];
