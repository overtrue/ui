"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  IconAlertTriangle,
  IconArchive,
  IconAt,
  IconBell,
  IconBellCheck,
  IconChecks,
  IconCircleCheck,
  IconCreditCard,
  IconGitPullRequest,
  IconInbox,
  IconLoader2,
  IconMail,
  IconMailOpened,
  IconMessageCircle,
  IconRocket,
  IconShieldCheck,
  IconUserCheck,
  IconUserPlus,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

/** Built-in kinds pick an icon and a tone. Any other string falls back to a bell. */
export type NotificationKind =
  | "mention"
  | "comment"
  | "review"
  | "assignment"
  | "approval"
  | "deploy"
  | "invite"
  | "billing"
  | "security"
  | "alert"
  | "system"
  | (string & {});

export interface NotificationActor {
  name: string;
  /** Avatar image URL. Initials are shown without one. */
  image?: string;
}

export interface NotificationAction {
  id: string;
  label: string;
  /** Defaults to "secondary". Use one primary action per notification. */
  variant?: "primary" | "secondary" | "destructive";
}

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  time: Date;
  read?: boolean;
  kind?: NotificationKind;
  actor?: NotificationActor;
  /** Makes the row a link. */
  href?: string;
  /** Inline buttons, such as Approve or Reply. */
  actions?: NotificationAction[];
}

export interface NotificationTab {
  id: string;
  label: string;
  filter: (notification: NotificationItem) => boolean;
  /** Empty state copy for this tab. */
  emptyTitle?: string;
  emptyDescription?: string;
}

export interface NotificationChange {
  type: "read" | "unread" | "archive" | "restore";
  ids: string[];
}

export interface NotificationRenderInfo {
  read: boolean;
  /** Relative time, such as "5m ago". */
  timeLabel: string;
  group: "today" | "yesterday" | "earlier";
}

/** Interface copy. Relative times are localized through `locale`. */
export interface NotificationCenterLabels {
  heading: string;
  tabs: string;
  all: string;
  unread: string;
  markAllRead: string;
  markRead: string;
  markUnread: string;
  archive: string;
  archived: string;
  undo: string;
  restored: string;
  allRead: string;
  today: string;
  yesterday: string;
  earlier: string;
  unreadMarker: string;
  justNow: string;
  emptyTitle: (tab: string) => string;
  emptyDescription: (tab: string) => string;
  trigger: (unread: number) => string;
  newNotifications: (count: number) => string;
  working: string;
  actionDone: (label: string) => string;
}

export interface NotificationCenterProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "onChange" | "defaultValue" | "title"
> {
  /** Controlled list. Leave undefined and pass `defaultNotifications` to let the panel manage it. */
  notifications?: NotificationItem[];
  defaultNotifications?: NotificationItem[];
  /** Called with the next list after a read, unread, archive, or undo. */
  onNotificationsChange?: (
    notifications: NotificationItem[],
    change: NotificationChange,
  ) => void;
  /** Tabs after All and Unread, such as Mentions. */
  tabs?: NotificationTab[];
  tab?: string;
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
  /** Anchors relative times and the Today and Yesterday groups. Defaults to the clock. */
  now?: Date;
  /** BCP 47 locale for relative times. Defaults to the runtime locale. */
  locale?: string;
  /** Replaces the relative time label. */
  formatTime?: (time: Date, now: Date) => string;
  /** Called when a row is opened with a click or Enter. The row is marked read. */
  onOpen?: (notification: NotificationItem) => void;
  /** Runs an inline action and marks the row read. Return a promise to show progress until it settles. */
  onAction?: (
    notification: NotificationItem,
    action: NotificationAction,
  ) => void | Promise<unknown>;
  /** Called once the undo window for an archived notification has closed. */
  onArchive?: (notification: NotificationItem) => void;
  /** How long Undo stays available, in ms. Pauses while hovered or focused. Defaults to 5000. */
  undoTimeout?: number;
  /** Replaces the text of every row. The row, its unread dot, and its quick actions stay. */
  renderNotification?: (
    notification: NotificationItem,
    info: NotificationRenderInfo,
  ) => React.ReactNode;
  /** Header title. Defaults to labels.heading. */
  heading?: React.ReactNode;
  /** Extra controls in the header, such as a settings button. */
  actions?: React.ReactNode;
  /** Content under the list, such as a View all link. */
  footer?: React.ReactNode;
  labels?: Partial<NotificationCenterLabels>;
}

export interface NotificationCenterPopoverProps extends NotificationCenterProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Panel alignment against the bell. Defaults to end. */
  align?: "start" | "center" | "end";
  /**
   * Render the panel in place under the bell instead of a portalled popover.
   * It stays open on outside clicks and never steals focus on mount. For
   * documentation, screenshots, and layouts that already manage layering.
   */
  inline?: boolean;
  /** Panel width in px. Defaults to 380, capped by the viewport. */
  width?: number;
  triggerClassName?: string;
  contentClassName?: string;
}

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

const DAY_MS = 86_400_000;
const dayNumber = (date: Date) =>
  Math.round(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS,
  );

