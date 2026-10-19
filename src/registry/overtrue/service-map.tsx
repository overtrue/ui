"use client";

import * as React from "react";
import {
  IconBolt,
  IconCloud,
  IconDatabase,
  IconRoute,
  IconServer,
  IconStack2,
  IconWorld,
  IconX,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

export type ServiceKind =
  | "client"
  | "gateway"
  | "service"
  | "database"
  | "cache"
  | "queue"
  | "external";

export type ServiceStatus = "healthy" | "degraded" | "down";

export interface ServiceMetrics {
  /** Requests per second. */
  rps?: number;
  /** Share of failed requests as a 0–1 fraction, e.g. 0.012 for 1.2%. */
  errorRate?: number;
  /** 95th percentile latency in milliseconds. */
  p95?: number;
}

export interface ServiceMapNode {
  id: string;
  label: string;
  kind?: ServiceKind;
  /** Health. Defaults to healthy, or degraded when the error rate crosses the critical threshold. */
  status?: ServiceStatus;
  metrics?: ServiceMetrics;
  /** Team, namespace or region. Shown in the detail readout. */
  group?: string;
  /** Replaces the icon picked from `kind`. */
  icon?: React.ReactNode;
}

export interface ServiceMapEdge {
  id?: string;
  /** Id of the calling node. */
  source: string;
  /** Id of the called node. */
  target: string;
  rps?: number;
  /** Share of failed calls as a 0–1 fraction. */
  errorRate?: number;
  /** 95th percentile latency in milliseconds. */
  p95?: number;
  /** Overrides the color picked from the error rate. */
  status?: ServiceStatus;
}

export interface ServiceMapThresholds {
  /** Error rate, as a 0–1 fraction, at which traffic turns amber. Defaults to 0.01. */
  warn?: number;
  /** Error rate at which traffic turns destructive. Defaults to 0.05. */
  critical?: number;
}

/** Everything known about a node, passed to `renderNode`. */
export interface ServiceMapNodeInfo {
  kind: ServiceKind;
  status: ServiceStatus;
  /** Column (or row, top to bottom) the node was placed in, from 0. */
  layer: number;
  inbound: ServiceMapEdge[];
  outbound: ServiceMapEdge[];
  /** Hovered or focused. */
  active: boolean;
  selected: boolean;
  /** Outside the paths of the hovered, focused or selected node. */
  dimmed: boolean;
  /** Metrics run through the formatters; missing metrics are undefined. */
  formatted: { rps?: string; errorRate?: string; p95?: string };
  /** The default icon for the node's kind, or its own `icon`. */
  icon: React.ReactNode;
}

export interface ServiceMapProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "onSelect" | "children"
> {
  nodes: ServiceMapNode[];
  edges: ServiceMapEdge[];
  /** Flow left to right or top to bottom. Defaults to LR. */
  direction?: "LR" | "TB";
  /** Controlled selection. Pass null for none. */
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelect?: (id: string | null, node: ServiceMapNode | null) => void;
  /** Replaces the content of every node card. The card keeps its size, focus and status ring. */
  renderNode?: (node: ServiceMapNode, info: ServiceMapNodeInfo) => React.ReactNode;
  thresholds?: ServiceMapThresholds;
  rpsFormatter?: (rps: number) => string;
  latencyFormatter?: (ms: number) => string;
  errorRateFormatter?: (rate: number) => string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Controls placed at the top right. */
  actions?: React.ReactNode;
  /** Show the traffic legend. Defaults to true. */
  showLegend?: boolean;
  /** Animate traffic along the edges. Defaults to true; reduced motion shows static dashes. */
  animate?: boolean;
  /** Card size in pixels before scaling. Defaults to 148 × 60. */
  nodeWidth?: number;
  nodeHeight?: number;
  /** Smallest scale used to fit the container; below it the map scrolls sideways. Defaults to 0.5. */
  minScale?: number;
  /**
   * Full cards with a metrics line, or compact icon tiles with a label. "auto" switches
   * to compact when cards would have to shrink below a readable size. Defaults to auto.
   */
  density?: "auto" | "comfortable" | "compact";
}

/* ------------------------------------------------------------------------ */
/* Formatting                                                                */
/* ------------------------------------------------------------------------ */

function formatRps(rps: number) {
  if (!Number.isFinite(rps)) return "—";
  if (rps >= 1_000_000) return `${+(rps / 1_000_000).toFixed(1)}M rps`;
  if (rps >= 1000) return `${+(rps / 1000).toFixed(rps >= 10_000 ? 0 : 1)}k rps`;
  if (rps >= 10) return `${Math.round(rps)} rps`;
  return `${+rps.toFixed(1)} rps`;
}

function formatErrorRate(rate: number) {
  if (!Number.isFinite(rate)) return "—";
  const pct = rate * 100;
  if (pct === 0) return "0%";
  if (pct < 0.1) return `${+pct.toFixed(2)}%`;
  if (pct < 10) return `${+pct.toFixed(1)}%`;
  return `${Math.round(pct)}%`;
}

function formatLatency(ms: number) {
  if (!Number.isFinite(ms)) return "—";
  if (ms < 10) return `${+ms.toFixed(1)} ms`;
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${+(ms / 1000).toFixed(ms < 10_000 ? 2 : 1)} s`;
}

/* ------------------------------------------------------------------------ */
/* Layout                                                                    */
/* ------------------------------------------------------------------------ */

interface Item {
  id: string;
  layer: number;
  /** Center on the cross axis, in world pixels. */
  pos: number;
  size: number;
  dummy: boolean;
  /** Index in `nodes`, used to break ties so the layout follows data order. */
  rank: number;
  node?: ServiceMapNode;
}

interface Route {
  key: string;
  edge: ServiceMapEdge;
  index: number;
  /** Item ids from the source to the target in layer order (target first for back edges). */
  chain: string[];
  reversed: boolean;
}

interface Structure {
  layers: Item[][];
  items: Map<string, Item>;
  routes: Route[];
  layerOf: Map<string, number>;
  /** Extent on the cross axis, center to center plus the node size. */
  span: number;
}

interface Point {
  x: number;
  y: number;
}

interface PlacedEdge {
  key: string;
  edge: ServiceMapEdge;
  index: number;
  d: string;
  length: number;
  mid: Point;
  start: Point;
  end: Point;
}

const NODE_GAP = 18;
const DUMMY_GAP = 12;
const PAD = 22;
const GAP_MIN = 28;
const GAP_MAX = 136;
const GAP_TB = 64;
const FALLBACK_WIDTH = 720;
const COMPACT_W = 76;
const COMPACT_TILE = 36;
const COMPACT_H = 56;
const COMPACT_PAD = 16;
const COMPACT_GAP_MIN = 10;
const COMPACT_GAP_TB = 40;
/** Below this scale, "auto" density switches cards to compact tiles. */
const AUTO_COMPACT_BELOW = 0.62;

/** Pool adjacent violators: positions as close to `desired` as the separations allow, order kept. */
function project(desired: number[], separation: number[]) {
  const n = desired.length;
  const offset = new Array<number>(n).fill(0);
  for (let i = 1; i < n; i++) offset[i] = offset[i - 1] + separation[i - 1];
  const blocks: { sum: number; count: number; start: number }[] = [];
  for (let i = 0; i < n; i++) {
    blocks.push({ sum: desired[i] - offset[i], count: 1, start: i });
    while (blocks.length > 1) {
      const b = blocks[blocks.length - 1];
      const a = blocks[blocks.length - 2];
      if (a.sum / a.count <= b.sum / b.count) break;
      a.sum += b.sum;
      a.count += b.count;
      blocks.pop();
    }
  }
  const out = new Array<number>(n);
  blocks.forEach((block, i) => {
    const end = i + 1 < blocks.length ? blocks[i + 1].start : n;
    for (let j = block.start; j < end; j++)
      out[j] = block.sum / block.count + offset[j];
  });
  return out;
}

function buildStructure(
  nodes: ServiceMapNode[],
  edges: ServiceMapEdge[],
  crossSize: number,
  nodeGap = NODE_GAP,
): Structure {
  const known = new Map(nodes.map((node, i) => [node.id, i]));
  const valid = edges
    .map((edge, index) => ({ edge, index }))
    .filter(
      ({ edge }) =>
        known.has(edge.source) &&
        known.has(edge.target) &&
        edge.source !== edge.target,
    );

  // Break cycles: edges that close a loop in a depth-first walk are laid out reversed.
  const out = new Map<string, number[]>();
  const indegree = new Map<string, number>(nodes.map((n) => [n.id, 0]));
  valid.forEach(({ edge }, i) => {
    if (!out.has(edge.source)) out.set(edge.source, []);
    out.get(edge.source)!.push(i);
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
  });
  const state = new Map<string, 1 | 2>();
  const reversed = new Set<number>();
  const walk = (id: string) => {
    state.set(id, 1);
    for (const i of out.get(id) ?? []) {
      const target = valid[i].edge.target;
      const seen = state.get(target);
      if (seen === 1) reversed.add(i);
      else if (!seen) walk(target);
    }
    state.set(id, 2);
  };
  const starts = [
    ...nodes.filter((n) => indegree.get(n.id) === 0),
    ...nodes.filter((n) => indegree.get(n.id) !== 0),
  ];
  for (const node of starts) if (!state.has(node.id)) walk(node.id);

  // Layer by the longest path from the sources.
  const dag = valid.map(({ edge }, i) =>
    reversed.has(i)
      ? { from: edge.target, to: edge.source }
      : { from: edge.source, to: edge.target },
  );
  const succ = new Map<string, string[]>();
  const pending = new Map<string, number>(nodes.map((n) => [n.id, 0]));
  for (const { from, to } of dag) {
    if (!succ.has(from)) succ.set(from, []);
    succ.get(from)!.push(to);
    pending.set(to, (pending.get(to) ?? 0) + 1);
  }
  const layerOf = new Map<string, number>(nodes.map((n) => [n.id, 0]));
  const queue = nodes.filter((n) => pending.get(n.id) === 0).map((n) => n.id);
  while (queue.length) {
    const id = queue.shift()!;
    for (const next of succ.get(id) ?? []) {
      layerOf.set(next, Math.max(layerOf.get(next)!, layerOf.get(id)! + 1));
      pending.set(next, pending.get(next)! - 1);
      if (pending.get(next) === 0) queue.push(next);
    }
  }

  // Items: one per node, plus a dummy wherever an edge crosses a layer.
  const items = new Map<string, Item>();
  nodes.forEach((node, rank) =>
    items.set(node.id, {
      id: node.id,
      layer: layerOf.get(node.id) ?? 0,
      pos: 0,
      size: crossSize,
      dummy: false,
      rank,
      node,
    }),
  );
  const routes: Route[] = [];
  const up = new Map<string, string[]>();
  const down = new Map<string, string[]>();
  const link = (a: string, b: string) => {
    if (!down.has(a)) down.set(a, []);
    if (!up.has(b)) up.set(b, []);
    down.get(a)!.push(b);
    up.get(b)!.push(a);
  };
  valid.forEach(({ edge, index }, i) => {
    const { from, to } = dag[i];
    const a = layerOf.get(from)!;
    const b = layerOf.get(to)!;
    const key = edge.id ?? `${edge.source}->${edge.target}#${index}`;
    const chain = [from];
    for (let layer = a + 1; layer < b; layer++) {
      const id = `\u0000${key}\u0000${layer}`;
      items.set(id, {
        id,
        layer,
        pos: 0,
        size: 0,
        dummy: true,
        rank: items.get(from)!.rank + 0.5,
      });
      chain.push(id);
    }
    chain.push(to);
    for (let j = 1; j < chain.length; j++) link(chain[j - 1], chain[j]);
    routes.push({ key, edge, index, chain, reversed: reversed.has(i) });
  });

  const count = Math.max(0, ...[...items.values()].map((item) => item.layer)) + 1;
  const layers: Item[][] = Array.from({ length: count }, () => []);
  for (const item of items.values()) layers[item.layer].push(item);
  for (const layer of layers) layer.sort((a, b) => a.rank - b.rank);

  // Order within layers: barycenter sweeps, keeping the arrangement with fewest crossings.
  const index = new Map<string, number>();
  const reindex = () =>
    layers.forEach((layer) => layer.forEach((item, i) => index.set(item.id, i)));
  const crossings = () => {
    let total = 0;
    for (let l = 0; l + 1 < layers.length; l++) {
      const segments: [number, number][] = [];
      for (const item of layers[l])
        for (const next of down.get(item.id) ?? [])
          segments.push([index.get(item.id)!, index.get(next)!]);
      for (let i = 0; i < segments.length; i++)
        for (let j = i + 1; j < segments.length; j++) {
          const [a1, b1] = segments[i];
          const [a2, b2] = segments[j];
          if ((a1 - a2) * (b1 - b2) < 0) total++;
        }
    }
    return total;
  };
  reindex();
  let best = layers.map((layer) => [...layer]);
  let bestCrossings = crossings();
  for (let sweep = 0; sweep < 12 && bestCrossings > 0; sweep++) {
    const downward = sweep % 2 === 0;
    const order = downward
      ? layers.map((_, i) => i).slice(1)
      : layers.map((_, i) => i).slice(0, -1).reverse();
    for (const l of order) {
      const neighbors = downward ? up : down;
      const weight = new Map<string, number>();
      layers[l].forEach((item, i) => {
        const list = neighbors.get(item.id) ?? [];
        weight.set(
          item.id,
          list.length
            ? list.reduce((sum, id) => sum + index.get(id)!, 0) / list.length
            : i,
        );
      });
      layers[l].sort(
        (a, b) => weight.get(a.id)! - weight.get(b.id)! || a.rank - b.rank,
      );
      layers[l].forEach((item, i) => index.set(item.id, i));
    }
    const score = crossings();
    if (score < bestCrossings) {
      bestCrossings = score;
      best = layers.map((layer) => [...layer]);
    }
  }
  best.forEach((layer, l) => (layers[l] = layer));
  reindex();

  // Cross-axis positions: pull each item toward its neighbors, keeping order and spacing.
  const gapBetween = (a: Item, b: Item) =>
    (a.size + b.size) / 2 +
    (a.dummy && b.dummy ? DUMMY_GAP : a.dummy || b.dummy ? DUMMY_GAP + 4 : nodeGap);
  for (const layer of layers) {
    let cursor = 0;
    layer.forEach((item, i) => {
      if (i > 0) cursor += gapBetween(layer[i - 1], item);
      item.pos = cursor;
    });
    const mid = cursor / 2;
    for (const item of layer) item.pos -= mid;
  }
  const center = (id: string) => items.get(id)!.pos;
  for (let pass = 0; pass < 24; pass++) {
    const downward = pass % 2 === 0;
    const order = downward
      ? layers.map((_, i) => i)
      : layers.map((_, i) => i).reverse();
    for (const l of order) {
      const layer = layers[l];
      if (!layer.length) continue;
      const desired = layer.map((item) => {
        const near = [...(up.get(item.id) ?? []), ...(down.get(item.id) ?? [])];
        if (!near.length) return item.pos;
        return near.reduce((sum, id) => sum + center(id), 0) / near.length;
      });
      const separation = layer
        .slice(1)
        .map((item, i) => gapBetween(layer[i], item));
      const placed = project(desired, separation);
      layer.forEach((item, i) => (item.pos = placed[i]));
    }
  }
  let min = Infinity;
  let max = -Infinity;
  for (const item of items.values()) {
    min = Math.min(min, item.pos - item.size / 2);
    max = Math.max(max, item.pos + item.size / 2);
  }
  if (!Number.isFinite(min)) {
    min = 0;
    max = 0;
  }
  for (const item of items.values()) item.pos -= min;
  return { layers, items, routes, layerOf, span: max - min };
}

