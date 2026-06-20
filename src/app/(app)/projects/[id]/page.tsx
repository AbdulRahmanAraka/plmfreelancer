import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  applyToProjectAction,
  addEnhancementMessageAction,
  freelancerResubmitAction,
  updateFreelancerProjectStatusAction,
} from '@/app/(app)/actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { getCurrentUserId, getCurrentUserRole, requireAuth } from '@/lib/auth/session'
import {
  EnhancementThread,
  type EnhancementMessage,
} from '@/components/projects/enhancement-thread'
import { DeleteProjectButton } from '@/components/projects/delete-project-button'
import { ProjectSkillsList } from '@/components/projects/project-skills-list'
import { formatBudgetRange } from '@/lib/format'
import { getFreelancerProfileStatus } from '@/server/services/freelancer-profile-status.service'
import { cn } from '@/lib/utils'

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return dateFormatter.format(d)
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'open':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    case 'assigned':
      return 'bg-indigo-50 text-indigo-700 ring-indigo-200'
    case 'in_progress':
      return 'bg-amber-50 text-amber-700 ring-amber-200'
    case 'completed':
      return 'bg-sky-50 text-sky-700 ring-sky-200'
    case 'accepted':
      return 'bg-violet-50 text-violet-700 ring-violet-200'
    case 'enhancement_requested':
      return 'bg-rose-50 text-rose-700 ring-rose-200'
    default:
      return 'bg-slate-50 text-slate-700 ring-slate-200'
  }
}

