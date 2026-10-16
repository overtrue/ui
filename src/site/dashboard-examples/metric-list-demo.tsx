/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { MetricList } from "@/registry/overtrue/metric-list";

const items = [
  {
    label: "Deliverables",
    value: 42,
    delta: 0.18,
    trend: [28, 31, 29, 35, 38, 36, 42],
  },
  {
    label: "Review turnaround",
    value: "2.4 days",
    delta: -0.14,
    invertDelta: true,
    trend: [3.6, 3.3, 3.5, 3.1, 2.8, 2.6, 2.4],
  },
  {
    label: "Booked work",
    value: "$36.8K",
    delta: 0.15,
    trend: [24200, 25800, 27900, 30400, 32100, 34500, 36800],
  },
  {
    label: "Client feedback",
    value: 86,
    delta: 0.15,
    trend: [52, 61, 58, 65, 73, 78, 86],
  },
  {
    label: "Reopened requests",
    value: 3,
    delta: -0.06,
    invertDelta: true,
    trend: [7, 6, 7, 5, 4, 4, 3],
  },
];

export default function MetricListDemo() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-4 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <MetricList items={items} />
    </div>
  );
}
