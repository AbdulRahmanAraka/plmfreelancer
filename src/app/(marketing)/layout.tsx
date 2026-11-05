import type { ReactNode } from "react";
import { MarketingNav } from "@/components/layouts/marketing-nav";
import { MarketingFooter } from "@/components/layouts/marketing-footer";
import { getHeaderAccount } from "@/lib/auth/session";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const account = await getHeaderAccount();

  return (
    <>
      <MarketingNav account={account} />
      {children}
      <MarketingFooter />
    </>
  );
}
