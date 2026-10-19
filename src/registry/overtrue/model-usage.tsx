"use client";

import * as React from "react";
import { IconCalendarStats, IconSparkles } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { NumberTicker } from "./number-ticker";
import { Sparkline } from "./sparkline";
import { DeltaBadge } from "./delta-badge";
import {
  StackedAreaChart,
  type StackedAreaAnnotation,
} from "./stacked-area-chart";
import { LatencyHistogram } from "./latency-histogram";
import { InsightCard, type InsightSource } from "./insight-card";

export interface ModelUsageModel {
  /** Field name for this model in each `usage` row. */
  id: string;
  label: string;
  /** Provider or deployment, shown under the name. */
  provider?: string;
  color?: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  /** Spend for the period, in currency units. */
  cost: number;
  /** 95th percentile latency in milliseconds. */
  p95: number;
  /** Failed requests as a fraction, e.g. 0.004 for 0.4%. */
  errorRate: number;
}

export interface ModelUsageMetric {
  id: string;
  label: string;
  value: number;
  format?: "number" | "compact" | "currency" | "milliseconds";
  /** Fractional change against the previous period. */
  change?: number;
  /** Lower is better, e.g. spend or latency. */
  invert?: boolean;
  history?: number[];
  hint?: string;
}

export interface ModelUsageData {
  title: string;
  period: string;
  currency?: string;
  /** Headline figures; the first is lit as the hero. */
  metrics: ModelUsageMetric[];
  /** One row per day: an `date` ISO string plus a token count per model id. */
  usage: Record<string, unknown>[];
  models: ModelUsageModel[];
  /** Markers on the usage chart, such as a routing change. */
  annotations?: StackedAreaAnnotation[];
  latency: {
    /** Gateway request latencies in milliseconds. */
    values: number[];
    compare?: number[];
    threshold?: number;
  };
  /** A written summary with optional `{{metric:…}}` and `{{cite:n}}` tokens. */
  summary?: { text: string; sources?: InsightSource[] };
}

export interface ModelUsageProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  data: ModelUsageData;
  actions?: React.ReactNode;
  locale?: string;
  /** Regenerate the summary with your own model. */
  onRegenerateSummary?: () => void;
  /** Show the summary as it streams in. */
  summaryStreaming?: boolean;
}

