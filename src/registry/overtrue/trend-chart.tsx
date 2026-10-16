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
  AreaChart,
  AreaRevealShape,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Rectangle,
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

export interface TrendSeries {
  /** Key in each data row. */
  key: string;
  label: string;
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
}

export interface TrendChartProps extends Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
> {
  data: Record<string, unknown>[];
  /** Key of the x-axis value in each row. */
  xKey: string;
  series: TrendSeries[];
  type?: "area" | "line" | "bar";
  /** Area fill: a plain gradient, or a dot grid that fades out toward the line. */
  fill?: "gradient" | "dots";
  /** Bars only: "horizontal" runs bars left to right with categories down the side. */
  layout?: "vertical" | "horizontal";
  /** Bars only: corner radius in px, or "full" for pill-shaped bars. */
  barRadius?: number | "full";
  /** Bars only: thickness of each bar in px. Defaults to a share of the category width. */
  barSize?: number;
  stacked?: boolean;
  showLegend?: boolean;
  legendPosition?: "top" | "bottom";
  legendAlign?: "left" | "center" | "right";
  showGrid?: boolean;
  /** Show the value axis. In the horizontal layout this is the axis along the bottom. */
  showYAxis?: boolean;
  /** Recharts domain for the value axis, e.g. ["dataMin", "dataMax"] or ["auto", "auto"]. Defaults to [0, "auto"]. */
  yDomain?: React.ComponentProps<typeof YAxis>["domain"];
  xFormatter?: (value: unknown) => string;
  yFormatter?: (value: number) => string;
  /** Animate series after hydration and when data changes. Respects reduced motion. */
  animate?: boolean;
  animationDuration?: number;
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

/** Entrance and update curve, also used by the hand-driven bar tween below. */
const EASE = "cubic-bezier(0.22,1,0.36,1)" as const;
/** cubic-bezier(0.22, 1, 0.36, 1) is the ease-out-quint curve. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 5);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const mix = (from: number, to: number, t: number) => from + (to - from) * t;

const GRID = "color-mix(in oklab, var(--color-foreground) 7%, transparent)";
const CROSSHAIR =
  "color-mix(in oklab, var(--color-foreground) 25%, transparent)";
/** Lines glow in their own color in dark mode; `color` on each series feeds currentColor. */
const GLOW =
  "dark:[&_.recharts-area-curve]:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,currentColor_50%,transparent))] dark:[&_.recharts-line-curve]:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,currentColor_50%,transparent))]";
const TICK = { fontSize: 11, fill: "var(--color-muted-foreground)" };
/** Gap between stacked segments, in px. */
const STACK_GAP = 1.5;

/** Area shape that masks the fill to a dot grid while keeping the stroke solid. */
function DotGridAreaShape({
  maskId,
  ...props
}: AreaRevealShapeProps & { maskId: string }) {
  return (
    <>
      <g mask={`url(#${maskId})`}>
        <AreaRevealShape {...props} stroke="none" />
      </g>
      <AreaRevealShape {...props} id={undefined} fill="none" />
    </>
  );
}

/** Areas rise from the baseline on entrance; later updates tween in place. */
function RisingAreaShape({
  maskId,
  ...props
}: AreaRevealShapeProps & { maskId?: string }) {
  const { isEntrance, animationElapsedTime = 1, baseLine } = props;
  const shape = { ...props, isEntrance: false, vectorEffect: "non-scaling-stroke" };
  const content = maskId ? (
    <DotGridAreaShape {...shape} maskId={maskId} />
  ) : (
    <AreaRevealShape {...shape} />
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

/** A solid point with a soft halo, used for the hovered value on lines and areas. */
function HaloDot({ cx, cy, color }: { cx?: number; cy?: number; color: string }) {
  if (cx == null || cy == null) return null;
  return (
    <g data-slot="trend-chart-active-dot" pointerEvents="none">
      <circle cx={cx} cy={cy} r={8} fill={color} fillOpacity={0.18} />
      <circle
        cx={cx}
        cy={cy}
        r={3.5}
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
  const interpolate: BarInterpolate = (items, elapsed, layout) => {
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
        return layout === "horizontal"
          ? [
              {
                ...prev,
                height: mix(prev.height, 0, t),
                y: mix(prev.y, prev.y + prev.height, t),
              },
            ]
          : [{ ...prev, width: mix(prev.width, 0, t) }];
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
      return layout === "horizontal"
        ? [
            {
              ...next,
              height: mix(0, next.height, t),
              y: mix(next.stackedBarStart, next.y, t),
            },
          ]
        : [
            {
              ...next,
              width: mix(0, next.width, t),
              x: mix(next.stackedBarStart, next.x, t),
            },
          ];
    });
  };
  return { interpolate, total };
}

/** A gradient bar that dims while another category is hovered or focused. */
function TrendBarShape({
  gradient,
  inset,
  horizontal,
  ...props
}: BarShapeProps & {
  gradient: string;
  /** Pull the base end in to leave a hairline gap between stacked segments. */
  inset: boolean;
  horizontal: boolean;
}) {
  const active = useActiveTooltipDataPoints();
  const dimmed =
    active != null && active.length > 0 && !active.includes(props.payload);
  let { x, y, width, height } = props;
  if (inset) {
    if (horizontal && Math.abs(width) > STACK_GAP * 2) {
      x += STACK_GAP;
      width -= STACK_GAP;
    } else if (!horizontal && Math.abs(height) > STACK_GAP * 2) {
      height -= STACK_GAP;
    }
  }
  return (
    <Rectangle
      {...props}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={`url(#${gradient})`}
      className="transition-opacity duration-150 ease-out motion-reduce:transition-none"
      style={{ opacity: dimmed ? 0.4 : 1 }}
    />
  );
}

/** Recharts clamps corner radii to half the bar, so an oversized radius draws a pill. */
const PILL = 9999;

type Radius = number | [number, number, number, number];

/** Round only the outer corners of a stack; mixed-sign stacks stay square. */
function barCorners(
  radius: number | "full",
  stacked: boolean,
  hasNegative: boolean,
  horizontal: boolean,
  index: number,
  count: number,
): Radius {
  const r = radius === "full" ? PILL : radius;
  if (!stacked || count === 1) return r;
  if (hasNegative) return 0;
  // Corners run [top-left, top-right, bottom-right, bottom-left].
  if (index === count - 1) return horizontal ? [0, r, r, 0] : [r, r, 0, 0];
  if (index === 0) return horizontal ? [r, 0, 0, r] : [0, 0, r, r];
  return 0;
}

interface TooltipRow {
  key: string;
  label: React.ReactNode;
  color: string;
  value: string;
}

function TrendTooltip({
  label,
  rows,
  total,
}: {
  label: React.ReactNode;
  rows: TooltipRow[];
  total?: string;
}) {
  return (
    <div
      data-slot="trend-chart-tooltip"
      className="min-w-40 rounded-xl border border-border/70 bg-popover/90 px-3 py-2.5 text-xs text-popover-foreground shadow-xl backdrop-blur-md"
    >
      <p className="mb-1.5 font-medium text-foreground">{label}</p>
      <div className="grid gap-1">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: row.color }}
            />
            <span className="text-muted-foreground">{row.label}</span>
            <span className="ml-auto pl-4 font-medium text-foreground tabular-nums">
              {row.value}
            </span>
          </div>
        ))}
      </div>
      {total != null ? (
        <div className="mt-1.5 flex items-center gap-2 border-t border-border/60 pt-1.5">
          <span className="text-muted-foreground">Total</span>
          <span className="ml-auto pl-4 font-semibold text-foreground tabular-nums">
            {total}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function TrendLegend({
  items,
  position,
  align,
}: {
  items: { key: string; label: React.ReactNode; color: string }[];
  position: "top" | "bottom";
  align: "left" | "center" | "right";
}) {
  return (
    <div
      data-slot="trend-chart-legend"
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground",
        position === "top" ? "pb-4" : "pt-4",
        align === "right"
          ? "justify-end"
          : align === "left"
            ? "justify-start"
            : "justify-center",
      )}
    >
      {items.map((item) => (
        <span key={item.key} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function TrendChart({
  data,
  xKey,
  series,
  type = "area",
  fill = "gradient",
  layout = "vertical",
  barRadius = 4,
  barSize,
  stacked = false,
  showLegend = false,
  legendPosition = "bottom",
  legendAlign = "center",
  showGrid = true,
  showYAxis = false,
  yDomain,
  xFormatter = defaultXFormatter,
  yFormatter,
  animate = true,
  animationDuration = 500,
  className,
  ...props
}: TrendChartProps) {
  const id = React.useId().replace(/:/g, "");
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const motion = animate && !reducedMotion;
  const dots = type === "area" && fill === "dots";
  const horizontal = type === "bar" && layout === "horizontal";
  const hasNegative = React.useMemo(
    () =>
      data.some((row) =>
        series.some((s) => {
          const v = row[s.key];
          return typeof v === "number" && v < 0;
        }),
      ),
    [data, series],
  );
  const colors = series.map(
    (s, index) => s.color ?? `var(--color-chart-${(index % 5) + 1})`,
  );
  const config = Object.fromEntries(
    series.map((s, index) => [s.key, { label: s.label, color: colors[index] }]),
  ) satisfies ChartConfig;
  const format = (value: number) =>
    yFormatter ? yFormatter(value) : value.toLocaleString();
  // Overlapping areas each get a lighter wash so the layers stay luminous, not muddy.
  const layered = type === "area" && !stacked && series.length > 1;
  const areaTop = dots ? 0.08 : layered ? 0.24 : 0.32;

  const axes = (
    <>
      {showGrid ? (
        <CartesianGrid
          vertical={horizontal}
          horizontal={!horizontal}
          stroke={GRID}
        />
      ) : null}
      {horizontal ? (
        <>
          <XAxis
            type="number"
            hide={!showYAxis}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={TICK}
            domain={yDomain}
            tickFormatter={yFormatter}
          />
          <YAxis
            type="category"
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ ...TICK, fontSize: 12 }}
            width="auto"
            tickFormatter={xFormatter}
          />
        </>
      ) : (
        <>
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={TICK}
            minTickGap={32}
            tickFormatter={xFormatter}
          />
          {showYAxis ? (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={TICK}
              width="auto"
              domain={yDomain}
              tickFormatter={yFormatter}
            />
          ) : yDomain ? (
            <YAxis hide domain={yDomain} />
          ) : null}
        </>
      )}
      {hasNegative ? (
        <ReferenceLine
          {...(horizontal ? { x: 0 } : { y: 0 })}
          stroke="color-mix(in oklab, var(--color-foreground) 22%, transparent)"
          strokeWidth={1}
        />
      ) : null}
      <ChartTooltip
        isAnimationActive={false}
        cursor={
          type === "bar"
            ? false
            : {
                stroke: CROSSHAIR,
                strokeWidth: 1,
                style: { stroke: CROSSHAIR },
              }
        }
        content={({ active, payload, label }) => {
          if (!active || !payload?.length) return null;
          const shown = payload.filter(
            (item) => item.type !== "none" && item.value != null,
          );
          if (!shown.length) return null;
          const ordered = type === "bar" && stacked ? [...shown].reverse() : shown;
          const rows = ordered.map((item) => {
            const key = String(item.dataKey);
            const index = series.findIndex((s) => s.key === key);
            return {
              key,
              label: series[index]?.label ?? key,
              color: colors[index] ?? String(item.color),
              value: format(Number(item.value)),
            };
          });
          const total =
            stacked && shown.length > 1
              ? format(shown.reduce((sum, item) => sum + Number(item.value), 0))
              : undefined;
          return (
            <TrendTooltip label={xFormatter(label)} rows={rows} total={total} />
          );
        }}
      />
      {showLegend ? (
        <ChartLegend
          verticalAlign={legendPosition}
          align={legendAlign}
          content={() => (
            <TrendLegend
              position={legendPosition}
              align={legendAlign}
              items={series.map((s, index) => ({
                key: s.key,
                label: s.label,
                color: colors[index]!,
              }))}
            />
          )}
        />
      ) : null}
    </>
  );

  const margin = {
    top: 10,
    right: 10,
    bottom: 0,
    left: showYAxis || horizontal ? 0 : 10,
  };

  return (
    <ChartContainer
      data-slot="trend-chart"
      data-type={type}
      config={config}
      className={cn("aspect-auto h-64 w-full tabular-nums", GLOW, FOCUS, className)}
      {...props}
    >
      {type === "bar" ? (
        <BarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={margin}
          stackOffset={stacked ? "sign" : "none"}
          barCategoryGap={horizontal ? "24%" : "28%"}
          barGap={4}
        >
          <defs>
            {series.map((s, index) => (
              <linearGradient
                key={s.key}
                id={`${id}-bar-${index}`}
                x1="0"
                y1="0"
                x2={horizontal ? "1" : "0"}
                y2={horizontal ? "0" : "1"}
              >
                <stop
                  offset="0%"
                  stopColor={colors[index]}
                  stopOpacity={horizontal ? 0.72 : 1}
                />
                <stop
                  offset="100%"
                  stopColor={colors[index]}
                  stopOpacity={horizontal ? 1 : 0.72}
                />
              </linearGradient>
            ))}
          </defs>
          {axes}
          {series.map((s, index) => {
            const tween = barTween(data.length, animationDuration, index * 40);
            return (
              <Bar
                key={s.key}
                dataKey={s.key}
                fill={colors[index]}
                barSize={barSize}
                radius={barCorners(
                  barRadius,
                  stacked,
                  hasNegative,
                  horizontal,
                  index,
                  series.length,
                )}
                stackId={stacked ? "stack" : undefined}
                isAnimationActive={motion}
                animationDuration={tween.total}
                animationEasing="linear"
                animationInterpolateFn={tween.interpolate}
                shape={(shape: BarShapeProps) => (
                  <TrendBarShape
                    {...shape}
                    gradient={`${id}-bar-${index}`}
                    horizontal={horizontal}
                    inset={stacked && !hasNegative && index > 0}
                  />
                )}
              />
            );
          })}
        </BarChart>
      ) : type === "line" ? (
        <LineChart data={data} margin={margin}>
          {axes}
          {series.map((s, index) => (
            <Line
              key={s.key}
              isAnimationActive={motion}
              animationDuration={animationDuration + 200}
              animationBegin={index * 80}
              animationEasing={EASE}
              type="monotone"
              dataKey={s.key}
              stroke={colors[index]}
              color={colors[index]}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={(dot: ActiveDotProps) => (
                <HaloDot
                  key={`${s.key}-${dot.index}`}
                  cx={dot.cx}
                  cy={dot.cy}
                  color={colors[index]!}
                />
              )}
            />
          ))}
        </LineChart>
      ) : (
        <AreaChart
          data={data}
          margin={margin}
          stackOffset={stacked ? "sign" : "none"}
        >
          <defs>
            {series.map((s, index) => (
              <linearGradient
                key={s.key}
                id={`${id}-area-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={colors[index]}
                  stopOpacity={areaTop}
                />
                <stop
                  offset="55%"
                  stopColor={colors[index]}
                  stopOpacity={dots ? 0.45 : areaTop * 0.35}
                />
                <stop
                  offset="100%"
                  stopColor={colors[index]}
                  stopOpacity={dots ? 0.9 : 0}
                />
              </linearGradient>
            ))}
            {dots ? (
              <>
                <pattern
                  id={`${id}-dots`}
                  patternUnits="userSpaceOnUse"
                  width={5}
                  height={5}
                >
                  <circle cx={2.5} cy={2.5} r={1} fill="#fff" />
                </pattern>
                <mask
                  id={`${id}-mask`}
                  maskUnits="userSpaceOnUse"
                  x={0}
                  y={0}
                  width="100%"
                  height="100%"
                >
                  <rect width="100%" height="100%" fill={`url(#${id}-dots)`} />
                </mask>
              </>
            ) : null}
          </defs>
          {axes}
          {series.map((s, index) => (
            <Area
              key={s.key}
              isAnimationActive={motion}
              animationDuration={animationDuration + 200}
              animationBegin={index * 60}
              animationEasing={EASE}
              type="monotone"
              dataKey={s.key}
              stroke={colors[index]}
              color={colors[index]}
              fill={`url(#${id}-area-${index})`}
              fillOpacity={1}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              stackId={stacked ? "stack" : undefined}
              activeDot={(dot: ActiveDotProps) => (
                <HaloDot
                  key={`${s.key}-${dot.index}`}
                  cx={dot.cx}
                  cy={dot.cy}
                  color={colors[index]!}
                />
              )}
              shape={(shape: AreaRevealShapeProps) => (
                <RisingAreaShape
                  {...shape}
                  maskId={dots ? `${id}-mask` : undefined}
                />
              )}
            />
          ))}
        </AreaChart>
      )}
    </ChartContainer>
  );
}

export { TrendChart };
