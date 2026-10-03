import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "story-1",
    type: "story",
    backdrop: "night",
    cast: [
      { id: "milo", x: 26, size: 46, expression: "curious" },
      { id: "cat", x: 68, size: 36, flip: true, action: "sleep" },
    ],
    beats: [
      { speaker: "milo", text: "Shh. Cat is asleep.", actors: { milo: { expression: "thinking" } } },
      { speaker: "cat", text: "…I am not asleep.", actors: { cat: { action: "idle", expression: "sleepy" } } },
      { speaker: "milo", text: "Cat, can you tell us a story?", actors: { milo: { expression: "happy" } } },
      { speaker: "cat", text: "Hmph. Once, a very round pigeon wanted to touch the moon.", actors: { milo: { expression: "suspicious" } } },
      { speaker: "cat", text: "He climbed onto a chair. Then a cupboard. Then the very top shelf…", actors: { cat: { expression: "sleepy", action: "talk" } } },
    ],
  },
  {
    id: "predict",
    type: "choice",
    speaker: "cat",
    prompt: { younger: "What did he do next?", older: "What do you think he did next? Why?" },
    options: [
      { art: "moon", label: "Jumped to the moon", fits: true, reaction: "Bold. Very bold." },
      { art: "paper-plane", label: "Made a paper plane", fits: true, reaction: "Clever. Pigeons can't fold, though." },
      { art: "lamp", label: "Switched on a lamp", fits: true, reaction: "Ah. A small moon of his own." },
    ],
    findCount: 1,
  },
  {
    id: "story-2",
    type: "story",
    backdrop: "night",
    cast: [
      { id: "milo", x: 26, size: 46, expression: "curious" },
      { id: "cat", x: 68, size: 36, flip: true, expression: "sleepy" },
    ],
    beats: [
      { speaker: "cat", text: "Actually… he fell asleep. On the shelf. The end.", actors: { cat: { action: "idle" } } },
      { speaker: "milo", text: "That's not what we picked!", actors: { milo: { expression: "surprised", action: "stumble" } } },
      { speaker: "cat", text: "Stories do that.", sfx: "yawn", actors: { cat: { action: "sleep" }, milo: { expression: "confused", action: "headTilt" } } },
    ],
  },
  {
    id: "reflect",
    type: "reflection",
    speaker: "cat",
    questions: [{ younger: "What would YOU do to touch the moon?", older: "How do you think the pigeon felt at the top? Why?" }],
    parentNote: "Let your child tell their own ending. Ask 'and then what?' to stretch the story.",
  },
  { id: "celebrate", type: "celebration", celebration: "thumbsUp" },
];
