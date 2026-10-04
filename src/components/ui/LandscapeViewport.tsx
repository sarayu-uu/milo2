"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A real landscape browsing viewport keeps viewport units, media queries and
 * pointer coordinates correct when the outer phone screen remains upright.
 * Only the outer window owns this frame; the app inside runs once.
 */
export function LandscapeViewport({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"loading" | "app" | "frame">("loading");
  const [source, setSource] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (window.parent !== window) { setMode("app"); return; }
    const mobile = window.matchMedia("(hover: none) and (pointer: coarse)");
    const portrait = window.matchMedia("(orientation: portrait)");
    let usingFrame = false;
    const update = () => {
      // Responsive desktop previews may retain a mouse pointer. Portrait size
      // also activates the landscape viewport, including after a live resize.
      if (usingFrame) return;
      if (mobile.matches || portrait.matches) {
        usingFrame = true;
        setSource(window.location.href);
        setMode("frame");
      } else setMode("app");
    };
    update();
    mobile.addEventListener("change", update);
    portrait.addEventListener("change", update);
    return () => {
      mobile.removeEventListener("change", update);
      portrait.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (mode !== "frame") return;
    const syncLocation = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type !== "milomi:location" || typeof event.data.href !== "string") return;
      try {
        const location = new URL(event.data.href);
        if (location.origin !== window.location.origin) return;
        // Preserve the frame and its game state while keeping refresh/deep links correct.
        window.history.replaceState(null, "", location.pathname + location.search + location.hash);
      } catch { /* Ignore invalid navigation messages. */ }
    };
    window.addEventListener("message", syncLocation);
    return () => window.removeEventListener("message", syncLocation);
  }, [mode]);

  if (mode === "loading") return <div className="landscape-viewport-loading" aria-label="Opening Milomi" />;
  if (mode === "app") return children;
  return (
    <div className="landscape-viewport">
      <iframe ref={frame} src={source} title="Milomi landscape play" className="landscape-viewport-frame" allow="autoplay; fullscreen" />
    </div>
  );
}
