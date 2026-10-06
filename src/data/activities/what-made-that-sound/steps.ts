import type { ActivityStep } from "@/types/activity";

/** Hear a sound, pick what made it. Milo guesses wrong now and then. */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "living-room",
    cast: [{ id: "milo", x: 40, size: 52, expression: "curious" }],
    beats: [
      // first a noise from somewhere off-page, THEN Milo asks about it
      { speaker: "milo", text: "…", sfx: "sfx-mystery-clatter", pause: 2200, actors: { milo: { expression: "surprised", action: "lookLeft" } } },
      { speaker: "milo", text: "Shh… Listen. Did you hear that?", actors: { milo: { expression: "surprised", action: "lookLeft" } } },
      { speaker: "milo", text: "Let's find out what's making all these sounds!", actors: { milo: { expression: "curious", action: "headTilt" } } },
    ],
  },
  {
    id: "woof",
    type: "choice",
    sound: "sfx-dog-bark",
    prompt: "Listen… What made that sound?",
    options: [
      { art: "cup", label: "Cup", fits: false, reaction: "A cup doesn't woof. I checked." },
      { art: "char:dog:happy", label: "Dog", fits: true, reaction: "Woof! It was Dog!" },
      { art: "bell", label: "Bell", fits: false, reaction: "Not the bell. Listen again!" },
    ],
  },
  {
    id: "bell",
    type: "choice",
    sound: "sfx-bell-ring",
    prompt: "Listen! Hmm… was that the spoon? What do YOU think?",
    options: [
      { art: "bell", label: "Bell", fits: true, reaction: "The bell! …I knew that." },
      { art: "spoon", label: "Spoon", fits: false, reaction: "Not the spoon. Spoons are very quiet." },
      { art: "ball", label: "Ball", fits: false, reaction: "Hmm, not the ball. Listen again!" },
    ],
  },
  {
    id: "water",
    type: "choice",
    sound: "sfx-tap-water",
    prompt: "Listen carefully. What made that sound?",
    options: [
      { art: "book", label: "Book", fits: false, reaction: "Books don't splash. Usually." },
      { art: "char:dog:happy", label: "Dog", fits: false, reaction: "Not Dog this time. Listen again!" },
      { art: "tap", label: "Tap", fits: true, reaction: "Water from the tap! Splishy." },
    ],
  },
  {
    id: "cups",
    type: "choice",
    sound: "sfx-cups-clink",
    prompt: "One more! Listen…",
    options: [
      { art: "leaf", label: "Leaf", fits: false, reaction: "Leaves are quieter than that. Listen again!" },
      { art: "cup", label: "Cups", fits: true, reaction: "Clink! The cups!" },
      { art: "bell", label: "Bell", fits: false, reaction: "Close! But not the bell." },
    ],
  },
  {
    id: "reflect",
    type: "reflection",
    speaker: "milo",
    questions: ["Close your eyes and listen. What sounds can you hear right now?"],
    parentNote: "Play it at home: one of you makes a sound behind your back (keys, a cup, a clap), the other guesses.",
  },
  { id: "celebrate", type: "celebration", celebration: "clap" },
];
