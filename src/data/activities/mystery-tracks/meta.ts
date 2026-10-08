import type { ActivityMeta } from "@/types/activity";

export const meta: ActivityMeta = {
  id: "mystery-tracks",
  title: "Mystery Tracks",
  tagline: "Milo's biscuit is gone. There are footprints.",
  parentSummary:
    "Thinking like a detective: using clues (footprint size, who was where) to rule people out and reach an answer, then explaining how you know.",
  ageMin: 5,
  ageMax: 6,
  domains: ["reasoning", "observation", "problem-solving"],
  skills: ["evidence", "inference", "ruling-out", "explaining-reasons"],
  difficulty: 2,
  duration: 5,
  environments: ["digital"],
  materials: [],
  parentParticipation: "nearby",
  character: "milo",
  activityType: "story",
  flow: "A",
  thumbnail: "footprints",
  reflectionQuestions: ["How did you know it was Squirrel?", "Which clue helped most?"],
  celebrationType: "wingsUp",
  soundscape: "kitchen",
  unlockRequirements: null,
};
