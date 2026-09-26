import * as React from "react"
import { cn } from "@/lib/utils"

/** Keep labels readable and aligned with their controls in both themes. */
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "mb-2 block text-sm font-medium leading-5 text-foreground",
      error && "text-destructive",
      className,
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
