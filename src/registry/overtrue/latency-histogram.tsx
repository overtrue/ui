"use client";

import * as React from "react";
import { IconX as X } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export type LatencyScale = "linear" | "log";

export type LatencyRange = [min: number, max: number];

export interface LatencyBucket {
  /** Inclusive lower edge. */
  start: number;
  /** Exclusive upper edge. */
  end: number;
  count: number;
}

/** One bar as drawn, passed to `renderTooltip`. */
export interface LatencyHistogramBucket extends LatencyBucket {
  index: number;
  /** Share of all requests in this bucket, 0–1. */
  share: number;
  /** Share of requests at or below this bucket's upper edge, 0–1. */
  cumulative: number;
  /** Raw comparison count in the same range, when `compare` is set. */
  compare?: number;
  /** Comparison share of its own total, 0–1. */
  compareShare?: number;
  /** The catch-all bar for values past the linear domain. */
  overflow: boolean;
  /** Whether the bucket lies past `threshold`. */
  overThreshold: boolean;
}

export interface LatencyHistogramColors {
  bar: string;
  compare: string;
  threshold: string;
  marker: string;
  selection: string;
}

export interface LatencyHistogramProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "children" | "color"
> {
  /** Raw samples. Bucketed for you, with exact percentiles. */
  values?: number[];
  /** Pre-bucketed counts, used when `values` is not given. Percentiles are interpolated. */
  buckets?: LatencyBucket[];
  /** A comparison distribution, e.g. yesterday. Scaled to the main total so shapes compare. */
  compare?: number[] | LatencyBucket[];
  /** Name of the comparison in the legend and tooltip. */
  compareLabel?: string;
  /** Name of the main series in the legend. */
  seriesLabel?: string;
  /** Draw the comparison as a stepped line or as outlined bars. */
  compareStyle?: "step" | "outline";
  /** Percentiles to mark, as numbers such as 50 or 99.9. */
  percentiles?: number[];
  /** Latency objective. The slow tail past it is shaded and measured. */
  threshold?: number;
  thresholdLabel?: string;
  /** X scale. Pass with `onScaleChange` to control the built-in toggle. */
  scale?: LatencyScale;
  defaultScale?: LatencyScale;
  onScaleChange?: (scale: LatencyScale) => void;
  /** Show the linear/log toggle. Defaults to true. */
  showScaleToggle?: boolean;
  /** Brushed range. Pass `null` for none; leave undefined to let the component manage it. */
  range?: LatencyRange | null;
  defaultRange?: LatencyRange | null;
  onRangeChange?: (range: LatencyRange | null) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Controls placed at the top right, before the scale toggle. */
  actions?: React.ReactNode;
  /** Unit of the values. Defaults to "ms"; ms readouts switch to seconds from 1,000. */
  unit?: string;
  /** Formats latencies in readouts, markers, and ticks. */
  valueFormatter?: (value: number) => string;
  /** Target number of bars. Defaults to 40. */
  bucketCount?: number;
  /** Fix the latency domain. Linear charts otherwise end near p99.5 and gather the rest in an overflow bar. */
  domain?: LatencyRange;
  /** Plot height in pixels. Defaults to a third of the plot width, between 140 and 220. */
  height?: number;
  /** Override any series colour with a CSS colour. */
  colors?: Partial<LatencyHistogramColors>;
  /** Replaces the hover tooltip content. */
  renderTooltip?: (bucket: LatencyHistogramBucket) => React.ReactNode;
  /** Show the percentile summary above the plot. Defaults to true. */
  showSummary?: boolean;
}

/* ------------------------------------------------------------------------ */
/* Formatting                                                                */
/* ------------------------------------------------------------------------ */

const tidy = (value: number) => +value.toPrecision(12);
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const whole = new Intl.NumberFormat("en-US");

function makeFormatter(unit: string) {
  const tight = unit.length <= 2;
  const join = (text: string, u: string) =>
    u ? `${text}${tight ? "" : " "}${u}` : text;
  return (value: number) => {
    if (!Number.isFinite(value)) return "—";
    const a = Math.abs(value);
    if (unit === "ms" && a >= 1000)
      return `${tidy(+(value / 1000).toFixed(a >= 10_000 ? 1 : 2))}s`;
    const digits = a >= 100 || a === 0 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : 3;
    return join(String(tidy(+value.toFixed(digits))), unit);
  };
}

function makeTickFormatter(unit: string) {
  const tight = unit.length <= 2;
  return (value: number) => {
    if (value === 0) return "0";
    if (unit === "ms" && Math.abs(value) >= 1000)
      return `${tidy(value / 1000)}s`;
    return `${tidy(value)}${tight ? "" : " "}${unit}`;
  };
}

function percentLabel(share: number) {
  const pct = share * 100;
  if (pct === 0) return "0%";
  if (pct < 0.1) return "<0.1%";
  if (pct > 99.9 && pct < 100) return ">99.9%";
  return `${pct >= 10 ? pct.toFixed(1) : pct.toFixed(2)}%`;
}

