"use client";

import { useEffect, useState } from "react";
import { adminUpdateProjectDateAction } from "@/app/(app)/actions";
import { Button } from "@/components/ui/button";

type AdminProjectDateFormProps = {
  projectId: number;
  createdAt: string;
};

function toDateInputValue(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function AdminProjectDateForm({ projectId, createdAt }: AdminProjectDateFormProps) {
  const baseline = toDateInputValue(createdAt);
  const [value, setValue] = useState(baseline);
  const isDirty = value !== baseline && value !== "";

  useEffect(() => {
    setValue(baseline);
  }, [baseline]);

  return (
    <form action={adminUpdateProjectDateAction} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="project_id" value={projectId} />
      <div>
        <label
          htmlFor={`project-date-${projectId}`}
          className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-indigo-700/70"
        >
          Project date
        </label>
        <input
          id={`project-date-${projectId}`}
          type="date"
          name="created_at"
          required
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="rounded-lg border border-border bg-white px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
        />
      </div>
      {isDirty ? (
        <Button type="submit" size="sm" loadingText="Saving...">
          Save date
        </Button>
      ) : null}
    </form>
  );
}
