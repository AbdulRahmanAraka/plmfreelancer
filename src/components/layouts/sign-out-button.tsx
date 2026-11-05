"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { signOutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton({ appearance = "button" }: { appearance?: "button" | "menu" }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const confirm = () => {
    startTransition(() => {
      signOutAction();
    });
  };

  return (
    <>
      {appearance === "menu" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-50"
        >
          Sign out
        </button>
      ) : (
        <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
          Sign Out
        </Button>
      )}

      {open
        ? createPortal(
        <div
          data-signout-dialog=""
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signout-title"
          onClick={() => {
            if (!pending) setOpen(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-white p-5 shadow-xl"
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="signout-title" className="text-base font-semibold text-foreground">
                  Sign out?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Do you want to logout from your account?
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
                No
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="md"
                loading={pending}
                loadingText="Signing out..."
                onClick={confirm}
              >
                Yes, sign out
              </Button>
            </div>
          </div>
        </div>,
        document.body,
      )
        : null}
    </>
  );
}
