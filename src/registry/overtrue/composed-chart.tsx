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
  Area,
  AreaRevealShape,
  Bar,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Line,
  Rectangle,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
  useActiveTooltipDataPoints,
  type ActiveDotProps,
  type AreaRevealShapeProps,
  type BarProps,
  type BarShapeProps,
} from "recharts-analytics";

import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  type ChartConfig,
} from "./analytics-chart";

export interface ComposedSeries {
  /** Key in each data row. */
  key: string;
  label: string;
  type?: "area" | "line" | "bar";
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
  /** Plot against the right axis. */
  axis?: "left" | "right";
  /** Series with the same stackId stack on top of each other. */
  stackId?: string;
  /** Bars only: fill with a diagonal hatch instead of a solid color. */
  pattern?: "solid" | "hatched";
  /** Lines and areas only. */
  dashed?: boolean;
  curve?: "monotone" | "linear" | "step";
  /** Lines only: draw a dot on every point. */
  dots?: boolean;
  /** Mark the highest point of this series with a dot. */
  highlightMax?: boolean;
}

export interface ReferenceLineSpec {
  /** Horizontal line at this y value. */
  y?: number;
  /** Vertical line at this x value. */
  x?: string | number;
  label?: string;
  /** Any CSS color. Defaults to the muted foreground. */
  color?: string;
  dashed?: boolean;
  axis?: "left" | "right";
}

export interface ComposedChartProps extends Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
> {
  data: Record<string, unknown>[];
  /** Key of the x-axis value in each row. */
  xKey: string;
  series: ComposedSeries[];
  referenceLines?: ReferenceLineSpec[];
  showGrid?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  xFormatter?: (value: unknown) => string;
  yFormatter?: (value: number) => string;
  rightYFormatter?: (value: number) => string;
  barRadius?: number;
  /** Animate series after hydration and when their data changes. Respects reduced motion. */
  animate?: boolean;
  animationDuration?: number;
  /** "zero" starts the y-axis at 0; "auto" fits it to the data. */
  yDomain?: "zero" | "auto" | [number, number];
}

/** Keyboard focus on the plot gets the shared primary ring. */
const FOCUS =
  "[&_.recharts-surface:focus-visible]:rounded-lg [&_.recharts-surface:focus-visible]:shadow-[0_0_0_2px_color-mix(in_oklab,var(--color-primary)_30%,transparent)]";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

/** The server snapshot disables motion so hydration starts from identical markup. */
function getReducedMotionServerSnapshot() {
  return true;
}

function defaultXFormatter(value: unknown) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y!, m! - 1, d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  return String(value);
}

/* ------------------------------------------------------------ visual tokens */

const EASE = "cubic-bezier(0.22,1,0.36,1)" as const;
/** cubic-bezier(0.22, 1, 0.36, 1) is the ease-out-quint curve. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 5);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const mix = (from: number, to: number, t: number) => from + (to - from) * t;

const GRID = "color-mix(in oklab, var(--color-foreground) 7%, transparent)";
const CROSSHAIR =
  "color-mix(in oklab, var(--color-foreground) 25%, transparent)";
const REFERENCE =
  "color-mix(in oklab, var(--color-muted-foreground) 70%, transparent)";
/** Lines glow in their own color in dark mode; `color` on each series feeds currentColor. */
const GLOW =
  "dark:[&_.recharts-area-curve]:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,currentColor_50%,transparent))] dark:[&_.recharts-line-curve]:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,currentColor_50%,transparent))]";
const TICK = { fontSize: 11, fill: "var(--color-muted-foreground)" };
/** Gap between stacked segments, in px. */
const STACK_GAP = 1.5;

/** Areas rise from the baseline on entrance; later updates tween in place. */
function RisingAreaShape(props: AreaRevealShapeProps) {
  const { isEntrance, animationElapsedTime = 1, baseLine } = props;
  const content = (
    <AreaRevealShape
      {...props}
      isEntrance={false}
      vectorEffect="non-scaling-stroke"
    />
  );
  if (!isEntrance || animationElapsedTime >= 1) return content;
  const base =
    typeof baseLine === "number"
      ? baseLine
      : Math.max(0, ...(baseLine ?? []).map((point) => point.y ?? 0));
  const t = Math.max(animationElapsedTime, 0.001);
  return (
    <g
      transform={`translate(0 ${base * (1 - t)}) scale(1 ${t})`}
      opacity={Math.min(1, t * 4)}
    >
      {content}
    </g>
  );
}

/** A solid point with a soft halo. */
function HaloDot({
  cx,
  cy,
  color,
  r = 3.5,
}: {
  cx?: number;
  cy?: number;
  color: string;
  r?: number;
}) {
  if (cx == null || cy == null) return null;
  return (
    <g data-slot="composed-chart-point" pointerEvents="none">
      <circle cx={cx} cy={cy} r={r * 2.3} fill={color} fillOpacity={0.18} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        stroke="var(--color-card)"
        strokeWidth={1.5}
      />
    </g>
  );
}

