import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import {
  UptimeHistory,
  type AvailabilityStatus,
  type UptimeSample,
} from "./uptime-history";
import { cn } from "@/lib/utils";

export interface ServiceRecord {
  id: string;
  name: string;
  status: AvailabilityStatus;
  samples: readonly UptimeSample[];
  startLabel?: string;
  endLabel?: string;
}
const states = {
  operational: { label: "Operational", variant: "success" },
  degraded: { label: "Degraded", variant: "warning" },
  outage: { label: "Outage", variant: "error" },
  unknown: { label: "Unknown", variant: "neutral" },
} as const;

/** Parent owns the selected period, data loading and incident content. */
export function ServiceStatus({
  services,
  title = "Service availability",
  description,
  actions,
  children,
  className,
}: {
  services: readonly ServiceRecord[];
  title?: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Card
      data-slot="service-status"
      className={cn(
        "min-w-0 gap-0 rounded-lg border bg-card py-0 text-card-foreground shadow-none",
        className,
      )}
    >
      <CardHeader className="flex flex-wrap items-start justify-between gap-4 border-0 p-5 pb-0">
        <div className="space-y-1">
          <CardTitle className="m-0 text-sm font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="m-0 text-xs text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
        {actions}
      </CardHeader>
      <CardContent className="space-y-6 p-5">
        {services.length ? (
          services.map((service) => (
            <section
              key={service.id}
              aria-label={service.name}
              className="space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="m-0 text-sm font-medium">{service.name}</h3>
                <StatusBadge variant={states[service.status].variant}>
                  {states[service.status].label}
                </StatusBadge>
              </div>
              <UptimeHistory
                label={`${service.name} availability history`}
                samples={service.samples}
                startLabel={service.startLabel}
                endLabel={service.endLabel}
              />
            </section>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No services to report yet.
          </p>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
