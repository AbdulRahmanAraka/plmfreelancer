import type { ReactNode } from "react";
import { MarketingNav } from "@/components/layouts/marketing-nav";
import { MarketingFooter } from "@/components/layouts/marketing-footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNav />
      {children}
      <MarketingFooter />
    </>
  );
}
