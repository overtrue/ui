/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { IconX as X } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const versions = [
  {
    version: "v8",
    badge: "Draft",
    badgeClassName: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
    status: "current" as const,
    description:
      "Added the arrival map, review owners, and final file requirements.",
    author: "Maya Okafor",
    gradient: "from-sky-400 to-indigo-500",
    time: "Current",
  },
  {
    version: "v7",
    badge: "Live",
    badgeClassName: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    markerClassName: "border-emerald-500",
    description: "Shared the approved visitor route with the venue team.",
    author: "Nora Jensen",
    gradient: "from-emerald-400 to-teal-500",
    time: "May 22, 2026, 11:18 AM",
    dateTime: "2026-05-22T11:18",
  },
  {
    version: "v6",
    description:
      "Included an accessible entrance route and simplified the gallery labels.",
    author: "Leo Nakamura",
    gradient: "from-amber-400 to-rose-500",
    time: "May 21, 2026, 04:42 PM",
    dateTime: "2026-05-21T16:42",
  },
  {
    version: "v5",
    description: "Revised the signage dimensions after the first site visit.",
    author: "Maya Okafor",
    gradient: "from-sky-400 to-indigo-500",
    time: "May 20, 2026, 09:06 AM",
    dateTime: "2026-05-20T09:06",
  },
];

export default function TimelineVersionsDemo() {
  return (
    <Card className="w-full max-w-sm gap-4 py-4">
      <CardHeader className="flex items-center px-4">
        <CardTitle> Brief revisions </CardTitle>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground ml-auto rounded-full"
          aria-label="Close"
        >
          <X />
        </Button>
      </CardHeader>
      <CardContent className="px-4">
        <Timeline>
          {versions.map((item) => (
            <TimelineItem key={item.version} status={item.status}>
              <TimelineRail>
                <TimelineMarker className={item.markerClassName} />
                <TimelineConnector />
              </TimelineRail>
              <TimelineContent className="gap-1.5">
                <TimelineHeader>
                  <TimelineTitle>{item.version}</TimelineTitle>
                  {item.badge ? (
                    <Badge variant="secondary" className={item.badgeClassName}>
                      {item.badge}
                    </Badge>
                  ) : null}
                </TimelineHeader>
                <TimelineDescription>{item.description}</TimelineDescription>
                <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span
                    aria-hidden="true"
                    className={`size-4 rounded-full bg-linear-to-br ${item.gradient}`}
                  />
                  <span className="text-foreground/80">{item.author}</span>
                  <span aria-hidden="true">·</span>
                  <TimelineTime dateTime={item.dateTime} className="ml-0">
                    {item.time}
                  </TimelineTime>
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
