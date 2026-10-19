"use client";

import * as React from "react";
import {
  IconAlertTriangleFilled as AlertTriangle,
  IconChevronRight as ChevronRight,
  IconFoldDown as FoldDown,
  IconFoldUp as FoldUp,
  IconRoute as Route,
  IconX as X,
  IconZoomReset as ZoomReset,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export type TraceSpanStatus = "ok" | "error";

export type TraceSpanAttributeValue = string | number | boolean;

export interface TraceSpan {
  id: string;
  /** The calling span. Spans without a known parent are drawn as roots. */
  parentId?: string | null;
  /** Operation name, e.g. "POST /api/checkout" or "SELECT orders". */
  name: string;
  /** Emitting service. Spans of one service share a color. */
  service: string;
  /** Milliseconds from the start of the trace. */
  start: number;
  /** Milliseconds. */
  duration: number;
  status?: TraceSpanStatus;
  attributes?: Record<string, TraceSpanAttributeValue>;
}

/** Everything derived about one span, passed to `renderDetail`. */
export interface TraceSpanInfo {
  span: TraceSpan;
  parent: TraceSpan | null;
  children: TraceSpan[];
  depth: number;
  /** All spans below this one, at any depth. */
  descendantCount: number;
  /** Time not covered by any child span, in milliseconds. */
  selfTime: number;
  /** Duration as a 0–1 share of the whole trace. */
  share: number;
  /** Whether the span is on the trace's critical path. */
  critical: boolean;
  /** The resolved service color. */
  color: string;
  /** Start and end of the whole trace, in milliseconds. */
  trace: { start: number; end: number; duration: number };
}

export type TraceTimeRange = [start: number, end: number];

export interface TraceWaterfallProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "children"
> {
  spans: TraceSpan[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Controls placed at the top right, before the built-in tools. */
  actions?: React.ReactNode;
  /** Selected span. Pass `null` for none; leave undefined to let the component manage it. */
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedChange?: (id: string | null, span: TraceSpan | null) => void;
  /** Emphasise the longest blocking chain. Pass with `onHighlightCriticalPathChange` to control it. */
  highlightCriticalPath?: boolean;
  defaultHighlightCriticalPath?: boolean;
  onHighlightCriticalPathChange?: (highlight: boolean) => void;
  /** Spans that start collapsed. */
  defaultCollapsedIds?: string[];
  /** Colors by service name. Unlisted services take the chart palette in order of appearance. */
  serviceColors?: Record<string, string>;
  /** Formats every duration and offset except axis ticks. */
  durationFormatter?: (ms: number) => string;
  /** Replaces the attribute table in the detail panel. Compose `TraceSpanAttributes` to keep it. */
  renderDetail?: (span: TraceSpan, info: TraceSpanInfo) => React.ReactNode;
  /** Row height in pixels. Defaults to 28. */
  rowHeight?: number;
  /** Maximum height of the scrolling span list in pixels. Defaults to 360. */
  height?: number;
  /** Width of the span tree as a 0.2–0.7 share of the card. Drag the divider to change it. */
  treeWidth?: number;
  /** Show the whole-trace minimap above the list. Defaults to true. */
  showOverview?: boolean;
  /** Show the service legend, which doubles as a filter. Defaults to true. */
  showLegend?: boolean;
  /** Called when the visible time range changes, with `null` when zoom resets. */
  onZoomChange?: (range: TraceTimeRange | null) => void;
}

/* ------------------------------------------------------------------------ */
/* Formatting                                                                */
/* ------------------------------------------------------------------------ */

function formatDuration(ms: number) {
  if (!Number.isFinite(ms)) return "—";
  const a = Math.abs(ms);
  if (a === 0) return "0ms";
  if (a < 1) return `${Math.round(ms * 1000)}µs`;
  if (a < 10) return `${ms.toFixed(2)}ms`;
  if (a < 100) return `${ms.toFixed(1)}ms`;
  if (a < 1000) return `${Math.round(ms)}ms`;
  if (a < 10_000) return `${(ms / 1000).toFixed(2)}s`;
  if (a < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60_000);
  return `${minutes}m ${Math.round((ms - minutes * 60_000) / 1000)}s`;
}

function formatPercent(share: number) {
  const pct = share * 100;
  if (pct > 0 && pct < 0.1) return "<0.1%";
  return `${pct >= 10 ? pct.toFixed(0) : pct.toFixed(1)}%`;
}

const tidy = (value: number) => +value.toPrecision(12);

function niceStep(span: number, count: number) {
  const raw = span / Math.max(1, count);
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const r = raw / magnitude;
  return (
    (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * magnitude
  );
}

/** Tick labels carry exactly the precision of the step, so neighbors never read alike. */
function tickLabel(value: number, step: number) {
  if (value === 0) return "0";
  if (step >= 1000 || (Math.abs(value) >= 1000 && step >= 100)) {
    const digits = Math.max(0, -Math.floor(Math.log10(step / 1000) + 1e-9));
    return `${(value / 1000).toFixed(Math.min(3, digits))}s`;
  }
  if (step < 1 && step < 0.01) return `${tidy(value * 1000)}µs`;
  const digits = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
  return `${value.toFixed(Math.min(3, digits))}ms`;
}

/* ------------------------------------------------------------------------ */
/* Model                                                                     */
/* ------------------------------------------------------------------------ */

interface TraceNode {
  span: TraceSpan;
  order: number;
  parent: TraceNode | null;
  children: TraceNode[];
  depth: number;
  end: number;
  self: number;
  descendants: number;
  critical: boolean;
}

interface TraceModel {
  nodes: Map<string, TraceNode>;
  roots: TraceNode[];
  /** Every node in tree order. */
  ordered: TraceNode[];
  start: number;
  end: number;
  duration: number;
  services: { name: string; count: number; errors: number }[];
  errors: number;
}

const PALETTE = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  // Blends of the theme's own chart colors keep extra services on-palette.
  "color-mix(in oklab, var(--color-chart-1) 50%, var(--color-chart-2))",
  "color-mix(in oklab, var(--color-chart-2) 50%, var(--color-chart-3))",
  "color-mix(in oklab, var(--color-chart-4) 55%, var(--color-chart-5))",
];

const DESTRUCTIVE = "var(--color-destructive)";
const errorFill = `repeating-linear-gradient(-45deg, ${DESTRUCTIVE} 0 3px, color-mix(in oklab, ${DESTRUCTIVE} 58%, var(--color-card)) 3px 6px)`;

function buildModel(spans: TraceSpan[]): TraceModel {
  const nodes = new Map<string, TraceNode>();
  spans.forEach((span, order) => {
    if (nodes.has(span.id)) return;
    const start = Number.isFinite(span.start) ? span.start : 0;
    const duration = Number.isFinite(span.duration)
      ? Math.max(0, span.duration)
      : 0;
    nodes.set(span.id, {
      span,
      order,
      parent: null,
      children: [],
      depth: 0,
      end: start + duration,
      self: duration,
      descendants: 0,
      critical: false,
    });
  });

  const roots: TraceNode[] = [];
  for (const node of nodes.values()) {
    const parentId = node.span.parentId;
    const parent =
      parentId != null && parentId !== node.span.id
        ? nodes.get(parentId)
        : undefined;
    if (parent) {
      node.parent = parent;
      parent.children.push(node);
    } else roots.push(node);
  }

  const byStart = (a: TraceNode, b: TraceNode) =>
    a.span.start - b.span.start || a.order - b.order;
  const ordered: TraceNode[] = [];
  const visited = new Set<TraceNode>();
  const visit = (node: TraceNode, depth: number) => {
    visited.add(node);
    node.depth = depth;
    ordered.push(node);
    node.children = node.children
      .filter((child) => !visited.has(child))
      .sort(byStart);
    let descendants = 0;
    for (const child of node.children) {
      visit(child, depth + 1);
      descendants += 1 + child.descendants;
    }
    node.descendants = descendants;
    // Self time: the span's duration minus the union of its children's time inside it.
    const start = node.span.start;
    const intervals = node.children
      .map(
        (child) =>
          [
            Math.max(child.span.start, start),
            Math.min(child.end, node.end),
          ] as const,
      )
      .filter(([a, b]) => b > a)
      .sort((a, b) => a[0] - b[0]);
    let covered = 0;
    let cursor = -Infinity;
    for (const [a, b] of intervals) {
      if (b <= cursor) continue;
      covered += b - Math.max(a, cursor);
      cursor = b;
    }
    node.self = Math.max(0, node.end - start - covered);
  };
  roots.sort(byStart);
  for (const root of roots) visit(root, 0);
  // Spans caught in a parent cycle are never reached from a root; draw them as roots.
  for (const node of nodes.values())
    if (!visited.has(node)) {
      node.parent = null;
      roots.push(node);
      visit(node, 0);
    }

  let start = 0;
  let end = 0;
  let errors = 0;
  const services = new Map<
    string,
    { name: string; count: number; errors: number }
  >();
  for (const node of ordered) {
    start = Math.min(start, node.span.start);
    end = Math.max(end, node.end);
    const isError = node.span.status === "error";
    if (isError) errors += 1;
    const entry = services.get(node.span.service) ?? {
      name: node.span.service,
      count: 0,
      errors: 0,
    };
    entry.count += 1;
    if (isError) entry.errors += 1;
    services.set(node.span.service, entry);
  }

  // Critical path: from the longest root, walk back from each span's end through the
  // child that finished last, then whatever finished before that child started.
  const markCritical = (node: TraceNode) => {
    node.critical = true;
    let cursor = node.end + 1e-9;
    const byEnd = [...node.children].sort((a, b) => b.end - a.end);
    for (const child of byEnd) {
      if (child.end <= cursor && child.end > node.span.start) {
        markCritical(child);
        cursor = child.span.start + 1e-9;
      }
    }
  };
  const main = roots.reduce<TraceNode | null>(
    (best, root) =>
      !best || root.end - root.span.start > best.end - best.span.start
        ? root
        : best,
    null,
  );
  if (main) markCritical(main);

  return {
    nodes,
    roots,
    ordered,
    start,
    end,
    duration: end - start || 1,
    services: [...services.values()],
    errors,
  };
}

interface TraceRowModel {
  node: TraceNode;
  depth: number;
  /** For each ancestor column, whether a guide line continues through this row. */
  lines: boolean[];
  last: boolean;
  childCount: number;
  collapsed: boolean;
  hiddenCount: number;
  /** Descendants hidden by collapsing, drawn as a faint summary. */
  summary: TraceNode[];
  parentId: string | null;
  position: number;
  setSize: number;
}

function visibleChildren(
  children: TraceNode[],
  hidden: Set<string>,
): TraceNode[] {
  if (!hidden.size) return children;
  let lifted = false;
  const out: TraceNode[] = [];
  for (const child of children) {
    if (hidden.has(child.span.service)) {
      lifted = true;
      out.push(...visibleChildren(child.children, hidden));
    } else out.push(child);
  }
  return lifted
    ? out.sort((a, b) => a.span.start - b.span.start || a.order - b.order)
    : out;
}

function buildRows(
  model: TraceModel,
  collapsed: Set<string>,
  hidden: Set<string>,
) {
  const rows: TraceRowModel[] = [];
  const flat: TraceNode[] = [];
  const collect = (node: TraceNode, into: TraceNode[]) => {
    for (const child of visibleChildren(node.children, hidden)) {
      into.push(child);
      collect(child, into);
    }
  };
  const visit = (
    node: TraceNode,
    depth: number,
    lines: boolean[],
    last: boolean,
    parentId: string | null,
    position: number,
    setSize: number,
  ) => {
    const kids = visibleChildren(node.children, hidden);
    const isCollapsed = kids.length > 0 && collapsed.has(node.span.id);
    const summary: TraceNode[] = [];
    if (isCollapsed) collect(node, summary);
    rows.push({
      node,
      depth,
      lines,
      last,
      childCount: kids.length,
      collapsed: isCollapsed,
      hiddenCount: summary.length,
      summary: summary.slice(0, 60),
      parentId,
      position,
      setSize,
    });
    if (isCollapsed) return;
    const childLines = depth === 0 ? [] : [...lines, !last];
    kids.forEach((kid, i) =>
      visit(
        kid,
        depth + 1,
        childLines,
        i === kids.length - 1,
        node.span.id,
        i + 1,
        kids.length,
      ),
    );
  };
  const roots = visibleChildren(model.roots, hidden);
  roots.forEach((root, i) =>
    visit(root, 0, [], i === roots.length - 1, null, i + 1, roots.length),
  );
  // The overview ignores collapsing but follows the service filter.
  for (const root of roots) {
    flat.push(root);
    collect(root, flat);
  }
  return { rows, flat };
}

/* ------------------------------------------------------------------------ */
/* Hooks                                                                     */
/* ------------------------------------------------------------------------ */

function useReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set] as const;
}

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50";
const toolButton = cn(
  "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 aria-pressed:bg-muted aria-pressed:text-foreground motion-reduce:transition-none",
  focusRing,
);

