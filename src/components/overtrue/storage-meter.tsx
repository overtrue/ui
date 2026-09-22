import * as React from "react"
import { cn } from "@/lib/utils"

export interface StorageSegment {
  label: string
  value: number
  color: string
}

export interface StorageMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  usedLabel: string
  totalLabel: string
  segments: StorageSegment[]
}

export function StorageMeter({ usedLabel, totalLabel, segments, className, ...props }: StorageMeterProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="text-sm">
        Using Storage <strong>{usedLabel}</strong> of {totalLabel}
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((s) => (
          <div
            key={s.label}
            className="h-full transition-all"
            style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
            title={`${s.label} ${s.value}`}
          />
        ))}
      </div>
      <ul className="space-y-1 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            <span>
              {s.label} {s.value}MB
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
