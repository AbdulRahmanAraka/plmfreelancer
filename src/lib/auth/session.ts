import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type UserRole = "client" | "freelancer" | "admin";

export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "client":
      return "/client";
    case "freelancer":
      return "/freelancer";
    default: {
      const _never: never = role;
      return _never;
    }
  }
}

export async function getSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function getCurrentUserId() {
  const session = await requireAuth();
  return session.user.id;
}

export async function getOptionalUserRole(): Promise<UserRole | null> {
  if (!hasSupabaseEnv) return null;

  const session = await getSession();
  if (!session) return null;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", session.user.id)
    .single();

  if (!data?.role) return null;
  return data.role as UserRole;
}

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const session = await requireAuth();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", session.user.id)
    .single();

  if (!data?.role) return null;
  return data.role as UserRole;
}

export async function requireRole(allowed: UserRole[]) {
  const currentRole = await getCurrentUserRole();
  if (!currentRole || !allowed.includes(currentRole)) {
    redirect("/login");
  }
  return currentRole;
}
