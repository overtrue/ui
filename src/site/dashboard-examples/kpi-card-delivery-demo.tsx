import { useState } from "react";
import { IconBriefcase, IconCircleCheck, IconClock } from "@tabler/icons-react";
import { KpiCard } from "@/registry/overtrue/kpi-card";
import { PeriodTabs } from "@/registry/overtrue/period-tabs";

const reports = {
  week: {
    booked: 8400,
    previous: 7200,
    delivered: 9,
    previousDelivered: 8,
    days: 2.4,
    previousDays: 3,
    trend: [1200, 2400, 3200, 4800, 6100, 7200, 8400],
    deliveryTrend: [1, 3, 4, 4, 6, 8, 9],
    reviewTrend: [3, 2.8, 3.1, 2.7, 2.6, 2.5, 2.4],
  },
  month: {
    booked: 36800,
    previous: 32000,
    delivered: 42,
    previousDelivered: 35,
    days: 2.8,
    previousDays: 3.2,
    trend: [4800, 9200, 14600, 20400, 25600, 31400, 36800],
    deliveryTrend: [6, 12, 18, 23, 28, 35, 42],
    reviewTrend: [3.2, 3.4, 3.1, 3, 2.9, 2.8, 2.8],
  },
};
const periods = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

export default function KpiCardDeliveryDemo() {
  const [period, setPeriod] = useState<keyof typeof reports>("week");
  const report = reports[period];
  const comparison = `vs. previous ${period}`;
  return (
    <div className="@container flex w-full flex-col gap-4">
      <PeriodTabs
        aria-label="Delivery report period"
        options={periods}
        value={period}
        onValueChange={(value) => setPeriod(value as keyof typeof reports)}
      />
      <div className="grid gap-4 @lg:grid-cols-3">
        <KpiCard
          label="Booked work"
          value={report.booked}
          format="currency"
          delta={report.booked / report.previous - 1}
          deltaLabel={comparison}
          trend={report.trend}
          icon={<IconBriefcase size={16} />}
        />
        <KpiCard
          label="Approved work"
          value={report.delivered}
          delta={report.delivered / report.previousDelivered - 1}
          deltaLabel={comparison}
          trend={report.deliveryTrend}
          icon={<IconCircleCheck size={16} />}
        />
        <KpiCard
          label="Review turnaround"
          value={`${report.days} days`}
          delta={report.days / report.previousDays - 1}
          deltaLabel={comparison}
          trend={report.reviewTrend}
          invertDelta
          icon={<IconClock size={16} />}
        />
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {period === "week" ? "September 14–20" : "September 1–30"} · The same
        reporting period applies to all three metrics. Faster reviews count as
        an improvement.
      </p>
    </div>
  );
}
