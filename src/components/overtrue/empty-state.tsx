import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; onClick?: () => void }
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)} {...props}>
      <CardContent className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
        <h3 className="h3">{title}</h3>
        {description ? (
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        ) : null}
        {action ? (
          <Button className="mt-2" onClick={action.onClick}>
            {action.label}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
