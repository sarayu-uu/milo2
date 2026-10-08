"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Milo } from "@/components/characters/Milo";
import { Cat } from "@/components/characters/Cat";
import { Art } from "@/components/art/Art";
import { drawObject } from "@/components/art/objects";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { Tape } from "@/components/scrapbook/primitives";
import { Logo } from "@/components/scrapbook/Logo";
import { TopBar } from "@/components/ui/TopBar";
import { SceneStage } from "@/components/world/SceneStage";
import { dailySurpriseArt } from "@/components/world/RoomObject";
import { LivingRoomArt, K, type HotId } from "./LivingRoomArt";
import { YellowSock } from "./Sock";
import { useSpeech } from "@/hooks/useSpeech";
import { useProgressStore } from "@/stores/progressStore";
import { useSessionStore } from "@/stores/sessionStore";
import { getActivityMeta } from "@/data/activities";
import { isForAge } from "@/features/curriculum/age";
import { useSettingsStore } from "@/stores/settingsStore";
import { listThemes } from "@/data/themes";
import { dayKey } from "@/lib/storage/dates";
import { analytics } from "@/lib/analytics/analytics";
import { sound } from "@/lib/audio/soundManager";
import { recordingDuration } from "@/lib/audio/recordings";
import type { SoundId } from "@/types/audio";

const pickOne = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
/** Scene units (1600×900) → % of the stage. */
const px = (x: number) => `${(x / 1600) * 100}%`;
const py = (y: number) => `${(y / 900) * 100}%`;

/** What each tappable thing in the room does. */
const HOTSPOTS: Record<HotId, { sound: SoundId; lines: string[]; activityId?: string }> = {
  window: { sound: "bird-chirp", lines: ["Somebody's clothes are waving at me.", "That water tank looks like a sleepy robot."], activityId: "shadow-mystery" },
  curtain: { sound: "whoosh", lines: ["Whoosh. Very dramatic curtain."] },
  frames: { sound: "tap", lines: ["That leaf is my favourite leaf.", "One of these is crooked. It's fine."] },
  "bird-drawing": { sound: "tape", lines: ["Someone drew me! …Is that me?"] },
  "hanging-plant": { sound: "leaves", lines: ["It grows DOWN. Is that allowed?"] },
  "plant-left": { sound: "leaves", lines: ["Leaves! Big ones."] },
  bookshelf: { sound: "page-flip", lines: ["So many books. I've read… one.", "Old Cat says there's a story in here."], activityId: "sleepy-cat-story" },
  "big-plant": { sound: "leaves", lines: ["It's taller than me. Most things are."] },
  pouf: { sound: "boing", lines: ["Squishy!"] },
  books: { sound: "page-flip", lines: ["Old Cat reads these. Upside down."] },
  "toy-block": { sound: "pop", lines: ["A block! I can stack two. Sometimes three."] },
  pencil: { sound: "pencil", lines: ["A pencil! We could draw something."], activityId: "draw-a-lamp" },
  ball: { sound: "boing", lines: ["Roll! …Come back!"] },
  car: { sound: "whoosh", lines: ["Vroom. It's faster than me."] },
  "sun-drawing": { sound: "bell", lines: ["A sunny drawing. It makes the room warmer. I think."] },
  cushions: { sound: "boing", lines: ["Comfy. Old Cat agrees."] },
};

