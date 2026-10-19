"use client";

import * as React from "react";
import { IconAlertTriangle as AlertTriangle } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export type LiveChartVariant = "area" | "line" | "bars";

export interface LiveChartProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "color"
> {
  /** Rolling window of samples, oldest first. Append to the end (and drop from the start) to stream. */
  data: number[];
  /** Metric name shown in the header and used in accessible summaries. */
  label?: string;
  description?: React.ReactNode;
  /** Controls or a status indicator placed at the top right. */
  actions?: React.ReactNode;
  /** Unit shown beside the current value, e.g. "req/s" or "ms". */
  unit?: string;
  variant?: LiveChartVariant;
  /** Samples visible across the plot. Defaults to `data.length`; shorter series fill in from the right. */
  windowSize?: number;
  /** Milliseconds between samples. Sets the glide speed (measured from updates otherwise) and labels the time axis. */
  interval?: number;
  threshold?: number;
  thresholdLabel?: string;
  /** Which side of `threshold` counts as a breach. */
  alertWhen?: "above" | "below";
  /** Show min, average, max and p95 for the visible window. */
  stats?: boolean;
  valueFormatter?: (value: number) => string;
  /** Formats axis ticks. Defaults to a compact number. */
  axisFormatter?: (value: number) => string;
  /** Plot height in pixels. */
  height?: number;
  /** Fix the bottom of the value axis. Area and bar charts start at zero by default. */
  min?: number;
  /** Fix the top of the value axis. Otherwise it expands immediately and shrinks after a calm period. */
  max?: number;
  /** Any CSS color. Defaults to chart-1. */
  color?: string;
}

// Plot insets keep the head marker and the top tick label inside the frame.
const PAD_TOP = 14;
const PAD_BOTTOM = 6;
// Share of the incoming slope kept as each point's tangent. Past-only tangents keep
// every curve segment final the moment it appears, so nothing wobbles as it scrolls.
const TENSION = 0.5;
const LEAD = 3;
const SHRINK_AFTER = 6;
const HEAD_SAMPLES = 24;

const formats = [0, 1, 2].map(
  (digits) => new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }),
);
const valueFormat = formats[1];
const compactFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
// Fewer decimals as magnitude grows, so readouts keep a steady width.
const defaultValueFormatter = (value: number) =>
  formats[Math.abs(value) >= 100 ? 0 : Math.abs(value) >= 10 ? 1 : 2].format(value);
const defaultAxisFormatter = (value: number) =>
  Math.abs(value) >= 1000
    ? compactFormat.format(value).replace("K", "k")
    : valueFormat.format(value);

/* ------------------------------------------------------------------------ */
/* Scales                                                                    */
/* ------------------------------------------------------------------------ */

interface Domain {
  lo: number;
  hi: number;
  step: number;
}

const tidy = (value: number) => +value.toPrecision(12);

// "Limit" reads as "above limit"; acronyms such as "SLO" keep their case.
const inline = (text: string) => (text === text.toUpperCase() ? text : text.charAt(0).toLowerCase() + text.slice(1));

function niceStep(span: number) {
  const raw = span / 4;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const r = raw / magnitude;
  return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * magnitude;
}

function niceDomain(lo: number, hi: number, min?: number, max?: number): Domain {
  if (!(hi > lo)) {
    const pad = Math.abs(hi) * 0.1 || 1;
    lo -= pad;
    hi += pad;
  }
  const step = niceStep(hi - lo);
  return {
    lo: min ?? tidy(Math.floor(lo / step + 1e-9) * step),
    hi: max ?? tidy(Math.ceil(hi / step - 1e-9) * step),
    step,
  };
}

function targetDomain(
  values: number[],
  zeroBased: boolean,
  threshold: number | undefined,
  min?: number,
  max?: number,
): Domain {
  let lo = Infinity;
  let hi = -Infinity;
  for (const value of values) {
    if (value < lo) lo = value;
    if (value > hi) hi = value;
  }
  if (lo === Infinity) {
    lo = 0;
    hi = 1;
  }
  if (threshold !== undefined && Number.isFinite(threshold)) {
    lo = Math.min(lo, threshold);
    hi = Math.max(hi, threshold);
  }
  if (zeroBased) {
    lo = Math.min(lo, 0);
    hi = Math.max(hi, 0);
  }
  const span = hi - lo || Math.abs(hi) || 1;
  return niceDomain(
    zeroBased && lo >= 0 ? lo : lo - span * 0.1,
    hi + span * 0.1,
    min,
    max,
  );
}

