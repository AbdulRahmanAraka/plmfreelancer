import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL } from "@/config/legal";

function HireEmployeesIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  );
}

function HireVendorsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function TrainingIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
      <path d="M22 10v6" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" />
    </svg>
  );
}

const services: Array<{ label: string; href: string; icon: ReactNode }> = [
  { label: "Hire PLM Employees", href: "#", icon: <HireEmployeesIcon /> },
  { label: "Hire PLM Vendors", href: "#", icon: <HireVendorsIcon /> },
  { label: "Training", href: "#", icon: <TrainingIcon /> },
  { label: "On Demand PLM Support", href: "#", icon: <SupportIcon /> },
];

export function MarketingFooter() {
  return (
    <footer className="mt-auto">
      <div className="relative bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
        />
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-2.5 px-4 py-5 sm:gap-3.5 sm:px-6">
          {services.map((service) => (
            <Link
              key={service.label}
              href={service.href}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-950 shadow-[0_2px_8px_rgba(13,70,217,0.06)] ring-1 ring-indigo-100 transition duration-300 hover:-translate-y-0.5 hover:ring-sky-300 hover:shadow-[0_12px_28px_rgba(56,160,255,0.22)]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-sky-100/70 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-sky-100 to-indigo-100 text-indigo-600 ring-1 ring-white/80 transition group-hover:from-sky-200 group-hover:to-indigo-200 group-hover:text-indigo-700">
                {service.icon}
              </span>
              <span className="relative">{service.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="relative bg-linear-to-b from-[#091344] via-[#070d3a] to-[#04061f] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
        />
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2.5 px-4 py-6 text-center text-sm sm:px-6">
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="font-semibold text-sky-300 transition hover:text-cyan-200 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>
          <p className="max-w-3xl text-sky-100/75">
            We act as trusted mediator &mdash; we analyse your requirements and connect you with the
            most suitable PLM expert.
          </p>
          <p className="flex items-center gap-3 text-xs text-sky-200/60">
            <Link href="/privacy" className="transition hover:text-sky-100 hover:underline">
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-white/20">
              |
            </span>
            <Link href="/terms" className="transition hover:text-sky-100 hover:underline">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
