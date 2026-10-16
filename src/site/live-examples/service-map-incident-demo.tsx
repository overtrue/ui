import { IconBrowser, IconDeviceMobile } from "@tabler/icons-react";

import {
  ServiceMap,
  type ServiceMapEdge,
  type ServiceMapNode,
} from "@/registry/overtrue/service-map";

// The ledger database stopped accepting connections at 14:02. Payments retries, then
// times out, and the failures surface all the way up to the clients.
const nodes: ServiceMapNode[] = [
  { id: "web", label: "Web", kind: "client", icon: <IconBrowser />, metrics: { rps: 1790, errorRate: 0.034, p95: 1240 } },
  { id: "mobile", label: "Mobile", kind: "client", icon: <IconDeviceMobile />, metrics: { rps: 1210, errorRate: 0.029, p95: 1380 } },
  { id: "gateway", label: "API gateway", kind: "gateway", group: "edge", metrics: { rps: 3000, errorRate: 0.031, p95: 860 } },
  { id: "auth", label: "Auth", kind: "service", group: "identity", metrics: { rps: 2890, errorRate: 0.001, p95: 13 } },
  { id: "cart", label: "Cart", kind: "service", group: "commerce", metrics: { rps: 580, errorRate: 0.002, p95: 31 } },
  { id: "checkout", label: "Checkout", kind: "service", group: "commerce", status: "degraded", metrics: { rps: 131, errorRate: 0.142, p95: 4100 } },
  { id: "payments", label: "Payments", kind: "service", group: "commerce", status: "degraded", metrics: { rps: 126, errorRate: 0.213, p95: 5200 } },
  { id: "ledger", label: "Ledger DB", kind: "database", group: "payments-data", status: "down", metrics: { rps: 41, errorRate: 0.64, p95: 5000 } },
  { id: "redis", label: "Redis", kind: "cache", group: "data", metrics: { rps: 3460, errorRate: 0, p95: 0.9 } },
  { id: "kafka", label: "Kafka", kind: "queue", group: "data", metrics: { rps: 98, errorRate: 0, p95: 3.4 } },
  { id: "payrail", label: "PayRail", kind: "external", metrics: { rps: 22, errorRate: 0.004, p95: 380 } },
];

const edges: ServiceMapEdge[] = [
  { source: "web", target: "gateway", rps: 1790, errorRate: 0.034, p95: 1240 },
  { source: "mobile", target: "gateway", rps: 1210, errorRate: 0.029, p95: 1380 },
  { source: "gateway", target: "auth", rps: 2890, errorRate: 0.001, p95: 13 },
  { source: "gateway", target: "cart", rps: 460, errorRate: 0.002, p95: 31 },
  { source: "gateway", target: "checkout", rps: 131, errorRate: 0.142, p95: 4100 },
  { source: "auth", target: "redis", rps: 2890, errorRate: 0, p95: 0.9 },
  { source: "cart", target: "redis", rps: 570, errorRate: 0, p95: 0.7 },
  { source: "checkout", target: "cart", rps: 120, errorRate: 0.002, p95: 22 },
  { source: "checkout", target: "payments", rps: 126, errorRate: 0.213, p95: 5200 },
  { source: "checkout", target: "kafka", rps: 98, errorRate: 0, p95: 3.4 },
  { source: "payments", target: "ledger", rps: 41, errorRate: 0.64, p95: 5000, status: "down" },
  { source: "payments", target: "payrail", rps: 22, errorRate: 0.004, p95: 380 },
];

export default function ServiceMapIncidentDemo() {
  return (
    <ServiceMap
      title="Checkout platform"
      description="Incident 2291 · ledger database unreachable since 14:02"
      nodes={nodes}
      edges={edges}
      defaultSelectedId="payments"
      thresholds={{ warn: 0.01, critical: 0.05 }}
    />
  );
}
