-- Run in the Supabase SQL editor (Dashboard → SQL → New query)

create table if not exists public.quiz_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{"sessions":[],"questions":{}}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.quiz_stats enable row level security;

create policy "Users can view own stats"
  on public.quiz_stats
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own stats"
  on public.quiz_stats
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own stats"
  on public.quiz_stats
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own stats"
  on public.quiz_stats
  for delete
  using (auth.uid() = user_id);
