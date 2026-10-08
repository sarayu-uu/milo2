import type { ActivityMeta } from "@/types/activity";

export const meta: ActivityMeta = {
  id: "odd-one-out",
  title: "Which One Doesn't Belong?",
  tagline: "Squirrel sorted her things. One of them looks… suspicious.",
  parentSummary:
    "Classification and reasoning: spotting what's different and saying why. The last round has more than one right answer, so ask your child for their reason, not just their pick.",
  ageMin: 5,
  ageMax: 6,
  domains: ["classification", "reasoning", "communication"],
  skills: ["odd-one-out", "explaining-reasons", "flexible-reasoning"],
  difficulty: 2,
  duration: 5,
  environments: ["digital"],
  materials: [],
  parentParticipation: "nearby",
  character: "squirrel",
  activityType: "digital",
  flow: "A",
  thumbnail: "question",
  reflectionQuestions: ["Why doesn't it belong?", "Could another one be different too?"],
  celebrationType: "clap",
  soundscape: "living-room",
  unlockRequirements: null,
};
