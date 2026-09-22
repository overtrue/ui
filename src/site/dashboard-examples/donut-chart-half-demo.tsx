/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { DonutChart } from "@/registry/overtrue/donut-chart";
import { formatNumber } from "@/registry/overtrue/metric-format";

const sources = [
  { name: "Ongoing clients", value: 28_800, color: "var(--color-chart-2)" },
  { name: "New projects", value: 19_200, color: "var(--color-chart-1)" },
  { name: "Advisory", value: 8_400, color: "var(--color-chart-4)" },
];

export default function DonutChartHalfDemo() {
  return (
    <div className="w-full max-w-sm">
      <DonutChart
        data={sources}
        startAngle={180}
        sweep={180}
        innerRadius={0.75}
        centerLabel="Booked work"
        valueFormatter={(v) =>
          formatNumber(v, { format: "currency", maximumFractionDigits: 0 })
        }
        centerValue={formatNumber(56_400, { format: "compact" })}
        showLegend
        className="max-h-56"
      />
    </div>
  );
}
