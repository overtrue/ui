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
  style,
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
        const fits =
          rect.left >= right + 8 && (!last || rect.right + 8 <= last.left);
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
    (zone) =>
      Number.isFinite(zone.from) &&
      Number.isFinite(zone.to) &&
      zone.to > zone.from,
  );
  if (!validZones.length) {
    return (
      <div
        data-slot="segmented-meter"
        className={cn("flex flex-col gap-1.5", className)}
        style={style}
        {...props}
      >
        <p className="text-sm text-muted-foreground">No ranges available.</p>
      </div>
    );
  }
  const min = Math.min(...validZones.map((z) => z.from));
  const max = Math.max(...validZones.map((z) => z.to));
  const span = max - min || 1;
  const current = Math.min(
    max,
    Math.max(min, Number.isFinite(value) ? value : min),
  );
  const position = (current - min) / span;
  const activeIndex = validZones.findIndex(
    (z, i) =>
      current >= z.from &&
      (current < z.to || (i === validZones.length - 1 && current <= z.to)),
  );

  const activeColor =
    activeIndex >= 0
      ? (validZones[activeIndex].color ?? "var(--color-chart-1)")
      : "var(--color-foreground)";
  const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <div
      data-slot="segmented-meter"
      role="meter"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={current}
      aria-valuetext={
        activeIndex >= 0 && validZones[activeIndex].label
          ? `${tickFormatter(current)}, ${validZones[activeIndex].label}`
          : undefined
      }
      className={cn("flex flex-col gap-2", className)}
      style={
        {
          ...style,
          "--meter-active": activeColor,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative">
        <div
          data-slot="segmented-meter-track"
          className="flex h-2 w-full gap-[3px]"
        >
          {validZones.map((zone, index) => {
            const active = index === activeIndex;
            const color = zone.color ?? "var(--color-chart-1)";
            const lit = !highlightActive || active;
            return (
              <div
                key={index}
                data-slot="segmented-meter-zone"
                data-active={active}
                className={cn(
                  "h-full min-w-0 origin-left rounded-full transition-[background,box-shadow,scale] duration-500 starting:scale-x-0 motion-reduce:transition-none",
                  ease,
                  lit &&
                    "dark:shadow-[0_0_12px_-2px_color-mix(in_oklab,var(--zone-color)_70%,transparent)]",
                )}
                style={
                  {
                    "--zone-color": color,
                    width: `${((zone.to - zone.from) / span) * 100}%`,
                    background: lit
                      ? "linear-gradient(90deg, color-mix(in oklab, var(--zone-color) 72%, transparent), var(--zone-color))"
                      : "color-mix(in oklab, var(--zone-color) 16%, color-mix(in oklab, var(--color-foreground) 6%, transparent))",
                    transitionDelay: `${index * 50}ms`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>
        {showMarker ? (
          <div
            aria-hidden="true"
            data-slot="segmented-meter-marker"
            className={cn(
              "absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-(--meter-active) bg-card shadow-[0_0_0_3px_color-mix(in_oklab,var(--meter-active)_20%,transparent),0_1px_3px_rgb(0_0_0/0.18)] [transition:left_500ms_cubic-bezier(0.22,1,0.36,1),border-color_300ms,box-shadow_300ms,opacity_300ms_ease-out_250ms,scale_500ms_cubic-bezier(0.22,1,0.36,1)_250ms] starting:scale-50 starting:opacity-0 motion-reduce:transition-none dark:shadow-[0_0_0_3px_color-mix(in_oklab,var(--meter-active)_26%,transparent),0_0_12px_color-mix(in_oklab,var(--meter-active)_60%,transparent)]",
            )}
            style={{ left: `${position * 100}%` }}
          />
        ) : null}
      </div>
      {showTicks || showLabels ? (
        <div
          ref={ticksRef}
          data-slot="segmented-meter-scale"
          className="relative h-4 text-[11px] leading-4 text-muted-foreground tabular-nums"
        >
          {showTicks
            ? [min, ...validZones.map((z) => z.to)].map((tick, index, all) => (
                <span
                  key={index}
                  className={cn(
                    "absolute top-0 whitespace-nowrap",
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
                  data-active={index === activeIndex}
                  className="absolute top-0 max-w-[40%] -translate-x-1/2 truncate transition-colors duration-300 data-[active=true]:font-medium data-[active=true]:text-foreground"
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
