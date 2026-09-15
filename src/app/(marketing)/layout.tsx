import type { ReactNode } from "react";
import { MarketingNav } from "@/components/layouts/marketing-nav";
import { MarketingFooter } from "@/components/layouts/marketing-footer";
import { dashboardPathForRole, getOptionalUserRole } from "@/lib/auth/session";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const role = await getOptionalUserRole();
  const dashboardHref = role ? dashboardPathForRole(role) : null;

  return (
    <>
      <MarketingNav dashboardHref={dashboardHref} />
      {children}
      <MarketingFooter />
    </>
  );
}