/** Position inside the timeline column from the animated view variables. */
const at = (ms: number) =>
  `calc((${tidy(ms)} - var(--trace-v0)) / var(--trace-vs) * 100%)`;
const span = (ms: number) => `calc(${tidy(ms)} / var(--trace-vs) * 100%)`;

const INDENT = 12;
const PAD = 10;

/* ------------------------------------------------------------------------ */
/* Row                                                                       */
/* ------------------------------------------------------------------------ */

interface TraceRowProps {
  row: TraceRowModel;
  index: number;
  rowHeight: number;
  color: string;
  colorOf: (service: string) => string;
  selected: boolean;
  tabStop: boolean;
  emphasis: "critical" | "dim" | "normal";
  labelSide: "after" | "before" | "inside";
  /** The span lies outside the zoomed time range. */
  outside: boolean;
  format: (ms: number) => string;
  onToggle: (id: string) => void;
  onActivate: (id: string) => void;
  onFocusRow: (id: string) => void;
}

const TraceRow = React.memo(function TraceRow({
  row,
  index,
  rowHeight,
  color,
  colorOf,
  selected,
  tabStop,
  emphasis,
  labelSide,
  outside,
  format,
  onToggle,
  onActivate,
  onFocusRow,
}: TraceRowProps) {
  const { node, depth } = row;
  const { span: s } = node;
  const isError = s.status === "error";
  const barHeight = Math.max(6, Math.round(rowHeight * 0.43));
  const elbowX = (column: number) => PAD + column * INDENT + 7;
  const duration = format(s.duration);

  return (
    <div
      role="treeitem"
      data-slot="trace-row"
      data-span-id={s.id}
      data-selected={selected || undefined}
      data-outside={outside || undefined}
      data-error={isError || undefined}
      data-critical={node.critical || undefined}
      aria-level={depth + 1}
      aria-setsize={row.setSize}
      aria-posinset={row.position}
      aria-expanded={row.childCount > 0 ? !row.collapsed : undefined}
      aria-selected={selected}
      aria-label={`${s.name}, ${s.service}, ${duration}${isError ? ", error" : ""}${row.collapsed ? `, ${row.hiddenCount} hidden` : ""}`}
      tabIndex={tabStop ? 0 : -1}
      onFocus={() => onFocusRow(s.id)}
      onClick={() => onActivate(s.id)}
      className={cn(
        "group/row absolute inset-x-0 grid cursor-default grid-cols-(--trace-cols) transition-colors duration-100 outline-none motion-reduce:transition-none",
        "hover:bg-muted/55 focus-visible:z-[1] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset",
        selected &&
          "bg-primary/[0.07] shadow-[inset_2px_0_0_var(--color-primary)] hover:bg-primary/10",
      )}
      style={{ top: index * rowHeight, height: rowHeight }}
    >
      <div
        data-slot="trace-row-label"
        className="relative flex min-w-0 items-center gap-1.5 border-r pr-2.5"
        style={{ paddingLeft: PAD + depth * INDENT }}
      >
        {depth > 0 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0"
          >
            {row.lines.map((continues, column) =>
              continues ? (
                <span
                  key={column}
                  className="absolute inset-y-0 w-px bg-border"
                  style={{ left: elbowX(column) }}
                />
              ) : null,
            )}
            <span
              className="absolute top-0 w-px bg-border"
              style={{
                left: elbowX(depth - 1),
                height: row.last ? "50%" : "100%",
              }}
            />
            <span
              className="absolute top-1/2 h-px bg-border"
              style={{
                left: elbowX(depth - 1),
                width: row.childCount > 0 ? 6 : 12,
              }}
            />
          </span>
        )}
        {row.childCount > 0 ? (
          // Not a tab stop: the row itself takes Left and Right to collapse and expand.
          <span
            aria-hidden="true"
            data-slot="trace-row-toggle"
            onClick={(event) => {
              event.stopPropagation();
              onToggle(s.id);
            }}
            className="relative -mx-px inline-flex size-3.5 shrink-0 cursor-pointer items-center justify-center rounded-[3px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronRight
              className={cn(
                "size-3 transition-transform duration-150 motion-reduce:transition-none",
                !row.collapsed && "rotate-90",
              )}
              strokeWidth={2.25}
            />
          </span>
        ) : (
          <span aria-hidden="true" className="w-3.5 shrink-0" />
        )}
        <span
          aria-hidden="true"
          className="relative size-2 shrink-0 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 0 2px color-mix(in oklab, ${color} 18%, transparent)`,
          }}
        />
        <span
          className={cn(
            "min-w-0 truncate text-xs transition-opacity duration-200 motion-reduce:transition-none",
            depth === 0 ? "font-semibold" : "font-medium text-foreground/90",
            outside && "opacity-45",
          )}
        >
          {s.name}
        </span>
        {isError && (
          <AlertTriangle
            aria-hidden="true"
            className="size-3 shrink-0 text-destructive"
          />
        )}
        {row.collapsed && (
          <span className="shrink-0 rounded-[4px] border px-1 font-mono text-[10px] leading-3.5 text-muted-foreground tabular-nums">
            +{row.hiddenCount}
          </span>
        )}
        <span
          className={cn(
            "ml-auto shrink-0 pl-1 font-mono text-[11px] tabular-nums @max-sm/trace:hidden",
            isError
              ? "text-destructive"
              : emphasis === "critical"
                ? "font-medium text-foreground"
                : "text-muted-foreground",
          )}
        >
          {duration}
        </span>
      </div>

      <div
        data-slot="trace-row-timeline"
        className="relative min-w-0 overflow-hidden"
      >
        {row.collapsed &&
          row.summary.map((child) => (
            <span
              key={child.span.id}
              aria-hidden="true"
              className="absolute h-[3px] rounded-full opacity-60"
              style={{
                left: at(child.span.start),
                width: `max(2px, ${span(child.end - child.span.start)})`,
                bottom: Math.max(
                  2,
                  Math.round((rowHeight - barHeight) / 2) - 5,
                ),
                background:
                  child.span.status === "error"
                    ? DESTRUCTIVE
                    : colorOf(child.span.service),
              }}
            />
          ))}
        <span
          data-slot="trace-bar"
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-[3px] transition-[opacity,box-shadow,filter] duration-200 motion-reduce:transition-none",
            emphasis === "dim" && "opacity-40 group-hover/row:opacity-75",
            selected && "ring-2 ring-primary/55 ring-offset-1 ring-offset-card",
            isError && "ring-1 ring-destructive/70 ring-inset",
          )}
          style={{
            left: at(s.start),
            width: `max(2px, ${span(node.end - s.start)})`,
            height: barHeight,
            background: isError ? errorFill : color,
            boxShadow:
              emphasis === "critical" && !selected
                ? `0 0 0 1px color-mix(in oklab, ${color} 55%, transparent), 0 1px 6px -1px color-mix(in oklab, ${color} 55%, transparent)`
                : undefined,
          }}
        >
          <span
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-[3px] font-mono text-[10px] leading-4 whitespace-nowrap tabular-nums opacity-0 transition-opacity duration-150 group-hover/row:opacity-100 motion-reduce:transition-none @max-sm/trace:opacity-100",
              selected && "opacity-100",
              labelSide === "after" && "left-full ml-1.5 text-foreground",
              labelSide === "before" && "right-full mr-1.5 text-foreground",
              labelSide === "inside" &&
                "right-1 bg-card/90 px-1 text-foreground shadow-xs",
            )}
          >
            {duration}
          </span>
        </span>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------------ */
