import type { ActivityStep } from "@/types/activity";

/**
 * Age 4: will it stick? Guess, test, sort.
 * Only objects that really do / don't stick to a fridge magnet. Never "all metal sticks": it doesn't.
 */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "living-room-plain",
    cast: [{ id: "milo", x: 28, size: 50, expression: "curious" }],
    props: [
      { id: "magnet", art: "magnet", x: 46, y: 50, size: 9 },
      { id: "spoon", art: "spoon", x: 60, y: 76, size: 9, rotate: 70 },
      { id: "spoon-stuck", art: "spoon", x: 47, y: 62, size: 9, hidden: true, rotate: -10 },
    ],
    beats: [
      { speaker: "milo", text: "…", sfx: "sfx-magnet-click", pause: 1200, hide: ["spoon"], show: ["spoon-stuck"], actors: { milo: { expression: "surprised", action: "wingsUp" } } },
      { speaker: "milo", text: "HEY!", actors: { milo: { expression: "surprised", action: "stumble" } } },
      { speaker: "milo", text: "…Do that again.", actors: { milo: { expression: "suspicious", action: "investigate" } } },
    ],
  },
  {
    id: "try",
    type: "try-it",
    bench: "magnet",
    backdrop: "living-room-plain",
    prompt: "Guess first! Will it stick… or not?",
    predict: { prompt: "Guess first! Will it stick… or not?", go: "Now drag it up to the magnet!", right: "You thought so!", wrong: "I thought that too!" },
    objects: [
      { art: "key", label: "Key", result: "stick" },
      { art: "block", label: "Wooden block", result: "none" },
      { art: "paperclip", label: "Paper clip", result: "stick" },
      { art: "cup", label: "Plastic cup", result: "none" },
      { art: "sock:coral:plain", label: "Sock", result: "none", line: "…Nothing. Rude." },
    ],
    results: [
      { result: "stick", line: "It stuck!" },
      { result: "none", line: "…Nothing." },
    ],
    tries: 5,
    ending: { sort: true, prompt: "Let's sort them! Which ones stuck?", line: "These stuck. These didn't. Mystery solved!" },
  },
  {
    id: "try-at-home",
    type: "extension-offer",
    title: "Magnet Mystery at home",
    prompt: "Want to test things with a real magnet?",
    speaker: "milo",
    badge: "parent-child",
    meta: { minutes: 5, materials: ["a fridge magnet"] },
    steps: [
      {
        id: "at-home",
        type: "parent-child",
        title: "Magnet Mystery at home",
        where: "indoor",
        yourJob: ["Use a fridge magnet, and stay close.", "Test safe things: spoons, keys, toys, paper.", "Keep magnets away from phones, screens and plugs."],
        tryAsking: ["Will it stick? What do you think?", "Were you surprised?", "Do all the shiny things stick?"],
        childPrompts: [
          "Guess first! Will it stick… or not?",
          "Now try it!",
          "Find something that sticks, and something that doesn't!",
        ],
        materials: ["a fridge magnet"],
        returnText: "Come back and tell Milo what happened!",
      },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "wingsUp" },
];
