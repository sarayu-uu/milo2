# Milo's World recordings

Milo's lines on the Milo's World screen. The mappings and clip lengths are in
`src/lib/audio/scenes/screens.ts`.

| File | Line | Sound id |
| --- | --- | --- |
| `still-a-secret.mp3` | "This is my house. Most of it is… still a secret." | `vo-world-still-a-secret` |
| `where-shall-we-go.mp3` | "Where shall we go?" | `vo-world-where-shall-we-go` |
| `a-whole-new-room.mp3` | "The paper fell off! There's a whole new room!" | `vo-world-a-whole-new-room` |

To add a line: put the mp3 in this folder and add an entry (id, folder, file,
lines, durationMs) to `SCREEN_RECORDINGS`. The line text must match what the
component says (punctuation and case don't matter).
