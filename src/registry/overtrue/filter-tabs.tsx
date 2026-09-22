"use client";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterOption<T extends string = string> {
  value: T;
  label: ReactNode;
  count?: number;
  disabled?: boolean;
}
/** Filters a shared result set; these are pressed buttons, not tab panels. */
export function FilterTabs<T extends string>({
  label,
  items,
  value,
  onValueChange,
  className,
}: {
  label: string;
  items: readonly FilterOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      data-slot="filter-tabs"
      role="group"
      aria-label={label}
      className={cn("flex flex-wrap items-center gap-1", className)}
    >
      {items.map((item) => (
        <Button
          key={item.value}
          type="button"
          size="sm"
          variant="ghost"
          disabled={item.disabled}
          aria-pressed={item.value === value}
          onClick={() => onValueChange(item.value)}
          className={cn(
            "h-8 gap-2 rounded-md px-3 text-xs font-medium shadow-none",
            item.value === value
              ? "bg-primary/10 text-primary hover:bg-primary/15"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span className="tabular-nums opacity-75">{item.count}</span>
          )}
        </Button>
      ))}
    </div>
  );
}
