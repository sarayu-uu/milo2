"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ActivityDefinition } from "@/types/activity";
import { getActivityMeta, loadActivity } from "@/data/activities";
import { useBand } from "@/hooks/useBand";
import { analytics } from "@/lib/analytics/analytics";
import { activityAnalyticsProps } from "@/features/activities/labels";
import { sound } from "@/lib/audio/soundManager";
import { useProgressStore } from "@/stores/progressStore";
import { allVisibleObjectIds, roomStatuses } from "@/features/progression/growth";
import { ActivityIntro } from "./ActivityIntro";
import { ActivityFlow } from "./ActivityFlow";
import { ActivityEnd } from "./ActivityEnd";

type Phase = "intro" | "play" | "end";

/** Where did the child come from? Used for "back" and analytics. */
function readSource() {
  const from = new URLSearchParams(window.location.search).get("from") ?? "learn";
  if (from.startsWith("room:")) return { source: from, back: `/world/${from.slice(5)}`, kind: "room" as const };
  if (from.startsWith("learn:")) return { source: from, back: `/learn?theme=${from.slice(6)}`, kind: "learn" as const };
  return { source: from, back: "/learn", kind: "learn" as const };
}

export function ActivityScreen({ activityId }: { activityId: string }) {
  const router = useRouter();
  const band = useBand();
  const meta = getActivityMeta(activityId);
  const [activity, setActivity] = useState<ActivityDefinition | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [worldChanged, setWorldChanged] = useState(false);
  const src = useRef<ReturnType<typeof readSource> | null>(null);
  if (!src.current && typeof window !== "undefined") src.current = readSource();

  useEffect(() => {
    if (!meta) {
      router.replace("/learn");
      return;
    }
    analytics.track("activity_viewed", { ...activityAnalyticsProps(meta, band), source: src.current!.source });
    let alive = true;
    // Load step content now (code-split) so Start is instant.
    loadActivity(activityId).then((a) => alive && setActivity(a));
    void sound.setSoundscape(meta.soundscape);
    sound.preload(["clap", "slap", "bell", "wood-click", "page-flip"]);
    return () => {
      alive = false;
      void sound.setSoundscape("none");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId]);

  if (!meta) return null;

  const start = () => {
    analytics.track("activity_started", { ...activityAnalyticsProps(meta, band), source: src.current!.source });
    useProgressStore.getState().startActivity(meta.id);
    setPhase("play");
  };

  const complete = () => {
    // Did finishing this make Milo's world grow?
    const before = useProgressStore.getState();
    const objectsBefore = allVisibleObjectIds(before).length;
    const roomsBefore = roomStatuses(before).filter((r) => r.status === "open").length;
    before.completeActivity(meta.id);
    const after = useProgressStore.getState();
    setWorldChanged(allVisibleObjectIds(after).length > objectsBefore || roomStatuses(after).filter((r) => r.status === "open").length > roomsBefore);
    setPhase("end");
  };

  const exit = () => router.push(src.current!.back);

  if (phase === "intro") return <ActivityIntro meta={meta} ready={!!activity} onStart={start} onBack={exit} />;
  if (phase === "play" && activity) return <ActivityFlow activity={activity} band={band} onComplete={complete} onExit={exit} />;
  if (phase === "end")
    return (
      <ActivityEnd
        meta={meta}
        worldChanged={worldChanged}
        backKind={src.current!.kind}
        onBack={() => {
          analytics.track("activity_end_choice", { activityId: meta.id, choice: "activities" });
          router.push(src.current!.kind === "room" ? src.current!.back : src.current!.back);
        }}
        onWorld={() => {
          analytics.track("activity_end_choice", { activityId: meta.id, choice: "world" });
          router.push("/world");
        }}
        onAgain={() => {
          analytics.track("activity_end_choice", { activityId: meta.id, choice: "again" });
          setPhase("intro");
        }}
      />
    );
  return null;
}
