/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { RadarChart } from "@/registry/overtrue/radar-chart";

const data = [
  { stage: "Scope", planned: 90, delivered: 88 },
  { stage: "Research", planned: 84, delivered: 70 },
  { stage: "Design", planned: 80, delivered: 86 },
  { stage: "Build", planned: 86, delivered: 68 },
  { stage: "Review", planned: 74, delivered: 80 },
  { stage: "Handoff", planned: 70, delivered: 54 },
];

export default function RadarChartMultiDemo() {
  return (
    <section className="w-full max-w-lg rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight">
          Planned and delivered
        </h3>
        <p className="text-[13px] leading-5 text-muted-foreground">
          Where the finished project matched the original brief.
        </p>
      </header>
      <RadarChart
        data={data}
        angleKey="stage"
        series={[
          { key: "planned", label: "Planned" },
          { key: "delivered", label: "Delivered" },
        ]}
        domain={[0, 100]}
        variant="line"
        showLegend
        className="h-72"
      />
    </section>
  );
}
