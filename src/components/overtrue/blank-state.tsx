import { IconCheck } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export function BlankState({
  title = "Blank page",
  description = "This page intentionally left blank. Compose your own high-order components here.",
  className,
}: {
  title?: string
  description?: string
  className?: string
}) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <IconCheck className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="h2">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
