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
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
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

export interface RadarSeries {
  /** Key in each data row. */
  key: string;
  label: string;
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
}

export interface RadarChartProps extends Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
> {
  data: Record<string, unknown>[];
  /** Key of the category label in each row, one per spoke. */
  angleKey: string;
  series: RadarSeries[];
  /** "filled" shades the area, "line" draws only the outline, "dots" adds a dot at every vertex. */
  variant?: "filled" | "line" | "dots";
  /** Shape of the background grid rings. */
  grid?: "polygon" | "circle" | "none";
  /** Show the category label at the end of each spoke. */
  showAngleLabels?: boolean;
  /** Show value ticks along the vertical spoke. */
  showRadiusAxis?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  /** Recharts domain for the value axis, e.g. [0, 100]. Defaults to [0, "auto"]. */
  domain?: React.ComponentProps<typeof PolarRadiusAxis>["domain"];
  valueFormatter?: (value: number) => string;
  /** Animate polygons after hydration and when data changes. Respects reduced motion. */
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

/** A radar chart on shadcn's chart primitives: filled, outlined, or dotted, with one polygon per series. */
function RadarChart({
  data,
  angleKey,
  series,
  variant = "filled",
  grid = "polygon",
  showAngleLabels = true,
  showRadiusAxis = false,
  showLegend = false,
  showTooltip = true,
  domain,
  valueFormatter = (value) => formatNumber(value, { format: "compact" }),
  animate = true,
  animationDuration = 500,
  className,
  ...props
}: RadarChartProps) {
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

  return (
    <ChartContainer
      data-slot="radar-chart"
      config={config}
      className={cn("aspect-auto h-64 w-full", className)}
      {...props}
    >
      <RechartsRadarChart
        data={data}
        margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
      >
        {grid !== "none" ? <PolarGrid gridType={grid} /> : null}
        <PolarAngleAxis
          dataKey={angleKey}
          tickLine={false}
          axisLine={false}
          tick={
            showAngleLabels ? { fill: "var(--color-muted-foreground)" } : false
          }
        />
        <PolarRadiusAxis
          angle={90}
          domain={domain}
          axisLine={false}
          tick={
            showRadiusAxis ? { fill: "var(--color-muted-foreground)" } : false
          }
          tickFormatter={valueFormatter}
        />
        {showTooltip ? (
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dot"
                formatter={(value, name, item) => (
                  <div className="flex w-full items-center gap-2">
                    <span
                      className="size-2 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground flex-1">
                      {config[name as string]?.label ?? name}
                    </span>
                    <span className="font-mono font-medium tabular-nums">
                      {valueFormatter(Number(value))}
                    </span>
                  </div>
                )}
              />
            }
          />
        ) : null}
        {showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null}
        {series.map((s) => {
          const color = `var(--color-${s.key})`;
          return (
            <Radar
              key={s.key}
              dataKey={s.key}
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={variant === "filled" ? 0.25 : 0}
              dot={
                variant === "dots"
                  ? { r: 3, fill: color, strokeWidth: 0 }
                  : false
              }
              activeDot={{
                r: 4,
                fill: color,
                stroke: "var(--color-background)",
                strokeWidth: 2,
              }}
              isAnimationActive={animate && !reducedMotion}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          );
        })}
      </RechartsRadarChart>
    </ChartContainer>
  );
}

export { RadarChart };
