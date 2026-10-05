import "server-only";

/**
 * Read-only PostHog queries (HogQL) for the admin page.
 * Needs POSTHOG_PERSONAL_API_KEY (scope: Query Read) and POSTHOG_PROJECT_ID.
 * POSTHOG_API_HOST defaults to the EU/US app host matching NEXT_PUBLIC_POSTHOG_HOST.
 */
const key = process.env.POSTHOG_PERSONAL_API_KEY;
const project = process.env.POSTHOG_PROJECT_ID;
const host = (
  process.env.POSTHOG_API_HOST ?? ((process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "").includes("us.") ? "https://us.posthog.com" : "https://eu.posthog.com")
).replace(/\/$/, "");

export const posthogConfigured = Boolean(key && project);

export type Rows = (string | number | null)[][];

export async function hogql(name: string, query: string): Promise<Rows> {
  if (!posthogConfigured) throw new Error("PostHog is not configured");
  const res = await fetch(`${host}/api/projects/${project}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query }, name }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PostHog query "${name}" failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  return ((await res.json()) as { results: Rows }).results ?? [];
}

const DAYS = 180;

/** One row per anonymous device. */
export const devicesQuery = `
select
  distinct_id,
  min(timestamp),
  max(timestamp),
  count(distinct toDate(timestamp)),
  countIf(event = 'activity_started'),
  countIf(event = 'activity_completed'),
  any(properties.$device_type),
  any(properties.$os)
from events
where timestamp > now() - interval ${DAYS} day
group by distinct_id
order by max(timestamp) desc
limit 2000`;

export const overviewQuery = `
select
  uniq(distinct_id),
  uniqIf(distinct_id, timestamp >= toStartOfDay(now())),
  uniqIf(distinct_id, timestamp >= now() - interval 7 day),
  countIf(event = 'activity_started'),
  countIf(event = 'activity_completed'),
  countIf(event = 'app_opened')
from events
where timestamp > now() - interval ${DAYS} day`;

export const activitiesQuery = `
select
  properties.activityId,
  countIf(event = 'activity_started'),
  countIf(event = 'activity_completed'),
  avgIf(toFloat(properties.durationSec), event = 'activity_completed'),
  countIf(event = 'activity_exited')
from events
where event in ('activity_started', 'activity_completed', 'activity_exited') and timestamp > now() - interval ${DAYS} day
group by properties.activityId
order by countIf(event = 'activity_started') desc`;

export const quitStepsQuery = `
select properties.activityId, properties.stepId, count()
from events
where event = 'activity_exited' and timestamp > now() - interval ${DAYS} day
group by properties.activityId, properties.stepId
order by count() desc
limit 500`;

export const PERIOD_DAYS = DAYS;
