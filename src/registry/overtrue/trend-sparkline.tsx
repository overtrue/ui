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
  type AreaRevealShapeProps,
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

function Sparkline({
  data,
  variant = "area",
  fill = "gradient",
  color = "var(--color-primary)",
  curve = "monotone",
  strokeWidth = 1.5,
  animate = true,
  animationDuration = 500,
  className,
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

  return (
    <div
      data-slot="sparkline"
      aria-hidden="true"
      className={cn("h-10 w-full", className)}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {variant === "line" ? (
          <LineChart data={points} margin={margin}>
            <Line
              type={curve}
              dataKey="y"
              stroke={color}
              strokeWidth={strokeWidth}
              dot={false}
              isAnimationActive={animationActive}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          </LineChart>
        ) : (
          <AreaChart data={points} margin={margin}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={color}
                  stopOpacity={dots ? 0.08 : 0.3}
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
            <Area
              type={curve}
              dataKey="y"
              stroke={color}
              strokeWidth={strokeWidth}
              fill={`url(#${id})`}
              fillOpacity={dots ? 1 : undefined}
              dot={false}
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
