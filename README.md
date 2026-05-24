# PLM Freelancer Platform

Modern rebuild of the legacy PHP portal using Next.js (App Router), TypeScript, Tailwind CSS, and Supabase (Postgres + Auth + Storage). Email via Resend.

## Run locally

```bash
npm install
cp .env.example .env.local
# fill in .env.local with your real values, then:
npm run dev
```

App runs on http://localhost:3000

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | yes | Public base URL (e.g. `http://localhost:3000` in dev) |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon key (browser-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Supabase service-role key (server only, never exposed) |
| `RESEND_API_KEY` | optional | Resend API key for transactional emails |
| `EMAIL_FROM` | optional | Verified sender address for Resend (e.g. `noreply@yourdomain.com`) |

If `RESEND_API_KEY` / `EMAIL_FROM` are absent, the app still works — emails are silently skipped (logged to server console).

## Architecture

- `src/app/(marketing)` — public pages (home, privacy, terms)
- `src/app/(auth)` — login, register, forgot/reset password
- `src/app/(app)` — authenticated workspace (client, freelancer, admin, account)
- `src/app/(app)/freelancers/[userId]` — public freelancer profile
- `src/app/api/health` — health endpoint
- `src/app/sitemap.ts`, `src/app/robots.ts` — SEO files
- `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/global-error.tsx` — error pages
- `src/components` — reusable UI (cards, buttons, intro card, enhancement thread)
- `src/lib` — shared infra (`env`, `supabase`, `auth`, `utils`)
- `src/server/services` — server-only services (email, freelancer intros, assignments)
- `src/config` — constants (skill/software options, legal info)
- `src/types` — domain types
- `supabase/migrations/` — SQL migrations (apply in order)
- `next.config.ts` — security headers (CSP, X-Frame-Options, HSTS, etc.)
- `src/proxy.ts` — Supabase session refresh on every request

## Supabase migrations (apply in order)

1. `20260427103000_redesign_core_schema.sql` — core schema (profiles, projects, applications, notifications, enums, RLS).
2. `20260427114500_harden_signup_role.sql` — prevent self-assigning admin role at signup.
3. `20260427123000_storage_project_files.sql` — `project-files` storage bucket + policies.
4. `20260427130000_freelancer_intro_profile_media.sql` — `professional_title`, `introduction`, `profile_image_path` columns + `freelancer-profiles` bucket.
5. `20260427140000_enhancement_thread.sql` — `project_enhancements` becomes a thread (both client and assigned freelancer can post).

Apply each via Supabase Dashboard → SQL Editor, or `supabase db push` if using the CLI.

## Features

- Auth: register, login, forgot password, reset password, in-app change password.
- Role-based dashboards: client, freelancer, admin.
- Client: post projects, attach files, edit/delete, accept delivery or request enhancement, view applicants & assigned freelancer.
- Freelancer: apply to projects, update status, profile (photo/title/intro/skills/software), public profile, revision thread.
- Admin: review queue with freelancer intro cards, assign freelancers, signed download URLs.
- In-app + email notifications on every status change.
- Public freelancer profiles at `/freelancers/[userId]`.
- Branded 404/500 error pages and global error boundary.
- CSP and security headers configured in `next.config.ts`.

## Email delivery

- Transactional emails (notifications) flow through `src/server/services/email.service.ts` using Resend's HTTP API.
- Supabase Auth emails (signup confirm, password reset) should be routed through Resend SMTP via Supabase Dashboard → Authentication → Emails → SMTP Settings:
  - Host: `smtp.resend.com`, Port: `465`, Username: `resend`, Password: your Resend API key.

## Deployment checklist

1. Push to GitHub.
2. Create a Vercel project pointing at this repo.
3. Add all environment variables in Vercel Project Settings.
4. Use a separate Supabase project for production (do not share with dev).
5. Apply migrations to the production database in order.
6. Connect your custom domain in Vercel and update `NEXT_PUBLIC_APP_URL`.
7. Verify the same domain in Resend and update `EMAIL_FROM`.
8. Run through smoke test: register → login → post project → apply → assign → status → enhancement → accept.

## Legal

`/privacy` and `/terms` contain ready-to-customize content. Update the placeholders in `src/config/legal.ts` (company name, contact email, address, jurisdiction, effective date) before launch.
