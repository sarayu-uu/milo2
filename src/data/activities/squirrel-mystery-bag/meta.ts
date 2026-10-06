import type { ActivityMeta } from "@/types/activity";

export const meta: ActivityMeta = {
  id: "squirrel-mystery-bag",
  title: "Squirrel's Mystery Bag",
  tagline: "What did Squirrel put in there?",
  parentSummary:
    "Shape reasoning with more than one right answer: a round shape could be a ball, an orange or a plate. Optional: a real touch-and-guess mystery bag.",
  ageMin: 3,
  ageMax: 6,
  domains: ["shapes", "classification", "reasoning", "communication", "sensory"],
  skills: ["shape-recognition", "flexible-reasoning", "prediction", "vocabulary", "tactile-exploration"],
  difficulty: 1,
  duration: 8,
  environments: ["digital", "indoor"],
  materials: [],
  parentParticipation: "optional",
  character: "squirrel",
  activityType: "hybrid",
  flow: "B",
  thumbnail: "bulging-bag",
  reflectionQuestions: ["Hard or soft?", "Round or pointy?", "What do you think it is?"],
  celebrationType: "clap",
  soundscape: "living-room",
  unlockRequirements: null,
  homeRoom: "living-room",
};
