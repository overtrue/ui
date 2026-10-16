/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { SankeyChart } from "@/registry/overtrue/sankey-chart";
import { formatNumber } from "@/registry/overtrue/metric-format";

const nodes = [
  { name: "Retainers" },
  { name: "Projects" },
  { name: "Advisory" },
  { name: "Studio rent" },
  { name: "Reserves" },
  { name: "Equipment" },
  { name: "Contractors" },
  { name: "Insurance" },
  { name: "Travel" },
  { name: "Utilities" },
];

// Monthly cash flow, income on the left and budget categories on the right.
const links = [
  { source: "Retainers", target: "Studio rent", value: 2400 },
  { source: "Retainers", target: "Reserves", value: 1200 },
  { source: "Retainers", target: "Contractors", value: 900 },
  { source: "Retainers", target: "Travel", value: 600 },
  { source: "Retainers", target: "Utilities", value: 500 },
  { source: "Retainers", target: "Insurance", value: 600 },
  { source: "Projects", target: "Equipment", value: 1100 },
  { source: "Projects", target: "Reserves", value: 500 },
  { source: "Projects", target: "Insurance", value: 200 },
  { source: "Advisory", target: "Reserves", value: 200 },
  { source: "Advisory", target: "Equipment", value: 200 },
];

const income = links.reduce((sum, link) => sum + link.value, 0);

export default function SankeyChartCashflowDemo() {
  return (
    <section className="w-full max-w-xl rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold tracking-tight">
            Monthly cash allocation
          </h3>
          <p className="text-[13px] leading-5 text-muted-foreground">
            Income on the left, budget categories on the right.
          </p>
        </div>
        <p className="shrink-0 text-right text-xl font-semibold tracking-[-0.02em] tabular-nums">
          {formatNumber(income, {
            format: "currency",
            maximumFractionDigits: 0,
          })}
        </p>
      </header>
      <SankeyChart
        nodes={nodes}
        links={links}
        valueFormatter={(value) =>
          formatNumber(value, { format: "currency", maximumFractionDigits: 0 })
        }
        nodePadding={12}
      />
    </section>
  );
}
