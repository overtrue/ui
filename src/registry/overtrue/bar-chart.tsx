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
  Cell,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
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

interface ShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
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
  const id = React.useId();
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
  const fillFor = (index: number) =>
    `url(#${id}-${isHighlighted(index) ? "on" : "off"})`;

  const activeBar = (shape: ShapeProps) => {
    const { x = 0, y = 0, width = 0, height = 0, index = 0 } = shape;
    const on = isHighlighted(index);
    return (
      <g>
        <Rectangle {...shape} fill={fillFor(index)} />
        {showActiveMarker && height > 0 ? (
          <circle
            cx={x + width / 2}
            cy={y}
            r={4}
            fill="var(--color-background)"
            stroke={on ? color : mutedColor}
            strokeWidth={2}
          />
        ) : null}
      </g>
    );
  };

  return (
    <ChartContainer
      data-slot="bar-chart"
      config={{ [yKey]: { label: yKey, color } }}
      className={cn("aspect-auto h-64 w-full", className)}
      {...props}
    >
      <RechartsBarChart
        data={data}
        margin={{ top: 12, right: 8, bottom: 0, left: showYAxis ? 0 : 8 }}
        barCategoryGap="28%"
      >
        <defs>
          {variant === "gradient" ? (
            <>
              <linearGradient id={`${id}-on`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id={`${id}-off`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={mutedColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={mutedColor} stopOpacity={0.18} />
              </linearGradient>
            </>
          ) : variant === "striped" ? (
            <>
              {(["on", "off"] as const).map((state) => {
                const fill = state === "on" ? color : mutedColor;
                const opacity = state === "on" ? 1 : 0.3;
                return (
                  <pattern
                    key={state}
                    id={`${id}-${state}`}
                    patternUnits="userSpaceOnUse"
                    width={10}
                    height={10}
                    patternTransform="rotate(45)"
                  >
                    <rect
                      width={10}
                      height={10}
                      fill={fill}
                      fillOpacity={opacity}
                    />
                    <rect
                      width={5}
                      height={10}
                      fill="var(--color-background)"
                      fillOpacity={0.25}
                    />
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
            strokeDasharray={grid === "dashed" ? "6 6" : undefined}
          />
        ) : null}
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
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
          width={44}
          tickFormatter={yFormatter}
        />
        {showTooltip ? (
          <ChartTooltip
            cursor={false}
            isAnimationActive={false}
            content={({ active, payload }) => {
              const entry = payload?.[0];
              if (!active || !entry) return null;
              const row = entry.payload as BarRow;
              const index = data.indexOf(row);
              const value = Number(row[yKey]);
              return (
                <div className="bg-background rounded-lg border px-3 py-2 text-xs shadow-md">
                  <div className="text-sm font-semibold tabular-nums">
                    {yFormatter ? yFormatter(value) : String(value)}
                  </div>
                  <div className="text-muted-foreground">
                    {tooltipLabel
                      ? tooltipLabel(row, index)
                      : xFormatter(row[xKey])}
                  </div>
                </div>
              );
            }}
          />
        ) : null}
        <Bar
          dataKey={yKey}
          radius={barRadius}
          isAnimationActive={animate && !reducedMotion}
          animationDuration={animationDuration}
          animationEasing="ease-out"
          activeBar={activeBar}
          onClick={
            onBarClick
              ? (_, index) => onBarClick(data[index]!, index)
              : undefined
          }
          className={onBarClick ? "cursor-pointer" : undefined}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={fillFor(index)} />
          ))}
        </Bar>
        {referenceLines.map((line, index) => (
          <ReferenceLine
            key={index}
            y={line.y}
            ifOverflow="extendDomain"
            stroke={line.color ?? "var(--color-muted-foreground)"}
            strokeDasharray={line.dashed === false ? undefined : "4 4"}
            label={
              line.label
                ? {
                    value: line.label,
                    position: "insideTopRight",
                    fill: line.color ?? "var(--color-muted-foreground)",
                    fontSize: 11,
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
