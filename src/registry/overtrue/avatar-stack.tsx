"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
export interface TeamMember {
  id: string;
  name: string;
  image?: string;
}
export function AvatarStack({
  members,
  max = 4,
  className,
}: {
  members: TeamMember[];
  max?: number;
  className?: string;
}) {
  const visible = members.slice(0, Math.max(0, max));
  return (
    <div
      className={cn("flex items-center -space-x-2", className)}
      aria-label={members.map((member) => member.name).join(", ")}
    >
      {visible.map((member) => <MemberAvatar key={member.id} member={member} />)}
      {members.length > visible.length && (
        <span className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary/10 text-xs font-medium text-primary">
          +{members.length - visible.length}
        </span>
      )}
    </div>
  );
}

function MemberAvatar({ member }: { member: TeamMember }) {
  const [failedImage, setFailedImage] = useState<string>();
  const initials = member.name.trim().split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span role="img" aria-label={member.name} title={member.name} className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground">
      {member.image && member.image !== failedImage ? (
        <img src={member.image} alt="" className="size-full object-cover" onError={() => setFailedImage(member.image)} />
      ) : initials || "?"}
    </span>
  );
}