/** Expand at once so nothing is clipped; shrink only after the window has stayed calm. */
function stepDomain(
  previous: Domain | undefined,
  target: Domain,
  calm: number,
  min?: number,
  max?: number,
): [Domain, number] {
  if (!previous) return [target, 0];
  if (target.lo < previous.lo || target.hi > previous.hi)
    return [
      niceDomain(
        Math.min(previous.lo, target.lo),
        Math.max(previous.hi, target.hi),
        min,
        max,
      ),
      0,
    ];
  if (target.hi - target.lo < (previous.hi - previous.lo) * 0.8)
    return calm + 1 >= SHRINK_AFTER ? [target, 0] : [previous, calm + 1];
  return [previous, 0];
}

function ticksOf({ lo, hi, step }: Domain) {
  const ticks: number[] = [];
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-6; v += step)
    ticks.push(tidy(v));
  return ticks;
}

function mapping({ lo, hi }: Domain, height: number) {
  const a = -(height - PAD_TOP - PAD_BOTTOM) / (hi - lo || 1);
  return { a, b: PAD_TOP - a * hi };
}

/* ------------------------------------------------------------------------ */
/* Frames: one per data update, carrying what the glide needs               */
/* ------------------------------------------------------------------------ */

interface Frame {
  key: string;
  values: number[];
  /** Samples that just left the window, kept so the left edge stays covered mid-glide. */
  lead: number[];
  /** Samples appended since the previous frame; 0 = unchanged, -1 = replaced. */
  shift: number;
  /** Running index of the newest sample. */
  seq: number;
  domain: Domain;
  calm: number;
}

function sanitize(data: number[], cap: number) {
  const start = Math.max(0, data.length - cap);
  const out: number[] = [];
  let last = 0;
  for (let i = start; i < data.length; i++) {
    const value = data[i];
    if (Number.isFinite(value)) last = value;
    out.push(last);
  }
  return out;
}

function detectShift(a: number[], b: number[]) {
  if (a.length === b.length && a.every((value, i) => value === b[i])) return 0;
  for (let k = 1; k <= LEAD; k++) {
    const drop = a.length + k - b.length;
    const keep = b.length - k;
    if (drop < 0 || keep < 1) continue;
    let match = true;
    for (let i = 0; i < keep && match; i++) match = a[drop + i] === b[i];
    if (match) return k;
  }
  return -1;
}

function buildFrame(
  previous: Frame | undefined,
  data: number[],
  cap: number,
  zeroBased: boolean,
  threshold: number | undefined,
  min?: number,
  max?: number,
): Frame {
  const key = [cap, zeroBased, threshold, min, max].join();
  const values = sanitize(data, cap);
  const comparable = previous?.key === key ? previous : undefined;
  const shift = comparable ? detectShift(comparable.values, values) : -1;
  // Same samples in a new array: keep the frame so nothing restarts.
  if (comparable && shift === 0) return comparable;
  const dropped = previous && shift > 0 ? previous.values.length + shift - values.length : 0;
  const [domain, calm] = stepDomain(
    shift >= 0 ? previous?.domain : undefined,
    targetDomain(values, zeroBased, threshold, min, max),
    previous?.calm ?? 0,
    min,
    max,
  );
  return {
    key,
    values,
    lead:
      previous && shift > 0
        ? [...previous.lead, ...previous.values.slice(0, dropped)].slice(-LEAD)
        : [],
    shift,
    seq: (previous?.seq ?? values.length - 1) + Math.max(shift, 0),
    domain,
    calm,
  };
}

/* ------------------------------------------------------------------------ */
/* Geometry                                                                  */
/* ------------------------------------------------------------------------ */

interface Segment {
  x0: number;
  y0: number;
  c1: number;
  c2: number;
  y1: number;
}

const r2 = (value: number) => Math.round(value * 100) / 100;

function bezier({ y0, c1, c2, y1 }: Segment, t: number) {
  const u = 1 - t;
  return u * u * u * y0 + 3 * u * u * t * c1 + 3 * u * t * t * c2 + t * t * t * y1;
}

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

