"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * start sets the running total, delta moves it, subtotal and end show it.
 * Defaults to "delta".
 */
export type WaterfallStepKind = "start" | "delta" | "subtotal" | "end";

export interface WaterfallStep {
  id: string;
  label: string;
  /**
   * The opening amount for a start step, or the signed change for a delta.
   * Subtotal and end steps always show the running total, so the bridge balances.
   */
  value: number;
  kind?: WaterfallStepKind;
}

export type WaterfallDirection = "increase" | "decrease" | "total";

/** Where a value is shown: bar labels, axis ticks, or the tooltip and table. */
export type WaterfallFormatContext = "label" | "axis" | "detail";

export interface WaterfallStepInfo {
  index: number;
  kind: WaterfallStepKind;
  direction: WaterfallDirection;
  /** Signed change for a delta; the total for start, subtotal and end. */
  change: number;
  /** Running total before and after the step. Totals run from 0. */
  from: number;
  to: number;
  /** The change with its sign, or the total, formatted for the tooltip. */
  formattedChange: string;
  /** The running total after the step, formatted for the tooltip. */
  formattedTotal: string;
  /** Change relative to the opening total, when there is one. */
  shareOfStart: number | null;
  /** The bar colour. */
  color: string;
}

export interface WaterfallChartColors {
  /** Any CSS colour. Defaults to emerald. */
  increase?: string;
  /** Any CSS colour. Defaults to the destructive colour. */
  decrease?: string;
  /** Any CSS colour for start, subtotal and end bars. Defaults to the primary colour. */
  total?: string;
}

export type WaterfallOrientation = "vertical" | "horizontal" | "auto";

/** The figures behind the summary line, passed to `renderSummary`. */
export interface WaterfallTotals {
  /** The first start step's value, or null when the bridge has no start. */
  opening: number | null;
  /** The running total after the last step. */
  closing: number;
  /** closing − opening, or null without an opening total. */
  net: number | null;
  /** net as a share of the opening total, or null. */
  netShare: number | null;
  /** The chart's formatter, with a leading − for negative values. */
  format: (value: number, context: WaterfallFormatContext) => string;
}

export interface WaterfallChartProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "onSelect" | "children"
> {
  steps: WaterfallStep[];
  /**
   * Columns, rows, or "auto": columns when the card is wide enough for every step
   * and rows below that, switched with a container query. Defaults to "auto".
   */
  orientation?: WaterfallOrientation;
  /**
   * Formats an amount. It always receives a non-negative number; the chart adds
   * + and − itself. Defaults to compact numbers, and grouped digits in the tooltip.
   */
  valueFormatter?: (value: number, context: WaterfallFormatContext) => string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Controls placed at the top right. */
  actions?: React.ReactNode;
  /** Plot height in pixels for columns. Rows size themselves. Defaults to 280. */
  height?: number;
  colors?: WaterfallChartColors;
  /**
   * "auto" starts the value axis just below the lowest running total when every
   * total is far from zero, and marks the cut on total bars. "zero" always starts at 0.
   */
  baseline?: "auto" | "zero";
  /** Show the closing total and net change under the title. Defaults to true. */
  showSummary?: boolean;
  /** Replace the summary line, e.g. to show a margin instead of the net change. */
  renderSummary?: (totals: WaterfallTotals) => React.ReactNode;
  /** Show the increase, decrease and total key. Defaults to true. */
  showLegend?: boolean;
  /** Replace the tooltip content for a hovered or focused step. */
  renderTooltip?: (
    step: WaterfallStep,
    info: WaterfallStepInfo,
  ) => React.ReactNode;
  /** Called when a step is clicked or activated with Enter. */
  onSelect?: (step: WaterfallStep, info: WaterfallStepInfo) => void;
}

interface Row {
  step: WaterfallStep;
  info: WaterfallStepInfo;
  /** Ends of the bar in data units, low to high. */
  low: number;
  high: number;
  /** Whether the bar is cut by a raised baseline. */
  cut: boolean;
  /** Whether a connector runs from this bar to the next one. */
  connects: boolean;
}

const MINUS = "−";
const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const exactNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});
const sharePercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

function defaultFormatter(value: number, context: WaterfallFormatContext) {
  return context === "detail"
    ? exactNumber.format(value)
    : compactNumber.format(value);
}

