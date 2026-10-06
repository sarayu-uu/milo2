/**
 * Shared helpers for the voice pipeline (scan → todo.json → generate).
 * Plain Node (24+ runs .mts directly); no extra dependencies.
 */
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export const ROOT = path.resolve(import.meta.dirname, "../..");
export const SRC = path.join(ROOT, "src");
export const AUDIO_DIR = path.join(ROOT, "public/audio/scenes");
export const SCENES_DIR = path.join(SRC, "lib/audio/scenes");
export const GENERATED = path.join(SCENES_DIR, "generated.json");
export const TODO = path.join(import.meta.dirname, "todo.json");
export const CONFIG = path.join(import.meta.dirname, "config.json");

/** Same normalisation the app uses to match a spoken line to its recording. */
export const normalize = (text: string) =>
  text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();

export const readJson = <T,>(file: string, fallback: T): T =>
  fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as T) : fallback;
export const writeJson = (file: string, data: unknown) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");

export interface Line {
  text: string;
  speaker: string;
  expression?: string;
  source: string; // file:line
}

export interface TodoItem {
  id: string;
  speaker: string;
  folder: string;
  file: string;
  text: string;
  tags: string;
  skip?: boolean;
  sources: string[];
}

export interface VoiceConfig {
  model: string;
  outputFormat: string;
  voiceSettings: Record<string, number | boolean>;
  /** defaultTag: the character's usual delivery, e.g. "[nervously]" for Snail. */
  voices: Record<string, { search: string; voiceId: string; defaultTag?: string }>;
}

/** Characters with an ElevenLabs voice set in config.json. */
export const voicedSpeakers = (cfg: VoiceConfig) =>
  new Set(Object.entries(cfg.voices).filter(([, v]) => v.search || v.voiceId).map(([who]) => who));

export interface GeneratedClip {
  id: string;
  speaker: string;
  folder: string;
  file: string;
  lines: string[];
  durationMs: number;
}

/* ------------------------------------------------------------------ */
/* Where a line lives decides its folder.                             */
/* ------------------------------------------------------------------ */

const kebab = (s: string) => s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

export function folderFor(rel: string): string {
  const p = rel.replace(/\\/g, "/").replace(/:\d+$/, "");
  let m = p.match(/^src\/data\/activities\/([^/]+)\//);
  if (m) return `activities/${m[1]}`;
  if (p.startsWith("src/data/worlds") || p.startsWith("src/components/world")) return "world";
  if (p.startsWith("src/components/home")) return "home";
  if (p.endsWith("CoreLearning.tsx")) return "playbook";
  m = p.match(/^src\/components\/activities\/interactive\/(\w+)\.tsx$/);
  if (m) return `activities/${kebab(m[1])}`;
  return "common";
}

export function slugFor(text: string) {
  return normalize(text).split(" ").filter(Boolean).slice(0, 6).join("-") || "line";
}

/* ------------------------------------------------------------------ */
/* Expression → ElevenLabs v3 audio tag (edit freely).                 */
/* ------------------------------------------------------------------ */

const TAGS: Record<string, string> = {
  surprised: "[surprised]",
  happy: "[happy]",
  proud: "[proudly]",
  thinking: "[thoughtful]",
  curious: "[curious]",
  suspicious: "[suspicious]",
  confused: "[confused]",
  sleepy: "[sleepy]",
  sad: "[sad]",
  excited: "[excited]",
};

/** A character's default tag stands in for generic tags and leads specific ones. */
export function withDefaultTag(tags: string, defaultTag?: string) {
  if (!defaultTag || tags === defaultTag) return tags;
  if (!tags || tags === "[excited]" || tags === "[curious]") return defaultTag;
  return `${defaultTag} ${tags}`;
}

export function tagsFor(text: string, expression?: string) {
  const t = text.trim();
  if (/^(shh|psst)\b/i.test(t) || /\bquietly\b/i.test(t)) return "[whispers]";
  // a short all-caps shout: "FREEZE!", "I'LL HELP!"
  if (/!$/.test(t) && t.replace(/[^a-z]/gi, "").length >= 3 && t === t.toUpperCase()) return "[shouts]";
  if (expression && TAGS[expression]) return TAGS[expression];
  return /!$/.test(t) ? "[excited]" : /\?$/.test(t) ? "[curious]" : "";
}

/* ------------------------------------------------------------------ */
/* Scanning the code for spoken lines.                                 */
/* ------------------------------------------------------------------ */

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return /[\\/]src[\\/](lib[\\/]audio|app[\\/]api)$/.test(full) ? [] : walk(full);
    return /\.tsx?$/.test(e.name) ? [full] : [];
  });
}

