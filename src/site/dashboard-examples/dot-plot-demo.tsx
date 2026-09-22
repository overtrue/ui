/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { DotPlot } from "@/registry/overtrue/dot-plot";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hourly = [1, 2, 3, 5, 4, 3, 2, 4, 6, 5, 3, 2, 1, 1];

export default function DotPlotDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <DotPlot data={hourly} color="var(--color-chart-2)" />
      <DotPlot
        data={[4, 7, 6, 9, 5, 2, 1]}
        labels={days}
        color="var(--color-chart-1)"
      />
      <DotPlot
        data={[3, 4, 2, 5, 4, 1, 2]}
        labels={days}
        rows={4}
        emphasis={0}
        color="var(--color-foreground)"
        className="[--dot-size:0.875rem]"
      />
    </div>
  );
}
