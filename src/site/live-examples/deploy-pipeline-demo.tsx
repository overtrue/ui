import { useCallback, useEffect, useState } from "react";
import { IconGitBranch, IconGitCommit } from "@tabler/icons-react";
import {
  DeployPipeline,
  type PipelineJob,
  type PipelineStage,
  type PipelineStatus,
} from "@/registry/overtrue/deploy-pipeline";

// Each job runs for `sim` ms in the demo but reports a realistic `real` wall time.
// The run plays as a time-lapse: a running job's timer counts from 0 to `real`.
interface Spec {
  id: string;
  label: string;
  sim: number;
  real: number;
  detail: string;
  /** First attempt fails after this many ms with this wall time. */
  flaky?: { sim: number; real: number; detail: string };
}

const STAGES: { id: string; label: string; jobs: Spec[] }[] = [
  {
    id: "build",
    label: "Build",
    jobs: [
      {
        id: "compile",
        label: "Compile",
        sim: 3800,
        real: 72_400,
        detail: "ubuntu-24.04 · 8 vCPU · cache hit (412 MB)",
      },
    ],
  },
  {
    id: "test",
    label: "Test",
    jobs: [
      {
        id: "unit",
        label: "Unit",
        sim: 3000,
        real: 48_200,
        detail: "1,284 tests in 38 files · 0 failed",
      },
      {
        id: "e2e",
        label: "E2E",
        sim: 4200,
        real: 178_600,
        detail: "Passed on attempt 2 · 46 specs · 3 shards",
        flaky: {
          sim: 3400,
          real: 161_300,
          detail:
            "checkout.spec.ts › applies coupon at payment\nTimeoutError: locator.click: Timeout 30000ms exceeded",
        },
      },
      {
        id: "lint",
        label: "Lint",
        sim: 1500,
        real: 21_700,
        detail: "eslint · tsc --noEmit · 0 problems",
      },
    ],
  },
  {
    id: "security",
    label: "Security scan",
    jobs: [
      {
        id: "audit",
        label: "Audit",
        sim: 2400,
        real: 34_100,
        detail: "0 critical · 2 moderate (allowlisted)",
      },
    ],
  },
  {
    id: "preview",
    label: "Deploy preview",
    jobs: [
      {
        id: "preview",
        label: "Preview",
        sim: 3000,
        real: 56_800,
        detail: "https://pr-1284.preview.acme.dev",
      },
    ],
  },
  {
    id: "production",
    label: "Deploy production",
    jobs: [
      {
        id: "production",
        label: "Production",
        sim: 3800,
        real: 84_300,
        detail: "6 of 6 instances healthy · web.acme.example",
      },
    ],
  },
];

const COMMITS = [
  {
    sha: "4f9c2ab",
    message: "Cache invoice PDFs at the edge",
    author: "jonas",
  },
  {
    sha: "b81e07d",
    message: "Fix rounding in checkout totals",
    author: "mira",
  },
  {
    sha: "e3a5c19",
    message: "Move image resizing to a worker",
    author: "lena",
  },
];

const AUTO_RETRY = 3200;
const HOLD = 4500;

interface JobState {
  status: PipelineStatus;
  start?: number;
  end?: number;
  attempt: number;
}
interface Sim {
  run: number;
  t: number;
  jobs: Record<string, JobState>;
  doneAt?: number;
}

const fresh = (run: number): Sim => ({
  run,
  t: 0,
  jobs: Object.fromEntries(
    STAGES.flatMap((stage) =>
      stage.jobs.map((job) => [job.id, { status: "queued", attempt: 1 }]),
    ),
  ),
});

