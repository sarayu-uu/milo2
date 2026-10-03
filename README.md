# Milomi

A calm, funny, scrapbook-storybook play app for children aged 3–5 and the grown-ups beside them. Milo — a round, slightly ridiculous pigeon — notices things, gets them wrong, and figures them out *with* the child.

This repository is the research MVP. It is built to test the interaction model, not to ship lots of content.

```bash
npm install
cp .env.example .env.local   # optional: add a PostHog key
npm run dev                  # http://localhost:3000  (landscape only)
npm run build && npm start   # production
npm run typecheck
```

`/dev/characters` is an internal workbench for every character's expressions and actions. It is not linked from the app.

---

## What's in the MVP

| Area | What exists |
| --- | --- |
| **Home** | A scrapbook spread: Milo at his window ("Something interesting is happening today…"), two clear doors, **Milo's World** and **Play Book** (Core Learning). Grown-up controls sit quietly in the top-right corner. |
| **Milo's World** | A house map, then rooms. The Living Room is open at the start. The Kitchen, Garden and Washroom open as the child plays. The next room is always a taped-over "?" doorway, and the tape peels off once when the room opens. Objects appear over time (a bookshelf, a plant, a funny lamp, the child's own drawing taped to the wall, a paper plane). A different small surprise sits on the window sill each day. When something is new, Milo notices it ("Wait… was that there yesterday?"). Objects can open activities that belong to them. |
| **Play Book (Core Learning)** | Coloured vertical strips (Explore, Think, Numbers, Stories & Words, Make, Draw, Move, Little Helpers) scroll sideways. Tapping a strip makes it grow sideways (a ~400 ms spring with no bounce) to show its activity cards. Each card shows the time, how much a parent is involved, and what materials are needed. |
| **Activities** | 11 activities run on one generic engine. There are two flagship activities, **Shadow Mystery** and **Squirrel's Mystery Bag**, plus small ones that exercise every step type: counting, patterns, initial sounds, matching, free drawing, tracing, origami, a movement game, story prediction, and helping at home. |
| **Characters** | Milo is a layered, rigged SVG. Snail, Squirrel, Sleepy Old Cat and Fast Dog use the same state API. |
| **Celebrations** | Thumbs-up made of feathers (four fold in, one stays up), a two-wing clap synced to sound, an **interactive High Five**, wings up, a happy waddle, and a belly puff. |
| **Parent area** | A hold-for-3-seconds gate, broad age, sound mix, reduced motion, text size, progress insights, research tools, a privacy note, and a 7-question feedback survey. |
| **Sound** | A Howler.js manager with categories, global/ambient/effects mute, and per-room ambience. Every sound is synthesised in the browser, so no audio files ship and there are no licensing questions. |
| **Analytics** | A PostHog abstraction with typed events. It is anonymous: no person profiles and no IP address. |

---

## Architecture

```
src/
  app/                    Next.js App Router routes (thin: they only mount feature components)
    page.tsx              Home
    world/                Milo's World (+ /world/[roomId])
    learn/                Core Learning / Play Book
    activity/[id]/        Activity intro → engine → ending
    parent/               Gate + dashboard + survey
    api/feedback/         Survey intake (kept separate from analytics)
  components/
    characters/           Milo (rigged SVG), Snail, Squirrel, Cat, Dog, Character registry, Celebration/HighFive
    activities/           CoreLearning, ThemeStrip, ActivityCard, ActivityScreen/Intro/Flow/End
      steps/              One component per step type + StepRenderer + Backdrop
      interactive/        Bespoke interactives (shadow follow/discovery, shape detective/sort)
    world/                MilosWorld, Room, RoomObject, RoomShell, roomArt, SceneStage
    scrapbook/            Paper, Tape, Label, Sticker, PaperButton, NextArrow, SpeechBubble, Doodle
    art/                  Object illustration kit (custom SVG, referenced by key)
    parent/               ParentGate, ParentDashboard, FeedbackSurvey
    ui/                   AppShell, LandscapeGuard, TopBar
  features/
    activities/           Activity runtime context, labels, analytics props
    characters/           Pose data: expression layer + action layer
    curriculum/           Age band resolution + AgeVariant picking
    progression/          World growth, reveal rules, room status
    feedback/             Survey definition + submit
  data/
    activities/<id>/      meta.ts (small, bundled) + steps.ts (code-split)
    themes/               Core Learning strips
    worlds/               Rooms + objects + reveal rules
    characters/           Character definitions (personality, voice)
  lib/
    analytics/            analytics.track(), typed events, PostHog/console providers
    audio/                Howler sound manager, procedural synth, registry + licences, voice
    animation/rig.ts      The SVG rig behind every character
    storage/              Persistence adapter (localStorage today, Supabase later)
  stores/                 Zustand: settings, progress (persisted), session
  styles/                 tokens.css, scrapbook.css, globals.css (Tailwind v4 @theme)
```

