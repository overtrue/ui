"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  IconCalendarMonth,
  IconCalendarOff,
  IconCalendarWeek,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconListDetails,
  IconMapPin,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

export type EventCalendarView = "week" | "month" | "agenda";
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** A series token from the theme, or any CSS color. */
export type EventCalendarColor =
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5"
  | "primary"
  | "muted"
  | (string & {});

export interface EventCalendarAttendee {
  name: string;
  /** Avatar image URL. Initials are shown without one. */
  image?: string;
}

export interface EventCalendarEvent {
  id: string;
  title: string;
  /** Local start time. */
  start: Date;
  /** Local end time. For all-day events an end at midnight is exclusive. */
  end: Date;
  /** Shown in the all-day lane. Events of 24 hours or longer go there too. */
  allDay?: boolean;
  /** Defaults to "chart-1". */
  color?: EventCalendarColor;
  location?: string;
  attendees?: EventCalendarAttendee[];
}

/** A span of local time. `end` is exclusive. */
export interface EventCalendarRange {
  start: Date;
  end: Date;
}

export interface EventCalendarSlotDetails {
  /** True for whole days: the all-day lane, a month cell, or a day picked from the keyboard. */
  allDay: boolean;
  source: "click" | "drag" | "keyboard";
}

export interface EventCalendarEventClickDetails {
  view: EventCalendarView;
  /** The chip that was activated, for anchoring a popover. */
  element: HTMLElement;
}

export interface EventCalendarRenderInfo {
  view: EventCalendarView | "popover";
  /** The visible part of the event: one day of a multi-day event. */
  start: Date;
  end: Date;
  /** Resolved CSS color of the series. */
  color: string;
  /** Formatted time range of the visible part, or the all-day label. */
  timeLabel: string;
  /** True when the chip is too short for more than one line. */
  compact: boolean;
  allDay: boolean;
  selected: boolean;
}

/** Interface copy. Dates, weekdays, and times are localized through `locale`. */
export interface EventCalendarLabels {
  today: string;
  previous: (view: EventCalendarView) => string;
  next: (view: EventCalendarView) => string;
  views: Record<EventCalendarView, string>;
  viewSwitcher: string;
  allDay: string;
  /** Visible text of the overflow button in a month cell. */
  more: (count: number) => string;
  /** Accessible name of the overflow button. */
  showMore: (count: number, day: string) => string;
  showFewer: string;
  events: (count: number) => string;
  noEvents: string;
  noEventsDescription: string;
  todayMarker: string;
  currentTime: string;
  dayOf: (day: number, total: number) => string;
  loading: string;
}

export interface EventCalendarProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> {
  events: EventCalendarEvent[];
  view?: EventCalendarView;
  defaultView?: EventCalendarView;
  onViewChange?: (view: EventCalendarView) => void;
  /** Views offered by the switcher, in order. The switcher hides when there is one. */
  views?: EventCalendarView[];
  /** The focused day. The visible week or month is the one that contains it. */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** Called with the visible range on mount and whenever it changes, for fetching. */
  onRangeChange?: (range: EventCalendarRange, view: EventCalendarView) => void;
  /** The current moment, for the today marker and the time line. Defaults to the clock, ticking each minute. */
  now?: Date;
  /** BCP 47 locale for dates, weekdays, and times. Defaults to the runtime locale. */
  locale?: string;
  /** First day of the week. Defaults to the locale's. */
  weekStartsOn?: WeekdayIndex;
  /** Drop Saturday and Sunday from the week and month grids. */
  hideWeekends?: boolean;
  /** First and last hour of the time grid. Defaults to 0 and 24. */
  startHour?: number;
  endHour?: number;
  /** Shades time outside these hours. Pass null to turn shading off. */
  workingHours?: { start: number; end: number; days?: WeekdayIndex[] } | null;
  /** The hour scrolled to the top of the week grid on mount. Defaults to the start of working hours. */
  scrollToHour?: number;
  /** Height of one hour in the week grid, in px. Defaults to 48. */
  hourHeight?: number;
  /** Narrowest day column before the week grid scrolls sideways, in px. Defaults to 56. */
  minDayWidth?: number;
  /** Length of the slot a click on the time grid creates, in minutes. Defaults to 30. */
  slotMinutes?: number;
  /** Granularity of drag selections, in minutes. Defaults to 15. */
  snapMinutes?: number;
  /** Drag across the time grid to select a range. Defaults to true when `onSlotClick` is set. */
  selectable?: boolean;
  /** Events shown per month cell before "+N more". Defaults to 3. */
  maxEventsPerDay?: number;
  /** Days the agenda covers from `date`. Defaults to 14. */
  agendaDays?: number;
  /** Height of the calendar. Defaults to 640 for week and agenda; month grows to fit. */
  height?: number | string;
  /** Highlights an event. Leave undefined to highlight the last clicked one. */
  selectedEventId?: string | null;
  onEventClick?: (
    event: EventCalendarEvent,
    details: EventCalendarEventClickDetails,
  ) => void;
  /** Called for a click on empty time or a day, and for a drag selection in the week grid. */
  onSlotClick?: (
    start: Date,
    end: Date,
    details: EventCalendarSlotDetails,
  ) => void;
  /** Replaces the contents of every event chip. The chip, its color, and its accessible name stay. */
  renderEvent?: (
    event: EventCalendarEvent,
    info: EventCalendarRenderInfo,
  ) => React.ReactNode;
  /** Formats a time of day. Defaults to Intl hours and minutes. */
  formatTime?: (date: Date) => string;
  /** Shows a progress line and marks the grid busy while events load. */
  loading?: boolean;
  /** Extra controls at the end of the header, such as a New event button. */
  actions?: React.ReactNode;
  labels?: Partial<EventCalendarLabels>;
}

/* ------------------------------------------------------------------------ */
/* Dates                                                                     */
/* ------------------------------------------------------------------------ */

const DAY_MS = 86_400_000;
const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const daysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();
/** Sortable key for a calendar day. */
const dayKey = (date: Date) =>
  date.getFullYear() * 10_000 + date.getMonth() * 100 + date.getDate();
const fromKey = (key: number) =>
  new Date(Math.floor(key / 10_000), Math.floor(key / 100) % 100, key % 100);
const sameDay = (a: Date, b: Date) => dayKey(a) === dayKey(b);
/** Whole days since the epoch, immune to daylight-saving shifts. */
const epochDay = (date: Date) =>
  Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
const minuteOfDay = (date: Date) => date.getHours() * 60 + date.getMinutes();
/** A wall-clock time on a day; minute 1440 is the next midnight. */
const atMinute = (day: Date, minute: number) =>
  new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, minute);
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function addMonths(date: Date, months: number) {
  const first = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const year = first.getFullYear();
  const month = first.getMonth();
  return new Date(year, month, Math.min(date.getDate(), daysInMonth(year, month)));
}

function startOfWeek(date: Date, weekStartsOn: number) {
  const day = startOfDay(date);
  return addDays(day, -((day.getDay() - weekStartsOn + 7) % 7));
}

/** The span a view shows for a date. Week and month ranges start on `weekStartsOn`. */
export function getVisibleRange(
  view: EventCalendarView,
  date: Date,
  options: { weekStartsOn?: WeekdayIndex; agendaDays?: number } = {},
): EventCalendarRange {
  const weekStartsOn = options.weekStartsOn ?? 0;
  if (view === "week") {
    const start = startOfWeek(date, weekStartsOn);
    return { start, end: addDays(start, 7) };
  }
  if (view === "month") {
    const start = startOfWeek(
      new Date(date.getFullYear(), date.getMonth(), 1),
      weekStartsOn,
    );
    return { start, end: addDays(start, 42) };
  }
  const start = startOfDay(date);
  return { start, end: addDays(start, options.agendaDays ?? 14) };
}

type IntlLocaleWithWeek = Intl.Locale & {
  getWeekInfo?: () => { firstDay: number };
  weekInfo?: { firstDay: number };
};

function localeWeekStart(locale?: string): WeekdayIndex {
  try {
    const resolved = new Intl.Locale(
      locale ?? new Intl.DateTimeFormat().resolvedOptions().locale,
    ) as IntlLocaleWithWeek;
    const info = resolved.getWeekInfo?.() ?? resolved.weekInfo;
    if (info?.firstDay) return (info.firstDay % 7) as WeekdayIndex;
  } catch {
    // Older engines: fall through to Sunday.
  }
  return 0;
}

const formatters = new Map<string, Intl.DateTimeFormat>();
function dtf(locale: string | undefined, options: Intl.DateTimeFormatOptions) {
  const key = `${locale ?? ""}|${JSON.stringify(options)}`;
  let cached = formatters.get(key);
  if (!cached) {
    cached = new Intl.DateTimeFormat(locale, options);
    formatters.set(key, cached);
  }
  return cached;
}

function formatRange(format: Intl.DateTimeFormat, start: Date, end: Date) {
  try {
    return format.formatRange(start, end);
  } catch {
    return `${format.format(start)} – ${format.format(end)}`;
  }
}

interface Formatters {
  time: (date: Date) => string;
  /** Hours and minutes without a day period, for the narrow time-line label. */
  clock: (date: Date) => string;
  shortTime: (date: Date) => string;
  timeRange: (start: Date, end: Date) => string;
  hour: (hour: number) => string;
  longDay: (date: Date) => string;
  dayRange: (first: Date, last: Date) => string;
  dateTimeRange: (start: Date, end: Date) => string;
}

