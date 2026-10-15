"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
export interface TeamMember {
  id: string;
  name: string;
  image?: string;
}

// Initials take a stable tint from the theme's chart palette.
const tints = [
  "[--avatar-tint:var(--color-chart-1)]",
  "[--avatar-tint:var(--color-chart-2)]",
  "[--avatar-tint:var(--color-chart-3)]",
  "[--avatar-tint:var(--color-chart-4)]",
  "[--avatar-tint:var(--color-chart-5)]",
];
function tintFor(key: string) {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return tints[hash % tints.length];
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
      data-slot="avatar-stack"
      className={cn("flex items-center -space-x-2", className)}
      aria-label={members.map((member) => member.name).join(", ")}
    >
      {visible.map((member) => (
        <MemberAvatar key={member.id} member={member} />
      ))}
      {members.length > visible.length && (
        <span
          data-slot="avatar-stack-more"
          className="relative flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium tracking-tight text-muted-foreground tabular-nums shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
        >
          +{members.length - visible.length}
        </span>
      )}
    </div>
  );
}

function MemberAvatar({ member }: { member: TeamMember }) {
  const [failedImage, setFailedImage] = useState<string>();
  const initials = member.name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const showImage = member.image && member.image !== failedImage;
  return (
    <span
      role="img"
      aria-label={member.name}
      title={member.name}
      data-slot="avatar-stack-item"
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background text-xs font-semibold tracking-tight shadow-[0_1px_2px_rgb(0_0_0/0.06)] transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:ring-1 after:ring-foreground/10 after:ring-inset",
        showImage
          ? "bg-muted"
          : cn(
              tintFor(member.id || member.name),
              "bg-[color-mix(in_oklab,var(--avatar-tint)_16%,var(--color-card))] text-[color-mix(in_oklab,var(--avatar-tint)_72%,var(--color-foreground))]",
            ),
      )}
    >
      {showImage ? (
        <img
          src={member.image}
          alt=""
          className="size-full object-cover"
          onError={() => setFailedImage(member.image)}
        />
      ) : (
        initials || "?"
      )}
    </span>
  );
}
