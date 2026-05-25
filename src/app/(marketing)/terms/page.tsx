import type { ReactNode } from "react";
import { LEGAL } from "@/config/legal";

export const metadata = {
  title: "Terms & Conditions | PLM Freelancer Platform",
  description: "The rules governing use of the platform.",
};

type Section = {
  number: number;
  title: string;
  icon: ReactNode;
  accent: string;
  body: ReactNode;
};

export default function TermsPage() {
  const sections: Section[] = [
    {
      number: 1,
      title: "About plmfreelancer.com",
      accent: "from-indigo-500 to-blue-500",
      icon: <InfoIcon />,
      body: (
        <p>
          plmfreelancer.com is a service facilitation platform that connects
          clients with independent PLM freelancers, consultants, and service
          providers. We act as a mediator and project coordinator, analyzing
          client requirements and assigning suitable freelancers.
        </p>
      ),
    },
    {
      number: 2,
      title: "Nature of Engagement",
      accent: "from-sky-500 to-cyan-500",
      icon: <BriefcaseIcon />,
      body: (
        <BulletList
          items={[
            "Freelancers registered on this platform act as independent contractors, not employees.",
            "Any reference to “job”, “work”, or “engagement” refers strictly to freelance, contract-based, or project-based assignments.",
            "Submission of a freelancer form does not guarantee work or employment.",
          ]}
        />
      ),
    },
    {
      number: 3,
      title: "Client Engagement",
      accent: "from-cyan-500 to-teal-500",
      icon: <HandshakeIcon />,
      body: (
        <BulletList
          items={[
            "Clients submit project requirements through the platform.",
            "We evaluate requirements and assign suitable freelancers.",
            "All commercial terms (scope, timelines, deliverables) are managed by plmfreelancer.com.",
            "Payments from clients are made only to plmfreelancer.com.",
          ]}
        />
      ),
    },
    {
      number: 4,
      title: "Payments & Fees",
      accent: "from-emerald-500 to-green-500",
      icon: <CreditCardIcon />,
      body: (
        <BulletList
          items={[
            "plmfreelancer.com collects full payment from clients.",
            "Freelancers are paid based on agreed terms after successful completion or milestones.",
            "Platform service fees, commissions, or deductions may apply.",
            "Payment timelines may vary based on project agreements.",
          ]}
        />
      ),
    },
    {
      number: 5,
      title: "Freelancer Responsibilities",
      accent: "from-green-500 to-lime-500",
      icon: <ChecklistIcon />,
      body: (
        <>
          <p>Freelancers agree to:</p>
          <BulletList
            items={[
              "Provide accurate information",
              "Maintain confidentiality",
              "Deliver work professionally and on time",
              "Not bypass the platform for direct client payments",
              "Comply with client and platform policies",
            ]}
          />
        </>
      ),
    },
    {
      number: 6,
      title: "Intellectual Property",
      accent: "from-amber-500 to-orange-500",
      icon: <AwardIcon />,
      body: (
        <BulletList
          items={[
            "All work products created during a project belong to the client, unless otherwise agreed.",
            "Freelancers waive ownership claims once payment is made.",
            "plmfreelancer.com does not claim ownership of client deliverables.",
          ]}
        />
      ),
    },
    {
      number: 7,
      title: "Confidentiality",
      accent: "from-orange-500 to-rose-500",
      icon: <LockIcon />,
      body: (
        <>
          <p>All parties must keep confidential:</p>
          <BulletList
            items={[
              "Client data",
              "Project information",
              "Business processes",
              "Pricing and agreements",
            ]}
          />
        </>
      ),
    },
    {
      number: 8,
      title: "Limitation of Liability",
      accent: "from-rose-500 to-pink-500",
      icon: <AlertIcon />,
      body: (
        <>
          <p>plmfreelancer.com shall not be liable for:</p>
          <BulletList
            items={[
              "Project delays caused by freelancers or clients",
              "Business losses, indirect or consequential damages",
              "Disputes arising outside agreed scope",
            ]}
          />
        </>
      ),
    },
    {
      number: 9,
      title: "Termination",
      accent: "from-pink-500 to-fuchsia-500",
      icon: <OctagonIcon />,
      body: (
        <>
          <p>We reserve the right to:</p>
          <BulletList
            items={[
              "Suspend or terminate accounts for misuse",
              "Reject submissions without explanation",
              "Remove freelancers or clients violating policies",
            ]}
          />
        </>
      ),
    },
    {
      number: 10,
      title: "Changes to Terms",
      accent: "from-fuchsia-500 to-purple-500",
      icon: <RefreshIcon />,
      body: (
        <p>
          We may update these Terms at any time. Continued use of the platform
          indicates acceptance of revised terms.
        </p>
      ),
    },
    {
      number: 11,
      title: "Governing Law",
      accent: "from-purple-500 to-violet-600",
      icon: <ScaleIcon />,
      body: <p>These Terms shall be governed by the laws of India.</p>,
    },
    {
      number: 12,
      title: "Contact",
      accent: "from-violet-500 to-indigo-600",
      icon: <MailIcon />,
      body: (
        <p>
          Have a question about these Terms? Reach us at{" "}
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
              <DocumentIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
                Legal • Effective {LEGAL.effectiveDate}
              </p>
              <h1 className="mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
                Terms &amp; Conditions
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-50/95">
                Welcome to plmfreelancer.com (&ldquo;Platform&rdquo;,
                &ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;). By
                accessing or using this website, you agree to comply with and be
                bound by the following Terms &amp; Conditions. If you do not
                agree, please do not use our services.
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
            Questions about these Terms?
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            We typically respond within 2 business days.
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
          Effective {LEGAL.effectiveDate} • {LEGAL.companyName}
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

function DocumentIcon() {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="8" y1="9" x2="10" y2="9" />
    </svg>
  );
}

function InfoIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function BriefcaseIcon() {
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
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function HandshakeIcon() {
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
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CreditCardIcon() {
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
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function ChecklistIcon() {
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
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function AwardIcon() {
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
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

function LockIcon() {
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function AlertIcon() {
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
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function OctagonIcon() {
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
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
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

function ScaleIcon() {
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
      <path d="M12 3v18" />
      <path d="M5 21h14" />
      <path d="M6 3h12" />
      <path d="m3 10 3-7 3 7c0 1.66-1.34 3-3 3s-3-1.34-3-3z" />
      <path d="m15 10 3-7 3 7c0 1.66-1.34 3-3 3s-3-1.34-3-3z" />
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
