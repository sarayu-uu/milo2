"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CharacterAction, CharacterId } from "@/types/character";
import { CHARACTERS } from "@/data/characters";
import { Character } from "@/components/characters/Character";
import { SpeechBubble } from "@/components/scrapbook/SpeechBubble";
import { Label } from "@/components/scrapbook/primitives";
import { TopBar } from "@/components/ui/TopBar";
import { LivingCorner } from "@/components/world/scenes/corners";
import { useSpeech } from "@/hooks/useSpeech";
import { sound } from "@/lib/audio/soundManager";
import { analytics } from "@/lib/analytics/analytics";

/**
 * "Meet the friends": little ones don't always know what a pigeon or a
 * squirrel is. Everyone is somewhere in Milo's living room; tap one and they
 * say what animal they are and where they live.
 *
 * Positions are in the living room's 1600×900 drawing: x = centre, y = where
 * their feet are, h = how tall they are.
 */
const FRIENDS: { speaker: CharacterId; x: number; y: number; h: number; flip?: boolean; line: string; action: CharacterAction; rest?: CharacterAction }[] = [
  {
    speaker: "milo",
    x: 600,
    y: 866,
    h: 410,
    line: "I'm Milo! I'm a pigeon. That's a kind of bird. I live up on the rooftops in the city.",
    action: "wingsUp",
  },
  {
    // perched on the arm of the sofa
    speaker: "squirrel",
    x: 690,
    y: 452,
    h: 170,
    flip: true,
    line: "I'm Squirrel! A squirrel is a small, furry animal with a big, fluffy tail. I live in a nest, high up in a tree.",
    action: "hop",
  },
  {
    // on the window sill
    speaker: "snail",
    x: 1010,
    y: 492,
    h: 110,
    line: "I'm Snail. A snail is a tiny, slow animal. I carry my house on my back! I live in the garden, under the leaves.",
    action: "headTilt",
  },
  {
    // asleep on the sofa, of course
    speaker: "cat",
    x: 430,
    y: 580,
    h: 245,
    line: "I'm Old Cat. A cat is a soft, furry pet. I live in a cosy house, and I like to sleep. A lot.",
    action: "idle",
    rest: "sleep",
  },
  {
    speaker: "dog",
    x: 1090,
    y: 862,
    h: 245,
    flip: true,
    line: "I'm Dog! A dog is a friendly, furry pet who loves to run. I live in a house with a big garden!",
    action: "run",
  },
];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function MeetFriends() {
  // each friend speaks in their own voice; one at a time
  const voices = {
    milo: useSpeech("milo", { expression: "happy" }),
    squirrel: useSpeech("squirrel", { expression: "happy" }),
    snail: useSpeech("snail", { expression: "neutral" }),
    cat: useSpeech("cat", { expression: "sleepy" }),
    dog: useSpeech("dog", { expression: "happy" }),
  } satisfies Record<CharacterId, ReturnType<typeof useSpeech>>;
  const [speaker, setSpeaker] = useState<CharacterId>("milo");

  useEffect(() => {
    analytics.track("characters_opened", {});
    const t = setTimeout(() => voices.milo.say("Meet my friends! Tap on one.", { expression: "happy", action: "headTilt", holdMs: 5000 }), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tap = (f: (typeof FRIENDS)[number]) => {
    void sound.play("pop");
    setSpeaker(f.speaker);
    voices[f.speaker].say(f.line, { expression: f.speaker === "cat" ? "sleepy" : "happy", action: f.action, holdMs: 9000 });
    analytics.track("character_tapped", { characterId: f.speaker });
  };

  const v = voices[speaker];

  return (
    <div className="relative h-full w-full overflow-hidden bg-paper [container-type:size]">
      {/* the room and everyone in it share one 16:9 box that covers the screen, so they stay in their places */}
      <div className="absolute top-1/2 left-1/2 aspect-[16/9] w-[max(100cqw,177.78cqh)] -translate-x-1/2 -translate-y-1/2">
        <LivingCorner />
        {FRIENDS.map((f, i) => {
          const fv = voices[f.speaker];
          const talking = speaker === f.speaker && fv.talking;
          return (
            <motion.button
              key={f.speaker}
              type="button"
              aria-label={`${CHARACTERS[f.speaker].name}`}
              onClick={() => tap(f)}
              whileTap={{ scale: 0.94 }}
              data-hint={f.speaker === "squirrel" ? "tap" : undefined}
              className="absolute -translate-x-1/2 [&_svg]:pointer-events-none [&_svg_*]:[pointer-events:visiblePainted]"
              style={{ left: pct(f.x, 1600), bottom: pct(900 - f.y, 900), height: pct(f.h, 900), aspectRatio: "1.1 / 1" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            >
              <Character
                id={f.speaker}
                expression={fv.expression}
                action={talking || (speaker === f.speaker && fv.text) ? fv.action : (f.rest ?? "idle")}
                talking={talking}
                flip={f.flip}
                className="h-full w-full"
              />
            </motion.button>
          );
        })}
      </div>

      <TopBar back="/" />
      <div className="pointer-events-none absolute top-[4%] left-1/2 -translate-x-1/2">
        <Label className="text-[1.8rem]" tilt={-1.5}>
          Meet the friends
        </Label>
      </div>

      {/* whoever is talking */}
      <div className="pointer-events-none absolute top-[15%] right-[3%] z-30 w-[min(32rem,44%)]">
        <AnimatePresence mode="wait">
          {v.text && (
            <motion.div key={speaker} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SpeechBubble text={v.text} tail="none" speakerName={CHARACTERS[speaker].name} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
