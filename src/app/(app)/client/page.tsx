import { Card } from "@/components/ui/card";
import {
  addEnhancementMessageAction,
  clientDecisionAction,
  deleteProjectAction,
} from "@/app/(app)/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserId, requireRole } from "@/lib/auth/session";
import { FreelancerIntroCard } from "@/components/freelancer/freelancer-intro-card";
import { loadFreelancerIntros } from "@/server/services/freelancer-intro.service";
import {
  EnhancementThread,
  type EnhancementMessage,
} from "@/components/projects/enhancement-thread";
import { ProjectCreateForm } from "@/components/projects/project-create-form";
import { ProjectUpdateForm } from "@/components/projects/project-update-form";
import Link from "next/link";

type ClientPageProps = { searchParams: Promise<{ error?: string }> };

export default async function ClientDashboardPage({ searchParams }: ClientPageProps) {
  await requireRole(["client", "admin"]);
  const clientId = await getCurrentUserId();
  const supabase = await createSupabaseServerClient();
  const params = await searchParams;

  const { data: projects } = await supabase
    .from("projects")
    .select(
      "id, title, description, status, budget_type, budget_min, budget_max, deadline, attachment_path, assigned_freelancer_id, created_at",
    )
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  const safeProjects = projects ?? [];
  const projectIds = safeProjects.map((p) => p.id);

  const { data: applications } = projectIds.length
    ? await supabase
        .from("project_applications")
        .select("id, project_id, freelancer_id, status, applied_at")
        .in("project_id", projectIds)
        .order("applied_at", { ascending: false })
    : { data: [] as Array<{ id: number; project_id: number; freelancer_id: string; status: string; applied_at: string }> };

  const safeApplications = applications ?? [];
  const applicationsByProject = new Map<number, typeof safeApplications>();
  for (const app of safeApplications) {
    const list = applicationsByProject.get(app.project_id) ?? [];
    list.push(app);
    applicationsByProject.set(app.project_id, list);
  }

  const freelancerIdsForIntro = [
    ...safeApplications.map((a) => a.freelancer_id),
    ...safeProjects.map((p) => p.assigned_freelancer_id).filter(Boolean) as string[],
  ];
  const freelancerIntroMap = await loadFreelancerIntros(freelancerIdsForIntro);

  const { data: enhancementRows } = projectIds.length
    ? await supabase
        .from("project_enhancements")
        .select("id, project_id, kind, description, created_at, author_id")
        .in("project_id", projectIds)
        .order("created_at", { ascending: true })
    : { data: [] as Array<{ id: number; project_id: number; kind: string; description: string; created_at: string; author_id: string }> };

  const enhancementsByProject = new Map<number, EnhancementMessage[]>();
  for (const row of enhancementRows ?? []) {
    const list = enhancementsByProject.get(row.project_id) ?? [];
    const freelancerIntro = freelancerIntroMap.get(row.author_id);
    list.push({
      id: row.id,
      kind: row.kind,
      description: row.description,
      created_at: row.created_at,
      author_id: row.author_id,
      authorName: row.author_id === clientId ? "You" : freelancerIntro?.fullName ?? null,
      authorRoleLabel: row.author_id === clientId ? "Client" : "Freelancer",
    });
    enhancementsByProject.set(row.project_id, list);
  }

  const openCount = safeProjects.filter((p) => p.status === "open").length;
  const inProgressCount = safeProjects.filter((p) =>
    ["assigned", "in_progress"].includes(p.status),
  ).length;
  const completedCount = safeProjects.filter((p) =>
    ["completed", "accepted"].includes(p.status),
  ).length;

  const signedAttachmentEntries = await Promise.all(
    safeProjects
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-indigo-950">Client Dashboard</h1>
        <Link href="/client/profile" className="text-sm font-medium text-indigo-700 underline">
          Edit Profile
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Open Projects" className="md:col-span-1">
          <p className="text-3xl font-bold text-indigo-700">{openCount}</p>
        </Card>
        <Card title="In Progress" className="md:col-span-1">
          <p className="text-3xl font-bold text-cyan-700">{inProgressCount}</p>
        </Card>
        <Card title="Completed" className="md:col-span-1">
          <p className="text-3xl font-bold text-emerald-700">{completedCount}</p>
        </Card>
      </div>

      <Card title="Post a New Project" description="Create a requirement for freelancers to apply">
        {params.error ? (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {params.error}
          </p>
        ) : null}
        <ProjectCreateForm />
      </Card>

      <Card title="My Projects" description="Live data from projects table">
        {safeProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet. Create your first project above.</p>
        ) : (
          <div className="space-y-2">
            {safeProjects.map((project) => {
              const projectApplications = applicationsByProject.get(project.id) ?? [];
              const assignedIntro = project.assigned_freelancer_id
                ? freelancerIntroMap.get(project.assigned_freelancer_id)
                : null;

              return (
              <article
                key={project.id}
                className="rounded-xl border border-border bg-indigo-50/50 px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-indigo-950">{project.title}</p>
                  <span className="rounded-full bg-white px-2 py-1 text-xs capitalize text-indigo-700">
                    {project.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Budget: {project.budget_type ?? "-"} | {project.budget_min ?? 0} - {project.budget_max ?? 0}
                </p>
                {project.attachment_path ? (
                  <div className="mt-2">
                    {signedAttachmentMap.get(project.id) ? (
                      <Link
                        href={signedAttachmentMap.get(project.id) as string}
                        target="_blank"
                        className="text-xs font-medium text-indigo-700 underline"
                      >
                        Download attachment
                      </Link>
                    ) : (
                      <p className="text-xs text-muted-foreground">Attachment available but signed URL unavailable.</p>
                    )}
                  </div>
                ) : null}

                {assignedIntro ? (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Assigned Freelancer
                    </p>
                    <FreelancerIntroCard freelancer={assignedIntro} />
                  </div>
                ) : null}

                {projectApplications.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                      Applicants ({projectApplications.length})
                    </p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {projectApplications.map((app) => {
                        const intro = freelancerIntroMap.get(app.freelancer_id);
                        if (!intro) return null;
                        return (
                          <div key={app.id} className="space-y-1">
                            <FreelancerIntroCard freelancer={intro} compact />
                            <p className="px-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                              Status: {app.status.replace("_", " ")}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {project.status === "completed" ? (
                  <div className="mt-3 space-y-2 rounded-xl border border-amber-100 bg-amber-50/40 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                      Freelancer marked this completed. Review and decide.
                    </p>
                    <form action={clientDecisionAction} className="space-y-2">
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="decision" value="enhancement_requested" />
                      <textarea
                        name="description"
                        required
                        placeholder="Describe the changes you need (required for enhancement)"
                        className="min-h-16 w-full rounded-lg border border-border px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
                      >
                        Request Enhancement
                      </button>
                    </form>
                    <form action={clientDecisionAction}>
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="decision" value="accepted" />
                      <button
                        type="submit"
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                      >
                        Accept Delivery
                      </button>
                    </form>
                  </div>
                ) : null}

                {(enhancementsByProject.get(project.id)?.length ?? 0) > 0 ||
                project.status === "enhancement_requested" ? (
                  <div className="mt-3 space-y-2 rounded-xl border border-amber-100 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                      Revision Thread
                    </p>
                    <EnhancementThread
                      messages={enhancementsByProject.get(project.id) ?? []}
                      currentUserId={clientId}
                      emptyLabel="No messages yet."
                    />
                    {project.status === "enhancement_requested" ? (
                      <form action={addEnhancementMessageAction} className="space-y-2">
                        <input type="hidden" name="project_id" value={project.id} />
                        <input type="hidden" name="return_to" value="/client" />
                        <textarea
                          name="description"
                          required
                          placeholder="Add a note for the freelancer"
                          className="min-h-14 w-full rounded-lg border border-border px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                        >
                          Send Note
                        </button>
                      </form>
                    ) : null}
                  </div>
                ) : null}
                <ProjectUpdateForm
                  project={{
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    budget_min: project.budget_min,
                    budget_max: project.budget_max,
                    deadline: project.deadline,
                    attachment_path: project.attachment_path,
                  }}
                />
                <form action={deleteProjectAction} className="mt-2">
                  <input type="hidden" name="project_id" value={project.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700"
                  >
                    Delete Project
                  </button>
                </form>
              </article>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
