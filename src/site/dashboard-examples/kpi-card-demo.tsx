/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { KpiCard } from "@/registry/overtrue/kpi-card";

const revenue = [
  24200, 25800, 24600, 27900, 30400, 29600, 32100, 31800, 33900, 34500, 35200,
  36800,
];
const users = [7, 7, 8, 8, 9, 8, 9, 10, 10, 11, 11, 12];
const churn = [8.2, 7.9, 8.1, 7.4, 7.1, 7.3, 6.8, 6.2, 6.5, 5.9, 5.6, 5.2];

export default function KpiCardDemo() {
  return (
    <div className="@container w-full">
      <div className="grid gap-4 @lg:grid-cols-2 @3xl:grid-cols-4">
        <KpiCard
          label="Booked revenue"
          value={36_800}
          format="currency"
          delta={0.128}
          deltaLabel="vs. previous month"
          sparkline={revenue}
        />
        <KpiCard
          label="Client relationships"
          value={12}
          format="compact"
          delta={0.2}
          deltaLabel="vs. previous month"
          sparkline={users}
        />
        <KpiCard
          label="Rework rate"
          value={0.052}
          format="percent"
          delta={-0.16}
          deltaLabel="vs. previous month"
          sparkline={churn}
          invertDelta
        />
        <KpiCard
          label="Awaiting review"
          value={3}
          delta={0}
          deltaLabel="Ready for the next review"
        />
      </div>
    </div>
  );
}
