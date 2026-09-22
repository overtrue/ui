/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { ComposedChart } from "@/registry/overtrue/composed-chart";
import { formatNumber } from "@/registry/overtrue/metric-format";

const data = [
  { region: "NA", air: 420, sea: 1_280 },
  { region: "EU", air: 380, sea: 1_040 },
  { region: "APAC", air: 610, sea: 1_720 },
  { region: "LATAM", air: 140, sea: 460 },
  { region: "MEA", air: 90, sea: 310 },
];

export default function ComposedChartHatchedDemo() {
  return (
    <ComposedChart
      data={data}
      xKey="region"
      series={[
        { key: "sea", label: "Production", type: "bar" },
        {
          key: "air",
          label: "External services",
          type: "bar",
          pattern: "hatched",
          color: "var(--color-chart-4)",
        },
      ]}
      yFormatter={(v) => `${formatNumber(v)} t`}
      showYAxis
      showLegend
    />
  );
}
