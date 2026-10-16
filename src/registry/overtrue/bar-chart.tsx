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
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
  useActiveTooltipDataPoints,
  type BarProps,
  type BarShapeProps,
} from "recharts-analytics";

import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip } from "./analytics-chart";

export type BarRow = Record<string, unknown>;

export interface BarReferenceLine {
  /** Horizontal line at this y value. */
  y: number;
  label?: string;
  /** Any CSS color. Defaults to the muted foreground. */
  color?: string;
  /** Defaults to dashed. */
  dashed?: boolean;
}

export interface BarChartProps extends Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
> {
  data: BarRow[];
  /** Key of the x-axis value in each row. */
  xKey: string;
  /** Key of the bar value in each row. */
  yKey: string;
  /**
   * Key of a coarser label, e.g. "month" for weekly rows. When set, the x-axis
   * shows one tick per group centered under its bars instead of a tick per bar.
   */
  groupKey?: string;
  /** "gradient" fades each bar toward the bottom; "striped" fills it with diagonal bands. */
  variant?: "gradient" | "striped" | "solid";
  /** Any CSS color for highlighted bars. Defaults to chart-1. */
  color?: string;
  /** Any CSS color for bars that are not highlighted. Defaults to the muted foreground. */
  mutedColor?: string;
  /** Return true for bars drawn in color. Every bar is highlighted when omitted. */
  highlight?: (row: BarRow, index: number) => boolean;
  grid?: "dashed" | "solid" | "none";
  showYAxis?: boolean;
  showTooltip?: boolean;
  /** Draw a hollow ring on top of the hovered bar. */
  showActiveMarker?: boolean;
  barRadius?: number;
  /** Animate bars after hydration and when data changes. Respects reduced motion. */
  animate?: boolean;
  animationDuration?: number;
  /** Horizontal lines, e.g. a goal or an average. The y-axis extends to fit them. */
  referenceLines?: BarReferenceLine[];
  xFormatter?: (value: unknown) => string;
  yFormatter?: (value: number) => string;
  /** Secondary line of the tooltip. Defaults to the formatted x value. */
  tooltipLabel?: (row: BarRow, index: number) => React.ReactNode;
  onBarClick?: (row: BarRow, index: number) => void;
}

/** Keyboard focus on the plot gets the shared primary ring. */
const FOCUS =
  "[&_.recharts-surface:focus-visible]:rounded-lg [&_.recharts-surface:focus-visible]:shadow-[0_0_0_2px_color-mix(in_oklab,var(--color-primary)_30%,transparent)]";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getReducedMotionServerSnapshot() {
  return true;
}

function defaultXFormatter(value: unknown) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y!, m! - 1, d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  return String(value);
}

/** One tick per group, placed under the middle bar of the group. */
function groupTicks(data: BarRow[], groupKey: string) {
  const labels: string[] = Array.from({ length: data.length }, () => "");
  let start = 0;
  for (let i = 1; i <= data.length; i++) {
    if (i === data.length || data[i]![groupKey] !== data[start]![groupKey]) {
      labels[Math.floor((start + i - 1) / 2)] = String(
        data[start]![groupKey] ?? "",
      );
      start = i;
    }
  }
  return labels;
}

/* ------------------------------------------------------------ visual tokens */

const GRID = "color-mix(in oklab, var(--color-foreground) 7%, transparent)";
const TICK = { fontSize: 11, fill: "var(--color-muted-foreground)" };
/** cubic-bezier(0.22, 1, 0.36, 1) is the ease-out-quint curve. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 5);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const mix = (from: number, to: number, t: number) => from + (to - from) * t;

type BarInterpolate = NonNullable<BarProps["animationInterpolateFn"]>;

/**
 * Bars rise from the baseline one after another on entrance and glide on
 * updates. Recharts runs the clock linearly; each bar applies its own delay and easing.
 */
