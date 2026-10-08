import type { ActivityStep } from "@/types/activity";

/** Age 3: put things on the puddle and see which one drinks the water. */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "kitchen",
    cast: [{ id: "milo", x: 10, size: 52, expression: "happy", hidden: true }],
    props: [
      { id: "cup", art: "cup", x: 48, y: 44, size: 7, hidden: true },
      { id: "puddle", art: "puddle", x: 60, y: 60, size: 26, hidden: true, grow: true },
    ],
    beats: [
      { speaker: "milo", text: "…", pause: 1100, show: ["cup"], actors: { milo: { hidden: false, x: 36, action: "run", expression: "happy" } } },
      { speaker: "milo", text: "…", sfx: "sfx-splash", pause: 1800, hide: ["cup"], show: ["puddle"], actors: { milo: { expression: "surprised", action: "stumble" } } },
      { speaker: "milo", text: "…Oops.", actors: { milo: { expression: "confused", action: "lookRight" } } },
      { speaker: "milo", text: "Can one of these help?", actors: { milo: { expression: "curious", action: "headTilt" } } },
    ],
  },
  {
    id: "try",
    type: "try-it",
    bench: "puddle",
    backdrop: "kitchen",
    prompt: "Drag one onto the puddle!",
    objects: [
      { art: "plastic-block", label: "Plastic block", result: "stay", line: "…Still here." },
      { art: "paper-sheet", label: "Paper", result: "soggy", line: "Oh. It went all floppy." },
      { art: "cloth", label: "Cloth", result: "soak", line: "The water went IN!" },
    ],
    results: [
      { result: "soak", line: "The water went IN!" },
      { result: "stay", line: "…Still here." },
      { result: "soggy", line: "Oh. It went all floppy." },
    ],
    tries: 3,
    ending: { sort: false, prompt: "Let's see what each one did.", line: "The cloth drank the water! The paper drank a little." },
  },
  {
    id: "try-at-home",
    type: "extension-offer",
    title: "Puddle Mystery at home",
    prompt: "Want to make a tiny puddle?",
    speaker: "milo",
    badge: "parent-child",
    meta: { minutes: 5, materials: ["a few drops of water", "a cloth", "a plastic spoon", "a tissue"] },
    steps: [
      {
        id: "at-home",
        type: "parent-child",
        title: "Puddle Mystery at home",
        where: "indoor",
        yourJob: ["Put a few drops of water on a tray or table.", "Let your child try each thing on the water.", "Use the word 'absorbs' if they're curious."],
        tryAsking: ["Which one picked up the water?", "Is the cloth wet now? Feel it!", "Where did the water go?"],
        childPrompts: [
          "Put the cloth on the water. What happens?",
          "Now try the spoon!",
          "Which one drank the water?",
        ],
        materials: ["a few drops of water", "a cloth", "a plastic spoon", "a tissue"],
        returnText: "Come back and tell Milo what happened!",
      },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "thumbsUp" },
];
