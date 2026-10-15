"use client";

import * as React from "react";
import { IconArrowUp, IconChevronRight } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export interface TreemapNode<TMeta = unknown> {
  /** Unique across the whole tree. Used for the path, keys and transitions. */
  id: string;
  label: string;
  /** Amount for a leaf. Nodes with children always show the sum of their children. */
  value?: number;
  children?: TreemapNode<TMeta>[];
  /** Any CSS colour. Applies to this node and everything under it. */
  color?: string;
  /** Anything else your labels or handlers need, such as a file count or an owner. */
  meta?: TMeta;
}

/** Label tier picked from the tile's size: lg shows label, value and share; xs shows nothing. */
export type TreemapLabelSize = "lg" | "md" | "sm" | "xs";

/** Where a formatted value is shown: dense tile labels, or the breadcrumb, readout and labels for assistive tech. */
export type TreemapFormatContext = "tile" | "detail";

/** Everything known about a tile, passed to `renderLabel`. */
export interface TreemapTileInfo<TMeta = unknown> {
  value: number;
  /** The value run through `valueFormatter` for a tile. */
  formattedValue: string;
  /** Share of the parent node, 0–1. */
  share: number;
  /** Share of the whole map, 0–1. */
  shareOfTotal: number;
  /** Depth below the top level: 0 for a top-level node. */
  depth: number;
  /** Nodes from the top level down to and including this one. */
  path: TreemapNode<TMeta>[];
  /** Tile size in CSS pixels, and the label tier picked for it. */
  width: number;
  height: number;
  size: TreemapLabelSize;
  /** Resolved fill and a readable text colour for it. */
  fill: string;
  ink: string;
  /** Leaves under this node, or 1 for a leaf. */
  leafCount: number;
  /** Whether activating the tile zooms into it. */
  drillable: boolean;
  /** Whether the tile is hovered or focused. */
  active: boolean;
}

export interface TreemapProps<TMeta = unknown> extends Omit<
  React.ComponentProps<"div">,
  "title" | "onSelect" | "children"
> {
  /** Top-level nodes. Leaves carry values; parents sum their children. */
  data: TreemapNode<TMeta>[];
  /**
   * Formats values. `context` is "tile" for tile labels and "detail" for the
   * breadcrumb, readout and accessible labels. Defaults to compact numbers on tiles
   * and grouped digits elsewhere.
   */
  valueFormatter?: (value: number, context: TreemapFormatContext) => string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Controls placed at the top right, such as a period picker. */
  actions?: React.ReactNode;
  /**
   * Height of the map: pixels, or any CSS length. The card is a size container, so
   * container units work, e.g. "clamp(240px, 56cqw, 420px)". Defaults to 360.
   */
  height?: number | string;
  /** Levels drawn at once. Deeper levels appear as outlined groups. Defaults to 1. */
  maxDepth?: number;
  /** Colours for top-level groups, cycled in data order. Defaults to chart-1 … chart-5. */
  colors?: string[];
  /** Name of the top of the hierarchy in the breadcrumb. Defaults to "All". */
  rootLabel?: string;
  /** Controlled drill-down path: ids from the top level to the node being shown. */
  path?: string[];
  /** Initial path when uncontrolled. */
  defaultPath?: string[];
  /** Called with the new path and its nodes whenever the view zooms in or out. */
  onPathChange?: (path: string[], nodes: TreemapNode<TMeta>[]) => void;
  /** Called when a tile is clicked or activated with Enter, before any zoom. */
  onSelect?: (node: TreemapNode<TMeta>, path: TreemapNode<TMeta>[]) => void;
  /** Replace the content of every tile. Return null to leave a tile blank. */
  renderLabel?: (
    node: TreemapNode<TMeta>,
    info: TreemapTileInfo<TMeta>,
  ) => React.ReactNode;
}

type Rect = { x: number; y: number; w: number; h: number };

interface Item<TMeta> {
  id: string;
  node: TreemapNode<TMeta> | null;
  label: string;
  value: number;
  /** -1 for the root, 0 for top-level nodes. */
  depth: number;
  color: string;
  parent: Item<TMeta> | null;
  children: Item<TMeta>[];
  leafCount: number;
  /** Value relative to the largest sibling, 0–1. */
  rank: number;
}

interface Placement<TMeta> {
  key: string;
  item: Item<TMeta>;
  rect: Rect;
  kind: "tile" | "group" | "hidden";
  header: number;
}

interface Frame {
  rect: Rect;
  opacity: number;
}

interface Zoom {
  key: number;
  from: string;
  phase: "start" | "run";
}

const ROOT_ID = "\u0000treemap-root";
const GAP = 2;
const GROUP_HEADER = 22;
const GROUP_PAD = 3;
const DURATION = 560;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const FALLBACK_WIDTH = 640;

const defaultColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const exactNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

function defaultFormatter(value: number, context: TreemapFormatContext) {
  return context === "tile"
    ? compactNumber.format(value)
    : exactNumber.format(value);
}

function percent(share: number) {
  const pct = share * 100;
  if (!(pct > 0)) return "0%";
  if (pct < 0.1) return "<0.1%";
  if (pct >= 99.95) return "100%";
  return `${pct.toFixed(1)}%`;
}

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

