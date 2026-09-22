import * as React from "react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { checked?: boolean | "indeterminate"; onCheckedChange?: (v: boolean) => void }
>(({ className, checked = false, onCheckedChange, ...props }, ref) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked === "indeterminate" ? "mixed" : checked}
    ref={ref}
    onClick={() => onCheckedChange?.(checked !== true)}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      checked && "bg-primary text-primary-foreground",
      className,
    )}
    {...props}
  >
    {checked ? (
      <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3 mx-auto">
        <path d={checked === "indeterminate" ? "M3.5 8h9" : "M3.5 8.5l3 3 6-6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : null}
  </button>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
