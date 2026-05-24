-- Add freelancer introduction fields and profile image storage.

alter table public.freelancer_profiles
  add column if not exists professional_title text,
  add column if not exists introduction text,
  add column if not exists profile_image_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'freelancer-profiles',
  'freelancer-profiles',
  false,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "freelancer_profiles_images_read_authenticated" on storage.objects;
create policy "freelancer_profiles_images_read_authenticated"
on storage.objects for select
to authenticated
using (bucket_id = 'freelancer-profiles');

drop policy if exists "freelancer_profiles_images_insert_owner_or_admin" on storage.objects;
create policy "freelancer_profiles_images_insert_owner_or_admin"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'freelancer-profiles'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin()
  )
);

drop policy if exists "freelancer_profiles_images_update_owner_or_admin" on storage.objects;
create policy "freelancer_profiles_images_update_owner_or_admin"
on storage.objects for update
to authenticated
using (
  bucket_id = 'freelancer-profiles'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin()
  )
);

drop policy if exists "freelancer_profiles_images_delete_owner_or_admin" on storage.objects;
create policy "freelancer_profiles_images_delete_owner_or_admin"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'freelancer-profiles'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin()
  )
);
