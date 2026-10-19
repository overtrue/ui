"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  IconCalendarEvent,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

/** An inclusive span of local calendar days. Times of day are ignored. */
export interface DateRange {
  from: Date;
  to: Date;
}

export type DateRangeCompareMode = "previous-period" | "previous-year";
export type DateRangeApplyMode = "confirm" | "auto";
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DateRangePreset {
  /** Stable id, such as "last-30-days". */
  id: string;
  label: string;
  from: Date;
  to: Date;
}

export interface DateRangeChangeDetails {
  /** The preset whose dates match the new range, if any. */
  preset: DateRangePreset | null;
  /** The comparison range that goes with the new range, or null when comparison is off. */
  compare: DateRange | null;
}

/** Interface copy. Dates and weekdays are localized through `locale`. */
export interface DateRangePickerLabels {
  placeholder: string;
  dialog: string;
  presets: string;
  previousMonth: string;
  nextMonth: string;
  compare: string;
  compareMode: string;
  previousPeriod: string;
  previousYear: string;
  cancel: string;
  apply: string;
  selectEnd: string;
  rangeStart: string;
  rangeEnd: string;
  today: string;
  days: (count: number) => string;
}

export interface DateRangePickerProps extends Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "children"
> {
  /** The committed range. Pass null for none; leave undefined to let the picker manage it. */
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  /** Called when a range is applied, or on the second click and preset clicks with `applyMode="auto"`. */
  onChange?: (range: DateRange, details: DateRangeChangeDetails) => void;
  /** The comparison range. Null turns comparison off; leave undefined to let the picker manage it. */
  compare?: DateRange | null;
  defaultCompare?: DateRange | null;
  onCompareChange?: (compare: DateRange | null) => void;
  /** How the comparison range is derived. Defaults to "previous-period". */
  compareMode?: DateRangeCompareMode;
  defaultCompareMode?: DateRangeCompareMode;
  onCompareModeChange?: (mode: DateRangeCompareMode) => void;
  /** Show the comparison toggle. Defaults to true when any compare prop is passed. */
  showCompare?: boolean;
  /** Quick ranges in the side column. Defaults to `presetRanges(today)`; pass [] to hide the column. */
  presets?: DateRangePreset[];
  /** Anchors presets and the today marker. Defaults to the current date. */
  today?: Date;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  /** Longest selectable range in days, counted inclusively. */
  maxDays?: number;
  /** First column of the calendar. Defaults to the locale's first day of the week. */
  weekStartsOn?: WeekdayIndex;
  /** Months shown side by side. Two collapse to one when the panel is narrow. */
  numberOfMonths?: 1 | 2;
  /** BCP 47 locale for dates and weekday names. Defaults to the runtime locale. */
  locale?: string;
  /** "confirm" waits for Apply; "auto" commits on the second click and on presets. */
  applyMode?: DateRangeApplyMode;
  size?: "sm" | "default";
  /** Panel alignment against the trigger. */
  align?: "start" | "center" | "end";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Render the panel in place under the trigger instead of a portalled popover.
   * It is sized to the nearest CSS container, stays open on outside clicks, and
   * never steals focus on mount. For sheets, documentation, and screenshots.
   */
  inline?: boolean;
  disabled?: boolean;
  /** Adds hidden inputs `name[from]` and `name[to]` with yyyy-mm-dd values for forms. */
  name?: string;
  /** Replaces the trigger label. */
  formatLabel?: (
    range: DateRange | null,
    preset: DateRangePreset | null,
  ) => React.ReactNode;
  labels?: Partial<DateRangePickerLabels>;
  triggerClassName?: string;
  contentClassName?: string;
}

/* ------------------------------------------------------------------------ */
/* Calendar days                                                             */
/* ------------------------------------------------------------------------ */

const DAY_MS = 86_400_000;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const daysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();
const monthIndex = (date: Date) => date.getFullYear() * 12 + date.getMonth();
const fromMonthIndex = (index: number) =>
  new Date(Math.floor(index / 12), ((index % 12) + 12) % 12, 1);
/** Sortable key for a calendar day. */
const dayKey = (date: Date) =>
  date.getFullYear() * 10_000 + date.getMonth() * 100 + date.getDate();
const sameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && dayKey(a) === dayKey(b);
/** Whole days since the epoch, immune to daylight-saving shifts. */
const epochDay = (date: Date) =>
  Math.round(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS,
  );

function addMonths(date: Date, months: number) {
  const first = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const year = first.getFullYear();
  const month = first.getMonth();
  return new Date(
    year,
    month,
    Math.min(date.getDate(), daysInMonth(year, month)),
  );
}

function orderRange(a: Date, b: Date): DateRange {
  return dayKey(a) <= dayKey(b) ? { from: a, to: b } : { from: b, to: a };
}

const toISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** Number of days in a range, counting both ends. */
export function rangeDays(range: DateRange) {
  return Math.abs(epochDay(range.to) - epochDay(range.from)) + 1;
}

/** True when both ranges cover the same calendar days, or both are empty. */
export function isSameRange(a?: DateRange | null, b?: DateRange | null) {
  if (!a || !b) return !a && !b;
  return sameDay(a.from, b.from) && sameDay(a.to, b.to);
}

