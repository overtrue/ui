import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  price: string
  period?: string
  features: string[]
  highlighted?: boolean
  cta?: string
  onChoose?: () => void
}

export function PricingCard({
  name,
  price,
  period = "/mo",
  features,
  highlighted,
  cta = "Choose plan",
  className,
  onChoose,
  ...props
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex h-full flex-col",
        highlighted && "border-primary shadow-md ring-1 ring-primary/20",
        className,
  onChoose,
      )}
      {...props}
    >
      {highlighted ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
          Popular
        </div>
      ) : null}
      <CardContent className="flex flex-1 flex-col gap-4 p-6">
        <div className="text-sm font-medium text-muted-foreground">{name}</div>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-sm text-muted-foreground">{period}</span>
        </div>
        <ul className="flex-1 space-y-2 text-sm">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {f}
            </li>
          ))}
        </ul>
        <Button onClick={onChoose} variant={highlighted ? "default" : "outline"}>{cta}</Button>
      </CardContent>
    </Card>
  )
}
