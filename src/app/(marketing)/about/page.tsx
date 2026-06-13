import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Offering = {
  title: string;
  description: string;
  icon: ReactNode;
};

type Platform = {
  name: string;
  description: string;
};

function TalentIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3.4" />
      <path d="M2.5 19.5c.6-3.6 3.4-5.6 6.5-5.6s5.9 2 6.5 5.6" />
      <path d="M17 4.5l1.6 1.6L22 2.7" />
    </svg>
  );
}

function VendorsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2 4 5v6c0 5.2 3.4 9.7 8 11 4.6-1.3 8-5.8 8-11V5z" />
      <path d="m8.5 12 2.5 2.5L16 9.5" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="6" width="19" height="14" rx="2" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M2.5 12h19" />
    </svg>
  );
}

function GlobalIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19" />
      <path d="M12 2.5c2.6 3 4 6.2 4 9.5s-1.4 6.5-4 9.5c-2.6-3-4-6.2-4-9.5s1.4-6.5 4-9.5z" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" />
    </svg>
  );
}

function BridgeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 17c2.5-7 17.5-7 20 0" />
      <path d="M5 17v3M10 17v3M14 17v3M19 17v3" />
      <path d="M2 17h20" />
    </svg>
  );
}

const OFFERINGS: Offering[] = [
  {
    title: "Specialized PLM Talent",
    description:
      "Hand-picked experts across implementation, customization, and migration with deep platform fluency.",
    icon: <TalentIcon />,
  },
  {
    title: "Trusted Vendors",
    description:
      "A curated network of service providers vetted for delivery quality and PLM expertise.",
    icon: <VendorsIcon />,
  },
  {
    title: "Flexible Engagements",
    description:
      "Project-based contracts, dedicated specialists, or full delivery teams — sized to your need.",
    icon: <ProjectsIcon />,
  },
  {
    title: "Global Opportunities",
    description:
      "Professionals access remote and on-site work across regions and industries.",
    icon: <GlobalIcon />,
  },
  {
    title: "End-to-End Support",
    description:
      "From scoping to post-go-live, we stay engaged across the full PLM lifecycle.",
    icon: <SupportIcon />,
  },
];

