import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthAlert } from "@/components/ui/auth-alert";
import { PasswordInput } from "@/components/ui/password-input";
import { signInAction } from "@/app/(auth)/actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  return (
    <main className="mx-auto flex flex-1 w-full max-w-md items-center px-4 py-10">
      <Card title="Welcome Back" description="Sign in to your PLM Freelancer account" className="w-full">
        <AuthAlert error={params.error} message={params.message} />
        <form action={signInAction} className="mt-4 space-y-4">
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-indigo-950">Email</span>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-indigo-950">Password</span>
            <PasswordInput name="password" required autoComplete="current-password" />
          </label>
          <Button type="submit" loadingText="Signing in..." className="w-full">
            Sign In
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <Link href="/forgot-password" className="text-indigo-700">
            Forgot password?
          </Link>
          <Link href="/register" className="text-indigo-700">
            Create account
          </Link>
        </div>
      </Card>
    </main>
  );
}
