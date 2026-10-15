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
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
} from "recharts-analytics";

import { cn } from "@/lib/utils";
import { formatNumber } from "./metric-format";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  type ChartConfig,
} from "./analytics-chart";

export interface RadarSeries {
  /** Key in each data row. */
  key: string;
  label: string;
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
}

export interface RadarChartProps extends Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
> {
  data: Record<string, unknown>[];
  /** Key of the category label in each row, one per spoke. */
  angleKey: string;
  series: RadarSeries[];
  /** "filled" shades the area, "line" draws only the outline, "dots" adds a dot at every vertex. */
  variant?: "filled" | "line" | "dots";
  /** Shape of the background grid rings. */
  grid?: "polygon" | "circle" | "none";
  /** Show the category label at the end of each spoke. */
  showAngleLabels?: boolean;
  /** Show value ticks along the vertical spoke. */
  showRadiusAxis?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  /** Recharts domain for the value axis, e.g. [0, 100]. Defaults to [0, "auto"]. */
  domain?: React.ComponentProps<typeof PolarRadiusAxis>["domain"];
  valueFormatter?: (value: number) => string;
  /** Animate polygons after hydration and when data changes. Respects reduced motion. */
  animate?: boolean;
  animationDuration?: number;
}

const EASE = "cubic-bezier(0.22,1,0.36,1)";
const GRID = "color-mix(in oklab, var(--color-foreground) 8%, transparent)";

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

