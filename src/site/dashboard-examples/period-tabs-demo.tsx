/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import * as React from "react";

import { PeriodTabs } from "@/registry/overtrue/period-tabs";

const reports: Record<
  string,
  { total: string; change: string; bars: number[] }
> = {
  week: {
    total: "$8,420",
    change: "+12.4%",
    bars: [34, 48, 41, 56, 52, 63, 58, 66, 61, 72, 69, 78],
  },
  month: {
    total: "$36,800",
    change: "+8.1%",
    bars: [46, 52, 49, 58, 55, 61, 57, 66, 63, 71, 74, 82],
  },
  year: {
    total: "$412,600",
    change: "+21.7%",
    bars: [28, 33, 38, 36, 44, 49, 53, 58, 62, 69, 76, 88],
  },
};

export default function PeriodTabsDemo() {
  const [period, setPeriod] = React.useState("month");
  const report = reports[period] ?? reports.month;
  return (
    <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold tracking-tight">Booked revenue</p>
        <PeriodTabs
          aria-label="Report period"
          value={period}
          onValueChange={setPeriod}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-3xl font-semibold tracking-[-0.035em] tabular-nums">
          {report.total}
        </span>
        <span className="text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
          {report.change}
        </span>
        <span className="ms-auto text-[13px] text-muted-foreground">
          Report window: {period}
        </span>
      </div>
      <div aria-hidden="true" className="mt-4 flex h-20 items-end gap-1.5">
        {report.bars.map((height, index) => (
          <span
            key={index}
            className="flex-1 rounded-[4px] bg-linear-to-b from-primary to-primary/70 transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}
