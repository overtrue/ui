/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { DotPlot } from "@/registry/overtrue/dot-plot";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const thisWeek = [5, 8, 6, 8, 7, 2, 1];
const lastWeek = [4, 6, 7, 5, 6, 1, 0];
const hours = Array.from(
  { length: 14 },
  (_, i) => `${String(i + 7).padStart(2, "0")}:00`,
);
const hourly = [1, 2, 3, 5, 4, 3, 2, 4, 6, 5, 3, 2, 1, 1];
// One dot per batch, so both weeks share the same scale.
const scale = Math.max(...thisWeek, ...lastWeek);
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

export default function DotPlotDemo() {
  return (
    <section className="w-full max-w-lg rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight">
          Delivery batches
        </h3>
        <p className="text-[13px] leading-5 text-muted-foreground">
          One dot per batch shipped, this week against last.
        </p>
      </header>
      <div className="mt-5 grid grid-cols-2 gap-4">
        {[
          { label: "This week", data: thisWeek, color: "var(--color-chart-1)" },
          {
            label: "Last week",
            data: lastWeek,
            color: "var(--color-muted-foreground)",
          },
        ].map((week) => (
          <div key={week.label} className="min-w-0 space-y-3">
            <p className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
              {week.label}
              <span className="text-base font-semibold tracking-[-0.02em] text-foreground tabular-nums">
                {sum(week.data)}
              </span>
            </p>
            <DotPlot
              data={week.data}
              labels={days}
              max={scale}
              rows={scale}
              emphasis={0}
              color={week.color}
              className="[--dot-size:0.5rem] [--dot-gap:0.1875rem]"
            />
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-3 border-t border-border/60 pt-4">
        <p className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
          When batches land
          <span className="text-foreground">Peak at 15:00</span>
        </p>
        <DotPlot
          data={hourly}
          labels={hours}
          labelEvery={3}
          color="var(--color-chart-2)"
          className="[--dot-size:0.5rem] [--dot-gap:0.1875rem]"
        />
      </div>
    </section>
  );
}
