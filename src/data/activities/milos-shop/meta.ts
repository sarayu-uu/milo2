import type { ActivityMeta } from "@/types/activity";

export const meta: ActivityMeta = {
  id: "milos-shop",
  title: "Milo's Shop",
  tagline: "Squirrel wants oranges. Dog wants… also oranges.",
  parentSummary:
    "Counting out a set amount, then taking away and adding on with real objects: the start of subtraction and addition, without any written sums.",
  ageMin: 5,
  ageMax: 6,
  domains: ["numbers", "quantity", "early-mathematics"],
  skills: ["counting-out", "taking-away", "adding-on", "one-to-one-correspondence"],
  difficulty: 2,
  duration: 6,
  environments: ["digital", "indoor"],
  materials: ["5 small things to count (optional)"],
  parentParticipation: "optional",
  character: "squirrel",
  activityType: "hybrid",
  flow: "A",
  thumbnail: "orange",
  reflectionQuestions: ["How many did Squirrel end with?", "What if Dog took two?"],
  celebrationType: "clap",
  soundscape: "kitchen",
  unlockRequirements: null,
};
