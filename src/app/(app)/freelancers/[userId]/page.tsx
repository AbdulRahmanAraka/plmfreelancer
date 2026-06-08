import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { formatHourlyRate } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getCurrentUserId,
  getCurrentUserRole,
  requireAuth,
} from "@/lib/auth/session";

type Props = { params: Promise<{ userId: string }> };

export default async function FreelancerPublicProfilePage({ params }: Props) {
  await requireAuth();
  const { userId } = await params;
  const viewerId = await getCurrentUserId();
  const viewerRole = await getCurrentUserRole();
  const supabase = await createSupabaseServerClient();

  const [
    { data: profile },
    { data: freelancerProfile },
    { data: skillRows },
    { data: softwareRows },
    { count: appliedCount },
    { count: assignedCount },
    { count: acceptedCount },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("user_id, full_name, role, phone")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("freelancer_profiles")
      .select(
        "user_id, country, state, address, plm_experience_years, plm_experience_months, hourly_rate, rate_negotiable, availability, looking_for_job, notice_period, portfolio_url, professional_title, introduction, profile_image_path",
      )
      .eq("user_id", userId)
      .single(),
    supabase.from("freelancer_skills").select("skill").eq("freelancer_id", userId),
    supabase.from("freelancer_software").select("software").eq("freelancer_id", userId),
    supabase
      .from("project_applications")
      .select("id", { count: "exact", head: true })
      .eq("freelancer_id", userId),
    supabase
      .from("project_applications")
      .select("id", { count: "exact", head: true })
      .eq("freelancer_id", userId)
      .eq("status", "assigned"),
    supabase
      .from("project_applications")
      .select("id", { count: "exact", head: true })
      .eq("freelancer_id", userId)
      .eq("status", "accepted"),
  ]);

  if (!profile || profile.role !== "freelancer") {
    notFound();
  }

  const isOwner = viewerId === userId;
  const isAdmin = viewerRole === "admin";
  const canSeePrivate = isOwner || isAdmin;
  const canSeeRate = viewerRole !== "client";

  let profileImageUrl: string | null = null;
  if (freelancerProfile?.profile_image_path) {
    const { data } = await supabase.storage
      .from("freelancer-profiles")
      .createSignedUrl(freelancerProfile.profile_image_path, 60 * 60);
    profileImageUrl = data?.signedUrl ?? null;
  }

  const skills = (skillRows ?? []).map((row) => row.skill);
  const software = (softwareRows ?? []).map((row) => row.software);

  const experienceLabel = (() => {
    const years = freelancerProfile?.plm_experience_years ?? 0;
    const months = freelancerProfile?.plm_experience_months ?? 0;
    if (!years && !months) return "Not specified";
    const parts: string[] = [];
    if (years) parts.push(`${years} year${years === 1 ? "" : "s"}`);
    if (months) parts.push(`${months} month${months === 1 ? "" : "s"}`);
    return parts.join(" ");
  })();

  const rateLabel =
    canSeeRate && freelancerProfile?.hourly_rate
      ? `${formatHourlyRate(Number(freelancerProfile.hourly_rate))}${
          freelancerProfile.rate_negotiable ? " (negotiable)" : ""
        }`
      : null;

  const availabilityLabel = freelancerProfile?.availability || "Not specified";

  const lookingForFullTimeLabel =
    freelancerProfile?.looking_for_job === true
      ? "Yes"
      : freelancerProfile?.looking_for_job === false
        ? "No"
        : "Not specified";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={isOwner ? "/freelancer/profile" : viewerRole === "admin" ? "/admin" : "/client"}
          className="text-sm font-medium text-indigo-700 underline"
        >
          &larr; Back
        </Link>
        {isOwner ? (
          <Link
            href="/freelancer/profile"
            className="text-sm font-medium text-indigo-700 underline"
          >
            Edit Profile
          </Link>
        ) : null}
      </div>

      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <ProfileAvatar
            src={profileImageUrl}
            alt={profile.full_name || "Freelancer"}
            size={112}
            fallbackFontSize={32}
          />
          <div className="min-w-0 space-y-1">
            <h1 className="truncate text-2xl font-bold text-indigo-950">
              {profile.full_name || "Freelancer"}
            </h1>
            {freelancerProfile?.professional_title ? (
              <p className="text-sm font-medium text-indigo-700">
                {freelancerProfile.professional_title}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {[freelancerProfile?.state, freelancerProfile?.country].filter(Boolean).join(", ") ||
                "Location not set"}
            </p>
            {freelancerProfile?.introduction ? (
              <p className="mt-2 max-w-prose whitespace-pre-wrap text-sm text-slate-700">
                {freelancerProfile.introduction}
              </p>
            ) : (
              <p className="mt-2 text-xs italic text-muted-foreground">
                No introduction provided yet.
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Applications" description="All-time applications submitted">
          <p className="text-3xl font-bold text-indigo-700">{appliedCount ?? 0}</p>
        </Card>
        <Card title="Currently Assigned">
          <p className="text-3xl font-bold text-cyan-700">{assignedCount ?? 0}</p>
        </Card>
        <Card title="Accepted Deliveries">
          <p className="text-3xl font-bold text-emerald-700">{acceptedCount ?? 0}</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Professional Details">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">PLM experience</dt>
              <dd className="font-medium text-slate-800">{experienceLabel}</dd>
            </div>
            {canSeeRate ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Hourly rate</dt>
                <dd className="font-medium text-slate-800">{rateLabel ?? "Not specified"}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Availability</dt>
              <dd className="font-medium text-slate-800">{availabilityLabel}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Looking for full-time job</dt>
              <dd className="font-medium text-slate-800">{lookingForFullTimeLabel}</dd>
            </div>
            {freelancerProfile?.looking_for_job && freelancerProfile.notice_period ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Notice period</dt>
                <dd className="font-medium text-slate-800">{freelancerProfile.notice_period}</dd>
              </div>
            ) : null}
            {freelancerProfile?.portfolio_url ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Portfolio</dt>
                <dd className="truncate font-medium text-indigo-700">
                  <a
                    href={freelancerProfile.portfolio_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline"
                  >
                    Open link
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </Card>

        <Card title="Skills & Software">
          {skills.length > 0 ? (
            <div className="mb-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {software.length > 0 ? (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Software
              </p>
              <div className="flex flex-wrap gap-1.5">
                {software.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs text-cyan-800"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {skills.length === 0 && software.length === 0 ? (
            <p className="text-xs italic text-muted-foreground">
              No skills or software added yet.
            </p>
          ) : null}
        </Card>
      </div>

      {canSeePrivate ? (
        <Card title="Contact (private)" description="Visible to admin and the freelancer only">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium text-slate-800">{profile.phone || "Not provided"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Address</dt>
              <dd className="font-medium text-slate-800">
                {freelancerProfile?.address || "Not provided"}
              </dd>
            </div>
          </dl>
        </Card>
      ) : null}
    </div>
  );
}
