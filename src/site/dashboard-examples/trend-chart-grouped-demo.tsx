/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { TrendChart } from "@/registry/overtrue/trend-chart";

const data = [
  { day: "Mon", current: 118, previous: 88 },
  { day: "Tue", current: 178, previous: 146 },
  { day: "Wed", current: 148, previous: 168 },
  { day: "Thu", current: 208, previous: 138 },
  { day: "Fri", current: 186, previous: 158 },
  { day: "Sat", current: 78, previous: 98 },
  { day: "Sun", current: 58, previous: 68 },
];

export default function TrendChartGroupedDemo() {
  return (
    <div className="w-full rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <div className="mb-1">
        <h3 className="text-sm font-semibold tracking-tight">
          Weekly deliveries
        </h3>
        <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
          Completed work across the studio
        </p>
      </div>
      <TrendChart
        type="bar"
        data={data}
        xKey="day"
        series={[
          {
            key: "current",
            label: "Current week",
            color: "var(--color-chart-1)",
          },
          {
            key: "previous",
            label: "Previous week",
            color:
              "color-mix(in oklab, var(--color-muted-foreground) 45%, transparent)",
          },
        ]}
        barRadius="full"
        barSize={10}
        showYAxis
        showLegend
        legendPosition="top"
        legendAlign="right"
        className="h-56"
      />
    </div>
  );
}
