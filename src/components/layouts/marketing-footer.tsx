import Link from "next/link";
import { LEGAL } from "@/config/legal";

export function MarketingFooter() {
  return (
    <footer className="mt-auto">
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
