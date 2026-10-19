import { useState } from "react";
import {
  NotificationCenter,
  type NotificationItem,
  type NotificationTab,
} from "@/registry/overtrue/notification-center";

// Fieldwork's inbox on Monday 19 October 2026 at 14:20.
const NOW = new Date(2026, 9, 19, 14, 20);
const ago = (minutes: number) => new Date(NOW.getTime() - minutes * 60_000);
const day = (offset: number, hour: number, minute = 0) =>
  new Date(2026, 9, 19 + offset, hour, minute);

const people = {
  mara: { name: "Mara Lindqvist" },
  kofi: { name: "Kofi Mensah" },
  theo: { name: "Theo Park" },
  yuki: { name: "Yuki Tanaka" },
  ines: { name: "Ines Moreau" },
};

const initial: NotificationItem[] = [
  {
    id: "n1",
    kind: "mention",
    actor: people.mara,
    title: "Mara Lindqvist mentioned you in Atlas launch plan",
    body: "Can you sanity-check the rollout dates before Thursday's crit?",
    time: ago(26),
    actions: [{ id: "reply", label: "Reply" }],
  },
  {
    id: "n2",
    kind: "approval",
    actor: people.kofi,
    title: "Kofi Mensah requested approval for an expense",
    body: "$1,284.00 for travel to Design week Lisbon.",
    time: ago(38),
    actions: [
      { id: "approve", label: "Approve", variant: "primary" },
      { id: "decline", label: "Decline" },
    ],
  },
  {
    id: "n3",
    kind: "deploy",
    title: "Production deploy finished",
    body: "atlas-web 2.14.0 is live in 3 regions after 2m 41s.",
    time: ago(12),
  },
  {
    id: "n4",
    kind: "comment",
    actor: people.theo,
    title: "Theo Park replied in #pricing",
    body: "Could we test annual billing first?",
    time: ago(3),
  },
  {
    id: "n5",
    kind: "alert",
    title: "p95 latency above 800 ms on api-gateway",
    body: "Sustained for 10 minutes in eu-west. On-call has been paged.",
    time: ago(170),
    read: true,
  },
  {
    id: "n6",
    kind: "invite",
    actor: people.yuki,
    title: "Yuki Tanaka invited you to the Orbit workspace",
    time: ago(290),
    actions: [
      { id: "accept", label: "Accept", variant: "primary" },
      { id: "ignore", label: "Ignore" },
    ],
  },
  {
    id: "n7",
    kind: "assignment",
    actor: people.ines,
    title: "Ines Moreau assigned you Audit color tokens",
    body: "Due Friday · Design system",
    time: day(-1, 17, 12),
    read: true,
  },
  {
    id: "n8",
    kind: "security",
    title: "New sign-in from Safari on macOS",
    body: "Lisbon, Portugal. If this wasn't you, reset your password.",
    time: day(-1, 9, 41),
    read: true,
  },
  {
    id: "n9",
    kind: "mention",
    actor: people.theo,
    title: "Theo Park mentioned you in Q4 roadmap",
    body: "Pinging you on the onboarding milestone.",
    time: day(-1, 8, 5),
  },
  {
    id: "n10",
    kind: "billing",
    title: "Invoice INV-2041 was paid",
    body: "$2,400.00 for the Team plan, October.",
    time: day(-3, 11, 0),
    read: true,
  },
  {
    id: "n11",
    kind: "review",
    actor: people.kofi,
    title: "Kofi Mensah requested your review on Checkout redesign",
    time: day(-4, 16, 30),
    read: true,
  },
  {
    id: "n12",
    kind: "system",
    title: "Your weekly digest is ready",
    body: "14 tasks closed, 3 projects shipped.",
    time: day(-6, 8, 0),
    read: true,
  },
];

const tabs: NotificationTab[] = [
  {
    id: "mentions",
    label: "Mentions",
    filter: (n) => n.kind === "mention",
    emptyTitle: "No mentions",
    emptyDescription: "When someone @mentions you, it shows up here.",
  },
];

const outcomes: Record<string, string> = {
  approve: "Approved. Kofi has been notified.",
  decline: "Declined. Kofi has been notified.",
  accept: "You joined the Orbit workspace.",
  ignore: "Invitation ignored.",
};

export default function Demo() {
  const [notifications, setNotifications] = useState(initial);
  return (
    <NotificationCenter
      notifications={notifications}
      onNotificationsChange={setNotifications}
      tabs={tabs}
      now={NOW}
      locale="en-US"
      className="mx-auto h-[600px] w-full max-w-[440px]"
      onAction={async (item, action) => {
        if (action.id === "reply") return;
        await new Promise((resolve) => setTimeout(resolve, 900));
        setNotifications((list) =>
          list.map((n) =>
            n.id === item.id
              ? { ...n, body: outcomes[action.id], actions: undefined }
              : n,
          ),
        );
      }}
    />
  );
}
