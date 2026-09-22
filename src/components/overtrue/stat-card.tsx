import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string
  trend?: string
  trendDirection?: "up" | "down" | "flat"
  progress?: number
  progressLabel?: string
  icon?: React.ReactNode
}

export function StatCard({
  title,
  value,
  trend,
  trendDirection = "flat",
  progress,
  progressLabel,
  icon,
  className,
  ...props
}: StatCardProps) {
  const trendClass =
    trendDirection === "up"
      ? "text-success"
      : trendDirection === "down"
        ? "text-destructive"
        : "text-muted-foreground"
  return (
    <Card className={className} {...props}>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm text-muted-foreground">{title}</div>
          {icon ? <div className="text-muted-foreground">{icon}</div> : null}
        </div>
        <div className="h1">{value}</div>
        {trend ? <div className={cn("text-sm", trendClass)}>{trend}</div> : null}
        {typeof progress === "number" ? (
          <div className="space-y-1">
            <Progress value={progress} />
            {progressLabel ? (
              <div className="text-xs text-muted-foreground">{progressLabel}</div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
