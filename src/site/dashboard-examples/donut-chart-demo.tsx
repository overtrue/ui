/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { DonutChart } from "@/registry/overtrue/donut-chart";

const browsers = [
  { name: "Referrals", value: 58_400 },
  { name: "Returning clients", value: 21_300 },
  { name: "Studio website", value: 8_900 },
  { name: "Partner network", value: 6_100 },
  { name: "Events", value: 2_400 },
];

export default function DonutChartDemo() {
  return (
    <div className="w-full max-w-xs">
      <DonutChart
        data={browsers}
        centerLabel="Enquiries"
        showLegend
        className="max-h-72"
      />
    </div>
  );
}
