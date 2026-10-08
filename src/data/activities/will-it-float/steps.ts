import type { ActivityStep } from "@/types/activity";

/** Age 4: predict, then try. Sort what happened, then one new object to guess. */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "kitchen",
    cast: [{ id: "milo", x: 26, size: 50, expression: "happy" }],
    props: [
      { id: "bowl", art: "water-bowl-plain", x: 64, y: 50, size: 22 },
      { id: "stone", art: "pebble", x: 40, y: 34, size: 9 },
    ],
    beats: [
      { speaker: "milo", text: "I'm going to drop this stone in the water…", actors: { milo: { expression: "happy", action: "headTilt" } } },
      { speaker: "milo", text: "Wait!", actors: { milo: { expression: "surprised", action: "wingsUp" } } },
    ],
  },
  {
    id: "try",
    type: "try-it",
    bench: "bowl",
    backdrop: "kitchen",
    prompt: "Guess first! Will it stay up… or go down?",
    predict: { prompt: "Guess first! Will it stay up… or go down?", go: "Now drag it into the water!", right: "You thought so!", wrong: "I thought that too!" },
    objects: [
      { art: "pebble", label: "Stone", result: "sink" },
      { art: "leaf", label: "Leaf", result: "float" },
      { art: "spoon", label: "Spoon", result: "sink" },
      { art: "cap", label: "Bottle cap", result: "float" },
    ],
    results: [
      { result: "float", line: "It's staying on top!" },
      { result: "sink", line: "It went all the way down!" },
    ],
    tries: 4,
    ending: { sort: true, prompt: "Hmm… which ones stayed up? Drag each one to where it belongs.", line: "Stayed up here. Went down there!" },
    final: { art: "coin", label: "Coin", result: "sink", prompt: "What about THIS one? We haven't tried it yet!" },
  },
  {
    id: "try-at-home",
    type: "extension-offer",
    title: "Will It Float? at home",
    prompt: "Want to test your own things?",
    speaker: "milo",
    badge: "parent-child",
    meta: { minutes: 5, materials: ["a bowl of water", "a few safe things to test"] },
    steps: [
      {
        id: "at-home",
        type: "parent-child",
        title: "Will It Float? at home",
        where: "indoor",
        yourJob: ["Stay close: water and little ones.", "Before each one, ask: will it stay up or go down?", "Any guess is a good guess."],
        tryAsking: ["What do you think will happen?", "Were you right? Were you surprised?", "Why do you think it stayed up?"],
        childPrompts: [
          "Pick something. Will it stay up or go down?",
          "Now drop it in. What happened?",
          "Can you find something that surprises you?",
        ],
        materials: ["a bowl of water", "a few safe things to test"],
        returnText: "Come back and tell Milo what happened!",
      },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "clap" },
];
