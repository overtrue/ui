import * as React from "react"
import { cn } from "@/lib/utils"

/** Shared control surface, with visible focus and validation states in either theme. */
const controlBase =
  "flex w-full min-w-0 rounded-md border border-input bg-card px-3 py-2 text-base leading-5 text-foreground shadow-xs placeholder:text-muted-foreground transition-[border-color,box-shadow] outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 [&:user-invalid]:border-destructive [&:user-invalid]:ring-2 [&:user-invalid]:ring-destructive/20 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none sm:text-sm motion-reduce:transition-none"

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
