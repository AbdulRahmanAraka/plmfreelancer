import Link from "next/link";

export default function MarketingHomePage() {
  return (
    <section className="relative flex flex-1 flex-col overflow-hidden bg-linear-to-b from-sky-100 via-sky-200 to-sky-300">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_55%)]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-8 text-center sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-950 sm:text-4xl md:text-5xl">
          PLM FREELANCER
        </h1>
        <p className="mt-4 text-lg font-bold text-indigo-950 sm:text-xl md:text-2xl">
          Hub of PLM Experts
        </p>
        <p className="mt-2 text-sm text-indigo-900/80 sm:text-base">
          Single Platform for End-to-End PLM Solutions
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/register?role=freelancer"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-xs font-bold uppercase tracking-wider text-indigo-950 shadow-[0_10px_25px_rgba(13,70,217,0.15)] ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(13,70,217,0.25)]"
          >
            Apply as a Freelancer
          </Link>
          <Link
            href="/register?role=client"
            className="inline-flex h-12 items-center justify-center rounded-full bg-sky-300 px-8 text-xs font-bold uppercase tracking-wider text-indigo-950 shadow-[0_10px_25px_rgba(56,160,255,0.35)] transition hover:-translate-y-0.5 hover:bg-sky-400 hover:shadow-[0_14px_30px_rgba(56,160,255,0.45)]"
          >
            Submit Your Requirements
          </Link>
        </div>
      </div>
    </section>
  );
}
