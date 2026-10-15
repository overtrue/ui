"use client";
import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface SparklineProps {
  data: number[];
  label: string;
  className?: string;
  filled?: boolean;
  /** Mark the most recent value. */
  endpoint?: boolean;
  /** Any CSS color. Defaults to the current text color, which is primary. */
  color?: string;
  /** Draw the line in and raise the area when the sparkline mounts. Skipped under reduced motion. */
  animate?: boolean;
}

const WIDTH = 240;
const HEIGHT = 48;
const PAD_X = 3;
const PAD_Y = 5;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Monotone cubic path: smooth, but never overshoots the data. */
function monotonePath(points: [number, number][]) {
  const n = points.length;
  if (n < 2) return "";
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(points[i + 1][0] - points[i][0]);
    slope.push((points[i + 1][1] - points[i][1]) / dx[i]);
  }
  const tangent = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    tangent.push(
      slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2,
    );
  }
  tangent.push(slope[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      tangent[i] = tangent[i + 1] = 0;
      continue;
    }
    const a = tangent[i] / slope[i];
    const b = tangent[i + 1] / slope[i];
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      tangent[i] = t * a * slope[i];
      tangent[i + 1] = t * b * slope[i];
    }
  }
  const r = (value: number) => Math.round(value * 100) / 100;
  let d = `M${r(points[0][0])},${r(points[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const h = dx[i] / 3;
    d += `C${r(x0 + h)},${r(y0 + tangent[i] * h)} ${r(x1 - h)},${r(y1 - tangent[i + 1] * h)} ${r(x1)},${r(y1)}`;
  }
  return d;
}

/** A compact overview. Use a full chart when individual values need inspection. */
export function Sparkline({
  data,
  label,
  className,
  filled = true,
  endpoint = true,
  color,
  animate = true,
}: SparklineProps) {
  const gradient = `sparkline-${useId().replace(/:/g, "")}`;
  const values = data.filter(Number.isFinite);
  let low = Infinity,
    high = -Infinity;
  for (const value of values) {
    low = Math.min(low, value);
    high = Math.max(high, value);
  }
  const points = values.map((value, i): [number, number] => [
    values.length > 1
      ? PAD_X + (i / (values.length - 1)) * (WIDTH - PAD_X * 2)
      : WIDTH / 2,
    high === low
      ? HEIGHT / 2
      : HEIGHT - PAD_Y - ((value - low) / (high - low)) * (HEIGHT - PAD_Y * 2),
  ]);
  const line = monotonePath(points);
  const last = points[points.length - 1];
  const lastValue = values[values.length - 1];
  const motion = animate ? "motion-reduce:transition-none" : "transition-none";
  return (
    <div
      data-slot="sparkline"
      role="img"
      aria-label={`${label}: ${values.length ? values.join(", ") : "No data"}`}
      className={cn("relative h-12 w-full text-primary", className)}
      style={color ? { color } : undefined}
    >
      {values.length > 1 && filled && (
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          data-slot="sparkline-area"
          className={cn(
            "absolute inset-0 size-full origin-bottom overflow-visible transition-[opacity,scale] delay-75 duration-700",
            EASE,
            animate && "starting:scale-y-0 starting:opacity-0",
            motion,
          )}
        >
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${line}L${last[0]},${HEIGHT}L${points[0][0]},${HEIGHT}Z`}
            fill={`url(#${gradient})`}
            className={cn("transition-[d] duration-500", EASE, motion)}
          />
        </svg>
      )}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        data-slot="sparkline-line"
        className={cn(
          // The line wipes in from the left; the inset leaves room for its glow.
          "absolute inset-0 size-full overflow-visible [clip-path:inset(-60%_-8%_-60%_-8%)] transition-[clip-path] duration-700",
          EASE,
          animate &&
            values.length > 1 &&
            "starting:[clip-path:inset(-60%_100%_-60%_-8%)]",
          motion,
        )}
      >
        {values.length > 1 ? (
          <path
            d={line}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className={cn(
              "transition-[d] duration-500 dark:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,currentColor_50%,transparent))]",
              EASE,
              motion,
            )}
          />
        ) : values.length === 0 ? (
          <path
            d={`M${PAD_X} ${HEIGHT / 2}H${WIDTH - PAD_X}`}
            stroke="currentColor"
            strokeDasharray="2 5"
            strokeLinecap="round"
            opacity="0.3"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>
      {/* Drawn in HTML so the marker stays round when the line stretches. */}
      {endpoint && last && (
        <span
          aria-hidden="true"
          data-slot="sparkline-endpoint"
          className={cn(
            // Moves with the line, and on mount appears once the line has drawn in.
            "absolute -translate-x-1/2 -translate-y-1/2 [transition:left_500ms_cubic-bezier(0.22,1,0.36,1),top_500ms_cubic-bezier(0.22,1,0.36,1),opacity_300ms_ease-out_550ms,scale_500ms_cubic-bezier(0.22,1,0.36,1)_550ms]",
            animate && "starting:scale-0 starting:opacity-0",
            motion,
          )}
          style={
            {
              left: `${(last[0] / WIDTH) * 100}%`,
              top: `${(last[1] / HEIGHT) * 100}%`,
            } as CSSProperties
          }
        >
          {/* Pulses once whenever the latest value changes. */}
          <span
            key={lastValue}
            className={cn(
              "absolute inset-0 scale-[3.2] rounded-full bg-current opacity-0 transition-[opacity,scale] duration-1000 ease-out starting:scale-100 starting:opacity-40 motion-reduce:hidden",
              !animate && "hidden",
            )}
          />
          <span className="relative block size-2 rounded-full border-[1.5px] border-card bg-current shadow-[0_0_0_3px_color-mix(in_oklab,currentColor_18%,transparent)] dark:shadow-[0_0_0_3px_color-mix(in_oklab,currentColor_24%,transparent),0_0_12px_1px_color-mix(in_oklab,currentColor_70%,transparent)]" />
        </span>
      )}
    </div>
  );
}
