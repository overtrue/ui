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

export default function SankeyChartCashflowDemo() {
  return (
    <div className="w-full max-w-lg">
      <SankeyChart
        nodes={nodes}
        links={links}
        valueFormatter={(value) =>
          formatNumber(value, { format: "currency", maximumFractionDigits: 0 })
        }
        nodePadding={12}
      />
    </div>
  );
}
