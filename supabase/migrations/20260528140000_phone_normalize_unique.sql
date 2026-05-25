-- Treat phone numbers as equal when their digit-only form matches,
-- regardless of spaces, dashes, dots, plus signs, or parentheses.
--
-- Examples that will now be considered the same number:
--   "+91 98765 43210"    ->  "919876543210"
--   "+91-9876543210"     ->  "919876543210"
--   "919876543210"       ->  "919876543210"
--
-- Different country prefixes and missing prefixes are still kept distinct:
--   "9876543210"         !=  "919876543210"
--   "+44 7700 900123"    !=  "+91 7700 900123"

-- 1. Reusable function: keep only digits.
create or replace function public.normalize_phone(p text)
returns text
language sql
immutable
as $$
  select case
    when p is null then null
    else nullif(regexp_replace(p, '\D', '', 'g'), '')
  end;
$$;

-- 2. Lookup helper used by server actions to find a profile whose phone
--    normalizes to the same digit sequence as the supplied input.
create or replace function public.find_profile_id_by_phone(p text)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select user_id
  from public.profiles
  where public.normalize_phone(phone) is not null
    and public.normalize_phone(phone) = public.normalize_phone(p)
  limit 1;
$$;

grant execute on function public.normalize_phone(text)
  to anon, authenticated, service_role;
grant execute on function public.find_profile_id_by_phone(text)
  to anon, authenticated, service_role;

-- 3. Replace the strict exact-string unique on phone with one that
--    enforces uniqueness on the normalized form. The old constraint
--    is dropped because the new index is strictly stronger (every
--    duplicate it would have caught is also caught by the new one).
alter table public.profiles
  drop constraint if exists profiles_phone_key;

-- If any pre-existing rows accidentally have the same normalized phone,
-- this index creation will fail with a clear error pointing to the
-- duplicate value, so the admin can clean up manually.
create unique index if not exists profiles_phone_normalized_uidx
  on public.profiles ((public.normalize_phone(phone)))
  where phone is not null and public.normalize_phone(phone) is not null;
