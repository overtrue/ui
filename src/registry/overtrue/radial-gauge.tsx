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
import * as React from "react";

import { cn } from "@/lib/utils";

export interface RadialGaugeProps extends React.ComponentProps<"div"> {
  value: number;
  min?: number;
  max?: number;
  /** Diameter in pixels. */
  size?: number;
  /** Stroke width in pixels. */
  thickness?: number;
  /** Number of arc segments. 0 draws a continuous arc. */
  segments?: number;
  /** Gap between segments in degrees. */
  gap?: number;
  /** Angle where the arc starts, in degrees clockwise from 12 o'clock. */
  startAngle?: number;
  /** Total sweep of the arc in degrees. 180 is a semicircle, 360 a ring. */
  sweep?: number;
  /** Any CSS color. Defaults to chart-1. */
  color?: string;
  trackColor?: string;
  /** Reveal filled segments in sequence when the gauge mounts. */
  animate?: boolean;
  /** Total reveal time in milliseconds. */
  animationDuration?: number;
  /** Content rendered in the middle of the gauge. */
  children?: React.ReactNode;
}

// Round so server and client render identical path strings.
const round = (n: number) => Math.round(n * 1000) / 1000;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: round(cx + r * Math.cos(rad)), y: round(cy + r * Math.sin(rad)) };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const start = polar(cx, cy, r, from);
  const end = polar(cx, cy, r, to);
  const largeArc = to - from > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function RadialGauge({
  value,
  min = 0,
  max = 100,
  size = 160,
  thickness = 10,
  segments = 0,
  gap = 2,
  startAngle,
  sweep = 180,
  color = "var(--color-chart-1)",
  trackColor = "var(--color-muted)",
  animate = false,
  animationDuration = 700,
  className,
  children,
  ...props
}: RadialGaugeProps) {
  const fraction = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
  const start = startAngle ?? (sweep >= 360 ? 0 : -sweep / 2);
  const r = size / 2 - thickness / 2;
  const cx = size / 2;
  const cy = size / 2;
  // Trim the box to the arc's vertical extent so a semicircle does not
  // reserve a full circle of space.
  const angles = Array.from({ length: 64 }, (_, i) => start + (sweep * i) / 63);
  const ys = angles.map((a) => polar(cx, cy, r, a).y);
  const top = Math.max(0, Math.min(...ys) - thickness / 2);
  const bottom = Math.min(size, Math.max(...ys) + thickness / 2);
  const height = bottom - top;

  const arcs: { from: number; to: number; filled: boolean }[] = [];
  if (segments > 0) {
    const step = sweep / segments;
    for (let i = 0; i < segments; i++) {
      const from = start + i * step + gap / 2;
      const to = start + (i + 1) * step - gap / 2;
      const mid = (i + 0.5) / segments;
      arcs.push({ from, to, filled: mid <= fraction });
    }
  }

  return (
    <div
      data-slot="radial-gauge"
      role="meter"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height }}
      {...props}
    >
      <svg
        width={size}
        height={height}
        viewBox={`0 ${top} ${size} ${height}`}
        className="absolute inset-0"
        aria-hidden="true"
      >
        {segments > 0 ? (
          arcs.map((arc, index) => {
            const path = arcPath(cx, cy, r, arc.from, arc.to);
            const filledCount = Math.max(1, Math.round(fraction * segments));
            const delay = (index / filledCount) * animationDuration * 0.8;

            return (
              <g key={index}>
                <path
                  d={path}
                  fill="none"
                  stroke={trackColor}
                  strokeWidth={thickness}
                  strokeLinecap="butt"
                />
                {arc.filled ? (
                  <path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth={thickness}
                    strokeLinecap="butt"
                    className={cn(
                      animate && "motion-safe:animate-in motion-safe:fade-in",
                    )}
                    style={
                      animate
                        ? {
                            animationDelay: `${delay}ms`,
                            animationDuration: `${Math.max(120, animationDuration * 0.25)}ms`,
                            animationFillMode: "both",
                          }
                        : undefined
                    }
                  />
                ) : null}
              </g>
            );
          })
        ) : (
          <>
            <path
              d={arcPath(
                cx,
                cy,
                r,
                start,
                start + sweep - (sweep >= 360 ? 0.01 : 0),
              )}
              fill="none"
              stroke={trackColor}
              strokeWidth={thickness}
              strokeLinecap={sweep >= 360 ? "butt" : "round"}
            />
            {fraction > 0 ? (
              <path
                d={arcPath(cx, cy, r, start, start + sweep * fraction)}
                fill="none"
                stroke={color}
                strokeWidth={thickness}
                strokeLinecap="round"
                className={cn(
                  "transition-[d] duration-500",
                  animate && "motion-safe:animate-in motion-safe:fade-in",
                )}
                style={
                  animate
                    ? { animationDuration: `${animationDuration}ms` }
                    : undefined
                }
              />
            ) : null}
          </>
        )}
      </svg>
      {children ? (
        <div
          className={cn(
            "absolute inset-x-0 flex flex-col items-center justify-center text-center",
            sweep > 200 ? "inset-y-0" : "bottom-0",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export { RadialGauge };
