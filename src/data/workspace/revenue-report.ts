import { revenue } from "./studio.ts";

export type RevenueGrouping = "Monthly" | "Quarterly";

/** The grouping changes the chart granularity, never the reporting year. */
export function revenueReport(grouping: RevenueGrouping) {
  const series =
    grouping === "Quarterly"
      ? Array.from({ length: 4 }, (_, index) => ({
          label: `Q${index + 1}`,
          value: revenue
            .slice(index * 3, index * 3 + 3)
            .reduce((sum, point) => sum + point.value, 0),
        }))
      : revenue;
  const total = series.reduce((sum, point) => sum + point.value, 0);
  return {
    series,
    total,
    rows: [
      ["Period", "Booked and planned revenue (USD)"],
      ...series.map((point) => [`${point.label} 2026`, String(point.value)]),
      ["Total 2026", String(total)],
    ],
  };
}
