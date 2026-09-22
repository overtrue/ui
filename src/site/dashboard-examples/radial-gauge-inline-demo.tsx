/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { Card, CardContent } from "@/components/ui/card";
import { DeltaBadge } from "@/registry/overtrue/delta-badge";
import { RadialGauge } from "@/registry/overtrue/radial-gauge";

const metrics = [
  {
    label: "Portal latency",
    value: "132 ms",
    pct: 66,
    delta: -0.108,
    invert: true,
  },
  {
    label: "Failed requests",
    value: "1.4 %",
    pct: 28,
    delta: 0.05,
    invert: true,
  },
  { label: "Requests served", value: "4.3k req/s", pct: 86, delta: 0.1 },
];

export default function RadialGaugeInlineDemo() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {metrics.map((m) => (
        <Card key={m.label} className="py-4">
          <CardContent className="flex flex-col gap-3 px-4">
            <span className="text-muted-foreground text-sm">{m.label}</span>
            <div className="flex items-center gap-3">
              <RadialGauge
                value={m.pct}
                sweep={360}
                size={36}
                thickness={4}
                segments={12}
                gap={6}
                color="var(--color-chart-2)"
              />
              <span className="text-2xl font-semibold tabular-nums">
                {m.value}
              </span>
            </div>
            <DeltaBadge delta={m.delta} invert={m.invert} variant="text" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
