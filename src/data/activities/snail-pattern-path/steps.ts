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
      { speaker: "snail", text: "Then I forgot what comes next.", actors: { snail: { expression: "confused" } } },
      { speaker: "milo", text: "You forget a lot of things.", actors: { milo: { expression: "suspicious", action: "headTilt" } } },
      { speaker: "snail", text: "…Where was I going?", pause: 900, actors: { snail: { expression: "sleepy" } } },
      { speaker: "milo", text: "Let's help Snail finish the path!", actors: { milo: { expression: "happy", action: "idle" } } },
    ],
  },
  {
    id: "pattern-1",
    type: "pattern",
    speaker: "snail",
    prompt: { younger: "What comes next?", older: "Look carefully. What comes next?" },
    sequence: { younger: ["leaf", "flower", "leaf", "flower", "leaf"], older: ["leaf", "flower", "acorn", "leaf", "flower"] },
    answer: { younger: "flower", older: "acorn" },
    options: { younger: ["flower", "acorn"], older: ["leaf", "flower", "acorn"] },
  },
  {
    id: "pattern-2",
    type: "pattern",
    speaker: "snail",
    prompt: "And this one?",
    sequence: { younger: ["acorn", "pebble", "acorn", "pebble"], older: ["flower", "leaf", "leaf", "flower", "leaf"] },
    answer: { younger: "acorn", older: "leaf" },
    options: { younger: ["pebble", "acorn", "leaf"], older: ["flower", "leaf", "pebble"] },
  },
  { id: "celebrate", type: "celebration", celebration: "clap" },
];
