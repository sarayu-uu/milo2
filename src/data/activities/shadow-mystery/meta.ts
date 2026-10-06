import type { ActivityMeta } from "@/types/activity";

export const meta: ActivityMeta = {
  id: "shadow-mystery",
  title: "Shadow Mystery",
  tagline: "Something keeps following Milo…",
  parentSummary:
    "Observation and cause-and-effect: what happens to a shadow when you move closer to the light? Ends with hand shadows and an optional shadow hunt together.",
  ageMin: 3,
  ageMax: 6,
  domains: ["observation", "reasoning", "movement", "environment"],
  skills: ["size-comparison", "cause-effect", "gross-motor", "fine-motor", "conversation"],
  difficulty: 1,
  duration: 8,
  environments: ["digital", "indoor", "outdoor"],
  materials: ["a lamp or torch (optional)"],
  materialsShort: "A lamp or torch helps",
  parentParticipation: "optional",
  character: "milo",
  activityType: "hybrid",
  flow: "B",
  thumbnail: "shadow-rabbit",
  reflectionQuestions: ["What changed?", "What did you move?", "Why do you think it became bigger?"],
  celebrationType: "highFive",
  soundscape: "quiet",
  unlockRequirements: null,
  homeRoom: "living-room",
};
