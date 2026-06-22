"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { FormSubmitFooter } from "@/components/marketing/form-primitives";
import {
  INITIAL_MARKETING_FORM_STATE,
  type MarketingFormState,
} from "@/components/marketing/form-action-state";
import { submitSupportRequestAction } from "@/app/(marketing)/support/actions";

type RadioOption = {
  value: string;
  label: string;
};

type PriorityOption = RadioOption & {
  accentClass: string;
  ringClass: string;
};

const PLATFORM_OPTIONS: RadioOption[] = [
  { value: "teamcenter", label: "Teamcenter" },
  { value: "windchill", label: "Windchill" },
  { value: "enovia", label: "ENOVIA" },
  { value: "aras_innovator", label: "Aras Innovator" },
  { value: "other", label: "Other" },
];

const SUPPORT_TYPE_OPTIONS: RadioOption[] = [
  { value: "production_issue", label: "Production Issue" },
  { value: "application_error", label: "Application Error" },
  { value: "user_support", label: "User Support" },
  { value: "custom_development", label: "Custom Development" },
  { value: "integration_support", label: "Integration Support" },
  { value: "migration_support", label: "Migration Support" },
  { value: "upgrade_support", label: "Upgrade Support" },
  { value: "performance_issue", label: "Performance Issue" },
  { value: "other", label: "Other" },
];

const PRIORITY_OPTIONS: PriorityOption[] = [
  {
    value: "critical",
    label: "Critical (Immediate)",
    accentClass: "has-checked:border-rose-400 has-checked:bg-rose-50",
    ringClass: "peer-checked:bg-rose-500",
  },
  {
    value: "high",
    label: "High",
    accentClass: "has-checked:border-amber-400 has-checked:bg-amber-50",
    ringClass: "peer-checked:bg-amber-500",
  },
  {
    value: "medium",
    label: "Medium",
    accentClass: "has-checked:border-sky-400 has-checked:bg-sky-50",
    ringClass: "peer-checked:bg-sky-500",
  },
  {
    value: "low",
    label: "Low",
    accentClass: "has-checked:border-emerald-400 has-checked:bg-emerald-50",
    ringClass: "peer-checked:bg-emerald-500",
  },
];

const SUPPORT_MODE_OPTIONS: RadioOption[] = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "Onsite" },
  { value: "either", label: "Either" },
];

const FIELD_LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700";
const REQUIRED_DOT = (
  <span aria-hidden="true" className="ml-1 text-rose-500">
    *
  </span>
);

const INPUT_BASE =
  "w-full rounded-xl border border-indigo-100 bg-white/90 px-4 py-3 text-sm text-indigo-950 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100";

