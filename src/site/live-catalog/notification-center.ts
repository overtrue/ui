export default {
  name: "notification-center",
  title: "Notification center",
  category: "Feedback",
  description:
    "An inbox of app notifications grouped by day, with tabs, unread state, inline actions, archive with undo, and a bell popover.",
  dependencies: [],
  imports: "NotificationCenter, type NotificationItem",
  exampleImports: 'import { useState } from "react"',
  usage: `function Example() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      kind: "mention",
      actor: { name: "Mara Lindqvist" },
      title: "Mara Lindqvist mentioned you in Atlas launch plan",
      body: "Can you sanity-check the rollout dates?",
      time: new Date(Date.now() - 4 * 60_000),
      actions: [{ id: "reply", label: "Reply" }],
    },
    {
      id: "2",
      kind: "approval",
      actor: { name: "Kofi Mensah" },
      title: "Kofi Mensah requested approval for an expense",
      time: new Date(Date.now() - 38 * 60_000),
      actions: [
        { id: "approve", label: "Approve", variant: "primary" },
        { id: "decline", label: "Decline" },
      ],
    },
  ])
  return (
    <NotificationCenter.Popover
      notifications={notifications}
      onNotificationsChange={setNotifications}
      tabs={[{ id: "mentions", label: "Mentions", filter: (n) => n.kind === "mention" }]}
      onAction={async (item, action) => {
        await fetch(\`/api/notifications/\${item.id}/\${action.id}\`, { method: "POST" })
      }}
      onArchive={(item) => fetch(\`/api/notifications/\${item.id}\`, { method: "DELETE" })}
    />
  )
}`,
  notes:
    "Rows are grouped into Today, Yesterday, and Earlier against `now`, newest first, with relative times from Intl.RelativeTimeFormat that refresh on their own. All and Unread are always there; `tabs` adds filtered tabs such as Mentions, each with its own unread count and empty state, and Mark all read applies to the tab in view. Opening a row with a click or Enter marks it read and calls `onOpen`; give it `href` and it becomes a link. Inline actions mark the row read and show a spinner while the promise from `onAction` runs. Archiving removes the row from the list right away through `onNotificationsChange` and leaves an inline Undo row whose timer pauses while it is hovered or focused; `onArchive` fires only once that window closes, so the server never sees an archive that was undone. In the list, the arrow keys, Home, and End move between rows, Tab reaches a row's quick and inline actions, E archives, U toggles read, and Z undoes the last archive. `NotificationCenter.Popover` renders a bell with an unread badge that rings when new notifications arrive and opens the same panel in a frosted popover; pass `inline` to render it in place for docs and layouts that manage their own layering.",
  previewWidth: 640,
  examples: [
    {
      name: "notification-center-demo",
      title: "Inbox",
      description:
        "A dozen notifications across mentions, approvals, deploys, alerts, and billing. Approve the expense, archive a row with E and undo it, or switch to Unread and Mentions.",
    },
    {
      name: "notification-center-popover-demo",
      title: "Bell in an app header",
      description:
        "The popover version, opened in place under a header bell. The badge follows the unread count as you read and archive.",
    },
  ],
  api: [
    [
      "notifications? / defaultNotifications?",
      "NotificationItem[]",
      "{ id; title; body?; time: Date; read?; kind?; actor?: { name; image? }; href?; actions?: { id; label; variant? }[] }.",
    ],
    [
      "onNotificationsChange?",
      "(next, change: { type; ids }) => void",
      'Called with the next list after a read, unread, archive, or undo. type is "read", "unread", "archive", or "restore".',
    ],
    [
      "kind (per item)",
      '"mention" | "comment" | "review" | "assignment" | "approval" | "deploy" | "invite" | "billing" | "security" | "alert" | "system" | string',
      "Picks the icon tile, or the badge on the actor's avatar. Unknown kinds use a bell.",
    ],
    [
      "tabs?",
      "{ id; label; filter; emptyTitle?; emptyDescription? }[]",
      "Tabs after All and Unread.",
    ],
    ["tab? / defaultTab? / onTabChange?", "string", 'Controlled or initial tab id. Defaults to "all".'],
    ["onOpen?", "(notification) => void", "Called when a row is opened. The row is marked read first."],
    [
      "onAction?",
      "(notification, action) => void | Promise",
      "Runs an inline action. A returned promise shows a spinner until it settles.",
    ],
    [
      "onArchive?",
      "(notification) => void",
      "Called once the undo window closes, or when the panel unmounts with an archive pending.",
    ],
    ["undoTimeout?", "number", "Milliseconds Undo stays available, paused while hovered or focused. Defaults to 5000."],
    [
      "renderNotification?",
      "(notification, { read; timeLabel; group }) => ReactNode",
      "Replaces the row text. The row, unread dot, quick actions, and inline actions stay.",
    ],
    ["now?", "Date", "Anchors relative times and day groups. Defaults to the clock."],
    ["locale?", "string", "BCP 47 locale for relative times and dates."],
    ["formatTime?", "(time, now) => string", 'Replaces the relative time, such as "5m ago".'],
    ["heading? / actions? / footer?", "ReactNode", "Header title, extra header controls, and content under the list."],
    [
      "labels?",
      "Partial<NotificationCenterLabels>",
      "Interface copy for translation, including trigger: (unread) => string for the bell.",
    ],
    [
      "NotificationCenter.Popover",
      "NotificationCenterProps & { open?; defaultOpen?; onOpenChange?; align?; inline?; width? }",
      "A bell with an unread badge that opens the panel in a frosted popover. inline renders it in place; width defaults to 380.",
    ],
    [
      "triggerClassName? / contentClassName?",
      "string",
      "Popover only: classes for the bell and the panel.",
    ],
  ],
} as const;
