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

export interface BarListItem {
  name: string;
  value: number;
  /** Renders the label as a link. */
  href?: string;
  icon?: React.ReactNode;
  /** Stable key when names can repeat. */
  key?: string;
}

export interface BarListProps extends React.ComponentProps<"div"> {
  data: BarListItem[];
  valueFormatter?: (value: number) => string;
  sortOrder?: "descending" | "ascending" | "none";
  /** Any CSS color. Defaults to chart-1. */
  color?: string;
  /** Show each row's share of the total next to its value. */
  showPercentage?: boolean;
  onItemClick?: (item: BarListItem) => void;
}

function BarList({
  data,
  valueFormatter = (value) => formatNumber(value, { format: "compact" }),
  sortOrder = "descending",
  color = "var(--color-chart-1)",
  showPercentage = false,
  onItemClick,
  className,
  ...props
}: BarListProps) {
  const items = React.useMemo(() => {
    if (sortOrder === "none") return data;
    const sorted = [...data].sort((a, b) => a.value - b.value);
    return sortOrder === "descending" ? sorted.reverse() : sorted;
  }, [data, sortOrder]);
  const max = Math.max(...items.map((item) => item.value), 0);
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      data-slot="bar-list"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      {items.map((item) => {
        const width = max > 0 ? (item.value / max) * 100 : 0;
        const share = total > 0 ? item.value / total : 0;
        const interactive = Boolean(item.href || onItemClick);
        const Label = item.href ? "a" : onItemClick ? "button" : "div";

        return (
          <div
            key={item.key ?? item.name}
            data-slot="bar-list-row"
            className="flex items-center gap-3 text-sm"
          >
            <div className="relative flex h-8 min-w-0 flex-1 items-center">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 rounded-md transition-[width] duration-300"
                style={{
                  width: `${width}%`,
                  backgroundColor: `color-mix(in oklab, ${color} 20%, transparent)`,
                }}
              />
              <Label
                {...(item.href ? { href: item.href } : {})}
                {...(onItemClick && !item.href
                  ? {
                      type: "button" as const,
                      onClick: () => onItemClick(item),
                    }
                  : {})}
                className={cn(
                  "relative flex min-w-0 items-center gap-2 px-2 text-left",
                  interactive && "hover:underline",
                )}
              >
                {item.icon ? (
                  <span className="text-muted-foreground shrink-0 [&>svg]:size-4">
                    {item.icon}
                  </span>
                ) : null}
                <span className="truncate">{item.name}</span>
              </Label>
            </div>
            <div className="flex shrink-0 items-center gap-2 tabular-nums">
              <span className="font-medium">{valueFormatter(item.value)}</span>
              {showPercentage ? (
                <span className="text-muted-foreground w-12 text-right text-xs">
                  {formatNumber(share, { format: "percent" })}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { BarList };
