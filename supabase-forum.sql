-- Apply to the PflegeFokus project before releasing the forum UI.
begin;

create schema if not exists pflegefokus_private;
revoke all on schema pflegefokus_private from public, anon, authenticated;

create table public.forum_moderators (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table public.forum_profiles (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  nickname text not null check (nickname = btrim(nickname) and char_length(nickname) between 3 and 24
    and nickname ~ '^[[:alnum:]][[:alnum:] ._-]+$'),
  postal_code text check (postal_code ~ '^[0-9]{4,5}$'),
  show_setting boolean not null default false,
  avatar_setting text check (avatar_setting in ('ambulant','akut','langzeit','paediatrie','tagespflege','psychiatrie','reha'))
);
create unique index forum_profiles_nickname_unique on public.forum_profiles (lower(nickname));

create table public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author_nickname text not null,
  author_setting text,
  category text not null check (category in ('pruefungen','praxis','lernpartner','erfahrungen')),
  care_setting text check (care_setting in ('ambulant','akut','langzeit','paediatrie','tagespflege','psychiatrie','reha')),
  title text not null check (char_length(btrim(title)) between 5 and 100),
  body text not null check (char_length(btrim(body)) between 5 and 3000),
  pinned boolean not null default false,
  featured boolean not null default false check (not featured or category = 'praxis'),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index forum_topics_category_order on public.forum_topics (category,pinned desc,created_at desc,id desc);
create index forum_topics_author on public.forum_topics (author_id);
create unique index forum_one_featured_case on public.forum_topics (featured) where featured and not hidden;

create table public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  author_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author_nickname text not null,
  author_setting text,
  body text not null check (char_length(btrim(body)) between 2 and 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  unique (id,topic_id)
);
create index forum_replies_topic_order on public.forum_replies (topic_id,created_at,id);
create index forum_replies_author on public.forum_replies (author_id);

create table public.forum_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  reply_id uuid,
  reason text not null check (reason in ('datenschutz','umgangston','spam','sonstiges')),
  handled boolean not null default false,
  created_at timestamptz not null default now(),
  foreign key (reply_id,topic_id) references public.forum_replies(id,topic_id) on delete cascade,
  unique nulls not distinct (reporter_id, topic_id, reply_id)
);
create index forum_reports_topic_reply on public.forum_reports (topic_id,reply_id);

alter table public.forum_moderators enable row level security;
alter table public.forum_profiles enable row level security;
alter table public.forum_topics enable row level security;
alter table public.forum_replies enable row level security;
alter table public.forum_reports enable row level security;

revoke all on public.forum_moderators, public.forum_profiles, public.forum_topics,
  public.forum_replies, public.forum_reports from public, anon, authenticated;
grant select on public.forum_moderators to authenticated;
grant select on public.forum_profiles to authenticated;
grant insert (user_id,nickname,postal_code,show_setting,avatar_setting),
  update (user_id,nickname,postal_code,show_setting,avatar_setting) on public.forum_profiles to authenticated;
grant select,delete on public.forum_topics, public.forum_replies to authenticated;
grant insert (category,care_setting,title,body), update (pinned,featured,hidden) on public.forum_topics to authenticated;
grant insert (topic_id,body), update (hidden) on public.forum_replies to authenticated;
grant select on public.forum_reports to authenticated;
grant insert (topic_id, reply_id, reason), update (handled) on public.forum_reports to authenticated;

create policy forum_moderators_self on public.forum_moderators for select to authenticated
  using (user_id = (select auth.uid()));
create policy forum_profiles_read on public.forum_profiles for select to authenticated
  using (user_id = (select auth.uid()) or exists (select 1 from public.forum_moderators));
create policy forum_profiles_create on public.forum_profiles for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy forum_profiles_modify on public.forum_profiles for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy forum_topics_read on public.forum_topics for select to authenticated
  using (not hidden or author_id = (select auth.uid()) or exists (select 1 from public.forum_moderators));
create policy forum_topics_create on public.forum_topics for insert to authenticated
  with check (author_id = (select auth.uid()) and not pinned and not featured and not hidden);
create policy forum_topics_moderate on public.forum_topics for update to authenticated
  using (exists (select 1 from public.forum_moderators))
  with check (exists (select 1 from public.forum_moderators));
create policy forum_topics_delete on public.forum_topics for delete to authenticated
  using (author_id = (select auth.uid()));

create policy forum_replies_read on public.forum_replies for select to authenticated using (
  exists (select 1 from public.forum_moderators) or (
    (not hidden or author_id = (select auth.uid())) and
    exists (select 1 from public.forum_topics t where t.id = topic_id and not t.hidden)
  )
);
create policy forum_replies_create on public.forum_replies for insert to authenticated with check (
  author_id = (select auth.uid()) and not hidden and
  exists (select 1 from public.forum_topics t where t.id = topic_id and not t.hidden)
);
create policy forum_replies_moderate on public.forum_replies for update to authenticated
  using (exists (select 1 from public.forum_moderators))
  with check (exists (select 1 from public.forum_moderators));
create policy forum_replies_delete on public.forum_replies for delete to authenticated
  using (author_id = (select auth.uid()));

create policy forum_reports_read on public.forum_reports for select to authenticated
  using (reporter_id = (select auth.uid()) or exists (select 1 from public.forum_moderators));
create policy forum_reports_create on public.forum_reports for insert to authenticated with check (
  reporter_id = (select auth.uid()) and not handled and
  exists (select 1 from public.forum_topics t where t.id = topic_id and not t.hidden)
  and (reply_id is null or exists (
    select 1 from public.forum_replies r where r.id = reply_id and not r.hidden
  ))
);
create policy forum_reports_moderate on public.forum_reports for update to authenticated
  using (exists (select 1 from public.forum_moderators))
  with check (exists (select 1 from public.forum_moderators));

-- Server derives display fields from the writer's private profile.
create function pflegefokus_private.set_forum_author()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if new.author_id is distinct from auth.uid() then
    raise exception 'Invalid forum author' using errcode = '42501';
  end if;
  select p.nickname, case when p.show_setting then p.avatar_setting end
    into new.author_nickname, new.author_setting
    from public.forum_profiles p where p.user_id = new.author_id;
  if new.author_nickname is null then
    raise exception 'Set a forum nickname before posting' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke execute on function pflegefokus_private.set_forum_author() from public, anon, authenticated;
create trigger forum_topics_author before insert on public.forum_topics
  for each row execute function pflegefokus_private.set_forum_author();
create trigger forum_replies_author before insert on public.forum_replies
  for each row execute function pflegefokus_private.set_forum_author();

-- This trigger can update the display fields only for the profile just edited.
-- It lives outside exposed schemas and cannot be called by a browser client.
create function pflegefokus_private.refresh_forum_author()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  setting text := case when new.show_setting then new.avatar_setting end;
begin
  if new.user_id is distinct from auth.uid() then
    raise exception 'Invalid forum profile' using errcode = '42501';
  end if;
  update public.forum_topics set author_nickname = new.nickname, author_setting = setting where author_id = new.user_id;
  update public.forum_replies set author_nickname = new.nickname, author_setting = setting where author_id = new.user_id;
  return new;
end;
$$;
revoke execute on function pflegefokus_private.refresh_forum_author() from public, anon, authenticated;
create trigger forum_sync_display after update of nickname, show_setting, avatar_setting on public.forum_profiles for each row
  when ((old.nickname,old.show_setting,old.avatar_setting) is distinct from (new.nickname,new.show_setting,new.avatar_setting))
  execute function pflegefokus_private.refresh_forum_author();

commit;
