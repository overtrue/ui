import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        workspace: "",
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        info: "border-transparent bg-info text-info-foreground",
        outline: "text-foreground",
        soft: "border-transparent bg-primary/15 text-primary",
        "soft-success": "border-transparent bg-success/15 text-success",
        "soft-warning": "border-transparent bg-warning/15 text-warning",
        "soft-danger": "border-transparent bg-destructive/15 text-destructive",
        "soft-info": "border-transparent bg-info/15 text-info",
        light: "border-transparent bg-muted text-muted-foreground",
        azure: "border-transparent bg-info text-info-foreground",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "default",
    },
  },
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, shape, ...props }: BadgeProps) {
  return (
    <span
      className={
        variant === "workspace"
          ? className
          : cn(badgeVariants({ variant, shape }), className)
      }
      {...props}
    />
  )
}

export { Badge, badgeVariants }
