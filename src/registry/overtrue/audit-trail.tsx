import { useId, type ReactNode } from "react";
import {
  IconChevronRight,
  IconActivity,
  IconCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target?: string;
  time: string;
  dateTime?: string;
  image?: string;
  outcome?: "success" | "warning" | "neutral";
  context?: ReactNode;
  changes?: readonly { field: string; before: string; after: string }[];
}

export function AuditTrail({
  events,
  label = "Activity history",
  className,
}: {
  events: readonly AuditEvent[];
  label?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div
      data-slot="audit-trail"
      className={cn("min-w-0 text-foreground", className)}
    >
      <ol aria-label={label} className="m-0 list-none p-0">
        {events.map((event, index) => {
          const Icon =
            event.outcome === "warning"
              ? IconAlertTriangle
              : event.outcome === "success"
                ? IconCheck
                : IconActivity;
          return (
            <li
              key={event.id}
              data-slot="audit-event"
              className="relative flex gap-3 pb-5 last:pb-0"
            >
              {index < events.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute start-[15px] top-9 bottom-1 w-px bg-border"
                />
              )}
              <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-muted-foreground">
                {event.image ? (
                  <img
                    src={event.image}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <Icon size={15} stroke={1.5} aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="m-0 text-sm leading-5 [overflow-wrap:anywhere]">
                    <strong className="font-medium">{event.actor}</strong>{" "}
                    <span className="text-muted-foreground">
                      {event.action}
                    </span>
                    {event.target && (
                      <>
                        {" "}
                        <span className="font-medium">{event.target}</span>
                      </>
                    )}
                  </p>
                  <time
                    dateTime={event.dateTime}
                    className="shrink-0 text-[11px] text-muted-foreground"
                  >
                    {event.time}
                  </time>
                </div>
                {event.context && (
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">
                    {event.context}
                  </div>
                )}
                {event.changes?.length ? (
                  <details className="group/audit mt-2 rounded-lg border border-border bg-card">
                    <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                      <IconChevronRight
                        className="size-3.5 transition-transform group-open/audit:rotate-90"
                        aria-hidden="true"
                      />
                      {event.changes.length}{" "}
                      {event.changes.length === 1 ? "change" : "changes"}
                      <span className="sr-only"> in {event.id}</span>
                    </summary>
                    <dl
                      aria-label={`Changes in ${event.id}`}
                      className="m-0 border-t border-border px-3 py-1"
                    >
                      {event.changes.map((change, changeIndex) => (
                        <div
                          key={`${id}-${index}-${changeIndex}`}
                          className="grid gap-1 border-b border-border py-2 text-xs last:border-0 sm:grid-cols-[100px_minmax(0,1fr)]"
                        >
                          <dt className="font-medium">{change.field}</dt>
                          <dd className="m-0 flex min-w-0 flex-wrap gap-x-2 gap-y-1 [overflow-wrap:anywhere]">
                            <span className="text-muted-foreground line-through">
                              {change.before || "Empty"}
                            </span>
                            <span aria-hidden="true">→</span>
                            <span className="sr-only">changed to</span>
                            <span>{change.after || "Empty"}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
      {!events.length && (
        <p className="m-0 py-8 text-center text-sm text-muted-foreground">
          No activity to show.
        </p>
      )}
    </div>
  );
}
