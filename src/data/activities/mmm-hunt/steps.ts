import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "kitchen",
    cast: [{ id: "milo", x: 40, size: 54, expression: "happy" }],
    beats: [
      { speaker: "milo", text: "Mmmmm. That's the sound I make when food is yummy.", actors: { milo: { action: "bellyPuff" } } },
      { speaker: "milo", text: "And my name starts with it! Mmm-ilo.", actors: { milo: { action: "idle", expression: "proud" } } },
      { speaker: "milo", text: "What else starts with mmm?", actors: { milo: { expression: "curious", action: "headTilt" } } },
    ],
  },
  {
    id: "find",
    type: "choice",
    speaker: "milo",
    sayAloud: "mmm",
    prompt: { younger: "Which one starts with mmm?", older: "Find TWO that start with mmm." },
    findCount: { younger: 1, older: 2 },
    options: [
      { art: "mango", label: "mango", fits: true, reaction: "Mmm-ango! Yes!" },
      { art: "ball", label: "ball", fits: false, reaction: "B-b-ball. That's a b sound." },
      { art: "moon", label: "moon", fits: true, reaction: "Mmm-oon! Yes!" },
      { art: "sun", label: "sun", fits: false, reaction: "Sss-un. That one hisses!" },
      { art: "mug", label: "mug", fits: true, reaction: "Mmm-ug! You got it!" },
    ],
  },
  {
    id: "hunt-offer",
    type: "extension-offer",
    title: "Mmm Hunt at Home",
    prompt: "Can you find something at home that starts with mmm?",
    speaker: "milo",
    badge: "real-world",
    meta: { minutes: 5 },
    steps: [
      {
        id: "hunt",
        type: "parent-child",
        title: "Mmm Hunt",
        where: "indoor",
        yourJob: ["Say words slowly, stretching the first sound: mmm-ilk.", "Silly guesses are welcome."],
        tryAsking: ["Does 'spoon' start with mmm?", "What about 'mummy' or 'mat'?"],
        childPrompts: [
          "Find something that starts with mmm!",
          { younger: "Say it slowly with Milo: mmm…", older: "Can you find something that starts with sss?" },
        ],
        returnText: "Tell Milo what you found!",
      },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "clap" },
];
