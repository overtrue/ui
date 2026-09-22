import { IconStar } from "@tabler/icons-react"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface StarsRatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: number
  max?: number
  onChange?: (v: number) => void
  readOnly?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeMap = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" }

export function StarsRating({
  value,
  max = 5,
  onChange,
  readOnly,
  size = "md",
  className,
  ...props
}: StarsRatingProps) {
  return (
    <div className={cn("inline-flex gap-0.5", className)} role="radiogroup" aria-label="Rating" {...props}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          aria-checked={value === star}
          role="radio"
          className={cn("text-muted-foreground", star <= value && "text-warning")}
          onClick={() => onChange?.(star)}
        >
          <IconStar className={cn(sizeMap[size], star <= value && "fill-current")} />
        </button>
      ))}
    </div>
  )
}
