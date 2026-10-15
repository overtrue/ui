import { useEffect, useRef, useState } from "react";
import { IconGitBranch, IconGitCommit, IconRefresh } from "@tabler/icons-react";
import {
  DeployPipeline,
  type PipelineJob,
  type PipelineStage,
} from "@/registry/overtrue/deploy-pipeline";

type Line = {
  time: string;
  text: string;
  tone?: "error" | "muted" | "success";
};

const LOGS: Record<string, Line[]> = {
  compile: [
    {
      time: "12:01:02.118",
      text: "pnpm install --frozen-lockfile",
      tone: "muted",
    },
    { time: "12:01:09.540", text: "Restored build cache · 318 MB" },
    { time: "12:02:31.006", text: "tsc -b · 0 errors" },
    {
      time: "12:02:33.412",
      text: "Build completed in 1m 31s",
      tone: "success",
    },
  ],
  image: [
    {
      time: "12:01:02.300",
      text: "docker buildx build --platform linux/amd64,linux/arm64",
      tone: "muted",
    },
    { time: "12:02:58.771", text: "Exported layers · 6 cached, 2 rebuilt" },
    {
      time: "12:03:06.019",
      text: "Pushed registry.acme.internal/api:7d1e3fa",
      tone: "success",
    },
  ],
  unit: [
    { time: "12:03:08.201", text: "vitest run --coverage", tone: "muted" },
    {
      time: "12:03:59.640",
      text: "Tests 642 passed (642) · coverage 87.4%",
      tone: "success",
    },
  ],
  integration: [
    {
      time: "12:03:08.204",
      text: "pnpm test:integration --shard=2/3",
      tone: "muted",
    },
    {
      time: "12:03:09.882",
      text: "Using postgres://ci@localhost:5432/api_test",
    },
    {
      time: "12:03:41.310",
      text: "✓ invoices › creates a draft invoice (412 ms)",
    },
    {
      time: "12:03:52.771",
      text: "✓ invoices › applies regional tax rules (1.2 s)",
    },
    {
      time: "12:04:44.093",
      text: "✕ payouts › settles a batch after the webhook (30.0 s)",
      tone: "error",
    },
    {
      time: "12:04:44.094",
      text: "  Error: expected status 200, received 504",
      tone: "error",
    },
    {
      time: "12:04:44.094",
      text: "    at settleBatch (src/payouts/settle.ts:88:13)",
      tone: "muted",
    },
    {
      time: "12:05:12.660",
      text: "✕ payouts › retries a failed transfer (8.1 s)",
      tone: "error",
    },
    { time: "12:06:20.402", text: "Tests 2 failed, 316 passed (318)" },
    { time: "12:06:20.415", text: "Process exited with code 1", tone: "error" },
  ],
  contract: [
    { time: "12:03:08.390", text: "pact verify --provider api", tone: "muted" },
    {
      time: "12:04:16.115",
      text: "Verified 24 interactions with 3 consumers",
      tone: "success",
    },
  ],
  diff: [
    {
      time: "12:06:20.900",
      text: "Canceled because Integration failed",
      tone: "muted",
    },
  ],
  staging: [
    { time: "—", text: "Skipped: an earlier stage failed", tone: "muted" },
  ],
  production: [
    { time: "—", text: "Skipped: an earlier stage failed", tone: "muted" },
  ],
};

const RUN: PipelineStage[] = [
  {
    id: "build",
    label: "Build",
    jobs: [
      {
        id: "compile",
        label: "Compile",
        status: "success",
        duration: 91_300,
        detail: "node 22 · cache hit",
      },
      {
        id: "image",
        label: "Image",
        status: "success",
        duration: 124_100,
        detail: "amd64 + arm64",
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
        status: "success",
        duration: 51_400,
        detail: "642 tests",
      },
      {
        id: "integration",
        label: "Integration",
        status: "failed",
        duration: 192_200,
        detail: "2 of 318 failed",
      },
      {
        id: "contract",
        label: "Contract",
        status: "success",
        duration: 68_000,
        detail: "3 consumers",
      },
    ],
  },
  {
    id: "migrate",
    label: "Migrate",
    jobs: [
      {
        id: "diff",
        label: "Schema diff",
        status: "canceled",
        detail: "Blocked by Test",
      },
    ],
  },
  {
    id: "deploy",
    label: "Deploy",
    jobs: [
      { id: "staging", label: "Staging", status: "skipped" },
      { id: "production", label: "Production", status: "skipped" },
    ],
  },
];

