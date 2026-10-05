# Milomi audio assets

Howler.js plays all effects and ambience through `src/lib/audio/soundManager.ts`.
The named API in `src/lib/audio/audioManager.ts` shares that same cache and mixer.
All 29 homepage dialogue variants use 28 recordings in `scenes/home/`.
See that folder's README for the complete dialogue-to-filename list.
Activity high-five dialogue is in `scenes/celebrations/`.
Play Book and World opening lines are in `scenes/playbook/` and `scenes/world/`
(mapped in `src/lib/audio/scenes/screens.ts`).
Shadow Mystery dialogue is in `scenes/shadow/` (mapped in `src/lib/audio/scenes/shadow.ts`).
Mappings and clip durations for the homepage live in `src/lib/audio/scenes/home.ts`.
Other unrecorded dialogue uses browser speech synthesis.

The `scenes/` folders include the supplied dialogue recordings. Other folders are
ready for recordings; procedural WAV sounds remain enabled for effects/ambience.

| Folder | Suggested recordings | Named library group |
| --- | --- | --- |
| `milo/` | `mrrp`, `coo-curious`, `coo-happy`, `surprised`, `high-five` | `SOUNDS.milo` |
| `interactions/` | `paper-open`, `tap`, `soft-clap`, `soft-thump` | `SOUNDS.interaction` |
| `environment/` | `living-room`, `garden`, `city-window` | `SOUNDS.environment` |
| `activities/` | `sock-pull`, `crayon` | `SOUNDS.activities` |

For an additional sound recording, add `src: ["/audio/milo/mrrp.webm", "/audio/milo/mrrp.mp3"]`
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
