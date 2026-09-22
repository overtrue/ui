import * as React from "react"
import { cn } from "@/lib/utils"

/** overtrue/ui-style status: colored dot + label (not filled pill) */
const statusColor: Record<string, string> = {
  paid: "#16a34a",
  pending: "#f76707",
  due: "#6b7280",
  overdue: "#dc2626",
  success: "#16a34a",
  danger: "#dc2626",
  warning: "#f76707",
  info: "#4299e1",
  open: "#066fd1",
  closed: "#6b7280",
  active: "#16a34a",
  inactive: "#6b7280",
  muted: "#6b7280",
  new: "#066fd1",
  unread: "#066fd1",
  read: "#6b7280",
}

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: keyof typeof statusColor | string
  label?: string
  shape?: "default" | "pill"
}

export function StatusBadge({
  status = "muted",
  label,
  shape = "default",
  className,
  ...props
}: StatusBadgeProps) {
  const color = statusColor[status] ?? statusColor.muted
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-sm", className)}
      {...props}
    >
      <span
        className="inline-block h-2 w-2 shrink-0 rounded-full"
        style={{ background: color }}
        aria-hidden
      />
      <span className="text-foreground">{label ?? status}</span>
    </span>
  )
}

export { statusColor }