/** An AI gateway dashboard: requests, tokens and spend by model, latency, and a written summary. */
export function ModelUsage({
  data,
  actions,
  locale = "en-US",
  onRegenerateSummary,
  summaryStreaming = false,
  className,
  ...props
}: ModelUsageProps) {
  const currency = data.currency ?? "USD";
  const [focused, setFocused] = React.useState<string | null>(null);
  const formats = React.useMemo(
    () => ({
      compact: new Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
      number: new Intl.NumberFormat(locale),
      money: new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
      percent: new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 2,
      }),
      day: new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }),
    }),
    [currency, locale],
  );
  const models = React.useMemo(
    () => [...data.models].sort((a, b) => b.cost - a.cost),
    [data.models],
  );
  const series = data.models.map((model) => ({
    key: model.id,
    label: model.label,
    color: model.color,
  }));
  const hidden = focused
    ? data.models.filter((model) => model.id !== focused).map((model) => model.id)
    : [];
  const maxCost = Math.max(...models.map((model) => model.cost), 1);
  const totalCost = models.reduce((sum, model) => sum + model.cost, 0);

  return (
    <section
      data-slot="model-usage"
      aria-label={`${data.title}, ${data.period}`}
      className={cn(
        "@container/usage flex min-w-0 flex-col gap-3 text-foreground sm:gap-4",
        className,
      )}
      {...props}
    >
      <header
        data-slot="model-usage-header"
        className="flex flex-wrap items-end justify-between gap-3"
      >
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold tracking-tight">
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

      <div className="grid gap-3 sm:gap-4">
        <dl
          data-slot="model-usage-metrics"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] @md/usage:grid-cols-2 @4xl/usage:grid-cols-4 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
        >
          {data.metrics.map((metric, index) => (
            <UsageMetric
              key={metric.id}
              metric={metric}
              hero={index === 0}
              locale={locale}
              currency={currency}
            />
          ))}
        </dl>

        <StackedAreaChart
          title="Tokens by model"
          description={
            focused
              ? `Showing ${data.models.find((model) => model.id === focused)?.label} only. Select it again in the table to show every model.`
              : "Input and output tokens per day, stacked by model"
          }
          data={data.usage}
          index="date"
          series={series}
          hiddenSeries={hidden}
          onHiddenSeriesChange={(next) => {
            const visible = data.models.filter((model) => !next.includes(model.id));
            setFocused(visible.length === 1 ? visible[0].id : null);
          }}
          annotations={data.annotations}
          height={300}
          valueFormatter={(value) => formats.compact.format(value)}
          xFormatter={(value) =>
            formats.day.format(value instanceof Date ? value : new Date(String(value)))
          }
        />

        <div className="grid gap-3 sm:gap-4 @4xl/usage:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {data.summary && (
            <InsightCard
              title="Usage summary"
              source={data.period}
              icon={<IconSparkles aria-hidden="true" className="size-4" />}
              text={data.summary.text}
              sources={data.summary.sources}
              status={summaryStreaming ? "streaming" : "done"}
              onRegenerate={onRegenerateSummary}
            />
          )}
          <LatencyHistogram
            title="Gateway latency"
            description="Every request in the period, against the previous one"
            values={data.latency.values}
            compare={data.latency.compare}
            compareLabel="Previous"
            seriesLabel="This period"
            threshold={data.latency.threshold}
            thresholdLabel="SLO"
          />
        </div>

        <div
          data-slot="model-usage-table"
          className="overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-5 pb-3">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Models</h3>
              <p className="text-[13px] leading-5 text-muted-foreground">
                Select a model to show it alone on the chart.
              </p>
            </div>
            <p className="text-xs text-muted-foreground tabular-nums">
              {formats.money.format(totalCost)} across {models.length} models
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-y border-border/60 text-left text-xs text-muted-foreground">
                  <th scope="col" className="w-[24%] px-5 py-2 font-medium">Model</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Requests</th>
                  <th scope="col" className="w-[22%] px-3 py-2 font-medium">Tokens in · out</th>
                  <th scope="col" className="w-[28%] px-3 py-2 font-medium">Spend</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">p95</th>
                  <th scope="col" className="px-5 py-2 text-right font-medium">Errors</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => {
                  const index = data.models.indexOf(model);
                  const color = model.color ?? `var(--color-chart-${(index % 5) + 1})`;
                  const tokens = model.inputTokens + model.outputTokens;
                  const active = focused === model.id;
                  const dimmed = focused !== null && !active;
                  return (
                    <tr
                      key={model.id}
                      data-slot="model-usage-row"
                      data-active={active || undefined}
                      className={cn(
                        "border-b border-border/50 transition-opacity duration-150 last:border-b-0",
                        dimmed && "opacity-45",
                        active && "bg-primary/[0.04]",
                      )}
                    >
                      <th scope="row" className="px-5 py-2.5 text-left font-normal">
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setFocused(active ? null : model.id)}
                          className="group flex items-center gap-2.5 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                          <span
                            aria-hidden="true"
                            className="size-2.5 shrink-0 rounded-[3px] shadow-[0_0_0_3px_color-mix(in_oklab,currentColor_16%,transparent)]"
                            style={{ background: color, color }}
                          />
                          <span className="min-w-0">
                            <span className="block truncate font-medium group-hover:underline group-hover:underline-offset-4">
                              {model.label}
                            </span>
                            {model.provider && (
                              <span className="block truncate font-mono text-[11px] text-muted-foreground">
                                {model.provider}
                              </span>
                            )}
                          </span>
                        </button>
                      </th>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        {formats.compact.format(model.requests)}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-12 shrink-0 tabular-nums">
                            {formats.compact.format(tokens)}
                          </span>
                          <span
                            className="flex h-1.5 min-w-16 flex-1 overflow-hidden rounded-full bg-muted"
                            role="img"
                            aria-label={`${formats.compact.format(model.inputTokens)} input, ${formats.compact.format(model.outputTokens)} output`}
                          >
                            <span
                              className="h-full"
                              style={{
                                width: `${(model.inputTokens / Math.max(tokens, 1)) * 100}%`,
                                background: color,
                              }}
                            />
                            <span
                              className="h-full opacity-45"
                              style={{ flex: 1, background: color }}
                            />
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-16 shrink-0 tabular-nums">
                            {formats.money.format(model.cost)}
                          </span>
                          <span className="h-1.5 min-w-20 flex-1 overflow-hidden rounded-full bg-muted">
                            <span
                              className="block h-full rounded-full"
                              style={{
                                width: `${(model.cost / maxCost) * 100}%`,
                                background: `linear-gradient(90deg, color-mix(in oklab, ${color} 70%, transparent), ${color})`,
                              }}
                            />
                          </span>
                          <span className="w-12 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                            {formats.percent.format(model.cost / Math.max(totalCost, 1))}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        {formats.number.format(Math.round(model.p95))}
                        <span className="ml-0.5 text-xs text-muted-foreground">ms</span>
                      </td>
                      <td className="px-5 py-2.5 text-right tabular-nums">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5",
                            model.errorRate >= 0.01
                              ? "text-rose-600 dark:text-rose-400"
                              : model.errorRate >= 0.005
                                ? "text-amber-700 dark:text-amber-300"
                                : "text-muted-foreground",
                          )}
                        >
                          {model.errorRate >= 0.005 && (
                            <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                          )}
                          {formats.percent.format(model.errorRate)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function UsageMetric({
  metric,
  hero,
  locale,
  currency,
}: {
  metric: ModelUsageMetric;
  hero: boolean;
  locale: string;
  currency: string;
}) {
  const format = metric.format ?? "number";
  return (
    <div
      data-slot="model-usage-metric"
      data-hero={hero || undefined}
      className={cn(
        "relative flex min-w-0 flex-col gap-3 bg-card p-5",
        hero &&
          "bg-[radial-gradient(120%_90%_at_0%_0%,color-mix(in_oklab,var(--color-primary)_10%,transparent),transparent_60%)] bg-card",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <dt className="truncate text-xs text-muted-foreground">{metric.label}</dt>
        {metric.change !== undefined && (
          <DeltaBadge delta={metric.change} invert={metric.invert} variant="soft" />
        )}
      </div>
      <dd className="flex min-w-0 flex-col gap-1">
        <NumberTicker
          value={metric.value}
          locale={locale}
          currency={currency}
          format={format === "currency" ? "currency" : format === "compact" ? "compact" : "number"}
          formatOptions={
            format === "currency"
              ? { style: "currency", currency, maximumFractionDigits: 0 }
              : format === "compact"
                ? { notation: "compact", maximumFractionDigits: 1 }
                : undefined
          }
          suffix={
            format === "milliseconds" ? (
              <span className="ml-0.5 text-base font-medium tracking-normal text-muted-foreground">
                ms
              </span>
            ) : undefined
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
          label={`${metric.label}, recent trend`}
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

function random(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function logNormal(count: number, median: number, spread: number, seed: number) {
  const next = random(seed);
  return Array.from({ length: count }, () => {
    const u = Math.max(next(), 1e-9);
    const v = next();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return Math.round(median * Math.exp(spread * z));
  });
}

const sampleModels = [
  // id, label, provider, base daily tokens, $ per million tokens, output share, tokens per request, p95, error rate
  ["large", "Atlas Large", "atlas/large-2026-08", 26_000_000, 15, 0.32, 3100, 2840, 0.0062],
  ["medium", "Atlas Medium", "atlas/medium-2026-06", 42_000_000, 3, 0.28, 1900, 1320, 0.0031],
  ["small", "Atlas Small", "atlas/small-2026-09", 31_000_000, 0.6, 0.24, 1100, 610, 0.0018],
  ["embed", "Embed v3", "atlas/embed-v3", 54_000_000, 0.1, 0, 420, 140, 0.0004],
  ["rerank", "Rerank v2", "atlas/rerank-v2", 13_000_000, 1, 0, 680, 210, 0.0011],
] as const;

function buildSampleUsage(): ModelUsageData {
  const next = random(42);
  const days = 30;
  const routedOn = 17; // Summaries move from Large to Small on this day.
  const usage: Record<string, unknown>[] = [];
  const totals: Record<string, number> = {};
  for (let day = 0; day < days; day++) {
    const date = new Date(Date.UTC(2026, 8, 13 + day));
    const weekday = date.getUTCDay();
    const weekend = weekday === 0 || weekday === 6 ? 0.58 : 1;
    const growth = 1 + day * 0.012;
    const row: Record<string, unknown> = { date: date.toISOString().slice(0, 10) };
    for (const [id, , , base] of sampleModels) {
      let value = base * weekend * growth * (0.9 + next() * 0.2);
      if (id === "large" && day >= routedOn) value *= 0.46;
      if (id === "small" && day >= routedOn) value *= 1.55;
      row[id] = Math.round(value);
      totals[id] = (totals[id] ?? 0) + Math.round(value);
    }
    usage.push(row);
  }
  const models: ModelUsageModel[] = sampleModels.map(
    ([id, label, provider, , price, outputShare, perRequest, p95, errorRate]) => {
      const tokens = totals[id];
      return {
        id,
        label,
        provider,
        requests: Math.round(tokens / perRequest),
        inputTokens: Math.round(tokens * (1 - outputShare)),
        outputTokens: Math.round(tokens * outputShare),
        cost: Math.round((tokens / 1_000_000) * price),
        p95,
        errorRate,
      };
    },
  );
  const sum = (pick: (model: ModelUsageModel) => number) =>
    models.reduce((total, model) => total + pick(model), 0);
  const dailyTotals = usage.map((row) =>
    sampleModels.reduce((total, [id]) => total + Number(row[id]), 0),
  );
  const weekly = (values: number[]) =>
    Array.from({ length: Math.ceil(values.length / 3) }, (_, index) =>
      values.slice(index * 3, index * 3 + 3).reduce((a, b) => a + b, 0),
    );
  const dailyCost = usage.map((row) =>
    sampleModels.reduce(
      (total, [id, , , , price]) => total + (Number(row[id]) / 1_000_000) * price,
      0,
    ),
  );
  const latency = [
    ...logNormal(2600, 420, 0.7, 7),
    ...logNormal(600, 1900, 0.35, 9),
  ];
  return {
    title: "AI gateway",
    period: "Sep 13 – Oct 12, 2026",
    currency: "USD",
    metrics: [
      {
        id: "requests",
        label: "Requests",
        value: sum((model) => model.requests),
        format: "compact",
        change: 0.214,
        hint: "Across five models",
        history: weekly(dailyTotals.map((tokens) => tokens / 1500)),
      },
      {
        id: "tokens",
        label: "Tokens",
        value: sum((model) => model.inputTokens + model.outputTokens),
        format: "compact",
        change: 0.187,
        hint: "Input and output",
        history: weekly(dailyTotals),
      },
      {
        id: "spend",
        label: "Spend",
        value: sum((model) => model.cost),
        format: "currency",
        change: -0.082,
        invert: true,
        hint: "After routing summaries to Atlas Small",
        history: weekly(dailyCost),
      },
      {
        id: "p95",
        label: "p95 latency",
        value: 1640,
        format: "milliseconds",
        change: -0.126,
        invert: true,
        hint: "Gateway, end to end",
        history: [2010, 1980, 1940, 1890, 1860, 1720, 1690, 1660, 1650, 1640],
      },
    ],
    usage,
    models,
    annotations: [
      { x: usage[routedOn].date as string, label: "Summaries routed to Atlas Small" },
    ],
    latency: {
      values: latency,
      compare: [...logNormal(2600, 470, 0.72, 11), ...logNormal(700, 2300, 0.35, 13)],
      threshold: 2500,
    },
    summary: {
      text: "Spend fell {{metric:Spend|-8.2%|positive}} while requests grew {{metric:Requests|+21.4%|neutral}}, because summaries moved from Atlas Large to Atlas Small on Sep 30 {{cite:1}}. Atlas Small now handles a third of all generation traffic at {{metric:p95|610 ms|positive}} {{cite:2}}. Atlas Large still has the highest error rate, mostly timeouts on long contexts {{cite:3}}; capping its context at 64K tokens would remove most of them.",
      sources: [
        { id: "1", label: "Routing rule summaries-v4" },
        { id: "2", label: "Gateway latency" },
        { id: "3", label: "Error log, Atlas Large" },
      ],
    },
  };
}

/** Fictional AI gateway usage for Acme Studio, for demos and tests. */
export const sampleModelUsage: ModelUsageData = buildSampleUsage();