/** Normalise the data: sum parents, drop empty nodes, sort by size and resolve colours. */
function buildTree<TMeta>(
  data: TreemapNode<TMeta>[],
  colors: string[],
  rootLabel: string,
) {
  const palette = colors.length ? colors : defaultColors;
  const index = new Map<string, Item<TMeta>>();
  const root: Item<TMeta> = {
    id: ROOT_ID,
    node: null,
    label: rootLabel,
    value: 0,
    depth: -1,
    color: "var(--color-muted-foreground)",
    parent: null,
    children: [],
    leafCount: 0,
    rank: 1,
  };
  index.set(ROOT_ID, root);

  const visit = (
    nodes: TreemapNode<TMeta>[],
    parent: Item<TMeta>,
    depth: number,
  ): Item<TMeta>[] => {
    const items: Item<TMeta>[] = [];
    nodes.forEach((node, position) => {
      const item: Item<TMeta> = {
        id: node.id,
        node,
        label: node.label,
        value: 0,
        depth,
        // Colours follow data order, so they stay put when values change.
        color:
          node.color ??
          (depth === 0 ? palette[position % palette.length] : parent.color),
        parent,
        children: [],
        leafCount: 1,
        rank: 1,
      };
      if (node.children?.length) {
        item.children = visit(node.children, item, depth + 1);
        item.value = item.children.reduce((sum, child) => sum + child.value, 0);
        item.leafCount = item.children.reduce(
          (sum, child) => sum + child.leafCount,
          0,
        );
      } else {
        const value = Number(node.value);
        item.value = Number.isFinite(value) && value > 0 ? value : 0;
      }
      if (item.value > 0) {
        items.push(item);
        index.set(item.id, item);
      }
    });
    items.sort((a, b) => b.value - a.value);
    const largest = items[0]?.value || 1;
    for (const item of items) item.rank = item.value / largest;
    return items;
  };

  root.children = visit(data, root, 0);
  root.value = root.children.reduce((sum, child) => sum + child.value, 0);
  root.leafCount = root.children.reduce(
    (sum, child) => sum + child.leafCount,
    0,
  );
  return { root, index };
}

/** Bruls, Huizing and van Wijk's squarified layout. Values must be sorted, largest first. */
function squarify(values: number[], area: Rect): Rect[] {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (!(total > 0) || area.w <= 0 || area.h <= 0)
    return values.map(() => ({ x: area.x, y: area.y, w: 0, h: 0 }));
  const scale = (area.w * area.h) / total;
  const sizes = values.map((value) => value * scale);
  const out: Rect[] = new Array(values.length);
  let { x, y, w, h } = area;
  let start = 0;
  while (start < sizes.length) {
    const side = Math.min(w, h);
    let end = start;
    let sum = 0;
    let min = Infinity;
    let max = 0;
    let worst = Infinity;
    while (end < sizes.length) {
      const size = sizes[end];
      const nextSum = sum + size;
      const nextMin = Math.min(min, size);
      const nextMax = Math.max(max, size);
      const ratio = Math.max(
        (side * side * nextMax) / (nextSum * nextSum),
        (nextSum * nextSum) / (side * side * nextMin),
      );
      if (end > start && ratio > worst) break;
      worst = ratio;
      sum = nextSum;
      min = nextMin;
      max = nextMax;
      end++;
    }
    const last = end >= sizes.length;
    if (w >= h) {
      // A column along the left edge.
      const columnWidth = last ? w : sum / h;
      let cursor = y;
      for (let i = start; i < end; i++) {
        const tall = i === end - 1 ? y + h - cursor : sizes[i] / columnWidth;
        out[i] = { x, y: cursor, w: columnWidth, h: tall };
        cursor += tall;
      }
      x += columnWidth;
      w -= columnWidth;
    } else {
      // A row along the top edge.
      const rowHeight = last ? h : sum / w;
      let cursor = x;
      for (let i = start; i < end; i++) {
        const wide = i === end - 1 ? x + w - cursor : sizes[i] / rowHeight;
        out[i] = { x: cursor, y, w: wide, h: rowHeight };
        cursor += wide;
      }
      y += rowHeight;
      h -= rowHeight;
    }
    start = end;
  }
  return out;
}

/**
 * Lay out everything under `focus` in a width × height frame. Levels within
 * `maxDepth` are drawn; deeper levels are still placed (hidden) so zooms can start
 * from where a node would sit.
 */
function layoutView<TMeta>(
  focus: Item<TMeta>,
  width: number,
  height: number,
  maxDepth: number,
) {
  const map = new Map<string, Placement<TMeta>>();
  const place = (
    parent: Item<TMeta>,
    area: Rect,
    level: number,
    visible: boolean,
  ) => {
    if (!parent.children.length) return;
    const rects = squarify(
      parent.children.map((child) => child.value),
      area,
    );
    parent.children.forEach((child, i) => {
      const rect = rects[i];
      let kind: Placement<TMeta>["kind"] = "hidden";
      let header = 0;
      if (visible) {
        const group =
          child.children.length > 0 &&
          level < maxDepth &&
          rect.w >= 48 &&
          rect.h >= 40;
        kind = group ? "group" : "tile";
        if (group && rect.w >= 72 && rect.h >= 64) header = GROUP_HEADER;
      }
      map.set(child.id, {
        key: kind === "group" ? `${child.id}\u0000group` : child.id,
        item: child,
        rect,
        kind,
        header,
      });
      if (!child.children.length) return;
      const inner =
        kind === "group"
          ? {
              x: rect.x + GROUP_PAD,
              y: rect.y + (header || GROUP_PAD),
              w: Math.max(0, rect.w - GROUP_PAD * 2),
              h: Math.max(0, rect.h - (header || GROUP_PAD) - GROUP_PAD),
            }
          : rect;
      place(child, inner, level + 1, kind === "group");
    });
  };
  place(focus, { x: 0, y: 0, w: width, h: height }, 1, true);
  return map;
}

