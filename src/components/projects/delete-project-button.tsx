"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteProjectAction } from "@/app/(app)/actions";
import { Button } from "@/components/ui/button";

type DeleteProjectButtonProps = {
  projectId: number;
  projectTitle: string;
};

/**
 * Two-step delete: clicking the trigger opens a confirmation modal so the
 * client can never lose a project to a misclick. While the server action is
 * running, both modal buttons disable themselves and the dimmer ignores
 * outside-clicks/escape so the action cannot be interrupted mid-flight.
 */
export function DeleteProjectButton({ projectId, projectTitle }: DeleteProjectButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending]);

  const confirm = () => {
    const formData = new FormData();
    formData.set("project_id", String(projectId));
    startTransition(() => {
      deleteProjectAction(formData);
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="softDestructive"
        size="xs"
        onClick={() => setOpen(true)}
      >
        Delete Project
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-project-title"
          onClick={() => {
            if (!pending) setOpen(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6 18 20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="delete-project-title" className="text-base font-semibold text-indigo-950">
                  Delete this project?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  You are about to permanently delete{" "}
                  <span className="font-semibold text-indigo-900">
                    &ldquo;{projectTitle}&rdquo;
                  </span>
                  . This will also remove its applications, attachments, and
                  revision history. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                disabled={pending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="md"
                loading={pending}
                loadingText="Deleting..."
                onClick={confirm}
              >
                Yes, delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
