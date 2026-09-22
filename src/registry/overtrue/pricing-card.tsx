import type { ReactNode } from "react";
import { IconCheck as Check } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
export function PricingCard({
  name,
  price,
  description,
  features,
  action,
  highlighted = false,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  action: ReactNode;
  highlighted?: boolean;
}) {
  return (
    <Card
      className={cn(
        "relative gap-0 rounded-lg border bg-card py-0 shadow-sm",
        highlighted && "border-primary",
      )}
    >
      <CardHeader className="block p-6 pb-0">
        <CardTitle className="text-base font-semibold">{name}</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="p-6">
        <p className="mb-6 text-4xl font-semibold tracking-tight text-card-foreground">
          {price}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            / month
          </span>
        </p>
        <ul className="mb-6 space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="size-4 text-primary" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        {action}
      </CardContent>
    </Card>
  );
}
