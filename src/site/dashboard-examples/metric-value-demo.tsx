/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { MetricValue } from "@/registry/overtrue/metric-value";

export default function MetricValueDemo() {
  return (
    <div className="flex flex-col gap-4 text-2xl font-semibold tracking-tight">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <MetricValue
          value={268400}
          format="currency"
          maximumFractionDigits={0}
        />
        <MetricValue value={1842600} />
        <MetricValue value={0.124} format="percent" />
        <MetricValue
          value={36800}
          format="currency"
          maximumFractionDigits={0}
        />
      </div>
      <p className="text-muted-foreground text-sm font-normal">
        Keep large totals readable. Hover a compact value for the exact figure;
        use compactFrom to choose when abbreviation begins.
      </p>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <MetricValue value={1842600} compactFrom={Infinity} />
        <MetricValue
          value={36800}
          format="currency"
          maximumFractionDigits={0}
          compactFrom={10_000}
        />
        <MetricValue value={98} suffix=" ms" compactFrom={10} />
      </div>
    </div>
  );
}
