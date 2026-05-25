import { Card } from "@/components/ui/card";
import { updateClientProfileAction } from "@/app/(app)/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserId, requireRole } from "@/lib/auth/session";

type ClientProfilePageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-indigo-700";
const inputClass =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500";
const required = <span className="text-rose-500">*</span>;

export default async function ClientProfilePage({ searchParams }: ClientProfilePageProps) {
  await requireRole(["client", "admin"]);
  const userId = await getCurrentUserId();
  const supabase = await createSupabaseServerClient();
  const params = await searchParams;

  const [{ data: profile }, { data: clientProfile }] = await Promise.all([
    supabase.from("profiles").select("full_name, phone").eq("user_id", userId).single(),
    supabase
      .from("client_profiles")
      .select("company_name, address")
      .eq("user_id", userId)
      .single(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-indigo-950">Client Profile</h1>
      <Card title="Profile Details" description="Manage your account and company information. Fields marked * are required.">
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
        <form action={updateClientProfileAction} className="grid gap-3 md:grid-cols-2">
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
          <div className="md:col-span-2">
            <label className={labelClass}>Company name {required}</label>
            <input
              name="company_name"
              required
              defaultValue={clientProfile?.company_name ?? ""}
              placeholder="Your company name"
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Address {required}</label>
            <textarea
              name="address"
              required
              defaultValue={clientProfile?.address ?? ""}
              placeholder="Office or billing address"
              className={`${inputClass} min-h-24`}
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
