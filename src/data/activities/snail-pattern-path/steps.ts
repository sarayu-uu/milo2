import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "garden",
    cast: [
      { id: "snail", x: 66, size: 34, flip: true, expression: "thinking" },
      { id: "milo", x: 28, size: 48 },
    ],
    beats: [
      { speaker: "snail", text: "I made a path. Leaf, flower, leaf, flower…" },
      { speaker: "snail", text: "Oh no. Oh no no no. I forgot what comes next!", actors: { snail: { expression: "surprised" } } },
      { speaker: "milo", text: "It's okay, Snail. Take a big breath.", actors: { milo: { expression: "happy", action: "headTilt" } } },
      { speaker: "snail", text: "What if I pick the wrong one? What if the path goes NOWHERE?", pause: 900, actors: { snail: { expression: "confused" } } },
      { speaker: "milo", text: "We'll help! Let's finish the path together.", actors: { milo: { expression: "happy", action: "idle" } } },
    ],
  },
  {
    id: "pattern-1",
    type: "pattern",
    speaker: "snail",
    prompt: { younger: "What comes next? I'm too nervous to look.", older: "Look carefully… what comes next? I can't look." },
    sequence: { younger: ["leaf", "flower", "leaf", "flower", "leaf"], older: ["leaf", "flower", "acorn", "leaf", "flower"] },
    answer: { younger: "flower", older: "acorn" },
    options: { younger: ["flower", "acorn"], older: ["leaf", "flower", "acorn"] },
  },
  {
    id: "pattern-2",
    type: "pattern",
    speaker: "snail",
    prompt: "And this one? Take your time. I'll just… worry quietly.",
    sequence: { younger: ["acorn", "pebble", "acorn", "pebble"], older: ["flower", "leaf", "leaf", "flower", "leaf"] },
    answer: { younger: "acorn", older: "leaf" },
    options: { younger: ["pebble", "acorn", "leaf"], older: ["flower", "leaf", "pebble"] },
  },
  { id: "celebrate", type: "celebration", celebration: "clap" },
];
