import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A shared surface; use StatCard when each metric needs its own card. */
export function MetricGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="metric-group"
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))] gap-px overflow-hidden rounded-2xl border border-border bg-border text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)] [&>*]:bg-card",
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
    <div
      data-slot="metric-group-item"
      className={cn(
        "@container min-w-0 px-5 py-5 wrap-anywhere sm:px-6",
        className,
      )}
      {...props}
    >
      <p className="m-0 text-[13px] leading-5 font-medium text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 mb-2.5 text-[clamp(1.125rem,14cqi,1.875rem)] leading-[1.15] font-semibold tracking-[-0.035em] tabular-nums">
        {value}
      </p>
      {context && (
        <div className="text-xs leading-5 text-muted-foreground">{context}</div>
      )}
    </div>
  );
}
