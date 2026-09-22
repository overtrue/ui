import * as React from "react"
import { cn } from "@/lib/utils"

/** overtrue/ui .form-control — 40px, padding 9px 16px, border #e5e7eb, radius 6px, 14px */
const controlBase =
  "flex w-full rounded-md border border-[#e5e7eb] bg-white px-4 py-[9px] text-sm text-[#374151] shadow-none placeholder:text-[#9ca3af] focus:outline-none focus:border-[#066fd1] focus:ring-0 disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-[#9ca3af]"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { appearance?: "default" | "workspace" }
>(({ className, appearance, ...props }, ref) => (
  <input
    ref={ref}
    className={
      appearance === "workspace"
        ? className
        : cn(controlBase, "h-10", className)
    }
    {...props}
  />
))
Input.displayName = "Input"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & { appearance?: "default" | "workspace" }
>(({ className, appearance, ...props }, ref) => (
  <textarea
    ref={ref}
    className={
      appearance === "workspace"
        ? className
        : cn(controlBase, "min-h-[80px]", className)
    }
    {...props}
  />
))
Textarea.displayName = "Textarea"

export { Input, Textarea, controlBase }
