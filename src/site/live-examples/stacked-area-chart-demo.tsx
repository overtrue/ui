import * as React from "react";

import { DeltaBadge } from "@/registry/overtrue/delta-badge";
import { NumberTicker } from "@/registry/overtrue/number-ticker";
import {
  StackedAreaChart,
  type StackedAreaSeries,
} from "@/registry/overtrue/stacked-area-chart";
import { cn } from "@/lib/utils";

// Seeded noise keeps the first paint identical on every visit.
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const series: StackedAreaSeries[] = [
  { key: "large", label: "Atlas Large" },
  { key: "medium", label: "Atlas Medium" },
  { key: "small", label: "Atlas Small" },
  { key: "embed", label: "Embed v3" },
  { key: "rerank", label: "Rerank v2" },
];

const DAYS = 60;
const SWITCH = 47; // Oct 2: summaries move from Atlas Large to Atlas Small.

/** Sixty days of fictional token usage: thirty to show and thirty to compare against. */
const usage = (() => {
  const random = seeded(42);
  const rows: Record<string, string | number>[] = [];
  for (let d = 0; d < DAYS; d++) {
    const date = new Date(2026, 7, 16 + d);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const weekday = date.getDay();
    const weekly = weekday === 0 || weekday === 6 ? 0.84 : weekday === 1 ? 0.95 : 1;
    const growth = 1 + d * 0.0062;
    // The routing change ramps in over two days.
    const shift = Math.min(1, Math.max(0, (d - SWITCH + 1) / 2));
    const noise = (spread: number) => 1 + (random() - 0.5) * spread;
    const base = {
      large: 860_000 * (1 - 0.46 * shift),
      medium: 540_000,
      small: 250_000 + 360_000 * shift,
      embed: 230_000,
      rerank: 96_000,
    };
    rows.push({
      date: iso,
      ...Object.fromEntries(
        Object.entries(base).map(([key, value]) => [
          key,
          Math.round(value * weekly * growth * noise(0.07)),
        ]),
      ),
    });
  }
  return rows;
})();

const periods = [
  { days: 14, label: "14 days" },
  { days: 30, label: "30 days" },
] as const;

export default function Demo() {
  const [days, setDays] = React.useState<number>(30);
  const current = React.useMemo(() => usage.slice(DAYS - days), [days]);
  const previous = React.useMemo(
    () => usage.slice(DAYS - days * 2, DAYS - days),
    [days],
  );

  return (
    <StackedAreaChart
      title="Tokens by model"
      data={current}
      index="date"
      series={series}
      annotations={[{ x: "2026-10-02", label: "Routed summaries to Atlas Small" }]}
      actions={
        <div
          role="group"
          aria-label="Period"
          className="inline-flex h-7 items-center rounded-lg bg-muted/60 p-0.5 ring-1 ring-border/60 ring-inset"
        >
          {periods.map((period) => (
            <button
              key={period.days}
              type="button"
              aria-pressed={days === period.days}
              onClick={() => setDays(period.days)}
              className={cn(
                "h-full rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground",
                "aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-xs",
                "outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
      }
      header={(summary) => {
        const before = summary.series
          .filter((s) => !s.hidden)
          .reduce(
            (sum, s) =>
              sum + previous.reduce((total, row) => total + Number(row[s.key]), 0),
            0,
          );
        const change = before ? summary.total / before - 1 : 0;
        return (
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <p className="flex items-baseline gap-1.5">
              <NumberTicker
                value={summary.total}
                format="compact"
                className="text-3xl font-semibold tracking-[-0.035em] tabular-nums"
              />
              <span className="text-base font-medium text-muted-foreground">
                tokens
              </span>
            </p>
            <p className="flex items-center gap-1.5 pb-1 text-xs text-muted-foreground">
              <DeltaBadge delta={change} variant="soft" />
              <span className="hidden @sm/stacked-area:inline">vs previous {days} days</span>
            </p>
          </div>
        );
      }}
    />
  );
}
