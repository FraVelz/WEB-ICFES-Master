-- Streak columns for user_gamification (apply in Supabase SQL editor)
alter table user_gamification
  add column if not exists streak_dates jsonb not null default '[]'::jsonb,
  add column if not exists longest_streak int not null default 0;
