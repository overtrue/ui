/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { ScatterChart } from "@/registry/overtrue/scatter-chart";
import { formatNumber } from "@/registry/overtrue/metric-format";

const paid = [
  { channel: "Search ads", spend: 18_400, conversions: 620, reach: 410_000 },
  { channel: "Social ads", spend: 12_900, conversions: 380, reach: 860_000 },
  { channel: "Display", spend: 7_200, conversions: 140, reach: 1_250_000 },
  { channel: "Sponsorships", spend: 9_800, conversions: 210, reach: 320_000 },
  { channel: "Retargeting", spend: 4_600, conversions: 290, reach: 95_000 },
];

const organic = [
  { channel: "SEO", spend: 3_200, conversions: 540, reach: 720_000 },
  { channel: "Newsletter", spend: 1_100, conversions: 260, reach: 48_000 },
  { channel: "Referrals", spend: 600, conversions: 180, reach: 22_000 },
  { channel: "Community", spend: 2_400, conversions: 150, reach: 130_000 },
];

export default function ScatterChartBubblesDemo() {
  return (
    <div className="w-full max-w-lg">
      <ScatterChart
        series={[
          { label: "New clients", data: paid },
          { label: "Returning clients", data: organic },
        ]}
        xKey="spend"
        yKey="conversions"
        sizeKey="reach"
        nameKey="channel"
        xLabel="Spend"
        yLabel="Conversions"
        sizeLabel="Reach"
        xFormatter={(v) =>
          formatNumber(v, { format: "currency", compact: true })
        }
        yFormatter={(v) => formatNumber(v)}
        showLegend
      />
    </div>
  );
}
