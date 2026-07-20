alter table public.projects
  add column if not exists is_active boolean not null default true;

create index if not exists projects_is_active_idx on public.projects (is_active);
