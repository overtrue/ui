"use client";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface SparklineProps {
  data: number[];
  label: string;
  className?: string;
  filled?: boolean;
  /** Mark the most recent value. */
  endpoint?: boolean;
}

const WIDTH = 240;
const HEIGHT = 48;
const PAD_X = 3;
const PAD_Y = 5;

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
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const h = dx[i] / 3;
    d += `C${x0 + h},${y0 + tangent[i] * h} ${x1 - h},${y1 - tangent[i + 1] * h} ${x1},${y1}`;
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
  return (
    <div
      data-slot="sparkline"
      role="img"
      aria-label={`${label}: ${values.length ? values.join(", ") : "No data"}`}
      className={cn("relative h-12 w-full text-primary", className)}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 size-full overflow-visible"
      >
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {values.length > 1 ? (
          <>
            {filled && (
              <path
                d={`${line}L${last[0]},${HEIGHT}L${points[0][0]},${HEIGHT}Z`}
                fill={`url(#${gradient})`}
              />
            )}
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </>
        ) : values.length === 0 ? (
          <path
            d={`M${PAD_X} ${HEIGHT / 2}H${WIDTH - PAD_X}`}
            stroke="currentColor"
            strokeDasharray="3 5"
            opacity="0.3"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>
      {/* Drawn in HTML so the marker stays round when the line stretches. */}
      {endpoint && last && (
        <span
          aria-hidden="true"
          className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current ring-[3px] ring-current/20"
          style={{
            left: `${(last[0] / WIDTH) * 100}%`,
            top: `${(last[1] / HEIGHT) * 100}%`,
          }}
        />
      )}
    </div>
  );
}
