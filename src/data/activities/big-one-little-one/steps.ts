import type { ActivityStep } from "@/types/activity";

/** Big or little? Pictures only: the size is the clue, not the word. */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "living-room",
    cast: [{ id: "milo", x: 30, size: 50, expression: "confused" }],
    props: [
      { id: "big-shoe", art: "shoe", x: 64, y: 60, size: 18 },
      { id: "little-shoe", art: "shoe", x: 80, y: 70, size: 9 },
    ],
    beats: [
      { speaker: "milo", text: "I found two shoes.", actors: { milo: { expression: "curious", action: "lookRight" } } },
      { speaker: "milo", text: "Umm… I don't think both of these are mine.", actors: { milo: { expression: "confused", action: "headTilt" } } },
      { speaker: "milo", text: "One is BIG. One is LITTLE. Can you help me?", actors: { milo: { expression: "curious", action: "idle" } } },
    ],
  },
  {
    id: "shoe",
    type: "choice",
    prompt: "Show me the BIG shoe!",
    noLabels: true,
    options: [
      { art: "shoe", label: "Big shoe", fits: true, reaction: "That's the big one! Way too big for me." },
      { art: "shoe", label: "Little shoe", scale: 0.5, fits: false, reaction: "That one's little. Where's the BIG one?" },
    ],
  },
  {
    id: "ball",
    type: "choice",
    prompt: "Now show me the LITTLE ball!",
    noLabels: true,
    options: [
      { art: "ball", label: "Big ball", fits: false, reaction: "Hmm, that one's big. Find the little one!" },
      { art: "ball", label: "Little ball", scale: 0.45, fits: true, reaction: "The little ball! Tiny. Like a pea." },
    ],
  },
  {
    id: "spoon",
    type: "choice",
    prompt: "Which spoon is BIG?",
    noLabels: true,
    options: [
      { art: "spoon", label: "Little spoon", scale: 0.5, fits: false, reaction: "That's a little spoon. For a little soup." },
      { art: "spoon", label: "Big spoon", fits: true, reaction: "Big spoon! For a BIG soup." },
    ],
  },
  {
    id: "leaf",
    type: "choice",
    prompt: "Which leaf is LITTLE?",
    noLabels: true,
    options: [
      { art: "leaf", label: "Little leaf", scale: 0.45, fits: true, reaction: "Little leaf! Snail could hide under that." },
      { art: "leaf", label: "Big leaf", fits: false, reaction: "That's a big leaf. Find the little one!" },
    ],
  },
  {
    id: "milo",
    type: "choice",
    prompt: "Last one. Which Milo is BIG?",
    noLabels: true,
    options: [
      { art: "char:milo:happy", label: "Little Milo", scale: 0.45, fits: false, reaction: "That's tiny me! Find big me!" },
      { art: "char:milo:happy", label: "Big Milo", fits: true, reaction: "Big me! Big and very handsome." },
    ],
  },
  {
    id: "reflect",
    type: "reflection",
    speaker: "milo",
    questions: ["Can you find something big and something little near you?"],
    parentNote: "Compare things at home: your shoe and theirs, a big spoon and a little one. Let them hold both.",
  },
  { id: "celebrate", type: "celebration", celebration: "wingsUp" },
];
