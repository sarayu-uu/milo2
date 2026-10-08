import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "living-room",
    cast: [
      { id: "milo", x: 30, size: 52, expression: "happy" },
      { id: "cat", x: 74, size: 34, flip: true, action: "sleep" },
    ],
    beats: [
      { speaker: "milo", text: "Moon. Spoon. Moon, spoon, MOON, SPOON!", actors: { milo: { action: "wingsUp" } } },
      { speaker: "milo", text: "They sound the same at the end. That's called a rhyme!", actors: { milo: { action: "idle", expression: "proud" } } },
      { speaker: "milo", text: "Help me find more rhymes. Quietly. Cat is sleeping.", actors: { milo: { expression: "curious", action: "headTilt" } } },
    ],
  },
  {
    id: "moon",
    type: "choice",
    prompt: "Which one rhymes with moon?",
    focus: { art: "moon", label: "moon" },
    options: [
      { art: "ball", label: "ball", fits: false, reaction: "Moon, ball. They end differently." },
      { art: "spoon", label: "spoon", fits: true, reaction: "Moon, spoon! They rhyme!" },
      { art: "cup", label: "cup", fits: false, reaction: "Moon, cup. Not a rhyme." },
    ],
  },
  {
    id: "cap",
    type: "choice",
    prompt: "Which one rhymes with cap?",
    focus: { art: "cap", label: "cap" },
    options: [
      { art: "star", label: "star", fits: false, reaction: "Cap, star. Hmm, no." },
      { art: "book", label: "book", fits: false, reaction: "Cap, book. They don't rhyme." },
      { art: "tap", label: "tap", fits: true, reaction: "Cap, tap! Yes!" },
    ],
  },
  {
    id: "key",
    type: "choice",
    prompt: "Which one rhymes with key?",
    focus: { art: "key", label: "key" },
    options: [
      { art: "seed", label: "seed", fits: false, reaction: "Key, seed. Close, but the end is different." },
      { art: "bell", label: "bell", fits: false, reaction: "Key, bell. Not a rhyme." },
      { art: "char:snail", label: "snail", fits: false, reaction: "Key, snail. No rhyme there." },
      { art: "char:milo:happy", label: "me", fits: true, reaction: "Key, me! That's ME! I rhyme with key!" },
    ],
  },
  {
    id: "first-sound",
    type: "story",
    backdrop: "living-room",
    cast: [{ id: "milo", x: 40, size: 54, expression: "curious" }],
    beats: [
      { speaker: "milo", text: "Now listen to the START of a word. B-b-ball. Ball starts with b.", actors: { milo: { action: "headTilt" } } },
    ],
  },
  {
    id: "b-words",
    type: "choice",
    prompt: "Find two more that start with b.",
    findCount: 2,
    options: [
      { art: "book", label: "book", fits: true, reaction: "B-b-book! Yes!" },
      { art: "sun", label: "sun", fits: false, reaction: "Sss-un. That's an s sound." },
      { art: "bell", label: "bell", fits: true, reaction: "B-b-bell! You got it!" },
      { art: "leaf", label: "leaf", fits: false, reaction: "L-l-leaf. That's an l sound." },
      { art: "banana", label: "banana", fits: true, reaction: "B-b-banana! Yes!" },
    ],
  },
  {
    id: "claps",
    type: "story",
    backdrop: "living-room",
    cast: [
      { id: "milo", x: 30, size: 52, expression: "happy" },
      { id: "cat", x: 74, size: 34, flip: true, action: "sleep" },
    ],
    beats: [
      { speaker: "milo", text: "Last one. Words have parts. Clap each part with me!", actors: { milo: { action: "clap" } } },
      { speaker: "milo", text: "Ba. Na. Na. Three claps for banana!", actors: { milo: { action: "clap" } } },
      { speaker: "milo", text: "Now try your name. How many claps?", pause: 2500, actors: { milo: { action: "headTilt", expression: "curious" } } },
      { speaker: "cat", text: "Can you clap… more quietly.", actors: { cat: { action: "idle", expression: "sleepy" }, milo: { expression: "surprised", action: "idle" } } },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "wingsUp" },
];
