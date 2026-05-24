import { cn } from "@/lib/utils";

export type EnhancementMessage = {
  id: number;
  kind: "request" | "reply" | "resubmit" | string;
  description: string;
  created_at: string;
  author_id: string;
  authorName?: string | null;
  authorRoleLabel?: "Client" | "Freelancer" | "Admin" | string;
};

const kindStyles: Record<string, { label: string; className: string }> = {
  request: {
    label: "Enhancement requested",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  resubmit: {
    label: "Re-submitted for review",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  reply: {
    label: "Reply",
    className: "border-indigo-200 bg-indigo-50 text-indigo-800",
  },
};

function formatTimestamp(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export function EnhancementThread({
  messages,
  currentUserId,
  emptyLabel = "No enhancement requests yet.",
  className,
}: {
  messages: EnhancementMessage[];
  currentUserId: string;
  emptyLabel?: string;
  className?: string;
}) {
  if (messages.length === 0) {
    return (
      <p className={cn("text-xs text-muted-foreground", className)}>{emptyLabel}</p>
    );
  }

  return (
    <ol className={cn("space-y-2", className)}>
      {messages.map((message) => {
        const style = kindStyles[message.kind] ?? kindStyles.reply;
        const isMine = message.author_id === currentUserId;
        return (
          <li
            key={message.id}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs",
              style.className,
              isMine ? "ml-auto max-w-[85%]" : "mr-auto max-w-[85%]",
            )}
          >
            <div className="mb-1 flex items-center justify-between gap-2 text-[10px] uppercase tracking-wide">
              <span className="font-semibold">
                {style.label}
                {message.authorRoleLabel ? ` \u00b7 ${message.authorRoleLabel}` : ""}
                {message.authorName ? ` \u00b7 ${message.authorName}` : ""}
              </span>
              <time>{formatTimestamp(message.created_at)}</time>
            </div>
            <p className="whitespace-pre-wrap text-sm text-slate-800">
              {message.description}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
