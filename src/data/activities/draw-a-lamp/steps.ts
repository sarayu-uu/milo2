import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "living-room",
    cast: [{ id: "milo", x: 40, size: 54, expression: "thinking" }],
    beats: [
      { speaker: "milo", text: "It's getting a bit dark in here.", actors: { milo: { action: "lookLeft" } } },
      { speaker: "milo", text: "I need a lamp. Could you draw me one?", actors: { milo: { action: "idle", expression: "curious" } } },
      { speaker: "milo", text: "Any lamp. A silly one is fine. I like silly.", actors: { milo: { expression: "happy" } } },
    ],
  },
  {
    id: "draw",
    type: "draw",
    mode: "free",
    speaker: "milo",
    prompt: "Draw Milo a lamp!",
    keepFor: "living-room-wall",
  },
  {
    id: "show",
    type: "reflection",
    speaker: "milo",
    questions: [{ younger: "Ooh! What colour is the light?", older: "Tell me about your lamp. Where should I put it?" }],
    parentNote: "Ask your child to tell you about the drawing. Describe, don't judge — there's no right way to draw a lamp.",
  },
  { id: "celebrate", type: "celebration", celebration: "wingsUp", line: "I'm taping it on my wall!" },
];
