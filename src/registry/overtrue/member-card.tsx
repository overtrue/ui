import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionCard } from "./section-card";
import { AvatarStack, type TeamMember } from "./avatar-stack";
import { DetailList } from "./detail-list";

export interface MemberCardProps {
  member: TeamMember;
  description?: string;
  badge?: ReactNode;
  details?: ComponentProps<typeof DetailList>["items"];
  action?: ReactNode;
  className?: string;
}
export function MemberCard({
  member,
  description,
  badge,
  details = [],
  action,
  className,
}: MemberCardProps) {
  return (
    <SectionCard data-slot="member-card" className={cn("shadow-none", className)}>
      <div className="flex items-center justify-between gap-3">
        <AvatarStack members={[member]} />
        {badge}
      </div>
      <h3 className="m-0 mt-4 break-words text-base font-semibold text-foreground">
        {member.name}
      </h3>
      {description && (
        <p className="m-0 mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
      {details.length > 0 && (
        <DetailList className="my-5 text-xs" items={details} />
      )}
      {action && <div className="mt-4">{action}</div>}
    </SectionCard>
  );
}
