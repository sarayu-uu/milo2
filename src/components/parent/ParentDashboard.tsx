"use client";

import { useRef, useState } from "react";
import { ArrowLeft, BarChart3, HeartHandshake, MessageSquareHeart, Settings2, ShieldCheck, Sprout } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import { AGES } from "@/features/curriculum/age";
import { useProgressStore } from "@/stores/progressStore";
import { listActivities } from "@/data/activities";
import { useWorld } from "@/hooks/useWorld";
import { useBand } from "@/hooks/useBand";
import { analytics, analyticsConfig } from "@/lib/analytics/analytics";
import { Toggle } from "@/components/ui/TopBar";
import { FeedbackSurvey } from "./FeedbackSurvey";
import { WhyMilomi } from "./WhyMilomi";
import { ParentAwareness } from "./ParentAwareness";

type Tab = "you" | "why" | "profile" | "progress" | "feedback" | "privacy";

/** The quiet, adult-facing area. Plain, readable, no scrapbook noise. */
export function ParentDashboard({ onExit }: { onExit: () => void }) {
  const [tab, setTabState] = useState<Tab>("you");
  const mainRef = useRef<HTMLElement>(null);
  const setTab = (t: Tab) => {
    setTabState(t);
    mainRef.current?.scrollTo({ top: 0 });
  };
  return (
    <div className="flex h-full w-full bg-paper/80">
      <nav className="flex w-60 shrink-0 flex-col gap-1 border-r border-paper-shade bg-cream p-4">
        <button type="button" onClick={onExit} className="mb-4 inline-flex min-h-[48px] items-center gap-2 font-bold text-ink">
          <ArrowLeft className="h-5 w-5" /> Back to Milo
        </button>
        <NavItem icon={<HeartHandshake className="h-5 w-5" />} label="You & your child" on={tab === "you"} onClick={() => setTab("you")} />
        <NavItem icon={<Sprout className="h-5 w-5" />} label="Why Milomi" on={tab === "why"} onClick={() => setTab("why")} />
        <NavItem icon={<Settings2 className="h-5 w-5" />} label="Profile & settings" on={tab === "profile"} onClick={() => setTab("profile")} />
        <NavItem icon={<BarChart3 className="h-5 w-5" />} label="Progress" on={tab === "progress"} onClick={() => setTab("progress")} />
        <NavItem icon={<MessageSquareHeart className="h-5 w-5" />} label="Feedback" on={tab === "feedback"} onClick={() => setTab("feedback")} />
        <NavItem icon={<ShieldCheck className="h-5 w-5" />} label="Privacy" on={tab === "privacy"} onClick={() => setTab("privacy")} />
      </nav>
      <main ref={mainRef} className="min-w-0 flex-1 overflow-y-auto px-[4%] py-6 text-[1rem] select-text">
        <div className="mx-auto max-w-3xl">
          {tab === "you" && <ParentAwareness onWhy={() => setTab("why")} onPlay={onExit} />}
          {tab === "why" && <WhyMilomi />}
          {tab === "profile" && <Profile />}
          {tab === "progress" && <Progress />}
          {tab === "feedback" && (
            <Section title="Feedback">
              <FeedbackSurvey />
            </Section>
          )}
          {tab === "privacy" && <Privacy />}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, on, onClick }: { icon: React.ReactNode; label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[48px] items-center gap-3 rounded-lg px-3 text-left ${on ? "bg-sage/40 font-bold text-ink" : "text-ink-soft"}`}
    >
      {icon} {label}
    </button>
  );
}

function Section({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      {note && <p className="mt-1 text-ink-soft">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Profile() {
  const s = useSettingsStore();
  const track = (setting: string, value: string) => analytics.track("setting_changed", { setting, value });
  return (
    <>
      <Section title="Child's age" note="Chooses which games show in the Play Book and how tricky they are. “Prefer not to say” shows every game.">
        <div className="flex flex-wrap gap-2">
          {AGES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                s.setAge(a);
                track("age", String(a));
              }}
              className={`min-h-[48px] min-w-[64px] rounded-full border-2 px-5 font-bold ${s.age === a ? "border-moss bg-sage/40" : "border-paper-shade bg-paper"}`}
            >
              {a === 6 ? "6+" : a}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              s.setAge(null);
              track("age", "unset");
            }}
            className={`min-h-[48px] rounded-full border-2 px-5 ${s.age === null ? "border-moss bg-sage/40" : "border-paper-shade bg-paper"}`}
          >
            Prefer not to say
          </button>
        </div>
      </Section>

      <Section title="Sound">
        <div className="max-w-md divide-y divide-paper-shade">
          <Toggle label="All sound" on={!s.audio.muted} onChange={(v) => (s.setAudio({ muted: !v }), track("muted", String(!v)))} />
          <Toggle label="Background sounds" hint="Soft room ambience (birds, kitchen…)" on={s.audio.ambient} onChange={(v) => (s.setAudio({ ambient: v }), track("ambient", String(v)))} />
          <Slider label="Background volume" value={s.audio.ambientVolume} onChange={(v) => s.setAudio({ ambientVolume: v })} />
          <Toggle label="Sound effects" on={s.audio.effects} onChange={(v) => (s.setAudio({ effects: v }), track("effects", String(v)))} />
          <Slider label="Effects volume" value={s.audio.effectsVolume} onChange={(v) => s.setAudio({ effectsVolume: v })} />
          <Toggle
            label="Spoken lines"
            hint="Characters read their lines aloud (device voice for now)"
            on={s.audio.voice}
            onChange={(v) => (s.setAudio({ voice: v }), track("voice", String(v)))}
          />
        </div>
      </Section>

      <Section title="Accessibility">
        <div className="max-w-md divide-y divide-paper-shade">
          <div className="py-2">
            <span className="block">Movement</span>
            <div className="mt-2 flex gap-2">
              {(["system", "reduced", "full"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => (s.setMotion(m), track("motion", m))}
                  className={`min-h-[44px] rounded-full border-2 px-4 ${s.motion === m ? "border-moss bg-sage/40" : "border-paper-shade bg-paper"}`}
                >
                  {m === "system" ? "Follow device" : m === "reduced" ? "Less movement" : "Full animation"}
                </button>
              ))}
            </div>
          </div>
          <Toggle label="Bigger text" on={s.textSize === "large"} onChange={(v) => (s.setTextSize(v ? "large" : "normal"), track("textSize", v ? "large" : "normal"))} />
        </div>
      </Section>
    </>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex min-h-[48px] items-center justify-between gap-4">
      <span>{label}</span>
      <input type="range" min={0} max={1} step={0.05} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-40 accent-moss" />
    </label>
  );
}

function Progress() {
  const p = useProgressStore();
  const { rooms, growth } = useWorld();
  const band = useBand();
  const all = listActivities();
  const done = all.filter((a) => p.completed[a.id]);
  const startedOnly = all.filter((a) => p.started[a.id] && !p.completed[a.id]);
  const domains = new Map<string, number>();
  done.forEach((a) => a.domains.forEach((d) => domains.set(d, (domains.get(d) ?? 0) + 1)));
  const open = rooms.filter((r) => r.status === "open");

  return (
    <>
      <Section title="At a glance">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat n={done.length} label="activities finished" />
          <Stat n={p.visitDays.length} label="days with Milo" />
          <Stat n={open.length} label={`of ${rooms.length} rooms open`} />
          <Stat n={Object.keys(p.extensions).filter((k) => p.extensions[k] === "started").length} label="real-world extras tried" />
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          Current difficulty: <b>{band === "older" ? "stretchier" : "gentler"}</b> (based on age setting and play).
        </p>
      </Section>

      <Section title="Finished activities">
        {done.length ? (
          <ul className="divide-y divide-paper-shade">
            {done.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2">
                <span>
                  <b>{a.title}</b> <span className="text-ink-soft">· {a.domains.slice(0, 3).join(", ")}</span>
                </span>
                <span className="text-sm text-ink-soft">
                  ×{p.completed[a.id].count} · {new Date(p.completed[a.id].last).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-soft">Nothing finished yet — that&apos;s fine. Exploring Milo&apos;s World counts too.</p>
        )}
        {startedOnly.length > 0 && <p className="mt-3 text-sm text-ink-soft">Started but not finished: {startedOnly.map((a) => a.title).join(", ")}.</p>}
      </Section>

      <Section title="What they've been practising">
        {domains.size ? (
          <div className="flex flex-wrap gap-2">
            {[...domains.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([d, n]) => (
                <span key={d} className="rounded-full bg-sage/30 px-3 py-1">
                  {d.replace(/-/g, " ")} <span className="text-ink-soft">×{n}</span>
                </span>
              ))}
          </div>
        ) : (
          <p className="text-ink-soft">This fills in as activities are finished.</p>
        )}
      </Section>

      <Section title="Milo's World" note="Rooms open and small things appear as your child plays and comes back on different days.">
        <ul className="flex flex-wrap gap-2">
          {rooms.map((r) => (
            <li key={r.room.id} className={`rounded-full px-3 py-1 ${r.status === "open" ? "bg-sage/40" : "bg-paper-shade/60 text-ink-soft"}`}>
              {r.room.name} {r.status === "open" ? (p.discoveredRooms.includes(r.room.id) ? "· visited" : "· open") : r.status === "teased" ? "· coming next" : "· later"}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Research & testing tools" note="For pilot sessions. These change only this device.">
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => p.addGrowthBonus(2)} className="min-h-[48px] rounded-full border-2 border-paper-shade bg-paper px-4">
            Preview: grow Milo&apos;s world (+2)
          </button>
          <button type="button" onClick={() => p.addGrowthBonus(-p.growthBonus)} className="min-h-[48px] rounded-full border-2 border-paper-shade bg-paper px-4">
            Remove preview growth
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset all progress on this device? Milo's world will start small again.")) p.reset();
            }}
            className="min-h-[48px] rounded-full border-2 border-brick/50 bg-paper px-4 text-brick"
          >
            Reset progress
          </button>
        </div>
        <p className="mt-2 text-sm text-ink-soft">Internal growth score: {growth}</p>
      </Section>
    </>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-lg bg-paper p-4 shadow-[var(--shadow-pressed)]">
      <div className="text-3xl font-bold text-ink">{n}</div>
      <div className="text-sm text-ink-soft">{label}</div>
    </div>
  );
}

function Privacy() {
  const cfg = analyticsConfig();
  return (
    <Section title="Privacy">
      <div className="space-y-3 text-ink-soft">
        <p className={`rounded-lg px-4 py-3 ${cfg.connected ? "bg-sage/30" : "bg-mustard/25"}`}>
          <b className="text-ink">Research analytics: {cfg.connected ? "connected" : "not connected"}.</b>{" "}
          {cfg.connected
            ? `Anonymous events are sent to PostHog (${cfg.host.includes("eu.") ? "EU" : cfg.host.includes("us.") ? "US" : "self-hosted"}).`
            : "No PostHog key is configured, so nothing leaves this device."}
        </p>
        <p>
          Milomi is a research prototype. We collect <b>anonymous</b> usage events (for example “activity started”, “room opened”) to learn which parts work for
          children. We do not collect your child&apos;s name, voice, photos, drawings, precise location or IP address, and there are no ads.
        </p>
        <p>Drawings and progress stay on this device. Survey answers and the feedback given after activities are sent separately and are not linked to usage data.</p>
        <p>To erase everything on this device, use “Reset progress” in Progress, or clear this site&apos;s data in your browser.</p>
        <p className="text-sm">Sounds in this version are generated in the browser by Milomi (no third-party audio).</p>
      </div>
    </Section>
  );
}
