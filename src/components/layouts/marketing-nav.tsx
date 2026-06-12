"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { SiteLogoLink } from "@/components/layouts/site-header";
import {
  ServicesMenu,
  SERVICE_GROUPS,
} from "@/components/layouts/services-menu";
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

function NavItem({
  link,
  pathname,
}: {
  link: NavLink;
  pathname: string | null;
}) {
  const isActive =
    link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);

  return (
    <Link
      href={link.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-semibold transition lg:px-4",
        isActive
          ? "bg-sky-300 text-indigo-950 shadow-sm hover:bg-sky-400"
          : "text-indigo-950 hover:bg-indigo-100/70",
      )}
    >
      {link.label}
    </Link>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="m6 6 12 12" />
          <path d="M18 6 6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

function MobileLink({
  link,
  pathname,
  onNavigate,
}: {
  link: NavLink;
  pathname: string | null;
  onNavigate: () => void;
}) {
  const isActive =
    link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "block px-4 py-3 text-sm font-semibold transition",
        isActive
          ? "bg-sky-50 text-indigo-700"
          : "text-indigo-950 hover:bg-indigo-50/70",
      )}
    >
      {link.label}
    </Link>
  );
}

function MobileServicesAccordion({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-y border-indigo-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-indigo-50/60"
      >
        <span>Services</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn(
            "transition-transform duration-200",
            open ? "rotate-180" : "rotate-0",
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div className="space-y-3 bg-slate-50/50 px-4 py-3">
          {SERVICE_GROUPS.map((group) => (
            <div key={group.heading}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">
                {group.heading}
              </p>
              <ul className="mt-1.5 flex flex-col">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium text-indigo-950 transition hover:bg-sky-100/70"
                    >
                      <span
                        aria-hidden="true"
                        className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-300"
                      />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function MarketingNav() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const drawerId = useId();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMobileOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isMobileOpen]);

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <SiteLogoLink height={40} />

        <nav className="hidden items-center gap-1 lg:flex lg:gap-2">
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

        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-expanded={isMobileOpen}
          aria-controls={drawerId}
          aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-indigo-950 transition hover:bg-indigo-100/70 lg:hidden"
        >
          <HamburgerIcon open={isMobileOpen} />
        </button>
      </div>

      <div
        id={drawerId}
        className={cn(
          "overflow-hidden border-t border-border/70 bg-white transition-[max-height,opacity] duration-300 ease-out lg:hidden",
          isMobileOpen
            ? "max-h-[640px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col py-1">
          {primaryLinks.map((link) => (
            <MobileLink
              key={link.href}
              link={link}
              pathname={pathname}
              onNavigate={closeMobile}
            />
          ))}
          <MobileServicesAccordion onNavigate={closeMobile} />
          {secondaryLinks.map((link) => (
            <MobileLink
              key={link.href}
              link={link}
              pathname={pathname}
              onNavigate={closeMobile}
            />
          ))}
          <div className="mt-1 border-t border-indigo-50 pt-1">
            {authLinks.map((link) => (
              <MobileLink
                key={link.href}
                link={link}
                pathname={pathname}
                onNavigate={closeMobile}
              />
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
