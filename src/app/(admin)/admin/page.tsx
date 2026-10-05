import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/server/adminAuth";
import { activitiesQuery, devicesQuery, hogql, overviewQuery, PERIOD_DAYS, posthogConfigured, quitStepsQuery } from "@/lib/server/posthogQuery";
import { selectRows, supabaseConfigured } from "@/lib/server/supabase";
import { listActivities } from "@/data/activities";
import { SURVEY } from "@/features/feedback/survey";
import { MOODS, NOTICED } from "@/features/feedback/activityFeedback";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

type Tab = "overview" | "devices" | "activities" | "feedback";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "devices", label: "Devices" },
  { id: "activities", label: "Activities" },
  { id: "feedback", label: "Feedback" },
];

export interface FeedbackRow {
  response_id: string;
  source: "survey" | "activity";
  activity_id: string | null;
  mood: string | null;
  noticed: string[] | null;
  note: string | null;
  answers: Record<string, string> | null;
  app_version: string | null;
  submitted_at: string | null;
  created_at: string;
}

const TZ = process.env.ADMIN_TIMEZONE ?? "Asia/Kolkata";
const when = (v: unknown) =>
  v ? new Date(String(v)).toLocaleString("en-GB", { timeZone: TZ, day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const TITLES = Object.fromEntries(listActivities().map((a) => [a.id, a.title]));
const title = (id: unknown) => (id ? (TITLES[String(id)] ?? String(id)) : "—");
const MOOD = Object.fromEntries(MOODS.map((m) => [m.id, `${m.emoji} ${m.label}`]));
const NOTICE = Object.fromEntries(NOTICED.map((n) => [n.id, n.label]));
const QUESTION = Object.fromEntries(SURVEY.map((q) => [q.id, q.text]));

async function attempt<T>(run: () => Promise<T>): Promise<{ data?: T; error?: string }> {
  try {
    return { data: await run() };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin();
  const params = await searchParams;
  const tab = (TABS.some((t) => t.id === params.tab) ? params.tab : "overview") as Tab;

  return (
    <div className="min-h-dvh text-[0.95rem] text-ink">
      <header className="sticky top-0 z-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-paper-shade bg-paper/95 px-6 py-3 backdrop-blur">
        <h1 className="font-display text-2xl">Milomi admin</h1>
        <nav className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={`/admin?tab=${t.id}`}
              className={`rounded-full px-4 py-1.5 font-bold ${tab === t.id ? "bg-sage/50 text-ink" : "text-ink-soft hover:bg-cream"}`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="ml-auto">
          <button type="submit" className="text-ink-soft underline">
            Sign out
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">
        {tab === "overview" && <Overview />}
        {tab === "devices" && <Devices />}
        {tab === "activities" && <Activities />}
        {tab === "feedback" && <Feedback params={params} />}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Setup({ what, vars }: { what: string; vars: string[] }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-paper-shade p-5 text-ink-soft">
      <p className="font-bold text-ink">{what} isn&apos;t connected yet.</p>
      <p className="mt-1">
        Add {vars.map((v, i) => (
          <span key={v}>
            {i > 0 && (i === vars.length - 1 ? " and " : ", ")}
            <code className="rounded bg-cream px-1">{v}</code>
          </span>
        ))}{" "}
        to <code className="rounded bg-cream px-1">.env.local</code> (and Vercel), then restart the server.
      </p>
    </div>
  );
}

function Failed({ error }: { error: string }) {
  return <p className="rounded-xl bg-coral/20 p-4 text-brick">Couldn&apos;t load this: {error}</p>;
}

function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl bg-paper p-4 shadow-[var(--shadow-paper)]">
      <div className="text-sm text-ink-soft">{label}</div>
      <div className="font-display text-3xl">{value}</div>
      {hint && <div className="text-xs text-ink-soft">{hint}</div>}
    </div>
  );
}

function Table({ head, rows, empty = "Nothing yet." }: { head: string[]; rows: ReactNode[][]; empty?: string }) {
  if (!rows.length) return <p className="text-ink-soft">{empty}</p>;
  return (
    <div className="overflow-x-auto rounded-xl border border-paper-shade bg-paper">
      <table className="w-full text-left">
        <thead className="bg-cream text-sm text-ink-soft">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-bold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-paper-shade align-top">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "—");
const num = (v: unknown) => Number(v ?? 0);

/* ------------------------------------------------------------------ */

async function Overview() {
  const [usage, devices, feedback] = await Promise.all([
    posthogConfigured ? attempt(() => hogql("admin_overview", overviewQuery)) : Promise.resolve(null),
    posthogConfigured ? attempt(() => hogql("admin_devices", devicesQuery)) : Promise.resolve(null),
    supabaseConfigured ? attempt(() => selectRows<FeedbackRow>("feedback", "select=source,mood,created_at&order=created_at.desc&limit=5000")) : Promise.resolve(null),
  ]);

  const u = usage?.data?.[0];
  const weekAgo = Date.now() - 7 * 864e5;
  const newThisWeek = devices?.data?.filter((d) => new Date(String(d[1])).getTime() >= weekAgo).length ?? 0;
  const returning = devices?.data?.filter((d) => num(d[3]) > 1).length ?? 0;
  const fb = feedback?.data ?? [];

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-3 text-xl font-bold">Usage (last {PERIOD_DAYS} days)</h2>
        {!posthogConfigured ? (
          <Setup what="PostHog" vars={["POSTHOG_PERSONAL_API_KEY", "POSTHOG_PROJECT_ID"]} />
        ) : usage?.error ? (
          <Failed error={usage.error} />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Devices, all" value={num(u?.[0])} hint="one phone or browser = one device" />
            <Stat label="Devices today" value={num(u?.[1])} />
            <Stat label="Devices, last 7 days" value={num(u?.[2])} />
            <Stat label="New devices this week" value={newThisWeek} />
            <Stat label="Came back on another day" value={returning} hint={pct(returning, num(u?.[0])) + " of devices"} />
            <Stat label="App opens" value={num(u?.[5])} />
            <Stat label="Activities started" value={num(u?.[3])} />
            <Stat label="Activities finished" value={num(u?.[4])} hint={pct(num(u?.[4]), num(u?.[3])) + " of starts"} />
          </div>
        )}
      </section>
      <section>
        <h2 className="mb-3 text-xl font-bold">Feedback</h2>
        {!supabaseConfigured ? (
          <Setup what="Supabase" vars={["SUPABASE_URL", "SUPABASE_SECRET_KEY"]} />
        ) : feedback?.error ? (
          <Failed error={feedback.error} />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Responses, all" value={fb.length} />
            <Stat label="Surveys" value={fb.filter((f) => f.source === "survey").length} />
            <Stat label="After-activity" value={fb.filter((f) => f.source === "activity").length} />
            <Stat label="Last 7 days" value={fb.filter((f) => new Date(f.created_at).getTime() >= weekAgo).length} />
          </div>
        )}
      </section>
    </div>
  );
}

async function Devices() {
  if (!posthogConfigured) return <Setup what="PostHog" vars={["POSTHOG_PERSONAL_API_KEY", "POSTHOG_PROJECT_ID"]} />;
  const { data, error } = await attempt(() => hogql("admin_devices", devicesQuery));
  if (error) return <Failed error={error} />;
  const rows = data ?? [];
  return (
    <section>
      <h2 className="text-xl font-bold">Devices ({rows.length})</h2>
      <p className="mb-3 text-ink-soft">
        Every anonymous device that used Milomi in the last {PERIOD_DAYS} days, most recent first. No names: the app has no accounts.
      </p>
      <Table
        head={["Device", "First seen", "Last seen", "Days active", "Activities started", "Finished", "Device type", "OS"]}
        rows={rows.map((d) => [
          <code key="id" className="text-xs">{String(d[0]).slice(0, 12)}…</code>,
          when(d[1]),
          when(d[2]),
          num(d[3]),
          num(d[4]),
          num(d[5]),
          d[6] ?? "—",
          d[7] ?? "—",
        ])}
      />
    </section>
  );
}

async function Activities() {
  if (!posthogConfigured) return <Setup what="PostHog" vars={["POSTHOG_PERSONAL_API_KEY", "POSTHOG_PROJECT_ID"]} />;
  const [acts, quits] = await Promise.all([attempt(() => hogql("admin_activities", activitiesQuery)), attempt(() => hogql("admin_quit_steps", quitStepsQuery))]);
  if (acts.error) return <Failed error={acts.error} />;
  // the step children most often leave on, per activity
  const topQuit = new Map<string, string>();
  for (const [a, step, n] of quits.data ?? []) if (!topQuit.has(String(a))) topQuit.set(String(a), `${step} (${n})`);
  return (
    <section>
      <h2 className="text-xl font-bold">Activities</h2>
      <p className="mb-3 text-ink-soft">Last {PERIOD_DAYS} days. &ldquo;Left early&rdquo; counts children who closed an activity before the end.</p>
      <Table
        head={["Activity", "Started", "Finished", "Finish rate", "Avg. time to finish", "Left early", "Most often left at step"]}
        rows={(acts.data ?? [])
          .filter((r) => r[0])
          .map((r) => [
            <b key="t">{title(r[0])}</b>,
            num(r[1]),
            num(r[2]),
            pct(num(r[2]), num(r[1])),
            r[3] ? `${Math.round(num(r[3]) / 60)} min ${Math.round(num(r[3]) % 60)} s` : "—",
            num(r[4]),
            topQuit.get(String(r[0])) ?? "—",
          ])}
      />
    </section>
  );
}

async function Feedback({ params }: { params: Record<string, string | undefined> }) {
  if (!supabaseConfigured) return <Setup what="Supabase" vars={["SUPABASE_URL", "SUPABASE_SECRET_KEY"]} />;
  const { data, error } = await attempt(() => selectRows<FeedbackRow>("feedback", "select=*&order=created_at.desc&limit=2000"));
  if (error) return <Failed error={error} />;
  const all = data ?? [];
  const source = params.source === "survey" || params.source === "activity" ? params.source : "";
  const rows = all.filter((f) => (!source || f.source === source) && (!params.activity || f.activity_id === params.activity) && (!params.mood || f.mood === params.mood));
  const activityIds = [...new Set(all.map((f) => f.activity_id).filter(Boolean))] as string[];
  const exportHref = `/admin/export?${new URLSearchParams(Object.entries({ source, activity: params.activity ?? "", mood: params.mood ?? "" }).filter(([, v]) => v)).toString()}`;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Feedback ({rows.length})</h2>
          <p className="text-ink-soft">Survey answers and the &ldquo;Make Milo Better With Us 🌱&rdquo; form after activities.</p>
        </div>
        <a href={exportHref} className="rounded-full bg-moss px-4 py-2 font-bold text-paper">
          Download CSV
        </a>
      </div>

      {/* filters (plain GET form, works without JavaScript) */}
      <form className="flex flex-wrap items-end gap-3 rounded-xl bg-paper p-3">
        <input type="hidden" name="tab" value="feedback" />
        <Select name="source" label="Type" value={source} options={[["", "All"], ["activity", "After activity"], ["survey", "Survey"]]} />
        <Select name="activity" label="Activity" value={params.activity ?? ""} options={[["", "All"], ...activityIds.map((id) => [id, title(id)] as [string, string])]} />
        <Select name="mood" label="Reaction" value={params.mood ?? ""} options={[["", "All"], ...MOODS.map((m) => [m.id, `${m.emoji} ${m.label}`] as [string, string])]} />
        <button type="submit" className="min-h-[40px] rounded-full bg-sage/60 px-4 font-bold">
          Filter
        </button>
        <Link href="/admin?tab=feedback" className="min-h-[40px] px-2 py-2 text-ink-soft underline">
          Clear
        </Link>
      </form>

      {rows.length === 0 ? (
        <p className="text-ink-soft">No responses{source || params.activity || params.mood ? " match these filters" : " yet"}.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((f) => (
            <li key={f.response_id} className="rounded-xl border border-paper-shade bg-paper p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-bold">{f.source === "survey" ? "Survey" : title(f.activity_id)}</span>
                <span className="text-sm text-ink-soft">
                  {when(f.created_at)} · {f.source === "survey" ? "survey" : "after activity"}
                </span>
              </div>
              {f.source === "activity" ? (
                <>
                  <p className="mt-1">{f.mood ? (MOOD[f.mood] ?? f.mood) : "—"}</p>
                  {!!f.noticed?.length && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {f.noticed.map((n) => (
                        <span key={n} className="rounded-full bg-sage/35 px-3 py-0.5 text-sm">
                          {NOTICE[n] ?? n}
                        </span>
                      ))}
                    </div>
                  )}
                  {f.note && <p className="mt-2 whitespace-pre-wrap text-ink-soft">&ldquo;{f.note}&rdquo;</p>}
                </>
              ) : (
                <dl className="mt-2 grid gap-x-6 gap-y-1 md:grid-cols-2">
                  {Object.entries(f.answers ?? {}).map(([q, a]) => (
                    <div key={q}>
                      <dt className="text-sm text-ink-soft">{QUESTION[q] ?? q}</dt>
                      <dd className="whitespace-pre-wrap">{a}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Select({ name, label, value, options }: { name: string; label: string; value: string; options: [string, string][] }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-bold">{label}</span>
      <select name={name} defaultValue={value} className="min-h-[40px] rounded-lg border border-paper-shade bg-cream px-2">
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
