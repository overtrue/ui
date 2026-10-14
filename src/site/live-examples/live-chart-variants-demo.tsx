import { useState } from "react";
import {
  IconPlayerPause as Pause,
  IconPlayerPlay as Play,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { LiveChart, useLiveSeries } from "@/registry/overtrue/live-chart";

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function series(length: number, seed: number, step: (last: number, i: number, random: () => number) => number, start: number) {
  const random = seeded(seed);
  const values: number[] = [];
  let last = start;
  for (let i = 0; i < length; i++) values.push((last = step(last, i, random)));
  return values;
}

// p95 latency drifts around 180 ms with the occasional slow burst past the 250 ms objective.
function nextLatency(last: number, _i = 0, random: () => number = Math.random) {
  const slow = random() < 0.035 ? 55 + random() * 55 : 0;
  return Math.round(Math.max(96, last + (178 - last) * 0.3 + (random() - 0.5) * 34 + slow));
}

// Workers drain a queue in uneven batches.
function nextJobs(last: number, _i = 0, random: () => number = Math.random) {
  const batch = random() < 0.18 ? 18 + random() * 22 : 0;
  return Math.round(Math.max(4, last + (34 - last) * 0.45 + (random() - 0.5) * 16 + batch));
}

const latencyHistory = series(60, 11, (last, i, random) => (i === 41 ? 286 : nextLatency(last, i, random)), 176);
const jobsHistory = series(36, 5, nextJobs, 30);

export default function Demo() {
  const [paused, setPaused] = useState(false);
  const latency = useLiveSeries({ initial: latencyHistory, next: nextLatency, paused });
  const jobs = useLiveSeries({ initial: jobsHistory, next: nextJobs, paused });

  return (
    <div className="@container flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-mono text-foreground">checkout-service</span> · production
        </p>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          {paused ? "Resume" : "Pause"}
        </Button>
      </div>
      <div className="grid gap-4 @2xl:grid-cols-2">
        <LiveChart
          variant="line"
          label="p95 latency"
          unit="ms"
          data={latency}
          interval={1000}
          threshold={250}
          thresholdLabel="SLO"
          color="var(--color-chart-4)"
          height={140}
        />
        <LiveChart
          variant="bars"
          label="Jobs processed"
          unit="jobs/s"
          data={jobs}
          interval={1000}
          color="var(--color-chart-2)"
          height={140}
        />
      </div>
    </div>
  );
}
