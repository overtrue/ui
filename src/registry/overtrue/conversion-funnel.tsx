import { cn } from "@/lib/utils";

export interface FunnelStage {
  id: string;
  label: string;
  value: number;
}
export interface ConversionFunnelProps {
  stages: FunnelStage[];
  label: string;
  formatValue?: (value: number) => string;
  className?: string;
}

export function ConversionFunnel({
  stages,
  label,
  formatValue = (value) => value.toLocaleString("en-US"),
  className,
}: ConversionFunnelProps) {
  const rows = stages.map((stage) => ({
    ...stage,
    value: Number.isFinite(stage.value) ? Math.max(0, stage.value) : 0,
  }));
  const first = rows[0]?.value ?? 0;
  const maximum = rows.reduce((max, stage) => Math.max(max, stage.value), 0);
  return (
    <ol
      data-slot="conversion-funnel"
      aria-label={label}
      className={cn("m-0 list-none space-y-5 p-0", className)}
    >
      {!rows.length && (
        <li className="py-8 text-center text-sm text-muted-foreground">
          No conversion data for this period.
        </li>
      )}
      {rows.map((stage, index) => {
        const previous = rows[index - 1]?.value;
        return (
          <li key={stage.id}>
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
              <span className="min-w-0 wrap-anywhere text-foreground">
                <span className="mr-2 text-xs tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {stage.label}
              </span>
              <span className="font-medium tabular-nums text-foreground">
                {formatValue(stage.value)}
              </span>
            </div>
            <div
              aria-hidden="true"
              className="h-2 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${maximum ? (stage.value / maximum) * 100 : 0}%`,
                  opacity: 1 - Math.min(index, 4) * 0.13,
                }}
              />
            </div>
            <p className="mt-1.5 flex flex-wrap justify-between gap-x-3 text-xs tabular-nums text-muted-foreground">
              <span>
                {first
                  ? `${((stage.value / first) * 100).toFixed(1)}% of ${rows[0].label.toLowerCase()}`
                  : "Conversion unavailable"}
              </span>
              {index > 0 && (
                <span>
                  {previous
                    ? `${((stage.value / previous) * 100).toFixed(1)}% from previous`
                    : "No previous entries"}
                </span>
              )}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