type BarInterpolate = NonNullable<BarProps["animationInterpolateFn"]>;

/**
 * Bars rise from their base one after another on entrance and glide on updates.
 * Recharts runs the clock linearly; each bar applies its own delay and easing.
 */
function barTween(count: number, duration: number, delay: number) {
  const step = count > 1 ? Math.min(32, 320 / (count - 1)) : 0;
  const total = duration + delay + step * Math.max(count - 1, 0);
  const interpolate: BarInterpolate = (items, elapsed) => {
    if (items == null) return [];
    const entering = items.every((item) => item.status === "added");
    return items.flatMap((item, index) => {
      const t =
        elapsed >= 1
          ? 1
          : easeOut(
              clamp01(
                (elapsed * total - delay - (entering ? index * step : 0)) /
                  duration,
              ),
            );
      if (item.status === "removed") {
        if (t >= 1) return [];
        const prev = item.prev;
        return [
          {
            ...prev,
            height: mix(prev.height, 0, t),
            y: mix(prev.y, prev.y + prev.height, t),
          },
        ];
      }
      if (item.status === "matched") {
        const { prev, next } = item;
        return [
          {
            ...next,
            x: mix(prev.x, next.x, t),
            y: mix(prev.y, next.y, t),
            width: mix(prev.width, next.width, t),
            height: mix(prev.height, next.height, t),
          },
        ];
      }
      const next = item.next;
      return [
        {
          ...next,
          height: mix(0, next.height, t),
          y: mix(next.stackedBarStart, next.y, t),
        },
      ];
    });
  };
  return { interpolate, total };
}

/** A bar that dims while another category is hovered or focused. */
function ComposedBarShape({
  fill,
  inset,
  ...props
}: BarShapeProps & { fill: string; inset: boolean }) {
  const active = useActiveTooltipDataPoints();
  const dimmed =
    active != null && active.length > 0 && !active.includes(props.payload);
  const height =
    inset && Math.abs(props.height) > STACK_GAP * 2
      ? props.height - STACK_GAP
      : props.height;
  return (
    <Rectangle
      {...props}
      height={height}
      fill={fill}
      className="transition-opacity duration-150 ease-out motion-reduce:transition-none"
      style={{ opacity: dimmed ? 0.4 : 1 }}
    />
  );
}

type Swatch = "dot" | "bar" | "dashed";

function SwatchMark({ color, kind }: { color: string; kind: Swatch }) {
  if (kind === "dashed")
    return (
      <span
        aria-hidden="true"
        className="w-3 shrink-0 border-t-2 border-dashed"
        style={{ borderColor: color }}
      />
    );
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-2 shrink-0",
        kind === "bar" ? "rounded-[2px]" : "rounded-full",
      )}
      style={{ backgroundColor: color }}
    />
  );
}

