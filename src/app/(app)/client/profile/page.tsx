import { Card } from "@/components/ui/card";
import { ClientProfileForm } from "@/components/profiles/client-profile-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserId, requireRole } from "@/lib/auth/session";

type ClientProfilePageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
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
      <Card title="Profile Details" description="Manage your account and company information. Fields marked * are required. Your progress is saved locally as you type, so a refresh won't lose unsaved changes.">
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
        <ClientProfileForm
          userId={userId}
          saved={{
            full_name: profile?.full_name ?? "",
            phone: profile?.phone ?? "",
            company_name: clientProfile?.company_name ?? "",
            address: clientProfile?.address ?? "",
          }}
          savedSuccessfully={Boolean(params.message)}
        />
      </Card>
    </div>
  );
}
