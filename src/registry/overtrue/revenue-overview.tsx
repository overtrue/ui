"use client";

import * as React from "react";
import { IconCalendarStats } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { NumberTicker } from "./number-ticker";
import { Sparkline } from "./sparkline";
import { DeltaBadge } from "./delta-badge";
import { WaterfallChart, type WaterfallStep } from "./waterfall-chart";
import { Treemap, type TreemapNode } from "./treemap";
import { CohortGrid, type CohortGridCohort } from "./cohort-grid";
import { BulletChart, type BulletChartItem } from "./bullet-chart";

export interface RevenueMetric {
  id: string;
  label: string;
  /** Currency amounts in whole units; rates as fractions (0.031 for 3.1%). */
  value: number;
  format?: "currency" | "percent" | "number";
  /** Fractional change against the previous period, e.g. 0.102 for +10.2%. */
  change?: number;
  /** Lower is better, e.g. churn. Flips the color of the change. */
  invert?: boolean;
  /** Recent values, oldest first, for the sparkline. */
  history?: number[];
  /** Short context under the figure, e.g. "vs. August". */
  hint?: string;
}

export interface RevenueOverviewData {
  title: string;
  /** The reporting period, e.g. "September 2026". */
  period: string;
  /** ISO currency code for currency metrics and charts. Defaults to USD. */
  currency?: string;
  /** Headline metrics. The first one is lit as the hero figure. */
  metrics: RevenueMetric[];
  /** The MRR bridge for the period, from opening to closing MRR. */
  movement: WaterfallStep[];
  /** Closing MRR by plan, optionally split further (for example by billing cycle). */
  planMix: TreemapNode[];
  /** Subscriber retention by signup cohort. */
  retention: { cohorts: CohortGridCohort[]; periods?: string[] };
  /** Targets for the period. */
  targets: BulletChartItem[];
}

export interface RevenueOverviewProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  data: RevenueOverviewData;
  /** Controls placed in the header, such as a period picker or export button. */
  actions?: React.ReactNode;
  locale?: string;
}

/** A subscription revenue overview: headline figures, the MRR bridge, plan mix, retention and targets. */
export function RevenueOverview({
  data,
  actions,
  locale = "en-US",
  className,
  ...props
}: RevenueOverviewProps) {
  const currency = data.currency ?? "USD";
  const money = React.useMemo(() => {
    const exact = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    const compact = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    });
    return { exact, compact };
  }, [currency, locale]);
  const percent = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [locale],
  );
  const formatTarget = (value: number, item: BulletChartItem) =>
    /churn|retention|rate/i.test(item.label)
      ? percent.format(value)
      : money.compact.format(value);

  return (
    <section
      data-slot="revenue-overview"
      aria-label={`${data.title}, ${data.period}`}
      className={cn(
        "@container/revenue overflow-hidden rounded-2xl border border-border/70 bg-background text-foreground",
        className,
      )}
      {...props}
    >
      <header
        data-slot="revenue-overview-header"
        className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-card px-4 py-3.5 sm:px-5"
      >
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-semibold tracking-tight">
            {data.title}
          </h2>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <IconCalendarStats aria-hidden="true" className="size-3.5" />
            {data.period}
          </p>
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </header>

      <div className="grid gap-3 p-3 sm:gap-4 sm:p-4">
        <dl
          data-slot="revenue-metrics"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] @md/revenue:grid-cols-2 @4xl/revenue:grid-cols-4 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
        >
          {data.metrics.map((metric, index) => (
            <MetricTile
              key={metric.id}
              metric={metric}
              hero={index === 0}
              locale={locale}
              currency={currency}
            />
          ))}
        </dl>

        <div className="grid gap-3 sm:gap-4 @4xl/revenue:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <WaterfallChart
            title="MRR movement"
            description={`Where recurring revenue came from in ${data.period}`}
            steps={data.movement}
            valueFormatter={(value, context) =>
              context === "detail"
                ? money.exact.format(value)
                : money.compact.format(value)
            }
          />
          <Treemap
            title="Plan mix"
            description="Closing MRR by plan and billing cycle"
            data={data.planMix}
            rootLabel="All plans"
            height={300}
            maxDepth={2}
            valueFormatter={(value) => money.compact.format(value)}
          />
        </div>

        <div className="grid gap-3 sm:gap-4 @4xl/revenue:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <CohortGrid
            title="Subscriber retention"
            description="Share of each signup month still subscribed"
            cohorts={data.retention.cohorts}
            periods={data.retention.periods}
            showAverage
          />
          <BulletChart
            title="Targets"
            description={`${data.period}, against plan`}
            items={data.targets}
            tone="status"
            valueFormatter={formatTarget}
          />
        </div>
      </div>
    </section>
  );
}

