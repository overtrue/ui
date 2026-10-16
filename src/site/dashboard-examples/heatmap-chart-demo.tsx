/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { HeatmapChart } from "@/registry/overtrue/heatmap-chart";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) =>
  String(i * 2).padStart(2, "0"),
);

// Deterministic sample data so the demo is stable between renders: a working-hours
// peak on weekdays, a quieter and later curve at the weekend, plus some noise.
function sampleRows() {
  let seed = 29;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return days.map((label, d) => {
    const weekend = d >= 5;
    return {
      label,
      values: hours.map((_, h) => {
        const hour = h * 2 + 1;
        const peak = weekend ? 15 : 14;
        const shape = Math.exp(-((hour - peak) ** 2) / (weekend ? 40 : 22));
        const base = (weekend ? 90 : 320) * shape + (weekend ? 6 : 12);
        return Math.round(base * (0.75 + random() * 0.5));
      }),
    };
  });
}

const rows = sampleRows();
const total = rows.reduce(
  (sum, row) => sum + row.values.reduce((a, b) => a + b, 0),
  0,
);

export default function HeatmapChartDemo() {
  return (
    <section className="w-full max-w-xl rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold tracking-tight">
            Requests by hour
          </h3>
          <p className="text-[13px] leading-5 text-muted-foreground">
            Last 7 days, in two-hour windows (UTC)
          </p>
        </div>
        <p className="shrink-0 text-right">
          <span className="block text-xl font-semibold tracking-[-0.02em] tabular-nums">
            {total.toLocaleString("en-US")}
          </span>
          <span className="text-xs text-muted-foreground">requests</span>
        </p>
      </header>
      <HeatmapChart rows={rows} columns={hours} unit="requests" />
    </section>
  );
}
