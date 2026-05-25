"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updateProjectAction } from "@/app/(app)/actions";
import { ProjectAttachmentField } from "./project-attachment-field";

type ProjectUpdateFormProps = {
  project: {
    id: number;
    title: string;
    description: string;
    budget_currency: string | null;
    budget_min: number | null;
    budget_max: number | null;
    deadline: string | null;
    attachment_path: string | null;
  };
};

const inputClass =
  "w-full rounded-lg border border-border bg-white px-2 py-1.5 text-xs outline-none focus:border-indigo-500";
const labelClass = "mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-indigo-700";

export function ProjectUpdateForm({ project }: ProjectUpdateFormProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <form action={updateProjectAction} className="mt-3 grid gap-2 md:grid-cols-4">
      <input type="hidden" name="project_id" value={project.id} />

      <div className="md:col-span-2">
        <label className={labelClass}>Title *</label>
        <input
          name="title"
          defaultValue={project.title}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Currency *</label>
        <select
          name="budget_currency"
          required
          defaultValue={project.budget_currency ?? "INR"}
          className={inputClass}
        >
          <option value="INR">INR ₹</option>
          <option value="USD">USD $</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Deadline *</label>
        <input
          name="deadline"
          type="date"
          required
          defaultValue={project.deadline ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Min budget *</label>
        <input
          name="budget_min"
          type="number"
          min={0}
          required
          defaultValue={project.budget_min ?? ""}
          placeholder="Min"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Max budget *</label>
        <input
          name="budget_max"
          type="number"
          min={0}
          required
          defaultValue={project.budget_max ?? ""}
          placeholder="Max"
          className={inputClass}
        />
      </div>

      <div className="md:col-span-3">
        <label className={labelClass}>Description *</label>
        <textarea
          name="description"
          required
          defaultValue={project.description}
          className={`${inputClass} min-h-16`}
        />
      </div>

      <div className="space-y-2">
        <ProjectAttachmentField
          initialPath={project.attachment_path}
          onUploadingChange={setIsUploading}
        />
        <SubmitButton disabledExtra={isUploading} />
      </div>
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
      className="w-full rounded-lg bg-primary px-2 py-1.5 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : disabledExtra ? "Waiting for upload..." : "Save"}
    </button>
  );
}
