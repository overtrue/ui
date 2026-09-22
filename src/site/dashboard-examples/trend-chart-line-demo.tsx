/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { TrendChart } from "@/registry/overtrue/trend-chart";

const data = Array.from({ length: 24 }, (_, hour) => ({
  hour: `${String(hour).padStart(2, "0")}:00`,
  p50: 120 + Math.round(Math.sin(hour / 3) * 30),
  p95: 340 + Math.round(Math.cos(hour / 4) * 90),
}));

export default function TrendChartLineDemo() {
  return (
    <TrendChart
      type="line"
      data={data}
      xKey="hour"
      series={[
        { key: "p50", label: "p50" },
        { key: "p95", label: "p95" },
      ]}
      yFormatter={(value) => `${value} ms`}
      showLegend
      showYAxis
    />
  );
}
