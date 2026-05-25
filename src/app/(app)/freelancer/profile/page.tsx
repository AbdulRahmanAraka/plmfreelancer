import { Card } from "@/components/ui/card";
import { MultiSelectChips } from "@/components/ui/multi-select-chips";
import { CountryStateSelect } from "@/components/ui/country-state-select";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { updateFreelancerProfileAction } from "@/app/(app)/actions";
import { SKILL_OPTIONS, SOFTWARE_OPTIONS } from "@/config/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserId, requireRole } from "@/lib/auth/session";

type FreelancerProfilePageProps = {
  searchParams: Promise<{ error?: string }>;
};

const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-indigo-700";
const inputClass =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500";
const required = <span className="text-rose-500">*</span>;

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

  const currentAvailability = freelancerProfile?.availability ?? "";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-indigo-950">Freelancer Profile</h1>
      <Card title="Profile Details" description="Keep your profile and skills up to date. Fields marked * are required.">
        {params.error ? (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {params.error}
          </p>
        ) : null}
        <form action={updateFreelancerProfileAction} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Profile Picture</label>
            <div className="flex items-center gap-4">
              <ProfileAvatar
                src={profileImageUrl}
                alt={profile?.full_name || "Freelancer profile"}
                size={80}
                fallbackFontSize={22}
              />
              <input
                name="profile_image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="flex-1 rounded-xl border border-border px-3 py-2 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-3 file:py-1 file:text-indigo-700"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Professional title {required}</label>
            <input
              name="professional_title"
              required
              defaultValue={freelancerProfile?.professional_title ?? ""}
              placeholder="e.g. Senior PLM Consultant"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Short introduction</label>
            <textarea
              name="introduction"
              defaultValue={freelancerProfile?.introduction ?? ""}
              placeholder="Share your expertise, industries, and what kind of projects you take on."
              className={`${inputClass} min-h-24`}
            />
          </div>

          <div>
            <label className={labelClass}>Full name {required}</label>
            <input
              name="full_name"
              required
              defaultValue={profile?.full_name ?? ""}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Phone {required}</label>
            <input
              name="phone"
              required
              defaultValue={profile?.phone ?? ""}
              placeholder="+91 98765 43210"
              className={inputClass}
            />
          </div>

          <CountryStateSelect
            key={`loc|${freelancerProfile?.country ?? ""}|${freelancerProfile?.state ?? ""}`}
            defaultCountryName={freelancerProfile?.country ?? null}
            defaultStateName={freelancerProfile?.state ?? null}
            required
          />

          <div>
            <label className={labelClass}>Experience (years) {required}</label>
            <input
              name="experience_years"
              type="number"
              min={0}
              max={60}
              required
              defaultValue={freelancerProfile?.plm_experience_years ?? ""}
              placeholder="0 - 60"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Experience (months)</label>
            <input
              name="experience_months"
              type="number"
              min={0}
              max={11}
              defaultValue={freelancerProfile?.plm_experience_months ?? ""}
              placeholder="0 - 11"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Hourly rate (INR) {required}</label>
            <input
              name="hourly_rate"
              type="number"
              min={0}
              step="0.01"
              required
              defaultValue={freelancerProfile?.hourly_rate ?? ""}
              placeholder="e.g. 1500"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Portfolio URL</label>
            <input
              name="portfolio_url"
              type="url"
              defaultValue={freelancerProfile?.portfolio_url ?? ""}
              placeholder="https://your-portfolio.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Availability {required}</label>
            <select
              key={`availability-${currentAvailability || "none"}`}
              name="availability"
              required
              defaultValue={
                currentAvailability === "Full time" || currentAvailability === "Part time"
                  ? currentAvailability
                  : ""
              }
              className={inputClass}
            >
              <option value="">Select availability</option>
              <option value="Full time">Full time</option>
              <option value="Part time">Part time</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Notice period</label>
            <input
              name="notice_period"
              defaultValue={freelancerProfile?.notice_period ?? ""}
              placeholder="e.g. 15 days, Immediate"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <MultiSelectChips
              title="Core Skills *"
              name="skills"
              options={SKILL_OPTIONS}
              initialSelected={currentSkills}
            />
          </div>
          <div className="md:col-span-2">
            <MultiSelectChips
              title="Software Expertise *"
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
