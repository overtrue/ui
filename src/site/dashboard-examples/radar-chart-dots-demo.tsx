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
    <div className="w-full max-w-lg">
      <RadarChart
        data={data}
        angleKey="skill"
        series={[{ key: "score", label: "Score" }]}
        variant="dots"
        grid="circle"
        domain={[0, 100]}
        showRadiusAxis
        valueFormatter={(v) => formatNumber(v)}
      />
    </div>
  );
}
