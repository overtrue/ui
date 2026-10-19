"use client";

import * as React from "react";
import {
  IconBan as Ban,
  IconCircleCheckFilled as CircleCheck,
  IconCircleDashed as CircleDashed,
  IconCircleMinus as CircleMinus,
  IconCircleXFilled as CircleX,
  IconClock as Clock,
  IconRefresh as Refresh,
  IconX as X,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export type PipelineStatus =
  "queued" | "running" | "success" | "failed" | "skipped" | "canceled";

export interface PipelineJob {
  id: string;
  label: string;
  status: PipelineStatus;
  /** Wall time in milliseconds. Leave it out while running and pass `startedAt` instead. */
  duration?: number;
  /** Epoch milliseconds. Drives the live elapsed timer while the job runs. */
  startedAt?: number;
  /** A short secondary line: runner, exit code, retry count. */
  detail?: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  jobs: PipelineJob[];
}

export type PipelineOrientation = "auto" | "horizontal" | "vertical";
export type PipelineStatusLabels = Record<PipelineStatus, string>;
/** Any CSS color per status, e.g. `{ running: "var(--color-chart-4)" }`. */
export type PipelineColors = Partial<Record<PipelineStatus, string>>;

export interface DeployPipelineLabels {
  retry: string;
  close: string;
  total: string;
  progress: string;
  stages: string;
}

export interface DeployPipelineProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "children"
> {
  /** Stages run left to right; jobs inside a stage run in parallel. */
  stages: PipelineStage[];
  title?: React.ReactNode;
  /** Commit, branch, author… rendered under the title. */
  meta?: React.ReactNode;
  /** Buttons or menus at the top right. */
  actions?: React.ReactNode;
  /** Override the run status derived from the jobs. */
  status?: PipelineStatus;
  /** Override the total duration (ms) derived from the slowest job of each stage. */
  duration?: number;
  /** `auto` lays stages out horizontally when each gets at least `minStageWidth`, else as a vertical timeline. */
  orientation?: PipelineOrientation;
  /** Narrowest stage column, in px, before `auto` switches to the vertical timeline. */
  minStageWidth?: number;
  selectedJobId?: string | null;
  defaultSelectedJobId?: string | null;
  onSelectedJobChange?: (jobId: string | null, job: PipelineJob | null) => void;
  /** Shows a retry button on failed jobs. */
  onRetry?: (job: PipelineJob, stage: PipelineStage) => void;
  /** Content for the panel that opens under the selected job. Falls back to `job.detail`. */
  renderJobDetail?: (job: PipelineJob, stage: PipelineStage) => React.ReactNode;
  durationFormatter?: (ms: number) => string;
  statusLabels?: Partial<PipelineStatusLabels>;
  labels?: Partial<DeployPipelineLabels>;
  colors?: PipelineColors;
  /** Show the per-job progress ticks under the header. */
  showProgress?: boolean;
}

const STATUS_LABELS: PipelineStatusLabels = {
  queued: "Queued",
  running: "Running",
  success: "Passed",
  failed: "Failed",
  skipped: "Skipped",
  canceled: "Canceled",
};

const LABELS: DeployPipelineLabels = {
  retry: "Retry",
  close: "Close details",
  total: "Total duration",
  progress: "Jobs finished",
  stages: "Pipeline stages",
};

const GAP = 32;
const PAD = 16;
const FINISHED = new Set<PipelineStatus>([
  "success",
  "failed",
  "skipped",
  "canceled",
]);

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-card";

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const pad = (value: number) => String(value).padStart(2, "0");

/** 950 → "<1s", 42 000 → "42s", 64 000 → "1m 04s", 3 720 000 → "1h 02m". */
export function formatPipelineDuration(ms: number) {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  if (ms < 1000) return ms <= 0 ? "0s" : "<1s";
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${pad(seconds % 60)}s`;
  return `${Math.floor(minutes / 60)}h ${pad(minutes % 60)}m`;
}

/** Roll a set of job statuses up into one: used for stages and for the whole run. */
export function summarizePipelineStatus(
  statuses: PipelineStatus[],
): PipelineStatus {
  if (statuses.length === 0) return "queued";
  if (statuses.includes("running")) return "running";
  if (statuses.includes("failed")) return "failed";
  if (statuses.includes("canceled")) return "canceled";
  if (statuses.every((status) => status === "skipped")) return "skipped";
  if (statuses.every((status) => status === "success" || status === "skipped"))
    return "success";
  if (statuses.every((status) => status === "queued")) return "queued";
  // Some jobs finished and the rest are waiting for a runner.
  return "running";
}

const tone = (status: PipelineStatus) =>
  ({ "--tone": `var(--pipeline-${status})` }) as React.CSSProperties;

/** Status glyph used by the pipeline. Color comes from the `--pipeline-<status>` variables. */
export function PipelineStatusIcon({
  status,
  className,
  ...props
}: { status: PipelineStatus } & React.ComponentProps<"span">) {
  const icon = "size-full";
  return (
    <span
      data-slot="pipeline-status-icon"
      data-status={status}
      aria-hidden="true"
      style={tone(status)}
      className={cn("inline-flex size-4 shrink-0 text-(--tone)", className)}
      {...props}
    >
      {status === "running" ? (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={cn(icon, "motion-safe:animate-spin")}
          style={{ animationDuration: "1.1s" }}
        >
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
          <path
            d="M8 2a6 6 0 0 1 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="8"
            cy="8"
            r="1.75"
            fill="currentColor"
            className="motion-safe:hidden"
          />
        </svg>
      ) : status === "success" ? (
        <CircleCheck className={icon} />
      ) : status === "failed" ? (
        <CircleX className={icon} />
      ) : status === "skipped" ? (
        <CircleMinus className={icon} stroke={1.75} />
      ) : status === "canceled" ? (
        <Ban className={icon} stroke={1.75} />
      ) : (
        <CircleDashed className={icon} stroke={1.75} />
      )}
    </span>
  );
}

function useNow(active: boolean) {
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, [active]);
  return now;
}

function elapsed(job: PipelineJob, now: number | null) {
  if (job.duration !== undefined) return job.duration;
  if (job.status === "running" && job.startedAt !== undefined && now !== null)
    return Math.max(0, now - job.startedAt);
  return undefined;
}

type EdgeEnd = { job: string } | { stage: string };
interface EdgeGeometry {
  key: string;
  d: string;
  from: EdgeEnd;
  to: EdgeEnd;
}
interface Geometry {
  edges: EdgeGeometry[];
  ports: { key: string; x: number; y: number; job: string }[];
}

type EdgeState = "active" | "done" | "blocked" | "pending";

function edgeState(from: PipelineStatus, to: PipelineStatus): EdgeState {
  if (to === "running") return "active";
  if (to === "success" || to === "failed") return "done";
  if (
    from === "failed" ||
    from === "canceled" ||
    to === "canceled" ||
    to === "skipped"
  )
    return "blocked";
  return "pending";
}

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const mid = (x1 + x2) / 2;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}C${mid.toFixed(1)} ${y1.toFixed(1)} ${mid.toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};

function Shimmer({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute overflow-hidden motion-reduce:hidden",
        className,
      )}
    >
      <span className="block h-full w-1/2 animate-[pipeline-sweep_1.6s_cubic-bezier(0.4,0,0.2,1)_infinite] bg-linear-to-r from-transparent via-(--tone) to-transparent" />
    </span>
  );
}

const styles = `@keyframes pipeline-sweep{from{transform:translateX(-100%)}to{transform:translateX(200%)}}@keyframes pipeline-flow{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}@keyframes pipeline-rail{from{background-position:0 -24px}to{background-position:0 0}}`;

/**
 * A CI/CD run as stages of parallel jobs: live timers, flowing connectors into the
 * running stage, retry on failure, and a detail panel for the selected job.
 */
export function DeployPipeline({
  stages,
  title = "Pipeline",
  meta,
  actions,
  status: statusProp,
  duration: durationProp,
  orientation = "auto",
  minStageWidth = 104,
  selectedJobId: selectedProp,
  defaultSelectedJobId = null,
  onSelectedJobChange,
  onRetry,
  renderJobDetail,
  durationFormatter = formatPipelineDuration,
  statusLabels: statusLabelsProp,
  labels: labelsProp,
  colors,
  showProgress = true,
  className,
  style,
  ref,
  onKeyDown,
  ...props
}: DeployPipelineProps) {
  const statusLabels = { ...STATUS_LABELS, ...statusLabelsProp };
  const labels = { ...LABELS, ...labelsProp };
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const graphRef = React.useRef<HTMLDivElement | null>(null);
  const jobRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const nodeRefs = React.useRef(new Map<string, HTMLDivElement>());
  // Row to return to while arrowing across stages of different heights.
  const rowMemory = React.useRef<number | null>(null);

  const [width, setWidth] = React.useState<number | null>(null);
  const [selectedState, setSelectedState] = React.useState<string | null>(
    defaultSelectedJobId,
  );
  const selectedId = selectedProp !== undefined ? selectedProp : selectedState;
  const [focusId, setFocusId] = React.useState<string | null>(null);
  const [geometry, setGeometry] = React.useState<Geometry>({
    edges: [],
    ports: [],
  });

  const setRoot = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  useIsoLayoutEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    setWidth(element.clientWidth);
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const count = stages.length;
  const layout: "horizontal" | "vertical" =
    orientation === "auto"
      ? width === null ||
        width >= count * minStageWidth + (count - 1) * GAP + PAD * 2
        ? "horizontal"
        : "vertical"
      : orientation;

  // Flat lookup tables, rebuilt only when the run changes.
  const { jobs, jobStatus, stageStatus, position } = React.useMemo(() => {
    const jobs: {
      job: PipelineJob;
      stage: PipelineStage;
      stageIndex: number;
      row: number;
    }[] = [];
    const jobStatus = new Map<string, PipelineStatus>();
    const stageStatus = new Map<string, PipelineStatus>();
    const position = new Map<string, number>();
    stages.forEach((stage, stageIndex) => {
      stage.jobs.forEach((job, row) => {
        position.set(job.id, jobs.length);
        jobs.push({ job, stage, stageIndex, row });
        jobStatus.set(job.id, job.status);
      });
      stageStatus.set(
        stage.id,
        summarizePipelineStatus(stage.jobs.map((job) => job.status)),
      );
    });
    return { jobs, jobStatus, stageStatus, position };
  }, [stages]);

  const running = jobs.some(
    ({ job }) => job.status === "running" && job.duration === undefined,
  );
  const now = useNow(running);
  const runStatus =
    statusProp ?? summarizePipelineStatus(jobs.map(({ job }) => job.status));
  const finished = jobs.filter(({ job }) => FINISHED.has(job.status)).length;

  const stageTimes = stages.map((stage) => {
    let longest: number | undefined;
    for (const job of stage.jobs) {
      const time = elapsed(job, now);
      if (time !== undefined) longest = Math.max(longest ?? 0, time);
    }
    return longest;
  });
  const total =
    durationProp ??
    (stageTimes.some((time) => time !== undefined)
      ? stageTimes.reduce<number>((sum, time) => sum + (time ?? 0), 0)
      : undefined);

  const selected = selectedId
    ? jobs[position.get(selectedId) ?? -1]
    : undefined;
  const select = (id: string | null) => {
    const next = id && position.has(id) ? id : null;
    if (next === selectedId) return;
    if (selectedProp === undefined) setSelectedState(next);
    onSelectedJobChange?.(next, next ? jobs[position.get(next)!].job : null);
  };

  // The one job reachable with Tab; arrows move it.
  const tabStop =
    (focusId && position.has(focusId) && focusId) ||
    (selected && selected.job.id) ||
    jobs.find(({ job }) => job.status === "running" || job.status === "failed")
      ?.job.id ||
    jobs[0]?.job.id;

  const stagesRef = React.useRef(stages);
  stagesRef.current = stages;
  const structure = stages
    .map((stage) => `${stage.id}:${stage.jobs.map((job) => job.id).join(",")}`)
    .join("|");

  // Measure node edges and draw connectors between neighboring stages.
  useIsoLayoutEffect(() => {
    const graph = graphRef.current;
    if (layout !== "horizontal" || !graph) {
      setGeometry((current) =>
        current.edges.length ? { edges: [], ports: [] } : current,
      );
      return;
    }
    const measure = () => {
      const stages = stagesRef.current;
      const edges: EdgeGeometry[] = [];
      const ports = new Map<
        string,
        { key: string; x: number; y: number; job: string }
      >();
      const point = (job: PipelineJob, side: "left" | "right") => {
        const node = nodeRefs.current.get(job.id);
        if (!node) return null;
        // Layout offsets, not client rects, so a scaled preview still lines up.
        let left = 0;
        let top = 0;
        for (
          let element: HTMLElement | null = node;
          element && element !== graph;
          element = element.offsetParent as HTMLElement | null
        ) {
          left += element.offsetLeft;
          top += element.offsetTop;
        }
        const x = side === "left" ? left : left + node.offsetWidth;
        const y = top + node.offsetHeight / 2;
        ports.set(`${job.id}:${side}`, {
          key: `${job.id}:${side}`,
          x,
          y,
          job: job.id,
        });
        return { x, y, id: job.id };
      };
      for (let index = 0; index < stages.length - 1; index++) {
        const from = stages[index];
        const to = stages[index + 1];
        const sources = from.jobs
          .map((job) => point(job, "right"))
          .filter((value) => value !== null);
        const targets = to.jobs
          .map((job) => point(job, "left"))
          .filter((value) => value !== null);
        if (!sources.length || !targets.length) continue;
        if (sources.length > 1 && targets.length > 1) {
          // Many-to-many: merge through one junction instead of drawing every pair.
          const x =
            (Math.max(...sources.map((s) => s.x)) +
              Math.min(...targets.map((t) => t.x))) /
            2;
          const y = (sources[0].y + targets[0].y) / 2;
          for (const s of sources)
            edges.push({
              key: `${s.id}>${to.id}`,
              d: curve(s.x, s.y, x, y),
              from: { job: s.id },
              to: { stage: to.id },
            });
          for (const t of targets)
            edges.push({
              key: `${from.id}>${t.id}`,
              d: curve(x, y, t.x, t.y),
              from: { stage: from.id },
              to: { job: t.id },
            });
        } else {
          for (const s of sources)
            for (const t of targets)
              edges.push({
                key: `${s.id}>${t.id}`,
                d: curve(s.x, s.y, t.x, t.y),
                from: { job: s.id },
                to: { job: t.id },
              });
        }
      }
      setGeometry({ edges, ports: [...ports.values()] });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(graph);
    return () => observer.disconnect();
  }, [layout, structure]);

  const endStatus = (end: EdgeEnd) =>
    ("job" in end ? jobStatus.get(end.job) : stageStatus.get(end.stage)) ??
    "queued";

  const moveFocus = (id: string | undefined) => {
    if (!id) return;
    setFocusId(id);
    jobRefs.current.get(id)?.focus();
  };

  const handleJobKey = (event: React.KeyboardEvent, index: number) => {
    const current = jobs[index];
    const stageJobs = (stageIndex: number) => stages[stageIndex]?.jobs ?? [];
    const toStage = (delta: number) => {
      let stageIndex = current.stageIndex + delta;
      while (
        stageIndex >= 0 &&
        stageIndex < stages.length &&
        stageJobs(stageIndex).length === 0
      )
        stageIndex += delta;
      const list = stageJobs(stageIndex);
      rowMemory.current ??= current.row;
      return list[Math.min(rowMemory.current, list.length - 1)]?.id;
    };
    const within = (delta: number) =>
      stageJobs(current.stageIndex)[current.row + delta]?.id;
    const flat = (delta: number) => jobs[index + delta]?.job.id;
    const horizontal = layout === "horizontal";
    let target: string | undefined;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
      rowMemory.current = null;
    switch (event.key) {
      case "ArrowRight":
        target = toStage(1);
        break;
      case "ArrowLeft":
        target = toStage(-1);
        break;
      case "ArrowDown":
        target = horizontal ? within(1) : flat(1);
        break;
      case "ArrowUp":
        target = horizontal ? within(-1) : flat(-1);
        break;
      case "Home":
        target = jobs[0]?.job.id;
        break;
      case "End":
        target = jobs[jobs.length - 1]?.job.id;
        break;
      case "Enter":
        event.preventDefault();
        select(current.job.id);
        return;
      default:
        return;
    }
    event.preventDefault();
    moveFocus(target);
  };

  const colorVars = colors
    ? (Object.fromEntries(
        Object.entries(colors).map(([key, value]) => [
          `--pipeline-${key}`,
          value,
        ]),
      ) as React.CSSProperties)
    : undefined;

  const showDetail = (job: PipelineJob) =>
    Boolean(renderJobDetail || job.detail);
  const detailContent = (job: PipelineJob, stage: PipelineStage) =>
    renderJobDetail ? (
      renderJobDetail(job, stage)
    ) : (
      <div className="font-mono text-xs leading-5 break-words whitespace-pre-wrap text-muted-foreground">
        {job.detail}
      </div>
    );

  const jobTime = (job: PipelineJob) => {
    const time = elapsed(job, now);
    if (
      job.status === "queued" ||
      job.status === "skipped" ||
      job.status === "canceled"
    )
      return time !== undefined && job.status === "canceled"
        ? durationFormatter(time)
        : statusLabels[job.status];
    return time !== undefined
      ? durationFormatter(time)
      : statusLabels[job.status];
  };

  const jobButton = (entry: (typeof jobs)[number], index: number) => {
    const { job, stage } = entry;
    const isSelected = selectedId === job.id;
    const time = elapsed(job, now);
    return (
      <button
        type="button"
        ref={(node) => {
          if (node) jobRefs.current.set(job.id, node);
          else jobRefs.current.delete(job.id);
        }}
        data-slot="pipeline-job-trigger"
        tabIndex={tabStop === job.id ? 0 : -1}
        aria-pressed={isSelected}
        aria-label={`${stage.label}: ${job.label}, ${statusLabels[job.status]}${time !== undefined ? `, ${durationFormatter(time)}` : ""}`}
        title={job.detail}
        onFocus={() => setFocusId(job.id)}
        onClick={() => {
          rowMemory.current = null;
          select(isSelected ? null : job.id);
        }}
        onKeyDown={(event) => handleJobKey(event, index)}
        className={cn("absolute inset-0 rounded-[inherit]", focusRing)}
      />
    );
  };

  const retryButton = (
    job: PipelineJob,
    stage: PipelineStage,
    className?: string,
  ) =>
    onRetry && job.status === "failed" ? (
      <button
        type="button"
        data-slot="pipeline-retry"
        title={`${labels.retry} ${job.label}`}
        aria-label={`${labels.retry} ${job.label}`}
        onClick={(event) => {
          event.stopPropagation();
          onRetry(job, stage);
        }}
        className={cn(
          "pointer-events-auto relative inline-flex shrink-0 items-center justify-center gap-1 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:bg-(--pipeline-failed)/10 hover:text-(--pipeline-failed) motion-reduce:transition-none",
          focusRing,
          className,
        )}
      >
        <Refresh className="size-3.5" aria-hidden="true" />
      </button>
    ) : null;

  const stageMeta = (stage: PipelineStage, index: number) => {
    const time = stageTimes[index];
    const status = stageStatus.get(stage.id) ?? "queued";
    if (time === undefined) return null;
    return (
      <span
        className={cn(
          "shrink-0 font-mono text-[11px] tabular-nums",
          status === "running" ? "text-(--tone)" : "text-muted-foreground",
        )}
        style={tone(status)}
      >
        {durationFormatter(time)}
      </span>
    );
  };

  const detailPanel =
    selected && showDetail(selected.job) ? (
      <div
        key={selected.job.id}
        data-slot="pipeline-detail"
        className="transition-[opacity,translate] duration-200 ease-out starting:-translate-y-1 starting:opacity-0 motion-reduce:transition-none"
      >
        {layout === "horizontal" && (
          <div
            className="flex items-center gap-2 px-4 pt-3"
            style={tone(selected.job.status)}
          >
            <PipelineStatusIcon
              status={selected.job.status}
              className="size-3.5"
            />
            <div className="min-w-0 truncate text-[13px] font-medium">
              <span className="text-muted-foreground">
                {selected.stage.label} /{" "}
              </span>
              {selected.job.label}
            </div>
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {jobTime(selected.job)}
            </span>
            <span className="ml-auto flex items-center gap-1">
              {retryButton(selected.job, selected.stage, "h-6 px-1.5")}
              <button
                type="button"
                aria-label={labels.close}
                title={labels.close}
                onClick={() => {
                  select(null);
                  moveFocus(selected.job.id);
                }}
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground motion-reduce:transition-none",
                  focusRing,
                )}
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </span>
          </div>
        )}
        <div
          className={layout === "horizontal" ? "px-4 pt-2 pb-4" : "px-3 py-2.5"}
        >
          {detailContent(selected.job, selected.stage)}
        </div>
      </div>
    ) : null;

  return (
    <div
      ref={setRoot}
      data-slot="deploy-pipeline"
      data-status={runStatus}
      data-orientation={layout}
      className={cn(
        "@container/pipeline flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs",
        "[--pipeline-canceled:var(--color-muted-foreground)] [--pipeline-failed:var(--color-destructive)] [--pipeline-queued:var(--color-muted-foreground)] [--pipeline-running:var(--color-primary)] [--pipeline-skipped:var(--color-muted-foreground)] [--pipeline-success:var(--color-emerald-500)]",
        className,
      )}
      style={{ ...colorVars, ...style }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === "Escape" && selectedId && !event.defaultPrevented) {
          event.stopPropagation();
          select(null);
        }
      }}
      {...props}
    >
      <style href="overtrue-deploy-pipeline" precedence="default">
        {styles}
      </style>

      <div className="flex items-start gap-3 px-4 pt-3.5 pb-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <div className="min-w-0 text-sm leading-6 font-semibold tracking-tight break-words">
              {title}
            </div>
            <span
              role="status"
              data-slot="pipeline-status"
              style={tone(runStatus)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-(--tone)/25 bg-(--tone)/8 px-2 py-px text-[11px] leading-4 font-medium text-[color-mix(in_oklab,var(--tone)_78%,var(--color-foreground))]"
            >
              <span className="relative flex size-1.5" aria-hidden="true">
                {runStatus === "running" && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-(--tone) opacity-70 motion-reduce:hidden" />
                )}
                <span className="relative inline-flex size-1.5 rounded-full bg-(--tone)" />
              </span>
              {statusLabels[runStatus]}
            </span>
          </div>
          {meta && (
            <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {meta}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            data-slot="pipeline-duration"
            title={labels.total}
            className="inline-flex h-7 items-center gap-1.5 font-mono text-xs text-foreground tabular-nums"
          >
            <Clock
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="sr-only">{labels.total}: </span>
            {total !== undefined ? durationFormatter(total) : "—"}
          </span>
          {actions}
        </div>
      </div>

      {showProgress && jobs.length > 0 && (
        <div className="flex items-center gap-3 px-4 pb-3.5">
          <div
            data-slot="pipeline-progress"
            role="progressbar"
            aria-label={labels.progress}
            aria-valuemin={0}
            aria-valuemax={jobs.length}
            aria-valuenow={finished}
            className="flex min-w-0 flex-1 items-center gap-2.5"
          >
            {stages.map((stage) =>
              stage.jobs.length ? (
                <span
                  key={stage.id}
                  className="flex min-w-0 basis-0 gap-0.5"
                  style={{ flexGrow: stage.jobs.length }}
                >
                  {stage.jobs.map((job) => (
                    <span
                      key={job.id}
                      title={`${job.label} · ${statusLabels[job.status]}`}
                      style={tone(job.status)}
                      className={cn(
                        "relative h-1.5 min-w-1 flex-1 overflow-hidden rounded-full transition-colors duration-500 motion-reduce:transition-none",
                        job.status === "queued"
                          ? "bg-muted"
                          : job.status === "skipped" ||
                              job.status === "canceled"
                            ? "bg-(--tone)/25"
                            : job.status === "running"
                              ? "bg-(--tone)/25"
                              : "bg-(--tone)",
                      )}
                    >
                      {job.status === "running" && (
                        <Shimmer className="inset-0" />
                      )}
                    </span>
                  ))}
                </span>
              ) : null,
            )}
          </div>
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
            {finished}/{jobs.length}
          </span>
        </div>
      )}

      <div className="border-t bg-muted/20" style={{ padding: PAD }}>
        <div
          ref={graphRef}
          role="group"
          aria-label={labels.stages}
          data-slot="pipeline-graph"
          className="relative"
        >
          {layout === "horizontal" ? (
            <>
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full overflow-visible"
              >
                {geometry.edges.map((edge) => {
                  const state = edgeState(
                    endStatus(edge.from),
                    endStatus(edge.to),
                  );
                  return (
                    <g
                      key={edge.key}
                      data-slot="pipeline-connector"
                      data-state={state}
                    >
                      <path
                        d={edge.d}
                        fill="none"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeDasharray={
                          state === "pending" || state === "blocked"
                            ? "2 4"
                            : undefined
                        }
                        className={cn(
                          "transition-[stroke] duration-500 motion-reduce:transition-none",
                          state === "active"
                            ? "stroke-(--pipeline-running)/35 motion-reduce:stroke-(--pipeline-running)"
                            : state === "done"
                              ? "stroke-(--pipeline-success)/55"
                              : state === "blocked"
                                ? "stroke-muted-foreground/30"
                                : "stroke-muted-foreground/45",
                        )}
                      />
                      {state === "active" && (
                        <>
                          <path
                            d={edge.d}
                            fill="none"
                            pathLength={100}
                            strokeWidth={6}
                            strokeLinecap="round"
                            strokeDasharray="16 84"
                            className="animate-[pipeline-flow_1.5s_linear_infinite] stroke-(--pipeline-running)/20 motion-reduce:hidden"
                          />
                          <path
                            d={edge.d}
                            fill="none"
                            pathLength={100}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeDasharray="16 84"
                            className="animate-[pipeline-flow_1.5s_linear_infinite] stroke-(--pipeline-running) motion-reduce:hidden"
                          />
                        </>
                      )}
                    </g>
                  );
                })}
                {geometry.ports.map((port) => {
                  const status = jobStatus.get(port.job) ?? "queued";
                  return (
                    <circle
                      key={port.key}
                      cx={port.x}
                      cy={port.y}
                      r={2.5}
                      strokeWidth={1.5}
                      style={tone(status)}
                      className={cn(
                        "fill-card transition-[stroke] duration-500 motion-reduce:transition-none",
                        status === "queued" ||
                          status === "skipped" ||
                          status === "canceled"
                          ? "stroke-muted-foreground/45"
                          : "stroke-(--tone)",
                      )}
                    />
                  );
                })}
              </svg>
              <div
                className="relative grid"
                style={{
                  gridTemplateColumns: `repeat(${Math.max(count, 1)}, minmax(0, 1fr))`,
                  columnGap: GAP,
                }}
              >
                {stages.map((stage, stageIndex) => (
                  <div
                    key={stage.id}
                    role="group"
                    aria-label={stage.label}
                    data-slot="pipeline-stage"
                    data-status={stageStatus.get(stage.id)}
                    className="min-w-0"
                  >
                    <div className="mb-2 flex h-5 items-center justify-between gap-2">
                      <div
                        className="min-w-0 truncate text-xs font-medium text-muted-foreground"
                        title={stage.label}
                      >
                        {stage.label}
                      </div>
                      {stageMeta(stage, stageIndex)}
                    </div>
                    <div className="flex flex-col gap-2">
                      {stage.jobs.map((job) => {
                        const index = position.get(job.id)!;
                        const isSelected = selectedId === job.id;
                        const muted =
                          job.status === "queued" ||
                          job.status === "skipped" ||
                          job.status === "canceled";
                        return (
                          <div
                            key={job.id}
                            ref={(node) => {
                              if (node) nodeRefs.current.set(job.id, node);
                              else nodeRefs.current.delete(job.id);
                            }}
                            data-slot="pipeline-job"
                            data-status={job.status}
                            data-selected={isSelected || undefined}
                            style={tone(job.status)}
                            className={cn(
                              "group/job relative h-11 rounded-lg border bg-card transition-[border-color,box-shadow,background-color] duration-200 motion-reduce:transition-none",
                              muted ? "border-dashed shadow-none" : "shadow-xs",
                              job.status === "running" && "border-(--tone)/40",
                              job.status === "failed" &&
                                "border-(--tone)/35 bg-[color-mix(in_oklab,var(--tone)_5%,var(--color-card))]",
                              isSelected
                                ? "border-primary ring-2 ring-primary/20"
                                : "hover:border-foreground/20",
                            )}
                          >
                            {jobButton(jobs[index], index)}
                            <div className="pointer-events-none relative flex h-full items-center gap-2 pr-1.5 pl-2.5">
                              <PipelineStatusIcon
                                status={job.status}
                                className="size-3.5"
                              />
                              <div
                                className="min-w-0 flex-1"
                                aria-hidden="true"
                              >
                                <div
                                  className={cn(
                                    "truncate text-[13px] leading-4 font-medium",
                                    muted && "text-muted-foreground",
                                  )}
                                >
                                  {job.label}
                                </div>
                                <div
                                  className={cn(
                                    "truncate font-mono text-[11px] leading-4 tabular-nums",
                                    job.status === "running"
                                      ? "text-[color-mix(in_oklab,var(--tone)_80%,var(--color-foreground))]"
                                      : job.status === "failed"
                                        ? "text-[color-mix(in_oklab,var(--tone)_80%,var(--color-foreground))]"
                                        : "text-muted-foreground",
                                  )}
                                >
                                  {jobTime(job)}
                                </div>
                              </div>
                              {retryButton(job, stage, "size-6")}
                            </div>
                            {job.status === "running" && (
                              <>
                                <Shimmer className="inset-x-2 bottom-0 h-px" />
                                <Shimmer className="inset-0 rounded-[inherit] opacity-[0.07]" />
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <ol className="relative">
              {stages.map((stage, stageIndex) => {
                const status = stageStatus.get(stage.id) ?? "queued";
                const next = stages[stageIndex + 1];
                const rail = next
                  ? edgeState(status, stageStatus.get(next.id) ?? "queued")
                  : null;
                return (
                  <li
                    key={stage.id}
                    data-slot="pipeline-stage"
                    data-status={status}
                    aria-label={stage.label}
                    className="relative grid grid-cols-[16px_minmax(0,1fr)] gap-x-3 pb-3.5 last:pb-0"
                  >
                    <div className="relative flex justify-center">
                      <span className="relative z-10 flex h-5 items-center bg-[color-mix(in_oklab,var(--color-muted)_20%,var(--color-card))]">
                        <PipelineStatusIcon status={status} />
                      </span>
                      {rail && (
                        <span
                          aria-hidden="true"
                          data-slot="pipeline-connector"
                          data-state={rail}
                          className={cn(
                            "absolute top-6 -bottom-1 left-1/2 w-0 -translate-x-1/2",
                            rail === "active"
                              ? "w-[1.5px] bg-(--pipeline-running)/35 motion-safe:animate-[pipeline-rail_0.9s_linear_infinite] motion-safe:bg-[linear-gradient(to_bottom,transparent_0,var(--pipeline-running)_50%,transparent_100%)] motion-safe:bg-size-[100%_24px] motion-safe:bg-repeat-y"
                              : rail === "done"
                                ? "w-[1.5px] bg-(--pipeline-success)/55"
                                : "border-l-[1.5px] border-dashed border-muted-foreground/35",
                          )}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex h-5 items-center justify-between gap-2">
                        <div className="min-w-0 truncate text-[13px] font-semibold tracking-tight">
                          {stage.label}
                        </div>
                        {stageMeta(stage, stageIndex)}
                      </div>
                      <div className="mt-1.5 divide-y overflow-hidden rounded-lg border bg-card shadow-xs">
                        {stage.jobs.map((job) => {
                          const index = position.get(job.id)!;
                          const isSelected = selectedId === job.id;
                          const muted =
                            job.status === "queued" ||
                            job.status === "skipped" ||
                            job.status === "canceled";
                          return (
                            <div key={job.id} data-slot="pipeline-job-group">
                              <div
                                ref={(node) => {
                                  if (node) nodeRefs.current.set(job.id, node);
                                  else nodeRefs.current.delete(job.id);
                                }}
                                data-slot="pipeline-job"
                                data-status={job.status}
                                data-selected={isSelected || undefined}
                                style={tone(job.status)}
                                className={cn(
                                  "relative h-9 transition-colors duration-200 motion-reduce:transition-none",
                                  isSelected
                                    ? "bg-muted/70"
                                    : "hover:bg-muted/40",
                                  job.status === "failed" &&
                                    !isSelected &&
                                    "bg-[color-mix(in_oklab,var(--tone)_5%,var(--color-card))]",
                                )}
                              >
                                {jobButton(jobs[index], index)}
                                {isSelected && (
                                  <span
                                    aria-hidden="true"
                                    className="absolute inset-y-0 left-0 w-0.5 bg-primary"
                                  />
                                )}
                                <div className="pointer-events-none relative flex h-full items-center gap-2.5 pr-2 pl-3">
                                  <PipelineStatusIcon
                                    status={job.status}
                                    className="size-3.5"
                                  />
                                  <div
                                    aria-hidden="true"
                                    className={cn(
                                      "min-w-0 truncate text-[13px] font-medium",
                                      muted && "text-muted-foreground",
                                    )}
                                  >
                                    {job.label}
                                  </div>
                                  <div
                                    aria-hidden="true"
                                    className="hidden min-w-0 flex-1 truncate text-xs text-muted-foreground @sm/pipeline:block"
                                  >
                                    {job.detail}
                                  </div>
                                  <span className="flex-1 @sm/pipeline:hidden" />
                                  <span
                                    aria-hidden="true"
                                    className={cn(
                                      "shrink-0 font-mono text-[11px] tabular-nums",
                                      job.status === "running" ||
                                        job.status === "failed"
                                        ? "text-[color-mix(in_oklab,var(--tone)_80%,var(--color-foreground))]"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {jobTime(job)}
                                  </span>
                                  {retryButton(job, stage, "size-6")}
                                </div>
                                {job.status === "running" && (
                                  <>
                                    <Shimmer className="inset-x-0 bottom-0 h-px" />
                                    <Shimmer className="inset-0 opacity-[0.07]" />
                                  </>
                                )}
                              </div>
                              {isSelected && detailPanel && (
                                <div className="border-t bg-muted/30">
                                  {detailPanel}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>

      {layout === "horizontal" && detailPanel && (
        <div className="border-t">{detailPanel}</div>
      )}
    </div>
  );
}
