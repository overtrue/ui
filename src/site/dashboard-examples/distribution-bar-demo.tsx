/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { DistributionBar } from "@/registry/overtrue/distribution-bar";

const devices = [
  { name: "Design", value: 61_400 },
  { name: "Engineering", value: 34_200 },
  { name: "Research", value: 4_100 },
  { name: "Operations", value: 640 },
];

export default function DistributionBarDemo() {
  return (
    <div className="w-full max-w-lg">
      <DistributionBar segments={devices} showValues />
    </div>
  );
}
