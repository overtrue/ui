import type { ReactNode } from "react";
import { IconInbox as Inbox } from "@tabler/icons-react";
export function EmptyState({
  title = "A clean slate.",
  description = "Your projects will appear here. Create your first one to get started.",
  action,
  icon,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div
      data-slot="empty-state"
      className="flex flex-col items-center overflow-hidden rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center"
    >
      <div
        data-slot="empty-state-icon"
        className="mb-5 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground [&_svg]:size-5"
      >
        {icon ?? <Inbox className="size-5" stroke={1.75} />}
      </div>
      <h3 className="m-0 text-base font-semibold tracking-tight text-card-foreground">
        {title}
      </h3>
      <p className="m-0 mt-1.5 max-w-xs text-sm leading-6 text-pretty text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
