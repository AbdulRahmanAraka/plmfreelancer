-- PLM Freelancer Platform - redesigned schema
-- Uses Supabase Auth (auth.users) as identity source.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('client', 'freelancer', 'admin');
create type public.budget_model as enum ('hourly', 'fixed');
create type public.project_status as enum (
  'open',
  'assigned',
  'in_progress',
  'completed',
  'accepted',
  'enhancement_requested',
  'cancelled'
);
create type public.application_status as enum (
  'applied',
  'shortlisted',
  'assigned',
  'rejected',
  'withdrawn',
  'completed',
  'accepted'
);
create type public.notification_kind as enum (
  'project_applied',
  'project_assigned',
  'status_updated',
  'project_completed',
  'project_accepted',
  'enhancement_requested',
  'system'
);

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text unique,
  role public.user_role not null default 'freelancer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_profiles (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  company_name text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.freelancer_profiles (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  country text,
  state text,
  address text,
  plm_experience_years integer,
  plm_experience_months integer,
  hourly_rate numeric(10,2),
  rate_negotiable boolean default false,
  availability text,
  looking_for_job boolean default true,
  notice_period text,
  portfolio_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.freelancer_skills (
  id bigserial primary key,
  freelancer_id uuid not null references public.freelancer_profiles(user_id) on delete cascade,
  skill text not null,
  created_at timestamptz not null default now(),
  unique (freelancer_id, skill)
);

create table public.freelancer_software (
  id bigserial primary key,
  freelancer_id uuid not null references public.freelancer_profiles(user_id) on delete cascade,
  software text not null,
  created_at timestamptz not null default now(),
  unique (freelancer_id, software)
);

create table public.projects (
  id bigserial primary key,
  client_id uuid not null references public.client_profiles(user_id) on delete cascade,
  title text not null,
  description text not null,
  budget_type public.budget_model,
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  deadline date,
  attachment_path text,
  contact_name text,
  contact_email text,
  contact_phone text,
  status public.project_status not null default 'open',
  client_decision text not null default 'pending',
  assigned_freelancer_id uuid references public.freelancer_profiles(user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create index projects_client_id_idx on public.projects(client_id);
create index projects_status_idx on public.projects(status);
create index projects_assigned_freelancer_idx on public.projects(assigned_freelancer_id);

create table public.project_skills (
  id bigserial primary key,
  project_id bigint not null references public.projects(id) on delete cascade,
  skill text not null,
  unique (project_id, skill)
);

create table public.project_applications (
  id bigserial primary key,
  project_id bigint not null references public.projects(id) on delete cascade,
  freelancer_id uuid not null references public.freelancer_profiles(user_id) on delete cascade,
  cover_letter text,
  status public.application_status not null default 'applied',
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, freelancer_id)
);

create index project_applications_project_idx on public.project_applications(project_id);
create index project_applications_freelancer_idx on public.project_applications(freelancer_id);

create table public.project_enhancements (
  id bigserial primary key,
  project_id bigint not null references public.projects(id) on delete cascade,
  client_id uuid not null references public.client_profiles(user_id) on delete cascade,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id bigserial primary key,
  recipient_id uuid not null references public.profiles(user_id) on delete cascade,
  actor_id uuid references public.profiles(user_id),
  project_id bigint references public.projects(id) on delete cascade,
  kind public.notification_kind not null default 'system',
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_recipient_id_idx on public.notifications(recipient_id);
create index notifications_is_read_idx on public.notifications(is_read);

create table public.audit_logs (
  id bigserial primary key,
  actor_id uuid references public.profiles(user_id),
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute procedure public.touch_updated_at();

create trigger client_profiles_touch_updated_at
before update on public.client_profiles
for each row execute procedure public.touch_updated_at();

create trigger freelancer_profiles_touch_updated_at
before update on public.freelancer_profiles
for each row execute procedure public.touch_updated_at();

create trigger projects_touch_updated_at
before update on public.projects
for each row execute procedure public.touch_updated_at();

create trigger project_applications_touch_updated_at
before update on public.project_applications
for each row execute procedure public.touch_updated_at();

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where user_id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false);
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'role', 'freelancer');

  insert into public.profiles (user_id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    case
      when requested_role in ('client', 'freelancer', 'admin') then requested_role::public.user_role
      else 'freelancer'::public.user_role
    end
  );

  if requested_role = 'client' then
    insert into public.client_profiles (user_id) values (new.id);
  else
    insert into public.freelancer_profiles (user_id) values (new.id);
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.client_profiles enable row level security;
alter table public.freelancer_profiles enable row level security;
alter table public.freelancer_skills enable row level security;
alter table public.freelancer_software enable row level security;
alter table public.projects enable row level security;
alter table public.project_skills enable row level security;
alter table public.project_applications enable row level security;
alter table public.project_enhancements enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_select_authenticated"
on public.profiles for select
to authenticated
using (true);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = user_id);

