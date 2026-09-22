/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { HeatmapChart } from "@/registry/overtrue/heatmap-chart";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) =>
  String(i * 2).padStart(2, "0"),
);

// Deterministic sample data so the demo is stable between renders: a working-hours
// peak on weekdays, a quieter and later curve at the weekend, plus some noise.
function sampleRows() {
  let seed = 29;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return days.map((label, d) => {
    const weekend = d >= 5;
    return {
      label,
      values: hours.map((_, h) => {
        const hour = h * 2 + 1;
        const peak = weekend ? 15 : 14;
        const shape = Math.exp(-((hour - peak) ** 2) / (weekend ? 40 : 22));
        const base = (weekend ? 90 : 320) * shape + (weekend ? 6 : 12);
        return Math.round(base * (0.75 + random() * 0.5));
      }),
    };
  });
}

const rows = sampleRows();

export default function HeatmapChartDemo() {
  return (
    <div className="w-full max-w-lg">
      <HeatmapChart rows={rows} columns={hours} unit="requests" />
    </div>
  );
}
