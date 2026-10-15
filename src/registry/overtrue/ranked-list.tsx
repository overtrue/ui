import type { CSSProperties, ReactNode } from "react";
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
  /** Any CSS color for the bars. Defaults to the primary color. */
  color?: string;
  /** Show each row's rank before its label. */
  showRank?: boolean;
}

/**
 * A sorted list of labelled values with a proportional bar behind each row, the value,
 * and its share of the total. Hovering a row brings its bar forward and quiets the rest.
 */
export function RankedList({
  items,
  label,
  formatValue = (value) => value.toLocaleString("en-US"),
  emptyMessage = "No results for this period.",
  className,
  color = "var(--color-primary)",
  showRank = false,
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
      className={cn(
        "@container/ranking m-0 list-none space-y-2 p-0",
        // While one row is hovered, the other bars step back.
        "[&:has(>li:hover)>li:not(:hover)_[data-slot=ranked-list-bar]]:opacity-45",
        className,
      )}
      style={{ "--ranked-list-color": color } as CSSProperties}
    >
      <style href="overtrue-ranked-list" precedence="default">
        {`@keyframes ranked-list-grow{from{transform:scaleX(0)}}`}
      </style>
      {!rows.length && (
        <li className="py-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </li>
      )}
      {rows.map((item, index) => {
        const width = max ? (item.value / max) * 100 : 0;
        const content = (
          <>
            <span
              aria-hidden="true"
              data-slot="ranked-list-bar"
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 origin-left rounded-lg",
                // The fill deepens toward its end, so its length reads without a hard rule through the label.
                "bg-[linear-gradient(to_right,color-mix(in_oklab,var(--ranked-list-color)_8%,transparent),color-mix(in_oklab,var(--ranked-list-color)_22%,transparent))]",
                "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ranked-list-color)_7%,transparent)]",
                "dark:bg-[linear-gradient(to_right,color-mix(in_oklab,var(--ranked-list-color)_8%,transparent),color-mix(in_oklab,var(--ranked-list-color)_28%,transparent))]",
                "dark:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ranked-list-color)_10%,transparent),inset_0_1px_0_rgb(255_255_255/0.05)]",
                "transition-[width,opacity,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:brightness-[1.06] group-hover/row:saturate-150 motion-reduce:transition-none",
                "motion-safe:animate-[ranked-list-grow_700ms_cubic-bezier(0.22,1,0.36,1)_backwards]",
              )}
              style={{
                width: `${width}%`,
                animationDelay: `${index * 40}ms`,
              }}
            />
            <span className="relative flex min-w-0 items-center gap-2">
              {showRank && (
                <span
                  aria-hidden="true"
                  className="w-5 shrink-0 text-xs text-muted-foreground tabular-nums"
                >
                  {index + 1}
                </span>
              )}
              {item.icon && (
                <span
                  aria-hidden="true"
                  className="shrink-0 text-muted-foreground transition-colors duration-150 group-hover/row:text-foreground motion-reduce:transition-none [&>svg]:size-4"
                >
                  {item.icon}
                </span>
              )}
              <span className="min-w-0 wrap-anywhere">{item.label}</span>
              {item.href && (
                <IconArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-muted-foreground transition-[translate,color] duration-150 group-hover/row:translate-x-px group-hover/row:-translate-y-px group-hover/row:text-foreground motion-reduce:transition-none"
                />
              )}
            </span>
            <span className="relative flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-right tabular-nums @min-[18rem]/ranking:justify-end">
              <span className="font-medium">{formatValue(item.value)}</span>
              <span className="w-12 text-right text-xs text-muted-foreground">
                {total ? `${((item.value / total) * 100).toFixed(1)}%` : "—"}
                <span className="sr-only"> of total</span>
              </span>
            </span>
          </>
        );
        const rowClass =
          "group/row relative grid grid-cols-1 items-center gap-1.5 rounded-lg px-3 py-3 text-sm text-foreground transition-colors duration-150 hover:bg-muted/50 motion-reduce:transition-none @min-[18rem]/ranking:grid-cols-[minmax(0,1fr)_auto] @min-[18rem]/ranking:gap-3";
        return (
          <li key={item.id}>
            {item.href ? (
              <a
                href={item.href}
                className={cn(
                  rowClass,
                  "outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
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
