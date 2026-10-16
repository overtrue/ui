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

const keyframes =
  "@keyframes conversion-funnel-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}";

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
      <style href="overtrue-conversion-funnel" precedence="default">
        {keyframes}
      </style>
      {!rows.length && (
        <li className="py-8 text-center text-sm text-muted-foreground">
          No conversion data for this period.
        </li>
      )}
      {rows.map((stage, index) => {
        const previous = rows[index - 1]?.value;
        const width = maximum ? (stage.value / maximum) * 100 : 0;
        const previousWidth =
          maximum && previous !== undefined ? (previous / maximum) * 100 : 0;
        return (
          <li key={stage.id} data-slot="conversion-funnel-stage">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
              <span className="min-w-0 wrap-anywhere text-foreground">
                <span className="mr-2 font-mono text-xs tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {stage.label}
              </span>
              <span className="font-semibold tracking-[-0.01em] tabular-nums text-foreground">
                {formatValue(stage.value)}
              </span>
            </div>
            <div
              aria-hidden="true"
              data-slot="conversion-funnel-track"
              className="relative h-2 overflow-hidden rounded-full bg-muted"
            >
              {previousWidth > width && (
                <div
                  data-slot="conversion-funnel-loss"
                  className="absolute inset-y-0 transition-[left,width] duration-500 motion-reduce:transition-none"
                  style={{
                    left: `${width}%`,
                    width: `${previousWidth - width}%`,
                    backgroundImage:
                      "repeating-linear-gradient(-45deg, color-mix(in oklab, var(--color-primary) 24%, transparent) 0 1px, transparent 1px 4px)",
                  }}
                />
              )}
              <div
                data-slot="conversion-funnel-bar"
                className="relative h-full origin-left rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:animate-[conversion-funnel-grow_700ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:transition-none"
                style={{
                  width: `${width}%`,
                  opacity: 1 - Math.min(index, 4) * 0.1,
                  backgroundImage:
                    "linear-gradient(90deg, color-mix(in oklab, var(--color-primary) 72%, transparent), var(--color-primary))",
                  animationDelay: `${Math.min(index, 8) * 60}ms`,
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
