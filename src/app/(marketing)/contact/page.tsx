import type { ReactNode } from "react";
import { LEGAL } from "@/config/legal";
import { InquiryForm } from "@/components/marketing/inquiry-form";

type ContactChannel = {
  label: string;
  value: string;
  href: string;
  description: string;
  icon: ReactNode;
};

function EmailIcon() {
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
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function GlobeIcon() {
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

const CHANNELS: ContactChannel[] = [
  {
    label: "Email",
    value: LEGAL.contactEmail,
    href: `mailto:${LEGAL.contactEmail}`,
    description: "Drop us a note — we typically respond within one business day.",
    icon: <EmailIcon />,
  },
  {
    label: "Website",
    value: "www.plmfreelancer.com",
    href: "https://www.plmfreelancer.com",
    description: "Explore services, freelancer profiles, and live engagements.",
    icon: <GlobeIcon />,
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#05082a]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-cyan-500/25 blur-3xl animate-float-a" />
          <div className="absolute -right-10 top-20 h-112 w-md rounded-full bg-indigo-500/30 blur-3xl animate-float-b" />
          <div
            className="absolute left-1/3 bottom-0 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl animate-float-c"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="absolute left-[12%] top-[28%] h-2.5 w-2.5 rounded-full bg-cyan-300/80 shadow-[0_0_14px_rgba(103,232,249,0.8)] animate-drift" />
          <div
            className="absolute left-[60%] top-[22%] h-2 w-2 rounded-sm bg-sky-300/70 shadow-[0_0_10px_rgba(125,211,252,0.7)] animate-drift"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute right-[14%] bottom-[20%] h-3 w-3 rotate-45 rounded-sm bg-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.6)] animate-drift"
            style={{ animationDelay: "4s" }}
          />
          <div
            className="absolute left-[20%] bottom-[18%] h-2 w-2 rounded-full bg-violet-400/70 shadow-[0_0_10px_rgba(167,139,250,0.7)] animate-drift"
            style={{ animationDelay: "5.5s" }}
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#05082a] to-transparent"
        />

        <div className="relative mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6 md:py-28">
          <p
            className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.3em] text-sky-300 ring-1 ring-white/10 backdrop-blur"
            style={{ animationDelay: "0.05s" }}
          >
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.9)]"
            />
            Contact
          </p>
          <h1
            className="animate-fade-up mt-5 text-gradient-animated bg-linear-to-r from-sky-200 via-white to-cyan-200 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-[0_2px_18px_rgba(56,189,248,0.45)] sm:text-5xl md:text-6xl"
            style={{ animationDelay: "0.15s" }}
          >
            Let&apos;s start the conversation.
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-sky-100/90 sm:text-lg"
            style={{ animationDelay: "0.3s" }}
          >
            Have a project requirement, looking for PLM expertise, or interested
            in joining our network? We would be happy to hear from you.
          </p>
        </div>
      </section>

      <section className="relative -mt-12 px-4 sm:px-6">
        <div className="mx-auto grid w-full max-w-5xl gap-4 sm:grid-cols-2">
          {CHANNELS.map((channel, index) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              className="animate-fade-up group relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-5 shadow-[0_20px_50px_-25px_rgba(13,70,217,0.45)] transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_28px_70px_-25px_rgba(13,70,217,0.55)]"
              style={{ animationDelay: `${0.35 + index * 0.1}s` }}
            >
              <span
                aria-hidden="true"
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-linear-to-br from-cyan-100 to-indigo-100 blur-2xl opacity-60 transition group-hover:opacity-100"
              />
              <div className="relative flex items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-indigo-600 text-white shadow-[0_10px_24px_-10px_rgba(56,189,248,0.55)]">
                  {channel.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                    {channel.label}
                  </p>
                  <p className="mt-1 truncate text-base font-bold text-indigo-950 transition group-hover:text-sky-700 sm:text-lg">
                    {channel.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {channel.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-linear-to-b from-white via-sky-50/40 to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">
              Send a Message
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-indigo-950 sm:text-3xl md:text-4xl">
              Tell us a little about what you need
            </h2>
            <span
              aria-hidden="true"
              className="mx-auto mt-4 block h-1 w-16 rounded-full bg-linear-to-r from-cyan-400 to-indigo-500"
            />
          </div>

          <div className="relative mt-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-1 rounded-3xl bg-linear-to-br from-cyan-200/40 via-indigo-200/30 to-transparent blur"
            />
            <div className="relative rounded-3xl border border-indigo-100 bg-white/95 p-6 shadow-[0_30px_80px_-30px_rgba(13,70,217,0.35)] backdrop-blur sm:p-8 md:p-10">
              <InquiryForm />
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-slate-500">
            Our team will review your inquiry and get back to you as soon as
            possible.
          </p>
        </div>
      </section>
    </>
  );
}