function barTween(count: number, duration: number) {
  const step = count > 1 ? Math.min(28, 360 / (count - 1)) : 0;
  const total = duration + step * Math.max(count - 1, 0);
  const interpolate: BarInterpolate = (items, elapsed) => {
    if (items == null) return [];
    const entering = items.every((item) => item.status === "added");
    return items.flatMap((item, index) => {
      const t =
        elapsed >= 1
          ? 1
          : easeOut(
              clamp01(
                (elapsed * total - (entering ? index * step : 0)) / duration,
              ),
            );
      if (item.status === "removed") {
        if (t >= 1) return [];
        const prev = item.prev;
        return [
          {
            ...prev,
            height: mix(prev.height, 0, t),
            y: mix(prev.y, prev.y + prev.height, t),
          },
        ];
      }
      if (item.status === "matched") {
        const { prev, next } = item;
        return [
          {
            ...next,
            x: mix(prev.x, next.x, t),
            y: mix(prev.y, next.y, t),
            width: mix(prev.width, next.width, t),
            height: mix(prev.height, next.height, t),
          },
        ];
      }
      const next = item.next;
      return [
        {
          ...next,
          height: mix(0, next.height, t),
          y: mix(next.stackedBarStart, next.y, t),
        },
      ];
    });
  };
  return { interpolate, total };
}

/** A bar that dims while another bar is hovered or focused, with an optional ring marker. */
function BarShape({
  fill,
  on,
  color,
  mutedColor,
  marker,
  ...props
}: BarShapeProps & {
  fill: string;
  on: boolean;
  color: string;
  mutedColor: string;
  marker: boolean;
}) {
  const active = useActiveTooltipDataPoints();
  const hovering = active != null && active.length > 0;
  const isActive = hovering && active.includes(props.payload);
  const { x, y, width, height } = props;
  const accent = on ? color : mutedColor;
  return (
    <g
      data-slot="bar-chart-bar"
      data-active={isActive || undefined}
      className="transition-opacity duration-150 ease-out motion-reduce:transition-none"
      style={{ opacity: hovering && !isActive ? 0.4 : 1 }}
    >
      <Rectangle {...props} fill={fill} />
      {marker && isActive && height > 0 ? (
        <g data-slot="bar-chart-marker" pointerEvents="none">
          <circle
            cx={x + width / 2}
            cy={y}
            r={9}
            fill={accent}
            fillOpacity={0.18}
          />
          <circle
            cx={x + width / 2}
            cy={y}
            r={4}
            fill="var(--color-card)"
            stroke={accent}
            strokeWidth={2}
          />
        </g>
      ) : null}
    </g>
  );
}

