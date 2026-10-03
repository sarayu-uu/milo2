import type { AnalyticsEventName, AnalyticsEvents } from "./events";
import { createConsoleProvider, createPostHogProvider, type AnalyticsProvider } from "./providers";

/**
 * Milomi's single analytics entry point.
 *
 *   analytics.track("activity_started", { activityId, ... })
 *
 * - Queues events until the provider is ready.
 * - Adds a few non-identifying super-properties (app version, viewport bucket).
 * - Tracks session duration and fires `session_ended` with a beacon.
 */
const APP_VERSION = "0.1.0-mvp";

type Queued = { event: string; props: Record<string, unknown>; beacon?: boolean };

/** Reads PostHog settings. Accepts the newer PROJECT_TOKEN name too. */
export function analyticsConfig() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || "";
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
  return { key, host, connected: !!key };
}

class Analytics {
  private provider: AnalyticsProvider | null = null;
  private queue: Queued[] = [];
  private ready = false;
  private sessionStart = 0;
  private screens = 0;
  private sessionEnded = false;
  private onceKeys = new Set<string>();

  init() {
    if (this.provider || typeof window === "undefined") return;
    const { key, host } = analyticsConfig();
    if (!key && process.env.NODE_ENV !== "production") {
      console.warn(
        "[analytics] NEXT_PUBLIC_POSTHOG_KEY is not set, so events are only logged to this console and never sent to PostHog. " +
          "Add it to .env.local (see README → Analytics) and restart the dev server.",
      );
    }
    this.provider = key ? createPostHogProvider(key, host) : createConsoleProvider();

    this.sessionStart = Date.now();
    this.provider
      .init()
      .then(() => {
        this.provider?.register({ app_version: APP_VERSION, viewport: viewportBucket() });
        this.ready = true;
        this.queue.forEach((q) => this.provider?.capture(q.event, q.props, { beacon: q.beacon }));
        this.queue = [];
      })
      .catch(() => {
        // Analytics must never break play.
        this.provider = createConsoleProvider();
        this.ready = true;
      });

    const end = () => this.endSession();
    window.addEventListener("pagehide", end);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") end();
      else if (this.sessionEnded) {
        // Came back to the tab: start a fresh session window.
        this.sessionEnded = false;
        this.sessionStart = Date.now();
        this.screens = 0;
      }
    });
  }

  track<E extends AnalyticsEventName>(event: E, props: AnalyticsEvents[E], opts?: { beacon?: boolean }) {
    const payload = props as Record<string, unknown>;
    if (!this.ready || !this.provider) {
      this.queue.push({ event, props: payload, beacon: opts?.beacon });
      return;
    }
    this.provider.capture(event, payload, opts);
  }

  /** Track an event only once per page-load for a given key (e.g. theme_viewed). */
  trackOnce<E extends AnalyticsEventName>(key: string, event: E, props: AnalyticsEvents[E]) {
    if (this.onceKeys.has(key)) return;
    this.onceKeys.add(key);
    this.track(event, props);
  }

  screenViewed() {
    this.screens += 1;
  }

  private endSession() {
    if (this.sessionEnded || !this.sessionStart) return;
    this.sessionEnded = true;
    this.track(
      "session_ended",
      { durationSec: Math.round((Date.now() - this.sessionStart) / 1000), screens: this.screens },
      { beacon: true },
    );
  }
}

function viewportBucket() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const shape = h < 520 ? "phone" : w < 1100 ? "tablet" : "desktop";
  return `${shape}-${w > h ? "landscape" : "portrait"}`;
}

export const analytics = new Analytics();
