export default {
  name: "deploy-pipeline",
  title: "Deploy pipeline",
  category: "Operations",
  description:
    "Follow a CI/CD run as stages of parallel jobs, with live timers, flowing connectors into the running stage, and retry on failure.",
  dependencies: [],
  imports: "DeployPipeline, type PipelineStage",
  usage:
    'function Example() {\n  const stages: PipelineStage[] = [\n    { id: "build", label: "Build", jobs: [{ id: "compile", label: "Compile", status: "success", duration: 72_000 }] },\n    {\n      id: "test",\n      label: "Test",\n      jobs: [\n        { id: "unit", label: "Unit", status: "success", duration: 48_000 },\n        { id: "e2e", label: "E2E", status: "running", startedAt: Date.now() - 95_000 },\n      ],\n    },\n    { id: "deploy", label: "Deploy", jobs: [{ id: "production", label: "Production", status: "queued" }] },\n  ]\n  return <DeployPipeline title="web · main" stages={stages} onRetry={(job) => console.log("retry", job.id)} />\n}',
  notes:
    "Stages run left to right and the jobs inside a stage run in parallel; pass a new `stages` array whenever a job changes. A running job without `duration` shows a live timer from `startedAt`, and the header totals the slowest job of each stage unless you pass `duration`. With `orientation=\"auto\"` the pipeline measures its own width and switches to a vertical timeline when stage columns would be narrower than `minStageWidth`. Click a job or press Enter to select it, arrow keys move between jobs, Escape clears; `renderJobDetail` fills the panel under the selection (it falls back to `job.detail`). Recolor statuses with `colors` or the `--pipeline-running`, `--pipeline-success` and `--pipeline-failed` variables, and target parts with `data-slot` (`pipeline-job`, `pipeline-connector`, `pipeline-detail`) plus `data-status` and `data-state`. Connector flow, spinners and shimmer stop under prefers-reduced-motion; timers keep counting.",
  previewWidth: 720,
  examples: [
    {
      name: "deploy-pipeline-demo",
      title: "Live production run",
      description:
        "web on main builds, runs unit, E2E and lint in parallel, scans, then deploys a preview and production. The flaky E2E job fails once: retry it, or wait for the automatic retry.",
    },
    {
      name: "deploy-pipeline-vertical-demo",
      title: "Failed run with logs",
      description:
        "A finished release run in the vertical timeline. The failed integration job opens with its log; Re-run failed replays it and the rest of the run.",
    },
  ],
  api: [
    ["stages", "PipelineStage[]", "Stages in order: { id, label, jobs }. Each job is { id, label, status, duration?, startedAt?, detail? }."],
    ["title?", "React.ReactNode", 'Heading for the run. Defaults to "Pipeline".'],
    ["meta?", "React.ReactNode", "Commit, branch, author or trigger, rendered under the title."],
    ["actions?", "React.ReactNode", "Buttons or menus at the top right."],
    ["status?", "PipelineStatus", '"queued" | "running" | "success" | "failed" | "skipped" | "canceled". Overrides the status derived from the jobs.'],
    ["duration?", "number", "Total run time in ms. Defaults to the sum of the slowest job in each stage."],
    ["orientation?", '"auto" | "horizontal" | "vertical"', "Auto picks horizontal stage columns when they fit, else a vertical timeline. Defaults to auto."],
    ["minStageWidth?", "number", "Narrowest stage column in px before auto switches to vertical. Defaults to 104."],
    ["selectedJobId?", "string | null", "Control the selected job. Pair with onSelectedJobChange."],
    ["defaultSelectedJobId?", "string | null", "Initial selection when uncontrolled."],
    ["onSelectedJobChange?", "(jobId: string | null, job: PipelineJob | null) => void", "Called on click, Enter, Escape and the close button."],
    ["onRetry?", "(job: PipelineJob, stage: PipelineStage) => void", "Shows a retry button on failed jobs."],
    ["renderJobDetail?", "(job: PipelineJob, stage: PipelineStage) => React.ReactNode", "Content for the panel under the selected job, such as log lines. Falls back to job.detail."],
    ["durationFormatter?", "(ms: number) => string", 'Formats job, stage and total times. Defaults to "42s", "1m 04s", "1h 02m".'],
    ["statusLabels?", "Partial<Record<PipelineStatus, string>>", "Replace status names for translation or wording."],
    ["labels?", "Partial<DeployPipelineLabels>", "Accessible labels: retry, close, total, progress, stages."],
    ["colors?", "Partial<Record<PipelineStatus, string>>", "Any CSS color per status. Sets the matching --pipeline-<status> variable."],
    ["showProgress?", "boolean", "Show the per-job progress ticks under the header. Defaults to true."],
    ["...props", 'React.ComponentProps<"div">', "Forwarded to the root element, including ref."],
    ["PipelineStatusIcon", "{ status: PipelineStatus }", "The status glyph on its own, for tables or toasts that match the pipeline."],
    ["formatPipelineDuration", "(ms: number) => string", "The default duration formatter."],
    ["summarizePipelineStatus", "(statuses: PipelineStatus[]) => PipelineStatus", "Rolls job statuses up into a stage or run status."],
  ],
} as const;
