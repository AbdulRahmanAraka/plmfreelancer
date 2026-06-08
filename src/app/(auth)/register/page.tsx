import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthAlert } from "@/components/ui/auth-alert";
import { PasswordInput } from "@/components/ui/password-input";
import { signUpAction } from "@/app/(auth)/actions";

type RegisterPageProps = {
  searchParams: Promise<{ error?: string; message?: string; role?: string }>;
};

function defaultRoleFromParam(role: string | undefined): "" | "client" | "freelancer" {
  if (role === "client" || role === "freelancer") return role;
  return "";
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const defaultRole = defaultRoleFromParam(params.role);
  return (
    <main className="mx-auto flex flex-1 w-full max-w-md items-center px-4 py-10">
      <Card title="Create Account" description="Join as a client or freelancer" className="w-full">
        <AuthAlert error={params.error} message={params.message} />
        <form action={signUpAction} className="mt-4 space-y-3">
          <input
            name="full_name"
            required
            placeholder="Full name"
            className="w-full rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="w-full rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            name="phone"
            required
            placeholder="Phone"
            className="w-full rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          />
          <PasswordInput
            name="password"
            required
            minLength={8}
            placeholder="Password (min 8 chars)"
            autoComplete="new-password"
          />
          <PasswordInput
            name="confirm_password"
            required
            minLength={8}
            placeholder="Confirm password"
            autoComplete="new-password"
          />
          <select
            name="role"
            required
            defaultValue={defaultRole}
            className="w-full rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
          >
            <option value="">Choose role</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
          <Button type="submit" loadingText="Creating account..." className="w-full">
            Create Account
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-700">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
