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
    color: "#a3c486",
    ink: "#45482b",
    doodle: "explore",
    order: 1,
    activityIds: ["what-made-that-sound", "what-rolls", "float-or-plop", "puddle-mystery", "shadow-mystery"],
  },
  {
    id: "think",
    label: "Think",
    line: "Hmm. Wait. I think I've got it.",
    color: "#b7a3e0",
    ink: "#3e3656",
    doodle: "think",
    order: 2,
    activityIds: ["big-one-little-one", "melting-ice", "will-it-float", "magnet-mystery", "squirrel-mystery-bag", "snail-pattern-path", "keep-kevin-cold", "odd-one-out", "mystery-tracks"],
  },
  {
    id: "numbers",
    label: "Numbers",
    line: "One, two… how many was that?",
    color: "#f0c24f",
    ink: "#4a3d18",
    doodle: "numbers",
    order: 3,
    activityIds: ["feed-the-pigeon", "how-many-cups", "milos-shop"],
  },
  {
    id: "stories",
    label: "Stories & Words",
    line: "Old Cat is awake. Mostly.",
    color: "#f2896b",
    ink: "#4f271c",
    doodle: "stories",
    order: 4,
    activityIds: ["sleepy-cat-story", "mmm-hunt", "rhyme-time", "what-would-you-do"],
  },
  {
    id: "make",
    label: "Make",
    line: "Paper, folding, building.",
    color: "#8fcbeb",
    ink: "#23414f",
    doodle: "make",
    order: 5,
    activityIds: ["paper-boat"],
  },
  {
    id: "draw",
    label: "Draw",
    line: "Grab a finger. That's your crayon.",
    color: "#eea0aa",
    ink: "#4f2a2e",
    doodle: "draw",
    order: 6,
    activityIds: ["milo-rainy-window", "milo-plant-fence", "milo-road-home", "dog-zoomy-lines", "draw-a-lamp"],
  },
  {
    id: "move",
    label: "Move",
    line: "Dog has entirely too much energy.",
    color: "#8fcc6e",
    ink: "#26401b",
    doodle: "move",
    order: 7,
    activityIds: ["copy-milo", "dog-says-freeze"],
  },
  {
    id: "helpers",
    label: "Little Helpers",
    line: "Small jobs. Big help.",
    color: "#f8b98a",
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
