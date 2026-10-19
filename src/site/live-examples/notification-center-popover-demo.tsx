import { IconSearch } from "@tabler/icons-react";
import {
  NotificationCenter,
  type NotificationItem,
} from "@/registry/overtrue/notification-center";

// Fieldwork's Atlas project on Monday 19 October 2026 at 14:20.
const NOW = new Date(2026, 9, 19, 14, 20);
const ago = (minutes: number) => new Date(NOW.getTime() - minutes * 60_000);

const notifications: NotificationItem[] = [
  {
    id: "p1",
    kind: "mention",
    actor: { name: "Mara Lindqvist" },
    title: "Mara Lindqvist mentioned you in Atlas launch plan",
    body: "Can you sanity-check the rollout dates before Thursday?",
    time: ago(4),
    actions: [{ id: "reply", label: "Reply" }],
  },
  {
    id: "p2",
    kind: "deploy",
    title: "Production deploy finished",
    body: "atlas-web 2.14.0 is live in 3 regions.",
    time: ago(52),
  },
  {
    id: "p3",
    kind: "comment",
    actor: { name: "Theo Park" },
    title: "Theo Park commented on Pricing page v3",
    body: "Could we test annual billing first?",
    time: ago(95),
  },
  {
    id: "p4",
    kind: "alert",
    title: "p95 latency above 800 ms on api-gateway",
    time: ago(170),
    read: true,
  },
  {
    id: "p5",
    kind: "assignment",
    actor: { name: "Ines Moreau" },
    title: "Ines Moreau assigned you Audit color tokens",
    time: new Date(2026, 9, 18, 17, 12),
    read: true,
  },
];

const checklist = [
  { label: "Brand assets", done: 12, total: 12 },
  { label: "Marketing site", done: 9, total: 14 },
  { label: "Onboarding flow", done: 4, total: 11 },
];

export default function Demo() {
  return (
    <div className="@container relative flex min-h-[600px] flex-col rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="relative z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border/60 px-4">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
          F
        </span>
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          <span className="hidden text-muted-foreground @min-[26rem]:inline">Projects</span>
          <span aria-hidden="true" className="hidden text-muted-foreground/60 @min-[26rem]:inline">/</span>
          <span className="truncate font-medium">Atlas</span>
        </nav>
        <div className="ms-auto hidden h-9 w-52 items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-3 text-[13px] text-muted-foreground @min-[34rem]:flex">
          <IconSearch aria-hidden="true" className="size-4" />
          Search
          <kbd className="ms-auto font-sans text-xs text-muted-foreground">⌘K</kbd>
        </div>
        <span
          aria-hidden="true"
          className="ms-auto flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground @min-[34rem]:ms-0"
        >
          AL
        </span>
        <NotificationCenter.Popover
          inline
          defaultOpen
          defaultNotifications={notifications}
          now={NOW}
          locale="en-US"
          contentClassName="max-h-[500px]"
          footer={
            <a
              href="#notifications"
              className="flex h-8 items-center justify-center rounded-lg text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              View all notifications
            </a>
          }
        />
      </header>
      <div className="flex flex-1 flex-col gap-4 rounded-b-2xl bg-muted/30 p-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Atlas launch</h2>
          <p className="text-[13px] leading-5 text-muted-foreground">
            Ships Thursday, 22 October · 3 workstreams
          </p>
        </div>
        <div className="grid gap-3 @min-[34rem]:grid-cols-3">
          {checklist.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border/70 bg-card p-4"
            >
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.02em] tabular-nums">
                {item.done}
                <span className="text-sm font-medium text-muted-foreground">
                  /{item.total}
                </span>
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(item.done / item.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
