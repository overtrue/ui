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
  CartesianGrid,
  Scatter,
  ScatterChart as RechartsScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts-analytics";

import { cn } from "@/lib/utils";
import { formatNumber } from "./metric-format";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  type ChartConfig,
} from "./analytics-chart";

export interface ScatterSeries {
  /** Stable identifier. Defaults to a slug of the label. */
  key?: string;
  label: string;
  /** Rows for this series. Each needs the x and y keys, plus the size and name keys when set. */
  data: Record<string, unknown>[];
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
}

export interface ScatterChartProps extends Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
> {
  series: ScatterSeries[];
  /** Key of the x value in each row. */
  xKey: string;
  /** Key of the y value in each row. */
  yKey: string;
  /** Key of a value that scales each point into a bubble. */
  sizeKey?: string;
  /** Key of a per-point label shown as the tooltip title. */
  nameKey?: string;
  /** Names for the tooltip rows. Default to the keys. */
  xLabel?: string;
  yLabel?: string;
  sizeLabel?: string;
  /** Print `xLabel` at the end of the x-axis and `yLabel` above the y-axis. */
  showAxisLabels?: boolean;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  xFormatter?: (value: number) => string;
  yFormatter?: (value: number) => string;
  sizeFormatter?: (value: number) => string;
  /** Radius of each point in px when sizeKey is not set. */
  dotRadius?: number;
  /**
   * Bubble area range in px² when sizeKey is set, smallest to largest. Areas grow
   * in proportion to the value, measured from zero.
   */
  sizeRange?: [number, number];
  /** Recharts domain for the x-axis, e.g. ["auto", "auto"]. Defaults to [0, "auto"]. */
  xDomain?: React.ComponentProps<typeof XAxis>["domain"];
  /** Recharts domain for the y-axis, e.g. ["auto", "auto"]. Defaults to [0, "auto"]. */
  yDomain?: React.ComponentProps<typeof YAxis>["domain"];
  /** Animate points after hydration and when data changes. Respects reduced motion. */
  animate?: boolean;
  animationDuration?: number;
}

const EASE = "cubic-bezier(0.22,1,0.36,1)";
const GRID = "color-mix(in oklab, var(--color-foreground) 7%, transparent)";
const AXIS = "color-mix(in oklab, var(--color-foreground) 14%, transparent)";
const TICK = {
  fill: "var(--color-muted-foreground)",
  fontSize: 11,
  className: "tabular-nums",
};

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

/** Hidden key stamped onto each row so the tooltip can find the point's series. */
const SERIES_KEY = "__scatterSeries";

function slug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

interface ScatterTooltipContentProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
  config: ChartConfig;
  rows: { key: string; label: string; format: (value: number) => string }[];
  nameKey?: string;
}

