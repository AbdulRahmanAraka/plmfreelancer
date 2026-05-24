import Link from "next/link";
import { cn } from "@/lib/utils";

export type FreelancerIntro = {
  userId: string;
  fullName: string;
  professionalTitle?: string | null;
  introduction?: string | null;
  profileImageUrl?: string | null;
};

type FreelancerIntroCardProps = {
  freelancer: FreelancerIntro;
  compact?: boolean;
  className?: string;
  linkable?: boolean;
};

export function FreelancerIntroCard({
  freelancer,
  compact,
  className,
  linkable = true,
}: FreelancerIntroCardProps) {
  const initial = (freelancer.fullName || "F").slice(0, 1).toUpperCase();
  const size = compact ? "h-12 w-12" : "h-16 w-16";
  const titleSize = compact ? "text-sm" : "text-base";

  const Wrapper: React.ElementType = linkable ? Link : "div";
  const wrapperProps = linkable
    ? { href: `/freelancers/${freelancer.userId}` }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-white px-3 py-2",
        linkable && "transition hover:border-indigo-300 hover:bg-indigo-50/40",
        className,
      )}
    >
      {freelancer.profileImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={freelancer.profileImageUrl}
          alt={freelancer.fullName}
          className={cn("shrink-0 rounded-full border border-border object-cover", size)}
        />
      ) : (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full border border-border bg-indigo-50 font-bold text-indigo-700",
            size,
            compact ? "text-base" : "text-lg",
          )}
        >
          {initial}
        </div>
      )}
      <div className="min-w-0 space-y-0.5">
        <p className={cn("truncate font-semibold text-indigo-950", titleSize)}>
          {freelancer.fullName || "Freelancer"}
        </p>
        {freelancer.professionalTitle ? (
          <p className="truncate text-xs font-medium text-indigo-700">
            {freelancer.professionalTitle}
          </p>
        ) : null}
        {freelancer.introduction && !compact ? (
          <p className="line-clamp-3 text-xs text-muted-foreground">
            {freelancer.introduction}
          </p>
        ) : null}
      </div>
    </Wrapper>
  );
}
