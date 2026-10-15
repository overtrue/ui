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
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  type AreaRevealShapeProps,
  type TooltipContentProps,
} from "recharts-analytics";

import { cn } from "@/lib/utils";

export interface SparklineProps extends React.ComponentProps<"div"> {
  /** Series to plot, oldest first. */
  data: number[];
  variant?: "area" | "line";
  /** Area fill: a plain gradient, or a dot grid that fades out toward the line. */
  fill?: "gradient" | "dots";
  /** Any CSS color. Defaults to the theme primary. */
  color?: string;
  curve?: "monotone" | "linear" | "step";
  strokeWidth?: number;
  /** Animate after hydration and when data changes. Respects reduced motion. */
  animate?: boolean;
  animationDuration?: number;
  /** Mark the most recent value with a haloed point. */
  endpoint?: boolean;
  /** Show a hover and keyboard readout of each value. */
  tooltip?: boolean;
  /** Formats values in the readout. */
  valueFormatter?: (value: number, index: number) => string;
}

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

const defaultFormatter = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });

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

/** A solid point with a soft halo, used for the latest value and the hovered one. */
function HaloDot({
  cx,
  cy,
  color,
  className,
  style,
}: {
  cx?: number;
  cy?: number;
  color: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (cx == null || cy == null) return null;
  return (
    <g className={className} style={style}>
      <circle cx={cx} cy={cy} r={5.25} fill={color} fillOpacity={0.18} />
      <circle
        cx={cx}
        cy={cy}
        r={2.75}
        fill={color}
        stroke="var(--color-card)"
        strokeWidth={1.5}
      />
    </g>
  );
}

function SparklineTooltip({
  active,
  payload,
  color,
  format,
}: Pick<Partial<TooltipContentProps>, "active" | "payload"> & {
  color: string;
  format: (value: number, index: number) => string;
}) {
  const entry = payload?.[0];
  if (!active || !entry || typeof entry.value !== "number") return null;
  const index = (entry.payload as { i: number } | undefined)?.i ?? 0;
  return (
    <div
      data-slot="sparkline-tooltip"
      className="flex items-center gap-2 rounded-xl border border-border/70 bg-popover/90 px-2.5 py-1.5 text-xs text-popover-foreground shadow-xl backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="font-medium tabular-nums">
        {format(entry.value, index)}
      </span>
    </div>
  );
}

function Sparkline({
  data,
  variant = "area",
  fill = "gradient",
  color = "var(--color-primary)",
  curve = "monotone",
  strokeWidth = 2,
  animate = true,
  animationDuration = 700,
  endpoint = true,
  tooltip = false,
  valueFormatter = defaultFormatter,
  className,
  style,
  ...props
}: SparklineProps) {
  const id = React.useId();
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const animationActive = animate && !reducedMotion;
  const dots = variant === "area" && fill === "dots";
  const points = React.useMemo(() => data.map((y, i) => ({ i, y })), [data]);
  const margin = { top: 2, right: 0, bottom: 0, left: 0 };
  // Scale to the data, not to zero, so the shape of the trend reads at any size.
  const domain = React.useMemo((): [number, number] => {
    const values = data.filter(Number.isFinite);
    if (!values.length) return [0, 1];
    const low = Math.min(...values);
    const high = Math.max(...values);
    const pad = high === low ? Math.abs(high) * 0.1 || 1 : (high - low) * 0.12;
    return [low - pad * 1.5, high + pad];
  }, [data]);
  const axis = <YAxis hide domain={domain} />;
  const last = points.length - 1;
  const dot = endpoint
    ? (dotProps: { cx?: number; cy?: number; index: number }) =>
        dotProps.index === last ? (
          <HaloDot
            key="endpoint"
            cx={dotProps.cx}
            cy={dotProps.cy}
            color={color}
            className={cn(
              "transition-opacity duration-300 ease-out",
              animationActive && "starting:opacity-0",
            )}
            style={
              animationActive
                ? { transitionDelay: `${animationDuration}ms` }
                : undefined
            }
          />
        ) : null
    : false;
  const activeDot = tooltip
    ? (dotProps: { cx?: number; cy?: number }) => (
        <HaloDot cx={dotProps.cx} cy={dotProps.cy} color={color} />
      )
    : false;
  const readout = tooltip ? (
    <Tooltip
      cursor={{
        stroke: "color-mix(in oklab, var(--color-foreground) 25%, transparent)",
        strokeWidth: 1,
      }}
      isAnimationActive={false}
      allowEscapeViewBox={{ x: true, y: true }}
      offset={12}
      wrapperStyle={{ outline: "none", zIndex: 10 }}
      content={(contentProps) => (
        <SparklineTooltip
          active={contentProps.active}
          payload={contentProps.payload}
          color={color}
          format={valueFormatter}
        />
      )}
    />
  ) : null;

  return (
    <div
      data-slot="sparkline"
      data-variant={variant}
      aria-hidden={tooltip ? undefined : true}
      className={cn(
        "h-10 w-full [&_.recharts-surface]:overflow-visible",
        // In dark mode the line glows in its own color.
        "dark:[&_:is(.recharts-area-curve,.recharts-line-curve)]:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,var(--sparkline-color)_50%,transparent))]",
        className,
      )}
      style={{ ...style, ["--sparkline-color" as string]: color }}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {variant === "line" ? (
          <LineChart data={points} margin={margin} accessibilityLayer={tooltip}>
            {axis}
            {readout}
            <Line
              type={curve}
              dataKey="y"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={dot}
              activeDot={activeDot}
              isAnimationActive={animationActive}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          </LineChart>
        ) : (
          <AreaChart data={points} margin={margin} accessibilityLayer={tooltip}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={color}
                  stopOpacity={dots ? 0.08 : 0.32}
                />
                <stop
                  offset="100%"
                  stopColor={color}
                  stopOpacity={dots ? 0.9 : 0}
                />
              </linearGradient>
              {dots ? (
                <>
                  <pattern
                    id={`${id}-dots`}
                    patternUnits="userSpaceOnUse"
                    width={4}
                    height={4}
                  >
                    <circle cx={2} cy={2} r={0.9} fill="#fff" />
                  </pattern>
                  <mask
                    id={`${id}-mask`}
                    maskUnits="userSpaceOnUse"
                    x={0}
                    y={0}
                    width="100%"
                    height="100%"
                  >
                    <rect
                      width="100%"
                      height="100%"
                      fill={`url(#${id}-dots)`}
                    />
                  </mask>
                </>
              ) : null}
            </defs>
            {axis}
            {readout}
            <Area
              type={curve}
              dataKey="y"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${id})`}
              fillOpacity={dots ? 1 : undefined}
              dot={dot}
              activeDot={activeDot}
              isAnimationActive={animationActive}
              animationDuration={animationDuration}
              animationEasing="ease-out"
              shape={
                dots
                  ? (shapeProps: AreaRevealShapeProps) => (
                      <DotGridAreaShape {...shapeProps} maskId={`${id}-mask`} />
                    )
                  : undefined
              }
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export { Sparkline };
