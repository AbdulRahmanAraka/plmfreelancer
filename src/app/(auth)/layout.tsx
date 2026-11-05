import type { ReactNode } from "react";
import { AccountMenu } from "@/components/layouts/account-menu";
import { SiteHeaderBar } from "@/components/layouts/site-header";
import { getHeaderAccount } from "@/lib/auth/session";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const account = await getHeaderAccount();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeaderBar>{account ? <AccountMenu account={account} /> : null}</SiteHeaderBar>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
