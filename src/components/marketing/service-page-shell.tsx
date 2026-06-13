import type { ReactNode } from "react";

type ServicePageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ServicePageHero({
  eyebrow,
  title,
  description,
}: ServicePageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#05082a]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-cyan-500/25 blur-3xl animate-float-a" />
        <div className="absolute -right-10 top-20 h-112 w-md rounded-full bg-indigo-500/30 blur-3xl animate-float-b" />
        <div
          className="absolute left-1/2 bottom-0 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl animate-float-c"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
      >
        <div className="absolute left-[12%] top-[28%] h-2.5 w-2.5 rounded-full bg-cyan-300/80 shadow-[0_0_14px_rgba(103,232,249,0.8)] animate-drift" />
        <div
          className="absolute left-[58%] top-[18%] h-2 w-2 rounded-sm bg-sky-300/70 shadow-[0_0_10px_rgba(125,211,252,0.7)] animate-drift"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute right-[14%] bottom-[22%] h-3 w-3 rotate-45 rounded-sm bg-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.6)] animate-drift"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#05082a] to-transparent"
      />

      <div className="relative mx-auto w-full max-w-4xl px-4 pt-10 pb-16 text-center sm:px-6 md:pt-12 md:pb-20">
        <p
          className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.3em] text-sky-300 ring-1 ring-white/10 backdrop-blur"
          style={{ animationDelay: "0.05s" }}
        >
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.9)]"
          />
          {eyebrow}
        </p>
        <h1
          className="animate-fade-up mt-5 text-gradient-animated bg-linear-to-r from-sky-200 via-white to-cyan-200 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-[0_2px_18px_rgba(56,189,248,0.45)] sm:text-5xl md:text-6xl"
          style={{ animationDelay: "0.15s" }}
        >
          {title}
        </h1>
        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-sky-100/90 sm:text-lg"
          style={{ animationDelay: "0.3s" }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}

type ServiceFormSectionProps = {
  kicker: string;
  title: string;
  children: ReactNode;
};

export function ServiceFormSection({
  kicker,
  title,
  children,
}: ServiceFormSectionProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-sky-50/40 to-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 pt-8 pb-16 sm:px-6 md:pt-10 md:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">
            {kicker}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-indigo-950 sm:text-3xl md:text-4xl">
            {title}
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
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
