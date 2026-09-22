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
    value: 36_800,
    format: "currency" as const,
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
    <div className="w-full max-w-md">
      <MetricList items={items} />
    </div>
  );
}
