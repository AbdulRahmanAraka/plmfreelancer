alter table public.projects
  add column if not exists duration text,
  add column if not exists engagement_type text;

alter table public.projects
  drop constraint if exists projects_duration_check;

alter table public.projects
  add constraint projects_duration_check
  check (
    duration is null
    or duration in ('short_term', 'medium_term', 'long_term', 'extended')
  );

alter table public.projects
  drop constraint if exists projects_engagement_type_check;

alter table public.projects
  add constraint projects_engagement_type_check
  check (
    engagement_type is null
    or engagement_type in ('full_time', 'part_time')
  );
