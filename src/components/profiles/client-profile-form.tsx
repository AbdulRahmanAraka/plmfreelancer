"use client";

import { Button } from "@/components/ui/button";
import { updateClientProfileAction } from "@/app/(app)/actions";
import { useProfileDraft } from "@/components/profiles/use-profile-draft";

type ClientProfileFormProps = {
  userId: string;
  saved: {
    full_name: string;
    phone: string;
    company_name: string;
    address: string;
  };
  savedSuccessfully?: boolean;
};

const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-indigo-700";
const inputClass =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500";
const required = <span className="text-rose-500">*</span>;

export function ClientProfileForm({ userId, saved, savedSuccessfully }: ClientProfileFormProps) {
  const { values, update, ready } = useProfileDraft(
    "client",
    userId,
    saved,
    savedSuccessfully,
  );

  if (!ready) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`h-16 animate-pulse rounded-xl bg-indigo-50/80 ${index >= 2 ? "md:col-span-2" : ""}`}
          />
        ))}
      </div>
    );
  }

  return (
    <form action={updateClientProfileAction} className="grid gap-3 md:grid-cols-2">
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
      <div className="md:col-span-2">
        <label className={labelClass}>Company name {required}</label>
        <input
          name="company_name"
          required
          value={values.company_name}
          onChange={(event) => update({ company_name: event.target.value })}
          placeholder="Your company name"
          className={inputClass}
        />
      </div>
      <div className="md:col-span-2">
        <label className={labelClass}>Address {required}</label>
        <textarea
          name="address"
          required
          value={values.address}
          onChange={(event) => update({ address: event.target.value })}
          placeholder="Office or billing address"
          className={`${inputClass} min-h-24`}
        />
      </div>
      <Button type="submit" loadingText="Saving..." className="md:col-span-2">
        Save Profile
      </Button>
    </form>
  );
}
