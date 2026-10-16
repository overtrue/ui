/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { MetricValue } from "@/registry/overtrue/metric-value";

const headline = [
  { label: "Booked", value: 268_400, format: "currency" as const },
  { label: "Visits", value: 1_842_600 },
  { label: "Win rate", value: 0.124, format: "percent" as const },
];

export default function MetricValueDemo() {
  return (
    <div className="@container flex w-full flex-col gap-3">
      <div className="grid grid-cols-3 divide-x divide-border/60 rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
        {headline.map((item) => (
          <div key={item.label} className="min-w-0 px-3 py-4 @md:px-5">
            <p className="truncate text-xs text-muted-foreground">
              {item.label}
              <span className="hidden @md:inline"> this year</span>
            </p>
            <MetricValue
              value={item.value}
              format={item.format}
              maximumFractionDigits={item.format === "currency" ? 0 : undefined}
              className="mt-1.5 block text-2xl leading-8 font-semibold tracking-[-0.035em] @md:text-3xl @md:leading-9"
            />
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-muted/40 px-4 py-1 ring-1 ring-border/60 ring-inset">
        <dl className="divide-y divide-border/60 text-sm">
          <div className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="truncate text-muted-foreground">
              Visits, never abbreviated
            </dt>
            <dd className="font-semibold">
              <MetricValue value={1_842_600} compactFrom={Infinity} />
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="truncate text-muted-foreground">
              Booked work, compact from 10K
            </dt>
            <dd className="font-semibold">
              <MetricValue
                value={36_800}
                format="currency"
                maximumFractionDigits={0}
                compactFrom={10_000}
              />
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="truncate text-muted-foreground">Median response</dt>
            <dd className="font-semibold">
              <MetricValue value={98} suffix=" ms" compactFrom={10_000} />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
