/**
 * Voice recordings for the first lines on the Play Book and Milo's World screens.
 * Files live in public/audio/scenes/<folder>/. If you replace a clip with one of
 * a different length, update its durationMs (it keeps Milo's beak in sync).
 */
export const SCREEN_RECORDINGS = [
  {
    id: "vo-playbook-pick-a-colour",
    folder: "playbook",
    file: "pick-a-colour.mp3",
    lines: ["Pick a colour. Any colour!"],
    durationMs: 2273,
  },
  {
    id: "vo-world-still-a-secret",
    folder: "world",
    file: "still-a-secret.mp3",
    lines: ["This is my house. Most of it is… still a secret."],
    durationMs: 4989,
  },
  {
    id: "vo-world-where-shall-we-go",
    folder: "world",
    file: "where-shall-we-go.mp3",
    lines: ["Where shall we go?"],
    durationMs: 1959,
  },
  {
    id: "vo-world-a-whole-new-room",
    folder: "world",
    file: "a-whole-new-room.mp3",
    lines: ["The paper fell off! There's a whole new room!"],
    durationMs: 3553,
  },
] as const;

export type ScreenRecordingId = (typeof SCREEN_RECORDINGS)[number]["id"];
