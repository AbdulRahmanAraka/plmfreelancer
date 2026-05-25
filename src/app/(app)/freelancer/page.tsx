import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  addEnhancementMessageAction,
  applyToProjectAction,
  freelancerResubmitAction,
  updateFreelancerProjectStatusAction,
} from "@/app/(app)/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserId, requireRole } from "@/lib/auth/session";
import {
  EnhancementThread,
  type EnhancementMessage,
} from "@/components/projects/enhancement-thread";
import { formatBudgetRange } from "@/lib/format";
import { getFreelancerProfileStatus } from "@/server/services/freelancer-profile-status.service";
import { ProfileAvatar } from "@/components/ui/profile-avatar";

type FreelancerPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function FreelancerDashboardPage({ searchParams }: FreelancerPageProps) {
  await requireRole(["freelancer", "admin"]);
  const freelancerId = await getCurrentUserId();
  const supabase = await createSupabaseServerClient();
  const params = await searchParams;

  const [{ data: profile }, { data: freelancerProfile }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("user_id", freelancerId).single(),
    supabase
      .from("freelancer_profiles")
      .select("professional_title, introduction, profile_image_path")
      .eq("user_id", freelancerId)
      .single(),
  ]);

  const { data: applications } = await supabase
    .from("project_applications")
    .select("id, project_id, status")
    .eq("freelancer_id", freelancerId);

  const applicationMap = new Map((applications ?? []).map((item) => [item.project_id, item.status]));
  const appliedCount = (applications ?? []).length;
  const assignedCount = (applications ?? []).filter((item) => item.status === "assigned").length;
  const acceptedCount = (applications ?? []).filter((item) => item.status === "accepted").length;

  const { data: openProjects } = await supabase
    .from("projects")
    .select("id, title, description, budget_type, budget_currency, budget_min, budget_max, status, deadline, attachment_path")
    .in("status", ["open", "assigned", "in_progress"])
    .order("created_at", { ascending: false })
    .limit(20);
  const safeProjects = openProjects ?? [];

  const { data: assignedProjects } = await supabase
    .from("projects")
    .select("id, title, description, status, deadline, attachment_path, client_id")
    .eq("assigned_freelancer_id", freelancerId)
    .in("status", ["assigned", "in_progress", "completed", "accepted", "enhancement_requested"])
    .order("updated_at", { ascending: false });
  const safeAssignedProjects = assignedProjects ?? [];
  const assignedProjectIds = safeAssignedProjects.map((p) => p.id);

  const { data: enhancementRows } = assignedProjectIds.length
    ? await supabase
        .from("project_enhancements")
        .select("id, project_id, kind, description, created_at, author_id")
        .in("project_id", assignedProjectIds)
        .order("created_at", { ascending: true })
    : { data: [] as Array<{ id: number; project_id: number; kind: string; description: string; created_at: string; author_id: string }> };

  const enhancementsByProject = new Map<number, EnhancementMessage[]>();
  for (const row of enhancementRows ?? []) {
    const list = enhancementsByProject.get(row.project_id) ?? [];
    list.push({
      id: row.id,
      kind: row.kind,
      description: row.description,
      created_at: row.created_at,
      author_id: row.author_id,
      authorName: row.author_id === freelancerId ? "You" : "Client",
      authorRoleLabel: row.author_id === freelancerId ? "Freelancer" : "Client",
    });
    enhancementsByProject.set(row.project_id, list);
  }

  const combinedProjects = [...safeProjects, ...safeAssignedProjects];
  const signedAttachmentEntries = await Promise.all(
    combinedProjects
      .filter((project) => Boolean(project.attachment_path))
      .map(async (project) => {
        const { data } = await supabase.storage
          .from("project-files")
          .createSignedUrl(project.attachment_path as string, 60 * 60);
        return [project.id, data?.signedUrl ?? null] as const;
      }),
  );
  const signedAttachmentMap = new Map<number, string>(
    signedAttachmentEntries.filter((entry): entry is readonly [number, string] => Boolean(entry[1])),
  );

  let freelancerProfileImageUrl: string | null = null;
  if (freelancerProfile?.profile_image_path) {
    const { data } = await supabase
      .storage
      .from("freelancer-profiles")
      .createSignedUrl(freelancerProfile.profile_image_path, 60 * 60);
    freelancerProfileImageUrl = data?.signedUrl ?? null;
  }

  const profileStatus = await getFreelancerProfileStatus(freelancerId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-indigo-950">Freelancer Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link
            href={`/freelancers/${freelancerId}`}
            className="text-sm font-medium text-indigo-700 underline"
          >
            View Public Profile
          </Link>
          <Link href="/freelancer/profile" className="text-sm font-medium text-indigo-700 underline">
            Edit Profile
          </Link>
        </div>
      </div>

      {!profileStatus.isComplete ? (
        <div className="overflow-hidden rounded-2xl border border-amber-200 bg-linear-to-br from-amber-50 via-white to-orange-50 shadow-sm">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-1 ring-amber-200">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="text-base font-bold text-amber-900 sm:text-lg">
                Complete your profile to start applying
              </h2>
              <p className="text-sm text-amber-900/80">
                You can browse open projects below, but you must finish the
                fields marked below before the Apply button is unlocked.
              </p>
              <ul className="flex flex-wrap gap-1.5 pt-1">
                {profileStatus.missing.map((field) => (
                  <li
                    key={field}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0">
              <Link
                href="/freelancer/profile"
                className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-md"
              >
                Complete Profile
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Applications Sent">
          <p className="text-3xl font-bold text-indigo-700">{appliedCount}</p>
        </Card>
        <Card title="Assigned">
          <p className="text-3xl font-bold text-cyan-700">{assignedCount}</p>
        </Card>
        <Card title="Accepted Deliveries">
          <p className="text-3xl font-bold text-emerald-700">{acceptedCount}</p>
        </Card>
      </div>

      <Card title="Introduction" description="Your public freelancer profile summary">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <ProfileAvatar
            src={freelancerProfileImageUrl}
            alt={profile?.full_name || "Freelancer profile"}
            size={80}
            fallbackFontSize={22}
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-indigo-950">
              {freelancerProfile?.professional_title || "Freelancer"}
            </p>
            <p className="text-sm text-muted-foreground">
              {freelancerProfile?.introduction ||
                "Add your professional title and introduction in the profile page to help clients understand your strengths."}
            </p>
          </div>
        </div>
      </Card>

      <Card title="Open Opportunities" description="Apply to active client projects">
        {params.error ? (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {params.error}
          </p>
        ) : null}
        {safeProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects available right now.</p>
        ) : (
          <div className="space-y-3">
            {safeProjects.map((project) => {
              const myStatus = applicationMap.get(project.id);
              const signedUrl = signedAttachmentMap.get(project.id);

              return (
                <article key={project.id} className="rounded-xl border border-border bg-white px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-indigo-950">{project.title}</h3>
                    <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs capitalize text-indigo-800">
                      {project.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Budget ({project.budget_type ?? "—"}):{" "}
                    {formatBudgetRange(project.budget_min, project.budget_max, project.budget_currency)}
                  </p>
                  {signedUrl ? (
                    <Link
                      href={signedUrl}
                      target="_blank"
                      className="mt-1 inline-block text-xs font-medium text-indigo-700 underline"
                    >
                      Download requirement file
                    </Link>
                  ) : null}
                  <div className="mt-3">
                    {myStatus ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs capitalize text-emerald-800">
                        Application: {myStatus.replace("_", " ")}
                      </span>
                    ) : !profileStatus.isComplete ? (
                      <Link
                        href="/freelancer/profile"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Complete profile to apply
                      </Link>
                    ) : (
                      <form action={applyToProjectAction} className="flex flex-wrap items-center gap-2">
                        <input type="hidden" name="project_id" value={project.id} />
                        <input
                          type="text"
                          name="cover_letter"
                          placeholder="Short cover note (optional)"
                          className="min-w-64 rounded-lg border border-border px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="My Assigned Work" description="Update delivery status for assigned projects">
        {safeAssignedProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assigned projects yet.</p>
        ) : (
          <div className="space-y-2">
            {safeAssignedProjects.map((project) => {
              const messages = enhancementsByProject.get(project.id) ?? [];
              const showThread =
                messages.length > 0 || project.status === "enhancement_requested";
              return (
              <article key={project.id} className="rounded-xl border border-border bg-white px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-indigo-950">{project.title}</h3>
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs capitalize text-indigo-800">
                    {project.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
                {signedAttachmentMap.get(project.id) ? (
                  <Link
                    href={signedAttachmentMap.get(project.id) as string}
                    target="_blank"
                    className="mt-1 inline-block text-xs font-medium text-indigo-700 underline"
                  >
                    Download project file
                  </Link>
                ) : null}
                {project.status === "accepted" ? (
                  <p className="mt-2 inline-block rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Client accepted delivery
                  </p>
                ) : (
                  <form action={updateFreelancerProjectStatusAction} className="mt-3 flex flex-wrap gap-2">
                    <input type="hidden" name="project_id" value={project.id} />
                    <button
                      type="submit"
                      name="status"
                      value="in_progress"
                      className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
                    >
                      Mark In Progress
                    </button>
                    <button
                      type="submit"
                      name="status"
                      value="completed"
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                    >
                      Mark Completed
                    </button>
                  </form>
                )}

                {showThread ? (
                  <div className="mt-3 space-y-2 rounded-xl border border-amber-100 bg-amber-50/40 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                      Revision Thread
                    </p>
                    <EnhancementThread
                      messages={messages}
                      currentUserId={freelancerId}
                      emptyLabel="Client requested a revision but provided no note."
                    />
                    {project.status === "enhancement_requested" ? (
                      <>
                        <form action={addEnhancementMessageAction} className="space-y-2">
                          <input type="hidden" name="project_id" value={project.id} />
                          <input type="hidden" name="return_to" value="/freelancer" />
                          <textarea
                            name="description"
                            required
                            placeholder="Reply to the client"
                            className="min-h-14 w-full rounded-lg border border-border px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                          >
                            Send Reply
                          </button>
                        </form>
                        <form action={freelancerResubmitAction} className="space-y-2 border-t border-amber-100 pt-2">
                          <input type="hidden" name="project_id" value={project.id} />
                          <textarea
                            name="description"
                            placeholder="Optional note: what you changed before re-submitting"
                            className="min-h-14 w-full rounded-lg border border-border px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
                          />
                          <button
                            type="submit"
                            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                          >
                            Re-submit for Review
                          </button>
                        </form>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </article>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
