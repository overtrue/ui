/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 *
 * MIT License
 *
 * Copyright (c) 2026 dashboardcn contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * ---
 *
 * Portions of this project are derived from shadcn/ui and shadcn/registry-template
 * (https://github.com/shadcn-ui/ui), Copyright (c) 2023 shadcn, licensed under the
 * MIT License. The notice above applies to those portions as well.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { formatNumber } from "./metric-format";

export interface ActivityDatum {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  value: number;
}

export interface ActivityHeatmapProps extends React.ComponentProps<"div"> {
  data: ActivityDatum[];
  /** Last day shown. Defaults to today. */
  endDate?: Date;
  /** Number of week columns. Ignored when `startDate` is set. */
  weeks?: number;
  /** First day shown. Overrides `weeks`. */
  startDate?: Date;
  /** Any CSS color. Levels are mixed from this and the card surface. Defaults to chart-1. */
  color?: string;
  /**
   * Explicit color per level, from empty to most active.
   * Overrides `color`. Length sets the number of levels.
   */
  colors?: string[];
  /** How values map to levels. `sqrt` spreads out small values. */
  scale?: "linear" | "sqrt";
  /** Cell size in px. */
  cellSize?: number;
  /** Gap between cells in px. */
  gap?: number;
  valueFormatter?: (value: number) => string;
  /** Label for the value in the tooltip, e.g. "events". */
  unit?: string;
  showMonthLabels?: boolean;
  /** Which weekday labels to show along the left edge. */
  weekdayLabels?: "mwf" | "all" | "none";
  showLegend?: boolean;
  /** Show the total and the number of active days beside the legend. Follows `showLegend` by default. */
  showSummary?: boolean;
  /** Scroll to the most recent weeks when the grid overflows. */
  scrollToEnd?: boolean;
  /** Replace the tooltip body. Return `null` to hide it for that cell. */
  renderTooltip?: (datum: { date: Date; value: number }) => React.ReactNode;
  onCellClick?: (datum: { date: Date; value: number }) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const EMPTY_FILL = "color-mix(in oklab, var(--color-muted) 72%, transparent)";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function useReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function toKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  // Calendar days can be 23 or 25 hours across daylight-saving transitions.
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function levelFor(
  value: number,
  max: number,
  levels: number,
  scale: "linear" | "sqrt",
) {
  if (value <= 0 || max <= 0) return 0;
  let t = value / max;
  if (scale === "sqrt") t = Math.sqrt(t);
  return Math.min(levels - 1, Math.max(1, Math.ceil(t * (levels - 1))));
}

/** The smallest value that lands in each level, so the legend can name its range. */
function levelFloor(
  level: number,
  max: number,
  levels: number,
  scale: "linear" | "sqrt",
) {
  if (level <= 0) return 0;
  const t = (level - 1) / (levels - 1);
  return scale === "sqrt" ? t * t * max : t * max;
}

/** An OKLab ramp from the card surface to the accent, one step per level. */
function mixedColors(color: string, levels: number) {
  return Array.from({ length: levels }, (_, level) => {
    if (level === 0) return EMPTY_FILL;
    const pct = Math.round(22 + ((level - 1) / Math.max(1, levels - 2)) * 78);
    return `color-mix(in oklab, ${color} ${pct}%, var(--color-card))`;
  });
}

/**
 * A calendar heatmap with a column per week and a row per weekday. Hover or focus a
 * day to outline it and read its value; arrow keys move by day and by week.
 */
function ActivityHeatmap({
  data,
  endDate,
  weeks = 52,
  startDate,
  color = "var(--color-chart-1)",
  colors,
  scale = "linear",
  cellSize = 12,
  gap = 3,
  valueFormatter = (value) => formatNumber(value),
  unit = "events",
  showMonthLabels = true,
  weekdayLabels = "mwf",
  showLegend = true,
  showSummary = showLegend,
  scrollToEnd = true,
  renderTooltip,
  onCellClick,
  className,
  ...props
}: ActivityHeatmapProps) {
  const reduced = useReducedMotion();
  const endTime = startOfDay(endDate ?? new Date()).getTime();
  const startTime = startDate
    ? startOfDay(startDate).getTime()
    : addDays(new Date(endTime), -(weeks * 7 - 1)).getTime();

  const values = React.useMemo(
    () => new Map(data.map((d) => [d.date, d.value])),
    [data],
  );

  // Columns are full weeks, Sunday first. Days before `start` in the first
  // week and after `end` in the last are left empty rather than filled in.
  const columns = React.useMemo(() => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const result: (Date | null)[][] = [];
    let cursor = addDays(start, -start.getDay());
    while (cursor <= end) {
      const week: (Date | null)[] = [];
      for (let i = 0; i < 7; i++) {
        const day = addDays(cursor, i);
        week.push(day < start || day > end ? null : day);
      }
      result.push(week);
      cursor = addDays(cursor, 7);
    }
    return result;
  }, [startTime, endTime]);

  const max = React.useMemo(
    () => data.reduce((acc, d) => Math.max(acc, d.value), 0),
    [data],
  );

  // Totals cover the days on screen, not every datum passed in.
  const stats = React.useMemo(() => {
    let total = 0;
    let activeDays = 0;
    let busiest: Date | null = null;
    let busiestValue = 0;
    for (const week of columns)
      for (const day of week) {
        if (!day) continue;
        const value = values.get(toKey(day)) ?? 0;
        if (value > 0) {
          total += value;
          activeDays += 1;
        }
        if (value > busiestValue) {
          busiestValue = value;
          busiest = day;
        }
      }
    return { total, activeDays, busiest: busiest as Date | null };
  }, [columns, values]);

  // Month labels span the weeks whose first shown day falls in that month.
  const months = React.useMemo(() => {
    const groups: { label: string; from: number; to: number }[] = [];
    const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    columns.forEach((week, index) => {
      const first = week.find((d): d is Date => d !== null);
      if (!first) return;
      const key = `${first.getFullYear()}-${first.getMonth()}`;
      const last = groups[groups.length - 1];
      if (last && last.label === key) {
        last.to = index;
      } else {
        groups.push({ label: key, from: index, to: index });
      }
    });
    return groups
      .filter((g) => g.to - g.from >= 1)
      .map((g) => ({
        ...g,
        label: formatter.format(columns[g.from]!.find(Boolean) as Date),
      }));
  }, [columns]);

  const palette = colors && colors.length > 1 ? colors : mixedColors(color, 5);
  const levels = palette.length;

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const rootRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const tipRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState<string | null>(null);
  const [tabStop, setTabStop] = React.useState<string | null>(null);
  // Which edges have more weeks hidden behind them, so they can fade out.
  const [edges, setEdges] = React.useState({ start: false, end: false });
  const [anchor, setAnchor] = React.useState<{
    x: number;
    top: number;
    bottom: number;
  } | null>(null);

  const updateEdges = React.useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;
    const start = node.scrollLeft > 1;
    const end = node.scrollLeft < node.scrollWidth - node.clientWidth - 1;
    setEdges((current) =>
      current.start === start && current.end === end ? current : { start, end },
    );
  }, []);

  React.useLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    if (scrollToEnd) node.scrollLeft = node.scrollWidth;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(node);
    return () => observer.disconnect();
  }, [scrollToEnd, columns.length, cellSize, gap, updateEdges]);

  const measure = React.useCallback(() => {
    const root = rootRef.current;
    const cell = active
      ? gridRef.current?.querySelector<HTMLElement>(`[data-date="${active}"]`)
      : null;
    if (!root || !cell) {
      setAnchor(null);
      return;
    }
    const box = root.getBoundingClientRect();
    const rect = cell.getBoundingClientRect();
    setAnchor({
      x: rect.left + rect.width / 2 - box.left,
      top: rect.top - box.top,
      bottom: rect.bottom - box.top,
    });
  }, [active]);

  useIsomorphicLayoutEffect(measure, [measure, columns]);

  useIsomorphicLayoutEffect(() => {
    const tip = tipRef.current;
    const root = rootRef.current;
    if (!tip || !root || !anchor) return;
    const width = tip.offsetWidth;
    const height = tip.offsetHeight;
    const left = Math.min(
      Math.max(anchor.x - width / 2, 0),
      Math.max(0, root.clientWidth - width),
    );
    const below = anchor.top - height - 8 < -4;
    const y = below ? anchor.bottom + 8 : anchor.top - height - 8;
    tip.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(y)}px, 0)`;
  });

  // The roving tab stop defaults to the most recent day on screen.
  const lastKey = React.useMemo(() => {
    for (let w = columns.length - 1; w >= 0; w--)
      for (let d = 6; d >= 0; d--) {
        const day = columns[w]![d];
        if (day) return toKey(day);
      }
    return null;
  }, [columns]);
  const stopKey =
    tabStop &&
    columns.some((week) => week.some((day) => day && toKey(day) === tabStop))
      ? tabStop
      : lastKey;

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const key = target.dataset.date;
    if (!key) return;
    const [y, m, d] = key.split("-").map(Number);
    const day = new Date(y!, m! - 1, d!);
    const offsets: Record<string, number> = {
      ArrowRight: 7,
      ArrowLeft: -7,
      ArrowDown: 1,
      ArrowUp: -1,
    };
    const offset = offsets[event.key];
    if (offset === undefined) return;
    event.preventDefault();
    const next = gridRef.current?.querySelector<HTMLElement>(
      `[data-date="${toKey(addDays(day, offset))}"]`,
    );
    next?.focus();
  };

  const hasHeader = showMonthLabels;
  const hasWeekdays = weekdayLabels !== "none";
  const fontSize = Math.max(10, Math.min(11, cellSize));
  const radius = Math.max(2, Math.round(cellSize / 4));
  const stagger = Math.min(9, 520 / Math.max(1, columns.length + 7));

  const activeDate = active
    ? (() => {
        const [y, m, d] = active.split("-").map(Number);
        return new Date(y!, m! - 1, d!);
      })()
    : null;
  const activeValue = active ? (values.get(active) ?? 0) : 0;
  const activeLevel = active ? levelFor(activeValue, max, levels, scale) : null;
  const activeWeek = active
    ? columns.findIndex((week) =>
        week.some((day) => day != null && toKey(day) === active),
      )
    : -1;

  const tooltipBody = activeDate ? (
    renderTooltip ? (
      renderTooltip({ date: activeDate, value: activeValue })
    ) : (
      <div className="grid min-w-44 gap-1">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-[3px] inset-ring inset-ring-foreground/10"
            style={{ backgroundColor: palette[activeLevel ?? 0] }}
          />
          <span className="font-medium text-foreground">
            {dateFormatter.format(activeDate)}
          </span>
          <span className="ml-auto pl-4 font-semibold text-foreground tabular-nums">
            {valueFormatter(activeValue)}
            <span className="ml-1 font-normal text-muted-foreground">
              {unit}
            </span>
          </span>
        </div>
        {stats.busiest && toKey(stats.busiest) === active ? (
          <div className="pl-[18px] text-[11px] text-muted-foreground">
            Busiest day in view
          </div>
        ) : null}
      </div>
    )
  ) : null;

  return (
    <div
      ref={rootRef}
      data-slot="activity-heatmap"
      className={cn("relative flex min-w-0 flex-col gap-3 text-xs", className)}
      {...props}
    >
      <style href="overtrue-activity-heatmap" precedence="default">
        {`@keyframes activity-heatmap-in{from{opacity:0;transform:scale(.4)}}`}
      </style>
      <div className="flex min-w-0">
        {hasWeekdays ? (
          <div
            aria-hidden
            className="grid shrink-0 pt-1 pr-1.5"
            style={{
              gap,
              gridTemplateRows: `${hasHeader ? `${fontSize}px` : "0px"} repeat(7, ${cellSize}px)`,
            }}
          >
            <div />
            {WEEKDAYS.map((day, index) => (
              <div
                key={day}
                data-active={activeDate?.getDay() === index || undefined}
                className="flex items-center leading-none whitespace-nowrap text-muted-foreground transition-colors duration-150 data-[active]:text-foreground motion-reduce:transition-none"
                style={{ fontSize }}
              >
                {weekdayLabels === "all" ||
                index % 2 === 1 ||
                activeDate?.getDay() === index
                  ? day
                  : ""}
              </div>
            ))}
          </div>
        ) : null}
        <div
          ref={scrollRef}
          onScroll={() => {
            measure();
            updateEdges();
          }}
          style={{
            maskImage:
              edges.start || edges.end
                ? `linear-gradient(to right, ${edges.start ? "transparent, #000 28px" : "#000"}, ${edges.end ? "#000 calc(100% - 28px), transparent" : "#000"})`
                : undefined,
          }}
          className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain p-1 [scrollbar-color:color-mix(in_oklab,var(--color-foreground)_20%,transparent)_transparent] [scrollbar-width:thin]"
        >
          <div
            ref={gridRef}
            role="group"
            aria-label="Activity heatmap"
            className="grid w-max"
            style={{
              gap,
              gridTemplateColumns: `repeat(${columns.length}, ${cellSize}px)`,
              gridTemplateRows: `${hasHeader ? `${fontSize}px` : "0px"} repeat(7, ${cellSize}px)`,
            }}
            onPointerOver={(event) => {
              const key = (event.target as HTMLElement).dataset?.date;
              setActive(key ?? null);
            }}
            onPointerLeave={() => setActive(null)}
            onKeyDown={onKeyDown}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node))
                setActive(null);
            }}
          >
            {hasHeader
              ? months.map((month) => (
                  <div
                    key={`${month.from}-${month.label}`}
                    data-active={
                      (activeWeek >= month.from && activeWeek <= month.to) ||
                      undefined
                    }
                    className="self-end leading-none whitespace-nowrap text-muted-foreground transition-colors duration-150 data-[active]:text-foreground motion-reduce:transition-none"
                    style={{
                      gridRow: 1,
                      gridColumn: `${month.from + 1} / ${month.to + 2}`,
                      fontSize,
                    }}
                  >
                    {month.label}
                  </div>
                ))
              : null}

            {columns.map((week, weekIndex) =>
              week.map((day, dayIndex) => {
                const style: React.CSSProperties = {
                  gridColumn: weekIndex + 1,
                  gridRow: dayIndex + 2,
                };
                if (!day) {
                  return <div key={dayIndex} aria-hidden style={style} />;
                }
                const key = toKey(day);
                const value = values.get(key) ?? 0;
                const level = levelFor(value, max, levels, scale);
                const datum = { date: day, value };
                const label = `${valueFormatter(value)} ${unit} on ${dateFormatter.format(day)}`;

                return (
                  <button
                    key={dayIndex}
                    type="button"
                    aria-label={label}
                    data-slot="activity-heatmap-cell"
                    data-level={level}
                    data-date={key}
                    data-active={active === key || undefined}
                    tabIndex={key === stopKey ? 0 : -1}
                    onFocus={() => {
                      setTabStop(key);
                      setActive(key);
                    }}
                    onClick={onCellClick ? () => onCellClick(datum) : undefined}
                    className={cn(
                      "relative inset-ring inset-ring-foreground/6 outline-0 outline-offset-1 outline-transparent",
                      "transition-[background-color,outline-color] [transition-duration:450ms,150ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                      "data-[active]:z-10 data-[active]:outline-2 data-[active]:outline-foreground/85",
                      "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-ring",
                      "dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]",
                      !reduced &&
                        "motion-safe:animate-[activity-heatmap-in_600ms_cubic-bezier(0.22,1,0.36,1)_backwards]",
                      onCellClick ? "cursor-pointer" : "cursor-default",
                    )}
                    style={{
                      ...style,
                      borderRadius: radius,
                      backgroundColor: palette[level],
                      animationDelay: reduced
                        ? undefined
                        : `${Math.round((weekIndex + dayIndex) * stagger)}ms`,
                    }}
                  />
                );
              }),
            )}
          </div>
        </div>
      </div>

      {anchor && tooltipBody !== null && tooltipBody !== undefined ? (
        <div
          ref={tipRef}
          aria-hidden="true"
          data-slot="activity-heatmap-tooltip"
          className={cn(
            "pointer-events-none absolute top-0 left-0 z-20 w-max max-w-72 rounded-xl border border-border/70 bg-popover/90 px-3 py-2 text-xs text-popover-foreground shadow-xl backdrop-blur-md",
            !reduced &&
              "transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          )}
        >
          {tooltipBody}
        </div>
      ) : null}

      {showLegend || showSummary ? (
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          {showSummary ? (
            <p
              data-slot="activity-heatmap-summary"
              className="m-0 flex min-w-0 flex-wrap items-baseline gap-x-1.5 text-muted-foreground"
            >
              <span>
                <span className="font-medium text-foreground tabular-nums">
                  {valueFormatter(stats.total)}
                </span>{" "}
                {unit}
              </span>
              <span aria-hidden="true" className="text-border">
                /
              </span>
              <span>
                <span className="font-medium text-foreground tabular-nums">
                  {stats.activeDays.toLocaleString("en-US")}
                </span>{" "}
                active {stats.activeDays === 1 ? "day" : "days"}
              </span>
            </p>
          ) : (
            <span />
          )}
          {showLegend ? (
            <div
              data-slot="activity-heatmap-legend"
              className="ml-auto flex items-center gap-1 text-muted-foreground"
              style={{ fontSize }}
            >
              <span className="mr-1">Less</span>
              {palette.map((fill, level) => {
                const from = levelFloor(level, max, levels, scale);
                const to = levelFloor(level + 1, max, levels, scale);
                const range =
                  level === 0
                    ? `No ${unit}`
                    : level === 1
                      ? `Up to ${valueFormatter(to)} ${unit}`
                      : `${valueFormatter(from)}–${valueFormatter(to)} ${unit}`;
                return (
                  <span
                    key={level}
                    title={range}
                    data-active={activeLevel === level || undefined}
                    className="inset-ring inset-ring-foreground/6 outline-0 outline-offset-1 outline-transparent transition-[outline-color] duration-150 data-[active]:outline-2 data-[active]:outline-foreground/85 motion-reduce:transition-none"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      borderRadius: radius,
                      backgroundColor: fill,
                    }}
                  />
                );
              })}
              <span className="ml-1">More</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export { ActivityHeatmap };
