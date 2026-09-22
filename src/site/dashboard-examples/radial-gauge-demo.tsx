/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { RadialGauge } from "@/registry/overtrue/radial-gauge";

export default function RadialGaugeDemo() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-10">
      <RadialGauge
        value={99.7}
        segments={40}
        size={180}
        thickness={12}
        color="var(--color-chart-2)"
      >
        <span className="text-2xl font-semibold tabular-nums">99.7%</span>
        <span className="text-muted-foreground text-xs"> Availability </span>
      </RadialGauge>
      <RadialGauge value={48} size={180} thickness={12}>
        <span className="text-2xl font-semibold tabular-nums">48%</span>
        <span className="text-muted-foreground text-xs"> Review coverage </span>
      </RadialGauge>
      <RadialGauge
        value={72}
        sweep={360}
        size={120}
        thickness={8}
        color="var(--color-chart-2)"
      >
        <span className="text-lg font-semibold tabular-nums">72</span>
      </RadialGauge>
    </div>
  );
}
