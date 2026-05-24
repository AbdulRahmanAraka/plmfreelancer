"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

function getString(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
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

  if (!fullName || !email || !password || !confirmPassword || !role) {
    redirect("/register?error=Please+fill+all+required+fields");
  }

  if (password.length < 8) {
    redirect("/register?error=Password+must+be+at+least+8+characters");
  }

  if (password !== confirmPassword) {
    redirect("/register?error=Password+confirmation+does+not+match");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
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
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
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
