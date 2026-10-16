/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
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

const people = {
  mina: { name: "Maya Okafor", gradient: "from-sky-400 to-indigo-500" },
  orin: { name: "June Park", gradient: "from-amber-400 to-rose-500" },
  paz: { name: "Ines Duarte", gradient: "from-emerald-400 to-teal-500" },
};

function Avatar({ person }: { person: keyof typeof people }) {
  return (
    <span
      role="img"
      aria-label={people[person].name}
      className={`size-full bg-linear-to-br ${people[person].gradient}`}
    />
  );
}

const entries = [
  {
    person: "orin" as const,
    title: "Visitor route reviewed",
    time: "10:27 AM",
    dateTime: "2026-05-22T10:27",
    description:
      "The route is clear from the main entrance. Move the first directional sign closer to the ticket desk.",
  },
  {
    person: "paz" as const,
    title: "Signage copy agreed",
    time: "10:43 AM",
    dateTime: "2026-05-22T10:43",
    description:
      "Shortened the gallery labels and checked them against the venue accessibility guide.",
  },
  {
    person: "mina" as const,
    title: "Client review ready",
    time: "11:06 AM",
    dateTime: "2026-05-22T11:06",
    description:
      "Shared the updated map and signage set with the venue team for approval.",
  },
];

export default function TimelineActivityDemo() {
  return (
    <section className="flex w-full max-w-lg flex-col gap-5 rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="space-y-1">
        <p className="text-xs text-muted-foreground">Visitor experience</p>
        <h3 className="text-sm font-semibold tracking-tight">
          Arrival signage review
        </h3>
      </header>
      <Timeline>
        <TimelineItem>
          <TimelineRail>
            <TimelineMarker className="border-0">
              <Avatar person="mina" />
            </TimelineMarker>
            <TimelineConnector />
          </TimelineRail>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Wayfinding draft shared</TimelineTitle>
              <Badge
                variant="secondary"
                className="bg-sky-500/10 text-sky-700 dark:text-sky-400"
              >
                Review
              </Badge>
              <TimelineTime dateTime="2026-05-22T10:18">
                <span className="font-medium text-foreground/80">
                  Maya Okafor
                </span>{" "}
                10:18 AM
              </TimelineTime>
            </TimelineHeader>
            <div className="mt-1.5 flex gap-3 rounded-xl bg-muted/40 p-3 ring-1 ring-border/60 ring-inset">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-sky-100 to-indigo-200 ring-1 ring-border/60 ring-inset dark:from-sky-950 dark:to-indigo-900">
                <span className="absolute inset-x-3 top-4 h-1.5 rounded-full bg-white/70 dark:bg-white/20" />
                <span className="absolute inset-x-3 top-8 h-1.5 w-8 rounded-full bg-white/60 dark:bg-white/15" />
                <span className="absolute right-3 bottom-3 size-5 rounded-full bg-indigo-500/70" />
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <TimelineDescription>
                  The arrival map and first signage concepts are ready. Review
                  the main entrance, ticket desk, and gallery route together.
                </TimelineDescription>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline">Arrival map</Badge>
                  <Badge variant="outline">3 concepts</Badge>
                  <a href="#board">
                    <Badge variant="outline">
                      Open board <ArrowUpRight />
                    </Badge>
                  </a>
                </div>
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
        {entries.map((entry) => (
          <TimelineItem key={entry.title}>
            <TimelineRail>
              <TimelineMarker className="border-0">
                <Avatar person={entry.person} />
              </TimelineMarker>
              <TimelineConnector />
            </TimelineRail>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>{entry.title}</TimelineTitle>
                <TimelineTime dateTime={entry.dateTime}>
                  <span className="font-medium text-foreground/80">
                    {people[entry.person].name}
                  </span>{" "}
                  {entry.time}
                </TimelineTime>
              </TimelineHeader>
              <TimelineDescription>{entry.description}</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}
