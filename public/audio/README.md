# Milomi audio assets

Howler.js plays all effects and ambience through `src/lib/audio/soundManager.ts`.
The named API in `src/lib/audio/audioManager.ts` shares that same cache and mixer.
Dialogue currently uses browser speech synthesis.

The folders below are ready for recordings. No MP3/WebM recordings are supplied;
working procedural WAV sounds remain enabled until real files are added.

| Folder | Suggested recordings | Named library group |
| --- | --- | --- |
| `milo/` | `mrrp`, `coo-curious`, `coo-happy`, `surprised`, `high-five` | `SOUNDS.milo` |
| `interactions/` | `paper-open`, `tap`, `soft-clap`, `soft-thump` | `SOUNDS.interaction` |
| `environment/` | `living-room`, `garden`, `city-window` | `SOUNDS.environment` |
| `activities/` | `sock-pull`, `crayon` | `SOUNDS.activities` |

For a recording, add `src: ["/audio/milo/mrrp.webm", "/audio/milo/mrrp.mp3"]`
to its definition in `src/lib/audio/registry.ts`. Include only files that exist,
and replace its procedural license metadata with the recording's source/license.
The named library uses registry IDs rather than hardcoded filenames, allowing
recordings to replace the generated audio without changing components.

```ts
import { playSound, SOUNDS, setCategoryVolume } from "@/lib/audio/audioManager";

void playSound(SOUNDS.milo.curious);
void playSound(SOUNDS.interaction.paperOpen, 0.35);
setCategoryVolume("ambience", 0.3);
```

Four independent mixer channels are available: `voice`, `sfx`, `ambience`, and
`activity`. The global mute and volume apply to every channel, including dialogue.
`sound.setSoundscape("living-room")` owns the current room loop and crossfades
between rooms; use it rather than repeatedly starting ambient one-shots.
Ambience fades down during dialogue/character clips and restores when all active
voices finish, fail, or are cancelled. Audio initialization and mobile unlock are
wired into the existing app shell; no extra start screen is required.