function MetricTile({
  metric,
  hero,
  locale,
  currency,
}: {
  metric: RevenueMetric;
  hero: boolean;
  locale: string;
  currency: string;
}) {
  const format = metric.format ?? "currency";
  return (
    <div
      data-slot="revenue-metric"
      data-hero={hero || undefined}
      className={cn(
        "relative flex min-w-0 flex-col gap-3 bg-card p-5",
        hero &&
          "bg-[radial-gradient(120%_90%_at_0%_0%,color-mix(in_oklab,var(--color-primary)_10%,transparent),transparent_60%)] bg-card",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <dt className="truncate text-xs text-muted-foreground">
          {metric.label}
        </dt>
        {metric.change !== undefined && (
          <DeltaBadge
            delta={metric.change}
            invert={metric.invert}
            variant="soft"
          />
        )}
      </div>
      <dd className="flex min-w-0 flex-col gap-1">
        <NumberTicker
          value={metric.value}
          locale={locale}
          currency={currency}
          format={format}
          formatOptions={
            format === "percent"
              ? { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }
              : format === "currency"
                ? { style: "currency", currency, maximumFractionDigits: 0 }
                : undefined
          }
          className={cn(
            "font-semibold tracking-[-0.035em] tabular-nums",
            hero ? "text-3xl" : "text-2xl",
          )}
        />
        {metric.hint && (
          <span className="text-xs text-muted-foreground">{metric.hint}</span>
        )}
      </dd>
      {metric.history && metric.history.length > 1 && (
        <Sparkline
          data={metric.history}
          label={`${metric.label} over the last ${metric.history.length} months`}
          className={cn(
            "h-10",
            metric.change === undefined
              ? "text-muted-foreground"
              : (metric.change >= 0) !== Boolean(metric.invert)
                ? "text-primary"
                : "text-rose-500 dark:text-rose-400",
          )}
          filled
          endpoint
        />
      )}
    </div>
  );
}

/* Sample data --------------------------------------------------------------- */

/** Fictional subscription revenue for Acme Studio, for demos and tests. */
export const sampleRevenue: RevenueOverviewData = {
  title: "Revenue",
  period: "September 2026",
  currency: "USD",
  metrics: [
    {
      id: "mrr",
      label: "Monthly recurring revenue",
      value: 454430,
      change: 0.102,
      hint: "vs. $412,300 in August",
      history: [298, 311, 326, 334, 351, 362, 371, 384, 396, 404, 412.3, 454.4],
    },
    {
      id: "new",
      label: "New business",
      value: 38400,
      change: 0.164,
      hint: "41 new subscriptions",
      history: [21, 24, 22, 27, 25, 29, 31, 28, 30, 33, 33, 38.4],
    },
    {
      id: "nrr",
      label: "Net revenue retention",
      value: 1.009,
      format: "percent",
      change: 0.006,
      hint: "Expansion net of churn",
      history: [0.97, 0.98, 0.975, 0.99, 0.985, 0.99, 1.0, 0.995, 1.0, 1.004, 1.003, 1.009],
    },
    {
      id: "churn",
      label: "Gross churn",
      value: 0.031,
      format: "percent",
      change: -0.114,
      invert: true,
      hint: "Share of opening MRR lost",
      history: [0.046, 0.044, 0.045, 0.041, 0.042, 0.039, 0.037, 0.038, 0.036, 0.035, 0.035, 0.031],
    },
  ],
  movement: [
    { id: "open", label: "Aug 31 MRR", value: 412300, kind: "start" },
    { id: "new", label: "New business", value: 38400 },
    { id: "expansion", label: "Expansion", value: 21750 },
    { id: "reactivation", label: "Reactivation", value: 4120 },
    { id: "contraction", label: "Contraction", value: -9260 },
    { id: "churn", label: "Churn", value: -12880 },
    { id: "close", label: "Sep 30 MRR", value: 0, kind: "end" },
  ],
  planMix: [
    {
      id: "studio",
      label: "Studio",
      children: [
        { id: "studio-annual", label: "Annual", value: 168000 },
        { id: "studio-monthly", label: "Monthly", value: 64000 },
      ],
    },
    {
      id: "team",
      label: "Team",
      children: [
        { id: "team-annual", label: "Annual", value: 98000 },
        { id: "team-monthly", label: "Monthly", value: 52000 },
      ],
    },
    {
      id: "enterprise",
      label: "Enterprise",
      children: [{ id: "enterprise-annual", label: "Annual", value: 52000 }],
    },
    {
      id: "starter",
      label: "Starter",
      children: [{ id: "starter-monthly", label: "Monthly", value: 20430 }],
    },
  ],
  retention: {
    periods: ["M0", "M1", "M2", "M3", "M4", "M5"],
    cohorts: [
      { id: "apr", label: "Apr 2026", size: 212, values: [1, 0.91, 0.86, 0.83, 0.81, 0.8] },
      { id: "may", label: "May 2026", size: 238, values: [1, 0.92, 0.87, 0.85, 0.83] },
      { id: "jun", label: "Jun 2026", size: 251, values: [1, 0.93, 0.89, 0.86] },
      { id: "jul", label: "Jul 2026", size: 274, values: [1, 0.94, 0.9] },
      { id: "aug", label: "Aug 2026", size: 290, values: [1, 0.95] },
      { id: "sep", label: "Sep 2026", size: 312, values: [1] },
    ],
  },
  targets: [
    {
      id: "mrr",
      label: "Closing MRR",
      sublabel: "Monthly recurring revenue",
      value: 454430,
      target: 460000,
      ranges: [400000, 440000, 500000],
    },
    {
      id: "new",
      label: "New business",
      sublabel: "MRR from new subscriptions",
      value: 38400,
      target: 35000,
      ranges: [25000, 32000, 45000],
    },
    {
      id: "nrr",
      label: "Net revenue retention",
      sublabel: "Expansion net of churn",
      value: 1.009,
      target: 1.02,
      ranges: [0.95, 1.0, 1.1],
    },
    {
      id: "churn",
      label: "Gross churn rate",
      sublabel: "Lower is better",
      value: 0.031,
      target: 0.025,
      ranges: [0.02, 0.035, 0.06],
      invert: true,
    },
  ],
};
