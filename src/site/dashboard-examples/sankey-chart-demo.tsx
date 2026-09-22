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

export default function SankeyChartDemo() {
  return (
    <div className="w-full max-w-lg">
      <SankeyChart
        nodes={nodes}
        links={links}
        valueFormatter={(value) => `${value}h`}
      />
    </div>
  );
}
