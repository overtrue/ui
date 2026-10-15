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
  Label,
  Pie,
  PieChart,
  Sector,
  useIsTooltipActive,
  usePlotArea,
  type PieSectorShapeProps,
} from "recharts-analytics";

import { cn } from "@/lib/utils";
import { formatNumber } from "./metric-format";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  type ChartConfig,
} from "./analytics-chart";

export interface DonutSlice {
  name: string;
  value: number;
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
}

export interface DonutChartProps extends Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
> {
  data: DonutSlice[];
  /** Inner radius as a fraction of the outer radius. 0 draws a pie. */
  innerRadius?: number;
  /** Label shown in the middle, under the value. */
  centerLabel?: React.ReactNode;
  /** Value shown in the middle. Defaults to the total. */
  centerValue?: React.ReactNode;
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  /** "bottom" wraps the legend under the ring; "right" lists each slice with its value and share beside it. */
  legendPosition?: "bottom" | "right";
  showTooltip?: boolean;
  /** Angle where the first slice starts, in degrees. */
  startAngle?: number;
  /** Total sweep in degrees. 180 draws a half donut. */
  sweep?: number;
  paddingAngle?: number;
  /** Animate slices after hydration and when data changes. Respects reduced motion. */
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

const EASE = "cubic-bezier(0.22,1,0.36,1)" as const;
/** How far a hovered slice grows outward, in px. */
const EXPAND = 5;

/**
 * One ring segment: rounded ends, a soft radial falloff toward the hole, and
 * outward growth while hovered or focused. Other segments dim meanwhile.
 */
function DonutSector({
  gradientId,
  highlighted,
  ...props
}: PieSectorShapeProps & {
  gradientId: string;
  /** Index held by the legend, which takes precedence over the tooltip. */
  highlighted: number | null;
}) {
  const tooltipActive = useIsTooltipActive();
  const { cx = 0, cy = 0, innerRadius = 0, outerRadius = 0, index } = props;
  const active =
    highlighted != null ? highlighted === index : props.isActive;
  const dimmed = highlighted != null ? !active : tooltipActive && !active;
  const thickness = outerRadius - innerRadius;
  const fill = String(props.fill);
  return (
    <g
      data-slot="donut-chart-slice"
      data-active={active || undefined}
      className="transition-opacity duration-150 ease-out motion-reduce:transition-none"
      style={{ opacity: dimmed ? 0.4 : 1 }}
    >
      <defs>
        <radialGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          cx={cx}
          cy={cy}
          r={outerRadius + EXPAND}
        >
          <stop
            offset={innerRadius / (outerRadius + EXPAND)}
            stopColor={fill}
            stopOpacity={innerRadius > 0 ? 0.74 : 0.9}
          />
          <stop offset={1} stopColor={fill} stopOpacity={1} />
        </radialGradient>
      </defs>
      <Sector
        cx={cx}
        cy={cy}
        startAngle={props.startAngle}
        endAngle={props.endAngle}
        innerRadius={innerRadius}
        outerRadius={outerRadius + (active ? EXPAND : 0)}
        cornerRadius={innerRadius > 0 ? Math.min(6, thickness / 2) : 2}
        fill={`url(#${gradientId})`}
        stroke="none"
        className="outline-hidden"
      />
    </g>
  );
}

/**
 * The ring itself. An upper half ring sits on the bottom of the plot and fills
 * its width, so a half donut never leaves an empty lower half behind.
 */
function DonutRing({
  upperHalf,
  innerFraction,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Pie>, "innerRadius" | "outerRadius"> & {
  upperHalf: boolean;
  innerFraction: number;
}) {
  const plot = usePlotArea();
  if (upperHalf && plot && plot.width > 0 && plot.height > 0) {
    const radius = Math.min(plot.width / 2, plot.height);
    return (
      <Pie
        {...props}
        cx={plot.x + plot.width / 2}
        cy={plot.y + plot.height}
        innerRadius={radius * innerFraction}
        outerRadius={radius}
      >
        {children}
      </Pie>
    );
  }
  return (
    <Pie
      {...props}
      innerRadius={`${innerFraction * 100}%`}
      outerRadius="100%"
    >
      {children}
    </Pie>
  );
}

function DonutChart({
  data,
  innerRadius = 0.7,
  centerLabel,
  centerValue,
  valueFormatter = (value) => formatNumber(value, { format: "compact" }),
  showLegend = false,
  legendPosition = "bottom",
  showTooltip = true,
  startAngle = 90,
  sweep = 360,
  paddingAngle = 2,
  animate = true,
  animationDuration = 500,
  className,
  ...props
}: DonutChartProps) {
  const id = React.useId().replace(/:/g, "");
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [highlighted, setHighlighted] = React.useState<number | null>(null);
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  const slices = data.map((slice, index) => ({
    ...slice,
    key: slice.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    fill: slice.color ?? `var(--color-chart-${(index % 5) + 1})`,
    share: total > 0 ? slice.value / total : 0,
  }));
  const config = Object.fromEntries(
    slices.map((slice) => [
      slice.key,
      { label: slice.name, color: slice.fill },
    ]),
  ) satisfies ChartConfig;
  const center = centerValue ?? valueFormatter(total);
  const side = showLegend && legendPosition === "right";
  const upperHalf = startAngle === 180 && sweep <= 180;
  const percent = (share: number) =>
    formatNumber(share, { format: "percent", maximumFractionDigits: 1 });

  return (
    <ChartContainer
      data-slot="donut-chart"
      data-legend={showLegend ? legendPosition : undefined}
      config={config}
      className={cn(
        "@container/donut mx-auto w-full max-h-64 tabular-nums [&_.recharts-surface]:overflow-visible",
        side || upperHalf ? "aspect-[2/1]" : "aspect-square",
        FOCUS,
        className,
      )}
      {...props}
    >
      <PieChart margin={{ top: EXPAND, right: EXPAND, bottom: EXPAND, left: EXPAND }}>
        <ChartTooltip
          cursor={false}
          isAnimationActive={false}
          content={({ active, payload }) => {
            const item = payload?.[0];
            if (!showTooltip || !active || !item) return null;
            const slice = slices.find(
              (entry) => entry.key === (item.payload as { key?: string })?.key,
            );
            if (!slice) return null;
            return (
              <div
                data-slot="donut-chart-tooltip"
                className="min-w-40 rounded-xl border border-border/70 bg-popover/90 px-3 py-2 text-xs text-popover-foreground shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: slice.fill }}
                  />
                  <span className="text-muted-foreground">{slice.name}</span>
                  <span className="ml-auto pl-4 font-medium text-foreground tabular-nums">
                    {valueFormatter(slice.value)}
                  </span>
                </div>
                <div className="mt-0.5 pl-4 text-muted-foreground tabular-nums">
                  {percent(slice.share)} of total
                </div>
              </div>
            );
          }}
        />
        <DonutRing
          upperHalf={upperHalf}
          innerFraction={innerRadius}
          data={slices}
          dataKey="value"
          nameKey="key"
          startAngle={startAngle}
          endAngle={startAngle - sweep}
          paddingAngle={paddingAngle}
          strokeWidth={0}
          cornerRadius={2}
          isAnimationActive={animate && !reducedMotion}
          animationDuration={animationDuration + 200}
          animationEasing={EASE}
          shape={(shape: PieSectorShapeProps) => {
            // Recharts passes the React key inside the props; keep it out of the spread.
            const { key, ...sector } = shape as PieSectorShapeProps & {
              key?: React.Key;
            };
            return (
              <DonutSector
                key={key}
                {...sector}
                gradientId={`${id}-slice-${sector.index}`}
                highlighted={highlighted}
              />
            );
          }}
        >
          {innerRadius > 0 && (center || centerLabel) ? (
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                  return null;
                const cx = Number(viewBox.cx);
                const half = sweep < 360;
                // The figure scales with the hole so it never crowds the ring.
                const hole =
                  "innerRadius" in viewBox ? Number(viewBox.innerRadius) : 80;
                const size = Math.round(
                  Math.max(15, Math.min(28, hole * (upperHalf ? 0.36 : 0.42))),
                );
                const gap = Math.round(size * 0.55 + 8);
                // An upper half ring centers its figure just above the flat edge.
                const cy = upperHalf
                  ? Number(viewBox.cy) - (centerLabel ? gap + size * 0.45 : size * 0.5)
                  : Number(viewBox.cy) -
                    (half ? 14 : centerLabel ? gap * 0.4 : 0);
                return (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    data-slot="donut-chart-center"
                  >
                    <tspan
                      x={cx}
                      y={cy}
                      className="fill-foreground font-semibold tracking-[-0.035em] tabular-nums"
                      style={{ fontSize: size }}
                    >
                      {center}
                    </tspan>
                    {centerLabel ? (
                      <tspan
                        x={cx}
                        y={cy + gap}
                        className="fill-muted-foreground"
                        style={{ fontSize: size < 20 ? 11 : 12 }}
                      >
                        {centerLabel}
                      </tspan>
                    ) : null}
                  </text>
                );
              }}
            />
          ) : null}
        </DonutRing>
        {showLegend ? (
          <ChartLegend
            layout={side ? "vertical" : "horizontal"}
            align={side ? "right" : "center"}
            verticalAlign={side ? "middle" : "bottom"}
            content={() => (
              <ul
                data-slot="donut-chart-legend"
                aria-label="Legend"
                className={cn(
                  "m-0 list-none p-0 text-xs",
                  side
                    ? "grid w-max max-w-72 gap-0.5 pl-3 @md/donut:pl-6"
                    : "flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-4",
                )}
                onMouseLeave={() => setHighlighted(null)}
              >
                {slices.map((slice, index) => (
                  <li
                    key={slice.key}
                    data-active={highlighted === index || undefined}
                    onMouseEnter={() => setHighlighted(index)}
                    className={cn(
                      "flex min-w-0 items-center gap-2 transition-opacity duration-150 motion-reduce:transition-none",
                      side && "-mx-2 rounded-md px-2 py-1.5 hover:bg-muted/60",
                      highlighted != null &&
                        highlighted !== index &&
                        "opacity-50",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: slice.fill }}
                    />
                    <span
                      className={cn(
                        "text-muted-foreground",
                        side && "min-w-0 flex-1 truncate",
                      )}
                    >
                      {slice.name}
                    </span>
                    {side ? (
                      <span className="ml-3 hidden min-w-10 text-right font-medium text-foreground tabular-nums @md/donut:inline">
                        {valueFormatter(slice.value)}
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        "tabular-nums",
                        side
                          ? "ml-2 w-10 text-right text-muted-foreground"
                          : "font-medium text-foreground",
                      )}
                    >
                      {percent(slice.share)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          />
        ) : null}
      </PieChart>
    </ChartContainer>
  );
}

export { DonutChart };
