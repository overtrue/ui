/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { RadialGauge } from "@/registry/overtrue/radial-gauge";

const zones = [
  { from: 99, to: 99.5, color: "var(--color-rose-500)", label: "Below target" },
  { from: 99.5, to: 99.9, color: "var(--color-amber-500)", label: "At risk" },
  { from: 99.9, to: 100, color: "var(--color-emerald-500)", label: "Healthy" },
];

const goals = [
  { label: "Review coverage", value: 72, color: "var(--color-chart-1)" },
  { label: "Completion", value: 48, color: "var(--color-chart-4)" },
  { label: "On-time delivery", value: 91, color: "var(--color-chart-2)" },
];

export default function RadialGaugeDemo() {
  return (
    <div className="@container w-full">
      <div className="flex flex-col items-center gap-6 @xl:flex-row @xl:justify-center @xl:gap-14">
        <RadialGauge
          value={99.94}
          min={99}
          max={100}
          sweep={240}
          size={188}
          thickness={12}
          zones={zones}
          animate
          aria-label="Availability"
        >
          <span className="text-[2rem] leading-9 font-semibold tracking-[-0.04em] tabular-nums">
            99.94
            <span className="ml-0.5 text-base font-medium text-current/50">
              %
            </span>
          </span>
          <span className="mt-0.5 text-xs text-muted-foreground">
            Availability, 30 days
          </span>
        </RadialGauge>
        <ul className="grid w-full max-w-sm grid-cols-3 gap-2 @xl:w-56 @xl:grid-cols-1 @xl:gap-4">
          {goals.map((goal) => (
            <li
              key={goal.label}
              className="flex min-w-0 flex-col items-center gap-2 text-center @xl:flex-row @xl:gap-3 @xl:text-left"
            >
              <RadialGauge
                value={goal.value}
                sweep={360}
                size={44}
                thickness={5}
                color={goal.color}
                animate
                aria-label={goal.label}
              />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-xs text-muted-foreground">
                  {goal.label}
                </span>
                <span className="text-sm font-semibold tracking-[-0.01em] tabular-nums">
                  {goal.value}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
