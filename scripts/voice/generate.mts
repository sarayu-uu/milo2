/**
 * npm run voice:generate [-- options]
 *
 * Voices every entry in scripts/voice/todo.json with ElevenLabs, saves it to
 * public/audio/scenes/<folder>/<file>.mp3, measures it and records it in
 * src/lib/audio/scenes/generated.json, which the app reads. That's the
 * wiring: no other code changes are needed.
 *
 * An mp3 that's already in place (e.g. one you recorded by hand with the
 * proposed name) is wired without calling ElevenLabs.
 *
 * Options:
 *   --dry-run        show what would be sent; no API calls, nothing written
 *   --only <text>    only entries whose id, folder or line contains <text>
 *   --limit <n>      stop after n entries
 *   --force          re-voice even if the mp3 already exists
 *   --redo <text>    re-voice a clip made earlier; add --tags "[excited]" to change the delivery
 *   --remeasure      after replacing an mp3 by hand: refresh stored lengths (no API)
 *
 * Needs ELEVENLABS_API_KEY in .env.local.
 */
import fs from "node:fs";
import path from "node:path";
import { AUDIO_DIR, CONFIG, GENERATED, TODO, mp3DurationMs, normalize, readJson, writeJson, type GeneratedClip, type TodoItem, type VoiceConfig } from "./lib.mts";

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const opt = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const dryRun = flag("dry-run");
const force = flag("force") || args.includes("--redo");
const only = opt("only")?.toLowerCase();
const limit = Number(opt("limit") ?? Infinity);

const cfg = readJson<VoiceConfig>(CONFIG, null as unknown as VoiceConfig);
const key = process.env.ELEVENLABS_API_KEY;
const API = "https://api.elevenlabs.io";

// --remeasure: a take was replaced by hand; refresh every clip's length from disk (no API)
if (flag("remeasure")) {
  const clips = readJson<GeneratedClip[]>(GENERATED, []);
  let changed = 0;
  for (const c of clips) {
    const file = path.join(AUDIO_DIR, c.folder, c.file);
    if (!fs.existsSync(file)) {
      console.warn(`missing: ${c.folder}/${c.file}`);
      continue;
    }
    const ms = mp3DurationMs(fs.readFileSync(file));
    if (ms !== c.durationMs) {
      console.log(`${c.folder}/${c.file}: ${c.durationMs} → ${ms} ms`);
      c.durationMs = ms;
      changed++;
    }
  }
  writeJson(GENERATED, clips);
  console.log(`${changed} clip length(s) updated.`);
  process.exit(0);
}

const todo = readJson<TodoItem[]>(TODO, []);
// --redo <text> [--tags "[excited]"]: re-voice clips the pipeline already made
const redo = opt("redo")?.toLowerCase();
const redoQueue: TodoItem[] = redo
  ? readJson<GeneratedClip[]>(GENERATED, [])
      .filter((g) => [g.id, g.file, ...g.lines].some((s) => s.toLowerCase().includes(redo)))
      .map((g) => ({ id: g.id, speaker: g.speaker, folder: g.folder, file: g.file.replace(/\.mp3$/, ""), text: g.lines[0], tags: opt("tags") ?? "", sources: [] }))
  : [];
const queue = (redo ? redoQueue : todo)
  .filter((t) => !t.skip)
  .filter((t) => !only || [t.id, t.folder, t.text].some((s) => s.toLowerCase().includes(only)))
  .slice(0, limit);

if (!queue.length) {
  console.log("Nothing to voice. Run `npm run voice:scan` first (or check --only).");
  process.exit(0);
}

const fileFor = (t: TodoItem) => path.join(AUDIO_DIR, t.folder, `${t.file}.mp3`);
const prompt = (t: TodoItem) => `${t.tags} ${t.text}`.trim();
const needsApi = queue.some((t) => force || !fs.existsSync(fileFor(t)));

if (dryRun) {
  for (const t of queue) console.log(`${fs.existsSync(fileFor(t)) && !force ? "wire " : "voice"}  ${t.speaker.padEnd(8)} ${t.folder}/${t.file}.mp3  ←  ${prompt(t)}`);
  console.log(`\n${queue.length} entr${queue.length === 1 ? "y" : "ies"}. Nothing sent or written (dry run).`);
  process.exit(0);
}
if (needsApi && !key) {
  console.error("Missing ELEVENLABS_API_KEY. Add it to .env.local (never commit it), then run again.");
  process.exit(1);
}

/** Look up (once) and remember each character's ElevenLabs voice id. */
async function voiceId(who: string): Promise<string> {
  const v = cfg.voices[who];
  if (!v) throw new Error(`No voice configured for "${who}" in scripts/voice/config.json`);
  if (v.voiceId) return v.voiceId;
  const res = await fetch(`${API}/v2/voices?search=${encodeURIComponent(v.search)}&page_size=20`, { headers: { "xi-api-key": key! } });
  if (!res.ok) throw new Error(`Voice search failed (${res.status}): ${await res.text()}`);
  const { voices } = (await res.json()) as { voices: { voice_id: string; name: string }[] };
  if (voices.length !== 1) {
    const list = voices.map((x) => `  ${x.voice_id}  ${x.name}`).join("\n") || "  (none: add the voice to My Voices in ElevenLabs first)";
    throw new Error(`Voice search "${v.search}" for ${who} found ${voices.length} voices. Put the right voiceId in config.json:\n${list}`);
  }
  v.voiceId = voices[0].voice_id;
  writeJson(CONFIG, cfg);
  console.log(`Using voice "${voices[0].name}" (${v.voiceId}) for ${who}.`);
  return v.voiceId;
}

async function tts(t: TodoItem): Promise<Buffer> {
  const id = await voiceId(t.speaker);
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}/v1/text-to-speech/${id}?output_format=${cfg.outputFormat}`, {
      method: "POST",
      headers: { "xi-api-key": key!, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text: prompt(t), model_id: cfg.model, voice_settings: cfg.voiceSettings }),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    const retry = res.status === 429 || res.status >= 500;
    if (!retry || attempt >= 4) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
    await new Promise((r) => setTimeout(r, 1500 * attempt));
  }
}

const generated = readJson<GeneratedClip[]>(GENERATED, []);
const done = new Set<string>();
let voiced = 0;
let wired = 0;

for (const t of queue) {
  const out = fileFor(t);
  try {
    let buf: Buffer;
    if (fs.existsSync(out) && !force) {
      buf = fs.readFileSync(out);
      wired++;
    } else {
      buf = await tts(t);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, buf);
      voiced++;
    }
    const clip: GeneratedClip = { id: t.id, speaker: t.speaker, folder: t.folder, file: `${t.file}.mp3`, lines: [t.text], durationMs: mp3DurationMs(buf) };
    const i = generated.findIndex((g) => g.id === clip.id);
    if (i >= 0) generated[i] = clip;
    else generated.push(clip);
    writeJson(GENERATED, generated); // save as we go, so a failure keeps earlier work
    done.add(`${t.speaker}|${normalize(t.text)}`);
    console.log(`✓ ${t.folder}/${t.file}.mp3  (${clip.durationMs} ms)  ${prompt(t)}`);
  } catch (e) {
    console.error(`✗ ${t.folder}/${t.file}.mp3  ${(e as Error).message}`);
    if (/voice/i.test((e as Error).message) && /search|configured/.test((e as Error).message)) break;
  }
}

writeJson(TODO, todo.filter((t) => !done.has(`${t.speaker}|${normalize(t.text)}`)));
console.log(`\nVoiced ${voiced}, wired ${wired} existing file(s). ${todo.length - done.size} left in todo.json.`);
