-- Private learning recordings, stored under the authenticated user's ID.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('learning-recordings', 'learning-recordings', false, 12582912,
  array['audio/webm','audio/mp4','audio/ogg','audio/wav','audio/x-m4a','audio/aac','audio/mpeg','audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4;codecs=mp4a.40.2'])
on conflict (id) do update set public = false,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "learning_recordings_select_own" on storage.objects;
drop policy if exists "learning_recordings_insert_own" on storage.objects;
drop policy if exists "learning_recordings_update_own" on storage.objects;
drop policy if exists "learning_recordings_delete_own" on storage.objects;
create policy "learning_recordings_select_own" on storage.objects for select to authenticated
  using (bucket_id = 'learning-recordings' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "learning_recordings_insert_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'learning-recordings' and array_length(storage.foldername(name), 1) = 1
    and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "learning_recordings_update_own" on storage.objects for update to authenticated
  using (bucket_id = 'learning-recordings' and (storage.foldername(name))[1] = (select auth.uid()::text))
  with check (bucket_id = 'learning-recordings' and array_length(storage.foldername(name), 1) = 1
    and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "learning_recordings_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'learning-recordings' and (storage.foldername(name))[1] = (select auth.uid()::text));
