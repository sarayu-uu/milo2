import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "living-room",
    cast: [
      { id: "milo", x: 28, size: 50, expression: "neutral" },
      { id: "squirrel", x: 72, size: 46, flip: true, expression: "proud" },
    ],
    beats: [
      { speaker: "squirrel", text: "I sorted ALL my things into groups. Perfectly.", actors: { squirrel: { action: "hop" } } },
      { speaker: "milo", text: "Perfectly?", actors: { milo: { expression: "suspicious", action: "headTilt" } } },
      { speaker: "squirrel", text: "Well… one thing in each group might be in the wrong place.", actors: { squirrel: { expression: "neutral", action: "idle" } } },
      { speaker: "milo", text: "Let's find the one that doesn't belong!", actors: { milo: { expression: "curious", action: "idle" } } },
    ],
  },
  {
    id: "fruit",
    type: "choice",
    speaker: "squirrel",
    prompt: "This is my fruit group. Which one doesn't belong?",
    options: [
      { art: "mango", label: "mango", fits: false, reaction: "A mango is a fruit. It belongs!" },
      { art: "banana", label: "banana", fits: false, reaction: "Bananas are fruit. That one stays." },
      { art: "shoe", label: "shoe", fits: true, reaction: "A shoe! You can't eat a shoe. How did THAT get in there?" },
      { art: "orange", label: "orange", fits: false, reaction: "An orange is a fruit too." },
    ],
  },
  {
    id: "round",
    type: "choice",
    speaker: "squirrel",
    prompt: "This is my round group. Which one doesn't belong?",
    options: [
      { art: "ball", label: "ball", fits: false, reaction: "A ball is round. It belongs." },
      { art: "wheel", label: "wheel", fits: false, reaction: "A wheel is round. It rolls!" },
      { art: "book", label: "book", fits: true, reaction: "Yes! A book has corners. It isn't round at all." },
      { art: "coin", label: "coin", fits: false, reaction: "A coin is round. Look at its edge." },
    ],
  },
  {
    id: "garden",
    type: "choice",
    speaker: "squirrel",
    prompt: "These are things from the garden. Which one doesn't belong?",
    options: [
      { art: "leaf", label: "leaf", fits: false, reaction: "Leaves grow in the garden. It belongs." },
      { art: "acorn", label: "acorn", fits: false, reaction: "An acorn! My favourite. It grew on a tree." },
      { art: "spoon", label: "spoon", fits: true, reaction: "A spoon lives in the kitchen, not the garden!" },
      { art: "flower", label: "flower", fits: false, reaction: "Flowers grow in the garden. It stays." },
    ],
  },
  {
    id: "tricky",
    type: "choice",
    speaker: "squirrel",
    prompt: "Tricky one! Each of these could be the different one. Pick one, and tell me why.",
    options: [
      { art: "orange", label: "orange", fits: true, reaction: "The orange! It's the only one you can eat." },
      { art: "ball", label: "ball", fits: true, reaction: "The ball! It's the only toy." },
      { art: "coin", label: "coin", fits: true, reaction: "The coin! It's the smallest, and it's money." },
      { art: "wheel", label: "wheel", fits: true, reaction: "The wheel! It's the only one with a hole in the middle." },
    ],
    findCount: 2,
  },
  {
    id: "ending",
    type: "story",
    backdrop: "living-room",
    cast: [
      { id: "milo", x: 28, size: 50, expression: "happy" },
      { id: "squirrel", x: 72, size: 46, flip: true, expression: "happy" },
    ],
    beats: [
      { speaker: "milo", text: "So more than one answer can be right, if you have a good reason.", actors: { milo: { action: "headTilt" } } },
      { speaker: "squirrel", text: "Then I was right ALL along. My sorting was perfect.", actors: { squirrel: { expression: "proud", action: "hop" } } },
      { speaker: "milo", text: "There was a shoe in the fruit.", pause: 900, actors: { milo: { expression: "suspicious", action: "idle" } } },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "clap" },
];
