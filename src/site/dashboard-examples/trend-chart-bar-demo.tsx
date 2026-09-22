/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { TrendChart } from "@/registry/overtrue/trend-chart";
import { formatNumber } from "@/registry/overtrue/metric-format";

const data = [
  { month: "Jan", starter: 18400, pro: 26200, enterprise: 31800 },
  { month: "Feb", starter: 19100, pro: 27900, enterprise: 33500 },
  { month: "Mar", starter: 20600, pro: 30400, enterprise: 35200 },
  { month: "Apr", starter: 20100, pro: 31800, enterprise: 38900 },
  { month: "May", starter: 21700, pro: 34100, enterprise: 41600 },
  { month: "Jun", starter: 22900, pro: 36500, enterprise: 44300 },
];

export default function TrendChartBarDemo() {
  return (
    <TrendChart
      type="bar"
      stacked
      data={data}
      xKey="month"
      series={[
        {
          key: "enterprise",
          label: "Retained",
          color: "var(--color-chart-4)",
        },
        { key: "pro", label: "Project", color: "var(--color-chart-2)" },
        { key: "starter", label: "Advisory", color: "var(--color-chart-1)" },
      ]}
      yFormatter={(value) =>
        formatNumber(value, {
          format: "currency",
          compact: true,
          maximumFractionDigits: 0,
        })
      }
      showLegend
      showYAxis
    />
  );
}
