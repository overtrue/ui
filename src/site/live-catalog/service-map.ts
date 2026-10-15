export default {
  name: "service-map",
  title: "Service map",
  category: "Operations",
  description:
    "A live dependency map laid out as a layered graph, with traffic flowing along edges sized by request rate and coloured by error rate.",
  dependencies: [],
  imports: "ServiceMap, type ServiceMapEdge, type ServiceMapNode",
  exampleImports: 'import { useState } from "react"',
  usage: `function Example() {
  const [selected, setSelected] = useState<string | null>(null);
  const nodes: ServiceMapNode[] = [
    { id: "web", label: "Web", kind: "client", metrics: { rps: 920, errorRate: 0.002, p95: 140 } },
    { id: "api", label: "API", kind: "gateway", metrics: { rps: 920, errorRate: 0.004, p95: 88 } },
    { id: "orders", label: "Orders", kind: "service", status: "degraded", metrics: { rps: 310, errorRate: 0.031, p95: 420 } },
    { id: "db", label: "Postgres", kind: "database", metrics: { rps: 640, errorRate: 0, p95: 6 } },
  ];
  const edges: ServiceMapEdge[] = [
    { source: "web", target: "api", rps: 920, errorRate: 0.002, p95: 140 },
    { source: "api", target: "orders", rps: 310, errorRate: 0.031, p95: 420 },
    { source: "orders", target: "db", rps: 640, errorRate: 0, p95: 6 },
  ];

  return (
    <ServiceMap
      title="Orders platform"
      nodes={nodes}
      edges={edges}
      selectedId={selected}
      onSelect={(id) => setSelected(id)}
    />
  );
}`,
  notes:
    "Pass nodes and the edges between them; the layout is computed for you. Each node goes in the column of its longest path from a source (edges that would close a cycle are drawn backwards), the order within a column is refined with barycentre sweeps to remove crossings, and edges that skip a column are routed through it so they never cut across a card. The map fills the container width with a ResizeObserver: columns spread out up to a comfortable gap, then the whole map scales down to `minScale`, and below that it scrolls sideways inside the card. With `density=\"auto\"` it switches to compact icon tiles with labels when full cards would get too small to read, which is what you see on phones and in narrow panels. Edge width follows rps and colour follows error rate: muted below `thresholds.warn` (1%), amber above it, destructive above `thresholds.critical` (5%); `status` on an edge overrides the rate. Error rates are 0–1 fractions. Traffic particles move along every edge with density and speed following rps, and glow in dark mode; under reduced motion, or with `animate={false}`, they become static dots. Hover or focus a node to light its whole upstream and downstream path, or hover an edge for its rps, error rate and p95. Clicking selects a node and lists its inbound and outbound traffic; rows there highlight their edge and select the service at the other end. Nodes are buttons in column order, and arrow keys move across and within columns, while Escape clears the selection. `renderNode` replaces card content and receives status, layer, formatted metrics, edges and state. Parts expose `data-slot` attributes such as `service-map-node` (with `data-status`, `data-kind`, `data-active`) and `service-map-edge` (with `data-severity`).",
  previewWidth: 760,
  examples: [
    {
      name: "service-map-demo",
      title: "Checkout platform",
      description:
        "Web and mobile clients through an API gateway to seven services, Postgres, Redis, Kafka and an external payment provider. Hover a service to trace its path; the payment provider runs slightly hot.",
    },
    {
      name: "service-map-incident-demo",
      title: "Payments incident",
      description:
        "The ledger database is down and Payments is degraded. Failing traffic turns red all the way up to the clients, and Payments starts selected with its inbound and outbound calls listed.",
    },
  ],
  api: [
    [
      "nodes",
      '{ id: string; label: string; kind?: "client" | "gateway" | "service" | "database" | "cache" | "queue" | "external"; status?: "healthy" | "degraded" | "down"; metrics?: { rps?; errorRate?; p95? }; group?: string; icon?: React.ReactNode }[]',
      "Services. kind picks the icon; status defaults to healthy, or degraded when the error rate crosses the critical threshold.",
    ],
    [
      "edges",
      '{ id?: string; source: string; target: string; rps?: number; errorRate?: number; p95?: number; status?: ServiceStatus }[]',
      "Calls from source to target. errorRate is a 0–1 fraction and p95 is in milliseconds.",
    ],
    ["direction?", '"LR" | "TB"', "Flow left to right or top to bottom. Defaults to LR."],
    [
      "selectedId? / defaultSelectedId?",
      "string | null",
      "The service whose detail is shown. Pass selectedId to control it.",
    ],
    [
      "onSelect?",
      "(id: string | null, node: ServiceMapNode | null) => void",
      "Called when a service is selected, or with null when the selection clears.",
    ],
    [
      "thresholds?",
      "{ warn?: number; critical?: number }",
      "Error rates at which traffic turns amber and destructive. Defaults to 0.01 and 0.05.",
    ],
    [
      "rpsFormatter? / latencyFormatter? / errorRateFormatter?",
      "(value: number) => string",
      'Format metrics on cards, readouts and the detail. Defaults give "1.8k rps", "182 ms" and "1.2%".',
    ],
    [
      "renderNode?",
      "(node: ServiceMapNode, info: ServiceMapNodeInfo) => React.ReactNode",
      "Replaces card content in comfortable density. info has kind, status, layer, inbound, outbound, active, selected, dimmed, formatted and icon.",
    ],
    [
      "density?",
      '"auto" | "comfortable" | "compact"',
      "Full cards with a metrics line, or icon tiles with labels and a hover readout. auto picks compact in narrow containers.",
    ],
    ["animate?", "boolean", "Animate traffic along the edges. Defaults to true; reduced motion always shows static dots."],
    ["nodeWidth? / nodeHeight?", "number", "Card size before scaling. Defaults to 148 × 60."],
    [
      "minScale?",
      "number",
      "Smallest scale used to fit the container; below it the map scrolls sideways. Defaults to 0.5.",
    ],
    ["showLegend?", "boolean", "Show the traffic legend. Defaults to true."],
    ["title? / description?", "React.ReactNode", "Card heading and supporting text, beside a health summary."],
    ["actions?", "React.ReactNode", "Controls at the top right."],
    ["className?", "string", "Additional classes for the card. Other div props go to the root."],
  ],
} as const;