/* Attributes                                                                */
/* ------------------------------------------------------------------------ */

export interface TraceSpanAttributesProps extends React.ComponentProps<"dl"> {
  attributes?: Record<string, TraceSpanAttributeValue>;
}

/** The default attribute table of the detail panel, exported for custom detail layouts. */
export function TraceSpanAttributes({
  attributes,
  className,
  ...props
}: TraceSpanAttributesProps) {
  const entries = Object.entries(attributes ?? {});
  if (!entries.length)
    return (
      <p className="py-1 text-xs text-muted-foreground">
        No attributes recorded.
      </p>
    );
  return (
    <dl
      data-slot="trace-attributes"
      className={cn(
        "grid grid-cols-[minmax(6rem,auto)_minmax(0,1fr)] gap-x-5 text-xs",
        className,
      )}
      {...props}
    >
      {entries.map(([key, value]) => (
        <React.Fragment key={key}>
          <dt className="truncate border-t border-dashed py-1.5 font-mono text-[11px] text-muted-foreground first-of-type:border-t-0">
            {key}
          </dt>
          <dd
            className={cn(
              "min-w-0 border-t border-dashed py-1.5 font-mono text-[11px] break-all tabular-nums first-of-type:border-t-0",
              typeof value === "boolean" &&
                (value
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-muted-foreground"),
              typeof value === "number" && "text-foreground",
            )}
          >
            {typeof value === "number"
              ? value.toLocaleString("en-US")
              : String(value)}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------------ */
/* TraceWaterfall                                                            */
/* ------------------------------------------------------------------------ */

/**
 * A distributed-trace waterfall: a collapsible span tree beside a time axis. Drag across
 * the axis to zoom, click a span for its detail, and follow the critical path at a glance.
 */
export function TraceWaterfall({
  spans,
  title,
  description,
  actions,
  selectedId: selectedProp,
  defaultSelectedId = null,
  onSelectedChange,
  highlightCriticalPath: highlightProp,
  defaultHighlightCriticalPath = true,
  onHighlightCriticalPathChange,
  defaultCollapsedIds,
  serviceColors,
  durationFormatter = formatDuration,
  renderDetail,
  rowHeight = 28,
  height = 360,
  treeWidth,
  showOverview = true,
  showLegend = true,
  onZoomChange,
  className,
  style,
  ...props
}: TraceWaterfallProps) {
  const id = React.useId();
  const reduced = useReducedMotion();
  const model = React.useMemo(() => buildModel(spans), [spans]);
  const format = durationFormatter;

  const colors = React.useMemo(() => {
    const map = new Map<string, string>();
    model.services.forEach((service, i) =>
      map.set(
        service.name,
        serviceColors?.[service.name] ?? PALETTE[i % PALETTE.length],
      ),
    );
    return map;
  }, [model, serviceColors]);
  const colorOf = React.useCallback(
    (service: string) => colors.get(service) ?? PALETTE[0],
    [colors],
  );

  const [selectedId, setSelectedRaw] = useControllable<string | null>(
    selectedProp,
    defaultSelectedId,
  );
  const [highlight, setHighlight] = useControllable(
    highlightProp,
    defaultHighlightCriticalPath,
    onHighlightCriticalPathChange,
  );
  const [collapsed, setCollapsed] = React.useState(
    () => new Set(defaultCollapsedIds ?? []),
  );
  const [hidden, setHidden] = React.useState<Set<string>>(() => new Set());
  const [view, setViewState] = React.useState<TraceTimeRange | null>(null);
  const [focusId, setFocusId] = React.useState<string | null>(null);
  const [frac, setFrac] = React.useState<number | null>(null);
  const [width, setWidth] = React.useState(0);
  const [axisWidth, setAxisWidth] = React.useState(0);
  const [scroll, setScroll] = React.useState({ top: 0, height });

  const rootRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const axisRef = React.useRef<HTMLDivElement>(null);
  const treeRef = React.useRef<HTMLDivElement>(null);
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const readoutRef = React.useRef<HTMLDivElement>(null);
  const brushRef = React.useRef<HTMLDivElement>(null);
  const overviewCursorRef = React.useRef<HTMLDivElement>(null);
  const pendingFocus = React.useRef<string | null>(null);
  const suppressClick = React.useRef(false);

  const selectedNode = selectedId
    ? (model.nodes.get(selectedId) ?? null)
    : null;

  const select = React.useCallback(
    (next: string | null) => {
      setSelectedRaw(next);
      onSelectedChange?.(
        next,
        next ? (model.nodes.get(next)?.span ?? null) : null,
      );
    },
    [model, onSelectedChange, setSelectedRaw],
  );

  // A selection inside a collapsed branch opens the branch so the row can be seen.
  React.useEffect(() => {
    if (!selectedNode) return;
    setCollapsed((current) => {
      let next: Set<string> | null = null;
      for (let p = selectedNode.parent; p; p = p.parent)
        if (current.has(p.span.id))
          (next ??= new Set(current)).delete(p.span.id);
      return next ?? current;
    });
  }, [selectedNode]);

  const { rows, flat } = React.useMemo(
    () => buildRows(model, collapsed, hidden),
    [model, collapsed, hidden],
  );
  const indexOf = React.useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((row, i) => map.set(row.node.span.id, i));
    return map;
  }, [rows]);

  /* ---------------------------------------------------------------- view */

  const t0 = model.start;
  const total = model.duration;
  const target = view ?? ([t0, t0 + total] as TraceTimeRange);
  const v0 = target[0];
  const vs = Math.max(1e-6, target[1] - target[0]);
  const zoomed = view != null;
  const displayed = React.useRef({ v0, vs });

  const setView = React.useCallback(
    (next: TraceTimeRange | null) => {
      setViewState(next);
      onZoomChange?.(next);
    },
    [onZoomChange],
  );

  // Clear a zoom that no longer fits new data.
  React.useEffect(() => {
    setViewState((current) =>
      current && (current[1] <= model.start || current[0] >= model.end)
        ? null
        : current,
    );
  }, [model]);

  // Tween the view variables; React only renders the target, so zooming never re-renders per frame.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const apply = (a: number, s: number) => {
      displayed.current = { v0: a, vs: s };
      root.style.setProperty("--trace-v0", String(tidy(a)));
      root.style.setProperty("--trace-vs", String(tidy(s)));
    };
    const from = displayed.current;
    if (
      reduced ||
      (Math.abs(from.v0 - v0) < 1e-9 && Math.abs(from.vs - vs) < 1e-9)
    ) {
      apply(v0, vs);
      return;
    }
    apply(from.v0, from.vs);
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - started) / 460);
      const e = 1 - (1 - p) ** 4;
      // Interpolate the span geometrically so zooming feels even at every scale.
      const s = from.vs * (vs / from.vs) ** e;
      const fromCenter = from.v0 + from.vs / 2;
      const toCenter = v0 + vs / 2;
      apply(fromCenter + (toCenter - fromCenter) * e - s / 2, s);
      if (p < 1) frame = requestAnimationFrame(tick);
      else apply(v0, vs);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [v0, vs, reduced]);

  const isEmpty = model.ordered.length === 0;
  const ticks = React.useMemo(() => {
    if (isEmpty) return { step: 1, list: [] };
    const count = Math.max(2, Math.floor((axisWidth || 360) / 84));
    const step = niceStep(vs, count);
    const out: { value: number; label: string }[] = [];
    for (
      let t = Math.ceil(v0 / step - 1e-9) * step;
      t <= v0 + vs + step * 1e-6;
      t += step
    )
      out.push({ value: tidy(t), label: tickLabel(tidy(t), step) });
    return { step, list: out };
  }, [v0, vs, axisWidth, isEmpty]);

  // After zooming, bring the first span inside the new range into view if none is showing.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!view || !el) return;
    const overlaps = (row: TraceRowModel) =>
      row.depth > 0 &&
      row.node.end >= view[0] &&
      row.node.span.start <= view[1];
    const top = Math.floor(el.scrollTop / rowHeight);
    const bottom = Math.ceil((el.scrollTop + el.clientHeight - 28) / rowHeight);
    if (rows.slice(top, bottom).some(overlaps)) return;
    const index = rows.findIndex(overlaps);
    if (index < 0) return;
    el.scrollTo({
      top: Math.max(0, (index - 1) * rowHeight),
      behavior: reduced ? "auto" : "smooth",
    });
    // Rows are only read when the zoom changes, not when they do.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  /* -------------------------------------------------------------- layout */

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const axis = axisRef.current;
    if (!root || !axis) return;
    const measure = () => {
      setWidth(root.clientWidth);
      setAxisWidth(axis.clientWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(axis);
    return () => observer.disconnect();
  }, []);

  const treeShare = Math.min(
    0.7,
    Math.max(0.2, frac ?? treeWidth ?? (width && width < 560 ? 0.5 : 0.4)),
  );
  const contentHeight = rows.length * rowHeight;
  // The axis row is 28px; an empty list keeps room for its message.
  const viewportHeight = rows.length
    ? Math.min(height, contentHeight + 28)
    : 128;

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const top = el.scrollTop;
    const h = el.clientHeight;
    setScroll((current) =>
      Math.floor(current.top / rowHeight) === Math.floor(top / rowHeight) &&
      current.height === h
        ? current
        : { top, height: h },
    );
  };

  const overscan = 8;
  const first = Math.max(0, Math.floor(scroll.top / rowHeight) - overscan);
  const last = Math.min(
    rows.length,
    Math.ceil((scroll.top + scroll.height) / rowHeight) + overscan,
  );
  const stopId =
    focusId && indexOf.has(focusId)
      ? focusId
      : selectedId && indexOf.has(selectedId)
        ? selectedId
        : (rows[0]?.node.span.id ?? null);
  const stopIndex = stopId ? (indexOf.get(stopId) ?? -1) : -1;

  const scrollToIndex = React.useCallback(
    (index: number, center = false) => {
      const el = scrollRef.current;
      if (!el || index < 0) return;
      const header = 28;
      const top = index * rowHeight;
      const view = el.clientHeight - header;
      if (center) {
        if (top < el.scrollTop || top + rowHeight > el.scrollTop + view)
          el.scrollTop = Math.max(0, top - view / 2 + rowHeight / 2);
      } else if (top < el.scrollTop) el.scrollTop = top;
      else if (top + rowHeight > el.scrollTop + view)
        el.scrollTop = top + rowHeight - view;
    },
    [rowHeight],
  );

  // Bring an outside selection into view.
  const lastSelected = React.useRef<string | null>(null);
  React.useLayoutEffect(() => {
    if (selectedId === lastSelected.current) return;
    lastSelected.current = selectedId;
    if (selectedId && indexOf.has(selectedId))
      scrollToIndex(indexOf.get(selectedId)!, true);
  }, [selectedId, indexOf, scrollToIndex]);

  React.useLayoutEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    const element = treeRef.current?.querySelector<HTMLElement>(
      `[data-span-id="${CSS.escape(target)}"]`,
    );
    element?.focus({ preventScroll: true });
  });

  /* --------------------------------------------------------- interaction */

  const toggle = React.useCallback((spanId: string) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(spanId)) next.delete(spanId);
      else next.add(spanId);
      return next;
    });
  }, []);

  const selectedRef = React.useRef(selectedId);
  selectedRef.current = selectedId;
  const activate = React.useCallback(
    (spanId: string) => {
      if (suppressClick.current) return;
      setFocusId(spanId);
      select(selectedRef.current === spanId ? null : spanId);
    },
    [select],
  );

  const moveFocus = (index: number) => {
    const row = rows[Math.max(0, Math.min(rows.length - 1, index))];
    if (!row) return;
    pendingFocus.current = row.node.span.id;
    setFocusId(row.node.span.id);
    scrollToIndex(indexOf.get(row.node.span.id)!);
  };

  const onTreeKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const spanId = target.dataset.spanId;
    if (!spanId || target.dataset.slot !== "trace-row") return;
    const index = indexOf.get(spanId) ?? 0;
    const row = rows[index];
    const page = Math.max(1, Math.floor((scroll.height - 28) / rowHeight) - 1);
    switch (event.key) {
      case "ArrowDown":
        moveFocus(index + 1);
        break;
      case "ArrowUp":
        moveFocus(index - 1);
        break;
      case "Home":
        moveFocus(0);
        break;
      case "End":
        moveFocus(rows.length - 1);
        break;
      case "PageDown":
        moveFocus(index + page);
        break;
      case "PageUp":
        moveFocus(index - page);
        break;
      case "ArrowRight":
        if (row.childCount > 0 && row.collapsed) toggle(spanId);
        else if (row.childCount > 0) moveFocus(index + 1);
        break;
      case "ArrowLeft":
        if (row.childCount > 0 && !row.collapsed) toggle(spanId);
        else if (row.parentId && indexOf.has(row.parentId))
          moveFocus(indexOf.get(row.parentId)!);
        break;
      case "Enter":
      case " ":
        select(selectedId === spanId ? null : spanId);
        break;
      case "Escape":
        if (selectedId) select(null);
        else if (zoomed) setView(null);
        else return;
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  // Pointer: hover draws a cursor with a time readout; dragging across the axis zooms.
  const drag = React.useRef<{ x: number; id: number; active: boolean } | null>(
    null,
  );
  const axisRect = () => axisRef.current?.getBoundingClientRect() ?? null;
  const timeAtX = (x: number, rect: DOMRect) => {
    const f = Math.min(1, Math.max(0, (x - rect.left) / (rect.width || 1)));
    return displayed.current.v0 + f * displayed.current.vs;
  };

  const showCursor = (clientX: number | null) => {
    const rect = axisRect();
    const cursor = cursorRef.current;
    const readout = readoutRef.current;
    const overview = overviewCursorRef.current;
    const inside =
      rect && clientX !== null && clientX >= rect.left && clientX <= rect.right;
    for (const el of [cursor, readout, overview])
      if (el) el.style.opacity = inside ? "1" : "0";
    if (!inside || !rect) return;
    const x = clientX - rect.left;
    const time = timeAtX(clientX, rect);
    if (cursor) cursor.style.transform = `translateX(${x}px)`;
    if (readout) {
      const brush = drag.current?.active ? drag.current : null;
      if (brush) {
        const a = timeAtX(brush.x, rect);
        const [lo, hi] = a < time ? [a, time] : [time, a];
        readout.textContent = `${tickLabel(lo, vs / 50)} – ${tickLabel(hi, vs / 50)} · ${format(hi - lo)}`;
      } else readout.textContent = format(time - t0);
      const w = readout.offsetWidth;
      readout.style.transform = `translateX(${Math.min(Math.max(0, x - w / 2), rect.width - w)}px)`;
    }
    if (overview) overview.style.left = `${((time - t0) / total) * 100}%`;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || event.pointerType === "touch") return;
    const rect = axisRect();
    if (!rect || event.clientX < rect.left || event.clientX > rect.right)
      return;
    if ((event.target as HTMLElement).closest('[role="separator"]')) return;
    drag.current = { x: event.clientX, id: event.pointerId, active: false };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const rect = axisRect();
    if (d && rect && event.pointerId === d.id) {
      if (!d.active && Math.abs(event.clientX - d.x) > 4) {
        d.active = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      if (d.active && brushRef.current) {
        const a = Math.min(Math.max(d.x, rect.left), rect.right) - rect.left;
        const b =
          Math.min(Math.max(event.clientX, rect.left), rect.right) - rect.left;
        brushRef.current.style.display = "block";
        brushRef.current.style.left = `${Math.min(a, b)}px`;
        brushRef.current.style.width = `${Math.abs(b - a)}px`;
      }
    }
    showCursor(event.clientX);
  };

  const endDrag = (
    event: React.PointerEvent<HTMLDivElement>,
    commit: boolean,
  ) => {
    const d = drag.current;
    drag.current = null;
    if (brushRef.current) brushRef.current.style.display = "none";
    if (!d?.active) return;
    const rect = axisRect();
    if (commit && rect) {
      const a = timeAtX(d.x, rect);
      const b = timeAtX(event.clientX, rect);
      const lo = Math.max(t0, Math.min(a, b));
      const hi = Math.min(t0 + total, Math.max(a, b));
      if (hi - lo > Math.max(total / 5000, 1e-3)) setView([lo, hi]);
    }
    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 0);
    showCursor(event.clientX);
  };

  const onDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = axisRect();
    if (
      zoomed &&
      rect &&
      event.clientX >= rect.left &&
      event.clientX <= rect.right
    )
      setView(null);
  };

  // Column divider: drag or use the arrow keys.
  const onSeparatorPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const root = rootRef.current;
    if (!root) return;
    const rect =
      scrollRef.current?.getBoundingClientRect() ??
      root.getBoundingClientRect();
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
    const move = (e: PointerEvent) =>
      setFrac(
        Math.min(0.7, Math.max(0.2, (e.clientX - rect.left) / rect.width)),
      );
    const up = () => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", up);
      target.removeEventListener("pointercancel", up);
    };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", up);
    target.addEventListener("pointercancel", up);
  };

  const collapsibleIds = React.useMemo(
    () =>
      model.ordered
        .filter((node) => node.depth > 0 && node.children.length > 0)
        .map((node) => node.span.id),
    [model],
  );
  const anyCollapsed = rows.some((row) => row.collapsed);

  /* ------------------------------------------------------------ derived */

  const emphasisOf = (node: TraceNode): TraceRowProps["emphasis"] =>
    highlight ? (node.critical ? "critical" : "dim") : "normal";
  const labelSideOf = (node: TraceNode): TraceRowProps["labelSide"] => {
    const a = (node.span.start - v0) / vs;
    const b = (node.end - v0) / vs;
    if (b < 0.78) return "after";
    if (a > 0.22) return "before";
    return "inside";
  };

  const info = (node: TraceNode): TraceSpanInfo => ({
    span: node.span,
    parent: node.parent?.span ?? null,
    children: node.children.map((child) => child.span),
    depth: node.depth,
    descendantCount: node.descendants,
    selfTime: node.self,
    share: (node.end - node.span.start) / total,
    critical: node.critical,
    color: colorOf(node.span.service),
    trace: { start: t0, end: t0 + total, duration: total },
  });

  // Keep the last span while the panel animates closed.
  const [shownNode, setShownNode] = React.useState<TraceNode | null>(
    selectedNode,
  );
  if (selectedNode && selectedNode !== shownNode) setShownNode(selectedNode);

  const label = typeof title === "string" ? title : "Trace spans";
  const services = model.services;
  const renderIndices: number[] = [];
  for (let i = first; i < last; i++) renderIndices.push(i);
  if (stopIndex >= 0 && (stopIndex < first || stopIndex >= last))
    renderIndices.push(stopIndex);

  return (
    <div
      ref={rootRef}
      data-slot="trace-waterfall"
      data-zoomed={zoomed || undefined}
      className={cn(
        "@container/trace flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs",
        className,
      )}
      style={
        {
          "--trace-v0": tidy(v0),
          "--trace-vs": tidy(vs),
          "--trace-t0": tidy(t0),
          "--trace-total": tidy(total),
          "--trace-tree": `${(treeShare * 100).toFixed(2)}%`,
          "--trace-cols": "minmax(0, var(--trace-tree)) minmax(0, 1fr)",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <div
        data-slot="trace-header"
        className="flex items-start gap-3 px-4 pt-3.5 pb-3"
      >
        <div className="min-w-0 flex-1 space-y-1">
          {title != null && (
            <h3 className="truncate text-sm leading-5 font-semibold tracking-tight">
              {title}
            </h3>
          )}
          <div
            data-slot="trace-summary"
            className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] leading-4 text-muted-foreground tabular-nums"
          >
            <span>
              <span className="font-medium text-foreground">
                {isEmpty ? "—" : format(total)}
              </span>
            </span>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <span>
              {spans.length} {spans.length === 1 ? "span" : "spans"}
            </span>
            <span
              aria-hidden="true"
              className="hidden text-border @sm/trace:inline"
            >
              /
            </span>
            <span className="hidden @sm/trace:inline">
              {services.length} {services.length === 1 ? "service" : "services"}
            </span>
            {model.errors > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-1.5 font-sans text-[11px] font-medium text-destructive">
                <AlertTriangle aria-hidden="true" className="size-3" />
                {model.errors} {model.errors === 1 ? "error" : "errors"}
              </span>
            )}
          </div>
          {description != null && (
            <p
              id={`${id}-description`}
              className="text-xs text-muted-foreground"
            >
              {description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {actions}
          <div
            role="toolbar"
            aria-label="Trace tools"
            className="flex items-center gap-0.5"
          >
            <button
              type="button"
              className={toolButton}
              aria-pressed={highlight}
              title="Highlight the critical path"
              onClick={() => setHighlight(!highlight)}
            >
              <Route className="size-4" aria-hidden="true" />
              <span className="sr-only">Highlight the critical path</span>
            </button>
            <button
              type="button"
              className={toolButton}
              title={anyCollapsed ? "Expand all" : "Collapse all"}
              disabled={!collapsibleIds.length}
              onClick={() =>
                setCollapsed(anyCollapsed ? new Set() : new Set(collapsibleIds))
              }
            >
              {anyCollapsed ? (
                <FoldDown className="size-4" aria-hidden="true" />
              ) : (
                <FoldUp className="size-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {anyCollapsed ? "Expand all" : "Collapse all"}
              </span>
            </button>
            <button
              type="button"
              className={toolButton}
              title="Reset zoom"
              disabled={!zoomed}
              onClick={() => setView(null)}
            >
              <ZoomReset className="size-4" aria-hidden="true" />
              <span className="sr-only">Reset zoom</span>
            </button>
          </div>
        </div>
      </div>

      {showOverview && !isEmpty && (
        <TraceOverview
          nodes={flat}
          start={t0}
          total={total}
          zoomed={zoomed}
          colorOf={colorOf}
          highlight={highlight}
          cursorRef={overviewCursorRef}
          onRange={setView}
          viewStart={target[0]}
          viewEnd={target[1]}
        />
      )}

      <div
        ref={scrollRef}
        data-slot="trace-scroll"
        className="relative mt-3 touch-pan-y overflow-y-auto overscroll-contain border-t select-none"
        style={{ height: viewportHeight }}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => endDrag(event, true)}
        onPointerCancel={(event) => endDrag(event, false)}
        onPointerLeave={() => {
          if (!drag.current?.active) showCursor(null);
        }}
        onDoubleClick={onDoubleClick}
      >
        <div
          data-slot="trace-axis"
          className="sticky top-0 z-20 grid h-7 grid-cols-(--trace-cols) border-b bg-card"
        >
          <div className="flex min-w-0 items-center justify-between gap-2 border-r pr-2.5 pl-3 font-mono text-[10.5px] text-muted-foreground">
            <span className="truncate">Span</span>
            <span className="@max-sm/trace:hidden">Duration</span>
          </div>
          <div
            ref={axisRef}
            className={cn(
              "relative min-w-0 overflow-hidden",
              zoomed ? "cursor-zoom-out" : "cursor-crosshair",
            )}
            title={
              zoomed
                ? "Drag to zoom further, double-click to reset"
                : "Drag across the axis to zoom"
            }
          >
            {ticks.list.map((tick) => (
              <span
                key={`${ticks.step}-${tick.value}`}
                className="absolute inset-y-0 flex items-center border-l border-border pl-1 font-mono text-[10px] leading-none whitespace-nowrap text-muted-foreground tabular-nums motion-safe:animate-[trace-fade_.35s_ease-out_both]"
                style={{ left: at(tick.value) }}
              >
                {/* A label that would be clipped at the right edge keeps only its line. */}
                {(tick.value - v0) / vs <= 0.93 ? tick.label : null}
              </span>
            ))}
            <div
              ref={readoutRef}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-0 z-10 -mt-2 h-4 rounded-[4px] bg-foreground px-1.5 font-mono text-[10px] leading-4 whitespace-nowrap text-background tabular-nums opacity-0 shadow-sm"
            />
          </div>
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize span column"
            aria-valuemin={20}
            aria-valuemax={70}
            aria-valuenow={Math.round(treeShare * 100)}
            tabIndex={0}
            onPointerDown={onSeparatorPointerDown}
            onKeyDown={(event) => {
              const delta =
                event.key === "ArrowLeft"
                  ? -0.02
                  : event.key === "ArrowRight"
                    ? 0.02
                    : 0;
              if (!delta) return;
              event.preventDefault();
              setFrac(Math.min(0.7, Math.max(0.2, treeShare + delta)));
            }}
            className="group/sep absolute inset-y-0 z-10 w-2 -translate-x-1/2 cursor-col-resize outline-none"
            style={{ left: "var(--trace-tree)" }}
          >
            <span className="absolute inset-y-1 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-transparent transition-colors group-hover/sep:bg-primary/60 group-focus-visible/sep:bg-ring" />
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="py-10 text-center text-xs text-muted-foreground">
            {spans.length
              ? "Every service is filtered out."
              : "No spans in this trace."}
          </p>
        ) : (
          <div
            ref={treeRef}
            role="tree"
            aria-label={label}
            aria-describedby={
              description != null ? `${id}-description` : undefined
            }
            onKeyDown={onTreeKeyDown}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node))
                setFocusId(null);
            }}
            className="relative"
            style={{ height: contentHeight }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 grid grid-cols-(--trace-cols)"
            >
              <div />
              <div className="relative overflow-hidden">
                {ticks.list.map((tick) => (
                  <span
                    key={`${ticks.step}-${tick.value}`}
                    className="absolute inset-y-0 w-px bg-border/55 motion-safe:animate-[trace-fade_.35s_ease-out_both]"
                    style={{ left: at(tick.value) }}
                  />
                ))}
              </div>
            </div>

            {renderIndices.map((i) => {
              const row = rows[i];
              const node = row.node;
              return (
                <TraceRow
                  key={node.span.id}
                  row={row}
                  index={i}
                  rowHeight={rowHeight}
                  color={colorOf(node.span.service)}
                  colorOf={colorOf}
                  selected={node.span.id === selectedId}
                  tabStop={node.span.id === stopId}
                  emphasis={emphasisOf(node)}
                  labelSide={labelSideOf(node)}
                  outside={
                    zoomed && (node.end < v0 || node.span.start > v0 + vs)
                  }
                  format={format}
                  onToggle={toggle}
                  onActivate={activate}
                  onFocusRow={setFocusId}
                />
              );
            })}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 grid grid-cols-(--trace-cols)"
            >
              <div />
              <div className="relative overflow-hidden">
                <div
                  ref={cursorRef}
                  className="absolute inset-y-0 left-0 w-px bg-foreground/45 opacity-0 transition-opacity duration-100"
                />
                <div
                  ref={brushRef}
                  className="absolute inset-y-0 hidden border-x border-primary/70 bg-primary/10"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <TraceDetail
        node={shownNode}
        open={selectedNode != null}
        info={shownNode ? info(shownNode) : null}
        format={format}
        renderDetail={renderDetail}
        onClose={() => select(null)}
        onSelect={select}
      />

      {showLegend && services.length > 0 && (
        <div
          data-slot="trace-legend"
          className="flex flex-wrap items-center gap-1 border-t px-3 py-2"
          role="group"
          aria-label="Show or hide services"
        >
          {services.map((service) => {
            const visible = !hidden.has(service.name);
            const color = colorOf(service.name);
            return (
              <button
                key={service.name}
                type="button"
                aria-pressed={visible}
                title={
                  visible ? `Hide ${service.name}` : `Show ${service.name}`
                }
                onClick={() =>
                  setHidden((current) => {
                    const next = new Set(current);
                    if (next.has(service.name)) next.delete(service.name);
                    else next.add(service.name);
                    return next;
                  })
                }
                className={cn(
                  "inline-flex h-6 items-center gap-1.5 rounded-md border px-1.5 text-xs transition-colors motion-reduce:transition-none",
                  visible
                    ? "border-transparent text-foreground hover:bg-muted"
                    : "border-dashed border-border text-muted-foreground line-through decoration-muted-foreground/50 hover:text-foreground",
                  focusRing,
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-2 rounded-[2px]"
                  style={
                    visible
                      ? { background: color }
                      : { boxShadow: `inset 0 0 0 1px ${color}` }
                  }
                />
                <span className="font-medium">{service.name}</span>
                <span className="font-mono text-[10.5px] text-muted-foreground tabular-nums">
                  {service.count}
                </span>
                {service.errors > 0 && (
                  <span
                    className="inline-flex items-center gap-0.5 font-mono text-[10.5px] text-destructive tabular-nums"
                    title={`${service.errors} ${service.errors === 1 ? "error" : "errors"}`}
                  >
                    <AlertTriangle aria-hidden="true" className="size-2.5" />
                    {service.errors}
                    <span className="sr-only">
                      {" "}
                      {service.errors === 1 ? "error" : "errors"}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
          {hidden.size > 0 && (
            <button
              type="button"
              onClick={() => setHidden(new Set())}
              className={cn(
                "ml-auto h-6 rounded-md px-2 text-xs font-medium text-primary hover:bg-muted",
                focusRing,
              )}
            >
              Show all
            </button>
          )}
        </div>
      )}

      <style href="overtrue-trace-waterfall" precedence="default">
        {`@keyframes trace-fade{from{opacity:0}to{opacity:1}}`}
      </style>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Overview                                                                  */
/* ------------------------------------------------------------------------ */

interface TraceOverviewProps {
  nodes: TraceNode[];
  start: number;
  total: number;
  viewStart: number;
  viewEnd: number;
  zoomed: boolean;
  colorOf: (service: string) => string;
  highlight: boolean;
  cursorRef: React.RefObject<HTMLDivElement | null>;
  onRange: (range: TraceTimeRange | null) => void;
}

const TraceOverview = React.memo(function TraceOverview({
  nodes,
  start,
  total,
  viewStart,
  viewEnd,
  zoomed,
  colorOf,
  highlight,
  cursorRef,
  onRange,
}: TraceOverviewProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const brushRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ x: number; active: boolean } | null>(null);
  // A mini icicle: one band per depth, split into lanes only where siblings overlap.
  const lanes = React.useMemo(() => {
    const byDepth = new Map<number, TraceNode[]>();
    for (const node of nodes) {
      const list = byDepth.get(node.depth) ?? [];
      list.push(node);
      byDepth.set(node.depth, list);
    }
    const placed: { node: TraceNode; lane: number }[] = [];
    let offset = 0;
    for (const depth of [...byDepth.keys()].sort((a, b) => a - b)) {
      const ends: number[] = [];
      const list = byDepth
        .get(depth)!
        .sort((a, b) => a.span.start - b.span.start);
      for (const node of list) {
        let lane = ends.findIndex((end) => end <= node.span.start + 1e-9);
        if (lane < 0) lane = ends.push(0) - 1;
        ends[lane] = node.end;
        placed.push({ node, lane: offset + lane });
      }
      offset += ends.length;
    }
    return { placed, count: offset };
  }, [nodes]);
  const laneHeight = Math.min(7, 30 / Math.max(1, lanes.count));
  const lens = (a: number) =>
    `calc((var(--trace-v0) - ${tidy(start)}) / ${tidy(total)} * 100% + ${a}px)`;

  const timeAt = (clientX: number) => {
    const rect = ref.current!.getBoundingClientRect();
    return (
      start +
      Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * total
    );
  };

  return (
    <div className="px-4">
      <div
        ref={ref}
        data-slot="trace-overview"
        aria-hidden="true"
        className="relative h-10 cursor-crosshair touch-pan-y overflow-hidden rounded-md border bg-muted/25 select-none"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          drag.current = { x: event.clientX, active: false };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const cursor = cursorRef.current;
          if (cursor) {
            cursor.style.opacity = "1";
            cursor.style.left = `${((event.clientX - rect.left) / rect.width) * 100}%`;
          }
          const d = drag.current;
          if (!d) return;
          if (!d.active && Math.abs(event.clientX - d.x) > 3) d.active = true;
          if (d.active && brushRef.current) {
            const a =
              Math.min(Math.max(d.x, rect.left), rect.right) - rect.left;
            const b =
              Math.min(Math.max(event.clientX, rect.left), rect.right) -
              rect.left;
            brushRef.current.style.display = "block";
            brushRef.current.style.left = `${Math.min(a, b)}px`;
            brushRef.current.style.width = `${Math.abs(b - a)}px`;
          }
        }}
        onPointerUp={(event) => {
          const d = drag.current;
          drag.current = null;
          if (brushRef.current) brushRef.current.style.display = "none";
          if (!d) return;
          if (d.active) {
            const a = timeAt(d.x);
            const b = timeAt(event.clientX);
            if (Math.abs(b - a) > total / 5000)
              onRange([Math.min(a, b), Math.max(a, b)]);
          } else if (zoomed) {
            // A click recenters the zoom window on that moment.
            const width = viewEnd - viewStart;
            const center = timeAt(event.clientX);
            const lo = Math.min(
              Math.max(start, center - width / 2),
              start + total - width,
            );
            onRange([lo, lo + width]);
          }
        }}
        onPointerLeave={() => {
          if (cursorRef.current) cursorRef.current.style.opacity = "0";
        }}
        onDoubleClick={() => onRange(null)}
      >
        <div className="absolute inset-x-1 inset-y-1">
          {lanes.placed.map(({ node, lane }) => {
            const isError = node.span.status === "error";
            return (
              <span
                key={node.span.id}
                className={cn(
                  "absolute rounded-[1.5px]",
                  highlight && !node.critical && !isError && "opacity-35",
                )}
                style={{
                  left: `${(((node.span.start - start) / total) * 100).toFixed(3)}%`,
                  width: `max(2px, ${(((node.end - node.span.start) / total) * 100).toFixed(3)}%)`,
                  top: lane * laneHeight,
                  height: Math.max(
                    1,
                    laneHeight - (laneHeight > 3 ? 1.5 : 0.5),
                  ),
                  background: isError ? errorFill : colorOf(node.span.service),
                }}
              />
            );
          })}
        </div>
        {zoomed && (
          <>
            <div
              className="absolute inset-y-0 left-0 bg-card/70"
              style={{ width: lens(0) }}
            />
            <div
              className="absolute inset-y-0 right-0 bg-card/70"
              style={{
                left: `calc((var(--trace-v0) + var(--trace-vs) - ${tidy(start)}) / ${tidy(total)} * 100%)`,
              }}
            />
            <div
              className="absolute inset-y-0 rounded-[3px] border-x-2 border-primary shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-primary)_25%,transparent)]"
              style={{
                left: lens(0),
                width: `max(4px, calc(var(--trace-vs) / ${tidy(total)} * 100%))`,
              }}
            />
          </>
        )}
        <div
          ref={cursorRef}
          className="pointer-events-none absolute inset-y-0 w-px bg-foreground/50 opacity-0 transition-opacity duration-100"
        />
        <div
          ref={brushRef}
          className="pointer-events-none absolute inset-y-0 hidden border-x border-primary bg-primary/15"
        />
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------------ */
/* Detail                                                                    */
/* ------------------------------------------------------------------------ */

interface TraceDetailProps {
  node: TraceNode | null;
  info: TraceSpanInfo | null;
  open: boolean;
  format: (ms: number) => string;
  renderDetail?: (span: TraceSpan, info: TraceSpanInfo) => React.ReactNode;
  onClose: () => void;
  onSelect: (id: string | null) => void;
}

function TraceDetail({
  node,
  info,
  open,
  format,
  renderDetail,
  onClose,
  onSelect,
}: TraceDetailProps) {
  const s = node?.span;
  const isError = s?.status === "error";
  return (
    <div
      data-slot="trace-detail"
      data-open={open || undefined}
      className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out data-[open]:grid-rows-[1fr] motion-reduce:transition-none"
      inert={!open}
    >
      <div className="min-h-0 overflow-hidden">
        {s && info && (
          <section
            aria-label={`Span detail: ${s.name}`}
            className="border-t bg-muted/20"
          >
            <div className="flex items-start gap-2.5 px-4 pt-3">
              <span
                aria-hidden="true"
                className="mt-1.5 size-2 shrink-0 rounded-full"
                style={{ background: info.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h4 className="min-w-0 truncate text-sm font-semibold tracking-tight">
                    {s.name}
                  </h4>
                  {isError ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-1.5 py-px text-[11px] font-medium text-destructive">
                      <AlertTriangle aria-hidden="true" className="size-3" />
                      Error
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-px text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-emerald-500"
                      />
                      OK
                    </span>
                  )}
                  {info.critical && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-px text-[11px] font-medium text-primary">
                      <Route aria-hidden="true" className="size-3" />
                      Critical path
                    </span>
                  )}
                </div>
                <p className="mt-0.5 flex min-w-0 flex-wrap gap-x-2 font-mono text-[11px] text-muted-foreground">
                  <span>{s.service}</span>
                  <span aria-hidden="true" className="text-border">
                    /
                  </span>
                  <span className="truncate">{s.id}</span>
                  {info.parent && (
                    <>
                      <span aria-hidden="true" className="text-border">
                        /
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelect(info.parent!.id)}
                        className={cn(
                          "truncate rounded-sm text-primary hover:underline",
                          focusRing,
                        )}
                      >
                        ↑ {info.parent.name}
                      </button>
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className={cn(toolButton, "-mt-0.5 -mr-1.5")}
                title="Close"
              >
                <X className="size-4" aria-hidden="true" />
                <span className="sr-only">Close span detail</span>
              </button>
            </div>

            <dl
              data-slot="trace-detail-timing"
              className="mx-4 mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border @lg/trace:grid-cols-4"
            >
              {(
                [
                  ["Start", `+${format(s.start - info.trace.start)}`],
                  ["Duration", format(s.duration)],
                  ["Self time", format(info.selfTime)],
                  ["Share of trace", formatPercent(info.share)],
                ] as const
              ).map(([term, value]) => (
                <div key={term} className="bg-card px-3 py-2">
                  <dt className="text-[11px] text-muted-foreground">{term}</dt>
                  <dd className="font-mono text-sm font-medium tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <div
              aria-hidden="true"
              className="relative mx-4 mt-2.5 h-1.5 rounded-full bg-muted"
            >
              <span
                className="absolute inset-y-0 rounded-full"
                style={{
                  left: `${((s.start - info.trace.start) / info.trace.duration) * 100}%`,
                  width: `max(3px, ${(info.share * 100).toFixed(3)}%)`,
                  background: isError ? DESTRUCTIVE : info.color,
                }}
              />
            </div>

            <div data-slot="trace-detail-body" className="px-4 pt-3 pb-4">
              {renderDetail ? (
                renderDetail(s, info)
              ) : (
                <>
                  <p className="mb-1.5 flex items-baseline gap-1.5 text-xs font-medium">
                    Attributes
                    <span className="font-mono text-[10.5px] font-normal text-muted-foreground tabular-nums">
                      {Object.keys(s.attributes ?? {}).length}
                    </span>
                  </p>
                  <TraceSpanAttributes attributes={s.attributes} />
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
