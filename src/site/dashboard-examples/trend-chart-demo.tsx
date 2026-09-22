/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { TrendChart } from "@/registry/overtrue/trend-chart";

const data = [
  { date: "2026-08-04", desktop: 186, mobile: 80 },
  { date: "2026-08-05", desktop: 305, mobile: 200 },
  { date: "2026-08-06", desktop: 237, mobile: 120 },
  { date: "2026-08-07", desktop: 173, mobile: 190 },
  { date: "2026-08-08", desktop: 209, mobile: 130 },
  { date: "2026-08-09", desktop: 214, mobile: 140 },
  { date: "2026-08-10", desktop: 264, mobile: 160 },
  { date: "2026-08-11", desktop: 298, mobile: 210 },
  { date: "2026-08-12", desktop: 275, mobile: 180 },
  { date: "2026-08-13", desktop: 331, mobile: 240 },
  { date: "2026-08-14", desktop: 312, mobile: 220 },
  { date: "2026-08-15", desktop: 348, mobile: 260 },
  { date: "2026-08-16", desktop: 322, mobile: 250 },
  { date: "2026-08-17", desktop: 361, mobile: 270 },
];

export default function TrendChartDemo() {
  return (
    <TrendChart
      data={data}
      xKey="date"
      series={[
        { key: "desktop", label: "New requests" },
        { key: "mobile", label: "Deliveries" },
      ]}
      showLegend
    />
  );
}
