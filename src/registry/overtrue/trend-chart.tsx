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
  AreaChart,
  AreaRevealShape,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
  type AreaRevealShapeProps,
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

export interface TrendSeries {
  /** Key in each data row. */
  key: string;
  label: string;
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
}

export interface TrendChartProps extends Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
> {
  data: Record<string, unknown>[];
  /** Key of the x-axis value in each row. */
  xKey: string;
  series: TrendSeries[];
  type?: "area" | "line" | "bar";
  /** Area fill: a plain gradient, or a dot grid that fades out toward the line. */
  fill?: "gradient" | "dots";
  /** Bars only: "horizontal" runs bars left to right with categories down the side. */
  layout?: "vertical" | "horizontal";
  /** Bars only: corner radius in px, or "full" for pill-shaped bars. */
  barRadius?: number | "full";
  /** Bars only: thickness of each bar in px. Defaults to a share of the category width. */
  barSize?: number;
  stacked?: boolean;
  showLegend?: boolean;
  legendPosition?: "top" | "bottom";
  legendAlign?: "left" | "center" | "right";
  showGrid?: boolean;
  /** Show the value axis. In the horizontal layout this is the axis along the bottom. */
  showYAxis?: boolean;
  /** Recharts domain for the value axis, e.g. ["dataMin", "dataMax"] or ["auto", "auto"]. Defaults to [0, "auto"]. */
  yDomain?: React.ComponentProps<typeof YAxis>["domain"];
  xFormatter?: (value: unknown) => string;
  yFormatter?: (value: number) => string;
  /** Animate series after hydration and when data changes. Respects reduced motion. */
  animate?: boolean;
  animationDuration?: number;
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

/** Area shape that masks the fill to a dot grid while keeping the stroke solid. */
function DotGridAreaShape({
  maskId,
  ...props
}: AreaRevealShapeProps & { maskId: string }) {
  return (
    <>
      <g mask={`url(#${maskId})`}>
        <AreaRevealShape {...props} stroke="none" />
      </g>
      <AreaRevealShape {...props} id={undefined} fill="none" />
    </>
  );
}

/** Recharts clamps corner radii to half the bar, so an oversized radius draws a pill. */
const PILL = 9999;

type Radius = number | [number, number, number, number];

/** Round only the outer corners of a stack; mixed-sign stacks stay square. */
function barCorners(
  radius: number | "full",
  stacked: boolean,
  hasNegative: boolean,
  horizontal: boolean,
  index: number,
  count: number,
): Radius {
  const r = radius === "full" ? PILL : radius;
  if (!stacked || count === 1) return r;
  if (hasNegative) return 0;
  // Corners run [top-left, top-right, bottom-right, bottom-left].
  if (index === count - 1) return horizontal ? [0, r, r, 0] : [r, r, 0, 0];
  if (index === 0) return horizontal ? [r, 0, 0, r] : [0, 0, r, r];
  return 0;
}

function TrendChart({
  data,
  xKey,
  series,
  type = "area",
  fill = "gradient",
  layout = "vertical",
  barRadius = 4,
  barSize,
  stacked = false,
  showLegend = false,
  legendPosition = "bottom",
  legendAlign = "center",
  showGrid = true,
  showYAxis = false,
  yDomain,
  xFormatter = defaultXFormatter,
  yFormatter,
  animate = true,
  animationDuration = 500,
  className,
  ...props
}: TrendChartProps) {
  const id = React.useId();
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const animationProps = {
    isAnimationActive: animate && !reducedMotion,
    animationDuration,
    animationEasing: "ease-out" as const,
  };
  const dots = type === "area" && fill === "dots";
  const horizontal = type === "bar" && layout === "horizontal";
  const hasNegative = React.useMemo(
    () =>
      data.some((row) =>
        series.some((s) => {
          const v = row[s.key];
          return typeof v === "number" && v < 0;
        }),
      ),
    [data, series],
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

  const axes = (
    <>
      {showGrid ? (
        <CartesianGrid vertical={horizontal} horizontal={!horizontal} />
      ) : null}
      {horizontal ? (
        <>
          <XAxis
            type="number"
            hide={!showYAxis}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={yDomain}
            tickFormatter={yFormatter}
          />
          <YAxis
            type="category"
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width="auto"
            tickFormatter={xFormatter}
          />
        </>
      ) : (
        <>
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={xFormatter}
          />
          {showYAxis ? (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width="auto"
              domain={yDomain}
              tickFormatter={yFormatter}
            />
          ) : yDomain ? (
            <YAxis hide domain={yDomain} />
          ) : null}
        </>
      )}
      {hasNegative ? (
        <ReferenceLine
          {...(horizontal ? { x: 0 } : { y: 0 })}
          stroke="var(--color-border)"
          strokeWidth={1}
        />
      ) : null}
      <ChartTooltip
        cursor={false}
        content={
          <ChartTooltipContent
            indicator={type === "bar" ? "dashed" : "dot"}
            labelFormatter={(value) => xFormatter(value)}
            formatter={
              yFormatter
                ? (value, name) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {config[name as string]?.label ?? name}
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {yFormatter(Number(value))}
                      </span>
                    </div>
                  )
                : undefined
            }
          />
        }
      />
      {showLegend ? (
        <ChartLegend
          verticalAlign={legendPosition}
          align={legendAlign}
          content={
            <ChartLegendContent
              className={
                legendAlign === "right"
                  ? "justify-end"
                  : legendAlign === "left"
                    ? "justify-start"
                    : undefined
              }
            />
          }
        />
      ) : null}
    </>
  );

  const margin = {
    top: 8,
    right: 8,
    bottom: 0,
    left: showYAxis || horizontal ? 0 : 8,
  };

  return (
    <ChartContainer
      data-slot="trend-chart"
      config={config}
      className={cn("aspect-auto h-64 w-full", className)}
      {...props}
    >
      {type === "bar" ? (
        <BarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={margin}
          stackOffset={stacked ? "sign" : "none"}
        >
          {axes}
          {series.map((s, index) => (
            <Bar
              key={s.key}
              {...animationProps}
              dataKey={s.key}
              fill={`var(--color-${s.key})`}
              barSize={barSize}
              radius={barCorners(
                barRadius,
                stacked,
                hasNegative,
                horizontal,
                index,
                series.length,
              )}
              stackId={stacked ? "stack" : undefined}
            />
          ))}
        </BarChart>
      ) : type === "line" ? (
        <LineChart data={data} margin={margin}>
          {axes}
          {series.map((s) => (
            <Line
              key={s.key}
              {...animationProps}
              type="monotone"
              dataKey={s.key}
              stroke={`var(--color-${s.key})`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      ) : (
        <AreaChart
          data={data}
          margin={margin}
          stackOffset={stacked ? "sign" : "none"}
        >
          <defs>
            {series.map((s) => (
              <linearGradient
                key={s.key}
                id={`${id}-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-${s.key})`}
                  stopOpacity={dots ? 0.08 : 0.6}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${s.key})`}
                  stopOpacity={dots ? 0.9 : 0.05}
                />
              </linearGradient>
            ))}
            {dots ? (
              <>
                <pattern
                  id={`${id}-dots`}
                  patternUnits="userSpaceOnUse"
                  width={6}
                  height={6}
                >
                  <circle cx={3} cy={3} r={1.25} fill="#fff" />
                </pattern>
                <mask
                  id={`${id}-mask`}
                  maskUnits="userSpaceOnUse"
                  x={0}
                  y={0}
                  width="100%"
                  height="100%"
                >
                  <rect width="100%" height="100%" fill={`url(#${id}-dots)`} />
                </mask>
              </>
            ) : null}
          </defs>
          {axes}
          {series.map((s) => (
            <Area
              key={s.key}
              {...animationProps}
              type="monotone"
              dataKey={s.key}
              stroke={`var(--color-${s.key})`}
              fill={`url(#${id}-${s.key})`}
              fillOpacity={dots ? 1 : undefined}
              strokeWidth={2}
              stackId={stacked ? "stack" : undefined}
              shape={
                dots
                  ? (shapeProps: AreaRevealShapeProps) => (
                      <DotGridAreaShape {...shapeProps} maskId={`${id}-mask`} />
                    )
                  : undefined
              }
            />
          ))}
        </AreaChart>
      )}
    </ChartContainer>
  );
}

export { TrendChart };