function ScatterTooltipContent({
  active,
  payload,
  config,
  rows,
  nameKey,
}: ScatterTooltipContentProps) {
  const point = payload?.[0]?.payload as Record<string, unknown> | undefined;
  if (!active || !point) return null;
  const seriesKey = String(point[SERIES_KEY] ?? "");
  const seriesLabel = config[seriesKey]?.label ?? seriesKey;
  const name = nameKey ? point[nameKey] : undefined;
  const title = name != null ? String(name) : seriesLabel;

  return (
    <div className="grid min-w-44 gap-2 rounded-xl border border-border/70 bg-popover/90 px-3 py-2.5 text-xs text-popover-foreground shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-full shadow-[0_0_0_3px_color-mix(in_oklab,var(--scatter-swatch)_20%,transparent)]"
          style={
            {
              backgroundColor: `var(--color-${seriesKey})`,
              "--scatter-swatch": `var(--color-${seriesKey})`,
            } as React.CSSProperties
          }
        />
        <span className="font-medium text-foreground">{title}</span>
        {name != null ? (
          <span className="ml-auto pl-3 text-muted-foreground">
            {seriesLabel}
          </span>
        ) : null}
      </div>
      <div className="grid gap-1">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between gap-6"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium text-foreground tabular-nums">
              {row.format(Number(point[row.key]))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PointShapeProps {
  cx?: number;
  cy?: number;
  size?: number;
  index?: number;
}

/** A scatter chart on shadcn's chart primitives: correlation dots per series, or bubbles when a size key is set. */
function ScatterChart({
  series,
  xKey,
  yKey,
  sizeKey,
  nameKey,
  xLabel,
  yLabel,
  sizeLabel,
  showAxisLabels = false,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  showTooltip = true,
  xFormatter = (value) => formatNumber(value, { format: "compact" }),
  yFormatter = (value) => formatNumber(value, { format: "compact" }),
  sizeFormatter = (value) => formatNumber(value, { format: "compact" }),
  dotRadius = 4,
  sizeRange = [60, 1100],
  xDomain,
  yDomain,
  animate = true,
  animationDuration = 700,
  className,
  ...props
}: ScatterChartProps) {
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [focusKey, setFocusKey] = React.useState<string | null>(null);
  // Recharts marks every series' point at the hovered index as active, so track the real one here.
  const [hovered, setHovered] = React.useState<{
    series: string;
    index: number;
  } | null>(null);
  const resolved = React.useMemo(
    () =>
      series.map((s, index) => {
        const key = s.key ?? slug(s.label);
        const rows = s.data.map((row) => ({ ...row, [SERIES_KEY]: key }));
        // Draw the largest bubbles first so smaller ones stay on top and reachable.
        if (sizeKey)
          rows.sort(
            (a, b) =>
              Number((b as Record<string, unknown>)[sizeKey]) -
              Number((a as Record<string, unknown>)[sizeKey]),
          );
        return {
          key,
          label: s.label,
          color: s.color ?? `var(--color-chart-${(index % 5) + 1})`,
          data: rows,
        };
      }),
    [series, sizeKey],
  );
  const config = Object.fromEntries(
    resolved.map((s) => [s.key, { label: s.label, color: s.color }]),
  ) satisfies ChartConfig;
  const rows = [
    { key: xKey, label: xLabel ?? xKey, format: xFormatter },
    { key: yKey, label: yLabel ?? yKey, format: yFormatter },
    ...(sizeKey
      ? [{ key: sizeKey, label: sizeLabel ?? sizeKey, format: sizeFormatter }]
      : []),
  ];
  // Recharts sizes symbols by area, so a fixed radius becomes a fixed area.
  const dotArea = Math.round(Math.PI * dotRadius * dotRadius);
  const withXTitle = showAxisLabels && showXAxis && !!xLabel;
  const withYTitle = showAxisLabels && showYAxis && !!yLabel;

  const renderPoint = (seriesKey: string) => (shape: PointShapeProps) => {
    const { cx, cy } = shape;
    const isActive =
      hovered?.series === seriesKey && hovered.index === shape.index;
    if (
      cx == null ||
      cy == null ||
      !Number.isFinite(cx) ||
      !Number.isFinite(cy)
    )
      return <g />;
    const r = Math.max(0, Math.sqrt(Math.max(shape.size ?? 0, 0) / Math.PI));
    const color = `var(--color-${seriesKey})`;
    const dimmed = focusKey !== null && focusKey !== seriesKey;
    if (sizeKey) {
      return (
        <g
          data-slot="scatter-chart-point"
          data-series={seriesKey}
          data-active-point={isActive || undefined}
          className="transition-opacity duration-150 motion-reduce:transition-none"
          style={{ opacity: dimmed ? 0.2 : undefined }}
        >
          {isActive ? (
            <circle cx={cx} cy={cy} r={r + 6} fill={color} fillOpacity={0.14} />
          ) : null}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill={`url(#${uid}-bubble-${seriesKey})`}
            stroke={color}
            strokeOpacity={isActive ? 1 : 0.85}
            strokeWidth={isActive ? 2 : 1.25}
          />
        </g>
      );
    }
    return (
      <g
        data-slot="scatter-chart-point"
        data-series={seriesKey}
        data-active-point={isActive || undefined}
        className="transition-opacity duration-150 motion-reduce:transition-none"
        style={{ opacity: dimmed ? 0.2 : undefined }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r + (isActive ? 6 : 3)}
          fill={color}
          fillOpacity={isActive ? 0.2 : 0.16}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r + (isActive ? 1 : 0)}
          fill={color}
          stroke="var(--color-card)"
          strokeWidth={isActive ? 2 : 1}
          className="dark:[filter:drop-shadow(0_0_5px_color-mix(in_oklab,var(--scatter-glow)_55%,transparent))]"
          style={{ ["--scatter-glow" as string]: color }}
        />
      </g>
    );
  };

  return (
    <ChartContainer
      data-slot="scatter-chart"
      data-variant={sizeKey ? "bubble" : "point"}
      config={config}
      className={cn(
        "aspect-auto h-64 w-full",
        // While one point is hovered, the rest step back.
        "[&:has([data-active-point])_[data-slot=scatter-chart-point]:not([data-active-point])]:opacity-35",
        className,
      )}
      {...props}
    >
      <RechartsScatterChart
        margin={{
          top: withYTitle && !showLegend ? 24 : 12,
          right: 12,
          bottom: 0,
          left: showYAxis ? 0 : 8,
        }}
      >
        <defs>
          {resolved.map((s) => (
            <radialGradient
              key={s.key}
              id={`${uid}-bubble-${s.key}`}
              cx="38%"
              cy="32%"
              r="75%"
            >
              <stop
                offset="0%"
                stopColor={`var(--color-${s.key})`}
                stopOpacity={0.62}
              />
              <stop
                offset="100%"
                stopColor={`var(--color-${s.key})`}
                stopOpacity={0.3}
              />
            </radialGradient>
          ))}
        </defs>
        {showGrid ? <CartesianGrid vertical={false} stroke={GRID} /> : null}
        <XAxis
          type="number"
          dataKey={xKey}
          hide={!showXAxis}
          domain={xDomain}
          tickLine={false}
          axisLine={{ stroke: AXIS }}
          tickMargin={8}
          tick={TICK}
          height={withXTitle ? 44 : 30}
          tickFormatter={xFormatter}
          label={
            withXTitle
              ? {
                  content: ({ viewBox }) => {
                    const box = viewBox as
                      { x?: number; y?: number; width?: number } | undefined;
                    if (box?.x == null || box.y == null || box.width == null)
                      return null;
                    return (
                      <text
                        x={box.x + box.width}
                        y={box.y + 38}
                        textAnchor="end"
                        className="fill-muted-foreground text-[11px]"
                      >
                        {xLabel} →
                      </text>
                    );
                  },
                }
              : undefined
          }
        />
        <YAxis
          type="number"
          dataKey={yKey}
          hide={!showYAxis}
          domain={yDomain}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={TICK}
          width="auto"
          tickFormatter={yFormatter}
          label={
            // With a legend, the y title sits at the start of the legend row instead.
            withYTitle && !showLegend
              ? {
                  content: ({ viewBox }) => {
                    const box = viewBox as
                      { x?: number; y?: number } | undefined;
                    if (box?.x == null || box.y == null) return null;
                    return (
                      <text
                        x={box.x}
                        y={box.y - 11}
                        textAnchor="start"
                        className="fill-muted-foreground text-[11px]"
                      >
                        ↑ {yLabel}
                      </text>
                    );
                  },
                }
              : undefined
          }
        />
        {sizeKey ? (
          <ZAxis
            type="number"
            dataKey={sizeKey}
            range={sizeRange}
            domain={[0, "dataMax"]}
          />
        ) : (
          <ZAxis type="number" range={[dotArea, dotArea]} />
        )}
        {showTooltip ? (
          <ChartTooltip
            cursor={{
              stroke:
                "color-mix(in oklab, var(--color-foreground) 25%, transparent)",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
            isAnimationActive={false}
            content={(tooltipProps) => (
              <ScatterTooltipContent
                active={tooltipProps.active}
                payload={
                  tooltipProps.payload as ReadonlyArray<{ payload?: unknown }>
                }
                config={config}
                rows={rows}
                nameKey={nameKey}
              />
            )}
          />
        ) : null}
        {showLegend ? (
          <ChartLegend
            verticalAlign="top"
            align="right"
            content={() => (
              <div
                data-slot="scatter-chart-legend"
                className="flex items-start justify-between gap-4 pb-3"
                onPointerLeave={() => setFocusKey(null)}
              >
                {withYTitle ? (
                  <span className="shrink-0 text-[11px] leading-4 text-muted-foreground">
                    ↑ {yLabel}
                  </span>
                ) : null}
                <span className="ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
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
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full"
                        style={{
                          backgroundColor: s.color,
                          boxShadow: `0 0 0 3px color-mix(in oklab, ${s.color} 18%, transparent)`,
                        }}
                      />
                      {s.label}
                    </span>
                  ))}
                </span>
              </div>
            )}
          />
        ) : null}
        {resolved.map((s) => (
          <Scatter
            key={s.key}
            name={s.key}
            data={s.data}
            fill={`var(--color-${s.key})`}
            shape={renderPoint(s.key)}
            onMouseEnter={(_: unknown, index: number) =>
              setHovered({ series: s.key, index })
            }
            onMouseLeave={() => setHovered(null)}
            isAnimationActive={animate && !reducedMotion}
            animationDuration={animationDuration}
            animationEasing={EASE}
          />
        ))}
      </RechartsScatterChart>
    </ChartContainer>
  );
}

export { ScatterChart };
