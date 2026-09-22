/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { BarChart } from "@/registry/overtrue/bar-chart";
import { formatNumber } from "@/registry/overtrue/metric-format";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const data = months.flatMap((month, m) =>
  Array.from({ length: 4 }, (_, w) => ({
    week: `${month} week ${w + 1}`,
    month,
    spend:
      month === "Mar"
        ? 1_900 + w * 470
        : 900 + Math.round(Math.abs(Math.sin(m * 4 + w)) * 500),
  })),
);

export default function BarChartDemo() {
  return (
    <BarChart
      data={data}
      xKey="week"
      yKey="spend"
      groupKey="month"
      color="var(--color-chart-3)"
      grid="none"
      highlight={(row) => row.month === "Mar"}
      yFormatter={(value) => formatNumber(value, { format: "currency" })}
      tooltipLabel={(row) => String(row.week).replace(/^\w+ /, "")}
    />
  );
}