/** Map a rect so that `frame` fills the whole view: the geometry of a camera zoom. */
function zoomRect(
  rect: Rect,
  frame: Rect,
  width: number,
  height: number,
): Rect {
  const sx = width / (frame.w || 1);
  const sy = height / (frame.h || 1);
  return {
    x: (rect.x - frame.x) * sx,
    y: (rect.y - frame.y) * sy,
    w: rect.w * sx,
    h: rect.h * sy,
  };
}

/** The inverse of zoomRect: squeeze a full-view rect into `frame`. */
function unzoomRect(
  rect: Rect,
  frame: Rect,
  width: number,
  height: number,
): Rect {
  const sx = frame.w / (width || 1);
  const sy = frame.h / (height || 1);
  return {
    x: frame.x + rect.x * sx,
    y: frame.y + rect.y * sy,
    w: rect.w * sx,
    h: rect.h * sy,
  };
}

function isWithin<TMeta>(item: Item<TMeta>, ancestor: Item<TMeta>) {
  for (
    let current: Item<TMeta> | null = item;
    current;
    current = current.parent
  )
    if (current === ancestor) return true;
  return false;
}

function lineage<TMeta>(item: Item<TMeta>) {
  const chain: Item<TMeta>[] = [];
  for (
    let current: Item<TMeta> | null = item;
    current && current.depth >= 0;
    current = current.parent
  )
    chain.unshift(current);
  return chain;
}

/** Deeper levels and smaller siblings get lighter, so neighbours of one hue stay distinct. */
function fillFor<TMeta>(item: Item<TMeta>) {
  const base = [0.9, 0.82, 0.72, 0.64][Math.min(Math.max(item.depth, 0), 3)];
  const strength = base * (0.42 + 0.58 * Math.pow(item.rank, 0.7));
  return `color-mix(in oklab, ${item.color} ${Math.round(strength * 100)}%, var(--color-card))`;
}

/**
 * Light or dark text picked from the fill's own lightness and tinted with its hue.
 * Browsers without relative colour syntax keep the inherited foreground.
 */
function inkFor(fill: string) {
  return `oklch(from ${fill} clamp(0.2, (0.64 - l) * 1000, 0.985) min(c, 0.04) h)`;
}

function labelSize(width: number, height: number): TreemapLabelSize {
  if (width >= 104 && height >= 70) return "lg";
  if (width >= 64 && height >= 38) return "md";
  if (width >= 34 && height >= 20) return "sm";
  return "xs";
}

function boxStyle(rect: Rect, width: number, height: number, inset: number) {
  const ix = rect.w > inset * 2 ? inset : 0;
  const iy = rect.h > inset * 2 ? inset : 0;
  return {
    left: `calc(${(rect.x / width) * 100}% + ${ix}px)`,
    top: `calc(${(rect.y / height) * 100}% + ${iy}px)`,
    width: `calc(${(rect.w / width) * 100}% - ${ix * 2}px)`,
    height: `calc(${(rect.h / height) * 100}% - ${iy * 2}px)`,
  };
}

function DefaultLabel({
  label,
  info,
  childCount,
}: {
  label: string;
  info: TreemapTileInfo;
  childCount: number;
}) {
  if (info.size === "xs") return null;
  // A label cut to a couple of letters is noise; drop it and let the readout name the tile.
  const fits = (font: number) =>
    label.length <= Math.floor((info.width - 16) / (font * 0.56)) ||
    (info.width - 16) / (font * 0.56) >= 6;
  if (info.size === "sm")
    return fits(11) ? (
      <span className="block truncate px-1.5 pt-1 text-[11px] leading-4 font-medium">
        {label}
      </span>
    ) : null;
  if (info.size === "md")
    return (
      <span className="flex min-w-0 flex-col px-2 pt-1.5">
        {fits(12) ? (
          <span className="truncate text-xs leading-4 font-medium">
            {label}
          </span>
        ) : null}
        <span className="truncate text-[11px] leading-4 tabular-nums opacity-80">
          {info.formattedValue}
        </span>
      </span>
    );
  const big = info.width >= 176 && info.height >= 120;
  return (
    <span className="flex h-full min-w-0 flex-col justify-between gap-1 p-2.5">
      <span
        className={cn(
          "min-w-0 text-xs leading-4 font-medium",
          info.height >= 84 ? "line-clamp-2 break-words" : "truncate",
        )}
      >
        {label}
      </span>
      <span className="flex min-w-0 items-end justify-between gap-2">
        <span className="flex min-w-0 items-baseline gap-1.5">
          <span
            className={cn(
              "truncate leading-none font-semibold tracking-tight",
              big ? "text-[22px]" : "text-[15px]",
            )}
          >
            {info.formattedValue}
          </span>
          {info.width >= 132 ? (
            <span className="shrink-0 font-mono text-[10.5px] leading-none tabular-nums opacity-70">
              {percent(info.share)}
            </span>
          ) : null}
        </span>
        {info.drillable && info.width >= 150 ? (
          <span className="flex shrink-0 items-center gap-0.5 font-mono text-[10.5px] leading-none tabular-nums opacity-70">
            {childCount}
            <IconChevronRight aria-hidden="true" size={11} stroke={2.25} />
          </span>
        ) : null}
      </span>
    </span>
  );
}

