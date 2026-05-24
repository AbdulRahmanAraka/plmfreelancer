-- Prevent user-provided metadata from self-assigning admin during sign-up.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
  safe_role public.user_role;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'role', 'freelancer');
  safe_role := case when requested_role = 'client' then 'client' else 'freelancer' end;

  insert into public.profiles (user_id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
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
