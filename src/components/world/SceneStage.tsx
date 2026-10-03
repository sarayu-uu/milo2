import type { CSSProperties, ReactNode } from "react";

/**
 * A 16:9 "page" that fits inside any landscape viewport.
 * Scenes position everything in % of this box, so layouts hold from
 * landscape phones to desktops.
 */
export function SceneStage({
  children,
  className = "",
  style,
  fit = "contain",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** contain = letterbox the whole scene; cover = fill the viewport, cropping edges. */
  fit?: "contain" | "cover";
}) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div
        className={`relative aspect-video overflow-hidden ${className}`}
        style={{ width: fit === "cover" ? "max(100%, calc(100dvh * 16 / 9))" : "min(100vw, calc(100dvh * 16 / 9))", flexShrink: 0, ...style }}
      >
        {children}
      </div>
    </div>
  );
}
