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
  Area,
  Bar,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts-analytics";

import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./analytics-chart";

export interface ComposedSeries {
  /** Key in each data row. */
  key: string;
  label: string;
  type?: "area" | "line" | "bar";
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
  /** Plot against the right axis. */
  axis?: "left" | "right";
  /** Series with the same stackId stack on top of each other. */
  stackId?: string;
  /** Bars only: fill with a diagonal hatch instead of a solid color. */
  pattern?: "solid" | "hatched";
  /** Lines and areas only. */
  dashed?: boolean;
  curve?: "monotone" | "linear" | "step";
  /** Lines only: draw a dot on every point. */
  dots?: boolean;
  /** Mark the highest point of this series with a dot. */
  highlightMax?: boolean;
}

export interface ReferenceLineSpec {
  /** Horizontal line at this y value. */
  y?: number;
  /** Vertical line at this x value. */
  x?: string | number;
  label?: string;
  /** Any CSS color. Defaults to the muted foreground. */
  color?: string;
  dashed?: boolean;
  axis?: "left" | "right";
}

export interface ComposedChartProps extends Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
> {
  data: Record<string, unknown>[];
  /** Key of the x-axis value in each row. */
  xKey: string;
  series: ComposedSeries[];
  referenceLines?: ReferenceLineSpec[];
  showGrid?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  xFormatter?: (value: unknown) => string;
  yFormatter?: (value: number) => string;
  rightYFormatter?: (value: number) => string;
  barRadius?: number;
  /** Animate series after hydration and when their data changes. Respects reduced motion. */
  animate?: boolean;
  animationDuration?: number;
  /** "zero" starts the y-axis at 0; "auto" fits it to the data. */
  yDomain?: "zero" | "auto" | [number, number];
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

/** The server snapshot disables motion so hydration starts from identical markup. */
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

function ComposedChart({
  data,
  xKey,
  series,
  referenceLines = [],
  showGrid = true,
  showYAxis = false,
  showLegend = false,
  showTooltip = true,
  xFormatter = defaultXFormatter,
  yFormatter,
  rightYFormatter,
  barRadius = 4,
  animate = true,
  animationDuration = 500,
  yDomain = "zero",
  className,
  ...props
}: ComposedChartProps) {
  const id = React.useId();
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const config = Object.fromEntries(
    series.map((s, index) => [
      s.key,
      {
        label: s.label,
        color: s.color ?? `var(--color-chart-${(index % 5) + 1})`,
      },
    ]),
  ) satisfies ChartConfig;
  const hasRightAxis = series.some((s) => s.axis === "right");
  const domain =
    yDomain === "auto"
      ? (["auto", "auto"] as const)
      : yDomain === "zero"
        ? undefined
        : yDomain;

  const maxPoints = series
    .filter((s) => s.highlightMax)
    .map((s) => {
      let best: { x: unknown; y: number } | null = null;
      for (const row of data) {
        const y = Number(row[s.key]);
        if (Number.isFinite(y) && (!best || y > best.y))
          best = { x: row[xKey], y };
      }
      return best ? { ...best, key: s.key, axis: s.axis ?? "left" } : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <ChartContainer
      data-slot="composed-chart"
      config={config}
      className={cn("aspect-auto h-64 w-full", className)}
      {...props}
    >
      <RechartsComposedChart
        data={data}
        margin={{
          top: 8,
          right: hasRightAxis ? 0 : 8,
          bottom: 0,
          left: showYAxis ? 0 : 8,
        }}
      >
        <defs>
          {series.map((s) => (
            <React.Fragment key={s.key}>
              <linearGradient
                id={`${id}-fill-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-${s.key})`}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${s.key})`}
                  stopOpacity={0.05}
                />
              </linearGradient>
              <pattern
                id={`${id}-hatch-${s.key}`}
                patternUnits="userSpaceOnUse"
                width={6}
                height={6}
                patternTransform="rotate(45)"
              >
                <rect
                  width={6}
                  height={6}
                  fill={`var(--color-${s.key})`}
                  fillOpacity={0.15}
                />
                <rect width={2} height={6} fill={`var(--color-${s.key})`} />
              </pattern>
            </React.Fragment>
          ))}
        </defs>
        {showGrid ? <CartesianGrid vertical={false} /> : null}
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={xFormatter}
        />
        <YAxis
          yAxisId="left"
          domain={domain}
          hide={!showYAxis}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={44}
          tickFormatter={yFormatter}
        />
        {hasRightAxis ? (
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={domain}
            hide={!showYAxis}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={44}
            tickFormatter={rightYFormatter ?? yFormatter}
          />
        ) : null}
        {showTooltip ? (
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dot"
                labelFormatter={(value) => xFormatter(value)}
                formatter={(value, name, item) => {
                  const s = series.find((entry) => entry.key === name);
                  const fmt =
                    s?.axis === "right"
                      ? (rightYFormatter ?? yFormatter)
                      : yFormatter;
                  return (
                    <div className="flex w-full items-center gap-2">
                      <span
                        className="size-2 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground flex-1">
                        {config[name as string]?.label ?? name}
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {fmt ? fmt(Number(value)) : String(value)}
                      </span>
                    </div>
                  );
                }}
              />
            }
          />
        ) : null}
        {showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null}
        {series.map((s) => {
          const color = `var(--color-${s.key})`;
          const common = {
            dataKey: s.key,
            yAxisId: s.axis ?? "left",
            stackId: s.stackId,
            isAnimationActive: animate && !reducedMotion,
            animationDuration,
            animationEasing: "ease-out" as const,
          };
          if (s.type === "bar") {
            return (
              <Bar
                key={s.key}
                {...common}
                fill={
                  s.pattern === "hatched" ? `url(#${id}-hatch-${s.key})` : color
                }
                stroke={s.pattern === "hatched" ? color : undefined}
                strokeWidth={s.pattern === "hatched" ? 1 : 0}
                radius={s.stackId ? 0 : barRadius}
              />
            );
          }
          if (s.type === "line") {
            return (
              <Line
                key={s.key}
                {...common}
                type={s.curve ?? "monotone"}
                stroke={color}
                strokeWidth={2}
                strokeDasharray={s.dashed ? "4 4" : undefined}
                dot={s.dots ? { r: 3, fill: color, strokeWidth: 0 } : false}
                activeDot={{ r: 4 }}
              />
            );
          }
          return (
            <Area
              key={s.key}
              {...common}
              type={s.curve ?? "monotone"}
              stroke={color}
              strokeWidth={2}
              strokeDasharray={s.dashed ? "4 4" : undefined}
              fill={`url(#${id}-fill-${s.key})`}
              dot={false}
            />
          );
        })}
        {referenceLines.map((line, index) => (
          <ReferenceLine
            key={index}
            y={line.y}
            x={line.x}
            yAxisId={line.axis ?? "left"}
            stroke={line.color ?? "var(--color-muted-foreground)"}
            strokeDasharray={line.dashed === false ? undefined : "4 4"}
            label={
              line.label
                ? {
                    value: line.label,
                    position:
                      line.y !== undefined ? "insideTopRight" : "insideTopLeft",
                    fill: line.color ?? "var(--color-muted-foreground)",
                    fontSize: 11,
                  }
                : undefined
            }
          />
        ))}
        {maxPoints.map((point) => (
          <ReferenceDot
            key={point.key}
            x={point.x as string | number}
            y={point.y}
            yAxisId={point.axis}
            r={4}
            fill={`var(--color-${point.key})`}
            stroke="var(--color-background)"
            strokeWidth={2}
          />
        ))}
      </RechartsComposedChart>
    </ChartContainer>
  );
}

export { ComposedChart };
