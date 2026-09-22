/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { TickBar } from "@/registry/overtrue/tick-bar";

export default function TickBarDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <TickBar value={46} color="var(--color-chart-2)" />
      <TickBar value={7_420} max={12_300} color="var(--color-chart-5)" />
      <TickBar
        value={16}
        max={24}
        segments={24}
        shape="pill"
        color="var(--color-foreground)"
      />
    </div>
  );
}
