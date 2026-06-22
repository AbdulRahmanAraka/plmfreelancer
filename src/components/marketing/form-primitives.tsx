"use client";

import type { ReactNode, RefObject } from "react";
import { Button } from "@/components/ui/button";

export const FIELD_LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700";

export const INPUT_BASE =
  "w-full rounded-xl border border-indigo-100 bg-white/90 px-4 py-3 text-sm text-indigo-950 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100";

export function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-1 text-rose-500">
      *
    </span>
  );
}

type RadioPillProps = {
  name: string;
  value: string;
  label: string;
  required?: boolean;
};

export function RadioPill({ name, value, label, required }: RadioPillProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 rounded-xl border border-indigo-100 bg-white/80 px-3.5 py-2.5 text-sm font-medium text-indigo-950 transition hover:border-sky-300 hover:bg-sky-50/60 has-checked:border-sky-400 has-checked:bg-sky-50 has-checked:shadow-[0_8px_24px_-14px_rgba(56,160,255,0.55)]">
      <input
        type="radio"
        name={name}
        value={value}
        required={required}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-white transition peer-checked:border-sky-500 peer-checked:[&>span]:scale-100"
      >
        <span className="inline-block h-2 w-2 scale-0 rounded-full bg-linear-to-br from-cyan-400 to-indigo-500 transition" />
      </span>
      <span>{label}</span>
    </label>
  );
}

type FieldGroupProps = {
  title: string;
  children: ReactNode;
};

export function FieldGroup({ title, children }: FieldGroupProps) {
  return (
    <section className="space-y-4">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-500">
          {title}
        </p>
        <span
          aria-hidden="true"
          className="mt-1.5 block h-0.5 w-10 rounded-full bg-linear-to-r from-cyan-400 to-indigo-500"
        />
      </header>
      {children}
    </section>
  );
}

type StatusBannerProps = {
  status: "idle" | "success" | "error";
  message: string;
};

export function StatusBanner({ status, message }: StatusBannerProps) {
  if (status === "success") {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
      >
        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m5 12 5 5 9-11" />
          </svg>
        </span>
        <p>{message}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
      >
        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
          !
        </span>
        <p>{message}</p>
      </div>
    );
  }

  return null;
}

type FormSubmitFooterProps = {
  status: "idle" | "success" | "error";
  message: string;
  helperText: string;
  submitLabel: string;
  loadingText?: string;
  sectionRef?: RefObject<HTMLDivElement | null>;
};

export function FormSubmitFooter({
  status,
  message,
  helperText,
  submitLabel,
  loadingText = "Submitting...",
  sectionRef,
}: FormSubmitFooterProps) {
  return (
    <div
      ref={sectionRef}
      className="space-y-3 border-t border-indigo-100/80 pt-5"
    >
      <StatusBanner status={status} message={message} />
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">{helperText}</p>
        <Button
          type="submit"
          size="lg"
          loadingText={loadingText}
          className="w-full sm:w-auto"
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
