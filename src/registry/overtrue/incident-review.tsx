"use client";

import * as React from "react";
import { IconAlertTriangle, IconClockHour4 } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { InsightCard, type InsightSource } from "./insight-card";
import { LatencyHistogram } from "./latency-histogram";
import { TraceWaterfall, type TraceSpan } from "./trace-waterfall";
import { DeployPipeline, type PipelineStage } from "./deploy-pipeline";
import { LogStream, type LogEntry } from "./log-stream";

export type IncidentSeverity = "sev1" | "sev2" | "sev3";
export type IncidentState = "investigating" | "mitigated" | "resolved";

export interface IncidentReviewData {
  id: string;
  title: string;
  service: string;
  severity: IncidentSeverity;
  state: IncidentState;
  /** Human-readable duration, e.g. "18 min". */
  duration: string;
  /** Summary with optional `{{metric:…}}` and `{{cite:n}}` tokens. */
  summary: string;
  sources?: InsightSource[];
  latency: {
    /** Request latencies before the incident, in milliseconds. */
    before: number[];
    /** Request latencies during the incident. */
    during: number[];
    /** Objective drawn on the histogram. */
    threshold: number;
  };
  trace: { title: string; spans: TraceSpan[] };
  release: { title: string; meta?: React.ReactNode; stages: PipelineStage[] };
  events: LogEntry[];
}

export interface IncidentReviewProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  incident: IncidentReviewData;
  /** Ask your model for a new summary; the card shows a thinking state meanwhile. */
  onRegenerate?: () => void;
  /** Stream the summary in; leave false to show it complete. */
  streaming?: boolean;
}

const severityStyle: Record<IncidentSeverity, string> = {
  sev1: "bg-destructive text-white",
  sev2: "bg-amber-500 text-black",
  sev3: "bg-muted text-foreground",
};
const stateStyle: Record<IncidentState, string> = {
  investigating: "border-destructive/30 bg-destructive/10 text-destructive",
  mitigated:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  resolved:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};
const stateLabel: Record<IncidentState, string> = {
  investigating: "Investigating",
  mitigated: "Mitigated",
  resolved: "Resolved",
};

/** A post-incident review: what happened, the evidence, and what changed. */
export function IncidentReview({
  incident,
  onRegenerate,
  streaming = false,
  className,
  ...props
}: IncidentReviewProps) {
  return (
    <section
      data-slot="incident-review"
      aria-label={`${incident.id}: ${incident.title}`}
      className={cn(
        "@container/incident overflow-hidden rounded-xl border bg-background text-foreground",
        className,
      )}
      {...props}
    >
      <header
        data-slot="incident-review-header"
        className="flex flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-3 sm:px-5"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "inline-flex h-6 shrink-0 items-center gap-1 rounded-md px-2 font-mono text-[11px] font-semibold uppercase",
              severityStyle[incident.severity],
            )}
          >
            <IconAlertTriangle aria-hidden="true" className="size-3.5" stroke={2.25} />
            {incident.severity}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold tracking-tight">
              {incident.title}
            </h2>
            <p className="truncate font-mono text-xs text-muted-foreground">
              {incident.id} · {incident.service}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 text-muted-foreground tabular-nums">
            <IconClockHour4 aria-hidden="true" className="size-3.5" />
            {incident.duration}
          </span>
          <span
            className={cn(
              "inline-flex h-6 items-center rounded-full border px-2.5 font-medium",
              stateStyle[incident.state],
            )}
          >
            {stateLabel[incident.state]}
          </span>
        </div>
      </header>

      <div className="grid gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="grid gap-3 sm:gap-4 @4xl/incident:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <InsightCard
            title="What happened"
            source="Incident summary"
            text={incident.summary}
            status={streaming ? "streaming" : "done"}
            sources={incident.sources}
            onRegenerate={onRegenerate}
          />
          <DeployPipeline
            title={incident.release.title}
            meta={incident.release.meta}
            stages={incident.release.stages}
            orientation="auto"
          />
        </div>
        <LatencyHistogram
          title="Latency during the incident"
          description="Checkout requests, compared with the hour before"
          values={incident.latency.during}
          compare={incident.latency.before}
          compareLabel="Before"
          seriesLabel="During"
          threshold={incident.latency.threshold}
          thresholdLabel="SLO"
        />
        <TraceWaterfall
          title={incident.trace.title}
          description="Slowest trace in the incident window"
          spans={incident.trace.spans}
          height={340}
        />
        <LogStream
          entries={incident.events}
          title="Timeline"
          height={220}
          live={false}
        />
      </div>
    </section>
  );
}

/* Sample incident ---------------------------------------------------------- */

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

