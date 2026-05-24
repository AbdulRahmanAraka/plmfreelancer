import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

const byVariant: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 shadow-[0_6px_18px_rgba(13,70,217,0.25)]",
  secondary: "bg-white text-foreground border border-border hover:bg-indigo-50",
  ghost: "bg-transparent text-foreground hover:bg-indigo-100/70",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition",
        byVariant[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
