import Image from "next/image";
import Link from "next/link";

export default function MarketingHomePage() {
  return (
    <section className="relative flex flex-1 flex-col overflow-hidden bg-[#05082a]">
      <Image
        src="/hero-blueprint.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-contain object-top"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#05082a]/40"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(5,8,42,0.55) 0%, rgba(5,8,42,0.15) 55%, transparent 80%)",
        }}
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl animate-float-a" />
        <div className="absolute -right-20 top-24 h-112 w-md rounded-full bg-indigo-400/25 blur-3xl animate-float-b" />
        <div
          className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-400/25 blur-3xl animate-float-c"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-10 right-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl animate-float-a"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute left-[8%] top-[22%] h-3 w-3 rounded-sm bg-cyan-300/70 shadow-[0_0_10px_rgba(103,232,249,0.7)] animate-drift" />
        <div
          className="absolute right-[12%] top-[34%] h-2.5 w-2.5 rounded-full bg-sky-300/80 shadow-[0_0_10px_rgba(125,211,252,0.8)] animate-drift"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute left-[18%] bottom-[26%] h-4 w-4 rotate-45 rounded-sm bg-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.6)] animate-drift"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute right-[20%] bottom-[22%] h-3 w-3 rounded-full bg-violet-400/70 shadow-[0_0_10px_rgba(167,139,250,0.7)] animate-drift"
          style={{ animationDelay: "6s" }}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#05082a]/60 to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
        <h1
          className="animate-fade-up text-gradient-animated bg-linear-to-r from-sky-200 via-white to-cyan-200 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-[0_2px_18px_rgba(56,189,248,0.45)] sm:text-5xl md:text-6xl"
          style={{ animationDelay: "0.05s" }}
        >
          PLM FREELANCER
        </h1>

        <p
          className="animate-fade-up mt-4 text-lg font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-xl md:text-2xl"
          style={{ animationDelay: "0.2s" }}
        >
          Hub of PLM Experts
        </p>

        <p
          className="animate-fade-up mt-2 text-sm font-medium text-sky-100/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] sm:text-base"
          style={{ animationDelay: "0.35s" }}
        >
          Single Platform for End-to-End PLM Solutions
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
          style={{ animationDelay: "0.5s" }}
        >
          <Link
            href="/register?role=freelancer"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 text-xs font-bold uppercase tracking-wider text-indigo-950 shadow-[0_8px_24px_rgba(125,211,252,0.25)] ring-1 ring-white/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(125,211,252,0.45)] hover:ring-sky-200"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-sky-200/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Apply as a Freelancer</span>
          </Link>
          <Link
            href="/register?role=client"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-linear-to-r from-cyan-400 via-sky-500 to-indigo-500 px-8 text-xs font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(56,189,248,0.35)] ring-1 ring-white/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(56,189,248,0.55)] hover:brightness-110"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Submit Your Requirements</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
