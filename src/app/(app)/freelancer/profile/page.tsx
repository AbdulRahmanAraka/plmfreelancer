import { Card } from "@/components/ui/card";
import { FreelancerProfileForm } from "@/components/profiles/freelancer-profile-form";
import { SKILL_OPTIONS, SOFTWARE_OPTIONS } from "@/config/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserId, requireRole } from "@/lib/auth/session";

type FreelancerProfilePageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function FreelancerProfilePage({
  searchParams,
}: FreelancerProfilePageProps) {
  await requireRole(["freelancer", "admin"]);
  const userId = await getCurrentUserId();
  const supabase = await createSupabaseServerClient();
  const params = await searchParams;

  const [{ data: profile }, { data: freelancerProfile }, { data: skillRows }, { data: softwareRows }] =
    await Promise.all([
      supabase.from("profiles").select("full_name, phone").eq("user_id", userId).single(),
      supabase
        .from("freelancer_profiles")
        .select(
          "country, state, hourly_rate, plm_experience_years, plm_experience_months, professional_title, introduction, availability, looking_for_job, notice_period, portfolio_url, profile_image_path",
        )
        .eq("user_id", userId)
        .single(),
      supabase.from("freelancer_skills").select("skill").eq("freelancer_id", userId),
      supabase.from("freelancer_software").select("software").eq("freelancer_id", userId),
    ]);

  const currentSkills = (skillRows ?? []).map((item) => item.skill);
  const currentSoftware = (softwareRows ?? []).map((item) => item.software);
  const profileImagePath = freelancerProfile?.profile_image_path as string | null | undefined;

  // `looking_for_job` defaults to `true` in the DB for new rows before the user
  // answers the question. Treat that factory default as "unanswered" so we do
  // not pre-select "Yes" and silently require notice period on first save.
  const fullTimeJobPreferenceAnswered =
    freelancerProfile?.looking_for_job === false ||
    Boolean(freelancerProfile?.notice_period?.trim());
  const lookingForFullTimeJob = !fullTimeJobPreferenceAnswered
    ? ""
    : freelancerProfile?.looking_for_job === true
      ? "yes"
      : freelancerProfile?.looking_for_job === false
        ? "no"
        : "";

  let profileImageUrl: string | null = null;
  if (profileImagePath) {
    const { data } = await supabase
      .storage
      .from("freelancer-profiles")
      .createSignedUrl(profileImagePath, 60 * 60);
    profileImageUrl = data?.signedUrl ?? null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-indigo-950">Freelancer Profile</h1>
      <Card title="Profile Details" description="Keep your profile and skills up to date. Fields marked * are required. Your progress is saved locally as you type, so a refresh won't lose unsaved changes.">
        {params.error ? (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {params.error}
          </p>
        ) : null}
        {params.message ? (
          <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {params.message}
          </p>
        ) : null}
        <FreelancerProfileForm
          userId={userId}
          profileImageUrl={profileImageUrl}
          skillOptions={SKILL_OPTIONS}
          softwareOptions={SOFTWARE_OPTIONS}
          saved={{
            full_name: profile?.full_name ?? "",
            phone: profile?.phone ?? "",
            professional_title: freelancerProfile?.professional_title ?? "",
            introduction: freelancerProfile?.introduction ?? "",
            country: freelancerProfile?.country ?? "",
            state: freelancerProfile?.state ?? "",
            experience_years:
              freelancerProfile?.plm_experience_years != null
                ? String(freelancerProfile.plm_experience_years)
                : "",
            experience_months:
              freelancerProfile?.plm_experience_months != null
                ? String(freelancerProfile.plm_experience_months)
                : "",
            hourly_rate:
              freelancerProfile?.hourly_rate != null
                ? String(freelancerProfile.hourly_rate)
                : "",
            portfolio_url: freelancerProfile?.portfolio_url ?? "",
            availability: freelancerProfile?.availability ?? "",
            looking_for_full_time_job: lookingForFullTimeJob,
            notice_period: freelancerProfile?.notice_period ?? "",
            skills: currentSkills,
            software: currentSoftware,
          }}
          savedSuccessfully={Boolean(params.message)}
        />
      </Card>
    </div>
  );
}
