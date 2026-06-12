"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteLogoLink } from "@/components/layouts/site-header";
import { ServicesMenu } from "@/components/layouts/services-menu";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
};

const primaryLinks: NavLink[] = [{ href: "/", label: "Home" }];

const secondaryLinks: NavLink[] = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

const authLinks: NavLink[] = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

function NavItem({ link, pathname }: { link: NavLink; pathname: string | null }) {
  const isActive =
    link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);

  return (
    <Link
      href={link.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-semibold transition sm:px-4",
        isActive
          ? "bg-sky-300 text-indigo-950 shadow-sm hover:bg-sky-400"
          : "text-indigo-950 hover:bg-indigo-100/70",
      )}
    >
      {link.label}
    </Link>
  );
}

export function MarketingNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <SiteLogoLink height={40} />
        <nav className="flex items-center gap-1 sm:gap-2">
          {primaryLinks.map((link) => (
            <NavItem key={link.href} link={link} pathname={pathname} />
          ))}
          <ServicesMenu />
          {secondaryLinks.map((link) => (
            <NavItem key={link.href} link={link} pathname={pathname} />
          ))}
          {authLinks.map((link) => (
            <NavItem key={link.href} link={link} pathname={pathname} />
          ))}
        </nav>
      </div>
    </header>
  );
}