// After a retry the failed job reruns, then the rest of the run finishes.
const RERUN: { id: string; after: number; duration: number }[] = [
  { id: "integration", after: 2600, duration: 186_900 },
  { id: "diff", after: 1600, duration: 22_400 },
  { id: "staging", after: 1800, duration: 48_100 },
  { id: "production", after: 2000, duration: 71_600 },
];

function patch(
  stages: PipelineStage[],
  id: string,
  next: Partial<PipelineJob>,
) {
  return stages.map((stage) => ({
    ...stage,
    jobs: stage.jobs.map((job) => (job.id === id ? { ...job, ...next } : job)),
  }));
}

function JobLog({ job }: { job: PipelineJob }) {
  const lines = LOGS[job.id] ?? [];
  if (job.status === "running")
    return (
      <p className="font-mono text-[11px] leading-5 text-muted-foreground">
        Streaming logs…
      </p>
    );
  return (
    <ol className="-mx-1 max-h-56 overflow-auto font-mono text-[11px] leading-5">
      {lines.map((line, index) => (
        <li
          key={index}
          className={
            line.tone === "error"
              ? "flex gap-3 rounded-sm bg-destructive/8 px-1 text-destructive"
              : "flex gap-3 px-1"
          }
        >
          <span className="w-4 shrink-0 text-right text-muted-foreground/60 tabular-nums select-none">
            {index + 1}
          </span>
          <span className="hidden shrink-0 text-muted-foreground tabular-nums sm:inline">
            {line.time}
          </span>
          <span
            className={
              line.tone === "muted"
                ? "min-w-0 break-words whitespace-pre-wrap text-muted-foreground"
                : line.tone === "success"
                  ? "min-w-0 break-words whitespace-pre-wrap text-emerald-700 dark:text-emerald-400"
                  : "min-w-0 break-words whitespace-pre-wrap"
            }
          >
            {line.text}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function Demo() {
  const [stages, setStages] = useState(RUN);
  const [selected, setSelected] = useState<string | null>("integration");
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => timers.current.forEach((timer) => window.clearTimeout(timer)),
    [],
  );

  const rerun = () => {
    if (timers.current.length) return;
    let at = 0;
    RERUN.forEach(({ id, after, duration }, index) => {
      timers.current.push(
        window.setTimeout(() => {
          setStages((current) =>
            patch(current, id, {
              status: "running",
              duration: undefined,
              startedAt: Date.now() - (duration - after),
            }),
          );
        }, at),
      );
      at += after;
      timers.current.push(
        window.setTimeout(() => {
          setStages((current) =>
            patch(current, id, {
              status: "success",
              duration,
              startedAt: undefined,
              detail: index === 0 ? "318 passed on retry" : undefined,
            }),
          );
        }, at),
      );
    });
    setStages((current) =>
      RERUN.reduce(
        (next, { id }) =>
          patch(next, id, { status: "queued", detail: undefined }),
        current,
      ),
    );
  };

  return (
    <DeployPipeline
      className="mx-auto max-w-lg"
      orientation="vertical"
      title="api · release/2.4"
      meta={
        <span className="flex max-w-full min-w-0 items-center gap-3">
          <span className="inline-flex shrink-0 items-center gap-1">
            <IconGitBranch className="size-3.5" aria-hidden="true" />
            release/2.4
          </span>
          <span className="inline-flex min-w-0 items-center gap-1">
            <IconGitCommit className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="font-mono text-foreground">7d1e3fa</span>
            <span className="truncate">Batch payouts by currency</span>
          </span>
        </span>
      }
      actions={
        <button
          type="button"
          onClick={rerun}
          disabled={
            !stages.some((stage) =>
              stage.jobs.some((job) => job.status === "failed"),
            )
          }
          className="ml-1 inline-flex h-7 items-center gap-1.5 rounded-md border bg-card px-2.5 text-xs font-medium shadow-xs transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        >
          <IconRefresh className="size-3.5" aria-hidden="true" />
          Re-run failed
        </button>
      }
      stages={stages}
      selectedJobId={selected}
      onSelectedJobChange={setSelected}
      onRetry={rerun}
      renderJobDetail={(job) => <JobLog job={job} />}
    />
  );
}