function backHrefForRole(role: string): string {
  if (role === 'admin') return '/admin'
  if (role === 'client') return '/client'
  return '/freelancer'
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  await requireAuth()
  const userId = await getCurrentUserId()
  const role = await getCurrentUserRole()
  const { id } = await params
  const projectId = Number(id)

  if (!projectId || Number.isNaN(projectId)) {
    notFound()
  }

  const supabase = await createSupabaseServerClient()
  const admin = role === 'admin' ? createSupabaseAdminClient() : null
  const db = admin ?? supabase

  const { data: project, error } = await db
    .from('projects')
    .select(
      'id, title, description, status, budget_type, budget_currency, budget_min, budget_max, deadline, attachment_path, client_id, assigned_freelancer_id, created_at, updated_at',
    )
    .eq('id', projectId)
    .single()

  if (error || !project) {
    notFound()
  }

  if (role === 'client' && project.client_id !== userId) {
    notFound()
  }

  const { data: skillRows } = await db
    .from('project_skills')
    .select('skill')
    .eq('project_id', projectId)

  const projectSkills = (skillRows ?? []).map((row) => row.skill)

  let signedAttachmentUrl: string | null = null
  if (project.attachment_path) {
    const { data } = await supabase.storage
      .from('project-files')
      .createSignedUrl(project.attachment_path, 60 * 60)
    signedAttachmentUrl = data?.signedUrl ?? null
  }

  const isAssignedFreelancer = project.assigned_freelancer_id === userId
  const isFreelancerView = role === 'freelancer' || role === 'admin'

  const [{ data: application }, profileStatus] = await Promise.all([
    isFreelancerView
      ? supabase
          .from('project_applications')
          .select('status')
          .eq('project_id', projectId)
          .eq('freelancer_id', userId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    role === 'freelancer' ? getFreelancerProfileStatus(userId) : Promise.resolve(null),
  ])

  let enhancementMessages: EnhancementMessage[] = []
  if (isAssignedFreelancer) {
    const { data: enhancementRows } = await supabase
      .from('project_enhancements')
      .select('id, project_id, kind, description, created_at, author_id')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    enhancementMessages = (enhancementRows ?? []).map((row) => ({
      id: row.id,
      kind: row.kind,
      description: row.description,
      created_at: row.created_at,
      author_id: row.author_id,
      authorName: row.author_id === userId ? 'You' : 'Client',
      authorRoleLabel: row.author_id === userId ? 'Freelancer' : 'Client',
    }))
  }

  const backHref = backHrefForRole(role ?? 'freelancer')
  const myApplicationStatus = application?.status ?? null
  const showApply =
    role === 'freelancer' &&
    !myApplicationStatus &&
    ['open', 'assigned', 'in_progress'].includes(project.status)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700 hover:underline"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to projects
        </Link>
        {role === 'admin' ? (
          <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
        ) : null}
      </div>

      <Card>
        <div className="space-y-4">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-indigo-950">{project.title}</h1>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1',
                    statusBadgeClass(project.status),
                  )}
                >
                  {project.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Project #{project.id} • Posted {formatDate(project.created_at)}
              </p>
            </div>
          </header>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-indigo-700/70">
              Description
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-indigo-950/90">
              {project.description}
            </p>
          </div>

          <ProjectSkillsList skills={projectSkills} />

          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-indigo-700/70">
                Budget
              </dt>
              <dd className="mt-1 font-medium text-indigo-950">
                {formatBudgetRange(project.budget_min, project.budget_max, project.budget_currency)}
                {project.budget_type ? (
                  <span className="text-muted-foreground"> ({project.budget_type})</span>
                ) : null}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-indigo-700/70">
                Deadline
              </dt>
              <dd className="mt-1 font-medium text-indigo-950">{formatDate(project.deadline)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-indigo-700/70">
                Last Updated
              </dt>
              <dd className="mt-1 font-medium text-indigo-950">{formatDate(project.updated_at)}</dd>
            </div>
          </dl>

          {signedAttachmentUrl ? (
            <p>
              <Link
                href={signedAttachmentUrl}
                target="_blank"
                className="text-sm font-medium text-indigo-700 underline"
              >
                Download requirement file
              </Link>
            </p>
          ) : null}

          {showApply ? (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
              <h3 className="text-sm font-semibold text-indigo-950">Apply to this project</h3>
              {!profileStatus?.isComplete ? (
                <div className="mt-2">
                  <p className="text-sm text-amber-800">
                    Complete your profile before applying.
                  </p>
                  <Link
                    href="/freelancer/profile"
                    className="mt-2 inline-flex text-sm font-semibold text-indigo-700 underline"
                  >
                    Complete profile →
                  </Link>
                </div>
              ) : (
                <form action={applyToProjectAction} className="mt-3 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="project_id" value={project.id} />
                  <input
                    type="text"
                    name="cover_letter"
                    placeholder="Short cover note (optional)"
                    className="min-w-64 flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  />
                  <Button type="submit" size="sm" loadingText="Applying...">
                    Apply
                  </Button>
                </form>
              )}
            </div>
          ) : null}

          {myApplicationStatus ? (
            <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium capitalize text-emerald-800">
              Your application: {myApplicationStatus.replace('_', ' ')}
            </p>
          ) : null}

          {isAssignedFreelancer ? (
            <div className="space-y-3 rounded-xl border border-border bg-slate-50/60 p-4">
              <h3 className="text-sm font-semibold text-indigo-950">Assigned work actions</h3>
              {project.status === 'accepted' ? (
                <p className="text-sm text-emerald-700">Client accepted delivery.</p>
              ) : (
                <form action={updateFreelancerProjectStatusAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="project_id" value={project.id} />
                  <Button type="submit" name="status" value="in_progress" variant="subtle" size="sm" loadingText="Updating...">
                    Mark In Progress
                  </Button>
                  <Button type="submit" name="status" value="completed" variant="softSuccess" size="sm" loadingText="Updating...">
                    Mark Completed
                  </Button>
                </form>
              )}

              {(enhancementMessages.length > 0 || project.status === 'enhancement_requested') ? (
                <div className="space-y-2 rounded-xl border border-amber-100 bg-amber-50/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                    Revision Thread
                  </p>
                  <EnhancementThread
                    messages={enhancementMessages}
                    currentUserId={userId}
                    emptyLabel="Client requested a revision but provided no note."
                  />
                  {project.status === 'enhancement_requested' ? (
                    <>
                      <form action={addEnhancementMessageAction} className="space-y-2">
                        <input type="hidden" name="project_id" value={project.id} />
                        <input type="hidden" name="return_to" value={`/projects/${project.id}`} />
                        <textarea
                          name="description"
                          required
                          placeholder="Reply to the client"
                          className="min-h-14 w-full rounded-lg border border-border px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
                        />
                        <Button type="submit" size="xs" variant="primary" loadingText="Sending...">
                          Send Reply
                        </Button>
                      </form>
                      <form action={freelancerResubmitAction} className="space-y-2 border-t border-amber-100 pt-2">
                        <input type="hidden" name="project_id" value={project.id} />
                        <textarea
                          name="description"
                          placeholder="Optional note before re-submitting"
                          className="min-h-14 w-full rounded-lg border border-border px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
                        />
                        <Button type="submit" size="xs" variant="softSuccess" loadingText="Re-submitting...">
                          Re-submit for Review
                        </Button>
                      </form>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  )
}