const DEFAULT_INCREASE = "var(--color-emerald-500, oklch(69.6% 0.17 162.48))";
const DEFAULT_DECREASE = "var(--color-destructive)";
const DEFAULT_TOTAL = "var(--color-primary)";

/** Container widths where columns take over from rows, by step count. */
const AUTO_SWITCH = [
  {
    upTo: 4,
    columns: "hidden @min-[20rem]/waterfall:block",
    rows: "@min-[20rem]/waterfall:hidden",
  },
  {
    upTo: 5,
    columns: "hidden @min-[24rem]/waterfall:block",
    rows: "@min-[24rem]/waterfall:hidden",
  },
  {
    upTo: 6,
    columns: "hidden @min-[28rem]/waterfall:block",
    rows: "@min-[28rem]/waterfall:hidden",
  },
  {
    upTo: 7,
    columns: "hidden @min-[32rem]/waterfall:block",
    rows: "@min-[32rem]/waterfall:hidden",
  },
  {
    upTo: 8,
    columns: "hidden @min-[36rem]/waterfall:block",
    rows: "@min-[36rem]/waterfall:hidden",
  },
  {
    upTo: 10,
    columns: "hidden @min-[44rem]/waterfall:block",
    rows: "@min-[44rem]/waterfall:hidden",
  },
  {
    upTo: Infinity,
    columns: "hidden @min-[54rem]/waterfall:block",
    rows: "@min-[54rem]/waterfall:hidden",
  },
];

const kindLabel: Record<WaterfallStepKind, string> = {
  start: "Opening total",
  delta: "Change",
  subtotal: "Subtotal",
  end: "Closing total",
};

const finite = (value: number) => (Number.isFinite(value) ? value : 0);

function niceStep(span: number, count: number) {
  const raw = span / Math.max(1, count);
  if (!(raw > 0)) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].find((n) => raw <= n * magnitude) ?? 10;
  return step * magnitude;
}

/**
 * The visible range and its ticks. With a raised baseline the range starts a little
 * below the lowest running total so the changes, not the totals, fill the plot.
 */
function scaleFor(
  rows: Omit<Row, "cut" | "connects">[],
  baseline: "auto" | "zero",
) {
  let low = Infinity;
  let high = -Infinity;
  let totalLow = Infinity;
  for (const row of rows) {
    if (row.info.direction === "total") {
      totalLow = Math.min(totalLow, row.info.to);
      low = Math.min(low, row.info.to);
      high = Math.max(high, row.info.to);
    } else {
      low = Math.min(low, row.low);
      high = Math.max(high, row.high);
    }
  }
  if (!Number.isFinite(low))
    return { min: 0, max: 1, ticks: [0, 1], raised: false };
  let min = Math.min(0, low);
  let max = Math.max(0, high);
  let raised = false;
  if (baseline === "auto" && low > 0 && totalLow > 0 && low / high > 0.35) {
    // Leave room under the lowest total so short bars still read as bars.
    min = Math.max(0, low - (high - low) * 0.55);
    raised = true;
  }
  const step = niceStep(max - min, 4);
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step || step;
  const ticks: number[] = [];
  for (let tick = start; tick <= end + step / 2; tick += step)
    ticks.push(Math.round(tick / step) * step);
  return { min: start, max: end, ticks, raised: raised && start > 0 };
}

const reveal =
  "motion-safe:animate-[waterfall-rise_620ms_cubic-bezier(0.22,1,0.36,1)_backwards]";
const fadeUp =
  "motion-safe:animate-[waterfall-fade_420ms_cubic-bezier(0.22,1,0.36,1)_backwards]";
const draw =
  "motion-safe:animate-[waterfall-draw_360ms_cubic-bezier(0.22,1,0.36,1)_backwards]";

