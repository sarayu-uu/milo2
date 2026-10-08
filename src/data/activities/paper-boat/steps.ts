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
    // each card is an animation of that fold, on a loop (components/activities/steps/BoatFolds)
    cards: [
      { art: "fold-1", anim: "boat-1", text: "Hold the paper tall. Fold it in half, top down to the bottom." },
      { art: "fold-1", anim: "boat-2", text: "Fold it in half sideways, then open it again. Now there's a line in the middle." },
      { art: "fold-2", anim: "boat-3", text: "Fold the top corners down, so they meet at the middle line." },
      { art: "fold-3", anim: "boat-4", text: "Fold the bottom strip up. Turn it over, and fold the other strip up too. It's a hat!" },
      { art: "fold-4", anim: "boat-5", text: "Open the bottom of the hat. Push the two ends together and flatten it into a diamond." },
      { art: "fold-4", anim: "boat-6", text: "Fold the bottom point up to the top. Turn it over and do the same." },
      { art: "fold-4", anim: "boat-7", text: "Open it again. Push the ends together and flatten it into a smaller diamond." },
      { art: "fold-5", anim: "boat-8", text: "Hold the two sides and gently pull them apart. A boat!" },
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
