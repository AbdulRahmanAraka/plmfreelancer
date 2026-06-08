"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SiteHeaderBar } from "@/components/layouts/site-header";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeaderBar />
      <div className="mx-auto flex flex-1 w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-rose-700">
        Something went wrong
      </p>
      <h1 className="mt-3 text-3xl font-bold text-indigo-950 sm:text-4xl">
        We hit an unexpected error
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The issue has been logged. You can try again, or head back home.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      ) : null}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-border bg-white px-5 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-50"
        >
          Go home
        </Link>
      </div>
      </div>
    </div>
  );
}
