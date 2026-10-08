import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "living-room-dusk",
    cast: [{ id: "milo", x: 34, size: 54, expression: "thinking" }],
    // what a lamp is: Milo shows one
    props: [{ id: "lamp", art: "lamp", x: 50, y: 48, size: 12, hidden: true }],
    beats: [
      { speaker: "milo", text: "It's getting a bit dark in here.", actors: { milo: { action: "lookLeft" } } },
      { speaker: "milo", text: "I need a lamp. A lamp makes light, like this one.", show: ["lamp"], actors: { milo: { action: "lookRight", expression: "curious" } } },
      { speaker: "milo", text: "Could you draw me one? Follow the dots with me!", actors: { milo: { action: "idle", expression: "happy" } } },
    ],
  },
  {
    id: "trace",
    type: "guided-draw",
    scene: "lamp",
    prompt: "First, the bottom. A sleeping line, across!",
    strokes: [
      { guide: "M400 520 L600 520", line: "Now a standing line, going up from the middle." },
      { guide: "M500 515 L500 270", line: "Now the top: the lampshade. Follow the dots all the way round!" },
      { guide: "M430 140 L570 140 L640 265 L360 265 Z", line: "It looks like a lamp! Now make it shine." },
    ],
    free: { count: 3, prompt: "Draw lines of light, shining out from the lamp!" },
    line: "It's ON! I can see everything now. Thank you!",
  },
  {
    id: "draw",
    type: "draw",
    mode: "free",
    speaker: "milo",
    prompt: "Now draw your OWN lamp for my wall. Any colour, any shape!",
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
