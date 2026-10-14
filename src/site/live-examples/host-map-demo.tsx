import { useEffect, useState } from "react";
import { HostMap, type HostMapHost } from "@/registry/overtrue/host-map";

// A small seeded generator keeps the first render identical on every visit.
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const regions = [
  { name: "us-east-1", code: "use1", count: 48 },
  { name: "eu-west-1", code: "euw1", count: 32 },
  { name: "ap-south-1", code: "aps1", count: 24 },
];
const roles = [
  { prefix: "web", load: 0.34 },
  { prefix: "api", load: 0.46 },
  { prefix: "worker", load: 0.58 },
  { prefix: "db", load: 0.4 },
];
// Hosts that are running hot in this snapshot.
const hot: Record<string, number> = {
  "worker-use1-05": 0.95,
  "api-use1-11": 0.83,
  "worker-euw1-03": 0.78,
  "api-aps1-02": 0.92,
  "worker-use1-09": 0.74,
};

type DriftingHost = HostMapHost & { base: number };

function createFleet(): DriftingHost[] {
  const random = seeded(7);
  return regions.flatMap((region) =>
    Array.from({ length: region.count }, (_, i) => {
      const perRole = region.count / roles.length;
      const role = roles[Math.floor(i / perRole)];
      const number = i - Math.floor(i / perRole) * perRole + 1;
      const name = `${role.prefix}-${region.code}-${String(number).padStart(2, "0")}`;
      const base = hot[name] ?? Math.min(0.66, Math.max(0.06, role.load + (random() - 0.5) * 0.36));
      return {
        id: `${region.code}-${i}`,
        name,
        group: region.name,
        base,
        value: base,
        status: name === "db-euw1-08" ? "offline" : undefined,
      } satisfies DriftingHost;
    }),
  );
}

export default function Demo() {
  const [hosts, setHosts] = useState(createFleet);

  useEffect(() => {
    const random = seeded(42);
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setHosts((current) =>
        current.map((host) => {
          if (host.status === "offline") return host;
          const value = host.value ?? host.base;
          // Wander a little, then drift back towards the host's usual load.
          const next = value + (random() - 0.5) * 0.08 + (host.base - value) * 0.3;
          return { ...host, value: Math.min(0.99, Math.max(0.02, next)) };
        }),
      );
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <HostMap
      title="Fleet CPU"
      description="Production hosts by region, refreshed every 2 seconds."
      hosts={hosts}
      metricLabel="CPU"
    />
  );
}
