import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
const variants = {
  success:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-600/15 dark:text-emerald-400 dark:ring-emerald-400/20",
  warning:
    "bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:text-amber-400 dark:ring-amber-400/20",
  error: "bg-destructive/10 text-destructive ring-destructive/20",
  info: "bg-primary/10 text-primary ring-primary/15",
  neutral: "bg-muted text-muted-foreground ring-border",
};
export function StatusBadge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      data-slot="status-badge"
      data-variant={variant}
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        variants[variant],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}
