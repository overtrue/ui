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
  /** Optional label per column, shown under the column, in the tooltip, and in the accessible name. */
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
  /** Show `labels` under the columns. */
  showLabels?: boolean;
  /** Show every nth label. Defaults to whatever keeps about 12 labels. */
  labelEvery?: number;
  /** Draw the empty slots of each column as faint dots, so every column reads against the same scale. */
  showTrack?: boolean;
  /** Formats the value in the tooltip. Defaults to a plain grouped number. */
  valueFormatter?: (value: number) => string;
  /** Index of the hovered column, to control it from outside. */
  activeIndex?: number | null;
  /** Called when the hovered column changes, with null when the pointer leaves. */
  onActiveIndexChange?: (index: number | null) => void;
}

const defaultFormatter = (value: number) => value.toLocaleString("en-US");
const TRACK = "color-mix(in oklab, var(--color-foreground) 7%, transparent)";

function useReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/**
 * A distribution drawn as columns of stacked dots against a faint track, with the
 * peak columns at full strength. Hovering a column lights it up, fades the others,
 * and shows its value.
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
  showLabels = true,
  labelEvery,
  showTrack = true,
  valueFormatter = defaultFormatter,
  activeIndex,
  onActiveIndexChange,
  className,
  style,
  ref,
  ...props
}: DotPlotProps) {
  const reduced = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState(0);
  const [internal, setInternal] = React.useState<number | null>(null);
  const active = activeIndex === undefined ? internal : activeIndex;
  const setActive = (index: number | null) => {
    if (index === active) return;
    setInternal(index);
    onActiveIndexChange?.(index);
  };

  const top = max ?? Math.max(0, ...data);
  const peak = data.indexOf(Math.max(...data));
  const peakLabel = labels?.[peak];
  const withLabels = showLabels && !!labels?.length;

  // Thin the labels out when the columns get too narrow to hold them side by side.
  React.useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node || !withLabels) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry?.contentRect.width ?? 0),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [withLabels]);
  const longest =
    labels?.reduce((m, label) => Math.max(m, label.length), 0) ?? 0;
  const columnWidth = width
    ? Math.min(width / Math.max(1, data.length), 36)
    : Infinity;
  const fit = Math.max(1, Math.ceil((longest * 6.4 + 6) / columnWidth));
  const every = labelEvery ?? Math.max(Math.ceil(data.length / 12), fit);

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
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
      style={style}
      {...props}
    >
      <style href="overtrue-dot-plot" precedence="default">
        {`@keyframes dot-plot-rise{from{opacity:0;transform:translateY(6px) scale(.5)}}`}
      </style>
      {data.map((value, index) => {
        const fraction = Math.min(1, Math.max(0, value / (top || 1)));
        // Any non-zero value shows at least one dot so small values still register.
        const count =
          fraction === 0 ? 0 : Math.max(1, Math.round(fraction * rows));
        const strong = emphasis <= 0 || fraction >= emphasis;
        // While a column is hovered it alone is lit; otherwise the emphasized columns are.
        const lit = active === null ? strong : active === index;
        const isActive = active === index;
        const label = labels?.[index];
        const slots = showTrack ? Math.max(rows, count) : count;
        return (
          <div
            key={index}
            data-slot="dot-plot-column"
            data-emphasis={strong}
            data-active={isActive}
            onPointerEnter={() => setActive(index)}
            // Columns stretch to the full height and carry the gap as padding, so the hover target has no dead zones.
            // They share the width equally and cap at the dot size, so dots shrink in narrow cards instead of overflowing.
            className={cn(
              "relative flex min-w-0 flex-1 cursor-default flex-col items-center gap-1.5 px-[calc(var(--dot-gap)/2)]",
              withLabels
                ? "max-w-[max(calc(var(--dot-size)+var(--dot-gap)),2.25rem)]"
                : "max-w-[calc(var(--dot-size)+var(--dot-gap))]",
            )}
          >
            <div className="flex w-full flex-1 flex-col-reverse items-center justify-start gap-(--dot-gap)">
              {Array.from({ length: slots }, (_, dot) => {
                const filled = dot < count;
                return (
                  <span
                    key={dot}
                    data-filled={filled || undefined}
                    className={cn(
                      "aspect-square w-full max-w-(--dot-size) shrink-0 rounded-full transition-[opacity,background-color,box-shadow] duration-150 motion-reduce:transition-none",
                      filled &&
                        "shadow-[inset_0_1px_0_rgb(255_255_255/0.22)] dark:shadow-[0_0_8px_-1px_color-mix(in_oklab,var(--dot-plot-color)_70%,transparent)]",
                      filled &&
                        !reduced &&
                        "motion-safe:animate-[dot-plot-rise_560ms_cubic-bezier(0.22,1,0.36,1)_backwards]",
                    )}
                    style={{
                      backgroundColor: filled ? color : TRACK,
                      opacity: filled ? (lit ? 1 : fadedOpacity) : 1,
                      ["--dot-plot-color" as string]: color,
                      animationDelay:
                        filled && !reduced
                          ? `${Math.round(index * Math.min(36, 420 / Math.max(1, data.length)) + dot * 28)}ms`
                          : undefined,
                    }}
                  />
                );
              })}
            </div>
            {withLabels ? (
              <span
                aria-hidden="true"
                className={cn(
                  "max-w-none text-[11px] leading-none whitespace-nowrap text-muted-foreground tabular-nums transition-colors duration-150 motion-reduce:transition-none",
                  isActive && "font-medium text-foreground",
                )}
              >
                {index % every === 0 || isActive ? (label ?? "") : " "}
              </span>
            ) : null}
            {showTooltip && isActive ? (
              <span
                role="tooltip"
                data-slot="dot-plot-tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-border/70 bg-popover/90 px-2.5 py-1.5 text-xs whitespace-nowrap text-popover-foreground shadow-xl backdrop-blur-md"
              >
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {label !== undefined ? (
                  <span className="text-muted-foreground">{label}</span>
                ) : null}
                <span className="ml-auto pl-1 font-semibold text-foreground tabular-nums">
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
