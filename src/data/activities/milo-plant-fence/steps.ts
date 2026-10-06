import type { ActivityStep } from "@/types/activity";

/** Three standing lines, then two sleeping lines across: a fence. */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "garden",
    cast: [{ id: "milo", x: 34, size: 50, expression: "confused" }],
    beats: [
      { speaker: "milo", text: "My little plant keeps falling over!", actors: { milo: { expression: "surprised", action: "stumble" } } },
      { speaker: "milo", text: "It needs a fence. Will you help me build one?", actors: { milo: { expression: "curious", action: "headTilt" } } },
    ],
  },
  {
    id: "fence",
    type: "guided-draw",
    scene: "fence",
    prompt: "First, a standing line. Follow the dots down!",
    strokes: [
      { guide: "M330 290 L330 500", line: "One standing post!" },
      { guide: "M500 290 L500 500", line: "Two!" },
      { guide: "M670 290 L670 500", line: "They're standing! Now a sleeping line, across." },
      { guide: "M290 360 L710 360", line: "One more sleeping line!" },
      { guide: "M290 445 L710 445" },
    ],
    line: "A fence! My plant is safe now.",
  },
  {
    id: "reflect",
    type: "reflection",
    speaker: "milo",
    questions: ["Can you make a standing line with your finger? Now a sleeping one?"],
    parentNote: "Try it with pencils, sticks or straws: standing ones and sleeping ones, then build a fence together.",
  },
  { id: "celebrate", type: "celebration", celebration: "clap" },
];
