/**
 * Lines that are put together while playing (e.g. "Hmm… is a book round?").
 * The scanner can't read these from the code, so they're listed here by
 * running the same line builders the games use over every activity's data.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SILHOUETTE_FITS, fitLine, notThatShapeLine, sortedLine, wrongBinLine } from "../../src/components/activities/interactive/shapes.ts";
import { sayAloudLine, sayTogetherLine } from "../../src/features/activities/spokenLines.ts";
import { SRC, type Line } from "./lib.mts";

type Variant<T> = T | { younger: T; older: T };
const both = <T,>(v: Variant<T> | undefined): T[] => (v == null ? [] : typeof v === "object" && "younger" in (v as object) ? [(v as { younger: T }).younger, (v as { older: T }).older] : [v as T]);

export async function dynamicLines(): Promise<Line[]> {
  const out: Line[] = [];
  const dir = path.join(SRC, "data/activities");
  for (const id of fs.readdirSync(dir)) {
    const file = path.join(dir, id, "steps.ts");
    if (!fs.existsSync(file)) continue;
    let steps: { component?: string; props?: Record<string, unknown> }[];
    try {
      ({ steps } = await import(pathToFileURL(file).href));
    } catch {
      continue; // a data file with runtime imports: nothing dynamic to list there
    }
    const source = `src/data/activities/${id}/steps.ts:0`;
    const add = (speaker: string, text: string) => out.push({ text, speaker, source });

    for (const step of steps as { type?: string; speaker?: string; sequence?: Variant<string[]>; sayAloud?: string; component?: string; props?: Record<string, unknown> }[]) {
      // pattern game: "Let's say it together: …" for each pattern (same default speaker as PatternGame)
      if (step.type === "pattern") for (const seq of both(step.sequence)) add(step.speaker ?? "snail", sayTogetherLine(seq));
      // choice game: the "hear the sound" button
      if (step.type === "choice" && step.sayAloud) add(step.speaker ?? "milo", sayAloudLine(step.sayAloud));

      if (step.component === "shape-detective") {
        for (const older of [false, true]) [0, 1, 2].forEach((n) => add("milo", fitLine(n, older)));
        for (const rounds of both(step.props?.rounds as Variant<{ shape: string; options: string[] }[]>))
          for (const r of rounds) for (const obj of r.options) if (!SILHOUETTE_FITS[r.shape]?.includes(obj)) add("milo", notThatShapeLine(obj, r.shape));
      }
      if (step.component === "shape-sort") {
        for (const items of both(step.props?.items as Variant<string[]>)) items.forEach((item) => add("squirrel", sortedLine(item)));
        for (const bins of both(step.props?.bins as Variant<string[]>)) bins.forEach((bin) => add("squirrel", wrongBinLine(bin)));
      }
    }
  }
  return out;
}
