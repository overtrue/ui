"use client";
import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type AvailabilityStatus =
  "operational" | "degraded" | "outage" | "unknown";
export interface UptimeSample {
  id: string;
  label: string;
  status: AvailabilityStatus;
}
const colors: Record<AvailabilityStatus, string> = {
  operational: "bg-emerald-500/70",
  degraded: "bg-amber-500/70",
  outage: "bg-destructive",
  unknown: "bg-muted-foreground/30",
};
export function UptimeHistory({
  samples,
  label,
  startLabel,
  endLabel,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  samples: readonly UptimeSample[];
  label: string;
  startLabel?: string;
  endLabel?: string;
}) {
  const id = useId();
  return (
    <div className={cn("min-w-0 space-y-2", className)} {...props}>
      {samples.length ? (
        <>
          <div
            role="img"
            aria-label={label}
            aria-describedby={id}
            className="flex h-7 gap-0.5"
          >
            {samples.map((sample) => (
              <span
                key={sample.id}
                title={`${sample.label}: ${sample.status}`}
                className={cn(
                  "min-w-0 flex-1 rounded-sm",
                  colors[sample.status],
                )}
              />
            ))}
          </div>
          <ul id={id} className="sr-only">
            {samples.map((sample) => (
              <li key={sample.id}>
                {sample.label}: {sample.status}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          No availability data yet.
        </p>
      )}
      {(startLabel || endLabel) && (
        <div className="flex justify-between gap-3 text-xs text-muted-foreground">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      )}
    </div>
  );
}
