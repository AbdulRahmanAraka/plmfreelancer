import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/ui/brand-mark";
import { cn } from "@/lib/utils";

type SiteLogoLinkProps = {
  height?: number;
  className?: string;
};

export function SiteLogoLink({ height = 36, className }: SiteLogoLinkProps) {
  return (
    <Link
      href="/"
      aria-label="PLM Freelancer home"
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      <BrandMark height={height} />
    </Link>
  );
}

type SiteHeaderBarProps = {
  children?: ReactNode;
  className?: string;
  logoHeight?: number;
};

export function SiteHeaderBar({ children, className, logoHeight = 36 }: SiteHeaderBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 shrink-0 border-b border-border/70 bg-white/95 backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <SiteLogoLink height={logoHeight} />
        {children ? <div className="flex items-center gap-2">{children}</div> : null}
      </div>
    </header>
  );
}
