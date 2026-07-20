"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { updateProjectAction } from "@/app/(app)/actions";
import { PROJECT_DURATION_OPTIONS, PROJECT_ENGAGEMENT_OPTIONS } from "@/config/constants";
import { ProjectAttachmentField } from "./project-attachment-field";

type ProjectUpdateFormProps = {
  project: {
    id: number;
    title: string;
    description: string;
    budget_currency: string | null;
    budget_min: number | null;
    budget_max: number | null;
    duration: string | null;
    engagement_type: string | null;
    attachment_path: string | null;
  };
};

type ProjectFormState = {
  title: string;
  description: string;
  budget_min: string;
  budget_max: string;
  duration: string;
  engagement_type: string;
  attachment_path: string | null;
};

const inputClass =
  "w-full rounded-lg border border-border bg-white px-2 py-1.5 text-xs outline-none focus:border-indigo-500";
const labelClass = "mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-indigo-700";

function snapshotFromProject(project: ProjectUpdateFormProps["project"]): ProjectFormState {
  return {
    title: project.title,
    description: project.description,
    budget_min: project.budget_min != null ? String(project.budget_min) : "",
    budget_max: project.budget_max != null ? String(project.budget_max) : "",
    duration: project.duration ?? "",
    engagement_type: project.engagement_type ?? "",
    attachment_path: project.attachment_path,
  };
}

function projectFormStatesEqual(a: ProjectFormState, b: ProjectFormState): boolean {
  return (
    a.title === b.title &&
    a.description === b.description &&
    a.budget_min === b.budget_min &&
    a.budget_max === b.budget_max &&
    a.duration === b.duration &&
    a.engagement_type === b.engagement_type &&
    (a.attachment_path ?? "") === (b.attachment_path ?? "")
  );
}

export function ProjectUpdateForm({ project }: ProjectUpdateFormProps) {
  const baseline = useMemo(() => snapshotFromProject(project), [project]);
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState(baseline);
  const [isUploading, setIsUploading] = useState(false);

  const isDirty = !projectFormStatesEqual(values, baseline);

  useEffect(() => {
    setValues(baseline);
    setIsEditing(false);
  }, [baseline]);

  function startEditing() {
    setValues(baseline);
    setIsEditing(true);
  }

  function cancelEditing() {
    setValues(baseline);
    setIsEditing(false);
  }

  if (!isEditing) {
    return (
      <div className="mt-3">
        <Button type="button" size="sm" variant="subtle" onClick={startEditing}>
          Edit Project
        </Button>
      </div>
    );
  }

  return (
    <form action={updateProjectAction} className="mt-3 grid gap-2 md:grid-cols-4">
      <input type="hidden" name="project_id" value={project.id} />
      <input type="hidden" name="budget_currency" value="USD" />
      <input type="hidden" name="attachment_path" value={values.attachment_path ?? ""} />

      <div className="md:col-span-2">
        <label className={labelClass}>Title *</label>
        <input
          name="title"
          required
          value={values.title}
          onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Duration *</label>
        <select
          name="duration"
          required
          value={values.duration}
          onChange={(event) => setValues((prev) => ({ ...prev, duration: event.target.value }))}
          className={inputClass}
        >
          <option value="">Select duration</option>
          {PROJECT_DURATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Engagement *</label>
        <select
          name="engagement_type"
          required
          value={values.engagement_type}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, engagement_type: event.target.value }))
          }
          className={inputClass}
        >
          <option value="">Select type</option>
          {PROJECT_ENGAGEMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Min budget (USD) *</label>
        <input
          name="budget_min"
          type="number"
          min={0}
          required
          value={values.budget_min}
          onChange={(event) => setValues((prev) => ({ ...prev, budget_min: event.target.value }))}
          placeholder="Min"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Max budget (USD) *</label>
        <input
          name="budget_max"
          type="number"
          min={0}
          required
          value={values.budget_max}
          onChange={(event) => setValues((prev) => ({ ...prev, budget_max: event.target.value }))}
          placeholder="Max"
          className={inputClass}
        />
      </div>

      <div className="md:col-span-3">
        <label className={labelClass}>Description *</label>
        <textarea
          name="description"
          required
          value={values.description}
          onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
          className={`${inputClass} min-h-16`}
        />
      </div>

      <div className="space-y-2">
        <ProjectAttachmentField
          key={`${project.id}-${baseline.attachment_path ?? "none"}`}
          initialPath={baseline.attachment_path}
          onUploadingChange={setIsUploading}
          onPathChange={(path) => setValues((prev) => ({ ...prev, attachment_path: path }))}
          registerHiddenInput={false}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={cancelEditing}>
            Cancel
          </Button>
          {isDirty ? (
            <Button type="submit" size="sm" disabled={isUploading} loadingText="Saving...">
              {isUploading ? "Waiting for upload..." : "Save"}
            </Button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
