/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { Sparkline } from "@/registry/overtrue/trend-sparkline";

const data = [12, 18, 14, 22, 26, 21, 30, 34, 28, 40, 44, 52];

export default function SparklineDemo() {
  return (
    <div className="grid w-full max-w-md gap-6">
      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs"> Booked work </span>
        <Sparkline data={data} className="h-12" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs"> Review time </span>
        <Sparkline data={data} variant="line" className="h-12" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs"> Daily requests </span>
        <Sparkline
          data={data}
          fill="dots"
          color="var(--color-chart-1)"
          className="h-12"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs">
          Milestones completed{" "}
        </span>
        <Sparkline
          data={data}
          curve="step"
          color="var(--color-chart-2)"
          className="h-12"
        />
      </div>
    </div>
  );
}
