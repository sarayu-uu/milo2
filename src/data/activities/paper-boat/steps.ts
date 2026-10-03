import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "living-room",
    cast: [
      { id: "milo", x: 30, size: 48, expression: "curious" },
      { id: "cat", x: 72, size: 34, flip: true, action: "sleep" },
    ],
    beats: [
      { speaker: "milo", text: "I want a boat. A small one.", actors: { milo: { action: "idle" } } },
      { speaker: "cat", text: "…Boats are made of paper. Obviously.", sfx: "yawn", actors: { cat: { action: "idle", expression: "sleepy" } } },
      { speaker: "milo", text: "Are they?", actors: { milo: { expression: "confused", action: "headTilt" } } },
      { speaker: "cat", text: "Small ones are.", actors: { cat: { action: "sleep" } } },
      { speaker: "milo", text: "Let's make one! Get some paper.", actors: { milo: { expression: "happy", action: "idle" } } },
    ],
  },
  {
    id: "fold",
    type: "instructions",
    medium: "origami",
    title: "Fold a Paper Boat",
    intro: { younger: "A grown-up can help with the tricky folds.", older: "Fold slowly. Press each fold flat with your finger." },
    materials: ["1 rectangle of paper (A4 is perfect)"],
    parentTip: "Let your child do the pressing and smoothing. You can do the tricky corners. Wonky boats still float.",
    cards: [
      { art: "fold-1", text: "Fold the paper in half, top to bottom." },
      { art: "fold-2", text: "Fold the two top corners down to the middle." },
      { art: "fold-3", text: "Fold the bottom strips up, one on each side." },
      { art: "fold-4", text: "Open the bottom and squash it into a diamond." },
      { art: "fold-5", text: "Pull the sides apart gently…", result: "boat" },
    ],
  },
  {
    id: "reflect",
    type: "reflection",
    speaker: "cat",
    questions: [{ younger: "Does your boat float?", older: "Does it float? What happens when it gets wet?" }, "Where will your boat go?"],
    parentNote: "Try it in a bowl of water or a bucket. Let it sink eventually — that's an experiment too.",
  },
  { id: "celebrate", type: "celebration", celebration: "waddle", line: "Captain Milo!" },
];
