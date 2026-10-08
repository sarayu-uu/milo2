import type { ActivityStep } from "@/types/activity";

/** Age 3: just try. No predicting yet. */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "kitchen",
    cast: [{ id: "milo", x: 26, size: 62, expression: "curious" }],
    props: [
      { id: "bowl", art: "water-bowl-plain", x: 64, y: 50, size: 22 },
      { id: "leaf-held", art: "leaf", x: 42, y: 30, size: 8 },
      { id: "leaf-floating", art: "leaf", x: 64, y: 60, size: 7, hidden: true },
    ],
    beats: [
      { speaker: "milo", text: "Hmm… what happens if I put this in here?", actors: { milo: { expression: "curious", action: "headTilt" } } },
      { speaker: "milo", text: "…", sfx: "sfx-splash", pause: 1400, hide: ["leaf-held"], show: ["leaf-floating"], actors: { milo: { expression: "surprised", action: "lookRight" } } },
      { speaker: "milo", text: "It's staying on top!", actors: { milo: { expression: "happy", action: "wingsUp" } } },
      { speaker: "milo", text: "What about these?", actors: { milo: { expression: "curious", action: "idle" } } },
    ],
  },
  {
    id: "try",
    type: "try-it",
    bench: "bowl",
    backdrop: "kitchen",
    prompt: "Drag one into the water!",
    objects: [
      { art: "leaf", label: "Leaf", result: "float" },
      { art: "pebble", label: "Stone", result: "sink" },
      { art: "cap", label: "Bottle cap", result: "float" },
      { art: "spoon", label: "Spoon", result: "sink" },
      { art: "twig", label: "Twig", result: "float" },
      { art: "ball", label: "Rubber ball", result: "float" },
    ],
    results: [
      { result: "float", line: "Still there!" },
      { result: "sink", line: "Where'd it go?" },
    ],
    tries: 3,
    ending: { sort: false, prompt: "Let's see what everything did.", line: "Some stayed up… and some went down!" },
  },
  {
    id: "try-at-home",
    type: "extension-offer",
    title: "Float or Plop at home",
    prompt: "Want to try it with real water?",
    speaker: "milo",
    badge: "parent-child",
    meta: { minutes: 5, materials: ["a bowl of water", "3 safe things (a leaf, a spoon, a toy)"] },
    steps: [
      {
        id: "at-home",
        type: "parent-child",
        title: "Float or Plop at home",
        where: "indoor",
        yourJob: ["Stay close: water and little ones.", "Let them drop things in one at a time.", "No need to explain. Just watch together."],
        tryAsking: ["What happened to it?", "Is it still on top?", "Where did it go?"],
        childPrompts: [
          "Put one thing in the water. What happens?",
          "Try another one!",
          "Which ones stayed up? Which went down?",
        ],
        materials: ["a bowl of water", "3 safe things (a leaf, a spoon, a toy)"],
        returnText: "Come back and tell Milo what happened!",
      },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "clap" },
];
