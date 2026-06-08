import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FreelancerProfileStatus = {
  isComplete: boolean;
  missing: string[];
};

const ALLOWED_AVAILABILITY = new Set(["Full time", "Part time"]);

/**
 * Inspect the freelancer's stored profile and report which mandatory fields
 * are still missing. A freelancer must satisfy every check before they can
 * apply to projects.
 */
export async function getFreelancerProfileStatus(
  userId: string,
): Promise<FreelancerProfileStatus> {
  const supabase = await createSupabaseServerClient();

  const [
    { data: profile },
    { data: freelancerProfile },
    { count: skillCount },
    { count: softwareCount },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("freelancer_profiles")
      .select(
        "country, professional_title, plm_experience_years, hourly_rate, availability, looking_for_job, notice_period",
      )
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("freelancer_skills")
      .select("skill", { count: "exact", head: true })
      .eq("freelancer_id", userId),
    supabase
      .from("freelancer_software")
      .select("software", { count: "exact", head: true })
      .eq("freelancer_id", userId),
  ]);

  const p = profile as { full_name: string | null; phone: string | null } | null;
  const fp = freelancerProfile as
    | {
        country: string | null;
        professional_title: string | null;
        plm_experience_years: number | null;
        hourly_rate: number | string | null;
        availability: string | null;
        looking_for_job: boolean | null;
        notice_period: string | null;
      }
    | null;

  const missing: string[] = [];

  if (!p?.full_name?.trim()) missing.push("Full name");
  if (!p?.phone?.trim()) missing.push("Phone number");
  if (!fp?.country?.trim()) missing.push("Country");
  if (!fp?.professional_title?.trim()) missing.push("Professional title");
  if (fp?.plm_experience_years == null) missing.push("Experience (years)");
  if (
    fp?.hourly_rate === null ||
    fp?.hourly_rate === undefined ||
    fp?.hourly_rate === ""
  ) {
    missing.push("Hourly rate");
  }
  if (!fp?.availability || !ALLOWED_AVAILABILITY.has(fp.availability)) {
    missing.push("Availability");
  }

  const fullTimeJobPreferenceAnswered =
    fp?.looking_for_job === false || Boolean(fp?.notice_period?.trim());
  if (!fullTimeJobPreferenceAnswered) {
    missing.push("Full-time job preference");
  } else if (fp?.looking_for_job === true && !fp?.notice_period?.trim()) {
    missing.push("Notice period");
  }

  if ((skillCount ?? 0) < 1) missing.push("At least one skill");
  if ((softwareCount ?? 0) < 1) missing.push("At least one software");

  return { isComplete: missing.length === 0, missing };
}
