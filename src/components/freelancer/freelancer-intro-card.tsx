import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProfileAvatar } from "@/components/ui/profile-avatar";

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
  const titleSize = compact ? "text-sm" : "text-base";
  const avatarSize = compact ? 48 : 64;

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
      <ProfileAvatar
        src={freelancer.profileImageUrl}
        alt={freelancer.fullName || "Freelancer"}
        size={avatarSize}
        fallbackFontSize={compact ? 16 : 18}
      />
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
