/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { FunnelChart } from "@/registry/overtrue/funnel-chart";

const steps = [
  { name: "Read the studio brief", value: 12_480 },
  { name: "Sent an enquiry", value: 4_920 },
  { name: "Joined a discovery call", value: 3_610 },
  { name: "Received a proposal", value: 2_140 },
  { name: "Booked a project", value: 412 },
];

export default function FunnelChartDemo() {
  return (
    <div className="w-full max-w-lg">
      <FunnelChart steps={steps} />
    </div>
  );
}
