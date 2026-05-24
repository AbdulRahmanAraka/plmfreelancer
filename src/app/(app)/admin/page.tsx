import { Card } from "@/components/ui/card";
import { assignFreelancerAction } from "@/app/(app)/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { FreelancerIntroCard } from "@/components/freelancer/freelancer-intro-card";
import { loadFreelancerIntros } from "@/server/services/freelancer-intro.service";
import Link from "next/link";

type AdminPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminDashboardPage({ searchParams }: AdminPageProps) {
  await requireRole(["admin"]);
  const supabase = await createSupabaseServerClient();
  const params = await searchParams;

  const { data: applications } = await supabase
    .from("project_applications")
    .select("id, project_id, freelancer_id, status, applied_at")
    .in("status", ["applied", "shortlisted", "assigned"])
    .order("applied_at", { ascending: false })
    .limit(50);

  const safeApplications = applications ?? [];
  const projectIds = [...new Set(safeApplications.map((app) => app.project_id))];
  const freelancerIds = [...new Set(safeApplications.map((app) => app.freelancer_id))];

  const { data: projects } = projectIds.length
    ? await supabase
        .from("projects")
        .select("id, title, status, attachment_path")
        .in("id", projectIds)
    : { data: [] as Array<{ id: number; title: string; status: string; attachment_path: string | null }> };

  const projectMap = new Map((projects ?? []).map((project) => [project.id, project]));
  const freelancerIntroMap = await loadFreelancerIntros(freelancerIds);

  const signedAttachmentEntries = await Promise.all(
    (projects ?? [])
      .filter((project) => Boolean(project.attachment_path))
      .map(async (project) => {
        const { data } = await supabase
          .storage
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
      <h1 className="text-2xl font-bold text-indigo-950">Admin Console</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Freelancer Pool">
          <p className="text-sm text-muted-foreground">Manage freelancer profiles, skills, and assignments.</p>
        </Card>
        <Card title="Client Project Queue">
          <p className="text-sm text-muted-foreground">Monitor open projects and dispatch suitable freelancers.</p>
        </Card>
      </div>
      <Card title="Operations Overview" description="Approve applications and assign freelancers to projects">
        {params.error ? (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {params.error}
          </p>
        ) : null}
        {safeApplications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending applications in queue.</p>
        ) : (
          <div className="space-y-2">
            {safeApplications.map((item) => {
              const project = projectMap.get(item.project_id);
              const intro = freelancerIntroMap.get(item.freelancer_id) ?? {
                userId: item.freelancer_id,
                fullName: item.freelancer_id,
                professionalTitle: null,
                introduction: null,
                profileImageUrl: null,
              };

              return (
                <article
                  key={item.id}
                  className="space-y-3 rounded-xl border border-border bg-white px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-indigo-950">
                      {project?.title ?? `Project #${item.project_id}`}
                    </p>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs capitalize text-indigo-700">
                      {item.status.replace("_", " ")}
                    </span>
                  </div>
                  <FreelancerIntroCard freelancer={intro} />
                  {signedAttachmentMap.get(item.project_id) ? (
                    <Link
                      href={signedAttachmentMap.get(item.project_id) as string}
                      target="_blank"
                      className="inline-block text-xs font-medium text-indigo-700 underline"
                    >
                      Download attachment
                    </Link>
                  ) : null}
                  <form action={assignFreelancerAction} className="pt-1">
                    <input type="hidden" name="project_id" value={item.project_id} />
                    <input type="hidden" name="freelancer_id" value={item.freelancer_id} />
                    <input type="hidden" name="application_id" value={item.id} />
                    <button
                      type="submit"
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      Assign Freelancer
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
