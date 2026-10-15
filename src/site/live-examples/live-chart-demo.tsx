import { LiveChart, useLiveSeries } from "@/registry/overtrue/live-chart";

const LIMIT = 1500;

// A fixed, seeded history keeps the first paint stable; live samples follow.
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function nextRequests(last: number, random: () => number = Math.random) {
  const t = Date.now() / 1000;
  const baseline = 1160 + Math.sin(t / 9) * 90 + Math.sin(t / 3.1) * 35;
  const burst = random() < 0.045 ? 280 + random() * 220 : 0;
  const value = last + (baseline - last) * 0.32 + (random() - 0.5) * 110 + burst;
  return Math.round(Math.max(620, value));
}

const history = (() => {
  const random = seeded(7);
  const values: number[] = [];
  let last = 1120;
  for (let i = 0; i < 60; i++) {
    const wave = 1140 + Math.sin(i / 6) * 95;
    const spike = i === 37 ? 420 : i === 38 ? 220 : 0;
    last = Math.round(last + (wave - last) * 0.4 + (random() - 0.5) * 120 + spike);
    values.push(last);
  }
  return values;
})();

export default function Demo() {
  const data = useLiveSeries({
    initial: history,
    next: (last) => nextRequests(last),
    interval: 1000,
  });

  return (
    <LiveChart
      label="Requests per second"
      unit="req/s"
      data={data}
      interval={1000}
      threshold={LIMIT}
      thresholdLabel="Limit"
      height={168}
      actions={
        <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono">api-gateway · us-east-1</span>
        </span>
      }
    />
  );
}