const at = (minute: number, second = 0) =>
  Date.UTC(2026, 9, 14, 14, minute, second);

/** A fictional checkout regression, for demos and tests. */
export const sampleIncident: IncidentReviewData = {
  id: "INC-2041",
  title: "Checkout latency regression after release",
  service: "checkout-api",
  severity: "sev2",
  state: "resolved",
  duration: "18 min",
  summary:
    "p95 checkout latency rose to {{metric:p95|412 ms|negative}} two minutes after release web@4f9c2ab reached production {{cite:1}}. The slowest traces spend most of their time in pricing.quote, which ran one promotions query per cart item {{cite:2}}. Rolling back restored p95 to {{metric:p95|186 ms|positive}} within six minutes {{cite:3}}. Follow-up: batch the promotions lookup and give the pricing service a query budget.",
  sources: [
    { id: "1", label: "Release web@4f9c2ab" },
    { id: "2", label: "Trace 9c41e2" },
    { id: "3", label: "Latency dashboard" },
  ],
  latency: {
    before: logNormal(3000, 168, 0.42, 7),
    during: [
      ...logNormal(2100, 236, 0.48, 11),
      ...logNormal(900, 520, 0.38, 13),
    ],
    threshold: 400,
  },
  trace: {
    title: "POST /api/checkout",
    spans: [
      { id: "root", name: "POST /api/checkout", service: "gateway", start: 0, duration: 1240 },
      { id: "auth", parentId: "root", name: "auth.verify_session", service: "auth", start: 6, duration: 38 },
      { id: "sess", parentId: "auth", name: "GET session", service: "redis", start: 9, duration: 3 },
      { id: "cart", parentId: "root", name: "cart.load", service: "cart", start: 48, duration: 84 },
      { id: "cartdb", parentId: "cart", name: "SELECT cart_items", service: "postgres", start: 56, duration: 61 },
      { id: "price", parentId: "root", name: "pricing.quote", service: "pricing", start: 136, duration: 962, attributes: { "cart.items": 14, "db.queries": 15 } },
      ...Array.from({ length: 12 }, (_, index) => ({
        id: `promo-${index}`,
        parentId: "price",
        name: "SELECT promotions WHERE sku = $1",
        service: "postgres",
        start: 148 + index * 76,
        duration: 66 + ((index * 17) % 9),
        attributes: { "db.rows": 1 + (index % 3) },
      })),
      { id: "tax", parentId: "price", name: "tax.calculate", service: "pricing", start: 1060, duration: 30 },
      { id: "pay", parentId: "root", name: "payments.authorize", service: "payments", start: 1104, duration: 118 },
      { id: "psp", parentId: "pay", name: "POST provider /authorize", service: "payments", start: 1110, duration: 104 },
    ],
  },
  release: {
    title: "web@4f9c2ab",
    meta: "Rolled back to 7d1e3fa",
    stages: [
      { id: "build", label: "Build", jobs: [{ id: "compile", label: "Compile", status: "success", duration: 72000 }] },
      {
        id: "test",
        label: "Test",
        jobs: [
          { id: "unit", label: "Unit", status: "success", duration: 48000 },
          { id: "e2e", label: "E2E", status: "success", duration: 161000 },
        ],
      },
      { id: "canary", label: "Canary 10%", jobs: [{ id: "canary-job", label: "Canary", status: "success", duration: 300000, detail: "p95 within budget at 10% traffic" }] },
      { id: "prod", label: "Production", jobs: [{ id: "prod-job", label: "Rollout", status: "canceled", duration: 240000, detail: "Stopped at 100% by rollback" }] },
      { id: "rollback", label: "Rollback", jobs: [{ id: "rollback-job", label: "7d1e3fa", status: "success", duration: 96000 }] },
    ],
  },
  events: [
    { id: "e1", time: at(2, 10), level: "info", source: "deploy", message: "web@4f9c2ab promoted to 100% of production traffic" },
    { id: "e2", time: at(4, 32), level: "warn", source: "alerts", message: "checkout p95 412 ms over 400 ms objective for 2 min" },
    { id: "e3", time: at(5, 5), level: "info", source: "pager", message: "On-call acknowledged INC-2041" },
    { id: "e4", time: at(9, 48), level: "error", source: "pricing", message: "pricing.quote issued 15 queries for a 14-item cart" },
    { id: "e5", time: at(11, 20), level: "info", source: "deploy", message: "Rollback to 7d1e3fa started" },
    { id: "e6", time: at(14, 2), level: "info", source: "alerts", message: "checkout p95 186 ms, back within objective" },
    { id: "e7", time: at(20, 0), level: "info", source: "pager", message: "INC-2041 resolved; follow-up PRICE-311 created" },
  ],
};
