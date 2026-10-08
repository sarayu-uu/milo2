import type { ActivityStep } from "@/types/activity";

/**
 * Age 5: a fair test. Same ice, different coats, same time.
 * In this setup (ice on a plate in a warm room): cloth keeps the most ice, then foil, then paper; uncovered melts fastest.
 */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "kitchen",
    cast: [{ id: "milo", x: 30, size: 52, expression: "proud" }],
    props: [{ id: "kevin", art: "ice-kevin", x: 58, y: 63, size: 12 }],
    beats: [
      { speaker: "milo", text: "This is Kevin.", actors: { milo: { expression: "proud", action: "bellyPuff" } } },
      { speaker: "milo", text: "Kevin has a problem.", pause: 800, actors: { milo: { expression: "thinking", action: "headTilt" } } },
      { speaker: "milo", text: "He's disappearing.", sfx: "sfx-drip", actors: { milo: { expression: "surprised", action: "investigate" } } },
      { speaker: "milo", text: "Can we keep Kevin cold?", actors: { milo: { expression: "curious", action: "idle" } } },
    ],
  },
  {
    id: "wrap",
    type: "choice",
    prompt: "What should we wrap Kevin in?",
    options: [
      { art: "cloth", label: "Cloth", fits: true, reaction: "A cosy cloth coat. Ooh." },
      { art: "paper-sheet", label: "Paper", fits: true, reaction: "A paper coat. Crinkly." },
      { art: "foil", label: "Foil", fits: true, reaction: "A shiny foil coat. Fancy." },
      { art: "plate", label: "Nothing", fits: true, reaction: "No coat at all. Brave, Kevin." },
    ],
  },
  {
    id: "guess",
    type: "choice",
    prompt: "Do you think it will keep him cold for longer?",
    options: [
      { art: "ice-kevin", label: "Yes, longer", fits: true, reaction: "Let's find out!" },
      { art: "question", label: "Not sure", fits: true, reaction: "Good. Scientists aren't sure either. Let's test!" },
    ],
  },
  {
    id: "test",
    type: "melt",
    backdrop: "kitchen",
    prompt: "Four Kevins. Four different coats. Then we wait.",
    wraps: [
      { id: "none", art: "plate", label: "Nothing", left: 0.15 },
      { id: "paper", art: "paper-sheet", label: "Paper", left: 0.4 },
      { id: "foil", art: "foil", label: "Foil", left: 0.55 },
      { id: "cloth", art: "cloth", label: "Cloth", left: 0.72 },
    ],
    compare: {
      run: "Let time pass",
      most: { prompt: "Which one has the most ice left?", right: "That one! Look how much is left.", wrong: "Hmm, look again. Which one is the biggest?" },
      what: { prompt: "What was around it?", right: "The cloth! It kept the cold in.", wrong: "Hmm. Look at its coat again." },
      change: "Now change one! Tap a Kevin to swap his coat. Then let time pass again.",
      again: "Look! Did your change help?",
    },
    line: "Kevin! …We should probably put him back in the freezer.",
  },
  {
    id: "try-at-home",
    type: "extension-offer",
    title: "Keep Kevin Cold at home",
    prompt: "Want to run the experiment for real?",
    speaker: "milo",
    badge: "parent-child",
    meta: { minutes: 10, materials: ["2 ice cubes", "2 plates", "a cloth"] },
    steps: [
      {
        id: "at-home",
        type: "parent-child",
        title: "Keep Kevin Cold at home",
        where: "indoor",
        yourJob: ["Put an ice cube on each plate.", "Wrap one in a cloth, leave the other bare.", "Check them together after 10 minutes."],
        tryAsking: ["Which one do you think will melt first?", "Which one has more ice left?", "What could we change next time?"],
        childPrompts: [
          "Which ice will last longer: wrapped or bare?",
          "Check them! Which one has more ice left?",
          "What would you try next?",
        ],
        materials: ["2 ice cubes", "2 plates", "a cloth"],
        returnText: "Come back and tell Milo what happened!",
      },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "bellyPuff" },
];
