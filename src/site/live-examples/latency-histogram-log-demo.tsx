import { useState } from "react";
import {
  LatencyHistogram,
  type LatencyRange,
} from "@/registry/overtrue/latency-histogram";

function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cache hits answer in a few milliseconds; misses go to the database and take ~40x longer.
const samples = (() => {
  const random = seeded(23);
  return Array.from({ length: 8000 }, () => {
    const u = Math.max(1e-9, random());
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
    const hit = random() < 0.7;
    return +(hit ? 2.6 * Math.exp(0.42 * z) : 104 * Math.exp(0.5 * z)).toFixed(
      2,
    );
  });
})();

export default function Demo() {
  const [range, setRange] = useState<LatencyRange | null>([0.8, 12]);

  return (
    <div className="flex flex-col gap-3">
      <LatencyHistogram
        title="Product lookup"
        description="Cache hits and misses form two humps. Drag across one to measure it."
        values={samples}
        defaultScale="log"
        percentiles={[50, 90, 99]}
        range={range}
        onRangeChange={setRange}
        colors={{ bar: "var(--color-chart-2)" }}
      />
      <p className="font-mono text-[11px] text-muted-foreground">
        onRangeChange →{" "}
        {range ? `[${range[0].toFixed(1)}, ${range[1].toFixed(1)}]` : "null"}
      </p>
    </div>
  );
}
