# Play Book recordings

Milo's lines on the Play Book screen. The mappings and clip lengths are in
`src/lib/audio/scenes/screens.ts`.

| File | Line | Sound id |
| --- | --- | --- |
| `pick-a-colour.mp3` | "Pick a colour. Any colour!" | `vo-playbook-pick-a-colour` |

To add a line: put the mp3 in this folder and add an entry (id, folder, file,
lines, durationMs) to `SCREEN_RECORDINGS`. The line text must match what the
component says (punctuation and case don't matter).

## Recorded

| File | Line |
| --- | --- |
| `yellow-or-green` | Ooh, I like the yellow one. Or the green one. Or… |
