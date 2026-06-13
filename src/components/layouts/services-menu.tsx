"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type ServiceLink = {
  label: string;
  href: string;
};

export type ServiceGroup = {
  heading: string;
  items: ServiceLink[];
};

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    heading: "For Clients",
    items: [
      { label: "Hire PLM Resources", href: "/hire-resources" },
      { label: "Find PLM Vendors", href: "/find-vendors" },
      { label: "On Demand PLM Support", href: "/support" },
      { label: "Submit Requirement", href: "/register?role=client" },
    ],
  },
  {
    heading: "For Learning",
    items: [{ label: "PLM Training", href: "/training" }],
  },
  {
    heading: "For Professionals",
    items: [{ label: "Join as Freelancer", href: "/register?role=freelancer" }],
  },
];

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ServicesMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition sm:px-4",
          isOpen
            ? "bg-indigo-100/80 text-indigo-950"
            : "text-indigo-950 hover:bg-indigo-100/70",
        )}
      >
        Services
        <ChevronDownIcon
          className={cn(
            "transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Services"
          className="absolute right-0 top-full z-40 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-border bg-white shadow-[0_18px_40px_-12px_rgba(13,70,217,0.18)] ring-1 ring-indigo-100/70"
        >
          <div className="divide-y divide-indigo-50">
            {SERVICE_GROUPS.map((group) => (
              <div key={group.heading} className="px-2 py-2.5">
                <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-widest text-indigo-500">
                  {group.heading}
                </p>
                <ul className="flex flex-col">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        role="menuitem"
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group/item flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium text-indigo-950 transition hover:bg-sky-100/70 hover:text-indigo-900 focus-visible:bg-sky-100/70 focus-visible:outline-hidden"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300 transition group-hover/item:bg-sky-500 group-hover/item:scale-125 group-focus-visible/item:bg-sky-500"
                        />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
