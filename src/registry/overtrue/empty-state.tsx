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
    <div className="flex flex-col items-center rounded-lg border border-dashed bg-card px-6 py-12 text-center">
      <span className="mb-5 flex size-12 items-center justify-center rounded-xl border bg-background text-muted-foreground">
        {icon ?? <Inbox className="size-5" />}
      </span>
      <h3 className="text-base font-semibold text-card-foreground">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
