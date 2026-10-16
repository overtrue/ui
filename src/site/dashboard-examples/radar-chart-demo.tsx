/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { RadarChart } from "@/registry/overtrue/radar-chart";

const data = [
  { stage: "Scope", score: 92 },
  { stage: "Research", score: 86 },
  { stage: "Design", score: 78 },
  { stage: "Build", score: 82 },
  { stage: "Review", score: 71 },
  { stage: "Handoff", score: 65 },
];

const average = Math.round(
  data.reduce((sum, row) => sum + row.score, 0) / data.length,
);

export default function RadarChartDemo() {
  return (
    <section className="relative w-full max-w-lg rounded-2xl border border-border/70 bg-card p-4 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="pointer-events-none absolute top-4 left-5 z-10">
        <h3 className="text-sm font-semibold tracking-tight">Readiness</h3>
        <p className="mt-1 flex items-baseline gap-1">
          <span className="text-xl font-semibold tracking-[-0.02em] tabular-nums">
            {average}
          </span>
          <span className="text-xs text-muted-foreground">/ 100 avg</span>
        </p>
      </header>
      <RadarChart
        data={data}
        angleKey="stage"
        series={[{ key: "score", label: "Readiness" }]}
        domain={[0, 100]}
        className="h-56"
      />
    </section>
  );
}
