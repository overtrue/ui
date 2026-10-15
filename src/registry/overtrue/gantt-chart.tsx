"use client";

import * as React from "react";
import {
  IconAlertTriangle as AlertTriangle,
  IconChevronDown as ChevronDown,
  IconFocus2 as FocusIcon,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export type GanttZoom = "day" | "week" | "month";

export interface GanttTask {
  id: string;
  label: string;
  /** First day of the task. Date-only strings such as "2026-10-05" are read as calendar days. */
  start: Date | string;
  /** Last day of the task, inclusive. A one-day task has the same start and end. */
  end: Date | string;
  /** Completion from 0 to 1. */
  progress?: number;
  /** Tasks sharing a group are listed together under a collapsible header. */
  group?: string;
  /** Person responsible, shown as initials. */
  owner?: string;
  /** Ids of tasks that must finish first. Drawn as arrows into this task. */
  dependsOn?: string[];
  /** Draw as a diamond on its start date instead of a bar. */
  milestone?: boolean;
  /** Any CSS colour. Defaults to a chart colour per group. */
  color?: string;
}

export interface GanttTaskChange {
  /** New first day, at local midnight. */
  start: Date;
  /** New last day (inclusive), at local midnight. */
  end: Date;
}

/** Geometry and state passed to `renderBar`. */
export interface GanttBarInfo {
  start: Date;
  end: Date;
  /** Inclusive length in days. */
  duration: number;
  progress: number;
  /** Bar width in pixels at the current zoom. */
  width: number;
  color: string;
  zoom: GanttZoom;
  milestone: boolean;
  overdue: boolean;
  /** Days past the end while unfinished; 0 when on time. */
  overdueDays: number;
  selected: boolean;
  active: boolean;
  dragging: boolean;
}

export interface GanttChartProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "children"
> {
  tasks: GanttTask[];
  /** Time scale. Leave undefined to let the chart manage it. */
  zoom?: GanttZoom;
  defaultZoom?: GanttZoom;
  onZoomChange?: (zoom: GanttZoom) => void;
  /** Draws the today line and decides what is overdue. Defaults to the current date. */
  today?: Date | string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Controls at the top right, before the zoom control. */
  actions?: React.ReactNode;
  /** The selected task. Pass null for none; leave undefined to let the chart manage it. */
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedChange?: (id: string | null, task: GanttTask | null) => void;
  /** Replaces the task name in the left column. */
  renderTaskLabel?: (task: GanttTask) => React.ReactNode;
  /** Replaces the inside of a bar. The wrapper keeps position, focus, and dragging. */
  renderBar?: (task: GanttTask, info: GanttBarInfo) => React.ReactNode;
  /** Drag bars to move them, drag their edges to resize, or use the arrow keys. */
  editable?: boolean;
  /** Called with the new dates when a task is moved or resized. */
  onTaskChange?: (task: GanttTask, change: GanttTaskChange) => void;
  /** Formats dates in the readout and accessible labels. Defaults to "Oct 6". */
  dateFormatter?: (date: Date) => string;
  /** Order groups explicitly. Unlisted groups follow in order of appearance. */
  groupOrder?: string[];
  defaultCollapsedGroups?: string[];
  /** First day of the week for week columns and alignment. Defaults to Monday. */
  weekStartsOn?: 0 | 1;
  /** Readout content when no task is active, such as a status line. */
  summary?: React.ReactNode;
  /** Maximum height of the schedule in pixels. Taller schedules scroll under a sticky time header. */
  height?: number;
  showZoomControl?: boolean;
  showLegend?: boolean;
}

/* ------------------------------------------------------------------------ */
/* Calendar days                                                             */
/* ------------------------------------------------------------------------ */

const DAY_MS = 86_400_000;
const ROW = 36;
const GROUP_ROW = 32;
const BAR = 22;
const HEADER = 50;
const ZOOMS: { value: GanttZoom; label: string; ppd: number }[] = [
  { value: "day", label: "Day", ppd: 34 },
  { value: "week", label: "Week", ppd: 10 },
  { value: "month", label: "Month", ppd: 4 },
];
const PALETTE = [
  "var(--color-chart-1)",
  "var(--color-chart-4)",
  "var(--color-chart-2)",
  "var(--color-chart-5)",
  "var(--color-chart-3)",
];

/** Whole days since 1970-01-01 for the calendar date the input names. */
function toDay(input: Date | string): number {
  if (typeof input === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
    if (match)
      return Math.round(Date.UTC(+match[1], +match[2] - 1, +match[3]) / DAY_MS);
    input = new Date(input);
  }
  const time = input.getTime();
  if (!Number.isFinite(time)) return NaN;
  return Math.round(
    Date.UTC(input.getFullYear(), input.getMonth(), input.getDate()) / DAY_MS,
  );
}

/** The calendar day as a local-midnight Date. */
function fromDay(day: number) {
  const d = new Date(day * DAY_MS);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function parts(day: number) {
  const d = new Date(day * DAY_MS);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    date: d.getUTCDate(),
    weekday: d.getUTCDay(),
  };
}

const utc = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options });
const monthYear = utc({ month: "long", year: "numeric" });
const monthShort = utc({ month: "short" });
const monthDay = utc({ month: "short", day: "numeric" });
const localMonthDay = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const defaultDateFormatter = (date: Date) => localMonthDay.format(date);

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const pct = (value: number) => `${Math.round(value * 100)}%`;

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  return (
    words.length === 1
      ? words[0].slice(0, 2)
      : words[0][0] + words[words.length - 1][0]
  ).toUpperCase();
}

function hash(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Orthogonal path through the points with softly rounded corners. */
function roundedPath(points: [number, number][], radius = 4) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    const r = Math.min(
      radius,
      Math.hypot(x - px, y - py) / 2,
      Math.hypot(nx - x, ny - y) / 2,
    );
    const ax = x - Math.sign(x - px) * r;
    const ay = y - Math.sign(y - py) * r;
    const bx = x + Math.sign(nx - x) * r;
    const by = y + Math.sign(ny - y) * r;
    d += `L${ax} ${ay}Q${x} ${y} ${bx} ${by}`;
  }
  const last = points[points.length - 1];
  return `${d}L${last[0]} ${last[1]}`;
}

