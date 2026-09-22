import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export interface SparklinePoint {
  label: string
  value: number
}

export interface SparklineCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string
  trend?: string
  ranges?: string[]
  series?: SparklinePoint[]
}

function MiniBars({ series }: { series: SparklinePoint[] }) {
  const max = Math.max(...series.map((s) => s.value), 1)
  return (
    <div className="flex h-16 items-end gap-1" aria-hidden>
      {series.map((s) => (
        <div
          key={s.label}
          className="flex-1 rounded-sm bg-primary/70"
          style={{ height: `${(s.value / max) * 100}%` }}
          title={s.label}
        />
      ))}
    </div>
  )
}

export function SparklineCard({
  title,
  value,
  trend,
  ranges = ["Last 7 days", "Last 30 days", "Last 3 months"],
  series = [],
  className,
  ...props
}: SparklineCardProps) {
  return (
    <Card className={className} {...props}>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-normal text-muted-foreground">{title}</CardTitle>
        </div>
        <div className="h1">{value}</div>
        {trend ? <div className="text-sm text-muted-foreground">{trend}</div> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <Tabs defaultValue={ranges[0]}>
          <TabsList className="h-8 w-full justify-start overflow-x-auto">
            {ranges.map((r) => (
              <TabsTrigger key={r} value={r} className="text-xs">
                {r}
              </TabsTrigger>
            ))}
          </TabsList>
          {ranges.map((r) => (
            <TabsContent key={r} value={r}>
              <MiniBars series={series} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
