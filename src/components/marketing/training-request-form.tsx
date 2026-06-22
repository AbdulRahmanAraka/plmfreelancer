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
import { submitTrainingRequestAction } from "@/app/(marketing)/training/actions";

const TECHNOLOGY_OPTIONS = [
  { value: "teamcenter", label: "Teamcenter" },
  { value: "windchill", label: "Windchill" },
  { value: "enovia", label: "ENOVIA" },
  { value: "aras_innovator", label: "Aras Innovator" },
  { value: "business_processes", label: "PLM Business Processes" },
  { value: "other", label: "Other" },
];

const MODE_OPTIONS = [
  { value: "online", label: "Online" },
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
];

export function TrainingRequestForm() {
  const [state, formAction] = useActionState<MarketingFormState, FormData>(
    submitTrainingRequestAction,
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
            <span className={FIELD_LABEL_CLASS}>Organization</span>
            <input
              type="text"
              name="organization"
              maxLength={160}
              autoComplete="organization"
              placeholder="Company or institution"
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
            <span className={FIELD_LABEL_CLASS}>
              Phone
              <RequiredMark />
            </span>
            <input
              type="tel"
              name="phone"
              required
              maxLength={60}
              autoComplete="tel"
              placeholder="+91 98765 43210"
              className={INPUT_BASE}
            />
          </label>
        </div>
      </FieldGroup>

      <FieldGroup title="Training Requirement">
        <fieldset className="space-y-2.5">
          <legend className={FIELD_LABEL_CLASS}>
            Training Technology
            <RequiredMark />
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {TECHNOLOGY_OPTIONS.map((option) => (
              <RadioPill
                key={option.value}
                name="technology"
                value={option.value}
                label={option.label}
                required
              />
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className={FIELD_LABEL_CLASS}>Number of Participants</span>
            <input
              type="number"
              name="participants"
              min={1}
              max={9999}
              inputMode="numeric"
              placeholder="e.g. 12"
              className={INPUT_BASE}
            />
          </label>
          <label className="block space-y-1.5">
            <span className={FIELD_LABEL_CLASS}>Preferred Dates</span>
            <input
              type="text"
              name="preferredDates"
              maxLength={160}
              placeholder="e.g. 15 – 19 July or Weekends in August"
              className={INPUT_BASE}
            />
          </label>
        </div>

        <fieldset className="space-y-2.5">
          <legend className={FIELD_LABEL_CLASS}>Training Mode</legend>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {MODE_OPTIONS.map((option) => (
              <RadioPill
                key={option.value}
                name="mode"
                value={option.value}
                label={option.label}
              />
            ))}
          </div>
        </fieldset>

        <label className="block space-y-1.5">
          <span className={FIELD_LABEL_CLASS}>
            Training Requirement Details
            <RequiredMark />
          </span>
          <textarea
            name="details"
            required
            minLength={20}
            maxLength={6000}
            rows={5}
            placeholder="Audience profile, learning objectives, depth (beginner / intermediate / advanced), preferred duration, and any specific topics or modules to cover."
            className={`${INPUT_BASE} min-h-32 resize-y leading-relaxed`}
          />
        </label>
      </FieldGroup>

      <FormSubmitFooter
        sectionRef={submitSectionRef}
        status={state.status}
        message={state.message}
        helperText="We will match you with experienced PLM trainers and respond shortly."
        submitLabel="Request Training"
        loadingText="Submitting..."
      />
    </form>
  );
}
