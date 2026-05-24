import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-700">
        Error 404
      </p>
      <h1 className="mt-3 text-4xl font-bold text-indigo-950 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          Go home
        </Link>
        <Link
          href="/login"
          className="rounded-xl border border-border bg-white px-5 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-50"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
