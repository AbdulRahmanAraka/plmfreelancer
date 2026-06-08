"use client";

import { Button } from "@/components/ui/button";
import { MultiSelectChips } from "@/components/ui/multi-select-chips";
import { CountryStateSelect } from "@/components/ui/country-state-select";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { updateFreelancerProfileAction } from "@/app/(app)/actions";
import { useProfileDraft } from "@/components/profiles/use-profile-draft";

type FreelancerProfileFormProps = {
  userId: string;
  profileImageUrl: string | null;
  saved: {
    full_name: string;
    phone: string;
    professional_title: string;
    introduction: string;
    country: string;
    state: string;
    experience_years: string;
    experience_months: string;
    hourly_rate: string;
    portfolio_url: string;
    availability: string;
    looking_for_full_time_job: "yes" | "no" | "";
    notice_period: string;
    skills: string[];
    software: string[];
  };
  skillOptions: string[];
  softwareOptions: string[];
  savedSuccessfully?: boolean;
};

const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-indigo-700";
const inputClass =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500";
const required = <span className="text-rose-500">*</span>;

export function FreelancerProfileForm({
  userId,
  profileImageUrl,
  saved,
  skillOptions,
  softwareOptions,
  savedSuccessfully,
}: FreelancerProfileFormProps) {
  const { values, update, ready } = useProfileDraft(
    "freelancer",
    userId,
    saved,
    savedSuccessfully,
  );

  if (!ready) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className={`h-16 animate-pulse rounded-xl bg-indigo-50/80 ${index === 0 || index === 1 || index === 7 ? "md:col-span-2" : ""}`}
          />
        ))}
      </div>
    );
  }

  return (
    <form action={updateFreelancerProfileAction} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className={labelClass}>Profile Picture</label>
        <div className="flex items-center gap-4">
          <ProfileAvatar
            src={profileImageUrl}
            alt={values.full_name || "Freelancer profile"}
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
          value={values.professional_title}
          onChange={(event) => update({ professional_title: event.target.value })}
          placeholder="e.g. Senior PLM Consultant"
          className={inputClass}
        />
      </div>

      <div className="md:col-span-2">
        <label className={labelClass}>Short introduction</label>
        <textarea
          name="introduction"
          value={values.introduction}
          onChange={(event) => update({ introduction: event.target.value })}
          placeholder="Share your expertise, industries, and what kind of projects you take on."
          className={`${inputClass} min-h-24`}
        />
      </div>

      <div>
        <label className={labelClass}>Full name {required}</label>
        <input
          name="full_name"
          required
          value={values.full_name}
          onChange={(event) => update({ full_name: event.target.value })}
          placeholder="Your full name"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Phone {required}</label>
        <input
          name="phone"
          required
          value={values.phone}
          onChange={(event) => update({ phone: event.target.value })}
          placeholder="+91 98765 43210"
          className={inputClass}
        />
      </div>

      <CountryStateSelect
        defaultCountryName={values.country || null}
        defaultStateName={values.state || null}
        required
        onLocationChange={(country, state) => update({ country, state })}
      />

      <div>
        <label className={labelClass}>Experience (years) {required}</label>
        <input
          name="experience_years"
          type="number"
          min={0}
          max={60}
          required
          value={values.experience_years}
          onChange={(event) => update({ experience_years: event.target.value })}
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
          value={values.experience_months}
          onChange={(event) => update({ experience_months: event.target.value })}
          placeholder="0 - 11"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Hourly rate (USD) {required}</label>
        <input
          name="hourly_rate"
          type="number"
          min={0}
          step="0.01"
          required
          value={values.hourly_rate}
          onChange={(event) => update({ hourly_rate: event.target.value })}
          placeholder="e.g. 75"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Portfolio URL</label>
        <input
          name="portfolio_url"
          type="url"
          value={values.portfolio_url}
          onChange={(event) => update({ portfolio_url: event.target.value })}
          placeholder="https://your-portfolio.com"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Availability {required}</label>
        <select
          name="availability"
          required
          value={values.availability}
          onChange={(event) => update({ availability: event.target.value })}
          className={inputClass}
        >
          <option value="">Select availability</option>
          <option value="Full time">Full time</option>
          <option value="Part time">Part time</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>
          Are you currently looking for a full-time job? {required}
        </label>
        <select
          name="looking_for_full_time_job"
          required
          value={values.looking_for_full_time_job}
          onChange={(event) => {
            const choice = event.target.value as "yes" | "no" | "";
            update({
              looking_for_full_time_job: choice,
              notice_period: choice === "yes" ? values.notice_period : "",
            });
          }}
          className={inputClass}
        >
          <option value="">Select an option</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {values.looking_for_full_time_job === "yes" ? (
        <div>
          <label className={labelClass}>Notice period {required}</label>
          <input
            name="notice_period"
            required
            value={values.notice_period}
            onChange={(event) => update({ notice_period: event.target.value })}
            placeholder="e.g. 15 days, Immediate"
            className={inputClass}
          />
        </div>
      ) : null}

      <div className="md:col-span-2">
        <MultiSelectChips
          title="Core Skills *"
          name="skills"
          options={skillOptions}
          selected={values.skills}
          onSelectedChange={(skills) => update({ skills })}
        />
      </div>
      <div className="md:col-span-2">
        <MultiSelectChips
          title="Software Expertise *"
          name="software"
          options={softwareOptions}
          selected={values.software}
          onSelectedChange={(software) => update({ software })}
        />
      </div>

      <Button type="submit" loadingText="Saving..." className="md:col-span-2">
        Save Profile
      </Button>
    </form>
  );
}
