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
      data-layout={layout}
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
        <li
          key={item.label}
          data-slot="chart-legend-item"
          className="flex min-w-0 items-center gap-2"
        >
          {item.dashed ? (
            <svg
              aria-hidden="true"
              data-slot="chart-legend-swatch"
              viewBox="0 0 14 2"
              className="h-0.5 w-3.5 shrink-0 overflow-visible"
            >
              <line
                x1="1"
                y1="1"
                x2="13"
                y2="1"
                stroke={item.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="2 4"
              />
            </svg>
          ) : (
            <span
              aria-hidden="true"
              data-slot="chart-legend-swatch"
              className="size-2 shrink-0 rounded-full"
              style={{
                backgroundColor: item.color,
                boxShadow: `0 0 0 2px color-mix(in oklab, ${item.color} 16%, transparent)`,
              }}
            />
          )}
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
