import * as RadioGroup from "@radix-ui/react-radio-group"
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
    <RadioGroup.Root
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-muted p-0.5",
        className,
      )}
      value={value}
      onValueChange={(next) => onValueChange(next as T)}
      aria-label="Options"
    >
      {options.map((opt) => (
        <RadioGroup.Item key={opt.value} value={opt.value} asChild>
          <Button
            type="button"
            size="sm"
            variant={value === opt.value ? "secondary" : "ghost"}
            className={cn(
              "h-7 rounded-md px-3 shadow-none",
              value === opt.value && "bg-background text-foreground shadow-sm",
            )}
          >
            {opt.label}
          </Button>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}
