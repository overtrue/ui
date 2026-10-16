/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { Sparkline } from "@/registry/overtrue/trend-sparkline";

const data = [12, 18, 14, 22, 26, 21, 30, 34, 28, 40, 44, 52];
const review = [3.8, 3.6, 3.9, 3.4, 3.1, 3.3, 2.9, 2.8, 3, 2.6, 2.5, 2.4];

const tiles = [
  {
    label: "Booked work",
    value: "$52K",
    props: {
      data,
      tooltip: true,
      valueFormatter: (v: number) => `$${v}K`,
      "aria-label": "Booked work by month, in thousands",
    },
  },
  {
    label: "Review time",
    value: "2.4 days",
    props: {
      data: review,
      variant: "line" as const,
      color: "var(--color-chart-2)",
    },
  },
  {
    label: "Daily requests",
    value: "1,240",
    props: { data, fill: "dots" as const, color: "var(--color-chart-1)" },
  },
  {
    label: "Milestones completed",
    value: "52",
    props: { data, curve: "step" as const, color: "var(--color-chart-4)" },
  },
];

export default function SparklineDemo() {
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="flex min-w-0 flex-col gap-1 rounded-xl bg-muted/40 p-3.5 ring-1 ring-border/60 ring-inset"
        >
          <span className="truncate text-xs text-muted-foreground">
            {tile.label}
          </span>
          <span className="text-lg leading-6 font-semibold tracking-[-0.02em] tabular-nums">
            {tile.value}
          </span>
          <Sparkline {...tile.props} className="mt-2 h-10" />
        </div>
      ))}
    </div>
  );
}
