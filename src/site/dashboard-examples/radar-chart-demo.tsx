/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { RadarChart } from "@/registry/overtrue/radar-chart";

const data = [
  { month: "Scope", visitors: 92 },
  { month: "Research", visitors: 86 },
  { month: "Design", visitors: 78 },
  { month: "Build", visitors: 82 },
  { month: "Review", visitors: 71 },
  { month: "Handoff", visitors: 65 },
];

export default function RadarChartDemo() {
  return (
    <div className="w-full max-w-lg">
      <RadarChart
        data={data}
        angleKey="month"
        series={[{ key: "visitors", label: "Readiness" }]}
      />
    </div>
  );
}