/** Pick the tile whose centre lies closest in the arrow's direction. */
function neighbourIn<TMeta>(
  tiles: Placement<TMeta>[],
  from: Placement<TMeta>,
  key: string,
) {
  const cx = from.rect.x + from.rect.w / 2;
  const cy = from.rect.y + from.rect.h / 2;
  let best: Placement<TMeta> | null = null;
  let bestScore = Infinity;
  for (const tile of tiles) {
    if (tile === from) continue;
    const r = tile.rect;
    const tx = r.x + r.w / 2;
    const ty = r.y + r.h / 2;
    let along: number;
    let across: number;
    if (key === "ArrowRight") {
      if (r.x < from.rect.x + from.rect.w - 1) continue;
      along = r.x - (from.rect.x + from.rect.w);
      across = Math.abs(ty - cy);
    } else if (key === "ArrowLeft") {
      if (r.x + r.w > from.rect.x + 1) continue;
      along = from.rect.x - (r.x + r.w);
      across = Math.abs(ty - cy);
    } else if (key === "ArrowDown") {
      if (r.y < from.rect.y + from.rect.h - 1) continue;
      along = r.y - (from.rect.y + from.rect.h);
      across = Math.abs(tx - cx);
    } else {
      if (r.y + r.h > from.rect.y + 1) continue;
      along = from.rect.y - (r.y + r.h);
      across = Math.abs(tx - cx);
    }
    const score = Math.max(0, along) + across * 2;
    if (score < bestScore) {
      best = tile;
      bestScore = score;
    }
  }
  return best;
}

/**
 * A squarified treemap for hierarchical totals. Click or press Enter on a tile to
 * zoom into it with an animated layout tween; the breadcrumb, Backspace or Escape
 * zoom back out. Hover or focus a tile to read its share of the parent and the total.
 */
