/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { TrendChart } from "@/registry/overtrue/trend-chart";
import { formatNumber } from "@/registry/overtrue/metric-format";

const data = [
  { product: "Product design", units: 1850 },
  { product: "Engineering", units: 1580 },
  { product: "Research", units: 1230 },
  { product: "Brand design", units: 980 },
  { product: "Content", units: 740 },
];

export default function TrendChartHorizontalDemo() {
  return (
    <div className="w-full rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight">Booked hours</h3>
        <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
          Time committed by discipline
        </p>
      </div>
      <TrendChart
        type="bar"
        layout="horizontal"
        data={data}
        xKey="product"
        series={[
          { key: "units", label: "Hours", color: "var(--color-chart-1)" },
        ]}
        barRadius="full"
        barSize={12}
        showGrid={false}
        showYAxis
        yFormatter={(value) => formatNumber(value, { format: "compact" })}
        className="h-52"
      />
    </div>
  );
}
