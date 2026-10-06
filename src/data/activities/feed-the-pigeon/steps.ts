import type { ActivityStep } from "@/types/activity";

/** One seed, then two, then three. Then tap and count them together. */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "kitchen",
    cast: [{ id: "milo", x: 40, size: 52, expression: "neutral" }],
    beats: [
      { speaker: "milo", text: "Ohh. I'm SO hungry.", actors: { milo: { expression: "sleepy", action: "idle" } } },
      { speaker: "milo", text: "Can you feed me some seeds? Drag them to me!", actors: { milo: { expression: "curious", action: "headTilt" } } },
    ],
  },
  {
    id: "feed",
    type: "give",
    backdrop: "kitchen",
    art: "seed",
    rounds: [
      { count: 1, prompt: "Can I have ONE seed?", line: "Yum! One seed!" },
      { count: 2, prompt: "Now TWO seeds, please!", line: "One, two! Two seeds!" },
      { count: 3, prompt: "Can I have THREE seeds?", line: "One, two, three! Three seeds!" },
    ],
  },
  {
    id: "count",
    type: "count",
    backdrop: "kitchen",
    prompt: "Let's count my snack together. Tap each seed!",
    art: "seed",
    count: 3,
  },
  { id: "celebrate", type: "celebration", celebration: "bellyPuff" },
];
