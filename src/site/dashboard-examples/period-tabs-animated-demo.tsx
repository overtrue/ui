/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import * as React from "react";

import { PeriodTabs } from "@/registry/overtrue/period-tabs";

const traffic: Record<string, [string, string][]> = {
  week: [
    ["Visitors", "4,280"],
    ["Sign-ups", "312"],
    ["Conversion", "7.3%"],
  ],
  month: [
    ["Visitors", "18,940"],
    ["Sign-ups", "1,206"],
    ["Conversion", "6.4%"],
  ],
  year: [
    ["Visitors", "214,500"],
    ["Sign-ups", "13,870"],
    ["Conversion", "6.5%"],
  ],
};

export default function PeriodTabsAnimatedDemo() {
  const [period, setPeriod] = React.useState("month");
  return (
    <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold tracking-tight">Studio traffic</p>
        <PeriodTabs
          animated
          aria-label="Traffic period"
          value={period}
          onValueChange={setPeriod}
        />
      </div>
      <dl className="mt-4 grid grid-cols-3 divide-x divide-border/60 rounded-xl bg-muted/40 ring-1 ring-border/60 ring-inset">
        {(traffic[period] ?? traffic.month).map(([label, value]) => (
          <div key={label} className="min-w-0 px-3 py-2.5">
            <dt className="truncate text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 truncate text-lg font-semibold tracking-[-0.02em] tabular-nums">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[13px] text-muted-foreground">
        Report window: {period}
      </p>
    </div>
  );
}
