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
import { Label, Pie, PieChart } from "recharts-analytics";

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

export interface DonutSlice {
  name: string;
  value: number;
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
}

export interface DonutChartProps extends Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
> {
  data: DonutSlice[];
  /** Inner radius as a fraction of the outer radius. 0 draws a pie. */
  innerRadius?: number;
  /** Label shown in the middle, under the value. */
  centerLabel?: React.ReactNode;
  /** Value shown in the middle. Defaults to the total. */
  centerValue?: React.ReactNode;
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showTooltip?: boolean;
  /** Angle where the first slice starts, in degrees. */
  startAngle?: number;
  /** Total sweep in degrees. 180 draws a half donut. */
  sweep?: number;
  paddingAngle?: number;
  /** Animate slices after hydration and when data changes. Respects reduced motion. */
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

function DonutChart({
  data,
  innerRadius = 0.7,
  centerLabel,
  centerValue,
  valueFormatter = (value) => formatNumber(value, { format: "compact" }),
  showLegend = false,
  showTooltip = true,
  startAngle = 90,
  sweep = 360,
  paddingAngle = 2,
  animate = true,
  animationDuration = 500,
  className,
  ...props
}: DonutChartProps) {
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  const slices = data.map((slice, index) => ({
    ...slice,
    key: slice.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    fill: slice.color ?? `var(--color-chart-${(index % 5) + 1})`,
  }));
  const config = Object.fromEntries(
    slices.map((slice) => [
      slice.key,
      { label: slice.name, color: slice.fill },
    ]),
  ) satisfies ChartConfig;
  const center = centerValue ?? valueFormatter(total);

  return (
    <ChartContainer
      data-slot="donut-chart"
      config={config}
      className={cn("mx-auto aspect-square w-full max-h-64", className)}
      {...props}
    >
      <PieChart>
        {showTooltip ? (
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                nameKey="key"
                formatter={(value, _name, item) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {item.payload.name}
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
        <Pie
          data={slices}
          dataKey="value"
          nameKey="key"
          innerRadius={`${innerRadius * 100}%`}
          outerRadius="100%"
          startAngle={startAngle}
          endAngle={startAngle - sweep}
          paddingAngle={paddingAngle}
          strokeWidth={0}
          cornerRadius={2}
          isAnimationActive={animate && !reducedMotion}
          animationDuration={animationDuration}
          animationEasing="ease-out"
        >
          {innerRadius > 0 && (center || centerLabel) ? (
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                  return null;
                const cx = Number(viewBox.cx);
                const cy = Number(viewBox.cy) + (sweep < 360 ? 12 : 0);
                return (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={cx}
                      y={cy}
                      className="fill-foreground text-2xl font-semibold tabular-nums"
                    >
                      {center}
                    </tspan>
                    {centerLabel ? (
                      <tspan
                        x={cx}
                        y={cy + 22}
                        className="fill-muted-foreground text-xs"
                      >
                        {centerLabel}
                      </tspan>
                    ) : null}
                  </text>
                );
              }}
            />
          ) : null}
        </Pie>
        {showLegend ? (
          <ChartLegend
            content={
              <ChartLegendContent
                nameKey="key"
                className="flex-wrap gap-x-4 gap-y-1"
              />
            }
          />
        ) : null}
      </PieChart>
    </ChartContainer>
  );
}

export { DonutChart };