function RadioPill({
  name,
  value,
  label,
  required,
}: {
  name: string;
  value: string;
  label: string;
  required?: boolean;
}) {
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

function PriorityPill({ option }: { option: PriorityOption }) {
  return (
    <label
      className={`group flex cursor-pointer items-center gap-2.5 rounded-xl border border-indigo-100 bg-white/80 px-3.5 py-2.5 text-sm font-semibold text-indigo-950 transition hover:border-sky-300 hover:bg-sky-50/60 has-checked:shadow-[0_8px_24px_-14px_rgba(56,160,255,0.4)] ${option.accentClass}`}
    >
      <input
        type="radio"
        name="priority"
        value={option.value}
        required
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300 transition ${option.ringClass}`}
      />
      <span>{option.label}</span>
    </label>
  );
}

export function SupportRequestForm() {
  const [state, formAction] = useActionState<MarketingFormState, FormData>(
    submitSupportRequestAction,
    INITIAL_MARKETING_FORM_STATE,
  );
  const [immediate, setImmediate] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitSectionRef = useRef<HTMLDivElement>(null);
  const immediateHelperId = useId();

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setImmediate(false);
      setAttachmentName(null);
    }

    if (state.status === "success" || state.status === "error") {
      submitSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      encType="multipart/form-data"
      className="space-y-7"
      noValidate
    >
      <input
        type="text"
        name="hp_field"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />

      <section className="space-y-4">
        <header>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-500">
            Contact Information
          </p>
          <span
            aria-hidden="true"
            className="mt-1.5 block h-0.5 w-10 rounded-full bg-linear-to-r from-cyan-400 to-indigo-500"
          />
        </header>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className={FIELD_LABEL_CLASS}>
              Full Name{REQUIRED_DOT}
            </span>
            <input
              type="text"
              name="fullName"
              required
              maxLength={120}
              autoComplete="name"
              placeholder="Your full name"
              className={INPUT_BASE}
            />
          </label>
          <label className="block space-y-1.5">
            <span className={FIELD_LABEL_CLASS}>Company Name</span>
            <input
              type="text"
              name="company"
              maxLength={120}
              autoComplete="organization"
              placeholder="Company name (optional)"
              className={INPUT_BASE}
            />
          </label>
          <label className="block space-y-1.5">
            <span className={FIELD_LABEL_CLASS}>
              Email Address{REQUIRED_DOT}
            </span>
            <input
              type="email"
              name="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="name@company.com"
              className={INPUT_BASE}
            />
          </label>
          <label className="block space-y-1.5">
            <span className={FIELD_LABEL_CLASS}>Phone / WhatsApp</span>
            <input
              type="tel"
              name="phone"
              maxLength={60}
              autoComplete="tel"
              placeholder="+91 98765 43210"
              className={INPUT_BASE}
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <header>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-500">
            Support Details
          </p>
          <span
            aria-hidden="true"
            className="mt-1.5 block h-0.5 w-10 rounded-full bg-linear-to-r from-cyan-400 to-indigo-500"
          />
        </header>

        <fieldset className="space-y-2.5">
          <legend className={FIELD_LABEL_CLASS}>
            PLM Platform{REQUIRED_DOT}
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            {PLATFORM_OPTIONS.map((option) => (
              <RadioPill
                key={option.value}
                name="platform"
                value={option.value}
                label={option.label}
                required
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2.5">
          <legend className={FIELD_LABEL_CLASS}>
            Support Type{REQUIRED_DOT}
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORT_TYPE_OPTIONS.map((option) => (
              <RadioPill
                key={option.value}
                name="supportType"
                value={option.value}
                label={option.label}
                required
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2.5">
          <legend className={FIELD_LABEL_CLASS}>
            Priority / Severity{REQUIRED_DOT}
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {PRIORITY_OPTIONS.map((option) => (
              <PriorityPill key={option.value} option={option} />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2.5">
          <legend className={FIELD_LABEL_CLASS}>Required Support Mode</legend>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {SUPPORT_MODE_OPTIONS.map((option) => (
              <RadioPill
                key={option.value}
                name="supportMode"
                value={option.value}
                label={option.label}
              />
            ))}
          </div>
        </fieldset>

        <label className="block space-y-1.5">
          <span className={FIELD_LABEL_CLASS}>Preferred Start Date</span>
          <input
            type="date"
            name="preferredStartDate"
            className={INPUT_BASE}
          />
        </label>

        <label className="block space-y-1.5">
          <span className={FIELD_LABEL_CLASS}>
            Brief Description of Issue{REQUIRED_DOT}
          </span>
          <textarea
            name="description"
            required
            minLength={20}
            maxLength={6000}
            rows={5}
            placeholder="Describe the issue, environment, recent changes, error messages, and impact."
            className={`${INPUT_BASE} min-h-32 resize-y leading-relaxed`}
          />
        </label>

        <div className="space-y-1.5">
          <span className={FIELD_LABEL_CLASS}>Attachment</span>
          <label className="group flex cursor-pointer flex-wrap items-center gap-3 rounded-xl border border-dashed border-indigo-200 bg-white/70 px-4 py-3 text-sm text-slate-600 transition hover:border-sky-400 hover:bg-sky-50/60">
            <input
              type="file"
              name="attachment"
              accept=".pdf,.txt,.log,.csv,.png,.jpg,.jpeg,.zip,.doc,.docx,.xls,.xlsx"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] ?? null;
                setAttachmentName(file ? file.name : null);
              }}
              className="sr-only"
            />
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-cyan-100 to-indigo-100 text-indigo-700">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m21 12-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8L13.5 4.3a3.7 3.7 0 0 1 5.2 5.2L10 18.2a1.9 1.9 0 1 1-2.7-2.7L15 7.8" />
              </svg>
            </span>
            <span className="flex-1">
              {attachmentName ? (
                <span className="font-semibold text-indigo-950">
                  {attachmentName}
                </span>
              ) : (
                <>
                  <span className="font-semibold text-indigo-950">
                    Click to upload
                  </span>{" "}
                  log files, screenshots, or error reports
                </>
              )}
            </span>
            <span className="text-xs text-slate-500">Max 3 MB</span>
          </label>
        </div>
      </section>

      <div className="space-y-2 rounded-xl border border-indigo-100 bg-white/70 p-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm font-medium text-indigo-950">
          <input
            type="checkbox"
            name="immediate"
            checked={immediate}
            onChange={(event) => setImmediate(event.currentTarget.checked)}
            aria-describedby={immediate ? immediateHelperId : undefined}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-indigo-200 bg-white text-white transition peer-checked:border-sky-400 peer-checked:bg-linear-to-br peer-checked:from-cyan-400 peer-checked:to-indigo-500 peer-checked:[&>svg]:opacity-100"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-0 transition"
            >
              <path d="m5 12 5 5 9-11" />
            </svg>
          </span>
          <span>I need immediate assistance.</span>
        </label>
        {immediate ? (
          <p
            id={immediateHelperId}
            className="ml-8 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700"
          >
            For urgent production issues, please mention{" "}
            <span className="font-bold">Critical</span> in the support
            description above so on-call engineers are paged.
          </p>
        ) : null}
      </div>

      <FormSubmitFooter
        sectionRef={submitSectionRef}
        status={state.status}
        message={state.message}
        helperText="Our team will review and connect you with a suitable PLM expert shortly."
        submitLabel="Request Support"
        loadingText="Sending..."
      />
    </form>
  );
}