const defaultLabels: NotificationCenterLabels = {
  heading: "Notifications",
  tabs: "Filter notifications",
  all: "All",
  unread: "Unread",
  markAllRead: "Mark all read",
  markRead: "Mark as read",
  markUnread: "Mark as unread",
  archive: "Archive",
  archived: "Archived",
  undo: "Undo",
  restored: "Notification restored",
  allRead: "All marked as read",
  today: "Today",
  yesterday: "Yesterday",
  earlier: "Earlier",
  unreadMarker: "Unread",
  justNow: "Just now",
  emptyTitle: (tab) =>
    tab === "unread" ? "You're all caught up" : "Nothing here yet",
  emptyDescription: (tab) =>
    tab === "unread"
      ? "New activity will show up here as it happens."
      : "When something needs your attention, it will land here.",
  trigger: (unread) =>
    unread ? `Notifications, ${unread} unread` : "Notifications",
  newNotifications: (count) =>
    count === 1 ? "1 new notification" : `${count} new notifications`,
  working: "Working",
  actionDone: (label) => `${label}: done`,
};

interface KindStyle {
  Icon: typeof IconBell;
  /** A theme color for tinted tiles; status kinds use Tailwind status classes instead. */
  tone?: string;
  tile?: string;
  badge?: string;
}

const KINDS: Record<string, KindStyle> = {
  mention: { Icon: IconAt, tone: "var(--color-primary)" },
  comment: { Icon: IconMessageCircle, tone: "var(--color-chart-4)" },
  review: { Icon: IconGitPullRequest, tone: "var(--color-chart-1)" },
  assignment: { Icon: IconUserCheck, tone: "var(--color-chart-1)" },
  approval: { Icon: IconCircleCheck, tone: "var(--color-chart-2)" },
  deploy: { Icon: IconRocket, tone: "var(--color-chart-2)" },
  invite: { Icon: IconUserPlus, tone: "var(--color-chart-5)" },
  billing: { Icon: IconCreditCard, tone: "var(--color-chart-3)" },
  security: { Icon: IconShieldCheck, tone: "var(--color-chart-5)" },
  alert: {
    Icon: IconAlertTriangle,
    tile: "bg-amber-500/12 text-amber-700 ring-amber-500/20 dark:bg-amber-400/12 dark:text-amber-400 dark:ring-amber-400/20",
    badge: "bg-amber-500 text-white dark:bg-amber-400 dark:text-black",
  },
  system: { Icon: IconBell, tone: "var(--color-muted-foreground)" },
};
const kindStyle = (kind?: string) => KINDS[kind ?? "system"] ?? KINDS.system;

function hash(text: string) {
  let value = 0;
  for (let i = 0; i < text.length; i++)
    value = (value * 31 + text.charCodeAt(i)) >>> 0;
  return value;
}

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  return (
    (words[0]?.[0] ?? "") +
    (words.length > 1 ? (words[words.length - 1][0] ?? "") : "")
  ).toUpperCase();
}

const relativeFormats = new Map<string, Intl.RelativeTimeFormat>();
function relativeTime(time: Date, now: Date, locale: string | undefined, justNow: string) {
  const seconds = (time.getTime() - now.getTime()) / 1000;
  const abs = Math.abs(seconds);
  if (abs < 45) return justNow;
  const key = locale ?? "";
  let format = relativeFormats.get(key);
  if (!format) {
    format = new Intl.RelativeTimeFormat(locale, {
      numeric: "auto",
      style: "narrow",
    });
    relativeFormats.set(key, format);
  }
  const sign = Math.sign(seconds) || -1;
  if (abs < 3_600) return format.format(sign * Math.max(1, Math.round(abs / 60)), "minute");
  if (abs < 86_400) return format.format(sign * Math.floor(abs / 3_600), "hour");
  const days = dayNumber(time) - dayNumber(now);
  if (Math.abs(days) < 7) return format.format(days, "day");
  if (Math.abs(days) < 30) return format.format(Math.trunc(days / 7), "week");
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: time.getFullYear() === now.getFullYear() ? undefined : "numeric",
  }).format(time);
}

const keyframes =
  "@keyframes notification-center-in{from{opacity:0;transform:translateY(-6px) scale(.97)}to{opacity:1;transform:none}}" +
  "@keyframes notification-center-row{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}" +
  "@keyframes notification-center-drain{from{transform:scaleX(1)}to{transform:scaleX(0)}}";

const card =
  "rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]";
const frosted =
  "rounded-xl border border-border/70 bg-popover/90 text-popover-foreground shadow-xl backdrop-blur-md";
const ring =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

/* ------------------------------------------------------------------------ */
/* Pieces                                                                    */
/* ------------------------------------------------------------------------ */

