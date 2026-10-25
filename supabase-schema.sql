-- In Supabase SQL Editor ausführen. Nur angemeldete Benutzer dürfen ihre eigenen Daten lesen/schreiben.
create table if not exists public.learning_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint progress_json_object check (jsonb_typeof(data) = 'object'),
  constraint progress_size_limit check (octet_length(data::text) < 2000000)
);
alter table public.learning_progress enable row level security;
revoke all on public.learning_progress from anon;
grant select, insert, update, delete on public.learning_progress to authenticated;
drop policy if exists "read_own_progress" on public.learning_progress;
drop policy if exists "insert_own_progress" on public.learning_progress;
drop policy if exists "update_own_progress" on public.learning_progress;
drop policy if exists "delete_own_progress" on public.learning_progress;
create policy "read_own_progress" on public.learning_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert_own_progress" on public.learning_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update_own_progress" on public.learning_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete_own_progress" on public.learning_progress for delete to authenticated using ((select auth.uid()) = user_id);
