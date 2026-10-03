"use client";

import { useSyncExternalStore } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True when either the system or the in-app setting asks for less motion. */
export function useReducedMotion() {
  const pref = useSettingsStore((s) => s.motion);
  const system = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  if (pref === "reduced") return true;
  if (pref === "full") return false;
  return system;
}
