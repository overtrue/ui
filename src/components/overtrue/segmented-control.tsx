import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface SegmentedControlProps<T extends string = string> {
  options: { value: T; label: React.ReactNode }[]
  value: T
  onValueChange: (v: T) => void
  className?: string
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onValueChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-muted p-0.5",
        className,
      )}
      role="radiogroup"
    >
      {options.map((opt) => (
        <Button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          size="sm"
          variant={value === opt.value ? "secondary" : "ghost"}
          className={cn(
            "h-7 rounded-md px-3 shadow-none",
            value === opt.value && "bg-background text-foreground shadow-sm",
          )}
          onClick={() => onValueChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
