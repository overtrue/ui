/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { ScatterChart } from "@/registry/overtrue/scatter-chart";
import { formatNumber } from "@/registry/overtrue/metric-format";

// Deterministic sample projects: hours logged against the fee, per engagement type.
function projects(
  seed: number,
  count: number,
  hours: [number, number],
  rate: number,
) {
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: count }, () => {
    const logged = Math.round(hours[0] + random() * (hours[1] - hours[0]));
    const fee = Math.round((logged * rate * (0.55 + random() * 0.9)) / 50) * 50;
    return { hours: logged, fee };
  });
}

const discovery = projects(7, 14, [10, 120], 120);
const delivery = projects(19, 16, [70, 340], 130);
const retained = projects(41, 12, [220, 580], 140);

export default function ScatterChartDemo() {
  return (
    <section className="w-full max-w-lg rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="mb-3 flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-semibold tracking-tight">
          Effort and value
        </h3>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground tabular-nums">
            {discovery.length + delivery.length + retained.length}
          </span>{" "}
          projects
        </p>
      </header>
      <ScatterChart
        series={[
          { label: "Discovery", data: discovery },
          { label: "Delivery", data: delivery },
          { label: "Retained", data: retained },
        ]}
        xKey="hours"
        yKey="fee"
        xLabel="Hours logged"
        yLabel="Project fee"
        xFormatter={(v) => formatNumber(v)}
        yFormatter={(v) =>
          formatNumber(v, { format: "currency", compact: true })
        }
        showLegend
        showAxisLabels
        className="h-64"
      />
    </section>
  );
}
