import type { ActivityStep } from "@/types/activity";

/**
 * A detective story. Each clue: tap EVERY suspect to hear what the clue says
 * about them (ruled out = a cross, still a suspect = "?"). Snail goes (no
 * feet), then Cat (asleep). Then Squirrel turns up, and the tiny tracks rule
 * out Dog.
 */
export const steps: ActivityStep[] = [
  {
    id: "gone",
    type: "story",
    backdrop: "kitchen",
    cast: [{ id: "milo", x: 28, size: 52, expression: "happy" }],
    props: [
      { id: "plate", art: "plate", x: 62, y: 66, size: 14 },
      { id: "biscuit", art: "biscuit", x: 62, y: 70, size: 7 },
      { id: "crumbs", art: "crumbs", x: 62, y: 66, size: 10, hidden: true },
      { id: "prints", art: "footprints", x: 82, y: 84, size: 14, hidden: true, rotate: -10 },
    ],
    beats: [
      { speaker: "milo", text: "My biscuit. I saved it all morning. Now it's time.", actors: { milo: { action: "lookRight" } } },
      { speaker: "milo", text: "I'll just get a napkin…", actors: { milo: { action: "walk", x: 12 } } },
      { speaker: "milo", text: "It's GONE! Only crumbs!", hide: ["biscuit"], show: ["crumbs"], pause: 900, actors: { milo: { expression: "surprised", action: "idle", x: 28 } } },
      { speaker: "milo", text: "Wait. Footprints! Little ones. We have a mystery.", show: ["prints"], actors: { milo: { expression: "suspicious", action: "headTilt" } } },
    ],
  },
  {
    id: "clue-feet",
    type: "choice",
    speaker: "milo",
    tapAll: true,
    prompt: "Clue one: these are FOOTprints. Tap each friend. Do they have feet?",
    focus: { art: "footprints", label: "the tracks" },
    options: [
      { art: "char:snail", label: "Snail", fits: false, reaction: "Snail has no feet at all. Just a slimy trail. It wasn't Snail!" },
      { art: "char:dog", label: "Dog", fits: true, reaction: "Dog has four feet. Hmm. He could have made them." },
      { art: "char:cat", label: "Cat", fits: true, reaction: "Cat has four feet too. She could have made them." },
    ],
  },
  {
    id: "asleep",
    type: "story",
    backdrop: "kitchen",
    cast: [
      { id: "milo", x: 28, size: 52, expression: "thinking" },
      { id: "cat", x: 74, size: 34, flip: true, action: "sleep" },
    ],
    beats: [
      { speaker: "milo", text: "Clue two. Cat has been asleep on the mat ALL morning. I checked. Twice.", actors: { milo: { action: "headTilt" } } },
    ],
  },
  {
    id: "clue-awake",
    type: "choice",
    speaker: "milo",
    tapAll: true,
    prompt: "Who was awake? Tap each one.",
    options: [
      { art: "char:cat", label: "Cat", fits: false, reaction: "Cat was asleep. You can't take a biscuit while you're snoring. It wasn't Cat!" },
      { art: "char:dog", label: "Dog", fits: true, reaction: "Dog was awake. Running around. Still a suspect!" },
    ],
  },
  {
    id: "tail",
    type: "story",
    backdrop: "kitchen",
    cast: [
      { id: "milo", x: 28, size: 52, expression: "suspicious" },
      { id: "squirrel", x: 86, size: 40, flip: true, hidden: true },
    ],
    beats: [
      { speaker: "milo", text: "So it was Dog. Case clo…", actors: { milo: { action: "idle", expression: "proud" } } },
      { speaker: "milo", text: "Wait. Was that a TAIL by the window?", sfx: "paper-rustle", actors: { squirrel: { hidden: false, action: "peek" }, milo: { expression: "surprised", action: "lookRight" } } },
      { speaker: "milo", text: "A new suspect! Clue three: look how TINY these footprints are.", actors: { squirrel: { hidden: true }, milo: { expression: "suspicious", action: "headTilt" } } },
    ],
  },
  {
    id: "clue-size",
    type: "choice",
    speaker: "milo",
    tapAll: true,
    prompt: "Tiny tracks. Tap each one. Are their feet tiny?",
    focus: { art: "footprints", label: "tiny tracks" },
    options: [
      { art: "char:dog", label: "Dog", fits: false, reaction: "Dog's paws are big and floppy. Too big! It wasn't Dog." },
      { art: "char:squirrel", label: "Squirrel", fits: true, reaction: "Squirrel's feet are tiny. Very tiny. Just like the tracks…" },
    ],
  },
  {
    id: "caught",
    type: "story",
    backdrop: "kitchen",
    cast: [
      { id: "milo", x: 28, size: 52, expression: "suspicious" },
      { id: "squirrel", x: 70, size: 44, flip: true, hidden: true },
    ],
    props: [
      // crumbs on her cheek, then the half she "saved"
      { id: "face-crumbs", art: "crumbs", x: 70.5, y: 67.5, size: 7, hidden: true, front: true },
      { id: "half", art: "biscuit-half", x: 69.5, y: 75, size: 6.5, hidden: true, front: true },
    ],
    beats: [
      { speaker: "milo", text: "No feet, not Snail. Asleep, not Cat. Big paws, not Dog.", actors: { milo: { action: "headTilt" } } },
      { speaker: "milo", text: "Squirrel? Come out, please.", actors: { milo: { action: "lookRight" } } },
      {
        speaker: "squirrel",
        text: "Who, me? I've been here the whole time. Not eating anything.",
        show: ["face-crumbs"],
        actors: { squirrel: { hidden: false, action: "hop", expression: "happy" } },
      },
      { speaker: "milo", text: "You have crumbs on your face.", pause: 900, actors: { milo: { action: "idle" }, squirrel: { action: "idle", expression: "surprised" } } },
      { speaker: "squirrel", text: "…I saved you half?", show: ["half"], sfx: "pop", actors: { squirrel: { expression: "confused", action: "headTilt" } } },
      { speaker: "milo", text: "Half a biscuit is still a biscuit. Thank you.", actors: { milo: { expression: "happy", action: "idle" } } },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "wingsUp" },
];
