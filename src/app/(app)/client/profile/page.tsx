import { Card } from "@/components/ui/card";
import { updateClientProfileAction } from "@/app/(app)/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserId, requireRole } from "@/lib/auth/session";

type ClientProfilePageProps = {
  searchParams: Promise<{ error?: string }>;
};

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
      <Card title="Profile Details" description="Manage your account and company information">
        {params.error ? (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {params.error}
          </p>
        ) : null}
        <form action={updateClientProfileAction} className="grid gap-3 md:grid-cols-2">
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
            name="company_name"
            defaultValue={clientProfile?.company_name ?? ""}
            placeholder="Company name"
            className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500 md:col-span-2"
          />
          <textarea
            name="address"
            defaultValue={clientProfile?.address ?? ""}
            placeholder="Address"
            className="min-h-24 rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500 md:col-span-2"
          />
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
