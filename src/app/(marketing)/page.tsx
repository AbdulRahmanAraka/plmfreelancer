import Image from "next/image";
import Link from "next/link";
import { HomeProjectSearch } from "@/components/search/home-project-search";
import { getSession } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function HeadsetIcon() {
  return (
    <svg
      width="18"
      height="18"
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

export default async function MarketingHomePage() {
  const session = await getSession();
  let userRole: string | null = null;

  if (session) {
    const supabase = await createSupabaseServerClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();
    userRole = profile?.role ?? null;
  }

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative flex min-h-112 flex-3 shrink-0 flex-col overflow-hidden bg-[#05082a]">
        <HomeProjectSearch isLoggedIn={Boolean(session)} userRole={userRole} />
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
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-[#05082a]/60 to-transparent"
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-6 text-center sm:px-6 sm:py-8">
          <h1
            className="animate-fade-up text-gradient-animated bg-linear-to-r from-sky-200 via-white to-cyan-200 bg-clip-text text-4xl font-extrabold tracking-tight whitespace-nowrap text-transparent drop-shadow-[0_2px_18px_rgba(56,189,248,0.45)] sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.05s" }}
          >
            PLM FREELANCER
          </h1>

          <p
            className="animate-fade-up mt-3 text-xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-2xl md:text-3xl"
            style={{ animationDelay: "0.2s" }}
          >
            Hub of PLM Experts
          </p>

          <div
            className="animate-fade-up mt-7 flex flex-col items-center gap-3 sm:flex-row sm:gap-5"
            style={{ animationDelay: "0.5s" }}
          >
            <Link
              href="/register?role=freelancer"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 text-sm font-bold uppercase tracking-wider text-indigo-950 shadow-[0_8px_24px_rgba(125,211,252,0.25)] ring-1 ring-white/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(125,211,252,0.45)] hover:ring-sky-200"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-sky-200/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Apply as a Freelancer</span>
            </Link>
            <Link
              href="/register?role=client"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-linear-to-r from-cyan-400 via-sky-500 to-indigo-500 px-8 text-sm font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(56,189,248,0.35)] ring-1 ring-white/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(56,189,248,0.55)] hover:brightness-110"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Submit Your Requirements</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-48 flex-1 flex-col justify-center bg-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 sm:py-4 md:grid-cols-2 md:gap-8">
          <div>
            <h2
              className="animate-fade-up text-2xl font-bold tracking-tight text-indigo-950 sm:text-3xl"
              style={{ animationDelay: "0.1s" }}
            >
              The Global Marketplace for PLM Expertise
            </h2>
            <span
              aria-hidden="true"
              className="animate-fade-up mt-2 block h-0.5 w-14 rounded-full bg-linear-to-r from-cyan-400 to-indigo-500"
              style={{ animationDelay: "0.3s" }}
            />
            <p
              className="animate-fade-up mt-3 text-base leading-snug text-slate-600 sm:text-[17px]"
              style={{ animationDelay: "0.5s" }}
            >
              Connecting organizations with niche PLM talent and trusted vendors
              across Teamcenter, Windchill, ENOVIA, Aras Innovator, and other PLM
              platforms for implementation, customization, migration,
              integration, support, and end-to-end project delivery. Enabling
              professionals to showcase specialized skills and access global
              opportunities through a dedicated PLM marketplace.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Image
              src="/homepage%20image.png"
              alt="Global network of PLM professionals and platforms"
              width={1536}
              height={1024}
              unoptimized
              priority
              className="h-auto w-full max-w-72 object-contain md:max-w-sm lg:max-w-md"
            />
          </div>
        </div>
      </section>

      <section className="relative shrink-0 border-t border-slate-100 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-3 text-center sm:px-6 sm:py-4">
          <Link
            href="/support"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-950 shadow-[0_2px_10px_rgba(13,70,217,0.08)] ring-1 ring-indigo-100 transition duration-300 hover:-translate-y-0.5 hover:ring-sky-300 hover:shadow-[0_14px_32px_rgba(56,160,255,0.25)] sm:text-sm"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-sky-100/70 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-sky-100 to-indigo-100 text-indigo-600 ring-1 ring-white/80 transition group-hover:from-sky-200 group-hover:to-indigo-200 group-hover:text-indigo-700">
              <HeadsetIcon />
            </span>
            <span className="relative">On Demand PLM Support</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="relative text-indigo-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-700"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="text-xs text-slate-600 sm:text-sm">
            Get instant assistance from PLM experts whenever you need it.
          </p>
        </div>
      </section>
    </div>
  );
}
