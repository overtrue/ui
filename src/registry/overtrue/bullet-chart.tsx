"use client";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Ascending thresholds that split the scale into three qualitative ranges. */
export type BulletChartRanges = [number, number, number];
export type BulletChartQuality = "poor" | "satisfactory" | "good";

export interface BulletChartItem {
  id: string;
  label: string;
  sublabel?: string;
  value: number;
  target: number;
  /**
   * Upper bounds of the poor, satisfactory and good ranges, e.g. [600, 800, 1000].
   * With `invert` the same bounds read good, satisfactory, poor.
   */
  ranges?: BulletChartRanges;
  /** End of the scale. Defaults to the last range, or a rounded value above the data. */
  max?: number;
  /** Lower is better, e.g. response time, churn or cost. */
  invert?: boolean;
  /** Formats this row's value, target and gap. Overrides the chart's formatter. */
  valueFormatter?: (value: number) => string;
}

export interface BulletChartProps extends Omit<
  ComponentProps<"section">,
  "title" | "children"
> {
  items: BulletChartItem[];
  title?: ReactNode;
  description?: ReactNode;
  valueFormatter?: (value: number, item: BulletChartItem) => string;
  size?: "default" | "compact";
  /** Paint the measure in the primary color, or by whether it meets its target. */
  tone?: "primary" | "status";
  showLegend?: boolean;
}

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});
const wholePercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});
const precisePercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const bandShade: Record<BulletChartQuality, string> = {
  poor: "bg-foreground/[0.15]",
  satisfactory: "bg-foreground/[0.085]",
  good: "bg-foreground/[0.04]",
};

type Status = "met" | "behind" | "at-risk";

const statusFill: Record<Status, string> = {
  met: "bg-emerald-600 dark:bg-emerald-500",
  behind: "bg-amber-500 dark:bg-amber-400",
  "at-risk": "bg-red-600 dark:bg-red-500",
};

function niceCeil(value: number) {
  if (!(value > 0)) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((n) => value <= n * magnitude) ?? 10;
  return step * magnitude;
}

const finite = (value: number) => (Number.isFinite(value) ? value : 0);
const clampPercent = (value: number, max: number) =>
  Math.min(100, Math.max(0, (value / max) * 100));

function measure(item: BulletChartItem, format: (value: number) => string) {
  const value = finite(item.value);
  const target = finite(item.target);
  const ranges = item.ranges
    ? ([...item.ranges].map(finite).sort((a, b) => a - b) as BulletChartRanges)
    : undefined;
  const peak = Math.max(value, target);
  const max =
    item.max && item.max > 0
      ? item.max
      : ranges && ranges[2] >= peak && ranges[2] > 0
        ? ranges[2]
        : niceCeil(Math.max(peak, ranges?.[2] ?? 0) * 1.1);

  const order: BulletChartQuality[] = item.invert
    ? ["good", "satisfactory", "poor"]
    : ["poor", "satisfactory", "good"];
  const bands = ranges
    ? ranges.map((end, index) => ({
        quality: order[index],
        from: clampPercent(index ? ranges[index - 1] : 0, max),
        to: clampPercent(end, max),
      }))
    : [];
  const quality = ranges
    ? order[value < ranges[0] ? 0 : value < ranges[1] ? 1 : 2]
    : undefined;

  const met = item.invert ? value <= target : value >= target;
  const status: Status = met
    ? "met"
    : quality === "poor"
      ? "at-risk"
      : "behind";
  const ratio = target ? value / target : undefined;
  const gap = value - target;
  const gapShort =
    gap === 0
      ? "on target"
      : `${format(Math.abs(gap))} ${gap > 0 ? "above" : "below"}`;

  const formattedValue = format(value);
  const formattedTarget = format(target);
  const summary = [
    `${item.label}: ${formattedValue} of ${formattedTarget} target`,
    ratio !== undefined ? ` (${wholePercent.format(ratio)})` : "",
    item.invert ? ", lower is better" : "",
    quality ? `, ${quality} range` : "",
    gap === 0 ? ". On target." : `. ${gapShort} target.`,
  ].join("");

  return {
    value,
    target,
    bands,
    status,
    ratio,
    gapShort,
    formattedValue,
    formattedTarget,
    summary,
    valuePercent: clampPercent(value, max),
    targetPercent: clampPercent(target, max),
  };
}

