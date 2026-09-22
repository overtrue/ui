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

export default function TimelineActivityDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-muted-foreground text-xs">
          {" "}
          Visitor experience{" "}
        </span>
        <span className="font-semibold"> Arrival signage review </span>
      </div>
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
              <TimelineTitle> Wayfinding draft shared </TimelineTitle>
              <Badge
                variant="secondary"
                className="bg-sky-500/10 text-sky-700 dark:text-sky-400"
              >
                Review
              </Badge>
              <TimelineTime dateTime="2026-05-22T10:18">
                <span className="text-foreground/80 font-medium">
                  {" "}
                  Maya Okafor{" "}
                </span>{" "}
                10:18 AM
              </TimelineTime>
            </TimelineHeader>
            <div className="bg-card mt-1 flex gap-3 rounded-lg border p-3">
              <div className="bg-muted size-20 shrink-0 rounded-md" />
              <div className="flex flex-col gap-2">
                <TimelineDescription>
                  The arrival map and first signage concepts are ready. Review
                  the main entrance, ticket desk, and gallery route
                  together.{" "}
                </TimelineDescription>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline"> Arrival map </Badge>
                  <Badge variant="outline"> 3 concepts </Badge>
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
        <TimelineItem>
          <TimelineRail>
            <TimelineMarker className="border-0">
              <Avatar person="orin" />
            </TimelineMarker>
            <TimelineConnector />
          </TimelineRail>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle> Visitor route reviewed </TimelineTitle>
              <TimelineTime dateTime="2026-05-22T10:27">
                <span className="text-foreground/80 font-medium">
                  June Park{" "}
                </span>{" "}
                10:27 AM
              </TimelineTime>
            </TimelineHeader>
            <TimelineDescription>
              The route is clear from the main entrance. Move the first
              directional sign closer to the ticket desk.{" "}
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineRail>
            <TimelineMarker className="border-0">
              <Avatar person="paz" />
            </TimelineMarker>
            <TimelineConnector />
          </TimelineRail>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle> Signage copy agreed </TimelineTitle>
              <TimelineTime dateTime="2026-05-22T10:43">
                <span className="text-foreground/80 font-medium">
                  {" "}
                  Ines Duarte{" "}
                </span>{" "}
                10:43 AM
              </TimelineTime>
            </TimelineHeader>
            <TimelineDescription>
              Shortened the gallery labels and checked them against the venue
              accessibility guide.{" "}
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineRail>
            <TimelineMarker className="border-0">
              <Avatar person="mina" />
            </TimelineMarker>
            <TimelineConnector />
          </TimelineRail>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle> Client review ready </TimelineTitle>
              <TimelineTime dateTime="2026-05-22T11:06">
                <span className="text-foreground/80 font-medium">
                  {" "}
                  Maya Okafor{" "}
                </span>{" "}
                11:06 AM
              </TimelineTime>
            </TimelineHeader>
            <TimelineDescription>
              Shared the updated map and signage set with the venue team for
              approval.{" "}
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
}
