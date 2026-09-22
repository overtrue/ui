"use client";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Non-finite values become zero; all progress is constrained to its capacity. */
export function ResourceProgress({
  value,
  max = 100,
  label,
  valueLabel,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  value: number;
  max?: number;
  label: string;
  valueLabel?: ReactNode;
}) {
  const id = useId();
  const capacity = Number.isFinite(max) && max > 0 ? max : 100;
  const current = Math.min(
    capacity,
    Math.max(0, Number.isFinite(value) ? value : 0),
  );
  const percent = (current / capacity) * 100;
  return (
    <div className={cn("min-w-0 space-y-2", className)} {...props}>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span id={id} className="min-w-0 text-muted-foreground">
          {label}
        </span>
        <span className="shrink-0 font-medium tabular-nums">
          {valueLabel ?? `${Math.round(percent)}%`}
        </span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={capacity}
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
