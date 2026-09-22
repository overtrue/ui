/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { FunnelChart } from "@/registry/overtrue/funnel-chart";

const steps = [
  { name: "Brief opened", value: 197, color: "var(--color-lime-400)" },
  { name: "Review started", value: 110, color: "var(--color-chart-1)" },
  { name: "Feedback sent", value: 77, color: "var(--color-chart-5)" },
  { name: "Approved", value: 38, color: "var(--color-chart-4)" },
];

export default function FunnelChartFlowDemo() {
  return (
    <div className="w-full max-w-lg">
      <FunnelChart variant="flow" steps={steps} />
    </div>
  );
}
