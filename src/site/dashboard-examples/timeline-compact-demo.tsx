/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import {
  IconCircleCheck as CircleCheck,
  IconCreditCard as CreditCard,
  IconFileText as FileText,
  IconShieldExclamation as ShieldAlert,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
  TimelineMarker,
  TimelineRail,
  TimelineTime,
  TimelineTitle,
} from "@/registry/overtrue/event-timeline";

const events = [
  {
    icon: ShieldAlert,
    title: "Invoice query opened",
    time: "Mar 6, 10:34 AM",
    dateTime: "2026-03-06T10:34",
    description:
      "The client asked for a purchase order reference. Finance will confirm it before the next payment run.",
    className: "text-amber-700 dark:text-amber-400",
  },
  {
    icon: CreditCard,
    title: "Deposit received",
    time: "Mar 6, 10:21 AM",
    dateTime: "2026-03-06T10:21",
    className: "text-emerald-700 dark:text-emerald-400",
  },
  {
    icon: CircleCheck,
    title: "Deposit approved",
    time: "Mar 6, 10:21 AM",
    dateTime: "2026-03-06T10:21",
  },
  {
    icon: FileText,
    title: "Invoice issued",
    time: "Mar 6, 10:20 AM",
    dateTime: "2026-03-06T10:20",
  },
];

export default function TimelineCompactDemo() {
  return (
    <section className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="mb-4 flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-semibold tracking-tight">
          Invoice INV-2041
        </h3>
        <span className="font-mono text-xs text-muted-foreground">
          $4,800.00
        </span>
      </header>
      <Timeline>
        {events.map((event) => (
          <TimelineItem key={event.title} className="gap-2">
            <TimelineRail className="w-5">
              <TimelineMarker className={cn("size-5", event.className)}>
                <event.icon />
              </TimelineMarker>
              <TimelineConnector className="my-0.5" />
            </TimelineRail>
            <TimelineContent className="gap-0.5 pt-0 pb-3">
              <TimelineHeader>
                <TimelineTitle>{event.title}</TimelineTitle>
                <TimelineTime dateTime={event.dateTime}>
                  {event.time}
                </TimelineTime>
              </TimelineHeader>
              {event.description ? (
                <TimelineDescription>{event.description}</TimelineDescription>
              ) : null}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}
