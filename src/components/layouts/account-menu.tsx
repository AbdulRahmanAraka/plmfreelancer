"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { SignOutButton } from "@/components/layouts/sign-out-button";
import type { HeaderAccount, UserRole } from "@/lib/auth/session";

const ROLE_LABEL: Record<UserRole, string> = {
  client: "Client",
  freelancer: "Freelancer",
  admin: "Admin",
};

function PersonIcon() {
  return (
    <svg width="22" height="22" viewBox="4.6 4 14.8 17.2" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.2 19.4c.55-3.35 3.15-5.15 6.8-5.15s6.25 1.8 6.8 5.15c.12.72-.42 1.35-1.16 1.35H6.36c-.74 0-1.28-.63-1.16-1.35Z" />
    </svg>
  );
}

export function AccountMenu({ account }: { account: HeaderAccount }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointer(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-signout-dialog]")) return;
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Account menu for ${account.name}`}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-primary/10 text-primary transition hover:bg-primary/15"
      >
        <PersonIcon />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg"
        >
          <div className="border-b border-border px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-foreground">{account.name}</p>
            <p className="truncate text-xs text-muted-foreground">{account.email}</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {ROLE_LABEL[account.role]}
            </p>
          </div>
          <Link
            href={account.dashboardHref}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-foreground transition hover:bg-primary/5"
          >
            Dashboard
          </Link>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-foreground transition hover:bg-primary/5"
          >
            Account settings
          </Link>
          <div className="mt-1 border-t border-border pt-1">
            <SignOutButton appearance="menu" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
