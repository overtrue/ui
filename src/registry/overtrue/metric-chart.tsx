"use client";
import { useId, useSyncExternalStore, type ReactNode } from "react";
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

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}
/** The server snapshot disables motion so hydration starts from identical markup. */
function getReducedMotionServerSnapshot() {
  return true;
}

const PRIMARY = "var(--color-primary)";
const COMPARISON = "var(--color-muted-foreground)";
const GRID = "color-mix(in oklab, var(--color-foreground) 7%, transparent)";
const CROSSHAIR =
  "color-mix(in oklab, var(--color-foreground) 25%, transparent)";
const TICK = { fontSize: 11, fill: "var(--color-muted-foreground)" };
/** react-smooth accepts any cubic-bezier() string; the Recharts type lists only keywords. */
const EASE = "cubic-bezier(0.22,1,0.36,1)" as "ease-out";

function HaloDot({
  cx,
  cy,
  color,
}: {
  cx?: number;
  cy?: number;
  color: string;
}) {
  if (cx == null || cy == null) return <g />;
  return (
    <g pointerEvents="none">
      <circle cx={cx} cy={cy} r={8} fill={color} fillOpacity={0.18} />
      <circle
        cx={cx}
        cy={cy}
        r={3.5}
        fill={color}
        stroke="var(--color-card)"
        strokeWidth={1.5}
      />
    </g>
  );
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
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const points = data
    .filter((point) => Number.isFinite(point.value))
    .map((point) => ({
      ...point,
      previous: Number.isFinite(point.previous) ? point.previous : undefined,
    }));
  const hasComparison = points.some((point) => point.previous !== undefined);
  const chartHeight = Number.isFinite(height) ? Math.max(120, height) : 240;
  const last = points.length - 1;
  return (
    <Card
      data-slot="metric-chart"
      className="min-w-0 gap-0 rounded-2xl border border-border/70 bg-card py-0 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
    >
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4 [.border-b]:pb-4">
        <div className="min-w-0">
          <CardTitle className="text-sm font-semibold tracking-tight">
            {title}
          </CardTitle>
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
            { label: seriesLabel, color: PRIMARY },
            ...(hasComparison
              ? [
                  {
                    label: comparisonLabel,
                    color: COMPARISON,
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
            data-slot="metric-chart-plot"
            className="tabular-nums dark:[&_.recharts-area-curve]:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,currentColor_50%,transparent))]"
            style={{ height: chartHeight }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={points}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.32} />
                    <stop
                      offset="55%"
                      stopColor={PRIMARY}
                      stopOpacity={0.11}
                    />
                    <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={TICK}
                  minTickGap={24}
                  dy={8}
                />
                <YAxis
                  width={48}
                  tickFormatter={axisFormatter}
                  tickLine={false}
                  axisLine={false}
                  tick={TICK}
                />
                <Tooltip
                  isAnimationActive={false}
                  cursor={{ stroke: CROSSHAIR, strokeWidth: 1 }}
                  content={({ active, payload, label }) => {
                    const row = payload?.[0]?.payload as
                      | (MetricPoint & { previous?: number })
                      | undefined;
                    if (!active || !row) return null;
                    const change =
                      row.previous !== undefined && row.previous !== 0
                        ? (row.value - row.previous) / Math.abs(row.previous)
                        : null;
                    return (
                      <div
                        data-slot="metric-chart-tooltip"
                        className="min-w-44 rounded-xl border border-border/70 bg-popover/90 px-3 py-2.5 text-xs text-popover-foreground shadow-xl backdrop-blur-md"
                      >
                        <p className="mb-1.5 font-medium text-foreground">
                          {label}
                        </p>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="size-2 shrink-0 rounded-full"
                              style={{ backgroundColor: PRIMARY }}
                            />
                            <span className="text-muted-foreground">
                              {seriesLabel}
                            </span>
                            <span className="ml-auto pl-4 font-medium text-foreground tabular-nums">
                              {valueFormatter(row.value)}
                            </span>
                          </div>
                          {row.previous !== undefined && (
                            <div className="flex items-center gap-2">
                              <span
                                aria-hidden="true"
                                className="w-2 shrink-0 border-t-2 border-dashed"
                                style={{ borderColor: COMPARISON }}
                              />
                              <span className="text-muted-foreground">
                                {comparisonLabel}
                              </span>
                              <span className="ml-auto pl-4 font-medium text-foreground tabular-nums">
                                {valueFormatter(row.previous)}
                              </span>
                            </div>
                          )}
                        </div>
                        {change !== null && Number.isFinite(change) && (
                          <p className="mt-1.5 border-t border-border/60 pt-1.5 text-muted-foreground tabular-nums">
                            <span className="font-medium text-foreground">
                              {change > 0 ? "+" : change < 0 ? "−" : ""}
                              {Math.abs(change * 100).toFixed(1)}%
                            </span>{" "}
                            vs. {comparisonLabel.toLowerCase()}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
                {hasComparison && (
                  <Area
                    type="monotone"
                    dataKey="previous"
                    name={comparisonLabel}
                    stroke={COMPARISON}
                    strokeOpacity={0.7}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="none"
                    activeDot={(props: { cx?: number; cy?: number }) => (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={3}
                        fill="var(--color-card)"
                        stroke={COMPARISON}
                        strokeWidth={1.5}
                      />
                    )}
                    isAnimationActive={!reducedMotion}
                    animationDuration={700}
                    animationEasing={EASE}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="value"
                  name={seriesLabel}
                  stroke={PRIMARY}
                  color={PRIMARY}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill={`url(#${gradient})`}
                  dot={(props: { cx?: number; cy?: number; index?: number }) =>
                    props.index === last ? (
                      <HaloDot
                        key="metric-chart-latest"
                        cx={props.cx}
                        cy={props.cy}
                        color={PRIMARY}
                      />
                    ) : (
                      <g key={`metric-chart-dot-${props.index}`} />
                    )
                  }
                  activeDot={(props: { cx?: number; cy?: number }) => (
                    <HaloDot cx={props.cx} cy={props.cy} color={PRIMARY} />
                  )}
                  isAnimationActive={!reducedMotion}
                  animationDuration={700}
                  animationEasing={EASE}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
