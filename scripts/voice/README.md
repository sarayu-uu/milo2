# Voice pipeline

Voices new dialogue with ElevenLabs and wires it into the app automatically.

## One-time setup

1. In ElevenLabs, add the voice you use (Ziggy) to **My Voices**.
2. Put your API key in `.env.local` (never commit it):
   `ELEVENLABS_API_KEY=...`
3. `config.json` finds each character's voice by name on the first run and
   saves its id. If more than one voice matches, the run lists them; paste the
   right `voiceId` in. To voice Dog, Old Cat, Snail or Squirrel, fill in their
   `search` (a voice name) the same way.

## Every time you add or change dialogue

```sh
npm run voice:scan                  # what's missing → scripts/voice/todo.json
npm run voice:generate -- --dry-run # preview
npm run voice:generate              # voice, save, measure, wire
```

- **todo.json** lists every line without a recording, with a proposed folder,
  file name and audio tags. The tags are taken from Milo's expression in the
  code, e.g. `[curious]`, and "Shh…"/"Psst…" lines get `[whispers]`. Edit tags
  or names, or add `"skip": true`. Re-scanning keeps your edits.
- **generate** saves to `public/audio/scenes/<folder>/<file>.mp3` and adds the
  clip to `src/lib/audio/scenes/generated.json`, which the app reads. No other
  code changes are needed.
- Prefer to record a line yourself? Save it under the proposed name in the
  proposed folder and run `voice:generate`. It is wired without calling
  ElevenLabs.
- Replaced a take by hand (same file name)? Run
  `npm run voice:generate -- --remeasure` so its length stays in sync.
- Don't like a take? Re-voice it, optionally with different tags:
  `npm run voice:generate -- --redo wiggly --tags "[giggles]"`

Options: `--only <text>` (id, folder or line contains), `--limit <n>`,
`--force` (re-voice existing files), `--redo <text>` + `--tags "..."`,
`--dry-run`.

Settings (`config.json`): model `eleven_v3` (supports audio tags), stability
0 / 0.5 / 1 (lower = more expressive), mp3 at 44.1 kHz / 128 kbps.
