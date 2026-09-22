/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import * as React from "react";

import { PeriodTabs } from "@/registry/overtrue/period-tabs";

export default function PeriodTabsDemo() {
  const [period, setPeriod] = React.useState("month");
  return (
    <div className="flex flex-col items-center gap-3">
      <PeriodTabs value={period} onValueChange={setPeriod} />
      <span className="text-muted-foreground text-sm">
        {" "}
        Report window: {period}
      </span>
    </div>
  );
}
