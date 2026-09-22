import type { ReactNode } from "react";
import { AvatarStack } from "./avatar-stack";
import { cn } from "@/lib/utils";

export interface TimelineItemProps {
  id?: string;
  title: string;
  time: string;
  dateTime?: string;
  description?: ReactNode;
  color?: string;
  avatar?: string;
  initials?: string;
}
export function TimelineItem({
  title,
  time,
  dateTime,
  description,
  color,
  avatar,
  initials,
}: TimelineItemProps) {
  return (
    <li className="group relative flex gap-3 pb-5 last:pb-0">
      <div className="flex w-9 shrink-0 flex-col items-center">
        {avatar ? (
          <AvatarStack
            members={[{ id: title, name: initials || title, image: avatar }]}
          />
        ) : initials ? (
          <span
            aria-label={initials}
            className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
          >
            {initials}
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="mt-1.5 size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: color ?? "var(--color-primary)" }}
          />
        )}
        <span
          aria-hidden="true"
          className="mt-1 w-px flex-1 bg-border group-last:hidden"
        />
      </div>
      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="m-0 break-words text-sm font-medium text-foreground">
            {title}
          </p>
          <time dateTime={dateTime} className="text-xs text-muted-foreground">
            {time}
          </time>
        </div>
        {description && (
          <div className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </div>
        )}
      </div>
    </li>
  );
}
export function Timeline({
  items,
  label = "Activity timeline",
  className,
  emptyMessage = "No activity yet.",
}: {
  items: readonly TimelineItemProps[];
  label?: string;
  className?: string;
  emptyMessage?: string;
}) {
  return items.length ? (
    <ol
      data-slot="timeline"
      aria-label={label}
      className={cn("m-0 list-none p-0", className)}
    >
      {items.map((item) => (
        <TimelineItem key={item.id ?? `${item.title}-${item.time}`} {...item} />
      ))}
    </ol>
  ) : (
    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  );
}
