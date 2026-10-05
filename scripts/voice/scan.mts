/**
 * npm run voice:scan
 *
 * Finds every line Milo says in the code that has no recording yet and writes
 * scripts/voice/todo.json: one entry per line with a proposed folder, file
 * name and ElevenLabs audio tags. Edit that file freely (tags, file, or
 * "skip": true); re-running the scan keeps your edits.
 */
import fs from "node:fs";
import path from "node:path";
import { AUDIO_DIR, CONFIG, TODO, voicedSpeakers, withDefaultTag, type VoiceConfig, folderFor, normalize, readJson, recordedLines, scanCode, slugFor, tagsFor, writeJson, type TodoItem } from "./lib.mts";
import { dynamicLines } from "./dynamic.mts";

const { lines, dynamic } = scanCode();
lines.push(...(await dynamicLines())); // lines put together while playing

const cfg = readJson<VoiceConfig>(CONFIG, { voices: {} } as unknown as VoiceConfig);
const voiced = voicedSpeakers(cfg);
const recorded = recordedLines();
const previous = new Map(readJson<TodoItem[]>(TODO, []).map((t) => [`${t.speaker}|${normalize(t.text)}`, t]));

const todo = new Map<string, TodoItem>();
const others = new Map<string, string>(); // characters with no voice set yet
const taken = new Set<string>(); // folder/file names already used

for (const l of lines) {
  if (!normalize(l.text)) continue;
  const key = `${l.speaker}|${normalize(l.text)}`;
  if (recorded.has(key)) continue;
  if (!voiced.has(l.speaker)) {
    others.set(key, `${l.speaker}: ${l.text}`);
    continue;
  }
  const hit = todo.get(key);
  if (hit) {
    hit.sources.push(l.source);
    continue;
  }
  const kept = previous.get(key);
  const folder = kept?.folder ?? folderFor(l.source);
  let file = kept?.file ?? (l.speaker === "milo" ? "" : `${l.speaker}-`) + slugFor(l.text);
  if (!kept) {
    const base = file;
    for (let n = 2; taken.has(`${folder}/${file}`) || fs.existsSync(path.join(AUDIO_DIR, folder, `${file}.mp3`)); n++) file = `${base}-${n}`;
  }
  taken.add(`${folder}/${file}`);
  todo.set(key, {
    speaker: l.speaker,
    id: `vo-auto-${folder.replace(/\//g, "-")}-${file}`,
    folder,
    file,
    text: l.text,
    tags: kept?.tags ?? withDefaultTag(tagsFor(l.text, l.expression), cfg.voices[l.speaker]?.defaultTag),
    ...(kept?.skip ? { skip: true } : {}),
    sources: [l.source],
  });
}

const items = [...todo.values()].sort((a, b) => a.folder.localeCompare(b.folder) || a.file.localeCompare(b.file));
writeJson(TODO, items);

const byFolder = Object.entries(Object.groupBy(items, (t) => t.folder)).map(([f, list]) => `  ${f}: ${list!.length}`);
console.log(`\n${items.length} line(s) need a voice${items.length ? ":" : "."}`);
if (byFolder.length) console.log(byFolder.join("\n"));
console.log(`\nWrote ${path.relative(process.cwd(), TODO)}. Review tags/names, then: npm run voice:generate`);
if (others.size) console.log(`\n${others.size} line(s) belong to other characters (no voice set for them in scripts/voice/config.json yet):\n  ` + [...others.values()].join("\n  "));
if (dynamic.length) console.log(`\n${dynamic.length} line(s) are built on the fly and can't be pre-recorded as-is:\n  ` + dynamic.join("\n  "));
