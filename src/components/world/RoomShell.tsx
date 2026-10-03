"use client";

import { useId } from "react";
import type { RoomDefinition } from "@/types/world";

/**
 * The cut-paper room box: patterned wallpaper, skirting, floorboards,
 * a few pencil marks. Drawn from the room palette so new rooms need no
 * new backdrop art.
 */
export function RoomShell({ palette, outdoor = false }: { palette: RoomDefinition["palette"]; outdoor?: boolean }) {
  const id = useId().replace(/:/g, "");
  const motif = palette.motif ?? "stripe";
  const fy = palette.floorY ?? 640;
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id={`wall-${id}`} width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill={palette.wall} />
          {motif === "stripe" && <rect width="60" height="120" fill={palette.wallAccent} opacity="0.45" />}
          {motif === "sprig" && (
            <g fill="none" stroke={palette.wallAccent} strokeWidth="4" strokeLinecap="round" opacity="0.8">
              <path d="M30 40 q8 -14 0 -26 M30 40 q-10 -6 -14 -16 M30 40 q10 -4 16 -14" />
              <path d="M90 100 q8 -14 0 -26 M90 100 q-10 -6 -14 -16 M90 100 q10 -4 16 -14" />
              <circle cx="90" cy="30" r="4" fill={palette.wallAccent} stroke="none" />
              <circle cx="30" cy="92" r="4" fill={palette.wallAccent} stroke="none" />
            </g>
          )}
          {motif === "tile" && <path d="M0 0H120V120H0Z M60 0V120 M0 60H120" fill="none" stroke={palette.wallAccent} strokeWidth="4" />}
          {motif === "dots" && (
            <g fill={palette.wallAccent}>
              <circle cx="30" cy="30" r="6" />
              <circle cx="90" cy="90" r="6" />
            </g>
          )}
        </pattern>
        <pattern id={`floor-${id}`} width="240" height="70" patternUnits="userSpaceOnUse">
          <rect width="240" height="70" fill={palette.floor} />
          <path d="M0 69H240M150 0V70" stroke={palette.floorAccent} strokeWidth="2" opacity="0.7" />
        </pattern>
      </defs>
      {outdoor ? (
        <>
          <rect width="1600" height="620" fill={palette.wall} />
          <path d="M120 140 c-40 0-50-50-10-60 10-40 70-40 80-10 40-10 70 30 40 60 Z" fill="#fbf8f1" opacity="0.85" />
          <path d="M980 110 c-40 0-50-50-10-60 10-40 70-40 80-10 40-10 70 30 40 60 Z" fill="#fbf8f1" opacity="0.75" />
          <path d="M0 600 C300 560 700 590 1000 570 C1250 556 1450 580 1600 566 V900 H0 Z" fill={palette.floor} />
          <path d="M0 640 C300 610 700 640 1000 620 C1250 606 1450 630 1600 616" stroke={palette.floorAccent} strokeWidth="6" fill="none" />
        </>
      ) : (
        <>
          <rect width="1600" height={fy} fill={`url(#wall-${id})`} />
          {/* a slightly uneven, hand-cut floor edge */}
          <path d={`M0 ${fy} L400 ${fy - 4} L900 ${fy + 2} L1600 ${fy - 3} V900 H0 Z`} fill={`url(#floor-${id})`} />
          <path d={`M0 ${fy - 18} L1600 ${fy - 16} V${fy + 4} L0 ${fy + 2} Z`} fill={palette.floorAccent} opacity="0.9" />
          <path d={`M0 ${fy + 3} L800 ${fy + 6} L1600 ${fy + 1}`} stroke="#a88f72" strokeWidth="1.5" opacity="0.3" fill="none" />
        </>
      )}
    </svg>
  );
}