function cubic(a: Point, b: Point, horizontal: boolean, sag = 0) {
  if (horizontal) {
    const dx = (b.x - a.x) / 2;
    return {
      c1: { x: a.x + dx, y: a.y + sag },
      c2: { x: b.x - dx, y: b.y + sag },
    };
  }
  const dy = (b.y - a.y) / 2;
  return {
    c1: { x: a.x + sag, y: a.y + dy },
    c2: { x: b.x + sag, y: b.y - dy },
  };
}

function bezierAt(a: Point, c1: Point, c2: Point, b: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
    y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/* ------------------------------------------------------------------------ */
/* Visual vocabulary                                                         */
/* ------------------------------------------------------------------------ */

const kindIcon: Record<ServiceKind, React.ComponentType<{ size?: number; stroke?: number; className?: string; "aria-hidden"?: boolean | "true" }>> = {
  client: IconWorld,
  gateway: IconRoute,
  service: IconServer,
  database: IconDatabase,
  cache: IconBolt,
  queue: IconStack2,
  external: IconCloud,
};

const kindLabel: Record<ServiceKind, string> = {
  client: "client",
  gateway: "gateway",
  service: "service",
  database: "database",
  cache: "cache",
  queue: "queue",
  external: "external service",
};

const statusLabel: Record<ServiceStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
};

