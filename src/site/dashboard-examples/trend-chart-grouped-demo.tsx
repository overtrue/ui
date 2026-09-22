/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { TrendChart } from "@/registry/overtrue/trend-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  { day: "Mon", current: 118, previous: 88 },
  { day: "Tue", current: 178, previous: 146 },
  { day: "Wed", current: 148, previous: 168 },
  { day: "Thu", current: 208, previous: 138 },
  { day: "Fri", current: 186, previous: 158 },
  { day: "Sat", current: 78, previous: 98 },
  { day: "Sun", current: 58, previous: 68 },
];

export default function TrendChartGroupedDemo() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle> Weekly deliveries </CardTitle>
        <CardDescription> Completed work across the studio </CardDescription>
      </CardHeader>
      <CardContent>
        <TrendChart
          type="bar"
          data={data}
          xKey="day"
          series={[
            {
              key: "current",
              label: "Current week",
              color: "var(--color-chart-1)",
            },
            {
              key: "previous",
              label: "Previous week",
              color: "var(--color-blue-800)",
            },
          ]}
          barRadius="full"
          barSize={10}
          showYAxis
          showLegend
          legendPosition="top"
          legendAlign="right"
        />
      </CardContent>
    </Card>
  );
}
