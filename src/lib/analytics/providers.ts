/**
 * Analytics providers. The rest of the app never imports posthog-js directly;
 * swapping or adding a provider happens only here.
 */
export interface AnalyticsProvider {
  name: string;
  init(): Promise<void>;
  capture(event: string, props: Record<string, unknown>, opts?: { beacon?: boolean }): void;
  register(props: Record<string, unknown>): void;
}

export function createConsoleProvider(): AnalyticsProvider {
  return {
    name: "console",
    async init() {},
    capture(event, props) {
      if (process.env.NODE_ENV !== "production") {
        console.debug(`%c[analytics] ${event}`, "color:#7e8f63", props);
      }
    },
    register() {},
  };
}

export function createPostHogProvider(key: string, host: string): AnalyticsProvider {
  // Loaded lazily so it never blocks first paint.
  let ph: typeof import("posthog-js").default | null = null;

  return {
    name: "posthog",
    async init() {
      const mod = await import("posthog-js");
      ph = mod.default;
      ph.init(key, {
        api_host: host,
        // Research analytics only: explicit events, nothing automatic.
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        disable_session_recording: true,
        disable_surveys: true,
        advanced_disable_flags: true,
        // Anonymous: never build person profiles, never store IP.
        person_profiles: "never",
        ip: false,
        persistence: "localStorage",
        save_referrer: false,
        save_campaign_params: false,
        mask_all_text: true,
        property_denylist: ["$ip", "$referrer", "$referring_domain", "$initial_referrer", "$initial_referring_domain"],
        loaded: () => {
          if (process.env.NODE_ENV !== "production") {
            console.info(`%c[analytics] PostHog connected (${host.includes("eu.") ? "EU" : host.includes("us.") ? "US" : host}). Events will appear in PostHog → Activity.`, "color:#7e8f63;font-weight:bold");
          }
        },
        before_send: (event) => {
          if (event?.properties) {
            delete event.properties.$ip;
            // Keep only the path, never query strings.
            if (typeof event.properties.$current_url === "string") {
              try {
                const u = new URL(event.properties.$current_url);
                event.properties.$current_url = u.origin + u.pathname;
              } catch {
                delete event.properties.$current_url;
              }
            }
          }
          return event;
        },
      });
    },
    capture(event, props, opts) {
      if (process.env.NODE_ENV !== "production") console.debug(`%c[analytics → PostHog] ${event}`, "color:#7e8f63", props);
      ph?.capture(event, props, opts?.beacon ? { transport: "sendBeacon" } : undefined);
    },
    register(props) {
      ph?.register(props);
    },
  };
}