/* ------------------------------------------------------------------------ */
/* Model                                                                     */
/* ------------------------------------------------------------------------ */

interface TaskModel {
  task: GanttTask;
  start: number;
  end: number;
  progress: number;
  milestone: boolean;
  color: string;
  group: string;
}

type Row =
  | {
      kind: "group";
      key: string;
      name: string;
      color: string;
      members: TaskModel[];
      y: number;
      h: number;
    }
  | { kind: "task"; key: string; model: TaskModel; y: number; h: number };

interface DragState {
  id: string;
  mode: "move" | "start" | "end";
  originX: number;
  from: [number, number];
  start: number;
  end: number;
  moved: boolean;
}

/* ------------------------------------------------------------------------ */
/* GanttChart                                                                */
/* ------------------------------------------------------------------------ */

/**
 * A project schedule: a grouped task list beside a zoomable time grid with progress
 * bars, milestones, dependency arrows, and a today line. Hover a bar to read it in the
 * footer; with `editable`, drag or use the arrow keys to reschedule.
 */
function GanttChart({
  tasks,
  zoom: zoomProp,
  defaultZoom = "week",
  onZoomChange,
  today: todayProp,
  title,
  description,
  actions,
  selectedId,
  defaultSelectedId = null,
  onSelectedChange,
  renderTaskLabel,
  renderBar,
  editable = false,
  onTaskChange,
  dateFormatter = defaultDateFormatter,
  groupOrder,
  defaultCollapsedGroups,
  weekStartsOn = 1,
  summary,
  height,
  showZoomControl = true,
  showLegend = true,
  className,
  ...props
}: GanttChartProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [innerZoom, setInnerZoom] = React.useState<GanttZoom>(defaultZoom);
  const zoom = zoomProp ?? innerZoom;
  const ppd = ZOOMS.find((z) => z.value === zoom)?.ppd ?? 12;
  const [now] = React.useState(() => new Date());
  const today = toDay(todayProp ?? now);

  const [innerSelected, setInnerSelected] = React.useState<string | null>(
    defaultSelectedId,
  );
  const controlled = selectedId !== undefined;
  const selected = controlled ? selectedId : innerSelected;
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const [tabStopId, setTabStopId] = React.useState<string | null>(null);
  const [collapsed, setCollapsed] = React.useState<Set<string>>(
    () => new Set(defaultCollapsedGroups ?? []),
  );
  const [drag, setDrag] = React.useState<DragState | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);
  // Width of the visible timeline, so short schedules still fill the card.
  const [available, setAvailable] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const suppressClick = React.useRef(false);

  const fmt = (day: number) => dateFormatter(fromDay(day));

  /* Tasks → models and groups ------------------------------------------- */

  const { models, groups, grouped } = React.useMemo(() => {
    const order = new Map<string, number>();
    for (const name of groupOrder ?? []) order.set(name, order.size);
    for (const task of tasks) {
      const name = task.group ?? "";
      if (!order.has(name)) order.set(name, order.size);
    }
    const list: TaskModel[] = [];
    for (const task of tasks) {
      const a = toDay(task.start);
      const b = toDay(task.end);
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      const group = task.group ?? "";
      const milestone = task.milestone ?? false;
      list.push({
        task,
        start: Math.min(a, b),
        end: milestone ? Math.min(a, b) : Math.max(a, b),
        progress: clamp01(task.progress ?? 0),
        milestone,
        color: task.color ?? PALETTE[(order.get(group) ?? 0) % PALETTE.length],
        group,
      });
    }
    const byGroup = new Map<string, TaskModel[]>();
    for (const [name] of [...order.entries()].sort((x, y) => x[1] - y[1]))
      byGroup.set(name, []);
    for (const model of list) byGroup.get(model.group)!.push(model);
    const groupList = [...byGroup.entries()]
      .filter(([, members]) => members.length > 0)
      .map(([name, members]) => ({
        name,
        members,
        color: PALETTE[(order.get(name) ?? 0) % PALETTE.length],
      }));
    return {
      models: list,
      groups: groupList,
      grouped: groupList.length > 1 || (groupList[0]?.name ?? "") !== "",
    };
  }, [tasks, groupOrder]);

  // While dragging, the dragged task previews its new dates everywhere.
  const live = React.useCallback(
    (model: TaskModel): TaskModel =>
      drag && drag.id === model.task.id
        ? { ...model, start: drag.start, end: drag.end }
        : model,
    [drag],
  );

  const byId = React.useMemo(
    () => new Map(models.map((m) => [m.task.id, m])),
    [models],
  );

  /* Time range ------------------------------------------------------------ */

  const range = React.useMemo(() => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const m of models) {
      lo = Math.min(lo, m.start);
      hi = Math.max(hi, m.end);
    }
    if (lo === Infinity) {
      lo = today - 14;
      hi = today + 28;
    }
    if (today >= lo - 60 && today <= hi + 60) {
      lo = Math.min(lo, today);
      hi = Math.max(hi, today);
    }
    const pad = zoom === "day" ? 7 : zoom === "week" ? 14 : 31;
    lo -= pad;
    hi += pad;
    // Align to a week start in day and week zoom, and to a month start in month zoom.
    if (zoom === "month") {
      const p = parts(lo);
      lo = Math.round(Date.UTC(p.year, p.month, 1) / DAY_MS);
    } else {
      lo -= (parts(lo).weekday - weekStartsOn + 7) % 7;
    }
    hi = Math.max(hi, lo + Math.ceil(available / ppd) - 1);
    if (zoom === "month") {
      const q = parts(hi);
      hi = Math.round(Date.UTC(q.year, q.month + 1, 1) / DAY_MS) - 1;
    } else {
      hi += (weekStartsOn + 6 - parts(hi).weekday + 7) % 7;
    }
    return { lo, hi, days: hi - lo + 1 };
  }, [models, today, zoom, weekStartsOn, available, ppd]);

  const { lo, hi } = range;
  const W = range.days * ppd;
  const xOf = (day: number) => (day - lo) * ppd;

  const ticks = React.useMemo(() => {
    const major: { key: string; x: number; w: number; label: string }[] = [];
    const minor: {
      key: string;
      x: number;
      w: number;
      label: string;
      weekend: boolean;
      day: number;
    }[] = [];
    const monthLines: number[] = [];
    for (let day = lo; day <= hi; day++) {
      const p = parts(day);
      if (p.date === 1 && day !== lo) monthLines.push(xOf(day));
      const startsMajor =
        day === lo ||
        (zoom === "month" ? p.date === 1 && p.month % 3 === 0 : p.date === 1);
      if (startsMajor) {
        if (major.length)
          major[major.length - 1].w = xOf(day) - major[major.length - 1].x;
        major.push({
          key: `M${day}`,
          x: xOf(day),
          w: 0,
          label:
            zoom === "month"
              ? `Q${Math.floor(p.month / 3) + 1} ${p.year}`
              : monthYear.format(new Date(day * DAY_MS)),
        });
      }
      const startsMinor =
        zoom === "day"
          ? true
          : zoom === "week"
            ? p.weekday === weekStartsOn
            : p.date === 1 || day === lo;
      if (startsMinor) {
        if (minor.length)
          minor[minor.length - 1].w = xOf(day) - minor[minor.length - 1].x;
        minor.push({
          key: `m${day}`,
          x: xOf(day),
          w: 0,
          day,
          weekend: zoom === "day" && (p.weekday === 0 || p.weekday === 6),
          label:
            zoom === "day"
              ? String(p.date)
              : zoom === "week"
                ? monthDay.format(new Date(day * DAY_MS))
                : monthShort.format(new Date(day * DAY_MS)),
        });
      }
    }
    if (major.length) major[major.length - 1].w = W - major[major.length - 1].x;
    if (minor.length) minor[minor.length - 1].w = W - minor[minor.length - 1].x;
    return { major, minor, monthLines };
  }, [lo, hi, zoom, ppd, weekStartsOn, W]);

  /* Rows ------------------------------------------------------------------ */

  const rows = React.useMemo(() => {
    const out: Row[] = [];
    let y = 0;
    for (const group of groups) {
      if (grouped) {
        out.push({
          kind: "group",
          key: `g:${group.name}`,
          name: group.name,
          color: group.color,
          members: group.members,
          y,
          h: GROUP_ROW,
        });
        y += GROUP_ROW;
        if (collapsed.has(group.name)) continue;
      }
      for (const model of group.members) {
        out.push({ kind: "task", key: model.task.id, model, y, h: ROW });
        y += ROW;
      }
    }
    return { list: out, height: y };
  }, [groups, grouped, collapsed]);

  const taskRows = rows.list.filter(
    (row): row is Extract<Row, { kind: "task" }> => row.kind === "task",
  );
  const rowOf = new Map(taskRows.map((row) => [row.model.task.id, row]));

  const overdueDays = (m: TaskModel) =>
    m.progress < 1 && m.end < today ? today - m.end : 0;

  /* Selection, hover, focus ------------------------------------------------ */

  const transientId = drag?.id ?? hoveredId ?? focusedId;
  const activeId = transientId ?? selected ?? null;
  const activeModel = activeId ? byId.get(activeId) : undefined;
  const stopId =
    tabStopId && rowOf.has(tabStopId)
      ? tabStopId
      : selected && rowOf.has(selected)
        ? selected
        : (taskRows[0]?.model.task.id ?? null);

  const setSelected = (id: string | null) => {
    if (!controlled) setInnerSelected(id);
    onSelectedChange?.(id, id ? (byId.get(id)?.task ?? null) : null);
  };
  const toggle = (id: string) => setSelected(selected === id ? null : id);

  const setZoom = (next: GanttZoom) => {
    if (next === zoom) return;
    if (zoomProp === undefined) setInnerZoom(next);
    onZoomChange?.(next);
  };

  const toggleGroup = (name: string) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  /* Scrolling ------------------------------------------------------------- */

  const view = React.useRef<{ lo: number; ppd: number } | null>(null);
  const viewport = () => {
    const el = scrollRef.current;
    if (!el) return 0;
    return el.clientWidth - (labelRef.current?.offsetWidth ?? 0);
  };
  const scrollToDay = (day: number, fraction: number, smooth = false) => {
    const el = scrollRef.current;
    if (!el) return;
    const left = Math.max(0, (day - lo + 0.5) * ppd - viewport() * fraction);
    el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  };

  React.useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () =>
      setAvailable(
        Math.max(0, el.clientWidth - (labelRef.current?.offsetWidth ?? 0)),
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // First paint: open on today (or the first task). Zoom changes keep today where it
  // was on screen when it was visible, and the centre date otherwise.
  React.useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const previous = view.current;
    if (previous && previous.ppd !== ppd) {
      const width = viewport();
      const todayAt =
        (today - previous.lo + 0.5) * previous.ppd - el.scrollLeft;
      if (today >= lo && today <= hi && todayAt >= 0 && todayAt <= width) {
        scrollToDay(today, todayAt / (width || 1));
      } else {
        const center = previous.lo + (el.scrollLeft + width / 2) / previous.ppd;
        scrollToDay(center - 0.5, 0.5);
      }
    } else if (!previous) {
      const first = models.length
        ? Math.min(...models.map((m) => m.start))
        : today;
      scrollToDay(
        today >= lo && today <= hi ? today : first,
        today >= lo && today <= hi ? 0.32 : 0.05,
      );
    }
    view.current = { lo, ppd };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ppd]);
  React.useLayoutEffect(() => {
    if (view.current) view.current.lo = lo;
  }, [lo]);

  /* Editing --------------------------------------------------------------- */

  const commit = (model: TaskModel, start: number, end: number) => {
    if (start === model.start && end === model.end) return;
    onTaskChange?.(model.task, { start: fromDay(start), end: fromDay(end) });
    setAnnouncement(
      `${model.task.label}: ${fmt(start)}${model.milestone ? "" : ` to ${fmt(end)}`}`,
    );
  };

  const onBarPointerDown = (
    event: React.PointerEvent<HTMLElement>,
    model: TaskModel,
    mode: DragState["mode"],
  ) => {
    if (!editable || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    (
      event.currentTarget.closest(
        '[data-slot="gantt-bar"]',
      ) as HTMLElement | null
    )?.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({
      id: model.task.id,
      mode,
      originX: event.clientX,
      from: [model.start, model.end],
      start: model.start,
      end: model.end,
      moved: false,
    });
  };

  const onBarPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!drag) return;
    const dx = event.clientX - drag.originX;
    const days = Math.round(dx / ppd);
    let [start, end] = drag.from;
    if (drag.mode === "move") {
      const span = end - start;
      start = Math.min(hi - span, Math.max(lo, start + days));
      end = start + span;
    } else if (drag.mode === "start") {
      start = Math.min(end, Math.max(lo, start + days));
    } else {
      end = Math.max(start, Math.min(hi, end + days));
    }
    const moved = drag.moved || Math.abs(dx) > 3;
    if (start !== drag.start || end !== drag.end || moved !== drag.moved)
      setDrag({ ...drag, start, end, moved });
  };

  const onBarPointerUp = (model: TaskModel) => {
    if (!drag) return;
    if (drag.moved) {
      suppressClick.current = true;
      commit(model, drag.start, drag.end);
    }
    setDrag(null);
  };

  const onBarKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    model: TaskModel,
  ) => {
    const index = taskRows.findIndex(
      (row) => row.model.task.id === model.task.id,
    );
    const focusTask = (id: string | undefined) => {
      if (!id) return;
      setTabStopId(id);
      const bar = scrollRef.current?.querySelector<HTMLElement>(
        `[data-slot="gantt-bar"][data-id="${CSS.escape(id)}"]`,
      );
      bar?.focus({ preventScroll: true });
      bar?.scrollIntoView({ block: "nearest", inline: "nearest" });
    };
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusTask(taskRows[index + 1]?.model.task.id);
        return;
      case "ArrowUp":
        event.preventDefault();
        focusTask(taskRows[index - 1]?.model.task.id);
        return;
      case "Home":
        event.preventDefault();
        focusTask(taskRows[0]?.model.task.id);
        return;
      case "End":
        event.preventDefault();
        focusTask(taskRows[taskRows.length - 1]?.model.task.id);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        toggle(model.task.id);
        return;
      case "Escape":
        if (selected != null) {
          event.preventDefault();
          setSelected(null);
        }
        return;
      case "ArrowLeft":
      case "ArrowRight": {
        if (!editable) return;
        event.preventDefault();
        const step = event.key === "ArrowRight" ? 1 : -1;
        if (event.shiftKey && !model.milestone) {
          commit(
            model,
            model.start,
            Math.max(model.start, Math.min(hi, model.end + step)),
          );
        } else {
          const span = model.end - model.start;
          const start = Math.min(hi - span, Math.max(lo, model.start + step));
          commit(model, start, start + span);
        }
        return;
      }
    }
  };

  /* Readout --------------------------------------------------------------- */

  const totalDays = models.reduce(
    (sum, m) => sum + (m.milestone ? 0 : m.end - m.start + 1),
    0,
  );
  const overall = totalDays
    ? models.reduce(
        (sum, m) =>
          sum + (m.milestone ? 0 : (m.end - m.start + 1) * m.progress),
        0,
      ) / totalDays
    : 0;
  const overdueCount = models.filter((m) => overdueDays(m) > 0).length;
  const nextMilestone = models
    .filter((m) => m.milestone && m.start >= today && m.progress < 1)
    .sort((a, b) => a.start - b.start)[0];

  let readout: React.ReactNode;
  if (activeModel) {
    const m = live(activeModel);
    const late = overdueDays(m);
    readout = (
      <>
        <div className="flex min-w-14 flex-col">
          <span className="text-base leading-5 font-semibold tracking-tight tabular-nums">
            {m.milestone
              ? m.progress >= 1
                ? "Done"
                : fmt(m.start)
              : pct(m.progress)}
          </span>
          <span className="text-[10.5px] leading-4 text-muted-foreground">
            {m.milestone ? "milestone" : "complete"}
          </span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="flex min-w-0 items-center gap-1.5 text-xs leading-5">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-[3px]"
              style={{ background: m.color }}
            />
            <span className="truncate font-medium text-foreground">
              {m.task.label}
            </span>
            {m.task.owner ? (
              <span className="shrink-0 text-muted-foreground">
                · {m.task.owner}
              </span>
            ) : null}
          </span>
          <span className="flex min-w-0 items-center gap-1.5 text-[10.5px] leading-4 text-muted-foreground">
            <span className="font-mono tabular-nums">
              {m.milestone ? fmt(m.start) : `${fmt(m.start)} → ${fmt(m.end)}`}
            </span>
            {!m.milestone ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{m.end - m.start + 1}d</span>
              </>
            ) : null}
            {late ? (
              <span className="inline-flex items-center gap-1 font-medium text-destructive">
                <AlertTriangle aria-hidden="true" className="size-3" />
                {late}d overdue
              </span>
            ) : null}
            {drag?.moved ? (
              <span className="text-foreground">· release to apply</span>
            ) : null}
          </span>
        </div>
      </>
    );
  } else if (summary != null) {
    readout = summary;
  } else {
    readout = (
      <>
        <div className="flex min-w-14 flex-col">
          <span className="text-base leading-5 font-semibold tracking-tight tabular-nums">
            {pct(overall)}
          </span>
          <span className="text-[10.5px] leading-4 text-muted-foreground">
            complete
          </span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-xs leading-5 text-foreground">
            {models.length} {models.length === 1 ? "task" : "tasks"}
            {grouped
              ? ` · ${groups.length} ${groups.length === 1 ? "group" : "groups"}`
              : ""}
          </span>
          <span className="truncate text-[10.5px] leading-4 text-muted-foreground">
            {overdueCount ? (
              <span className="text-destructive">{overdueCount} overdue</span>
            ) : (
              "On schedule"
            )}
            {nextMilestone
              ? ` · Next: ${nextMilestone.task.label}, ${fmt(nextMilestone.start)}`
              : null}
          </span>
        </div>
      </>
    );
  }

  /* Render ---------------------------------------------------------------- */

  const describe = (m: TaskModel) => {
    const out = [m.task.label];
    if (m.milestone) out.push(`milestone ${fmt(m.start)}`);
    else
      out.push(
        `${fmt(m.start)} to ${fmt(m.end)}`,
        `${m.end - m.start + 1} days`,
        `${pct(m.progress)} complete`,
      );
    if (m.task.owner) out.push(m.task.owner);
    const late = overdueDays(m);
    if (late) out.push(`${late} days overdue`);
    return out.join(", ");
  };

  const todayX = today >= lo && today <= hi ? xOf(today) + ppd / 2 : null;
  const hasHeader =
    title != null || description != null || actions != null || showZoomControl;
  const scheduleLabel = typeof title === "string" ? title : "Schedule";

  // Dependency connectors between visible tasks.
  const connectors: {
    key: string;
    d: string;
    tone: "idle" | "active" | "conflict";
  }[] = [];
  for (const row of taskRows) {
    const target = live(row.model);
    for (const depId of row.model.task.dependsOn ?? []) {
      const sourceRow = rowOf.get(depId);
      if (!sourceRow) continue;
      const source = live(sourceRow.model);
      const x1 = source.milestone
        ? xOf(source.start) + ppd / 2 + 6
        : xOf(source.end + 1) - 1;
      const y1 = sourceRow.y + ROW / 2;
      const x2 = target.milestone
        ? xOf(target.start) + ppd / 2 - 7
        : xOf(target.start) + 1;
      const y2 = row.y + ROW / 2;
      const gap = 8;
      const points: [number, number][] =
        x2 - x1 >= gap * 2
          ? [
              [x1, y1],
              [x1 + gap, y1],
              [x1 + gap, y2],
              [x2, y2],
            ]
          : [
              [x1, y1],
              [x1 + gap, y1],
              [x1 + gap, y2 > y1 ? row.y : row.y + ROW],
              [x2 - gap, y2 > y1 ? row.y : row.y + ROW],
              [x2 - gap, y2],
              [x2, y2],
            ];
      // A task may start the day after its predecessor ends; a milestone may land on that day.
      const conflict = target.milestone
        ? target.start < source.end
        : target.start <= source.end;
      connectors.push({
        key: `${depId}>${row.model.task.id}`,
        d: roundedPath(points),
        tone: conflict
          ? "conflict"
          : activeId === depId || activeId === row.model.task.id
            ? "active"
            : "idle",
      });
    }
  }
  connectors.sort(
    (a, b) => (a.tone === "idle" ? 0 : 1) - (b.tone === "idle" ? 0 : 1),
  );

  const gridBackground = (() => {
    const line = "color-mix(in oklab, var(--color-border) 70%, transparent)";
    if (zoom === "day") {
      const firstSaturday = lo + ((6 - parts(lo).weekday + 7) % 7);
      return {
        backgroundImage: `linear-gradient(to right, var(--gantt-weekend) 0 ${2 * ppd}px, transparent ${2 * ppd}px), linear-gradient(to right, ${line} 0 1px, transparent 1px)`,
        backgroundSize: `${7 * ppd}px 100%, ${ppd}px 100%`,
        backgroundPosition: `${xOf(firstSaturday)}px 0, 0 0`,
      };
    }
    if (zoom === "week")
      return {
        backgroundImage: `linear-gradient(to right, ${line} 0 1px, transparent 1px)`,
        backgroundSize: `${7 * ppd}px 100%`,
      };
    return {};
  })();

  return (
    <div
      data-slot="gantt-chart"
      data-zoom={zoom}
      data-editable={editable || undefined}
      className={cn(
        "@container/gantt-chart flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs",
        "[--gantt-weekend:var(--color-muted)] dark:[--gantt-weekend:color-mix(in_oklab,var(--color-muted)_75%,transparent)]",
        className,
      )}
      {...props}
    >
      {hasHeader ? (
        <div
          data-slot="gantt-chart-header"
          className="flex flex-col gap-1 px-5 pt-5 pb-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            {title != null ? (
              <h3 className="min-w-0 text-sm leading-7 font-semibold tracking-tight">
                {title}
              </h3>
            ) : null}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {actions}
              {showZoomControl ? (
                <>
                  {todayX != null ? (
                    <button
                      type="button"
                      aria-label="Scroll to today"
                      title="Today"
                      onClick={() => scrollToDay(today, 0.32, true)}
                      className="inline-flex size-7 items-center justify-center rounded-md border text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
                    >
                      <FocusIcon aria-hidden="true" className="size-3.5" />
                    </button>
                  ) : null}
                  <div
                    role="group"
                    aria-label="Zoom"
                    data-slot="gantt-chart-zoom"
                    className="inline-flex h-7 items-center rounded-md border bg-muted/40 p-0.5"
                  >
                    {ZOOMS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={zoom === option.value}
                        onClick={() => setZoom(option.value)}
                        className={cn(
                          "h-6 rounded-[5px] px-2 text-[11px] font-medium text-muted-foreground outline-none transition-colors motion-reduce:transition-none",
                          "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
                          "aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-xs",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
          {description != null ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div
        ref={scrollRef}
        data-slot="gantt-chart-scroll"
        className="relative overflow-auto overscroll-x-contain border-t [--gantt-label:8.5rem] @sm/gantt-chart:[--gantt-label:10.5rem] @md/gantt-chart:[--gantt-label:12.5rem] @2xl/gantt-chart:[--gantt-label:14.5rem]"
        style={height != null ? { maxHeight: height } : undefined}
        onScroll={(event) => {
          const next = event.currentTarget.scrollLeft > 0;
          if (next !== scrolled) setScrolled(next);
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `var(--gantt-label) ${W}px`,
            width: `calc(var(--gantt-label) + ${W}px)`,
          }}
        >
          {/* Corner */}
          <div
            className={cn(
              "sticky top-0 left-0 z-40 flex items-end justify-between border-r border-b bg-card px-3 pb-1.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase",
              scrolled && "shadow-[6px_0_12px_-8px_rgb(0_0_0/0.25)]",
            )}
            style={{ height: HEADER }}
          >
            <span>Task</span>
            <span className="hidden @sm/gantt-chart:inline">Owner</span>
          </div>

          {/* Time header */}
          <div
            data-slot="gantt-chart-timescale"
            aria-hidden="true"
            className="sticky top-0 z-30 border-b bg-card"
            style={{ height: HEADER, width: W }}
          >
            {ticks.major.map((tick) => (
              <div
                key={tick.key}
                className="absolute top-0 flex h-[24px] items-center border-l px-2 first:border-l-0"
                style={{ left: tick.x, width: tick.w }}
              >
                <span className="sticky left-[calc(var(--gantt-label)+0.5rem)] truncate text-[11px] font-medium text-foreground">
                  {tick.label}
                </span>
              </div>
            ))}
            {ticks.minor.map((tick) => {
              const isToday = zoom === "day" && tick.day === today;
              // Make room for the today pill in week and month zoom.
              const covered =
                todayX != null &&
                zoom !== "day" &&
                tick.x + 6 < todayX + 26 &&
                tick.x + 6 + tick.label.length * 6.2 > todayX - 26;
              return (
                <div
                  key={tick.key}
                  className={cn(
                    "absolute top-[24px] flex h-[26px] items-center border-t border-l border-l-border/60 font-mono text-[10px] text-muted-foreground tabular-nums",
                    zoom === "day" ? "justify-center" : "px-1.5",
                    tick.weekend &&
                      "bg-(--gantt-weekend) text-muted-foreground/60",
                  )}
                  style={{ left: tick.x, width: tick.w }}
                >
                  <span
                    className={cn(
                      "truncate",
                      isToday &&
                        "rounded-full bg-primary px-1.5 text-primary-foreground",
                      covered && "opacity-0",
                    )}
                  >
                    {tick.label}
                  </span>
                </div>
              );
            })}
            {todayX != null && zoom !== "day" ? (
              <span
                className="absolute bottom-[3px] z-10 -translate-x-1/2 rounded-full bg-primary px-1.5 font-mono text-[9.5px] leading-4 font-medium text-primary-foreground"
                style={{ left: todayX }}
              >
                {monthDay.format(new Date(today * DAY_MS))}
              </span>
            ) : null}
          </div>

          {/* Task list */}
          <div
            ref={labelRef}
            data-slot="gantt-chart-tasks"
            className={cn(
              "sticky left-0 z-[25] border-r bg-card",
              scrolled && "shadow-[6px_0_12px_-8px_rgb(0_0_0/0.25)]",
            )}
            style={{ height: rows.height }}
          >
            {rows.list.map((row) => {
              if (row.kind === "group") {
                const open = !collapsed.has(row.name);
                const days = row.members.reduce(
                  (s, m) => s + (m.milestone ? 0 : m.end - m.start + 1),
                  0,
                );
                const done = days
                  ? row.members.reduce(
                      (s, m) =>
                        s +
                        (m.milestone ? 0 : (m.end - m.start + 1) * m.progress),
                      0,
                    ) / days
                  : 0;
                return (
                  <button
                    key={row.key}
                    type="button"
                    aria-expanded={open}
                    data-slot="gantt-group"
                    onClick={() => toggleGroup(row.name)}
                    className="flex w-full items-center gap-1.5 border-b bg-muted/35 px-2.5 text-left text-xs font-medium outline-none transition-colors hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset motion-reduce:transition-none"
                    style={{ height: row.h }}
                  >
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "size-3.5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none",
                        !open && "-rotate-90",
                      )}
                    />
                    <span
                      aria-hidden="true"
                      className="size-2 shrink-0 rounded-[3px]"
                      style={{ background: row.color }}
                    />
                    <span className="truncate">{row.name}</span>
                    <span className="font-normal text-muted-foreground tabular-nums">
                      {row.members.length}
                    </span>
                    <span className="ml-auto font-mono text-[10.5px] font-normal text-muted-foreground tabular-nums">
                      {pct(done)}
                    </span>
                  </button>
                );
              }
              const m = row.model;
              const id = m.task.id;
              const late = overdueDays(live(m)) > 0;
              return (
                <div
                  key={row.key}
                  data-slot="gantt-task"
                  data-id={id}
                  data-selected={selected === id || undefined}
                  data-active={activeId === id || undefined}
                  onPointerEnter={() => setHoveredId(id)}
                  onPointerLeave={() => setHoveredId(null)}
                  onClick={() => toggle(id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 border-b border-border/50 pr-2.5 text-xs transition-colors motion-reduce:transition-none",
                    grouped ? "pl-8" : "pl-3",
                    "hover:bg-muted/40 data-[active]:bg-muted/40 data-[selected]:bg-primary/[0.07]",
                  )}
                  style={{ height: row.h }}
                >
                  {renderTaskLabel ? (
                    <div className="flex min-w-0 flex-1 items-center">
                      {renderTaskLabel(m.task)}
                    </div>
                  ) : (
                    <span className="flex min-w-0 flex-1 items-center gap-1.5">
                      {m.milestone ? (
                        <span
                          aria-hidden="true"
                          className="size-2 shrink-0 rotate-45 rounded-[1px]"
                          style={{ background: m.color }}
                        />
                      ) : null}
                      <span
                        className={cn(
                          "truncate",
                          selected === id
                            ? "font-medium text-foreground"
                            : "text-foreground/85",
                        )}
                      >
                        {m.task.label}
                      </span>
                      {late ? (
                        <AlertTriangle
                          aria-label="Overdue"
                          className="size-3.5 shrink-0 text-destructive"
                        />
                      ) : null}
                    </span>
                  )}
                  {m.task.owner ? (
                    <span
                      title={m.task.owner}
                      data-slot="gantt-owner"
                      className="hidden size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold tracking-tight ring-1 ring-card @sm/gantt-chart:inline-flex"
                      style={{
                        background: `color-mix(in oklab, ${PALETTE[hash(m.task.owner) % PALETTE.length]} 22%, var(--color-card))`,
                        color: `color-mix(in oklab, ${PALETTE[hash(m.task.owner) % PALETTE.length]} 75%, var(--color-foreground))`,
                      }}
                    >
                      {initials(m.task.owner)}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Timeline */}
          <div
            role="group"
            aria-label={`${scheduleLabel}: ${models.length} tasks. Use the up and down arrow keys to move between tasks${editable ? ", left and right to move a task by a day, and Shift with left and right to change its length" : ""}.`}
            data-slot="gantt-chart-timeline"
            className="relative"
            style={{ width: W, height: rows.height, ...gridBackground }}
            onPointerLeave={() => setHoveredId(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node))
                setFocusedId(null);
            }}
          >
            {ticks.monthLines.map((x) => (
              <div
                key={x}
                aria-hidden="true"
                className="absolute inset-y-0 w-px bg-border"
                style={{ left: x }}
              />
            ))}

            {rows.list.map((row) =>
              row.kind === "group" ? (
                <div
                  key={row.key}
                  aria-hidden="true"
                  className="absolute inset-x-0 border-b bg-muted/35"
                  style={{ top: row.y, height: row.h }}
                />
              ) : (
                <div
                  key={row.key}
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 border-b border-border/50 transition-colors motion-reduce:transition-none",
                    selected === row.model.task.id
                      ? "bg-primary/[0.07]"
                      : activeId === row.model.task.id
                        ? "bg-muted/40"
                        : "",
                  )}
                  style={{ top: row.y, height: row.h }}
                />
              ),
            )}

            {/* Group summaries */}
            {rows.list.map((row) => {
              if (row.kind !== "group") return null;
              const members = row.members.map(live);
              const start = Math.min(...members.map((m) => m.start));
              const end = Math.max(...members.map((m) => m.end));
              const days = members.reduce(
                (s, m) => s + (m.milestone ? 0 : m.end - m.start + 1),
                0,
              );
              const done = days
                ? members.reduce(
                    (s, m) =>
                      s +
                      (m.milestone ? 0 : (m.end - m.start + 1) * m.progress),
                    0,
                  ) / days
                : 0;
              return (
                <div
                  key={`s:${row.key}`}
                  aria-hidden="true"
                  data-slot="gantt-group-summary"
                  className="absolute h-1.5 overflow-hidden rounded-full"
                  style={{
                    top: row.y + row.h / 2 - 3,
                    left: xOf(start),
                    width: (end - start + 1) * ppd,
                    background: `color-mix(in oklab, ${row.color} 22%, transparent)`,
                  }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: pct(done), background: row.color }}
                  />
                </div>
              );
            })}

            {/* Overdue slip */}
            {taskRows.map((row) => {
              const m = live(row.model);
              const late = overdueDays(m);
              if (!late || m.milestone) return null;
              return (
                <div
                  key={`late:${row.key}`}
                  aria-hidden="true"
                  data-slot="gantt-overdue"
                  className="absolute rounded-r-[6px] border border-l-0 border-dashed border-destructive/50"
                  style={{
                    top: row.y + (ROW - BAR) / 2,
                    height: BAR,
                    left: xOf(m.end + 1) - 4,
                    width: (today - m.end) * ppd - ppd / 2 + 4,
                    backgroundImage:
                      "repeating-linear-gradient(135deg, color-mix(in oklab, var(--color-destructive) 22%, transparent) 0 3px, transparent 3px 7px)",
                  }}
                />
              );
            })}

            {/* Dependencies */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={W}
              height={rows.height}
            >
              <defs>
                {(["idle", "active", "conflict"] as const).map((tone) => (
                  <marker
                    key={tone}
                    id={`${uid}-arrow-${tone}`}
                    viewBox="0 0 6 6"
                    refX="5.5"
                    refY="3"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path
                      d="M0 0.4L5.6 3L0 5.6z"
                      fill={
                        tone === "conflict"
                          ? "var(--color-destructive)"
                          : tone === "active"
                            ? "var(--color-foreground)"
                            : "var(--color-muted-foreground)"
                      }
                    />
                  </marker>
                ))}
              </defs>
              {connectors.map((c) => (
                <path
                  key={c.key}
                  data-slot="gantt-dependency"
                  data-tone={c.tone}
                  d={c.d}
                  fill="none"
                  stroke={
                    c.tone === "conflict"
                      ? "var(--color-destructive)"
                      : c.tone === "active"
                        ? "var(--color-foreground)"
                        : "var(--color-muted-foreground)"
                  }
                  strokeOpacity={c.tone === "idle" ? 0.45 : 0.85}
                  strokeWidth={c.tone === "idle" ? 1 : 1.5}
                  strokeDasharray={c.tone === "conflict" ? "3 2" : undefined}
                  markerEnd={`url(#${uid}-arrow-${c.tone})`}
                  className="transition-[stroke-opacity] duration-200 motion-reduce:transition-none"
                />
              ))}
            </svg>

            {/* Today */}
            {todayX != null ? (
              <div
                aria-hidden="true"
                data-slot="gantt-today"
                className="pointer-events-none absolute inset-y-0 z-10 w-0"
                style={{ left: todayX }}
              >
                <div className="absolute inset-y-0 -left-px w-[2px] bg-primary/70" />
                <div className="absolute top-0 -left-[3px] size-1.5 rounded-full bg-primary" />
              </div>
            ) : null}

            {/* Bars */}
            {taskRows.map((row) => {
              const base = row.model;
              const m = live(base);
              const id = m.task.id;
              const isDragging = drag?.id === id;
              const duration = m.end - m.start + 1;
              const isSelected = selected === id;
              const isActive = activeId === id;
              const late = overdueDays(m);
              const width = m.milestone ? 18 : duration * ppd - 2;
              const left = m.milestone
                ? xOf(m.start) + ppd / 2 - 9
                : xOf(m.start) + 1;
              const info: GanttBarInfo = {
                start: fromDay(m.start),
                end: fromDay(m.end),
                duration,
                progress: m.progress,
                width,
                color: m.color,
                zoom,
                milestone: m.milestone,
                overdue: late > 0,
                overdueDays: late,
                selected: isSelected,
                active: isActive,
                dragging: isDragging,
              };
              const inside = !m.milestone && width >= 72;
              return (
                <React.Fragment key={id}>
                  {isDragging && drag?.moved ? (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute rounded-[6px] border border-dashed border-muted-foreground/50"
                      style={{
                        top: row.y + (ROW - BAR) / 2,
                        height: BAR,
                        left: base.milestone
                          ? xOf(base.start) + ppd / 2 - 9
                          : xOf(base.start) + 1,
                        width: base.milestone
                          ? 18
                          : (base.end - base.start + 1) * ppd - 2,
                      }}
                    />
                  ) : null}
                  <div
                    role="button"
                    tabIndex={id === stopId ? 0 : -1}
                    aria-label={describe(m)}
                    aria-pressed={isSelected}
                    data-slot="gantt-bar"
                    data-id={id}
                    data-milestone={m.milestone || undefined}
                    data-overdue={late > 0 || undefined}
                    data-selected={isSelected || undefined}
                    data-dragging={isDragging || undefined}
                    className={cn(
                      "group/bar absolute z-[5] rounded-[6px] outline-none select-none",
                      "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                      isSelected &&
                        "ring-2 ring-primary/70 ring-offset-2 ring-offset-card",
                      editable
                        ? isDragging
                          ? "cursor-grabbing"
                          : "cursor-grab"
                        : "cursor-pointer",
                      isDragging ? "z-20 shadow-lg" : "",
                      !isDragging &&
                        "transition-[left,width] duration-200 ease-out motion-reduce:transition-none",
                    )}
                    style={{
                      top: row.y + (ROW - BAR) / 2,
                      height: BAR,
                      left,
                      width,
                    }}
                    onPointerEnter={() => setHoveredId(id)}
                    onPointerLeave={() => setHoveredId(null)}
                    onFocus={() => {
                      setFocusedId(id);
                      setTabStopId(id);
                    }}
                    onPointerDown={(event) =>
                      onBarPointerDown(event, base, "move")
                    }
                    onPointerMove={onBarPointerMove}
                    onPointerUp={() => onBarPointerUp(base)}
                    onPointerCancel={() => setDrag(null)}
                    onClick={() => {
                      if (suppressClick.current) {
                        suppressClick.current = false;
                        return;
                      }
                      toggle(id);
                    }}
                    onKeyDown={(event) => onBarKeyDown(event, base)}
                  >
                    {renderBar ? (
                      renderBar(m.task, info)
                    ) : m.milestone ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] ring-2 ring-card"
                        style={{
                          background:
                            m.progress >= 1 ? m.color : "var(--color-card)",
                          boxShadow: `inset 0 0 0 2px ${m.color}`,
                        }}
                      />
                    ) : (
                      <>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-0 overflow-hidden rounded-[6px] border transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none",
                            isActive && "shadow-sm",
                          )}
                          style={{
                            background: `color-mix(in oklab, ${m.color} 14%, var(--color-card))`,
                            borderColor:
                              late > 0
                                ? "color-mix(in oklab, var(--color-destructive) 70%, transparent)"
                                : `color-mix(in oklab, ${m.color} ${isActive ? 70 : 42}%, transparent)`,
                          }}
                        >
                          <span
                            className="absolute inset-y-0 left-0"
                            style={{
                              width: pct(m.progress),
                              background: `color-mix(in oklab, ${m.color} 36%, var(--color-card))`,
                            }}
                          />
                          <span
                            className="absolute inset-y-0 left-0 w-[3px]"
                            style={{ background: m.color }}
                          />
                        </span>
                        {inside ? (
                          // The name sticks to the visible edge while a long bar scrolls past.
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 flex items-center overflow-clip rounded-[6px] pr-2"
                          >
                            <span className="sticky left-[calc(var(--gantt-label)+0.625rem)] ml-2.5 flex min-w-0 items-baseline gap-1.5">
                              <span className="truncate text-[11px] font-medium text-foreground">
                                {m.task.label}
                              </span>
                              {width >= 132 ? (
                                <span className="shrink-0 font-mono text-[10px] text-foreground/55 tabular-nums">
                                  {pct(m.progress)}
                                </span>
                              ) : null}
                            </span>
                          </span>
                        ) : null}
                      </>
                    )}
                    {!renderBar && !inside ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute top-1/2 left-full ml-1.5 -translate-y-1/2 truncate rounded-sm bg-card/85 px-1 text-[11px] whitespace-nowrap",
                          m.milestone
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {m.task.label}
                        {m.milestone ? (
                          <span className="ml-1.5 font-mono text-[10px] font-normal text-muted-foreground">
                            {monthDay.format(new Date(m.start * DAY_MS))}
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                    {editable && !m.milestone ? (
                      <>
                        <span
                          aria-hidden="true"
                          data-slot="gantt-bar-handle"
                          className="absolute inset-y-0 -left-1 w-2.5 cursor-ew-resize after:absolute after:inset-y-[5px] after:left-1 after:w-[3px] after:rounded-full after:bg-foreground/50 after:opacity-0 group-hover/bar:after:opacity-100"
                          onPointerDown={(event) =>
                            onBarPointerDown(event, base, "start")
                          }
                        />
                        <span
                          aria-hidden="true"
                          data-slot="gantt-bar-handle"
                          className="absolute inset-y-0 -right-1 w-2.5 cursor-ew-resize after:absolute after:inset-y-[5px] after:right-1 after:w-[3px] after:rounded-full after:bg-foreground/50 after:opacity-0 group-hover/bar:after:opacity-100"
                          onPointerDown={(event) =>
                            onBarPointerDown(event, base, "end")
                          }
                        />
                      </>
                    ) : null}
                  </div>
                </React.Fragment>
              );
            })}

            {models.length === 0 ? (
              <p className="sticky left-0 py-10 text-center text-xs text-muted-foreground">
                No tasks to show.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div
        data-slot="gantt-chart-footer"
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t px-5 py-3"
      >
        <div
          data-slot="gantt-chart-readout"
          aria-hidden={activeModel ? true : undefined}
          className="flex min-h-9 min-w-0 flex-1 basis-60 items-center gap-3"
        >
          {readout}
        </div>
        {showLegend ? (
          <div
            data-slot="gantt-chart-legend"
            aria-hidden="true"
            className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="relative h-2.5 w-5 overflow-hidden rounded-[3px] border border-primary/40 bg-primary/10">
                <span className="absolute inset-y-0 left-0 w-1/2 bg-primary/35" />
              </span>
              Progress
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rotate-45 rounded-[1px] bg-foreground/70" />
              Milestone
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-[2px] rounded-full bg-primary/70" />
              Today
            </span>
            {overdueCount ? (
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-4 rounded-[3px] border border-dashed border-destructive/60"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, color-mix(in oklab, var(--color-destructive) 30%, transparent) 0 2px, transparent 2px 5px)",
                  }}
                />
                Overdue
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}

export { GanttChart };