function Treemap<TMeta = unknown>({
  data,
  valueFormatter = defaultFormatter,
  title,
  description,
  actions,
  height = 360,
  maxDepth = 1,
  colors = defaultColors,
  rootLabel = "All",
  path: pathProp,
  defaultPath,
  onPathChange,
  onSelect,
  renderLabel,
  className,
  ...props
}: TreemapProps<TMeta>) {
  const id = React.useId();
  const reduced = useReducedMotion();
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const pendingFocus = React.useRef<string | null>(null);
  const [measured, setMeasured] = React.useState<{
    w: number;
    h: number;
  } | null>(null);
  const [instant, setInstant] = React.useState(true);
  const [revealed, setRevealed] = React.useState(false);
  const [internalPath, setInternalPath] = React.useState<string[]>(
    defaultPath ?? [],
  );
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const [tabStopId, setTabStopId] = React.useState<string | null>(null);
  const [zoom, setZoom] = React.useState<Zoom | null>(null);

  const colorKey = colors.join("|");
  const tree = React.useMemo(
    () => buildTree(data, colorKey ? colorKey.split("|") : [], rootLabel),
    // colorKey stands in for `colors`, so inline arrays do not rebuild the tree.
    [data, colorKey, rootLabel],
  );
  const { root, index } = tree;
  const depthLimit = Math.max(1, Math.floor(maxDepth));

  const requestedPath = pathProp ?? internalPath;
  const chain = React.useMemo(() => {
    const result = [root];
    let current = root;
    for (const step of requestedPath) {
      const next = current.children.find((child) => child.id === step);
      if (!next || !next.children.length) break;
      result.push(next);
      current = next;
    }
    return result;
  }, [root, requestedPath]);
  const focus = chain[chain.length - 1];

  const width = measured?.w ?? FALLBACK_WIDTH;
  const frameHeight =
    measured?.h ??
    (typeof height === "number" ? height : FALLBACK_WIDTH * 0.5625);
  const layout = React.useMemo(
    () => layoutView(focus, width, frameHeight, depthLimit),
    [focus, width, frameHeight, depthLimit],
  );
  const placements = React.useMemo(
    () => [...layout.values()].filter((p) => p.kind !== "hidden"),
    [layout],
  );
  const tiles = React.useMemo(
    () => placements.filter((p) => p.kind === "tile"),
    [placements],
  );

  // Start a zoom whenever the focused node changes; the previous layout is derived
  // from the node we are leaving, so nothing has to be cached between renders.
  const [shownFocus, setShownFocus] = React.useState(focus.id);
  if (shownFocus !== focus.id) {
    setShownFocus(focus.id);
    setHoveredId(null);
    setFocusedId(null);
    setZoom(
      reduced || !measured
        ? null
        : { key: (zoom?.key ?? 0) + 1, from: shownFocus, phase: "start" },
    );
  }

  // Every tile moves under one camera transform, so nothing crosses paths: the old
  // arrangement zooms away and fades while the new one zooms in from the same place.
  const transition = React.useMemo(() => {
    if (!zoom) return null;
    const previous = index.get(zoom.from);
    if (!previous || !(previous.children.length > 0)) return null;
    const before = layoutView(previous, width, frameHeight, depthLimit);
    const frameIn = isWithin(focus, previous)
      ? before.get(focus.id)?.rect
      : undefined;
    const frameOut =
      !frameIn && isWithin(previous, focus)
        ? layout.get(previous.id)?.rect
        : undefined;
    const start = new Map<string, Frame>();
    for (const p of placements) {
      start.set(p.key, {
        rect: frameIn
          ? unzoomRect(p.rect, frameIn, width, frameHeight)
          : frameOut
            ? zoomRect(p.rect, frameOut, width, frameHeight)
            : p.rect,
        opacity: 0,
      });
    }
    const exits: { placement: Placement<TMeta>; to: Rect }[] = [];
    for (const p of before.values()) {
      if (p.kind === "hidden") continue;
      exits.push({
        placement: p,
        to: frameIn
          ? zoomRect(p.rect, frameIn, width, frameHeight)
          : frameOut
            ? unzoomRect(p.rect, frameOut, width, frameHeight)
            : p.rect,
      });
    }
    return { start, exits };
    // Recompute per zoom, not per phase.
  }, [
    zoom?.key,
    zoom?.from,
    layout,
    placements,
    index,
    width,
    frameHeight,
    depthLimit,
  ]);

  useIsomorphicLayoutEffect(() => {
    const element = canvasRef.current;
    if (!element) return;
    let frame = 0;
    let last: { w: number; h: number } | null = null;
    const measure = () => {
      const w = element.clientWidth;
      const h = element.clientHeight;
      if (!w || !h) return;
      if (last && last.w === w && last.h === h) return;
      last = { w, h };
      // Re-layout on resize without tweening every tile after the pointer.
      setInstant(true);
      setMeasured({ w, h });
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setInstant(false));
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (zoom?.phase !== "start") return;
    // Commit the start frame so moving to the end frame is a CSS transition.
    canvasRef.current?.getBoundingClientRect();
    const key = zoom.key;
    const frame = requestAnimationFrame(() =>
      setZoom((current) =>
        current && current.key === key ? { ...current, phase: "run" } : current,
      ),
    );
    return () => cancelAnimationFrame(frame);
  }, [zoom?.key, zoom?.phase]);

  React.useEffect(() => {
    if (zoom?.phase !== "run") return;
    const key = zoom.key;
    const timer = window.setTimeout(
      () =>
        setZoom((current) => (current && current.key === key ? null : current)),
      DURATION + 40,
    );
    return () => window.clearTimeout(timer);
  }, [zoom?.key, zoom?.phase]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  // After a keyboard zoom, keep focus in the map.
  React.useEffect(() => {
    const target = pendingFocus.current;
    const canvas = canvasRef.current;
    if (!target || !canvas) return;
    pendingFocus.current = null;
    const live = Array.from(
      canvas.querySelectorAll<HTMLElement>(
        '[data-slot="treemap-tile"]:not([data-exiting])',
      ),
    );
    const previous = index.get(target);
    const match =
      live.find((element) => element.dataset.id === target) ??
      (previous
        ? live.find((element) => {
            const item = index.get(element.dataset.id ?? "");
            return item ? isWithin(item, previous) : false;
          })
        : undefined) ??
      live[0];
    match?.focus({ preventScroll: true });
  }, [focus.id, index]);

  const format = valueFormatter;
  const activeId = zoom ? null : (hoveredId ?? focusedId);
  const activeItem = activeId ? (index.get(activeId) ?? null) : null;
  const stopId =
    tabStopId && tiles.some((p) => p.item.id === tabStopId)
      ? tabStopId
      : (tiles[0]?.item.id ?? null);

  const commitPath = (target: Item<TMeta>) => {
    const nodes = lineage(target);
    const next = nodes.map((item) => item.id);
    if (pathProp === undefined) setInternalPath(next);
    onPathChange?.(
      next,
      nodes.map((item) => item.node!),
    );
  };

  const activate = (item: Item<TMeta>, fromKeyboard: boolean) => {
    const nodes = lineage(item);
    onSelect?.(
      item.node!,
      nodes.map((entry) => entry.node!),
    );
    // Zoom into the tile, or into its group when it is a leaf drawn inside one.
    const target = item.children.length
      ? item
      : item.parent && item.parent !== focus
        ? item.parent
        : null;
    if (!target || target === focus) return;
    if (fromKeyboard) pendingFocus.current = "first";
    commitPath(target);
  };

  const goUp = (fromKeyboard: boolean) => {
    if (!focus.parent) return;
    if (fromKeyboard) pendingFocus.current = focus.id;
    commitPath(focus.parent);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.dataset.slot !== "treemap-tile") return;
    const current = tiles.find((p) => p.item.id === target.dataset.id);
    if (!current) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(current.item, true);
      return;
    }
    if (event.key === "Backspace" || event.key === "Escape") {
      if (!focus.parent) return;
      event.preventDefault();
      goUp(true);
      return;
    }
    let next: Placement<TMeta> | null | undefined = null;
    if (event.key.startsWith("Arrow"))
      next = neighbourIn(tiles, current, event.key);
    else if (event.key === "Home") next = tiles[0];
    else if (event.key === "End") next = tiles[tiles.length - 1];
    else return;
    event.preventDefault();
    if (!next) return;
    setTabStopId(next.item.id);
    canvasRef.current
      ?.querySelector<HTMLElement>(
        `[data-slot="treemap-tile"][data-id="${CSS.escape(next.item.id)}"]:not([data-exiting])`,
      )
      ?.focus({ preventScroll: true });
  };

  const hasHeader = title != null || description != null || actions != null;
  const mapLabel = typeof title === "string" ? title : "Treemap";
  const shareOfParent = (item: Item<TMeta>) =>
    item.parent && item.parent.value > 0 ? item.value / item.parent.value : 1;
  const shareOfTotal = (item: Item<TMeta>) =>
    root.value > 0 ? item.value / root.value : 0;

  const describe = (item: Item<TMeta>) => {
    const parts = [
      item.label,
      format(item.value, "detail"),
      `${percent(shareOfParent(item))} of ${item.parent?.label ?? rootLabel}`,
    ];
    if (item.depth > 0) parts.push(`${percent(shareOfTotal(item))} of total`);
    if (item.children.length)
      parts.push(`${item.children.length} items, press Enter to zoom in`);
    return parts.join(", ");
  };

  const phase = zoom && transition ? zoom.phase : null;
  const labelsHidden = zoom != null;
  const motion = !reduced && !instant;
  const moveTransition = (fade: number, fadeDelay = 0) =>
    [
      `left ${DURATION}ms ${EASE}`,
      `top ${DURATION}ms ${EASE}`,
      `width ${DURATION}ms ${EASE}`,
      `height ${DURATION}ms ${EASE}`,
      `opacity ${fade}ms ${fadeDelay}ms ease-out`,
    ].join(", ");

  const frameFor = (
    p: Placement<TMeta>,
    exitTo: Rect | null,
  ): { style: React.CSSProperties; exiting: boolean } => {
    let rect = p.rect;
    let opacity: number | undefined;
    if (transition && phase === "start") {
      const from = exitTo ? null : transition.start.get(p.key);
      rect = from?.rect ?? p.rect;
      opacity = from ? from.opacity : 1;
    } else if (transition && phase === "run") {
      rect = exitTo ?? p.rect;
      opacity = exitTo ? 0 : 1;
    }
    let css = "none";
    if (motion && phase !== "start")
      css =
        phase === "run"
          ? exitTo
            ? moveTransition(
                Math.round(DURATION * 0.5),
                Math.round(DURATION * 0.1),
              )
            : moveTransition(Math.round(DURATION * 0.55))
          : moveTransition(240);
    return {
      exiting: exitTo != null,
      style: {
        ...boxStyle(rect, width, frameHeight, GAP / 2),
        opacity,
        transition: css,
      },
    };
  };

  const revealDelay = (rect: Rect) =>
    `${Math.round(((rect.x + rect.w / 2) / width + (rect.y + rect.h / 2) / frameHeight) * 210)}ms`;

  const renderGroup = (p: Placement<TMeta>, exitTo: Rect | null) => {
    const { style, exiting } = frameFor(p, exitTo);
    const { item } = p;
    const groupActive = activeItem != null && isWithin(activeItem, item);
    return (
      <div
        key={exiting ? `${p.key}\u0000exit` : p.key}
        data-slot="treemap-group"
        data-id={item.id}
        data-depth={item.depth}
        data-active={groupActive || undefined}
        data-exiting={exiting || undefined}
        aria-hidden="true"
        className={cn(
          "absolute overflow-hidden rounded-[5px] border",
          exiting && "pointer-events-none",
          !revealed &&
            "motion-safe:animate-[treemap-tile-in_600ms_cubic-bezier(0.22,1,0.36,1)_backwards]",
        )}
        style={{
          ...style,
          borderColor: `color-mix(in oklab, ${item.color} ${groupActive ? 55 : 30}%, var(--color-border))`,
          backgroundColor: `color-mix(in oklab, ${item.color} 7%, var(--color-card))`,
          animationDelay: revealed ? undefined : revealDelay(p.rect),
        }}
      >
        {p.header ? (
          <div
            className="flex h-[19px] w-full cursor-pointer items-center gap-1.5 px-1.5 text-[11px] leading-none transition-opacity duration-200 motion-reduce:transition-none"
            style={{ opacity: labelsHidden ? 0 : 1 }}
            onPointerEnter={() => setHoveredId(item.id)}
            onClick={exiting ? undefined : () => activate(item, false)}
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="min-w-0 truncate font-medium text-foreground">
              {item.label}
            </span>
            {p.rect.w >= 128 ? (
              <span className="ml-auto shrink-0 text-muted-foreground tabular-nums">
                {format(item.value, "tile")}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  };

  const renderTile = (p: Placement<TMeta>, exitTo: Rect | null) => {
    const { style, exiting } = frameFor(p, exitTo);
    const { item } = p;
    const fill = fillFor(item);
    const ink = inkFor(fill);
    const tileWidth = Math.max(0, p.rect.w - GAP);
    const tileHeight = Math.max(0, p.rect.h - GAP);
    const active = !exiting && activeItem === item;
    const dimmed =
      !exiting &&
      activeItem != null &&
      activeItem !== root &&
      !isWithin(item, activeItem);
    const drillable = item.children.length > 0;
    const info: TreemapTileInfo<TMeta> = {
      value: item.value,
      formattedValue: format(item.value, "tile"),
      share: shareOfParent(item),
      shareOfTotal: shareOfTotal(item),
      depth: item.depth,
      path: lineage(item).map((entry) => entry.node!),
      width: tileWidth,
      height: tileHeight,
      size: labelSize(tileWidth, tileHeight),
      fill,
      ink,
      leafCount: item.leafCount,
      drillable,
      active,
    };
    const content = renderLabel ? (
      renderLabel(item.node!, info)
    ) : (
      <DefaultLabel
        label={item.label}
        info={info as TreemapTileInfo}
        childCount={item.children.length}
      />
    );
    return (
      <button
        key={exiting ? `${p.key}\u0000exit` : p.key}
        type="button"
        data-slot="treemap-tile"
        data-id={item.id}
        data-depth={item.depth}
        data-size={info.size}
        data-active={active || undefined}
        data-exiting={exiting || undefined}
        aria-hidden={exiting || undefined}
        aria-label={exiting ? undefined : describe(item)}
        tabIndex={!exiting && item.id === stopId ? 0 : -1}
        onPointerEnter={exiting ? undefined : () => setHoveredId(item.id)}
        onFocus={
          exiting
            ? undefined
            : () => {
                setFocusedId(item.id);
                setTabStopId(item.id);
              }
        }
        onClick={exiting ? undefined : () => activate(item, false)}
        className={cn(
          "absolute overflow-hidden rounded-[4px] p-0 text-left outline-none select-none",
          drillable
            ? "cursor-zoom-in"
            : onSelect
              ? "cursor-pointer"
              : "cursor-default",
          exiting && "pointer-events-none",
          "data-[active]:z-10 focus-visible:z-20",
          // Inset rings so they are not clipped at the edge of the map.
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-150 motion-reduce:after:transition-none",
          "after:shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--color-foreground)_78%,transparent)] data-[active]:after:opacity-100",
          "focus-visible:after:opacity-100 focus-visible:after:shadow-[inset_0_0_0_2px_var(--color-ring),inset_0_0_0_3.5px_var(--color-card)]",
          !revealed &&
            "motion-safe:animate-[treemap-tile-in_600ms_cubic-bezier(0.22,1,0.36,1)_backwards]",
        )}
        style={{
          ...style,
          animationDelay: revealed ? undefined : revealDelay(p.rect),
        }}
      >
        <span
          aria-hidden="true"
          data-slot="treemap-tile-fill"
          className="absolute inset-0 transition-opacity duration-200 motion-reduce:transition-none"
          style={{
            backgroundColor: fill,
            opacity: dimmed ? 0.42 : 1,
          }}
        />
        <span
          aria-hidden="true"
          data-slot="treemap-tile-label"
          className="relative block h-full min-w-0"
          style={{
            color: ink,
            opacity: labelsHidden ? 0 : dimmed ? 0.55 : 1,
            transition: reduced
              ? "none"
              : `opacity ${labelsHidden ? 100 : 260}ms ${EASE}`,
          }}
        >
          {content}
        </span>
      </button>
    );
  };

  const renderPlacement = (p: Placement<TMeta>, exitTo: Rect | null) =>
    p.kind === "group" ? renderGroup(p, exitTo) : renderTile(p, exitTo);

  const atRoot = focus === root;
  const activePath = activeItem ? lineage(activeItem) : [];

  return (
    <div
      data-slot="treemap"
      data-depth={chain.length - 1}
      className={cn(
        "@container/treemap flex min-w-0 flex-col rounded-xl border bg-card text-card-foreground shadow-xs",
        className,
      )}
      {...props}
    >
      <style href="overtrue-treemap" precedence="default">
        {`@keyframes treemap-tile-in{from{opacity:0;transform:scale(.92)}}`}
      </style>

      {hasHeader ? (
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 px-4 pt-4">
          <div className="min-w-0 space-y-1">
            {title != null ? (
              <h3 className="text-sm leading-5 font-semibold tracking-tight">
                {title}
              </h3>
            ) : null}
            {description != null ? (
              <p
                id={`${id}-description`}
                className="text-xs text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>
          {actions != null ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "flex min-w-0 items-center gap-2 px-4 pb-2.5",
          hasHeader ? "pt-3" : "pt-4",
        )}
      >
        {!atRoot ? (
          <button
            type="button"
            data-slot="treemap-up"
            aria-label={`Zoom out to ${focus.parent?.label}`}
            onClick={() => goUp(false)}
            className="grid size-6 shrink-0 place-items-center rounded-md border text-muted-foreground outline-none transition-[color,background-color,opacity,scale] hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none motion-safe:starting:scale-75 motion-safe:starting:opacity-0"
          >
            <IconArrowUp aria-hidden="true" size={13} stroke={2} />
          </button>
        ) : null}
        <nav
          aria-label="Treemap level"
          data-slot="treemap-breadcrumb"
          className="min-w-0 flex-1"
        >
          <ol className="flex min-w-0 items-center gap-0.5 text-xs">
            {chain.map((item, position) => {
              const last = position === chain.length - 1;
              return (
                <li
                  key={item.id}
                  className={cn(
                    "flex min-w-0 items-center gap-0.5",
                    last ? "shrink-0" : "shrink",
                  )}
                >
                  {position > 0 ? (
                    <IconChevronRight
                      aria-hidden="true"
                      size={12}
                      className="shrink-0 text-muted-foreground/60"
                    />
                  ) : null}
                  {last ? (
                    <span
                      aria-current="location"
                      className="flex min-w-0 items-center gap-1.5 px-1 font-medium text-foreground motion-safe:transition-[opacity,translate] motion-safe:duration-300 motion-safe:starting:-translate-x-1 motion-safe:starting:opacity-0"
                    >
                      {item.depth >= 0 ? (
                        <span
                          aria-hidden="true"
                          className="size-2 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: fillFor(item) }}
                        />
                      ) : null}
                      <span className="max-w-[14rem] truncate">
                        {item.label}
                      </span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => commitPath(item)}
                      className="max-w-[9rem] truncate rounded-sm px-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <p className="flex shrink-0 items-baseline gap-1.5 tabular-nums">
          {!atRoot ? (
            <span className="font-mono text-[10.5px] text-muted-foreground">
              {percent(shareOfTotal(focus))}
            </span>
          ) : null}
          <span className="text-sm font-semibold tracking-tight">
            {format(focus.value, "detail")}
          </span>
        </p>
      </div>

      <div className="px-4">
        <div
          ref={canvasRef}
          role="group"
          aria-roledescription="treemap"
          aria-label={`${mapLabel}: ${focus.label}, ${focus.children.length} items. Arrow keys move between tiles, Enter zooms in, Backspace zooms out.`}
          aria-describedby={
            description != null ? `${id}-description` : undefined
          }
          data-slot="treemap-canvas"
          data-zooming={zoom ? zoom.phase : undefined}
          onKeyDown={onKeyDown}
          onPointerLeave={() => setHoveredId(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node))
              setFocusedId(null);
          }}
          className="relative w-full overflow-hidden rounded-md"
          style={{ height }}
        >
          {root.value <= 0 ? (
            <p className="grid h-full place-items-center rounded-md border border-dashed text-xs text-muted-foreground">
              Nothing to show.
            </p>
          ) : null}
          {transition && phase
            ? transition.exits.map(({ placement, to }) =>
                renderPlacement(placement, to),
              )
            : null}
          {placements.map((p) => renderPlacement(p, null))}
        </div>
      </div>

      <div
        aria-hidden="true"
        data-slot="treemap-readout"
        className="mt-3 flex min-h-11 min-w-0 flex-wrap items-center gap-x-3 gap-y-1 border-t px-4 py-2.5 text-xs"
      >
        {activeItem && activeItem !== root ? (
          <>
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                className="size-2.5 shrink-0 rounded-[3px]"
                style={{ backgroundColor: fillFor(activeItem) }}
              />
              {activePath.map((item, position) => (
                <React.Fragment key={item.id}>
                  {position > 0 ? (
                    <IconChevronRight
                      size={11}
                      className="shrink-0 text-muted-foreground/60"
                    />
                  ) : null}
                  <span
                    className={cn(
                      "truncate",
                      position === activePath.length - 1
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                </React.Fragment>
              ))}
            </span>
            <span className="ml-auto flex flex-wrap items-baseline gap-x-3 gap-y-0.5 tabular-nums">
              <span className="text-sm font-semibold tracking-tight">
                {format(activeItem.value, "detail")}
              </span>
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  {percent(shareOfParent(activeItem))}
                </span>{" "}
                of {activeItem.parent?.label ?? rootLabel}
              </span>
              {activeItem.depth > 0 ? (
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {percent(shareOfTotal(activeItem))}
                  </span>{" "}
                  of total
                </span>
              ) : null}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground tabular-nums">
              {focus.children.length}
            </span>{" "}
            {focus.children.length === 1 ? "item" : "items"}
            {focus.leafCount !== focus.children.length ? (
              <>
                {" · "}
                <span className="font-medium text-foreground tabular-nums">
                  {focus.leafCount}
                </span>{" "}
                leaves
              </>
            ) : null}
            <span
              className={cn("hidden", focus.children.length > 0 && "sm:inline")}
            >
              {" · "}
              {atRoot
                ? "Select a tile to zoom in"
                : "Esc or Backspace to zoom out"}
            </span>
          </span>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {atRoot
          ? ""
          : `${focus.label}: ${format(focus.value, "detail")}, ${focus.children.length} items`}
      </p>
    </div>
  );
}

export { Treemap };