const PLATFORMS: Platform[] = [
  {
    name: "Teamcenter",
    description: "Siemens digital backbone for product data and process orchestration.",
  },
  {
    name: "Windchill",
    description: "PTC's enterprise PLM with deep CAD and quality integrations.",
  },
  {
    name: "ENOVIA",
    description: "Dassault Systèmes' collaborative innovation and configuration platform.",
  },
  {
    name: "Aras Innovator",
    description: "Highly flexible, low-code PLM with rapid customization potential.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#05082a]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-full md:block md:w-[65%] lg:w-[60%]"
        >
          <Image
            src="/plm_hand.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 65vw"
            className="object-cover object-right"
            style={{
              WebkitMaskImage:
                "linear-gradient(to left, rgb(0,0,0) 30%, rgba(0,0,0,0.85) 55%, transparent 95%)",
              maskImage:
                "linear-gradient(to left, rgb(0,0,0) 30%, rgba(0,0,0,0.85) 55%, transparent 95%)",
            }}
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#05082a] via-[#05082a]/85 to-transparent md:via-[#05082a]/60"
        />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-12 h-96 w-96 rounded-full bg-cyan-500/25 blur-3xl animate-float-a" />
          <div className="absolute -right-10 bottom-0 h-112 w-md rounded-full bg-indigo-500/30 blur-3xl animate-float-b" />
          <div
            className="absolute left-1/3 top-1/2 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl animate-float-c"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="absolute left-[10%] top-[20%] h-2.5 w-2.5 rounded-full bg-cyan-300/80 shadow-[0_0_14px_rgba(103,232,249,0.8)] animate-drift" />
          <div
            className="absolute left-[35%] top-[60%] h-2 w-2 rounded-sm bg-sky-300/70 shadow-[0_0_10px_rgba(125,211,252,0.7)] animate-drift"
            style={{ animationDelay: "2.5s" }}
          />
          <div
            className="absolute right-[15%] top-[15%] h-3 w-3 rotate-45 rounded-sm bg-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.6)] animate-drift"
            style={{ animationDelay: "4s" }}
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#05082a] to-transparent"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28 lg:py-32">
          <div className="max-w-xl">
            <p
              className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.3em] text-sky-300 ring-1 ring-white/10 backdrop-blur"
              style={{ animationDelay: "0.05s" }}
            >
              <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.9)]" />
              About Us
            </p>
            <h1
              className="animate-fade-up mt-4 text-gradient-animated bg-linear-to-r from-sky-200 via-white to-cyan-200 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-[0_2px_18px_rgba(56,189,248,0.45)] sm:text-5xl md:text-6xl"
              style={{ animationDelay: "0.15s" }}
            >
              About PLM Freelancer Platform
            </h1>
            <p
              className="animate-fade-up mt-6 text-base leading-relaxed text-sky-100/90 sm:text-lg md:text-xl"
              style={{ animationDelay: "0.3s" }}
            >
              A dedicated global marketplace connecting organizations with
              specialized PLM professionals, consultants, and trusted vendors —
              built for the realities of complex product lifecycle work.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "0.45s" }}
            >
              <Link
                href="/register?role=client"
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-linear-to-r from-cyan-400 via-sky-500 to-indigo-500 px-7 text-xs font-bold uppercase tracking-wider text-white shadow-[0_12px_32px_rgba(56,189,248,0.45)] ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(56,189,248,0.6)] hover:brightness-110"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Hire a PLM Expert</span>
              </Link>
              <Link
                href="/register?role=freelancer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-xs font-bold uppercase tracking-wider text-indigo-950 shadow-[0_10px_28px_rgba(255,255,255,0.25)] ring-1 ring-white transition hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-[0_16px_36px_rgba(255,255,255,0.4)]"
              >
                Join as a Freelancer
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">
            The Why
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-indigo-950 sm:text-3xl md:text-4xl">
            A marketplace built specifically for PLM
          </h2>
          <span
            aria-hidden="true"
            className="mt-4 block h-1 w-16 rounded-full bg-linear-to-r from-cyan-400 to-indigo-500"
          />
          <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-600 sm:text-[17px]">
            <p>
              PLM Freelancer is a dedicated global marketplace connecting
              organizations with specialized PLM professionals, consultants, and
              trusted vendors.
            </p>
            <p>
              Finding the right PLM expertise can be challenging — especially
              for niche requirements such as implementation, customization,
              migration, integration, upgrades, support, and end-to-end project
              delivery. Traditional hiring platforms often lack the specialized
              talent needed for complex PLM initiatives.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 md:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 shadow-sm ring-1 ring-indigo-100">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-cyan-100 to-indigo-100 text-indigo-700">
              <BridgeIcon />
            </span>
            Our Mission
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-indigo-950 sm:text-3xl md:text-4xl">
            Bridging businesses, experts, and providers — on one platform.
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-4 block h-1 w-16 rounded-full bg-linear-to-r from-cyan-400 to-indigo-500"
          />
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-[17px]">
            Our mission is to bridge this gap by bringing together businesses,
            PLM experts, and service providers on a single platform. Whether
            organizations need a single specialist, a project team, or a
            trusted vendor, PLM Freelancer helps connect the right expertise
            with the right opportunity.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-[17px]">
            We support professionals and organizations across leading PLM
            platforms including Teamcenter, Windchill, ENOVIA, Aras Innovator,
            and related technologies.
          </p>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">
              Platforms We Support
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-indigo-950 sm:text-3xl md:text-4xl">
              Expertise across leading PLM ecosystems
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Whatever your stack — we connect you with practitioners who have
              shipped real production work on these platforms.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORMS.map((platform) => (
              <article
                key={platform.name}
                className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-linear-to-br from-white to-sky-50 p-5 transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_18px_40px_-20px_rgba(56,160,255,0.45)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-linear-to-br from-cyan-200/60 to-indigo-200/60 blur-2xl"
                />
                <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-cyan-500 text-xs font-bold text-white shadow-md">
                  {platform.name.charAt(0)}
                </span>
                <h3 className="relative mt-4 text-lg font-bold text-indigo-950">
                  {platform.name}
                </h3>
                <p className="relative mt-1.5 text-sm leading-relaxed text-slate-600">
                  {platform.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">
              What We Offer
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-indigo-950 sm:text-3xl md:text-4xl">
              Everything PLM teams need, in one place
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {OFFERINGS.map((offering, index) => (
              <article
                key={offering.title}
                className={`group relative overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-indigo-100 transition hover:-translate-y-1 hover:ring-sky-300 hover:shadow-[0_24px_48px_-22px_rgba(56,160,255,0.45)] ${
                  index === OFFERINGS.length - 1 && OFFERINGS.length % 3 === 2
                    ? "lg:col-span-1 lg:col-start-2"
                    : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-linear-to-br from-cyan-100 to-indigo-100 blur-2xl opacity-0 transition group-hover:opacity-100"
                />
                <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-sky-100 to-indigo-100 text-indigo-700 ring-1 ring-white">
                  {offering.icon}
                </span>
                <h3 className="relative mt-4 text-base font-bold text-indigo-950 sm:text-lg">
                  {offering.title}
                </h3>
                <p className="relative mt-1.5 text-sm leading-relaxed text-slate-600">
                  {offering.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-linear-to-br from-[#070d3a] via-[#091a5f] to-[#04061f] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl animate-float-a" />
          <div className="absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-indigo-400/25 blur-3xl animate-float-b" />
        </div>
        <div className="relative mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6 md:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300">
            Our Vision
          </p>
          <h2 className="mt-3 text-gradient-animated bg-linear-to-r from-sky-200 via-white to-cyan-200 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent drop-shadow-[0_2px_18px_rgba(56,189,248,0.35)] sm:text-4xl md:text-5xl">
            The world&apos;s leading marketplace for PLM expertise.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-sky-100/85 sm:text-lg">
            To enable organizations to find specialized talent faster while
            helping professionals grow their careers through global
            opportunities.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/register?role=client"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-linear-to-r from-cyan-400 via-sky-500 to-indigo-500 px-7 text-xs font-bold uppercase tracking-wider text-white shadow-[0_12px_32px_rgba(56,189,248,0.45)] ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(56,189,248,0.6)] hover:brightness-110"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Submit a Requirement</span>
            </Link>
            <Link
              href="/register?role=freelancer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-xs font-bold uppercase tracking-wider !text-[#05082a] shadow-[0_10px_28px_rgba(255,255,255,0.25)] ring-1 ring-sky-200/80 transition hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-[0_16px_36px_rgba(255,255,255,0.4)]"
            >
              <span className="text-[#05082a]">Apply as a Freelancer</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
