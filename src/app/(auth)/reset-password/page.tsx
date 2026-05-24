import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthAlert } from "@/components/ui/auth-alert";
import { updatePasswordAction } from "@/app/(auth)/actions";

type ResetPasswordPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <Card title="Choose New Password" description="Set a secure password for your account" className="w-full">
        <AuthAlert error={params.error} message={params.message} />
        <form action={updatePasswordAction} className="mt-4 space-y-4">
          <input
            type="password"
            name="password"
            required
            minLength={8}
            placeholder="New password"
            className="w-full rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            name="confirm_password"
            required
            minLength={8}
            placeholder="Confirm password"
            className="w-full rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <Button type="submit" className="w-full">
            Update Password
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Back to{" "}
          <Link href="/login" className="text-indigo-700">
            Login
          </Link>
        </p>
      </Card>
    </main>
  );
}