function ComposedChart({
  data,
  xKey,
  series,
  referenceLines = [],
  showGrid = true,
  showYAxis = false,
  showLegend = false,
  showTooltip = true,
  xFormatter = defaultXFormatter,
  yFormatter,
  rightYFormatter,
  barRadius = 4,
  animate = true,
  animationDuration = 500,
  yDomain = "zero",
  className,
  ...props
}: ComposedChartProps) {
  const id = React.useId().replace(/:/g, "");
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const motion = animate && !reducedMotion;
  const colors = series.map(
    (s, index) => s.color ?? `var(--color-chart-${(index % 5) + 1})`,
  );
  const config = Object.fromEntries(
    series.map((s, index) => [s.key, { label: s.label, color: colors[index] }]),
  ) satisfies ChartConfig;
  const hasRightAxis = series.some((s) => s.axis === "right");
  const hasBars = series.some((s) => s.type === "bar");
  const areaCount = series.filter(
    (s) => (s.type ?? "area") === "area" && !s.stackId,
  ).length;
  const domain =
    yDomain === "auto"
      ? (["auto", "auto"] as const)
      : yDomain === "zero"
        ? undefined
        : yDomain;
  const swatchFor = (s: ComposedSeries): Swatch =>
    s.type === "bar" ? "bar" : s.dashed ? "dashed" : "dot";
  const formatterFor = (s: ComposedSeries | undefined) =>
    s?.axis === "right" ? (rightYFormatter ?? yFormatter) : yFormatter;

  // The first and last series of each stack own its rounded outer corners.
  const stackEnds = new Map<string, { first: string; last: string }>();
  for (const s of series) {
    if (s.type !== "bar" || !s.stackId) continue;
    const ends = stackEnds.get(s.stackId);
    stackEnds.set(s.stackId, { first: ends?.first ?? s.key, last: s.key });
  }
  let barIndex = 0;

  const maxPoints = series
    .filter((s) => s.highlightMax)
    .map((s) => {
      let best: { x: unknown; y: number } | null = null;
      for (const row of data) {
        const y = Number(row[s.key]);
        if (Number.isFinite(y) && (!best || y > best.y))
          best = { x: row[xKey], y };
      }
      return best
        ? {
            ...best,
            key: s.key,
            axis: s.axis ?? "left",
            color: colors[series.indexOf(s)]!,
          }
        : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <ChartContainer
      data-slot="composed-chart"
      config={config}
      className={cn("aspect-auto h-64 w-full tabular-nums", GLOW, FOCUS, className)}
      {...props}
    >
      <RechartsComposedChart
        data={data}
        margin={{
          top: 12,
          right: hasRightAxis ? 0 : 10,
          bottom: 0,
          left: showYAxis ? 0 : 10,
        }}
        barCategoryGap="24%"
        barGap={3}
      >
        <defs>
          {series.map((s, index) => (
            <React.Fragment key={s.key}>
              <linearGradient
                id={`${id}-fill-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={colors[index]}
                  stopOpacity={areaCount > 1 ? 0.24 : 0.32}
                />
                <stop
                  offset="55%"
                  stopColor={colors[index]}
                  stopOpacity={areaCount > 1 ? 0.08 : 0.11}
                />
                <stop offset="100%" stopColor={colors[index]} stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id={`${id}-bar-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={colors[index]} stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor={colors[index]}
                  stopOpacity={0.72}
                />
              </linearGradient>
              <pattern
                id={`${id}-hatch-${index}`}
                patternUnits="userSpaceOnUse"
                width={6}
                height={6}
                patternTransform="rotate(45)"
              >
                <rect
                  width={6}
                  height={6}
                  fill={colors[index]}
                  fillOpacity={0.14}
                />
                <rect
                  width={1.5}
                  height={6}
                  fill={colors[index]}
                  fillOpacity={0.85}
                />
              </pattern>
            </React.Fragment>
          ))}
        </defs>
        {showGrid ? <CartesianGrid vertical={false} stroke={GRID} /> : null}
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={TICK}
          minTickGap={32}
          tickFormatter={xFormatter}
        />
        <YAxis
          yAxisId="left"
          domain={domain}
          hide={!showYAxis}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={TICK}
          width={44}
          tickFormatter={yFormatter}
        />
        {hasRightAxis ? (
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={domain}
            hide={!showYAxis}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={TICK}
            width={44}
            tickFormatter={rightYFormatter ?? yFormatter}
          />
        ) : null}
        <ChartTooltip
          isAnimationActive={false}
          cursor={
            hasBars || !showTooltip
              ? false
              : {
                  stroke: CROSSHAIR,
                  strokeWidth: 1,
                  style: { stroke: CROSSHAIR },
                }
          }
          content={({ active, payload, label }) => {
            if (!showTooltip || !active || !payload?.length) return null;
            const rows = payload.filter(
              (item) => item.type !== "none" && item.value != null,
            );
            if (!rows.length) return null;
            return (
              <div
                data-slot="composed-chart-tooltip"
                className="min-w-40 rounded-xl border border-border/70 bg-popover/90 px-3 py-2.5 text-xs text-popover-foreground shadow-xl backdrop-blur-md"
              >
                <p className="mb-1.5 font-medium text-foreground">
                  {xFormatter(label)}
                </p>
                <div className="grid gap-1">
                  {rows.map((item) => {
                    const index = series.findIndex(
                      (s) => s.key === String(item.dataKey),
                    );
                    const s = series[index];
                    const fmt = formatterFor(s);
                    const value = Number(item.value);
                    return (
                      <div
                        key={String(item.dataKey)}
                        className="flex items-center gap-2"
                      >
                        <SwatchMark
                          color={colors[index] ?? String(item.color)}
                          kind={s ? swatchFor(s) : "dot"}
                        />
                        <span className="text-muted-foreground">
                          {s?.label ?? String(item.dataKey)}
                        </span>
                        <span className="ml-auto pl-4 font-medium text-foreground tabular-nums">
                          {fmt ? fmt(value) : String(item.value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }}
        />
        {showLegend ? (
          <ChartLegend
            content={() => (
              <div
                data-slot="composed-chart-legend"
                className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-4 text-xs text-muted-foreground"
              >
                {series.map((s, index) => (
                  <span key={s.key} className="inline-flex items-center gap-1.5">
                    <SwatchMark color={colors[index]!} kind={swatchFor(s)} />
                    {s.label}
                  </span>
                ))}
              </div>
            )}
          />
        ) : null}
        {series.map((s, index) => {
          const color = colors[index]!;
          const common = {
            dataKey: s.key,
            yAxisId: s.axis ?? "left",
            stackId: s.stackId,
            isAnimationActive: motion,
          };
          if (s.type === "bar") {
            const tween = barTween(
              data.length,
              animationDuration,
              barIndex++ * 50,
            );
            const ends = s.stackId ? stackEnds.get(s.stackId) : undefined;
            const r = barRadius;
            const radius: number | [number, number, number, number] = !ends
              ? r
              : ends.first === ends.last
                ? r
                : ends.last === s.key
                  ? [r, r, 0, 0]
                  : ends.first === s.key
                    ? [0, 0, r, r]
                    : 0;
            const hatched = s.pattern === "hatched";
            return (
              <Bar
                key={s.key}
                {...common}
                animationDuration={tween.total}
                animationEasing="linear"
                animationInterpolateFn={tween.interpolate}
                fill={color}
                stroke={
                  hatched
                    ? `color-mix(in oklab, ${color} 70%, transparent)`
                    : undefined
                }
                strokeWidth={hatched ? 1 : 0}
                radius={radius}
                shape={(shape: BarShapeProps) => (
                  <ComposedBarShape
                    {...shape}
                    fill={
                      hatched
                        ? `url(#${id}-hatch-${index})`
                        : `url(#${id}-bar-${index})`
                    }
                    inset={Boolean(ends && ends.first !== s.key)}
                  />
                )}
              />
            );
          }
          if (s.type === "line") {
            return (
              <Line
                key={s.key}
                {...common}
                animationDuration={animationDuration + 200}
                animationBegin={index * 80}
                animationEasing={EASE}
                type={s.curve ?? "monotone"}
                stroke={color}
                color={color}
                strokeWidth={2}
                strokeLinecap={s.dashed ? "butt" : "round"}
                strokeLinejoin="round"
                strokeDasharray={s.dashed ? "5 5" : undefined}
                dot={
                  s.dots
                    ? (dot: { cx?: number; cy?: number; index?: number }) =>
                        dot.cx == null || dot.cy == null ? null : (
                          <circle
                            key={`${s.key}-dot-${dot.index}`}
                            cx={dot.cx}
                            cy={dot.cy}
                            r={3}
                            fill={color}
                            stroke="var(--color-card)"
                            strokeWidth={1.5}
                          />
                        )
                    : false
                }
                activeDot={(dot: ActiveDotProps) => (
                  <HaloDot
                    key={`${s.key}-${dot.index}`}
                    cx={dot.cx}
                    cy={dot.cy}
                    color={color}
                  />
                )}
              />
            );
          }
          return (
            <Area
              key={s.key}
              {...common}
              animationDuration={animationDuration + 200}
              animationBegin={index * 60}
              animationEasing={EASE}
              type={s.curve ?? "monotone"}
              stroke={color}
              color={color}
              strokeWidth={2}
              strokeLinecap={s.dashed ? "butt" : "round"}
              strokeLinejoin="round"
              strokeDasharray={s.dashed ? "5 5" : undefined}
              fill={`url(#${id}-fill-${index})`}
              fillOpacity={1}
              dot={false}
              activeDot={(dot: ActiveDotProps) => (
                <HaloDot
                  key={`${s.key}-${dot.index}`}
                  cx={dot.cx}
                  cy={dot.cy}
                  color={color}
                />
              )}
              shape={RisingAreaShape}
            />
          );
        })}
        {referenceLines.map((line, index) => (
          <ReferenceLine
            key={index}
            y={line.y}
            x={line.x}
            yAxisId={line.axis ?? "left"}
            stroke={line.color ?? REFERENCE}
            strokeWidth={1}
            strokeDasharray={line.dashed === false ? undefined : "3 4"}
            label={
              line.label
                ? {
                    value: line.label,
                    // Sit above a horizontal line, beside a vertical one.
                    position:
                      line.y !== undefined
                        ? "insideBottomRight"
                        : "insideTopLeft",
                    fill: line.color ?? "var(--color-muted-foreground)",
                    fontSize: 11,
                    fontWeight: 500,
                    stroke: "var(--color-card)",
                    strokeWidth: 4,
                    strokeLinejoin: "round",
                    paintOrder: "stroke",
                  }
                : undefined
            }
          />
        ))}
        {maxPoints.map((point) => (
          <ReferenceDot
            key={point.key}
            x={point.x as string | number}
            y={point.y}
            yAxisId={point.axis}
            r={4}
            fill={point.color}
            stroke="var(--color-card)"
            strokeWidth={2}
            shape={(dot) => (
              <HaloDot
                cx={Number(dot.cx)}
                cy={Number(dot.cy)}
                color={point.color}
                r={4}
              />
            )}
          />
        ))}
      </RechartsComposedChart>
    </ChartContainer>
  );
}

export { ComposedChart };
