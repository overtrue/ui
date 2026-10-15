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
  { label: "Full", from: 90, to: 100, color: "var(--color-chart-5)" },
];

export default function SegmentedMeterDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-7">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              Booked team capacity
            </span>
            <span className="text-3xl leading-9 font-semibold tracking-[-0.035em] tabular-nums">
              78
              <span className="ml-0.5 text-lg font-medium text-current/50">
                %
              </span>
            </span>
          </div>
          <span className="mt-0.5 inline-flex h-6 items-center gap-1.5 rounded-full bg-muted/60 px-2.5 text-xs font-medium ring-1 ring-border/60 ring-inset">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-(--color-chart-3)"
            />
            Busy
          </span>
        </div>
        <SegmentedMeter
          value={78}
          zones={zones}
          aria-label="Booked team capacity"
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
          aria-label="Planned commitment"
        />
      </div>
    </div>
  );
}
