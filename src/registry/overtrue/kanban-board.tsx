"use client";

import * as React from "react";
import {
  IconAlertTriangle as AlertTriangle,
  IconCalendar as Calendar,
  IconPlus as Plus,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export interface KanbanColumn {
  id: string;
  title: string;
  /** Work-in-progress limit. The column warns once it holds more cards than this. */
  limit?: number;
  /** Accent for the column dot, any CSS color. Defaults to the chart palette in column order. */
  color?: string;
}

export interface KanbanLabel {
  name: string;
  /** Dot color, any CSS color. Defaults to a stable chart color for the name. */
  color?: string;
}

export interface KanbanAssignee {
  id?: string;
  name: string;
  image?: string;
}

export type KanbanPriority = "urgent" | "high" | "medium" | "low";

export interface KanbanCard {
  id: string;
  /** Id of the column the card is in. */
  column: string;
  title: string;
  description?: string;
  labels?: readonly (string | KanbanLabel)[];
  assignees?: readonly KanbanAssignee[];
  /** A date, or a `yyyy-mm-dd` string read in local time. */
  due?: string | Date;
  priority?: KanbanPriority;
  /** Extra content at the start of the footer, such as an issue key or a comment count. */
  meta?: React.ReactNode;
}

export interface KanbanCardState {
  column: KanbanColumn;
  /** The card is picked up, by pointer or keyboard. */
  dragging: boolean;
  /** This render is the lifted copy that follows the pointer. */
  overlay: boolean;
}

export interface KanbanBoardLabels {
  board: string;
  cardRole: string;
  instructions: string;
  /** Short reminder announced when a card is picked up from the keyboard. */
  liftedHint: string;
  /** Text in the dashed area of an empty column. */
  empty: string;
  /** Text in an empty column that can't take the card being dragged. */
  blocked: string;
  addCard: (column: string) => string;
  count: (count: number, limit?: number) => string;
  overLimit: (over: number, limit: number) => string;
  priority: Record<KanbanPriority, string>;
  due: (date: string, status: KanbanDueStatus) => string;
  assigned: (names: string[]) => string;
  pickedUp: (card: string, column: string, position: number, total: number) => string;
  moved: (card: string, column: string, position: number, total: number) => string;
  dropped: (card: string, column: string, position: number, total: number) => string;
  cancelled: (card: string, column: string, position: number) => string;
  columnOverLimit: (column: string, limit: number) => string;
  notAllowed: (card: string, column: string) => string;
}

export type KanbanDueStatus = "overdue" | "soon" | "upcoming";

export interface KanbanBoardProps<T extends KanbanCard = KanbanCard>
  extends Omit<React.ComponentProps<"div">, "children" | "defaultValue" | "onChange"> {
  columns: readonly KanbanColumn[];
  /** Cards in display order. Pass with `onCardsChange` to control them. */
  cards?: readonly T[];
  defaultCards?: readonly T[];
  /** Receives every card in its new order after a drop. */
  onCardsChange?: (cards: T[]) => void;
  /** Called after a drop that changed a card's position. `card` already has its new column. */
  onMove?: (card: T, from: string, to: string, index: number) => void;
  /** Return false to refuse a column while dragging. */
  canMove?: (card: T, from: KanbanColumn, to: KanbanColumn) => boolean;
  /** Refuse drops into columns that are already at their limit. Defaults to false, so limits only warn. */
  enforceLimits?: boolean;
  /** Called on click. When set, Enter opens the card and Space picks it up. */
  onCardClick?: (card: T) => void;
  /** Adds a ghost plus button to every column header. */
  onAddCard?: (column: KanbanColumn) => void;
  /** Draw the inside of a card yourself. `KanbanCardContent` is the built-in body. */
  renderCard?: (card: T, state: KanbanCardState) => React.ReactNode;
  /** Minimum column width in pixels. Columns grow to fill wide boards. Defaults to 272. */
  columnWidth?: number;
  /** Height limit for each column; its cards scroll beyond this. */
  maxHeight?: number | string;
  /** Formats due dates. Defaults to a short month and day. */
  formatDue?: (date: Date) => string;
  /** Today, for overdue and due soon colors. Defaults to the client's date after mount. */
  now?: Date;
  locale?: string;
  labels?: Partial<KanbanBoardLabels>;
}

const LABELS: KanbanBoardLabels = {
  board: "Board",
  cardRole: "draggable card",
  instructions:
    "Press Space or Enter to pick up the card. Use the arrow keys to move it between positions and columns, Space or Enter to drop it, and Escape to cancel.",
  liftedHint: "Arrow keys move it, Space drops it, Escape cancels.",
  empty: "Drop a card here",
  blocked: "Can't move here",
  addCard: (column) => `Add card to ${column}`,
  count: (count, limit) =>
    limit === undefined
      ? `${count} ${count === 1 ? "card" : "cards"}`
      : `${count} of ${limit} cards`,
  overLimit: (over, limit) => `${over} over the limit of ${limit}`,
  priority: {
    urgent: "Urgent priority",
    high: "High priority",
    medium: "Medium priority",
    low: "Low priority",
  },
  due: (date, status) =>
    status === "overdue" ? `Overdue, due ${date}` : status === "soon" ? `Due soon, ${date}` : `Due ${date}`,
  assigned: (names) => `Assigned to ${names.join(", ")}`,
  pickedUp: (card, column, position, total) =>
    `Picked up ${card}. Position ${position} of ${total} in ${column}.`,
  moved: (card, column, position, total) => `${card}, position ${position} of ${total} in ${column}.`,
  dropped: (card, column, position, total) =>
    `Dropped ${card} in ${column}, position ${position} of ${total}.`,
  cancelled: (card, column, position) =>
    `Move cancelled. ${card} is back in ${column}, position ${position}.`,
  columnOverLimit: (column, limit) => `${column} is over its limit of ${limit}.`,
  notAllowed: (card, column) => `${card} can't move to ${column}.`,
};

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------------------------*/

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const subscribeNothing = () => () => {};
function useMounted() {
  return React.useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const CHART = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function hashColor(key: string) {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return CHART[hash % CHART.length];
}

/** Moves a card to `index` among the other cards of `column`, and returns the new array. */
export function moveKanbanCard<T extends KanbanCard>(
  cards: readonly T[],
  id: string,
  column: string,
  index: number,
): T[] {
  const card = cards.find((item) => item.id === id);
  if (!card) return [...cards];
  const rest = cards.filter((item) => item.id !== id);
  const moved = card.column === column ? card : ({ ...card, column } as T);
  let seen = 0;
  let at = -1;
  let last = -1;
  for (let i = 0; i < rest.length; i++) {
    if (rest[i].column !== column) continue;
    if (seen === index) {
      at = i;
      break;
    }
    seen++;
    last = i;
  }
  if (at === -1) at = last === -1 ? rest.length : last + 1;
  rest.splice(at, 0, moved);
  return rest;
}

function parseDue(due: string | Date | undefined) {
  if (!due) return null;
  if (due instanceof Date) return Number.isNaN(due.getTime()) ? null : due;
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(due);
  const date = day ? new Date(+day[1], +day[2] - 1, +day[3]) : new Date(due);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dueStatus(date: Date, today: Date): KanbanDueStatus {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  if (day < start) return "overdue";
  if (day - start <= 2 * 86_400_000) return "soon";
  return "upcoming";
}

const labelName = (label: string | KanbanLabel) => (typeof label === "string" ? label : label.name);
const labelColor = (label: string | KanbanLabel) =>
  (typeof label === "string" ? undefined : label.color) ?? hashColor(labelName(label));

const INTERACTIVE = "button, a, input, textarea, select, label, [contenteditable], [data-kanban-no-drag]";

/* -------------------------------------------------------------------------------------------------
 * Card pieces
 * -----------------------------------------------------------------------------------------------*/

function PriorityIcon({ priority, label }: { priority: KanbanPriority; label: string }) {
  if (priority === "urgent")
    return (
      <svg
        role="img"
        aria-label={label}
        viewBox="0 0 16 16"
        data-slot="kanban-priority"
        data-priority={priority}
        className="size-4 shrink-0 text-rose-600 dark:text-rose-400"
      >
        <title>{label}</title>
        <rect x="1.5" y="1.5" width="13" height="13" rx="3.5" fill="currentColor" />
        <path d="M8 4.75v4" stroke="var(--color-card)" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="8" cy="11.25" r="1" fill="var(--color-card)" />
      </svg>
    );
  const filled = priority === "high" ? 3 : priority === "medium" ? 2 : 1;
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 16 16"
      data-slot="kanban-priority"
      data-priority={priority}
      className="size-4 shrink-0 text-foreground/70"
    >
      <title>{label}</title>
      {[0, 1, 2].map((bar) => (
        <rect
          key={bar}
          x={2 + bar * 4.5}
          y={13.5 - (4.5 + bar * 3)}
          width="3"
          height={4.5 + bar * 3}
          rx="1"
          fill="currentColor"
          opacity={bar < filled ? 1 : 0.22}
        />
      ))}
    </svg>
  );
}

function Avatar({ person }: { person: KanbanAssignee }) {
  const [failed, setFailed] = React.useState<string>();
  const initials = person.name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const image = person.image && person.image !== failed;
  return (
    <span
      title={person.name}
      data-slot="kanban-avatar"
      style={{ "--kanban-tint": hashColor(person.id ?? person.name) } as React.CSSProperties}
      className={cn(
        "relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px] leading-none font-semibold tracking-tight ring-2 ring-card",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:ring-1 after:ring-foreground/10 after:ring-inset",
        image
          ? "bg-muted"
          : "bg-[color-mix(in_oklab,var(--kanban-tint)_16%,var(--color-card))] text-[color-mix(in_oklab,var(--kanban-tint)_58%,var(--color-foreground))]",
      )}
    >
      {image ? (
        <img src={person.image} alt="" className="size-full object-cover" onError={() => setFailed(person.image)} />
      ) : (
        initials || "?"
      )}
    </span>
  );
}

const defaultFormatDue = (locale?: string) => {
  const format = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
  return (date: Date) => format.format(date);
};

export interface KanbanCardContentProps {
  card: KanbanCard;
  /** Today, for overdue and due soon colors. Leave undefined to show due dates without status. */
  today?: Date | null;
  formatDue?: (date: Date) => string;
  locale?: string;
  labels?: Partial<Pick<KanbanBoardLabels, "priority" | "due">>;
}

/** The built-in card body: labels, title, description, then priority, meta, due date and assignees. */
export function KanbanCardContent({ card, today, formatDue, locale, labels: labelsProp }: KanbanCardContentProps) {
  const labels = { ...LABELS, ...labelsProp };
  const due = parseDue(card.due);
  const status = due && today ? dueStatus(due, today) : null;
  const dueText = due ? (formatDue ?? defaultFormatDue(locale))(due) : null;
  const assignees = card.assignees ?? [];
  const shown = assignees.slice(0, 3);
  const hasFooter = card.priority || card.meta != null || due || assignees.length > 0;
  return (
    <>
      {card.labels && card.labels.length > 0 && (
        <span data-slot="kanban-labels" className="mb-2 flex flex-wrap gap-1">
          {card.labels.map((label) => (
            <span
              key={labelName(label)}
              data-slot="kanban-label"
              className="inline-flex h-5 items-center gap-1.5 rounded-md bg-muted/70 px-1.5 text-[11px] leading-none font-medium text-foreground/80 ring-1 ring-border/50 ring-inset dark:bg-muted/50"
            >
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full"
                style={{ background: labelColor(label) }}
              />
              {labelName(label)}
            </span>
          ))}
        </span>
      )}
      <span data-slot="kanban-card-title" className="block text-[13px] leading-5 font-medium tracking-[-0.006em] text-foreground">
        {card.title}
      </span>
      {card.description && (
        <span
          data-slot="kanban-card-description"
          className="mt-1 line-clamp-2 block text-xs leading-[18px] text-muted-foreground"
        >
          {card.description}
        </span>
      )}
      {hasFooter && (
        <span data-slot="kanban-card-footer" className="mt-3 flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1.5">
          {card.priority && <PriorityIcon priority={card.priority} label={labels.priority[card.priority]} />}
          {card.meta != null && (
            <span data-slot="kanban-card-meta" className="flex min-w-0 items-center gap-2 text-[11px] whitespace-nowrap text-muted-foreground">
              {card.meta}
            </span>
          )}
          {dueText && (
            <span
              data-slot="kanban-due"
              data-status={status ?? undefined}
              title={labels.due(dueText, status ?? "upcoming")}
              className={cn(
                "inline-flex h-5 shrink-0 items-center gap-1 rounded-md px-1 text-[11px] font-medium whitespace-nowrap text-muted-foreground tabular-nums",
                status === "overdue" && "bg-rose-500/10 text-rose-700 dark:bg-rose-400/10 dark:text-rose-400",
                status === "soon" && "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400",
              )}
            >
              <Calendar className="size-3.5 opacity-80" aria-hidden="true" stroke={1.75} />
              {dueText}
            </span>
          )}
          {assignees.length > 0 && (
            <span data-slot="kanban-assignees" className="ml-auto flex shrink-0 items-center -space-x-0.5">
              {shown.map((person) => (
                <Avatar key={person.id ?? person.name} person={person} />
              ))}
              {assignees.length > shown.length && (
                <span className="relative flex size-6 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground tabular-nums ring-2 ring-card">
                  +{assignees.length - shown.length}
                </span>
              )}
            </span>
          )}
        </span>
      )}
    </>
  );
}

const cardSurface = cn(
  "relative block w-full rounded-xl border border-border/70 bg-card p-3 text-left text-card-foreground",
  "shadow-[0_1px_2px_rgb(0_0_0/0.04),0_2px_8px_-4px_rgb(0_0_0/0.06)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.04),0_1px_2px_rgb(0_0_0/0.45)]",
);

/* -------------------------------------------------------------------------------------------------
 * KanbanBoard
 * -----------------------------------------------------------------------------------------------*/

interface DragState {
  mode: "pointer" | "keyboard";
  id: string;
  from: string;
  fromIndex: number;
  /** Where the card will land: a column and an index among that column's other cards. */
  column: string;
  index: number;
  /** A column under the pointer that refuses the card. */
  blocked: string | null;
  width: number;
  height: number;
  phase: "dragging" | "settling";
}

interface Pending {
  id: string;
  pointerId: number;
  pointerType: string;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  timer: number | null;
}

const styles = `@keyframes kanban-board-lift{from{scale:1;rotate:0deg;box-shadow:0 1px 2px rgb(0 0 0/.04),0 2px 8px -4px rgb(0 0 0/.06)}}`;

/**
 * A board of columns and cards with native pointer and keyboard drag and drop, WIP limits,
 * auto-scroll near edges and live announcements.
 */
export function KanbanBoard<T extends KanbanCard = KanbanCard>({
  columns,
  cards: cardsProp,
  defaultCards,
  onCardsChange,
  onMove,
  canMove,
  enforceLimits = false,
  onCardClick,
  onAddCard,
  renderCard,
  columnWidth = 272,
  maxHeight,
  formatDue,
  now,
  locale,
  labels: labelsProp,
  className,
  style,
  ...props
}: KanbanBoardProps<T>) {
  const labels = { ...LABELS, ...labelsProp, priority: { ...LABELS.priority, ...labelsProp?.priority } };
  const id = React.useId();
  const mounted = useMounted();
  const today = now ?? (mounted ? new Date() : null);
  const dueFormatter = React.useMemo(() => formatDue ?? defaultFormatDue(locale), [formatDue, locale]);

  const [internal, setInternal] = React.useState<readonly T[]>(() => defaultCards ?? []);
  const cards = cardsProp ?? internal;

  const [drag, setDragState] = React.useState<DragState | null>(null);
  const dragRef = React.useRef<DragState | null>(null);
  const setDrag = (next: DragState | null) => {
    dragRef.current = next;
    setDragState(next);
  };

  const [announcement, setAnnouncement] = React.useState("");
  const announce = (text: string) =>
    setAnnouncement((current) => (current === text ? `${text}\u00a0` : text));

  const rootRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const columnRefs = React.useRef(new Map<string, HTMLElement>());
  const bodyRefs = React.useRef(new Map<string, HTMLElement>());
  const itemRefs = React.useRef(new Map<string, HTMLElement>());
  const cardRefs = React.useRef(new Map<string, HTMLElement>());
  const pending = React.useRef<Pending | null>(null);
  const pointer = React.useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const flipFrom = React.useRef<Map<string, DOMRect> | null>(null);
  const suppressClick = React.useRef(false);
  const listeners = React.useRef<{
    move: (event: PointerEvent) => void;
    up: (event: PointerEvent) => void;
    cancel: (event: PointerEvent) => void;
  } | null>(null);

  // Cards per column, in order. Cards whose column is unknown are not shown.
  const preview = React.useMemo(
    () =>
      drag?.mode === "keyboard" ? moveKanbanCard(cards, drag.id, drag.column, drag.index) : cards,
    [cards, drag],
  );
  const byColumn = React.useMemo(() => {
    const map = new Map<string, T[]>(columns.map((column) => [column.id, []]));
    for (const card of preview) map.get(card.column)?.push(card);
    return map;
  }, [columns, preview]);

  // Everything the window listeners need, always current.
  const controlled = cardsProp !== undefined;
  const latest = React.useRef({ cards, columns, canMove, enforceLimits, labels, controlled, onCardsChange, onMove });
  useIsoLayoutEffect(() => {
    latest.current = { cards, columns, canMove, enforceLimits, labels, controlled, onCardsChange, onMove };
  });

  /* ------------------------------- Geometry and rules ------------------------------- */

  const columnOf = (columnId: string) => latest.current.columns.find((column) => column.id === columnId);
  const othersIn = (columnId: string, cardId: string) =>
    latest.current.cards.filter((card) => card.column === columnId && card.id !== cardId);
  /** Position of a card among the other cards of its column. */
  const positionOf = (card: T) => {
    const all = latest.current.cards;
    const at = all.indexOf(card);
    return othersIn(card.column, card.id).filter((item) => all.indexOf(item) < at).length;
  };

  const allows = (card: T, from: string, to: string) => {
    if (from === to) return true;
    const fromColumn = columnOf(from);
    const toColumn = columnOf(to);
    if (!fromColumn || !toColumn) return false;
    if (latest.current.canMove && !latest.current.canMove(card, fromColumn, toColumn)) return false;
    if (
      latest.current.enforceLimits &&
      toColumn.limit !== undefined &&
      othersIn(to, card.id).length >= toColumn.limit
    )
      return false;
    return true;
  };

  const columnAt = (x: number) => {
    let best: string | null = null;
    let distance = Infinity;
    for (const column of latest.current.columns) {
      const element = columnRefs.current.get(column.id);
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      const d = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
      if (d < distance) {
        distance = d;
        best = column.id;
      }
    }
    return best;
  };

  const indexAt = (columnId: string, cardId: string, y: number) => {
    let index = 0;
    for (const card of othersIn(columnId, cardId)) {
      const element = itemRefs.current.get(card.id);
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      if (rect.height && rect.top + rect.height / 2 < y) index++;
    }
    return index;
  };

  /* ------------------------------------ Motion ------------------------------------ */

  const snapshot = () => {
    if (reducedMotion()) return;
    const map = new Map<string, DOMRect>();
    itemRefs.current.forEach((element, key) => map.set(key, element.getBoundingClientRect()));
    flipFrom.current = map;
  };

  // FLIP: cards glide from where they were before the last move.
  useIsoLayoutEffect(() => {
    const from = flipFrom.current;
    if (!from) return;
    flipFrom.current = null;
    itemRefs.current.forEach((element, key) => {
      const before = from.get(key);
      if (!before || !before.width) return;
      for (const animation of element.getAnimations?.() ?? [])
        if (animation.id === "kanban-flip") animation.cancel();
      const after = element.getBoundingClientRect();
      if (!after.width) return;
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
      const animation = element.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }],
        { duration: 260, easing: EASE },
      );
      animation.id = "kanban-flip";
    });
  });

  const positionOverlay = () => {
    const overlay = overlayRef.current;
    const root = rootRef.current;
    if (!overlay || !root || dragRef.current?.phase !== "dragging") return;
    const rect = root.getBoundingClientRect();
    const { x, y, offsetX, offsetY } = pointer.current;
    overlay.style.transform = `translate3d(${x - offsetX - rect.left}px, ${y - offsetY - rect.top}px, 0)`;
  };

  /* ------------------------------------ Commit ------------------------------------ */

  const describe = (columnId: string, index: number, cardId: string) => {
    const total = othersIn(columnId, cardId).length + 1;
    return { column: columnOf(columnId)?.title ?? columnId, position: index + 1, total };
  };

  const commit = (d: DragState) => {
    const card = latest.current.cards.find((item) => item.id === d.id);
    if (!card || (d.column === d.from && d.index === d.fromIndex)) return;
    const next = moveKanbanCard(latest.current.cards, d.id, d.column, d.index);
    if (!latest.current.controlled) setInternal(next);
    latest.current.onCardsChange?.(next);
    latest.current.onMove?.(next.find((item) => item.id === d.id) ?? card, d.from, d.column, d.index);
  };

  const overLimitNote = (d: DragState) => {
    const column = columnOf(d.column);
    if (!column || column.limit === undefined || d.column === d.from) return "";
    return othersIn(d.column, d.id).length + 1 > column.limit
      ? ` ${latest.current.labels.columnOverLimit(column.title, column.limit)}`
      : "";
  };

  /* ------------------------------------ Pointer ------------------------------------ */

  const updateTarget = () => {
    const d = dragRef.current;
    if (!d || d.mode !== "pointer" || d.phase !== "dragging") return;
    const card = latest.current.cards.find((item) => item.id === d.id);
    const over = columnAt(pointer.current.x);
    if (!card || !over) return;
    let next: DragState;
    if (!allows(card, d.from, over)) {
      next = { ...d, column: d.from, index: d.fromIndex, blocked: over };
    } else {
      next = { ...d, column: over, index: indexAt(over, d.id, pointer.current.y), blocked: null };
    }
    if (next.column === d.column && next.index === d.index && next.blocked === d.blocked) return;
    snapshot();
    setDrag(next);
  };

  const endPointerTracking = () => {
    const p = pending.current;
    if (p?.timer) window.clearTimeout(p.timer);
    pending.current = null;
    const active = listeners.current;
    listeners.current = null;
    if (!active) return;
    window.removeEventListener("pointermove", active.move);
    window.removeEventListener("pointerup", active.up);
    window.removeEventListener("pointercancel", active.cancel);
  };

  const startPointerDrag = () => {
    const p = pending.current;
    const card = p && latest.current.cards.find((item) => item.id === p.id);
    if (!p || !card) return;
    if (p.timer) window.clearTimeout(p.timer);
    p.timer = null;
    const index = positionOf(card);
    pointer.current.offsetX = p.offsetX;
    pointer.current.offsetY = p.offsetY;
    try {
      rootRef.current?.setPointerCapture(p.pointerId);
    } catch {
      // The pointer may already be gone.
    }
    document.body.style.setProperty("cursor", "grabbing");
    document.body.style.setProperty("user-select", "none");
    document.body.style.setProperty("-webkit-user-select", "none");
    setDrag({
      mode: "pointer",
      id: card.id,
      from: card.column,
      fromIndex: index,
      column: card.column,
      index,
      blocked: null,
      width: p.width,
      height: p.height,
      phase: "dragging",
    });
    const where = describe(card.column, index, card.id);
    announce(latest.current.labels.pickedUp(card.title, where.column, where.position, where.total));
  };

  function handlePointerMove(event: PointerEvent) {
    const p = pending.current;
    if (!p || event.pointerId !== p.pointerId) return;
    pointer.current.x = event.clientX;
    pointer.current.y = event.clientY;
    if (!dragRef.current) {
      const distance = Math.hypot(event.clientX - p.startX, event.clientY - p.startY);
      if (p.pointerType === "touch") {
        // Moving before the long press means the person is scrolling.
        if (distance > 8) endPointerTracking();
        return;
      }
      if (distance < 4) return;
      startPointerDrag();
    }
    positionOverlay();
    updateTarget();
  }

  const finishPointerDrag = (cancelled: boolean) => {
    const d = dragRef.current;
    endPointerTracking();
    document.body.style.removeProperty("cursor");
    document.body.style.removeProperty("user-select");
    document.body.style.removeProperty("-webkit-user-select");
    if (!d || d.mode !== "pointer" || d.phase !== "dragging") return;
    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 0);
    const card = latest.current.cards.find((item) => item.id === d.id);
    const final = cancelled ? { ...d, column: d.from, index: d.fromIndex } : d;
    if (card) {
      if (cancelled) {
        const where = describe(d.from, d.fromIndex, d.id);
        announce(latest.current.labels.cancelled(card.title, where.column, where.position));
      } else {
        const where = describe(final.column, final.index, d.id);
        announce(
          latest.current.labels.dropped(card.title, where.column, where.position, where.total) +
            overLimitNote(final),
        );
      }
    }
    commit(final);
    setDrag({ ...final, blocked: null, phase: "settling" });
  };

  function handlePointerUp(event: PointerEvent) {
    const p = pending.current;
    if (!p || event.pointerId !== p.pointerId) return;
    if (!dragRef.current) {
      endPointerTracking();
      return;
    }
    finishPointerDrag(false);
  }

  function handlePointerCancel(event: PointerEvent) {
    const p = pending.current;
    if (!p || event.pointerId !== p.pointerId) return;
    if (!dragRef.current) endPointerTracking();
    else finishPointerDrag(true);
  }

  const handleCardPointerDown = (card: T, event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || dragRef.current || pending.current) return;
    const target = event.target as Element;
    if (target !== event.currentTarget && target.closest(INTERACTIVE)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pending.current = {
      id: card.id,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      timer: null,
    };
    pointer.current.x = event.clientX;
    pointer.current.y = event.clientY;
    if (event.pointerType === "touch") {
      pending.current.timer = window.setTimeout(() => {
        startPointerDrag();
        positionOverlay();
        navigator.vibrate?.(8);
      }, 240);
    }
    // Keep the exact functions so a later render can remove them.
    listeners.current = { move: handlePointerMove, up: handlePointerUp, cancel: handlePointerCancel };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);
  };

  const pointerDragging = drag?.mode === "pointer" && drag.phase === "dragging";

  // While dragging: auto-scroll near edges, follow page scroll, cancel with Escape, block touch scrolling.
  React.useEffect(() => {
    if (!pointerDragging) return;
    let frame = 0;
    const edgeScroll = (element: HTMLElement, position: number, axis: "x" | "y") => {
      const rect = element.getBoundingClientRect();
      const start = axis === "x" ? rect.left : rect.top;
      const end = axis === "x" ? rect.right : rect.bottom;
      const zone = Math.min(72, (end - start) / 4);
      const max =
        axis === "x" ? element.scrollWidth - element.clientWidth : element.scrollHeight - element.clientHeight;
      const current = axis === "x" ? element.scrollLeft : element.scrollTop;
      let delta = 0;
      if (position < start + zone && current > 0) delta = -((start + zone - position) / zone) * 18;
      else if (position > end - zone && current < max - 0.5) delta = ((position - (end - zone)) / zone) * 18;
      if (!delta) return false;
      delta = Math.max(-24, Math.min(24, delta));
      if (axis === "x") element.scrollLeft += delta;
      else element.scrollTop += delta;
      return true;
    };
    const tick = () => {
      const { x, y } = pointer.current;
      const scroller = scrollerRef.current;
      let moved = false;
      if (scroller && scroller.scrollWidth > scroller.clientWidth) moved = edgeScroll(scroller, x, "x");
      const over = columnAt(x);
      const body = over ? bodyRefs.current.get(over) : undefined;
      if (body && body.scrollHeight > body.clientHeight + 1) moved = edgeScroll(body, y, "y") || moved;
      const zone = 40;
      if (y < zone && window.scrollY > 0) {
        window.scrollBy(0, -Math.ceil(((zone - y) / zone) * 14));
        moved = true;
      } else if (y > window.innerHeight - zone) {
        const before = window.scrollY;
        window.scrollBy(0, Math.ceil(((y - (window.innerHeight - zone)) / zone) * 14));
        moved = moved || window.scrollY !== before;
      }
      if (moved) {
        positionOverlay();
        updateTarget();
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    const onScroll = () => {
      positionOverlay();
      updateTarget();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finishPointerDrag(true);
      }
    };
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("keydown", onKey, true);
    };
  }, [pointerDragging]);

  // Touch scrolling can only be blocked by a listener that exists before the touch starts.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onTouchMove = (event: TouchEvent) => {
      const d = dragRef.current;
      if (d?.mode === "pointer" && d.phase === "dragging" && event.cancelable) event.preventDefault();
    };
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => root.removeEventListener("touchmove", onTouchMove);
  }, []);

  // Place the overlay as soon as it mounts.
  useIsoLayoutEffect(() => {
    if (pointerDragging) positionOverlay();
  }, [pointerDragging]);

  // Settle: the lifted card glides into its slot, then the real card takes over.
  const settling = drag?.mode === "pointer" && drag.phase === "settling" ? drag : null;
  useIsoLayoutEffect(() => {
    if (!settling) return;
    const overlay = overlayRef.current;
    const target = itemRefs.current.get(settling.id);
    const root = rootRef.current;
    const finish = () => setDrag(null);
    if (!overlay || !target || !root || reducedMotion()) {
      finish();
      return;
    }
    const rect = target.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    overlay.style.transition = `transform 280ms ${EASE}`;
    overlay.style.transform = `translate3d(${rect.left - rootRect.left}px, ${rect.top - rootRect.top}px, 0)`;
    const onEnd = (event: TransitionEvent) => {
      if (event.target === overlay) finish();
    };
    overlay.addEventListener("transitionend", onEnd);
    const timer = window.setTimeout(finish, 360);
    return () => {
      overlay.removeEventListener("transitionend", onEnd);
      window.clearTimeout(timer);
    };
  }, [settling]);

  // Clean up anything left behind on unmount.
  React.useEffect(
    () => () => {
      endPointerTracking();
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
      document.body.style.removeProperty("-webkit-user-select");
    },
    [],
  );

  /* ----------------------------------- Keyboard ----------------------------------- */

  // After a keyboard drop the card may have been re-mounted; give it focus back.
  const refocus = React.useRef<string | null>(null);
  useIsoLayoutEffect(() => {
    const target = refocus.current;
    if (!target) return;
    refocus.current = null;
    const element = cardRefs.current.get(target);
    if (element && document.activeElement !== element) element.focus({ preventScroll: true });
  });

  const keyboardId = drag?.mode === "keyboard" ? drag.id : null;
  const keyboardColumn = drag?.mode === "keyboard" ? drag.column : null;
  const keyboardIndex = drag?.mode === "keyboard" ? drag.index : null;

  // The held card moves through the DOM; keep focus on it and keep it in view.
  useIsoLayoutEffect(() => {
    if (!keyboardId) return;
    const element = cardRefs.current.get(keyboardId);
    if (!element) return;
    if (document.activeElement !== element) element.focus({ preventScroll: true });
    element.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [keyboardId, keyboardColumn, keyboardIndex]);

  const liftWithKeyboard = (card: T) => {
    const index = positionOf(card);
    setDrag({
      mode: "keyboard",
      id: card.id,
      from: card.column,
      fromIndex: index,
      column: card.column,
      index,
      blocked: null,
      width: 0,
      height: 0,
      phase: "dragging",
    });
    const where = describe(card.column, index, card.id);
    announce(`${labels.pickedUp(card.title, where.column, where.position, where.total)} ${labels.liftedHint}`);
  };

  const moveWithKeyboard = (d: DragState, card: T, key: string) => {
    let next: DragState | null = null;
    if (key === "ArrowUp" || key === "ArrowDown") {
      const count = othersIn(d.column, d.id).length;
      const index = Math.max(0, Math.min(count, d.index + (key === "ArrowUp" ? -1 : 1)));
      if (index !== d.index) next = { ...d, index };
    } else {
      const order = latest.current.columns.map((column) => column.id);
      const step = key === "ArrowLeft" ? -1 : 1;
      let refused: string | null = null;
      for (let at = order.indexOf(d.column) + step; at >= 0 && at < order.length; at += step) {
        if (!allows(card, d.from, order[at])) {
          refused ??= order[at];
          continue;
        }
        const count = othersIn(order[at], d.id).length;
        next = { ...d, column: order[at], index: Math.min(d.index, count) };
        break;
      }
      if (!next && refused) {
        announce(labels.notAllowed(card.title, columnOf(refused)?.title ?? refused));
        return;
      }
    }
    if (!next) return;
    snapshot();
    setDrag(next);
    const where = describe(next.column, next.index, next.id);
    announce(labels.moved(card.title, where.column, where.position, where.total) + overLimitNote(next));
  };

  const dropWithKeyboard = (d: DragState, card: T, cancelled: boolean) => {
    const final = cancelled ? { ...d, column: d.from, index: d.fromIndex } : d;
    if (cancelled) {
      const where = describe(d.from, d.fromIndex, d.id);
      announce(labels.cancelled(card.title, where.column, where.position));
    } else {
      const where = describe(final.column, final.index, d.id);
      announce(labels.dropped(card.title, where.column, where.position, where.total) + overLimitNote(final));
    }
    snapshot();
    commit(final);
    refocus.current = d.id;
    setDrag(null);
  };

  const handleCardKeyDown = (card: T, event: React.KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    const d = dragRef.current;
    if (!d) {
      if (event.key === " " || (event.key === "Enter" && !onCardClick)) {
        event.preventDefault();
        liftWithKeyboard(card);
      } else if (event.key === "Enter" && onCardClick) {
        event.preventDefault();
        onCardClick(card);
      }
      return;
    }
    if (d.mode !== "keyboard" || d.id !== card.id) return;
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        moveWithKeyboard(d, card, event.key);
        break;
      case " ":
      case "Enter":
        dropWithKeyboard(d, card, false);
        break;
      case "Escape":
        dropWithKeyboard(d, card, true);
        break;
      case "Tab":
        break;
      default:
        return;
    }
    event.preventDefault();
    event.stopPropagation();
  };

  const handleCardBlur = (card: T) => {
    if (dragRef.current?.mode !== "keyboard" || dragRef.current.id !== card.id) return;
    // A held card is re-mounted when it changes column; only cancel when focus really left.
    window.requestAnimationFrame(() => {
      const d = dragRef.current;
      if (!d || d.mode !== "keyboard" || d.id !== card.id) return;
      if (document.activeElement === cardRefs.current.get(card.id)) return;
      dropWithKeyboard(d, card, true);
    });
  };

  /* ------------------------------------ Scroll fade ------------------------------------ */

  const [edges, setEdges] = React.useState({ start: false, end: false });
  const measureEdges = React.useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const start = scroller.scrollLeft > 1;
    const end = scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth - 1;
    setEdges((current) => (current.start === start && current.end === end ? current : { start, end }));
  }, []);
  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    measureEdges();
    const observer = new ResizeObserver(measureEdges);
    observer.observe(scroller);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
    return () => observer.disconnect();
  }, [measureEdges, columns.length]);

  // Fade the side that has more to scroll to. The fade ends at the board's own edge, inside the
  // scroller's 12px gutter, so it reads the same when an ancestor clips that gutter.
  const fadeStart = (side: boolean, from: string, to: string) =>
    side ? `transparent ${from}, transparent ${to}` : `#000 ${from}, #000 ${to}`;
  const mask =
    edges.start || edges.end
      ? `linear-gradient(to right, ${fadeStart(edges.start, "0px", "12px")}, #000 ${edges.start ? 52 : 12}px, #000 calc(100% - ${edges.end ? 52 : 12}px), ${fadeStart(edges.end, "calc(100% - 12px)", "100%")})`
      : undefined;

  /* ------------------------------------ Render ------------------------------------ */

  const instructionsId = `${id}-instructions`;
  const draggedCard = drag ? cards.find((card) => card.id === drag.id) : undefined;

  const cardBody = (card: T, column: KanbanColumn, dragging: boolean, overlay: boolean) =>
    renderCard ? (
      renderCard(card, { column, dragging, overlay })
    ) : (
      <KanbanCardContent card={card} today={today} formatDue={dueFormatter} labels={labels} />
    );

  const summary = (card: T) => {
    const parts: string[] = [];
    if (card.description) parts.push(card.description);
    if (card.priority) parts.push(labels.priority[card.priority]);
    const due = parseDue(card.due);
    if (due) parts.push(labels.due(dueFormatter(due), today ? dueStatus(due, today) : "upcoming"));
    if (card.labels?.length) parts.push(card.labels.map(labelName).join(", "));
    if (card.assignees?.length) parts.push(labels.assigned(card.assignees.map((person) => person.name)));
    return parts.join(". ");
  };

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={props["aria-label"] ?? labels.board}
      data-slot="kanban-board"
      data-dragging={drag ? drag.mode : undefined}
      className={cn("@container/kanban relative min-w-0", className)}
      style={{ "--kanban-column-width": `${columnWidth}px`, ...style } as React.CSSProperties}
      {...props}
    >
      <style href="overtrue-kanban-board" precedence="default">
        {styles}
      </style>

      <div
        ref={scrollerRef}
        data-slot="kanban-scroller"
        onScroll={measureEdges}
        className={cn(
          "-mx-3 -mb-3 overflow-x-auto overscroll-x-contain px-3 pb-3",
          "snap-x snap-proximity scroll-px-3 [scrollbar-width:thin]",
          drag && "snap-none",
        )}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        <div data-slot="kanban-columns" className="flex w-max min-w-full items-stretch gap-3">
          {columns.map((column, columnIndex) => {
            const list = byColumn.get(column.id) ?? [];
            const isTarget = !!drag && drag.phase === "dragging" && drag.column === column.id;
            const isBlocked = !!drag && drag.phase === "dragging" && drag.blocked === column.id;
            const placeholderHere = pointerDragging && drag.column === column.id;
            const visibleCount = pointerDragging
              ? list.filter((card) => card.id !== drag.id).length + (placeholderHere ? 1 : 0)
              : list.length;
            const over = column.limit !== undefined && visibleCount > column.limit;
            const accent = column.color ?? CHART[columnIndex % CHART.length];
            const titleId = `${id}-column-${columnIndex}`;

            // Cards with the placeholder spliced in. The dragged card stays mounted but hidden,
            // so touch and pointer events keep reaching the board.
            const items: React.ReactNode[] = [];
            let seen = 0;
            let placed = false;
            const placeholder = (
              <li
                key="kanban-placeholder"
                aria-hidden="true"
                data-slot="kanban-placeholder"
                className="rounded-xl border border-dashed border-primary/45 bg-primary/[0.05] dark:bg-primary/[0.08]"
                style={{ height: drag?.height }}
              />
            );
            for (const card of list) {
              const hidden = pointerDragging && card.id === drag.id;
              if (!hidden && placeholderHere && !placed && seen === drag.index) {
                items.push(placeholder);
                placed = true;
              }
              if (!hidden) seen++;
              const lifted = drag?.mode === "keyboard" && drag.id === card.id;
              const ghost = !!settling && settling.id === card.id;
              items.push(
                <li
                  key={card.id}
                  ref={(node) => {
                    if (node) itemRefs.current.set(card.id, node);
                    else itemRefs.current.delete(card.id);
                  }}
                  hidden={hidden}
                  className={cn("relative", lifted && "z-10")}
                >
                  <div
                    ref={(node) => {
                      if (node) cardRefs.current.set(card.id, node);
                      else cardRefs.current.delete(card.id);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-roledescription={labels.cardRole}
                    aria-label={card.title}
                    aria-describedby={`${id}-card-${card.id}-summary ${instructionsId}`}
                    aria-pressed={lifted || undefined}
                    data-slot="kanban-card"
                    data-card-id={card.id}
                    data-lifted={lifted || undefined}
                    data-settling={ghost || undefined}
                    onPointerDown={(event) => handleCardPointerDown(card, event)}
                    onKeyDown={(event) => handleCardKeyDown(card, event)}
                    onBlur={() => handleCardBlur(card)}
                    onClick={() => {
                      if (suppressClick.current || dragRef.current) return;
                      onCardClick?.(card);
                    }}
                    onContextMenu={(event) => {
                      if (pending.current?.pointerType === "touch" || dragRef.current) event.preventDefault();
                    }}
                    className={cn(
                      cardSurface,
                      "cursor-grab touch-manipulation outline-none select-none [-webkit-touch-callout:none]",
                      "transition-[box-shadow,border-color,transform,scale] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                      "hover:border-border hover:shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_20px_-10px_rgb(0_0_0/0.18)] dark:hover:border-foreground/15",
                      "focus-visible:ring-2 focus-visible:ring-ring/50",
                      lifted &&
                        "scale-[1.02] cursor-grabbing border-primary/30 shadow-[0_2px_4px_rgb(0_0_0/0.05),0_12px_24px_-10px_rgb(0_0_0/0.22)] ring-2 ring-primary/30 hover:border-primary/30 hover:shadow-[0_2px_4px_rgb(0_0_0/0.05),0_12px_24px_-10px_rgb(0_0_0/0.22)] focus-visible:ring-primary/40 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_12px_24px_-8px_rgb(0_0_0/0.6)]",
                      ghost && "opacity-0 transition-none",
                    )}
                  >
                    {cardBody(card, column, lifted, false)}
                  </div>
                  <span id={`${id}-card-${card.id}-summary`} className="sr-only">
                    {summary(card)}
                  </span>
                </li>,
              );
            }
            if (placeholderHere && !placed) items.push(placeholder);
            if (!list.some((card) => !(pointerDragging && card.id === drag.id)) && !placeholderHere)
              items.push(
                <li
                  key="kanban-empty"
                  data-slot="kanban-empty"
                  className={cn(
                    "flex min-h-[88px] flex-1 items-center justify-center rounded-xl border border-dashed px-3 text-center text-xs text-muted-foreground transition-colors duration-150",
                    isBlocked ? "border-border/70" : "border-border",
                  )}
                >
                  {isBlocked ? labels.blocked : labels.empty}
                </li>,
              );

            return (
              <div
                key={column.id}
                ref={(node) => {
                  if (node) columnRefs.current.set(column.id, node);
                  else columnRefs.current.delete(column.id);
                }}
                role="group"
                aria-labelledby={titleId}
                data-slot="kanban-column"
                data-column-id={column.id}
                data-over-limit={over || undefined}
                data-drop-target={isTarget || undefined}
                data-blocked={isBlocked || undefined}
                className={cn(
                  "flex min-w-0 shrink-0 grow snap-start flex-col rounded-2xl ring-1 ring-border/60 ring-inset",
                  // An opaque well, so patterned backgrounds don't show through; states tint it.
                  "[--kanban-surface:color-mix(in_oklab,var(--color-muted)_42%,var(--color-background))] dark:[--kanban-surface:color-mix(in_oklab,var(--color-muted)_30%,var(--color-background))]",
                  "bg-[var(--kanban-surface)]",
                  "w-[min(var(--kanban-column-width),74cqw)] max-w-[max(var(--kanban-column-width),420px)]",
                  "transition-[background-color,box-shadow,opacity] duration-150 motion-reduce:transition-none",
                  isTarget &&
                    !over &&
                    "bg-[color-mix(in_oklab,var(--color-primary)_5%,var(--kanban-surface))] ring-primary/30 dark:bg-[color-mix(in_oklab,var(--color-primary)_8%,var(--kanban-surface))]",
                  over &&
                    "bg-[color-mix(in_oklab,var(--color-amber-500)_6%,var(--kanban-surface))] ring-amber-500/35 dark:bg-[color-mix(in_oklab,var(--color-amber-400)_6%,var(--kanban-surface))] dark:ring-amber-400/30",
                  isBlocked && "opacity-55",
                )}
                style={{ "--kanban-accent": accent, maxHeight } as React.CSSProperties}
              >
                <div data-slot="kanban-column-header" className="flex h-11 shrink-0 items-center gap-2 pr-2 pl-3.5">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full bg-[var(--kanban-accent)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--kanban-accent)_18%,transparent)]"
                  />
                  <h3 id={titleId} className="min-w-0 truncate text-sm font-semibold tracking-tight text-foreground">
                    {column.title}
                  </h3>
                  <span
                    data-slot="kanban-count"
                    aria-label={labels.count(visibleCount, column.limit)}
                    className={cn(
                      "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-card px-1.5 text-[11px] font-medium text-muted-foreground tabular-nums ring-1 ring-border/60 ring-inset",
                      over &&
                        "bg-amber-500/10 text-amber-700 ring-amber-600/25 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/25",
                    )}
                  >
                    {visibleCount}
                    {column.limit !== undefined && (
                      <span className={cn("ml-px", over ? "opacity-70" : "text-muted-foreground/65")}>/{column.limit}</span>
                    )}
                  </span>
                  <span className="flex-1" />
                  {onAddCard && (
                    <button
                      type="button"
                      onClick={() => onAddCard(column)}
                      aria-label={labels.addCard(column.title)}
                      title={labels.addCard(column.title)}
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
                    >
                      <Plus className="size-4" aria-hidden="true" stroke={1.75} />
                    </button>
                  )}
                </div>
                {over && column.limit !== undefined && (
                  <p
                    data-slot="kanban-limit-warning"
                    className="-mt-1 flex items-center gap-1.5 px-3.5 pb-2 text-xs text-amber-800 dark:text-amber-400"
                  >
                    <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" stroke={1.75} />
                    {labels.overLimit(visibleCount - column.limit, column.limit)}
                  </p>
                )}
                <ul
                  ref={(node) => {
                    if (node) bodyRefs.current.set(column.id, node);
                    else bodyRefs.current.delete(column.id);
                  }}
                  role="list"
                  data-slot="kanban-cards"
                  className={cn(
                    "flex min-h-0 flex-1 flex-col gap-2 px-2 pt-0.5 pb-2",
                    maxHeight !== undefined && "overflow-y-auto overscroll-y-contain [scrollbar-width:thin]",
                  )}
                >
                  {items}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {drag?.mode === "pointer" && draggedCard && (
        <div
          ref={overlayRef}
          aria-hidden="true"
          data-slot="kanban-overlay"
          className="pointer-events-none absolute top-0 left-0 z-50 will-change-transform"
          style={{ width: drag.width }}
        >
          <div
            data-settling={drag.phase === "settling" || undefined}
            className={cn(
              cardSurface,
              "origin-center cursor-grabbing transition-[scale,rotate,box-shadow,border-color] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              "border-primary/25 shadow-[0_2px_6px_rgb(0_0_0/0.06),0_18px_36px_-12px_rgb(0_0_0/0.28)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_18px_40px_-10px_rgb(0_0_0/0.75)]",
              "scale-[1.03] rotate-[1.5deg] motion-safe:animate-[kanban-board-lift_200ms_cubic-bezier(0.22,1,0.36,1)]",
              "data-[settling]:scale-100 data-[settling]:rotate-0 data-[settling]:border-border/70 data-[settling]:shadow-[0_1px_2px_rgb(0_0_0/0.04),0_2px_8px_-4px_rgb(0_0_0/0.06)]",
            )}
          >
            {cardBody(draggedCard, columns.find((column) => column.id === drag.column) ?? columns[0], true, true)}
          </div>
        </div>
      )}

      <p id={instructionsId} className="sr-only">
        {labels.instructions}
      </p>
      <span className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
