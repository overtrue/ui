import type { CSSProperties, ReactNode } from "react";
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
  const dot = color ?? "var(--color-primary)";
  return (
    <li
      data-slot="timeline-item"
      className="group relative flex gap-3 pb-5 last:pb-0 motion-safe:animate-[timeline-item-in_520ms_cubic-bezier(0.22,1,0.36,1)_backwards]"
    >
      <style href="overtrue-timeline" precedence="default">
        {`@keyframes timeline-item-in{from{opacity:0;transform:translateY(4px)}}`}
      </style>
      <div className="flex w-9 shrink-0 flex-col items-center">
        {avatar ? (
          <AvatarStack
            members={[{ id: title, name: initials || title, image: avatar }]}
          />
        ) : initials ? (
          <span
            aria-label={initials}
            className="flex size-9 items-center justify-center rounded-full bg-muted text-[11px] font-semibold tracking-wide text-muted-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_8%,transparent)] dark:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_10%,transparent),inset_0_1px_0_rgb(255_255_255/0.06)]"
          >
            {initials}
          </span>
        ) : (
          <span
            aria-hidden="true"
            data-slot="timeline-marker"
            className="relative mt-1.5 size-2.5 shrink-0 rounded-full shadow-[0_0_0_4px_color-mix(in_oklab,var(--timeline-dot)_16%,transparent)] dark:shadow-[0_0_0_4px_color-mix(in_oklab,var(--timeline-dot)_18%,transparent),0_0_10px_color-mix(in_oklab,var(--timeline-dot)_55%,transparent)]"
            style={
              {
                backgroundColor: dot,
                "--timeline-dot": dot,
              } as CSSProperties
            }
          />
        )}
        <span
          aria-hidden="true"
          data-slot="timeline-connector"
          className="mt-2 w-px flex-1 bg-linear-to-b from-border to-border/50 group-last:hidden"
        />
      </div>
      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="m-0 text-sm font-medium tracking-tight break-words text-foreground">
            {title}
          </p>
          <time
            dateTime={dateTime}
            className="text-xs whitespace-nowrap text-muted-foreground tabular-nums"
          >
            {time}
          </time>
        </div>
        {description && (
          <div className="mt-1 text-[13px] leading-5 text-muted-foreground">
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
      className={cn(
        "m-0 list-none p-0",
        // Items arrive one after another, top to bottom.
        "[&>li:nth-child(2)]:[animation-delay:50ms] [&>li:nth-child(3)]:[animation-delay:100ms] [&>li:nth-child(4)]:[animation-delay:150ms] [&>li:nth-child(5)]:[animation-delay:200ms] [&>li:nth-child(n+6)]:[animation-delay:250ms]",
        className,
      )}
    >
      {items.map((item) => (
        <TimelineItem key={item.id ?? `${item.title}-${item.time}`} {...item} />
      ))}
    </ol>
  ) : (
    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  );
}
