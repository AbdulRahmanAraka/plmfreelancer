import type { ReactNode } from "react";
import { SiteHeaderBar } from "@/components/layouts/site-header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeaderBar />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
