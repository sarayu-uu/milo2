"use client";

import { motion } from "motion/react";
import { Clock, Package, Users } from "lucide-react";
import type { ActivityMeta } from "@/types/activity";
import { Art } from "@/components/art/Art";
import { Paper, Tape } from "@/components/scrapbook/primitives";
import { CARD_WIDTH } from "./sizes";
import { PARTICIPATION_LABEL, materialsLabel } from "@/features/activities/labels";

/** A polaroid-style activity card. Big tap target, picture first, words second. */
export function ActivityCard({
  activity,
  color,
  done,
  index,
  onOpen,
}: {
  activity: ActivityMeta;
  color: string;
  done: boolean;
  index: number;
  onOpen: () => void;
}) {
  const tilt = [-1.6, 1.2, -0.8, 1.8][index % 4];
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={activity.title}
      initial={{ opacity: 0, y: 18, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{ delay: 0.12 + index * 0.07, type: "spring", stiffness: 220, damping: 24 }}
      whileTap={{ scale: 0.96, y: 3 }}
      className="relative shrink-0 text-left"
      style={{ width: CARD_WIDTH }}
    >
      <Paper className="flex flex-col p-[0.7rem] pb-3" color="#fbf8f1">
        <div className="construction relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[0.35rem]" style={{ "--paper-bg": color } as React.CSSProperties}>
          <Art k={activity.thumbnail} className="h-[78%] w-[78%]" />
          {/* who it's for: the youngest age it's meant for */}
          <span className="absolute top-1.5 left-1.5 rounded-full bg-cream/95 px-2 py-0.5 text-[max(10.5px,0.78rem)] leading-tight font-bold text-ink shadow-sm">
            Age {activity.ageMin}+
          </span>
          {done && (
            <span className="stamp font-hand absolute right-1.5 bottom-1.5 rotate-[-8deg] text-[0.85rem] leading-none text-moss">
              <span className="block px-1.5 py-1">tried it!</span>
            </span>
          )}
        </div>
        <span className="font-display mt-2 block text-[1.45rem] leading-tight text-ink">{activity.title}</span>
        <span className="mt-0.5 block text-[max(11px,0.92rem)] leading-snug text-ink-soft">{activity.tagline}</span>
        {/* grown-up commitment, at a glance */}
        <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[max(10.5px,0.8rem)] text-ink-soft">
          <Meta icon={<Clock className="h-3.5 w-3.5" />} text={`${activity.duration} min`} />
          <Meta icon={<Users className="h-3.5 w-3.5" />} text={PARTICIPATION_LABEL[activity.parentParticipation]} />
          <Meta icon={<Package className="h-3.5 w-3.5" />} text={materialsLabel(activity)} />
        </span>
      </Paper>
      <Tape className="-top-2 left-1/2 -translate-x-1/2 rotate-2" variant={index % 2 ? "blue" : undefined} />
    </motion.button>
  );
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {icon}
      {text}
    </span>
  );
}