/** A single-series bar chart with gradient or striped fills, highlighted bars, and a hover marker. */
function BarChart({
  data,
  xKey,
  yKey,
  groupKey,
  variant = "gradient",
  color = "var(--color-chart-1)",
  mutedColor = "var(--color-muted-foreground)",
  highlight,
  grid = "dashed",
  showYAxis = false,
  showTooltip = true,
  showActiveMarker = true,
  barRadius = 6,
  animate = true,
  animationDuration = 500,
  referenceLines = [],
  xFormatter = defaultXFormatter,
  yFormatter,
  tooltipLabel,
  onBarClick,
  className,
  ...props
}: BarChartProps) {
  const id = React.useId().replace(/:/g, "");
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const isHighlighted = React.useCallback(
    (index: number) => (highlight ? highlight(data[index]!, index) : true),
    [data, highlight],
  );
  const tickLabels = React.useMemo(
    () => (groupKey ? groupTicks(data, groupKey) : null),
    [data, groupKey],
  );
  const tween = React.useMemo(
    () => barTween(data.length, animationDuration),
    [data.length, animationDuration],
  );
  const fillFor = (index: number) =>
    `url(#${id}-${isHighlighted(index) ? "on" : "off"})`;
  const format = (value: number) =>
    yFormatter ? yFormatter(value) : value.toLocaleString();

  return (
    <ChartContainer
      data-slot="bar-chart"
      data-variant={variant}
      config={{ [yKey]: { label: yKey, color } }}
      className={cn("aspect-auto h-64 w-full tabular-nums", FOCUS, className)}
      {...props}
    >
      <RechartsBarChart
        data={data}
        margin={{ top: 14, right: 8, bottom: 0, left: showYAxis ? 0 : 8 }}
        barCategoryGap="28%"
      >
        <defs>
          {variant === "gradient" ? (
            <>
              <linearGradient id={`${id}-on`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.72} />
              </linearGradient>
              <linearGradient id={`${id}-off`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={mutedColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={mutedColor} stopOpacity={0.16} />
              </linearGradient>
            </>
          ) : variant === "striped" ? (
            <>
              {(["on", "off"] as const).map((state) => {
                const fill = state === "on" ? color : mutedColor;
                const base = state === "on" ? 0.42 : 0.14;
                const band = state === "on" ? 1 : 0.32;
                return (
                  <pattern
                    key={state}
                    id={`${id}-${state}`}
                    patternUnits="userSpaceOnUse"
                    width={6}
                    height={6}
                    patternTransform="rotate(45)"
                  >
                    <rect width={6} height={6} fill={fill} fillOpacity={base} />
                    <rect width={2.5} height={6} fill={fill} fillOpacity={band} />
                  </pattern>
                );
              })}
            </>
          ) : (
            <>
              <linearGradient id={`${id}-on`}>
                <stop stopColor={color} />
              </linearGradient>
              <linearGradient id={`${id}-off`}>
                <stop stopColor={mutedColor} stopOpacity={0.3} />
              </linearGradient>
            </>
          )}
        </defs>
        {grid !== "none" ? (
          <CartesianGrid
            vertical={false}
            stroke={GRID}
            strokeDasharray={grid === "dashed" ? "3 5" : undefined}
          />
        ) : null}
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={TICK}
          interval={tickLabels ? 0 : "preserveStartEnd"}
          minTickGap={tickLabels ? 0 : 24}
          tickFormatter={
            tickLabels
              ? (_, index) => tickLabels[index] ?? ""
              : (v) => xFormatter(v)
          }
        />
        <YAxis
          hide={!showYAxis}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={TICK}
          width={44}
          tickFormatter={yFormatter}
        />
        <ChartTooltip
          cursor={false}
          isAnimationActive={false}
          content={({ active, payload }) => {
            const entry = payload?.[0];
            if (!showTooltip || !active || !entry) return null;
            const row = entry.payload as BarRow;
            const index = data.indexOf(row);
            const value = Number(row[yKey]);
            return (
              <div
                data-slot="bar-chart-tooltip"
                className="min-w-32 rounded-xl border border-border/70 bg-popover/90 px-3 py-2 text-xs text-popover-foreground shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: isHighlighted(index) ? color : mutedColor,
                    }}
                  />
                  <span className="text-sm font-semibold tracking-[-0.01em] tabular-nums">
                    {format(value)}
                  </span>
                </div>
                <div className="mt-0.5 pl-4 text-muted-foreground">
                  {tooltipLabel
                    ? tooltipLabel(row, index)
                    : xFormatter(row[xKey])}
                </div>
              </div>
            );
          }}
        />
        <Bar
          dataKey={yKey}
          radius={barRadius}
          isAnimationActive={animate && !reducedMotion}
          animationDuration={tween.total}
          animationEasing="linear"
          animationInterpolateFn={tween.interpolate}
          shape={(shape: BarShapeProps) => (
            <BarShape
              {...shape}
              fill={fillFor(shape.originalDataIndex ?? shape.index)}
              on={isHighlighted(shape.originalDataIndex ?? shape.index)}
              color={color}
              mutedColor={mutedColor}
              marker={showActiveMarker}
            />
          )}
          onClick={
            onBarClick
              ? (_, index) => onBarClick(data[index]!, index)
              : undefined
          }
          className={onBarClick ? "cursor-pointer" : undefined}
        />
        {referenceLines.map((line, index) => (
          <ReferenceLine
            key={index}
            y={line.y}
            ifOverflow="extendDomain"
            stroke={
              line.color ??
              "color-mix(in oklab, var(--color-muted-foreground) 70%, transparent)"
            }
            strokeDasharray={line.dashed === false ? undefined : "3 4"}
            label={
              line.label
                ? {
                    value: line.label,
                    position: "insideBottomRight",
                    fill: line.color ?? "var(--color-muted-foreground)",
                    fontSize: 11,
                    fontWeight: 500,
                    stroke: "var(--color-card)",
                    strokeWidth: 4,
                    strokeLinejoin: "round",
                    paintOrder: "stroke",
                  }
                : undefined
            }
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
}

export { BarChart };
