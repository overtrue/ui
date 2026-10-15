/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { useState } from "react";
import { ActivityRings } from "@/registry/overtrue/activity-rings";
import { cn } from "@/lib/utils";

const rings = [
  { label: "Deliverables", value: 18, max: 24, color: "var(--color-chart-4)" },
  { label: "Reviews", value: 9, max: 12, color: "var(--color-chart-2)" },
  { label: "Milestones", value: 4, max: 5, color: "var(--color-chart-1)" },
];

export default function ActivityRingsDemo() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="@container w-full">
      <div className="flex flex-col items-center justify-center gap-5 @[21rem]:flex-row @[21rem]:gap-8 @lg:gap-12">
        <ActivityRings
          rings={rings}
          size={172}
          thickness={13}
          gap={3}
          activeIndex={active}
          onActiveIndexChange={setActive}
        >
          <span className="text-xl leading-7 font-semibold tracking-[-0.03em] tabular-nums">
            77
            <span className="text-xs font-medium tracking-normal text-current/50">
              %
            </span>
          </span>
          <span className="text-[11px] text-muted-foreground">this week</span>
        </ActivityRings>
        <ul className="flex min-w-0 flex-wrap justify-center gap-x-6 gap-y-3 @[21rem]:flex-col @[21rem]:gap-3.5">
          {rings.map((ring, index) => (
            <li
              key={ring.label}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              className={cn(
                "flex min-w-0 items-start gap-2.5 transition-opacity duration-150",
                active !== null && active !== index && "opacity-40",
              )}
            >
              <span
                aria-hidden="true"
                className="mt-1.5 size-2 shrink-0 rounded-full"
                style={{ backgroundColor: ring.color }}
              />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-xs text-muted-foreground">
                  {ring.label}
                </span>
                <span className="text-sm font-semibold tracking-[-0.01em] tabular-nums">
                  {ring.value}
                  <span className="font-medium text-muted-foreground">
                    {" "}
                    / {ring.max}
                  </span>
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
