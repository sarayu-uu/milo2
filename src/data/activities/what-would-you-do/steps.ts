import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "ball",
    type: "story",
    backdrop: "garden",
    cast: [
      { id: "dog", x: 24, size: 48, expression: "happy" },
      { id: "squirrel", x: 76, size: 42, flip: true, expression: "happy" },
      { id: "milo", x: 50, size: 44, hidden: true },
    ],
    props: [{ id: "ball", art: "ball", x: 50, y: 74, size: 10 }],
    beats: [
      { speaker: "dog", text: "A ball! I want to play with it!", actors: { dog: { action: "run" } } },
      { speaker: "squirrel", text: "No, I saw it FIRST! It's mine!", actors: { squirrel: { action: "hop", expression: "suspicious" }, dog: { action: "idle" } } },
      { speaker: "dog", text: "But I want it too…", actors: { dog: { expression: "confused" } } },
      { speaker: "milo", text: "Oh dear. One ball, two friends. What could they do?", actors: { milo: { hidden: false, expression: "thinking", action: "headTilt" } } },
    ],
  },
  {
    id: "ball-choice",
    type: "choice",
    speaker: "milo",
    prompt: "What could they do? There's more than one good idea.",
    findCount: 2,
    options: [
      { art: "clock", label: "take turns", fits: true, reaction: "Take turns! Dog plays, then Squirrel plays. Fair!" },
      { art: "ball", label: "play together", fits: true, reaction: "Play together! Throw it to each other. Now it's a game for two!" },
      { art: "char:dog:surprised", label: "grab it", fits: false, reaction: "If Dog grabs it, Squirrel would feel sad. Can you think of a kinder way?" },
      { art: "marble", label: "find another", fits: true, reaction: "Find another ball! Then there's one each." },
    ],
  },
  {
    id: "ball-end",
    type: "story",
    backdrop: "garden",
    cast: [
      { id: "dog", x: 24, size: 48, expression: "happy" },
      { id: "squirrel", x: 76, size: 42, flip: true, expression: "happy" },
    ],
    props: [{ id: "ball", art: "ball", x: 50, y: 50, size: 10 }],
    beats: [
      { speaker: "dog", text: "Catch, Squirrel!", sfx: "boing", actors: { dog: { action: "hop" } } },
      { speaker: "squirrel", text: "Got it! Your turn!", actors: { squirrel: { action: "hop" } } },
    ],
  },
  {
    id: "tower",
    type: "story",
    backdrop: "living-room",
    cast: [
      { id: "milo", x: 30, size: 50, expression: "proud" },
      { id: "squirrel", x: 74, size: 42, flip: true, hidden: true },
    ],
    props: [
      { id: "b1", art: "block", x: 50, y: 78.0, size: 9 },
      { id: "b2", art: "block", x: 50, y: 72.2, size: 9 },
      { id: "b3", art: "block", x: 50, y: 66.4, size: 9 },
      { id: "f1", art: "block", x: 44, y: 82, size: 9, rotate: -30, hidden: true },
      { id: "f2", art: "block", x: 58, y: 84, size: 9, rotate: 40, hidden: true },
      { id: "f3", art: "block", x: 64, y: 80, size: 9, rotate: 15, hidden: true },
    ],
    beats: [
      { speaker: "milo", text: "Look at my tower! My tallest one ever.", actors: { milo: { action: "wingsUp" } } },
      {
        speaker: "squirrel",
        text: "Coming through, very busy…",
        sfx: "sfx-mystery-clatter",
        hide: ["b1", "b2", "b3"],
        show: ["f1", "f2", "f3"],
        actors: { squirrel: { hidden: false, action: "run" }, milo: { expression: "surprised", action: "idle" } },
      },
      { speaker: "milo", text: "My tower…", pause: 900, actors: { milo: { expression: "confused" }, squirrel: { action: "idle", expression: "surprised" } } },
      { speaker: "squirrel", text: "Oops. It was an accident! What should I do?", actors: { squirrel: { expression: "confused", action: "headTilt" } } },
    ],
  },
  {
    id: "tower-choice",
    type: "choice",
    speaker: "squirrel",
    prompt: "What could I do to make it better?",
    findCount: 2,
    options: [
      { art: "heart", label: "say sorry", fits: true, reaction: "Say sorry. \"Sorry, Milo, I didn't mean to.\" That helps." },
      { art: "shoe", label: "run away", fits: false, reaction: "If I run away, Milo is still sad, and his tower is still broken." },
      { art: "block", label: "help rebuild", fits: true, reaction: "Help build it again! Two builders are faster than one." },
      { art: "char:squirrel:happy", label: "laugh", fits: false, reaction: "If I laugh, Milo might feel even worse." },
    ],
  },
  {
    id: "tower-end",
    type: "story",
    backdrop: "living-room",
    cast: [
      { id: "milo", x: 30, size: 50, expression: "happy" },
      { id: "squirrel", x: 70, size: 42, flip: true, expression: "happy" },
    ],
    props: [
      { id: "b1", art: "block", x: 50, y: 78.0, size: 9 },
      { id: "b2", art: "block", x: 50, y: 72.2, size: 9 },
      { id: "b3", art: "block", x: 50, y: 66.4, size: 9 },
      { id: "b4", art: "block", x: 50, y: 60.6, size: 9 },
    ],
    beats: [
      { speaker: "squirrel", text: "Sorry, Milo. Let's build it again, together.", actors: { squirrel: { action: "headTilt" } } },
      { speaker: "milo", text: "Look! Now it's even TALLER.", actors: { milo: { action: "wingsUp", expression: "proud" } } },
      { speaker: "squirrel", text: "Please don't let me walk past it.", pause: 900, actors: { squirrel: { expression: "neutral", action: "idle" } } },
    ],
  },
  {
    id: "talk",
    type: "reflection",
    speaker: "milo",
    questions: ["Have you ever wanted the same toy as a friend?", "What did you do? What could you try next time?"],
    parentNote: "There's no right answer. Listen first, then wonder together: \"How do you think your friend felt?\"",
  },
  { id: "celebrate", type: "celebration", celebration: "highFive" },
];
