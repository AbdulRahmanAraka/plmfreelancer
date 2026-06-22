"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  FieldGroup,
  FIELD_LABEL_CLASS,
  FormSubmitFooter,
  INPUT_BASE,
  RadioPill,
  RequiredMark,
} from "@/components/marketing/form-primitives";
import {
  INITIAL_MARKETING_FORM_STATE,
  type MarketingFormState,
} from "@/components/marketing/form-action-state";
import { submitVendorRequestAction } from "@/app/(marketing)/find-vendors/actions";

const PROJECT_TYPE_OPTIONS = [
  { value: "implementation", label: "Implementation" },
  { value: "customization", label: "Customization" },
  { value: "migration", label: "Migration" },
  { value: "integration", label: "Integration" },
  { value: "support", label: "Support" },
  { value: "upgrade", label: "Upgrade" },
  { value: "end_to_end_delivery", label: "End-to-End Delivery" },
  { value: "other", label: "Other" },
];

const APPLICATION_OPTIONS = [
  { value: "teamcenter", label: "Teamcenter" },
  { value: "windchill", label: "Windchill" },
  { value: "enovia", label: "ENOVIA" },
  { value: "aras_innovator", label: "Aras Innovator" },
  { value: "other", label: "Other" },
];

const DURATION_OPTIONS = [
  { value: "under_1_month", label: "Under 1 month" },
  { value: "1_3_months", label: "1 – 3 months" },
  { value: "3_6_months", label: "3 – 6 months" },
  { value: "6_12_months", label: "6 – 12 months" },
  { value: "over_12_months", label: "Over 12 months" },
];

export function VendorRequestForm() {
  const [state, formAction] = useActionState<MarketingFormState, FormData>(
    submitVendorRequestAction,
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
    <form ref={formRef} action={formAction} className="space-y-7" noValidate>
      <input
        type="text"
        name="hp_field"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />

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

      <FieldGroup title="Project Details">
        <fieldset className="space-y-2.5">
          <legend className={FIELD_LABEL_CLASS}>
            Project Type
            <RequiredMark />
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {PROJECT_TYPE_OPTIONS.map((option) => (
              <RadioPill
                key={option.value}
                name="projectType"
                value={option.value}
                label={option.label}
                required
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2.5">
          <legend className={FIELD_LABEL_CLASS}>
            PLM Application
            <RequiredMark />
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            {APPLICATION_OPTIONS.map((option) => (
              <RadioPill
                key={option.value}
                name="application"
                value={option.value}
                label={option.label}
                required
              />
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className={FIELD_LABEL_CLASS}>
              Project Location
              <RequiredMark />
            </span>
            <input
              type="text"
              name="location"
              required
              maxLength={160}
              placeholder="City, Country or Remote"
              className={INPUT_BASE}
            />
          </label>
          <fieldset className="space-y-2.5">
            <legend className={FIELD_LABEL_CLASS}>
              Estimated Duration
              <RequiredMark />
            </legend>
            <select
              name="estimatedDuration"
              required
              defaultValue=""
              className={INPUT_BASE}
            >
              <option value="" disabled>
                Select estimated duration
              </option>
              {DURATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </fieldset>
        </div>

        <label className="block space-y-1.5">
          <span className={FIELD_LABEL_CLASS}>
            Requirement Details
            <RequiredMark />
          </span>
          <textarea
            name="requirements"
            required
            minLength={20}
            maxLength={6000}
            rows={5}
            placeholder="Scope of work, modules involved, key deliverables, expected timelines, and any other context."
            className={`${INPUT_BASE} min-h-32 resize-y leading-relaxed`}
          />
        </label>
      </FieldGroup>

      <FormSubmitFooter
        sectionRef={submitSectionRef}
        status={state.status}
        message={state.message}
        helperText="We will match your project with trusted PLM vendors and respond shortly."
        submitLabel="Find Vendor"
        loadingText="Submitting..."
      />
    </form>
  );
}
