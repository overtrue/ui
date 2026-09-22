import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        soft: "border-transparent bg-primary/15 text-primary",
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/15 text-warning",
        danger: "border-transparent bg-destructive/15 text-destructive",
        outline: "border-border text-foreground",
        ghost: "border-transparent bg-transparent text-muted-foreground hover:bg-muted",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  onRemove?: () => void
  selected?: boolean
  onSelectedChange?: (v: boolean) => void
}

export function Tag({
  variant = "default",
  className,
  children,
  onRemove,
  selected,
  onSelectedChange,
  onClick,
  onKeyDown,
  ...props
}: TagProps) {
  return (
    <span
      role={onSelectedChange ? "button" : undefined}
      aria-pressed={onSelectedChange ? Boolean(selected) : undefined}
      tabIndex={onSelectedChange ? 0 : undefined}
      className={cn(
        tagVariants({ variant }),
        onSelectedChange && "cursor-pointer",
        onSelectedChange && selected && "ring-2 ring-primary/40",
        className,
      )}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented && onSelectedChange) onSelectedChange(!selected)
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (!e.defaultPrevented && e.target === e.currentTarget && onSelectedChange && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          onSelectedChange(!selected)
        }
      }}
      {...props}
    >
      {children}
      {onRemove ? (
        <button type="button" aria-label="Remove" className="ml-0.5 opacity-70 hover:opacity-100" onClick={(e) => { e.stopPropagation(); onRemove() }}>
          ×
        </button>
      ) : null}
    </span>
  )
}

export { tagVariants }
