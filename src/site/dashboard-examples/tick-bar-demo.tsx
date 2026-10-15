/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { TickBar } from "@/registry/overtrue/tick-bar";

export default function TickBarDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="flex items-baseline justify-between gap-3 text-sm">
          <span className="font-medium">Reviews completed</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            23 of 50
          </span>
        </p>
        <TickBar
          value={46}
          color="var(--color-chart-2)"
          showValue
          animate
          aria-label="Reviews completed"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="flex items-baseline justify-between gap-3 text-sm">
          <span className="font-medium">Asset storage</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            7,420 of 12,300 GB
          </span>
        </p>
        <TickBar
          value={7_420}
          max={12_300}
          color="var(--color-chart-1)"
          showValue
          animate
          aria-label="Asset storage"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="flex items-baseline justify-between gap-3 text-sm">
          <span className="font-medium">Milestones shipped</span>
          <span className="text-xs text-muted-foreground">This quarter</span>
        </p>
        <TickBar
          value={16}
          max={24}
          segments={24}
          shape="pill"
          color="var(--color-chart-4)"
          showValue
          valueFormatter={(value, max) => `${Math.round(value)} / ${max}`}
          animate
          aria-label="Milestones shipped"
        />
      </div>
    </div>
  );
}
