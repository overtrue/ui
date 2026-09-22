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
import { formatNumber } from "./metric-format";

export interface MeterZone {
  label?: string;
  from: number;
  to: number;
  /** Any CSS color. Defaults to chart-1. */
  color?: string;
}

export interface SegmentedMeterProps extends React.ComponentProps<"div"> {
  value: number;
  zones: MeterZone[];
  /** Only color the zone that contains the value; others stay muted. */
  highlightActive?: boolean;
  /** Show zone boundary values under the bar. */
  showTicks?: boolean;
  /** Show zone labels under the bar. */
  showLabels?: boolean;
  /** Show a marker at the current value. */
  showMarker?: boolean;
  tickFormatter?: (value: number) => string;
}

function SegmentedMeter({
  value,
  zones,
  highlightActive = true,
  showTicks = true,
  showLabels = false,
  showMarker = true,
  tickFormatter = (v) => formatNumber(v),
  className,
  ...props
}: SegmentedMeterProps) {
  const ticksRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const container = ticksRef.current;
    if (!container || !showTicks) return;
    const labels = Array.from(container.children) as HTMLElement[];
    const measure = () => {
      const last = labels.at(-1)?.getBoundingClientRect();
      let right = -Infinity;
      labels.forEach((label, index) => {
        const rect = label.getBoundingClientRect();
        const endpoint = index === 0 || index === labels.length - 1;
        const fits = rect.left >= right + 8 && (!last || rect.right + 8 <= last.left);
        label.style.visibility = endpoint || fits ? "visible" : "hidden";
        if (endpoint || fits) right = rect.right;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    labels.forEach((label) => observer.observe(label));
    return () => observer.disconnect();
  }, [showTicks, zones, tickFormatter]);
  const validZones = zones.filter(
    (zone) => Number.isFinite(zone.from) && Number.isFinite(zone.to) && zone.to > zone.from,
  );
  if (!validZones.length) {
    return (
      <div data-slot="segmented-meter" className={cn("flex flex-col gap-1.5", className)} {...props}>
        <p className="text-sm text-muted-foreground">No ranges available.</p>
      </div>
    );
  }
  const min = Math.min(...validZones.map((z) => z.from));
  const max = Math.max(...validZones.map((z) => z.to));
  const span = max - min || 1;
  const current = Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
  const position = (current - min) / span;
  const activeIndex = validZones.findIndex(
    (z, i) =>
      current >= z.from &&
      (current < z.to || (i === validZones.length - 1 && current <= z.to)),
  );

  return (
    <div
      data-slot="segmented-meter"
      role="meter"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={current}
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      <div className="relative">
        <div className="flex h-2 w-full gap-0.5">
          {validZones.map((zone, index) => {
            const active = index === activeIndex;
            const color = zone.color ?? "var(--color-chart-1)";
            return (
              <div
                key={index}
                data-active={active}
                className="bg-muted h-full rounded-sm transition-colors first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${((zone.to - zone.from) / span) * 100}%`,
                  backgroundColor:
                    !highlightActive || active ? color : undefined,
                }}
              />
            );
          })}
        </div>
        {showMarker ? (
          <div
            aria-hidden="true"
            className="bg-foreground ring-background absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2"
            style={{ left: `${position * 100}%` }}
          />
        ) : null}
      </div>
      {showTicks || showLabels ? (
        <div ref={ticksRef} className="text-muted-foreground relative h-4 text-[10px] tabular-nums">
          {showTicks
            ? [min, ...validZones.map((z) => z.to)].map((tick, index, all) => (
                <span
                  key={index}
                  className={cn(
                    "absolute top-0",
                    index === 0 && "left-0",
                    index === all.length - 1 && "right-0",
                    index > 0 && index < all.length - 1 && "-translate-x-1/2",
                  )}
                  style={
                    index > 0 && index < all.length - 1
                      ? { left: `${((tick - min) / span) * 100}%` }
                      : undefined
                  }
                >
                  {tickFormatter(tick)}
                </span>
              ))
            : validZones.map((zone, index) => (
                <span
                  key={index}
                  className="absolute top-0 -translate-x-1/2 truncate"
                  style={{
                    left: `${(((zone.from + zone.to) / 2 - min) / span) * 100}%`,
                  }}
                >
                  {zone.label}
                </span>
              ))}
        </div>
      ) : null}
    </div>
  );
}

export { SegmentedMeter };
