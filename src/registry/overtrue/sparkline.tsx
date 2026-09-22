"use client";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface SparklineProps {
  data: number[];
  label: string;
  className?: string;
  filled?: boolean;
}

/** A compact overview. Use a full chart when individual values need inspection. */
export function Sparkline({
  data,
  label,
  className,
  filled = true,
}: SparklineProps) {
  const gradient = `sparkline-${useId().replace(/:/g, "")}`;
  const values = data.filter(Number.isFinite);
  let low = Infinity,
    high = -Infinity;
  for (const value of values) {
    low = Math.min(low, value);
    high = Math.max(high, value);
  }
  const points = values.map((value, i) => {
    const x = values.length > 1 ? 2 + (i / (values.length - 1)) * 236 : 120;
    const y = high === low ? 24 : 44 - ((value - low) / (high - low)) * 40;
    return `${x},${y}`;
  });
  return (
    <svg
      data-slot="sparkline"
      viewBox="0 0 240 48"
      preserveAspectRatio="none"
      role="img"
      aria-label={`${label}: ${values.length ? values.join(", ") : "No data"}`}
      className={cn("h-12 w-full overflow-visible text-primary", className)}
    >
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {values.length > 1 ? (
        <>
          {filled && (
            <polygon
              points={`2,48 ${points.join(" ")} 238,48`}
              fill={`url(#${gradient})`}
            />
          )}
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </>
      ) : values.length === 1 ? (
        <circle cx="120" cy="24" r="2" fill="currentColor" />
      ) : (
        <path
          d="M2 24H238"
          stroke="currentColor"
          strokeDasharray="3 5"
          opacity="0.3"
        />
      )}
    </svg>
  );
}
