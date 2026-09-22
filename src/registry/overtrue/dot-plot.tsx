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

export interface DotPlotProps extends React.ComponentProps<"div"> {
  /** One value per column, in order. */
  data: number[];
  /** Optional label per column, shown in the tooltip and used for the accessible name. */
  labels?: string[];
  /** The value that fills a column. Defaults to the largest value in `data`. */
  max?: number;
  /** Number of dots in a full column. */
  rows?: number;
  /** Any CSS color. Defaults to chart-1. */
  color?: string;
  /**
   * Columns at or above this fraction of `max` are drawn at full strength and the
   * rest are faded, so the peak stands out. Set to 0 to draw every column at full strength.
   */
  emphasis?: number;
  /** Opacity of the faded columns. */
  fadedOpacity?: number;
  /** Show a tooltip with the column's label and value while it is hovered. */
  showTooltip?: boolean;
  /** Formats the value in the tooltip. Defaults to a plain grouped number. */
  valueFormatter?: (value: number) => string;
  /** Index of the hovered column, to control it from outside. */
  activeIndex?: number | null;
  /** Called when the hovered column changes, with null when the pointer leaves. */
  onActiveIndexChange?: (index: number | null) => void;
}

const defaultFormatter = (value: number) => value.toLocaleString("en-US");

/**
 * A distribution drawn as columns of stacked dots, with the peak columns at full strength.
 * Hovering a column lights it up, fades the others, and shows its value.
 */
function DotPlot({
  data,
  labels,
  max,
  rows = 6,
  color = "var(--color-chart-1)",
  emphasis = 0.5,
  fadedOpacity = 0.35,
  showTooltip = true,
  valueFormatter = defaultFormatter,
  activeIndex,
  onActiveIndexChange,
  className,
  ...props
}: DotPlotProps) {
  const [internal, setInternal] = React.useState<number | null>(null);
  const active = activeIndex === undefined ? internal : activeIndex;
  const setActive = (index: number | null) => {
    setInternal(index);
    onActiveIndexChange?.(index);
  };

  const top = max ?? Math.max(0, ...data);
  const peak = data.indexOf(Math.max(...data));
  const peakLabel = labels?.[peak];

  return (
    <div
      data-slot="dot-plot"
      role="img"
      aria-label={
        peakLabel !== undefined
          ? `Distribution across ${data.length} points, peaking at ${peakLabel}`
          : `Distribution across ${data.length} points`
      }
      onPointerLeave={() => setActive(null)}
      className={cn(
        // Dot size and gap are variables so they can be tuned from className, e.g. "[--dot-size:0.75rem]".
        "flex w-full justify-center [--dot-gap:0.25rem] [--dot-size:0.625rem]",
        className,
      )}
      {...props}
    >
      {data.map((value, index) => {
        const fraction = Math.min(1, Math.max(0, value / (top || 1)));
        // Any non-zero value shows at least one dot so small values still register.
        const count =
          fraction === 0 ? 0 : Math.max(1, Math.round(fraction * rows));
        const strong = emphasis <= 0 || fraction >= emphasis;
        // While a column is hovered it alone is lit; otherwise the emphasized columns are.
        const lit = active === null ? strong : active === index;
        const label = labels?.[index];
        return (
          <div
            key={index}
            data-slot="dot-plot-column"
            data-emphasis={strong}
            data-active={active === index}
            onPointerEnter={() => setActive(index)}
            // Columns stretch to the full height and carry the gap as padding, so the hover target has no dead zones.
            // They share the width equally and cap at the dot size, so dots shrink in narrow cards instead of overflowing.
            className="relative flex min-w-0 flex-1 cursor-default flex-col-reverse justify-start gap-(--dot-gap) px-[calc(var(--dot-gap)/2)] max-w-[calc(var(--dot-size)+var(--dot-gap))]"
          >
            {Array.from({ length: count }, (_, dot) => (
              <span
                key={dot}
                className="aspect-square w-full rounded-full transition-opacity"
                style={{
                  backgroundColor: color,
                  opacity: lit ? 1 : fadedOpacity,
                }}
              />
            ))}
            {showTooltip && active === index ? (
              <span
                role="tooltip"
                className="bg-popover text-popover-foreground pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 flex -translate-x-1/2 items-baseline gap-1.5 rounded-md border px-2 py-1 text-xs whitespace-nowrap shadow-md"
              >
                {label !== undefined ? (
                  <span className="text-muted-foreground">{label}</span>
                ) : null}
                <span className="font-medium tabular-nums">
                  {valueFormatter(value)}
                </span>
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export { DotPlot };