/** Data keys whose strings are spoken aloud (in src/data, plus `line` in characters). */
const SPOKEN_KEYS = new Set(["text", "milo", "greetings", "teaser", "prompt", "questions", "childPrompts", "intro", "line", "reaction", "goal"]);

const propName = (n: ts.PropertyName) => (ts.isIdentifier(n) || ts.isStringLiteral(n) ? n.text : "");

function literalProp(obj: ts.ObjectLiteralExpression | undefined, name: string): string | undefined {
  const p = obj?.properties.find((q) => ts.isPropertyAssignment(q) && propName(q.name) === name) as ts.PropertyAssignment | undefined;
  return p && ts.isStringLiteralLike(p.initializer) ? p.initializer.text : undefined;
}

function nestedObj(obj: ts.ObjectLiteralExpression | undefined, ...names: string[]) {
  let cur = obj;
  for (const n of names) {
    const p = cur?.properties.find((q) => ts.isPropertyAssignment(q) && propName(q.name) === n) as ts.PropertyAssignment | undefined;
    cur = p && ts.isObjectLiteralExpression(p.initializer) ? p.initializer : undefined;
  }
  return cur;
}

const isSpeakable = (t: string) => /[a-z]/i.test(t);

/** Step component file → the step type it renders; its own lines are said by that step's speaker. */
const STEP_FILES: Record<string, string> = {
  CountGame: "count",
  PatternGame: "pattern",
  ChoiceGame: "choice",
  MatchGame: "match",
  DrawCanvas: "draw",
  GuidedDraw: "guided-draw",
  GiveGame: "give",
  ReflectionCard: "reflection",
  ExtensionOffer: "extension-offer",
  MovementGame: "movement",
  ParentChildCard: "parent-child",
};

