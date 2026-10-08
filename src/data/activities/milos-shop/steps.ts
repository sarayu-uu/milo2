import type { ActivityStep } from "@/types/activity";

/** Count out four, Dog takes one (how many now?), add two more (how many now?). */
export const steps: ActivityStep[] = [
  {
    id: "open",
    type: "story",
    backdrop: "kitchen",
    cast: [
      { id: "milo", x: 26, size: 50, expression: "proud" },
      { id: "squirrel", x: 72, size: 44, flip: true, hidden: true },
    ],
    beats: [
      { speaker: "milo", text: "Milo's Shop is OPEN! Today we sell oranges.", actors: { milo: { action: "wingsUp" } } },
      { speaker: "squirrel", text: "Hello, shopkeeper! I'd like FOUR oranges, please.", sfx: "bell", actors: { squirrel: { hidden: false, action: "hop", expression: "happy" }, milo: { action: "idle" } } },
      { speaker: "milo", text: "Can you help me? Give Squirrel four oranges.", actors: { milo: { expression: "curious", action: "headTilt" } } },
    ],
  },
  {
    id: "four",
    type: "give",
    speaker: "squirrel",
    backdrop: "kitchen",
    art: "orange",
    rounds: [{ count: 4, prompt: "Four oranges, please! One at a time.", line: "One, two, three, four! Four oranges. Thank you!" }],
  },
  {
    id: "dog",
    type: "story",
    backdrop: "kitchen",
    cast: [
      { id: "milo", x: 22, size: 48, expression: "happy" },
      { id: "squirrel", x: 50, size: 42, expression: "happy" },
      { id: "dog", x: 82, size: 46, flip: true, hidden: true },
    ],
    props: [{ id: "taken", art: "orange", x: 70, y: 58, size: 8, hidden: true }],
    beats: [
      { speaker: "squirrel", text: "Four lovely oranges…", actors: { squirrel: { action: "idle" } } },
      { speaker: "dog", text: "Ooh! Is that for me? Thank you!", show: ["taken"], actors: { dog: { hidden: false, action: "run", expression: "happy" } } },
      { speaker: "squirrel", text: "HEY! Dog took ONE of my oranges!", actors: { squirrel: { expression: "surprised", action: "hop" }, dog: { action: "idle" } } },
      { speaker: "milo", text: "She had four. Dog took one. How many are left? Let's count.", actors: { milo: { expression: "thinking", action: "headTilt" } } },
    ],
  },
  {
    id: "left",
    type: "count",
    speaker: "squirrel",
    backdrop: "kitchen",
    prompt: "Count my oranges. Tap each one!",
    art: "orange",
    count: 3,
  },
  {
    id: "more",
    type: "story",
    backdrop: "kitchen",
    cast: [
      { id: "milo", x: 26, size: 50, expression: "happy" },
      { id: "squirrel", x: 72, size: 44, flip: true, expression: "neutral" },
    ],
    beats: [
      { speaker: "squirrel", text: "Three. Four take away one is three.", actors: { squirrel: { expression: "thinking" } } },
      { speaker: "milo", text: "Don't worry. Let's give you two MORE, for free!", actors: { milo: { expression: "proud", action: "wingsUp" } } },
    ],
  },
  {
    id: "two",
    type: "give",
    speaker: "squirrel",
    backdrop: "kitchen",
    art: "orange",
    rounds: [{ count: 2, prompt: "Two more oranges, please!", line: "One, two! Two more!" }],
  },
  {
    id: "total",
    type: "count",
    speaker: "squirrel",
    backdrop: "kitchen",
    prompt: "Three, and two more. How many now? Tap each one!",
    art: "orange",
    count: 5,
  },
  {
    id: "ending",
    type: "story",
    backdrop: "kitchen",
    cast: [
      { id: "milo", x: 24, size: 48, expression: "happy" },
      { id: "squirrel", x: 52, size: 42, expression: "happy" },
      { id: "dog", x: 82, size: 46, flip: true, expression: "happy" },
    ],
    beats: [
      { speaker: "squirrel", text: "FIVE oranges! That's more than I wanted.", actors: { squirrel: { action: "hop" } } },
      { speaker: "dog", text: "So… can I have one?", actors: { dog: { action: "headTilt" } } },
      { speaker: "squirrel", text: "…Fine. Five take away one. Here you go.", pause: 900, actors: { squirrel: { expression: "neutral", action: "idle" } } },
    ],
  },
  {
    id: "shop-offer",
    type: "extension-offer",
    title: "Play Shop at Home",
    prompt: "Want to play shop with real things?",
    speaker: "milo",
    badge: "parent-child",
    meta: { minutes: 5, materials: ["5 small things: blocks, spoons, fruit"] },
    steps: [
      {
        id: "shop-play",
        type: "parent-child",
        title: "Play Shop",
        where: "indoor",
        yourJob: ["Set out 5 small things as the shop.", "Ask for a number of them: \"Three spoons, please!\"", "Then take one or add one, and ask how many now."],
        tryAsking: ["How many do I have now?", "What if I give one back?", "Can you make five?"],
        childPrompts: ["You're the shopkeeper! Give me three, please.", "I'll take one away. How many now?"],
        materials: ["5 small things to count"],
        returnText: "Tell Milo what you sold!",
      },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "clap" },
];
