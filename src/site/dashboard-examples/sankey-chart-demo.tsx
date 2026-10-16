/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { SankeyChart } from "@/registry/overtrue/sankey-chart";

// Sources carry a color; the activities on the right inherit it from their largest inflow.
const nodes = [
  { name: "Project work", color: "var(--color-chart-5)" },
  { name: "Client time", color: "var(--color-chart-1)" },
  { name: "Team time", color: "var(--color-chart-2)" },
  { name: "Operations", color: "var(--color-chart-3)" },
  { name: "Research", color: "var(--color-chart-4)" },
  { name: "Exploration" },
  { name: "Writing" },
  { name: "Engineering" },
  { name: "Reviews" },
  { name: "Client updates" },
  { name: "Discovery" },
  { name: "Planning" },
];

// Hours per week, sources on the left flowing into activities on the right.
const links = [
  { source: "Project work", target: "Engineering", value: 8 },
  { source: "Project work", target: "Writing", value: 7 },
  { source: "Project work", target: "Exploration", value: 3 },
  { source: "Project work", target: "Planning", value: 2 },
  { source: "Client time", target: "Reviews", value: 7 },
  { source: "Client time", target: "Planning", value: 2 },
  { source: "Client time", target: "Client updates", value: 1 },
  { source: "Team time", target: "Exploration", value: 5 },
  { source: "Team time", target: "Discovery", value: 1 },
  { source: "Operations", target: "Client updates", value: 5 },
  { source: "Operations", target: "Exploration", value: 2 },
  { source: "Operations", target: "Writing", value: 1 },
  { source: "Research", target: "Discovery", value: 4 },
  { source: "Research", target: "Exploration", value: 1 },
  { source: "Research", target: "Writing", value: 1 },
];

const hours = links.reduce((sum, link) => sum + link.value, 0);

export default function SankeyChartDemo() {
  return (
    <section className="w-full max-w-xl rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold tracking-tight">
            Where the week went
          </h3>
          <p className="text-[13px] leading-5 text-muted-foreground">
            Tracked time by source and activity.
          </p>
        </div>
        <p className="shrink-0 text-right">
          <span className="text-xl font-semibold tracking-[-0.02em] tabular-nums">
            {hours}
          </span>
          <span className="ml-0.5 text-sm font-medium text-muted-foreground">
            h
          </span>
        </p>
      </header>
      <SankeyChart
        nodes={nodes}
        links={links}
        valueFormatter={(value) => `${value}h`}
        className="h-64"
      />
    </section>
  );
}
