"use client";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Non-finite values become zero; all progress is constrained to its capacity. */
export function ResourceProgress({
  value,
  max = 100,
  label,
  valueLabel,
  color = "var(--color-primary)",
  className,
  style,
  ...props
}: Omit<ComponentProps<"div">, "children" | "color"> & {
  value: number;
  max?: number;
  label: string;
  valueLabel?: ReactNode;
  /** Any CSS color for the filled bar. Defaults to the theme primary. */
  color?: string;
}) {
  const id = useId();
  const capacity = Number.isFinite(max) && max > 0 ? max : 100;
  const current = Math.min(
    capacity,
    Math.max(0, Number.isFinite(value) ? value : 0),
  );
  const percent = (current / capacity) * 100;
  return (
    <div
      data-slot="resource-progress"
      className={cn("min-w-0 space-y-2", className)}
      style={{ ...style, ["--progress-color" as string]: color }}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span id={id} className="min-w-0 text-muted-foreground">
          {label}
        </span>
        <span className="shrink-0 font-semibold tracking-[-0.01em] text-foreground tabular-nums">
          {valueLabel ?? `${Math.round(percent)}%`}
        </span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={capacity}
        data-slot="resource-progress-track"
        className="h-1.5 rounded-full bg-[color-mix(in_oklab,var(--color-foreground)_8%,transparent)]"
      >
        <div
          data-slot="resource-progress-indicator"
          className="h-full origin-left rounded-full bg-[linear-gradient(90deg,color-mix(in_oklab,var(--progress-color)_72%,transparent),var(--progress-color))] transition-[width,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] starting:scale-x-0 motion-reduce:transition-none dark:shadow-[0_0_10px_-1px_color-mix(in_oklab,var(--progress-color)_65%,transparent)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
