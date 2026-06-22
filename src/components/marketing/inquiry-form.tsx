"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormSubmitFooter } from "@/components/marketing/form-primitives";
import {
  INITIAL_MARKETING_FORM_STATE,
  type MarketingFormState,
} from "@/components/marketing/form-action-state";
import { submitInquiryAction } from "@/app/(marketing)/contact/actions";

type RequirementOption = {
  value: string;
  label: string;
};

const REQUIREMENT_OPTIONS: RequirementOption[] = [
  { value: "hire_resources", label: "Hire Resources" },
  { value: "vendor_support", label: "Need Vendor Support" },
  { value: "project_requirement", label: "Project Requirement" },
  { value: "general_inquiry", label: "General Inquiry" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">
      {children}
    </span>
  );
}

const inputBase =
  "w-full rounded-xl border border-indigo-100 bg-white/90 px-4 py-3 text-sm text-indigo-950 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100";

export function InquiryForm() {
  const [state, formAction] = useActionState<MarketingFormState, FormData>(
    submitInquiryAction,
    INITIAL_MARKETING_FORM_STATE,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const submitSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }

    if (state.status === "success" || state.status === "error") {
      submitSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5" noValidate>
      <input
        type="text"
        name="hp_field"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <FieldLabel>Name</FieldLabel>
          <input
            type="text"
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            placeholder="Your full name"
            className={inputBase}
          />
        </label>
        <label className="block space-y-1.5">
          <FieldLabel>Company</FieldLabel>
          <input
            type="text"
            name="company"
            maxLength={120}
            autoComplete="organization"
            placeholder="Company name (optional)"
            className={inputBase}
          />
        </label>
        <label className="block space-y-1.5">
          <FieldLabel>Email Address</FieldLabel>
          <input
            type="email"
            name="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="name@company.com"
            className={inputBase}
          />
        </label>
        <label className="block space-y-1.5">
          <FieldLabel>Phone Number</FieldLabel>
          <input
            type="tel"
            name="phone"
            maxLength={40}
            autoComplete="tel"
            placeholder="+91 98765 43210"
            className={inputBase}
          />
        </label>
      </div>

      <fieldset className="space-y-2.5">
        <legend>
          <FieldLabel>Requirement Type</FieldLabel>
        </legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {REQUIREMENT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="group flex cursor-pointer items-center gap-3 rounded-xl border border-indigo-100 bg-white/80 px-3.5 py-2.5 text-sm font-medium text-indigo-950 transition hover:border-sky-300 hover:bg-sky-50/60 has-checked:border-sky-400 has-checked:bg-sky-50 has-checked:shadow-[0_8px_24px_-12px_rgba(56,160,255,0.55)]"
            >
              <input
                type="checkbox"
                name="requirementType"
                value={option.value}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-indigo-200 bg-white text-white transition peer-checked:border-sky-400 peer-checked:bg-linear-to-br peer-checked:from-cyan-400 peer-checked:to-indigo-500 peer-checked:[&>svg]:opacity-100"
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
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block space-y-1.5">
        <FieldLabel>Message</FieldLabel>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={5}
          placeholder="Tell us about your requirement, timeline, and any PLM platforms involved."
          className={`${inputBase} min-h-32 resize-y leading-relaxed`}
        />
      </label>

      <FormSubmitFooter
        sectionRef={submitSectionRef}
        status={state.status}
        message={state.message}
        helperText="By submitting you agree we can contact you about your inquiry."
        submitLabel="Send Inquiry"
        loadingText="Sending..."
      />
    </form>
  );
}
