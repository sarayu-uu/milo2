import type { CharacterDefinition, CharacterId } from "@/types/character";

export const CHARACTERS: Record<CharacterId, CharacterDefinition> = {
  milo: {
    id: "milo",
    name: "Milo",
    personality:
      "A round, slightly ridiculous pigeon. Curious, not all-knowing. Notices things, misunderstands things, needs the child's help. Figures things out WITH the child.",
    bestFor: ["everything", "discovery", "humour"],
    voice: { pitch: 1.35, rate: 0.98 },
    colorToken: "--color-dusty-blue",
  },
  snail: {
    id: "snail",
    name: "Snail",
    personality: "Thoughtful, slow, observant, gentle. Loves patterns, remembers tiny details, forgets where they were going.",
    bestFor: ["memory", "patterns", "sequencing", "observation", "quiet activities", "emotional conversations"],
    voice: { pitch: 0.9, rate: 0.78 },
    colorToken: "--color-lavender",
  },
  squirrel: {
    id: "squirrel",
    name: "Squirrel",
    personality: "Energetic, collects everything, slightly chaotic; organises after making the mess. Loves building.",
    bestFor: ["sorting", "collecting", "building", "patterns", "fine motor", "making", "movement"],
    voice: { pitch: 1.6, rate: 1.12 },
    colorToken: "--color-peach",
  },
  cat: {
    id: "cat",
    name: "Old Cat",
    personality: "Older, calm, mildly grumpy, sleepy, surprisingly wise. Would rather not move. Sometimes doesn't fully wake up.",
    bestFor: ["stories", "emotions", "listening", "quiet observation", "reasoning", "winding down"],
    voice: { pitch: 0.75, rate: 0.82 },
    colorToken: "--color-warm-grey",
  },
  dog: {
    id: "dog",
    name: "Dog",
    personality: "Friendly, enthusiastic, fast, impatient. Acts before thinking, which causes situations.",
    bestFor: ["movement", "sequencing", "listening", "directions", "gross motor", "outdoor play"],
    voice: { pitch: 1.2, rate: 1.2 },
    colorToken: "--color-mustard",
  },
};
