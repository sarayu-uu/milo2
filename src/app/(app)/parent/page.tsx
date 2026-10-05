"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/sessionStore";
import { ParentGate } from "@/components/parent/ParentGate";
import { ParentDashboard } from "@/components/parent/ParentDashboard";

export default function ParentPage() {
  const router = useRouter();
  const unlocked = useSessionStore((s) => s.parentUnlocked);
  const setUnlocked = useSessionStore((s) => s.setParentUnlocked);

  // Re-lock whenever the grown-up area is left.
  useEffect(() => () => setUnlocked(false), [setUnlocked]);

  const exit = () => router.push("/");
  return unlocked ? <ParentDashboard onExit={exit} /> : <ParentGate onPass={() => setUnlocked(true)} onCancel={exit} />;
}
