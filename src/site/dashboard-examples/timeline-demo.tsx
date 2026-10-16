/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import {
  IconCircleCheck as CircleCheck,
  IconClock as Clock,
  IconFlag as Flag,
  IconSpeakerphone as Megaphone,
  IconPalette as Palette,
  IconShieldExclamation as ShieldAlert,
} from "@tabler/icons-react";

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

const tones = {
  neutral: "",
  blue: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  green: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

const events = [
  {
    icon: Flag,
    title: "Project brief opened",
    badge: "Owner assigned",
    tone: "neutral",
    time: "09:12",
    description: (
      <>
        Prepared{" "}
        <code className="rounded-[4px] bg-muted px-1 py-px font-mono text-xs text-foreground">
          visitor-experience
        </code>{" "}
        for the Culture venue team.
      </>
    ),
  },
  {
    icon: Palette,
    title: "First concept review",
    badge: "Concept",
    tone: "blue",
    time: "09:34",
    description: (
      <>
        Shared with{" "}
        <span className="font-medium text-foreground">
          the venue working group
        </span>{" "}
        alongside the research notes.
      </>
    ),
  },
  {
    icon: ShieldAlert,
    title: "Access review requested",
    badge: "Paused",
    tone: "amber",
    time: "09:51",
    description: (
      <>
        A route needs another check at{" "}
        <span className="font-medium text-foreground">the north entrance</span>;
        the next draft will include an accessible alternative.
      </>
    ),
  },
  {
    icon: Megaphone,
    title: "Review notes gathered",
    badge: "Feedback",
    tone: "neutral",
    time: "10:05",
    description: (
      <>
        Feedback and the revised scope are ready in{" "}
        <span className="font-medium text-foreground">Project notes</span>.
      </>
    ),
  },
  {
    icon: Clock,
    title: "Handoff scheduled",
    badge: "Queued",
    tone: "neutral",
    time: "10:30",
    description: "Final files follow once the venue approves the arrival map.",
  },
  {
    icon: CircleCheck,
    title: "Delivery checklist agreed",
    badge: "Ready",
    tone: "green",
    time: "10:42",
    description:
      "Owners, file formats, and review dates are recorded in the project brief.",
    status: "current" as const,
  },
] satisfies Array<{
  icon: React.ElementType;
  title: string;
  badge: string;
  tone: keyof typeof tones;
  time: string;
  description: React.ReactNode;
  status?: "current";
}>;

export default function TimelineDemo() {
  return (
    <section className="flex w-full max-w-lg flex-col gap-5 rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="space-y-1">
        <p className="text-xs text-muted-foreground">Project decisions</p>
        <h3 className="text-sm font-semibold tracking-tight">
          Visitor experience
        </h3>
      </header>
      <Timeline>
        {events.map((event) => (
          <TimelineItem key={event.title} status={event.status ?? "done"}>
            <TimelineRail>
              <TimelineMarker>
                <event.icon />
              </TimelineMarker>
              <TimelineConnector />
            </TimelineRail>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>{event.title}</TimelineTitle>
                <Badge variant="secondary" className={tones[event.tone]}>
                  {event.badge}
                </Badge>
                <TimelineTime dateTime={`2026-09-21T${event.time}`}>
                  {event.time}
                </TimelineTime>
              </TimelineHeader>
              <TimelineDescription>{event.description}</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}
