import Link from "next/link";
import { LEGAL } from "@/config/legal";

const services = [
  "Hire PLM Employees",
  "Hire PLM Vendors",
  "Training",
  "On Demand PLM Support",
];

export function MarketingFooter() {
  return (
    <footer className="mt-auto">
      <div className="border-y border-indigo-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 py-4 text-sm font-semibold text-indigo-950 sm:px-6">
          {services.map((service) => (
            <span key={service} className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="text-indigo-700">
                &bull;
              </span>
              {service}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-linear-to-b from-sky-200 via-sky-300 to-sky-400 text-indigo-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-5 text-center text-sm sm:px-6">
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="font-medium text-indigo-900 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>
          <p className="max-w-3xl text-indigo-950/85">
            We act as trusted mediator &mdash; we analyse your requirements and connect you with the
            most suitable PLM expert.
          </p>
          <p className="flex items-center gap-3 text-xs text-indigo-900">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-indigo-700/70">
              |
            </span>
            <Link href="/terms" className="hover:underline">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
