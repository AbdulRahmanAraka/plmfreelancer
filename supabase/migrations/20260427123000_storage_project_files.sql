-- Storage bucket and policies for project attachments.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-files',
  'project-files',
  false,
  52428800,
  array[
    'application/pdf',
    'application/zip',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'text/plain'
  ]
)
on conflict (id) do nothing;

drop policy if exists "project_files_read_authenticated" on storage.objects;
create policy "project_files_read_authenticated"
on storage.objects for select
to authenticated
using (bucket_id = 'project-files');

drop policy if exists "project_files_insert_owner_or_admin" on storage.objects;
create policy "project_files_insert_owner_or_admin"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'project-files'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin()
  )
);

drop policy if exists "project_files_update_owner_or_admin" on storage.objects;
create policy "project_files_update_owner_or_admin"
on storage.objects for update
to authenticated
using (
  bucket_id = 'project-files'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin()
  )
);

drop policy if exists "project_files_delete_owner_or_admin" on storage.objects;
create policy "project_files_delete_owner_or_admin"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'project-files'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin()
  )
);
