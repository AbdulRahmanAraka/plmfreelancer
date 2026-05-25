-- Add budget currency column to projects so clients can pick INR or USD.
alter table public.projects
  add column if not exists budget_currency text not null default 'INR';

alter table public.projects
  drop constraint if exists projects_budget_currency_check;

alter table public.projects
  add constraint projects_budget_currency_check
  check (budget_currency in ('INR', 'USD'));
