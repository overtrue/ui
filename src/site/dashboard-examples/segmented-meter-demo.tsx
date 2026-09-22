/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { SegmentedMeter } from "@/registry/overtrue/segmented-meter";

const zones = [
  { label: "Available", from: 0, to: 40, color: "var(--color-chart-2)" },
  { label: "Balanced", from: 40, to: 75, color: "var(--color-chart-1)" },
  { label: "Busy", from: 75, to: 90, color: "var(--color-chart-3)" },
  { label: "Full", from: 90, to: 100, color: "var(--color-chart-4)" },
];

export default function SegmentedMeterDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tabular-nums">78</span>
          <span className="text-muted-foreground">%</span>
        </div>
        <span className="text-sm font-medium">Booked team capacity</span>
        <SegmentedMeter
          value={78}
          zones={zones}
          tickFormatter={(v) => `${v}%`}
        />
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium">Plan the next commitment</span>
        <SegmentedMeter
          value={78}
          zones={zones}
          highlightActive={false}
          showTicks={false}
          showLabels
        />
      </div>
    </div>
  );
}
