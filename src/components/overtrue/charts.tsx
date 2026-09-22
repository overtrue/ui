import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts"
import { useId } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface ChartPoint {
  name: string
  value: number
  value2?: number
}

export function AreaTrendChart({
  title,
  data,
  height = 220,
  className,
}: {
  title?: string
  data: ChartPoint[]
  height?: number
  className?: string
}) {
  const gradientId = useId().replaceAll(":", "")
  return (
    <Card className={className}>
      {title ? (
        <CardHeader className="border-b border-border">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="p-4">
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Area
                isAnimationActive={false}
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill={`url(#${gradientId})`}
                strokeWidth={2}
              />
              {data.some((d) => d.value2 != null) ? (
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="value2"
                  stroke="hsl(var(--success))"
                  fill="transparent"
                  strokeWidth={2}
                />
              ) : null}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function BarMetricChart({
  title,
  data,
  height = 220,
  className,
}: {
  title?: string
  data: ChartPoint[]
  height?: number
  className?: string
}) {
  return (
    <Card className={className}>
      {title ? (
        <CardHeader className="border-b border-border">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="p-4">
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
