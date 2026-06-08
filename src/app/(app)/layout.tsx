import type { ReactNode } from "react";
import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";
import { SiteHeaderBar } from "@/components/layouts/site-header";
import { hasSupabaseEnv } from "@/lib/env";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProtectedAppLayout({ children }: { children: ReactNode }) {
  if (!hasSupabaseEnv) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeaderBar />
        <main className="mx-auto flex flex-1 w-full max-w-2xl items-center px-4 py-10">
          <Card title="Configure Supabase" description="Protected area is disabled until env is set." className="w-full">
            <p className="text-sm text-muted-foreground">
              Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  const session = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", session.user.id)
    .single();

  const role = (profile?.role ?? "freelancer") as "client" | "freelancer" | "admin";

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, message, is_read, created_at")
    .eq("recipient_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(12);

  return <AppShell role={role} notifications={notifications ?? []}>{children}</AppShell>;
}
