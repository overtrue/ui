import {
  TraceSpanAttributes,
  TraceWaterfall,
  type TraceSpan,
} from "@/registry/overtrue/trace-waterfall";

const spans: TraceSpan[] = [
  {
    id: "edge",
    service: "edge",
    name: "GET /api/search",
    start: 0,
    duration: 486.2,
    attributes: {
      "http.route": "/api/search",
      "http.status_code": 200,
      "search.query": "linen shirt",
    },
  },
  {
    id: "auth",
    parentId: "edge",
    service: "edge",
    name: "token.introspect",
    start: 2.1,
    duration: 8.4,
    attributes: { "token.scope": "catalog:read" },
  },
  {
    id: "api",
    parentId: "edge",
    service: "search-api",
    name: "search.execute",
    start: 12.6,
    duration: 462.8,
    attributes: { "search.page": 1, "search.page_size": 24 },
  },
  {
    id: "cache",
    parentId: "api",
    service: "redis",
    name: "GET search:linen-shirt:p1",
    start: 13.4,
    duration: 1.9,
    attributes: { "db.system": "redis", "cache.hit": false },
  },
  {
    id: "parse",
    parentId: "api",
    service: "search-api",
    name: "query.parse",
    start: 16.2,
    duration: 12.6,
    attributes: { "query.tokens": 2, "query.synonyms": 3 },
  },
  {
    id: "es",
    parentId: "api",
    service: "elasticsearch",
    name: "POST /products/_search",
    start: 30.4,
    duration: 352.6,
    attributes: {
      "db.system": "elasticsearch",
      "db.operation": "search",
      "es.index": "products-v7",
      "es.shards.total": 6,
      "es.shards.slow": 1,
      "es.hits": 1284,
      "es.took_ms": 349,
    },
  },
  {
    id: "recs",
    parentId: "api",
    service: "recommendations",
    name: "recs.personalize",
    start: 31.2,
    duration: 96.4,
    attributes: { "recs.model": "two-tower-v3", "recs.candidates": 200 },
  },
  {
    id: "recs-fs",
    parentId: "recs",
    service: "redis",
    name: "MGET features:u_8812",
    start: 33.8,
    duration: 4.2,
    attributes: { "db.system": "redis", "cache.hit": true },
  },
  {
    id: "recs-score",
    parentId: "recs",
    service: "recommendations",
    name: "model.score",
    start: 39.6,
    duration: 84.6,
    attributes: { "model.batch": 200, "model.device": "cpu" },
  },
  {
    id: "rank",
    parentId: "api",
    service: "search-api",
    name: "results.rerank",
    start: 384.8,
    duration: 52.4,
    attributes: { "rerank.items": 24 },
  },
  {
    id: "price",
    parentId: "api",
    service: "search-api",
    name: "prices.attach",
    start: 438.6,
    duration: 30.2,
    attributes: { "price.items": 24 },
  },
  {
    id: "price-db",
    parentId: "price",
    service: "postgres",
    name: "SELECT prices",
    start: 440.2,
    duration: 26.4,
    attributes: { "db.system": "postgresql", "db.rows": 24 },
  },
  {
    id: "cache-set",
    parentId: "api",
    service: "redis",
    name: "SETEX search:linen-shirt:p1",
    start: 469.6,
    duration: 2.4,
    attributes: { "db.system": "redis", "cache.ttl_s": 120 },
  },
  {
    id: "render",
    parentId: "edge",
    service: "edge",
    name: "response.encode",
    start: 476.4,
    duration: 8.8,
    attributes: { "http.response_content_length": 18342 },
  },
];

// Span events live outside the trace model; renderDetail can show anything you keep.
const events: Record<string, { at: number; message: string; tone?: "warn" }[]> =
  {
    es: [
      { at: 0.6, message: "query rewritten with 3 synonyms" },
      { at: 41.2, message: "shards 0–4 returned 1,102 hits" },
      {
        at: 338.9,
        message: "shard 5 replied after GC pause (297ms)",
        tone: "warn",
      },
      { at: 351.8, message: "merged and sorted 1,284 hits" },
    ],
  };

export default function Demo() {
  return (
    <TraceWaterfall
      title="GET /api/search"
      description="A slow search query. The Elasticsearch span is selected and shows its span events."
      spans={spans}
      defaultSelectedId="es"
      height={300}
      renderDetail={(span, info) => (
        <div className="grid gap-4 @lg/trace:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="mb-2 text-xs font-medium">Span events</p>
            {events[span.id]?.length ? (
              <ol className="relative space-y-2 border-l pl-3">
                {events[span.id].map((event) => (
                  <li key={event.at} className="relative text-xs">
                    <span
                      aria-hidden="true"
                      className={
                        event.tone === "warn"
                          ? "absolute top-1 -left-[16.5px] size-2 rounded-full bg-amber-500 ring-2 ring-card"
                          : "absolute top-1 -left-[16.5px] size-2 rounded-full ring-2 ring-card"
                      }
                      style={
                        event.tone === "warn"
                          ? undefined
                          : { background: info.color }
                      }
                    />
                    <span className="mr-2 font-mono text-[11px] text-muted-foreground tabular-nums">
                      +{event.at.toFixed(1)}ms
                    </span>
                    <span
                      className={
                        event.tone === "warn"
                          ? "text-amber-700 dark:text-amber-400"
                          : undefined
                      }
                    >
                      {event.message}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-muted-foreground">
                No events on this span.
              </p>
            )}
          </div>
          <div>
            <p className="mb-1 text-xs font-medium">Attributes</p>
            <TraceSpanAttributes attributes={span.attributes} />
          </div>
        </div>
      )}
    />
  );
}
