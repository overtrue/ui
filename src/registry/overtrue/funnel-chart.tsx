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

export interface FunnelStep {
  name: string;
  value: number;
  /** Any CSS color for this step in the flow variant. Defaults to chart-1 through chart-5 in order. */
  color?: string;
}

export interface FunnelChartProps extends React.ComponentProps<"div"> {
  steps: FunnelStep[];
  valueFormatter?: (value: number) => string;
  /**
   * Any CSS color. "bars" fades it step by step. "flow" paints every stage in
   * it, in place of the per-stage palette.
   */
  color?: string;
  /** Show the drop-off between consecutive steps. Bars only. */
  showDropoff?: boolean;
  /** "bars" stacks one bar per step; "flow" runs the steps left to right, each tapering into the next. */
  variant?: "bars" | "flow";
  /** Flow only. "eased" curves each neck; "sharp" draws straight trapezoids. */
  shape?: "eased" | "sharp";
  /** Flow only. Height of the stages in pixels. */
  height?: number;
  /** Flow only. Width of the neck between stages in pixels. */
  neckWidth?: number;
  /** Flow only. Show the share of the first step as a pill on each stage. */
  showPercentages?: boolean;
  /** Flow only. Show a tile with the name and value under each stage. */
  showLabels?: boolean;
  /** Flow only. Stage drawn at full strength while the rest dim. */
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
}

const defaultColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const EASE = "cubic-bezier(0.22,1,0.36,1)";
const keyframes = `@keyframes funnel-grow-x{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes funnel-grow-y{from{transform:scaleY(0)}to{transform:scaleY(1)}}@keyframes funnel-fade{from{opacity:0}to{opacity:1}}`;

// Round so server and client render identical path strings.
const round = (n: number) => Math.round(n * 1000) / 1000;

/** Path for the neck between two stages, in a 1x1 box stretched to fit. */
function neckPath(from: number, to: number, shape: "eased" | "sharp") {
  const t0 = round((1 - from) / 2);
  const b0 = round(1 - t0);
  const t1 = round((1 - to) / 2);
  const b1 = round(1 - t1);
  if (shape === "sharp") return `M0,${t0} L1,${t1} L1,${b1} L0,${b0} Z`;
  return `M0,${t0} C0.5,${t0} 0.5,${t1} 1,${t1} L1,${b1} C0.5,${b1} 0.5,${b0} 0,${b0} Z`;
}

function DropoffIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="size-3 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 3.5 8.5 8.5M8.5 4.5v4h-4" />
    </svg>
  );
}

