/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { RadarChart } from "@/registry/overtrue/radar-chart";
import { formatNumber } from "@/registry/overtrue/metric-format";

const data = [
  { skill: "Scope", score: 92 },
  { skill: "Research", score: 86 },
  { skill: "Design", score: 78 },
  { skill: "Build", score: 82 },
  { skill: "Review", score: 71 },
  { skill: "Handoff", score: 65 },
];

export default function RadarChartDotsDemo() {
  return (
    <section className="w-full max-w-lg rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight">
          Review scorecard
        </h3>
        <p className="text-[13px] leading-5 text-muted-foreground">
          Individual scores on a fixed 0 to 100 scale.
        </p>
      </header>
      <RadarChart
        data={data}
        angleKey="skill"
        series={[
          { key: "score", label: "Score", color: "var(--color-chart-4)" },
        ]}
        variant="dots"
        grid="circle"
        domain={[0, 100]}
        showRadiusAxis
        valueFormatter={(v) => formatNumber(v)}
        className="h-72"
      />
    </section>
  );
}
