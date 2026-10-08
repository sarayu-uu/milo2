import type { ActivityMeta } from "@/types/activity";

export const meta: ActivityMeta = {
  id: "rhyme-time",
  title: "Rhyme Time",
  tagline: "Moon, spoon… Milo has gone rhyme-crazy.",
  parentSummary:
    "Listening for sounds inside words: rhymes (moon, spoon), first sounds (ball, book) and claps for each part of a word. These are key early reading skills, all done by ear.",
  ageMin: 5,
  ageMax: 6,
  domains: ["phonological-awareness", "early-literacy", "communication"],
  skills: ["rhyming", "initial-sounds", "syllables", "listening"],
  difficulty: 2,
  duration: 5,
  environments: ["digital", "indoor"],
  materials: [],
  parentParticipation: "nearby",
  character: "milo",
  activityType: "digital",
  flow: "A",
  thumbnail: "moon",
  reflectionQuestions: ["What rhymes with cat?", "How many claps in your name?"],
  celebrationType: "wingsUp",
  soundscape: "living-room",
  unlockRequirements: null,
};
