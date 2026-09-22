/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { FunnelChart } from "@/registry/overtrue/funnel-chart";

const steps = [
  { name: "Enquired", value: 1240 },
  { name: "Qualified", value: 420 },
  { name: "Discovery", value: 96 },
  { name: "Proposal", value: 18 },
  { name: "Booked", value: 11 },
];

export default function FunnelChartSharpDemo() {
  return (
    <div className="w-full max-w-lg">
      <FunnelChart
        variant="flow"
        shape="sharp"
        color="var(--color-foreground)"
        steps={steps}
        height={128}
      />
    </div>
  );
}
