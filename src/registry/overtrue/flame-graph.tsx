"use client";

import * as React from "react";
import { IconSearch, IconX, IconZoomReset } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

export interface FlameNode {
  /** Stable id. Defaults to the node's position in the tree. Must be unique when set. */
  id?: string;
  /** Function or frame name, e.g. "db.query" or "react-dom.renderToString". */
  name: string;
  /** Total (inclusive) cost of the frame. When the children add up to more, their sum is used. */
  value: number;
  children?: FlameNode[];
  /** Colour group. Defaults to the name's package prefix, e.g. "db" for "db.query". */
  group?: string;
  /** Anything else your tooltip or handlers need, such as a file and line. */
  meta?: Record<string, unknown>;
}

export type FlameGraphOrientation = "icicle" | "flame";

/** Everything derived about one frame, passed to `renderTooltip`, `onSelect` and `colorBy`. */
export interface FlameFrameInfo {
  id: string;
  node: FlameNode;
  /** 0 for the root. */
  depth: number;
  /** Resolved colour group. */
  group: string;
  /** Inclusive value: the frame and everything it called. */
  total: number;
  /** Value spent in the frame itself: total minus children. */
  self: number;
  /** Total as a 0–1 share of the root. */
  share: number;
  /** Self as a 0–1 share of the root. */
  selfShare: number;
  /** Total as a 0–1 share of the parent; 1 for the root. */
  parentShare: number;
  parent: FlameNode | null;
  /** Nodes from the root down to and including this one. */
  path: FlameNode[];
  /** Resolved fill and a readable ink for it. */
  fill: string;
  ink: string;
  /** Whether the frame matches the current search. */
  match: boolean;
}

/** Context passed to a `colorBy` function. */
export interface FlameColorContext {
  depth: number;
  group: string;
  total: number;
  self: number;
  /** Total as a 0–1 share of the root. */
  share: number;
  /** Self time relative to the hottest frame in the profile, 0–1. */
  heat: number;
}

export type FlameGraphColorBy =
  | "group"
  | "self"
  | ((node: FlameNode, context: FlameColorContext) => string);

export interface FlameGraphProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "children" | "onSelect"
> {
  /** The root frame, or several roots that are drawn under one `rootName` frame. */
  data: FlameNode | FlameNode[];
  /** Name of the synthetic root when `data` is an array. Defaults to "all". */
  rootName?: string;
  /** "icicle" draws the root on top; "flame" draws it at the bottom. Defaults to icicle. */
  orientation?: FlameGraphOrientation;
  /** Row height in pixels. Defaults to 22. */
  rowHeight?: number;
  /** Frames narrower than this many pixels are skipped. Defaults to 2. */
  minFrameWidth?: number;
  /** Maximum height of the frame area in pixels; deeper profiles scroll. Defaults to fitting every row. */
  height?: number;
  /** Colour by package group, by self time as a heat scale, or with your own function. Defaults to group. */
  colorBy?: FlameGraphColorBy;
  /**
   * Group palette, hashed by group. With `colorBy="self"`, the stops of the heat
   * scale from cold to hot. Defaults to chart-1 … chart-5, and to a neutral, amber
   * and destructive ramp.
   */
  colors?: string[];
  /** Controlled zoom: the id of the frame drawn at full width, or null for the root. */
  zoomedId?: string | null;
  defaultZoomedId?: string | null;
  onZoomChange?: (id: string | null, node: FlameNode | null) => void;
  /** Show the built-in search field. Defaults to true. */
  showSearch?: boolean;
  /** Controlled search. Frames whose name contains it are highlighted. */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  searchPlaceholder?: string;
  /** Formats values. Defaults to milliseconds. */
  valueFormatter?: (value: number) => string;
  /** Replaces the content of the hover and focus readout. */
  renderTooltip?: (info: FlameFrameInfo) => React.ReactNode;
  /** List the heaviest functions by aggregated self time. Pass a number for the count; true shows 8. */
  showTopFunctions?: boolean | number;
  /** Called when a frame is clicked or activated with Enter, before it zooms. */
  onSelect?: (node: FlameNode, info: FlameFrameInfo) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Controls placed at the top right, before the total. */
  actions?: React.ReactNode;
}

/* ------------------------------------------------------------------------ */
/* Model                                                                     */
/* ------------------------------------------------------------------------ */

interface Frame {
  id: string;
  node: FlameNode;
  name: string;
  lower: string;
  group: string;
  depth: number;
  /** Start and end as 0–1 fractions of the root. */
  start: number;
  end: number;
  total: number;
  self: number;
  heat: number;
  parent: Frame | null;
  children: Frame[];
}

interface Model {
  root: Frame | null;
  byId: Map<string, Frame>;
  maxDepth: number;
  count: number;
}

interface View {
  v0: number;
  vs: number;
}

const ROOT_KEY = "root";
const DURATION = 300;
/** Horizontal padding plus about four monospace characters: anything less is noise. */
const labelFits = (frame: { name: string }, px: number) =>
  px >= 13 + 6.7 * Math.min(frame.name.length, 4);
const FALLBACK_WIDTH = 640;

const defaultPalette = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const AMBER = "var(--color-amber-400, oklch(82.8% 0.189 84.429))";
const defaultHeat = [
  "color-mix(in oklab, var(--color-muted-foreground) 24%, var(--color-card))",
  AMBER,
  "var(--color-destructive)",
];

