import type { BackdropKey } from "@/types/activity";
import { RoomShell } from "@/components/world/RoomShell";
import { getRoom } from "@/data/worlds/rooms";
import { ROOM_ART } from "@/components/world/roomArt";

/** Story/step backdrops. Room backdrops reuse the world's room shells. */
export function Backdrop({ k }: { k: BackdropKey }) {
  switch (k) {
    case "living-room":
    case "kitchen":
    case "garden": {
      const room = getRoom(k)!;
      const win = k === "kitchen" ? ROOM_ART["small-window"] : ROOM_ART["window-city"];
      return (
        <div className="absolute inset-0">
          <RoomShell palette={room.palette} outdoor={k === "garden"} />
          {k !== "garden" && (
            <svg viewBox={`0 0 ${win.w} ${win.h}`} className="absolute top-[8%] left-[58%] h-auto w-[18%] opacity-90" aria-hidden>
              {win.draw()}
            </svg>
          )}
          {k === "garden" && (
            <svg viewBox={`0 0 ${ROOM_ART.fence.w} ${ROOM_ART.fence.h}`} className="absolute top-[42%] left-0 h-auto w-full" aria-hidden>
              {ROOM_ART.fence.draw()}
            </svg>
          )}
        </div>
      );
    }
    case "shadow-wall":
      return (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <radialGradient id="lampglow" cx="10%" cy="78%" r="80%">
              <stop offset="0%" stopColor="#fbf0cf" />
              <stop offset="55%" stopColor="#ecdcb8" />
              <stop offset="100%" stopColor="#c9b993" />
            </radialGradient>
          </defs>
          <rect width="1600" height="680" fill="url(#lampglow)" />
          <rect y="680" width="1600" height="220" fill="#b39b74" />
          <path d="M0 680 H1600" stroke="#3a3833" strokeWidth="3" opacity="0.25" />
        </svg>
      );
    case "pavement":
      return (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <rect width="1600" height="900" fill="#dfe9ec" />
          {/* apartment blocks, a small shop, a bus stop */}
          <rect x="60" y="180" width="260" height="440" fill="#b9c4cb" />
          <rect x="340" y="260" width="200" height="360" fill="#c9b8a6" />
          <rect x="560" y="320" width="300" height="300" fill="#d8b45e" opacity="0.6" />
          <rect x="560" y="300" width="300" height="40" fill="#b46b56" />
          <rect x="900" y="140" width="240" height="480" fill="#a7b2a0" />
          <rect x="1180" y="240" width="360" height="380" fill="#c3b1c9" opacity="0.8" />
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={90 + (i % 4) * 56} y={220 + Math.floor(i / 4) * 90} width="30" height="40" fill="#f1e5c2" opacity="0.8" />
          ))}
          <rect y="620" width="1600" height="90" fill="#cfc7b6" />
          <path d="M0 620 H1600 M0 710 H1600" stroke="#3a3833" strokeWidth="3" opacity="0.2" />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M${i * 140} 620 V710`} stroke="#3a3833" strokeWidth="2" opacity="0.12" />
          ))}
          <rect y="710" width="1600" height="190" fill="#8f949a" />
          <path d="M0 805 H1600" stroke="#f3ead2" strokeWidth="8" strokeDasharray="60 50" />
        </svg>
      );
    case "night":
      return (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <rect width="1600" height="640" fill="#5f6b86" />
          <rect x="980" y="90" width="380" height="300" rx="10" fill="#2f3a55" stroke="#e6d6b4" strokeWidth="16" />
          <circle cx="1240" cy="190" r="50" fill="#f1d98c" />
          <circle cx="1090" cy="160" r="5" fill="#fbf8f1" />
          <circle cx="1160" cy="300" r="4" fill="#fbf8f1" />
          <circle cx="1320" cy="320" r="5" fill="#fbf8f1" />
          <rect y="640" width="1600" height="260" fill="#7a6650" />
          <ellipse cx="800" cy="760" rx="520" ry="70" fill="#8a5f62" opacity="0.6" />
        </svg>
      );
    case "paper":
    default:
      return <div className="paper absolute inset-0 rounded-none" />;
  }
}
