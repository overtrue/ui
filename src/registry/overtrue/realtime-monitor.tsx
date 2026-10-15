"use client";

import * as React from "react";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconServer2,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { NumberTicker } from "./number-ticker";
import { LiveChart } from "./live-chart";
import { HostMap, type HostMapHost } from "./host-map";
import { LogStream, type LogEntry } from "./log-stream";
import { BulletChart, type BulletChartItem } from "./bullet-chart";

export interface Telemetry {
  /** Requests per second, oldest first. */
  requests: number[];
  /** p95 latency in milliseconds, oldest first. */
  latency: number[];
  /** Failed requests as a 0–1 fraction. */
  errorRate: number;
  /** Error rate one minute ago, for the comparison. */
  previousErrorRate?: number;
  activeSessions: number;
  previousSessions?: number;
  hosts: HostMapHost[];
  events: LogEntry[];
  objectives: BulletChartItem[];
}

export interface RealtimeMonitorProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  data: Telemetry;
  title?: string;
  /** Hostname, cluster, or environment shown under the title. */
  environment?: string;
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  /** Samples arrive this often; keeps the chart glide in step. */
  interval?: number;
}

const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function change(current: number, previous: number | undefined) {
  if (previous === undefined || previous === 0) return undefined;
  return (current - previous) / previous;
}

function Delta({
  value,
  invert = false,
  neutral = false,
}: {
  value: number | undefined;
  invert?: boolean;
  /** Movement without a better or worse direction, such as traffic. */
  neutral?: boolean;
}) {
  if (value === undefined || !Number.isFinite(value)) return null;
  const flat = Math.abs(value) < 0.0005;
  const good = flat || neutral ? null : value > 0 !== invert;
  const Icon = value >= 0 ? IconArrowUpRight : IconArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
        good === null
          ? "text-muted-foreground"
          : good
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-destructive",
      )}
    >
      {!flat && <Icon aria-hidden="true" className="size-3" stroke={2.25} />}
      <span className="sr-only">
        {flat ? "Unchanged" : value > 0 ? "Up" : "Down"}{" "}
      </span>
      {Math.abs(value * 100).toFixed(1)}%
    </span>
  );
}

function Metric({
  label,
  children,
  delta,
}: {
  label: string;
  children: React.ReactNode;
  delta?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2 px-5 py-4">
      <p className="truncate text-xs text-muted-foreground">{label}</p>
      <div className="text-2xl font-semibold tracking-tight text-card-foreground tabular-nums @3xl/monitor:text-[1.75rem]">
        {children}
      </div>
      <div className="flex min-w-0 items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
        {delta}
        <span className="truncate">vs. 1 min ago</span>
      </div>
    </div>
  );
}

