import * as React from "react"
import { cn } from "@/lib/utils"

/** overtrue/ui form-label: 14px / 500 / #374151 / mb 8px */
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "mb-2 block text-sm font-medium leading-none text-[#374151]",
      error && "text-[#dc2626]",
      className,
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