interface RadarPoint {
  x: number;
  y: number;
  cx: number;
  cy: number;
  radius: number;
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

/** Recharts passes `[name]` through, so a key is safe to use in an SVG id. */
function idSafe(key: string) {
  return key.replace(/[^a-zA-Z0-9_-]/g, "_");
}

interface ResolvedSeries {
  key: string;
  label: string;
  color: string;
}

function RadarTooltipContent({
  active,
  payload,
  label,
  series,
  valueFormatter,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: unknown }>;
  label?: unknown;
  series: ResolvedSeries[];
  valueFormatter: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const values = new Map(
    payload.map((item) => [String(item.dataKey), item.value]),
  );
  return (
    <div className="grid min-w-40 gap-1.5 rounded-xl border border-border/70 bg-popover/90 px-3 py-2.5 text-xs text-popover-foreground shadow-xl backdrop-blur-md">
      {label != null && label !== "" ? (
        <p className="m-0 font-medium text-foreground">{String(label)}</p>
      ) : null}
      <div className="grid gap-1">
        {series
          .filter((s) => values.has(s.key))
          .map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-[3px] shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-muted-foreground">{s.label}</span>
              <span className="ml-auto pl-4 font-medium text-foreground tabular-nums">
                {valueFormatter(Number(values.get(s.key)))}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

/** A radar chart on shadcn's chart primitives: filled, outlined, or dotted, with one polygon per series. */
function RadarChart({
  data,
  angleKey,
  series,
  variant = "filled",
  grid = "polygon",
  showAngleLabels = true,
  showRadiusAxis = false,
  showLegend = false,
  showTooltip = true,
  domain,
  valueFormatter = (value) => formatNumber(value, { format: "compact" }),
  animate = true,
  animationDuration = 700,
  className,
  ...props
}: RadarChartProps) {
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [activeLabel, setActiveLabel] = React.useState<string | null>(null);
  const [focusKey, setFocusKey] = React.useState<string | null>(null);

  const resolved: ResolvedSeries[] = series.map((s, index) => ({
    key: s.key,
    label: s.label,
    color: s.color ?? `var(--color-chart-${(index % 5) + 1})`,
  }));
  const config = Object.fromEntries(
    resolved.map((s) => [s.key, { label: s.label, color: s.color }]),
  ) satisfies ChartConfig;
  const motion = animate && !reducedMotion;

  const renderShape = (s: ResolvedSeries) =>
    function RadarShape(shapeProps: { points?: RadarPoint[] }) {
      const points = shapeProps.points ?? [];
      if (!points.length) return <g />;
      const { cx, cy } = points[0]!;
      const reach = Math.max(1, ...points.map((p) => p.radius));
      const d = `${points
        .map((p, i) => `${i ? "L" : "M"}${round(p.x)},${round(p.y)}`)
        .join(" ")} Z`;
      const color = `var(--color-${s.key})`;
      const gradientId = `${uid}-radar-${idSafe(s.key)}`;
      const dimmed = focusKey !== null && focusKey !== s.key;
      return (
        <g
          data-slot="radar-chart-series"
          data-series={s.key}
          className="transition-opacity duration-150 motion-reduce:transition-none"
          style={{ opacity: dimmed ? 0.25 : 1 }}
        >
          {variant === "filled" ? (
            <>
              <defs>
                <radialGradient
                  id={gradientId}
                  gradientUnits="userSpaceOnUse"
                  cx={round(cx)}
                  cy={round(cy)}
                  r={round(reach)}
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.04} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                </radialGradient>
              </defs>
              <path d={d} fill={`url(#${gradientId})`} stroke="none" />
            </>
          ) : null}
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            className="dark:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,var(--radar-glow)_50%,transparent))]"
            style={{ ["--radar-glow" as string]: color }}
          />
        </g>
      );
    };

  const renderDot = (s: ResolvedSeries) =>
    function RadarDot(dotProps: { cx?: number; cy?: number }) {
      const { cx, cy } = dotProps;
      if (cx == null || cy == null) return <g />;
      const color = `var(--color-${s.key})`;
      const dimmed = focusKey !== null && focusKey !== s.key;
      return (
        <g
          className="transition-opacity duration-150 motion-reduce:transition-none"
          style={{ opacity: dimmed ? 0.25 : 1 }}
        >
          <circle cx={cx} cy={cy} r={6} fill={color} fillOpacity={0.18} />
          <circle
            cx={cx}
            cy={cy}
            r={3}
            fill={color}
            stroke="var(--color-card)"
            strokeWidth={1.5}
          />
        </g>
      );
    };

  const renderActiveDot = (s: ResolvedSeries) =>
    function RadarActiveDot(dotProps: { cx?: number; cy?: number }) {
      const { cx, cy } = dotProps;
      if (cx == null || cy == null) return <g />;
      const color = `var(--color-${s.key})`;
      return (
        <g data-slot="radar-chart-active-dot" pointerEvents="none">
          <circle cx={cx} cy={cy} r={9} fill={color} fillOpacity={0.16} />
          <circle
            cx={cx}
            cy={cy}
            r={4}
            fill={color}
            stroke="var(--color-card)"
            strokeWidth={2}
          />
        </g>
      );
    };

  return (
    <ChartContainer
      data-slot="radar-chart"
      data-variant={variant}
      config={config}
      className={cn("aspect-auto h-64 w-full", className)}
      {...props}
    >
      <RechartsRadarChart
        data={data}
        margin={{ top: 12, right: 28, bottom: 12, left: 28 }}
        onMouseMove={(state) =>
          setActiveLabel(
            state?.isTooltipActive && state.activeLabel != null
              ? String(state.activeLabel)
              : null,
          )
        }
        onMouseLeave={() => setActiveLabel(null)}
      >
        {grid !== "none" ? (
          <PolarGrid
            gridType={grid}
            stroke={GRID}
            fill="color-mix(in oklab, var(--color-foreground) 2%, transparent)"
          />
        ) : null}
        <PolarAngleAxis
          dataKey={angleKey}
          tickLine={false}
          axisLine={false}
          tick={
            showAngleLabels
              ? (tickProps: {
                  x: number | string;
                  y: number | string;
                  textAnchor?: string;
                  verticalAnchor?: string;
                  payload?: { value?: unknown };
                }) => {
                  const value = String(tickProps.payload?.value ?? "");
                  const isActive = activeLabel === value;
                  const dy =
                    tickProps.verticalAnchor === "end"
                      ? -2
                      : tickProps.verticalAnchor === "start"
                        ? 9
                        : 3.5;
                  return (
                    <text
                      x={tickProps.x}
                      y={tickProps.y}
                      dy={dy}
                      textAnchor={
                        tickProps.textAnchor as "start" | "middle" | "end"
                      }
                      data-active={isActive || undefined}
                      className={cn(
                        "fill-muted-foreground text-[11px] transition-[fill] duration-150 motion-reduce:transition-none",
                        isActive && "fill-foreground font-medium",
                      )}
                    >
                      {value}
                    </text>
                  );
                }
              : false
          }
        />
        <PolarRadiusAxis
          // Run the value ticks between the first two spokes so they never sit on a line.
          angle={data.length > 2 ? 90 - 180 / data.length : 90}
          domain={domain}
          axisLine={false}
          tick={
            showRadiusAxis
              ? (tickProps: {
                  x: number | string;
                  y: number | string;
                  payload?: { value?: unknown };
                }) => {
                  const value = Number(tickProps.payload?.value);
                  if (!Number.isFinite(value) || value === 0) return <g />;
                  return (
                    <text
                      x={tickProps.x}
                      y={tickProps.y}
                      dx={3}
                      dy={3.5}
                      textAnchor="start"
                      stroke="var(--color-card)"
                      strokeWidth={3}
                      paintOrder="stroke"
                      className="fill-muted-foreground text-[10px] tabular-nums"
                    >
                      {valueFormatter(value)}
                    </text>
                  );
                }
              : false
          }
        />
        {showTooltip ? (
          <ChartTooltip
            cursor={{
              stroke:
                "color-mix(in oklab, var(--color-foreground) 25%, transparent)",
              strokeWidth: 1,
            }}
            isAnimationActive={false}
            content={(tooltipProps) => (
              <RadarTooltipContent
                active={tooltipProps.active}
                payload={
                  tooltipProps.payload as ReadonlyArray<{
                    dataKey?: unknown;
                    value?: unknown;
                  }>
                }
                label={tooltipProps.label}
                series={resolved}
                valueFormatter={valueFormatter}
              />
            )}
          />
        ) : null}
        {showLegend ? (
          <ChartLegend
            content={() => (
              <div
                data-slot="radar-chart-legend"
                className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-4"
                onPointerLeave={() => setFocusKey(null)}
              >
                {resolved.map((s) => (
                  <span
                    key={s.key}
                    onPointerEnter={() => setFocusKey(s.key)}
                    className={cn(
                      "flex cursor-default items-center gap-1.5 text-xs text-muted-foreground transition-[color,opacity] duration-150 motion-reduce:transition-none",
                      focusKey === s.key && "text-foreground",
                      focusKey !== null && focusKey !== s.key && "opacity-50",
                    )}
                  >
                    <svg
                      aria-hidden="true"
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                    >
                      <line
                        x1="1"
                        x2="13"
                        y1="4"
                        y2="4"
                        stroke={s.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="7" cy="4" r="2.5" fill={s.color} />
                    </svg>
                    {s.label}
                  </span>
                ))}
              </div>
            )}
          />
        ) : null}
        {resolved.map((s) => {
          const color = `var(--color-${s.key})`;
          return (
            <Radar
              key={s.key}
              dataKey={s.key}
              name={s.key}
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={variant === "filled" ? 0.25 : 0}
              shape={renderShape(s)}
              dot={variant === "dots" ? renderDot(s) : false}
              activeDot={renderActiveDot(s)}
              isAnimationActive={motion}
              animationDuration={animationDuration}
              animationEasing={EASE}
            />
          );
        })}
      </RechartsRadarChart>
    </ChartContainer>
  );
}

export { RadarChart };
