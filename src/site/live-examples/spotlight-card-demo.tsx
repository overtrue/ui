import {
  IconActivityHeartbeat,
  IconCurrencyDollar,
  IconServer2,
} from "@tabler/icons-react";
import { DeltaBadge } from "@/registry/overtrue/delta-badge";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { Sparkline } from "@/registry/overtrue/sparkline";
import { SpotlightCard, SpotlightGroup } from "@/registry/overtrue/spotlight-card";
import { StatusBadge } from "@/registry/overtrue/status-badge";

const revenue = [31.2, 32.8, 32.1, 34.6, 36.9, 36.2, 38.8, 41.5, 40.9, 43.7, 46.1, 48.3];
// Daily uptime for the last 30 days; one short degradation on day 19.
const uptime = Array.from({ length: 30 }, (_, day) =>
  day === 18 ? "degraded" : "ok",
);

function Label({ icon: Icon, children }: { icon: typeof IconServer2; children: string }) {
  return (
    <p className="flex items-center gap-2 text-xs font-medium whitespace-nowrap text-muted-foreground">
      <Icon className="size-4" stroke={1.75} aria-hidden="true" />
      {children}
    </p>
  );
}

export default function Demo() {
  return (
    <SpotlightGroup restingLight={{ x: 0.74, y: 0.04 }} className="grid gap-3 sm:grid-cols-2">
      <SpotlightCard padding={false} className="flex flex-col">
        <div className="flex flex-col gap-3 p-5 pb-0">
          <Label icon={IconCurrencyDollar}>Monthly recurring revenue</Label>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              $48,290
            </span>
            <DeltaBadge delta={0.047} variant="soft" />
          </div>
        </div>
        <div className="mt-auto overflow-hidden rounded-b-xl pt-4">
          <Sparkline
            data={revenue}
            label="Monthly recurring revenue, last 12 months, in thousands"
            endpoint={false}
            className="h-14 text-primary"
          />
        </div>
      </SpotlightCard>

      <SpotlightCard padding={false} className="flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label icon={IconActivityHeartbeat}>API uptime</Label>
          <StatusBadge variant="success">Operational</StatusBadge>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight tabular-nums">
            99.98%
          </span>
          <span className="text-xs text-muted-foreground">last 30 days</span>
        </div>
        <div
          role="img"
          aria-label="Daily uptime for 30 days: 29 days fully up, 1 day degraded"
          className="mt-auto flex h-7 items-end gap-[3px]"
        >
          {uptime.map((state, day) => (
            <span
              key={day}
              className={
                state === "ok"
                  ? "h-full flex-1 rounded-[2px] bg-emerald-500/70 dark:bg-emerald-500/60"
                  : "h-full flex-1 rounded-[2px] bg-amber-400"
              }
            />
          ))}
        </div>
      </SpotlightCard>

      <SpotlightCard padding={false} className="p-5 sm:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label icon={IconServer2}>Cluster capacity</Label>
          <span className="font-mono text-[11px] text-muted-foreground">
            us-east-1 · 42 nodes
          </span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <ResourceProgress label="CPU" value={68} valueLabel="68%" />
          <ResourceProgress label="Memory" value={212} max={384} valueLabel="212 / 384 GB" />
          <ResourceProgress label="Storage" value={8.1} max={10} valueLabel="8.1 / 10 TB" />
        </div>
      </SpotlightCard>
    </SpotlightGroup>
  );
}
