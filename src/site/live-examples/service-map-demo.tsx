import { IconBrowser, IconDeviceMobile } from "@tabler/icons-react";

import {
  ServiceMap,
  type ServiceMapEdge,
  type ServiceMapNode,
} from "@/registry/overtrue/service-map";

// Acme Shop's checkout platform over the last five minutes.
const nodes: ServiceMapNode[] = [
  { id: "web", label: "Web", kind: "client", icon: <IconBrowser />, metrics: { rps: 1840, errorRate: 0.002, p95: 182 } },
  { id: "mobile", label: "Mobile", kind: "client", icon: <IconDeviceMobile />, metrics: { rps: 1260, errorRate: 0.003, p95: 214 } },
  { id: "gateway", label: "API gateway", kind: "gateway", group: "edge", metrics: { rps: 3100, errorRate: 0.004, p95: 96 } },
  { id: "auth", label: "Auth", kind: "service", group: "identity", metrics: { rps: 2980, errorRate: 0.001, p95: 12 } },
  { id: "search", label: "Search", kind: "service", group: "discovery", metrics: { rps: 860, errorRate: 0.006, p95: 74 } },
  { id: "catalog", label: "Catalog", kind: "service", group: "discovery", metrics: { rps: 1840, errorRate: 0.002, p95: 38 } },
  { id: "cart", label: "Cart", kind: "service", group: "commerce", metrics: { rps: 610, errorRate: 0.003, p95: 28 } },
  { id: "checkout", label: "Checkout", kind: "service", group: "commerce", metrics: { rps: 124, errorRate: 0.004, p95: 220 } },
  { id: "payments", label: "Payments", kind: "service", group: "commerce", metrics: { rps: 118, errorRate: 0.012, p95: 340 } },
  { id: "postgres", label: "Postgres", kind: "database", group: "data", metrics: { rps: 1650, errorRate: 0, p95: 6.4 } },
  { id: "redis", label: "Redis", kind: "cache", group: "data", metrics: { rps: 5440, errorRate: 0, p95: 0.8 } },
  { id: "kafka", label: "Kafka", kind: "queue", group: "data", metrics: { rps: 116, errorRate: 0, p95: 3.1 } },
  { id: "payrail", label: "PayRail", kind: "external", metrics: { rps: 116, errorRate: 0.018, p95: 410 } },
];

const edges: ServiceMapEdge[] = [
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
];

export default function ServiceMapDemo() {
  return (
    <ServiceMap
      title="Checkout platform"
      description="Live traffic, last 5 minutes"
      nodes={nodes}
      edges={edges}
    />
  );
}