/** A live operations console: traffic, fleet health, objectives, and events. */
export function RealtimeMonitor({
  data,
  title = "Production",
  environment = "api.acme.studio",
  paused = false,
  onPausedChange,
  interval = 1000,
  className,
  ...props
}: RealtimeMonitorProps) {
  const requests = data.requests[data.requests.length - 1] ?? 0;
  const latency = data.latency[data.latency.length - 1] ?? 0;
  const lookback = Math.min(60, data.requests.length - 1);
  const hostCounts = data.hosts.reduce(
    (counts, host) => {
      const status =
        host.status ??
        ((host.value ?? 0) >= 0.9
          ? "critical"
          : (host.value ?? 0) >= 0.7
            ? "warn"
            : "ok");
      counts[status] = (counts[status] ?? 0) + 1;
      return counts;
    },
    {} as Record<string, number>,
  );
  const regions = new Set(data.hosts.map((host) => host.group)).size;

  return (
    <section
      data-slot="realtime-monitor"
      aria-label={`${title} monitor`}
      className={cn(
        "@container/monitor overflow-hidden rounded-xl border bg-background text-foreground",
        className,
      )}
      {...props}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconServer2 aria-hidden="true" className="size-[18px]" stroke={1.75} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold tracking-tight">
              {title}
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              {environment} · {data.hosts.length} hosts in {regions}{" "}
              {regions === 1 ? "region" : "regions"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex h-7 items-center gap-2 rounded-full border px-2.5 text-xs font-medium",
              paused
                ? "text-muted-foreground"
                : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
            )}
          >
            <span className="relative flex size-1.5">
              {!paused && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
              )}
              <span
                className={cn(
                  "relative inline-flex size-1.5 rounded-full",
                  paused ? "bg-muted-foreground" : "bg-emerald-500",
                )}
              />
            </span>
            {paused ? "Paused" : "Live"}
          </span>
          {onPausedChange && (
            <button
              type="button"
              onClick={() => onPausedChange(!paused)}
              aria-pressed={paused}
              className="inline-flex h-7 items-center gap-1.5 rounded-md border bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {paused ? (
                <IconPlayerPlayFilled aria-hidden="true" className="size-3" />
              ) : (
                <IconPlayerPauseFilled aria-hidden="true" className="size-3" />
              )}
              {paused ? "Resume" : "Pause"}
            </button>
          )}
        </div>
      </header>

      <div className="grid gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border shadow-xs @3xl/monitor:grid-cols-4 [&>*]:bg-card">
          <Metric
            label="Requests / s"
            delta={
              <Delta
                neutral
                value={change(requests, data.requests[data.requests.length - 1 - lookback])}
              />
            }
          >
            <NumberTicker value={Math.round(requests)} animateOnMount />
          </Metric>
          <Metric
            label="p95 latency"
            delta={
              <Delta
                invert
                value={change(latency, data.latency[data.latency.length - 1 - lookback])}
              />
            }
          >
            <NumberTicker
              value={Math.round(latency)}
              animateOnMount
              suffix={<span className="ml-1 text-base font-medium text-muted-foreground">ms</span>}
            />
          </Metric>
          <Metric
            label="Error rate"
            delta={
              <Delta
                invert
                value={change(data.errorRate, data.previousErrorRate)}
              />
            }
          >
            <NumberTicker
              value={data.errorRate}
              animateOnMount
              format="percent"
              formatOptions={{ style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 }}
            />
          </Metric>
          <Metric
            label="Sessions"
            delta={
              <Delta value={change(data.activeSessions, data.previousSessions)} />
            }
          >
            <NumberTicker value={data.activeSessions} animateOnMount />
          </Metric>
        </div>

        <div className="grid gap-3 sm:gap-4 @4xl/monitor:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <LiveChart
            data={data.requests}
            interval={interval}
            label="Throughput"
            description="Requests per second, last 2 minutes"
            unit="req/s"
            threshold={1600}
            thresholdLabel="Autoscale"
            valueFormatter={(value) => integer.format(value)}
            height={196}
          />
          <HostMap
            hosts={data.hosts}
            title="Fleet"
            description={`CPU by region · ${hostCounts.critical ?? 0} critical, ${hostCounts.warn ?? 0} warning`}
            metricLabel="CPU"
            cellSize="sm"
            groupOrder={["us-east", "eu-west", "ap-south"]}
          />
          <LogStream
            entries={data.events}
            title="Events"
            height={232}
            maxEntries={120}
            live={!paused}
          />
          <BulletChart
            items={data.objectives}
            title="Objectives"
            description="Rolling 30 days"
            tone="status"
          />
        </div>
      </div>
    </section>
  );
}

/* Simulation --------------------------------------------------------------- */

const regionsSeed = [
  { group: "us-east", count: 24 },
  { group: "eu-west", count: 16 },
  { group: "ap-south", count: 12 },
];

const eventTemplates: Omit<LogEntry, "id" | "time">[] = [
  { level: "info", source: "api", message: "GET /v1/projects 200 · 38 ms" },
  { level: "info", source: "api", message: "POST /v1/invoices 201 · 112 ms" },
  { level: "debug", source: "cache", message: "Warmed 1,204 keys for workspace acme-studio" },
  { level: "info", source: "deploy", message: "web@4f2c1a9 promoted to 25% of traffic" },
  { level: "info", source: "queue", message: "billing-worker drained 312 jobs" },
  { level: "warn", source: "db", message: "Slow query on reports.monthly_rollup · 1.8 s" },
  { level: "info", source: "auth", message: "Session refreshed for 42 users" },
  { level: "error", source: "api", message: "Upstream timeout from payments-provider · retrying (1/3)" },
  { level: "info", source: "api", message: "Retry succeeded for payments-provider · 640 ms" },
  { level: "debug", source: "scheduler", message: "Next autoscale check in 30 s" },
];

function jitter(value: number, amount: number, low: number, high: number) {
  return Math.min(high, Math.max(low, value + (Math.random() - 0.5) * amount));
}

function seedSeries(length: number, base: number, swing: number) {
  return Array.from({ length }, (_, index) =>
    Math.round(base + Math.sin(index / 9) * swing + Math.cos(index / 4) * swing * 0.3),
  );
}

