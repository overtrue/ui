/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { ComposedChart } from "@/registry/overtrue/composed-chart";
import { formatNumber } from "@/registry/overtrue/metric-format";

const data = Array.from({ length: 14 }, (_, i) => ({
  date: `2026-08-${String(i + 4).padStart(2, "0")}`,
  views: 12_000 + Math.round(Math.sin(i / 2) * 3_000 + i * 400),
  sales: 180 + Math.round(Math.cos(i / 3) * 40 + i * 12),
}));

export default function ComposedChartDualAxisDemo() {
  return (
    <ComposedChart
      data={data}
      xKey="date"
      series={[
        {
          key: "views",
          label: "Enquiries",
          type: "bar",
          color: "var(--color-chart-1)",
        },
        {
          key: "sales",
          label: "Booked work",
          type: "line",
          axis: "right",
          color: "var(--color-chart-4)",
          dots: true,
        },
      ]}
      yFormatter={(v) => formatNumber(v, { format: "compact" })}
      rightYFormatter={(v) => formatNumber(v)}
      showYAxis
      showLegend
    />
  );
}