### Principles in the code

- **Content is data.** UI pages never hard-code activities, rooms or themes.
- **Activities are a list of typed steps.** The four flow shapes in the brief are simply different orders of steps:
  - A: story → digital → celebration
  - B: story → discovery → optional real-world → reflection → celebration
  - C: prompt → make/draw → show → celebration
  - D: story → parent + child → return → celebration
- **Age adapts internally.** Any text, count, sequence or option list can be an `AgeVariant` (`{ younger, older }`). The band comes from the broad age plus how much the child has played (`features/curriculum/age.ts`). Children never see a level.
- **Progression is quiet.** There are no points, coins or streaks. A hidden growth score (`features/progression/growth.ts`) opens rooms and reveals objects. Growth comes from finishing distinct activities, returning on different days, and wandering the house.

---

## How to extend

### Add an activity

1. Create `src/data/activities/<id>/meta.ts` (an `ActivityMeta`) and `steps.ts` (an `ActivityStep[]`).
2. Register it in `src/data/activities/index.ts`: add it to `CATALOG` and `LOADERS`.
3. Reference the id from a theme in `data/themes`, from a room object's `interaction.activityId`, or both.

These step types are available with no new code:

| Step type | What it does |
| --- | --- |
| `story` | Backdrop + cast + props, advanced beat by beat. Each beat can set expressions, actions, position, props, a sound, and a comedic pause. |
| `count` | Tap each object to count it, then answer "how many?" |
| `pattern` | "What comes next?" |
| `choice` | Choose an answer when several can be right. `findCount`, reactions, and `sayAloud` support literacy. |
| `match` | Tap two that are the same. |
| `draw` | `free` drawing, or `trace` over a guide. Can be kept for the world (`keepFor`). |
| `instructions` | Origami, crafts, hand shadows or building, shown as cards with a "you need" list and a parent tip. |
| `movement` | Character-led moves and FREEZE moments. No timers. |
| `parent-child` | Big prompts for the child. "Your job" and "Try asking" for the grown-up. |
| `extension-offer` | Optional and skippable. Accepting adds its nested `steps` to the flow. |
| `reflection` | Talk-about-it questions with a parent note. |
| `celebration` | `thumbsUp`, `clap`, `highFive`, `wingsUp`, `waddle` or `bellyPuff`. |
| `interactive` | A bespoke component registered in `steps/StepRenderer.tsx` and loaded lazily. |

### Add a Core Learning theme

Add an entry to `src/data/themes/index.ts` with an id, label, line, colour, ink, doodle, order and activityIds. Themes can be reordered, renamed, or hidden with `hidden: true`.

### Add a room or world object

Append a `RoomDefinition` to `src/data/worlds/rooms.ts` and give it a `stage` and a `reveal` rule. Its shell (wall and floor) is drawn from its palette. Objects use art keys from `components/world/roomArt.tsx` or from the general object kit in `components/art/objects.tsx`. Reveal rules can combine `minGrowth`, `minDays`, `afterActivity` and `needsDrawing`.

### Add a character

1. Add the id to `CharacterId` and to `data/characters`.
2. Draw it with `useCritterRig` (`components/characters/critterKit.tsx`).
3. Register it in `components/characters/Character.tsx`.

Poses are data (`features/characters/*Poses.ts`). A Rive-backed character can replace an entry in the registry without changing any caller.

### Add or replace a sound

Sounds live in `src/lib/audio/registry.ts`. To use a recorded file instead of the procedural recipe:

1. Put the file in `/public/audio`.
2. Set `src: ["/audio/x.webm", "/audio/x.mp3"]` on the sound's entry.
3. Fill in its `license` (source, author, licence, URL, attribution).

Only use clearly open-licensed audio (Pixabay, Freesound CC0/CC-BY, OpenGameArt). Sounds that require attribution appear in `attributionList()`.

### Move persistence to Supabase

All persisted stores go through `lib/storage/persist.ts`. To switch:

1. Implement a `StorageAdapter` (async `getItem`/`setItem`/`removeItem`) backed by a Supabase table.
2. Call `setStorageAdapter()` once at boot.

No UI component touches storage directly.

---

## Analytics (research, not advertising)

### Connecting PostHog (5 minutes)

1. Sign up at https://eu.posthog.com (EU region; works from anywhere, incl. India). Create a project.
2. Copy the **Project API key** (starts with `phc_`) from Project settings.
3. Create `.env.local` in the project root:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
   ```
   (For a US project use `https://us.i.posthog.com`.)