function seedHosts(): HostMapHost[] {
  let index = 0;
  return regionsSeed.flatMap(({ group, count }) =>
    Array.from({ length: count }, (_, n) => {
      index += 1;
      const value = 0.28 + ((index * 37) % 41) / 100;
      return {
        id: `${group}-${n + 1}`,
        name: `${group}-node-${String(n + 1).padStart(2, "0")}`,
        group,
        value: index === 7 ? 0.93 : index === 31 ? 0.81 : value,
      };
    }),
  );
}

function objectives(latency: number, errorRate: number): BulletChartItem[] {
  return [
    {
      id: "apdex",
      label: "Apdex",
      sublabel: "User satisfaction",
      value: Math.min(1, 0.97 - Math.max(0, latency - 180) * 0.0011),
      target: 0.9,
      max: 1,
      ranges: [0.7, 0.85, 1],
      valueFormatter: (value) => value.toFixed(2),
    },
    {
      id: "latency",
      label: "p95 latency",
      sublabel: "Lower is better",
      value: Math.round(latency),
      target: 220,
      max: 320,
      ranges: [200, 260, 320],
      invert: true,
      valueFormatter: (value) => `${Math.round(value)} ms`,
    },
    {
      id: "budget",
      label: "Error budget",
      sublabel: "Remaining this month",
      value: Math.max(0, 74 - errorRate * 900),
      target: 50,
      max: 100,
      ranges: [25, 50, 100],
      valueFormatter: (value) => `${Math.round(value)}%`,
    },
    {
      id: "cache",
      label: "Cache hit rate",
      sublabel: "Edge and application",
      value: 0.9 + Math.sin(latency / 17) * 0.025,
      target: 0.9,
      max: 1,
      ranges: [0.7, 0.85, 1],
      valueFormatter: (value) => `${Math.round(value * 100)}%`,
    },
  ];
}

/**
 * Sample telemetry for demos and prototypes. Replace it with your own stream —
 * the monitor only reads the `Telemetry` you pass in.
 */
export function useSimulatedTelemetry({
  interval = 1000,
  paused = false,
  windowSize = 120,
}: { interval?: number; paused?: boolean; windowSize?: number } = {}) {
  const [state, setState] = React.useState<Telemetry>(() => {
    const start = Date.now() - 6000;
    const latency = seedSeries(windowSize, 186, 14);
    return {
      requests: seedSeries(windowSize, 1240, 120),
      latency,
      errorRate: 0.0042,
      previousErrorRate: 0.0047,
      activeSessions: 18204,
      previousSessions: 17960,
      hosts: seedHosts(),
      events: eventTemplates.slice(0, 6).map((event, index) => ({
        ...event,
        id: `seed-${index}`,
        time: start + index * 900,
      })),
      objectives: objectives(latency[latency.length - 1], 0.0042),
    };
  });
  const tick = React.useRef(0);

  React.useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      tick.current += 1;
      const step = tick.current;
      setState((current) => {
        const lastRequests = current.requests[current.requests.length - 1];
        const surge = step % 45 > 36 ? 90 : 0;
        const nextRequests = Math.round(
          jitter(lastRequests + surge - (step % 45 === 0 ? 260 : 0), 140, 820, 1780),
        );
        const lastLatency = current.latency[current.latency.length - 1];
        const nextLatency = Math.round(
          jitter(lastLatency + (nextRequests - lastRequests) * 0.04, 16, 132, 296),
        );
        const errorRate = jitter(
          0.0036 + Math.max(0, nextLatency - 210) * 0.00004,
          0.0012,
          0.0008,
          0.018,
        );
        const hosts = current.hosts.map((host, index) =>
          (index + step) % 3 === 0
            ? {
                ...host,
                value: jitter(
                  (host.value ?? 0.4) + (nextRequests - 1240) * 0.00003,
                  0.08,
                  0.12,
                  index === 6 ? 0.98 : 0.86,
                ),
              }
            : host,
        );
        const template = eventTemplates[step % eventTemplates.length];
        const events =
          step % 2 === 0
            ? [
                ...current.events.slice(-119),
                { ...template, id: `event-${step}`, time: Date.now() },
              ]
            : current.events;
        return {
          requests: [...current.requests.slice(1), nextRequests],
          latency: [...current.latency.slice(1), nextLatency],
          previousErrorRate: step % 60 === 0 ? current.errorRate : current.previousErrorRate,
          errorRate,
          previousSessions:
            step % 60 === 0 ? current.activeSessions : current.previousSessions,
          activeSessions: Math.round(
            jitter(current.activeSessions + 4, 40, 15000, 24000),
          ),
          hosts,
          events,
          objectives: objectives(nextLatency, errorRate),
        };
      });
    }, interval);
    return () => window.clearInterval(timer);
  }, [interval, paused]);

  return state;
}
