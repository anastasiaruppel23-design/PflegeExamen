-- Extends the deployed forum with feedback, linked replies, unread topics and private mail.
begin;

alter table public.forum_topics drop constraint forum_topics_category_check,
  add constraint forum_topics_category_check
  check (category in ('pruefungen','praxis','lernpartner','erfahrungen','feedback'));

alter table public.forum_replies add column parent_reply_id uuid,
  add constraint forum_reply_parent_in_topic foreign key (parent_reply_id,topic_id)
    references public.forum_replies(id,topic_id) on delete set null (parent_reply_id);
create index forum_reply_parent on public.forum_replies (parent_reply_id) where parent_reply_id is not null;
grant insert (parent_reply_id) on public.forum_replies to authenticated;

create function pflegefokus_private.check_forum_reply_parent()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if not exists (
    select 1 from public.forum_replies p
    where p.id = new.parent_reply_id and p.topic_id = new.topic_id and not p.hidden
  ) then
    raise exception 'Reply target unavailable' using errcode = '23503';
  end if;
  return new;
end;
$$;
revoke execute on function pflegefokus_private.check_forum_reply_parent() from public, anon, authenticated;
create trigger forum_reply_parent_visible before insert on public.forum_replies
  for each row when (new.parent_reply_id is not null)
  execute function pflegefokus_private.check_forum_reply_parent();

create table public.forum_topic_reads (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  seen_at timestamptz not null,
  primary key (user_id, topic_id)
);
create index forum_reads_topic on public.forum_topic_reads (topic_id);
alter table public.forum_topic_reads enable row level security;
revoke all on public.forum_topic_reads from public, anon, authenticated;
grant select on public.forum_topic_reads to authenticated;
grant insert (user_id,topic_id,seen_at), update (user_id,topic_id,seen_at) on public.forum_topic_reads to authenticated;
create policy forum_topic_reads_select on public.forum_topic_reads for select to authenticated
  using (user_id = (select auth.uid()));
create policy forum_topic_reads_insert on public.forum_topic_reads for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (select 1 from public.forum_topics t where t.id = topic_id));
create policy forum_topic_reads_update on public.forum_topic_reads for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and exists (select 1 from public.forum_topics t where t.id = topic_id));

create function pflegefokus_private.keep_forum_read_progress()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if (new.user_id,new.topic_id) is distinct from (old.user_id,old.topic_id) then
    raise exception 'Invalid read marker' using errcode = '42501';
  end if;
  new.seen_at := greatest(old.seen_at,new.seen_at);
  return new;
end;
$$;
revoke execute on function pflegefokus_private.keep_forum_read_progress() from public, anon, authenticated;
create trigger forum_read_progress before update on public.forum_topic_reads
  for each row execute function pflegefokus_private.keep_forum_read_progress();

create view public.forum_topic_overview with (security_invoker = true) as
select t.*, x.reply_count, greatest(t.created_at,x.last_reply_at) as latest_at,
       coalesce(greatest(x.latest_other_reply,
          case when t.author_id <> (select auth.uid()) then t.created_at end)
         > coalesce(s.seen_at,'-infinity'::timestamptz),false) and not t.hidden as unread
from public.forum_topics t
left join public.forum_topic_reads s on s.topic_id = t.id and s.user_id = (select auth.uid())
cross join lateral (
  select count(*) as reply_count, max(r.created_at) as last_reply_at,
    max(r.created_at) filter (where r.author_id <> (select auth.uid())) as latest_other_reply
  from public.forum_replies r where r.topic_id = t.id and not r.hidden
) x;
create view public.forum_unread_counts with (security_invoker = true) as
select category, count(*) as unread_count from public.forum_topic_overview
where unread group by category;
revoke all on public.forum_topic_overview, public.forum_unread_counts from public, anon, authenticated;
grant select on public.forum_topic_overview, public.forum_unread_counts to authenticated;

-- This directory deliberately contains only a user's public nickname and forum ID.
create table public.forum_members (
  user_id uuid primary key references public.forum_profiles(user_id) on delete cascade,
  nickname text not null
);
create unique index forum_member_nickname on public.forum_members (lower(nickname));
alter table public.forum_members enable row level security;
revoke all on public.forum_members from public, anon, authenticated;
grant select on public.forum_members to authenticated;
create policy forum_members_read on public.forum_members for select to authenticated using ((select auth.uid()) is not null);
insert into public.forum_members (user_id,nickname) select user_id,nickname from public.forum_profiles;

create function pflegefokus_private.sync_forum_member()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.user_id is distinct from auth.uid() then
    raise exception 'Invalid forum member' using errcode = '42501';
  end if;
  insert into public.forum_members(user_id,nickname) values (new.user_id,new.nickname)
    on conflict (user_id) do update set nickname = excluded.nickname
    where forum_members.nickname is distinct from excluded.nickname;
  return new;
end;
$$;
revoke execute on function pflegefokus_private.sync_forum_member() from public, anon, authenticated;
create trigger forum_member_name after insert or update of nickname on public.forum_profiles
  for each row execute function pflegefokus_private.sync_forum_member();

create table public.forum_messages (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references public.forum_members(user_id) on delete cascade,
  recipient_id uuid not null references public.forum_members(user_id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default statement_timestamp(),
  read_at timestamptz,
  check (author_id <> recipient_id)
);
create index forum_mail_from_to on public.forum_messages (author_id,recipient_id,created_at desc,id desc);
create index forum_mail_to_from on public.forum_messages (recipient_id,author_id,created_at desc,id desc);
create index forum_mail_unread on public.forum_messages (recipient_id) where read_at is null;

alter table public.forum_messages enable row level security;
revoke all on public.forum_messages from public, anon, authenticated;
grant select on public.forum_messages to authenticated;
grant insert (recipient_id,body), update (read_at) on public.forum_messages to authenticated;
create policy forum_messages_read on public.forum_messages for select to authenticated
  using ((select auth.uid()) in (author_id,recipient_id));
create policy forum_messages_send on public.forum_messages for insert to authenticated
  with check (author_id = (select auth.uid()) and read_at is null);
create policy forum_messages_acknowledge on public.forum_messages for update to authenticated
  using (recipient_id = (select auth.uid()) and read_at is null)
  with check (recipient_id = (select auth.uid()) and read_at is not null);

create view public.forum_conversations with (security_invoker = true) as
with mine as (
  select m.*, case when author_id = (select auth.uid()) then recipient_id else author_id end as partner_id
  from public.forum_messages m where (select auth.uid()) in (author_id,recipient_id)
), recent as (
  select distinct on (partner_id) partner_id,
    created_at as latest_at, left(body,140) as preview, author_id = (select auth.uid()) as sent,
    count(*) filter (where recipient_id = (select auth.uid()) and read_at is null)
      over (partition by partner_id) as unread_count
  from mine
  order by partner_id,created_at desc,id desc
)
select recent.*, member.nickname
from recent join public.forum_members member on member.user_id = recent.partner_id;
revoke all on public.forum_conversations from public, anon, authenticated;
grant select on public.forum_conversations to authenticated;

commit;