function readTransform(element: Element | null) {
  const value = element ? getComputedStyle(element).transform : "none";
  if (!value || value === "none") return { x: 0, y: 0, k: 1 };
  const matrix = new DOMMatrixReadOnly(value);
  return { x: matrix.m41, y: matrix.m42, k: matrix.m22 };
}

function percentile(sorted: number[], p: number) {
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)];
}

function formatAgo(ms: number) {
  const seconds = Math.round(ms / 1000);
  if (seconds <= 0) return "now";
  if (seconds < 120) return `${seconds}s ago`;
  return `${Math.round(seconds / 60)}m ago`;
}

function formatSpan(ms: number) {
  const seconds = Math.round(ms / 1000);
  if (seconds < 120) return `−${seconds}s`;
  if (seconds < 7200) return `−${Math.round(seconds / 60)}m`;
  return `−${Math.round(seconds / 3600)}h`;
}

/* ------------------------------------------------------------------------ */
/* LiveChart                                                                 */
/* ------------------------------------------------------------------------ */

/**
 * A streaming chart for a fixed window of samples. Each update renders once; the
 * line then glides left on the compositor, so it stays smooth without per-frame renders.
 */
export function LiveChart({
  data,
  label = "Live value",
  description,
  actions,
  unit,
  variant = "area",
  windowSize,
  interval,
  threshold,
  thresholdLabel = "Threshold",
  alertWhen = "above",
  stats = true,
  valueFormatter = defaultValueFormatter,
  axisFormatter = defaultAxisFormatter,
  height = 180,
  min,
  max,
  color = "var(--color-chart-1)",
  className,
  style,
  ...props
}: LiveChartProps) {
  const id = React.useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const bars = variant === "bars";
  const zeroBased = variant !== "line";
  const cap = Math.max(2, Math.round(windowSize ?? data.length));
  const hasThreshold = threshold !== undefined && Number.isFinite(threshold);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLDivElement>(null);
  const seriesRef = React.useRef<HTMLDivElement>(null);
  const scaleRef = React.useRef<HTMLDivElement>(null);
  const hoverRef = React.useRef<HTMLDivElement>(null);
  const headRef = React.useRef<HTMLDivElement>(null);
  const hotHeadRef = React.useRef<HTMLDivElement>(null);
  const okHeadRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<Frame | undefined>(undefined);
  const committedRef = React.useRef<{ frame: Frame; width: number; height: number } | null>(null);
  const animations = React.useRef<Animation[]>([]);
  const cadence = React.useRef({ at: 0, every: interval ?? 1000 });
  const pointerX = React.useRef<number | null>(null);

  const [rowWidth, setRowWidth] = React.useState(0);
  const [hoverSeq, setHoverSeq] = React.useState<number | null>(null);
  const [gutterFloor, setGutterFloor] = React.useState(0);

  // Reading the last committed frame keeps the render pure: it is only written after commit.
  const frame = React.useMemo(
    () =>
      buildFrame(frameRef.current, data, cap, zeroBased, hasThreshold ? threshold : undefined, min, max),
    [data, cap, zeroBased, threshold, min, max],
  );

  const { values, lead, domain, seq } = frame;
  const n = values.length;
  const latest = n ? values[n - 1] : undefined;
  const breached = (value: number | undefined) =>
    value !== undefined && hasThreshold
      ? alertWhen === "above"
        ? value > threshold!
        : value < threshold!
      : false;
  const breach = breached(latest);

  const summary = React.useMemo(() => {
    if (!n) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((total, value) => total + value, 0);
    return { min: sorted[0], max: sorted[n - 1], avg: sum / n, p95: percentile(sorted, 0.95) };
  }, [values, n]);

  const ticks = React.useMemo(() => ticksOf(domain), [domain]);
  const tickLabels = ticks.map((tick) => axisFormatter(tick));
  const gutterNeeded = Math.ceil(Math.max(3, ...tickLabels.map((t) => t.length)) * 6.1 + 12);
  const gutter = Math.max(gutterNeeded, gutterFloor);
  const W = Math.max(0, rowWidth - gutter);
  const H = Math.max(48, height);
  const step = bars ? W / cap : W / (cap - 1);
  const { a, b } = mapping(domain, H);
  const yOf = (value: number) => a * value + b;
  const xOf = (index: number) => W - (n - 1 - index) * step - (bars ? step / 2 : 0);
  const baseValue = Math.min(Math.max(zeroBased ? 0 : domain.lo, domain.lo), domain.hi);
  const baseY = yOf(baseValue);
  const thresholdY = hasThreshold ? yOf(threshold!) : 0;

  const geometry = React.useMemo(() => {
    if (!W || !n) return null;
    const all = [...lead, ...values];
    const offset = lead.length;
    const xs = all.map((_, j) => xOf(j - offset));
    const ys = all.map(yOf);
    if (bars) {
      const width = Math.max(1, step * 0.62);
      const radius = Math.min(2, width / 2);
      const shapes = all.map((value, j) => {
        const top = Math.min(ys[j], baseY);
        const bottom = Math.max(ys[j], baseY);
        const left = xs[j] - width / 2;
        const r = value >= baseValue ? Math.min(radius, bottom - top) : 0;
        return {
          key: seq - (n - 1 - (j - offset)),
          latest: j === all.length - 1,
          d:
            `M${r2(left)} ${r2(bottom)}V${r2(top + r)}` +
            (r ? `Q${r2(left)} ${r2(top)} ${r2(left + r)} ${r2(top)}` : "") +
            `H${r2(left + width - r)}` +
            (r ? `Q${r2(left + width)} ${r2(top)} ${r2(left + width)} ${r2(top + r)}` : "") +
            `V${r2(bottom)}Z`,
        };
      });
      return { bars: shapes, line: "", area: "", segments: [] as Segment[] };
    }
    const segments: Segment[] = [];
    let tangent = 0;
    let line = `M${r2(xs[0])} ${r2(ys[0])}`;
    for (let j = 0; j < all.length - 1; j++) {
      const slope = (ys[j + 1] - ys[j]) / step;
      let out = tangent;
      if (slope === 0 || out * slope <= 0) out = 0;
      else if (Math.abs(out) > 3 * Math.abs(slope)) out = 3 * slope;
      const into = TENSION * slope;
      const segment = {
        x0: xs[j],
        y0: ys[j],
        c1: ys[j] + (out * step) / 3,
        c2: ys[j + 1] - (into * step) / 3,
        y1: ys[j + 1],
      };
      segments.push(segment);
      line += `C${r2(xs[j] + step / 3)} ${r2(segment.c1)} ${r2(xs[j + 1] - step / 3)} ${r2(segment.c2)} ${r2(xs[j + 1])} ${r2(ys[j + 1])}`;
      tangent = into;
    }
    if (all.length === 1) line += `H${r2(xs[0] - step)}`;
    const area = `${line}L${r2(xs[xs.length - 1])} ${r2(baseY)}L${r2(xs[0])} ${r2(baseY)}Z`;
    return { bars: [], line, area, segments };
  }, [frame, W, H, bars, step]);

  const curveYAt = (x: number) => {
    if (!geometry?.segments.length) return latest !== undefined ? yOf(latest) : 0;
    const { segments } = geometry;
    const j = Math.min(segments.length - 1, Math.max(0, Math.floor((x - segments[0].x0) / step)));
    const t = Math.min(1, Math.max(0, (x - segments[j].x0) / step));
    return bezier(segments[j], t);
  };

  const nearestSeq = (px: number, offset: number) => {
    if (!n || !W) return null;
    const i = Math.max(0, Math.min(n - 1, Math.round((px - offset - xOf(0)) / step)));
    return seq - (n - 1 - i);
  };

  // Measure the plot once per resize; nothing measures per frame.
  React.useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const measure = () => setRowWidth(Math.round(row.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  React.useLayoutEffect(() => {
    if (gutterNeeded > gutterFloor) setGutterFloor(gutterNeeded);
  }, [gutterNeeded, gutterFloor]);

  // Start the glide for a new frame: one compositor animation per layer, then rest.
  React.useLayoutEffect(() => {
    const previous = committedRef.current;
    frameRef.current = frame;
    committedRef.current = { frame, width: W, height: H };
    const root = rootRef.current;
    const changed = previous?.frame !== frame;
    const glide =
      !reduced &&
      changed &&
      !!previous &&
      previous.width === W &&
      previous.height === H &&
      W > 0 &&
      frame.shift > 0;

    const now = performance.now();
    if (changed && frame.shift > 0) {
      const elapsed = (now - cadence.current.at) / frame.shift;
      if (interval) cadence.current.every = interval;
      else if (cadence.current.at && elapsed > 60 && elapsed < 10000)
        cadence.current.every = cadence.current.every * 0.6 + elapsed * 0.4;
      cadence.current.at = now;
    }
    // Slightly longer than the cadence: updates land mid-glide and motion never stalls.
    const duration = Math.min(10000, Math.max(120, cadence.current.every * frame.shift * 1.08));
    root?.style.setProperty("--live-chart-glide", glide ? `${duration}ms` : "0ms");
    if (!glide || !previous) {
      for (const animation of animations.current) animation.cancel();
      animations.current = [];
      return;
    }

    const x = readTransform(seriesRef.current);
    const y = readTransform(scaleRef.current);
    for (const animation of animations.current) animation.cancel();
    animations.current = [];

    const start = x.x + frame.shift * step;
    const before = mapping(previous.frame.domain, H);
    const k = (y.k * before.a) / a;
    const ty = y.y + y.k * before.b - k * b;
    const timing: KeyframeAnimationOptions = { duration, easing: "linear" };
    const slide = [{ transform: `translateX(${start}px)` }, { transform: "translateX(0px)" }];
    // Start on the current frame (not the next one) so the hand-off from the previous glide is seamless.
    const startAt = document.timeline.currentTime;
    const run = (element: Element | null, keyframes: Keyframe[]) => {
      if (!element) return;
      const animation = element.animate(keyframes, timing);
      if (startAt !== null) animation.startTime = startAt;
      animations.current.push(animation);
    };
    run(seriesRef.current, slide);
    run(hoverRef.current, slide);
    if (Math.abs(k - 1) > 1e-4 || Math.abs(ty) > 0.05)
      run(scaleRef.current, [
        { transform: `translateY(${ty}px) scaleY(${k})` },
        { transform: "translateY(0px) scaleY(1)" },
      ]);

    if (!bars && geometry) {
      // The head rides the right edge: sample the curve where it meets the edge over time.
      const path: Keyframe[] = [];
      let crossing = -1;
      const hotAtStart = breached(previous.frame.values[previous.frame.values.length - 1]);
      for (let i = 0; i <= HEAD_SAMPLES; i++) {
        const t = i / HEAD_SAMPLES;
        const rest = curveYAt(W - start * (1 - t));
        path.push({
          transform: `translateY(${r2(ty * (1 - t) + (k + (1 - k) * t) * rest)}px)`,
          offset: t,
        });
        const hot = hasThreshold && (alertWhen === "above" ? rest < thresholdY : rest > thresholdY);
        if (crossing < 0 && hot === breach && hot !== hotAtStart) crossing = t;
      }
      run(headRef.current, path);
      if (hasThreshold && hotAtStart !== breach) {
        const at = Math.max(0, crossing);
        const from = hotAtStart ? 1 : 0;
        // Swap the head's tint at the moment it crosses the limit, not when the sample lands.
        const swap = (value: number): Keyframe[] => [
          { opacity: value, offset: 0 },
          { opacity: value, offset: at },
          { opacity: 1 - value, offset: Math.min(1, at + 0.04) },
          { opacity: 1 - value, offset: 1 },
        ];
        run(hotHeadRef.current, swap(from));
        run(okHeadRef.current, swap(1 - from));
      }
    }

    if (pointerX.current !== null) setHoverSeq(nearestSeq(pointerX.current, start));
  }, [frame, W, H, reduced]);

  React.useEffect(
    () => () => {
      for (const animation of animations.current) animation.cancel();
    },
    [],
  );

  // Screen readers hear a calm summary at most every ten seconds, never every tick.
  const spoken =
    summary && latest !== undefined
      ? `${label}: ${valueFormatter(latest)}${unit ? ` ${unit}` : ""}. Window min ${valueFormatter(summary.min)}, max ${valueFormatter(summary.max)}.${breach ? ` ${alertWhen === "above" ? "Above" : "Below"} ${inline(thresholdLabel)} of ${valueFormatter(threshold!)}.` : ""}`
      : `${label}: waiting for data.`;
  const [announcement, setAnnouncement] = React.useState("");
  const announcedAt = React.useRef(0);
  React.useEffect(() => {
    const now = Date.now();
    if (!announcedAt.current) announcedAt.current = now;
    else if (now - announcedAt.current >= 10000) {
      announcedAt.current = now;
      setAnnouncement(spoken);
    }
  }, [spoken]);

  const hoverIndex = hoverSeq === null ? -1 : hoverSeq - (seq - (n - 1));
  const hovered = hoverIndex >= 0 && hoverIndex < n ? values[hoverIndex] : undefined;
  const hoverX = hovered !== undefined ? xOf(hoverIndex) : 0;

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    if (px < 0 || px > W + 4) {
      pointerX.current = null;
      setHoverSeq(null);
      return;
    }
    pointerX.current = px;
    setHoverSeq(nearestSeq(px, readTransform(seriesRef.current).x));
  };
  const clearPointer = () => {
    pointerX.current = null;
    setHoverSeq(null);
  };

  const glideTransition = "transition-transform duration-(--live-chart-glide) ease-linear motion-reduce:transition-none";
  const strokeWidth = variant === "line" ? 2 : 1.75;
  const hot = "var(--color-destructive)";

  const renderSeries = (paint: string, tone: "ok" | "hot") => {
    if (!geometry) return null;
    if (bars)
      return geometry.bars.map((bar) => (
        <path
          key={bar.key}
          d={bar.d}
          fill={paint}
          className="transition-[fill-opacity] duration-500 motion-reduce:transition-none"
          fillOpacity={bar.latest ? 1 : 0.5}
        />
      ));
    return (
      <>
        {variant === "area" && <path d={geometry.area} fill={`url(#${id}-fill-${tone})`} />}
        <path
          d={geometry.line}
          fill="none"
          stroke={paint}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-[0.12] dark:opacity-25"
          filter={`url(#${id}-blur)`}
        />
        <path
          d={geometry.line}
          fill="none"
          stroke={paint}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    );
  };

  const latestBar = bars && geometry?.bars.length ? geometry.bars[geometry.bars.length - 1] : null;
  const span = interval ? cap * interval : 0;

  return (
    <div
      ref={rootRef}
      data-slot="live-chart"
      data-variant={variant}
      data-breach={breach || undefined}
      className={cn(
        "@container/live-chart flex min-w-0 flex-col rounded-xl border bg-card pb-4 text-card-foreground shadow-xs",
        className,
      )}
      style={style}
      {...props}
    >
      <div className="flex flex-col gap-1 px-5 pt-4">
        <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
          <p className="max-w-full truncate text-sm font-medium text-muted-foreground">{label}</p>
          {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-1">
            <span
              className={cn(
                "text-3xl leading-9 font-semibold tracking-tight tabular-nums transition-colors duration-300 motion-reduce:transition-none",
                breach && "text-destructive",
              )}
            >
              {latest !== undefined ? valueFormatter(latest) : "—"}
            </span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            {breach && (
              <span className="ml-1 inline-flex items-center gap-1 self-center rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
                <AlertTriangle className="size-3" aria-hidden="true" />
                {alertWhen === "above" ? "Above" : "Below"} {inline(thresholdLabel)}
              </span>
            )}
          </div>
          {stats && summary && (
            <dl className="grid grid-cols-4 gap-x-4 pb-1 @md/live-chart:gap-x-5">
              {(
                [
                  ["Min", summary.min],
                  ["Avg", summary.avg],
                  ["Max", summary.max],
                  ["p95", summary.p95],
                ] as const
              ).map(([name, value]) => (
                <div key={name} className="min-w-0">
                  <dt className="text-[11px] leading-4 font-medium text-muted-foreground">
                    {name}
                  </dt>
                  <dd
                    className={cn(
                      "font-mono text-xs leading-4 text-foreground tabular-nums",
                      breached(value) && "text-destructive",
                    )}
                  >
                    {valueFormatter(value)}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>

      <div className="mt-4 px-5">
        <div
          ref={rowRef}
          role="img"
          aria-label={spoken}
          className="relative touch-pan-y select-none"
          style={{ height: H }}
          onPointerMove={handlePointer}
          onPointerDown={handlePointer}
          onPointerLeave={clearPointer}
        >
          {W > 0 && (
            <>
              <div aria-hidden="true" className="absolute inset-y-0 left-0" style={{ width: W }}>
                {ticks.map((tick) => (
                  <div
                    key={tick}
                    className={cn(
                      "absolute inset-x-0 top-0 h-px",
                      glideTransition,
                      tick === baseValue ? "bg-border" : "bg-border/60",
                    )}
                    style={{ transform: `translateY(${r2(yOf(tick))}px)` }}
                  />
                ))}
              </div>

              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_36px)]"
                style={{ width: W }}
              >
                <div ref={seriesRef} className="absolute inset-0 will-change-transform">
                  <div ref={scaleRef} className="absolute inset-0 origin-top-left">
                    <svg width={W} height={H} className="absolute inset-0 overflow-visible">
                      <defs>
                        <linearGradient id={`${id}-fill-ok`} gradientUnits="userSpaceOnUse" x1="0" y1={PAD_TOP} x2="0" y2={H}>
                          <stop offset="0" stopColor={color} stopOpacity="0.26" />
                          <stop offset="1" stopColor={color} stopOpacity="0.01" />
                        </linearGradient>
                        <linearGradient id={`${id}-fill-hot`} gradientUnits="userSpaceOnUse" x1="0" y1={PAD_TOP} x2="0" y2={H}>
                          <stop offset="0" stopColor={hot} stopOpacity="0.28" />
                          <stop offset="1" stopColor={hot} stopOpacity="0.02" />
                        </linearGradient>
                        <filter id={`${id}-blur`} x="-10%" y="-50%" width="120%" height="200%">
                          <feGaussianBlur stdDeviation="3" />
                        </filter>
                        {hasThreshold && (
                          <>
                            <clipPath id={`${id}-hot`}>
                              {alertWhen === "above" ? (
                                <rect x={-1e4} y={-1e4} width={2e4} height={1e4 + thresholdY} />
                              ) : (
                                <rect x={-1e4} y={thresholdY} width={2e4} height={2e4} />
                              )}
                            </clipPath>
                            <clipPath id={`${id}-ok`}>
                              {alertWhen === "above" ? (
                                <rect x={-1e4} y={thresholdY} width={2e4} height={2e4} />
                              ) : (
                                <rect x={-1e4} y={-1e4} width={2e4} height={1e4 + thresholdY} />
                              )}
                            </clipPath>
                          </>
                        )}
                      </defs>
                      {latestBar && (
                        <path
                          d={latestBar.d}
                          fill={breach ? hot : color}
                          filter={`url(#${id}-blur)`}
                          className="opacity-40 dark:opacity-60"
                        />
                      )}
                      {hasThreshold ? (
                        <>
                          <g clipPath={`url(#${id}-ok)`}>{renderSeries(color, "ok")}</g>
                          <g clipPath={`url(#${id}-hot)`}>{renderSeries(hot, "hot")}</g>
                        </>
                      ) : (
                        renderSeries(color, "ok")
                      )}
                    </svg>
                  </div>
                </div>
              </div>

              {hasThreshold && (
                <div
                  aria-hidden="true"
                  className={cn("pointer-events-none absolute top-0 left-0", glideTransition)}
                  style={{ width: W, transform: `translateY(${r2(thresholdY)}px)` }}
                >
                  <div className="border-t border-dashed border-destructive/55" />
                  <span className="absolute bottom-1 left-0 rounded-sm bg-card/85 px-1 font-mono text-[10px] leading-4 text-destructive">
                    {thresholdLabel} {valueFormatter(threshold!)}
                  </span>
                </div>
              )}

              <div ref={hoverRef} aria-hidden="true" className="pointer-events-none absolute inset-0 will-change-transform">
                {hovered !== undefined && (
                  <>
                    {bars ? (
                      <div
                        className="absolute inset-y-0 -translate-x-1/2 rounded-sm bg-foreground/[0.06]"
                        style={{ left: r2(hoverX), width: r2(Math.max(4, step * 0.92)) }}
                      />
                    ) : (
                      <div className="absolute inset-y-0 w-px bg-foreground/25" style={{ left: r2(hoverX) }} />
                    )}
                    <div
                      className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card shadow-sm"
                      style={{
                        left: r2(hoverX),
                        top: r2(yOf(hovered)),
                        background: breached(hovered) ? hot : color,
                      }}
                    />
                    <div
                      className={cn(
                        "absolute top-0 rounded-md border bg-popover px-2 py-1 whitespace-nowrap text-popover-foreground shadow-md",
                        hoverX > W * 0.6 ? "-translate-x-full" : "",
                      )}
                      style={{ left: r2(hoverX + (hoverX > W * 0.6 ? -8 : 8)) }}
                    >
                      <span className="block font-mono text-xs font-medium tabular-nums">
                        {valueFormatter(hovered)}
                        {unit && <span className="ml-1 font-sans font-normal text-muted-foreground">{unit}</span>}
                      </span>
                      <span className="block text-[10px] leading-3 text-muted-foreground">
                        {interval
                          ? formatAgo((seq - hoverSeq!) * interval)
                          : seq === hoverSeq
                            ? "Latest sample"
                            : `${seq - hoverSeq!} samples ago`}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {!bars && latest !== undefined && (
                <div
                  ref={headRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 z-10"
                  style={{ left: W, transform: `translateY(${r2(yOf(latest))}px)` }}
                >
                  <div ref={okHeadRef} className="absolute top-0 left-0" style={{ opacity: breach ? 0 : 1 }}>
                    <HeadDot color={color} />
                  </div>
                  {hasThreshold && (
                    <div ref={hotHeadRef} className="absolute top-0 left-0" style={{ opacity: breach ? 1 : 0 }}>
                      <HeadDot color={hot} />
                    </div>
                  )}
                </div>
              )}

              <div aria-hidden="true" className="absolute inset-y-0 right-0" style={{ width: gutter }}>
                {ticks.map((tick, i) => (
                  <span
                    key={tick}
                    className={cn(
                      "absolute top-0 right-0 font-mono text-[10px] leading-none text-muted-foreground tabular-nums",
                      glideTransition,
                    )}
                    style={{ transform: `translateY(calc(${r2(yOf(tick))}px - 50%))` }}
                  >
                    {tickLabels[i]}
                  </span>
                ))}
              </div>
            </>
          )}
          {W > 0 && !n && (
            <p className="absolute inset-0 grid place-items-center text-xs text-muted-foreground" style={{ right: gutter }}>
              Waiting for data…
            </p>
          )}
        </div>
        {span > 0 && W > 0 && (
          <div aria-hidden="true" className="relative mt-2 h-3 font-mono text-[10px] leading-3 text-muted-foreground" style={{ width: W }}>
            <span className="absolute left-0">{formatSpan(span)}</span>
            <span className="absolute left-1/2 -translate-x-1/2">{formatSpan(span / 2)}</span>
            <span className="absolute right-0">now</span>
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}

function HeadDot({ color }: { color: string }) {
  return (
    <div className="absolute top-0 left-0" style={{ color }}>
      <span className="absolute -top-2 -left-2 size-4 animate-ping rounded-full bg-current opacity-35 [animation-duration:2.4s] motion-reduce:hidden" />
      <span className="absolute -top-[5px] -left-[5px] size-2.5 rounded-full border-2 border-card bg-current shadow-[0_0_0_3px_color-mix(in_oklab,currentColor_22%,transparent),0_0_14px_1px_currentColor]" />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* useLiveSeries                                                             */
/* ------------------------------------------------------------------------ */

export interface UseLiveSeriesOptions {
  /** Starting window, oldest first. */
  initial: number[];
  /** Produce the next sample from the latest one. */
  next: (last: number) => number;
  /** Milliseconds between samples. */
  interval?: number;
  /** Window length. Defaults to `initial.length`. */
  length?: number;
  paused?: boolean;
}

/** A rolling window that appends one sample per interval and pauses while the tab is hidden. */
export function useLiveSeries({
  initial,
  next,
  interval = 1000,
  length,
  paused = false,
}: UseLiveSeriesOptions) {
  const size = Math.max(2, length ?? initial.length);
  const [series, setSeries] = React.useState(() => initial.slice(-size));
  const seriesRef = React.useRef(series);
  const nextRef = React.useRef(next);
  React.useEffect(() => {
    nextRef.current = next;
  });

  React.useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const current = seriesRef.current;
      const value = nextRef.current(current.length ? current[current.length - 1] : 0);
      const updated = current.slice(Math.max(0, current.length - size + 1));
      updated.push(value);
      seriesRef.current = updated;
      setSeries(updated);
    }, interval);
    return () => window.clearInterval(timer);
  }, [interval, size, paused]);

  return series;
}
