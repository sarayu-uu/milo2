-- Parent feedback: the survey (Parents → Feedback) and the quick
-- "Give feedback" form after each activity. Written only by the app's
-- server (/api/feedback) with the secret key; never readable by the public.

create table if not exists public.feedback (
  id           uuid primary key default gen_random_uuid(),
  -- random id made on the device for each response; makes retries safe
  response_id  text not null unique,
  -- 'survey' or 'activity'
  source       text not null check (source in ('survey', 'activity')),

  -- after an activity
  activity_id  text,
  mood         text,          -- loved | enjoyed | okay | lost_interest | difficult
  noticed      text[],        -- independent, little_help, lot_of_help, didnt_understand, already_knew, unexpected
  note         text,

  -- survey answers, keyed by question id (child_age, who_uses, enjoyed_most, …)
  answers      jsonb,

  app_version  text,
  submitted_at timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists feedback_source_created_idx on public.feedback (source, created_at desc);
create index if not exists feedback_activity_idx on public.feedback (activity_id) where activity_id is not null;

-- Lock it down: no policies, so the public (anon / signed-in) keys can't read
-- or write anything. The server's secret key bypasses RLS.
alter table public.feedback enable row level security;
revoke all on public.feedback from anon, authenticated;
