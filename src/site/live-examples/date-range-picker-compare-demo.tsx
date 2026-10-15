import { useId, useMemo, useState } from "react";
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";
import {
  DateRangePicker,
  formatDateRange,
  presetRanges,
  previousPeriod,
  type DateRange,
  type DateRangeCompareMode,
} from "@/registry/overtrue/date-range-picker";
import { cn } from "@/lib/utils";

// Acme Studio's web app, seen on Thursday 15 October 2026.
const TODAY = new Date(2026, 9, 15);
const last30 = presetRanges(TODAY).find((preset) => preset.id === "last-30-days")!;
const initial: DateRange = { from: last30.from, to: last30.to };

function noise(seed: number) {
  const x = Math.sin(seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Deterministic daily sessions with weekly rhythm and slow growth. */
function sessions(range: DateRange) {
  const out: number[] = [];
  for (
    let d = new Date(range.from);
    d <= range.to;
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
  ) {
    const n = Math.round(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000,
    );
    const weekend = d.getDay() === 0 || d.getDay() === 6 ? 0.68 : 1;
    const trend = 1 + (n - 20_150) * 0.0016;
    out.push(Math.round(1_480 * weekend * trend * (0.86 + noise(n) * 0.28)));
  }
  return out;
}

const W = 600;
const H = 150;

function path(values: number[], peak: number, length: number) {
  const step = W / Math.max(1, length - 1);
  return values
    .map((value, i) => {
      const x = i * step;
      const y = H - (value / peak) * (H - 12) - 2;
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const number = new Intl.NumberFormat("en-US");

export default function Demo() {
  const gradientId = useId();
  const [range, setRange] = useState<DateRange>(initial);
  const [compare, setCompare] = useState<DateRange | null>(() =>
    previousPeriod(initial),
  );
  const [mode, setMode] = useState<DateRangeCompareMode>("previous-period");

  const current = useMemo(() => sessions(range), [range]);
  const previous = useMemo(() => (compare ? sessions(compare) : []), [compare]);
  const total = current.reduce((sum, v) => sum + v, 0);
  const previousTotal = previous.reduce((sum, v) => sum + v, 0);
  const change = previousTotal ? total / previousTotal - 1 : null;
  const length = Math.max(current.length, previous.length);
  const peak = Math.max(...current, ...previous) * 1.08;
  const line = path(current, peak, length);
  const up = (change ?? 0) >= 0;
  const Arrow = up ? IconArrowUpRight : IconArrowDownRight;
  const modeLabel = mode === "previous-year" ? "previous year" : "previous period";

  return (
    <section
      aria-label="Sessions"
      className="@container rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
    >
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight">Sessions</h3>
          <p className="text-[13px] leading-5 text-muted-foreground">
            Visits to the Acme Studio web app
          </p>
        </div>
        <DateRangePicker
          align="end"
          locale="en-US"
          today={TODAY}
          maxDate={TODAY}
          value={range}
          onChange={setRange}
          compare={compare}
          onCompareChange={setCompare}
          compareMode={mode}
          onCompareModeChange={setMode}
          className="max-w-full"
        />
      </header>

      <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-2">
        <p className="text-3xl font-semibold tracking-[-0.035em] tabular-nums">
          {number.format(total)}
        </p>
        {change !== null && (
          <span
            data-slot="comparison-chip"
            className={cn(
              "mb-1 inline-flex items-center gap-1 rounded-full py-0.5 ps-1.5 pe-2 text-xs font-medium tabular-nums ring-1 ring-inset",
              up
                ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-400",
            )}
          >
            <Arrow aria-hidden="true" className="size-3.5" />
            {up ? "+" : "−"}
            {Math.abs(change * 100).toFixed(1)}%
            <span className="font-normal opacity-80">vs {modeLabel}</span>
          </span>
        )}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground tabular-nums">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-primary" />
          <span className="font-medium text-foreground">
            {formatDateRange(range, "en-US")}
          </span>
        </li>
        {compare && (
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-4 border-t-2 border-dashed border-muted-foreground/60"
            />
            <span>
              {formatDateRange(compare, "en-US")}
              <span className="sr-only">, {modeLabel}</span>
            </span>
          </li>
        )}
      </ul>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Daily sessions, ${formatDateRange(range, "en-US")}${compare ? ` compared with ${formatDateRange(compare, "en-US")}` : ""}`}
        className="mt-4 h-40 w-full overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={W}
            y1={H * f}
            y2={H * f}
            stroke="color-mix(in oklab, var(--color-foreground) 7%, transparent)"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path
          d={`${line} L${(((current.length - 1) * W) / Math.max(1, length - 1)).toFixed(1)} ${H} L0 ${H} Z`}
          fill={`url(#${gradientId})`}
        />
        {compare && (
          <path
            d={path(previous, peak, length)}
            fill="none"
            stroke="var(--color-muted-foreground)"
            strokeOpacity="0.7"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
        <path
          d={line}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="dark:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,var(--color-primary)_50%,transparent))]"
        />
      </svg>
    </section>
  );
}
