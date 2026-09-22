import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export interface LogEntry {
  id: string
  time: string
  level: "info" | "warning" | "error" | "success"
  message: string
  source?: string
}

const levelVariant = {
  info: "soft-info",
  warning: "soft-warning",
  error: "soft-danger",
  success: "soft-success",
} as const

export function LogsList({ entries, className }: { entries: LogEntry[]; className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="p-0">
        <ul className="divide-y font-mono text-xs">
          {entries.map((e) => (
            <li key={e.id} className="flex flex-wrap items-start gap-2 px-3 py-2">
              <span className="text-muted-foreground">{e.time}</span>
              <Badge variant={levelVariant[e.level]} className="uppercase">
                {e.level}
              </Badge>
              <span className="min-w-0 flex-1">{e.message}</span>
              {e.source ? <span className="text-muted-foreground">{e.source}</span> : null}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function LogsTable({ entries, className }: { entries: LogEntry[]; className?: string }) {
  return <LogsList entries={entries} className={cn(className)} />
}
