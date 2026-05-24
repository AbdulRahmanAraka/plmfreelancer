import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function Card({ title, description, className, children }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(10,34,120,0.08)]",
        className,
      )}
    >
      {(title || description) && (
        <header className="mb-5 space-y-1">
          {title ? <h2 className="text-lg font-semibold text-card-foreground">{title}</h2> : null}
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </header>
      )}
      {children}
    </section>
  );
}
