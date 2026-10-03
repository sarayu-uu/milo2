import type { SoundId } from "@/types/audio";

/** Friendly names resolve through the existing registry, including its WAV fallback.
 * Add recorded `src` files there when available; callers do not need to change.
 */
export const SOUNDS = {
  milo: {
    mrrp: "milo-mrrp",
    curious: "milo-curious",
    happy: "milo-happy",
    surprised: "milo-surprised",
    highFive: "milo-high-five",
  },
  interaction: {
    paperOpen: "page-flip",
    tap: "tap",
    clap: "clap",
    thump: "wood-click",
  },
  environment: {
    livingRoom: "amb-living-room",
    garden: "amb-garden",
    cityWindow: "amb-city-window",
  },
  activities: {
    sockPull: "sock-pull",
    crayon: "pencil",
  },
} as const satisfies Record<string, Record<string, SoundId>>;
