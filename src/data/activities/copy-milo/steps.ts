import type { ActivityStep } from "@/types/activity";

/** Milo leads simple moves; the child copies. Hands-free once it starts. */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "pavement",
    cast: [{ id: "milo", x: 40, size: 52, expression: "proud" }],
    beats: [
      { speaker: "milo", text: "I'm doing exercise! Very serious exercise.", actors: { milo: { expression: "proud", action: "bellyPuff" } } },
      { speaker: "milo", text: "Can you copy me? Do what I do!", actors: { milo: { expression: "happy", action: "wingsUp" } } },
    ],
  },
  {
    id: "moves",
    type: "movement",
    leader: "milo",
    intro: "Stand up! Copy what I do.",
    moves: [
      { text: "Raise your arms, like wings!", action: "wingsUp", art: "feather" },
      { text: "Touch your head!", action: "headTilt" },
      { text: "Clap, clap, clap!", action: "clap" },
      { text: "Reach up high!", action: "reach", art: "star" },
      { text: "Bend down low!", action: "peek" },
      { text: "Stomp your feet!", action: "waddle", art: "footprints" },
      { text: "Jump!", action: "hop" },
      { text: "Now stand still… FREEZE!", art: "snowflake" },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "wingsUp" },
];
