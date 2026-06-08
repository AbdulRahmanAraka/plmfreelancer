import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthAlert } from "@/components/ui/auth-alert";
import { forgotPasswordAction } from "@/app/(auth)/actions";

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;
  return (
    <main className="mx-auto flex flex-1 w-full max-w-md items-center px-4 py-10">
      <Card title="Reset Password" description="Enter your email to receive reset instructions" className="w-full">
        <AuthAlert error={params.error} message={params.message} />
        <form action={forgotPasswordAction} className="mt-4 space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            className="w-full rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <Button type="submit" loadingText="Sending link..." className="w-full">
            Send Reset Link
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
