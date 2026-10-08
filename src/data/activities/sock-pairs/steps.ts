import type { ActivityStep } from "@/types/activity";

export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "living-room",
    cast: [
      { id: "squirrel", x: 70, size: 44, flip: true, expression: "proud" },
      { id: "milo", x: 28, size: 48 },
    ],
    // one of each sock, none matching, spread over the floor
    props: [
      { id: "s1", art: "sock:coral:stripes", x: 47, y: 72, size: 6, rotate: -20, hidden: true },
      { id: "s2", art: "sock:blue:dots", x: 53, y: 80, size: 6, rotate: 25, hidden: true },
      { id: "s3", art: "sock:mustard:plain", x: 88, y: 70, size: 6, rotate: 10, hidden: true },
      { id: "s4", art: "sock:sage:heel", x: 79, y: 86, size: 6, rotate: -35, hidden: true },
      { id: "s5", art: "sock:coral:dots", x: 60, y: 86, size: 6, rotate: 60, hidden: true },
      { id: "s6", art: "sock:blue:stripes", x: 42, y: 86, size: 6, rotate: -60, hidden: true },
    ],
    beats: [
      { speaker: "squirrel", text: "I did ALL the laundry. Then I organised it.", sfx: "paper-rustle", show: ["s1", "s2", "s3", "s4", "s5", "s6"], actors: { squirrel: { action: "hop" } } },
      { speaker: "milo", text: "Every sock is alone.", actors: { milo: { expression: "suspicious" }, squirrel: { action: "idle" } } },
      { speaker: "squirrel", text: "That's… a kind of organised.", actors: { squirrel: { expression: "confused" } } },
      { speaker: "milo", text: "Let's find each sock its partner!", actors: { milo: { expression: "happy" } } },
    ],
  },
  {
    id: "match",
    type: "match",
    speaker: "squirrel",
    prompt: { younger: "Tap two socks that are the same!", older: "Find all the pairs!" },
    pairs: {
      younger: ["sock:coral:stripes", "sock:blue:dots", "sock:mustard:plain"],
      older: ["sock:coral:stripes", "sock:coral:dots", "sock:blue:dots", "sock:blue:stripes", "sock:sage:heel"],
    },
  },
  {
    id: "help-offer",
    type: "extension-offer",
    title: "Real Sock Helper",
    prompt: "Want to help with REAL socks?",
    speaker: "squirrel",
    badge: "parent-child",
    meta: { minutes: 5, materials: ["a pile of clean socks"] },
    steps: [
      {
        id: "help",
        type: "parent-child",
        title: "Sock Helper",
        where: "indoor",
        yourJob: ["Put a small pile of clean socks on the floor.", "Let your child find the pairs. Mismatches are fine!"],
        tryAsking: ["How do you know they match?", "Which sock is the biggest?", "Whose sock is this?"],
        childPrompts: ["Find two socks that are the same!", { younger: "Which sock is the smallest?", older: "Can you sort them: big socks, small socks?" }],
        returnText: "Tell Squirrel how many pairs you found!",
      },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "thumbsUp" },
];
