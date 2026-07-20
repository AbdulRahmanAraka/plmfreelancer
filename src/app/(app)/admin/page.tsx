import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  adminAssignProjectToFreelancerAction,
  adminUnassignProjectAction,
} from "@/app/(app)/actions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { loadFreelancerIntros } from "@/server/services/freelancer-intro.service";
import { cn } from "@/lib/utils";
import { formatBudgetRange } from "@/lib/format";
import { projectDurationLabel, projectEngagementLabel } from "@/config/constants";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { ProjectSearchBar } from "@/components/search/project-search-bar";
import { ProjectDescriptionPreview } from "@/components/projects/project-description-preview";
import { filterProjectsByQuery } from "@/lib/project-search";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{ error?: string; q?: string }>;
};

type ProjectRow = {
  id: number;
  title: string;
  description: string;
  status: string;
  budget_type: string | null;
  budget_currency: string | null;
  budget_min: number | null;
  budget_max: number | null;
  duration: string | null;
  engagement_type: string | null;
  client_id: string;
  assigned_freelancer_id: string | null;
  attachment_path: string | null;
  created_at: string;
};

type FreelancerOption = {
  user_id: string;
  full_name: string;
  professional_title: string | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return dateFormatter.format(d);
}

function formatBudget(
  type: string | null,
  currency: string | null,
  min: number | null,
  max: number | null,
): string {
  if (min == null && max == null) return "Not specified";
  const range = formatBudgetRange(min, max, currency);
  return type ? `${range} (${type.replace("_", " ")})` : range;
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "open":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "assigned":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    case "in_progress":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "completed":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    case "accepted":
      return "bg-violet-50 text-violet-700 ring-violet-200";
    case "enhancement_requested":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-200";
  }
}

