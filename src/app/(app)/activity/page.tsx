import type { Metadata } from "next";
import { BACKLOG } from "@/data/backlog";
import { listActivities } from "@/data/activities";
import { listThemes } from "@/data/themes";

export const metadata: Metadata = {
  title: "Activities · Milomi",
  robots: { index: false, follow: false },
};

const AGES = [3, 4, 5] as const;

/** The Play Book strip colours (data/themes). */
const THEMES = listThemes();
const STRIP_COLOR = Object.fromEntries(THEMES.map((t) => [t.label, `${t.color}99`])) as Record<string, string>;

/** "one-to-one-correspondence" → "One to one correspondence". */
const human = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");

interface Row {
  name: string;
  description: string;
  focus: string;
  age: number;
  strip: string;
  built: boolean;
}

/** Everything: what's already in the app (green) and what's held back. */
const ROWS: Row[] = [
  ...listActivities().map((a) => ({
    name: a.title,
    description: a.parentSummary,
    focus: a.skills.map(human).join(", "),
    age: Math.min(5, Math.max(3, a.ageMin)),
    strip: THEMES.find((t) => t.activityIds.includes(a.id))?.label ?? "Not in the Play Book",
    built: true,
  })),
  ...BACKLOG.map((b) => ({ ...b, built: false })),
];

/**
 * /activity: every activity for the team, by age. Green = already in the app;
 * the rest are planned but held back. Not linked from anywhere in the app.
 */
export default function ActivityBacklogPage() {
  const built = ROWS.filter((r) => r.built).length;
  return (
    <div className="h-full overflow-y-auto bg-paper px-[5%] py-8 text-ink select-text">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-[2.4rem] leading-tight">Activities</h1>
        <p className="mt-1 text-ink-soft">
          <span className="rounded-full bg-[#cfe6c2] px-2 font-bold text-ink">{built} in the app</span> and {ROWS.length - built} held back. The age is the youngest age
          each one is meant for; the colour tag is the Play Book strip it goes in.
        </p>

        {AGES.map((age) => {
          // what's built first, then what's held back
          const list = ROWS.filter((r) => r.age === age).sort((a, b) => Number(b.built) - Number(a.built));
          return (
            <section key={age} className="mt-8">
              <h2 className="text-2xl font-bold">
                Age {age}+{" "}
                <span className="text-base font-normal text-ink-soft">
                  ({list.filter((r) => r.built).length} in the app, {list.filter((r) => !r.built).length} held back)
                </span>
              </h2>
              <ul className="mt-3 grid gap-3 md:grid-cols-2">
                {list.map((a) => (
                  <li key={a.name} className={`rounded-xl border p-4 ${a.built ? "border-[#9cc585] bg-[#e3f1da]" : "border-paper-shade bg-cream"}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-bold">{a.name}</h3>
                      <span className="flex flex-wrap gap-1.5 text-xs font-bold">
                        {a.built && <span className="rounded-full bg-[#7cae6c] px-2 py-0.5 text-white">✓ In the app</span>}
                        <span className="rounded-full bg-sage/40 px-2 py-0.5">Age {a.age}+</span>
                        <span className="rounded-full px-2 py-0.5" style={{ background: STRIP_COLOR[a.strip] ?? "#e7dcc4" }}>
                          {a.strip}
                        </span>
                      </span>
                    </div>
                    <p className="mt-1.5">{a.description}</p>
                    <p className="mt-2 text-sm text-ink-soft">
                      <span className="font-bold text-ink">Focus:</span> {a.focus}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
