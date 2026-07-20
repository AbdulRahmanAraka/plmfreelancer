"use client";

import { useTransition } from "react";
import { toggleProjectActiveAction } from "@/app/(app)/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProjectActiveToggleProps = {
  projectId: number;
  isActive: boolean;
};

export function ProjectActiveToggle({ projectId, isActive }: ProjectActiveToggleProps) {
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    const formData = new FormData();
    formData.set("project_id", String(projectId));
    formData.set("is_active", isActive ? "false" : "true");
    startTransition(() => {
      toggleProjectActiveAction(formData);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
          isActive
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-slate-100 text-slate-600 ring-slate-200",
        )}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
      <Button
        type="button"
        size="xs"
        variant={isActive ? "softWarning" : "softSuccess"}
        loading={pending}
        loadingText={isActive ? "Deactivating..." : "Activating..."}
        onClick={handleToggle}
      >
        {isActive ? "Mark Inactive" : "Mark Active"}
      </Button>
    </div>
  );
}