/** The same number of days, ending the day before the range starts. */
export function previousPeriod(range: DateRange): DateRange {
  const to = addDays(startOfDay(range.from), -1);
  return { from: addDays(to, -(rangeDays(range) - 1)), to };
}

/** The same calendar days one year earlier. February 29 becomes February 28. */
export function previousYear(range: DateRange): DateRange {
  return {
    from: addMonths(startOfDay(range.from), -12),
    to: addMonths(startOfDay(range.to), -12),
  };
}

/** The comparison range for a mode. */
export function compareRange(range: DateRange, mode: DateRangeCompareMode) {
  return mode === "previous-year" ? previousYear(range) : previousPeriod(range);
}

/** The ten standard dashboard ranges, each ending today unless named otherwise. */
export function presetRanges(today: Date = new Date()): DateRangePreset[] {
  const t = startOfDay(today);
  const year = t.getFullYear();
  const month = t.getMonth();
  const yesterday = addDays(t, -1);
  return [
    { id: "today", label: "Today", from: t, to: t },
    { id: "yesterday", label: "Yesterday", from: yesterday, to: yesterday },
    { id: "last-7-days", label: "Last 7 days", from: addDays(t, -6), to: t },
    { id: "last-30-days", label: "Last 30 days", from: addDays(t, -29), to: t },
    { id: "last-90-days", label: "Last 90 days", from: addDays(t, -89), to: t },
    { id: "this-month", label: "This month", from: new Date(year, month, 1), to: t },
    {
      id: "last-month",
      label: "Last month",
      from: new Date(year, month - 1, 1),
      to: new Date(year, month, 0),
    },
    {
      id: "quarter-to-date",
      label: "Quarter to date",
      from: new Date(year, month - (month % 3), 1),
      to: t,
    },
    { id: "year-to-date", label: "Year to date", from: new Date(year, 0, 1), to: t },
    {
      id: "last-12-months",
      label: "Last 12 months",
      from: addDays(addMonths(t, -12), 1),
      to: t,
    },
  ];
}

const formatters = new Map<string, Intl.DateTimeFormat>();
function formatter(
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions,
) {
  const key = `${locale ?? ""}|${JSON.stringify(options)}`;
  let cached = formatters.get(key);
  if (!cached) {
    cached = new Intl.DateTimeFormat(locale, options);
    formatters.set(key, cached);
  }
  return cached;
}

const FULL: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