function createFormatters(
  locale: string | undefined,
  formatTime?: (date: Date) => string,
): Formatters {
  const clock = dtf(locale, { hour: "numeric", minute: "2-digit" });
  const cycle = clock.resolvedOptions().hourCycle;
  const twelveHour = cycle === "h12" || cycle === "h11";
  const hourOnly = dtf(locale, { hour: "numeric" });
  const time = formatTime ?? ((date: Date) => clock.format(date));
  return {
    time,
    clock:
      formatTime ??
      ((date) =>
        clock
          .formatToParts(date)
          .filter((part) => part.type !== "dayPeriod")
          .map((part) => part.value)
          .join("")
          .trim()),
    shortTime:
      formatTime ??
      ((date) =>
        twelveHour && date.getMinutes() === 0
          ? hourOnly.format(date)
          : clock.format(date)),
    timeRange: (start, end) =>
      formatTime
        ? `${formatTime(start)} – ${formatTime(end)}`
        : formatRange(clock, start, end),
    hour: (hour) =>
      twelveHour
        ? hourOnly.format(new Date(2026, 0, 1, hour))
        : dtf(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(
            new Date(2026, 0, 1, hour),
          ),
    longDay: (date) =>
      dtf(locale, { weekday: "long", month: "long", day: "numeric" }).format(date),
    dayRange: (first, last) =>
      sameDay(first, last)
        ? dtf(locale, { weekday: "long", month: "long", day: "numeric" }).format(first)
        : formatRange(dtf(locale, { month: "long", day: "numeric" }), first, last),
    dateTimeRange: (start, end) =>
      formatTime
        ? `${dtf(locale, { weekday: "short", month: "short", day: "numeric" }).format(start)} ${formatTime(start)} – ${dtf(locale, { weekday: "short", month: "short", day: "numeric" }).format(end)} ${formatTime(end)}`
        : formatRange(
            dtf(locale, {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }),
            start,
            end,
          ),
  };
}

/** Title parts for the header; the year is quieter than the dates. */
function titleParts(
  view: EventCalendarView,
  first: Date,
  last: Date,
  locale?: string,
) {
  try {
    const parts =
      view === "month"
        ? dtf(locale, { month: "long", year: "numeric" }).formatToParts(first)
        : dtf(locale, {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).formatRangeToParts(first, last);
    return parts.map((part, index) => ({
      value: part.value,
      quiet:
        part.type === "year" ||
        (part.type === "literal" && parts[index + 1]?.type === "year" && index > 0),
    }));
  } catch {
    return [{ value: `${first.toDateString()} – ${last.toDateString()}`, quiet: false }];
  }
}

const capitalize = (text: string, locale?: string) =>
  text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);

/* ------------------------------------------------------------------------ */
/* Layout                                                                    */
/* ------------------------------------------------------------------------ */

const SERIES: Record<string, string> = {
  "chart-1": "var(--color-chart-1)",
  "chart-2": "var(--color-chart-2)",
  "chart-3": "var(--color-chart-3)",
  "chart-4": "var(--color-chart-4)",
  "chart-5": "var(--color-chart-5)",
  primary: "var(--color-primary)",
  muted: "var(--color-muted-foreground)",
};
const resolveColor = (color?: string) =>
  color ? (SERIES[color] ?? color) : SERIES["chart-1"];

interface Item {
  event: EventCalendarEvent;
  start: Date;
  end: Date;
  /** Lives in the all-day lane: all-day, or 24 hours and longer. */
  lane: boolean;
  first: number;
  last: number;
  color: string;
}

function normalize(events: EventCalendarEvent[]): Item[] {
  return events
    .map((event) => {
      const start = event.start;
      const end = event.end.getTime() < start.getTime() ? start : event.end;
      const lane =
        !!event.allDay || end.getTime() - start.getTime() >= DAY_MS;
      const first = dayKey(start);
      let last: number;
      if (event.allDay) {
        const endDay = startOfDay(end);
        last =
          end.getTime() === endDay.getTime() && dayKey(endDay) > first
            ? dayKey(addDays(endDay, -1))
            : dayKey(end);
      } else {
        last = end > start ? dayKey(new Date(end.getTime() - 1)) : first;
      }
      return {
        event,
        start,
        end,
        lane,
        first,
        last: Math.max(first, last),
        color: resolveColor(event.color),
      };
    })
    .sort(
      (a, b) =>
        a.start.getTime() - b.start.getTime() ||
        b.end.getTime() - a.end.getTime() ||
        a.event.title.localeCompare(b.event.title),
    );
}

interface Span {
  item: Item;
  startCol: number;
  endCol: number;
  lane: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
}

/** Packs items into the lowest free lane across the columns they cover. */
function packLanes(
  items: Item[],
  days: Date[],
  timedOnStartDay: boolean,
): Span[] {
  const keys = days.map(dayKey);
  const spans: Omit<Span, "lane">[] = [];
  for (const item of items) {
    if (!item.lane && !timedOnStartDay) continue;
    const last = item.lane ? item.last : item.first;
    let startCol = -1;
    let endCol = -1;
    keys.forEach((key, col) => {
      if (key >= item.first && key <= last) {
        if (startCol < 0) startCol = col;
        endCol = col;
      }
    });
    if (startCol < 0) continue;
    spans.push({
      item,
      startCol,
      endCol,
      continuesBefore: item.first < keys[startCol],
      continuesAfter: last > keys[endCol],
    });
  }
  spans.sort(
    (a, b) =>
      Number(!a.item.lane) - Number(!b.item.lane) ||
      a.startCol - b.startCol ||
      b.endCol - b.startCol - (a.endCol - a.startCol) ||
      a.item.start.getTime() - b.item.start.getTime(),
  );
  const occupied: boolean[][] = [];
  return spans.map((span) => {
    let lane = 0;
    while (
      occupied[lane]?.slice(span.startCol, span.endCol + 1).some(Boolean)
    )
      lane++;
    occupied[lane] ??= [];
    for (let col = span.startCol; col <= span.endCol; col++)
      occupied[lane][col] = true;
    return { ...span, lane };
  });
}

interface Segment {
  item: Item;
  startMin: number;
  endMin: number;
  /** The visual end, stretched so short events stay readable. */
  visualEnd: number;
  col: number;
  span: number;
  cols: number;
}

/** Clips timed events to a day and lays overlapping ones out side by side. */
function layoutDay(
  items: Item[],
  day: Date,
  lo: number,
  hi: number,
  minMinutes: number,
): Segment[] {
  const key = dayKey(day);
  const segments: Segment[] = [];
  for (const item of items) {
    if (item.lane || key < item.first || key > item.last) continue;
    const s = item.first === key ? minuteOfDay(item.start) : 0;
    const e = dayKey(item.end) === key ? minuteOfDay(item.end) : 1440;
    if (s >= hi || (e <= lo && e > s)) continue;
    const startMin = clamp(s, lo, hi);
    const endMin = clamp(Math.max(e, s), lo, hi);
    segments.push({
      item,
      startMin,
      endMin,
      visualEnd: Math.min(hi, Math.max(endMin, startMin + minMinutes)),
      col: 0,
      span: 1,
      cols: 1,
    });
  }
  segments.sort(
    (a, b) => a.startMin - b.startMin || b.visualEnd - a.visualEnd,
  );

  let cluster: Segment[] = [];
  let clusterEnd = -Infinity;
  const flush = () => {
    const columns: Segment[][] = [];
    for (const segment of cluster) {
      let col = columns.findIndex(
        (column) => column[column.length - 1].visualEnd <= segment.startMin,
      );
      if (col < 0) {
        col = columns.length;
        columns.push([]);
      }
      columns[col].push(segment);
      segment.col = col;
    }
    for (const segment of cluster) {
      segment.cols = columns.length;
      let span = 1;
      while (
        segment.col + span < columns.length &&
        !columns[segment.col + span].some(
          (other) =>
            other.startMin < segment.visualEnd &&
            other.visualEnd > segment.startMin,
        )
      )
        span++;
      segment.span = span;
    }
  };
  for (const segment of segments) {
    if (cluster.length && segment.startMin >= clusterEnd) {
      flush();
      cluster = [];
      clusterEnd = -Infinity;
    }
    cluster.push(segment);
    clusterEnd = Math.max(clusterEnd, segment.visualEnd);
  }
  if (cluster.length) flush();
  return segments;
}

/* ------------------------------------------------------------------------ */
/* Shared pieces                                                             */
/* ------------------------------------------------------------------------ */

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const keyframes =
  "@keyframes event-calendar-pop{from{opacity:0;transform:translateY(-4px) scale(.97)}to{opacity:1;transform:none}}" +
  "@keyframes event-calendar-load{from{transform:translateX(-100%)}to{transform:translateX(320%)}}";

const GUTTER = 48;
const LANE = 24;
const MONTH_TOP = 32;
const MONTH_LANE = 22;

const defaultLabels: EventCalendarLabels = {
  today: "Today",
  previous: (view) =>
    view === "week" ? "Previous week" : view === "month" ? "Previous month" : "Previous days",
  next: (view) =>
    view === "week" ? "Next week" : view === "month" ? "Next month" : "Next days",
  views: { week: "Week", month: "Month", agenda: "Agenda" },
  viewSwitcher: "Calendar view",
  allDay: "All day",
  more: (count) => `+${count} more`,
  showMore: (count, day) =>
    `Show ${count} more ${count === 1 ? "event" : "events"} on ${day}`,
  showFewer: "Show fewer all-day events",
  events: (count) => (count === 0 ? "no events" : count === 1 ? "1 event" : `${count} events`),
  noEvents: "Nothing scheduled",
  noEventsDescription: "These days are clear. Pick another range or add an event.",
  todayMarker: "today",
  currentTime: "Current time",
  dayOf: (day, total) => `Day ${day} of ${total}`,
  loading: "Loading events",
};

const DEFAULT_VIEWS: EventCalendarView[] = ["week", "month", "agenda"];
const DEFAULT_WORKING_HOURS = { start: 9, end: 17 };
const VIEW_ICONS = {
  week: IconCalendarWeek,
  month: IconCalendarMonth,
  agenda: IconListDetails,
} as const;

/* Chip recipe: the series color tints the surface, an inset accent carries it at full strength. */
const chip =
  "group/event @container/chip overflow-hidden border text-start outline-none select-none [border-color:color-mix(in_oklab,var(--event-color)_24%,transparent)] [background-color:color-mix(in_oklab,var(--event-color)_12%,var(--color-card))] shadow-[0_0_0_1px_var(--color-card)] transition-[background-color,border-color,box-shadow] duration-150 hover:[background-color:color-mix(in_oklab,var(--event-color)_19%,var(--color-card))] focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none";
const chipSelected =
  "z-10 [border-color:color-mix(in_oklab,var(--event-color)_50%,transparent)] [background-color:color-mix(in_oklab,var(--event-color)_22%,var(--color-card))] ring-2 ring-primary/30 shadow-[0_0_0_1px_var(--color-card),0_1px_2px_rgb(0_0_0/0.12)] dark:shadow-[0_0_0_1px_var(--color-card),0_8px_22px_-10px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] hover:[background-color:color-mix(in_oklab,var(--event-color)_24%,var(--color-card))]";
const titleInk =
  "[color:color-mix(in_oklab,var(--event-color)_38%,var(--color-foreground))]";
const accent =
  "pointer-events-none absolute inset-y-[3px] start-[3px] w-[3px] rounded-full bg-[var(--event-color)]";

interface Ctx {
  locale?: string;
  labels: EventCalendarLabels;
  fmt: Formatters;
  today: Date;
  now: Date;
  focusDay: Date;
  selectedId: string | null;
  renderEvent?: EventCalendarProps["renderEvent"];
  slot?: EventCalendarProps["onSlotClick"];
  activate: (
    event: EventCalendarEvent,
    element: HTMLElement,
    view: EventCalendarView,
  ) => void;
  eventLabel: (item: Item) => string;
  timeLabel: (item: Item, day?: Date) => string;
  countOn: (day: Date) => number;
  onDayKeyDown: (event: React.KeyboardEvent, day: Date) => void;
  onEventKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  pickDay: (day: Date) => void;
  openWeek?: (day: Date) => void;
}

function EventChip({
  ctx,
  item,
  view,
  tabbable,
  compact = false,
  start,
  end,
  className,
  style,
  children,
}: {
  ctx: Ctx;
  item: Item;
  view: EventCalendarView;
  tabbable: boolean;
  compact?: boolean;
  start?: Date;
  end?: Date;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const selected = ctx.selectedId === item.event.id;
  return (
    <button
      type="button"
      data-slot="event-calendar-event"
      data-event={item.event.id}
      data-event-nav=""
      data-selected={selected ? "" : undefined}
      data-all-day={item.lane ? "" : undefined}
      tabIndex={tabbable ? 0 : -1}
      aria-label={ctx.eventLabel(item)}
      onClick={(event) => ctx.activate(item.event, event.currentTarget, view)}
      onKeyDown={ctx.onEventKeyDown}
      style={{ "--event-color": item.color, ...style } as React.CSSProperties}
      className={cn(chip, className, selected && chipSelected)}
    >
      {ctx.renderEvent
        ? ctx.renderEvent(item.event, {
            view,
            start: start ?? item.start,
            end: end ?? item.end,
            color: item.color,
            timeLabel: ctx.timeLabel(item),
            compact,
            allDay: item.lane,
            selected,
          })
        : children}
    </button>
  );
}

function Initials({ attendees }: { attendees: EventCalendarAttendee[] }) {
  const shown = attendees.slice(0, 3);
  const extra = attendees.length - shown.length;
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center -space-x-1.5">
      {shown.map((person, index) => {
        const tone = `var(--color-chart-${(hash(person.name) % 5) + 1})`;
        return person.image ? (
          <img
            key={`${person.name}-${index}`}
            src={person.image}
            alt=""
            className="size-7 rounded-full object-cover ring-2 ring-card"
          />
        ) : (
          <span
            key={`${person.name}-${index}`}
            style={{ "--tone": tone } as React.CSSProperties}
            className="flex size-7 items-center justify-center rounded-full text-[11px] font-semibold ring-2 ring-card [background-color:color-mix(in_oklab,var(--tone)_18%,var(--color-card))] [color:color-mix(in_oklab,var(--tone)_45%,var(--color-foreground))]"
          >
            {initials(person.name)}
          </span>
        );
      })}
      {extra > 0 && (
        <span className="flex size-7 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground tabular-nums ring-2 ring-card">
          +{extra}
        </span>
      )}
    </span>
  );
}

function hash(text: string) {
  let value = 0;
  for (let i = 0; i < text.length; i++) value = (value * 31 + text.charCodeAt(i)) >>> 0;
  return value;
}

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  return (
    (words[0]?.[0] ?? "") + (words.length > 1 ? (words[words.length - 1][0] ?? "") : "")
  ).toUpperCase();
}