/** The package a frame belongs to: "db" for "db.query", "react-dom" for "react-dom.render". */
function packageOf(name: string) {
  const match =
    /^\s*(@[\w.-]+\/[\w-]+|[\w$-]+)(?:\.|\/|::|:|#)/.exec(name) ??
    /^\s*([\w$-]+)/.exec(name);
  return match ? match[1] : name;
}

function hash(text: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function buildModel(data: FlameNode | FlameNode[], rootName: string): Model {
  const byId = new Map<string, Frame>();
  const order: Frame[] = [];
  let maxDepth = 0;
  const rootNode: FlameNode = Array.isArray(data)
    ? { name: rootName, value: 0, children: data }
    : data;

  const visit = (
    node: FlameNode,
    parent: Frame | null,
    depth: number,
    offset: number,
    key: string,
  ): Frame | null => {
    const id = node.id ?? key;
    const frame: Frame = {
      id,
      node,
      name: node.name,
      lower: node.name.toLowerCase(),
      group: node.group ?? packageOf(node.name),
      depth,
      start: offset,
      end: offset,
      total: 0,
      self: 0,
      heat: 0,
      parent,
      children: [],
    };
    const at = order.length;
    order.push(frame);
    let cursor = offset;
    node.children?.forEach((child, index) => {
      const built = visit(child, frame, depth + 1, cursor, `${id}/${index}`);
      if (!built) return;
      frame.children.push(built);
      cursor += built.total;
    });
    const childSum = cursor - offset;
    const own = Number(node.value);
    frame.total = Math.max(Number.isFinite(own) && own > 0 ? own : 0, childSum);
    frame.self = Math.max(0, frame.total - childSum);
    frame.end = offset + frame.total;
    if (!(frame.total > 0)) {
      order.length = at;
      return null;
    }
    return frame;
  };

  const root = visit(rootNode, null, 0, 0, ROOT_KEY);
  if (!root) return { root: null, byId, maxDepth: 0, count: 0 };
  const scale = root.total;
  let maxSelf = 0;
  for (const frame of order) maxSelf = Math.max(maxSelf, frame.self);
  for (const frame of order) {
    frame.start /= scale;
    frame.end /= scale;
    frame.heat = maxSelf > 0 ? Math.sqrt(frame.self / maxSelf) : 0;
    maxDepth = Math.max(maxDepth, frame.depth);
    byId.set(frame.id, frame);
  }
  return { root, byId, maxDepth, count: order.length };
}

function lineage(frame: Frame) {
  const chain: Frame[] = [];
  for (let current: Frame | null = frame; current; current = current.parent)
    chain.unshift(current);
  return chain;
}

/** Frames wider than `minWidth` pixels inside the view, in depth-first order. */
function visibleFrames(root: Frame, view: View, width: number, min: number) {
  const out: Frame[] = [];
  const lo = view.v0;
  const hi = view.v0 + view.vs;
  const stack = [root];
  while (stack.length) {
    const frame = stack.pop()!;
    const a = Math.max(frame.start, lo);
    const b = Math.min(frame.end, hi);
    if (b <= a || ((b - a) / view.vs) * width < min) continue;
    out.push(frame);
    for (let i = frame.children.length - 1; i >= 0; i--)
      stack.push(frame.children[i]);
  }
  return out;
}

function pixelWidth(frame: Frame, view: View, width: number) {
  const a = Math.max(frame.start, view.v0);
  const b = Math.min(frame.end, view.v0 + view.vs);
  return b > a ? ((b - a) / view.vs) * width : 0;
}

/**
 * Zoom about the one point that stays put on screen, with the scale changing
 * geometrically, so deep zooms feel as steady as shallow ones.
 */
function interpolate(a: View, b: View, t: number): View {
  if (Math.abs(a.vs - b.vs) < 1e-12)
    return { v0: a.v0 + (b.v0 - a.v0) * t, vs: a.vs };
  const vs = a.vs * Math.pow(b.vs / a.vs, t);
  const fixed = (b.v0 * a.vs - a.v0 * b.vs) / (a.vs - b.vs);
  return { v0: fixed - (fixed - a.v0) * (vs / a.vs), vs };
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ------------------------------------------------------------------------ */
/* Formatting and colour                                                     */
/* ------------------------------------------------------------------------ */

function formatMs(ms: number) {
  if (!Number.isFinite(ms)) return "—";
  const a = Math.abs(ms);
  if (a === 0) return "0 ms";
  if (a < 1) return `${ms.toFixed(2)} ms`;
  if (a < 10) return `${ms.toFixed(1)} ms`;
  if (a < 1000) return `${Math.round(ms)} ms`;
  if (a < 10_000) return `${(ms / 1000).toFixed(2)} s`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function percent(share: number) {
  const pct = share * 100;
  if (!(pct > 0)) return "0%";
  if (pct < 0.1) return "<0.1%";
  if (pct >= 99.95) return "100%";
  return `${+pct.toFixed(1)}%`;
}

/** Light or dark ink picked from the fill's own lightness. */
function inkFor(fill: string) {
  return `oklch(from ${fill} clamp(0.21, (0.66 - l) * 1000, 0.985) min(c, 0.035) h)`;
}

function mix(a: string, b: string, t: number) {
  const pct = Math.round(Math.min(1, Math.max(0, t)) * 100);
  if (pct <= 0) return b;
  if (pct >= 100) return a;
  return `color-mix(in oklab, ${a} ${pct}%, ${b})`;
}

function rampAt(stops: string[], t: number) {
  if (stops.length === 1) return stops[0];
  const scaled = Math.min(1, Math.max(0, t)) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(scaled));
  return mix(stops[i + 1], stops[i], scaled - i);
}

/** Splits "482 ms" into digits and a quieter unit. */
function Figure({ text, className }: { text: string; className?: string }) {
  const match = /^([-+]?[\d.,]+)\s*(\D.*)$/.exec(text);
  if (!match) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      {match[1]}
      <span className="ml-0.5 text-[0.62em] font-medium tracking-normal text-muted-foreground">
        {match[2]}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Hooks                                                                     */
/* ------------------------------------------------------------------------ */

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

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

/* ------------------------------------------------------------------------ */
/* Frame                                                                     */
/* ------------------------------------------------------------------------ */

interface FrameProps {
  frame: Frame;
  top: number;
  height: number;
  fill: string;
  label: boolean;
  query: string;
  match: boolean;
  dimmed: boolean;
  ancestor: boolean;
  zoomed: boolean;
  active: boolean;
  tabStop: boolean;
  ariaLabel: string;
  reveal: number | null;
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const at = query ? text.toLowerCase().indexOf(query) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="bg-transparent font-bold text-inherit underline decoration-current/70 decoration-[1.5px] underline-offset-[3px]">
        {text.slice(at, at + query.length)}
      </mark>
      {text.slice(at + query.length)}
    </>
  );
}

/** Memoised so hovering one frame re-renders two, not the whole profile. */
const FlameFrame = React.memo(function FlameFrame({
  frame,
  top,
  height,
  fill: baseFill,
  label,
  query,
  match,
  dimmed,
  ancestor,
  zoomed,
  active,
  tabStop,
  ariaLabel,
  reveal,
}: FrameProps) {
  // Dimming mixes the fill toward the surface instead of fading it, so the ink is
  // always picked against the colour that is actually on screen.
  const fill = active
    ? baseFill
    : dimmed
      ? `color-mix(in oklab, ${baseFill} 26%, var(--color-muted))`
      : ancestor
        ? `color-mix(in oklab, ${baseFill} 48%, var(--color-card))`
        : baseFill;
  const ink =
    dimmed && !active ? "var(--color-muted-foreground)" : inkFor(fill);
  return (
    <button
      type="button"
      data-slot="flame-graph-frame"
      data-id={frame.id}
      data-depth={frame.depth}
      data-match={match || undefined}
      data-dimmed={dimmed || undefined}
      data-ancestor={ancestor || undefined}
      data-zoomed={zoomed || undefined}
      data-active={active || undefined}
      aria-label={ariaLabel}
      aria-current={zoomed ? "true" : undefined}
      tabIndex={tabStop ? 0 : -1}
      className={cn(
        "group/frame absolute block overflow-hidden rounded-[3px] p-0 text-left outline-none select-none",
        ancestor ? "cursor-zoom-out" : zoomed ? "cursor-default" : "cursor-zoom-in",
        "data-[active]:z-10 focus-visible:z-20",
        reveal != null &&
          "motion-safe:animate-[flame-frame-in_720ms_cubic-bezier(0.22,1,0.36,1)_backwards]",
      )}
      style={
        {
          "--x0": +frame.start.toFixed(9),
          "--x1": +frame.end.toFixed(9),
          "--frame-fill": baseFill,
          top,
          height,
          color: ink,
          animationDelay: reveal != null ? `${reveal}ms` : undefined,
        } as React.CSSProperties
      }
    >
      <span
        aria-hidden="true"
        data-slot="flame-graph-frame-fill"
        className={cn(
          "absolute inset-0 rounded-[inherit] transition-[background-color,box-shadow] duration-150 motion-reduce:transition-none",
          // A soft top light gives each frame a little depth without changing its hue.
          !dimmed &&
            "bg-[linear-gradient(to_bottom,rgb(255_255_255/0.18),rgb(255_255_255/0)_75%)] dark:bg-[linear-gradient(to_bottom,rgb(255_255_255/0.12),rgb(255_255_255/0)_75%)]",
          match &&
            "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--frame-fill)_55%,var(--color-foreground))] dark:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.4),0_0_14px_-3px_var(--frame-fill)]",
          "group-data-[active]/frame:shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--color-foreground)_82%,transparent),0_0_18px_-4px_var(--frame-fill)]",
          "group-focus-visible/frame:shadow-[inset_0_0_0_2px_var(--color-ring),inset_0_0_0_3px_var(--color-card)]",
        )}
        style={{ backgroundColor: fill }}
      />
      {label ? (
        <span
          aria-hidden="true"
          className="relative block truncate px-1.5 font-mono text-[11px] transition-colors duration-150 motion-reduce:transition-none"
          style={{ lineHeight: `${height}px` }}
        >
          {match ? <Highlighted text={frame.name} query={query} /> : frame.name}
        </span>
      ) : null}
    </button>
  );
});

/* ------------------------------------------------------------------------ */
/* Tooltip                                                                   */
/* ------------------------------------------------------------------------ */

function DefaultTooltip({
  info,
  format,
}: {
  info: FlameFrameInfo;
  format: (value: number) => string;
}) {
  return (
    <div className="w-max max-w-72 min-w-52">
      <div className="flex items-start gap-2 px-3 pt-2.5 pb-2">
        <span
          aria-hidden="true"
          className="mt-[3px] size-2.5 shrink-0 rounded-[3px]"
          style={{ backgroundColor: info.fill }}
        />
        <div className="min-w-0 space-y-0.5">
          <p className="font-mono text-xs leading-4 font-medium break-all text-foreground">
            {info.node.name}
          </p>
          <p className="text-[11px] leading-4 text-muted-foreground">
            {info.group !== info.node.name ? (
              <>
                <span className="font-mono">{info.group}</span>
                {" · "}
              </>
            ) : null}
            depth <span className="tabular-nums">{info.depth}</span>
          </p>
        </div>
      </div>
      <dl className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 gap-y-1 border-t border-border/60 px-3 py-2 text-xs tabular-nums">
        <dt className="text-muted-foreground">Total</dt>
        <dd className="text-right font-medium text-foreground">
          {format(info.total)}
        </dd>
        <dd className="text-right text-muted-foreground">
          {percent(info.share)}
        </dd>
        <dt className="text-muted-foreground">Self</dt>
        <dd className="text-right font-medium text-foreground">
          {format(info.self)}
        </dd>
        <dd className="text-right text-muted-foreground">
          {percent(info.selfShare)}
        </dd>
        {info.parent ? (
          <>
            <dt className="text-muted-foreground">Of parent</dt>
            <dd className="col-span-2 flex min-w-0 items-baseline justify-end gap-1 text-right">
              <span className="font-medium text-foreground">
                {percent(info.parentShare)}
              </span>
              <span className="truncate font-mono text-[11px] text-muted-foreground">
                {info.parent.name}
              </span>
            </dd>
          </>
        ) : null}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Component                                                                 */
/* ------------------------------------------------------------------------ */

const toolButton =
  "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none";

/**
 * A profiler flame graph. Frames are HTML, so labels stay crisp at any zoom.
 * Click or press Enter on a frame to zoom it to full width; Escape zooms out.
 * Search highlights matching frames and reports their share of the total.
 */
function FlameGraph({
  data,
  rootName = "all",
  orientation = "icicle",
  rowHeight = 22,
  minFrameWidth = 2,
  height,
  colorBy = "group",
  colors,
  zoomedId: zoomedIdProp,
  defaultZoomedId = null,
  onZoomChange,
  showSearch = true,
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  searchPlaceholder = "Search functions",
  valueFormatter = formatMs,
  renderTooltip,
  showTopFunctions = false,
  onSelect,
  title,
  description,
  actions,
  className,
  onKeyDown,
  ...props
}: FlameGraphProps) {
  const id = React.useId();
  const reduced = useReducedMotion();
  const format = valueFormatter;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const tipRef = React.useRef<HTMLDivElement>(null);
  const pointer = React.useRef<{ x: number; y: number } | null>(null);
  const pendingFocus = React.useRef(false);

  const model = React.useMemo(() => buildModel(data, rootName), [data, rootName]);
  const { root, byId, maxDepth } = model;

  /* ---------------------------------------------------------- state */

  const [innerZoom, setInnerZoom] = React.useState<string | null>(
    defaultZoomedId,
  );
  const requestedZoom =
    zoomedIdProp !== undefined ? zoomedIdProp : innerZoom;
  const focus =
    (requestedZoom != null ? byId.get(requestedZoom) : undefined) ?? root;
  const zoomed = focus != null && focus !== root;

  const [search, setSearch] = useControllable(
    searchProp,
    defaultSearch,
    onSearchChange,
  );
  const query = search.trim().toLowerCase();

  const [width, setWidth] = React.useState(0);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const [tabStopId, setTabStopId] = React.useState<string | null>(null);
  const [tween, setTween] = React.useState<{ from: View; to: View } | null>(
    null,
  );
  const [revealed, setRevealed] = React.useState(false);

  const target: View = focus
    ? { v0: focus.start, vs: focus.end - focus.start || 1 }
    : { v0: 0, vs: 1 };
  const [initialView] = React.useState(target);
  const shown = React.useRef<View>(target);

  const commitZoom = (frame: Frame | null) => {
    const next = frame && frame !== root ? frame : null;
    if (zoomedIdProp === undefined) setInnerZoom(next?.id ?? null);
    onZoomChange?.(next?.id ?? null, next?.node ?? null);
  };

  /* ---------------------------------------------------------- measure */

  useIsomorphicLayoutEffect(() => {
    const element = canvasRef.current;
    if (!element) return;
    const measure = () => setWidth(element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [root != null]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  // Flame graphs grow upward, so a scrolling one starts at the root.
  useIsomorphicLayoutEffect(() => {
    const scroller = scrollRef.current;
    if (scroller && orientation === "flame")
      scroller.scrollTop = scroller.scrollHeight;
  }, [orientation, height]);

  /* ---------------------------------------------------------- zoom tween */

  useIsomorphicLayoutEffect(() => {
    const element = canvasRef.current;
    if (!element) return;
    const to = target;
    const from = shown.current;
    const apply = (view: View) => {
      element.style.setProperty("--flame-v0", String(view.v0));
      element.style.setProperty("--flame-vs", String(view.vs));
      shown.current = view;
    };
    const same =
      Math.abs(from.v0 - to.v0) < 1e-12 && Math.abs(from.vs - to.vs) < 1e-12;
    if (same || reduced) {
      apply(to);
      setTween(null);
      return;
    }
    setTween({ from, to });
    const startedAt = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - startedAt) / DURATION);
      apply(interpolate(from, to, easeOut(t)));
      if (t < 1) frame = requestAnimationFrame(step);
      else setTween(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [target.v0, target.vs, reduced]);

  /* ---------------------------------------------------------- colours */

  const paletteKey = (colors ?? []).join("|");
  const colorMap = React.useMemo(() => {
    const map = new Map<string, string>();
    if (!root) return map;
    const custom = paletteKey ? paletteKey.split("|") : null;
    for (const frame of byId.values()) {
      let fill: string;
      if (typeof colorBy === "function") {
        fill = colorBy(frame.node, {
          depth: frame.depth,
          group: frame.group,
          total: frame.total,
          self: frame.self,
          share: frame.total / root.total,
          heat: frame.heat,
        });
      } else if (colorBy === "self") {
        fill = rampAt(custom ?? defaultHeat, frame.heat);
      } else {
        const palette = custom ?? defaultPalette;
        const base = palette[hash(frame.group) % palette.length];
        // Group picks the hue; the function picks one of three tints within it.
        const tint = hash(frame.name) % 3;
        fill = `color-mix(in oklab, ${base} var(--flame-tint-${tint}), var(--color-card))`;
      }
      map.set(frame.id, fill);
    }
    return map;
    // paletteKey stands in for `colors`, so inline arrays do not recolour.
  }, [byId, root, colorBy, paletteKey]);

  /* ---------------------------------------------------------- search */

  const matches = React.useMemo(() => {
    if (!root || !query) return null;
    const ids = new Set<string>();
    let covered = 0;
    const walk = (frame: Frame, inside: boolean) => {
      const hit = frame.lower.includes(query);
      if (hit) {
        ids.add(frame.id);
        if (!inside) covered += frame.total;
      }
      for (const child of frame.children) walk(child, inside || hit);
    };
    walk(root, false);
    return { ids, count: ids.size, share: covered / root.total };
  }, [root, query]);

  /* ---------------------------------------------------------- frames */

  const measured = width || FALLBACK_WIDTH;
  const rendered = React.useMemo(() => {
    if (!root) return [] as Frame[];
    const now = visibleFrames(root, target, measured, minFrameWidth);
    if (!tween) return now;
    const seen = new Set(now);
    for (const frame of visibleFrames(
      root,
      tween.from,
      measured,
      minFrameWidth,
    ))
      if (!seen.has(frame)) now.push(frame);
    return now;
  }, [root, target.v0, target.vs, measured, minFrameWidth, tween]);

  const renderedIds = React.useMemo(
    () => new Set(rendered.map((frame) => frame.id)),
    [rendered],
  );
  const stopId =
    tabStopId && renderedIds.has(tabStopId)
      ? tabStopId
      : (focus?.id ?? null);

  const infoFor = (frame: Frame): FlameFrameInfo => {
    const fill = colorMap.get(frame.id) ?? defaultPalette[0];
    const rootTotal = root?.total || 1;
    return {
      id: frame.id,
      node: frame.node,
      depth: frame.depth,
      group: frame.group,
      total: frame.total,
      self: frame.self,
      share: frame.total / rootTotal,
      selfShare: frame.self / rootTotal,
      parentShare: frame.parent ? frame.total / frame.parent.total : 1,
      parent: frame.parent?.node ?? null,
      path: lineage(frame).map((entry) => entry.node),
      fill,
      ink: inkFor(fill),
      match: matches?.ids.has(frame.id) ?? false,
    };
  };

  const describe = (frame: Frame) =>
    `${frame.name}, ${format(frame.total)}, ${percent(frame.total / (root?.total || 1))} of total` +
    (frame.children.length ? `, self ${format(frame.self)}` : "");

  /* ---------------------------------------------------------- top functions */

  const topCount =
    showTopFunctions === true
      ? 8
      : typeof showTopFunctions === "number"
        ? Math.max(1, Math.floor(showTopFunctions))
        : 0;
  const topFunctions = React.useMemo(() => {
    if (!focus || !topCount) return [];
    const map = new Map<
      string,
      { name: string; self: number; calls: number; sample: Frame }
    >();
    const stack = [focus];
    while (stack.length) {
      const frame = stack.pop()!;
      if (frame.self > 0) {
        const entry = map.get(frame.name);
        if (entry) {
          entry.self += frame.self;
          entry.calls += 1;
          if (frame.self > entry.sample.self) entry.sample = frame;
        } else
          map.set(frame.name, {
            name: frame.name,
            self: frame.self,
            calls: 1,
            sample: frame,
          });
      }
      stack.push(...frame.children);
    }
    return [...map.values()]
      .sort((a, b) => b.self - a.self)
      .slice(0, topCount);
  }, [focus, topCount]);

  /* ---------------------------------------------------------- interaction */

  const activeId = tween ? null : (hoveredId ?? focusedId);
  const activeFrame = activeId ? (byId.get(activeId) ?? null) : null;

  const placeTip = React.useCallback(() => {
    const tip = tipRef.current;
    const host = rootRef.current;
    if (!tip || !host) return;
    const box = host.getBoundingClientRect();
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    let x: number;
    let y: number;
    const p = pointer.current;
    if (p) {
      x = p.x - box.left + 14;
      y = p.y - box.top + 18;
      if (x + w > box.width - 8) x = p.x - box.left - w - 14;
      if (y + h > box.height + 24) y = p.y - box.top - h - 14;
    } else {
      const id = tip.dataset.for;
      const element = id
        ? canvasRef.current?.querySelector<HTMLElement>(
            `[data-slot="flame-graph-frame"][data-id="${CSS.escape(id)}"]`,
          )
        : null;
      if (!element) return;
      const r = element.getBoundingClientRect();
      x = Math.min(r.left - box.left, box.width - w - 8);
      y = r.bottom - box.top + 6;
      if (y + h > box.height + 24) y = r.top - box.top - h - 6;
    }
    x = Math.max(8, x);
    tip.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (activeFrame) placeTip();
  }, [activeFrame, placeTip]);

  const frameFromEvent = (event: React.SyntheticEvent) => {
    const element = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-slot="flame-graph-frame"]',
    );
    return element ? (byId.get(element.dataset.id ?? "") ?? null) : null;
  };

  const focusFrame = (frame: Frame | null | undefined) => {
    if (!frame) return;
    setTabStopId(frame.id);
    canvasRef.current
      ?.querySelector<HTMLElement>(
        `[data-slot="flame-graph-frame"][data-id="${CSS.escape(frame.id)}"]`,
      )
      ?.focus({ preventScroll: false });
  };

  const activate = (frame: Frame, fromKeyboard: boolean) => {
    onSelect?.(frame.node, infoFor(frame));
    // Activating the zoomed frame steps out; anything else zooms to it.
    const next = frame === focus ? (frame.parent ?? null) : frame;
    commitZoom(next);
    if (fromKeyboard) setTabStopId(frame.id);
  };

  const zoomOut = () => {
    if (focus?.parent) commitZoom(focus.parent);
  };

  const onCanvasKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const frame = frameFromEvent(event);
    if (!frame || !root) return;
    const visible = (candidate: Frame | null | undefined) =>
      candidate && renderedIds.has(candidate.id) ? candidate : null;
    const firstChild = () =>
      frame.children.find((child) => renderedIds.has(child.id)) ?? null;
    const along = (direction: 1 | -1) => {
      const row = rendered
        .filter((candidate) => candidate.depth === frame.depth)
        .sort((a, b) => a.start - b.start);
      return row[row.indexOf(frame) + direction] ?? null;
    };
    const up = orientation === "icicle" ? frame.parent : firstChild();
    const down = orientation === "icicle" ? firstChild() : frame.parent;
    switch (event.key) {
      case "ArrowUp":
        focusFrame(visible(up));
        break;
      case "ArrowDown":
        focusFrame(visible(down));
        break;
      case "ArrowLeft":
        focusFrame(along(-1));
        break;
      case "ArrowRight":
        focusFrame(along(1));
        break;
      case "Home":
        focusFrame(focus);
        break;
      case "Enter":
      case " ":
        activate(frame, true);
        break;
      case "Escape":
        if (zoomed) zoomOut();
        else if (query) setSearch("");
        else return;
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  // Keep keyboard focus on a frame that is still drawn after a zoom, and move it
  // into the graph when the reset button that had it becomes disabled.
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !focus) return;
    if (pendingFocus.current) {
      pendingFocus.current = false;
      focusFrame(focus);
      return;
    }
    const active = document.activeElement as HTMLElement | null;
    if (!active || !canvas.contains(active)) return;
    if (
      active.dataset.slot === "flame-graph-frame" &&
      renderedIds.has(active.dataset.id ?? "")
    )
      return;
    focusFrame(focus);
    // Only after a zoom settles.
  }, [focus, tween == null]);

  /* ---------------------------------------------------------- render */

  const rowTop = (depth: number) =>
    (orientation === "icicle" ? depth : maxDepth - depth) * rowHeight;
  const canvasHeight = (maxDepth + 1) * rowHeight;
  const focusChain = focus ? new Set(lineage(focus)) : new Set<Frame>();
  const rootTotal = root?.total ?? 0;
  const hasHeader = title != null || description != null || actions != null;
  const graphLabel = typeof title === "string" ? title : "Flame graph";
  const activeInfo = activeFrame ? infoFor(activeFrame) : null;

  return (
    <div
      ref={rootRef}
      data-slot="flame-graph"
      data-orientation={orientation}
      data-zoomed={zoomed || undefined}
      data-searching={query ? true : undefined}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key !== "Escape" || event.defaultPrevented || !zoomed) return;
        if ((event.target as HTMLElement).tagName === "INPUT") return;
        event.preventDefault();
        zoomOut();
      }}
      className={cn(
        "@container/flame relative flex min-w-0 flex-col rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
        "[--flame-tint-0:70%] [--flame-tint-1:54%] [--flame-tint-2:40%] dark:[--flame-tint-0:92%] dark:[--flame-tint-1:78%] dark:[--flame-tint-2:64%]",
        className,
      )}
      {...props}
    >
      <style href="overtrue-flame-graph" precedence="default">
        {`[data-slot=flame-graph-frame]{left:max(0%,calc((var(--x0) - var(--flame-v0)) / var(--flame-vs) * 100%));width:max(0px,calc(min(100%,(var(--x1) - var(--flame-v0)) / var(--flame-vs) * 100%) - max(0%,(var(--x0) - var(--flame-v0)) / var(--flame-vs) * 100%) - 1px))}@keyframes flame-frame-in{from{opacity:0;clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}`}
      </style>

      {hasHeader || rootTotal > 0 ? (
        <div className="flex items-start justify-between gap-x-6 gap-y-3 px-5 pt-5">
          <div className="min-w-0 space-y-1">
            {title != null ? (
              <h3 className="truncate text-sm leading-5 font-semibold tracking-tight">
                {title}
              </h3>
            ) : null}
            {description != null ? (
              <p
                id={`${id}-description`}
                className="text-[13px] leading-5 text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-start gap-3">
            {actions != null ? (
              <div className="flex items-center gap-1">{actions}</div>
            ) : null}
            {rootTotal > 0 ? (
              <p
                data-slot="flame-graph-total"
                className="flex flex-col items-end gap-0.5"
              >
                <span className="text-xs leading-4 text-muted-foreground">
                  Total
                </span>
                <Figure
                  text={format(rootTotal)}
                  className="text-xl leading-6 font-semibold tracking-[-0.02em] tabular-nums"
                />
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div
        data-slot="flame-graph-toolbar"
        className="flex min-h-7 flex-wrap items-center gap-x-3 gap-y-2 px-5 pt-4"
      >
        {showSearch ? (
          <div className="relative min-w-0 flex-1 @lg/flame:w-60 @lg/flame:flex-none">
            <IconSearch
              aria-hidden="true"
              size={15}
              className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              data-slot="flame-graph-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape" && search) {
                  event.preventDefault();
                  setSearch("");
                }
              }}
              placeholder={searchPlaceholder}
              aria-label="Search frames"
              aria-describedby={query ? `${id}-matches` : undefined}
              spellCheck={false}
              autoComplete="off"
              className="h-8 w-full rounded-lg border border-input/80 bg-transparent pr-8 pl-8 font-mono text-xs shadow-[0_1px_1px_rgb(0_0_0/0.03)] outline-none transition-[border-color,box-shadow] placeholder:font-sans placeholder:text-[13px] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 motion-reduce:transition-none [&::-webkit-search-cancel-button]:hidden"
            />
            {search ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute top-1/2 right-1 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <IconX aria-hidden="true" size={13} />
              </button>
            ) : null}
          </div>
        ) : null}

        {(query && matches) || zoomed ? (
          <div className="order-2 flex min-w-0 basis-full flex-wrap items-center justify-between gap-x-4 gap-y-1 @lg/flame:order-1 @lg/flame:basis-0 @lg/flame:flex-1">
            {query && matches ? (
              <p
                id={`${id}-matches`}
                data-slot="flame-graph-matches"
                className="text-xs text-muted-foreground tabular-nums"
              >
                {matches.count > 0 ? (
                  <>
                    <span className="font-medium text-foreground">
                      {matches.count}
                    </span>{" "}
                    {matches.count === 1 ? "match" : "matches"}
                    <span
                      aria-hidden="true"
                      className="px-1.5 text-muted-foreground/50"
                    >
                      ·
                    </span>
                    <span className="font-medium text-foreground">
                      {percent(matches.share)}
                    </span>{" "}
                    of total
                  </>
                ) : (
                  "No matches"
                )}
              </p>
            ) : (
              <span />
            )}
            {zoomed && focus ? (
              <p
                data-slot="flame-graph-zoom"
                className="flex min-w-0 items-baseline gap-1.5 text-xs text-muted-foreground tabular-nums motion-safe:animate-[flame-fade_200ms_ease-out]"
              >
                <span className="max-w-[12rem] truncate font-mono text-foreground">
                  {focus.name}
                </span>
                <span className="shrink-0">
                  {format(focus.total)} · {percent(focus.total / rootTotal)}
                </span>
              </p>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          data-slot="flame-graph-reset"
          className={cn(toolButton, "order-1 ml-auto @lg/flame:order-2")}
          disabled={!zoomed}
          onClick={(event) => {
            if (event.detail === 0) pendingFocus.current = true;
            commitZoom(null);
          }}
          title="Reset zoom"
        >
          <IconZoomReset aria-hidden="true" size={16} />
          <span className="sr-only">Reset zoom</span>
        </button>
      </div>

      <div className="px-5 pt-3 pb-5">
        {root ? (
          <div
            ref={scrollRef}
            className={cn(
              "relative",
              height != null && "overflow-y-auto overscroll-contain",
            )}
            style={height != null ? { maxHeight: height } : undefined}
          >
            <div
              ref={canvasRef}
              role="group"
              aria-roledescription="flame graph"
              aria-label={`${graphLabel}: ${model.count} frames. Arrow keys move between frames, Enter zooms in, Escape zooms out.`}
              aria-describedby={
                description != null ? `${id}-description` : undefined
              }
              data-slot="flame-graph-canvas"
              data-tweening={tween ? true : undefined}
              className="relative w-full overflow-hidden"
              style={
                {
                  height: canvasHeight,
                  "--flame-v0": initialView.v0,
                  "--flame-vs": initialView.vs,
                } as React.CSSProperties
              }
              onPointerMove={(event) => {
                if (event.pointerType === "touch") return;
                pointer.current = { x: event.clientX, y: event.clientY };
                const frame = frameFromEvent(event);
                const next = frame?.id ?? null;
                if (next !== hoveredId) setHoveredId(next);
                else placeTip();
              }}
              onPointerLeave={() => {
                pointer.current = null;
                setHoveredId(null);
              }}
              onClick={(event) => {
                const frame = frameFromEvent(event);
                if (frame) activate(frame, false);
              }}
              onKeyDown={onCanvasKeyDown}
              onFocus={(event) => {
                const frame = frameFromEvent(event);
                if (!frame) return;
                setTabStopId(frame.id);
                const visible = (event.target as HTMLElement).matches(
                  ":focus-visible",
                );
                setFocusedId(visible ? frame.id : null);
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node))
                  setFocusedId(null);
              }}
            >
              {rendered.map((frame) => {
                const fill = colorMap.get(frame.id) ?? defaultPalette[0];
                const ancestor = zoomed && focusChain.has(frame) && frame !== focus;
                const match = matches?.ids.has(frame.id) ?? false;
                const labelWide =
                  labelFits(frame, pixelWidth(frame, target, measured)) ||
                  (tween != null &&
                    labelFits(frame, pixelWidth(frame, tween.from, measured)));
                return (
                  <FlameFrame
                    key={frame.id}
                    frame={frame}
                    top={rowTop(frame.depth)}
                    height={rowHeight - 1}
                    fill={fill}
                    label={labelWide}
                    query={match ? query : ""}
                    match={match}
                    dimmed={matches != null && !match}
                    ancestor={ancestor}
                    zoomed={frame === focus && zoomed}
                    active={frame.id === activeId}
                    tabStop={frame.id === stopId}
                    ariaLabel={describe(frame)}
                    reveal={
                      revealed ? null : Math.min(frame.depth, 16) * 34
                    }
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <p className="grid h-28 place-items-center rounded-xl bg-muted/40 text-xs text-muted-foreground ring-1 ring-border/60 ring-inset">
            No samples to show.
          </p>
        )}
      </div>

      {topCount > 0 && topFunctions.length > 0 && focus ? (
        <div
          data-slot="flame-graph-top-functions"
          className="border-t border-border/60 px-5 pt-4 pb-5"
        >
          <div className="mb-2.5 flex items-baseline justify-between gap-3">
            <h4 className="text-xs font-medium text-foreground">
              Top functions by self time
            </h4>
            <span className="truncate text-xs text-muted-foreground">
              {zoomed ? (
                <>
                  in <span className="font-mono">{focus.name}</span>
                </>
              ) : (
                "Select one to search"
              )}
            </span>
          </div>
          <ol className="grid gap-x-6 gap-y-0.5 @4xl/flame:grid-cols-2">
            {topFunctions.map((entry, index) => {
              const share = entry.self / focus.total;
              const lead = topFunctions[0].self || 1;
              const pressed = search === entry.name;
              const fill = colorMap.get(entry.sample.id) ?? defaultPalette[0];
              return (
                <li key={entry.name} className="min-w-0">
                  <button
                    type="button"
                    data-slot="flame-graph-top-function"
                    aria-pressed={pressed}
                    onClick={() => setSearch(pressed ? "" : entry.name)}
                    className="group/top grid h-8 w-full grid-cols-[1rem_minmax(0,1fr)_4rem_3rem] items-center gap-2.5 rounded-lg px-2 text-left text-xs @md/flame:grid-cols-[1rem_minmax(0,1fr)_6rem_4.5rem_3.25rem] @md/flame:gap-3 @2xl/flame:grid-cols-[1rem_minmax(0,1fr)_12rem_4.5rem_3.25rem] outline-none transition-colors hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:bg-muted motion-reduce:transition-none"
                  >
                    <span className="text-right text-[11px] text-muted-foreground tabular-nums">
                      {index + 1}
                    </span>
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="size-2 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: fill }}
                      />
                      <span className="truncate font-mono text-foreground">
                        {entry.name}
                      </span>
                      {entry.calls > 1 ? (
                        <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                          ×{entry.calls}
                        </span>
                      ) : null}
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative hidden h-1.5 overflow-hidden rounded-full bg-muted @md/flame:block"
                    >
                      <span
                        className="absolute inset-y-0 left-0 rounded-full motion-safe:animate-[flame-bar-in_700ms_cubic-bezier(0.22,1,0.36,1)_backwards]"
                        style={{
                          width: `${Math.max(4, (entry.self / lead) * 100)}%`,
                          backgroundImage: `linear-gradient(to right, color-mix(in oklab, ${fill} 72%, transparent), ${fill})`,
                          animationDelay: `${index * 30}ms`,
                        }}
                      />
                    </span>
                    <span className="text-right font-medium text-foreground tabular-nums">
                      {format(entry.self)}
                    </span>
                    <span className="text-right text-muted-foreground tabular-nums">
                      {percent(share)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      {activeFrame && activeInfo ? (
        <div
          ref={tipRef}
          aria-hidden="true"
          data-slot="flame-graph-tooltip"
          data-for={activeFrame.id}
          className="pointer-events-none absolute top-0 left-0 z-30 overflow-hidden rounded-xl border border-border/70 bg-popover/90 text-popover-foreground shadow-xl backdrop-blur-md"
        >
          {renderTooltip ? (
            renderTooltip(activeInfo)
          ) : (
            <DefaultTooltip info={activeInfo} format={format} />
          )}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {zoomed && focus
          ? `Zoomed to ${focus.name}, ${format(focus.total)}, ${percent(focus.total / rootTotal)} of total.`
          : ""}
        {query && matches
          ? ` ${matches.count} ${matches.count === 1 ? "match" : "matches"}, ${percent(matches.share)} of total.`
          : ""}
      </p>
      <style href="overtrue-flame-graph-motion" precedence="default">
        {`@keyframes flame-fade{from{opacity:0}}@keyframes flame-bar-in{from{transform:scaleX(0);transform-origin:left}}`}
      </style>
    </div>
  );
}

export { FlameGraph };
