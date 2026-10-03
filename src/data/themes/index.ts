import type { ThemeDefinition } from "@/types/theme";

/**
 * Core Learning themes (the vertical strips).
 * Pure data: add, remove, rename, reorder or hide without touching UI.
 * `color` / `ink` are CSS colours; `doodle` is a key in scrapbook/Doodle.
 */
const THEMES: ThemeDefinition[] = [
  {
    id: "explore",
    label: "Explore",
    line: "What's that? Let's find out.",
    color: "#a9b89a",
    ink: "#45482b",
    doodle: "explore",
    order: 1,
    activityIds: ["shadow-mystery", "mmm-hunt"],
  },
  {
    id: "think",
    label: "Think",
    line: "Hmm. Wait. I think I've got it.",
    color: "#b4a8cd",
    ink: "#3e3656",
    doodle: "think",
    order: 2,
    activityIds: ["squirrel-mystery-bag", "snail-pattern-path"],
  },
  {
    id: "numbers",
    label: "Numbers",
    line: "One, two… how many was that?",
    color: "#d8b45e",
    ink: "#4a3d18",
    doodle: "numbers",
    order: 3,
    activityIds: ["how-many-cups"],
  },
  {
    id: "stories",
    label: "Stories & Words",
    line: "Old Cat is awake. Mostly.",
    color: "#df917a",
    ink: "#4f271c",
    doodle: "stories",
    order: 4,
    activityIds: ["sleepy-cat-story", "mmm-hunt"],
  },
  {
    id: "make",
    label: "Make",
    line: "Paper, folding, building.",
    color: "#9fc2d6",
    ink: "#23414f",
    doodle: "make",
    order: 5,
    activityIds: ["paper-boat"],
  },
  {
    id: "draw",
    label: "Draw",
    line: "Grab a finger. That's your crayon.",
    color: "#d8a5aa",
    ink: "#4f2a2e",
    doodle: "draw",
    order: 6,
    activityIds: ["draw-a-lamp", "dog-zoomy-lines"],
  },
  {
    id: "move",
    label: "Move",
    line: "Dog has entirely too much energy.",
    color: "#92b97e",
    ink: "#26401b",
    doodle: "move",
    order: 7,
    activityIds: ["dog-says-freeze"],
  },
  {
    id: "helpers",
    label: "Little Helpers",
    line: "Small jobs. Big help.",
    color: "#edba92",
    ink: "#4f3018",
    doodle: "helpers",
    order: 8,
    activityIds: ["sock-pairs"],
  },
];

export function listThemes(): ThemeDefinition[] {
  return THEMES.filter((t) => !t.hidden).sort((a, b) => a.order - b.order);
}

export function getTheme(id: string) {
  return THEMES.find((t) => t.id === id);
}
