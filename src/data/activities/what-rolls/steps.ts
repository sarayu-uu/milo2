import type { ActivityStep } from "@/types/activity";

/** Age 3: push things and watch. A race. Then Milo tries rolling himself. */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "living-room",
    cast: [{ id: "milo", x: 28, size: 50, expression: "happy" }],
    props: [
      { id: "ball", art: "ball", x: 48, y: 70, size: 9 },
      { id: "ball-away", art: "ball", x: 88, y: 70, size: 9, hidden: true },
      { id: "block", art: "block", x: 56, y: 66, size: 11, hidden: true },
    ],
    beats: [
      { speaker: "milo", text: "A ball! Go!", sfx: "sfx-roll", hide: ["ball"], show: ["ball-away"], actors: { milo: { expression: "happy", action: "wingsUp" } } },
      { speaker: "milo", text: "A block. You too?", show: ["block"], actors: { milo: { expression: "curious", action: "headTilt" } } },
      { speaker: "milo", text: "…No.", sfx: "sfx-thunk", pause: 600, actors: { milo: { expression: "suspicious", action: "idle" } } },
    ],
  },
  {
    id: "try",
    type: "try-it",
    bench: "push",
    backdrop: "living-room",
    prompt: "Pick one. Then give it a push!",
    objects: [
      { art: "ball", label: "Ball", result: "roll" },
      { art: "orange", label: "Orange", result: "wobble" },
      { art: "block", label: "Block", result: "slide" },
      { art: "book", label: "Book", result: "slide" },
      { art: "plate", label: "Plate", result: "wobble" },
    ],
    results: [
      { result: "roll", line: "Look at it go! All the way!" },
      { result: "wobble", line: "It wobbled a bit… then stopped." },
      { result: "slide", line: "It just slid a bit." },
    ],
    tries: 4,
    race: { a: 0, b: 2, prompt: "Let's race the ball and the block! Push them!", line: "The ball wins! It just keeps going!" },
    outro: { prompt: "Watch me. I can roll too. Give me a push!", line: "I roll." },
  },
  {
    id: "try-at-home",
    type: "extension-offer",
    title: "What Rolls? at home",
    prompt: "Want to try it for real?",
    speaker: "milo",
    badge: "parent-child",
    meta: { minutes: 5, materials: ["a ball", "a box or block"] },
    steps: [
      {
        id: "at-home",
        type: "parent-child",
        title: "What Rolls? at home",
        where: "indoor",
        yourJob: ["Find a ball and a box (or any block).", "Let your child push each one gently.", "Try a few more safe things."],
        tryAsking: ["Which one went further?", "Why do you think the ball keeps going?", "Can you find something else that rolls?"],
        childPrompts: [
          "Push the ball. What happens?",
          "Now push the box!",
          "Find something else that rolls!",
        ],
        materials: ["a ball", "a box or block"],
        returnText: "Come back and tell Milo what happened!",
      },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "waddle" },
];
