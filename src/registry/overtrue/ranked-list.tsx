import type { ReactNode } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface RankedListItem {
  id: string;
  label: string;
  value: number;
  icon?: ReactNode;
  href?: string;
}
export interface RankedListProps {
  items: RankedListItem[];
  label: string;
  formatValue?: (value: number) => string;
  emptyMessage?: string;
  className?: string;
}

export function RankedList({
  items,
  label,
  formatValue = (value) => value.toLocaleString("en-US"),
  emptyMessage = "No results for this period.",
  className,
}: RankedListProps) {
  const rows = items
    .map((item) => ({
      ...item,
      value: Number.isFinite(item.value) ? Math.max(0, item.value) : 0,
    }))
    .sort((a, b) => b.value - a.value);
  const max = rows[0]?.value ?? 0;
  const total = rows.reduce((sum, item) => sum + item.value, 0);
  return (
    <ol
      data-slot="ranked-list"
      aria-label={label}
      className={cn("@container/ranking m-0 list-none space-y-2 p-0", className)}
    >
      {!rows.length && (
        <li className="py-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </li>
      )}
      {rows.map((item) => {
        const content = (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 rounded-md bg-primary/8"
              style={{ width: `${max ? (item.value / max) * 100 : 0}%` }}
            />
            <span className="relative flex min-w-0 items-center gap-2">
              {item.icon && (
                <span
                  aria-hidden="true"
                  className="shrink-0 text-muted-foreground [&>svg]:size-4"
                >
                  {item.icon}
                </span>
              )}
              <span className="min-w-0 wrap-anywhere">{item.label}</span>
              {item.href && (
                <IconArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-muted-foreground"
                />
              )}
            </span>
            <span className="relative flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-right tabular-nums @min-[18rem]/ranking:justify-end">
              <span className="font-medium">{formatValue(item.value)}</span>
              <span className="w-10 text-xs text-muted-foreground">
                {total ? `${((item.value / total) * 100).toFixed(1)}%` : "—"}
                <span className="sr-only"> of total</span>
              </span>
            </span>
          </>
        );
        const rowClass =
          "relative grid grid-cols-1 items-center gap-1.5 rounded-md px-3 py-3 text-sm text-foreground @min-[18rem]/ranking:grid-cols-[minmax(0,1fr)_auto] @min-[18rem]/ranking:gap-3";
        return (
          <li key={item.id}>
            {item.href ? (
              <a
                href={item.href}
                className={cn(
                  rowClass,
                  "outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                {content}
              </a>
            ) : (
              <div className={rowClass}>{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