/* ------------------------------------------------------------------------ */
/* Component                                                                 */
/* ------------------------------------------------------------------------ */

/** A scheduling calendar with a week time grid, a month grid, and an agenda. */
export function EventCalendar({
  events,
  view: viewProp,
  defaultView = "week",
  onViewChange,
  views = DEFAULT_VIEWS,
  date: dateProp,
  defaultDate,
  onDateChange,
  onRangeChange,
  now: nowProp,
  locale,
  weekStartsOn: weekStartsOnProp,
  hideWeekends = false,
  startHour = 0,
  endHour = 24,
  workingHours = DEFAULT_WORKING_HOURS,
  scrollToHour,
  hourHeight = 48,
  minDayWidth = 56,
  slotMinutes = 30,
  snapMinutes = 15,
  selectable,
  maxEventsPerDay = 3,
  agendaDays = 14,
  height,
  selectedEventId: selectedProp,
  onEventClick,
  onSlotClick,
  renderEvent,
  formatTime,
  loading = false,
  actions,
  labels: labelsProp,
  className,
  style,
  ...props
}: EventCalendarProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);

  /* ---- Clock ---- */
  const [clock, setClock] = React.useState(() => new Date());
  React.useEffect(() => {
    if (nowProp) return;
    const tick = () => setClock(new Date());
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, [nowProp]);
  const now = nowProp ?? clock;
  const todayKey = dayKey(now);
  const today = React.useMemo(() => startOfDay(now), [todayKey]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- Controlled and uncontrolled state ---- */
  const [viewState, setViewState] = React.useState<EventCalendarView>(defaultView);
  const view = viewProp ?? viewState;
  const [dateState, setDateState] = React.useState(() =>
    startOfDay(defaultDate ?? new Date()),
  );
  const date = startOfDay(dateProp ?? dateState);
  const [selectedState, setSelectedState] = React.useState<string | null>(null);
  const selectedId = selectedProp !== undefined ? selectedProp : selectedState;

  const weekStartsOn = React.useMemo(
    () => weekStartsOnProp ?? localeWeekStart(locale),
    [weekStartsOnProp, locale],
  );
  const range = getVisibleRange(view, date, { weekStartsOn, agendaDays });
  const rangeKey = `${view}|${dayKey(range.start)}|${dayKey(range.end)}`;
  const items = React.useMemo(() => normalize(events), [events]);
  const fmt = React.useMemo(
    () => createFormatters(locale, formatTime),
    [locale, formatTime],
  );

  const visible = (day: Date) => !hideWeekends || !isWeekend(day);
  /** The focused day, moved off hidden weekends. */
  const focusDay = visible(date)
    ? date
    : addDays(date, date.getDay() === 6 ? -1 : 1);

  const changeDate = (next: Date) => {
    const day = startOfDay(next);
    if (sameDay(day, date)) return;
    if (dateProp === undefined) setDateState(day);
    onDateChange?.(day);
  };
  const changeView = (next: EventCalendarView) => {
    if (next === view) return;
    if (viewProp === undefined) setViewState(next);
    onViewChange?.(next);
  };

  /* ---- Range notifications, announcements, and motion ---- */
  const rangeCallback = React.useRef(onRangeChange);
  rangeCallback.current = onRangeChange;
  const slide = React.useRef(0);
  const mounted = React.useRef(false);
  const [announcement, setAnnouncement] = React.useState("");

  const visibleDays = React.useMemo(() => {
    const out: Date[] = [];
    for (let d = range.start; d < range.end; d = addDays(d, 1)) out.push(d);
    return out;
  }, [rangeKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const shownDays = visibleDays.filter(visible);
  const firstShown = shownDays[0] ?? range.start;
  const lastShown = shownDays[shownDays.length - 1] ?? addDays(range.end, -1);
  const title = titleParts(view, view === "month" ? date : firstShown, lastShown, locale);
  const titleText = title.map((part) => part.value).join("");
  const rangeCount = React.useMemo(() => {
    const lo = dayKey(range.start);
    const hi = dayKey(addDays(range.end, -1));
    return items.filter((item) => item.last >= lo && item.first <= hi).length;
  }, [items, rangeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    rangeCallback.current?.({ start: range.start, end: range.end }, view);
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setAnnouncement(`${titleText}, ${labels.events(rangeCount)}`);
  }, [rangeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useLayoutEffect(() => {
    const direction = slide.current;
    slide.current = 0;
    const body = bodyRef.current;
    if (!direction || !body) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    body.animate?.(
      [
        { opacity: 0.35, transform: `translateX(${direction * 14}px)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: 300, easing: EASE },
    );
  }, [rangeKey]);

  const shift = (direction: -1 | 1) => {
    slide.current = direction;
    changeDate(
      view === "week"
        ? addDays(date, 7 * direction)
        : view === "month"
          ? addMonths(date, direction)
          : addDays(date, agendaDays * direction),
    );
  };
  const goToday = () => {
    slide.current = dayKey(today) > dayKey(date) ? 1 : dayKey(today) < dayKey(date) ? -1 : 0;
    changeDate(today);
  };

  /* ---- Focus ---- */
  const focusRequest = React.useRef<number | null>(null);
  const focusDayTarget = React.useCallback((day: Date) => {
    rootRef.current
      ?.querySelector<HTMLElement>(`[data-day-target="${dayKey(day)}"]`)
      ?.focus({ preventScroll: false });
  }, []);
  React.useEffect(() => {
    if (focusRequest.current === null || focusRequest.current !== dayKey(focusDay))
      return;
    focusRequest.current = null;
    focusDayTarget(focusDay);
  });

  const step = (day: Date, direction: number) => {
    let next = addDays(day, direction);
    while (!visible(next)) next = addDays(next, direction);
    return next;
  };
  const moveTo = (next: Date) => {
    const target = visible(next) ? next : step(next, next > date ? 1 : -1);
    const outside = target < range.start || target >= range.end;
    if (outside && view !== "agenda") slide.current = target > date ? 1 : -1;
    if (view === "month" && (target.getMonth() !== date.getMonth() || target.getFullYear() !== date.getFullYear()))
      slide.current = target > date ? 1 : -1;
    focusRequest.current = dayKey(target);
    if (sameDay(target, focusDay)) {
      focusRequest.current = null;
      focusDayTarget(target);
    } else changeDate(target);
  };

  const onDayKeyDown = (event: React.KeyboardEvent, day: Date) => {
    const week = view === "week";
    const rowStart = startOfWeek(day, weekStartsOn);
    let next: Date | null = null;
    switch (event.key) {
      case "ArrowLeft":
        next = step(day, -1);
        break;
      case "ArrowRight":
        next = step(day, 1);
        break;
      case "ArrowUp":
        if (week) return;
        next = addDays(day, -7);
        break;
      case "ArrowDown":
        if (week) {
          event.preventDefault();
          rootRef.current
            ?.querySelector<HTMLElement>('[data-event-nav][tabindex="0"]')
            ?.focus();
          return;
        }
        next = addDays(day, 7);
        break;
      case "PageUp":
        next = week ? addDays(day, -7) : addMonths(day, event.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        next = week ? addDays(day, 7) : addMonths(day, event.shiftKey ? 12 : 1);
        break;
      case "Home":
        next = visible(rowStart) ? rowStart : step(rowStart, 1);
        break;
      case "End": {
        const rowEnd = addDays(rowStart, 6);
        next = visible(rowEnd) ? rowEnd : step(rowEnd, -1);
        break;
      }
      default:
        return;
    }
    event.preventDefault();
    moveTo(next);
  };

  const onEventKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const root = rootRef.current;
    if (!root) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const list = Array.from(
        root.querySelectorAll<HTMLElement>('[data-event-nav][tabindex="0"]'),
      );
      const index = list.indexOf(event.currentTarget);
      const next = list[index + (event.key === "ArrowDown" ? 1 : -1)];
      event.preventDefault();
      if (next) next.focus();
      else if (event.key === "ArrowUp") focusDayTarget(focusDay);
    } else if (event.key === "Escape") {
      event.preventDefault();
      focusDayTarget(focusDay);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveTo(step(focusDay, event.key === "ArrowLeft" ? -1 : 1));
    }
  };

  /* ---- Events ---- */
  const activate = (
    event: EventCalendarEvent,
    element: HTMLElement,
    from: EventCalendarView,
  ) => {
    if (selectedProp === undefined) setSelectedState(event.id);
    onEventClick?.(event, { view: from, element });
  };

  const timeLabel = (item: Item, day?: Date) => {
    if (item.lane) {
      if (!day || item.first === item.last) return labels.allDay;
      const first = epochDay(fromKey(item.first));
      return labels.dayOf(epochDay(day) - first + 1, epochDay(fromKey(item.last)) - first + 1);
    }
    return item.first === item.last
      ? fmt.timeRange(item.start, item.end)
      : fmt.dateTimeRange(item.start, item.end);
  };

  const eventLabel = (item: Item) => {
    const when = item.lane
      ? `${labels.allDay}, ${fmt.dayRange(fromKey(item.first), fromKey(item.last))}`
      : item.first === item.last
        ? `${fmt.longDay(item.start)}, ${fmt.timeRange(item.start, item.end)}`
        : fmt.dateTimeRange(item.start, item.end);
    return [item.event.title, when, item.event.location].filter(Boolean).join(", ");
  };

  const countOn = (day: Date) => {
    const key = dayKey(day);
    return items.filter((item) => item.first <= key && item.last >= key).length;
  };

  const ctx: Ctx = {
    locale,
    labels,
    fmt,
    today,
    now,
    focusDay,
    selectedId,
    renderEvent,
    slot: onSlotClick,
    activate,
    eventLabel,
    timeLabel,
    countOn,
    onDayKeyDown,
    onEventKeyDown,
    pickDay: (day) => changeDate(day),
    openWeek: views.includes("week")
      ? (day) => {
          // Land on the same day in the week grid.
          focusRequest.current = dayKey(
            visible(day) ? day : addDays(day, day.getDay() === 6 ? -1 : 1),
          );
          changeDate(day);
          changeView("week");
        }
      : undefined,
  };

  /* ---- Header ---- */
  const viewSwitcher = views.length > 1 && (
    <div
      role="tablist"
      aria-label={labels.viewSwitcher}
      data-slot="event-calendar-views"
      onKeyDown={(event) => {
        const index = views.indexOf(view);
        const next =
          event.key === "ArrowRight"
            ? views[(index + 1) % views.length]
            : event.key === "ArrowLeft"
              ? views[(index - 1 + views.length) % views.length]
              : event.key === "Home"
                ? views[0]
                : event.key === "End"
                  ? views[views.length - 1]
                  : null;
        if (!next) return;
        event.preventDefault();
        changeView(next);
        event.currentTarget
          .querySelector<HTMLElement>(`[data-view-tab="${next}"]`)
          ?.focus();
      }}
      className="inline-flex h-8 shrink-0 items-center gap-0.5 rounded-[10px] bg-muted/60 p-1 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-border)_70%,transparent)] dark:bg-muted/40"
    >
      {views.map((option) => {
        const active = option === view;
        const Icon = VIEW_ICONS[option];
        return (
          <button
            key={option}
            type="button"
            role="tab"
            id={`${uid}-tab-${option}`}
            data-view-tab={option}
            data-state={active ? "active" : "inactive"}
            aria-selected={active}
            aria-controls={`${uid}-panel`}
            tabIndex={active ? 0 : -1}
            onClick={() => changeView(option)}
            className={cn(
              "inline-flex h-6 items-center justify-center gap-1.5 rounded-md px-1.5 text-xs font-medium whitespace-nowrap @min-[30rem]/event-calendar:px-2 transition-[color,background-color,box-shadow] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none @min-[36rem]/event-calendar:px-2.5",
              active
                ? "bg-card text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_rgb(0_0_0/0.04)] dark:bg-foreground/10 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_1px_2px_rgb(0_0_0/0.5)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon
              aria-hidden="true"
              className="size-3.5 @min-[36rem]/event-calendar:hidden"
            />
            <span className="sr-only @min-[36rem]/event-calendar:not-sr-only">
              {labels.views[option]}
            </span>
          </button>
        );
      })}
    </div>
  );

  const navButton =
    "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none";

  const header = (
    <div
      data-slot="event-calendar-header"
      className="relative flex shrink-0 items-center gap-1.5 border-b border-border/60 px-3 py-2.5 @min-[30rem]/event-calendar:gap-2 @min-[36rem]/event-calendar:gap-3 @min-[36rem]/event-calendar:px-4"
    >
      <h2
        id={`${uid}-title`}
        data-slot="event-calendar-title"
        className="min-w-0 flex-1 truncate text-sm font-semibold tracking-[-0.01em] tabular-nums @min-[30rem]/event-calendar:text-[15px]"
      >
        {title.map((part, index) =>
          part.quiet ? (
            <span
              key={index}
              className="hidden font-medium text-muted-foreground @min-[30rem]/event-calendar:inline"
            >
              {part.value}
            </span>
          ) : (
            <React.Fragment key={index}>{part.value}</React.Fragment>
          ),
        )}
      </h2>
      <div
        data-slot="event-calendar-nav"
        className="inline-flex h-8 shrink-0 items-center gap-0.5 rounded-[10px] border border-border/70 bg-card p-0.5 shadow-[0_1px_2px_rgb(0_0_0/0.04)]"
      >
        <button
          type="button"
          aria-label={labels.previous(view)}
          onClick={() => shift(-1)}
          className={navButton}
        >
          <IconChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        </button>
        <button
          type="button"
          onClick={goToday}
          data-current={
            dayKey(today) >= dayKey(range.start) && dayKey(today) < dayKey(range.end)
              ? ""
              : undefined
          }
          className="inline-flex h-7 items-center rounded-md px-1.5 text-[13px] font-medium text-foreground @min-[30rem]/event-calendar:px-2 transition-colors duration-150 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
        >
          {labels.today}
        </button>
        <button
          type="button"
          aria-label={labels.next(view)}
          onClick={() => shift(1)}
          className={navButton}
        >
          <IconChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </button>
      </div>
      {viewSwitcher}
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      {loading && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 overflow-hidden"
        >
          <span className="block h-full w-1/4 rounded-full bg-primary/70 motion-safe:animate-[event-calendar-load_1.1s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
        </span>
      )}
    </div>
  );

  const resolvedHeight = height ?? (view === "month" ? undefined : 640);
  const allowDrag = selectable ?? !!onSlotClick;

  return (
    <div
      ref={rootRef}
      data-slot="event-calendar"
      data-view={view}
      className={cn(
        "@container/event-calendar relative isolate flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
        className,
      )}
      style={{ height: resolvedHeight, ...style }}
      {...props}
    >
      <style>{keyframes}</style>
      {header}
      <div
        ref={bodyRef}
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={views.length > 1 ? `${uid}-tab-${view} ${uid}-title` : `${uid}-title`}
        aria-busy={loading || undefined}
        data-slot="event-calendar-body"
        className="flex min-h-0 flex-1 flex-col"
      >
        {view === "week" ? (
          <WeekView
            key={`week-${hourHeight}-${startHour}`}
            ctx={ctx}
            days={shownDays}
            items={items}
            startHour={startHour}
            endHour={endHour}
            hourHeight={hourHeight}
            minDayWidth={minDayWidth}
            workingHours={workingHours}
            scrollToHour={scrollToHour ?? workingHours?.start ?? 8}
            slotMinutes={slotMinutes}
            snapMinutes={snapMinutes}
            selectable={allowDrag}
          />
        ) : view === "month" ? (
          <MonthView
            ctx={ctx}
            days={visibleDays}
            visible={visible}
            month={date}
            items={items}
            maxEvents={maxEventsPerDay}
            fill={resolvedHeight !== undefined}
          />
        ) : (
          <AgendaView ctx={ctx} days={shownDays} items={items} />
        )}
      </div>
      <div aria-live="polite" className="sr-only">
        {loading ? labels.loading : announcement}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Week                                                                      */
/* ------------------------------------------------------------------------ */

interface Draft {
  col: number;
  anchor: number;
  current: number;
  y: number;
  moved: boolean;
  mouse: boolean;
}

function WeekView({
  ctx,
  days,
  items,
  startHour,
  endHour,
  hourHeight,
  minDayWidth,
  workingHours,
  scrollToHour,
  slotMinutes,
  snapMinutes,
  selectable,
}: {
  ctx: Ctx;
  days: Date[];
  items: Item[];
  startHour: number;
  endHour: number;
  hourHeight: number;
  minDayWidth: number;
  workingHours: EventCalendarProps["workingHours"];
  scrollToHour: number;
  slotMinutes: number;
  snapMinutes: number;
  selectable: boolean;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft | null>(null);
  const [hover, setHover] = React.useState<{ col: number; min: number } | null>(null);

  const n = days.length;
  const lo = startHour * 60;
  const hi = endHour * 60;
  const pxPerMin = hourHeight / 60;
  const bodyHeight = (endHour - startHour) * hourHeight;
  const columns = `${GUTTER}px repeat(${n}, minmax(${minDayWidth}px, 1fr))`;

  /* All-day lane */
  const spans = React.useMemo(() => packLanes(items, days, false), [items, days]);
  const laneCount = spans.reduce((max, span) => Math.max(max, span.lane + 1), 0);
  const MAX_LANES = 3;
  const overflow = laneCount > MAX_LANES;
  const shownLanes = overflow && !expanded ? MAX_LANES - 1 : laneCount;
  const hiddenPerCol = days.map(
    (_, col) =>
      spans.filter(
        (span) =>
          span.lane >= shownLanes && span.startCol <= col && span.endCol >= col,
      ).length,
  );
  const laneHeight =
    Math.max(1, shownLanes + (overflow && !expanded ? 1 : 0)) * LANE + 6;

  /* Time grid */
  const minMinutes = 22 / pxPerMin;
  const segments = React.useMemo(
    () => days.map((day) => layoutDay(items, day, lo, hi, minMinutes)),
    [items, days, lo, hi, minMinutes],
  );

  React.useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = Math.max(0, (scrollToHour - startHour) * hourHeight - 12);
    const todayIndex = days.findIndex((day) => sameDay(day, ctx.today));
    if (todayIndex > 0 && el.scrollWidth > el.clientWidth) {
      const colWidth = (el.scrollWidth - GUTTER) / n;
      const x = todayIndex * colWidth;
      if (GUTTER + x + colWidth > el.clientWidth) el.scrollLeft = x;
    }
    // Scroll once on mount; later navigation keeps the reader's position.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!draft) return;
    const cancel = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDraft(null);
    };
    window.addEventListener("keydown", cancel);
    return () => window.removeEventListener("keydown", cancel);
  }, [draft]);

  const minuteAt = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return lo + clamp((event.clientY - rect.top) / pxPerMin, 0, hi - lo - 0.01);
  };
  const snap = (minute: number, size: number) => Math.floor(minute / size) * size;

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>, col: number) => {
    if (!ctx.slot || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("[data-event]")) return;
    const minute = minuteAt(event);
    const mouse = event.pointerType === "mouse";
    if (mouse) {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setHover(null);
    setDraft({ col, anchor: minute, current: minute, y: event.clientY, moved: false, mouse });
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>, col: number) => {
    if (!ctx.slot) return;
    if (draft) {
      if (!draft.mouse || draft.col !== col) return;
      const minute = minuteAt(event);
      const moved = draft.moved || Math.abs(event.clientY - draft.y) > 4;
      if (moved !== draft.moved || snap(minute, snapMinutes) !== snap(draft.current, snapMinutes))
        setDraft({ ...draft, current: minute, moved });
      return;
    }
    if (event.pointerType !== "mouse") return;
    if ((event.target as HTMLElement).closest("[data-event]")) {
      if (hover) setHover(null);
      return;
    }
    const min = snap(minuteAt(event), slotMinutes);
    if (!hover || hover.col !== col || hover.min !== min) setHover({ col, min });
  };
  const onPointerUp = (_event: React.PointerEvent<HTMLDivElement>, col: number) => {
    if (!draft || draft.col !== col || !ctx.slot) return;
    const day = days[col];
    if (draft.moved && selectable) {
      const a = snap(Math.min(draft.anchor, draft.current), snapMinutes);
      const b = Math.min(hi, snap(Math.max(draft.anchor, draft.current), snapMinutes) + snapMinutes);
      ctx.slot(atMinute(day, a), atMinute(day, b), { allDay: false, source: "drag" });
    } else if (!draft.moved) {
      const a = snap(draft.anchor, slotMinutes);
      ctx.slot(atMinute(day, a), atMinute(day, Math.min(hi, a + slotMinutes)), {
        allDay: false,
        source: "click",
      });
    }
    setDraft(null);
  };

  const ghost = (col: number) => {
    if (draft && draft.col === col && (draft.moved ? selectable : draft.mouse)) {
      const a = draft.moved
        ? snap(Math.min(draft.anchor, draft.current), snapMinutes)
        : snap(draft.anchor, slotMinutes);
      const b = draft.moved
        ? Math.min(hi, snap(Math.max(draft.anchor, draft.current), snapMinutes) + snapMinutes)
        : Math.min(hi, a + slotMinutes);
      return { a, b, solid: true };
    }
    if (!draft && hover && hover.col === col)
      return { a: hover.min, b: Math.min(hi, hover.min + slotMinutes), solid: false };
    return null;
  };

  const nowMin = minuteOfDay(ctx.now);
  const nowTop = (nowMin - lo) * pxPerMin;
  const todayCol = days.findIndex((day) => sameDay(day, ctx.today));
  const showNow = todayCol >= 0 && nowMin >= lo && nowMin <= hi;
  const lineColor = "color-mix(in oklab, var(--color-foreground) 7%, transparent)";
  const halfColor = "color-mix(in oklab, var(--color-foreground) 3.5%, transparent)";
  const offHours = "color-mix(in oklab, var(--color-muted) 60%, transparent)";

  const hours: number[] = [];
  for (let h = startHour + 1; h < endHour; h++) hours.push(h);

  return (
    <div
      ref={scrollRef}
      data-slot="event-calendar-week"
      onScroll={(event) => {
        const next = event.currentTarget.scrollTop > 0;
        if (next !== scrolled) setScrolled(next);
      }}
      className="relative min-h-0 flex-1 overflow-auto overscroll-contain [scrollbar-width:thin]"
    >
      {/* Sticky header: days and the all-day lane */}
      <div
        data-slot="event-calendar-week-header"
        data-scrolled={scrolled ? "" : undefined}
        className="sticky top-0 z-30 border-b border-border/60 bg-card transition-shadow duration-200 data-[scrolled]:shadow-[0_8px_16px_-12px_rgb(0_0_0/0.18)] motion-reduce:transition-none dark:data-[scrolled]:shadow-[0_8px_16px_-10px_rgb(0_0_0/0.7)]"
        style={{ minWidth: GUTTER + n * minDayWidth }}
      >
        <div className="grid" style={{ gridTemplateColumns: columns }}>
          <div className="sticky start-0 z-10 bg-card" />
          {days.map((day) => {
            const isToday = sameDay(day, ctx.today);
            const focused = sameDay(day, ctx.focusDay);
            const count = ctx.countOn(day);
            return (
              <div
                key={dayKey(day)}
                className="min-w-0 border-s border-border/60 p-1"
              >
                <button
                  type="button"
                  data-slot="event-calendar-day"
                  data-day-target={dayKey(day)}
                  data-today={isToday ? "" : undefined}
                  data-focused={focused ? "" : undefined}
                  tabIndex={focused ? 0 : -1}
                  aria-current={isToday ? "date" : undefined}
                  aria-label={[
                    ctx.fmt.longDay(day),
                    isToday ? ctx.labels.todayMarker : null,
                    ctx.labels.events(count),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  onKeyDown={(event) => ctx.onDayKeyDown(event, day)}
                  onClick={(event) => {
                    ctx.pickDay(day);
                    ctx.slot?.(day, addDays(day, 1), {
                      allDay: true,
                      source: event.detail === 0 ? "keyboard" : "click",
                    });
                  }}
                  className="group/day flex h-11 w-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg @min-[36rem]/event-calendar:h-9 @min-[36rem]/event-calendar:flex-row @min-[36rem]/event-calendar:gap-1.5 outline-none transition-colors duration-150 hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
                >
                  <span
                    className={cn(
                      "truncate text-xs",
                      isToday ? "font-medium text-primary" : "text-muted-foreground",
                    )}
                  >
                    {dtf(ctx.locale, { weekday: "short" }).format(day)}
                  </span>
                  <span
                    className={cn(
                      "flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[13px] font-semibold tabular-nums",
                      isToday
                        ? "bg-primary text-primary-foreground shadow-[0_1px_2px_rgb(0_0_0/0.12)] dark:shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]"
                        : "text-foreground",
                    )}
                  >
                    {day.getDate()}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <div
          data-slot="event-calendar-all-day"
          className="grid border-t border-border/60"
          style={{ gridTemplateColumns: columns }}
        >
          <div className="sticky start-0 z-10 flex flex-col items-end gap-0.5 bg-card pe-2 pt-1">
            <span className="text-[11px] leading-5 whitespace-nowrap text-muted-foreground">
              {ctx.labels.allDay}
            </span>
            {overflow && (
              <button
                type="button"
                aria-label={
                  expanded
                    ? ctx.labels.showFewer
                    : ctx.labels.showMore(
                        spans.filter((span) => span.lane >= shownLanes).length,
                        ctx.labels.allDay,
                      )
                }
                aria-expanded={expanded}
                onClick={() => setExpanded((value) => !value)}
                className="-me-1 inline-flex size-5 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
              >
                <IconChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-3.5 transition-transform duration-150 motion-reduce:transition-none",
                    expanded && "rotate-180",
                  )}
                />
              </button>
            )}
          </div>
          <div
            className="relative grid"
            style={{
              gridColumn: `2 / span ${n}`,
              gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
              height: laneHeight,
            }}
          >
            {days.map((day, col) => (
              <div
                key={dayKey(day)}
                className={cn(
                  "border-s border-border/60",
                  ctx.slot && "transition-colors duration-150 hover:bg-muted/40",
                )}
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest("button")) return;
                  ctx.slot?.(day, addDays(day, 1), { allDay: true, source: "click" });
                }}
              >
                {spans
                  .filter((span) => span.startCol === col && span.lane < shownLanes)
                  .sort((a, b) => a.lane - b.lane)
                  .map((span) => (
                    <EventChip
                      key={span.item.event.id}
                      ctx={ctx}
                      item={span.item}
                      view="week"
                      compact
                      tabbable={sameDay(days[span.startCol], ctx.focusDay)}
                      className={cn(
                        "absolute flex h-[22px] items-center rounded-md ps-2.5 pe-1.5",
                        span.continuesBefore && "rounded-s-sm ps-2",
                        span.continuesAfter && "rounded-e-sm",
                      )}
                      style={{
                        top: 3 + span.lane * LANE,
                        left: `calc(${(span.startCol / n) * 100}% + 3px)`,
                        width: `calc(${((span.endCol - span.startCol + 1) / n) * 100}% - 6px)`,
                      }}
                    >
                      {!span.continuesBefore && <span aria-hidden="true" className={accent} />}
                      <span
                        className={cn(
                          "truncate text-[12px] leading-5 font-medium",
                          titleInk,
                        )}
                      >
                        {span.continuesBefore && (
                          <IconChevronLeft
                            aria-hidden="true"
                            className="-ms-0.5 me-0.5 inline size-3 align-[-2px] rtl:rotate-180"
                          />
                        )}
                        {span.item.event.title}
                      </span>
                    </EventChip>
                  ))}
                {hiddenPerCol[col] > 0 && (
                  <button
                    type="button"
                    data-event-nav=""
                    tabIndex={sameDay(day, ctx.focusDay) ? 0 : -1}
                    aria-label={ctx.labels.showMore(hiddenPerCol[col], ctx.fmt.longDay(day))}
                    onKeyDown={ctx.onEventKeyDown}
                    onClick={() => setExpanded(true)}
                    className="absolute h-5 rounded-md px-1.5 text-start text-[11px] font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                    style={{
                      top: 3 + shownLanes * LANE,
                      left: `calc(${(col / n) * 100}% + 3px)`,
                    }}
                  >
                    {ctx.labels.more(hiddenPerCol[col])}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time grid */}
      <div
        className="relative grid"
        style={{ gridTemplateColumns: columns, minWidth: GUTTER + n * minDayWidth }}
      >
        <div
          aria-hidden="true"
          className="sticky start-0 z-20 bg-card"
          style={{ height: bodyHeight }}
        >
          {hours.map((h) => {
            const top = (h - startHour) * hourHeight;
            const nearNow = showNow && Math.abs(top - nowTop) < 16;
            return (
              <React.Fragment key={h}>
                <span
                  className={cn(
                    "absolute end-2 -translate-y-1/2 text-[11px] leading-none whitespace-nowrap text-muted-foreground tabular-nums transition-opacity",
                    nearNow && "opacity-0",
                  )}
                  style={{ top }}
                >
                  {ctx.fmt.hour(h)}
                </span>
                <span
                  className="absolute end-0 h-px w-1.5"
                  style={{ top, background: lineColor }}
                />
              </React.Fragment>
            );
          })}
          {showNow && (
            <span
              data-slot="event-calendar-now-label"
              className="absolute end-1.5 z-10 -translate-y-1/2 rounded-[5px] bg-primary px-1 py-px text-[11px] leading-4 font-semibold whitespace-nowrap text-primary-foreground tabular-nums shadow-[0_1px_2px_rgb(0_0_0/0.12)] dark:shadow-[0_2px_8px_-2px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]"
              style={{ top: nowTop }}
            >
              {ctx.fmt.clock(ctx.now)}
            </span>
          )}
        </div>
        {days.map((day, col) => {
          const isToday = col === todayCol;
          const workDay =
            !!workingHours &&
            (workingHours.days
              ? workingHours.days.includes(day.getDay() as WeekdayIndex)
              : !isWeekend(day));
          const workStart = workingHours ? clamp(workingHours.start * 60, lo, hi) : lo;
          const workEnd = workingHours ? clamp(workingHours.end * 60, lo, hi) : hi;
          const shade = ghost(col);
          const focused = sameDay(day, ctx.focusDay);
          return (
            <div
              key={dayKey(day)}
              role="group"
              aria-label={ctx.fmt.longDay(day)}
              data-slot="event-calendar-column"
              data-today={isToday ? "" : undefined}
              onPointerDown={(event) => onPointerDown(event, col)}
              onPointerMove={(event) => onPointerMove(event, col)}
              onPointerUp={(event) => onPointerUp(event, col)}
              onPointerCancel={() => setDraft(null)}
              onPointerLeave={() => setHover(null)}
              className={cn(
                "relative min-w-0 border-s border-border/60 touch-pan-y",
                isToday && "bg-primary/[0.025] dark:bg-primary/[0.04]",
              )}
              style={{
                height: bodyHeight,
                backgroundImage: `linear-gradient(to bottom, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, transparent ${hourHeight / 2}px, ${halfColor} ${hourHeight / 2}px, ${halfColor} ${hourHeight / 2 + 1}px, transparent ${hourHeight / 2 + 1}px)`,
                backgroundSize: `100% ${hourHeight}px`,
              }}
            >
              {workingHours && (
                <>
                  {(workDay ? [[lo, workStart], [workEnd, hi]] : [[lo, hi]]).map(
                    ([a, b]) =>
                      b > a && (
                        <span
                          key={a}
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0"
                          style={{
                            top: (a - lo) * pxPerMin,
                            height: (b - a) * pxPerMin,
                            background: offHours,
                          }}
                        />
                      ),
                  )}
                </>
              )}
              {showNow && !isToday && (
                // Other days get a faint guide that passes under their events.
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 h-px -translate-y-1/2 bg-primary/25"
                  style={{ top: nowTop }}
                />
              )}
              {shade && (
                <span
                  aria-hidden="true"
                  data-slot="event-calendar-selection"
                  className={cn(
                    "pointer-events-none absolute inset-x-[3px] z-10 flex items-start rounded-md px-2 py-1 text-[11px] leading-4 font-medium tabular-nums",
                    shade.solid
                      ? "bg-primary/12 text-primary ring-1 ring-primary/40 ring-inset shadow-[0_1px_2px_rgb(0_0_0/0.12)] dark:shadow-[0_6px_16px_-10px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]"
                      : "bg-foreground/[0.04] text-muted-foreground",
                  )}
                  style={{
                    top: (shade.a - lo) * pxPerMin + 1,
                    height: Math.max(18, (shade.b - shade.a) * pxPerMin - 2),
                  }}
                >
                  <span className="truncate">
                    {shade.solid
                      ? ctx.fmt.timeRange(atMinute(day, shade.a), atMinute(day, shade.b))
                      : ctx.fmt.shortTime(atMinute(day, shade.a))}
                  </span>
                </span>
              )}
              {segments[col].map((segment) => {
                const top = (segment.startMin - lo) * pxPerMin;
                const blockHeight = Math.max(22, (segment.endMin - segment.startMin) * pxPerMin);
                const compact = blockHeight < 38;
                // Room for a two-line title, the time, and the location.
                const tall = blockHeight >= 76;
                const segStart = atMinute(day, segment.startMin);
                const segEnd = atMinute(day, segment.endMin);
                const range = ctx.fmt.timeRange(segment.item.start, segment.item.end);
                const gap = segment.col + segment.span < segment.cols ? 2 : 0;
                return (
                  <EventChip
                    key={segment.item.event.id}
                    ctx={ctx}
                    item={segment.item}
                    view="week"
                    compact={compact}
                    start={segStart}
                    end={segEnd}
                    tabbable={focused}
                    className={cn(
                      "absolute flex rounded-md ps-2 pe-1 @min-[5rem]/chip:ps-2.5 @min-[5rem]/chip:pe-1.5",
                      compact ? "items-center py-0" : "flex-col py-1",
                    )}
                    style={{
                      top: top + 1,
                      height: blockHeight - 2,
                      // Leave a strip on the right so empty time stays clickable.
                      left: `calc(2px + (100% - 2px - min(8px, 10%)) * ${segment.col / segment.cols})`,
                      width: `calc((100% - 2px - min(8px, 10%)) * ${segment.span / segment.cols} - ${gap}px)`,
                    }}
                  >
                    <span aria-hidden="true" className={accent} />
                    {compact ? (
                      <span className="flex min-w-0 flex-1 items-baseline gap-1.5 text-[12px] leading-4">
                        <span
                          className={cn(
                            "min-w-0 truncate font-medium opacity-0 @min-[1.5rem]/chip:opacity-100",
                            titleInk,
                          )}
                        >
                          {segment.item.event.title}
                        </span>
                        <span className="hidden shrink-0 text-[11px] text-foreground/65 tabular-nums @min-[7.5rem]/chip:inline">
                          {ctx.fmt.shortTime(segment.item.start)}
                        </span>
                      </span>
                    ) : (
                      <>
                        <span
                          className={cn(
                            // Narrow chips hyphenate where they can and fade a long word at the edge instead of splitting it.
                            "text-[11px] leading-4 font-medium opacity-0 [hyphens:auto] [mask-image:linear-gradient(to_left,transparent,#000_6px)] @min-[1.5rem]/chip:opacity-100 @min-[4rem]/chip:text-[12px] @min-[4rem]/chip:[mask-image:none]",
                            titleInk,
                            // Narrow chips spend every line on the title; wider ones make room for the time.
                            "line-clamp-(--title-lines) @min-[4rem]/chip:line-clamp-(--title-lines-wide)",
                          )}
                          style={
                            {
                              "--title-lines": Math.max(1, Math.floor((blockHeight - 12) / 16)),
                              "--title-lines-wide": clamp(
                                Math.floor(
                                  (blockHeight - 28 - (tall && segment.item.event.location ? 16 : 0)) / 16,
                                ),
                                1,
                                3,
                              ),
                            } as React.CSSProperties
                          }
                        >
                          {segment.item.event.title}
                        </span>
                        <span className="hidden truncate text-[11px] leading-4 text-foreground/65 tabular-nums @min-[4rem]/chip:block">
                          {range}
                        </span>
                        {tall && segment.item.event.location && (
                          <span className="mt-auto hidden min-w-0 items-center gap-1 pb-px text-[11px] leading-4 text-foreground/60 @min-[5rem]/chip:flex">
                            <IconMapPin aria-hidden="true" className="size-3 shrink-0" />
                            <span className="truncate">{segment.item.event.location}</span>
                          </span>
                        )}
                      </>
                    )}
                  </EventChip>
                );
              })}
              {showNow && isToday && (
                <span
                  aria-hidden="true"
                  data-slot="event-calendar-now"
                  className="pointer-events-none absolute inset-x-0 z-20"
                  style={{ top: nowTop }}
                >
                  <span className="absolute inset-x-0 h-0.5 -translate-y-1/2 bg-primary dark:shadow-[0_0_8px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]" />
                  <span className="absolute -start-[5px] size-2.5 -translate-y-1/2 rounded-full bg-primary ring-2 ring-card" />
                </span>
              )}
            </div>
          );
        })}
        {showNow && <span className="sr-only">{`${ctx.labels.currentTime}, ${ctx.fmt.time(ctx.now)}`}</span>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Month                                                                     */
/* ------------------------------------------------------------------------ */

function MonthView({
  ctx,
  days,
  visible,
  month,
  items,
  maxEvents,
  fill,
}: {
  ctx: Ctx;
  days: Date[];
  visible: (day: Date) => boolean;
  month: Date;
  items: Item[];
  maxEvents: number;
  fill: boolean;
}) {
  const weeks = Array.from({ length: 6 }, (_, week) =>
    days.slice(week * 7, week * 7 + 7).filter(visible),
  );
  const n = weeks[0].length;
  const columns = `repeat(${n}, minmax(0, 1fr))`;
  const rowMin = MONTH_TOP + maxEvents * MONTH_LANE + 24;
  const weekdayShort = dtf(ctx.locale, { weekday: "short" });
  const weekdayLong = dtf(ctx.locale, { weekday: "long" });
  const monthDay = dtf(ctx.locale, { month: "short", day: "numeric" });
  const caption = dtf(ctx.locale, { month: "long", year: "numeric" }).format(month);

  return (
    <div
      role="grid"
      aria-label={caption}
      data-slot="event-calendar-month"
      className={cn("flex min-h-0 flex-col", fill && "flex-1 overflow-y-auto")}
    >
      <div
        role="row"
        className="grid shrink-0 border-b border-border/60"
        style={{ gridTemplateColumns: columns }}
      >
        {weeks[0].map((day) => (
          <div
            key={day.getDay()}
            role="columnheader"
            aria-label={weekdayLong.format(day)}
            className="truncate px-3 py-2 text-xs text-muted-foreground"
          >
            <abbr title={weekdayLong.format(day)} className="no-underline">
              {weekdayShort.format(day)}
            </abbr>
          </div>
        ))}
      </div>
      <div
        className={cn("grid", fill && "min-h-0 flex-1")}
        style={{ gridTemplateRows: `repeat(6, minmax(${rowMin}px, 1fr))` }}
      >
        {weeks.map((week) => (
          <MonthWeek
            key={dayKey(week[0])}
            ctx={ctx}
            week={week}
            month={month}
            items={items}
            maxEvents={maxEvents}
            columns={columns}
            monthDay={monthDay}
          />
        ))}
      </div>
    </div>
  );
}

function MonthWeek({
  ctx,
  week,
  month,
  items,
  maxEvents,
  columns,
  monthDay,
}: {
  ctx: Ctx;
  week: Date[];
  month: Date;
  items: Item[];
  maxEvents: number;
  columns: string;
  monthDay: Intl.DateTimeFormat;
}) {
  const n = week.length;
  const spans = React.useMemo(() => packLanes(items, week, true), [items, week]);
  return (
    <div
      role="row"
      className="relative grid border-b border-border/60 last:border-b-0"
      style={{ gridTemplateColumns: columns }}
    >
      {week.map((day, col) => {
        const outside = day.getMonth() !== month.getMonth();
        const isToday = sameDay(day, ctx.today);
        const focused = sameDay(day, ctx.focusDay);
        const covering = spans.filter((span) => span.startCol <= col && span.endCol >= col);
        const hidden = covering.filter((span) => span.lane >= maxEvents).length;
        const starting = spans
          .filter((span) => span.startCol === col && span.lane < maxEvents)
          .sort((a, b) => a.lane - b.lane);
        const dayItems = [...covering]
          .sort((a, b) => a.lane - b.lane)
          .map((span) => span.item);
        return (
          <div
            key={dayKey(day)}
            role="gridcell"
            data-slot="event-calendar-cell"
            data-outside={outside ? "" : undefined}
            data-today={isToday ? "" : undefined}
            data-focused={focused ? "" : undefined}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              ctx.slot?.(day, addDays(day, 1), { allDay: true, source: "click" });
            }}
            className={cn(
              "min-w-0 border-s border-border/60 px-1.5 pt-1.5 first:border-s-0",
              outside && "bg-muted/30 dark:bg-muted/20",
              ctx.slot && "transition-colors duration-150 hover:bg-muted/45",
            )}
          >
            <button
              type="button"
              data-slot="event-calendar-day"
              data-day-target={dayKey(day)}
              tabIndex={focused ? 0 : -1}
              aria-current={isToday ? "date" : undefined}
              aria-label={[
                ctx.fmt.longDay(day),
                isToday ? ctx.labels.todayMarker : null,
                ctx.labels.events(dayItems.length),
              ]
                .filter(Boolean)
                .join(", ")}
              onKeyDown={(event) => ctx.onDayKeyDown(event, day)}
              onClick={() => (ctx.openWeek ? ctx.openWeek(day) : ctx.pickDay(day))}
              className={cn(
                "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-medium whitespace-nowrap tabular-nums outline-none transition-[color,background-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none",
                isToday
                  ? "bg-primary font-semibold text-primary-foreground shadow-[0_1px_2px_rgb(0_0_0/0.12)] dark:shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--color-primary)_70%,transparent)] hover:bg-primary/90"
                  : outside
                    ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                    : "text-foreground hover:bg-muted",
              )}
            >
              {day.getDate() === 1 && !isToday ? monthDay.format(day) : day.getDate()}
            </button>
            {starting.map((span) => {
              const item = span.item;
              const timed = !item.lane;
              return (
                <EventChip
                  key={item.event.id}
                  ctx={ctx}
                  item={item}
                  view="month"
                  compact
                  tabbable={focused}
                  className={cn(
                    "absolute flex h-5 items-center gap-1.5 rounded-[5px] ps-2.5 pe-1.5 text-[12px] leading-[18px]",
                    span.continuesBefore && "rounded-s-sm ps-2",
                    span.continuesAfter && "rounded-e-sm",
                    timed &&
                      "[background-color:color-mix(in_oklab,var(--event-color)_8%,var(--color-card))] [border-color:color-mix(in_oklab,var(--event-color)_16%,transparent)]",
                  )}
                  style={{
                    top: MONTH_TOP + 4 + span.lane * MONTH_LANE,
                    left: `calc(${(span.startCol / n) * 100}% + 4px)`,
                    width: `calc(${((span.endCol - span.startCol + 1) / n) * 100}% - 8px)`,
                  }}
                >
                  {!span.continuesBefore && <span aria-hidden="true" className={accent} />}
                  <span className={cn("min-w-0 flex-1 truncate font-medium", titleInk)}>
                    {item.event.title}
                  </span>
                  {timed && (
                    <span className="hidden shrink-0 text-[11px] text-foreground/65 tabular-nums @min-[8.5rem]/chip:inline">
                      {ctx.fmt.shortTime(item.start)}
                    </span>
                  )}
                </EventChip>
              );
            })}
            {hidden > 0 && (
              <MorePopover
                ctx={ctx}
                day={day}
                items={dayItems}
                count={hidden}
                tabbable={focused}
                style={{
                  top: MONTH_TOP + 4 + maxEvents * MONTH_LANE,
                  left: `calc(${(col / n) * 100}% + 4px)`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function MorePopover({
  ctx,
  day,
  items,
  count,
  tabbable,
  style,
}: {
  ctx: Ctx;
  day: Date;
  items: Item[];
  count: number;
  tabbable: boolean;
  style: React.CSSProperties;
}) {
  const [open, setOpen] = React.useState(false);
  const longDay = ctx.fmt.longDay(day);
  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const list = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("[data-event]"),
    );
    const index = list.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? list.length - 1
          : clamp(index + (event.key === "ArrowDown" ? 1 : -1), 0, list.length - 1);
    event.preventDefault();
    list[next]?.focus();
  };
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-slot="event-calendar-more"
          data-event-nav=""
          data-state={open ? "open" : "closed"}
          tabIndex={tabbable ? 0 : -1}
          aria-label={ctx.labels.showMore(count, longDay)}
          onKeyDown={ctx.onEventKeyDown}
          className="absolute flex h-5 items-center rounded-[5px] px-1.5 text-[12px] leading-5 font-medium text-muted-foreground transition-colors duration-150 outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=open]:bg-muted data-[state=open]:text-foreground motion-reduce:transition-none"
          style={style}
        >
          {ctx.labels.more(count)}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={6}
          collisionPadding={12}
          aria-label={longDay}
          data-slot="event-calendar-more-content"
          className="z-50 w-64 max-w-[calc(100vw-24px)] origin-(--radix-popover-content-transform-origin) rounded-xl border border-border/70 bg-popover/90 p-1.5 text-popover-foreground shadow-xl backdrop-blur-md outline-none motion-safe:animate-[event-calendar-pop_180ms_cubic-bezier(0.22,1,0.36,1)]"
        >
          <div className="flex items-baseline justify-between gap-3 px-2 pt-1 pb-2">
            <span className="text-sm font-semibold tracking-tight">
              {dtf(ctx.locale, { weekday: "long" }).format(day)}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {dtf(ctx.locale, { month: "long", day: "numeric" }).format(day)}
            </span>
          </div>
          <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto p-0.5" onKeyDown={onListKeyDown}>
            {items.map((item) => (
              <li key={item.event.id}>
                <EventChip
                  ctx={{
                    ...ctx,
                    onEventKeyDown: () => {},
                    activate: (event, element, view) => {
                      ctx.activate(event, element, view);
                      setOpen(false);
                    },
                  }}
                  item={item}
                  view="month"
                  tabbable
                  className="relative flex w-full flex-col rounded-lg py-1.5 ps-3 pe-2 shadow-none"
                >
                  <span aria-hidden="true" className={cn(accent, "inset-y-1.5 start-1")} />
                  <span className={cn("truncate text-[13px] leading-5 font-medium", titleInk)}>
                    {item.event.title}
                  </span>
                  <span className="truncate text-xs leading-4 text-foreground/65 tabular-nums">
                    {ctx.timeLabel(item, day)}
                  </span>
                </EventChip>
              </li>
            ))}
          </ul>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

/* ------------------------------------------------------------------------ */
/* Agenda                                                                    */
/* ------------------------------------------------------------------------ */

function AgendaView({
  ctx,
  days,
  items,
}: {
  ctx: Ctx;
  days: Date[];
  items: Item[];
}) {
  const uid = React.useId();
  const listRef = React.useRef<HTMLDivElement>(null);
  const groups = React.useMemo(
    () =>
      days
        .map((day) => {
          const key = dayKey(day);
          const entries = items
            .filter((item) =>
              item.lane
                ? item.first <= key && item.last >= key
                : item.first === key,
            )
            .sort(
              (a, b) =>
                Number(b.lane) - Number(a.lane) ||
                a.start.getTime() - b.start.getTime(),
            );
          return { day, entries };
        })
        .filter((group) => group.entries.length > 0),
    [days, items],
  );
  const rowIds = groups.flatMap((group) =>
    group.entries.map((item) => `${dayKey(group.day)}:${item.event.id}`),
  );
  const [active, setActive] = React.useState<string | null>(null);
  const activeId = active && rowIds.includes(active) ? active : (rowIds[0] ?? null);
  const relative = React.useMemo(() => {
    try {
      return new Intl.RelativeTimeFormat(ctx.locale, { numeric: "auto" });
    } catch {
      return null;
    }
  }, [ctx.locale]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const list = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("[data-agenda-row]") ?? [],
    );
    const index = list.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    const groupOf = (el: HTMLElement) => el.dataset.agendaRow?.split(":")[0];
    let next = -1;
    switch (event.key) {
      case "ArrowDown":
        next = Math.min(list.length - 1, index + 1);
        break;
      case "ArrowUp":
        next = Math.max(0, index - 1);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = list.length - 1;
        break;
      case "PageDown": {
        const current = groupOf(list[index]);
        next = list.findIndex((el, i) => i > index && groupOf(el) !== current);
        if (next < 0) next = list.length - 1;
        break;
      }
      case "PageUp": {
        const current = groupOf(list[index]);
        const before = list.slice(0, index).filter((el) => groupOf(el) !== current);
        const target = before.length ? groupOf(before[before.length - 1]) : current;
        next = list.findIndex((el) => groupOf(el) === target);
        break;
      }
      default:
        return;
    }
    event.preventDefault();
    list[next]?.focus();
  };

  if (!groups.length) {
    return (
      <div
        data-slot="event-calendar-empty"
        className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center"
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground ring-1 ring-border/60 ring-inset">
          <IconCalendarOff aria-hidden="true" className="size-5" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-tight">{ctx.labels.noEvents}</p>
          <p className="max-w-xs text-[13px] leading-5 text-muted-foreground">
            {ctx.labels.noEventsDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      data-slot="event-calendar-agenda"
      onKeyDown={onKeyDown}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-1 [scrollbar-width:thin] @min-[36rem]/event-calendar:px-3"
    >
      {groups.map(({ day, entries }) => {
        const key = dayKey(day);
        const isToday = sameDay(day, ctx.today);
        const offset = epochDay(day) - epochDay(ctx.today);
        const near =
          relative && Math.abs(offset) <= 1
            ? capitalize(relative.format(offset, "day"), ctx.locale)
            : null;
        const headingId = `${uid}-${key}`;
        return (
          <section
            key={key}
            aria-labelledby={headingId}
            data-slot="event-calendar-agenda-day"
            data-today={isToday ? "" : undefined}
            className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-2 border-t border-border/60 py-2.5 first:border-t-0 @min-[36rem]/event-calendar:grid-cols-[4.5rem_minmax(0,1fr)] @min-[36rem]/event-calendar:gap-x-3"
          >
            <h3
              id={headingId}
              className="sticky top-2.5 flex flex-col items-center self-start pt-1.5"
            >
              <span aria-hidden="true" className={cn("text-xs", isToday ? "font-medium text-primary" : "text-muted-foreground")}>
                {dtf(ctx.locale, { weekday: "short" }).format(day)}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 flex size-8 items-center justify-center rounded-full text-lg font-semibold tracking-[-0.02em] tabular-nums",
                  isToday &&
                    "bg-primary text-primary-foreground shadow-[0_1px_2px_rgb(0_0_0/0.12)] dark:shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]",
                )}
              >
                {day.getDate()}
              </span>
              {near && (
                <span aria-hidden="true" className={cn("mt-1 text-[11px] font-medium", isToday ? "text-primary" : "text-muted-foreground")}>
                  {near}
                </span>
              )}
              <span className="sr-only">
                {[near, ctx.fmt.longDay(day), ctx.labels.events(entries.length)]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </h3>
            <ul className="flex min-w-0 flex-col gap-0.5 py-0.5">
              {entries.map((item) => {
                const rowId = `${key}:${item.event.id}`;
                const selected = ctx.selectedId === item.event.id;
                const time = ctx.timeLabel(item, day);
                return (
                  <li key={item.event.id}>
                    <button
                      type="button"
                      data-slot="event-calendar-event"
                      data-event={item.event.id}
                      data-agenda-row={rowId}
                      data-selected={selected ? "" : undefined}
                      tabIndex={rowId === activeId ? 0 : -1}
                      aria-label={ctx.eventLabel(item)}
                      onFocus={() => setActive(rowId)}
                      onClick={(event) => ctx.activate(item.event, event.currentTarget, "agenda")}
                      style={{ "--event-color": item.color } as React.CSSProperties}
                      className={cn(
                        "group/event relative grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-lg py-2 ps-4 pe-2 text-start outline-none transition-[background-color,box-shadow] duration-150 hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none @min-[36rem]/event-calendar:grid-cols-[8.5rem_minmax(0,1fr)_auto]",
                        selected &&
                          "[background-color:color-mix(in_oklab,var(--event-color)_10%,transparent)] ring-2 ring-primary/30 hover:[background-color:color-mix(in_oklab,var(--event-color)_14%,transparent)]",
                      )}
                    >
                      <span aria-hidden="true" className="pointer-events-none absolute inset-y-2 start-1.5 w-[3px] rounded-full bg-[var(--event-color)]" />
                      {ctx.renderEvent ? (
                        <span className="col-span-full min-w-0">
                          {ctx.renderEvent(item.event, {
                            view: "agenda",
                            start: item.start,
                            end: item.end,
                            color: item.color,
                            timeLabel: time,
                            compact: false,
                            allDay: item.lane,
                            selected,
                          })}
                        </span>
                      ) : (
                        <>
                          <span className="hidden text-xs text-muted-foreground tabular-nums @min-[36rem]/event-calendar:block">
                            {time}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm leading-5 font-medium text-foreground">
                              {item.event.title}
                            </span>
                            <span className="flex min-w-0 items-center gap-1.5 text-xs leading-5 text-muted-foreground">
                              <span className="shrink-0 tabular-nums @min-[36rem]/event-calendar:hidden">
                                {time}
                              </span>
                              {item.event.location && (
                                <>
                                  <span aria-hidden="true" className="@min-[36rem]/event-calendar:hidden">·</span>
                                  <IconMapPin aria-hidden="true" className="hidden size-3 shrink-0 @min-[36rem]/event-calendar:block" />
                                  <span className="truncate">{item.event.location}</span>
                                </>
                              )}
                            </span>
                          </span>
                          {item.event.attendees?.length ? (
                            <Initials attendees={item.event.attendees} />
                          ) : (
                            <span />
                          )}
                        </>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
