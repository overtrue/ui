import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  success:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/25",
  warning:
    "bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/25",
  error:
    "bg-destructive/10 text-destructive ring-destructive/20 dark:ring-destructive/30",
  info: "bg-primary/10 text-primary ring-primary/20 dark:ring-primary/30",
  neutral:
    "bg-muted/70 text-muted-foreground ring-border dark:bg-muted/50",
};
const dots = {
  success: "bg-emerald-500 dark:bg-emerald-400",
  warning: "bg-amber-500 dark:bg-amber-400",
  error: "bg-destructive",
  info: "bg-primary",
  neutral: "bg-muted-foreground/70",
};
const styles = `@keyframes status-badge-pulse{0%{transform:scale(1);opacity:.6}70%,100%{transform:scale(2.75);opacity:0}}`;

export interface StatusBadgeProps
  extends Omit<ComponentProps<"span">, "children"> {
  children: ReactNode;
  variant?: keyof typeof variants;
  /** Pulse the dot softly for states that are happening right now. */
  live?: boolean;
}

export function StatusBadge({
  children,
  variant = "neutral",
  live = false,
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      data-slot="status-badge"
      data-variant={variant}
      data-live={live || undefined}
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full py-0.5 pr-2.5 pl-2 text-xs leading-5 font-medium tabular-nums ring-1 ring-inset",
        variants[variant],
        className,
      )}
      {...props}
    >
      {live ? (
        <style href="overtrue-status-badge" precedence="default">
          {styles}
        </style>
      ) : null}
      <span
        aria-hidden="true"
        data-slot="status-badge-dot"
        className="relative flex size-1.5 shrink-0"
      >
        {live ? (
          <span
            className={cn(
              "absolute inset-0 rounded-full motion-safe:animate-[status-badge-pulse_2s_cubic-bezier(0.22,1,0.36,1)_infinite] motion-reduce:hidden",
              dots[variant],
            )}
          />
        ) : null}
        <span className={cn("relative size-1.5 rounded-full", dots[variant])} />
      </span>
      {children}
    </span>
  );
}