/** Two short card-coloured strokes across a bar whose bottom is cut by a raised axis. */
function CutMark({ horizontal }: { horizontal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 10 10"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute",
        horizontal
          ? "inset-y-0 left-1.5 h-full w-2"
          : "inset-x-0 bottom-1.5 h-2 w-full",
      )}
    >
      {horizontal ? (
        <>
          <path
            d="M3 0 L1 10"
            stroke="var(--color-card)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M8 0 L6 10"
            stroke="var(--color-card)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </>
      ) : (
        <>
          <path
            d="M0 4 L10 2"
            stroke="var(--color-card)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0 9 L10 7"
            stroke="var(--color-card)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  );
}

/**
 * A waterfall (bridge) chart: an opening total, the changes that move it, optional
 * subtotals, and the closing total. Bars rise in sequence on mount; hover or focus a
 * step for a crosshair at its running total and a readout of the change.
 */
function WaterfallChart({
  steps,
  orientation = "auto",
  valueFormatter = defaultFormatter,
  title,
  description,
  actions,
  height = 280,
  colors,
  baseline = "auto",
  showSummary = true,
  showLegend = true,
  renderSummary,
  renderTooltip,
  onSelect,
  className,
  ...props
}: WaterfallChartProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [focused, setFocused] = React.useState<number | null>(null);
  const [cursor, setCursor] = React.useState(0);

  const increase = colors?.increase ?? DEFAULT_INCREASE;
  const decrease = colors?.decrease ?? DEFAULT_DECREASE;
  const total = colors?.total ?? DEFAULT_TOTAL;
  const subtotalFill = `color-mix(in oklab, ${total} 52%, var(--color-card))`;

  const format = React.useCallback(
    (value: number, context: WaterfallFormatContext) =>
      `${value < 0 ? MINUS : ""}${valueFormatter(Math.abs(value), context)}`,
    [valueFormatter],
  );
  const signed = React.useCallback(
    (value: number, context: WaterfallFormatContext) =>
      `${value < 0 ? MINUS : "+"}${valueFormatter(Math.abs(value), context)}`,
    [valueFormatter],
  );

  const { rows, scale, opening, closing } = React.useMemo(() => {
    let running = 0;
    let opening: number | null = null;
    const base = steps.map((step, index) => {
      const kind = step.kind ?? "delta";
      const value = finite(step.value);
      let from = 0;
      let to = 0;
      if (kind === "start") {
        to = value;
        running = value;
        if (opening == null) opening = value;
      } else if (kind === "delta") {
        from = running;
        to = running + value;
        running = to;
      } else {
        to = running;
      }
      const direction: WaterfallDirection =
        kind === "delta" ? (value < 0 ? "decrease" : "increase") : "total";
      const change = kind === "delta" ? value : to;
      const color =
        direction === "increase"
          ? increase
          : direction === "decrease"
            ? decrease
            : kind === "subtotal"
              ? subtotalFill
              : total;
      const info: WaterfallStepInfo = {
        index,
        kind,
        direction,
        change,
        from,
        to,
        formattedChange:
          kind === "delta"
            ? signed(change, "detail")
            : format(change, "detail"),
        formattedTotal: format(to, "detail"),
        shareOfStart:
          opening && kind === "delta"
            ? change / opening
            : opening && kind !== "start"
              ? (to - opening) / opening
              : null,
        color,
      };
      return {
        step,
        info,
        low: Math.min(from, to),
        high: Math.max(from, to),
      };
    });
    const scale = scaleFor(base, baseline);
    const rows: Row[] = base.map((row, index) => {
      const next = base[index + 1];
      return {
        ...row,
        cut: row.info.direction === "total" && scale.raised,
        connects: next != null && next.info.kind !== "start",
      };
    });
    const closing = base.length ? base[base.length - 1].info.to : 0;
    return { rows, scale, opening, closing };
  }, [
    steps,
    baseline,
    increase,
    decrease,
    total,
    subtotalFill,
    format,
    signed,
  ]);

  const span = scale.max - scale.min || 1;
  /** Distance from the low end of the axis, as a percentage. */
  const position = (value: number) =>
    ((Math.min(scale.max, Math.max(scale.min, value)) - scale.min) / span) *
    100;

  const active = hovered ?? focused;
  const activeRow = active != null ? rows[active] : null;
  const count = rows.length;
  const auto = AUTO_SWITCH.find((entry) => count <= entry.upTo)!;
  const net = opening != null ? closing - opening : null;

  const largest = (direction: WaterfallDirection) =>
    rows
      .filter((row) => row.info.direction === direction)
      .sort((a, b) => Math.abs(b.info.change) - Math.abs(a.info.change))[0];
  const topIncrease = largest("increase");
  const topDecrease = largest("decrease");
  const titleText = typeof title === "string" ? title : "Waterfall chart";
  const summary = [
    `${titleText}.`,
    opening != null ? `Starts at ${format(opening, "detail")}` : null,
    count ? `ends at ${format(closing, "detail")}` : null,
    net != null && opening
      ? `(${signed(net, "detail")}, ${sharePercent.format(net / opening)}).`
      : null,
    topIncrease
      ? `Largest increase: ${topIncrease.step.label}, ${topIncrease.info.formattedChange}.`
      : null,
    topDecrease
      ? `Largest decrease: ${topDecrease.step.label}, ${topDecrease.info.formattedChange}.`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  const select = (index: number) => {
    const row = rows[index];
    if (row && onSelect) onSelect(row.step, row.info);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    let next: number | null = null;
    if (event.key in keys) next = (focused ?? cursor) + keys[event.key];
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else if ((event.key === "Enter" || event.key === " ") && focused != null) {
      event.preventDefault();
      select(focused);
      return;
    } else if (event.key === "Escape") {
      setFocused(null);
      return;
    }
    if (next == null || !count) return;
    event.preventDefault();
    const clamped = Math.min(count - 1, Math.max(0, next));
    setCursor(clamped);
    setFocused(clamped);
    setHovered(null);
  };

  const plotProps = (label: string) => ({
    role: "img" as const,
    tabIndex: count ? 0 : -1,
    "aria-label": `${label} Use the arrow keys to read each step.`,
    "aria-roledescription": "waterfall chart",
    onKeyDown,
    onFocus: (event: React.FocusEvent<HTMLDivElement>) => {
      if (
        event.target === event.currentTarget &&
        event.currentTarget.matches(":focus-visible")
      )
        setFocused(cursor);
    },
    onBlur: () => setFocused(null),
    onPointerLeave: () => setHovered(null),
  });

  const valueText = (row: Row) =>
    row.info.kind === "delta"
      ? signed(row.info.change, "label")
      : format(row.info.to, "label");

  const valueTone = (row: Row) => {
    if (row.info.direction === "total") return "text-foreground font-semibold";
    if (row.info.direction === "increase")
      return colors?.increase ? "" : "text-emerald-600 dark:text-emerald-400";
    return colors?.decrease ? "" : "text-destructive";
  };
  const valueStyle = (row: Row): React.CSSProperties | undefined =>
    row.info.direction === "increase" && colors?.increase
      ? { color: colors.increase }
      : row.info.direction === "decrease" && colors?.decrease
        ? { color: colors.decrease }
        : undefined;

  const tooltip = (row: Row) =>
    renderTooltip ? (
      renderTooltip(row.step, row.info)
    ) : (
      <div className="flex min-w-36 flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span
            className="h-2.5 w-[3px] shrink-0 rounded-full"
            style={{ backgroundColor: row.info.color }}
          />
          <span className="truncate">{row.step.label}</span>
        </div>
        <div className="text-sm leading-none font-semibold tracking-tight whitespace-nowrap tabular-nums">
          {row.info.formattedChange}
          {row.info.shareOfStart != null ? (
            <span className="ml-1.5 font-mono text-[10.5px] font-normal text-muted-foreground">
              {sharePercent.format(row.info.shareOfStart)}
            </span>
          ) : null}
        </div>
        {row.info.kind === "delta" ? (
          <div className="flex items-baseline justify-between gap-4 border-t pt-1.5 whitespace-nowrap text-muted-foreground tabular-nums">
            <span>Running total</span>
            <span className="font-medium text-foreground">
              {row.info.formattedTotal}
            </span>
          </div>
        ) : null}
      </div>
    );

  const crosshairValue = activeRow ? activeRow.info.to : null;

  const columns = (
    <div
      data-slot="waterfall-chart-columns"
      className={cn(
        "px-4 pt-3 pb-3",
        orientation === "auto"
          ? auto.columns
          : orientation === "vertical"
            ? "block"
            : "hidden",
      )}
    >
      <div
        {...plotProps(summary)}
        data-slot="waterfall-chart-plot"
        className="group/plot relative rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-4 focus-visible:ring-offset-card"
      >
        <div className="relative" style={{ height }}>
          {/* Axis and gridlines. */}
          <div
            aria-hidden="true"
            data-slot="waterfall-chart-axis"
            className="absolute inset-x-0 top-6 bottom-6"
          >
            {scale.ticks.map((tick) => (
              <div
                key={tick}
                className="absolute inset-x-0 flex items-center"
                style={{
                  bottom: `${position(tick)}%`,
                  transform: "translateY(50%)",
                }}
              >
                <span className="w-11 shrink-0 pr-2 text-right font-mono text-[10.5px] leading-none text-muted-foreground tabular-nums">
                  {format(tick, "axis")}
                </span>
                <span
                  className={cn(
                    "h-px flex-1",
                    tick === 0 ? "bg-foreground/25" : "bg-border",
                  )}
                />
              </div>
            ))}
            {crosshairValue != null ? (
              <div
                data-slot="waterfall-chart-crosshair"
                className="pointer-events-none absolute inset-x-0 z-10 flex items-center"
                style={{
                  bottom: `${position(crosshairValue)}%`,
                  transform: "translateY(50%)",
                }}
              >
                <span className="flex w-11 shrink-0 justify-end pr-1">
                  <span className="rounded-[4px] bg-foreground px-1 py-0.5 font-mono text-[10px] leading-none text-background tabular-nums">
                    {format(crosshairValue, "axis")}
                  </span>
                </span>
                <span className="h-px flex-1 bg-foreground/45" />
              </div>
            ) : null}
          </div>

          {/* Bars. */}
          <div
            className="absolute inset-y-0 right-0 left-11 grid"
            style={{
              gridTemplateColumns: `repeat(${Math.max(1, count)}, minmax(0, 1fr))`,
            }}
          >
            {rows.map((row, index) => {
              const isActive = active === index;
              const dimmed = active != null && !isActive;
              const bottom = position(row.low);
              const top = position(row.high);
              const delay = 120 + index * 85;
              // Decreases and negative totals hang from their top edge.
              const falling =
                row.info.direction === "decrease" ||
                (row.info.direction === "total" && row.info.to < 0);
              return (
                <div
                  key={row.step.id}
                  data-slot="waterfall-chart-step"
                  data-direction={row.info.direction}
                  data-active={isActive || undefined}
                  className={cn("relative", onSelect && "cursor-pointer")}
                  onPointerEnter={() => setHovered(index)}
                  onClick={onSelect ? () => select(index) : undefined}
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-[8%] inset-y-0 rounded-md bg-foreground/[0.045] opacity-0 transition-opacity duration-150 motion-reduce:transition-none",
                      isActive && "opacity-100",
                    )}
                  />
                  <div className="absolute inset-x-0 top-6 bottom-6">
                    <div
                      data-slot="waterfall-chart-bar"
                      className={cn(
                        "absolute left-1/2 w-[min(34px,58%)] -translate-x-1/2 transition-[opacity,bottom,height] duration-300 motion-reduce:transition-none",
                        row.info.direction === "total"
                          ? "rounded-t-[4px]"
                          : "rounded-[3px]",
                        row.info.direction === "total" &&
                          row.low < 0 &&
                          "rounded-t-none rounded-b-[4px]",
                        dimmed && "opacity-45",
                      )}
                      style={{
                        bottom: `${bottom}%`,
                        height: `max(2px, ${top - bottom}%)`,
                      }}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 rounded-[inherit]",
                          reveal,
                        )}
                        style={{
                          backgroundColor: row.info.color,
                          transformOrigin: falling ? "top" : "bottom",
                          animationDelay: `${delay}ms`,
                        }}
                      />
                      {row.cut ? <CutMark /> : null}
                    </div>
                    <span
                      data-slot="waterfall-chart-value"
                      className={cn(
                        "absolute inset-x-0 text-center text-[11px] leading-none whitespace-nowrap tabular-nums transition-opacity duration-150 motion-reduce:transition-none",
                        valueTone(row),
                        fadeUp,
                        dimmed && "opacity-50",
                      )}
                      style={{
                        ...valueStyle(row),
                        ...(falling
                          ? { top: `calc(${100 - bottom}% + 6px)` }
                          : { bottom: `calc(${top}% + 6px)` }),
                        animationDelay: `${delay + 300}ms`,
                      }}
                    >
                      {valueText(row)}
                    </span>
                    {row.connects ? (
                      <span
                        aria-hidden="true"
                        data-slot="waterfall-chart-connector"
                        className={cn(
                          "absolute left-[calc(50%+min(17px,29%))] h-px w-[calc(100%-min(34px,58%))] origin-left bg-foreground/35",
                          draw,
                        )}
                        style={{
                          bottom: `${position(row.info.to)}%`,
                          animationDelay: `${delay + 380}ms`,
                        }}
                      />
                    ) : null}
                  </div>
                  {isActive ? (
                    <div
                      data-slot="waterfall-chart-tooltip"
                      className="pointer-events-none absolute z-30 rounded-lg border bg-popover px-3 py-2 text-xs whitespace-nowrap text-popover-foreground shadow-lg shadow-black/5"
                      style={{
                        // Beside the bar, level with its top, kept inside the plot.
                        top: Math.max(
                          0,
                          Math.min(
                            24 + ((100 - top) / 100) * (height - 48) - 6,
                            height - 88,
                          ),
                        ),
                        [index < count / 2 ? "left" : "right"]:
                          "calc(50% + min(17px, 29%) + 10px)",
                      }}
                    >
                      {tooltip(row)}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step labels. */}
        <div
          aria-hidden="true"
          className="grid pl-11"
          style={{
            gridTemplateColumns: `repeat(${Math.max(1, count)}, minmax(0, 1fr))`,
          }}
        >
          {rows.map((row, index) => (
            <span
              key={row.step.id}
              data-slot="waterfall-chart-label"
              className={cn(
                "line-clamp-2 px-0.5 pt-1 text-center text-[11px] leading-[14px] transition-colors motion-reduce:transition-none",
                row.info.direction === "total"
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
                active === index && "text-foreground",
              )}
            >
              {row.step.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // Below 26rem the value moves under its label so the track keeps most of the width.
  const rowsView = (
    <div
      data-slot="waterfall-chart-rows"
      className={cn(
        "px-4 pt-3 pb-3",
        "[--wf-label:6.25rem] [--wf-value:0px] @min-[26rem]/waterfall:[--wf-label:6.5rem] @min-[26rem]/waterfall:[--wf-value:calc(4.75rem+0.75rem)] @md/waterfall:[--wf-label:9rem]",
        orientation === "auto"
          ? auto.rows
          : orientation === "horizontal"
            ? "block"
            : "hidden",
      )}
    >
      <div
        {...plotProps(summary)}
        data-slot="waterfall-chart-plot"
        className="group/plot relative rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-4 focus-visible:ring-offset-card"
      >
        <div className="relative">
          {/* Gridlines span the track column only. */}
          <div
            aria-hidden="true"
            data-slot="waterfall-chart-axis"
            className="pointer-events-none absolute inset-y-0 right-(--wf-value) left-[calc(var(--wf-label)+0.75rem)]"
          >
            {scale.ticks.map((tick) => (
              <span
                key={tick}
                className={cn(
                  "absolute inset-y-0 w-px",
                  tick === 0 ? "bg-foreground/25" : "bg-border",
                )}
                style={{ left: `${position(tick)}%` }}
              />
            ))}
            {crosshairValue != null ? (
              <span
                data-slot="waterfall-chart-crosshair"
                className="absolute inset-y-0 z-10 w-px bg-foreground/45"
                style={{ left: `${position(crosshairValue)}%` }}
              />
            ) : null}
          </div>

          <ul role="presentation" className="relative">
            {rows.map((row, index) => {
              const isActive = active === index;
              const dimmed = active != null && !isActive;
              const left = position(row.low);
              const right = position(row.high);
              const delay = 120 + index * 85;
              // Decreases and negative totals hang from their top edge.
              const falling =
                row.info.direction === "decrease" ||
                (row.info.direction === "total" && row.info.to < 0);
              const centre = (left + right) / 2;
              return (
                <li
                  key={row.step.id}
                  role="presentation"
                  data-slot="waterfall-chart-step"
                  data-direction={row.info.direction}
                  data-active={isActive || undefined}
                  onPointerEnter={() => setHovered(index)}
                  onClick={onSelect ? () => select(index) : undefined}
                  className={cn(
                    "relative grid h-10 grid-cols-[var(--wf-label)_minmax(0,1fr)] items-center gap-x-3",
                    "@min-[26rem]/waterfall:h-9 @min-[26rem]/waterfall:grid-cols-[var(--wf-label)_minmax(0,1fr)_4.75rem]",
                    onSelect && "cursor-pointer",
                    row.info.kind === "subtotal" || row.info.kind === "end"
                      ? "border-t border-dashed border-border"
                      : "",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -inset-x-2 inset-y-0.5 rounded-md bg-foreground/[0.045] opacity-0 transition-opacity duration-150 motion-reduce:transition-none",
                      isActive && "opacity-100",
                    )}
                  />
                  <span className="relative min-w-0">
                    <span
                      data-slot="waterfall-chart-label"
                      className={cn(
                        "block truncate text-xs leading-4",
                        row.info.direction === "total"
                          ? "font-medium text-foreground"
                          : "text-muted-foreground",
                        isActive && "text-foreground",
                      )}
                    >
                      {row.step.label}
                    </span>
                    <span
                      className={cn(
                        "block text-[11px] leading-4 whitespace-nowrap tabular-nums @min-[26rem]/waterfall:hidden",
                        valueTone(row),
                        dimmed && "opacity-50",
                      )}
                      style={valueStyle(row)}
                    >
                      {valueText(row)}
                    </span>
                  </span>
                  <span className="relative h-full">
                    <span
                      data-slot="waterfall-chart-bar"
                      className={cn(
                        "absolute top-1/2 h-3.5 -translate-y-1/2 transition-[opacity,left,width] duration-300 motion-reduce:transition-none",
                        row.info.direction === "total"
                          ? row.info.to < 0
                            ? "rounded-l-[4px]"
                            : "rounded-r-[4px]"
                          : "rounded-[3px]",
                        dimmed && "opacity-45",
                      )}
                      style={{
                        left: `${left}%`,
                        width: `max(2px, ${right - left}%)`,
                      }}
                    >
                      <span
                        className="absolute inset-0 rounded-[inherit] motion-safe:animate-[waterfall-grow_620ms_cubic-bezier(0.22,1,0.36,1)_backwards]"
                        style={{
                          backgroundColor: row.info.color,
                          transformOrigin: falling ? "right" : "left",
                          animationDelay: `${delay}ms`,
                        }}
                      />
                      {row.cut ? <CutMark horizontal /> : null}
                    </span>
                    {row.connects ? (
                      <span
                        aria-hidden="true"
                        data-slot="waterfall-chart-connector"
                        className="absolute top-[calc(50%+7px)] h-[calc(100%-14px)] w-px origin-top bg-foreground/35 motion-safe:animate-[waterfall-drop_300ms_cubic-bezier(0.22,1,0.36,1)_backwards]"
                        style={{
                          left: `${position(row.info.to)}%`,
                          animationDelay: `${delay + 380}ms`,
                        }}
                      />
                    ) : null}
                    {isActive ? (
                      <span
                        data-slot="waterfall-chart-tooltip"
                        className="pointer-events-none absolute bottom-[calc(50%+14px)] z-30 rounded-lg border bg-popover px-3 py-2 text-xs whitespace-nowrap text-popover-foreground shadow-lg shadow-black/5"
                        style={{
                          left: `${centre}%`,
                          transform: `translateX(-${Math.min(100, Math.max(0, centre))}%)`,
                        }}
                      >
                        {tooltip(row)}
                      </span>
                    ) : null}
                  </span>
                  <span
                    data-slot="waterfall-chart-value"
                    className={cn(
                      "relative hidden text-right text-xs whitespace-nowrap tabular-nums transition-opacity duration-150 motion-reduce:transition-none @min-[26rem]/waterfall:block",
                      valueTone(row),
                      fadeUp,
                      dimmed && "opacity-50",
                    )}
                    style={{
                      ...valueStyle(row),
                      animationDelay: `${delay + 260}ms`,
                    }}
                  >
                    {valueText(row)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div
          aria-hidden="true"
          className="relative mt-1 mr-(--wf-value) ml-[calc(var(--wf-label)+0.75rem)] h-4"
        >
          {scale.ticks.map((tick, index) => {
            const first = index === 0;
            const last = index === scale.ticks.length - 1;
            return (
              <span
                key={tick}
                className={cn(
                  "absolute top-0 font-mono text-[10.5px] leading-4 text-muted-foreground tabular-nums",
                  first ? "" : last ? "-translate-x-full" : "-translate-x-1/2",
                  // Narrow tracks only label the ends of the axis.
                  !first && !last && "hidden @min-[26rem]/waterfall:block",
                )}
                style={{ left: `${position(tick)}%` }}
              >
                {format(tick, "axis")}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );

  const legend = (className: string) => (
    <ul
      data-slot="waterfall-chart-legend"
      aria-hidden="true"
      className={cn(
        "flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] text-muted-foreground",
        className,
      )}
    >
      {(
        [
          ["Increase", increase],
          ["Decrease", decrease],
          ["Total", total],
          ...(hasSubtotal ? [["Subtotal", subtotalFill]] : []),
        ] as [string, string][]
      ).map(([label, color]) => (
        <li key={label} className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-[3px]"
            style={{ backgroundColor: color }}
          />
          {label}
        </li>
      ))}
    </ul>
  );

  const hasHeader =
    title != null ||
    description != null ||
    actions != null ||
    showSummary ||
    showLegend;
  const hasSubtotal = rows.some((row) => row.info.kind === "subtotal");

  return (
    <div
      data-slot="waterfall-chart"
      data-orientation={orientation}
      className={cn(
        "@container/waterfall flex min-w-0 flex-col rounded-xl border bg-card text-card-foreground shadow-xs",
        className,
      )}
      {...props}
    >
      <style href="overtrue-waterfall-chart" precedence="default">
        {`@keyframes waterfall-rise{from{transform:scaleY(0)}}@keyframes waterfall-grow{from{transform:scaleX(0)}}@keyframes waterfall-drop{from{transform:scaleY(0)}}@keyframes waterfall-draw{from{transform:scaleX(0)}}@keyframes waterfall-fade{from{opacity:0;transform:translateY(3px)}}`}
      </style>

      {hasHeader ? (
        <div className="flex flex-col gap-3 px-4 pt-4">
          {title != null || description != null || actions != null ? (
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
              <div className="min-w-0 space-y-1">
                {title != null ? (
                  <h3 className="text-sm leading-5 font-semibold tracking-tight">
                    {title}
                  </h3>
                ) : null}
                {description != null ? (
                  <p className="text-xs text-muted-foreground">{description}</p>
                ) : null}
              </div>
              {actions != null ? (
                <div className="flex shrink-0 items-center gap-2">
                  {actions}
                </div>
              ) : null}
            </div>
          ) : null}
          {showSummary || showLegend ? (
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              {showSummary && count ? (
                renderSummary ? (
                  <div data-slot="waterfall-chart-summary" className="min-w-0">
                    {renderSummary({
                      opening,
                      closing,
                      net,
                      netShare: net != null && opening ? net / opening : null,
                      format,
                    })}
                  </div>
                ) : (
                  <p
                    data-slot="waterfall-chart-summary"
                    className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                  >
                    <span className="text-2xl leading-none font-semibold tracking-tight">
                      {format(closing, "detail")}
                    </span>
                    {net != null && opening ? (
                      <span
                        className={cn(
                          "text-xs font-medium tabular-nums",
                          net > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : net < 0
                              ? "text-destructive"
                              : "text-muted-foreground",
                        )}
                      >
                        {signed(net, "label")}
                        <span className="ml-1 font-mono text-[10.5px] font-normal">
                          {sharePercent.format(net / opening)}
                        </span>
                      </span>
                    ) : null}
                    {opening != null ? (
                      <span className="text-xs text-muted-foreground">
                        from {format(opening, "label")}
                      </span>
                    ) : null}
                  </p>
                )
              ) : (
                <span />
              )}
              {showLegend && count ? legend("hidden @md/waterfall:flex") : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {count === 0 ? (
        <p className="m-4 grid h-32 place-items-center rounded-md border border-dashed text-xs text-muted-foreground">
          No steps to show.
        </p>
      ) : (
        <>
          {orientation !== "horizontal" ? columns : null}
          {orientation !== "vertical" ? rowsView : null}
          {showLegend && count
            ? legend("border-t px-4 py-2.5 @md/waterfall:hidden")
            : null}
        </>
      )}

      <p className="sr-only" aria-live="polite">
        {focused != null && rows[focused]
          ? `${rows[focused].step.label}: ${rows[focused].info.formattedChange}${
              rows[focused].info.kind === "delta"
                ? `, running total ${rows[focused].info.formattedTotal}`
                : ""
            }`
          : ""}
      </p>

      <div className="sr-only">
        <table>
          <caption>{titleText}</caption>
          <thead>
            <tr>
              <th scope="col">Step</th>
              <th scope="col">Change</th>
              <th scope="col">Running total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.step.id}>
                <th scope="row">{row.step.label}</th>
                <td>
                  {row.info.kind === "delta"
                    ? row.info.formattedChange
                    : kindLabel[row.info.kind]}
                </td>
                <td>{row.info.formattedTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { WaterfallChart };
