import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  // PART 1 — STORY (interactive: something keeps following Milo)
  { id: "follow", type: "interactive", component: "shadow-follow" },

  // PART 2 — SHADOW DISCOVERY (closer / farther / wing / turn)
  {
    id: "discover",
    type: "interactive",
    component: "shadow-discovery",
    props: {
      goal: { younger: "Can you make it BIG?", older: "What happens when Milo moves closer to the torch?" },
    },
  },

  // PART 3 — HAND SHADOWS
  {
    id: "hands-intro",
    type: "story",
    backdrop: "shadow-wall",
    cast: [{ id: "milo", x: 38, size: 60, expression: "thinking", shadow: "wall" }],
    props: [{ id: "torch", art: "torch-glow", x: 9, y: 52, size: 15 }],
    beats: [
      { speaker: "milo", text: "Hmm.", actors: { milo: { action: "headTilt" } } },
      { speaker: "milo", text: "Can HANDS make shadows?", actors: { milo: { expression: "curious", action: "idle" } } },
      { speaker: "milo", text: { younger: "Let's try with a grown-up!", older: "Let's find out. A light and a wall help." } },
    ],
  },
  {
    id: "hands",
    type: "instructions",
    medium: "hand-shadow",
    title: "Hand Shadows",
    intro: "Shine a light at a wall. Put your hands in between.",
    materials: ["a lamp, torch or phone light", "a plain wall"],
    parentTip: "Dim the room a little. Hold the light still; let your child move their hands.",
    cards: [
      { art: "hand-rabbit", result: "shadow-rabbit", text: { younger: "Rabbit! Two fingers up.", older: "Rabbit: make a fist, put two fingers up for ears." } },
      { art: "hand-bird", result: "shadow-bird", text: { younger: "Bird! Cross your hands and hook your thumbs.", older: "Bird: cross your wrists, hook your thumbs, and flap your fingers like wings." } },
      { art: "hand-dog", result: "shadow-dog", text: { younger: "Dog! Thumb up for an ear. Wiggle the bottom fingers to bark.", older: "Dog: thumb up for an ear, two fingers on top, two below. Wiggle the bottom two to open the mouth." } },
    ],
  },
  {
    id: "milo-tries",
    type: "story",
    backdrop: "shadow-wall",
    cast: [{ id: "milo", x: 34, size: 60, expression: "proud", flip: true }],
    props: [
      { id: "torch", art: "torch-glow", x: 9, y: 52, size: 15 },
      { id: "potato", art: "shadow-potato", x: 70, y: 28, size: 28, hidden: true },
    ],
    beats: [
      { speaker: "milo", text: "My turn. I'll make a bird.", actors: { milo: { expression: "proud", action: "wingsUp" } } },
      { speaker: "milo", text: "…", show: ["potato"], sfx: "comedic-pause", pause: 1400, actors: { milo: { expression: "neutral", action: "idle" } } },
      { speaker: "milo", text: "That's a potato.", actors: { milo: { expression: "suspicious", action: "lookRight" } } },
      { speaker: "milo", text: "A very nice potato.", actors: { milo: { expression: "happy", action: "idle" } } },
    ],
  },

  // PART 4 — OPTIONAL REAL-WORLD EXPLORATION
  {
    id: "explore-offer",
    type: "extension-offer",
    title: "Shadow Investigators",
    prompt: "Want to investigate your own shadows?",
    speaker: "milo",
    badge: "parent-child",
    meta: { minutes: 5, materials: ["a lamp, torch or sunshine"] },
    steps: [
      {
        id: "explore",
        type: "parent-child",
        title: "Shadow Investigators",
        where: "either",
        yourJob: ["Find a light: a lamp, a torch, or the sun outside.", "Read one challenge at a time."],
        tryAsking: ["What changed?", "What did you move?", "Why do you think it became bigger?"],
        childPrompts: [
          "Can you make your shadow TALL?",
          "Can you make it tiny?",
          "Can your shadows touch?",
          "Can you make a funny shadow?",
          { younger: "Can you make an animal?", older: "Can you make an animal that moves?" },
        ],
        materials: ["a light", "a wall or the ground"],
        returnText: "Come back and tell Milo what you found!",
      },
      {
        id: "explore-reflect",
        type: "reflection",
        speaker: "milo",
        questions: [{ younger: "Did your shadow get BIG?", older: "When did your shadow get bigger?" }, "Which shadow was the funniest?"],
        parentNote: "No right answers needed. Noticing and talking IS the activity.",
      },
    ],
  },

  // ENDING — Milo tries to high-five his shadow
  {
    id: "ending",
    type: "story",
    backdrop: "shadow-wall",
    cast: [{ id: "milo", x: 36, size: 60, expression: "happy", shadow: "wall", flip: true }],
    props: [{ id: "torch", art: "torch-glow", x: 9, y: 52, size: 15 }],
    beats: [
      { speaker: "milo", text: "Shadow! We did it! High five!", actors: { milo: { action: "highFive", expression: "happy" } } },
      { speaker: "milo", text: "…", pause: 1500, sfx: "comedic-pause", actors: { milo: { action: "highFive", expression: "neutral" } } },
      { speaker: "milo", text: "Right.", actors: { milo: { action: "idle", expression: "suspicious" } } },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "highFive" },
];
