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
    budget_min: number | null;
    budget_max: number | null;
    deadline: string | null;
    attachment_path: string | null;
  };
};

export function ProjectUpdateForm({ project }: ProjectUpdateFormProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <form action={updateProjectAction} className="mt-3 grid gap-2 md:grid-cols-4">
      <input type="hidden" name="project_id" value={project.id} />
      <input
        name="title"
        defaultValue={project.title}
        required
        className="rounded-lg border border-border px-2 py-1.5 text-xs outline-none focus:border-indigo-500 md:col-span-2"
      />
      <input
        name="budget_min"
        type="number"
        min={0}
        defaultValue={project.budget_min ?? ""}
        placeholder="Min"
        className="rounded-lg border border-border px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
      />
      <input
        name="budget_max"
        type="number"
        min={0}
        defaultValue={project.budget_max ?? ""}
        placeholder="Max"
        className="rounded-lg border border-border px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
      />
      <textarea
        name="description"
        required
        defaultValue={project.description}
        className="min-h-16 rounded-lg border border-border px-2 py-1.5 text-xs outline-none focus:border-indigo-500 md:col-span-3"
      />
      <div className="space-y-2">
        <input
          name="deadline"
          type="date"
          defaultValue={project.deadline ?? ""}
          className="w-full rounded-lg border border-border px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
        />
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