function niceStep(raw: number) {
  if (!(raw > 0)) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const r = raw / magnitude;
  return (
    (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * magnitude
  );
}

/** Round down or up to the nearest 1, 2, or 5 times a power of ten. */
function nice125(value: number, up: boolean) {
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const r = value / magnitude;
  const steps = [1, 2, 5, 10];
  if (up) return (steps.find((s) => s >= r - 1e-9) ?? 10) * magnitude;
  return ([...steps].reverse().find((s) => s <= r + 1e-9) ?? 1) * magnitude;
}

function lowerBound(sorted: Float64Array, value: number) {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function upperBound(sorted: Float64Array, value: number) {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/* ------------------------------------------------------------------------ */
/* Model                                                                     */
/* ------------------------------------------------------------------------ */

interface Bar extends LatencyBucket {
  overflow: boolean;
  /** Left and right edges as 0–1 positions. */
  x0: number;
  x1: number;
}

interface Distribution {
  sorted: Float64Array | null;
  buckets: LatencyBucket[] | null;
  total: number;
  min: number;
  max: number;
  mean: number;
}

function distributionOf(
  values?: number[],
  buckets?: LatencyBucket[],
): Distribution {
  if (values) {
    const clean = values.filter((value) => Number.isFinite(value));
    const sorted = Float64Array.from(clean).sort();
    let sum = 0;
    for (const value of sorted) sum += value;
    return {
      sorted,
      buckets: null,
      total: sorted.length,
      min: sorted.length ? sorted[0] : 0,
      max: sorted.length ? sorted[sorted.length - 1] : 0,
      mean: sorted.length ? sum / sorted.length : 0,
    };
  }
  const list = (buckets ?? [])
    .filter(
      (b) =>
        Number.isFinite(b.start) && Number.isFinite(b.end) && b.end > b.start,
    )
    .sort((a, b) => a.start - b.start);
  let total = 0;
  let sum = 0;
  for (const b of list) {
    total += Math.max(0, b.count);
    sum += (Math.max(0, b.count) * (b.start + b.end)) / 2;
  }
  return {
    sorted: null,
    buckets: list,
    total,
    min: list.length ? list[0].start : 0,
    max: list.length ? list[list.length - 1].end : 0,
    mean: total ? sum / total : 0,
  };
}

/** Nearest-rank percentile from samples; interpolated inside buckets otherwise. */
function quantile(d: Distribution, p: number) {
  if (!d.total) return 0;
  if (d.sorted)
    return d.sorted[
      Math.min(d.total - 1, Math.max(0, Math.ceil(p * d.total) - 1))
    ];
  const target = p * d.total;
  let cumulative = 0;
  for (const b of d.buckets!) {
    if (cumulative + b.count >= target && b.count > 0)
      return b.start + ((target - cumulative) / b.count) * (b.end - b.start);
    cumulative += b.count;
  }
  return d.max;
}

/** Requests with a value in [a, b]. Partial buckets count in proportion. */
function countBetween(d: Distribution, a: number, b: number) {
  if (d.sorted) return upperBound(d.sorted, b) - lowerBound(d.sorted, a);
  let count = 0;
  for (const bucket of d.buckets!) {
    const overlap = Math.min(b, bucket.end) - Math.max(a, bucket.start);
    if (overlap > 0)
      count += (bucket.count * overlap) / (bucket.end - bucket.start);
  }
  return count;
}

function countAbove(d: Distribution, value: number) {
  if (d.sorted) return d.total - upperBound(d.sorted, value);
  return countBetween(d, value, Infinity);
}

interface Layout {
  bars: Bar[];
  lo: number;
  hi: number;
  /** Largest value covered, including the overflow bar. */
  top: number;
  pos: (value: number) => number;
  inv: (x: number) => number;
}

function layoutOf(
  d: Distribution,
  scale: LatencyScale,
  bucketCount: number,
  reach: number,
  domain?: LatencyRange,
): Layout {
  const count = Math.max(4, Math.round(bucketCount));
  // Pre-bucketed data keeps its own edges.
  if (d.buckets) {
    const list = d.buckets;
    const first = list[0]?.start ?? 0;
    const last = list[list.length - 1]?.end ?? 1;
    if (scale === "log") {
      const positive =
        list.find((b) => b.start > 0)?.start ?? list[0]?.end ?? 1;
      const lo = first > 0 ? first : positive / 2;
      const span = Math.log(last / lo) || 1;
      const pos = (v: number) =>
        Math.min(1, Math.max(0, Math.log(Math.max(v, lo) / lo) / span));
      const inv = (x: number) => lo * Math.exp(x * span);
      return {
        bars: list.map((b) => ({
          ...b,
          overflow: false,
          x0: pos(b.start),
          x1: pos(b.end),
        })),
        lo,
        hi: last,
        top: last,
        pos,
        inv,
      };
    }
    const span = last - first || 1;
    const pos = (v: number) => Math.min(1, Math.max(0, (v - first) / span));
    const inv = (x: number) => first + x * span;
    return {
      bars: list.map((b) => ({
        ...b,
        overflow: false,
        x0: pos(b.start),
        x1: pos(b.end),
      })),
      lo: first,
      hi: last,
      top: last,
      pos,
      inv,
    };
  }

  const sorted = d.sorted!;
  if (scale === "log") {
    const positive = sorted[lowerBound(sorted, Number.MIN_VALUE)] ?? 1;
    const lo =
      domain?.[0] && domain[0] > 0
        ? domain[0]
        : nice125(Math.max(positive, 1e-9), false);
    const hi = Math.max(
      domain?.[1] ?? nice125(Math.max(d.max, lo * 10), true),
      lo * 1.0001,
    );
    const span = Math.log(hi / lo);
    const step = span / count;
    const bars: Bar[] = Array.from({ length: count }, (_, i) => ({
      start: lo * Math.exp(i * step),
      end: lo * Math.exp((i + 1) * step),
      count: 0,
      overflow: false,
      x0: i / count,
      x1: (i + 1) / count,
    }));
    for (const v of sorted) {
      const i = v <= lo ? 0 : Math.floor(Math.log(v / lo) / step);
      bars[Math.min(count - 1, Math.max(0, i))].count += 1;
    }
    const pos = (v: number) =>
      Math.min(1, Math.max(0, Math.log(Math.max(v, lo) / lo) / span));
    return { bars, lo, hi, top: hi, pos, inv: (x) => lo * Math.exp(x * span) };
  }

  const lo = domain?.[0] ?? (d.min >= 0 ? 0 : -niceStep(-d.min));
  const wanted = domain?.[1] ?? Math.max(reach, lo + 1e-9);
  const step = niceStep((wanted - lo) / count);
  const n = Math.max(1, Math.ceil((wanted - lo) / step - 1e-9));
  const hi = lo + n * step;
  const overflowCount = d.total - upperBound(sorted, hi);
  const units = overflowCount > 0 ? n + 1.7 : n;
  const bars: Bar[] = Array.from({ length: n }, (_, i) => ({
    start: tidy(lo + i * step),
    end: tidy(lo + (i + 1) * step),
    count: 0,
    overflow: false,
    x0: i / units,
    x1: (i + 1) / units,
  }));
  for (
    let k = lowerBound(sorted, lo), end = upperBound(sorted, hi);
    k < end;
    k++
  )
    bars[Math.min(n - 1, Math.floor((sorted[k] - lo) / step))].count += 1;
  // Values below a fixed domain fold into the first bar.
  bars[0].count += lowerBound(sorted, lo);
  const top = Math.max(hi, d.max);
  if (overflowCount > 0)
    bars.push({
      start: hi,
      end: top,
      count: overflowCount,
      overflow: true,
      x0: (n + 0.7) / units,
      x1: 1,
    });
  const mainEnd = n / units;
  const overflowStart = (n + 0.7) / units;
  const pos = (v: number) => {
    if (v <= hi) return Math.max(0, ((v - lo) / (hi - lo)) * mainEnd);
    if (overflowCount <= 0 || top <= hi) return mainEnd;
    return Math.min(
      1,
      overflowStart + ((v - hi) / (top - hi)) * (1 - overflowStart),
    );
  };
  const inv = (x: number) => {
    if (x <= mainEnd) return lo + (x / mainEnd) * (hi - lo);
    if (x < overflowStart || overflowCount <= 0) return hi;
    return hi + ((x - overflowStart) / (1 - overflowStart)) * (top - hi);
  };
  return { bars, lo, hi, top, pos, inv };
}

/** Bin a comparison into the main bars' edges. */
function binCompare(compare: number[] | LatencyBucket[], bars: Bar[]) {
  const counts = new Array<number>(bars.length).fill(0);
  if (!bars.length) return { counts, total: 0 };
  const find = (v: number) => {
    let lo = 0;
    let hi = bars.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (bars[mid].start <= v) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };
  let total = 0;
  for (const item of compare as (number | LatencyBucket)[]) {
    if (typeof item === "number") {
      if (!Number.isFinite(item)) continue;
      counts[find(item)] += 1;
      total += 1;
    } else if (Number.isFinite(item.count)) {
      counts[find((item.start + item.end) / 2)] += item.count;
      total += item.count;
    }
  }
  return { counts, total };
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

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50";
const percentileName = (p: number) => `p${tidy(p)}`;

/* ------------------------------------------------------------------------ */
/* LatencyHistogram                                                          */
/* ------------------------------------------------------------------------ */

/**
 * A latency distribution: bucketed requests with percentile markers, an SLO tail,
 * an optional comparison, and brushing to measure any range.
 */
export function LatencyHistogram({
  values,
  buckets,
  compare,
  compareLabel = "Previous",
  seriesLabel = "Current",
  compareStyle = "step",
  percentiles = [50, 90, 95, 99],
  threshold,
  thresholdLabel = "SLO",
  scale: scaleProp,
  defaultScale = "linear",
  onScaleChange,
  showScaleToggle = true,
  range: rangeProp,
  defaultRange = null,
  onRangeChange,
  title,
  description,
  actions,
  unit = "ms",
  valueFormatter,
  bucketCount = 40,
  domain,
  height,
  colors: colorsProp,
  renderTooltip,
  showSummary = true,
  className,
  ...props
}: LatencyHistogramProps) {
  const id = React.useId();
  const reduced = useReducedMotion();
  const format = React.useMemo(
    () => valueFormatter ?? makeFormatter(unit),
    [valueFormatter, unit],
  );
  const formatTick = React.useMemo(
    () => valueFormatter ?? makeTickFormatter(unit),
    [valueFormatter, unit],
  );
  const colors: LatencyHistogramColors = {
    bar: "var(--color-chart-1)",
    compare: "var(--color-muted-foreground)",
    threshold: "var(--color-destructive)",
    marker: "var(--color-foreground)",
    selection: "var(--color-primary)",
    ...colorsProp,
  };
  const [scale, setScale] = useControllable(
    scaleProp,
    defaultScale,
    onScaleChange,
  );
  const [range, setRange] = useControllable<LatencyRange | null>(
    rangeProp,
    defaultRange,
    onRangeChange,
  );
  const hasThreshold = threshold != null && Number.isFinite(threshold);

  const dist = React.useMemo(
    () => distributionOf(values, buckets),
    [values, buckets],
  );
  const sortedPercentiles = React.useMemo(
    () =>
      [...new Set(percentiles.filter((p) => p > 0 && p < 100))].sort(
        (a, b) => a - b,
      ),
    [percentiles],
  );
  const empty = dist.total === 0;
  const marks = React.useMemo(
    () =>
      dist.total === 0
        ? []
        : sortedPercentiles.map((p) => ({ p, value: quantile(dist, p / 100) })),
    [dist, sortedPercentiles],
  );

  // Linear charts end just past the slow tail (and the SLO); the rest lands in an overflow bar.
  const reach = Math.max(
    quantile(dist, 0.995),
    (marks[marks.length - 1]?.value ?? 0) * 1.04,
    hasThreshold ? threshold! * 1.12 : 0,
  );
  const layout = React.useMemo(
    () => layoutOf(dist, scale, bucketCount, reach, domain),
    [dist, scale, bucketCount, reach, domain],
  );
  const { bars, pos, inv } = layout;

  const comparison = React.useMemo(() => {
    if (!compare?.length) return null;
    const { counts, total } = binCompare(compare, bars);
    const percentilesOf = (() => {
      if (typeof compare[0] === "number") {
        const d = distributionOf(compare as number[]);
        return sortedPercentiles.map((p) => quantile(d, p / 100));
      }
      const d = distributionOf(undefined, compare as LatencyBucket[]);
      return sortedPercentiles.map((p) => quantile(d, p / 100));
    })();
    const factor = total ? dist.total / total : 0;
    return {
      counts,
      total,
      scaled: counts.map((c) => c * factor),
      percentiles: percentilesOf,
    };
  }, [compare, bars, dist.total, sortedPercentiles]);

  const maxCount = Math.max(
    1,
    ...bars.map((b) => b.count),
    ...(comparison?.scaled ?? [0]),
  );
  // The tallest bar fills the plot; gridlines sit at round counts below it.
  const yMax = maxCount * 1.06;
  const yStep = niceStep(maxCount / 3.2);
  const yTicks = Array.from(
    { length: Math.floor(yMax / yStep + 1e-9) + 1 },
    (_, i) => tidy(i * yStep),
  );

  const over = hasThreshold ? countAbove(dist, threshold!) : 0;
  const overShare = dist.total ? over / dist.total : 0;
  const thresholdX = hasThreshold ? pos(threshold!) : 1;

  const cumulative = React.useMemo(() => {
    let running = 0;
    return bars.map((b) => (running += b.count) / (dist.total || 1));
  }, [bars, dist.total]);

  const bucketAt = (index: number): LatencyHistogramBucket => {
    const b = bars[index];
    return {
      index,
      start: b.start,
      end: b.end,
      count: b.count,
      share: dist.total ? b.count / dist.total : 0,
      cumulative: cumulative[index] ?? 0,
      compare: comparison ? comparison.counts[index] : undefined,
      compareShare: comparison?.total
        ? comparison.counts[index] / comparison.total
        : undefined,
      overflow: b.overflow,
      overThreshold: hasThreshold && b.start >= threshold!,
    };
  };

  /* -------------------------------------------------------------- layout */

  const plotRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const W = width || 560;

  // Percentile chips stack into lanes only when they would collide.
  // With the summary on show, crowded chips drop their values, which the summary repeats.
  const chips = React.useMemo(() => {
    const place = (withValue: boolean) => {
      const lanes: number[] = [];
      return marks.map((mark) => {
        const text = withValue
          ? `${percentileName(mark.p)} ${format(mark.value)}`
          : percentileName(mark.p);
        const w = text.length * 6.1 + 14;
        const x = pos(mark.value) * W;
        const left = Math.min(Math.max(0, x - w / 2), Math.max(0, W - w));
        let lane = lanes.findIndex((right) => right + 4 <= left);
        if (lane < 0) lane = lanes.push(0) - 1;
        lanes[lane] = left + w;
        return { ...mark, x, left, lane, w, withValue };
      });
    };
    const full = place(true);
    if (!showSummary || full.every((chip) => chip.lane === 0)) return full;
    return place(false);
  }, [marks, pos, W, format, showSummary]);
  const laneCount = Math.max(1, ...chips.map((chip) => chip.lane + 1));
  const chipTop = laneCount * 20 + 6;
  // Without a fixed height the plot follows the card width, shorter on narrow cards.
  const H = Math.max(
    80,
    height ?? Math.round(Math.min(220, Math.max(140, W * 0.34))),
  );
  const barsHeight = H - chipTop;

  const xTicks = React.useMemo(() => {
    const ticks: number[] = [];
    if (empty) return ticks;
    if (scale === "log" || dist.buckets) {
      if (scale === "log") {
        const lo = layout.lo;
        const hi = layout.hi;
        const candidates: number[] = [];
        for (
          let e = Math.floor(Math.log10(lo));
          e <= Math.ceil(Math.log10(hi));
          e++
        )
          for (const m of [1, 2, 5]) {
            const v = tidy(m * 10 ** e);
            if (v >= lo * 0.999 && v <= hi * 1.001) candidates.push(v);
          }
        // Thin out 2s and then 5s until labels have room.
        for (const keep of [[1, 2, 5], [1, 5], [1]]) {
          const list = candidates.filter((v) =>
            keep.includes(
              Math.round(v / 10 ** Math.floor(Math.log10(v) + 1e-9)),
            ),
          );
          let ok = true;
          for (let i = 1; i < list.length; i++)
            if ((pos(list[i]) - pos(list[i - 1])) * W < 44) ok = false;
          if (ok || keep.length === 1) return list;
        }
      }
    }
    const lo = layout.lo;
    const hi = layout.hi;
    const step = niceStep((hi - lo) / Math.max(2, Math.floor(W / 76)));
    for (
      let v = Math.ceil(lo / step - 1e-9) * step;
      v <= hi + step * 1e-6;
      v += step
    )
      ticks.push(tidy(v));
    return ticks;
  }, [scale, dist.buckets, layout, pos, W, empty]);

  /* ----------------------------------------------------------- animation */

  // Bars grow in on mount and whenever the bucket layout changes; data updates tween.
  // Keyed on scale and bar count only, so live data with a drifting tail tweens instead of regrowing.
  const structure = `${scale}:${bars.length}`;
  const [grown, setGrown] = React.useState<string | null>(null);
  const [intro, setIntro] = React.useState(true);
  React.useEffect(() => {
    if (reduced) {
      setGrown(structure);
      setIntro(false);
      return;
    }
    setIntro(true);
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setGrown(structure));
    });
    const timer = window.setTimeout(
      () => setIntro(false),
      900 + bars.length * 9,
    );
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [structure, reduced, bars.length]);
  const isGrown = grown === structure;

  /* --------------------------------------------------------- interaction */

  const [hover, setHover] = React.useState<number | null>(null);
  const [active, setActive] = React.useState<number | null>(null);
  const [brush, setBrush] = React.useState<LatencyRange | null>(null);
  const drag = React.useRef<{
    x: number;
    value: number;
    moved: boolean;
  } | null>(null);
  const anchor = React.useRef<number | null>(null);

  const xToFraction = (clientX: number) => {
    const rect = plotRef.current!.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / (rect.width || 1)));
  };
  const barAt = (x: number) => {
    for (let i = 0; i < bars.length; i++)
      if (x >= bars[i].x0 && x <= bars[i].x1) return i;
    // In a gap: the nearest bar.
    let best = -1;
    let distance = Infinity;
    bars.forEach((b, i) => {
      const dd = Math.min(Math.abs(x - b.x0), Math.abs(x - b.x1));
      if (dd < distance) {
        distance = dd;
        best = i;
      }
    });
    return best < 0 ? null : best;
  };

  const clampRange = (a: number, b: number): LatencyRange => [
    Math.min(a, b),
    Math.max(a, b),
  ];

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !bars.length) return;
    const x = xToFraction(event.clientX);
    drag.current = { x: event.clientX, value: inv(x), moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!bars.length) return;
    const x = xToFraction(event.clientX);
    const d = drag.current;
    if (d) {
      if (!d.moved && Math.abs(event.clientX - d.x) > 3) d.moved = true;
      if (d.moved) {
        setBrush(clampRange(d.value, inv(x)));
        setHover(null);
        return;
      }
    }
    setHover(barAt(x));
  };
  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.moved) {
      const next = clampRange(d.value, inv(xToFraction(event.clientX)));
      setBrush(null);
      setRange(next[1] - next[0] > 0 ? next : null);
    } else if (range) setRange(null);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!bars.length) return;
    const current = active ?? -1;
    const step = (delta: number) =>
      Math.min(
        bars.length - 1,
        Math.max(
          0,
          current < 0 ? (delta > 0 ? 0 : bars.length - 1) : current + delta,
        ),
      );
    let next: number | null = null;
    if (event.key === "ArrowRight") next = step(1);
    else if (event.key === "ArrowLeft") next = step(-1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = bars.length - 1;
    else if (event.key === "Enter" && current >= 0) {
      setRange([bars[current].start, bars[current].end]);
      event.preventDefault();
      return;
    } else if (event.key === "Escape") {
      if (range) setRange(null);
      else setActive(null);
      anchor.current = null;
      event.preventDefault();
      return;
    }
    if (next == null) return;
    event.preventDefault();
    if (event.shiftKey) {
      if (anchor.current == null) anchor.current = current < 0 ? next : current;
      const a = Math.min(anchor.current, next);
      const b = Math.max(anchor.current, next);
      setRange([bars[a].start, bars[b].end]);
    } else anchor.current = null;
    setActive(next);
  };

  const shownRange = brush ?? range;
  const rangeCount = shownRange
    ? countBetween(dist, shownRange[0], shownRange[1])
    : 0;
  const rangeShare = dist.total ? rangeCount / dist.total : 0;
  const focusIndex = hover ?? active;
  const focusBucket =
    focusIndex != null && bars[focusIndex] ? bucketAt(focusIndex) : null;

  /* -------------------------------------------------------------- render */

  const describeBucket = (b: LatencyHistogramBucket) =>
    `${b.overflow ? `${format(b.start)} and above` : `${format(b.start)} to ${format(b.end)}`}: ${whole.format(Math.round(b.count))} requests, ${percentLabel(b.share)}`;
  const summaryText = [
    `${whole.format(Math.round(dist.total))} requests.`,
    marks
      .map((mark) => `${percentileName(mark.p)} ${format(mark.value)}`)
      .join(", ") + ".",
    hasThreshold
      ? `${percentLabel(overShare)} over the ${thresholdLabel} of ${format(threshold!)}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  const hasHeader =
    title != null || description != null || actions != null || showScaleToggle;
  const transition = intro
    ? "transform 760ms cubic-bezier(.16,1,.3,1)"
    : "transform 520ms cubic-bezier(.16,1,.3,1)";
  const barFill = (color: string) =>
    `color-mix(in oklab, ${color} 72%, var(--color-card))`;

  // The comparison as one stepped path across the bars.
  const comparePath = React.useMemo(() => {
    if (!comparison || compareStyle !== "step") return null;
    let path = "";
    let previousEnd = -1;
    bars.forEach((b, i) => {
      const y = 100 - (comparison.scaled[i] / yMax) * 100;
      const x0 = b.x0 * 1000;
      const x1 = b.x1 * 1000;
      if (Math.abs(x0 - previousEnd) > 0.5)
        path += `${path ? "V100" : ""}M${x0.toFixed(2)} 100`;
      path += `V${y.toFixed(2)}H${x1.toFixed(2)}`;
      previousEnd = x1;
    });
    return path + "V100";
  }, [comparison, compareStyle, bars, yMax]);

  return (
    <div
      data-slot="latency-histogram"
      data-scale={scale}
      data-brushing={brush ? true : undefined}
      className={cn(
        "@container/histogram flex min-w-0 flex-col rounded-xl border bg-card text-card-foreground shadow-xs",
        className,
      )}
      {...props}
    >
      {hasHeader && (
        <div className="flex items-start gap-3 px-4 pt-3.5">
          <div className="min-w-0 flex-1 space-y-1">
            {title != null && (
              <h3 className="truncate text-sm leading-6 font-semibold tracking-tight">
                {title}
              </h3>
            )}
            {description != null && (
              <p
                id={`${id}-description`}
                className="text-xs text-muted-foreground"
              >
                {description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            {showScaleToggle && (
              <div
                role="group"
                aria-label="X axis scale"
                data-slot="histogram-scale-toggle"
                className="inline-flex h-7 items-center rounded-md border bg-muted/40 p-0.5"
              >
                {(["linear", "log"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={scale === option}
                    onClick={() => setScale(option)}
                    className={cn(
                      "h-full rounded-[5px] px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-xs motion-reduce:transition-none",
                      focusRing,
                    )}
                  >
                    {option === "linear" ? "Linear" : "Log"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showSummary && (marks.length > 0 || hasThreshold) && (
        // Narrow cards trade the stat grid for one line, so the distribution stays in view.
        <dl
          data-slot="histogram-summary-compact"
          className={cn(
            "mx-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs @md/histogram:hidden",
            hasHeader ? "mt-1.5" : "mt-4",
          )}
        >
          {marks.map((mark, i) => {
            const previous = comparison?.percentiles[i];
            const delta = previous != null ? mark.value - previous : null;
            const hot = hasThreshold && mark.value > threshold!;
            return (
              <div key={mark.p} className="flex items-baseline gap-1">
                <dt className="font-mono text-[11px] text-muted-foreground">
                  {percentileName(mark.p)}
                </dt>
                <dd
                  className={cn(
                    "font-semibold tabular-nums",
                    hot && "text-destructive",
                  )}
                >
                  {format(mark.value)}
                </dd>
                {delta != null && Math.abs(delta) > 0 && (
                  <dd
                    className={cn(
                      "font-mono text-[10px] tabular-nums",
                      delta > 0
                        ? "text-destructive"
                        : "text-emerald-600 dark:text-emerald-400",
                    )}
                  >
                    {delta > 0 ? "▲" : "▼"}
                    {format(Math.abs(delta))}
                  </dd>
                )}
              </div>
            );
          })}
          {hasThreshold && (
            <div className="flex items-baseline gap-1">
              <dd
                className={cn(
                  "font-semibold tabular-nums",
                  over > 0
                    ? "text-destructive"
                    : "text-emerald-600 dark:text-emerald-400",
                )}
              >
                {percentLabel(overShare)}
              </dd>
              <dt className="text-[11px] text-muted-foreground">
                over {thresholdLabel}
              </dt>
            </div>
          )}
        </dl>
      )}

      {showSummary && (marks.length > 0 || hasThreshold) && (
        <dl
          data-slot="histogram-summary"
          className={cn(
            "mx-4 hidden gap-px overflow-hidden rounded-lg border bg-border @md/histogram:grid",
            hasHeader ? "mt-3" : "mt-4",
          )}
          style={{
            gridTemplateColumns: `repeat(${marks.length + (hasThreshold ? 1 : 0)}, minmax(0, 1fr))`,
          }}
        >
          {marks.map((mark, i) => {
            const previous = comparison?.percentiles[i];
            const delta = previous != null ? mark.value - previous : null;
            const hot = hasThreshold && mark.value > threshold!;
            return (
              <div
                key={mark.p}
                className="min-w-0 bg-card px-2 py-1.5 @sm/histogram:px-2.5 @md/histogram:px-3 @md/histogram:py-2"
              >
                <dt className="font-mono text-[11px] leading-4 text-muted-foreground">
                  {percentileName(mark.p)}
                </dt>
                <dd
                  className={cn(
                    "truncate text-sm leading-6 font-semibold tracking-tight tabular-nums @sm/histogram:text-base @md/histogram:text-lg",
                    hot && "text-destructive",
                  )}
                >
                  {format(mark.value)}
                </dd>
                {delta != null && Math.abs(delta) > 0 && (
                  <dd
                    className={cn(
                      "truncate font-mono text-[10px] leading-4 whitespace-nowrap tabular-nums @sm/histogram:text-[10.5px]",
                      delta > 0
                        ? "text-destructive"
                        : "text-emerald-600 dark:text-emerald-400",
                    )}
                    title={`${compareLabel}: ${format(previous!)}`}
                  >
                    {delta > 0 ? "▲" : "▼"} {format(Math.abs(delta))}
                  </dd>
                )}
              </div>
            );
          })}
          {hasThreshold && (
            <div className="min-w-0 bg-card px-2 py-1.5 @sm/histogram:px-2.5 @md/histogram:px-3 @md/histogram:py-2">
              <dt className="truncate text-[11px] leading-4 text-muted-foreground">
                Over {thresholdLabel}
              </dt>
              <dd
                className={cn(
                  "truncate text-sm leading-6 font-semibold tracking-tight tabular-nums @sm/histogram:text-base @md/histogram:text-lg",
                  over > 0
                    ? "text-destructive"
                    : "text-emerald-600 dark:text-emerald-400",
                )}
              >
                {percentLabel(overShare)}
              </dd>
              <dd className="truncate font-mono text-[10px] leading-4 text-muted-foreground tabular-nums @sm/histogram:text-[10.5px]">
                {whole.format(Math.round(over))}
                <span className="hidden @sm/histogram:inline">
                  {" "}
                  of {compact.format(dist.total).replace("K", "k")}
                </span>
              </dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-3 flex px-4 @md/histogram:mt-4">
        <div className="min-w-0 flex-1">
          <div
            ref={plotRef}
            data-slot="histogram-plot"
            role="group"
            aria-roledescription="histogram"
            aria-label={`${typeof title === "string" ? `${title}. ` : ""}${summaryText} Use the arrow keys to read buckets, Shift to select a range.`}
            aria-describedby={
              description != null ? `${id}-description` : undefined
            }
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              drag.current = null;
              setBrush(null);
            }}
            onPointerLeave={() => {
              if (!drag.current) setHover(null);
            }}
            onKeyDown={onKeyDown}
            onBlur={() => setActive(null)}
            className={cn(
              "relative cursor-crosshair touch-pan-y rounded-sm select-none",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-4 focus-visible:ring-offset-card",
            )}
            style={{ height: H }}
          >
            {empty && (
              <p className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                No requests to show.
              </p>
            )}

            {/* Value grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0"
              style={{ top: chipTop }}
            >
              {yTicks.map((tick) => (
                <span
                  key={tick}
                  className={cn(
                    "absolute inset-x-0 h-px",
                    tick === 0 ? "bg-border" : "bg-border/55",
                  )}
                  style={{ bottom: `${(tick / yMax) * 100}%` }}
                />
              ))}
            </div>

            {/* SLO tail */}
            {hasThreshold && thresholdX < 1 && (
              <div
                aria-hidden="true"
                data-slot="histogram-threshold-region"
                className="pointer-events-none absolute inset-y-0 right-0"
                style={{
                  left: `${thresholdX * 100}%`,
                  background: `linear-gradient(to bottom, color-mix(in oklab, ${colors.threshold} 9%, transparent), color-mix(in oklab, ${colors.threshold} 3%, transparent)), repeating-linear-gradient(-45deg, color-mix(in oklab, ${colors.threshold} 9%, transparent) 0 1px, transparent 1px 6px)`,
                }}
              />
            )}

            {/* Bars */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0"
              style={{ top: chipTop }}
            >
              {comparison &&
                compareStyle === "outline" &&
                bars.map((b, i) => (
                  <span
                    key={`c-${structure}-${i}`}
                    className="absolute bottom-0 origin-bottom rounded-t-[2px] border border-b-0 border-dashed"
                    style={{
                      left: `calc(${b.x0 * 100}% + 1px)`,
                      width: `calc(${(b.x1 - b.x0) * 100}% - 2px)`,
                      height: `${(comparison.scaled[i] / yMax) * 100}%`,
                      borderColor: `color-mix(in oklab, ${colors.compare} 70%, transparent)`,
                      transform: `scaleY(${isGrown ? 1 : 0})`,
                      transition: reduced ? undefined : transition,
                    }}
                  />
                ))}
              {bars.map((b, i) => {
                const h = b.count / yMax;
                const inRange = shownRange
                  ? b.end > shownRange[0] && b.start < shownRange[1]
                  : true;
                const dim =
                  (focusIndex != null && focusIndex !== i) || !inRange;
                const split =
                  hasThreshold && b.start < threshold! && b.end > threshold!;
                const hot = hasThreshold && b.start >= threshold!;
                const color = hot ? colors.threshold : colors.bar;
                const cut = split
                  ? ((thresholdX - b.x0) / (b.x1 - b.x0)) * 100
                  : 0;
                const fill = split
                  ? `linear-gradient(to right, ${barFill(colors.bar)} ${cut}%, ${barFill(colors.threshold)} ${cut}%)`
                  : barFill(color);
                const cap = split
                  ? `linear-gradient(to right, ${colors.bar} ${cut}%, ${colors.threshold} ${cut}%)`
                  : color;
                return (
                  <span
                    key={`${structure}-${i}`}
                    data-slot="histogram-bar"
                    data-index={i}
                    data-over={hot || undefined}
                    data-overflow={b.overflow || undefined}
                    className={cn(
                      "absolute inset-y-0 transition-opacity duration-200 motion-reduce:transition-none",
                      dim &&
                        (shownRange && !inRange ? "opacity-30" : "opacity-55"),
                    )}
                    style={{
                      left: `${b.x0 * 100}%`,
                      width: `${(b.x1 - b.x0) * 100}%`,
                    }}
                  >
                    <span
                      className="absolute inset-x-px bottom-0 h-full origin-bottom @lg/histogram:inset-x-[1.5px]"
                      style={{
                        transform: `scaleY(${isGrown ? h : 0})`,
                        transition: reduced ? undefined : transition,
                        transitionDelay:
                          intro && !reduced ? `${i * 9}ms` : undefined,
                      }}
                    >
                      <span
                        className={cn(
                          "absolute inset-0 rounded-t-[2px]",
                          b.overflow &&
                            "[mask-image:repeating-linear-gradient(-45deg,#000_0_3px,rgb(0_0_0/0.55)_3px_5px)]",
                        )}
                        style={{ background: fill }}
                      />
                    </span>
                    {/* The cap is drawn unscaled so it stays a crisp line at any height. */}
                    {b.count > 0 && (
                      <span
                        className="absolute inset-x-px h-[1.5px] rounded-full @lg/histogram:inset-x-[1.5px]"
                        style={{
                          bottom: `calc(${(isGrown ? h : 0) * 100}% - 1px)`,
                          background: cap,
                          transition: reduced
                            ? undefined
                            : intro
                              ? "bottom 760ms cubic-bezier(.16,1,.3,1)"
                              : "bottom 520ms cubic-bezier(.16,1,.3,1)",
                          transitionDelay:
                            intro && !reduced ? `${i * 9}ms` : undefined,
                        }}
                      />
                    )}
                  </span>
                );
              })}
              {comparePath && (
                <svg
                  data-slot="histogram-compare"
                  className="absolute inset-0 size-full origin-bottom overflow-visible"
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="none"
                  style={{
                    transform: `scaleY(${isGrown ? 1 : 0})`,
                    transition: reduced ? undefined : transition,
                  }}
                >
                  <path
                    d={comparePath}
                    fill="none"
                    stroke={colors.compare}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    opacity={0.85}
                  />
                </svg>
              )}
            </div>

            {/* Selection */}
            {shownRange && (
              <div
                aria-hidden="true"
                data-slot="histogram-selection"
                className="pointer-events-none absolute inset-y-0"
                style={{
                  left: `${pos(shownRange[0]) * 100}%`,
                  width: `${Math.max(0, pos(shownRange[1]) - pos(shownRange[0])) * 100}%`,
                  background: `color-mix(in oklab, ${colors.selection} 9%, transparent)`,
                  boxShadow: `inset 1.5px 0 0 ${colors.selection}, inset -1.5px 0 0 ${colors.selection}`,
                }}
              >
                <span
                  className="absolute top-1/2 -left-[3px] h-5 w-1.5 -translate-y-1/2 rounded-full border border-card"
                  style={{ background: colors.selection }}
                />
                <span
                  className="absolute top-1/2 -right-[3px] h-5 w-1.5 -translate-y-1/2 rounded-full border border-card"
                  style={{ background: colors.selection }}
                />
              </div>
            )}

            {/* Threshold line */}
            {hasThreshold && thresholdX < 1 && (
              <div
                aria-hidden="true"
                data-slot="histogram-threshold"
                className="pointer-events-none absolute bottom-0"
                style={{ left: `${thresholdX * 100}%`, top: chipTop - 2 }}
              >
                <span
                  className="absolute inset-y-0 w-0 border-l-[1.5px] border-dashed"
                  style={{ borderColor: colors.threshold }}
                />
                <span
                  className="absolute top-1 left-1 rounded-sm bg-card/85 px-1 font-mono text-[10px] leading-4 font-medium whitespace-nowrap"
                  style={{ color: colors.threshold }}
                >
                  {thresholdLabel} {format(threshold!)}
                </span>
              </div>
            )}

            {/* Percentile markers */}
            {chips.map((chip) => {
              const hot = hasThreshold && chip.value > threshold!;
              const color = hot ? colors.threshold : colors.marker;
              return (
                <div
                  key={chip.p}
                  data-slot="histogram-marker"
                  data-percentile={chip.p}
                  aria-hidden="true"
                  className="pointer-events-none"
                >
                  <span
                    className="absolute bottom-0 w-0 border-l border-dashed opacity-55"
                    style={{
                      left: chip.x,
                      top: chip.lane * 20 + 18,
                      borderColor: color,
                    }}
                  />
                  <span
                    className={cn(
                      "absolute flex h-[18px] items-center gap-1 rounded-[5px] border bg-card px-1.5 font-mono text-[10px] leading-none whitespace-nowrap shadow-xs tabular-nums",
                      intro &&
                        !reduced &&
                        "motion-safe:animate-[histogram-rise_.5s_.35s_cubic-bezier(.16,1,.3,1)_both]",
                    )}
                    style={{
                      left: chip.left,
                      top: chip.lane * 20,
                      borderColor: `color-mix(in oklab, ${color} 28%, var(--color-border))`,
                    }}
                  >
                    <span className="text-muted-foreground">
                      {percentileName(chip.p)}
                    </span>
                    {chip.withValue && (
                      <span className="font-semibold" style={{ color }}>
                        {format(chip.value)}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}

            {/* Tooltip */}
            {focusBucket && !brush && (
              <div
                data-slot="histogram-tooltip"
                aria-hidden="true"
                className="pointer-events-none absolute z-10 min-w-36 rounded-lg border bg-popover px-2.5 py-2 text-xs text-popover-foreground shadow-md"
                style={{
                  top: chipTop + 4,
                  // Sit beside the bar, on the side with more room, so it never hides it.
                  ...(bars[focusBucket.index].x0 + bars[focusBucket.index].x1 <
                  1
                    ? { left: bars[focusBucket.index].x1 * W + 8 }
                    : { right: W - bars[focusBucket.index].x0 * W + 8 }),
                }}
              >
                {renderTooltip ? (
                  renderTooltip(focusBucket)
                ) : (
                  <>
                    <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                      {focusBucket.overflow
                        ? `≥ ${format(focusBucket.start)}`
                        : `${format(focusBucket.start)} – ${format(focusBucket.end)}`}
                    </p>
                    <p className="mt-0.5 flex items-baseline gap-1.5">
                      <span className="text-sm font-semibold tabular-nums">
                        {whole.format(Math.round(focusBucket.count))}
                      </span>
                      <span className="text-muted-foreground tabular-nums">
                        {percentLabel(focusBucket.share)}
                      </span>
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">
                      {percentLabel(focusBucket.cumulative)} at or faster
                    </p>
                    {focusBucket.compare != null && comparison && (
                      <p className="mt-1.5 flex items-center gap-1.5 border-t border-dashed pt-1.5 text-[11px] text-muted-foreground tabular-nums">
                        <span
                          aria-hidden="true"
                          className="w-3 border-t-[1.5px] border-dashed"
                          style={{ borderColor: colors.compare }}
                        />
                        {compareLabel}
                        <span className="ml-auto font-medium text-foreground">
                          {whole.format(Math.round(focusBucket.compare))}
                        </span>
                        <span>
                          {percentLabel(focusBucket.compareShare ?? 0)}
                        </span>
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Latency axis */}
          <div
            aria-hidden="true"
            className="relative mt-1.5 h-4 font-mono text-[10px] leading-4 text-muted-foreground tabular-nums"
          >
            {xTicks.map((tick, i) => {
              const x = pos(tick);
              if (x > layout.pos(layout.hi) + 1e-6) return null;
              return (
                <span
                  key={tick}
                  className={cn(
                    "absolute whitespace-nowrap",
                    i === 0 && x < 0.02
                      ? ""
                      : x > 0.97
                        ? "-translate-x-full"
                        : "-translate-x-1/2",
                  )}
                  style={{ left: `${x * 100}%` }}
                >
                  {formatTick(tick)}
                </span>
              );
            })}
            {bars[bars.length - 1]?.overflow && (
              <span
                className="absolute -translate-x-1/2 whitespace-nowrap"
                style={{
                  left: `${((bars[bars.length - 1].x0 + 1) / 2) * 100}%`,
                }}
              >
                +
              </span>
            )}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="relative ml-2 w-8 shrink-0"
          style={{ height: H }}
        >
          {yTicks.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 translate-y-1/2 font-mono text-[10px] leading-none text-muted-foreground tabular-nums"
              style={{ bottom: `${(tick / yMax) * (barsHeight / H) * 100}%` }}
            >
              {tick === 0 ? "0" : compact.format(tick).replace("K", "k")}
            </span>
          ))}
        </div>
      </div>

      <div
        data-slot="histogram-footer"
        className="mt-3 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t px-4 py-2"
      >
        <div
          data-slot="histogram-status"
          className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs"
        >
          {shownRange ? (
            <>
              <span
                className="rounded-[4px] px-1.5 py-px font-mono text-[11px] tabular-nums"
                style={{
                  background: `color-mix(in oklab, ${colors.selection} 10%, transparent)`,
                  color: colors.selection,
                }}
              >
                {format(shownRange[0])} – {format(shownRange[1])}
              </span>
              <span className="font-semibold tabular-nums">
                {percentLabel(rangeShare)}
              </span>
              <span className="text-muted-foreground tabular-nums">
                {whole.format(Math.round(rangeCount))} of{" "}
                {whole.format(Math.round(dist.total))} requests
              </span>
              {!brush && (
                <button
                  type="button"
                  onClick={() => setRange(null)}
                  className={cn(
                    "inline-flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground",
                    focusRing,
                  )}
                >
                  <X className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">Clear selection</span>
                </button>
              )}
            </>
          ) : (
            <span className="text-muted-foreground tabular-nums">
              <span className="font-medium text-foreground">
                {whole.format(Math.round(dist.total))}
              </span>{" "}
              requests
              <span aria-hidden="true"> · </span>mean{" "}
              <span className="font-medium text-foreground">
                {format(dist.mean)}
              </span>
              <span className="hidden @md/histogram:inline">
                <span aria-hidden="true"> · </span>max{" "}
                <span className="font-medium text-foreground">
                  {format(dist.max)}
                </span>
              </span>
              <span className="hidden @lg/histogram:inline">
                {" "}
                · drag to measure a range
              </span>
            </span>
          )}
        </div>
        {comparison && (
          <div
            data-slot="histogram-legend"
            className="flex items-center gap-3 text-[11px] text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-[2px]"
                style={{
                  background: barFill(colors.bar),
                  boxShadow: `inset 0 1.5px 0 ${colors.bar}`,
                }}
              />
              {seriesLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="w-3.5 border-t-[1.5px] border-dashed"
                style={{ borderColor: colors.compare }}
              />
              {compareLabel}
            </span>
          </div>
        )}
      </div>

      <div className="sr-only">
        <table>
          <caption>{summaryText}</caption>
          <thead>
            <tr>
              <th scope="col">Latency</th>
              <th scope="col">Requests</th>
              {comparison && <th scope="col">{compareLabel}</th>}
            </tr>
          </thead>
          <tbody>
            {bars.map((b, i) =>
              b.count > 0 || comparison?.counts[i] ? (
                <tr key={i}>
                  <th scope="row">
                    {b.overflow
                      ? `${format(b.start)} and above`
                      : `${format(b.start)} to ${format(b.end)}`}
                  </th>
                  <td>{whole.format(Math.round(b.count))}</td>
                  {comparison && (
                    <td>{whole.format(Math.round(comparison.counts[i]))}</td>
                  )}
                </tr>
              ) : null,
            )}
          </tbody>
        </table>
      </div>
      <p className="sr-only" aria-live="polite">
        {active != null && bars[active]
          ? describeBucket(bucketAt(active))
          : range
            ? `Selected ${format(range[0])} to ${format(range[1])}: ${percentLabel(dist.total ? countBetween(dist, range[0], range[1]) / dist.total : 0)} of requests.`
            : ""}
      </p>

      <style href="overtrue-latency-histogram" precedence="default">
        {`@keyframes histogram-rise{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}
      </style>
    </div>
  );
}