/** Stephen Few's bullet graph: a measure against its target over qualitative ranges. */
export function BulletChart({
  items,
  title,
  description,
  valueFormatter,
  size = "default",
  tone = "primary",
  showLegend = true,
  className,
  ...props
}: BulletChartProps) {
  const titleId = useId();
  const compact = size === "compact";
  const hasHeader = Boolean(title || description || showLegend);

  return (
    <section
      data-slot="bullet-chart"
      data-size={size}
      aria-labelledby={title ? titleId : undefined}
      className={cn(
        "@container/bullet rounded-xl border bg-card text-card-foreground shadow-xs",
        compact ? "p-4" : "p-5 @lg/bullet:p-6",
        className,
      )}
      {...props}
    >
      {hasHeader && (
        <header
          className={cn(
            "flex flex-wrap items-start justify-between gap-x-6 gap-y-3",
            compact ? "mb-3" : "mb-5",
          )}
        >
          {(title || description) && (
            <div className="min-w-0">
              {title && (
                <h3
                  id={titleId}
                  className={cn(
                    "leading-tight font-semibold tracking-tight",
                    compact ? "text-sm" : "text-base",
                  )}
                >
                  {title}
                </h3>
              )}
              {description && (
                <p
                  className={cn(
                    "mt-1 text-muted-foreground",
                    compact ? "text-xs" : "text-sm",
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
          {showLegend && <Legend tone={tone} />}
        </header>
      )}

      <ul
        role="list"
        className={cn(
          "grid grid-cols-[minmax(0,1fr)_auto] gap-x-4",
          "@min-[25rem]/bullet:grid-cols-[fit-content(11rem)_minmax(0,1fr)_auto] @lg/bullet:gap-x-5",
          compact ? "gap-y-0.5" : "gap-y-1",
        )}
      >
        {items.map((item, index) => {
          const format = item.valueFormatter
            ? item.valueFormatter
            : valueFormatter
              ? (value: number) => valueFormatter(value, item)
              : (value: number) => numberFormat.format(value);
          const row = measure(item, format);
          return (
            <li
              key={item.id}
              tabIndex={0}
              data-status={row.status}
              className={cn(
                "group relative col-span-2 -mx-3 grid grid-cols-subgrid items-center gap-y-2 rounded-lg px-3 outline-none",
                "transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50",
                "@min-[25rem]/bullet:col-span-3",
                compact ? "py-2" : "py-2.5",
              )}
            >
              <span className="sr-only">{row.summary}</span>

              <div
                aria-hidden="true"
                className="col-start-1 row-start-1 min-w-0"
              >
                {compact ? (
                  <p className="truncate text-[13px] leading-5">
                    <span className="font-medium">{item.label}</span>
                    {item.sublabel && (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        {item.sublabel}
                      </span>
                    )}
                  </p>
                ) : (
                  <>
                    <p className="truncate text-sm leading-5 font-medium">
                      {item.label}
                    </p>
                    {item.sublabel && (
                      <p className="truncate text-xs leading-4 text-muted-foreground">
                        {item.sublabel}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div
                aria-hidden="true"
                className="col-start-2 row-start-1 text-right tabular-nums @min-[25rem]/bullet:col-start-3"
              >
                {compact ? (
                  <p className="text-[13px] leading-5 whitespace-nowrap">
                    <span className="font-semibold">{row.formattedValue}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      / {row.formattedTarget}
                    </span>
                  </p>
                ) : (
                  <>
                    <p className="text-sm leading-5 font-semibold whitespace-nowrap">
                      {row.formattedValue}
                    </p>
                    <p className="text-xs leading-4 whitespace-nowrap text-muted-foreground">
                      of {row.formattedTarget}
                    </p>
                  </>
                )}
              </div>

              <div
                aria-hidden="true"
                className={cn(
                  "relative col-span-2 row-start-2 @min-[25rem]/bullet:col-span-1 @min-[25rem]/bullet:col-start-2 @min-[25rem]/bullet:row-start-1",
                  compact ? "h-4" : "h-6",
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 overflow-hidden rounded-[3px]",
                    row.bands.length ? "bg-foreground/[0.02]" : "bg-muted",
                  )}
                >
                  {row.bands.map((band) => (
                    <div
                      key={band.quality}
                      className={cn(
                        "absolute inset-y-0",
                        bandShade[band.quality],
                      )}
                      style={{
                        left: `${band.from}%`,
                        width: `${band.to - band.from}%`,
                      }}
                    />
                  ))}
                </div>
                <div
                  className={cn(
                    "absolute left-0 origin-left rounded-[2px] transition-[width,transform,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] starting:[transform:scaleX(0)] motion-reduce:transition-none",
                    compact ? "top-[5px] h-1.5" : "top-2 h-2",
                    tone === "status" ? statusFill[row.status] : "bg-primary",
                  )}
                  style={{
                    width: `${row.valuePercent}%`,
                    transitionDelay: `${80 + index * 70}ms`,
                  }}
                />
                <div
                  className={cn(
                    "absolute w-0.5 -translate-x-1/2 rounded-full bg-foreground transition-[left,opacity] duration-500 starting:opacity-0 motion-reduce:transition-none",
                    compact ? "inset-y-0.5" : "inset-y-1",
                  )}
                  style={{
                    left: `${row.targetPercent}%`,
                    transitionDelay: `${360 + index * 70}ms`,
                  }}
                />

                {/* The readout slides along with the measure: at X% it is shifted
                    by X% of its own width, so it never leaves the track and its
                    caret always points at the end of the bar. */}
                <div
                  className={cn(
                    "pointer-events-none absolute bottom-full z-10 mb-2.5 translate-y-1 rounded-md bg-foreground px-2.5 py-1.5 font-mono text-[11px] leading-4 whitespace-nowrap text-background tabular-nums opacity-0 shadow-lg shadow-black/10 transition-[opacity,translate] duration-150",
                    "group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none",
                  )}
                  style={{
                    left: `${row.valuePercent}%`,
                    transform: `translateX(-${row.valuePercent}%)`,
                  }}
                >
                  <p>
                    <span className="font-semibold">{row.formattedValue}</span>
                    <span className="opacity-60"> / {row.formattedTarget}</span>
                  </p>
                  <p>
                    <span>
                      {row.ratio !== undefined
                        ? precisePercent.format(row.ratio)
                        : "—"}
                    </span>
                    <span className="opacity-40"> · </span>
                    <span
                      className={
                        row.status === "met"
                          ? "text-emerald-400 dark:text-emerald-700"
                          : "text-red-400 dark:text-red-700"
                      }
                    >
                      {row.gapShort}
                    </span>
                  </p>
                  <span
                    className="absolute top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1px] bg-foreground"
                    style={{
                      left: `clamp(8px, ${row.valuePercent}%, calc(100% - 8px))`,
                    }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Legend({ tone }: { tone: "primary" | "status" }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
      <li className="flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="flex h-2.5 w-9 overflow-hidden rounded-[2px]"
        >
          <span className={cn("flex-1", bandShade.poor)} />
          <span className={cn("flex-1", bandShade.satisfactory)} />
          <span className={cn("flex-1", bandShade.good)} />
        </span>
        Poor → good
      </li>
      {tone === "status" ? (
        (
          [
            ["met", "Met"],
            ["behind", "Behind"],
            ["at-risk", "At risk"],
          ] as const
        ).map(([status, label]) => (
          <li key={status} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn("h-1.5 w-3 rounded-[1px]", statusFill[status])}
            />
            {label}
          </li>
        ))
      ) : (
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-1.5 w-3 rounded-[1px] bg-primary"
          />
          Actual
        </li>
      )}
      <li className="flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="h-3 w-0.5 rounded-full bg-foreground"
        />
        Target
      </li>
    </ul>
  );
}
