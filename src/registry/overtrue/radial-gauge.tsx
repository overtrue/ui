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

export interface RadialGaugeZone {
  from: number;
  to: number;
  /** Any CSS color. Defaults to chart-1 through chart-5 in order. */
  color?: string;
  label?: string;
}

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
  /** Any CSS color. Defaults to chart-1, or to the zone that holds the value. */
  color?: string;
  /** Defaults to a soft tint of the arc color. */
  trackColor?: string;
  /** Reveal filled segments in sequence when the gauge mounts. */
  animate?: boolean;
  /** Total reveal time in milliseconds. */
  animationDuration?: number;
  /** Threshold bands drawn as a thin ring just outside the arc. */
  zones?: RadialGaugeZone[];
  /** Fade the arc in from its start so the leading edge reads brightest. */
  gradient?: boolean;
  /** Content rendered in the middle of the gauge. */
  children?: React.ReactNode;
}

const defaultColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const UPDATE_MS = 450;

// Round so server and client render identical path strings.
const round = (n: number) => Math.round(n * 1000) / 1000;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: round(cx + r * Math.cos(rad)), y: round(cy + r * Math.sin(rad)) };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const start = polar(cx, cy, r, from);
  // A single SVG arc with coincident endpoints is empty, not a full circle.
  if (to - from >= 360) {
    const middle = polar(cx, cy, r, from + 180);
    return `M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${middle.x} ${middle.y} A ${r} ${r} 0 1 1 ${start.x} ${start.y}`;
  }
  const end = polar(cx, cy, r, to);
  const largeArc = to - from > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function useReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/** A dial for a single measure: a luminous arc over a soft track, with optional threshold zones. */
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
  color: colorProp,
  trackColor: trackProp,
  animate = false,
  animationDuration = 700,
  zones,
  gradient = true,
  className,
  style,
  children,
  ...props
}: RadialGaugeProps) {
  const range = max - min || 1;
  const safe = Number.isFinite(value) ? value : min;
  const fraction = Math.min(1, Math.max(0, (safe - min) / range));
  const start = startAngle ?? (sweep >= 360 ? 0 : -sweep / 2);
  const angleOf = (v: number) =>
    start + sweep * Math.min(1, Math.max(0, (v - min) / range));

  const bands = (zones ?? []).filter(
    (zone) =>
      Number.isFinite(zone.from) &&
      Number.isFinite(zone.to) &&
      zone.to > zone.from,
  );
  const activeZone = bands.findIndex(
    (zone, i) =>
      safe >= zone.from &&
      (safe < zone.to || (i === bands.length - 1 && safe <= zone.to)),
  );
  const color =
    colorProp ??
    (activeZone >= 0
      ? (bands[activeZone].color ??
        defaultColors[activeZone % defaultColors.length])
      : "var(--color-chart-1)");
  const trackColor =
    trackProp ??
    "color-mix(in oklab, var(--gauge-color) 14%, color-mix(in oklab, var(--color-foreground) 4%, transparent))";

  const zoneWidth = bands.length ? Math.max(2, Math.round(thickness * 0.3)) : 0;
  const zoneGap = bands.length ? Math.max(3, Math.round(thickness * 0.35)) : 0;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - thickness / 2 - (bands.length ? zoneWidth + zoneGap : 0);
  const zoneRadius = size / 2 - zoneWidth / 2;
  // Trim the box to the arc's vertical extent so a semicircle does not
  // reserve a full circle of space.
  const angles = Array.from({ length: 64 }, (_, i) => start + (sweep * i) / 63);
  const ys = angles.map((a) => polar(cx, cy, r, a).y);
  const outset = thickness / 2 + (bands.length ? zoneWidth + zoneGap : 0);
  const top = Math.max(0, Math.min(...ys) - outset);
  const bottom = Math.min(size, Math.max(...ys) + thickness / 2);
  const height = bottom - top;

  const reduced = useReducedMotion();
  const fillRef = React.useRef<SVGPathElement>(null);
  const ghostRef = React.useRef<SVGPathElement>(null);
  const settled = React.useRef(animate ? 0 : fraction);
  const mounted = React.useRef(false);
  const [ghost, setGhost] = React.useState<{ from: number; to: number } | null>(
    null,
  );

  // The fill path always has its final geometry, so it can be measured at once.
  // Growth is revealed with a dash; a shrink leaves a ghost arc that retracts.
  React.useLayoutEffect(() => {
    const previous = settled.current;
    const first = !mounted.current;
    mounted.current = true;
    settled.current = fraction;
    if (segments > 0 || reduced || previous === fraction) return;
    const duration = first ? animationDuration : UPDATE_MS;
    if (fraction > previous) {
      setGhost(null);
      fillRef.current?.animate(
        [
          { strokeDasharray: `${round(previous / fraction)} 2` },
          { strokeDasharray: "1 2" },
        ],
        { duration, easing: EASE },
      );
    } else {
      setGhost({ from: fraction, to: previous });
    }
  }, [fraction, segments, reduced, animationDuration]);

  React.useLayoutEffect(() => {
    const path = ghostRef.current;
    if (!ghost || !path) return;
    const animation = path.animate(
      [{ strokeDasharray: "1 2" }, { strokeDasharray: "0 2" }],
      { duration: UPDATE_MS, easing: EASE, fill: "forwards" },
    );
    animation.onfinish = () => setGhost(null);
    return () => animation.cancel();
  }, [ghost]);

  const filledDeg = sweep * fraction;
  const capDeg = ((thickness / 2 / Math.max(r, 1)) * 180) / Math.PI;
  const center = `${round((cx / size) * 100)}% ${round(((cy - top) / height) * 100)}%`;
  const fade =
    gradient &&
    segments === 0 &&
    fraction > 0 &&
    filledDeg + capDeg * 2 + 6 < 360
      ? `conic-gradient(from ${round(start - capDeg - 2)}deg at ${center}, rgb(0 0 0 / 0.4) 0deg, #000 ${round(filledDeg + capDeg + 2)}deg, #000 360deg)`
      : undefined;
  const headSize = Math.round(thickness * 0.42);
  const showHead = segments === 0 && fraction > 0 && thickness >= 8;
  const motion = reduced ? "none" : undefined;

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
  const filledCount = arcs.filter((arc) => arc.filled).length;

  return (
    <div
      data-slot="radial-gauge"
      role="meter"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("relative inline-flex shrink-0", className)}
      style={
        {
          ...style,
          width: size,
          height,
          "--gauge-color": color,
        } as React.CSSProperties
      }
      {...props}
    >
      <svg
        width={size}
        height={height}
        viewBox={`0 ${top} ${size} ${height}`}
        className="absolute inset-0 overflow-visible"
        aria-hidden="true"
        data-slot="radial-gauge-track"
      >
        {segments > 0 ? (
          arcs.map((arc, index) => (
            <path
              key={index}
              d={arcPath(cx, cy, r, arc.from, arc.to)}
              fill="none"
              stroke={trackColor}
              strokeWidth={thickness}
              strokeLinecap="butt"
            />
          ))
        ) : (
          <path
            d={arcPath(cx, cy, r, start, start + sweep)}
            fill="none"
            stroke={trackColor}
            strokeWidth={thickness}
            strokeLinecap={sweep >= 360 ? "butt" : "round"}
          />
        )}
      </svg>
      <div
        aria-hidden="true"
        data-slot="radial-gauge-fill"
        className="pointer-events-none absolute inset-0 dark:drop-shadow-[0_0_7px_color-mix(in_oklab,var(--gauge-color)_55%,transparent)]"
      >
        <svg
          width={size}
          height={height}
          viewBox={`0 ${top} ${size} ${height}`}
          className="absolute inset-0 overflow-visible"
          style={fade ? { maskImage: fade, WebkitMaskImage: fade } : undefined}
        >
          {segments > 0
            ? arcs.map((arc, index) =>
                arc.filled ? (
                  <path
                    key={index}
                    d={arcPath(cx, cy, r, arc.from, arc.to)}
                    fill="none"
                    stroke="var(--gauge-color)"
                    strokeWidth={thickness}
                    strokeLinecap="butt"
                    // Segments brighten toward the leading edge.
                    strokeOpacity={
                      gradient
                        ? round(0.4 + 0.6 * ((index + 1) / filledCount) ** 1.3)
                        : 1
                    }
                    className={cn(
                      "transition-[stroke-opacity] duration-300",
                      animate &&
                        "starting:[stroke-opacity:0] motion-reduce:transition-none",
                    )}
                    style={
                      animate
                        ? {
                            transitionDelay: `${(index / Math.max(1, filledCount)) * animationDuration * 0.8}ms`,
                          }
                        : undefined
                    }
                  />
                ) : null,
              )
            : fraction > 0 && (
                <path
                  ref={fillRef}
                  d={arcPath(cx, cy, r, start, start + filledDeg)}
                  fill="none"
                  stroke="var(--gauge-color)"
                  strokeWidth={thickness}
                  strokeLinecap="round"
                  pathLength={1}
                />
              )}
          {ghost && segments === 0 ? (
            <path
              ref={ghostRef}
              d={arcPath(
                cx,
                cy,
                r,
                start + sweep * ghost.from,
                start + sweep * ghost.to,
              )}
              fill="none"
              stroke="var(--gauge-color)"
              strokeWidth={thickness}
              strokeLinecap="round"
              pathLength={1}
            />
          ) : null}
        </svg>
      </div>
      {bands.length ? (
        <svg
          width={size}
          height={height}
          viewBox={`0 ${top} ${size} ${height}`}
          className="pointer-events-none absolute inset-0 overflow-visible"
          aria-hidden="true"
          data-slot="radial-gauge-zones"
        >
          {bands.map((zone, index) => {
            const inset =
              ((zoneWidth / 2 + 1.5) / zoneRadius) * (180 / Math.PI);
            const from = angleOf(zone.from) + inset;
            const to = angleOf(zone.to) - inset;
            if (to <= from) return null;
            return (
              <path
                key={index}
                d={arcPath(cx, cy, zoneRadius, from, to)}
                fill="none"
                stroke={
                  zone.color ?? defaultColors[index % defaultColors.length]
                }
                strokeWidth={zoneWidth}
                strokeLinecap="round"
                strokeOpacity={index === activeZone ? 1 : 0.35}
                className="transition-[stroke-opacity] duration-300"
              >
                {zone.label ? <title>{zone.label}</title> : null}
              </path>
            );
          })}
        </svg>
      ) : null}
      {showHead ? (
        // Rotates about the center, so the head glides along the arc in both directions.
        <div
          aria-hidden="true"
          data-slot="radial-gauge-head"
          className="pointer-events-none absolute size-0"
          style={{
            left: cx,
            top: cy - top,
            rotate: `${round(start + filledDeg)}deg`,
            transition: motion ?? `rotate ${UPDATE_MS}ms ${EASE}`,
          }}
        >
          <span
            className={cn(
              "absolute rounded-full bg-card shadow-[0_0_0_1px_color-mix(in_oklab,var(--gauge-color)_30%,transparent)] transition-opacity duration-300 dark:bg-[color-mix(in_oklab,var(--color-foreground)_90%,var(--gauge-color))] dark:shadow-[0_0_8px_1px_color-mix(in_oklab,var(--gauge-color)_80%,transparent)]",
              animate && !reduced && "starting:opacity-0",
            )}
            style={{
              width: headSize,
              height: headSize,
              left: -headSize / 2,
              top: -r - headSize / 2,
              transitionDelay: animate
                ? `${animationDuration * 0.7}ms`
                : undefined,
            }}
          />
        </div>
      ) : null}
      {children ? (
        <div
          data-slot="radial-gauge-content"
          className={cn(
            "absolute inset-x-0 flex flex-col items-center justify-center text-center",
            sweep > 200 ? "top-0" : "bottom-0",
          )}
          style={sweep > 200 ? { height: (cy - top) * 2 } : undefined}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export { RadialGauge };