const statusDot: Record<ServiceStatus, string> = {
  healthy: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-destructive",
};

const statusPill: Record<ServiceStatus, string> = {
  healthy: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  degraded: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  down: "bg-destructive/10 text-destructive",
};

type Severity = "ok" | "warn" | "critical";

const severityStroke: Record<Severity, string> = {
  ok: "var(--sm-ok)",
  warn: "var(--sm-warn)",
  critical: "var(--sm-critical)",
};
const severityFlow: Record<Severity, string> = {
  ok: "var(--sm-flow)",
  warn: "var(--sm-warn)",
  critical: "var(--sm-critical)",
};

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

function StatusDot({ status, className }: { status: ServiceStatus; className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-status={status}
      className={cn("relative inline-flex size-2 shrink-0 rounded-full", statusDot[status], className)}
    >
      {status !== "healthy" ? (
        <span
          className={cn(
            "absolute inset-0 rounded-full opacity-60 motion-safe:animate-[service-map-ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite]",
            statusDot[status],
          )}
        />
      ) : null}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Component                                                                 */
/* ------------------------------------------------------------------------ */

/**
 * A live service dependency map. Nodes are laid out as a layered graph, left to
 * right by default; edges carry animated traffic whose width follows request rate
 * and whose color follows error rate. Hover or focus a node to trace its upstream
 * and downstream paths; select it to list its inbound and outbound traffic.
 */
function ServiceMap({
  nodes,
  edges,
  direction = "LR",
  selectedId: selectedProp,
  defaultSelectedId = null,
  onSelect,
  renderNode,
  thresholds,
  rpsFormatter = formatRps,
  latencyFormatter = formatLatency,
  errorRateFormatter = formatErrorRate,
  title,
  description,
  actions,
  showLegend = true,
  animate = true,
  nodeWidth = 148,
  nodeHeight = 60,
  minScale = 0.5,
  density = "auto",
  className,
  onKeyDown,
  ...props
}: ServiceMapProps) {
  const id = React.useId();
  const reduced = useReducedMotion();
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [available, setAvailable] = React.useState(0);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = React.useState<string | null>(null);
  const [innerSelected, setInnerSelected] = React.useState<string | null>(
    defaultSelectedId,
  );
  const [revealed, setRevealed] = React.useState(false);
  const selectedId = selectedProp !== undefined ? selectedProp : innerSelected;

  const warn = thresholds?.warn ?? 0.01;
  const critical = thresholds?.critical ?? 0.05;
  const horizontal = direction === "LR";

  const byId = React.useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes],
  );
  const selectedNode = selectedId ? (byId.get(selectedId) ?? null) : null;

  const select = (next: string | null) => {
    if (selectedProp === undefined) setInnerSelected(next);
    onSelect?.(next, next ? (byId.get(next) ?? null) : null);
  };

  const statusOf = React.useCallback(
    (node: ServiceMapNode): ServiceStatus =>
      node.status ??
      ((node.metrics?.errorRate ?? 0) >= critical ? "degraded" : "healthy"),
    [critical],
  );
  const severityOf = (edge: ServiceMapEdge): Severity => {
    if (edge.status === "down") return "critical";
    if (edge.status === "degraded") return "warn";
    if (edge.status === "healthy") return "ok";
    const rate = edge.errorRate ?? 0;
    if (rate >= critical) return "critical";
    if (rate >= warn) return "warn";
    return "ok";
  };

  /* ---------------------------------------------------------- layout */

  const width = available || FALLBACK_WIDTH;
  const comfortable = React.useMemo(
    () => buildStructure(nodes, edges, horizontal ? nodeHeight : nodeWidth),
    [nodes, edges, horizontal, nodeWidth, nodeHeight],
  );
  // Cards when they fit at a readable scale; icon tiles with labels otherwise.
  const comfortableWidth = horizontal
    ? comfortable.layers.length * nodeWidth +
      Math.max(0, comfortable.layers.length - 1) * GAP_MIN +
      PAD * 2
    : comfortable.span + PAD * 2;
  const compact =
    density === "compact" ||
    (density === "auto" && width / comfortableWidth < AUTO_COMPACT_BELOW);
  const compactStructure = React.useMemo(
    () =>
      compact
        ? buildStructure(
            nodes,
            edges,
            horizontal ? COMPACT_H : COMPACT_W,
            horizontal ? 8 : 12,
          )
        : null,
    [compact, nodes, edges, horizontal],
  );
  const structure = compactStructure ?? comfortable;
  const cardW = compact ? COMPACT_W : nodeWidth;
  const cardH = compact ? COMPACT_H : nodeHeight;
  const pad = compact ? COMPACT_PAD : PAD;
  const mainSize = horizontal ? cardW : cardH;
  const crossSize = horizontal ? cardH : cardW;
  // Edges meet the icon tile in compact mode, not the label under it.
  const portInset = compact && horizontal ? (COMPACT_W - COMPACT_TILE) / 2 : 0;
  const portShift = compact && horizontal ? (COMPACT_TILE - COMPACT_H) / 2 : 0;
  const portSpan = compact ? COMPACT_TILE : crossSize;
  const layerCount = structure.layers.length;

  const gapMin = horizontal
    ? compact
      ? COMPACT_GAP_MIN
      : GAP_MIN
    : compact
      ? COMPACT_GAP_TB
      : GAP_TB;
  let gap = gapMin;
  if (horizontal && layerCount > 1) {
    const fit = (width - pad * 2 - layerCount * mainSize) / (layerCount - 1);
    gap = Math.min(GAP_MAX, Math.max(gapMin, fit));
  }
  const mainExtent = layerCount * mainSize + Math.max(0, layerCount - 1) * gap;
  const worldW = horizontal ? mainExtent + pad * 2 : structure.span + pad * 2;
  const worldH = horizontal ? structure.span + pad * 2 : mainExtent + pad * 2;
  const scale = Math.max(minScale, Math.min(1, width / worldW));

  const placement = React.useMemo(() => {
    const rects = new Map<string, { x: number; y: number }>();
    const at = (item: Item): Point => {
      const main = pad + item.layer * (mainSize + gap);
      const cross = pad + item.pos;
      return horizontal ? { x: main, y: cross } : { x: cross, y: main };
    };
    for (const item of structure.items.values()) {
      if (item.dummy) continue;
      const p = at(item);
      rects.set(
        item.id,
        horizontal
          ? { x: p.x, y: p.y - cardH / 2 }
          : { x: p.x - cardW / 2, y: p.y },
      );
    }

    // Spread the ports on each side of a node so parallel edges do not merge.
    const ports = new Map<string, number>();
    const sides = new Map<string, { key: string; toward: number }[]>();
    const sideKey = (nodeId: string, side: "in" | "out") => `${nodeId}|${side}`;
    const neighborCross = (route: Route, end: "source" | "target") => {
      const chain = route.reversed ? [...route.chain].reverse() : route.chain;
      const id = end === "source" ? chain[1] : chain[chain.length - 2];
      return structure.items.get(id)!.pos;
    };
    for (const route of structure.routes) {
      const outSide = route.reversed ? "in" : "out";
      const inSide = route.reversed ? "out" : "in";
      const s = sideKey(route.edge.source, outSide);
      const t = sideKey(route.edge.target, inSide);
      if (!sides.has(s)) sides.set(s, []);
      if (!sides.has(t)) sides.set(t, []);
      sides.get(s)!.push({ key: `${route.key}|s`, toward: neighborCross(route, "source") });
      sides.get(t)!.push({ key: `${route.key}|t`, toward: neighborCross(route, "target") });
    }
    for (const list of sides.values()) {
      list.sort((a, b) => a.toward - b.toward);
      const step =
        list.length > 1
          ? Math.min(compact ? 5 : 7, (portSpan - (compact ? 12 : 24)) / (list.length - 1))
          : 0;
      list.forEach((entry, i) =>
        ports.set(entry.key, (i - (list.length - 1) / 2) * step),
      );
    }

    const placed: PlacedEdge[] = [];
    for (const route of structure.routes) {
      const chain = route.reversed ? [...route.chain].reverse() : route.chain;
      const source = structure.items.get(chain[0])!;
      const target = structure.items.get(chain[chain.length - 1])!;
      const forward = !route.reversed;
      const ps = at(source);
      const pt = at(target);
      const so = ports.get(`${route.key}|s`) ?? 0;
      const to = ports.get(`${route.key}|t`) ?? 0;
      const start: Point = horizontal
        ? {
            x: forward ? ps.x + mainSize - portInset : ps.x + portInset,
            y: ps.y + portShift + so,
          }
        : { x: ps.x + so, y: forward ? ps.y + mainSize : ps.y };
      const end: Point = horizontal
        ? {
            x: forward ? pt.x + portInset : pt.x + mainSize - portInset,
            y: pt.y + portShift + to,
          }
        : { x: pt.x + to, y: forward ? pt.y : pt.y + mainSize };
      const waypoints: Point[] = [start];
      for (const id of chain.slice(1, -1)) {
        const p = at(structure.items.get(id)!);
        const enter = forward ? 0 : mainSize;
        const leave = forward ? mainSize : 0;
        waypoints.push(
          horizontal ? { x: p.x + enter, y: p.y } : { x: p.x, y: p.y + enter },
          horizontal ? { x: p.x + leave, y: p.y } : { x: p.x, y: p.y + leave },
        );
      }
      waypoints.push(end);

      let d = `M${r1(start.x)} ${r1(start.y)}`;
      const samples: Point[] = [start];
      for (let i = 1; i < waypoints.length; i++) {
        const a = waypoints[i - 1];
        const b = waypoints[i];
        // Odd segments cross a gap and curve; even ones run straight through a layer.
        if (i % 2 === 1) {
          const sag = !forward && waypoints.length === 2 ? crossSize * 0.75 : 0;
          const { c1, c2 } = cubic(a, b, horizontal, sag);
          d += ` C${r1(c1.x)} ${r1(c1.y)} ${r1(c2.x)} ${r1(c2.y)} ${r1(b.x)} ${r1(b.y)}`;
          for (let s = 1; s <= 16; s++) samples.push(bezierAt(a, c1, c2, b, s / 16));
        } else {
          d += ` L${r1(b.x)} ${r1(b.y)}`;
          samples.push(b);
        }
      }
      let length = 0;
      const cumulative = [0];
      for (let i = 1; i < samples.length; i++) {
        length += Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y);
        cumulative.push(length);
      }
      const half = length / 2;
      let mid = samples[0];
      for (let i = 1; i < samples.length; i++)
        if (cumulative[i] >= half) {
          const f = (half - cumulative[i - 1]) / (cumulative[i] - cumulative[i - 1] || 1);
          mid = {
            x: samples[i - 1].x + (samples[i].x - samples[i - 1].x) * f,
            y: samples[i - 1].y + (samples[i].y - samples[i - 1].y) * f,
          };
          break;
        }
      placed.push({ key: route.key, edge: route.edge, index: route.index, d, length, mid, start, end });
    }
    return { rects, edges: placed };
  }, [
    structure,
    gap,
    pad,
    horizontal,
    compact,
    mainSize,
    crossSize,
    cardW,
    cardH,
    portInset,
    portShift,
    portSpan,
  ]);

  /* ---------------------------------------------------------- measure */

  useIsomorphicLayoutEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const measure = () => setAvailable(element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // When the map scrolls sideways, keep the selected service in view.
  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current;
    const rect = selectedId ? placement.rects.get(selectedId) : undefined;
    if (!viewport || !rect || viewport.scrollWidth <= viewport.clientWidth) return;
    const center = (rect.x + cardW / 2) * scale;
    viewport.scrollLeft = Math.max(0, center - viewport.clientWidth / 2);
  }, [selectedId, scale, compact]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  /* ---------------------------------------------------------- relationships */

  const inbound = React.useMemo(() => {
    const map = new Map<string, ServiceMapEdge[]>();
    for (const edge of edges) {
      if (!map.has(edge.target)) map.set(edge.target, []);
      map.get(edge.target)!.push(edge);
    }
    return map;
  }, [edges]);
  const outbound = React.useMemo(() => {
    const map = new Map<string, ServiceMapEdge[]>();
    for (const edge of edges) {
      if (!map.has(edge.source)) map.set(edge.source, []);
      map.get(edge.source)!.push(edge);
    }
    return map;
  }, [edges]);

  const hoveredPlaced = hoveredEdge
    ? (placement.edges.find((edge) => edge.key === hoveredEdge) ?? null)
    : null;
  const activeId = hoveredId ?? focusedId ?? (hoveredPlaced ? null : selectedId);
  const readoutId = hoveredId ?? focusedId;
  const readoutNode = readoutId ? (byId.get(readoutId) ?? null) : null;

  // Everything upstream and downstream of the active node, edge by edge.
  const lit = React.useMemo(() => {
    if (hoveredPlaced) {
      return {
        nodes: new Set([hoveredPlaced.edge.source, hoveredPlaced.edge.target]),
        edges: new Set([hoveredPlaced.key]),
      };
    }
    if (!activeId || !byId.has(activeId)) return null;
    const litNodes = new Set<string>([activeId]);
    const litEdges = new Set<string>();
    const keyOf = new Map(
      placement.edges.map((placed) => [placed.edge, placed.key]),
    );
    const visit = (start: string, along: "up" | "down") => {
      const stack = [start];
      const seen = new Set([start]);
      while (stack.length) {
        const current = stack.pop()!;
        const list =
          along === "down" ? outbound.get(current) : inbound.get(current);
        for (const edge of list ?? []) {
          const key = keyOf.get(edge);
          if (key) litEdges.add(key);
          const next = along === "down" ? edge.target : edge.source;
          litNodes.add(next);
          if (!seen.has(next)) {
            seen.add(next);
            stack.push(next);
          }
        }
      }
    };
    visit(activeId, "up");
    visit(activeId, "down");
    return { nodes: litNodes, edges: litEdges };
  }, [activeId, hoveredPlaced, byId, inbound, outbound, placement.edges]);

  /* ---------------------------------------------------------- keyboard */

  const tabOrder = React.useMemo(
    () =>
      structure.layers.flatMap((layer) =>
        layer.filter((item) => !item.dummy).map((item) => item.id),
      ),
    [structure],
  );

  const focusNode = (nodeId: string | undefined) => {
    if (!nodeId) return;
    viewportRef.current
      ?.querySelector<HTMLElement>(
        `[data-slot="service-map-node"][data-id="${CSS.escape(nodeId)}"]`,
      )
      ?.focus();
  };

  const onNodeKeyDown = (event: React.KeyboardEvent<HTMLElement>, nodeId: string) => {
    const item = structure.items.get(nodeId);
    if (!item) return;
    const layer = structure.layers[item.layer].filter((entry) => !entry.dummy);
    const position = layer.indexOf(item);
    const across = (delta: 1 | -1) => {
      for (
        let l = item.layer + delta;
        l >= 0 && l < structure.layers.length;
        l += delta
      ) {
        const candidates = structure.layers[l].filter((entry) => !entry.dummy);
        if (!candidates.length) continue;
        return candidates.reduce((best, entry) =>
          Math.abs(entry.pos - item.pos) < Math.abs(best.pos - item.pos)
            ? entry
            : best,
        ).id;
      }
      return undefined;
    };
    const keys: Record<string, () => string | undefined> = horizontal
      ? {
          ArrowUp: () => layer[position - 1]?.id,
          ArrowDown: () => layer[position + 1]?.id,
          ArrowLeft: () => across(-1),
          ArrowRight: () => across(1),
        }
      : {
          ArrowLeft: () => layer[position - 1]?.id,
          ArrowRight: () => layer[position + 1]?.id,
          ArrowUp: () => across(-1),
          ArrowDown: () => across(1),
        };
    keys.Home = () => tabOrder[0];
    keys.End = () => tabOrder[tabOrder.length - 1];
    const move = keys[event.key];
    if (!move) return;
    event.preventDefault();
    focusNode(move());
  };

  /* ---------------------------------------------------------- render helpers */

  const maxRps = Math.max(1, ...edges.map((edge) => edge.rps ?? 0));
  const formatMetrics = (metrics?: ServiceMetrics) => ({
    rps: metrics?.rps != null ? rpsFormatter(metrics.rps) : undefined,
    errorRate:
      metrics?.errorRate != null ? errorRateFormatter(metrics.errorRate) : undefined,
    p95: metrics?.p95 != null ? latencyFormatter(metrics.p95) : undefined,
  });
  const errorClass = (rate: number | undefined) =>
    rate == null
      ? ""
      : rate >= critical
        ? "text-destructive"
        : rate >= warn
          ? "text-amber-700 dark:text-amber-400"
          : "";
  const iconFor = (node: ServiceMapNode, size = 15) => {
    if (node.icon) return node.icon;
    const Icon = kindIcon[node.kind ?? "service"];
    return <Icon aria-hidden="true" size={size} stroke={1.75} />;
  };

  const describeNode = (node: ServiceMapNode) => {
    const status = statusOf(node);
    const parts = [node.label, kindLabel[node.kind ?? "service"], statusLabel[status]];
    const m = formatMetrics(node.metrics);
    if (m.rps) parts.push(m.rps);
    if (m.errorRate) parts.push(`${m.errorRate} errors`);
    if (m.p95) parts.push(`p95 ${m.p95}`);
    const ins = inbound.get(node.id)?.length ?? 0;
    const outs = outbound.get(node.id)?.length ?? 0;
    parts.push(`${ins} inbound, ${outs} outbound`);
    return parts.join(", ");
  };

  const edgeSummary = (edge: ServiceMapEdge) =>
    [
      edge.rps != null ? rpsFormatter(edge.rps) : null,
      edge.errorRate != null ? `${errorRateFormatter(edge.errorRate)} errors` : null,
      edge.p95 != null ? `p95 ${latencyFormatter(edge.p95)}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

  const counts = { healthy: 0, degraded: 0, down: 0 };
  for (const node of nodes) counts[statusOf(node)] += 1;

  const hasHeader = title != null || description != null || actions != null;
  const mapLabel = typeof title === "string" ? title : "Service map";
  const motion = animate && !reduced;
  const offsetX = Math.max(0, (width - worldW * scale) / 2);

  /* ---------------------------------------------------------- render */

  return (
    <div
      data-slot="service-map"
      data-direction={direction}
      data-selected={selectedNode ? true : undefined}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.key !== "Escape") return;
        if (selectedId == null && !hoveredEdge) return;
        event.preventDefault();
        setHoveredEdge(null);
        if (selectedId != null) select(null);
      }}
      className={cn(
        "@container/service-map flex min-w-0 flex-col rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
        "[--sm-ok:color-mix(in_oklab,var(--color-muted-foreground)_34%,var(--color-card))] dark:[--sm-ok:color-mix(in_oklab,var(--color-chart-1)_26%,var(--color-muted))]",
        "[--sm-flow:var(--color-chart-1)] [--sm-warn:var(--color-amber-500,oklch(76.9%_0.188_70.08))] [--sm-critical:var(--color-destructive)]",
        className,
      )}
      {...props}
    >
      <style href="overtrue-service-map" precedence="default">
        {`@keyframes service-map-ping{75%,100%{transform:scale(2.4);opacity:0}}@keyframes service-map-draw{from{stroke-dashoffset:var(--len)}}@keyframes service-map-rise{from{opacity:0;transform:translateY(6px) scale(.97)}}@keyframes service-map-fade{from{opacity:0}}@keyframes service-map-glow{0%,100%{opacity:.55}50%{opacity:1}}`}
      </style>

      {hasHeader || nodes.length > 0 ? (
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 px-5 pt-5">
          <div className="min-w-0 space-y-1">
            {title != null ? (
              <h3 className="text-sm leading-5 font-semibold tracking-tight">
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
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {nodes.length > 0 ? (
              <ul
                data-slot="service-map-summary"
                aria-label="Health summary"
                className="flex items-center gap-3 text-xs text-muted-foreground"
              >
                {(["healthy", "degraded", "down"] as const)
                  .filter((status) => status === "healthy" || counts[status] > 0)
                  .map((status) => (
                    <li key={status} className="flex items-center gap-1.5">
                      <StatusDot status={status} />
                      <span className="font-medium text-foreground tabular-nums">
                        {counts[status]}
                      </span>
                      {statusLabel[status].toLowerCase()}
                    </li>
                  ))}
              </ul>
            ) : null}
            {actions != null ? (
              <div className="flex items-center gap-1">{actions}</div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="px-3 pt-4 pb-3">
        <div
          ref={viewportRef}
          data-slot="service-map-viewport"
          className="relative overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-xl bg-muted/35 ring-1 ring-border/50 ring-inset [scrollbar-width:thin]"
        >
          {nodes.length === 0 ? (
            <p className="grid h-40 place-items-center text-xs text-muted-foreground">
              No services to show.
            </p>
          ) : (
            <div
              className="relative"
              style={{
                width: worldW * scale,
                height: worldH * scale,
                marginLeft: offsetX,
              }}
            >
              <div
                role="group"
                aria-roledescription="service map"
                aria-label={`${mapLabel}: ${nodes.length} services, ${edges.length} connections. Arrow keys move between services, Enter selects, Escape clears.`}
                aria-describedby={description != null ? `${id}-description` : undefined}
                data-slot="service-map-world"
                className="absolute top-0 left-0 origin-top-left"
                style={{
                  width: worldW,
                  height: worldH,
                  transform: scale === 1 ? undefined : `scale(${scale})`,
                }}
                onPointerLeave={() => {
                  setHoveredId(null);
                  setHoveredEdge(null);
                }}
              >
                <svg
                  aria-hidden="true"
                  data-slot="service-map-edges"
                  className="absolute inset-0 overflow-visible"
                  width={worldW}
                  height={worldH}
                  viewBox={`0 0 ${worldW} ${worldH}`}
                >
                  {placement.edges.map((placed) => {
                    const { edge } = placed;
                    const severity = severityOf(edge);
                    const share = Math.sqrt(Math.max(0, edge.rps ?? 0) / maxRps);
                    const strokeWidth = edge.rps != null ? 1 + share * 3 : 1.25;
                    const highlighted = lit?.edges.has(placed.key) ?? false;
                    const dimmed = lit != null && !highlighted;
                    const sourceLayer = structure.layerOf.get(edge.source) ?? 0;
                    const particles = Math.min(4, Math.max(1, Math.round(1 + share * 3)));
                    const speed = 38 + share * 72;
                    const duration = Math.max(1.2, placed.length / speed);
                    const stroke =
                      severity === "ok" && highlighted
                        ? "color-mix(in oklab, var(--sm-flow) 70%, var(--sm-ok))"
                        : severityStroke[severity];
                    return (
                      <g
                        key={placed.key}
                        data-slot="service-map-edge"
                        data-id={placed.key}
                        data-severity={severity}
                        data-active={highlighted || undefined}
                        data-dimmed={dimmed || undefined}
                        className="transition-opacity duration-150 motion-reduce:transition-none"
                        style={{
                          opacity: dimmed ? 0.16 : 1,
                          color: severityFlow[severity],
                        }}
                      >
                        <path
                          d={placed.d}
                          fill="none"
                          stroke={stroke}
                          strokeWidth={strokeWidth}
                          strokeLinecap="round"
                          className={cn(
                            "transition-[stroke] duration-150 motion-reduce:transition-none",
                            severity !== "ok" &&
                              "dark:[filter:drop-shadow(0_0_5px_color-mix(in_oklab,currentColor_55%,transparent))]",
                            highlighted &&
                              "dark:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,currentColor_60%,transparent))]",
                            !revealed &&
                              "motion-safe:[stroke-dasharray:var(--len)] motion-safe:animate-[service-map-draw_900ms_cubic-bezier(0.22,1,0.36,1)_backwards]",
                          )}
                          style={
                            {
                              "--len": Math.ceil(placed.length + 4),
                              animationDelay: revealed ? undefined : `${160 + sourceLayer * 110}ms`,
                            } as React.CSSProperties
                          }
                        />
                        {motion ? (
                          <g
                            data-slot="service-map-flow"
                            className={cn(
                              "dark:[filter:drop-shadow(0_0_3px_currentColor)]",
                              !revealed &&
                                "motion-safe:animate-[service-map-fade_600ms_ease-out_backwards]",
                            )}
                            style={{
                              animationDelay: revealed ? undefined : `${700 + sourceLayer * 110}ms`,
                            }}
                          >
                            {Array.from({ length: particles }, (_, i) => (
                              <circle
                                key={i}
                                r={highlighted ? 2.4 : 2}
                                fill="currentColor"
                                opacity={severity === "ok" ? 0.9 : 1}
                              >
                                <animateMotion
                                  dur={`${duration.toFixed(2)}s`}
                                  begin={`${(-(duration * i) / particles - (placed.index % 5) * 0.37).toFixed(2)}s`}
                                  repeatCount="indefinite"
                                  path={placed.d}
                                />
                              </circle>
                            ))}
                          </g>
                        ) : (
                          <path
                            data-slot="service-map-flow"
                            d={placed.d}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={Math.min(2.6, strokeWidth + 0.4)}
                            strokeLinecap="round"
                            strokeDasharray="0 11"
                            opacity={severity === "ok" ? 0.8 : 0.95}
                          />
                        )}
                        <circle
                          cx={placed.end.x}
                          cy={placed.end.y}
                          r={2.5}
                          fill="var(--color-card)"
                          stroke={stroke}
                          strokeWidth={1.5}
                          className={cn(
                            !revealed &&
                              "motion-safe:animate-[service-map-fade_300ms_ease-out_backwards]",
                          )}
                          style={{
                            animationDelay: revealed
                              ? undefined
                              : `${760 + sourceLayer * 110}ms`,
                          }}
                        />
                        <path
                          d={placed.d}
                          fill="none"
                          stroke="transparent"
                          strokeWidth={14}
                          className="pointer-events-[stroke] cursor-default"
                          onPointerEnter={() => {
                            setHoveredId(null);
                            setHoveredEdge(placed.key);
                          }}
                          onPointerLeave={() => setHoveredEdge(null)}
                        />
                      </g>
                    );
                  })}
                </svg>

                {tabOrder.map((nodeId) => {
                  const node = byId.get(nodeId)!;
                  const rect = placement.rects.get(nodeId)!;
                  const status = statusOf(node);
                  const kind = node.kind ?? "service";
                  const selected = selectedId === nodeId;
                  const active = hoveredId === nodeId || focusedId === nodeId;
                  const onPath = lit?.nodes.has(nodeId) ?? false;
                  const dimmed = lit != null && !onPath;
                  const formatted = formatMetrics(node.metrics);
                  const layer = structure.layerOf.get(nodeId) ?? 0;
                  // The lit surface: a card in comfortable density, the icon tile in compact.
                  const surface = cn(
                    "border border-border/80 bg-card",
                    "shadow-[0_1px_2px_rgb(0_0_0/0.05),0_4px_12px_-6px_rgb(0_0_0/0.12)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_1px_2px_rgb(0_0_0/0.5)]",
                    "transition-[opacity,box-shadow,border-color,translate] duration-150 ease-out motion-reduce:transition-none",
                    active &&
                      status === "healthy" &&
                      !selected &&
                      "border-foreground/25 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_10px_24px_-10px_rgb(0_0_0/0.25)]",
                    status === "degraded" &&
                      "border-amber-500/70 shadow-[0_0_0_3px_color-mix(in_oklab,var(--sm-warn)_16%,transparent),0_8px_24px_-8px_color-mix(in_oklab,var(--sm-warn)_45%,transparent)] dark:shadow-[0_0_0_3px_color-mix(in_oklab,var(--sm-warn)_18%,transparent),0_0_28px_-6px_color-mix(in_oklab,var(--sm-warn)_55%,transparent)]",
                    status === "down" &&
                      "border-destructive/80 shadow-[0_0_0_3px_color-mix(in_oklab,var(--sm-critical)_16%,transparent),0_8px_24px_-8px_color-mix(in_oklab,var(--sm-critical)_50%,transparent)] dark:shadow-[0_0_0_3px_color-mix(in_oklab,var(--sm-critical)_20%,transparent),0_0_32px_-6px_color-mix(in_oklab,var(--sm-critical)_60%,transparent)]",
                    selected &&
                      "border-primary/70 shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_22%,transparent),0_10px_30px_-10px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] dark:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_26%,transparent),0_0_32px_-4px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]",
                  );
                  const downRing =
                    status === "down" ? (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-[5px] rounded-[inherit] border border-destructive/50 opacity-60 motion-safe:animate-[service-map-glow_2.2s_ease-in-out_infinite]"
                      />
                    ) : null;
                  const iconTint = cn(
                    "text-muted-foreground transition-colors duration-150 motion-reduce:transition-none",
                    (active || selected) && "text-foreground",
                    status === "degraded" && "text-amber-700 dark:text-amber-400",
                    status === "down" && "text-destructive",
                  );
                  const shared = {
                    type: "button" as const,
                    "data-slot": "service-map-node",
                    "data-id": nodeId,
                    "data-status": status,
                    "data-kind": kind,
                    "data-density": compact ? "compact" : "comfortable",
                    "data-active": active || (lit != null && onPath) || undefined,
                    "data-selected": selected || undefined,
                    "data-dimmed": dimmed || undefined,
                    "aria-label": describeNode(node),
                    "aria-pressed": selected,
                    onClick: () => select(selected ? null : nodeId),
                    onPointerEnter: () => {
                      setHoveredEdge(null);
                      setHoveredId(nodeId);
                    },
                    onPointerLeave: () => setHoveredId(null),
                    onFocus: (event: React.FocusEvent<HTMLButtonElement>) =>
                      setFocusedId(
                        event.currentTarget.matches(":focus-visible") ? nodeId : null,
                      ),
                    onBlur: () => setFocusedId(null),
                    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) =>
                      onNodeKeyDown(event, nodeId),
                    style: {
                      left: rect.x,
                      top: rect.y,
                      width: cardW,
                      height: cardH,
                      animationDelay: revealed ? undefined : `${layer * 110}ms`,
                    } as React.CSSProperties,
                  };
                  const reveal =
                    !revealed &&
                    "motion-safe:animate-[service-map-rise_700ms_cubic-bezier(0.22,1,0.36,1)_backwards]";

                  if (compact) {
                    return (
                      <button
                        key={nodeId}
                        {...shared}
                        className={cn(
                          "group/node absolute flex flex-col items-center gap-1 bg-transparent p-0 text-center outline-none select-none transition-opacity duration-150 motion-reduce:transition-none",
                          dimmed && "opacity-40",
                          reveal,
                        )}
                      >
                        <span
                          aria-hidden="true"
                          data-slot="service-map-node-tile"
                          className={cn(
                            "relative grid shrink-0 place-items-center rounded-[11px] [&>svg]:size-4",
                            surface,
                            iconTint,
                            "group-hover/node:-translate-y-px group-focus-visible/node:ring-2 group-focus-visible/node:ring-ring/60 group-focus-visible/node:ring-offset-2 group-focus-visible/node:ring-offset-card",
                          )}
                          style={{ width: COMPACT_TILE, height: COMPACT_TILE }}
                        >
                          {downRing}
                          {iconFor(node, 16)}
                          <StatusDot
                            status={status}
                            className="absolute -top-1 -right-1 ring-2 ring-card"
                          />
                        </span>
                        <span className="max-w-full truncate px-0.5 text-[11.5px] leading-4 font-medium tracking-tight">
                          {node.label}
                        </span>
                      </button>
                    );
                  }

                  const info: ServiceMapNodeInfo = {
                    kind,
                    status,
                    layer,
                    inbound: inbound.get(nodeId) ?? [],
                    outbound: outbound.get(nodeId) ?? [],
                    active,
                    selected,
                    dimmed,
                    formatted,
                    icon: iconFor(node),
                  };
                  return (
                    <button
                      key={nodeId}
                      {...shared}
                      className={cn(
                        "group/node absolute flex flex-col overflow-visible rounded-xl p-0 text-left text-card-foreground outline-none select-none hover:-translate-y-px",
                        surface,
                        "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                        dimmed && "opacity-40",
                        reveal,
                      )}
                    >
                      {downRing}
                      {renderNode ? (
                        renderNode(node, info)
                      ) : (
                        <>
                          <span className="flex min-w-0 items-center gap-2 px-2.5 pt-2.5">
                            <span
                              aria-hidden="true"
                              className={cn(
                                "grid size-6 shrink-0 place-items-center rounded-md bg-muted ring-1 ring-border/60 ring-inset [&>svg]:size-3.5",
                                iconTint,
                                status === "degraded" && "bg-amber-500/12 ring-amber-500/25",
                                status === "down" && "bg-destructive/12 ring-destructive/25",
                              )}
                            >
                              {iconFor(node, 14)}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-[13px] leading-5 font-medium tracking-tight">
                              {node.label}
                            </span>
                            <StatusDot status={status} />
                          </span>
                          <span className="flex min-w-0 items-center gap-1 overflow-hidden px-2.5 pt-1.5 text-[11px] leading-4 whitespace-nowrap text-muted-foreground tabular-nums">
                            {[
                              formatted.rps ? (
                                <span key="rps" className="text-foreground/85">
                                  {formatted.rps}
                                </span>
                              ) : null,
                              formatted.errorRate ? (
                                <span key="err" className={errorClass(node.metrics?.errorRate)}>
                                  {formatted.errorRate}
                                </span>
                              ) : null,
                              formatted.p95 ? <span key="p95">{formatted.p95}</span> : null,
                            ]
                              .filter(Boolean)
                              .flatMap((part, i) =>
                                i === 0
                                  ? [part]
                                  : [
                                      <span key={`sep${i}`} aria-hidden="true" className="text-muted-foreground/45">
                                        ·
                                      </span>,
                                      part,
                                    ],
                              )}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {compact && readoutNode && !hoveredPlaced ? (
                <NodeReadout
                  node={readoutNode}
                  status={statusOf(readoutNode)}
                  formatted={formatMetrics(readoutNode.metrics)}
                  errorClass={errorClass(readoutNode.metrics?.errorRate)}
                  rect={placement.rects.get(readoutNode.id)!}
                  cardW={cardW}
                  cardH={cardH}
                  scale={scale}
                  worldWidth={worldW * scale}
                />
              ) : null}

              {hoveredPlaced ? (
                <div
                  aria-hidden="true"
                  data-slot="service-map-edge-readout"
                  className="pointer-events-none absolute z-30 w-max -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-xl border border-border/70 bg-popover/90 px-3 py-2 text-popover-foreground shadow-xl backdrop-blur-md motion-safe:animate-[service-map-fade_150ms_ease-out]"
                  style={{
                    left: Math.min(
                      Math.max(hoveredPlaced.mid.x * scale, 96),
                      worldW * scale - 96,
                    ),
                    top: Math.max(hoveredPlaced.mid.y * scale, 64),
                  }}
                >
                  <p className="flex items-center gap-1.5 text-xs font-medium">
                    {byId.get(hoveredPlaced.edge.source)?.label}
                    <span aria-hidden="true" className="text-muted-foreground">
                      →
                    </span>
                    {byId.get(hoveredPlaced.edge.target)?.label}
                  </p>
                  <EdgeMetrics
                    edge={hoveredPlaced.edge}
                    className="mt-1"
                    rpsFormatter={rpsFormatter}
                    latencyFormatter={latencyFormatter}
                    errorRateFormatter={errorRateFormatter}
                    errorClass={errorClass}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {selectedNode ? (
        <ServiceDetail
          key={selectedNode.id}
          node={selectedNode}
          status={statusOf(selectedNode)}
          icon={iconFor(selectedNode, 16)}
          inbound={inbound.get(selectedNode.id) ?? []}
          outbound={outbound.get(selectedNode.id) ?? []}
          byId={byId}
          statusOf={statusOf}
          severityOf={severityOf}
          formatMetrics={formatMetrics}
          errorClass={errorClass}
          edgeKey={(edge) =>
            placement.edges.find((placed) => placed.edge === edge)?.key ?? null
          }
          onHoverEdge={setHoveredEdge}
          onSelect={(nodeId) => {
            select(nodeId);
            requestAnimationFrame(() => focusNode(nodeId));
          }}
          onClose={() => select(null)}
          rpsFormatter={rpsFormatter}
          latencyFormatter={latencyFormatter}
          errorRateFormatter={errorRateFormatter}
        />
      ) : null}

      {showLegend ? (
        <div
          data-slot="service-map-legend"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 px-5 py-3 text-xs text-muted-foreground"
        >
          {(
            [
              ["ok", "Healthy traffic"],
              ["warn", `Errors ≥ ${errorRateFormatter(warn)}`],
              ["critical", `Errors ≥ ${errorRateFormatter(critical)}`],
            ] as const
          ).map(([severity, label]) => (
            <span key={severity} className="flex items-center gap-2">
              <svg aria-hidden="true" width="22" height="8" className="shrink-0 overflow-visible">
                <line
                  x1="1"
                  y1="4"
                  x2="21"
                  y2="4"
                  stroke={severityStroke[severity]}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="13" cy="4" r="2" fill={severityFlow[severity]} />
              </svg>
              {label}
            </span>
          ))}
          <span className="flex items-center gap-2 @2xl/service-map:ml-auto">
            <svg aria-hidden="true" width="22" height="8" className="shrink-0">
              <path d="M1 3.5 L21 1 L21 7 L1 4.5 Z" fill="var(--sm-ok)" />
            </svg>
            Width shows requests per second
          </span>
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {selectedNode
          ? `${selectedNode.label} selected, ${statusLabel[statusOf(selectedNode)].toLowerCase()}. ${inbound.get(selectedNode.id)?.length ?? 0} inbound and ${outbound.get(selectedNode.id)?.length ?? 0} outbound connections.`
          : ""}
        {hoveredPlaced ? ` ${byId.get(hoveredPlaced.edge.source)?.label} to ${byId.get(hoveredPlaced.edge.target)?.label}: ${edgeSummary(hoveredPlaced.edge)}` : ""}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Detail                                                                    */
/* ------------------------------------------------------------------------ */

/** Floating readout for compact tiles, which have no room for a metrics line. */
function NodeReadout({
  node,
  status,
  formatted,
  errorClass,
  rect,
  cardW,
  cardH,
  scale,
  worldWidth,
}: {
  node: ServiceMapNode;
  status: ServiceStatus;
  formatted: { rps?: string; errorRate?: string; p95?: string };
  errorClass: string;
  rect: { x: number; y: number };
  cardW: number;
  cardH: number;
  scale: number;
  worldWidth: number;
}) {
  const above = rect.y * scale > 56;
  const parts = [
    formatted.rps ? <span key="rps" className="font-medium text-foreground">{formatted.rps}</span> : null,
    formatted.errorRate ? (
      <span key="err" className={cn("font-medium text-foreground", errorClass)}>
        {formatted.errorRate}
      </span>
    ) : null,
    formatted.p95 ? <span key="p95">p95 {formatted.p95}</span> : null,
  ].filter(Boolean);
  return (
    <div
      aria-hidden="true"
      data-slot="service-map-node-readout"
      className={cn(
        "pointer-events-none absolute z-30 w-max -translate-x-1/2 rounded-xl border border-border/70 bg-popover/90 px-3 py-2 text-popover-foreground shadow-xl backdrop-blur-md motion-safe:animate-[service-map-fade_150ms_ease-out]",
        above ? "-translate-y-[calc(100%+6px)]" : "translate-y-1.5",
      )}
      style={{
        left: Math.min(Math.max((rect.x + cardW / 2) * scale, 84), worldWidth - 84),
        top: above ? rect.y * scale : (rect.y + cardH) * scale,
      }}
    >
      <p className="flex items-center gap-1.5 text-xs font-medium">
        <StatusDot status={status} />
        {node.label}
        <span className="font-normal text-muted-foreground">
          {statusLabel[status].toLowerCase()}
        </span>
      </p>
      {parts.length ? (
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
          {parts.flatMap((part, i) =>
            i === 0
              ? [part]
              : [
                  <span key={`sep${i}`} aria-hidden="true" className="text-muted-foreground/45">
                    ·
                  </span>,
                  part,
                ],
          )}
        </p>
      ) : null}
    </div>
  );
}

function EdgeMetrics({
  edge,
  className,
  rpsFormatter,
  latencyFormatter,
  errorRateFormatter,
  errorClass,
}: {
  edge: ServiceMapEdge;
  className?: string;
  rpsFormatter: (rps: number) => string;
  latencyFormatter: (ms: number) => string;
  errorRateFormatter: (rate: number) => string;
  errorClass: (rate: number | undefined) => string;
}) {
  return (
    <p className={cn("flex items-center gap-3 text-xs text-muted-foreground tabular-nums", className)}>
      {edge.rps != null ? (
        <span>
          <span className="font-medium text-foreground">{rpsFormatter(edge.rps)}</span>
        </span>
      ) : null}
      {edge.errorRate != null ? (
        <span>
          <span className={cn("font-medium text-foreground", errorClass(edge.errorRate))}>
            {errorRateFormatter(edge.errorRate)}
          </span>{" "}
          errors
        </span>
      ) : null}
      {edge.p95 != null ? (
        <span>
          p95{" "}
          <span className="font-medium text-foreground">{latencyFormatter(edge.p95)}</span>
        </span>
      ) : null}
    </p>
  );
}

function ServiceDetail({
  node,
  status,
  icon,
  inbound,
  outbound,
  byId,
  statusOf,
  severityOf,
  formatMetrics,
  errorClass,
  edgeKey,
  onHoverEdge,
  onSelect,
  onClose,
  rpsFormatter,
  latencyFormatter,
  errorRateFormatter,
}: {
  node: ServiceMapNode;
  status: ServiceStatus;
  icon: React.ReactNode;
  inbound: ServiceMapEdge[];
  outbound: ServiceMapEdge[];
  byId: Map<string, ServiceMapNode>;
  statusOf: (node: ServiceMapNode) => ServiceStatus;
  severityOf: (edge: ServiceMapEdge) => Severity;
  formatMetrics: (metrics?: ServiceMetrics) => { rps?: string; errorRate?: string; p95?: string };
  errorClass: (rate: number | undefined) => string;
  edgeKey: (edge: ServiceMapEdge) => string | null;
  onHoverEdge: (key: string | null) => void;
  onSelect: (id: string) => void;
  onClose: () => void;
  rpsFormatter: (rps: number) => string;
  latencyFormatter: (ms: number) => string;
  errorRateFormatter: (rate: number) => string;
}) {
  const formatted = formatMetrics(node.metrics);
  const figures = [
    { key: "rps", label: "Requests", value: formatted.rps, className: "" },
    {
      key: "err",
      label: "Error rate",
      value: formatted.errorRate,
      className: errorClass(node.metrics?.errorRate),
    },
    { key: "p95", label: "p95 latency", value: formatted.p95, className: "" },
  ].filter((figure) => figure.value != null);

  const list = (title: string, items: ServiceMapEdge[], side: "in" | "out") => (
    <div className="min-w-0">
      <h4 className="mb-1.5 flex items-baseline gap-1.5 text-xs text-muted-foreground">
        {title}
        <span className="tabular-nums">{items.length}</span>
      </h4>
      {items.length ? (
        <ul className="-mx-2 flex flex-col">
          {items.map((edge, i) => {
            const otherId = side === "in" ? edge.source : edge.target;
            const other = byId.get(otherId);
            const severity = severityOf(edge);
            const key = edgeKey(edge);
            return (
              <li key={`${otherId}-${i}`}>
                <button
                  type="button"
                  data-slot="service-map-detail-edge"
                  data-severity={severity}
                  onPointerEnter={() => onHoverEdge(key)}
                  onPointerLeave={() => onHoverEdge(null)}
                  onFocus={() => onHoverEdge(key)}
                  onBlur={() => onHoverEdge(null)}
                  onClick={() => other && onSelect(other.id)}
                  aria-label={`${side === "in" ? "From" : "To"} ${other?.label ?? otherId}${edge.rps != null ? `, ${rpsFormatter(edge.rps)}` : ""}${edge.errorRate != null ? `, ${errorRateFormatter(edge.errorRate)} errors` : ""}${edge.p95 != null ? `, p95 ${latencyFormatter(edge.p95)}` : ""}. Select ${other?.label ?? otherId}.`}
                  className="grid h-8 w-full grid-cols-[minmax(0,1fr)_3.75rem_2.75rem_3.25rem] items-center gap-2 rounded-lg px-2 @md/service-map:grid-cols-[minmax(0,1fr)_4.5rem_3.5rem_4rem] text-left text-xs outline-none transition-colors hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-0.5 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: severityStroke[severity] === "var(--sm-ok)" ? "var(--sm-flow)" : severityStroke[severity] }}
                    />
                    <span className="truncate font-medium text-foreground">
                      {other?.label ?? otherId}
                    </span>
                    {other && statusOf(other) !== "healthy" ? (
                      <StatusDot status={statusOf(other)} className="size-1.5" />
                    ) : null}
                  </span>
                  <span className="text-right text-foreground tabular-nums">
                    {edge.rps != null ? rpsFormatter(edge.rps) : "—"}
                  </span>
                  <span className={cn("text-right text-muted-foreground tabular-nums", errorClass(edge.errorRate))}>
                    {edge.errorRate != null ? errorRateFormatter(edge.errorRate) : "—"}
                  </span>
                  <span className="text-right text-muted-foreground tabular-nums">
                    {edge.p95 != null ? latencyFormatter(edge.p95) : "—"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="py-1.5 text-xs text-muted-foreground">None</p>
      )}
    </div>
  );

  return (
    <section
      data-slot="service-map-detail"
      aria-label={`${node.label} details`}
      className="border-t border-border/60 px-5 pt-4 pb-4 motion-safe:animate-[service-map-fade_240ms_ease-out]"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground ring-1 ring-border/60 ring-inset [&>svg]:size-4",
            status === "degraded" && "bg-amber-500/12 text-amber-700 ring-amber-500/25 dark:text-amber-400",
            status === "down" && "bg-destructive/12 text-destructive ring-destructive/25",
          )}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h4 className="text-sm leading-5 font-semibold tracking-tight">
              {node.label}
            </h4>
            <span
              className={cn(
                "inline-flex h-5 items-center gap-1.5 rounded-full px-2 text-[11px] font-medium",
                statusPill[status],
              )}
            >
              <span aria-hidden="true" className={cn("size-1.5 rounded-full", statusDot[status])} />
              {statusLabel[status]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {kindLabel[node.kind ?? "service"][0].toUpperCase() + kindLabel[node.kind ?? "service"].slice(1)}
            {node.group ? (
              <>
                {" · "}
                <span className="font-mono">{node.group}</span>
              </>
            ) : null}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Clear selection"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
        >
          <IconX aria-hidden="true" size={15} />
        </button>
      </div>

      {figures.length ? (
        <dl className="mt-3 grid grid-cols-3 gap-2">
          {figures.map((figure) => {
            const match = /^([-+<]?[\d.,]+)\s*(\D.*)?$/.exec(figure.value!);
            return (
              <div
                key={figure.key}
                className="rounded-lg bg-muted/40 px-3 py-2 ring-1 ring-border/50 ring-inset"
              >
                <dt className="text-[11px] text-muted-foreground">{figure.label}</dt>
                <dd className={cn("text-lg leading-7 font-semibold tracking-[-0.02em] tabular-nums", figure.className)}>
                  {match ? (
                    <>
                      {match[1]}
                      {match[2] ? (
                        <span
                          className={cn(
                            "text-xs font-medium tracking-normal text-muted-foreground",
                            /^[a-zµ]/i.test(match[2]) && "ml-0.5",
                          )}
                        >
                          {match[2]}
                        </span>
                      ) : null}
                    </>
                  ) : (
                    figure.value
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      ) : null}

      <div className="mt-4 grid gap-x-8 gap-y-4 @2xl/service-map:grid-cols-2">
        {list("Inbound", inbound, "in")}
        {list("Outbound", outbound, "out")}
      </div>
    </section>
  );
}

export { ServiceMap };
