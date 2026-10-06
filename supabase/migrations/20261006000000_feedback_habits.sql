-- Parents → "You & your child": the screen-habits self-check.
-- Stored as source 'habits'; answers are keyed by question id
-- (phone_while_talking, phone_at_meals, …) with values often | sometimes | rarely.

alter table public.feedback drop constraint if exists feedback_source_check;
alter table public.feedback add constraint feedback_source_check check (source in ('survey', 'activity', 'habits'));
