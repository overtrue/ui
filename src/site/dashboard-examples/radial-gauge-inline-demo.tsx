/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { DeltaBadge } from "@/registry/overtrue/delta-badge";
import { RadialGauge } from "@/registry/overtrue/radial-gauge";

const metrics = [
  {
    label: "Portal latency",
    value: "132",
    unit: "ms",
    pct: 66,
    delta: -0.108,
    invert: true,
    color: "var(--color-chart-1)",
  },
  {
    label: "Failed requests",
    value: "1.4",
    unit: "%",
    pct: 28,
    delta: 0.05,
    invert: true,
    color: "var(--color-chart-5)",
  },
  {
    label: "Requests served",
    value: "4.3k",
    unit: "req/s",
    pct: 86,
    delta: 0.1,
    color: "var(--color-chart-2)",
  },
];

export default function RadialGaugeInlineDemo() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="flex min-w-0 items-center gap-3.5 rounded-2xl border border-border/70 bg-card p-4 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
        >
          <RadialGauge
            value={m.pct}
            sweep={360}
            size={44}
            thickness={5}
            color={m.color}
            animate
            aria-label={`${m.label}, ${m.pct}% of budget`}
          />
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate text-xs text-muted-foreground">
              {m.label}
            </span>
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-xl leading-6 font-semibold tracking-[-0.03em] whitespace-nowrap tabular-nums">
                {m.value}
                <span className="ml-0.5 text-xs font-medium tracking-normal text-current/50">
                  {m.unit}
                </span>
              </span>
              <DeltaBadge delta={m.delta} invert={m.invert} variant="soft" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