export default async function AdminDashboardPage({ searchParams }: AdminPageProps) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const searchQuery = (params.q ?? "").trim();

  const admin = createSupabaseAdminClient();
  const supabaseServer = await createSupabaseServerClient();

  const { data: projectsRaw, error: projectsError } = await admin
    .from("projects")
    .select(
      "id, title, description, status, budget_type, budget_currency, budget_min, budget_max, duration, engagement_type, client_id, assigned_freelancer_id, attachment_path, created_at",
    )
    .order("created_at", { ascending: false });

  const projects = (projectsRaw ?? []) as ProjectRow[];
  const filteredProjects = filterProjectsByQuery(projects, searchQuery);

  const clientIds = [...new Set(projects.map((p) => p.client_id))];
  const assignedIds = [
    ...new Set(
      projects
        .map((p) => p.assigned_freelancer_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const involvedProfileIds = [...new Set([...clientIds, ...assignedIds])];

  const { data: involvedProfiles } = involvedProfileIds.length
    ? await admin
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", involvedProfileIds)
    : { data: [] as Array<{ user_id: string; full_name: string | null }> };

  const profileNameMap = new Map<string, string>(
    (involvedProfiles ?? []).map((p) => [p.user_id, (p.full_name ?? "").trim() || "—"]),
  );

  const { data: freelancerProfiles } = await admin
    .from("profiles")
    .select("user_id, full_name")
    .eq("role", "freelancer")
    .eq("is_active", true)
    .order("full_name");

  const freelancerProfileIds = (freelancerProfiles ?? []).map((p) => p.user_id);

  const { data: freelancerDetails } = freelancerProfileIds.length
    ? await admin
        .from("freelancer_profiles")
        .select("user_id, professional_title")
        .in("user_id", freelancerProfileIds)
    : { data: [] as Array<{ user_id: string; professional_title: string | null }> };

  const freelancerTitleMap = new Map<string, string | null>(
    (freelancerDetails ?? []).map((d) => [d.user_id, d.professional_title ?? null]),
  );

  const freelancers: FreelancerOption[] = (freelancerProfiles ?? []).map((p) => ({
    user_id: p.user_id,
    full_name: (p.full_name ?? "").trim() || "Unnamed freelancer",
    professional_title: freelancerTitleMap.get(p.user_id) ?? null,
  }));

  const projectIds = projects.map((p) => p.id);

  const { data: applicationsRaw } = projectIds.length
    ? await admin
        .from("project_applications")
        .select("id, project_id, freelancer_id, status, applied_at, cover_letter")
        .in("project_id", projectIds)
        .in("status", ["applied", "shortlisted"])
        .order("applied_at", { ascending: false })
    : {
        data: [] as Array<{
          id: number;
          project_id: number;
          freelancer_id: string;
          status: string;
          applied_at: string;
          cover_letter: string | null;
        }>,
      };

  const applications = (applicationsRaw ?? []) as Array<{
    id: number;
    project_id: number;
    freelancer_id: string;
    status: string;
    applied_at: string;
    cover_letter: string | null;
  }>;

  const applicationsByProject = new Map<
    number,
    Array<{
      id: number;
      freelancer_id: string;
      status: string;
      applied_at: string;
      cover_letter: string | null;
    }>
  >();
  for (const app of applications) {
    const list = applicationsByProject.get(app.project_id) ?? [];
    list.push({
      id: app.id,
      freelancer_id: app.freelancer_id,
      status: app.status,
      applied_at: app.applied_at,
      cover_letter: app.cover_letter,
    });
    applicationsByProject.set(app.project_id, list);
  }

  const applicantAndAssignedIds = [
    ...new Set([...applications.map((a) => a.freelancer_id), ...assignedIds]),
  ];
  const freelancerIntroMap = await loadFreelancerIntros(applicantAndAssignedIds);

  for (const id of applicantAndAssignedIds) {
    const intro = freelancerIntroMap.get(id);
    if (intro?.fullName) {
      profileNameMap.set(id, intro.fullName);
    }
    if (intro?.professionalTitle !== undefined && !freelancerTitleMap.has(id)) {
      freelancerTitleMap.set(id, intro.professionalTitle ?? null);
    }
  }

  const applicantTimeFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const signedAttachmentEntries = await Promise.all(
    projects
      .filter((p) => Boolean(p.attachment_path))
      .map(async (p) => {
        const { data } = await supabaseServer.storage
          .from("project-files")
          .createSignedUrl(p.attachment_path as string, 60 * 60);
        return [p.id, data?.signedUrl ?? null] as const;
      }),
  );
  const signedAttachmentMap = new Map<number, string>(
    signedAttachmentEntries.filter((entry): entry is readonly [number, string] =>
      Boolean(entry[1]),
    ),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">Admin Console</h1>
          <p className="text-sm text-muted-foreground">
            All projects across the platform. Assign or reassign freelancers.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-indigo-900">
          {projects.length} {projects.length === 1 ? "project" : "projects"} • {freelancers.length} freelancers
        </div>
      </div>

      {params.error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {params.error}
        </p>
      ) : null}

      <div className="rounded-xl border border-border bg-white p-3">
        <Suspense fallback={<div className="h-10 animate-pulse rounded-xl bg-indigo-50" />}>
          <ProjectSearchBar
            actionPath="/admin"
            placeholder="Search projects by title, skill, or software..."
            syncFromUrl
          />
        </Suspense>
      </div>

      {projectsError ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {projectsError.message}
        </p>
      ) : null}

      {projects.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <p className="text-sm text-muted-foreground">No projects yet.</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No projects match &ldquo;{searchQuery}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const clientName = profileNameMap.get(project.client_id) ?? "Unknown client";
            const assignedName = project.assigned_freelancer_id
              ? profileNameMap.get(project.assigned_freelancer_id) ?? "—"
              : null;
            const attachmentUrl = signedAttachmentMap.get(project.id);
            const canAssign = project.status !== "accepted";
            const projectApplicants = applicationsByProject.get(project.id) ?? [];
            const applicantIdSet = new Set(projectApplicants.map((a) => a.freelancer_id));

            return (
              <article
                key={project.id}
                className="rounded-xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <header className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-lg font-semibold text-indigo-950 hover:underline"
                      >
                        {project.title}
                      </Link>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1",
                          statusBadgeClass(project.status),
                        )}
                      >
                        {project.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Project #{project.id} • Created {formatDate(project.created_at)}
                    </p>
                  </div>
                  <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
                </header>

                <ProjectDescriptionPreview
                  description={project.description}
                  projectId={project.id}
                  maxLines={3}
                  className="mt-3"
                />

                <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-indigo-700/70">
                      Client
                    </dt>
                    <dd className="mt-0.5 text-indigo-950">{clientName}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-indigo-700/70">
                      Budget
                    </dt>
                    <dd className="mt-0.5 text-indigo-950">
                      {formatBudget(
                        project.budget_type,
                        project.budget_currency,
                        project.budget_min,
                        project.budget_max,
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-indigo-700/70">
                      Duration
                    </dt>
                    <dd className="mt-0.5 text-indigo-950">
                      {projectDurationLabel(project.duration)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-indigo-700/70">
                      Engagement
                    </dt>
                    <dd className="mt-0.5 text-indigo-950">
                      {projectEngagementLabel(project.engagement_type)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-indigo-700/70">
                      Assigned
                    </dt>
                    <dd className="mt-0.5 text-indigo-950">
                      {assignedName ? (
                        <span className="font-medium text-indigo-700">{assignedName}</span>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </dd>
                  </div>
                </dl>

                {attachmentUrl ? (
                  <p className="mt-3">
                    <Link
                      href={attachmentUrl}
                      target="_blank"
                      className="text-xs font-medium text-indigo-700 underline"
                    >
                      Download attachment
                    </Link>
                  </p>
                ) : null}

                {projectApplicants.length > 0 ? (
                  <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50/40 p-3">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                      Applicants ({projectApplicants.length})
                    </p>
                    <ul className="space-y-3">
                      {projectApplicants.map((app) => {
                        const intro = freelancerIntroMap.get(app.freelancer_id);
                        const applicantName =
                          intro?.fullName?.trim() ||
                          profileNameMap.get(app.freelancer_id) ||
                          "Unknown freelancer";
                        const applicantTitle =
                          intro?.professionalTitle ?? freelancerTitleMap.get(app.freelancer_id);
                        const applicantIntroText = intro?.introduction;
                        const applicantImageUrl = intro?.profileImageUrl;
                        const isAssignedAlready =
                          project.assigned_freelancer_id === app.freelancer_id;
                        return (
                          <li key={app.id}>
                            <article className="rounded-lg border border-border bg-white p-3">
                              <div className="flex flex-wrap items-start gap-3">
                                <ProfileAvatar
                                  src={applicantImageUrl}
                                  alt={applicantName}
                                  size={56}
                                  fallbackFontSize={18}
                                />
                                <div className="min-w-0 flex-1">
                                  <Link
                                    href={`/freelancers/${app.freelancer_id}`}
                                    className="block"
                                  >
                                    <p className="font-semibold text-indigo-950 hover:underline">
                                      {applicantName}
                                    </p>
                                  </Link>
                                  {applicantTitle ? (
                                    <p className="text-xs font-medium text-indigo-700">
                                      {applicantTitle}
                                    </p>
                                  ) : null}
                                  {applicantIntroText ? (
                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                      {applicantIntroText}
                                    </p>
                                  ) : null}
                                </div>
                                <form
                                  action={adminAssignProjectToFreelancerAction}
                                  className="shrink-0"
                                >
                                  <input
                                    type="hidden"
                                    name="project_id"
                                    value={project.id}
                                  />
                                  <input
                                    type="hidden"
                                    name="freelancer_id"
                                    value={app.freelancer_id}
                                  />
                                  <Button
                                    type="submit"
                                    variant={isAssignedAlready ? "subtle" : "primary"}
                                    size="sm"
                                    disabled={isAssignedAlready || !canAssign}
                                    loadingText="Assigning..."
                                    className="rounded-full px-3.5 py-1.5"
                                  >
                                    {isAssignedAlready ? "Assigned" : "Assign"}
                                  </Button>
                                </form>
                              </div>

                              {app.cover_letter ? (
                                <div className="mt-3 rounded-md border border-indigo-100 bg-indigo-50/60 p-2.5">
                                  <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-700">
                                    Cover Note
                                  </p>
                                  <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-indigo-950/90">
                                    {app.cover_letter}
                                  </p>
                                </div>
                              ) : (
                                <p className="mt-3 text-[11px] italic text-muted-foreground">
                                  No cover note provided.
                                </p>
                              )}

                              <p className="mt-2 text-[11px] text-muted-foreground">
                                Applied {applicantTimeFormatter.format(new Date(app.applied_at))}
                                <span className="mx-1.5 text-indigo-200">•</span>
                                <Link
                                  href={`/freelancers/${app.freelancer_id}`}
                                  className="font-medium text-indigo-700 hover:underline"
                                >
                                  View full profile →
                                </Link>
                              </p>
                            </article>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-muted-foreground">
                    No freelancer has applied to this project yet.
                  </p>
                )}

                <div className="mt-4 border-t border-border pt-4">
                  {canAssign ? (
                    <details className="group">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800 group-open:bg-indigo-800">
                        <span>
                          {assignedName ? "Reassign Freelancer" : "Assign Freelancer"}
                        </span>
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
                          className="transition group-open:rotate-180"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </summary>

                      <div className="mt-3 rounded-lg border border-border bg-slate-50/60 p-3">
                        {assignedName ? (
                          <form
                            action={adminUnassignProjectAction}
                            className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-rose-200 bg-rose-50/70 px-3 py-2"
                          >
                            <input type="hidden" name="project_id" value={project.id} />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                                Currently assigned
                              </p>
                              <p className="text-sm font-semibold text-indigo-950">
                                {assignedName}
                              </p>
                            </div>
                            <Button
                              type="submit"
                              size="sm"
                              variant="softDestructive"
                              loadingText="Cancelling..."
                              className="rounded-md border-rose-300 bg-white px-3 py-1.5 shadow-sm hover:border-rose-400 hover:bg-rose-100"
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
                                <path d="M18 6 6 18M6 6l12 12" />
                              </svg>
                              Cancel Assignment
                            </Button>
                          </form>
                        ) : null}

                        {freelancers.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No freelancers available.
                          </p>
                        ) : (
                          <>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-700/70">
                              {assignedName
                                ? "Or pick a different freelancer"
                                : "Select a freelancer to assign"}
                            </p>
                            <ul className="max-h-72 space-y-1 overflow-y-auto">
                              {freelancers.map((f) => {
                                const isCurrentlyAssigned =
                                  project.assigned_freelancer_id === f.user_id;
                                const hasApplied = applicantIdSet.has(f.user_id);
                                return (
                                  <li key={f.user_id}>
                                    <form action={adminAssignProjectToFreelancerAction}>
                                      <input
                                        type="hidden"
                                        name="project_id"
                                        value={project.id}
                                      />
                                      <input
                                        type="hidden"
                                        name="freelancer_id"
                                        value={f.user_id}
                                      />
                                      <Button
                                        type="submit"
                                        variant={isCurrentlyAssigned ? "subtle" : "secondary"}
                                        size="md"
                                        disabled={isCurrentlyAssigned}
                                        loadingText="Assigning..."
                                        className="w-full rounded-md px-3 py-2 text-left shadow-none hover:border-indigo-400 hover:shadow-sm"
                                      >
                                        <span className="min-w-0 flex-1">
                                          <span className="flex items-center gap-2">
                                            <span className="text-sm font-semibold">
                                              {f.full_name}
                                            </span>
                                            {hasApplied ? (
                                              <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                                Applied
                                              </span>
                                            ) : null}
                                          </span>
                                          {f.professional_title ? (
                                            <span className="block text-xs font-normal text-muted-foreground">
                                              {f.professional_title}
                                            </span>
                                          ) : null}
                                        </span>
                                        <span
                                          className={cn(
                                            "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                                            isCurrentlyAssigned
                                              ? "bg-indigo-100 text-indigo-700"
                                              : "bg-indigo-700 text-white",
                                          )}
                                        >
                                          {isCurrentlyAssigned ? "Assigned" : "Assign"}
                                        </span>
                                      </Button>
                                    </form>
                                  </li>
                                );
                              })}
                            </ul>
                          </>
                        )}
                      </div>
                    </details>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      This project has been accepted by the client and is closed for reassignment.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
