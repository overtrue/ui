/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { RadarChart } from "@/registry/overtrue/radar-chart";

const data = [
  { month: "Scope", desktop: 92, mobile: 88 },
  { month: "Research", desktop: 86, mobile: 81 },
  { month: "Design", desktop: 78, mobile: 74 },
  { month: "Build", desktop: 82, mobile: 76 },
  { month: "Review", desktop: 71, mobile: 68 },
  { month: "Handoff", desktop: 65, mobile: 60 },
];

export default function RadarChartMultiDemo() {
  return (
    <div className="w-full max-w-lg">
      <RadarChart
        data={data}
        angleKey="month"
        series={[
          { key: "desktop", label: "Planned" },
          { key: "mobile", label: "Delivered" },
        ]}
        variant="line"
        showLegend
      />
    </div>
  );
}
