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
  CartesianGrid,
  Scatter,
  ScatterChart as RechartsScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts-analytics";

import { cn } from "@/lib/utils";
import { formatNumber } from "./metric-format";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./analytics-chart";

export interface ScatterSeries {
  /** Stable identifier. Defaults to a slug of the label. */
  key?: string;
  label: string;
  /** Rows for this series. Each needs the x and y keys, plus the size and name keys when set. */
  data: Record<string, unknown>[];
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
}

export interface ScatterChartProps extends Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
> {
  series: ScatterSeries[];
  /** Key of the x value in each row. */
  xKey: string;
  /** Key of the y value in each row. */
  yKey: string;
  /** Key of a value that scales each point into a bubble. */
  sizeKey?: string;
  /** Key of a per-point label shown as the tooltip title. */
  nameKey?: string;
  /** Names for the tooltip rows. Default to the keys. */
  xLabel?: string;
  yLabel?: string;
  sizeLabel?: string;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  xFormatter?: (value: number) => string;
  yFormatter?: (value: number) => string;
  sizeFormatter?: (value: number) => string;
  /** Radius of each point in px when sizeKey is not set. */
  dotRadius?: number;
  /** Bubble area range in px² when sizeKey is set, smallest to largest. */
  sizeRange?: [number, number];
  /** Recharts domain for the x-axis, e.g. ["auto", "auto"]. Defaults to [0, "auto"]. */
  xDomain?: React.ComponentProps<typeof XAxis>["domain"];
  /** Recharts domain for the y-axis, e.g. ["auto", "auto"]. Defaults to [0, "auto"]. */
  yDomain?: React.ComponentProps<typeof YAxis>["domain"];
  /** Animate points after hydration and when data changes. Respects reduced motion. */
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

/** Hidden key stamped onto each row so the tooltip can find the point's series. */
const SERIES_KEY = "__scatterSeries";

function slug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

interface ScatterTooltipContentProps extends Pick<
  React.ComponentProps<typeof ChartTooltipContent>,
  "active" | "payload"
> {
  config: ChartConfig;
  rows: { key: string; label: string; format: (value: number) => string }[];
  nameKey?: string;
}

function ScatterTooltipContent({
  active,
  payload,
  config,
  rows,
  nameKey,
}: ScatterTooltipContentProps) {
  const point = payload?.[0]?.payload as Record<string, unknown> | undefined;
  if (!active || !point) return null;
  const seriesKey = String(point[SERIES_KEY] ?? "");
  const seriesLabel = config[seriesKey]?.label ?? seriesKey;
  const name = nameKey ? point[nameKey] : undefined;
  const title = name != null ? String(name) : seriesLabel;

  return (
    <div className="grid min-w-[8rem] gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="flex items-center gap-2 font-medium">
        <span
          className="size-2 shrink-0 rounded-[2px]"
          style={{ backgroundColor: `var(--color-${seriesKey})` }}
        />
        <span className="flex-1">{title}</span>
        {name != null ? (
          <span className="text-muted-foreground font-normal">
            {seriesLabel}
          </span>
        ) : null}
      </div>
      <div className="grid gap-1">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-mono font-medium tabular-nums">
              {row.format(Number(point[row.key]))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** A scatter chart on shadcn's chart primitives: correlation dots per series, or bubbles when a size key is set. */
function ScatterChart({
  series,
  xKey,
  yKey,
  sizeKey,
  nameKey,
  xLabel,
  yLabel,
  sizeLabel,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  showTooltip = true,
  xFormatter = (value) => formatNumber(value, { format: "compact" }),
  yFormatter = (value) => formatNumber(value, { format: "compact" }),
  sizeFormatter = (value) => formatNumber(value, { format: "compact" }),
  dotRadius = 4,
  sizeRange = [40, 400],
  xDomain,
  yDomain,
  animate = true,
  animationDuration = 500,
  className,
  ...props
}: ScatterChartProps) {
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const resolved = React.useMemo(
    () =>
      series.map((s, index) => {
        const key = s.key ?? slug(s.label);
        return {
          key,
          label: s.label,
          color: s.color ?? `var(--color-chart-${(index % 5) + 1})`,
          data: s.data.map((row) => ({ ...row, [SERIES_KEY]: key })),
        };
      }),
    [series],
  );
  const config = Object.fromEntries(
    resolved.map((s) => [s.key, { label: s.label, color: s.color }]),
  ) satisfies ChartConfig;
  const rows = [
    { key: xKey, label: xLabel ?? xKey, format: xFormatter },
    { key: yKey, label: yLabel ?? yKey, format: yFormatter },
    ...(sizeKey
      ? [{ key: sizeKey, label: sizeLabel ?? sizeKey, format: sizeFormatter }]
      : []),
  ];
  // Recharts sizes symbols by area, so a fixed radius becomes a fixed area.
  const dotArea = Math.round(Math.PI * dotRadius * dotRadius);

  return (
    <ChartContainer
      data-slot="scatter-chart"
      config={config}
      className={cn("aspect-auto h-64 w-full", className)}
      {...props}
    >
      <RechartsScatterChart
        margin={{ top: 12, right: 12, bottom: 0, left: showYAxis ? 0 : 8 }}
      >
        {showGrid ? <CartesianGrid /> : null}
        <XAxis
          type="number"
          dataKey={xKey}
          hide={!showXAxis}
          domain={xDomain}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={xFormatter}
        />
        <YAxis
          type="number"
          dataKey={yKey}
          hide={!showYAxis}
          domain={yDomain}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width="auto"
          tickFormatter={yFormatter}
        />
        {sizeKey ? (
          <ZAxis type="number" dataKey={sizeKey} range={sizeRange} />
        ) : (
          <ZAxis type="number" range={[dotArea, dotArea]} />
        )}
        {showTooltip ? (
          <ChartTooltip
            cursor={false}
            content={
              <ScatterTooltipContent
                config={config}
                rows={rows}
                nameKey={nameKey}
              />
            }
          />
        ) : null}
        {showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null}
        {resolved.map((s) => {
          const color = `var(--color-${s.key})`;
          return (
            <Scatter
              key={s.key}
              name={s.key}
              data={s.data}
              fill={color}
              fillOpacity={0.35}
              stroke={color}
              strokeWidth={1.5}
              isAnimationActive={animate && !reducedMotion}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          );
        })}
      </RechartsScatterChart>
    </ChartContainer>
  );
}

export { ScatterChart };
