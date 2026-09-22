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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  /** Any CSS color. Levels are mixed from this and `--muted`. Defaults to chart-1. */
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
  /** Scroll to the most recent weeks when the grid overflows. */
  scrollToEnd?: boolean;
  /** Replace the tooltip body. Return `null` to hide it for that cell. */
  renderTooltip?: (datum: { date: Date; value: number }) => React.ReactNode;
  onCellClick?: (datum: { date: Date; value: number }) => void;
}

const DAY = 24 * 60 * 60 * 1000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  return new Date(date.getTime() + days * DAY);
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

function mixedColors(color: string, levels: number) {
  return Array.from({ length: levels }, (_, level) => {
    if (level === 0) return "var(--color-muted)";
    const pct = Math.round(25 + ((level - 1) / (levels - 2)) * 75);
    return `color-mix(in oklab, ${color} ${pct}%, var(--color-muted))`;
  });
}

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
  scrollToEnd = true,
  renderTooltip,
  onCellClick,
  className,
  ...props
}: ActivityHeatmapProps) {
  const endTime = startOfDay(endDate ?? new Date()).getTime();
  const startTime = startDate
    ? startOfDay(startDate).getTime()
    : endTime - (weeks * 7 - 1) * DAY;

  const values = React.useMemo(
    () => new Map(data.map((d) => [d.date, d.value])),
    [data],
  );
  const max = React.useMemo(
    () => data.reduce((acc, d) => Math.max(acc, d.value), 0),
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

  const scrollRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node || !scrollToEnd) return;
    node.scrollLeft = node.scrollWidth;
  }, [scrollToEnd, columns.length, cellSize, gap]);

  const hasHeader = showMonthLabels;
  const hasWeekdays = weekdayLabels !== "none";
  const fontSize = Math.max(10, Math.min(12, cellSize));

  return (
    <div
      data-slot="activity-heatmap"
      className={cn("flex min-w-0 flex-col gap-2 text-xs", className)}
      {...props}
    >
      <div className="flex min-w-0">
        {hasWeekdays ? (
          <div
            aria-hidden
            className="grid shrink-0 pr-1"
            style={{
              gap,
              gridTemplateRows: `${hasHeader ? `${fontSize}px` : "0px"} repeat(7, ${cellSize}px)`,
            }}
          >
            <div />
            {WEEKDAYS.map((day, index) => (
              <div
                key={day}
                className="text-muted-foreground flex items-center leading-none whitespace-nowrap"
                style={{ fontSize }}
              >
                {weekdayLabels === "all" || index % 2 === 1 ? day : ""}
              </div>
            ))}
          </div>
        ) : null}
        <div
          ref={scrollRef}
          className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:thin] [scrollbar-color:color-mix(in_oklab,var(--color-foreground)_20%,transparent)_transparent]"
        >
          <TooltipProvider delayDuration={100} skipDelayDuration={0}>
            <div
              role="group"
              aria-label="Activity heatmap"
              className="grid w-max"
              style={{
                gap,
                gridTemplateColumns: `repeat(${columns.length}, ${cellSize}px)`,
                gridTemplateRows: `${hasHeader ? `${fontSize}px` : "0px"} repeat(7, ${cellSize}px)`,
              }}
            >
              {hasHeader
                ? months.map((month) => (
                    <div
                      key={`${month.from}-${month.label}`}
                      className="text-muted-foreground self-end leading-none whitespace-nowrap"
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
                  const style = {
                    gridColumn: weekIndex + 1,
                    gridRow: dayIndex + 2,
                  };
                  if (!day) {
                    return <div key={dayIndex} aria-hidden style={style} />;
                  }
                  const value = values.get(toKey(day)) ?? 0;
                  const level = levelFor(value, max, levels, scale);
                  const datum = { date: day, value };
                  const body = renderTooltip ? (
                    renderTooltip(datum)
                  ) : (
                    <>
                      <span className="font-medium tabular-nums">
                        {valueFormatter(value)} {unit}
                      </span>
                      <span className="text-background/70 block">
                        {dateFormatter.format(day)}
                      </span>
                    </>
                  );
                  const label = `${valueFormatter(value)} ${unit} on ${dateFormatter.format(day)}`;

                  const cell = (
                    <button
                      type="button"
                      aria-label={label}
                      data-level={level}
                      data-date={toKey(day)}
                      onClick={
                        onCellClick ? () => onCellClick(datum) : undefined
                      }
                      className={cn(
                        "focus-visible:ring-ring/60 ring-inset rounded-[2px] outline-none transition-[filter] duration-100 hover:brightness-110 focus-visible:ring-2 dark:hover:brightness-125",
                        "inset-ring-foreground/6 inset-ring",
                        onCellClick ? "cursor-pointer" : "cursor-default",
                      )}
                      style={{ ...style, backgroundColor: palette[level] }}
                    />
                  );

                  if (body === null) {
                    return (
                      <React.Fragment key={dayIndex}>{cell}</React.Fragment>
                    );
                  }

                  return (
                    <Tooltip key={dayIndex}>
                      <TooltipTrigger asChild>{cell}</TooltipTrigger>
                      <TooltipContent sideOffset={4} className="text-left">
                        {body}
                      </TooltipContent>
                    </Tooltip>
                  );
                }),
              )}
            </div>
          </TooltipProvider>
        </div>
      </div>

      {showLegend ? (
        <div
          className="text-muted-foreground flex items-center justify-end gap-1"
          style={{ fontSize }}
        >
          <span className="mr-0.5">Less</span>
          {palette.map((fill, level) => (
            <span
              key={level}
              className="inset-ring-foreground/6 inset-ring rounded-[2px]"
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: fill,
              }}
            />
          ))}
          <span className="ml-0.5">More</span>
        </div>
      ) : null}
    </div>
  );
}

export { ActivityHeatmap };
