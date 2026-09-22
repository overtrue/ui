/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { TrendChart } from "@/registry/overtrue/trend-chart";
import { formatNumber } from "@/registry/overtrue/metric-format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  { product: "Product design", units: 1850 },
  { product: "Engineering", units: 1580 },
  { product: "Research", units: 1230 },
  { product: "Brand design", units: 980 },
  { product: "Content", units: 740 },
];

export default function TrendChartHorizontalDemo() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle> Booked hours </CardTitle>
        <CardDescription> Time committed by discipline </CardDescription>
      </CardHeader>
      <CardContent>
        <TrendChart
          type="bar"
          layout="horizontal"
          data={data}
          xKey="product"
          series={[
            { key: "units", label: "Hours", color: "var(--color-chart-1)" },
          ]}
          barRadius="full"
          barSize={14}
          showGrid={false}
          showYAxis
          yFormatter={(value) => formatNumber(value, { format: "compact" })}
          className="h-56"
        />
      </CardContent>
    </Card>
  );
}
