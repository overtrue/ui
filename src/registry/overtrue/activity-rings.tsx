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
const EASE = "cubic-bezier(0.22,1,0.36,1)";

// Round so server and client render identical attributes.
const round = (n: number) => Math.round(n * 1000) / 1000;

/** Keeps the center content inside the innermost ring: it wraps first, then scales down. */
function CenterFit({
  diameter,
  children,
}: {
  diameter: number;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      // A box fits a circle when its diagonal does.
      const diagonal = Math.hypot(element.offsetWidth, element.offsetHeight);
      setScale(diagonal > diameter && diagonal > 0 ? diameter / diagonal : 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [diameter]);
  return (
    <div
      ref={ref}
      data-slot="activity-rings-content"
      className="flex flex-col items-center justify-center text-center leading-tight text-balance"
      style={{ maxWidth: Math.max(0, diameter * 0.84), scale }}
    >
      {children}
    </div>
  );
}

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
  style,
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
  const geometry = rings.map((ring, index) => {
    const max = ring.max ?? 100;
    const value = Number.isFinite(ring.value) ? ring.value : 0;
    const fraction = Math.min(1, Math.max(0, value / (max || 1)));
    const r = center - thickness / 2 - index * (thickness + gap);
    const color = ring.color ?? defaultColors[index % defaultColors.length];
    return { ring, index, fraction, r, color };
  });
  const drawn = geometry.filter((item) => item.r > 0);
  // Clear space inside the innermost ring, less a margin as wide as the gap.
  const innermost = drawn.length
    ? drawn[drawn.length - 1].r - thickness / 2
    : 0;
  const hole = Math.max(0, (innermost - Math.max(3, gap)) * 2);

  return (
    <div
      data-slot="activity-rings"
      className={cn("relative inline-flex shrink-0", className)}
      style={{ ...style, width: size, height: size }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={label}
        className="absolute inset-0 overflow-visible"
      >
        {drawn.map(({ ring, index, r, color }) => {
          const dimmed = active !== null && active !== index;
          return (
            <g
              key={ring.label}
              data-ring=""
              data-active={active === index || undefined}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              className="transition-opacity duration-200"
              style={{ opacity: dimmed ? 0.4 : 1 }}
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
            </g>
          );
        })}
      </svg>
      {drawn.map(({ ring, index, fraction, r, color }) => {
        if (fraction <= 0) return null;
        const dimmed = active !== null && active !== index;
        const capDeg = ((thickness / 2 / r) * 180) / Math.PI;
        // The arc brightens from its start to its leading edge.
        const fade = `conic-gradient(from ${round(-capDeg - 2)}deg, rgb(0 0 0 / 0.62) 0deg, #000 ${round(fraction * 360 + capDeg + 2)}deg, #000 360deg)`;
        const delay = `${index * 90}ms`;
        return (
          <div
            key={ring.label}
            aria-hidden="true"
            data-slot="activity-rings-fill"
            data-active={active === index || undefined}
            className="pointer-events-none absolute inset-0 transition-opacity duration-200 dark:drop-shadow-[0_0_6px_color-mix(in_oklab,var(--ring-color)_55%,transparent)]"
            style={
              {
                opacity: dimmed ? 0.4 : 1,
                "--ring-color": color,
                "--ring-angle": `${round(fraction * 360)}deg`,
              } as React.CSSProperties
            }
          >
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="absolute inset-0 overflow-visible"
              style={{ maskImage: fade, WebkitMaskImage: fade }}
            >
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
                transform={`rotate(-90 ${center} ${center})`}
                className="transition-[stroke-dashoffset] duration-700 starting:[stroke-dashoffset:1] motion-reduce:transition-none"
                style={{
                  transitionTimingFunction: EASE,
                  transitionDelay: delay,
                }}
              />
            </svg>
            {/* The head sits above the faded start, so a full ring still closes cleanly. */}
            <div
              className="absolute top-1/2 left-1/2 size-0 [rotate:var(--ring-angle)] transition-[rotate] duration-700 starting:[rotate:0deg] motion-reduce:transition-none"
              style={{ transitionTimingFunction: EASE, transitionDelay: delay }}
            >
              <span
                className={cn(
                  "absolute rounded-full",
                  fraction > 0.92 &&
                    "shadow-[0_0_4px_1px_rgb(0_0_0/0.18)] dark:shadow-[0_0_5px_1px_rgb(0_0_0/0.5)]",
                )}
                style={{
                  width: thickness,
                  height: thickness,
                  left: -thickness / 2,
                  top: -r - thickness / 2,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
      {children ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <CenterFit diameter={hole}>{children}</CenterFit>
        </div>
      ) : null}
    </div>
  );
}

export { ActivityRings };