function advance(sim: Sim, dt: number): Sim {
  const t = sim.t + dt;
  if (sim.doneAt !== undefined)
    return t - sim.doneAt > HOLD ? fresh(sim.run + 1) : { ...sim, t };
  const jobs = { ...sim.jobs };
  for (const stage of STAGES) {
    const states = stage.jobs.map((job) => jobs[job.id]);
    if (states.every((state) => state.status === "success")) continue;
    for (const job of stage.jobs) {
      const state = jobs[job.id];
      const failing = job.flaky && state.attempt === 1;
      if (state.status === "queued")
        jobs[job.id] = { ...state, status: "running", start: t };
      else if (
        state.status === "running" &&
        t - state.start! >= (failing ? job.flaky!.sim : job.sim)
      )
        jobs[job.id] = {
          ...state,
          status: failing ? "failed" : "success",
          end: t,
        };
      else if (state.status === "failed" && t - state.end! >= AUTO_RETRY)
        jobs[job.id] = {
          status: "running",
          start: t,
          attempt: state.attempt + 1,
        };
    }
    break;
  }
  const done = Object.values(jobs).every((state) => state.status === "success");
  return { ...sim, t, jobs, doneAt: done ? t : undefined };
}

// Open mid-run: the build has finished and the tests are under way.
function seed(): Sim {
  let sim = fresh(0);
  for (let i = 0; i < 52; i++) sim = advance(sim, 100);
  return sim;
}

function toStages(sim: Sim, offset: number): PipelineStage[] {
  return STAGES.map((stage) => ({
    id: stage.id,
    label: stage.label,
    jobs: stage.jobs.map((spec): PipelineJob => {
      const state = sim.jobs[spec.id];
      const flaky = spec.flaky && state.attempt === 1 ? spec.flaky : null;
      const run = flaky ?? spec;
      return {
        id: spec.id,
        label: spec.label,
        status: state.status,
        duration:
          state.status === "success" || state.status === "failed"
            ? run.real
            : undefined,
        // Back-date the start so the component's live timer shows the scaled elapsed time.
        startedAt:
          state.status === "running" && state.start !== undefined
            ? offset + sim.t - ((sim.t - state.start) * run.real) / run.sim
            : undefined,
        detail:
          state.status === "queued"
            ? undefined
            : state.status === "running"
              ? undefined
              : run.detail,
      };
    }),
  }));
}

export default function Demo() {
  // `zero` is the wall-clock time at sim t = 0. It only moves when the demo pauses,
  // so running timers tick smoothly between updates.
  const [{ sim, zero }, setState] = useState(() => {
    const sim = seed();
    return { sim, zero: Date.now() - sim.t };
  });

  useEffect(() => {
    let last = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const dt = now - last;
      last = now;
      // Pause while hidden instead of fast-forwarding through the run.
      if (document.hidden)
        return setState((current) => ({ ...current, zero: current.zero + dt }));
      const step = Math.min(dt, 400);
      setState((current) => {
        const next = advance(current.sim, step);
        return {
          sim: next,
          zero:
            next.run !== current.sim.run
              ? now - next.t
              : current.zero + (dt - step),
        };
      });
    }, 200);
    return () => window.clearInterval(timer);
  }, []);

  const retry = useCallback((job: PipelineJob) => {
    setState((current) => {
      const state = current.sim.jobs[job.id];
      if (state?.status !== "failed") return current;
      return {
        ...current,
        sim: {
          ...current.sim,
          jobs: {
            ...current.sim.jobs,
            [job.id]: {
              status: "running",
              start: current.sim.t,
              attempt: state.attempt + 1,
            },
          },
        },
      };
    });
  }, []);

  const commit = COMMITS[sim.run % COMMITS.length];
  const stages = toStages(sim, zero);

  return (
    <DeployPipeline
      title={
        <>
          web{" "}
          <span className="font-normal text-muted-foreground">
            #{1284 + sim.run}
          </span>
        </>
      }
      meta={
        <span className="flex max-w-full min-w-0 items-center gap-3">
          <span className="inline-flex shrink-0 items-center gap-1">
            <IconGitBranch className="size-3.5" aria-hidden="true" />
            main
          </span>
          <span className="inline-flex min-w-0 items-center gap-1">
            <IconGitCommit className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="font-mono text-foreground">{commit.sha}</span>
            <span className="truncate">{commit.message}</span>
          </span>
        </span>
      }
      stages={stages}
      onRetry={retry}
    />
  );
}