function FunnelBars({
  steps,
  valueFormatter,
  color,
  showDropoff,
}: {
  steps: FunnelStep[];
  valueFormatter: (value: number) => string;
  color: string;
  showDropoff: boolean;
}) {
  const first = steps[0]?.value ?? 0;
  const last = steps[steps.length - 1]?.value ?? 0;
  const overall = first > 0 ? last / first : 0;
  const dropoffs = steps.map((step, index) => {
    const previous = index > 0 ? steps[index - 1]!.value : step.value;
    return index > 0 && previous > 0 ? 1 - step.value / previous : 0;
  });
  // The biggest loss between two steps earns the attention tint.
  const largest = steps.length > 2 ? Math.max(...dropoffs) : -1;

  return (
    <>
      {steps.map((step, index) => {
        const previous = index > 0 ? steps[index - 1]!.value : step.value;
        const ofFirst = first > 0 ? Math.min(1, step.value / first) : 0;
        const previousOfFirst = first > 0 ? Math.min(1, previous / first) : 0;
        const ofPrevious = previous > 0 ? step.value / previous : 0;
        const dropoff = 1 - ofPrevious;
        const fade = 1 - index * (0.45 / Math.max(steps.length - 1, 1));
        const worst = index > 0 && dropoffs[index] === largest && largest > 0;

        return (
          <React.Fragment key={step.name}>
            {showDropoff && index > 0 ? (
              <div
                data-slot="funnel-dropoff"
                data-largest={worst || undefined}
                className="flex items-center py-1.5 pl-[3px] text-xs"
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 tabular-nums",
                    worst
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      : "bg-muted/70 text-muted-foreground",
                  )}
                >
                  {worst ? (
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-current"
                    />
                  ) : (
                    <DropoffIcon />
                  )}
                  {formatNumber(dropoff, { format: "percent" })} drop-off
                </span>
              </div>
            ) : null}
            <div data-slot="funnel-step" className="group/step flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="flex min-w-0 items-center gap-2 truncate">
                  <span className="text-muted-foreground w-4 shrink-0 font-mono text-xs tabular-nums">
                    {index + 1}
                  </span>
                  <span className="truncate font-medium">{step.name}</span>
                </span>
                <span className="flex shrink-0 items-baseline gap-3 tabular-nums">
                  <span className="font-semibold tracking-[-0.01em]">
                    {valueFormatter(step.value)}
                  </span>
                  <span className="text-muted-foreground w-12 text-right text-xs">
                    {formatNumber(ofFirst, { format: "percent" })}
                  </span>
                </span>
              </div>
              <div
                data-slot="funnel-track"
                className="relative h-4 w-full overflow-hidden rounded-[4px] bg-muted/50 ring-1 ring-inset ring-border/40"
              >
                {index > 0 && previousOfFirst > ofFirst ? (
                  <div
                    aria-hidden="true"
                    data-slot="funnel-loss"
                    className="absolute inset-y-0 rounded-r-[4px] transition-[left,width] duration-500 motion-reduce:transition-none"
                    style={{
                      left: `${ofFirst * 100}%`,
                      width: `${(previousOfFirst - ofFirst) * 100}%`,
                      backgroundColor: `color-mix(in oklab, ${color} 6%, transparent)`,
                      backgroundImage: `repeating-linear-gradient(-45deg, color-mix(in oklab, ${color} 22%, transparent) 0 1px, transparent 1px 5px)`,
                    }}
                  />
                ) : null}
                <div
                  aria-hidden="true"
                  data-slot="funnel-bar"
                  className="absolute inset-y-0 left-0 origin-left rounded-[4px] transition-[width] duration-500 motion-safe:animate-[funnel-grow-x_700ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:transition-none dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.14)]"
                  style={{
                    width: `${ofFirst * 100}%`,
                    minWidth: ofFirst > 0 ? 4 : 0,
                    opacity: fade,
                    backgroundImage: `linear-gradient(90deg, color-mix(in oklab, ${color} 72%, transparent), ${color})`,
                    animationDelay: `${index * 60}ms`,
                    transitionTimingFunction: EASE,
                  }}
                />
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {steps.length > 1 ? (
        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-sm">
          <span className="text-muted-foreground">Overall conversion</span>
          <span className="text-base font-semibold tracking-[-0.02em] tabular-nums">
            {formatNumber(overall, { format: "percent" })}
          </span>
        </div>
      ) : null}
    </>
  );
}

function FunnelFlow({
  steps,
  valueFormatter,
  color,
  shape,
  height,
  neckWidth,
  showPercentages,
  showLabels,
  activeIndex,
  onActiveIndexChange,
}: {
  steps: FunnelStep[];
  valueFormatter: (value: number) => string;
  color?: string;
  shape: "eased" | "sharp";
  height: number;
  neckWidth: number;
  showPercentages: boolean;
  showLabels: boolean;
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
}) {
  const id = React.useId().replace(/:/g, "");
  const [activeState, setActiveState] = React.useState<number | null>(null);
  const active = activeIndex === undefined ? activeState : activeIndex;
  const setActive = (index: number | null) => {
    setActiveState(index);
    onActiveIndexChange?.(index);
  };

  const first = steps[0]?.value ?? 0;
  const stages = steps.map((step, index) => ({
    ...step,
    share: first > 0 ? Math.min(1, Math.max(0, step.value / first)) : 0,
    fill: step.color ?? color ?? defaultColors[index % defaultColors.length]!,
    // A single color fades toward the end of the funnel so stages stay distinct.
    opacity:
      color && !step.color
        ? 1 - index * (0.6 / Math.max(steps.length - 1, 1))
        : 1,
  }));

  return (
    <>
      <div
        data-slot="funnel-flow"
        className="flex w-full items-stretch"
        style={{ height }}
        onMouseLeave={() => setActive(null)}
      >
        {stages.map((stage, index) => {
          const next = stages[index + 1];
          const dimmed = active !== null && active !== index;
          const neckDimmed =
            active !== null && active !== index && active !== index + 1;
          const gradient = `${id}-${index}`;
          return (
            <React.Fragment key={stage.name}>
              <div
                data-slot="funnel-stage"
                data-active={active === index || undefined}
                onMouseEnter={() => setActive(index)}
                className="relative flex min-w-0 flex-1 items-center transition-opacity duration-150 motion-reduce:transition-none"
                style={{ opacity: dimmed ? 0.4 : 1 }}
              >
                <div
                  className={cn(
                    "w-full transition-[height] duration-500 motion-safe:animate-[funnel-grow-y_700ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:transition-none dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.14)]",
                    index === 0 && "rounded-l-xl",
                    index === stages.length - 1 && "rounded-r-xl",
                  )}
                  style={{
                    height: `${round(stage.share * 100)}%`,
                    minHeight: 4,
                    backgroundImage: `linear-gradient(180deg, ${stage.fill}, color-mix(in oklab, ${stage.fill} 80%, transparent))`,
                    opacity: stage.opacity,
                    animationDelay: `${index * 70}ms`,
                    transitionTimingFunction: EASE,
                  }}
                />
                {showPercentages ? (
                  <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-popover/85 px-2 py-0.5 text-[11px] font-medium text-popover-foreground tabular-nums shadow-sm ring-1 ring-border/70 backdrop-blur-md motion-safe:animate-[funnel-fade_400ms_ease-out_both] [animation-delay:450ms]">
                    {formatNumber(stage.share, {
                      format: "percent",
                      maximumFractionDigits: 0,
                    })}
                  </span>
                ) : null}
              </div>
              {next ? (
                <svg
                  aria-hidden="true"
                  data-slot="funnel-neck"
                  viewBox="0 0 1 1"
                  preserveAspectRatio="none"
                  className="h-full shrink-0 transition-opacity duration-150 motion-safe:animate-[funnel-fade_500ms_ease-out_both] motion-reduce:transition-none"
                  style={{
                    width: neckWidth,
                    opacity: neckDimmed ? 0.4 : 1,
                    animationDelay: `${index * 70 + 250}ms`,
                  }}
                >
                  <defs>
                    <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="0">
                      <stop
                        offset="0"
                        stopColor={stage.fill}
                        stopOpacity={stage.opacity * 0.85}
                      />
                      <stop
                        offset="1"
                        stopColor={next.fill}
                        stopOpacity={next.opacity * 0.85}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d={neckPath(stage.share, next.share, shape)}
                    fill={`url(#${gradient})`}
                    className="transition-[d] duration-500 ease-out"
                  />
                </svg>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
      {showLabels ? (
        <div
          data-slot="funnel-labels"
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`,
          }}
        >
          {stages.map((stage, index) => {
            const previous = stages[index - 1];
            const kept =
              previous && previous.value > 0
                ? stage.value / previous.value
                : null;
            return (
              <div
                key={stage.name}
                data-active={active === index || undefined}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                className={cn(
                  "flex min-w-0 flex-col gap-0.5 rounded-xl bg-muted/40 px-2.5 py-2 ring-1 ring-inset ring-border/60 transition-[opacity,box-shadow,background-color] duration-150 motion-reduce:transition-none",
                  active !== null && active !== index && "opacity-50",
                  active === index && "bg-muted/70 ring-foreground/15",
                )}
              >
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: stage.fill,
                      opacity: stage.opacity,
                    }}
                  />
                  <span className="truncate">{stage.name}</span>
                </span>
                <span className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
                  <span className="min-w-0 truncate text-sm font-semibold tracking-[-0.01em] tabular-nums">
                    {valueFormatter(stage.value)}
                  </span>
                  {kept !== null ? (
                    <span
                      data-slot="funnel-stage-dropoff"
                      className="text-muted-foreground ml-auto shrink-0 text-[11px] tabular-nums"
                    >
                      −
                      {formatNumber(1 - kept, {
                        format: "percent",
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  ) : null}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}

/** Step-by-step conversion, as stacked bars with drop-off or as a flow of tapering stages. */
function FunnelChart({
  steps,
  valueFormatter = (value) => formatNumber(value),
  color,
  showDropoff = true,
  variant = "bars",
  shape = "eased",
  height = 160,
  neckWidth = 24,
  showPercentages = true,
  showLabels = true,
  activeIndex,
  onActiveIndexChange,
  className,
  ...props
}: FunnelChartProps) {
  return (
    <div
      data-slot="funnel-chart"
      data-variant={variant}
      className={cn(
        "flex flex-col",
        variant === "flow" ? "gap-3" : "gap-1",
        className,
      )}
      {...props}
    >
      <style href="overtrue-funnel-chart" precedence="default">
        {keyframes}
      </style>
      {variant === "flow" ? (
        <FunnelFlow
          steps={steps}
          valueFormatter={valueFormatter}
          color={color}
          shape={shape}
          height={height}
          neckWidth={neckWidth}
          showPercentages={showPercentages}
          showLabels={showLabels}
          activeIndex={activeIndex}
          onActiveIndexChange={onActiveIndexChange}
        />
      ) : (
        <FunnelBars
          steps={steps}
          valueFormatter={valueFormatter}
          color={color ?? "var(--color-chart-1)"}
          showDropoff={showDropoff}
        />
      )}
    </div>
  );
}

export { FunnelChart };
