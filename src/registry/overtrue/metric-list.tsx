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
import { type NumberFormat } from "./metric-format";
import { DeltaBadge, getDeltaDirection } from "./delta-badge";
import { Sparkline } from "./trend-sparkline";
import { MetricValue } from "./metric-value";

export interface MetricListItem {
  label: string;
  value: number | string;
  delta?: number;
  trend?: number[];
  format?: NumberFormat;
  currency?: string;
  invertDelta?: boolean;
  icon?: React.ReactNode;
  key?: string;
}

export interface MetricListProps extends React.ComponentProps<"div"> {
  items: MetricListItem[];
  /** Sparkline variant. */
  variant?: "area" | "line";
  /** Sparkline area fill. */
  fill?: "gradient" | "dots";
  showDivider?: boolean;
}

/** Compact rows of label, sparkline, value, and delta. */
function MetricList({
  items,
  variant = "line",
  fill,
  showDivider = true,
  className,
  ...props
}: MetricListProps) {
  return (
    <div
      data-slot="metric-list"
      className={cn("flex flex-col", showDivider && "divide-y", className)}
      {...props}
    >
      {items.map((item) => {
        const direction = getDeltaDirection(item.delta);
        const positive =
          direction === "flat"
            ? null
            : (direction === "up") !== Boolean(item.invertDelta);
        const color =
          positive === true
            ? "var(--color-emerald-500)"
            : positive === false
              ? "var(--color-red-500)"
              : "var(--color-muted-foreground)";
        return (
          <div
            key={item.key ?? item.label}
            data-slot="metric-list-row"
            className="flex items-center gap-4 py-2.5 text-sm first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {item.icon ? (
                <span className="text-muted-foreground shrink-0 [&>svg]:size-4">
                  {item.icon}
                </span>
              ) : null}
              <span className="truncate">{item.label}</span>
            </div>
            {item.trend && item.trend.length > 1 ? (
              <Sparkline
                data={item.trend}
                variant={variant}
                fill={fill}
                color={color}
                className="h-6 w-20 shrink-0"
              />
            ) : null}
            <div className="flex w-28 shrink-0 items-center justify-end gap-2 tabular-nums">
              <MetricValue
                value={item.value}
                format={item.format}
                currency={item.currency}
                className="font-medium"
              />
              {item.delta !== undefined ? (
                <DeltaBadge
                  delta={item.delta}
                  invert={item.invertDelta}
                  variant="text"
                  showIcon={false}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { MetricList };
