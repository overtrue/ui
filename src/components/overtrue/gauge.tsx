import { cn } from "@/lib/utils"

/** overtrue/ui-style circular percentage gauge (Active Users 58%) */
export function CircularGauge({
  value,
  label,
  className,
}: {
  value: number
  label?: string
  className?: string
}) {
  const r = 42
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const offset = c - (pct / 100) * c
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative h-[110px] w-[110px]">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {label ? (
            <span className="metric-label mb-0.5 text-[9px] leading-tight">{label}</span>
          ) : null}
          <span className="text-2xl font-semibold">{pct}%</span>
        </div>
      </div>
    </div>
  )
}
