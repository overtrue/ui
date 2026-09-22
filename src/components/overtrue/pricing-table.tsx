import { IconCheck } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface PricingTableTier {
  name: string
  price: string
  period?: string
  features: (string | boolean)[]
  cta?: string
  highlighted?: boolean
  onChoose?: () => void
}

export function PricingTable({
  tiers,
  featureLabels,
  className,
}: {
  tiers: PricingTableTier[]
  featureLabels: string[]
  className?: string
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="w-40 p-3 text-left font-medium text-muted-foreground">Features</th>
            {tiers.map((t) => (
              <th
                key={t.name}
                className={cn(
                  "border-l p-3 text-left align-top",
                  t.highlighted && "bg-primary/5",
                )}
              >
                <div className="font-semibold">{t.name}</div>
                <div className="mt-1 text-2xl font-bold">
                  {t.price}
                  <span className="text-sm font-normal text-muted-foreground">{t.period ?? "/mo"}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {featureLabels.map((label, fi) => (
            <tr key={label}>
              <td className="border-t p-3 text-muted-foreground">{label}</td>
              {tiers.map((t) => (
                <td
                  key={t.name + label}
                  className={cn("border-l border-t p-3", t.highlighted && "bg-primary/5")}
                >
                  {typeof t.features[fi] === "boolean" ? (
                    t.features[fi] ? (
                      <IconCheck className="h-4 w-4 text-success" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )
                  ) : (
                    t.features[fi]
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="border-t p-3" />
            {tiers.map((t) => (
              <td key={t.name + "cta"} className={cn("border-l border-t p-3", t.highlighted && "bg-primary/5")}>
                <Button onClick={t.onChoose} variant={t.highlighted ? "default" : "outline"} className="w-full">
                  {t.cta ?? "Choose"}
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