function Avatar({ notification }: { notification: NotificationItem }) {
  const style = kindStyle(notification.kind);
  const { Icon } = style;
  const toneStyle = style.tone
    ? ({ "--tone": style.tone } as React.CSSProperties)
    : undefined;
  if (!notification.actor) {
    return (
      <span
        aria-hidden="true"
        data-slot="notification-center-icon"
        style={toneStyle}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-[10px] ring-1 ring-inset",
          style.tile ??
            "[background-color:color-mix(in_oklab,var(--tone)_12%,var(--color-card))] [color:color-mix(in_oklab,var(--tone)_70%,var(--color-foreground))] ring-[color-mix(in_oklab,var(--tone)_18%,transparent)]",
        )}
      >
        <Icon className="size-4" />
      </span>
    );
  }
  const person = notification.actor;
  const personTone = `var(--color-chart-${(hash(person.name) % 5) + 1})`;
  return (
    <span aria-hidden="true" data-slot="notification-center-avatar" className="relative size-8 shrink-0">
      {person.image ? (
        <img
          src={person.image}
          alt=""
          className="size-8 rounded-full object-cover ring-1 ring-border/60"
        />
      ) : (
        <span
          style={{ "--tone": personTone } as React.CSSProperties}
          className="flex size-8 items-center justify-center rounded-full text-xs font-semibold [background-color:color-mix(in_oklab,var(--tone)_16%,var(--color-card))] [color:color-mix(in_oklab,var(--tone)_45%,var(--color-foreground))]"
        >
          {initials(person.name)}
        </span>
      )}
      {notification.kind && (
        <span
          style={toneStyle}
          className={cn(
            "absolute -end-1.5 -bottom-1.5 flex size-4 items-center justify-center rounded-full ring-2 ring-(--notification-surface)",
            style.badge ?? "bg-[var(--tone)] text-(--notification-surface)",
          )}
        >
          <Icon className="size-2.5" stroke={2.5} />
        </span>
      )}
    </span>
  );
}

function UndoRow({
  notification,
  timeout,
  labels,
  onUndo,
  onExpire,
}: {
  notification: NotificationItem;
  timeout: number;
  labels: NotificationCenterLabels;
  onUndo: () => void;
  onExpire: () => void;
}) {
  const expire = React.useRef(onExpire);
  expire.current = onExpire;
  const remaining = React.useRef(timeout);
  const started = React.useRef(0);
  const timer = React.useRef<number | null>(null);
  const holds = React.useRef({ hover: false, focus: false });
  const [paused, setPaused] = React.useState(false);

  const start = React.useCallback(() => {
    if (timer.current !== null) return;
    started.current = Date.now();
    timer.current = window.setTimeout(() => expire.current(), remaining.current);
  }, []);
  const stop = React.useCallback(() => {
    if (timer.current === null) return;
    window.clearTimeout(timer.current);
    timer.current = null;
    remaining.current -= Date.now() - started.current;
  }, []);
  React.useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  const hold = (key: "hover" | "focus", on: boolean) => {
    holds.current[key] = on;
    const held = holds.current.hover || holds.current.focus;
    if (held) stop();
    else start();
    setPaused(held);
  };

  return (
    <li
      data-slot="notification-center-undo"
      data-undo-id={notification.id}
      onPointerEnter={() => hold("hover", true)}
      onPointerLeave={() => hold("hover", false)}
      onFocus={() => hold("focus", true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) hold("focus", false);
      }}
      className="relative flex items-center gap-2.5 overflow-hidden rounded-xl bg-muted/40 py-1.5 ps-3 pe-1.5 ring-1 ring-border/60 ring-inset motion-safe:animate-[notification-center-row_200ms_cubic-bezier(0.22,1,0.36,1)]"
    >
      <IconArchive aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <p className="min-w-0 flex-1 truncate text-[13px] leading-5 text-muted-foreground">
        <span className="font-medium text-foreground">{labels.archived}</span>
        <span aria-hidden="true"> · </span>
        <span className="sr-only">: </span>
        {notification.title}
      </p>
      <button
        type="button"
        data-slot="notification-center-undo-button"
        onClick={onUndo}
        className={cn(
          "inline-flex h-7 shrink-0 items-center rounded-lg px-2.5 text-xs font-medium text-primary transition-colors duration-150 hover:bg-primary/10 motion-reduce:transition-none",
          ring,
        )}
      >
        {labels.undo}
      </button>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-primary/35 motion-safe:animate-[notification-center-drain_linear_forwards] motion-reduce:hidden"
        style={{
          animationDuration: `${timeout}ms`,
          animationPlayState: paused ? "paused" : "running",
        }}
      />
    </li>
  );
}

/* ------------------------------------------------------------------------ */
/* Panel                                                                     */
/* ------------------------------------------------------------------------ */

type Variant = "card" | "popover";

