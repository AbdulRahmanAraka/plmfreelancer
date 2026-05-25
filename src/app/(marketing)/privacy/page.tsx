import type { ReactNode } from "react";
import { LEGAL } from "@/config/legal";

export const metadata = {
  title: "Privacy Policy | PLM Freelancer Platform",
  description: "How we collect, use, and protect your data.",
};

type Section = {
  number: number;
  title: string;
  icon: ReactNode;
  accent: string;
  body: ReactNode;
};

export default function PrivacyPage() {
  const sections: Section[] = [
    {
      number: 1,
      title: "Information We Collect",
      accent: "from-indigo-500 to-blue-500",
      icon: <ClipboardIcon />,
      body: (
        <>
          <p>We may collect:</p>
          <BulletList
            items={[
              "Name, email, phone number",
              "Resume, portfolio, skills",
              "Project requirements",
              "Payment-related information",
              "IP address and usage data",
            ]}
          />
        </>
      ),
    },
    {
      number: 2,
      title: "How We Use Information",
      accent: "from-sky-500 to-cyan-500",
      icon: <GearIcon />,
      body: (
        <>
          <p>Your data is used to:</p>
          <BulletList
            items={[
              "Match clients with freelancers",
              "Manage projects and payments",
              "Communicate updates and opportunities",
              "Improve platform functionality",
              "Meet legal and compliance requirements",
            ]}
          />
        </>
      ),
    },
    {
      number: 3,
      title: "Data Sharing",
      accent: "from-cyan-500 to-teal-500",
      icon: <ShareIcon />,
      body: (
        <>
          <p className="font-medium text-indigo-950">
            We do not sell or rent personal data.
          </p>
          <p className="mt-2">We may share information with:</p>
          <BulletList
            items={[
              "Clients (only relevant project details)",
              "Freelancers (only relevant project details)",
              "Payment processors",
              "Legal authorities if required by law",
            ]}
          />
        </>
      ),
    },
    {
      number: 4,
      title: "Data Security",
      accent: "from-emerald-500 to-green-500",
      icon: <ShieldIcon />,
      body: (
        <p>
          We implement reasonable technical and organizational measures to
          protect user data.
        </p>
      ),
    },
    {
      number: 5,
      title: "Cookies",
      accent: "from-amber-500 to-orange-500",
      icon: <CookieIcon />,
      body: (
        <>
          <p>We may use cookies to:</p>
          <BulletList
            items={[
              "Improve user experience",
              "Analyze website traffic",
              "Maintain session security",
            ]}
          />
          <p className="mt-3 text-xs italic text-muted-foreground">
            You may disable cookies via browser settings.
          </p>
        </>
      ),
    },
    {
      number: 6,
      title: "Data Retention",
      accent: "from-orange-500 to-rose-500",
      icon: <ArchiveIcon />,
      body: (
        <>
          <p>We retain data only as long as necessary for:</p>
          <BulletList
            items={[
              "Business operations",
              "Legal compliance",
              "Dispute resolution",
            ]}
          />
        </>
      ),
    },
    {
      number: 7,
      title: "User Rights",
      accent: "from-rose-500 to-pink-500",
      icon: <UserCheckIcon />,
      body: (
        <>
          <p>You may:</p>
          <BulletList
            items={[
              "Request access to your data",
              "Request correction or deletion",
              "Opt out of communications",
            ]}
          />
          <p className="mt-3">
            Requests can be sent to{" "}
            <a
              href={`mailto:${LEGAL.contactEmail}`}
              className="font-semibold text-indigo-700 hover:underline"
            >
              {LEGAL.contactEmail}
            </a>
          </p>
        </>
      ),
    },
    {
      number: 8,
      title: "Third-Party Links",
      accent: "from-pink-500 to-fuchsia-500",
      icon: <LinkIcon />,
      body: (
        <p>
          Our website may contain links to third-party sites. We are not
          responsible for their privacy practices.
        </p>
      ),
    },
    {
      number: 9,
      title: "Updates to Privacy Policy",
      accent: "from-fuchsia-500 to-purple-500",
      icon: <RefreshIcon />,
      body: (
        <p>
          We may update this policy periodically. Changes will be posted on this
          page.
        </p>
      ),
    },
    {
      number: 10,
      title: "Contact",
      accent: "from-purple-500 to-indigo-600",
      icon: <MailIcon />,
      body: (
        <p>
          Have a question or a privacy request? Reach us at{" "}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="font-semibold text-indigo-700 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>
          .
        </p>
      ),
    },
  ];

  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-indigo-50 via-white to-transparent"
      />

      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-600 via-indigo-700 to-blue-700 px-6 py-9 text-white shadow-xl shadow-indigo-200/40 sm:px-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl"
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
              <LockIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
                Legal • Effective {LEGAL.effectiveDate}
              </p>
              <h1 className="mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
                Privacy Policy
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-50/95">
                {LEGAL.companyName} (plmfreelancer.com) values your privacy. This
                Privacy Policy explains how we collect, use, and protect your
                information.
              </p>
            </div>
          </div>
        </section>

        <nav className="mt-8 grid gap-2 rounded-2xl border border-border bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
          <p className="sm:col-span-2 lg:col-span-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700/80">
            Quick Navigation
          </p>
          {sections.map((section) => (
            <a
              key={section.number}
              href={`#section-${section.number}`}
              className="group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-950 transition hover:bg-indigo-50"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-[11px] font-bold text-indigo-700 transition group-hover:bg-indigo-200">
                {section.number}
              </span>
              <span className="truncate">{section.title}</span>
            </a>
          ))}
        </nav>

        <div className="mt-8 space-y-5">
          {sections.map((section) => (
            <article
              key={section.number}
              id={`section-${section.number}`}
              className="group relative scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-md"
            >
              <div
                aria-hidden="true"
                className={`absolute inset-y-0 left-0 w-1 bg-linear-to-b ${section.accent}`}
              />
              <div className="p-5 pl-6 sm:p-6 sm:pl-7">
                <header className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${section.accent} text-white shadow-md`}
                  >
                    {section.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700/70">
                      Section {section.number}
                    </p>
                    <h2 className="mt-0.5 text-lg font-bold text-indigo-950 sm:text-xl">
                      {section.title}
                    </h2>
                  </div>
                </header>
                <div className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
                  {section.body}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-indigo-100 bg-linear-to-br from-indigo-50 via-white to-blue-50 p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow ring-1 ring-indigo-100">
            <MailIcon />
          </div>
          <h2 className="mt-4 text-lg font-bold text-indigo-950">
            Have a privacy question?
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Our team responds within 2 business days.
          </p>
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-800 hover:shadow-lg"
          >
            <MailIcon />
            {LEGAL.contactEmail}
          </a>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Last updated {LEGAL.effectiveDate} • {LEGAL.companyName}
        </p>
      </div>
    </main>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
          <span
            aria-hidden="true"
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br from-indigo-500 to-blue-500"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const ICON_CLASS = "h-5 w-5";

function LockIcon() {
  return (
    <svg
      className="h-7 w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg
      className={ICON_CLASS}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg
      className={ICON_CLASS}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      className={ICON_CLASS}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className={ICON_CLASS}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CookieIcon() {
  return (
    <svg
      className={ICON_CLASS}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5h.01" />
      <path d="M16 15.5h.01" />
      <path d="M12 12h.01" />
      <path d="M11 17h.01" />
      <path d="M7 14h.01" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg
      className={ICON_CLASS}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}

function UserCheckIcon() {
  return (
    <svg
      className={ICON_CLASS}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      className={ICON_CLASS}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      className={ICON_CLASS}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      className={ICON_CLASS}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