/** "Sep 1 – Sep 30, 2026". The start drops its year when both ends share one. */
export function formatDateRange(range: DateRange, locale?: string) {
  const from = startOfDay(range.from);
  const to = startOfDay(range.to);
  const full = formatter(locale, FULL);
  if (sameDay(from, to)) return full.format(to);
  const start =
    from.getFullYear() === to.getFullYear()
      ? formatter(locale, { month: "short", day: "numeric" }).format(from)
      : full.format(from);
  return `${start} – ${full.format(to)}`;
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

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

const defaultLabels: DateRangePickerLabels = {
  placeholder: "Select dates",
  dialog: "Choose a date range",
  presets: "Presets",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  compare: "Compare",
  compareMode: "Comparison period",
  previousPeriod: "Previous period",
  previousYear: "Previous year",
  cancel: "Cancel",
  apply: "Apply",
  selectEnd: "select an end date",
  rangeStart: "range start",
  rangeEnd: "range end",
  today: "today",
  days: (count) => (count === 1 ? "1 day" : `${count} days`),
};

/* Panel geometry, in px. A month is seven 36px columns. */
const PRESET_COLUMN = 144;
const MONTH_BLOCK = 284; // 252px grid plus 16px padding each side
const MONTH_GAP = 0; // the second month adds its own padding
const ONE_MONTH_MIN = 420;

interface Draft {
  from: Date | null;
  to: Date | null;
}

const toDraft = (range: DateRange | null | undefined): Draft =>
  range
    ? { from: startOfDay(range.from), to: startOfDay(range.to) }
    : { from: null, to: null };

/** First visible month index so `focus` shows and the range end or today sits on the right. */
function viewFor(focus: Date, end: Date | null, today: Date, count: number) {
  const focusMonth = monthIndex(focus);
  const last = Math.max(monthIndex(end ?? focus), monthIndex(today));
  return Math.max(focusMonth, Math.min(last, focusMonth + count - 1));
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const keyframes = `@keyframes date-range-picker-in{from{opacity:0;transform:translateY(-6px) scale(.96)}to{opacity:1;transform:none}}`;

/* ------------------------------------------------------------------------ */
/* Component                                                                 */
/* ------------------------------------------------------------------------ */

/** A dashboard date range control with presets, a two-month calendar, and an optional comparison period. */
export function DateRangePicker({
  value: valueProp,
  defaultValue = null,
  onChange,
  compare: compareProp,
  defaultCompare = null,
  onCompareChange,
  compareMode: compareModeProp,
  defaultCompareMode = "previous-period",
  onCompareModeChange,
  showCompare: showCompareProp,
  presets: presetsProp,
  today: todayProp,
  minDate,
  maxDate,
  isDateDisabled,
  maxDays,
  weekStartsOn: weekStartsOnProp,
  numberOfMonths = 2,
  locale,
  applyMode = "confirm",
  size = "default",
  align = "start",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  inline = false,
  disabled = false,
  name,
  formatLabel,
  labels: labelsProp,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  className,
  triggerClassName,
  contentClassName,
  ...props
}: DateRangePickerProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const uid = React.useId();
  const panelId = `${uid}-panel`;
  const compareSwitchId = `${uid}-compare`;

  const todayKey = todayProp ? dayKey(todayProp) : 0;
  const today = React.useMemo(
    () =>
      todayKey
        ? new Date(
            Math.floor(todayKey / 10_000),
            Math.floor(todayKey / 100) % 100,
            todayKey % 100,
          )
        : startOfDay(new Date()),
    [todayKey],
  );
  const presets = React.useMemo(
    () => presetsProp ?? presetRanges(today),
    [presetsProp, today],
  );
  const weekStartsOn = React.useMemo(
    () => weekStartsOnProp ?? localeWeekStart(locale),
    [weekStartsOnProp, locale],
  );
  const minKey = minDate ? dayKey(minDate) : -Infinity;
  const maxKey = maxDate ? dayKey(maxDate) : Infinity;
  const clampDay = (date: Date) =>
    dayKey(date) < minKey && minDate
      ? startOfDay(minDate)
      : dayKey(date) > maxKey && maxDate
        ? startOfDay(maxDate)
        : startOfDay(date);

  /* ---- Controlled and uncontrolled state ---- */
  const [valueState, setValueState] = React.useState<DateRange | null>(
    defaultValue,
  );
  const value = valueProp !== undefined ? valueProp : valueState;
  const [compareState, setCompareState] = React.useState<DateRange | null>(
    defaultCompare,
  );
  const compare = compareProp !== undefined ? compareProp : compareState;
  const [modeState, setModeState] =
    React.useState<DateRangeCompareMode>(defaultCompareMode);
  const mode = compareModeProp ?? modeState;
  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = openProp ?? openState;
  const showCompare =
    showCompareProp ??
    (compareProp !== undefined ||
      onCompareChange !== undefined ||
      defaultCompare !== null);

  /* ---- Draft state while the panel is open ---- */
  const [panelNode, setPanelNode] = React.useState<HTMLDivElement | null>(
    null,
  );
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const attachPanel = React.useCallback((node: HTMLDivElement | null) => {
    panelRef.current = node;
    setPanelNode(node);
  }, []);
  const [panelWidth, setPanelWidth] = React.useState<number | null>(null);
  const hasPresets = presets.length > 0;
  const natural =
    (hasPresets ? PRESET_COLUMN : 0) +
    MONTH_BLOCK * numberOfMonths +
    (numberOfMonths === 2 ? MONTH_GAP : 0);
  const width = panelWidth ?? natural;
  const twoMonthMin = (hasPresets ? PRESET_COLUMN : 0) + MONTH_BLOCK * 2 - 8;
  const months: 1 | 2 = numberOfMonths === 2 && width >= twoMonthMin ? 2 : 1;
  const presetLayout: "column" | "row" | "none" = !hasPresets
    ? "none"
    : width >= (months === 2 ? twoMonthMin : ONE_MONTH_MIN)
      ? "column"
      : "row";

  const [draft, setDraft] = React.useState<Draft>(() => toDraft(value));
  const [anchor, setAnchor] = React.useState<Date | null>(null);
  const [hover, setHover] = React.useState<Date | null>(null);
  const [draftCompare, setDraftCompare] = React.useState(compare != null);
  const [draftMode, setDraftMode] = React.useState<DateRangeCompareMode>(mode);
  const [focused, setFocused] = React.useState<Date>(() =>
    clampDay(value?.from ?? today),
  );
  const [view, setView] = React.useState(() =>
    viewFor(
      clampDay(value?.from ?? today),
      value ? startOfDay(value.to) : null,
      today,
      months,
    ),
  );

  const resetDraft = () => {
    const next = toDraft(value);
    const focus = clampDay(next.from ?? today);
    setDraft(next);
    setAnchor(null);
    setHover(null);
    setDraftCompare(compare != null);
    setDraftMode(mode);
    setFocused(focus);
    setView(viewFor(focus, next.to, today, months));
  };

  // Reset the draft whenever the panel opens, including controlled opens.
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) resetDraft();
  }
  // Keep the focused day visible when the panel collapses to one month.
  const [prevMonths, setPrevMonths] = React.useState(months);
  if (prevMonths !== months) {
    setPrevMonths(months);
    setView(viewFor(focused, draft.to, today, months));
  }

  React.useLayoutEffect(() => {
    if (!panelNode) return;
    const measure = () => setPanelWidth(panelNode.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panelNode);
    return () => observer.disconnect();
  }, [panelNode]);

  /* ---- Refs for focus and motion ---- */
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const monthsRef = React.useRef<HTMLDivElement>(null);
  const presetListRef = React.useRef<HTMLDivElement>(null);
  const focusRequest = React.useRef<number | null>(null);
  const slide = React.useRef(0);
  const userOpened = React.useRef(false);
  const focusedRef = React.useRef(focused);
  focusedRef.current = focused;

  const focusDay = React.useCallback((date: Date) => {
    panelRef.current
      ?.querySelector<HTMLButtonElement>(
        `[data-day="${dayKey(date)}"]:not([data-outside])`,
      )
      ?.focus({ preventScroll: true });
  }, []);

  React.useEffect(() => {
    if (focusRequest.current === null) return;
    if (focusRequest.current !== dayKey(focused)) return;
    focusRequest.current = null;
    focusDay(focused);
  }, [focused, view, focusDay]);

  React.useLayoutEffect(() => {
    const direction = slide.current;
    slide.current = 0;
    if (!direction || !monthsRef.current || prefersReducedMotion()) return;
    monthsRef.current.animate?.(
      [
        { opacity: 0.3, transform: `translateX(${direction * 12}px)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: 320, easing: EASE },
    );
  }, [view]);

  /* ---- Derived ranges ---- */
  const matchPreset = (range: DateRange | null) =>
    range ? (presets.find((preset) => isSameRange(preset, range)) ?? null) : null;
  const draftRange: DateRange | null =
    draft.from && draft.to ? { from: draft.from, to: draft.to } : null;
  const previewing = !!anchor && !!hover && !sameDay(anchor, hover);
  const shown: DateRange | null = anchor
    ? orderRange(anchor, hover ?? anchor)
    : draftRange;
  const shownCompare =
    draftCompare && shown ? compareRange(shown, draftMode) : null;
  const activePreset = anchor ? null : matchPreset(draftRange);
  const committedPreset = matchPreset(value ?? null);

  const isUnavailable = (date: Date) => {
    const key = dayKey(date);
    if (key < minKey || key > maxKey) return true;
    if (isDateDisabled?.(date)) return true;
    if (anchor && maxDays && rangeDays({ from: anchor, to: date }) > maxDays)
      return true;
    return false;
  };

  /* ---- Actions ---- */
  const setOpen = (next: boolean) => {
    if (next === open) return;
    if (next) userOpened.current = true;
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
    if (inline) {
      if (next) {
        requestAnimationFrame(() => focusDay(focusedRef.current));
      } else if (panelRef.current?.contains(document.activeElement)) {
        triggerRef.current?.focus();
      }
    }
  };

  const commit = (
    range: DateRange,
    compareOn: boolean,
    nextMode: DateRangeCompareMode,
  ) => {
    const nextCompare = compareOn ? compareRange(range, nextMode) : null;
    if (!isSameRange(range, value)) {
      if (valueProp === undefined) setValueState(range);
      onChange?.(range, { preset: matchPreset(range), compare: nextCompare });
    }
    if (nextMode !== mode) {
      if (compareModeProp === undefined) setModeState(nextMode);
      onCompareModeChange?.(nextMode);
    }
    if (!isSameRange(nextCompare, compare)) {
      if (compareProp === undefined) setCompareState(nextCompare);
      onCompareChange?.(nextCompare);
    }
  };

  const showMonthOf = (date: Date, preferEnd?: Date | null) => {
    const target = viewFor(date, preferEnd ?? null, today, months);
    const first = view - months + 1;
    const index = monthIndex(date);
    if (index >= first && index <= view && !preferEnd) return;
    if (target !== view) {
      slide.current = target > view ? 1 : -1;
      setView(target);
    }
  };

  const moveFocus = (date: Date) => {
    const next = clampDay(date);
    const index = monthIndex(next);
    const first = view - months + 1;
    if (index > view) {
      slide.current = 1;
      setView(index);
    } else if (index < first) {
      slide.current = -1;
      setView(index + months - 1);
    }
    if (anchor) setHover(next);
    if (sameDay(next, focused) && index >= first && index <= view) {
      focusDay(next);
      return;
    }
    focusRequest.current = dayKey(next);
    setFocused(next);
  };

  const selectDay = (date: Date) => {
    if (isUnavailable(date)) return;
    setFocused(date);
    if (!anchor) {
      setAnchor(date);
      setHover(date);
      setDraft({ from: date, to: null });
      return;
    }
    const range = orderRange(anchor, date);
    setAnchor(null);
    setHover(null);
    setDraft(range);
    if (applyMode === "auto") {
      commit(range, draftCompare, draftMode);
      setOpen(false);
    }
  };

  const selectPreset = (preset: DateRangePreset) => {
    const range = { from: startOfDay(preset.from), to: startOfDay(preset.to) };
    setDraft(range);
    setAnchor(null);
    setHover(null);
    setFocused(clampDay(range.from));
    showMonthOf(range.from, range.to);
    if (applyMode === "auto") {
      commit(range, draftCompare, draftMode);
      setOpen(false);
    }
  };

  const cancelPending = () => {
    setAnchor(null);
    setHover(null);
    setDraft(toDraft(value));
  };

  const apply = () => {
    const range =
      draftRange ?? (anchor ? { from: anchor, to: anchor } : (value ?? null));
    if (range) commit(range, draftCompare, draftMode);
    setOpen(false);
  };

  const toggleCompare = (on: boolean) => {
    setDraftCompare(on);
    if (applyMode === "auto") {
      const range = draftRange ?? value;
      if (range) commit(range, on, draftMode);
    }
  };

  const changeMode = (next: DateRangeCompareMode) => {
    setDraftMode(next);
    if (applyMode === "auto") {
      const range = draftRange ?? value;
      if (range) commit(range, draftCompare, next);
    }
  };

  /* ---- Keyboard ---- */
  const onGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const offset = (focused.getDay() - weekStartsOn + 7) % 7;
    let next: Date | null = null;
    switch (event.key) {
      case "ArrowLeft":
        next = addDays(focused, -1);
        break;
      case "ArrowRight":
        next = addDays(focused, 1);
        break;
      case "ArrowUp":
        next = addDays(focused, -7);
        break;
      case "ArrowDown":
        next = addDays(focused, 7);
        break;
      case "PageUp":
        next = addMonths(focused, event.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        next = addMonths(focused, event.shiftKey ? 12 : 1);
        break;
      case "Home":
        next = addDays(focused, -offset);
        break;
      case "End":
        next = addDays(focused, 6 - offset);
        break;
      default:
        return;
    }
    event.preventDefault();
    moveFocus(next);
  };

  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || !inline) return;
    event.preventDefault();
    if (anchor) cancelPending();
    else setOpen(false);
  };

  const onPresetKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys =
      presetLayout === "row"
        ? { prev: "ArrowLeft", next: "ArrowRight" }
        : { prev: "ArrowUp", next: "ArrowDown" };
    if (![keys.prev, keys.next, "Home", "End"].includes(event.key)) return;
    const items = Array.from(
      presetListRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-preset]",
      ) ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : event.key === keys.prev
            ? Math.max(0, index - 1)
            : Math.min(items.length - 1, index + 1);
    event.preventDefault();
    items[nextIndex]?.focus();
    items[nextIndex]?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  };

  // Keep the active preset chip in view in the compact row.
  React.useEffect(() => {
    if (!open || presetLayout !== "row") return;
    const list = presetListRef.current;
    const active = list?.querySelector<HTMLElement>("[data-active]");
    if (!list || !active) return;
    list.scrollLeft =
      active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
  }, [open, presetLayout, activePreset?.id]);

  /* ---- Rendering ---- */
  const weekdays = React.useMemo(() => {
    const short = formatter(locale, { weekday: "short" });
    const long = formatter(locale, { weekday: "long" });
    // 1 January 2023 was a Sunday.
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2023, 0, 1 + ((weekStartsOn + i) % 7));
      return { short: short.format(date), long: long.format(date) };
    });
  }, [locale, weekStartsOn]);

  const visibleMonths = Array.from({ length: months }, (_, i) =>
    fromMonthIndex(view - months + 1 + i),
  );
  const focusInView =
    monthIndex(focused) >= view - months + 1 && monthIndex(focused) <= view;
  const canGoBack = !minDate || view - months + 1 > monthIndex(minDate);
  const canGoForward = !maxDate || view < monthIndex(maxDate);
  const navigate = (direction: -1 | 1) => {
    slide.current = direction;
    setView((current) => current + direction);
    const shifted = addMonths(focused, direction);
    setFocused(clampDay(shifted));
  };

  const longDate = formatter(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const caption = formatter(locale, { month: "long", year: "numeric" });

  const renderMonth = (month: Date) => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const lead = (first.getDay() - weekStartsOn + 7) % 7;
    const start = addDays(first, -lead);
    const lastDate = daysInMonth(month.getFullYear(), month.getMonth());
    const captionId = `${uid}-caption-${monthIndex(month)}`;
    const shownFrom = shown ? dayKey(shown.from) : 0;
    const shownTo = shown ? dayKey(shown.to) : 0;
    const compareFrom = shownCompare ? dayKey(shownCompare.from) : 0;
    const compareTo = shownCompare ? dayKey(shownCompare.to) : 0;

    return (
      <div
        key={monthIndex(month)}
        data-slot="date-range-picker-month"
        className="mx-auto w-full max-w-[19.25rem] min-w-0 px-3 sm:max-w-[17.75rem] sm:px-4"
      >
        <div
          id={captionId}
          aria-live="polite"
          className="flex h-8 items-center justify-center text-sm font-semibold tracking-tight"
        >
          {caption.format(month)}
        </div>
        <div
          role="grid"
          aria-labelledby={captionId}
          className="mt-2 flex flex-col gap-1"
          onMouseLeave={() => anchor && setHover(null)}
        >
          <div role="row" className="grid grid-cols-7">
            {weekdays.map((weekday) => (
              <div
                key={weekday.long}
                role="columnheader"
                aria-label={weekday.long}
                className="flex h-7 items-center justify-center text-xs font-normal text-muted-foreground"
              >
                <abbr title={weekday.long} className="no-underline">
                  {weekday.short}
                </abbr>
              </div>
            ))}
          </div>
          {Array.from({ length: 6 }, (_, week) => (
            <div key={week} role="row" className="grid grid-cols-7">
              {Array.from({ length: 7 }, (_, column) => {
                const date = addDays(start, week * 7 + column);
                const key = dayKey(date);
                const outside = date.getMonth() !== month.getMonth();
                const unavailable = isUnavailable(date);
                const isStart = !!shown && key === shownFrom;
                const isEnd = !!shown && key === shownTo;
                const inRange = !!shown && key >= shownFrom && key <= shownTo;
                const single = isStart && isEnd;
                const isToday = sameDay(date, today);
                const isAnchor = sameDay(date, anchor);
                const isPreviewEnd = previewing && sameDay(date, hover);
                const solid = isAnchor || (!previewing && (isStart || isEnd));
                const inCompare =
                  !!shownCompare && key >= compareFrom && key <= compareTo;
                const rowStart = column === 0 || date.getDate() === 1;
                const rowEnd = column === 6 || date.getDate() === lastDate;
                const label = [
                  longDate.format(date),
                  isStart && !single ? labels.rangeStart : null,
                  isEnd && !single ? labels.rangeEnd : null,
                  isToday ? labels.today : null,
                ]
                  .filter(Boolean)
                  .join(", ");
                // Keep one day reachable with Tab even when the focused day scrolled out of view.
                const tabbable =
                  !outside &&
                  (focusInView
                    ? sameDay(date, focused)
                    : monthIndex(month) === view - months + 1 && date.getDate() === 1);

                return (
                  <div
                    key={key}
                    role="gridcell"
                    aria-selected={!outside && inRange ? true : undefined}
                    className="relative h-11 min-w-0 sm:h-9"
                  >
                    {!outside && inRange && !single && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute inset-y-[3px] transition-colors duration-150 motion-reduce:transition-none",
                          previewing
                            ? "bg-primary/[0.07] dark:bg-primary/10"
                            : "bg-primary/[0.11] dark:bg-primary/[0.16]",
                          isStart
                            ? rowEnd
                              ? "hidden"
                              : "start-1/2 end-0"
                            : isEnd
                              ? rowStart
                                ? "hidden"
                                : "start-0 end-1/2"
                              : "inset-x-0",
                          rowStart && !isStart && "rounded-s-full",
                          rowEnd && !isEnd && "rounded-e-full",
                        )}
                      />
                    )}
                    {!outside && inCompare && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-muted-foreground/45"
                      />
                    )}
                    <button
                      type="button"
                      data-slot="date-range-picker-day"
                      data-day={key}
                      data-selected={!outside && (isStart || isEnd) ? "" : undefined}
                      data-range-start={!outside && isStart ? "" : undefined}
                      data-range-end={!outside && isEnd ? "" : undefined}
                      data-in-range={!outside && inRange ? "" : undefined}
                      data-preview={!outside && previewing && inRange ? "" : undefined}
                      data-compare={!outside && inCompare ? "" : undefined}
                      data-today={isToday ? "" : undefined}
                      data-outside={outside ? "" : undefined}
                      data-disabled={unavailable ? "" : undefined}
                      tabIndex={tabbable ? 0 : -1}
                      aria-label={label}
                      aria-current={isToday ? "date" : undefined}
                      aria-disabled={unavailable || undefined}
                      onClick={() => selectDay(date)}
                      onFocus={() => {
                        if (!outside && !sameDay(date, focused)) setFocused(date);
                        if (anchor && !outside) setHover(date);
                      }}
                      onMouseEnter={() => {
                        if (anchor && !unavailable) setHover(date);
                      }}
                      className={cn(
                        "relative z-10 flex size-full items-center justify-center rounded-lg text-sm tabular-nums transition-[color,background-color,box-shadow] duration-150 outline-none motion-reduce:transition-none",
                        "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:shadow-[0_0_0_5px_color-mix(in_oklab,var(--color-primary)_10%,transparent)]",
                        outside
                          ? "text-muted-foreground/35"
                          : unavailable
                            ? "cursor-not-allowed text-muted-foreground/40"
                            : "text-foreground",
                        !outside &&
                          !unavailable &&
                          !solid &&
                          (inRange ? "hover:bg-primary/15" : "hover:bg-muted"),
                        outside && !unavailable && "hover:bg-muted/60",
                        !outside &&
                          solid &&
                          "bg-primary font-medium text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(0_0_0/0.12)] dark:shadow-[0_6px_16px_-6px_color-mix(in_oklab,var(--color-primary)_75%,transparent),inset_0_1px_0_rgb(255_255_255/0.18)] hover:bg-primary/90 focus-visible:ring-offset-1 focus-visible:ring-offset-popover",
                        !outside &&
                          isPreviewEnd &&
                          "bg-popover font-medium ring-1 ring-primary/60 ring-inset",
                        isToday && !solid && "font-semibold",
                      )}
                    >
                      {date.getDate()}
                      {isToday && !outside && (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full",
                            solid ? "bg-primary-foreground" : "bg-primary",
                          )}
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const summary = anchor && !previewing ? (
    <>
      <span className="font-medium text-foreground">
        {formatter(locale, FULL).format(anchor)}
      </span>
      <span className="text-muted-foreground"> – {labels.selectEnd}</span>
    </>
  ) : shown ? (
    <>
      <span className="font-medium text-foreground">
        {formatDateRange(shown, locale)}
      </span>
      <span className="text-muted-foreground">
        {" · "}
        {labels.days(rangeDays(shown))}
      </span>
    </>
  ) : (
    <span className="text-muted-foreground">{labels.placeholder}</span>
  );

  const presetList = presetLayout !== "none" && (
    <div
      className={cn(
        "relative shrink-0",
        presetLayout === "column" ? "w-36 border-e border-border/60" : "border-t border-border/60",
      )}
    >
      <div
        ref={presetListRef}
        role="listbox"
        aria-label={labels.presets}
        aria-orientation={presetLayout === "row" ? "horizontal" : "vertical"}
        data-slot="date-range-picker-presets"
        onKeyDown={onPresetKeyDown}
        className={cn(
          presetLayout === "column"
            ? "absolute inset-0 flex flex-col overflow-y-auto p-2"
            : "flex gap-1.5 overflow-x-auto px-3 py-2.5 [mask-image:linear-gradient(to_right,transparent,#000_12px,#000_calc(100%-24px),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {presets.map((preset, index) => {
          const active = activePreset?.id === preset.id;
          const tabbable = activePreset ? active : index === 0;
          return (
            <button
              key={preset.id}
              type="button"
              role="option"
              aria-selected={active}
              data-preset={preset.id}
              data-slot="date-range-picker-preset"
              data-active={active ? "" : undefined}
              tabIndex={tabbable ? 0 : -1}
              onClick={() => selectPreset(preset)}
              className={cn(
                "shrink-0 text-[13px] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none",
                presetLayout === "column"
                  ? "flex h-9 w-full items-center rounded-md px-2.5 text-start sm:h-8"
                  : "h-9 rounded-full border px-3 sm:h-8",
                active
                  ? "bg-primary/10 font-medium text-primary dark:bg-primary/15"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                presetLayout === "row" &&
                  (active ? "border-primary/25" : "border-border/70"),
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const calendar = (
    <div className="relative min-w-0 flex-1 py-3 sm:py-4">
      <button
        type="button"
        aria-label={labels.previousMonth}
        disabled={!canGoBack}
        onClick={() => navigate(-1)}
        className="absolute start-2 top-3 z-20 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 sm:top-4 sm:start-3"
      >
        <IconChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
      </button>
      <button
        type="button"
        aria-label={labels.nextMonth}
        disabled={!canGoForward}
        onClick={() => navigate(1)}
        className="absolute end-2 top-3 z-20 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 sm:top-4 sm:end-3"
      >
        <IconChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" />
      </button>
      <div
        ref={monthsRef}
        onKeyDown={onGridKeyDown}
        className={cn("flex", months === 2 && "divide-x divide-border/70")}
      >
        {visibleMonths.map(renderMonth)}
      </div>
    </div>
  );

  const compareRow = showCompare && (
    <div
      data-slot="date-range-picker-compare"
      data-state={draftCompare ? "on" : "off"}
      className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-t border-border/60 px-4 py-2.5"
    >
      <div className="flex items-center gap-2">
        <Switch
          id={compareSwitchId}
          checked={draftCompare}
          onCheckedChange={toggleCompare}
        />
        <label
          htmlFor={compareSwitchId}
          className="cursor-pointer text-sm font-medium select-none"
        >
          {labels.compare}
        </label>
      </div>
      <div
        role="radiogroup"
        aria-label={labels.compareMode}
        aria-disabled={!draftCompare || undefined}
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key))
            return;
          event.preventDefault();
          const next =
            draftMode === "previous-period" ? "previous-year" : "previous-period";
          changeMode(next);
          (event.currentTarget.querySelector(
            `[data-mode="${next}"]`,
          ) as HTMLButtonElement | null)?.focus();
        }}
        className={cn(
          "inline-flex h-7 items-center rounded-md bg-muted p-0.5 transition-opacity",
          !draftCompare && "opacity-50",
        )}
      >
        {(["previous-period", "previous-year"] as const).map((option) => {
          const checked = draftMode === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              data-mode={option}
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              disabled={!draftCompare}
              onClick={() => changeMode(option)}
              className={cn(
                "h-6 rounded-[5px] px-2 text-xs whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed motion-reduce:transition-none",
                checked
                  ? "bg-card font-medium text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option === "previous-period"
                ? labels.previousPeriod
                : labels.previousYear}
            </button>
          );
        })}
      </div>
      {shownCompare && (
        <span className="ms-auto inline-flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
          <span
            aria-hidden="true"
            className="w-3.5 border-t-2 border-dashed border-muted-foreground/50"
          />
          {formatDateRange(shownCompare, locale)}
        </span>
      )}
    </div>
  );

  const footer = (
    <div
      data-slot="date-range-picker-footer"
      className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2.5 border-t border-border/60 px-4 py-3"
    >
      <p
        aria-live="polite"
        className="min-w-0 flex-1 truncate text-sm tabular-nums"
      >
        {summary}
      </p>
      {applyMode === "confirm" && (
        <div className="flex shrink-0 gap-2 max-sm:w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-[13px] max-sm:h-10 max-sm:flex-1"
            onClick={() => {
              cancelPending();
              setOpen(false);
            }}
          >
            {labels.cancel}
          </Button>
          <Button
            type="button"
            size="sm"
            className="text-[13px] max-sm:h-10 max-sm:flex-1"
            disabled={!draftRange && !anchor && !value}
            onClick={apply}
          >
            {labels.apply}
          </Button>
        </div>
      )}
    </div>
  );

  const panel = (
    <div
      ref={attachPanel}
      id={inline ? panelId : undefined}
      role={inline ? "dialog" : undefined}
      aria-label={inline ? labels.dialog : undefined}
      data-slot="date-range-picker-content"
      data-layout={months === 2 ? "two-months" : "one-month"}
      onKeyDown={onPanelKeyDown}
      style={{
        width: inline
          ? `min(${natural}px, 100cqw)`
          : `min(${natural}px, var(--radix-popover-content-available-width, 100vw))`,
      }}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border/70 bg-popover/90 text-popover-foreground shadow-xl backdrop-blur-md outline-none",
        "motion-safe:animate-[date-range-picker-in_240ms_cubic-bezier(0.22,1,0.36,1)]",
        inline
          ? cn(
              "absolute top-full z-30 mt-2",
              align === "end"
                ? "end-0 origin-top-right"
                : align === "center"
                  ? "left-1/2 -translate-x-1/2 origin-top"
                  : "start-0 origin-top-left",
            )
          : "max-h-(--radix-popover-content-available-height) max-w-full origin-(--radix-popover-content-transform-origin) overflow-y-auto",
        contentClassName,
      )}
    >
      <div
        className={cn(
          "flex shrink-0",
          presetLayout === "row" ? "flex-col-reverse" : "flex-row",
        )}
      >
        {presetList}
        {calendar}
      </div>
      {compareRow}
      {footer}
    </div>
  );

  const dates = value ? formatDateRange(value, locale) : null;
  const triggerLabel = formatLabel ? (
    formatLabel(value ?? null, committedPreset)
  ) : value ? (
    committedPreset ? (
      <>
        <span className="shrink-0 font-medium">{committedPreset.label}</span>
        <span className="min-w-0 truncate text-muted-foreground tabular-nums @max-sm:hidden">
          {dates}
        </span>
      </>
    ) : (
      <span className="min-w-0 truncate font-medium tabular-nums">{dates}</span>
    )
  ) : (
    <span className="truncate text-muted-foreground">{labels.placeholder}</span>
  );

  const triggerClasses = cn(
    "group/trigger inline-flex w-full min-w-0 items-center gap-2 rounded-md border border-input bg-card text-foreground shadow-xs transition-[color,background-color,border-color,box-shadow] outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:border-ring/60 data-[state=open]:ring-2 data-[state=open]:ring-ring/15 motion-reduce:transition-none",
    size === "sm"
      ? "h-10 px-2.5 text-[13px] sm:h-8"
      : "h-11 px-3 text-base sm:h-9 sm:text-sm",
    triggerClassName,
  );
  const triggerContent = (
    <>
      <IconCalendarEvent
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
      <span className="flex min-w-0 flex-1 items-baseline gap-2 text-start">
        {triggerLabel}
      </span>
      <IconChevronDown
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/trigger:rotate-180 motion-reduce:transition-none"
      />
    </>
  );

  return (
    <div
      data-slot="date-range-picker"
      data-state={open ? "open" : "closed"}
      className={cn("relative inline-flex min-w-0 align-middle", className)}
      {...props}
    >
      <style>{keyframes}</style>
      {name && value && (
        <>
          <input type="hidden" name={`${name}[from]`} value={toISODate(value.from)} />
          <input type="hidden" name={`${name}[to]`} value={toISODate(value.to)} />
        </>
      )}
      {inline ? (
        <>
          <button
            ref={triggerRef}
            type="button"
            id={id}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            data-slot="date-range-picker-trigger"
            data-state={open ? "open" : "closed"}
            disabled={disabled}
            onClick={() => setOpen(!open)}
            className={triggerClasses}
          >
            {triggerContent}
          </button>
          {open && panel}
        </>
      ) : (
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Trigger asChild>
            <button
              ref={triggerRef}
              type="button"
              id={id}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              data-slot="date-range-picker-trigger"
              disabled={disabled}
              className={triggerClasses}
            >
              {triggerContent}
            </button>
          </PopoverPrimitive.Trigger>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align={align}
              sideOffset={8}
              collisionPadding={8}
              aria-label={labels.dialog}
              className="z-50 outline-none"
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                if (!userOpened.current) return;
                requestAnimationFrame(() => focusDay(focusedRef.current));
              }}
              onEscapeKeyDown={(event) => {
                if (!anchor) return;
                event.preventDefault();
                cancelPending();
              }}
            >
              {panel}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      )}
    </div>
  );
}
