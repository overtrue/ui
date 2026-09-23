"use client";
import { useId, type ReactNode } from "react";
import { ChartLegend } from "./chart-legend";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export interface MetricPoint {
  label: string;
  value: number;
  previous?: number;
}
export function MetricChart({
  title = "Revenue overview",
  data,
  height = 240,
  seriesLabel = "Revenue",
  comparisonLabel = "Previous period",
  valueFormatter = (value: number) => value.toLocaleString("en-US"),
  axisFormatter = (value: number) =>
    value.toLocaleString("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }),
  description,
  actions,
}: {
  title?: string;
  data: MetricPoint[];
  height?: number;
  seriesLabel?: string;
  comparisonLabel?: string;
  valueFormatter?: (value: number) => string;
  axisFormatter?: (value: number) => string;
  description?: string;
  actions?: ReactNode;
}) {
  const gradient = useId().replace(/:/g, "");
  const points = data
    .filter((point) => Number.isFinite(point.value))
    .map((point) => ({
      ...point,
      previous: Number.isFinite(point.previous) ? point.previous : undefined,
    }));
  const hasComparison = points.some((point) => point.previous !== undefined);
  const chartHeight = Number.isFinite(height) ? Math.max(120, height) : 240;
  return (
    <Card
      data-slot="metric-chart"
      className="min-w-0 gap-0 rounded-lg border border-border bg-card py-0 shadow-none"
    >
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 [.border-b]:pb-4">
        <div className="min-w-0">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {description && (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions}
        <ChartLegend
          layout="horizontal"
          items={[
            { label: seriesLabel, color: "var(--color-primary)" },
            ...(hasComparison
              ? [
                  {
                    label: comparisonLabel,
                    color: "var(--color-muted-foreground)",
                    dashed: true,
                  },
                ]
              : []),
          ]}
        />
      </CardHeader>
      <CardContent className="p-5 pb-3">
        {!points.length ? (
          <div
            className="flex items-center justify-center text-sm text-muted-foreground"
            style={{ height: chartHeight }}
          >
            No data for this period.
          </div>
        ) : (
          <div
            role="img"
            aria-label={`${title}: ${points.map((point) => `${point.label}: ${seriesLabel} ${valueFormatter(point.value)}${point.previous !== undefined ? `, ${comparisonLabel} ${valueFormatter(point.previous)}` : ""}`).join("; ")}`}
            style={{ height: chartHeight }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={points}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--color-border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  minTickGap={24}
                  dy={8}
                />
                <YAxis
                  width={48}
                  tickFormatter={axisFormatter}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  formatter={(value: number) => valueFormatter(value)}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    color: "var(--color-card-foreground)",
                    fontSize: 12,
                  }}
                />
                {hasComparison && (
                  <Area
                    type="monotone"
                    dataKey="previous"
                    name={comparisonLabel}
                    stroke="var(--color-muted-foreground)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="none"
                    isAnimationActive={false}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="value"
                  name={seriesLabel}
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill={`url(#${gradient})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
