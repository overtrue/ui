import { LatencyHistogram } from "@/registry/overtrue/latency-histogram";

// Seeded samples keep the first paint identical on every visit.
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Log-normal request latencies with a slower tail of cold paths. */
function latencies(
  count: number,
  seed: number,
  median: number,
  spread: number,
  tail: number,
  tailMedian: number,
) {
  const random = seeded(seed);
  return Array.from({ length: count }, () => {
    const u = Math.max(1e-9, random());
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
    const slow = random() < tail;
    const value = slow
      ? tailMedian * Math.exp(0.45 * z)
      : median * Math.exp(spread * z);
    return Math.round((value + 8) * 10) / 10;
  });
}

const today = latencies(5000, 7, 160, 0.36, 0.045, 520);
const yesterday = latencies(5000, 11, 148, 0.35, 0.03, 470);

export default function Demo() {
  return (
    <LatencyHistogram
      title="GET /api/orders latency"
      values={today}
      compare={yesterday}
      seriesLabel="Today"
      compareLabel="Yesterday"
      percentiles={[50, 95, 99]}
      threshold={400}
    />
  );
}
