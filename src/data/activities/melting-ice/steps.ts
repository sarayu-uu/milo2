import type { ActivityStep } from "@/types/activity";

/** Age 3: touch the ice, put it in the sun, watch it turn to water. */
export const steps: ActivityStep[] = [
  {
    id: "story",
    type: "story",
    backdrop: "kitchen",
    cast: [{ id: "milo", x: 30, size: 52, expression: "curious" }],
    props: [{ id: "ice", art: "ice", x: 56, y: 58, size: 10 }],
    beats: [
      { speaker: "milo", text: "Ooh. What's this?", actors: { milo: { expression: "curious", action: "investigate" } } },
      { speaker: "milo", text: "COLD!", actors: { milo: { expression: "surprised", action: "stumble" } } },
      { speaker: "milo", text: "Tiny cold rock.", actors: { milo: { expression: "thinking", action: "headTilt" } } },
    ],
  },
  {
    id: "melt",
    type: "melt",
    backdrop: "kitchen",
    prompt: "Touch it! Or drag it into the sun.",
    stages: [{ line: "It's smaller!" }, { line: "Smaller AGAIN." }, { line: "Where did my ice go?" }],
    line: "…Water?",
  },
  {
    id: "try-at-home",
    type: "extension-offer",
    title: "Melting Ice at home",
    prompt: "Want to watch real ice melt?",
    speaker: "milo",
    badge: "parent-child",
    meta: { minutes: 3, materials: ["an ice cube", "a plate"] },
    steps: [
      {
        id: "at-home",
        type: "parent-child",
        title: "Melting Ice at home",
        where: "indoor",
        yourJob: ["Put one ice cube on a plate.", "Let your child touch it now, and again in a few minutes.", "Put it somewhere sunny if you can."],
        tryAsking: ["How does it feel?", "Is it bigger or smaller now?", "Where is the water coming from?"],
        childPrompts: [
          "Touch the ice. Is it cold?",
          "Come back later. What changed?",
        ],
        materials: ["an ice cube", "a plate"],
        returnText: "Come back and tell Milo what happened!",
      },
    ],
  },
  { id: "celebrate", type: "celebration", celebration: "clap" },
];
