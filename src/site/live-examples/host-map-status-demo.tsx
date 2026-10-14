import { useState } from "react";
import {
  HostMap,
  type HostMapHost,
  type HostStatus,
} from "@/registry/overtrue/host-map";

// Kubernetes nodes across three clusters, with a handful that need attention.
const clusters = [
  { name: "prod-blue", count: 56 },
  { name: "prod-green", count: 40 },
  { name: "staging", count: 22 },
];
const incidents: Record<string, HostStatus> = {
  "prod-blue-07": "warn",
  "prod-blue-19": "critical",
  "prod-blue-20": "warn",
  "prod-blue-41": "offline",
  "prod-green-12": "warn",
  "prod-green-33": "critical",
  "staging-04": "offline",
  "staging-05": "offline",
  "staging-16": "warn",
};

const nodes: HostMapHost[] = clusters.flatMap((cluster) =>
  Array.from({ length: cluster.count }, (_, i) => {
    const name = `${cluster.name}-${String(i + 1).padStart(2, "0")}`;
    return {
      id: name,
      name,
      group: cluster.name,
      status: incidents[name] ?? "ok",
    };
  }),
);

export default function Demo() {
  const [selected, setSelected] = useState<HostMapHost | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <HostMap
        title="Node health"
        description="Kubernetes nodes by cluster. Pick a status below to isolate it."
        hosts={nodes}
        colorBy="status"
        unit={["node", "nodes"]}
        selectedId={selected?.id ?? null}
        onSelect={(node) =>
          setSelected((current) => (current?.id === node.id ? null : node))
        }
      />
      <p role="status" className="px-1 text-xs text-muted-foreground">
        {selected
          ? `${selected.name} selected. Status: ${selected.status}.`
          : "Select a node to pin it for the incident review."}
      </p>
    </div>
  );
}
