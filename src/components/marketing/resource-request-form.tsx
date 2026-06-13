"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  FIELD_LABEL_CLASS,
  INPUT_BASE,
  RadioPill,
  RequiredMark,
  StatusBanner,
} from "@/components/marketing/form-primitives";
import {
  INITIAL_RESOURCE_REQUEST_STATE,
  submitResourceRequestAction,
  type ResourceRequestState,
} from "@/app/(marketing)/hire-resources/actions";

const SKILL_OPTIONS = [
  { value: "teamcenter", label: "Teamcenter" },
  { value: "windchill", label: "Windchill" },
  { value: "enovia", label: "ENOVIA" },
  { value: "aras_innovator", label: "Aras Innovator" },
  { value: "other", label: "Other" },
];

const EXPERIENCE_OPTIONS = [
  { value: "0_2", label: "0 – 2 years" },
  { value: "2_5", label: "2 – 5 years" },
  { value: "5_10", label: "5 – 10 years" },
  { value: "10_15", label: "10 – 15 years" },
  { value: "15_plus", label: "15+ years" },
];

const DURATION_OPTIONS = [
  { value: "short_term", label: "Short Term" },
  { value: "long_term", label: "Long Term" },
  { value: "contract", label: "Contract" },
  { value: "project_based", label: "Project Based" },
];

export function ResourceRequestForm() {
  const [state, formAction] = useActionState<ResourceRequestState, FormData>(
    submitResourceRequestAction,
    INITIAL_RESOURCE_REQUEST_STATE,
  );
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setAttachmentName(null);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
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

      <StatusBanner status={state.status} message={state.message} />

      <FieldGroup title="Contact Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className={FIELD_LABEL_CLASS}>
              Full Name
              <RequiredMark />
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
              maxLength={160}
              autoComplete="organization"
              placeholder="Company name"
              className={INPUT_BASE}
            />
          </label>
          <label className="block space-y-1.5">
            <span className={FIELD_LABEL_CLASS}>
              Email
              <RequiredMark />
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
            <span className={FIELD_LABEL_CLASS}>Phone</span>
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
      </FieldGroup>

      <FieldGroup title="Resource Requirement">
        <fieldset className="space-y-2.5">
          <legend className={FIELD_LABEL_CLASS}>
            Required Skill
            <RequiredMark />
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            {SKILL_OPTIONS.map((option) => (
              <RadioPill
                key={option.value}
                name="skill"
                value={option.value}
                label={option.label}
                required
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2.5">
          <legend className={FIELD_LABEL_CLASS}>
            Experience Required
            <RequiredMark />
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {EXPERIENCE_OPTIONS.map((option) => (
              <RadioPill
                key={option.value}
                name="experience"
                value={option.value}
                label={option.label}
                required
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2.5">
          <legend className={FIELD_LABEL_CLASS}>
            Contract Duration
            <RequiredMark />
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {DURATION_OPTIONS.map((option) => (
              <RadioPill
                key={option.value}
                name="duration"
                value={option.value}
                label={option.label}
                required
              />
            ))}
          </div>
        </fieldset>

        <label className="block space-y-1.5">
          <span className={FIELD_LABEL_CLASS}>Start Date</span>
          <input type="date" name="startDate" className={INPUT_BASE} />
        </label>

        <label className="block space-y-1.5">
          <span className={FIELD_LABEL_CLASS}>
            Job Description / Requirement
            <RequiredMark />
          </span>
          <textarea
            name="description"
            required
            minLength={20}
            maxLength={6000}
            rows={5}
            placeholder="Role overview, key responsibilities, must-have skills, location, work hours, and any other context."
            className={`${INPUT_BASE} min-h-32 resize-y leading-relaxed`}
          />
        </label>

        <div className="space-y-1.5">
          <span className={FIELD_LABEL_CLASS}>Upload JD (Optional)</span>
          <label className="group flex cursor-pointer flex-wrap items-center gap-3 rounded-xl border border-dashed border-indigo-200 bg-white/70 px-4 py-3 text-sm text-slate-600 transition hover:border-sky-400 hover:bg-sky-50/60">
            <input
              type="file"
              name="attachment"
              accept=".pdf,.doc,.docx,.txt,.rtf"
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
                  PDF or Word job description
                </>
              )}
            </span>
            <span className="text-xs text-slate-500">Max 3 MB</span>
          </label>
        </div>
      </FieldGroup>

      <div className="flex flex-col items-start gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Our team will shortlist suitable PLM professionals and get back to you
          shortly.
        </p>
        <Button
          type="submit"
          size="lg"
          loadingText="Submitting..."
          className="w-full sm:w-auto"
        >
          Submit Request
        </Button>
      </div>
    </form>
  );
}
