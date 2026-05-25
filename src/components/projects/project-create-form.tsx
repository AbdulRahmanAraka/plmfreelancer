"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createProjectAction } from "@/app/(app)/actions";
import { ProjectAttachmentField } from "./project-attachment-field";

const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-indigo-700";
const inputClass =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500";
const required = <span className="text-rose-500">*</span>;

export function ProjectCreateForm() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <form action={createProjectAction} className="grid gap-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className={labelClass}>
          Project title {required}
        </label>
        <input
          name="title"
          required
          placeholder="e.g. Migrate BOM from Windchill to Teamcenter"
          className={inputClass}
        />
      </div>

      <div className="md:col-span-2">
        <label className={labelClass}>
          Project description {required}
        </label>
        <textarea
          name="description"
          placeholder="Describe scope, deliverables, integrations, current PLM, etc."
          required
          className={`${inputClass} min-h-28`}
        />
      </div>

      <div>
        <label className={labelClass}>
          Budget type {required}
        </label>
        <select name="budget_type" required className={inputClass}>
          <option value="">Select budget type</option>
          <option value="hourly">Hourly</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>
          Currency {required}
        </label>
        <select name="budget_currency" required defaultValue="INR" className={inputClass}>
          <option value="INR">Rupees (INR) ₹</option>
          <option value="USD">Dollars (USD) $</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>
          Min budget {required}
        </label>
        <input
          name="budget_min"
          type="number"
          min={0}
          required
          placeholder="e.g. 10000"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Max budget {required}
        </label>
        <input
          name="budget_max"
          type="number"
          min={0}
          required
          placeholder="e.g. 50000"
          className={inputClass}
        />
      </div>

      <div className="md:col-span-2">
        <label className={labelClass}>
          Deadline {required}
        </label>
        <input
          name="deadline"
          type="date"
          required
          className={inputClass}
        />
      </div>

      <div className="md:col-span-2">
        <ProjectAttachmentField onUploadingChange={setIsUploading} />
      </div>
      <SubmitButton disabledExtra={isUploading} />
    </form>
  );
}

function SubmitButton({ disabledExtra }: { disabledExtra: boolean }) {
  const { pending } = useFormStatus();
  const disabled = pending || disabledExtra;
  return (
    <button
      type="submit"
      disabled={disabled}
      className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
    >
      {pending ? "Creating..." : disabledExtra ? "Waiting for upload..." : "Create Project"}
    </button>
  );
}
