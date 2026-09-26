import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A shared surface; use StatCard when each metric needs its own card. */
export function MetricGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="metric-group"
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))] gap-px overflow-hidden rounded-lg border border-border bg-border text-card-foreground shadow-sm shadow-black/[0.03] dark:shadow-black/10 [&>*]:bg-card",
        className,
      )}
      {...props}
    />
  );
}
export function MetricGroupItem({
  label,
  value,
  context,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  label: string;
  value: ReactNode;
  context?: ReactNode;
}) {
  return (
    <div className={cn("@container min-w-0 wrap-anywhere px-4 py-5 sm:px-6", className)} {...props}>
      <p className="m-0 text-sm font-medium text-muted-foreground">{label}</p>
      <p className="my-3 text-[clamp(1rem,14cqi,1.875rem)] font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {context && (
        <div className="text-xs text-muted-foreground">{context}</div>
      )}
    </div>
  );
}
