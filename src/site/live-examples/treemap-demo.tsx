import { Treemap, type TreemapNode } from "@/registry/overtrue/treemap";

const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Acme Studio's infrastructure bill for September, by service.
const spend: TreemapNode[] = [
  {
    id: "compute",
    label: "Compute",
    children: [
      {
        id: "kubernetes",
        label: "Kubernetes nodes",
        children: [
          { id: "k8s-prod-us", label: "prod-us-east", value: 7940 },
          { id: "k8s-prod-eu", label: "prod-eu-west", value: 4310 },
          { id: "k8s-staging", label: "staging", value: 1680 },
          { id: "k8s-preview", label: "preview envs", value: 890 },
        ],
      },
      {
        id: "render",
        label: "Render farm",
        children: [
          { id: "render-gpu", label: "On-demand GPU", value: 6120 },
          { id: "render-spot", label: "Spot GPU", value: 3520 },
        ],
      },
      { id: "web", label: "Web servers", value: 4210 },
      { id: "batch", label: "Batch workers", value: 2380 },
      { id: "edge", label: "Edge functions", value: 1120 },
    ],
  },
  {
    id: "ai",
    label: "AI inference",
    children: [
      { id: "ai-image", label: "Image generation", value: 8420 },
      { id: "ai-llm", label: "Language models", value: 6180 },
      { id: "ai-embed", label: "Embeddings", value: 1940 },
      { id: "ai-speech", label: "Speech to text", value: 760 },
    ],
  },
  {
    id: "data",
    label: "Data",
    children: [
      { id: "data-postgres", label: "Postgres clusters", value: 4980 },
      { id: "data-warehouse", label: "Warehouse", value: 3620 },
      { id: "data-redis", label: "Redis", value: 1280 },
      { id: "data-search", label: "Search", value: 1060 },
      { id: "data-stream", label: "Event streaming", value: 890 },
    ],
  },
  {
    id: "storage",
    label: "Storage",
    children: [
      { id: "storage-object", label: "Object storage", value: 5860 },
      { id: "storage-block", label: "Block volumes", value: 2140 },
      { id: "storage-backup", label: "Backups & archive", value: 1730 },
      { id: "storage-files", label: "File shares", value: 640 },
    ],
  },
  {
    id: "network",
    label: "Network",
    children: [
      { id: "net-cdn", label: "CDN egress", value: 4360 },
      { id: "net-lb", label: "Load balancers", value: 1420 },
      { id: "net-transfer", label: "Inter-region", value: 1180 },
      { id: "net-nat", label: "NAT gateways", value: 980 },
      { id: "net-dns", label: "DNS", value: 120 },
    ],
  },
];

export default function TreemapDemo() {
  return (
    <Treemap
      title="Cloud spend"
      description="Acme Studio infrastructure, September"
      data={spend}
      rootLabel="All services"
      maxDepth={2}
      height="clamp(232px, 60cqw, 380px)"
      valueFormatter={(value, context) =>
        context === "tile" ? usdCompact.format(value) : usd.format(value)
      }
    />
  );
}