function Panel({
  notifications: notificationsProp,
  defaultNotifications = [],
  onNotificationsChange,
  tabs: extraTabs,
  tab: tabProp,
  defaultTab = "all",
  onTabChange,
  now: nowProp,
  locale,
  formatTime,
  onOpen,
  onAction,
  onArchive,
  undoTimeout = 5000,
  renderNotification,
  heading,
  actions,
  footer,
  labels: labelsProp,
  className,
  style,
  variant = "card",
  onEscape,
  ...props
}: NotificationCenterProps & { variant?: Variant; onEscape?: () => void }) {
  const labels = { ...defaultLabels, ...labelsProp };
  const uid = React.useId();
  const listRef = React.useRef<HTMLDivElement>(null);

  /* ---- Clock ---- */
  const [clock, setClock] = React.useState(() => new Date());
  React.useEffect(() => {
    if (nowProp) return;
    const tick = () => setClock(new Date());
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, [nowProp]);
  const now = nowProp ?? clock;

  /* ---- Controlled and uncontrolled state ---- */
  const [listState, setListState] = React.useState(defaultNotifications);
  const list = notificationsProp ?? listState;
  const listRefValue = React.useRef(list);
  listRefValue.current = list;
  const commit = (next: NotificationItem[], change: NotificationChange) => {
    if (notificationsProp === undefined) setListState(next);
    onNotificationsChange?.(next, change);
  };

  const tabs = React.useMemo<NotificationTab[]>(
    () => [
      { id: "all", label: labels.all, filter: () => true },
      { id: "unread", label: labels.unread, filter: (n) => !n.read },
      ...(extraTabs ?? []),
    ],
    [extraTabs, labels.all, labels.unread],
  );
  const [tabState, setTabState] = React.useState(defaultTab);
  const tabId = tabProp ?? tabState;
  const tab = tabs.find((entry) => entry.id === tabId) ?? tabs[0];
  // Rows read while in view stay put until the tab changes, so nothing jumps under the pointer.
  const [retained, setRetained] = React.useState<{ tab: string; ids: string[] }>({
    tab: tab.id,
    ids: [],
  });
  const kept = retained.tab === tab.id ? retained.ids : [];
  const inTab = (n: NotificationItem) => tab.filter(n) || kept.includes(n.id);
  const changeTab = (next: string) => {
    if (next === tab.id) return;
    if (tabProp === undefined) setTabState(next);
    onTabChange?.(next);
  };

  /* ---- Archive with undo ---- */
  const [pending, setPending] = React.useState<{ item: NotificationItem; index: number }[]>([]);
  const pendingRef = React.useRef(pending);
  pendingRef.current = pending;
  const archiveCallback = React.useRef(onArchive);
  archiveCallback.current = onArchive;
  // Closing the panel commits any archive still waiting for its undo window.
  React.useEffect(
    () => () => {
      for (const entry of pendingRef.current) archiveCallback.current?.(entry.item);
    },
    [],
  );

  const [busy, setBusy] = React.useState<Record<string, string>>({});
  const [announcement, setAnnouncement] = React.useState("");
  const announce = (text: string) =>
    setAnnouncement((current) => (current === text ? `${text} ` : text));

  /* ---- New arrivals ---- */
  const known = React.useRef<Set<string> | null>(null);
  React.useEffect(() => {
    const ids = new Set(list.map((n) => n.id));
    if (known.current) {
      const fresh = list.filter((n) => !n.read && !known.current!.has(n.id)).length;
      if (fresh) announce(labels.newNotifications(fresh));
    }
    known.current = ids;
  }, [list]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- Visible rows ---- */
  type Row = { item: NotificationItem; archived: boolean };
  const rows: Row[] = [
    ...list.filter(inTab).map((item) => ({ item, archived: false })),
    ...pending
      .filter((entry) => inTab(entry.item))
      .map((entry) => ({ item: entry.item, archived: true })),
  ].sort((a, b) => b.item.time.getTime() - a.item.time.getTime());
  const live = rows.filter((row) => !row.archived);
  const groupOf = (time: Date): NotificationRenderInfo["group"] => {
    const diff = dayNumber(now) - dayNumber(time);
    return diff <= 0 ? "today" : diff === 1 ? "yesterday" : "earlier";
  };
  const groups = (["today", "yesterday", "earlier"] as const)
    .map((group) => ({
      group,
      rows: rows.filter((row) => groupOf(row.item.time) === group),
    }))
    .filter((entry) => entry.rows.length > 0);

  /* ---- Roving focus ---- */
  const [activeState, setActive] = React.useState<string | null>(null);
  const active =
    activeState && live.some((row) => row.item.id === activeState)
      ? activeState
      : (live[0]?.item.id ?? null);
  const focusRequest = React.useRef<string | null>(null);
  const focusRow = (id: string) =>
    listRef.current
      ?.querySelector<HTMLElement>(`[data-primary="${CSS.escape(id)}"]`)
      ?.focus();
  React.useEffect(() => {
    if (!focusRequest.current) return;
    const id = focusRequest.current;
    focusRequest.current = null;
    focusRow(id);
  });

  /* ---- Actions ---- */
  const setRead = (ids: string[], read: boolean, retain = true) => {
    const targets = new Set(ids);
    if (!list.some((n) => targets.has(n.id) && !!n.read !== read)) return;
    if (retain)
      setRetained({
        tab: tab.id,
        ids: [...kept, ...ids.filter((id) => list.some((n) => n.id === id && inTab(n)))],
      });
    commit(
      list.map((n) => (targets.has(n.id) ? { ...n, read } : n)),
      { type: read ? "read" : "unread", ids },
    );
  };

  const archive = (item: NotificationItem) => {
    const index = list.findIndex((n) => n.id === item.id);
    if (index < 0) return;
    const position = live.findIndex((row) => row.item.id === item.id);
    const neighbor = live[position + 1] ?? live[position - 1];
    if (listRef.current?.contains(document.activeElement)) {
      if (neighbor) focusRequest.current = neighbor.item.id;
    }
    setActive(neighbor?.item.id ?? null);
    setPending((current) => [...current, { item, index }]);
    commit(
      list.filter((n) => n.id !== item.id),
      { type: "archive", ids: [item.id] },
    );
    announce(`${labels.archived}: ${item.title}`);
  };

  const undo = (id: string) => {
    const entry = pendingRef.current.find((p) => p.item.id === id);
    if (!entry) return;
    setPending((current) => current.filter((p) => p.item.id !== id));
    const current = listRefValue.current;
    const next = [...current];
    next.splice(Math.min(entry.index, next.length), 0, entry.item);
    commit(next, { type: "restore", ids: [id] });
    focusRequest.current = id;
    setActive(id);
    announce(labels.restored);
  };

  const expire = (id: string) => {
    const entry = pendingRef.current.find((p) => p.item.id === id);
    setPending((current) => current.filter((p) => p.item.id !== id));
    if (entry) archiveCallback.current?.(entry.item);
  };

  const open = (item: NotificationItem) => {
    setActive(item.id);
    setRead([item.id], true);
    onOpen?.(item);
  };

  const runAction = async (item: NotificationItem, action: NotificationAction) => {
    if (busy[item.id]) return;
    // Acting on a notification means it has been seen.
    setRead([item.id], true);
    const result = onAction?.(item, action);
    if (result && typeof (result as Promise<unknown>).then === "function") {
      setBusy((current) => ({ ...current, [item.id]: action.id }));
      try {
        await result;
      } finally {
        setBusy((current) => {
          const next = { ...current };
          delete next[item.id];
          return next;
        });
      }
    }
    announce(labels.actionDone(action.label));
  };

  const tabUnread = (entry: NotificationTab) =>
    list.filter((n) => !n.read && entry.filter(n)).length;
  const visibleUnread = live.filter((row) => !row.item.read).map((row) => row.item.id);

  /* ---- Keyboard ---- */
  const onListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement;
    const rowEl = target.closest<HTMLElement>("[data-notification-id]");
    const id = rowEl?.dataset.notificationId;
    const index = id ? live.findIndex((row) => row.item.id === id) : -1;
    const move = (next: number) => {
      const row = live[Math.max(0, Math.min(live.length - 1, next))];
      if (!row) return;
      event.preventDefault();
      setActive(row.item.id);
      focusRow(row.item.id);
    };
    switch (event.key) {
      case "ArrowDown":
        move(index < 0 ? 0 : index + 1);
        return;
      case "ArrowUp":
        move(index < 0 ? 0 : index - 1);
        return;
      case "Home":
        move(0);
        return;
      case "End":
        move(live.length - 1);
        return;
      case "e":
      case "E":
        if (index < 0) return;
        event.preventDefault();
        archive(live[index].item);
        return;
      case "u":
      case "U":
        if (index < 0) return;
        event.preventDefault();
        setRead([live[index].item.id], !live[index].item.read);
        return;
      case "z":
      case "Z": {
        const last = pendingRef.current[pendingRef.current.length - 1];
        if (!last) return;
        event.preventDefault();
        undo(last.item.id);
        return;
      }
      case "Escape":
        if (!onEscape) return;
        event.preventDefault();
        onEscape();
        return;
    }
  };

  /* ---- Rendering ---- */
  const groupLabel = { today: labels.today, yesterday: labels.yesterday, earlier: labels.earlier };
  const timeFor = (time: Date) =>
    formatTime ? formatTime(time, now) : relativeTime(time, now, locale, labels.justNow);
  const fullTime = (time: Date) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(time);

  const renderRow = (item: NotificationItem) => {
    const read = !!item.read;
    const isActive = item.id === active;
    const timeLabel = timeFor(item.time);
    const metaId = `${uid}-${item.id}-meta`;
    const working = busy[item.id];
    const primaryClass =
      "min-w-0 flex-1 text-start outline-none after:absolute after:inset-0 after:rounded-xl after:content-[''] after:transition-shadow after:duration-150 focus-visible:after:ring-2 focus-visible:after:ring-ring/50 motion-reduce:after:transition-none";
    const titleNode = (
      <span
        className={cn(
          "line-clamp-2 text-[13px] leading-5",
          read ? "text-foreground/80" : "font-medium text-foreground",
        )}
      >
        {!read && <span className="sr-only">{labels.unreadMarker}: </span>}
        {item.title}
      </span>
    );
    const primaryProps = {
      "data-primary": item.id,
      "data-slot": "notification-center-open",
      tabIndex: isActive ? 0 : -1,
      "aria-describedby": metaId,
      onFocus: () => setActive(item.id),
      onClick: () => open(item),
      className: primaryClass,
    };
    return (
      <li
        key={item.id}
        data-slot="notification-center-item"
        data-notification-id={item.id}
        data-state={read ? "read" : "unread"}
        data-kind={item.kind}
        className={cn(
          "group/item relative flex gap-3 rounded-xl py-2.5 ps-[22px] pe-3 transition-colors duration-150 hover:bg-muted/60 motion-reduce:transition-none",
          !read && "bg-primary/[0.035] dark:bg-primary/[0.06]",
        )}
      >
        {!read && (
          <span
            aria-hidden="true"
            data-slot="notification-center-dot"
            className="absolute start-2 top-[22px] size-2 rounded-full bg-primary shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_16%,transparent)] dark:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_16%,transparent),0_0_8px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]"
          />
        )}
        <Avatar notification={item} />
        <div className="min-w-0 flex-1">
          {renderNotification ? (
            <div className="flex items-start gap-2">
              {item.href ? (
                <a href={item.href} {...primaryProps}>
                  {renderNotification(item, { read, timeLabel, group: groupOf(item.time) })}
                </a>
              ) : (
                <button type="button" {...primaryProps}>
                  {renderNotification(item, { read, timeLabel, group: groupOf(item.time) })}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3">
                {item.href ? (
                  <a href={item.href} {...primaryProps}>
                    {titleNode}
                  </a>
                ) : (
                  <button type="button" {...primaryProps}>
                    {titleNode}
                  </button>
                )}
                <time
                  dateTime={item.time.toISOString()}
                  title={fullTime(item.time)}
                  className="shrink-0 pt-px text-xs leading-5 whitespace-nowrap text-muted-foreground tabular-nums transition-opacity duration-150 group-focus-within/item:opacity-0 group-hover/item:opacity-0 motion-reduce:transition-none pointer-coarse:hidden"
                >
                  {timeLabel}
                </time>
              </div>
              <p id={metaId} className="text-[13px] leading-5 text-muted-foreground">
                {item.body && <span className="line-clamp-2">{item.body}</span>}
                <span className="hidden text-xs tabular-nums pointer-coarse:inline">{timeLabel}</span>
                <span className="sr-only">
                  {item.body ? ", " : ""}
                  {fullTime(item.time)}
                </span>
              </p>
            </>
          )}
          {item.actions && item.actions.length > 0 && (
            <div className="relative z-10 mt-2 flex flex-wrap gap-1.5" data-slot="notification-center-actions">
              {item.actions.map((action) => {
                const variant = action.variant ?? "secondary";
                const spinning = working === action.id;
                return (
                  <button
                    key={action.id}
                    type="button"
                    tabIndex={isActive ? 0 : -1}
                    disabled={!!working}
                    aria-busy={spinning || undefined}
                    data-variant={variant}
                    onClick={() => void runAction(item, action)}
                    className={cn(
                      "inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,opacity] duration-150 disabled:cursor-default disabled:opacity-60 motion-reduce:transition-none",
                      ring,
                      variant === "primary"
                        ? "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_1px_2px_rgb(0_0_0/0.12)] dark:shadow-[0_4px_12px_-6px_color-mix(in_oklab,var(--color-primary)_80%,transparent),inset_0_1px_0_rgb(255_255_255/0.16)] hover:bg-primary/90"
                        : variant === "destructive"
                          ? "border border-border/70 bg-card text-rose-700 shadow-[0_1px_2px_rgb(0_0_0/0.04)] hover:border-rose-500/30 hover:bg-rose-500/[0.06] dark:text-rose-400"
                          : "border border-border/70 bg-card text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04)] hover:bg-muted",
                    )}
                  >
                    {spinning && (
                      <IconLoader2 aria-hidden="true" className="size-3.5 motion-safe:animate-spin" />
                    )}
                    {action.label}
                    {spinning && <span className="sr-only">, {labels.working}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div
          data-slot="notification-center-quick-actions"
          className="absolute end-2 top-2 z-10 flex items-center gap-0.5 rounded-lg border border-border/70 bg-(--notification-surface) p-0.5 opacity-0 shadow-[0_4px_12px_-6px_rgb(0_0_0/0.18)] transition-opacity duration-150 group-focus-within/item:opacity-100 group-hover/item:opacity-100 motion-reduce:transition-none pointer-coarse:opacity-100"
        >
          <button
            type="button"
            tabIndex={isActive ? 0 : -1}
            aria-label={read ? labels.markUnread : labels.markRead}
            title={read ? labels.markUnread : labels.markRead}
            onClick={() => setRead([item.id], !read)}
            className={cn(
              "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground motion-reduce:transition-none",
              ring,
            )}
          >
            {read ? (
              <IconMail aria-hidden="true" className="size-3.5" />
            ) : (
              <IconMailOpened aria-hidden="true" className="size-3.5" />
            )}
          </button>
          <button
            type="button"
            tabIndex={isActive ? 0 : -1}
            aria-label={labels.archive}
            title={`${labels.archive} (E)`}
            aria-keyshortcuts="E"
            onClick={() => archive(item)}
            className={cn(
              "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground motion-reduce:transition-none",
              ring,
            )}
          >
            <IconArchive aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      </li>
    );
  };

  const empty = (
    <div
      data-slot="notification-center-empty"
      className="flex min-h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center"
    >
      <span className="relative flex size-11 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground ring-1 ring-border/60 ring-inset">
        {tab.id === "unread" ? (
          <IconBellCheck aria-hidden="true" className="size-5" />
        ) : (
          <IconInbox aria-hidden="true" className="size-5" />
        )}
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold tracking-tight">
          {tab.emptyTitle ?? labels.emptyTitle(tab.id)}
        </p>
        <p className="mx-auto max-w-[17rem] text-[13px] leading-5 text-muted-foreground">
          {tab.emptyDescription ?? labels.emptyDescription(tab.id)}
        </p>
      </div>
    </div>
  );

  return (
    <div
      data-slot="notification-center"
      data-variant={variant}
      className={cn(
        "@container/notifications relative isolate flex min-h-0 min-w-0 flex-col overflow-hidden",
        variant === "card"
          ? cn(card, "[--notification-surface:var(--color-card)]")
          : cn(frosted, "[--notification-surface:var(--color-popover)]"),
        className,
      )}
      style={style}
      {...props}
    >
      <style>{keyframes}</style>
      <div
        data-slot="notification-center-header"
        className="flex shrink-0 items-center gap-2 px-4 pt-3.5 pb-3"
      >
        <h2 id={`${uid}-heading`} className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">
          {heading ?? labels.heading}
        </h2>
        <button
          type="button"
          data-slot="notification-center-mark-all"
          disabled={visibleUnread.length === 0}
          onClick={() => {
            setRead(visibleUnread, true, false);
            setRetained({ tab: tab.id, ids: [] });
            announce(labels.allRead);
          }}
          className={cn(
            "-me-1.5 inline-flex h-7 shrink-0 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
            ring,
          )}
        >
          <IconChecks aria-hidden="true" className="size-3.5" />
          {labels.markAllRead}
        </button>
        {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
      </div>
      <div className="shrink-0 px-4 pb-3">
        <div
          role="tablist"
          aria-label={labels.tabs}
          data-slot="notification-center-tabs"
          onKeyDown={(event) => {
            const index = tabs.findIndex((entry) => entry.id === tab.id);
            const next =
              event.key === "ArrowRight"
                ? tabs[(index + 1) % tabs.length]
                : event.key === "ArrowLeft"
                  ? tabs[(index - 1 + tabs.length) % tabs.length]
                  : event.key === "Home"
                    ? tabs[0]
                    : event.key === "End"
                      ? tabs[tabs.length - 1]
                      : null;
            if (!next) return;
            event.preventDefault();
            changeTab(next.id);
            event.currentTarget
              .querySelector<HTMLElement>(`[data-tab="${CSS.escape(next.id)}"]`)
              ?.focus();
          }}
          className="flex h-8 w-full items-center gap-0.5 overflow-x-auto rounded-[10px] bg-muted/60 p-1 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-border)_70%,transparent)] [scrollbar-width:none] dark:bg-muted/40 [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((entry) => {
            const selected = entry.id === tab.id;
            const count = tabUnread(entry);
            return (
              <button
                key={entry.id}
                type="button"
                role="tab"
                id={`${uid}-tab-${entry.id}`}
                data-tab={entry.id}
                data-state={selected ? "active" : "inactive"}
                aria-selected={selected}
                aria-controls={`${uid}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => changeTab(entry.id)}
                className={cn(
                  "inline-flex h-6 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 motion-reduce:transition-none",
                  ring,
                  selected
                    ? "bg-card text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_rgb(0_0_0/0.04)] dark:bg-foreground/10 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_1px_2px_rgb(0_0_0/0.5)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {entry.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[11px] leading-none font-semibold tabular-nums",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/[0.07] text-muted-foreground",
                    )}
                  >
                    <span className="sr-only">, </span>
                    {count}
                    <span className="sr-only"> {labels.unread.toLowerCase()}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div
        ref={listRef}
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${tab.id}`}
        data-slot="notification-center-list"
        onKeyDown={onListKeyDown}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border/60 px-2 pt-1 pb-2 [scrollbar-width:thin]"
      >
        {rows.length === 0
          ? empty
          : groups.map(({ group, rows: groupRows }) => (
              <section key={group} aria-labelledby={`${uid}-${group}`} className="pt-2">
                <h3
                  id={`${uid}-${group}`}
                  className="px-2.5 pb-1.5 text-xs font-medium text-muted-foreground"
                >
                  {groupLabel[group]}
                </h3>
                <ul className="flex flex-col gap-1">
                  {groupRows.map((row) =>
                    row.archived ? (
                      <UndoRow
                        key={row.item.id}
                        notification={row.item}
                        timeout={undoTimeout}
                        labels={labels}
                        onUndo={() => undo(row.item.id)}
                        onExpire={() => expire(row.item.id)}
                      />
                    ) : (
                      renderRow(row.item)
                    ),
                  )}
                </ul>
              </section>
            ))}
      </div>
      {footer && (
        <div
          data-slot="notification-center-footer"
          className="shrink-0 border-t border-border/60 px-2 py-2"
        >
          {footer}
        </div>
      )}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Popover                                                                   */
/* ------------------------------------------------------------------------ */

function NotificationCenterPopover({
  notifications: notificationsProp,
  defaultNotifications = [],
  onNotificationsChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  align = "end",
  inline = false,
  width = 380,
  triggerClassName,
  contentClassName,
  labels: labelsProp,
  className,
  ...props
}: NotificationCenterPopoverProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const [listState, setListState] = React.useState(defaultNotifications);
  const list = notificationsProp ?? listState;
  const unread = list.filter((n) => !n.read).length;
  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = openProp ?? openState;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const userOpened = React.useRef(false);

  const setOpen = (next: boolean) => {
    if (next === open) return;
    if (next) userOpened.current = true;
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
    if (inline) {
      if (next) requestAnimationFrame(focusInside);
      else if (contentRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
    }
  };
  const focusInside = () => {
    const root = contentRef.current;
    (
      root?.querySelector<HTMLElement>('[data-primary][tabindex="0"]') ??
      root?.querySelector<HTMLElement>('[role="tab"][tabindex="0"]')
    )?.focus();
  };

  // A gentle ring when the unread count goes up.
  const previous = React.useRef(unread);
  React.useEffect(() => {
    const grew = unread > previous.current;
    previous.current = unread;
    if (!grew || !triggerRef.current) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    triggerRef.current.querySelector("svg")?.animate?.(
      [
        { transform: "rotate(0)" },
        { transform: "rotate(14deg)" },
        { transform: "rotate(-12deg)" },
        { transform: "rotate(8deg)" },
        { transform: "rotate(-4deg)" },
        { transform: "rotate(0)" },
      ],
      { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }, [unread]);

  const panel = (
    <Panel
      {...props}
      labels={labelsProp}
      variant="popover"
      notifications={list}
      onNotificationsChange={(next, change) => {
        if (notificationsProp === undefined) setListState(next);
        onNotificationsChange?.(next, change);
      }}
      onEscape={inline ? () => setOpen(false) : undefined}
      className={cn(
        "w-full",
        inline ? "max-h-[min(34rem,calc(100dvh-6rem))]" : "max-h-[min(36rem,var(--radix-popover-content-available-height))]",
        contentClassName,
      )}
    />
  );

  const trigger = (
    <button
      ref={triggerRef}
      type="button"
      data-slot="notification-center-trigger"
      data-state={open ? "open" : "closed"}
      aria-label={labels.trigger(unread)}
      aria-haspopup="dialog"
      // Radix supplies aria-expanded and the click handler for the portalled popover.
      {...(inline ? { "aria-expanded": open, onClick: () => setOpen(!open) } : {})}
      className={cn(
        "relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-[color,background-color,box-shadow] duration-150 hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground motion-reduce:transition-none",
        ring,
        triggerClassName,
      )}
    >
      <IconBell aria-hidden="true" className="size-[18px] origin-top" />
      {unread > 0 && (
        <span
          aria-hidden="true"
          data-slot="notification-center-badge"
          className="absolute -end-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] leading-none font-semibold text-primary-foreground tabular-nums ring-2 ring-card shadow-[0_1px_2px_rgb(0_0_0/0.12)] dark:shadow-[0_2px_8px_-2px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]"
        >
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </button>
  );

  if (inline) {
    return (
      <div
        data-slot="notification-center-popover"
        data-state={open ? "open" : "closed"}
        className={cn("relative inline-flex", className)}
      >
        {trigger}
        {open && (
          <div
            ref={contentRef}
            role="dialog"
            aria-label={labels.heading}
            data-slot="notification-center-content"
            onKeyDown={(event) => {
              if (event.key !== "Escape" || event.defaultPrevented) return;
              event.preventDefault();
              setOpen(false);
            }}
            // Sized to the nearest CSS container, or the viewport without one.
            style={{ width: `min(${width}px, calc(100cqw - 2rem))` }}
            className={cn(
              "absolute top-full z-30 mt-2 flex motion-safe:animate-[notification-center-in_220ms_cubic-bezier(0.22,1,0.36,1)]",
              align === "end"
                ? "end-0 origin-top-right"
                : align === "center"
                  ? "left-1/2 -translate-x-1/2 origin-top"
                  : "start-0 origin-top-left",
            )}
          >
            {panel}
          </div>
        )}
      </div>
    );
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={contentRef}
          align={align}
          sideOffset={8}
          collisionPadding={8}
          aria-label={labels.heading}
          data-slot="notification-center-content"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            if (userOpened.current) requestAnimationFrame(focusInside);
          }}
          style={{ width: `min(${width}px, calc(100vw - 16px))` }}
          className={cn(
            "z-50 flex origin-(--radix-popover-content-transform-origin) outline-none motion-safe:animate-[notification-center-in_220ms_cubic-bezier(0.22,1,0.36,1)]",
            className,
          )}
        >
          {panel}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

/* ------------------------------------------------------------------------ */
/* Export                                                                    */
/* ------------------------------------------------------------------------ */

/** An inbox of app notifications, grouped by day, with tabs, quick actions, and archive with undo. */
function NotificationCenterRoot(props: NotificationCenterProps) {
  return <Panel {...props} variant="card" />;
}

export const NotificationCenter = Object.assign(NotificationCenterRoot, {
  /** A bell with an unread badge that opens the panel in a frosted popover. */
  Popover: NotificationCenterPopover,
});
export { NotificationCenterPopover };
