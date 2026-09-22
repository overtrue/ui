/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { ActivityRings } from "@/registry/overtrue/activity-rings";

export default function ActivityRingsDemo() {
  return (
    <ActivityRings
      rings={[
        {
          label: "Deliverables",
          value: 18,
          max: 24,
          color: "var(--color-chart-4)",
        },
        {
          label: "Reviews",
          value: 9,
          max: 12,
          color: "var(--color-chart-2)",
        },
        {
          label: "Milestones",
          value: 4,
          max: 5,
          color: "var(--color-chart-1)",
        },
      ]}
    >
      <span className="text-2xl font-semibold tabular-nums">77%</span>
      <span className="text-muted-foreground text-xs"> of weekly targets </span>
    </ActivityRings>
  );
}