/** Who speaks each step type, from the activity data (a step without a speaker is Milo's). */
function stepSpeakers(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const file of walk(path.join(SRC, "data/activities"))) {
    const sf = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
    const visit = (n: ts.Node) => {
      if (ts.isObjectLiteralExpression(n)) {
        const type = literalProp(n, "type");
        if (type && literalProp(n, "id")) {
          if (!map.has(type)) map.set(type, new Set());
          map.get(type)!.add(literalProp(n, "speaker") ?? literalProp(n, "leader") ?? "milo");
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  return map;
}

export function scanCode(): { lines: Line[]; dynamic: string[] } {
  const lines: Line[] = [];
  const dynamic: string[] = [];
  const speakers = stepSpeakers();

  for (const file of walk(SRC)) {
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    const sf = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
    const at = (n: ts.Node) => `${rel}:${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1}`;
    // theme taglines are shown on screen, not spoken
    const isData = (rel.startsWith("src/data/") && !rel.startsWith("src/data/themes")) || rel.startsWith("src/components/characters/");

    // Names declared in this file (to resolve e.g. WORDS or `num`), and who each
    // useSpeech() hook speaks as: useSpeech("squirrel") → squirrel, useSpeech(speaker) → the step's speaker ("").
    const consts = new Map<string, ts.Expression | null>();
    const speechVars = new Map<string, string>();
    const declare = (n: ts.Node) => {
      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) {
        const name = n.name.text;
        consts.set(name, consts.has(name) ? null : n.initializer); // declared twice → ambiguous
        const init = n.initializer;
        if (ts.isCallExpression(init) && ts.isIdentifier(init.expression) && init.expression.text === "useSpeech") {
          const a = init.arguments[0];
          speechVars.set(name, a && ts.isStringLiteralLike(a) ? a.text : "");
        }
      }
      ts.forEachChild(n, declare);
    };
    declare(sf);
    const stepType = STEP_FILES[path.basename(file).replace(/\.tsx?$/, "")];
    const speakersOf = (who: string) => (who ? [who] : stepType ? [...(speakers.get(stepType) ?? new Set(["milo"]))] : ["milo"]);

    type Found = { vals: string[]; dyn: boolean };
    const none: Found = { vals: [], dyn: false };
    const merge = (a: Found, b: Found): Found => ({ vals: [...a.vals, ...b.vals], dyn: a.dyn || b.dyn });
    const concat = (parts: Found[]): Found =>
      parts.some((p) => !p.vals.length)
        ? { vals: [], dyn: true } // part of it is only known while playing
        : { vals: parts.reduce((acc, p) => acc.flatMap((a) => p.vals.map((b) => a + b)), [""]).slice(0, 300), dyn: parts.some((p) => p.dyn) };

    /** Every string a speech argument can be. */
    const evalS = (n: ts.Node, depth = 0): Found => {
      if (depth > 6) return none;
      const ev = (m: ts.Node) => evalS(m, depth + 1);
      if (ts.isStringLiteralLike(n)) return { vals: [n.text], dyn: false };
      if (ts.isParenthesizedExpression(n) || ts.isAsExpression(n) || ts.isNonNullExpression(n)) return ev(n.expression);
      if (ts.isConditionalExpression(n)) return merge(ev(n.whenTrue), ev(n.whenFalse));
      if (ts.isBinaryExpression(n)) return n.operatorToken.kind === ts.SyntaxKind.PlusToken ? concat([ev(n.left), ev(n.right)]) : merge(ev(n.left), ev(n.right));
      if (ts.isArrayLiteralExpression(n)) return n.elements.map(ev).reduce(merge, none);
      if (ts.isElementAccessExpression(n)) return ev(n.expression);
      if (ts.isIdentifier(n)) {
        const init = consts.get(n.text);
        return init ? ev(init) : none;
      }
      if (ts.isTemplateExpression(n)) {
        const parts: Found[] = [{ vals: [n.head.text], dyn: false }];
        for (const span of n.templateSpans) parts.push(ev(span.expression), { vals: [span.literal.text], dyn: false });
        return concat(parts);
      }
      if (ts.isCallExpression(n)) {
        const name = n.expression.getText(sf);
        if (/pickOne/.test(name)) return n.arguments.map(ev).reduce(merge, none);
        if (name === "cap" && n.arguments[0]) {
          const r = ev(n.arguments[0]);
          return { ...r, vals: r.vals.map((v) => v.charAt(0).toUpperCase() + v.slice(1)) };
        }
      }
      return none; // data (pick(step.prompt), room.greetings…) is scanned from the data files instead
    };

    const visit = (n: ts.Node) => {
      // milo.say("…", { expression }) / speak("…", "milo")
      if (ts.isCallExpression(n) && n.arguments.length) {
        const callee = n.expression;
        const isSay = ts.isPropertyAccessExpression(callee) && callee.name.text === "say";
        const isSpeak = ts.isIdentifier(callee) && callee.text === "speak";
        if (isSay || isSpeak) {
          const arg1 = n.arguments[1];
          const who = isSay
            ? (ts.isIdentifier(callee.expression) ? speechVars.get(callee.expression.text) : undefined) ?? "milo"
            : !arg1
              ? "milo"
              : ts.isStringLiteralLike(arg1)
                ? arg1.text
                : stepType
                  ? ""
                  : "milo";
          const opts = isSay && arg1 && ts.isObjectLiteralExpression(arg1) ? arg1 : undefined;
          const found = evalS(n.arguments[0]);
          if (found.dyn) dynamic.push(`${at(n.arguments[0])}  ${n.arguments[0].getText(sf)}`);
          for (const text of new Set(found.vals))
            if (isSpeakable(text) && normalize(text) !== "zero")
              for (const speaker of speakersOf(who)) lines.push({ text, speaker, expression: literalProp(opts, "expression"), source: at(n.arguments[0]) });
        }
      }

      // data: { speaker: "milo", text: "…", actors: { milo: { expression } } }
      if (isData && ts.isPropertyAssignment(n) && SPOKEN_KEYS.has(propName(n.name))) {
        if (rel.startsWith("src/components/") && propName(n.name) !== "line") return ts.forEachChild(n, visit);
        const owner = ts.isObjectLiteralExpression(n.parent) ? n.parent : undefined;
        // nearest enclosing object that names a speaker
        let speaker = "milo";
        for (let p: ts.Node | undefined = n.parent; p; p = p.parent) {
          if (ts.isObjectLiteralExpression(p)) {
            const s = literalProp(p, "speaker") ?? literalProp(p, "leader");
            if (s) {
              speaker = s;
              break;
            }
          }
        }
        const expression = literalProp(owner, "expression") ?? literalProp(nestedObj(owner, "actors", speaker), "expression");
        const strings: ts.StringLiteralLike[] = [];
        const grab = (e: ts.Node) => {
          if (ts.isStringLiteralLike(e)) strings.push(e);
          else if (ts.isArrayLiteralExpression(e)) e.elements.forEach(grab);
          else if (ts.isObjectLiteralExpression(e))
            e.properties.forEach((q) => ts.isPropertyAssignment(q) && ["younger", "older"].includes(propName(q.name)) && grab(q.initializer));
        };
        grab(n.initializer);
        for (const s of strings) if (isSpeakable(s.text)) lines.push({ text: s.text, speaker, expression, source: at(s) });
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  return { lines, dynamic };
}

/** Every line that already has a recording (hand-made scene files + generated.json). */
export function recordedLines(): Set<string> {
  // keys are "speaker|normalised line"; the hand-made scene files are all Milo
  const done = new Set<string>();
  for (const f of fs.readdirSync(SCENES_DIR).filter((f) => f.endsWith(".ts"))) {
    const sf = ts.createSourceFile(f, fs.readFileSync(path.join(SCENES_DIR, f), "utf8"), ts.ScriptTarget.Latest, true);
    const visit = (n: ts.Node) => {
      if (ts.isPropertyAssignment(n) && propName(n.name) === "lines" && ts.isArrayLiteralExpression(n.initializer))
        n.initializer.elements.forEach((e) => ts.isStringLiteralLike(e) && done.add(`milo|${normalize(e.text)}`));
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  // one-off tuples in recordings.ts, e.g. ["High five!", "vo-milo-high-five", 1306]
  const rec = fs.readFileSync(path.join(SRC, "lib/audio/recordings.ts"), "utf8");
  for (const m of rec.matchAll(/\[\s*"([^"]+)",\s*"vo-[^"]+",\s*\d+\s*\]/g)) done.add(`milo|${normalize(m[1])}`);
  for (const clip of readJson<GeneratedClip[]>(GENERATED, [])) clip.lines.forEach((l) => done.add(`${clip.speaker}|${normalize(l)}`));
  return done;
}

/* ------------------------------------------------------------------ */
/* MP3 duration (frame walk; works for CBR and VBR).                    */
/* ------------------------------------------------------------------ */

const BITRATES = {
  v1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  v2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
};
const RATES: Record<number, number[]> = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

export function mp3DurationMs(buf: Buffer): number {
  let i = 0;
  if (buf.subarray(0, 3).toString("latin1") === "ID3") i = 10 + ((buf[6] << 21) | (buf[7] << 14) | (buf[8] << 7) | buf[9]);
  let seconds = 0;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff || (buf[i + 1] & 0xe0) !== 0xe0) {
      i++;
      continue;
    }
    const version = (buf[i + 1] >> 3) & 3; // 3 = MPEG1, 2 = MPEG2, 0 = MPEG2.5
    const layer = (buf[i + 1] >> 1) & 3; // 1 = Layer III
    const br = (version === 3 ? BITRATES.v1 : BITRATES.v2)[(buf[i + 2] >> 4) & 15];
    const sr = RATES[version]?.[(buf[i + 2] >> 2) & 3];
    if (layer !== 1 || !br || !sr) {
      i++;
      continue;
    }
    const samples = version === 3 ? 1152 : 576;
    const padding = (buf[i + 2] >> 1) & 1;
    i += Math.floor(((samples / 8) * br * 1000) / sr) + padding;
    seconds += samples / sr;
  }
  return Math.round(seconds * 1000);
}
