-- PflegeFokus public aggregate counters.
-- Run once in Supabase SQL Editor after the project is resumed.

create table if not exists public.app_metrics (
  id smallint primary key check (id = 1),
  visits bigint not null default 0 check (visits >= 0),
  registrations bigint not null default 0 check (registrations >= 0),
  updated_at timestamptz not null default now()
);

alter table public.app_metrics enable row level security;
revoke all on public.app_metrics from public, anon, authenticated;

insert into public.app_metrics (id, visits, registrations)
values (1, 0, (select count(*) from auth.users))
on conflict (id) do nothing;

create or replace function public.record_app_visit()
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.app_metrics (id, visits, registrations)
  values (1, 1, 0)
  on conflict (id) do update
    set visits = public.app_metrics.visits + 1,
        updated_at = now();
$$;
revoke all on function public.record_app_visit() from public;
grant execute on function public.record_app_visit() to anon, authenticated;

create or replace function public.get_app_metrics()
returns table (visits bigint, registrations bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select m.visits, m.registrations
  from public.app_metrics as m
  where m.id = 1;
$$;
revoke all on function public.get_app_metrics() from public;
grant execute on function public.get_app_metrics() to anon, authenticated;

create or replace function public.count_new_registration()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.app_metrics (id, visits, registrations)
  values (1, 0, 1)
  on conflict (id) do update
    set registrations = public.app_metrics.registrations + 1,
        updated_at = now();
  return new;
end;
$$;
revoke all on function public.count_new_registration() from public, anon, authenticated;

drop trigger if exists PflegeFokus_count_registration on auth.users;
create trigger PflegeFokus_count_registration
after insert on auth.users
for each row execute function public.count_new_registration();
