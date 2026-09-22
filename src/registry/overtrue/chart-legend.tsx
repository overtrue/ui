import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ChartLegendItem {
  label: string;
  color: string;
  value?: ReactNode;
  dashed?: boolean;
}
export function ChartLegend({
  items,
  label = "Chart legend",
  layout = "vertical",
  className,
}: {
  items: readonly ChartLegendItem[];
  label?: string;
  layout?: "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <ul
      data-slot="chart-legend"
      aria-label={label}
      className={cn(
        "m-0 list-none p-0 text-xs",
        layout === "horizontal"
          ? "flex flex-wrap items-center gap-x-4 gap-y-2"
          : "grid gap-3",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.label} className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              "shrink-0",
              item.dashed
                ? "w-3 border-t-2 border-dashed"
                : "size-2 rounded-full",
            )}
            style={
              item.dashed
                ? { borderColor: item.color }
                : { backgroundColor: item.color }
            }
          />
          <span className="min-w-0 break-words text-muted-foreground">
            {item.label}
          </span>
          {item.value != null && (
            <span className="ms-auto ps-3 font-medium text-foreground tabular-nums">
              {item.value}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
