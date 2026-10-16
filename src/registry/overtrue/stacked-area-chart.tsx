"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

/** How the series combine: stacked, normalised to 100%, centred as a streamgraph, or overlapping. */
export type StackedAreaStack = "normal" | "expand" | "stream" | "none";
export type StackedAreaCurve = "monotone" | "linear" | "step";
/** An x value as it appears in the data: a number, an ISO date string, a Date, or a category label. */
export type StackedAreaXValue = string | number | Date;

export interface StackedAreaSeries {
  /** Field in each row that holds this series' value. */
  key: string;
  /** Name in the legend and tooltip. Defaults to `key`. */
  label?: string;
  /** Any CSS colour. Defaults to the chart palette, cycling with softer tints past five. */
  color?: string;
}

export interface StackedAreaReferenceLine {
  /** Value on the y axis. Drawn in normal and overlapping modes, where the axis is in value units. */
  y: number;
  label?: string;
  color?: string;
}

export interface StackedAreaAnnotation {
  /** Where the marker sits, in the same form as the index values. */
  x: StackedAreaXValue;
  label: string;
  color?: string;
}

/** One series at one point, as listed in the tooltip. */
export interface StackedAreaItem {
  key: string;
  label: string;
  color: string;
  value: number;
  /** Share of the visible total at this point (or over the range, in a summary), 0–1. */
  share: number;
}

/** The point under the crosshair, passed to `renderTooltip` and `onHover`. */
export interface StackedAreaPoint {
  /** Position in the sorted data. */
  index: number;
  /** A Date on time axes, otherwise the number or label from the data. */
  x: StackedAreaXValue;
  /** The x value formatted for the tooltip. */
  label: string;
  /** The original row. */
  row: Record<string, unknown>;
  /** Sum of the visible series. */
  total: number;
  /** Visible series, top of the stack first. */
  items: StackedAreaItem[];
  /** Annotations that fall on this point. */
  annotations: StackedAreaAnnotation[];
}

/** Totals across the whole range, passed to a `header` function. */
export interface StackedAreaSummary {
  /** Sum of every visible series over every point. */
  total: number;
  /** Visible total at the first and the last point. */
  first: number;
  last: number;
  /** Every series with its total over the range and its share of `total`, in legend order. */
  series: (StackedAreaItem & { hidden: boolean })[];
  /** Number of points. */
  count: number;
  /** The chart's value formatter. */
  format: (value: number) => string;
}

export type StackedAreaXFormatter = (
  value: StackedAreaXValue,
  context: "axis" | "tooltip",
) => string;

export interface StackedAreaChartProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "children" | "color"
> {
  /** Rows, one per x value. Missing or negative values count as zero. */
  data: Record<string, unknown>[];
  /** Field holding the x value: numbers, ISO date strings, Dates, or category labels. */
  index: string;
  /** Series to stack, bottom first. */
  series: StackedAreaSeries[];
  stack?: StackedAreaStack;
  curve?: StackedAreaCurve;
  /** Plot height in pixels. Defaults to 280. */
  height?: number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Controls placed at the top right. */
  actions?: React.ReactNode;
  /** Content under the title, such as a headline total. A function receives the totals for the visible series. */
  header?: React.ReactNode | ((summary: StackedAreaSummary) => React.ReactNode);
  /** Formats values in the tooltip, legend, and summary. Defaults to compact numbers from 10,000. */
  valueFormatter?: (value: number) => string;
  /** Formats y axis ticks. Defaults to compact numbers such as 2.4M, or percentages when expanded. */
  axisFormatter?: (value: number) => string;
  /** Formats x values on the axis and in the tooltip. Dates default to Intl formats matched to the spacing. */
  xFormatter?: StackedAreaXFormatter;
  /** Short name of the y axis, shown above it. */
  yLabel?: string;
  referenceLines?: StackedAreaReferenceLine[];
  /** Thin vertical markers with a label, for events such as a deploy. */
  annotations?: StackedAreaAnnotation[];
  /** Keys of hidden series. Pass with `onHiddenSeriesChange` to control the legend. */
  hiddenSeries?: string[];
  defaultHiddenSeries?: string[];
  onHiddenSeriesChange?: (hidden: string[]) => void;
  /** Show the interactive legend. Defaults to true. */
  showLegend?: boolean;
  legendPosition?: "top" | "bottom";
  /** Replaces the tooltip content. */
  renderTooltip?: (point: StackedAreaPoint) => React.ReactNode;
  /** Called when the crosshair moves to a point, and with null when it leaves. */
  onHover?: (point: StackedAreaPoint | null) => void;
  /** Tween between states when series toggle, the stack mode changes, or data updates. Defaults to true. */
  animate?: boolean;
}

/* ------------------------------------------------------------------------ */
/* Formatting                                                                */
/* ------------------------------------------------------------------------ */

const DAY = 86_400_000;
const tidy = (value: number) => +value.toPrecision(12);
const lowerK = (text: string) => text.replace(/K$/, "k");
const compactAxis = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const compactValue = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumSignificantDigits: 3,
});
const grouped = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function defaultValueFormatter(value: number) {
  if (!Number.isFinite(value)) return "—";
  return Math.abs(value) >= 10_000
    ? lowerK(compactValue.format(value))
    : grouped.format(value);
}

function defaultAxisFormatter(value: number) {
  return value === 0 ? "0" : lowerK(compactAxis.format(value));
}

function percentAxis(value: number) {
  return `${tidy(value * 100)}%`;
}

function formatShare(share: number, digits = 1) {
  const pct = share * 100;
  if (!Number.isFinite(pct) || pct === 0) return "0%";
  if (pct < 0.1) return "<0.1%";
  return `${pct.toFixed(digits)}%`;
}

// "Atlas Large hidden" reads better than a pressed state for screen readers.
const sentence = (parts: string[]) => parts.filter(Boolean).join(" ");

/* ------------------------------------------------------------------------ */
/* X values                                                                  */
/* ------------------------------------------------------------------------ */

type XKind = "time" | "number" | "category";

const DATE_ONLY = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/;
const DATE_TIME =
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/;

/** Date-only strings are local calendar days, so "2026-10-03" never renders as Oct 2. */
function toTime(raw: unknown): number | null {
  if (raw instanceof Date) {
    const t = raw.getTime();
    return Number.isNaN(t) ? null : t;
  }
  if (typeof raw !== "string") return null;
  const day = DATE_ONLY.exec(raw);
  if (day) return new Date(+day[1], +day[2] - 1, day[3] ? +day[3] : 1).getTime();
  if (DATE_TIME.test(raw)) {
    const t = Date.parse(raw.replace(" ", "T"));
    return Number.isNaN(t) ? null : t;
  }
  return null;
}

function xKindOf(values: unknown[]): XKind {
  if (!values.length) return "category";
  if (values.every((v) => typeof v === "number" && Number.isFinite(v)))
    return "number";
  if (values.every((v) => toTime(v) !== null)) return "time";
  return "category";
}

