import { cn } from "@/lib/utils"

/** overtrue/ui-style circular percentage gauge */
export function CircularGauge({
  value,
  label,
  showLabel = false,
  className,
}: {
  value: number
  label?: string
  showLabel?: boolean
  className?: string
}) {
  const r = 40
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const offset = c - (pct / 100) * c
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative h-[120px] w-[120px]">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="#066fd1"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showLabel && label ? (
            <span className="metric-label mb-0.5 text-[10px] leading-none">{label}</span>
          ) : null}
          <span className="text-2xl font-semibold text-[#111827]">{pct}%</span>
        </div>
      </div>
    </div>
  )
}

export function Trend({
  value,
  direction,
}: {
  value: string
  direction?: "up" | "down" | "flat"
}) {
  const cls =
    direction === "up"
      ? "text-[#16a34a]"
      : direction === "down"
        ? "text-[#dc2626]"
        : "text-muted-foreground"
  return (
    <span className={cn("text-xs font-medium", cls)}>
      {value} {direction === "up" ? "↑" : direction === "down" ? "↓" : "—"}
    </span>
  )
}

export function MetricLine({
  title,
  value,
  trend,
  direction,
  range = "Last 7 days",
  children,
  className,
}: {
  title: string
  value: string
  trend?: string
  direction?: "up" | "down" | "flat"
  range?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("card p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="metric-label">{title}</span>
        <button
          type="button"
          className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground"
        >
          {range}
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-[#111827]">{value}</span>
        {trend ? <Trend value={trend} direction={direction} /> : null}
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  )
}

export function IconStatTile({
  value,
  label,
  sub,
  icon,
  tone = "primary",
}: {
  value: string
  label: string
  sub: string
  icon: React.ReactNode
  tone?: "primary" | "success" | "dark" | "info"
}) {
  const toneCls = {
    primary: "bg-[#066fd1] text-white",
    success: "bg-[#16a34a] text-white",
    dark: "bg-[#111827] text-white",
    info: "bg-[#4299e1] text-white",
  }[tone]
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", toneCls)}>
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-sm">
          <span className="font-semibold text-[#111827]">{value}</span> {label}
        </div>
        <div className="truncate text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  )
}
