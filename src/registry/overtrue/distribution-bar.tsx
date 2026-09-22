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
import * as React from "react";

import { cn } from "@/lib/utils";
import { formatNumber } from "./metric-format";

export interface DistributionSegment {
  name: string;
  value: number;
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
}

export interface DistributionBarProps extends React.ComponentProps<"div"> {
  segments: DistributionSegment[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  /** Show absolute values in the legend in addition to the share. */
  showValues?: boolean;
}

const defaultColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function DistributionBar({
  segments,
  valueFormatter = (value) => formatNumber(value, { format: "compact" }),
  showLegend = true,
  showValues = false,
  className,
  ...props
}: DistributionBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const resolved = segments.map((segment, index) => ({
    ...segment,
    color: segment.color ?? defaultColors[index % defaultColors.length],
    share: total > 0 ? segment.value / total : 0,
  }));

  return (
    <div
      data-slot="distribution-bar"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <div
        role="img"
        aria-label={resolved
          .map(
            (segment) =>
              `${segment.name} ${formatNumber(segment.share, { format: "percent" })}`,
          )
          .join(", ")}
        className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full"
      >
        {resolved.map((segment) =>
          segment.share > 0 ? (
            <div
              key={segment.name}
              className="h-full transition-[width] duration-300 first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${segment.share * 100}%`,
                backgroundColor: segment.color,
              }}
            />
          ) : null,
        )}
      </div>
      {showLegend ? (
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
          {resolved.map((segment) => (
            <li key={segment.name} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-muted-foreground">{segment.name}</span>
              <span className="font-medium tabular-nums">
                {formatNumber(segment.share, { format: "percent" })}
              </span>
              {showValues ? (
                <span className="text-muted-foreground tabular-nums">
                  ({valueFormatter(segment.value)})
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export { DistributionBar };
