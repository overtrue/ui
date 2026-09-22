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

export interface ActivityRing {
  label: string;
  /** Progress toward `max`. Values past `max` draw a full ring. */
  value: number;
  /** Goal for the ring. Defaults to 100. */
  max?: number;
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
}

export interface ActivityRingsProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** Outermost ring first. */
  rings: ActivityRing[];
  /** Diameter in pixels. */
  size?: number;
  /** Stroke width of each ring in pixels. */
  thickness?: number;
  /** Space between rings in pixels. */
  gap?: number;
  /** Opacity of the unfilled track, drawn in the ring's color. */
  trackOpacity?: number;
  /** Ring drawn at full strength while the rest dim. `null` shows every ring. */
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  /** Content rendered in the middle. */
  children?: React.ReactNode;
}

const defaultColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

// Round so server and client render identical attributes.
const round = (n: number) => Math.round(n * 1000) / 1000;

/** Concentric progress rings, one per goal, in the style of a fitness watch. */
function ActivityRings({
  rings,
  size = 160,
  thickness = 12,
  gap = 4,
  trackOpacity = 0.2,
  activeIndex: activeProp,
  onActiveIndexChange,
  className,
  children,
  ...props
}: ActivityRingsProps) {
  const [activeState, setActiveState] = React.useState<number | null>(null);
  const active = activeProp === undefined ? activeState : activeProp;
  const setActive = (index: number | null) => {
    setActiveState(index);
    onActiveIndexChange?.(index);
  };

  const center = size / 2;
  const label = rings
    .map((ring) => {
      const max = ring.max ?? 100;
      return `${ring.label} ${Math.round((ring.value / (max || 1)) * 100)}%`;
    })
    .join(", ");

  return (
    <div
      data-slot="activity-rings"
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={label}
        className="absolute inset-0 -rotate-90"
      >
        {rings.map((ring, index) => {
          const max = ring.max ?? 100;
          const fraction = Math.min(1, Math.max(0, ring.value / (max || 1)));
          const r = center - thickness / 2 - index * (thickness + gap);
          if (r <= 0) return null;
          const color =
            ring.color ?? defaultColors[index % defaultColors.length];
          const dimmed = active !== null && active !== index;
          return (
            <g
              key={ring.label}
              data-ring=""
              data-active={active === index || undefined}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              className="transition-opacity duration-200"
              style={{ opacity: dimmed ? 0.35 : 1 }}
            >
              <circle
                cx={center}
                cy={center}
                r={round(r)}
                fill="none"
                stroke={color}
                strokeOpacity={trackOpacity}
                strokeWidth={thickness}
              />
              {fraction > 0 ? (
                <circle
                  cx={center}
                  cy={center}
                  r={round(r)}
                  fill="none"
                  stroke={color}
                  strokeWidth={thickness}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={round(1 - fraction)}
                  className="transition-[stroke-dashoffset] duration-700 ease-out"
                />
              ) : null}
            </g>
          );
        })}
      </svg>
      {children ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export { ActivityRings };
