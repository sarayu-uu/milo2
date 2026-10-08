import type { ActivityMeta } from "@/types/activity";

export const meta: ActivityMeta = {
  id: "what-would-you-do",
  title: "What Would You Do?",
  tagline: "Dog and Squirrel both want the same ball.",
  parentSummary:
    "Social problem solving: thinking of more than one fair way to fix a problem, and imagining how each choice makes someone feel. Several answers are good ones.",
  ageMin: 5,
  ageMax: 6,
  domains: ["social-emotional", "problem-solving", "communication", "stories"],
  skills: ["sharing", "turn-taking", "empathy", "decision-making"],
  difficulty: 1,
  duration: 5,
  environments: ["digital"],
  materials: [],
  parentParticipation: "nearby",
  character: "dog",
  activityType: "story",
  flow: "A",
  thumbnail: "heart",
  reflectionQuestions: ["Have you ever wanted the same toy as someone?", "What did you do?"],
  celebrationType: "highFive",
  soundscape: "garden",
  unlockRequirements: null,
};
