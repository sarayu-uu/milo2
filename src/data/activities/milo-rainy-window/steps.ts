import type { ActivityStep } from "@/types/activity";

/** Standing lines, as rain. Dotted guides first, then free rain. */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "living-room",
    cast: [{ id: "milo", x: 40, size: 52, expression: "curious" }],
    beats: [
      { speaker: "milo", text: "Ooh… I think it's raining!", actors: { milo: { expression: "surprised", action: "lookRight" } } },
      { speaker: "milo", text: "Can you help the rain fall? Top to bottom.", actors: { milo: { expression: "curious", action: "headTilt" } } },
    ],
  },
  {
    id: "rain",
    type: "guided-draw",
    scene: "rain",
    prompt: "Start at the green spot. Follow the dots all the way down!",
    strokes: [
      { guide: "M330 215 L330 480", line: "Plip! A raindrop!" },
      { guide: "M440 215 L440 480", line: "Another one!" },
      { guide: "M560 215 L560 480", line: "More rain!" },
      { guide: "M670 215 L670 480" },
    ],
    free: { count: { younger: 5, older: 8 }, prompt: "Now make LOTS of rain! Draw it falling down." },
    line: "It's really raining now! Good thing I'm inside.",
  },
  {
    id: "reflect",
    type: "reflection",
    speaker: "milo",
    questions: ["Can you draw rain in the air with your finger? Top to bottom!"],
    parentNote: "Standing lines are the first writing stroke. Rain, grass, candles on a cake: all good excuses to draw them.",
  },
  { id: "celebrate", type: "celebration", celebration: "thumbsUp" },
];
