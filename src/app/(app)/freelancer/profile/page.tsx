import { Card } from "@/components/ui/card";
import { MultiSelectChips } from "@/components/ui/multi-select-chips";
import { updateFreelancerProfileAction } from "@/app/(app)/actions";
import { SKILL_OPTIONS, SOFTWARE_OPTIONS } from "@/config/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserId, requireRole } from "@/lib/auth/session";

type FreelancerProfilePageProps = {
  searchParams: Promise<{ error?: string }>;
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
          "country, state, hourly_rate, plm_experience_years, plm_experience_months, professional_title, introduction, availability, notice_period, portfolio_url, profile_image_path",
        )
        .eq("user_id", userId)
        .single(),
      supabase.from("freelancer_skills").select("skill").eq("freelancer_id", userId),
      supabase.from("freelancer_software").select("software").eq("freelancer_id", userId),
    ]);

  const currentSkills = (skillRows ?? []).map((item) => item.skill);
  const currentSoftware = (softwareRows ?? []).map((item) => item.software);
  const profileImagePath = freelancerProfile?.profile_image_path as string | null | undefined;

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
      <Card title="Profile Details" description="Keep your profile and skills up to date">
        {params.error ? (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {params.error}
          </p>
        ) : null}
        <form action={updateFreelancerProfileAction} className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-medium text-indigo-950">Profile Picture</p>
            {profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImageUrl}
                alt="Freelancer profile"
                className="mb-3 h-24 w-24 rounded-full border border-border object-cover"
              />
            ) : (
              <p className="mb-3 text-xs text-muted-foreground">No profile picture uploaded yet.</p>
            )}
            <input
              name="profile_image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="rounded-xl border border-border px-3 py-2 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-3 file:py-1 file:text-indigo-700"
            />
          </div>

          <input
            name="professional_title"
            defaultValue={freelancerProfile?.professional_title ?? ""}
            placeholder="Professional title (e.g. PLM Consultant)"
            className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500 md:col-span-2"
          />
          <textarea
            name="introduction"
            defaultValue={freelancerProfile?.introduction ?? ""}
            placeholder="Short introduction about your expertise"
            className="min-h-24 rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500 md:col-span-2"
          />

          <input
            name="full_name"
            required
            defaultValue={profile?.full_name ?? ""}
            placeholder="Full name"
            className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            name="phone"
            defaultValue={profile?.phone ?? ""}
            placeholder="Phone"
            className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            name="country"
            defaultValue={freelancerProfile?.country ?? ""}
            placeholder="Country"
            className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            name="state"
            defaultValue={freelancerProfile?.state ?? ""}
            placeholder="State"
            className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            name="experience_years"
            type="number"
            min={0}
            defaultValue={freelancerProfile?.plm_experience_years ?? ""}
            placeholder="Experience years"
            className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            name="experience_months"
            type="number"
            min={0}
            max={11}
            defaultValue={freelancerProfile?.plm_experience_months ?? ""}
            placeholder="Experience months"
            className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            name="hourly_rate"
            type="number"
            min={0}
            step="0.01"
            defaultValue={freelancerProfile?.hourly_rate ?? ""}
            placeholder="Hourly rate"
            className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            name="portfolio_url"
            defaultValue={freelancerProfile?.portfolio_url ?? ""}
            placeholder="Portfolio URL"
            className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            name="availability"
            defaultValue={freelancerProfile?.availability ?? ""}
            placeholder="Availability"
            className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            name="notice_period"
            defaultValue={freelancerProfile?.notice_period ?? ""}
            placeholder="Notice period"
            className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />

          <div className="md:col-span-2">
            <MultiSelectChips
              title="Core Skills"
              name="skills"
              options={SKILL_OPTIONS}
              initialSelected={currentSkills}
            />
          </div>
          <div className="md:col-span-2">
            <MultiSelectChips
              title="Software Expertise"
              name="software"
              options={SOFTWARE_OPTIONS}
              initialSelected={currentSoftware}
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground md:col-span-2"
          >
            Save Profile
          </button>
        </form>
      </Card>
    </div>
  );
}
