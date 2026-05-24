"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createProjectAction } from "@/app/(app)/actions";
import { ProjectAttachmentField } from "./project-attachment-field";

export function ProjectCreateForm() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <form action={createProjectAction} className="grid gap-3 md:grid-cols-2">
      <input
        name="title"
        placeholder="Project title"
        required
        className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500 md:col-span-2"
      />
      <textarea
        name="description"
        placeholder="Project description"
        required
        className="min-h-28 rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500 md:col-span-2"
      />
      <select
        name="budget_type"
        className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
      >
        <option value="">Budget Type</option>
        <option value="hourly">Hourly</option>
        <option value="fixed">Fixed</option>
      </select>
      <input
        name="deadline"
        type="date"
        className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
      />
      <input
        name="budget_min"
        type="number"
        min={0}
        placeholder="Min budget"
        className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
      />
      <input
        name="budget_max"
        type="number"
        min={0}
        placeholder="Max budget"
        className="rounded-xl border border-border px-3 py-2 outline-none focus:border-indigo-500"
      />
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
