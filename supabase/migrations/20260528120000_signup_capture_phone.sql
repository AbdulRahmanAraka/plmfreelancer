-- Ensure the phone number supplied at sign-up is persisted on public.profiles.
-- 1. Update the handle_new_user trigger to also copy phone from raw_user_meta_data.
-- 2. Backfill phone for existing profiles from auth.users.raw_user_meta_data.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
  safe_role public.user_role;
  metadata_phone text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'role', 'freelancer');
  safe_role := case when requested_role = 'client' then 'client' else 'freelancer' end;

  metadata_phone := nullif(trim(coalesce(new.raw_user_meta_data->>'phone', '')), '');

  insert into public.profiles (user_id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    metadata_phone,
    safe_role
  );

  if safe_role = 'client' then
    insert into public.client_profiles (user_id) values (new.id);
  else
    insert into public.freelancer_profiles (user_id) values (new.id);
  end if;

  return new;
end;
$$;

-- Backfill: copy phone from auth.users metadata into profiles for rows where it's missing.
-- Skips any phone that would collide with the existing UNIQUE constraint on profiles.phone.
update public.profiles p
set phone = nullif(trim(coalesce(u.raw_user_meta_data->>'phone', '')), '')
from auth.users u
where p.user_id = u.id
  and (p.phone is null or p.phone = '')
  and nullif(trim(coalesce(u.raw_user_meta_data->>'phone', '')), '') is not null
  and not exists (
    select 1
    from public.profiles p2
    where p2.user_id <> p.user_id
      and p2.phone = nullif(trim(coalesce(u.raw_user_meta_data->>'phone', '')), '')
  );