function makeDateFormatter(step: number, spansYears: boolean) {
  const f = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", options);
  if (step < DAY) {
    const time = f({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    const day = f({ month: "short", day: "numeric" });
    const tip = f({
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    // Midnight ticks name the day, so a multi-day axis stays readable.
    return (d: Date, c: "axis" | "tooltip") =>
      c === "tooltip"
        ? tip.format(d)
        : d.getHours() === 0 && d.getMinutes() === 0
          ? day.format(d)
          : time.format(d);
  }
  if (step < 28 * DAY) {
    const axis = f({ month: "short", day: "numeric" });
    const tip = f({
      weekday: "short",
      month: "short",
      day: "numeric",
      ...(spansYears ? { year: "numeric" } : {}),
    });
    return (d: Date, c: "axis" | "tooltip") =>
      (c === "axis" ? axis : tip).format(d);
  }
  if (step < 360 * DAY) {
    const axis = f(
      spansYears ? { month: "short", year: "2-digit" } : { month: "short" },
    );
    const tip = f({ month: "long", year: "numeric" });
    return (d: Date, c: "axis" | "tooltip") =>
      (c === "axis" ? axis : tip).format(d);
  }
  const year = f({ year: "numeric" });
  return (d: Date) => year.format(d);
}

/* ------------------------------------------------------------------------ */
/* Model                                                                     */
/* ------------------------------------------------------------------------ */

interface Model {
  kind: XKind;
  rows: Record<string, unknown>[];
  /** Numeric x positions: epoch ms, numbers, or the row index for categories. */
  xs: number[];
  /** Parsed x values: Dates on time axes. */
  xValues: StackedAreaXValue[];
  /** Identity of each point, used to match points across updates. */
  keys: string[];
  /** Clean values per series and point. */
  values: number[][];
  /** Typical spacing between points, in x units. */
  step: number;
}

function buildModel(
  data: Record<string, unknown>[],
  index: string,
  keys: string[],
): Model {
  const kind = xKindOf(data.map((row) => row?.[index]));
  const items = data.map((row, i) => {
    const raw = row?.[index];
    if (kind === "number") return { row, x: raw as number, value: raw as number };
    if (kind === "time") {
      const t = toTime(raw)!;
      return { row, x: t, value: new Date(t) as StackedAreaXValue };
    }
    return { row, x: i, value: String(raw ?? "") as StackedAreaXValue };
  });
  if (kind !== "category") items.sort((a, b) => a.x - b.x);
  const xs = items.map((item) => item.x);
  const diffs: number[] = [];
  for (let i = 1; i < xs.length; i++)
    if (xs[i] > xs[i - 1]) diffs.push(xs[i] - xs[i - 1]);
  diffs.sort((a, b) => a - b);
  return {
    kind,
    rows: items.map((item) => item.row ?? {}),
    xs,
    xValues: items.map((item) => item.value),
    keys:
      kind === "category" ? items.map((_, i) => String(i)) : xs.map(String),
    values: keys.map((key) =>
      items.map((item) => {
        const v = Number(item.row?.[key]);
        return Number.isFinite(v) && v > 0 ? v : 0;
      }),
    ),
    step: diffs.length ? diffs[diffs.length >> 1] : 1,
  };
}

/* ------------------------------------------------------------------------ */
/* Scales                                                                    */
/* ------------------------------------------------------------------------ */

function niceStep(raw: number) {
  if (!(raw > 0)) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const r = raw / magnitude;
  return (
    (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * magnitude
  );
}

/** Ticks from zero: three to `most` intervals of 1, 2, 2.5 or 5 × 10ⁿ, with the least wasted headroom. */
function niceScale(max: number, most: number) {
  if (!(max > 0)) return { hi: 1, ticks: [0, 0.5, 1] };
  const target = max * 1.02;
  const exponent = Math.floor(Math.log10(target));
  let best: { step: number; count: number; score: number } | null = null;
  for (let e = exponent - 2; e <= exponent + 1; e++)
    for (const m of [1, 2, 2.5, 5]) {
      const step = m * 10 ** e;
      const count = Math.ceil(target / step - 1e-9);
      if (count < 3 || count > most) continue;
      const hi = count * step;
      const score =
        (hi - target) / hi + Math.abs(count - 4) * 0.04 + (m === 2.5 ? 0.04 : 0);
      if (!best || score < best.score) best = { step, count, score };
    }
  const step = best?.step ?? niceStep(target / 4);
  const count = best?.count ?? Math.max(1, Math.ceil(target / step - 1e-9));
  return {
    hi: tidy(count * step),
    ticks: Array.from({ length: count + 1 }, (_, i) => tidy(i * step)),
  };
}

/* ------------------------------------------------------------------------ */
/* Frames: the stacked geometry in data units, tweened between states        */
/* ------------------------------------------------------------------------ */

interface Frame {
  keys: string[];
  xs: number[];
  series: string[];
  /** Lower and upper edge per series and point, in y units. */
  y0: number[][];
  y1: number[][];
  /** 1 when a series is shown, 0 when hidden; fractional mid-tween. */
  weight: number[];
  x0: number;
  x1: number;
  lo: number;
  hi: number;
}

function stackFrame(
  model: Model,
  seriesKeys: string[],
  visible: boolean[],
  stack: StackedAreaStack,
  lo: number,
  hi: number,
): Frame {
  const n = model.xs.length;
  const y0 = seriesKeys.map(() => new Array<number>(n).fill(0));
  const y1 = seriesKeys.map(() => new Array<number>(n).fill(0));
  for (let j = 0; j < n; j++) {
    let total = 0;
    for (let s = 0; s < seriesKeys.length; s++)
      if (visible[s]) total += model.values[s][j];
    if (stack === "none") {
      for (let s = 0; s < seriesKeys.length; s++)
        y1[s][j] = visible[s] ? model.values[s][j] : 0;
      continue;
    }
    const scale = stack === "expand" ? (total > 0 ? 1 / total : 0) : 1;
    let running = stack === "stream" ? -total / 2 : 0;
    for (let s = 0; s < seriesKeys.length; s++) {
      y0[s][j] = running;
      running += visible[s] ? model.values[s][j] * scale : 0;
      y1[s][j] = running;
    }
  }
  const first = model.xs[0] ?? 0;
  const last = model.xs[n - 1] ?? 1;
  const pad = n > 1 ? 0 : model.step / 2 || 0.5;
  return {
    keys: model.keys,
    xs: model.xs,
    series: seriesKeys,
    y0,
    y1,
    weight: visible.map((v) => (v ? 1 : 0)),
    x0: first - pad,
    x1: last + pad,
    lo,
    hi,
  };
}

function framesEqual(a: Frame, b: Frame) {
  if (a === b) return true;
  const same = (p: number, q: number) => Math.abs(p - q) < 1e-9;
  if (
    a.keys.length !== b.keys.length ||
    a.series.length !== b.series.length ||
    !same(a.x0, b.x0) ||
    !same(a.x1, b.x1) ||
    !same(a.lo, b.lo) ||
    !same(a.hi, b.hi)
  )
    return false;
  for (let i = 0; i < a.keys.length; i++)
    if (a.keys[i] !== b.keys[i] || !same(a.xs[i], b.xs[i])) return false;
  for (let s = 0; s < a.series.length; s++) {
    if (a.series[s] !== b.series[s] || a.weight[s] !== b.weight[s]) return false;
    for (let i = 0; i < a.keys.length; i++)
      if (!same(a.y0[s][i], b.y0[s][i]) || !same(a.y1[s][i], b.y1[s][i]))
        return false;
  }
  return true;
}

/**
 * Interpolates two frames. Points are matched by identity, so a sliding window keeps
 * every shared point still and glides the x domain instead of morphing the shape.
 */
function lerpFrame(a: Frame, b: Frame, t: number): Frame {
  const mix = (p: number, q: number) => p + (q - p) * t;
  const seriesIndex = new Map(a.series.map((key, i) => [key, i]));
  let keys = b.keys;
  let xs: number[];
  let fromIndex: number[];
  let toIndex: number[];
  if (
    a.keys.length === b.keys.length &&
    a.keys.every((key, i) => key === b.keys[i])
  ) {
    xs = b.xs.map((x, i) => mix(a.xs[i], x));
    fromIndex = toIndex = b.keys.map((_, i) => i);
  } else {
    const inA = new Map(a.keys.map((key, i) => [key, i]));
    const inB = new Map(b.keys.map((key, i) => [key, i]));
    const xOf = (key: string) =>
      inB.has(key) ? b.xs[inB.get(key)!] : a.xs[inA.get(key)!];
    keys = [...new Set([...a.keys, ...b.keys])].sort((p, q) => xOf(p) - xOf(q));
    xs = keys.map(xOf);
    fromIndex = keys.map((key) => inA.get(key) ?? -1);
    toIndex = keys.map((key) => inB.get(key) ?? -1);
  }
  const y0: number[][] = [];
  const y1: number[][] = [];
  const weight: number[] = [];
  b.series.forEach((key, s) => {
    const sa = seriesIndex.get(key) ?? -1;
    const lower: number[] = [];
    const upper: number[] = [];
    keys.forEach((_, j) => {
      const ia = fromIndex[j];
      const ib = toIndex[j];
      const to0 = ib >= 0 ? b.y0[s][ib] : null;
      const to1 = ib >= 0 ? b.y1[s][ib] : null;
      // A new series grows from its own base; a leaving point holds still.
      const from0 = sa >= 0 && ia >= 0 ? a.y0[sa][ia] : (to0 ?? 0);
      const from1 = sa >= 0 && ia >= 0 ? a.y1[sa][ia] : (to0 ?? 0);
      lower.push(mix(from0, to0 ?? from0));
      upper.push(mix(from1, to1 ?? from1));
    });
    y0.push(lower);
    y1.push(upper);
    weight.push(mix(sa >= 0 ? a.weight[sa] : 0, b.weight[s]));
  });
  return {
    keys,
    xs,
    series: b.series,
    y0,
    y1,
    weight,
    x0: mix(a.x0, b.x0),
    x1: mix(a.x1, b.x1),
    lo: mix(a.lo, b.lo),
    hi: mix(a.hi, b.hi),
  };
}

/* ------------------------------------------------------------------------ */
/* Curves                                                                    */
/* ------------------------------------------------------------------------ */

const r2 = (value: number) => Math.round(value * 100) / 100;

/** Steffen's monotone tangents: no overshoot between points, so stacked edges never cross. */
function monotoneTangents(xs: number[], ys: number[]) {
  const n = xs.length;
  const m = new Array<number>(n).fill(0);
  if (n < 2) return m;
  const h: number[] = [];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    h.push(xs[i + 1] - xs[i]);
    d.push(h[i] ? (ys[i + 1] - ys[i]) / h[i] : 0);
  }
  if (n === 2) {
    m[0] = m[1] = d[0];
    return m;
  }
  for (let i = 1; i < n - 1; i++) {
    const s0 = d[i - 1];
    const s1 = d[i];
    if (s0 * s1 <= 0) continue;
    const p = (s0 * h[i] + s1 * h[i - 1]) / (h[i - 1] + h[i] || 1);
    m[i] =
      Math.sign(s0) *
      Math.min(2 * Math.abs(s0), 2 * Math.abs(s1), Math.abs(p));
  }
  // One-sided ends keep the tangent within the first and last secant.
  m[0] = (3 * d[0] - m[1]) / 2;
  m[n - 1] = (3 * d[n - 2] - m[n - 2]) / 2;
  return m;
}

/** Path commands from the first point to the last (or back), without the opening move. */
function edge(
  xs: number[],
  ys: number[],
  curve: StackedAreaCurve,
  reverse: boolean,
) {
  const n = xs.length;
  if (n < 2) return "";
  let out = "";
  if (curve === "linear") {
    if (reverse)
      for (let i = n - 2; i >= 0; i--) out += `L${r2(xs[i])} ${r2(ys[i])}`;
    else for (let i = 1; i < n; i++) out += `L${r2(xs[i])} ${r2(ys[i])}`;
    return out;
  }
  if (curve === "step") {
    if (reverse)
      for (let i = n - 2; i >= 0; i--) {
        const mid = (xs[i] + xs[i + 1]) / 2;
        out += `H${r2(mid)}V${r2(ys[i])}H${r2(xs[i])}`;
      }
    else
      for (let i = 0; i < n - 1; i++) {
        const mid = (xs[i] + xs[i + 1]) / 2;
        out += `H${r2(mid)}V${r2(ys[i + 1])}H${r2(xs[i + 1])}`;
      }
    return out;
  }
  const m = monotoneTangents(xs, ys);
  const segment = (i: number) => {
    const h = (xs[i + 1] - xs[i]) / 3;
    return [
      xs[i] + h,
      ys[i] + m[i] * h,
      xs[i + 1] - h,
      ys[i + 1] - m[i + 1] * h,
    ];
  };
  if (reverse)
    for (let i = n - 2; i >= 0; i--) {
      const [c1x, c1y, c2x, c2y] = segment(i);
      out += `C${r2(c2x)} ${r2(c2y)} ${r2(c1x)} ${r2(c1y)} ${r2(xs[i])} ${r2(ys[i])}`;
    }
  else
    for (let i = 0; i < n - 1; i++) {
      const [c1x, c1y, c2x, c2y] = segment(i);
      out += `C${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(xs[i + 1])} ${r2(ys[i + 1])}`;
    }
  return out;
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
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [controlled ? value : inner, set] as const;
}

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/** Default palette: the five chart colours, then softer tints of the same five. */
function paletteColor(i: number) {
  const base = `var(--color-chart-${(i % 5) + 1})`;
  const round = Math.floor(i / 5);
  return round === 0
    ? base
    : `color-mix(in oklab, ${base} ${Math.max(40, 100 - round * 28)}%, var(--color-card))`;
}

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_10%,transparent)]";
const gridColor = "color-mix(in oklab, var(--color-foreground) 7%, transparent)";
const baseColor = "color-mix(in oklab, var(--color-foreground) 14%, transparent)";

/* ------------------------------------------------------------------------ */
/* StackedAreaChart                                                          */
/* ------------------------------------------------------------------------ */

/**
 * A composition over time: stacked, normalised, streamgraph, or overlapping areas with
 * an interactive legend, a snapping crosshair, annotations, and tweened re-stacking.
 */
export function StackedAreaChart({
  data,
  index,
  series,
  stack = "normal",
  curve = "monotone",
  height = 280,
  title,
  description,
  actions,
  header,
  valueFormatter = defaultValueFormatter,
  axisFormatter,
  xFormatter,
  yLabel,
  referenceLines,
  annotations,
  hiddenSeries,
  defaultHiddenSeries = [],
  onHiddenSeriesChange,
  showLegend = true,
  legendPosition = "bottom",
  renderTooltip,
  onHover,
  animate = true,
  className,
  ...props
}: StackedAreaChartProps) {
  const id = React.useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const motion = animate && !reduced;

  const [hidden, setHidden] = useControllable(
    hiddenSeries,
    defaultHiddenSeries,
    onHiddenSeriesChange,
  );
  const hiddenSet = React.useMemo(() => new Set(hidden), [hidden]);

  // Geometry depends only on series keys, so inline series arrays never restart a tween.
  const seriesSignature = series.map((s) => s.key).join("\u0000");
  const seriesKeys = React.useMemo(
    () => (seriesSignature ? seriesSignature.split("\u0000") : []),
    [seriesSignature],
  );
  const meta = series.map((s, i) => ({
    key: s.key,
    label: s.label ?? s.key,
    color: s.color ?? paletteColor(i),
  }));

  const model = React.useMemo(
    () => buildModel(data, index, seriesKeys),
    [data, index, seriesKeys],
  );
  const n = model.xs.length;
  const visible = seriesKeys.map((key) => !hiddenSet.has(key));
  const visibleSignature = visible.map(Number).join("");
  const anyVisible = visible.some(Boolean);

  /* ------------------------------------------------------------- format */

  const formatX = React.useMemo(() => {
    if (xFormatter) return xFormatter;
    if (model.kind === "time") {
      const first = model.xs[0] ?? 0;
      const last = model.xs[n - 1] ?? 0;
      const date = makeDateFormatter(
        model.step,
        new Date(first).getFullYear() !== new Date(last).getFullYear(),
      );
      return (value: StackedAreaXValue, context: "axis" | "tooltip") =>
        date(value instanceof Date ? value : new Date(value), context);
    }
    if (model.kind === "number")
      return (value: StackedAreaXValue) =>
        typeof value === "number" ? grouped.format(value) : String(value);
    return (value: StackedAreaXValue) => String(value);
  }, [xFormatter, model, n]);

  const formatTick = React.useMemo(
    () =>
      axisFormatter ?? (stack === "expand" ? percentAxis : defaultAxisFormatter),
    [axisFormatter, stack],
  );

  /* -------------------------------------------------------------- scale */

  const refs = React.useMemo(
    () =>
      (referenceLines ?? []).filter(
        (line) => Number.isFinite(line.y) && (stack === "normal" || stack === "none"),
      ),
    [referenceLines, stack],
  );

  const scale = React.useMemo(() => {
    const vis = visibleSignature.split("").map((v) => v === "1");
    let peak = 0;
    for (let j = 0; j < n; j++) {
      let total = 0;
      for (let s = 0; s < seriesKeys.length; s++) {
        if (!vis[s]) continue;
        const v = model.values[s][j];
        if (stack === "none") peak = Math.max(peak, v);
        else total += v;
      }
      peak = Math.max(peak, total);
    }
    if (stack === "expand")
      return { lo: 0, hi: 1, ticks: [0, 0.25, 0.5, 0.75, 1], peak };
    if (stack === "stream") {
      const half = (peak || 1) / 2;
      return { lo: -half * 1.06, hi: half * 1.06, ticks: [0], peak };
    }
    for (const line of refs) peak = Math.max(peak, line.y);
    const nice = niceScale(peak, height < 200 ? 4 : 5);
    return { lo: 0, hi: nice.hi, ticks: nice.ticks, peak };
  }, [model, n, seriesKeys, visibleSignature, stack, refs, height]);

  const target = React.useMemo(
    () =>
      stackFrame(
        model,
        seriesKeys,
        visibleSignature.split("").map((v) => v === "1"),
        stack,
        scale.lo,
        scale.hi,
      ),
    [model, seriesKeys, visibleSignature, stack, scale],
  );

  /* ------------------------------------------------------------- motion */

  const [tween, setTween] = React.useState<Frame | null>(null);
  const shownRef = React.useRef<Frame>(target);
  const modelRef = React.useRef(model);
  React.useLayoutEffect(() => {
    const from = shownRef.current;
    const dataChanged = modelRef.current !== model;
    modelRef.current = model;
    if (from === target) return;
    if (!motion || framesEqual(from, target)) {
      shownRef.current = target;
      setTween(null);
      return;
    }
    // Data updates glide a little longer than toggles, which should feel immediate.
    const duration = dataChanged ? 460 : 320;
    const ease = dataChanged ? easeInOut : easeOut;
    const start = performance.now();
    setTween(from);
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / duration);
      if (t >= 1) {
        shownRef.current = target;
        setTween(null);
        return;
      }
      const next = lerpFrame(from, target, ease(t));
      shownRef.current = next;
      setTween(next);
      frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, model, motion]);
  const shown = tween ?? target;

  /* ------------------------------------------------------------- layout */

  const plotRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const measure = () => setWidth(Math.round(el.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const W = width || 640;
  const H = Math.max(96, height);

  // Annotation labels stack into lanes above the plot only when they would collide.
  const marks = React.useMemo(() => {
    if (!annotations?.length || !n) return [];
    const lanes: number[] = [];
    const span = target.x1 - target.x0 || 1;
    return annotations
      .map((note) => {
        let x: number | null = null;
        if (model.kind === "time") x = toTime(note.x);
        else if (model.kind === "number")
          x = typeof note.x === "number" ? note.x : Number(note.x);
        else {
          const i = model.xValues.findIndex((v) => v === String(note.x));
          x = i >= 0 ? i : null;
        }
        if (x == null || !Number.isFinite(x)) return null;
        // The nearest point, so the tooltip can repeat the note.
        let nearest = 0;
        for (let i = 1; i < n; i++)
          if (Math.abs(model.xs[i] - x) < Math.abs(model.xs[nearest] - x))
            nearest = i;
        return { note, x, nearest, fraction: (x - target.x0) / span };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .filter((m) => m.fraction >= -0.001 && m.fraction <= 1.001)
      .sort((a, b) => a.x - b.x)
      .map((m) => {
        const w = Math.min(W, m.note.label.length * 6.3 + 24);
        const px = m.fraction * W;
        const flip = px + w > W && px - w >= 0;
        const left = flip ? px - w : Math.max(0, Math.min(px, W - w));
        let lane = lanes.findIndex((right) => right + 6 <= left);
        if (lane < 0) lane = lanes.push(0) - 1;
        lanes[lane] = left + w;
        return { ...m, w, left, lane, flip };
      });
  }, [annotations, n, model, target.x0, target.x1, W]);
  const laneCount = marks.length
    ? Math.max(...marks.map((m) => m.lane)) + 1
    : 0;
  const padTop = 8 + laneCount * 26;
  const padBottom = 1;
  const plotH = H - padTop - padBottom;

  const X = (x: number) => ((x - shown.x0) / (shown.x1 - shown.x0 || 1)) * W;
  const entranceBase =
    padTop + ((scale.hi - (stack === "stream" ? 0 : scale.lo)) / (scale.hi - scale.lo || 1)) * plotH;
  const Y = (y: number) =>
    padTop + ((shown.hi - y) / (shown.hi - shown.lo || 1)) * plotH;

  const geometry = React.useMemo(() => {
    const px = shown.xs.map(
      (x) => ((x - shown.x0) / (shown.x1 - shown.x0 || 1)) * W,
    );
    const py = (y: number) =>
      padTop + ((shown.hi - y) / (shown.hi - shown.lo || 1)) * plotH;
    return shown.series.map((key, s) => {
      const top = shown.y1[s].map(py);
      const bottom = shown.y0[s].map(py);
      let thickness = 0;
      for (let j = 0; j < top.length; j++)
        thickness = Math.max(thickness, bottom[j] - top[j]);
      if (!px.length) return { key, area: "", line: "", base: "", thickness };
      const single = px.length === 1;
      const xs = single ? [px[0] - W / 2, px[0] + W / 2] : px;
      const t = single ? [top[0], top[0]] : top;
      const b = single ? [bottom[0], bottom[0]] : bottom;
      const head = `M${r2(xs[0])} ${r2(t[0])}${edge(xs, t, curve, false)}`;
      return {
        key,
        line: head,
        base: `M${r2(xs[0])} ${r2(b[0])}${edge(xs, b, curve, false)}`,
        area: `${head}L${r2(xs[xs.length - 1])} ${r2(b[b.length - 1])}${edge(xs, b, curve, true)}Z`,
        thickness,
      };
    });
  }, [shown, W, padTop, plotH, curve]);

  /* -------------------------------------------------------------- ticks */

  const yTicks = scale.ticks;
  const yTickLabels = stack === "stream" ? [] : yTicks.map(formatTick);

  const xTicks = React.useMemo(() => {
    if (!n) return [] as { x: number; label: string }[];
    const labelWidth = 64;
    const room = Math.max(2, Math.floor(W / labelWidth));
    if (model.kind === "number") {
      const lo = model.xs[0];
      const hi = model.xs[n - 1];
      if (hi <= lo) return [{ x: lo, label: formatX(lo, "axis") }];
      const step = niceStep((hi - lo) / Math.max(1, room - 1));
      const ticks: { x: number; label: string }[] = [];
      for (
        let v = Math.ceil(lo / step - 1e-9) * step;
        v <= hi + step * 1e-6;
        v += step
      )
        ticks.push({ x: tidy(v), label: formatX(tidy(v), "axis") });
      return ticks;
    }
    // Every k-th point. Sub-day axes land on round hours; others count back from the
    // latest point so the newest value is always labelled.
    const subDay = model.kind === "time" && model.step < DAY;
    const steps = subDay
      ? [1, 2, 3, 4, 6, 8, 12, 24, 48, 72, 168]
      : model.kind === "time" && model.step >= 28 * DAY
        ? [1, 2, 3, 6, 12, 24, 60]
        : [1, 2, 3, 4, 5, 7, 10, 14, 15, 20, 28, 30, 50, 60, 100];
    const k =
      steps.find((step) => Math.floor((n - 1) / step) + 1 <= room) ??
      Math.ceil(n / room);
    let phase = (n - 1) % k;
    if (subDay) {
      const span = k * model.step;
      for (let o = 0; o < Math.min(k, n); o++) {
        const d = new Date(model.xs[o]);
        const sinceMidnight =
          model.xs[o] - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        if (Math.round(sinceMidnight) % Math.round(span) === 0) {
          phase = o;
          break;
        }
      }
    }
    const ticks: { x: number; label: string }[] = [];
    for (let i = phase; i < n; i += k)
      ticks.push({ x: model.xs[i], label: formatX(model.xValues[i], "axis") });
    return ticks;
  }, [n, model, W, formatX]);

  /* ---------------------------------------------------------- summaries */

  const summary = React.useMemo<StackedAreaSummary>(() => {
    const totals = seriesKeys.map((_, s) =>
      model.values[s].reduce((sum, v) => sum + v, 0),
    );
    const vis = visibleSignature.split("").map((v) => v === "1");
    const total = totals.reduce((sum, v, s) => sum + (vis[s] ? v : 0), 0);
    const at = (j: number) =>
      j < 0
        ? 0
        : seriesKeys.reduce(
            (sum, _, s) => sum + (vis[s] ? model.values[s][j] : 0),
            0,
          );
    return {
      total,
      first: n ? at(0) : 0,
      last: n ? at(n - 1) : 0,
      count: n,
      format: valueFormatter,
      series: seriesKeys.map((key, s) => ({
        key,
        label: series[s]?.label ?? key,
        color: series[s]?.color ?? paletteColor(s),
        value: totals[s],
        share: vis[s] && total > 0 ? totals[s] / total : 0,
        hidden: !vis[s],
      })),
    };
  }, [model, n, seriesKeys, visibleSignature, valueFormatter, series]);

  const pointAt = React.useCallback(
    (j: number): StackedAreaPoint => {
      const items: StackedAreaItem[] = [];
      let total = 0;
      for (let s = 0; s < seriesKeys.length; s++)
        if (visible[s]) total += model.values[s][j];
      for (let s = seriesKeys.length - 1; s >= 0; s--) {
        if (!visible[s]) continue;
        const value = model.values[s][j];
        items.push({
          key: seriesKeys[s],
          label: series[s]?.label ?? seriesKeys[s],
          color: series[s]?.color ?? paletteColor(s),
          value,
          share: total > 0 ? value / total : 0,
        });
      }
      return {
        index: j,
        x: model.xValues[j],
        label: formatX(model.xValues[j], "tooltip"),
        row: model.rows[j],
        total,
        items,
        annotations: marks.filter((m) => m.nearest === j).map((m) => m.note),
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model, seriesKeys, visibleSignature, series, formatX, marks],
  );

  /* -------------------------------------------------------- interaction */

  const [active, setActive] = React.useState<number | null>(null);
  const [pointerBand, setPointerBand] = React.useState<string | null>(null);
  const [hovered, setHighlight] = React.useState<string | null>(null);
  // A series hidden while hovered no longer dims the rest.
  const highlight = hovered != null && !hiddenSet.has(hovered) ? hovered : null;
  const [announcement, setAnnouncement] = React.useState("");
  const activeIndex = active != null && active < n ? active : null;
  const activePoint = React.useMemo(
    () => (activeIndex == null || !anyVisible ? null : pointAt(activeIndex)),
    [activeIndex, anyVisible, pointAt],
  );

  const onHoverRef = React.useRef(onHover);
  React.useEffect(() => {
    onHoverRef.current = onHover;
  });
  React.useEffect(() => {
    onHoverRef.current?.(activePoint);
  }, [activePoint]);

  const nearestIndex = (px: number) => {
    if (!n) return null;
    const x = target.x0 + (px / W) * (target.x1 - target.x0);
    let lo = 0;
    let hi = n - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (model.xs[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    if (lo > 0 && Math.abs(model.xs[lo - 1] - x) <= Math.abs(model.xs[lo] - x))
      lo -= 1;
    return lo;
  };

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!n || !anyVisible) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const j = nearestIndex(Math.min(W, Math.max(0, px)));
    setActive(j);
    if (j == null) return;
    // Which band sits under the pointer, so its tooltip row can stand out.
    let band: string | null = null;
    for (let s = seriesKeys.length - 1; s >= 0; s--) {
      if (!visible[s]) continue;
      const top = Y(target.y1[s][j]);
      const bottom = Y(target.y0[s][j]);
      if (py >= Math.min(top, bottom) - 2 && py <= Math.max(top, bottom) + 2) {
        band = seriesKeys[s];
        break;
      }
    }
    setPointerBand(band);
  };

  const describe = (point: StackedAreaPoint) =>
    `${point.label}: total ${valueFormatter(point.total)}. ${point.items
      .map(
        (item) =>
          `${item.label} ${valueFormatter(item.value)}, ${formatShare(item.share)}`,
      )
      .join("; ")}.${point.annotations.length ? ` ${point.annotations.map((a) => a.label).join(". ")}.` : ""}`;

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!n || !anyVisible) return;
    let next: number | null = null;
    if (event.key === "ArrowRight")
      next = activeIndex == null ? 0 : Math.min(n - 1, activeIndex + 1);
    else if (event.key === "ArrowLeft")
      next = activeIndex == null ? n - 1 : Math.max(0, activeIndex - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = n - 1;
    else if (event.key === "Escape" && activeIndex != null) {
      event.preventDefault();
      setActive(null);
      return;
    }
    if (next == null) return;
    event.preventDefault();
    setPointerBand(null);
    setActive(next);
    setAnnouncement(describe(pointAt(next)));
  };

  const toggle = (key: string, solo: boolean) => {
    const label = series.find((s) => s.key === key)?.label ?? key;
    if (solo) {
      const only =
        seriesKeys.filter((k) => !hiddenSet.has(k)).length === 1 &&
        !hiddenSet.has(key);
      setHidden(only ? [] : seriesKeys.filter((k) => k !== key));
      setAnnouncement(only ? "Showing all series." : `Showing only ${label}.`);
      return;
    }
    const isHidden = hiddenSet.has(key);
    setHidden(
      isHidden ? hidden.filter((k) => k !== key) : [...hidden, key],
    );
    setAnnouncement(sentence([label, isHidden ? "shown." : "hidden."]));
  };

  /* -------------------------------------------------------------- render */

  const headerContent =
    typeof header === "function" ? header(summary) : header;
  const hasHeader =
    title != null || description != null || actions != null || headerContent != null;

  const activeX = activeIndex != null ? X(model.xs[activeIndex]) : 0;
  const activeKeyIndex =
    activeIndex != null
      ? shown.keys.indexOf(model.keys[activeIndex])
      : -1;

  // Keep the tooltip inside the plot, beside the crosshair on the roomier side.
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [tooltipWidth, setTooltipWidth] = React.useState(200);
  React.useLayoutEffect(() => {
    const el = tooltipRef.current;
    if (el && el.offsetWidth && el.offsetWidth !== tooltipWidth)
      setTooltipWidth(el.offsetWidth);
  });
  const tooltipLeft =
    activeX + 14 + tooltipWidth <= W || activeX < W / 2
      ? Math.min(activeX + 14, Math.max(0, W - tooltipWidth))
      : Math.max(0, activeX - 14 - tooltipWidth);

  const glide = motion
    ? "transition-transform duration-150 ease-out"
    : "";

  const summaryText = (() => {
    if (!n) return "No data.";
    const parts = summary.series
      .filter((s) => !s.hidden)
      .map((s) => `${s.label} ${formatShare(s.share, 0)}`)
      .join(", ");
    const range =
      n > 1
        ? `from ${formatX(model.xValues[0], "tooltip")} to ${formatX(model.xValues[n - 1], "tooltip")}`
        : formatX(model.xValues[0], "tooltip");
    return `${stack === "expand" ? "Share" : "Stacked values"} of ${summary.series.filter((s) => !s.hidden).length} series ${range}. Total ${valueFormatter(summary.total)}: ${parts}.`;
  })();

  const legend = showLegend && seriesKeys.length > 0 && (
    <div
      role="group"
      aria-label="Series"
      data-slot="stacked-area-legend"
      className={cn(
        "flex flex-wrap items-center gap-x-0.5 gap-y-0.5 px-3",
        legendPosition === "bottom" ? "mt-3 border-t py-2" : "mt-3",
      )}
    >
      {meta.map((s, i) => {
        const isHidden = hiddenSet.has(s.key);
        const share = summary.series[i]?.share ?? 0;
        return (
          <button
            key={s.key}
            type="button"
            data-slot="stacked-area-legend-item"
            data-key={s.key}
            data-hidden={isHidden || undefined}
            aria-pressed={!isHidden}
            title="Click to toggle. Alt-click to show only this series."
            onClick={(event) => toggle(s.key, event.altKey)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.altKey) {
                event.preventDefault();
                toggle(s.key, true);
              }
            }}
            onPointerEnter={() => !isHidden && setHighlight(s.key)}
            onPointerLeave={() => setHighlight(null)}
            onFocus={() => !isHidden && setHighlight(s.key)}
            onBlur={() => setHighlight(null)}
            className={cn(
              "group/legend inline-flex h-7 max-w-full items-center gap-2 rounded-md px-2 text-xs transition-colors hover:bg-muted/70 motion-reduce:transition-none",
              focusRing,
            )}
          >
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-[3px] transition-[background,box-shadow] duration-200 motion-reduce:transition-none"
              style={
                isHidden
                  ? {
                      boxShadow: `inset 0 0 0 1.25px color-mix(in oklab, ${s.color} 55%, transparent)`,
                    }
                  : {
                      background: `linear-gradient(to bottom, color-mix(in oklab, ${s.color} 55%, transparent), color-mix(in oklab, ${s.color} 16%, transparent))`,
                      boxShadow: `inset 0 1.5px 0 ${s.color}`,
                    }
              }
            />
            <span
              className={cn(
                "truncate font-medium transition-colors motion-reduce:transition-none",
                isHidden ? "text-muted-foreground/70" : "text-foreground",
              )}
            >
              {s.label}
            </span>
            {!isHidden && (
              <span className="text-muted-foreground tabular-nums">
                {formatShare(share, 0)}
              </span>
            )}
          </button>
        );
      })}
      {legendPosition === "bottom" && seriesKeys.length > 1 && (
        <span className="ml-auto hidden pr-2 text-[11px] text-muted-foreground @3xl/stacked-area:inline">
          Alt-click to show one
        </span>
      )}
    </div>
  );

  const crosshairDots =
    activeIndex != null && activeKeyIndex >= 0
      ? shown.series
          .map((key, s) => {
            if (!visible[s] || shown.weight[s] < 0.5) return null;
            return {
              key,
              color: meta[s]?.color ?? paletteColor(s),
              y: Y(shown.y1[s][activeKeyIndex]),
            };
          })
          .filter((d): d is NonNullable<typeof d> => d !== null)
      : [];

  const lowestVisible = visible.indexOf(true);
  // Larger overlapping areas sit behind smaller ones; stacked bands draw top first.
  const drawOrder = React.useMemo(() => {
    const order = seriesKeys.map((_, s) => s);
    if (stack === "none")
      return order.sort(
        (a, b) =>
          Math.max(0, ...model.values[b]) - Math.max(0, ...model.values[a]),
      );
    return order.reverse();
  }, [seriesKeys, stack, model]);

  return (
    <div
      data-slot="stacked-area-chart"
      data-stack={stack}
      data-curve={curve}
      data-highlight={highlight ?? undefined}
      className={cn(
        "@container/stacked-area flex min-w-0 flex-col rounded-2xl border border-border/70 bg-card text-card-foreground",
        "shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
        "[--sac-fill-bottom:0] [--sac-fill-top:0.32] dark:[--sac-fill-top:0.36] data-[stack=stream]:[--sac-fill-bottom:0.1]",
        !(showLegend && legendPosition === "bottom") && "pb-5",
        className,
      )}
      {...props}
    >
      {hasHeader && (
        <div className="flex flex-col gap-4 px-5 pt-5">
          {(title != null || description != null || actions != null) && (
            <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
              <div className="min-w-[min(100%,8rem)] flex-1 space-y-1">
                {title != null && (
                  <h3 className="truncate text-sm leading-5 font-semibold tracking-tight">
                    {title}
                  </h3>
                )}
                {description != null && (
                  <p
                    id={`${id}-description`}
                    className="text-[13px] leading-5 text-muted-foreground"
                  >
                    {description}
                  </p>
                )}
              </div>
              {actions != null && (
                <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
              )}
            </div>
          )}
          {headerContent != null && (
            <div data-slot="stacked-area-header">{headerContent}</div>
          )}
        </div>
      )}

      {legendPosition === "top" && legend}

      <div className={cn("px-5", hasHeader || legendPosition === "top" ? "mt-4" : "mt-5")}>
        {yLabel && stack !== "stream" && (
          <p
            aria-hidden="true"
            className="mb-1 text-[11px] leading-4 text-muted-foreground"
          >
            {yLabel}
          </p>
        )}
        <div className="flex">
          {/* Value axis: an invisible copy of the labels sizes the gutter, so nothing is measured. */}
          {stack !== "stream" && (
            <div
              aria-hidden="true"
              className="relative shrink-0 pr-2 text-[11px] leading-none text-muted-foreground tabular-nums"
              style={{ height: H }}
            >
              <div className="invisible h-0 overflow-hidden">
                {yTickLabels.map((label, i) => (
                  <div key={i}>{label}</div>
                ))}
              </div>
              {yTicks.map((tick, i) => (
                <span
                  key={`${tick}-${i}`}
                  className={cn("absolute right-2 top-0 whitespace-nowrap", glide)}
                  style={{ transform: `translateY(calc(${r2(Y(tick))}px - 50%))` }}
                >
                  {yTickLabels[i]}
                </span>
              ))}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div
              ref={plotRef}
              role="group"
              aria-roledescription="stacked area chart"
              aria-label={`${typeof title === "string" ? `${title}. ` : ""}${summaryText} Use the left and right arrow keys to read each point.`}
              aria-describedby={description != null ? `${id}-description` : undefined}
              tabIndex={n && anyVisible ? 0 : -1}
              data-slot="stacked-area-plot"
              onPointerMove={handlePointer}
              onPointerDown={handlePointer}
              onPointerLeave={() => {
                setActive(null);
                setPointerBand(null);
              }}
              onKeyDown={onKeyDown}
              onBlur={() => setActive(null)}
              className={cn(
                "relative cursor-crosshair touch-pan-y rounded-sm select-none",
                "outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-4 focus-visible:ring-offset-card",
              )}
              style={{ height: H }}
            >
              {/* Gridlines */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                {yTicks.map((tick, i) => (
                  <span
                    key={`${tick}-${i}`}
                    className={cn("absolute inset-x-0 top-0 h-px", glide)}
                    style={{
                      transform: `translateY(${r2(Y(tick))}px)`,
                      background:
                        stack !== "stream" && tick === scale.lo ? baseColor : gridColor,
                    }}
                  />
                ))}
              </div>

              <svg
                aria-hidden="true"
                width="100%"
                height={H}
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="absolute inset-0 overflow-visible"
              >
                <defs>
                  <clipPath id={`${id}-clip`}>
                    <rect x={0} y={-6} width={W} height={H + 12} />
                  </clipPath>
                  {meta.map((s, i) => (
                    <linearGradient
                      key={s.key}
                      id={`${id}-fill-${i}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0"
                        style={{ stopColor: s.color, stopOpacity: "var(--sac-fill-top)" }}
                      />
                      <stop
                        offset="1"
                        style={{ stopColor: s.color, stopOpacity: "var(--sac-fill-bottom)" }}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <g clipPath={`url(#${id}-clip)`}>
                  {drawOrder.map((s) => {
                    const g = geometry[s];
                    const m = meta[s];
                    if (!g || !m) return null;
                    const weight = shown.weight[s] ?? 0;
                    const isHidden = !visible[s];
                    const drawn = weight >= 0.002 || g.thickness >= 0.05;
                    const dim = highlight != null && highlight !== m.key;
                    const alpha = Math.min(1, weight * 1.5);
                    // Bands rise from the baseline and lines draw in, bottom series first.
                    const delay = `${s * 40}ms`;
                    return (
                      <g
                        key={m.key}
                        data-slot="stacked-area-series"
                        data-key={m.key}
                        data-hidden={isHidden || undefined}
                        className={cn(
                          animate &&
                            "motion-safe:animate-[stacked-area-rise_760ms_cubic-bezier(0.22,1,0.36,1)_both]",
                        )}
                        style={{ animationDelay: delay, transformOrigin: `0px ${r2(entranceBase)}px` }}
                      >
                        {drawn && (
                          <g
                            className="transition-opacity duration-150 motion-reduce:transition-none"
                            style={{ opacity: dim ? 0.24 : 1 }}
                          >
                            <path
                              d={g.area}
                              fill={`url(#${id}-fill-${s})`}
                              fillOpacity={(stack === "none" ? 0.8 : 1) * alpha}
                            />
                            {stack === "stream" && s === lowestVisible && (
                              <path
                                d={g.base}
                                fill="none"
                                stroke={m.color}
                                strokeWidth={2}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeOpacity={alpha}
                                pathLength={1}
                                strokeDasharray="1 1"
                                className={cn(
                                  "dark:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,var(--sac-line)_50%,transparent))]",
                                  animate &&
                                    "motion-safe:animate-[stacked-area-draw_820ms_cubic-bezier(0.22,1,0.36,1)_both]",
                                )}
                                style={
                                  {
                                    "--sac-line": m.color,
                                    animationDelay: delay,
                                  } as React.CSSProperties
                                }
                              />
                            )}
                            <path
                              d={g.line}
                              fill="none"
                              stroke={m.color}
                              strokeWidth={2}
                              strokeLinejoin="round"
                              strokeLinecap="round"
                              strokeOpacity={alpha}
                              pathLength={1}
                              strokeDasharray="1 1"
                              className={cn(
                                "dark:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,var(--sac-line)_50%,transparent))]",
                                animate &&
                                  "motion-safe:animate-[stacked-area-draw_820ms_cubic-bezier(0.22,1,0.36,1)_both]",
                              )}
                              style={
                                {
                                  "--sac-line": m.color,
                                  animationDelay: delay,
                                } as React.CSSProperties
                              }
                            />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Reference lines */}
              {refs.map((line, i) => {
                const color = line.color ?? "var(--color-muted-foreground)";
                return (
                  <div
                    key={i}
                    aria-hidden="true"
                    data-slot="stacked-area-reference"
                    className={cn("pointer-events-none absolute inset-x-0 top-0", glide)}
                    style={{ transform: `translateY(${r2(Y(line.y))}px)` }}
                  >
                    <div
                      className="border-t border-dashed"
                      style={{ borderColor: `color-mix(in oklab, ${color} 70%, transparent)` }}
                    />
                    {line.label && (
                      <span
                        className="absolute right-0 bottom-1 rounded-sm bg-card/85 px-1 text-[10.5px] leading-4 font-medium whitespace-nowrap tabular-nums"
                        style={{ color }}
                      >
                        {line.label}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Annotations */}
              {marks.map((m, i) => {
                const color = m.note.color ?? "var(--color-foreground)";
                const x = X(m.x);
                const top = 4 + m.lane * 26;
                return (
                  <div
                    key={i}
                    aria-hidden="true"
                    data-slot="stacked-area-annotation"
                    data-active={m.nearest === activeIndex || undefined}
                    className="pointer-events-none absolute inset-0"
                  >
                    <span
                      className="absolute bottom-0 w-0 border-l border-dashed"
                      style={{
                        left: r2(x),
                        top: top + 20,
                        borderColor: `color-mix(in oklab, ${color} 38%, transparent)`,
                      }}
                    />
                    <span
                      className="absolute h-[7px] w-px"
                      style={{ left: r2(x), top: top + 14, background: `color-mix(in oklab, ${color} 38%, transparent)` }}
                    />
                    <span
                      className="absolute flex h-5 max-w-full items-center gap-1.5 rounded-md border bg-card px-1.5 text-[11px] leading-none font-medium whitespace-nowrap text-foreground shadow-xs"
                      style={{
                        top,
                        left: r2(m.left + (x - m.fraction * W)),
                        width: m.w,
                      }}
                    >
                      <span
                        className="size-1.5 shrink-0 rounded-full"
                        style={{ background: color }}
                      />
                      <span className="truncate">{m.note.label}</span>
                    </span>
                  </div>
                );
              })}

              {/* Crosshair */}
              {activePoint && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <div
                    className={cn("absolute top-0 left-0 h-full w-px", glide)}
                    style={{ transform: `translateX(${r2(activeX)}px)` }}
                  >
                    <div
                      className="absolute inset-x-0 bottom-0 bg-foreground/25"
                      style={{ top: padTop - 4 }}
                    />
                  </div>
                  {crosshairDots.map((dot) => (
                    <span
                      key={dot.key}
                      className={cn(
                        "absolute top-0 left-0 -mt-1 -ml-1 size-2 rounded-full",
                        glide,
                      )}
                      style={{
                        background: dot.color,
                        boxShadow: `0 0 0 1.5px var(--color-card), 0 0 0 5px color-mix(in oklab, ${dot.color} 18%, transparent)`,
                        transform: `translate(${r2(activeX)}px, ${r2(dot.y)}px)`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Tooltip */}
              {activePoint && (
                <div
                  ref={tooltipRef}
                  data-slot="stacked-area-tooltip"
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute top-0 left-0 z-10 min-w-48 rounded-xl border border-border/70 bg-popover/90 px-3 py-2.5 text-xs text-popover-foreground shadow-xl backdrop-blur-md",
                    glide,
                  )}
                  style={{
                    transform: `translate(${r2(tooltipLeft)}px, ${padTop}px)`,
                  }}
                >
                  {renderTooltip ? (
                    renderTooltip(activePoint)
                  ) : (
                    <DefaultTooltip
                      point={activePoint}
                      format={valueFormatter}
                      emphasis={pointerBand}
                    />
                  )}
                </div>
              )}

              {!n && (
                <p className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                  No data to show.
                </p>
              )}
              {n > 0 && !anyVisible && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                  <p>Every series is hidden.</p>
                  <button
                    type="button"
                    onClick={() => setHidden([])}
                    className={cn(
                      "h-7 rounded-md border bg-card px-2.5 font-medium text-foreground shadow-xs hover:bg-muted",
                      focusRing,
                    )}
                  >
                    Show all
                  </button>
                </div>
              )}
            </div>

            {/* Time axis */}
            <div
              aria-hidden="true"
              className="relative mt-2 h-4 text-[11px] leading-4 text-muted-foreground tabular-nums"
            >
              {xTicks.map((tick, i) => {
                const x = X(tick.x);
                if (x < -1 || x > W + 1) return null;
                const edgeClass =
                  x < 28 ? "" : x > W - 28 ? "-translate-x-full" : "-translate-x-1/2";
                return (
                  <span
                    key={`${tick.x}-${i}`}
                    className={cn("absolute top-0 whitespace-nowrap", edgeClass)}
                    style={{ left: r2(x) }}
                  >
                    {tick.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {legendPosition === "bottom" && legend}

      <div className="sr-only">
        <table>
          <caption>{summaryText}</caption>
          <thead>
            <tr>
              <th scope="col">{index}</th>
              {meta.map((s) => (
                <th key={s.key} scope="col">
                  {s.label}
                </th>
              ))}
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {model.rows.map((_, j) => (
              <tr key={model.keys[j]}>
                <th scope="row">{formatX(model.xValues[j], "tooltip")}</th>
                {meta.map((s, si) => (
                  <td key={s.key}>{valueFormatter(model.values[si][j])}</td>
                ))}
                <td>
                  {valueFormatter(
                    model.values.reduce((sum, values) => sum + values[j], 0),
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <style href="overtrue-stacked-area-chart" precedence="default">
        {`@keyframes stacked-area-rise{from{transform:scaleY(0)}to{transform:scaleY(1)}}@keyframes stacked-area-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}`}
      </style>
    </div>
  );
}

function DefaultTooltip({
  point,
  format,
  emphasis,
}: {
  point: StackedAreaPoint;
  format: (value: number) => string;
  emphasis: string | null;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-2 gap-y-1">
      <p className="col-span-4 mb-1 font-medium text-foreground">{point.label}</p>
      {point.items.map((item) => (
        <React.Fragment key={item.key}>
          <span
            aria-hidden="true"
            className="h-2.5 w-[3px] rounded-full"
            style={{ background: item.color }}
          />
          <span
            className={cn(
              "truncate",
              emphasis === item.key ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {item.label}
          </span>
          <span
            className={cn(
              "pl-3 text-right tabular-nums",
              emphasis === item.key ? "font-semibold" : "font-medium",
            )}
          >
            {format(item.value)}
          </span>
          <span className="w-11 text-right text-[11px] text-muted-foreground tabular-nums">
            {formatShare(item.share)}
          </span>
        </React.Fragment>
      ))}
      <span className="col-span-4 my-0.5 h-px bg-border" />
      <span />
      <span className="text-muted-foreground">Total</span>
      <span className="pl-3 text-right font-semibold tabular-nums">
        {format(point.total)}
      </span>
      <span />
      {point.annotations.map((note, i) => (
        <p
          key={i}
          className="col-span-4 mt-1 flex items-center gap-1.5 border-t border-dashed pt-1.5 text-[11px] text-muted-foreground"
        >
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: note.color ?? "var(--color-foreground)" }}
          />
          {note.label}
        </p>
      ))}
    </div>
  );
}
