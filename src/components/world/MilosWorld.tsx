"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import type { RoomDefinition } from "@/types/world";
import type { RoomStatus } from "@/features/progression/growth";
import { Milo } from "@/components/characters/Milo";
import { Character } from "@/components/characters/Character";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { Tape } from "@/components/scrapbook/primitives";
import { TopBar } from "@/components/ui/TopBar";
import { SceneStage } from "./SceneStage";
import { RoomShell } from "./RoomShell";
import { RoomObject } from "./RoomObject";
import { LivingRoomArt } from "@/components/home/LivingRoomArt";
import { HouseBackdrop, HouseLamps, cellPlot } from "./HouseBackdrop";
import { useWorld } from "@/hooks/useWorld";
import { useSpeech } from "@/hooks/useSpeech";
import { useProgressStore } from "@/stores/progressStore";
import { analytics } from "@/lib/analytics/analytics";
import { sound } from "@/lib/audio/soundManager";

/**
 * MILO'S WORLD — the whole house, cut open like a doll's house in an old
 * picture book. Every open room is a live miniature of the real room (so
 * new objects show up here too). The next room is taped over; rooms for
 * later sit quietly with their lights off.
 */
export function MilosWorld() {
  const router = useRouter();
  const { rooms, growth, objectsFor } = useWorld();
  const milo = useSpeech("milo", { expression: "curious" });
  const [justRevealed, setJustRevealed] = useState<string[]>([]);
  const did = useRef(false);
  const open = rooms.filter((r) => r.status === "open");

  useEffect(() => {
    if (did.current) return;
    did.current = true;
    analytics.track("world_opened", { roomsAvailable: open.length, growth });
    void sound.setSoundscape("garden");
    const { announcedRooms: seen, markAnnounced } = useProgressStore.getState();
    const fresh = open.map((r) => r.room.id).filter((id) => !seen.includes(id) && id !== "living-room");
    markAnnounced(open.map((r) => r.room.id));
    if (fresh.length) {
      setJustRevealed(fresh);
      fresh.forEach((roomId) => analytics.track("room_revealed", { roomId }));
      setTimeout(() => {
        void sound.play("tape");
        milo.say("The paper fell off! There's a whole new room!", { expression: "surprised", action: "hop" });
      }, 900);
    } else {
      setTimeout(
        () => milo.say(open.length === 1 ? "This is my house. Most of it is… still a secret." : "Where shall we go?", { expression: "curious", action: "headTilt" }),
        500,
      );
    }
    return () => void sound.setSoundscape("none");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (room: RoomDefinition, status: RoomStatus) => {
    if (status !== "open") {
      void sound.play("tape");
      analytics.track("room_teaser_tapped", { roomId: room.id });
      milo.say(status === "teased" ? room.teaser || "I wonder what's behind there…" : "Shh. That part of the house is asleep.", {
        expression: "thinking",
        action: "headTilt",
      });
      return;
    }
    void sound.play("page-flip");
    router.push(room.id === "living-room" ? "/" : `/world/${room.id}`);
  };

  return (
    <div className="relative h-full w-full">
      <SceneStage>
        <HouseBackdrop />

        {/* future rooms: not in the data yet, lights off */}
        {["bedroom", "playroom", "dining"].map((id) => (
          <SleepingRoom key={id} {...cellPlot(id)!} />
        ))}

        {rooms.map(({ room, status }) => (
          <RoomCell
            key={room.id}
            room={room}
            status={status}
            reveal={justRevealed.includes(room.id)}
            objects={status === "open" && room.id !== "garden" ? objectsFor(room) : []}
            onTap={() => go(room, status)}
          />
        ))}

        <HouseLamps lit={rooms.filter((r) => r.status === "open").map((r) => r.room.id)} />

        {/* Dog on the lawn (just visiting) */}
        <div className="pointer-events-none absolute bottom-[2%] left-[86%] w-[10%]">
          <Character id="dog" expression="happy" action="idle" flip className="h-auto w-full" />
        </div>

        {/* Milo on the garden path, with his (tiny) satchel */}
        <div className="absolute bottom-[1%] left-[1.5%] z-30 w-[11%]">
          <div className="absolute bottom-[96%] left-0 w-[150%] max-w-[15rem]">
            <SpeechBubble text={milo.text} size="sm" />
          </div>
          <button
            type="button"
            aria-label="Milo"
            className="block w-full"
            onClick={() => {
              void sound.play("coo");
              milo.say("Pick a room. Any room. (Well — an open one.)", { expression: "happy", action: "waddle" });
            }}
          >
            <Milo expression={milo.expression} action={milo.action} talking={milo.talking} satchel className="h-auto w-full" />
          </button>
        </div>
      </SceneStage>
      <TopBar back="/" />
    </div>
  );
}

function RoomCell({
  room,
  status,
  reveal,
  objects,
  onTap,
}: {
  room: RoomDefinition;
  status: RoomStatus;
  reveal: boolean;
  objects: ReturnType<ReturnType<typeof useWorld>["objectsFor"]>;
  onTap: () => void;
}) {
  const plot = cellPlot(room.id) ?? room.house;
  if (status === "hidden" && room.id !== "garden") {
    return <SleepingRoom {...plot} onTap={onTap} label={room.name} />;
  }
  const { x, y, w, h } = plot;
  const garden = room.id === "garden";
  const covered = status === "teased" || reveal;

  return (
    <motion.button
      type="button"
      onClick={onTap}
      aria-label={status === "open" ? room.name : "A taped-up room"}
      whileTap={{ scale: 0.98 }}
      className="absolute z-10 overflow-visible"
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
    >
      {/* the live miniature of the room */}
      {!garden && status === "open" && (
        <div className="absolute inset-0 overflow-hidden" style={{ containerType: "size" }} inert>
          {/* cover the cell with a 16:9 room, anchored to the floor */}
          <div
            className="absolute bottom-0 left-1/2 aspect-video -translate-x-1/2"
            style={{ width: "max(100cqw, calc(100cqh * 16 / 9))" }}
          >
            {room.id === "living-room" ? (
              <LivingRoomArt />
            ) : (
              <>
                <RoomShell palette={room.palette} />
                {objects.map((o) => (
                  <RoomObject key={o.id} obj={o} still />
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* taped sheet over a room that isn't open yet */}
      <AnimatePresence>
        {covered && (
          <motion.div
            key="cover"
            className="paper absolute inset-[-2%] flex items-center justify-center"
            style={{ "--paper-bg": "#efe4cc", transformOrigin: "top left", borderRadius: 2 } as React.CSSProperties}
            initial={false}
            animate={reveal ? { rotate: [0, -4, 18, 80], y: [0, -6, 40, 500], opacity: [1, 1, 1, 0] } : { rotate: -1 }}
            transition={reveal ? { duration: 1.6, delay: 1, ease: "easeIn" } : undefined}
          >
            <span className="font-hand text-[3rem] text-ink-soft/70">?</span>
            <span className="font-hand absolute right-[6%] bottom-[6%] text-[1.05rem] text-ink-soft">do not open (yet)</span>
            <Tape className="-top-2 left-[6%] -rotate-12" />
            <Tape className="-top-2 right-[6%] rotate-12" variant="pink" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* a masking-tape name label */}
      {status === "open" && (
        <span
          className="font-display absolute -top-[0.9rem] left-[6%] rotate-[-3deg] px-2.5 py-0.5 text-[clamp(13px,1.05rem,20px)] text-ink shadow-[var(--shadow-pressed)]"
          style={{ background: "rgba(236,220,170,0.95)" }}
        >
          {room.name}
        </span>
      )}

      {garden && status === "open" && (
        <div className="pointer-events-none absolute right-[4%] bottom-[16%] w-[38%]">
          <Character id="snail" expression="happy" action="idle" className="h-auto w-full" />
        </div>
      )}
    </motion.button>
  );
}

/** A room for later: lights off, curtains drawn. */
function SleepingRoom({ x, y, w, h, onTap, label }: { x: number; y: number; w: number; h: number; onTap?: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={label ? `${label} (asleep)` : "A sleeping room"}
      className="absolute z-10"
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
      tabIndex={onTap ? 0 : -1}
    >
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <rect width={100} height={60} fill="#ece4f0" />
        <rect y={46} width={100} height={14} fill="#e2d8e6" />
        {/* soft curtains drawn: this room is asleep */}
        <path d="M0 0 H50 C46 20 49 40 45 60 H0 Z" fill="#ddd3ea" />
        <path d="M100 0 H50 C54 20 51 40 55 60 H100 Z" fill="#d6cbe5" />
      </svg>
      <span className="font-hand absolute inset-x-0 top-[38%] text-center text-[1.3rem] text-ink-soft/50">z z z</span>
    </button>
  );
}
