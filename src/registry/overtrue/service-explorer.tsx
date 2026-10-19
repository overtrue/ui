"use client";

import * as React from "react";
import { IconPointer } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import {
  ServiceMap,
  type ServiceMapEdge,
  type ServiceMapNode,
} from "./service-map";
import { FlameGraph, type FlameNode } from "./flame-graph";
import { LatencyHistogram } from "./latency-histogram";
import { JsonViewer } from "./json-viewer";

export interface ExploredService {
  /** Request latencies in milliseconds for the window. */
  latency: number[];
  /** Objective drawn on the histogram, in milliseconds. */
  threshold?: number;
  /** A sampled CPU profile for the service. */
  profile: FlameNode;
  /** The slowest request in the window, shown as JSON. */
  slowest?: unknown;
}

export interface ServiceExplorerData {
  title: string;
  /** Context under the title, e.g. "Production · last 5 minutes". */
  description?: string;
  nodes: ServiceMapNode[];
  edges: ServiceMapEdge[];
  /** Detail per service id. Nodes without an entry can be selected but show a hint. */
  services: Record<string, ExploredService>;
}

export interface ServiceExplorerProps
  extends Omit<React.ComponentProps<"section">, "title" | "onSelect"> {
  data: ServiceExplorerData;
  /** Controlled selection. */
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelect?: (id: string | null) => void;
  actions?: React.ReactNode;
}

