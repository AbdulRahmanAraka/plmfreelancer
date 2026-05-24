import { Card } from "@/components/ui/card";
import { AuthAlert } from "@/components/ui/auth-alert";
import { changePasswordAction } from "@/app/(auth)/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserRole, requireAuth } from "@/lib/auth/session";

type AccountPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

const ROLE_LABEL: Record<string, string> = {
  client: "Client",
  freelancer: "Freelancer",
  admin: "Admin",
};

export default async function AccountSettingsPage({ searchParams }: AccountPageProps) {
  const session = await requireAuth();
  const role = await getCurrentUserRole();
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("user_id", session.user.id)
    .single();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-indigo-950">Account Settings</h1>

      <Card title="Account" description="Your sign-in details">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium text-slate-800">{profile?.full_name || "Not set"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium text-slate-800">{session.user.email}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Role</dt>
            <dd className="font-medium text-slate-800">
              {role ? ROLE_LABEL[role] ?? role : "Unknown"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card title="Change Password" description="Use a strong password you don't use elsewhere">
        <AuthAlert error={params.error} message={params.message} />
        <form action={changePasswordAction} className="mt-3 space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="current_password">
              Current password
            </label>
            <input
              id="current_password"
              type="password"
              name="current_password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="new_password">
              New password (min 8 characters)
            </label>
            <input
              id="new_password"
              type="password"
              name="new_password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="confirm_password">
              Confirm new password
            </label>
            <input
              id="confirm_password"
              type="password"
              name="confirm_password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Update Password
          </button>
        </form>
      </Card>

      <Card title="Forgot your current password?">
        <p className="text-sm text-muted-foreground">
          If you don&apos;t remember your current password, sign out and use the{" "}
          <a className="font-medium text-indigo-700 underline" href="/forgot-password">
            forgot password
          </a>{" "}
          flow to receive a reset link by email.
        </p>
      </Card>
    </div>
  );
}
