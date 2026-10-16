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
      className="relative isolate flex flex-col items-center overflow-hidden rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center"
    >
      {/* A faint light from above keeps the empty surface from feeling dead. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-[radial-gradient(55%_100%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_7%,transparent),transparent)]"
      />
      <div
        data-slot="empty-state-icon"
        className="relative mb-5 flex size-12 items-center justify-center"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-52 -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] delay-75 duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] [mask-composite:intersect] [mask-image:radial-gradient(closest-side,#000_45%,transparent),linear-gradient(#000_40%,transparent_66%)] motion-safe:starting:scale-75 motion-safe:starting:opacity-0 motion-reduce:transition-none"
        >
          <span className="absolute inset-0 rounded-full border border-border/70" />
          <span className="absolute inset-[18%] rounded-full border border-border/80" />
          <span className="absolute inset-[34%] rounded-full border border-border" />
        </span>
        <span className="flex size-12 items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_20px_-10px_rgb(0_0_0/0.18)] transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:starting:translate-y-1.5 motion-safe:starting:opacity-0 motion-reduce:transition-none dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_1px_2px_rgb(0_0_0/0.5),0_8px_20px_-10px_rgb(0_0_0/0.6)] [&_svg]:size-5">
          {icon ?? <Inbox className="size-5" stroke={1.75} />}
        </span>
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
