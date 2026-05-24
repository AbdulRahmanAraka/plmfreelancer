-- Convert project_enhancements into a real conversation thread between client and freelancer.

alter table public.project_enhancements
  add column if not exists author_id uuid references public.profiles(user_id) on delete set null,
  add column if not exists kind text not null default 'message';

update public.project_enhancements
  set author_id = client_id
  where author_id is null and client_id is not null;

alter table public.project_enhancements
  alter column client_id drop not null;

alter table public.project_enhancements
  alter column author_id set not null;

alter table public.project_enhancements
  drop constraint if exists project_enhancements_kind_check;

alter table public.project_enhancements
  add constraint project_enhancements_kind_check
  check (kind in ('request', 'reply', 'resubmit'));

create index if not exists project_enhancements_project_idx
  on public.project_enhancements(project_id);
create index if not exists project_enhancements_author_idx
  on public.project_enhancements(author_id);

drop policy if exists "project_enhancements_select_related_or_admin"
  on public.project_enhancements;
create policy "project_enhancements_select_related_or_admin"
on public.project_enhancements for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.projects p
    where p.id = project_id
      and (p.client_id = auth.uid() or p.assigned_freelancer_id = auth.uid())
  )
);

drop policy if exists "project_enhancements_insert_client_or_admin"
  on public.project_enhancements;
drop policy if exists "project_enhancements_insert_thread_participants"
  on public.project_enhancements;
create policy "project_enhancements_insert_thread_participants"
on public.project_enhancements for insert
to authenticated
with check (
  author_id = auth.uid()
  and (
    public.is_admin()
    or exists (
      select 1 from public.projects p
      where p.id = project_id
        and (p.client_id = auth.uid() or p.assigned_freelancer_id = auth.uid())
    )
  )
);
