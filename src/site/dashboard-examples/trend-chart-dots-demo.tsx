/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { TrendChart } from "@/registry/overtrue/trend-chart";
import { formatNumber } from "@/registry/overtrue/metric-format";

const data = Array.from({ length: 60 }, (_, i) => ({
  minute: i,
  price:
    Math.round(
      (3312 + i * 0.28 + Math.sin(i / 4) * 3 + Math.cos(i / 1.7) * 1.5) * 100,
    ) / 100,
}));

export default function TrendChartDotsDemo() {
  return (
    <TrendChart
      fill="dots"
      data={data}
      xKey="minute"
      series={[
        {
          key: "price",
          label: "Average project value",
          color: "var(--color-chart-3)",
        },
      ]}
      xFormatter={(value) => {
        const ago = 59 - Number(value);
        return ago === 0 ? "now" : ago === 59 ? "1 h ago" : `${ago} min`;
      }}
      yFormatter={(value) => formatNumber(value, { format: "currency" })}
      yDomain={["dataMin - 12", "dataMax + 4"]}
      showGrid={false}
    />
  );
}