/** Rough centre of each tappable thing (1600×900 scene units), so Milo can look at it. */
const HOT_CENTERS: Record<HotId | "cat" | "sock", { x: number; y: number }> = {
  window: { x: 940, y: 240 },
  curtain: { x: 690, y: 230 },
  frames: { x: 300, y: 250 },
  "bird-drawing": { x: 455, y: 300 },
  "hanging-plant": { x: 566, y: 200 },
  "plant-left": { x: 40, y: 300 },
  bookshelf: { x: 1500, y: 420 },
  "big-plant": { x: 1330, y: 520 },
  pouf: { x: 1546, y: 714 },
  books: { x: 320, y: 800 },
  "toy-block": { x: 577, y: 800 },
  pencil: { x: 650, y: 780 },
  ball: { x: 1194, y: 766 },
  car: { x: 1117, y: 826 },
  "sun-drawing": { x: 1296, y: 190 },
  cushions: { x: 300, y: 460 },
  cat: { x: 300, y: 380 },
  sock: { x: 440, y: 690 },
};
/** Where Milo's eyes are in the scene (standing pose). */
const MILO_EYES = { x: 903, y: 589 };
function dirTo(t: { x: number; y: number }) {
  const dx = t.x - MILO_EYES.x;
  const dy = t.y - MILO_EYES.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

type Phase = "lost" | "reaching" | "tried" | "found";

/**
 * HOME — Milo's living room as an illustrated children's book spread.
 *
 * Today's micro-story (no instructions): Milo holds ONE yellow sock and looks
 * at you. "I had TWO." Its partner pokes out from under the sofa, right
 * under the sleeping cat's tail. Tap it → Milo tries to reach, but his tummy
 * is in the way. Drag (or tap again) to pull it out → celebration.
 */
export function HomeScreen() {
  const router = useRouter();
  const today = dayKey();
  const alreadyFound = useProgressStore((s) => s.foundMystery === `${today}:sock`);
  const visitDays = useProgressStore((s) => s.visitDays.length);
  const drawing = useProgressStore((s) => s.drawing);
  const age = useSettingsStore((s) => s.age);

  const [phase, setPhase] = useState<Phase>(alreadyFound ? "found" : "lost");
  const [cheer, setCheer] = useState(0);
  const [poke, setPoke] = useState<Record<string, number>>({});
  const [offer, setOffer] = useState<string | null>(null);
  const [lookAt, setLookAt] = useState<{ x: number; y: number } | null>(null);
  const lookTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glance = (target: keyof typeof HOT_CENTERS) => {
    setLookAt(dirTo(HOT_CENTERS[target]));
    if (lookTimer.current) clearTimeout(lookTimer.current);
    lookTimer.current = setTimeout(() => setLookAt(null), 3500);
  };
  const milo = useSpeech("milo", { expression: alreadyFound ? "happy" : "confused", action: "hold" });
  // "I had TWO." on its own puzzles children, so Milo then asks for help outright
  const miloText = useRef<string | null>(null);
  miloText.current = milo.text;
  const askLater = useRef<ReturnType<typeof setTimeout> | null>(null);
  const askTwo = (action: "hold" | "headTilt") => {
    milo.say("I had TWO.", { expression: "confused", action, holdMs: Infinity });
    if (askLater.current) clearTimeout(askLater.current);
    askLater.current = setTimeout(
      () => {
        const p = phaseRef.current;
        // only if nothing else has been said in the meantime
        if (p === "found" || p === "reaching" || miloText.current !== "I had TWO.") return;
        milo.say("Can you help me find my other sock?", { expression: "curious", action: "hold", holdMs: Infinity });
      },
      (recordingDuration("I had TWO.", "milo") ?? 1500) + 900,
    );
  };
  const openedAt = useRef(Date.now());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

  /* Idle reminder: only after the screen has been quiet for a while, and never
     over another line. Any tap anywhere resets it. */
  const IDLE_MS = 14000;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const talkingRef = useRef(false);
  talkingRef.current = milo.talking;
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleIdle = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(function nudge() {
      const p = phaseRef.current;
      if (p === "found" || p === "reaching") return;
      // still mid-sentence? try again a little later instead of interrupting
      if (talkingRef.current) {
        idleTimer.current = setTimeout(nudge, 1500);
        return;
      }
      if (p === "tried") milo.say("Umm… little help?", { expression: "curious", action: "hold", holdMs: Infinity });
      else askTwo("hold");
      scheduleIdle();
    }, IDLE_MS);
  };

  useEffect(() => {
    analytics.track("home_viewed", {});
    router.prefetch("/learn");
    void sound.setSoundscape("living-room");
    sound.preload(["bell", "clap", "boing", "vo-milo-hmm", "vo-milo-i-had-two", "vo-milo-tummy", "vo-milo-two", "vo-milo-together", "vo-milo-little-help", "vo-milo-surprise"]);
    later(700, () =>
      alreadyFound
        ? milo.say("TWO socks. Thank you!", { expression: "happy", action: "hold", holdMs: 5000 })
        : askTwo("hold"),
    );
    scheduleIdle();
    const onAnyTap = () => scheduleIdle();
    window.addEventListener("pointerdown", onAnyTap);
    // Once in a while, one object gives a single tiny wiggle. Never constant motion.
    const ids = Object.keys(HOTSPOTS) as HotId[];
    const t = setInterval(() => setPoke((p) => ({ ...p, [pickOne(ids)]: Date.now() })), 14000);
    return () => {
      clearInterval(t);
      window.removeEventListener("pointerdown", onAnyTap);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      timers.current.forEach(clearTimeout);
      void sound.setSoundscape("none");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- the sock story ---------------- */

  const tryToReach = () => {
    setPhase("reaching");
    void sound.play("footstep");
    milo.say("Hmm…", { expression: "thinking", action: "peek", holdMs: Infinity });
    const tummyAt = (recordingDuration("Hmm…", "milo") ?? 1400) + 200;
    later(tummyAt, () => {
      void sound.play("boing");
      milo.say("My tummy is in the way.", { expression: "confused", action: "stumble", holdMs: Infinity });
    });
    later(tummyAt + (recordingDuration("My tummy is in the way.", "milo") ?? 2100) + 200, () => {
      setPhase("tried");
      milo.say("Umm… little help?", { expression: "curious", action: "hold", holdMs: Infinity });
    });
  };

  const pullOut = () => {
    if (phase === "found") return;
    timers.current.forEach(clearTimeout);
    setPhase("found");
    setCheer((c) => c + 1);
    void sound.play("bell");
    later(250, () => void sound.play("clap"));
    analytics.track("home_mystery_found", { item: "sock", secondsToFind: Math.round((Date.now() - openedAt.current) / 1000) });
    useProgressStore.getState().setFoundMystery(`${today}:sock`);
    milo.say("TWO!", { expression: "happy", action: "wingsUp", holdMs: 2400 });
    later(1600, () => milo.say("We found it. Together.", { expression: "proud", action: "hold", holdMs: 6000 }));
  };

  const onSockTap = () => {
    glance("sock");
    if (phase === "lost") tryToReach();
    else if (phase === "tried") pullOut();
  };

  /* ---------------- room taps ---------------- */

  const onHot = (id: HotId) => {
    const h = HOTSPOTS[id];
    void sound.play(h.sound);
    setPoke((p) => ({ ...p, [id]: Date.now() }));
    glance(id);
    analytics.track("world_object_tapped", { roomId: "living-room", objectId: id, isNew: false });
    if (phase === "reaching") return;
    const line = pickOne(h.lines);
    milo.say(line, { expression: "curious", action: "headTilt", holdMs: 4200 });
    setOffer(h.activityId ?? null);
  };

  const goPlayBook = () => {
    if (useSessionStore.getState().playbookPhase !== "idle") return;
    useSessionStore.getState().setPlaybookPhase("in");
  };

  // only offer games that fit the child's age
  const offered = offer ? getActivityMeta(offer) : undefined;
  const offerMeta = offered && isForAge(offered, age) ? offered : null;
  const holding = phase !== "reaching";
  const socksInHand = phase === "found" ? 2 : 1;

  return (
    <div className="relative h-full w-full">
      <SceneStage fit="cover">
        {/* ================= the room ================= */}
        <LivingRoomArt
          poke={poke}
          onTap={onHot}
          drawing={drawing}
          sill={
            visitDays >= 2 ? (
              <g transform="translate(1090 372)" style={{ cursor: "pointer" }} onClick={() => milo.say("Hmm, that wasn't there before.", { expression: "surprised", action: "headTilt", holdMs: 4000 })}>
                <svg width="46" height="46" viewBox="0 0 100 100" overflow="visible">
                  {drawObject(dailySurpriseArt())}
                </svg>
              </g>
            ) : undefined
          }
        />

        {/* old cat, asleep on the sofa (environmental humour only) */}
        <button
          type="button"
          aria-label="Old Cat, asleep"
          className="absolute"
          style={{ left: px(128), top: py(282), width: px(336) }}
          onClick={() => {
            void sound.play("yawn");
            glance("cat");
            milo.say("Shh. She's sleeping. She's ALWAYS sleeping.", { expression: "suspicious", action: "headTilt", holdMs: 4000 });
          }}
        >
          <Cat action="sleep" expression="sleepy" tailDangle className="h-auto w-full" />
        </button>

        {/* ---------- the second sock, poking out from under the sofa ---------- */}
        <AnimatePresence>
          {phase !== "found" && (
            <motion.button
              key="lost-sock"
              type="button"
              aria-label="A sock under the sofa"
              className="absolute touch-none"
              style={{ left: px(404), top: py(640), width: px(72), zIndex: 30, rotate: -74 }}
              drag
              dragSnapToOrigin
              dragElastic={0.6}
              whileDrag={{ scale: 1.06 }}
              onDragEnd={(_, info) => {
                if (Math.hypot(info.offset.x, info.offset.y) > 40) pullOut();
              }}
              onClick={onSockTap}
              animate={phase === "tried" ? { x: [0, 10, 0, 6, 0] } : {}}
              transition={{ duration: 0.8, repeat: phase === "tried" ? Infinity : 0, repeatDelay: 2.5 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            >
              <YellowSock className="h-auto w-full" />
            </motion.button>
          )}
        </AnimatePresence>
        {phase !== "found" && (
          // little "something's there!" pencil marks
          <svg viewBox="0 0 1600 900" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            <path d="M500 684 l18 -10 M506 706 l22 0 M500 726 l16 12" stroke={K.pencil} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          </svg>
        )}

        {/* ---------- MILO (the hero) ---------- */}
        <motion.div
          className="absolute"
          style={{ width: px(444), zIndex: 32 }}
          animate={phase === "reaching" ? { left: px(330), bottom: py(88) } : { left: px(658), bottom: py(97) }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        >
          <button
            type="button"
            aria-label="Milo"
            // only Milo himself is tappable, not the empty box around him
            className="pointer-events-none block w-full [&_svg]:pointer-events-none [&_svg_*]:[pointer-events:visiblePainted]"
            onClick={() => {
              void sound.play("coo");
              if (phase === "found") milo.say("TWO socks! Thank you!", { expression: "happy", action: "bellyPuff", holdMs: 3500 });
              else if (phase !== "reaching") askTwo("headTilt");
            }}
          >
            <Milo expression={milo.expression} action={milo.action} talking={milo.talking} flip={phase === "reaching"} lookAt={phase === "reaching" ? null : lookAt} satchel className="h-auto w-full" />
          </button>
        </motion.div>

        {/* the sock(s) Milo is holding up */}
        <AnimatePresence>
          {holding && (
            <motion.div
              key={`held-${socksInHand}`}
              className="pointer-events-none absolute"
              style={{ left: px(994), top: py(574), width: px(socksInHand === 2 ? 150 : 104), zIndex: 33 }}
              initial={{ opacity: 0, y: 10 }}
              animate={cheer && phase === "found" ? { opacity: 1, y: [0, -50, 0], rotate: [0, -8, 0] } : { opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative flex">
                <YellowSock className="h-auto w-[64%] -rotate-[6deg]" />
                {socksInHand === 2 && <YellowSock className="-ml-[24%] h-auto w-[64%] rotate-[10deg]" />}
              </div>
              {phase !== "found" && (
                <svg viewBox="0 0 60 40" className="absolute -top-[6%] -right-[40%] w-[50%]" aria-hidden>
                  <path d="M10 30 l16 -14 M18 36 l22 -4" stroke={K.pencil} strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {/* while he's reaching, his sock waits on the rug */}
        {phase === "reaching" && (
          <div className="pointer-events-none absolute" style={{ left: px(760), top: py(770), width: px(80), zIndex: 31, rotate: "80deg" }}>
            <YellowSock className="h-auto w-full" />
          </div>
        )}

        {/* speech, top-right of Milo */}
        <div className="pointer-events-none absolute" style={{ left: phase === "reaching" ? px(600) : px(990), top: py(410), zIndex: 34 }}>
          <SpeechBubble text={milo.text} size="lg" />
        </div>


        {/* paper grain over the whole spread: one sheet, one material */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "var(--tex-grain), var(--tex-fibre)", backgroundSize: "220px 220px, 160px 160px", mixBlendMode: "multiply", opacity: 0.9, zIndex: 36 }}
          aria-hidden
        />

      </SceneStage>

      {/* the scrapbook UI is pinned to the screen, so the room can fill any shape */}
      <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <div className="contents [&>*]:pointer-events-auto">
            {/* ================= scrapbook layer ================= */}
            {/* logo on a torn paper scrap, with little sprigs */}
            <div className="absolute" style={{ left: "1.4vw", top: "1.2vw", zIndex: 40 }}>
              <div className="paper torn-bottom flex justify-center px-[1.1rem] pt-[0.7rem] pb-[1rem]" style={{ "--paper-bg": "#fbf4e3", rotate: "-1.5deg" } as React.CSSProperties}>
                <Logo tagline className="text-[clamp(38px,min(4.6vw,9vh),80px)]" />
              </div>
              <Tape className="-top-2 left-[44%] rotate-3" />
              {/* a little pinned note for testers */}
              <div
                className="paper relative mt-[0.9rem] ml-[0.4rem] max-w-[min(17vw,34vh)] px-[0.8rem] py-[0.5rem] text-[clamp(11px,0.95rem,18px)] leading-snug text-ink"
                style={{ "--paper-bg": "#fff7d6", rotate: "1.5deg", boxShadow: "0 3px 8px rgba(80,50,20,0.22)" } as React.CSSProperties}
              >
                Hard refresh the app for newer updates at times
              </div>
            </div>
    
            {/* WORLD — a small selected paper tab tucked into the page */}
            <motion.button
              type="button"
              onClick={() => router.push("/world")}
              aria-label="Milo's World"
              whileTap={{ scale: 0.96 }}
              className="paper absolute flex items-center gap-[10%] px-[2.2%]"
              style={{ left: "3.6vw", bottom: "1.4vw", width: "min(15vw, 30vh)", aspectRatio: "236 / 84", zIndex: 41, "--paper-bg": "#fffdf7", rotate: "-1deg", boxShadow: "0 4px 12px rgba(80,50,20,0.28)" } as React.CSSProperties}
            >
              <svg viewBox="0 0 40 40" className="h-[52%] w-auto" aria-hidden>
                <path d="M6 20 L20 7 L34 20 V34 H6 Z" fill="#f07a52" />
                <path d="M4 21 L20 6 L36 21" stroke="#d4532e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="16" y="23" width="8" height="11" fill="#ffd54a" />
              </svg>
              <span className="font-display text-[clamp(15px,1.75rem,36px)] text-ink">World</span>
              <span className="absolute inset-x-[18%] bottom-[10%] h-[4px] rounded-full" style={{ background: "#f07a52" }} />
            </motion.button>
            {/* a little flower by the tab */}
            <svg viewBox="0 0 40 40" className="pointer-events-none absolute" style={{ left: "0.8vw", bottom: "1.8vw", width: "min(3vw, 6vh)", zIndex: 41 }} aria-hidden>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="20" cy="11" rx="6" ry="9" fill={K.terraLight} transform={`rotate(${a} 20 20)`} />
              ))}
              <circle cx="20" cy="20" r="5" fill={K.mustard} />
            </svg>
    
            {/* PLAY BOOK — a little stack of coloured dividers + a tab */}
            <PlayBookStack onOpen={goPlayBook} />
                {/* contextual activity — a small sticker, never automatic */}
            <AnimatePresence>
              {offerMeta && (
                <motion.button
                  key={offerMeta.id}
                  type="button"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  onClick={() => router.push(`/activity/${offerMeta.id}?from=home`)}
                  className="paper absolute flex items-center gap-2 px-3 py-2"
                  style={{ left: "50%", bottom: "2.5%", translateX: "-50%", zIndex: 45, "--paper-bg": "#fbf6ea" } as React.CSSProperties}
                >
                  <Art k={offerMeta.thumbnail} className="h-10 w-10" />
                  <span className="font-display text-[clamp(14px,1.2rem,24px)] text-ink">Let&apos;s try it!</span>
                  <span className="text-ink-soft">›</span>
                </motion.button>
              )}
            </AnimatePresence>
            </div>
      </div>
      <TopBar />
    </div>
  );
}

/** Coloured paper dividers peeking out; on tap they slide out across the page. */
function PlayBookStack({ onOpen }: { onOpen: () => void }) {
  const themes = listThemes();
  return (
    <>
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label="Play Book"
        whileTap={{ scale: 0.96 }}
        className="absolute"
        style={{ right: "1.4vw", bottom: "1vw", width: "min(22.5vw, 45vh)", aspectRatio: "360 / 150", zIndex: 41 }}
      >
        {/* the dividers */}
        {themes.slice(0, 7).map((t, i) => (
          <span
            key={t.id}
            className="absolute bottom-0 rounded-t-[0.5rem]"
            style={{
              left: `${2 + i * 7.5}%`,
              width: "16%",
              height: `${70 + ((i * 37) % 4) * 6}%`,
              background: t.color,
              filter: "saturate(1.45) brightness(1.08)",
              rotate: `${-10 + i * 3}deg`,
              transformOrigin: "50% 100%",
              boxShadow: "0 3px 6px rgba(90,60,30,0.25)",
            }}
          />
        ))}
        {/* the tab */}
        <span
          className="paper font-display absolute right-0 bottom-0 flex h-[52%] w-[60%] items-center justify-center gap-2 text-[clamp(15px,1.75rem,36px)] whitespace-nowrap text-ink"
          style={{ "--paper-bg": "#fffdf7", boxShadow: "0 4px 12px rgba(80,50,20,0.28)" } as React.CSSProperties}
        >
          Play Book
          <svg viewBox="0 0 24 24" className="h-[38%] w-auto" aria-hidden>
            <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </motion.button>

    </>
  );
}