4. Restart `npm run dev`. Open Parents → Privacy: it should say **Research analytics: connected**. Events appear in PostHog → Activity within a minute.

You do **not** need `npx @posthog/wizard`: the SDK is already installed and wired. (The wizard leaves a `.posthog/` scratch folder; it is git-ignored and safe to delete.) Without a key, events are only printed to the browser console.

All events go through `analytics.track(name, props)` in `src/lib/analytics/`, and are typed in `events.ts`. If `NEXT_PUBLIC_POSTHOG_KEY` is not set, events are logged to the console in development.

**PostHog is configured to:**

- capture no autocapture events, pageviews, session recordings or surveys
- use `person_profiles: "never"` and `ip: false`
- strip referrers and remove query strings from URLs

**Never collected:** names, voice, photos, drawings, free text from children, or precise location.

| Question | Events |
| --- | --- |
| Opens and sessions | `app_opened`, `session_ended` (duration, screens) |
| World use | `world_opened`, `room_opened` (visit count, first visit), `room_teaser_tapped`, `room_revealed`, `world_object_tapped`, `world_change_noticed` |
| Core Learning | `core_learning_opened`, `theme_viewed`, `theme_expanded`, `theme_collapsed` |
| Activities | `activity_viewed`, `activity_started`, `activity_step_completed`, `activity_exited` (step + reason, sent as a beacon), `activity_completed`, `activity_end_choice`, `answer_given` (fit/attempt only) |
| Extensions | `real_world_extension_offered`, `real_world_extension_started`, `real_world_extension_skipped` |
| Delight | `celebration_triggered`, `high_five_completed` (reaction time) |
| Parent area | `parent_gate_opened`, `parent_gate_passed`, `parent_gate_cancelled`, `setting_changed`, `survey_opened`, `survey_started`, `survey_submitted` |

Activity events carry `activityId`, `activityType`, `flow`, `parentParticipation`, the internal `band`, and where relevant `step`, `stepId`, `stepType`, `isRealWorldExtension` and `durationSec`.

**Survey answers are kept separate from behavioural analytics.** They go to `POST /api/feedback`, which forwards them to the first destination that is configured:

1. `FEEDBACK_WEBHOOK_URL`, if set
2. otherwise PostHog, as an unlinked `feedback_response` event under a one-off random id
3. otherwise the server log

---

## Design system

- **Look:** cut-paper shapes + crayon grain + pencil outlines. Characters use per-colour crayon paints (`lib/animation/texture.tsx`, `CrayonPalette`); world art uses shared paints via `cx("#hex")` defined once by `<WorldCrayonDefs/>`. Textures are rasterised once, so animation stays cheap.
- **Type:** Fredoka (`font-display`) for child-facing text, Andika for body/parent text, Patrick Hand (`font-hand`) ONLY for annotations, labels and jokes.
- **Home:** the living room is the canvas (no menu cards). Micro-story "The Missing Thing": Milo is head-under-the-sofa and pops out now and then. Navigation is a taped house sketch (Milo's World) and a notebook with coloured dividers (Play Book).
- **Milo's World:** a cut-away doll's house (`HouseBackdrop`); each open room is a live miniature of the real room, taped-over rooms are next, lights-off rooms are later.

- **Tokens:** colours are in `styles/globals.css` (`@theme`). Spacing, touch sizes, type scale, motion timing, layer depth and paper textures are in `styles/tokens.css`.
- **Materials** (`styles/scrapbook.css`): `.paper`, `.construction`, `.notebook`, `.torn-*`, `.tape`, `.stamp`, `.crayon`, plus small ambient wiggles. Textures are tiny inline SVG noise; there are no large raster images.
- **Layout:** landscape only. The root font size scales by whichever of width or height is tighter, using a 1280×720 baseline. Custom variants `short`, `tiny`, `compact` and `roomy` respond to width *and* height. Scenes use a 16:9 `SceneStage` so positions hold from phones to desktops. In portrait, a CSS-only blocker shows Milo lying sideways.
- **Accessibility:** touch targets are at least 48 px, nothing depends on hover, and reduced motion is honoured (system setting, in-app toggle, and the rig skips loops). The parent area offers bigger text and individual sound controls. Spoken lines read everything aloud for pre-readers.

## Known gaps / next steps

- **Voice:** voice uses the device's speech synthesis (it prefers en-IN) as a placeholder. Swap `lib/audio/voice.ts` for recorded VO.
- **Animation libraries:** `lottie-react` and Rive are not installed. The SVG rig covers the MVP, and the character registry is the seam where they would go.
- **Content:** add more activities only after the research questions show which shapes work.
- **Data:** the parent age is optional and defaults to the gentler band. Consider a gentle first-run prompt for grown-ups.