create policy "profiles_update_own_or_admin"
on public.profiles for update
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "client_profiles_select_authenticated"
on public.client_profiles for select
to authenticated
using (true);

create policy "client_profiles_modify_own_or_admin"
on public.client_profiles for all
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "freelancer_profiles_select_authenticated"
on public.freelancer_profiles for select
to authenticated
using (true);

create policy "freelancer_profiles_modify_own_or_admin"
on public.freelancer_profiles for all
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "freelancer_skills_select_authenticated"
on public.freelancer_skills for select
to authenticated
using (true);

create policy "freelancer_skills_modify_own_or_admin"
on public.freelancer_skills for all
to authenticated
using (auth.uid() = freelancer_id or public.is_admin())
with check (auth.uid() = freelancer_id or public.is_admin());

create policy "freelancer_software_select_authenticated"
on public.freelancer_software for select
to authenticated
using (true);

create policy "freelancer_software_modify_own_or_admin"
on public.freelancer_software for all
to authenticated
using (auth.uid() = freelancer_id or public.is_admin())
with check (auth.uid() = freelancer_id or public.is_admin());

create policy "projects_select_authenticated"
on public.projects for select
to authenticated
using (true);

create policy "projects_insert_client_or_admin"
on public.projects for insert
to authenticated
with check (
  public.is_admin()
  or (
    client_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role = 'client'
    )
  )
);

create policy "projects_update_owner_or_admin"
on public.projects for update
to authenticated
using (client_id = auth.uid() or public.is_admin())
with check (client_id = auth.uid() or public.is_admin());

create policy "projects_delete_owner_or_admin"
on public.projects for delete
to authenticated
using (client_id = auth.uid() or public.is_admin());

create policy "project_skills_select_authenticated"
on public.project_skills for select
to authenticated
using (true);

create policy "project_skills_modify_project_owner_or_admin"
on public.project_skills for all
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.projects p
    where p.id = project_id and p.client_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1
    from public.projects p
    where p.id = project_id and p.client_id = auth.uid()
  )
);

create policy "project_applications_select_related_or_admin"
on public.project_applications for select
to authenticated
using (
  public.is_admin()
  or freelancer_id = auth.uid()
  or exists (
    select 1 from public.projects p
    where p.id = project_id and p.client_id = auth.uid()
  )
);

create policy "project_applications_insert_freelancer"
on public.project_applications for insert
to authenticated
with check (
  freelancer_id = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'freelancer'
  )
);

create policy "project_applications_update_related_or_admin"
on public.project_applications for update
to authenticated
using (
  public.is_admin()
  or freelancer_id = auth.uid()
  or exists (
    select 1 from public.projects p
    where p.id = project_id and p.client_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or freelancer_id = auth.uid()
  or exists (
    select 1 from public.projects p
    where p.id = project_id and p.client_id = auth.uid()
  )
);

create policy "project_enhancements_select_related_or_admin"
on public.project_enhancements for select
to authenticated
using (
  public.is_admin()
  or client_id = auth.uid()
  or exists (
    select 1
    from public.project_applications pa
    where pa.project_id = project_id and pa.freelancer_id = auth.uid()
  )
);

create policy "project_enhancements_insert_client_or_admin"
on public.project_enhancements for insert
to authenticated
with check (client_id = auth.uid() or public.is_admin());

create policy "notifications_select_own_or_admin"
on public.notifications for select
to authenticated
using (recipient_id = auth.uid() or public.is_admin());

create policy "notifications_update_own_or_admin"
on public.notifications for update
to authenticated
using (recipient_id = auth.uid() or public.is_admin())
with check (recipient_id = auth.uid() or public.is_admin());

create policy "audit_logs_select_admin_only"
on public.audit_logs for select
to authenticated
using (public.is_admin());
