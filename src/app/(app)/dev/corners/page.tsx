"use client";

import type { BackdropKey } from "@/types/activity";
import { Backdrop } from "@/components/activities/steps/Backdrop";
import { SceneStage } from "@/components/world/SceneStage";

const CORNERS: BackdropKey[] = ["living-room", "kitchen", "washroom", "garden"];

/** Internal: the four activity corners side by side (not linked from the child UI). ?k=kitchen shows one. */
export default function CornerWorkbench() {
  const one = new URLSearchParams(window.location.search).get("k") as BackdropKey | null;
  if (one) {
    return (
      <SceneStage>
        <Backdrop k={one} />
      </SceneStage>
    );
  }
  return (
    <div className="grid h-full grid-cols-2 gap-2 overflow-auto p-2">
      {CORNERS.map((k) => (
        <div key={k} className="relative aspect-video overflow-hidden rounded">
          <Backdrop k={k} />
          <span className="absolute top-2 left-2 rounded bg-paper/90 px-2 text-sm">{k}</span>
        </div>
      ))}
    </div>
  );
}
