import type { ActivityStep } from "@/types/activity";

/** A sleeping line from left to right, then a bendy one around a tree. Milo walks each road home. */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "garden",
    cast: [{ id: "milo", x: 30, size: 50, expression: "confused" }],
    beats: [
      { speaker: "milo", text: "I want to go home. But there's no road!", actors: { milo: { expression: "confused", action: "lookRight" } } },
      { speaker: "milo", text: "Can you draw me one?", actors: { milo: { expression: "curious", action: "headTilt" } } },
    ],
  },
  {
    id: "road-1",
    type: "guided-draw",
    scene: "road",
    prompt: "Start at the green spot, next to me. Draw the road to my house!",
    strokes: [{ guide: "M190 470 L790 470" }],
    line: "A road! Here I go!",
  },
  {
    id: "road-2",
    type: "guided-draw",
    scene: "road-bendy",
    prompt: "Uh-oh. A tree! Draw a bendy road around it.",
    strokes: [{ guide: "M190 470 C300 470 380 560 520 560 S720 470 790 470" }],
    line: "Bendy roads are the best roads.",
  },
  { id: "celebrate", type: "celebration", celebration: "waddle" },
];
