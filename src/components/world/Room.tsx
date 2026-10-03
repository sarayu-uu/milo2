"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import type { RoomDefinition, RoomObjectDefinition } from "@/types/world";
import { Milo } from "@/components/characters/Milo";
import { Character } from "@/components/characters/Character";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { PaperButton } from "@/components/scrapbook/primitives";
import { Art } from "@/components/art/Art";
import { TopBar } from "@/components/ui/TopBar";
import { SceneStage } from "./SceneStage";
import { RoomShell } from "./RoomShell";
import { RoomObject } from "./RoomObject";
import { useWorld } from "@/hooks/useWorld";
import { useSpeech } from "@/hooks/useSpeech";
import { useProgressStore } from "@/stores/progressStore";
import { meetsRule } from "@/features/progression/growth";
import { getActivityMeta } from "@/data/activities";
import { analytics } from "@/lib/analytics/analytics";
import { sound } from "@/lib/audio/soundManager";

const pickOne = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

/**
 * A room in Milo's World. Fully data-driven from RoomDefinition:
 * shell, objects (with reveal rules), visitors, Milo, contextual activities.
 */
export function Room({ room }: { room: RoomDefinition }) {
  const router = useRouter();
  const { objectsFor, snap, growth } = useWorld();
  const recordRoomVisit = useProgressStore((s) => s.recordRoomVisit);
  const markSeen = useProgressStore((s) => s.markSeen);
  const milo = useSpeech("milo", { expression: "curious" });
  const [offer, setOffer] = useState<{ activityId: string; objectId: string } | null>(null);
  const [miloX, setMiloX] = useState(room.miloX);

  const objects = objectsFor(room);
  // Freeze which objects are "new" at the moment the child walks in.
  const newIds = useRef<Set<string> | null>(null);
  if (newIds.current === null) newIds.current = new Set(objects.filter((o) => o.isNew).map((o) => o.id));

  const visitors = useMemo(
    () => (room.visitors ?? []).filter((v) => meetsRule(v.reveal, snap, growth)),
    [room.visitors, snap, growth],
  );

  // Enter the room: record the visit, greet, notice new things.
  useEffect(() => {
    const prevVisits = useProgressStore.getState().roomVisits[room.id] ?? 0;
    recordRoomVisit(room.id);
    analytics.track("room_opened", { roomId: room.id, visitCount: prevVisits + 1, firstVisit: prevVisits === 0 });
    void sound.setSoundscape(room.soundscape);

    const fresh = [...newIds.current!];
    const t = setTimeout(() => {
      if (fresh.length) {
        const first = objects.find((o) => o.id === fresh[0]);
        if (first) setMiloX(Math.min(80, Math.max(16, first.x + first.w / 2 - 6)));
        milo.say("Wait… was that there yesterday?", { expression: "surprised", action: "headTilt" });
      } else {
        milo.say(prevVisits === 0 ? room.greetings[0] : pickOne(room.greetings), { expression: "curious", action: "idle" });
      }
    }, 600);

    // Everything visible now counts as seen for next time.
    markSeen(objects.map((o) => o.id));
    return () => {
      clearTimeout(t);
      void sound.setSoundscape("none");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id]);

  const onObject = (obj: RoomObjectDefinition) => {
    const it = obj.interaction;
    if (!it) return;
    if (it.sound) void sound.play(it.sound);
    const isNew = newIds.current!.has(obj.id);
    analytics.track("world_object_tapped", { roomId: room.id, objectId: obj.id, isNew });
    if (isNew) {
      analytics.track("world_change_noticed", { roomId: room.id, objectId: obj.id });
      newIds.current!.delete(obj.id);
    }
    setMiloX(Math.min(78, Math.max(14, obj.x + obj.w / 2 - 6)));
    if (it.milo?.length) milo.say(pickOne(it.milo), { expression: it.expression ?? "curious", action: "walk", holdMs: 9000 });
    setTimeout(() => milo.pose({ action: "idle" }), 900);
    setOffer(it.activityId ? { activityId: it.activityId, objectId: obj.id } : null);
  };

  const onMilo = () => {
    void sound.play("coo");
    milo.say(pickOne(["Hello!", "That tickles.", "I'm a pigeon. Did you know?", "Coo. Sorry. That just comes out."]), {
      expression: "happy",
      action: pickOne(["waddle", "bellyPuff", "headTilt"] as const),
    });
  };

  const offerMeta = offer ? getActivityMeta(offer.activityId) : null;
  const outdoor = room.id === "garden";
  const back = objects.filter((o) => o.layer !== "front");
  const front = objects.filter((o) => o.layer === "front");

  return (
    <div className="relative h-full w-full">
      <SceneStage className="paper">
        <RoomShell palette={room.palette} outdoor={outdoor} />

        {back.map((o) => (
          <RoomObject key={o.id} obj={o} isNew={newIds.current!.has(o.id)} onTap={onObject} />
        ))}

        {visitors.map((v) => (
          <div key={v.id} className="absolute z-[15]" style={{ left: `${v.x}%`, bottom: "16%", width: v.id === "snail" ? "11%" : "14%" }}>
            <Character id={v.id} action={v.id === "cat" ? "sleep" : "idle"} expression={v.id === "cat" ? "sleepy" : "neutral"} flip={v.x > 50} className="h-auto w-full" />
          </div>
        ))}

        {/* Milo */}
        <motion.div
          className="absolute z-20"
          style={{ bottom: "6%", width: "20%" }}
          animate={{ left: `${miloX}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
        >
          <div className="absolute bottom-[96%] left-[40%] w-[230%] max-w-[26rem]">
            <SpeechBubble text={milo.text} />
          </div>
          <button type="button" aria-label="Milo" className="block w-full" onClick={onMilo}>
            <Milo expression={milo.expression} action={milo.action} talking={milo.talking} className="h-auto w-full" />
          </button>
        </motion.div>

        {front.map((o) => (
          <RoomObject key={o.id} obj={o} isNew={newIds.current!.has(o.id)} onTap={onObject} />
        ))}

        {/* Contextual activity: a small sticker invitation, never automatic */}
        <AnimatePresence>
          {offerMeta && (
            <motion.div
              key={offerMeta.id}
              initial={{ opacity: 0, y: 20, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute right-[3%] bottom-[5%] z-40"
            >
              <PaperButton
                size="lg"
                color="#d8b45e"
                sfx="page-flip"
                onClick={() => router.push(`/activity/${offerMeta.id}?from=room:${room.id}`)}
                aria-label={`Play ${offerMeta.title}`}
              >
                <Art k={offerMeta.thumbnail} className="h-12 w-12" />
                <span>Let&apos;s try it!</span>
              </PaperButton>
            </motion.div>
          )}
        </AnimatePresence>
      </SceneStage>
      <TopBar back="/world" />
    </div>
  );
}