/** Pick a service on the live map to see its latency, its slowest request and a CPU profile. */
export function ServiceExplorer({
  data,
  selectedId,
  defaultSelectedId = null,
  onSelect,
  actions,
  className,
  ...props
}: ServiceExplorerProps) {
  const [internal, setInternal] = React.useState<string | null>(
    defaultSelectedId,
  );
  const selected = selectedId !== undefined ? selectedId : internal;
  const select = (id: string | null) => {
    if (selectedId === undefined) setInternal(id);
    onSelect?.(id);
  };
  const node = data.nodes.find((entry) => entry.id === selected) ?? null;
  const detail = selected ? data.services[selected] : undefined;

  return (
    <section
      data-slot="service-explorer"
      aria-label={data.title}
      className={cn(
        "@container/explorer flex min-w-0 flex-col gap-3 text-foreground sm:gap-4",
        className,
      )}
      {...props}
    >
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold tracking-tight">
            {data.title}
          </h2>
          {data.description && (
            <p className="truncate text-xs text-muted-foreground">
              {data.description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </header>

      <div className="grid gap-3 sm:gap-4">
        <ServiceMap
          title="Service map"
          description="Select a service to inspect it"
          nodes={data.nodes}
          edges={data.edges}
          selectedId={selected}
          onSelect={(id) => select(id)}
        />

        {node && detail ? (
          <div
            key={node.id}
            data-slot="service-explorer-detail"
            className="grid gap-3 sm:gap-4"
          >
            <div className="grid gap-3 sm:gap-4 @4xl/explorer:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <LatencyHistogram
                title="Latency"
                description={`Every ${node.label} request in the window`}
                values={detail.latency}
                threshold={detail.threshold}
                thresholdLabel="SLO"
              />
              {detail.slowest !== undefined && (
                <JsonViewer
                  title="Slowest request"
                  description="Span attributes and timings"
                  data={detail.slowest}
                  rootName="span"
                  defaultExpandDepth={1}
                  maxHeight={360}
                />
              )}
            </div>
            <FlameGraph
              title="CPU profile"
              description={`Sampled from ${node.label} during the window`}
              data={detail.profile}
              showTopFunctions={5}
              height={320}
            />
          </div>
        ) : (
          <div
            data-slot="service-explorer-empty"
            className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/80 px-6 py-10 text-center"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-muted/60 text-muted-foreground">
              <IconPointer aria-hidden="true" className="size-5" />
            </span>
            <p className="text-sm font-medium">
              {node
                ? `No profile for ${node.label}`
                : "Select a service on the map"}
            </p>
            <p className="max-w-sm text-[13px] text-muted-foreground">
              {node
                ? "Clients, data stores and external providers have no CPU profile here. Select one of the services."
                : "Its latency, its slowest request and a CPU profile appear here."}
            </p>
          </div>
        )}
      </div>
    </section>
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
    return Math.round(median * Math.exp(spread * z) * 10) / 10;
  });
}
/** A frame with children; the value includes the frame's own self time. */
const f = (name: string, self: number, ...children: FlameNode[]): FlameNode => ({
  name,
  value: self + children.reduce((sum, child) => sum + child.value, 0),
  ...(children.length ? { children } : {}),
});
const http = (...children: FlameNode[]) =>
  f("node.main", 4, f("http.Server.emit", 6, f("router.handle", 8, f("middleware.auth", 14, f("jwt.verify", 22)), ...children)));

const checkoutProfile = http(
  f("checkout.submit", 18,
    f("cart.load", 12, f("db.query", 64, f("pg.Client.query", 21)), f("cart.normalize", 18)),
    f("pricing.quote", 26, f("promotions.match", 44, f("db.query", 120, f("pg.Client.query", 38))), f("tax.calculate", 31)),
    f("payments.authorize", 9, f("http.request", 182, f("tls.handshake", 26), f("JSON.parse", 14))),
    f("orders.create", 15, f("db.transaction", 36, f("pg.Client.query", 22)), f("kafka.produce", 17)),
  ),
  f("render.response", 8, f("JSON.stringify", 46), f("zlib.gzip", 28)),
);
const paymentsProfile = http(
  f("payments.authorize", 22,
    f("fraud.score", 38, f("features.load", 41, f("db.query", 58)), f("model.predict", 92)),
    f("provider.authorize", 14, f("http.request", 296, f("tls.handshake", 31), f("JSON.parse", 12)), f("retry.backoff", 64)),
    f("ledger.write", 11, f("db.transaction", 44, f("pg.Client.query", 27))),
  ),
  f("render.response", 6, f("JSON.stringify", 12)),
);
const catalogProfile = http(
  f("catalog.list", 12,
    f("cache.get", 9, f("redis.GET", 14)),
    f("db.query", 52, f("pg.Client.query", 26)),
    f("products.hydrate", 34, f("images.sign", 41), f("prices.attach", 22)),
  ),
  f("render.response", 6, f("JSON.stringify", 58), f("zlib.gzip", 31)),
);
const searchProfile = http(
  f("search.query", 16,
    f("query.parse", 18),
    f("index.lookup", 24, f("bm25.score", 66), f("vector.knn", 88)),
    f("results.rerank", 14, f("model.predict", 47)),
    f("catalog.fetch", 9, f("http.request", 42)),
  ),
  f("render.response", 5, f("JSON.stringify", 21)),
);
const cartProfile = http(
  f("cart.update", 10, f("cache.get", 7, f("redis.GET", 9)), f("cart.normalize", 14), f("cache.set", 6, f("redis.SET", 8))),
  f("render.response", 4, f("JSON.stringify", 9)),
);
const authProfile = http(
  f("session.verify", 8, f("cache.get", 5, f("redis.GET", 6)), f("crypto.verify", 31)),
  f("render.response", 3, f("JSON.stringify", 4)),
);
const gatewayProfile = f("node.main", 4,
  f("proxy.handle", 12, f("ratelimit.check", 9, f("redis.INCR", 7)), f("route.match", 14), f("upstream.request", 21, f("http.request", 38), f("tls.handshake", 12))),
  f("access.log", 6, f("JSON.stringify", 8)),
);

const slowest = (service: string, route: string, duration: number, extra: Record<string, unknown>) => ({
  traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
  spanId: "00f067aa0ba902b7",
  service,
  name: route,
  startTime: "2026-10-14T14:05:12.284Z",
  durationMs: duration,
  status: { code: duration > 400 ? "error" : "ok", message: duration > 400 ? "deadline exceeded" : null },
  attributes: {
    "http.method": route.split(" ")[0],
    "http.route": route.split(" ")[1],
    "http.status_code": duration > 400 ? 504 : 200,
    "net.peer.ip": "10.4.18.231",
    ...extra,
  },
});

/** A fictional checkout platform with profiles for its services, for demos and tests. */
export const sampleServiceExplorer: ServiceExplorerData = {
  title: "Service explorer",
  description: "Acme Shop checkout platform · production · last 5 minutes",
  nodes: [
    { id: "web", label: "Web", kind: "client", metrics: { rps: 1840, errorRate: 0.002, p95: 182 } },
    { id: "mobile", label: "Mobile", kind: "client", metrics: { rps: 1260, errorRate: 0.003, p95: 214 } },
    { id: "gateway", label: "API gateway", kind: "gateway", group: "edge", metrics: { rps: 3100, errorRate: 0.004, p95: 96 } },
    { id: "auth", label: "Auth", kind: "service", group: "identity", metrics: { rps: 2980, errorRate: 0.001, p95: 12 } },
    { id: "search", label: "Search", kind: "service", group: "discovery", metrics: { rps: 860, errorRate: 0.006, p95: 74 } },
    { id: "catalog", label: "Catalog", kind: "service", group: "discovery", metrics: { rps: 1840, errorRate: 0.002, p95: 38 } },
    { id: "cart", label: "Cart", kind: "service", group: "commerce", metrics: { rps: 610, errorRate: 0.003, p95: 28 } },
    { id: "checkout", label: "Checkout", kind: "service", group: "commerce", metrics: { rps: 124, errorRate: 0.004, p95: 220 } },
    { id: "payments", label: "Payments", kind: "service", group: "commerce", status: "degraded", metrics: { rps: 118, errorRate: 0.012, p95: 340 } },
    { id: "postgres", label: "Postgres", kind: "database", group: "data", metrics: { rps: 1650, errorRate: 0, p95: 6.4 } },
    { id: "redis", label: "Redis", kind: "cache", group: "data", metrics: { rps: 5440, errorRate: 0, p95: 0.8 } },
    { id: "kafka", label: "Kafka", kind: "queue", group: "data", metrics: { rps: 116, errorRate: 0, p95: 3.1 } },
    { id: "payrail", label: "PayRail", kind: "external", metrics: { rps: 116, errorRate: 0.018, p95: 410 } },
  ],
  edges: [
    { source: "web", target: "gateway", rps: 1840, errorRate: 0.002, p95: 182 },
    { source: "mobile", target: "gateway", rps: 1260, errorRate: 0.003, p95: 214 },
    { source: "gateway", target: "auth", rps: 2980, errorRate: 0.001, p95: 12 },
    { source: "gateway", target: "search", rps: 860, errorRate: 0.006, p95: 74 },
    { source: "gateway", target: "catalog", rps: 1420, errorRate: 0.002, p95: 38 },
    { source: "gateway", target: "cart", rps: 490, errorRate: 0.003, p95: 28 },
    { source: "gateway", target: "checkout", rps: 124, errorRate: 0.004, p95: 220 },
    { source: "search", target: "catalog", rps: 420, errorRate: 0.002, p95: 22 },
    { source: "auth", target: "redis", rps: 2980, errorRate: 0, p95: 0.8 },
    { source: "catalog", target: "postgres", rps: 1180, errorRate: 0, p95: 6.2 },
    { source: "catalog", target: "redis", rps: 1640, errorRate: 0, p95: 0.7 },
    { source: "cart", target: "redis", rps: 820, errorRate: 0, p95: 0.6 },
    { source: "checkout", target: "cart", rps: 120, errorRate: 0.002, p95: 18 },
    { source: "checkout", target: "payments", rps: 118, errorRate: 0.012, p95: 340 },
    { source: "checkout", target: "kafka", rps: 116, errorRate: 0, p95: 3.1 },
    { source: "checkout", target: "postgres", rps: 240, errorRate: 0.001, p95: 7.8 },
    { source: "payments", target: "payrail", rps: 116, errorRate: 0.018, p95: 410 },
    { source: "payments", target: "postgres", rps: 230, errorRate: 0, p95: 5.4 },
  ],
  services: {
    gateway: {
      latency: logNormal(2400, 44, 0.55, 3),
      threshold: 150,
      profile: gatewayProfile,
      slowest: slowest("api-gateway", "POST /api/checkout", 248, { "upstream.service": "checkout", "ratelimit.remaining": 412 }),
    },
    auth: {
      latency: logNormal(2400, 5, 0.6, 5),
      threshold: 25,
      profile: authProfile,
      slowest: slowest("auth", "GET /session", 31, { "session.cache": "miss", "jwt.alg": "EdDSA" }),
    },
    search: {
      latency: logNormal(2000, 33, 0.58, 7),
      threshold: 120,
      profile: searchProfile,
      slowest: slowest("search", "GET /search", 186, { "search.query": "linen throw blanket", "search.results": 48, "rerank.model": "rerank-v2" }),
    },
    catalog: {
      latency: logNormal(2400, 16, 0.55, 9),
      threshold: 80,
      profile: catalogProfile,
      slowest: slowest("catalog", "GET /products", 112, { "cache.hit": false, "db.rows": 240, "images.signed": 240 }),
    },
    cart: {
      latency: logNormal(2000, 12, 0.5, 11),
      threshold: 60,
      profile: cartProfile,
      slowest: slowest("cart", "PATCH /cart", 64, { "cart.items": 14, "cache.hit": true }),
    },
    checkout: {
      latency: [...logNormal(1800, 96, 0.5, 13), ...logNormal(300, 320, 0.3, 17)],
      threshold: 400,
      profile: checkoutProfile,
      slowest: slowest("checkout", "POST /api/checkout", 1243, {
        "cart.items": 14,
        "db.queries": 15,
        "payment.provider": "payrail",
        "order.id": "ord_8F3k2Lq",
        timings: { cart: 84, pricing: 962, payments: 118, orders: 61 },
      }),
    },
    payments: {
      latency: [...logNormal(1600, 150, 0.45, 19), ...logNormal(400, 520, 0.3, 23)],
      threshold: 500,
      profile: paymentsProfile,
      slowest: slowest("payments", "POST /authorize", 1980, {
        "payment.provider": "payrail",
        "provider.attempts": 3,
        "provider.status": 504,
        "fraud.score": 0.08,
        retries: [
          { attempt: 1, status: 504, durationMs: 640 },
          { attempt: 2, status: 504, durationMs: 610 },
          { attempt: 3, status: 200, durationMs: 412 },
        ],
      }),
    },
  },
};
