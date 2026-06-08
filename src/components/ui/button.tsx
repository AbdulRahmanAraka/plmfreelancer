"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "success"
  | "warning"
  | "subtle"
  | "softDestructive"
  | "softSuccess"
  | "softWarning";

type Size = "xs" | "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  /**
   * Force the loading state. When omitted and `type="submit"`, the button
   * automatically reflects the closest `<form action>` pending state via
   * React's `useFormStatus`, so users can never click the same submit twice.
   */
  loading?: boolean;
  /** Replacement label shown next to the spinner while loading. */
  loadingText?: string;
  children: ReactNode;
};

const byVariant: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 shadow-[0_6px_18px_rgba(13,70,217,0.25)] focus-visible:ring-indigo-500",
  secondary:
    "bg-white text-foreground border border-border hover:bg-indigo-50 focus-visible:ring-indigo-300",
  ghost:
    "bg-transparent text-foreground hover:bg-indigo-100/70 focus-visible:ring-indigo-300",
  destructive:
    "bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus-visible:ring-rose-400",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm focus-visible:ring-emerald-400",
  warning:
    "bg-amber-500 text-white hover:bg-amber-600 shadow-sm focus-visible:ring-amber-400",
  subtle:
    "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 focus-visible:ring-indigo-300",
  softDestructive:
    "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 focus-visible:ring-rose-300",
  softSuccess:
    "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 focus-visible:ring-emerald-300",
  softWarning:
    "bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 focus-visible:ring-amber-300",
};

const bySize: Record<Size, string> = {
  xs: "min-h-7 gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
  sm: "min-h-8 gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold",
  md: "min-h-10 gap-2 rounded-xl px-4 py-2 text-sm font-medium",
  lg: "min-h-12 gap-2 rounded-xl px-5 py-2.5 text-base font-semibold",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  loadingText,
  className,
  children,
  type = "button",
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  // Always called so React keeps stable hook order. Returns
  // `{ pending: false }` outside of any pending form action.
  const { pending } = useFormStatus();

  const isFormPending = type === "submit" && pending;
  const isLoading = loading ?? isFormPending;
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      data-loading={isLoading || undefined}
      onClick={(event) => {
        if (isDisabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
      }}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap outline-none transition select-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:cursor-not-allowed disabled:opacity-60",
        bySize[size],
        byVariant[variant],
        className,
      )}
      {...props}
    >
      {isLoading ? <Spinner /> : null}
      {isLoading && loadingText ? <span>{loadingText}</span> : children}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 shrink-0 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
