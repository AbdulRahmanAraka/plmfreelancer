"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env, hasSupabaseEnv } from "@/lib/env";

export function createSupabaseBrowserClient() {
  if (!hasSupabaseEnv) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL as string,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  );
}
