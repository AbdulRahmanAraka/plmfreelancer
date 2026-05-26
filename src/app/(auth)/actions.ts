"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { normalizePhone } from "@/lib/utils";

function getString(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function findUserIdByEmail(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  email: string,
): Promise<string | null> {
  const target = normalizeEmail(email);
  let page = 1;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error || !data) return null;
    const match = data.users.find(
      (u) => (u.email ?? "").toLowerCase() === target,
    );
    if (match) return match.id;
    if (data.users.length < 200) return null;
    page += 1;
    if (page > 50) return null;
  }
}

/**
 * Find any profile whose stored phone normalizes to the same digit-only
 * sequence as the supplied input. Delegates to the Postgres helper
 * find_profile_id_by_phone so the comparison happens server-side using
 * the same normalization rule as the UNIQUE index.
 */
async function findUserIdByPhone(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  phone: string,
): Promise<string | null> {
  if (!normalizePhone(phone)) return null;
  // Custom RPC; admin client lacks generated Database types, so the args
  // param is inferred as undefined. Safe to assert until types are generated.
  // @ts-expect-error -- TODO: generate Supabase types and drop this directive
  const { data } = await admin.rpc("find_profile_id_by_phone", { p: phone });
  if (!data) return null;
  return typeof data === "string" ? data : null;
}

export async function signInAction(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) {
    redirect("/login?error=Please+enter+email+and+password");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profile?.role === "admin") redirect("/admin");
    if (profile?.role === "freelancer") redirect("/freelancer");
  }

  redirect("/client");
}

export async function signUpAction(formData: FormData) {
  const fullName = getString(formData, "full_name");
  const email = getString(formData, "email");
  const phone = getString(formData, "phone");
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirm_password");
  const role = getString(formData, "role");

  if (!fullName || !email || !phone || !password || !confirmPassword || !role) {
    redirect("/register?error=Please+fill+all+required+fields");
  }

  if (password.length < 8) {
    redirect("/register?error=Password+must+be+at+least+8+characters");
  }

  if (password !== confirmPassword) {
    redirect("/register?error=Password+confirmation+does+not+match");
  }

  const admin = createSupabaseAdminClient();

  if (await findUserIdByEmail(admin, email)) {
    redirect("/register?error=An+account+with+this+email+already+exists");
  }

  if (await findUserIdByPhone(admin, phone)) {
    redirect("/register?error=An+account+with+this+phone+number+already+exists");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: {
        full_name: fullName,
        phone,
        role,
      },
    },
  });

  if (error) {
    const lower = error.message.toLowerCase();
    if (
      lower.includes("already registered") ||
      lower.includes("user already") ||
      lower.includes("duplicate")
    ) {
      redirect("/register?error=An+account+with+this+email+already+exists");
    }
    if (lower.includes("profiles_phone_key") || lower.includes("phone")) {
      redirect("/register?error=An+account+with+this+phone+number+already+exists");
    }
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  if (
    data?.user &&
    Array.isArray(data.user.identities) &&
    data.user.identities.length === 0
  ) {
    redirect("/register?error=An+account+with+this+email+already+exists");
  }

  redirect("/login?message=Account+created.+Please+check+your+email.");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = getString(formData, "email");
  if (!email) {
    redirect("/forgot-password?error=Please+enter+your+email");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/forgot-password?message=Password+reset+email+sent");
}

export async function updatePasswordAction(formData: FormData) {
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirm_password");

  if (!password || password.length < 8) {
    redirect("/reset-password?error=Password+must+be+at+least+8+characters");
  }

  if (password !== confirmPassword) {
    redirect("/reset-password?error=Password+confirmation+does+not+match");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Password+updated+successfully");
}

export async function changePasswordAction(formData: FormData) {
  const currentPassword = getString(formData, "current_password");
  const newPassword = getString(formData, "new_password");
  const confirmPassword = getString(formData, "confirm_password");

  if (!currentPassword || !newPassword || !confirmPassword) {
    redirect("/account?error=All+password+fields+are+required");
  }

  if (newPassword.length < 8) {
    redirect("/account?error=New+password+must+be+at+least+8+characters");
  }

  if (newPassword !== confirmPassword) {
    redirect("/account?error=Password+confirmation+does+not+match");
  }

  if (newPassword === currentPassword) {
    redirect("/account?error=New+password+must+be+different+from+current+password");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login?error=Session+expired.+Please+sign+in+again");
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    redirect("/account?error=Current+password+is+incorrect");
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  if (updateError) {
    redirect(`/account?error=${encodeURIComponent(updateError.message)}`);
  }

  redirect("/account?message=Password+updated+successfully");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
