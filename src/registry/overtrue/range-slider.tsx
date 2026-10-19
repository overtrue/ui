"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

/** One number for a single thumb, or a [low, high] pair for two. */
export type RangeSliderValue = number | [number, number];

/** 0 is the only thumb, or the lower one; 1 is the upper thumb. */
export type RangeSliderThumb = 0 | 1;

export type RangeSliderSource = "pointer" | "keyboard" | "input" | "mark";

export interface RangeSliderMark {
  value: number;
  /** Text under the track. Defaults to `formatValue(value)`; pass null for a tick without a label. */
  label?: React.ReactNode;
}

export interface RangeSliderChangeDetails {
  /** The thumb that moved. */
  thumb: RangeSliderThumb;
  /** What moved it. */
  source: RangeSliderSource;
}

export interface RangeSliderLabels {
  /** Name of the lower thumb and its input. */
  minimum: string;
  /** Name of the upper thumb and its input. */
  maximum: string;
  /** Name of a single thumb when there is no `label`. */
  value: string;
}

/** Callbacks always receive a plain number or a [number, number] pair. */
type Widen<T> = T extends readonly number[] ? [number, number] : number;

export interface RangeSliderProps<
  T extends RangeSliderValue = number,
> extends Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "children"
> {
  /** Controlled value. A number draws one thumb, a [low, high] pair draws two. */
  value?: T;
  /** Initial value when uncontrolled. Defaults to `min`. */
  defaultValue?: T;
  /** Called on every change while dragging, typing, or pressing keys. */
  onValueChange?: (value: Widen<T>, details: RangeSliderChangeDetails) => void;
  /** Called once a change is final: on pointer release, after each key press, and when an input commits. */
  onValueCommit?: (value: Widen<T>, details: RangeSliderChangeDetails) => void;
  /** Lowest value. Defaults to 0. */
  min?: number;
  /** Highest value. Defaults to 100. */
  max?: number;
  /** Granularity of values. Defaults to 1. */
  step?: number;
  /** Page Up, Page Down, and Shift with an arrow move this far. Defaults to 10 steps. */
  largeStep?: number;
  /** Smallest gap kept between the two thumbs, in value units. Defaults to 0. */
  minDistance?: number;
  /** Ticks on the track with labels under it. Numbers are labelled with `formatValue`. */
  marks?: ReadonlyArray<number | RangeSliderMark>;
  /** Only allow mark values; arrow keys jump from mark to mark. */
  snapToMarks?: boolean;
  /** Counts for equal-width buckets spanning min to max, drawn above the track. */
  histogram?: readonly number[];
  /** Raw samples bucketed into a histogram for you. Ignored when `histogram` is set. */
  values?: readonly number[];
  /** Bucket count for `values`. Defaults to 40, or one per step when that is fewer. */
  bins?: number;
  /** Histogram height in pixels. Defaults to 56. */
  histogramHeight?: number;
  /** Formats values for tooltips, aria-valuetext, and mark labels. */
  formatValue?: (value: number, thumb: RangeSliderThumb) => string;
  /** When value tooltips show: while dragging or keyboard focused, always, or never. Defaults to "auto". */
  tooltip?: "auto" | "always" | "never";
  /** Linked number inputs. */
  showInputs?: boolean;
  /** Inputs under the track, or one compact input at the end of the track. Defaults to below for two thumbs and end for one. */
  inputPlacement?: "below" | "end";
  /** Quiet text before the number in inputs, such as "$". */
  inputPrefix?: React.ReactNode;
  /** Quiet text after the number in inputs, such as "%". */
  inputSuffix?: React.ReactNode;
  /** What the slider sets, such as "Price". Names the group and both thumbs. */
  label?: string;
  /** Exact accessible names for the thumbs, overriding the ones built from `label`. */
  thumbLabels?: string | [string, string];
  labels?: Partial<RangeSliderLabels>;
  /** BCP 47 locale for the default number format. */
  locale?: string;
  /** "sm" is a 16px thumb on a 4px track for tables and toolbars. */
  size?: "sm" | "default";
  disabled?: boolean;
  /** Adds hidden form inputs: `name`, or `name[min]` and `name[max]`. */
  name?: string;
  trackClassName?: string;
  thumbClassName?: string;
}

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));

function decimals(value: number) {
  if (!Number.isFinite(value)) return 0;
  const text = String(value);
  const exponent = /e-(\d+)$/.exec(text);
  if (exponent) return Number(exponent[1]);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

const roundTo = (value: number, places: number) =>
  Number(value.toFixed(Math.min(places, 12)));

/**
 * Counts samples into `bins` equal-width buckets from min to max. Samples
 * outside the range fall into the first or last bucket.
 */
export function bucketValues(
  values: readonly number[],
  { min, max, bins }: { min: number; max: number; bins: number },
): number[] {
  const count = Math.max(1, Math.floor(bins));
  const counts = new Array<number>(count).fill(0);
  const span = max - min;
  if (!(span > 0)) return counts;
  for (const value of values) {
    if (!Number.isFinite(value)) continue;
    const index = Math.floor(((value - min) / span) * count);
    counts[clamp(index, 0, count - 1)] += 1;
  }
  return counts;
}

/** How many samples fall inside an inclusive range, or at or below a single value. */
export function countInRange(
  values: readonly number[],
  range: RangeSliderValue,
): number {
  const [low, high] = Array.isArray(range)
    ? [Math.min(...range), Math.max(...range)]
    : [-Infinity, range];
  let count = 0;
  for (const value of values) if (value >= low && value <= high) count += 1;
  return count;
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const defaultLabels: RangeSliderLabels = {
  minimum: "Minimum",
  maximum: "Maximum",
  value: "Value",
};

const SIZES = {
  default: {
    thumb: 20,
    row: 36,
    track: 6,
    gap: 6,
    thumbClass: "size-5",
    trackClass: "h-1.5",
    haloClass: "-inset-2",
    tickClass: "size-1",
  },
  sm: {
    thumb: 16,
    row: 28,
    track: 4,
    gap: 4,
    thumbClass: "size-4",
    trackClass: "h-1",
    haloClass: "-inset-1.5",
    tickClass: "size-[3px]",
  },
} as const;

const styles = `@keyframes range-slider-rise{from{transform:scaleY(0)}}@keyframes range-slider-tip{from{opacity:0;transform:translateY(3px) scale(.96)}}`;

/* ------------------------------------------------------------------------ */
/* Linked input                                                              */
/* ------------------------------------------------------------------------ */

function parseNumber(text: string) {
  const cleaned = text.replace(/[^\d.\-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === ".") return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function SliderInput({
  value,
  label,
  caption,
  prefix,
  suffix,
  format,
  compact,
  disabled,
  onCommit,
  onStep,
}: {
  value: number;
  label: string;
  caption?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  format: (value: number) => string;
  compact: boolean;
  disabled: boolean;
  onCommit: (value: number) => void;
  onStep: (direction: 1 | -1, large: boolean) => void;
}) {
  const [draft, setDraft] = React.useState<string | null>(null);
  const commitDraft = () => {
    if (draft === null) return;
    const parsed = parseNumber(draft);
    setDraft(null);
    if (parsed !== null) onCommit(parsed);
  };
  return (
    <label
      data-slot="range-slider-input"
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "flex min-w-0 cursor-text rounded-lg border border-input bg-card text-foreground shadow-xs transition-[border-color,box-shadow] duration-150 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/25 motion-reduce:transition-none",
        "data-disabled:cursor-not-allowed data-disabled:bg-muted data-disabled:shadow-none",
        compact
          ? "h-8 w-[5.5rem] items-center gap-1 px-2.5"
          : "flex-1 flex-col justify-center gap-0.5 rounded-xl px-3 py-2",
      )}
    >
      {caption && (
        <span className="text-[11px] leading-4 text-muted-foreground">
          {caption}
        </span>
      )}
      <span className="flex min-w-0 flex-1 items-baseline gap-1">
        {prefix && (
          <span className="shrink-0 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          aria-label={label}
          disabled={disabled}
          value={draft ?? format(value)}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={(event) => event.currentTarget.select()}
          onBlur={commitDraft}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitDraft();
            } else if (event.key === "Escape" && draft !== null) {
              event.preventDefault();
              setDraft(null);
            } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              event.preventDefault();
              setDraft(null);
              onStep(event.key === "ArrowUp" ? 1 : -1, event.shiftKey);
            }
          }}
          className={cn(
            "w-full min-w-0 bg-transparent text-sm font-medium tabular-nums outline-none disabled:cursor-not-allowed",
            compact && "text-end",
          )}
        />
        {suffix && (
          <span className="shrink-0 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </span>
    </label>
  );
}

/* ------------------------------------------------------------------------ */
/* Range slider                                                              */
/* ------------------------------------------------------------------------ */

/**
 * A numeric slider with one or two thumbs, an optional distribution histogram
 * that lights up inside the selection, marks, value tooltips, and linked inputs.
 */
export function RangeSlider<T extends RangeSliderValue = number>({
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  largeStep,
  minDistance = 0,
  marks,
  snapToMarks = false,
  histogram,
  values: samples,
  bins,
  histogramHeight = 56,
  formatValue,
  tooltip = "auto",
  showInputs = false,
  inputPlacement,
  inputPrefix,
  inputSuffix,
  label,
  thumbLabels,
  labels: labelsProp,
  locale,
  size = "default",
  disabled = false,
  name,
  trackClassName,
  thumbClassName,
  className,
  style,
  ...props
}: RangeSliderProps<T>) {
  const labels = { ...defaultLabels, ...labelsProp };
  const S = SIZES[size];
  const inset = S.thumb / 2;
  const span = max - min;
  const precision = Math.max(decimals(step), decimals(min));

  /* Value ------------------------------------------------------------------ */

  const [inner, setInner] = React.useState<RangeSliderValue>(
    () => (defaultValue as RangeSliderValue | undefined) ?? min,
  );
  const raw = (valueProp as RangeSliderValue | undefined) ?? inner;
  const isRange = Array.isArray(raw);
  const current: number[] = isRange
    ? [
        clamp(Math.min(raw[0], raw[1]), min, max),
        clamp(Math.max(raw[0], raw[1]), min, max),
      ]
    : [clamp(raw as number, min, max)];
  const latest = React.useRef(current);
  latest.current = current;

  const markList = React.useMemo(
    () =>
      (marks ?? [])
        .map((mark) => (typeof mark === "number" ? { value: mark } : mark))
        .filter((mark) => mark.value >= min && mark.value <= max)
        .sort((a, b) => a.value - b.value),
    [marks, min, max],
  );

  const numberFormat = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, { maximumFractionDigits: precision }),
    [locale, precision],
  );
  const format = (value: number, thumb: RangeSliderThumb) =>
    formatValue ? formatValue(value, thumb) : numberFormat.format(value);

  const snap = (value: number) => {
    if (snapToMarks && markList.length) {
      let best = markList[0].value;
      for (const mark of markList)
        if (Math.abs(mark.value - value) < Math.abs(best - value))
          best = mark.value;
      return best;
    }
    const stepped =
      step > 0 ? min + Math.round((value - min) / step) * step : value;
    return clamp(roundTo(stepped, precision), min, max);
  };

  const toOut = (list: number[]) =>
    (list.length === 2 ? [list[0], list[1]] : list[0]) as Widen<T>;

  /** Moves one thumb, keeping order and the minimum distance. Returns whether anything changed. */
  const setThumb = (
    thumb: RangeSliderThumb,
    next: number,
    source: RangeSliderSource,
  ) => {
    const list = [...latest.current];
    let value = snap(next);
    if (list.length === 2) {
      value =
        thumb === 0
          ? Math.min(value, list[1] - minDistance)
          : Math.max(value, list[0] + minDistance);
      value = clamp(roundTo(value, precision), min, max);
    }
    if (list[thumb] === value) return false;
    list[thumb] = value;
    latest.current = list;
    const out = toOut(list);
    if (valueProp === undefined) setInner(out as RangeSliderValue);
    onValueChange?.(out, { thumb, source });
    return true;
  };
  const commit = (thumb: RangeSliderThumb, source: RangeSliderSource) =>
    onValueCommit?.(toOut(latest.current), { thumb, source });

  const pct = (value: number) => (span > 0 ? (value - min) / span : 0);
  /** Thumb centers stay inside the track, so knobs line up with its ends. */
  const pos = (fraction: number) =>
    `calc(${inset}px + (100% - ${inset * 2}px) * ${fraction})`;
  const p0 = pct(current[0]);
  const p1 = isRange ? pct(current[1]) : p0;

  /* Measurement ------------------------------------------------------------ */

  const controlRef = React.useRef<HTMLDivElement>(null);
  const thumbRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const tipRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [width, setWidth] = React.useState(0);
  const [merged, setMerged] = React.useState(false);

  useIsoLayoutEffect(() => {
    const element = controlRef.current;
    if (!element) return;
    setWidth(element.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setWidth(element.clientWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  /** CSS translate that centers a box on x but keeps it inside the slider. */
  const keepInside = (x: number) =>
    width > 0
      ? `clamp(${-x}px, -50%, calc(${width - x}px - 100%))`
      : "-50%";
  const xOf = (fraction: number) => inset + (width - inset * 2) * fraction;

  /* Interaction ------------------------------------------------------------ */

  const drag = React.useRef<{
    pointerId: number;
    thumb: RangeSliderThumb | null;
    offset: number;
    startX: number;
    changed: boolean;
  } | null>(null);
  const [pressed, setPressed] = React.useState<RangeSliderThumb | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [focusVisible, setFocusVisible] =
    React.useState<RangeSliderThumb | null>(null);
  const [top, setTop] = React.useState<RangeSliderThumb>(1);

  // Focus moved by a pointer never shows the keyboard ring or tooltip, even
  // when the browser would carry focus-visible over from earlier key presses.
  const pointerFocus = React.useRef(false);
  const focusThumb = (thumb: RangeSliderThumb, fromPointer = false) => {
    pointerFocus.current = fromPointer;
    thumbRefs.current[thumb]?.focus({ preventScroll: true });
    pointerFocus.current = false;
  };

  const geometry = () => {
    const rect = controlRef.current!.getBoundingClientRect();
    const usable = rect.width - inset * 2;
    return {
      valueAt: (clientX: number) =>
        min +
        (usable > 0 ? clamp((clientX - rect.left - inset) / usable, 0, 1) : 0) *
          span,
      xAt: (thumb: RangeSliderThumb) =>
        rect.left + inset + usable * pct(latest.current[thumb]),
    };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0 || !controlRef.current) return;
    event.preventDefault();
    const { valueAt, xAt } = geometry();
    const list = latest.current;
    const onThumb = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-thumb-index]",
    );
    const x = event.clientX;
    let thumb: RangeSliderThumb | null = 0;
    let offset = 0;
    const together = list.length === 2 && xAt(0) === xAt(1);
    if (onThumb) {
      thumb = Number(onThumb.dataset.thumbIndex) as RangeSliderThumb;
      offset = x - xAt(thumb);
      // Stacked thumbs: wait for the first movement to pick one.
      if (together) thumb = null;
    } else if (list.length === 2) {
      if (together) thumb = x < xAt(0) ? 0 : x > xAt(1) ? 1 : null;
      else thumb = Math.abs(x - xAt(0)) <= Math.abs(x - xAt(1)) ? 0 : 1;
    }
    let changed = false;
    // A click on the track jumps the nearest thumb there, with a short glide.
    if (thumb !== null && !onThumb) changed = setThumb(thumb, valueAt(x), "pointer");
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, thumb, offset, startX: x, changed };
    const focus = thumb ?? top;
    setPressed(focus);
    setTop(focus);
    setFocusVisible(null);
    focusThumb(focus, true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    if (state.thumb === null) {
      const dx = event.clientX - state.startX;
      if (Math.abs(dx) < 2) return;
      state.thumb = dx < 0 ? 0 : 1;
      setPressed(state.thumb);
      setTop(state.thumb);
      focusThumb(state.thumb, true);
    }
    setDragging(true);
    const { valueAt } = geometry();
    if (setThumb(state.thumb, valueAt(event.clientX - state.offset), "pointer"))
      state.changed = true;
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    setPressed(null);
    if (state.changed && state.thumb !== null) commit(state.thumb, "pointer");
  };

  const pointerHandlers = disabled
    ? {}
    : {
        onPointerDown,
        onPointerMove,
        onPointerUp: onPointerEnd,
        onPointerCancel: onPointerEnd,
        onLostPointerCapture: onPointerEnd,
      };

  const big = largeStep ?? step * 10;
  const stepFrom = (value: number, direction: 1 | -1, amount: number) => {
    if (snapToMarks && markList.length) {
      const list = markList.map((mark) => mark.value);
      const next =
        direction > 0
          ? list.find((mark) => mark > value + 1e-9)
          : [...list].reverse().find((mark) => mark < value - 1e-9);
      return next ?? value;
    }
    return value + direction * amount;
  };

  const onThumbKeyDown = (
    thumb: RangeSliderThumb,
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (disabled) return;
    const value = latest.current[thumb];
    let next: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = stepFrom(value, 1, event.shiftKey ? big : step);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = stepFrom(value, -1, event.shiftKey ? big : step);
        break;
      case "PageUp":
        next = stepFrom(value, 1, big);
        break;
      case "PageDown":
        next = stepFrom(value, -1, big);
        break;
      case "Home":
        next = min;
        break;
      case "End":
        next = max;
        break;
      default:
        return;
    }
    event.preventDefault();
    setFocusVisible(thumb);
    setTop(thumb);
    if (setThumb(thumb, next, "keyboard")) commit(thumb, "keyboard");
  };

  /* Tooltips --------------------------------------------------------------- */

  const tipVisible = (thumb: RangeSliderThumb) =>
    tooltip === "always" ||
    (tooltip === "auto" && (pressed === thumb || focusVisible === thumb));
  const bothVisible = isRange && tipVisible(0) && tipVisible(1);

  useIsoLayoutEffect(() => {
    if (!isRange || tooltip === "never") return;
    const [a, b] = tipRefs.current;
    const next =
      !!a &&
      !!b &&
      xOf(p1) - xOf(p0) < (a.offsetWidth + b.offsetWidth) / 2 + 6;
    setMerged((previous) => (previous === next ? previous : next));
  });

  const showMerged = bothVisible && merged;

  // Mark labels that would collide are hidden, keeping the first and last.
  const markRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const [crowded, setCrowded] = React.useState("");
  useIsoLayoutEffect(() => {
    if (!markList.length || !width) return;
    const boxes = markList.flatMap((mark, index) => {
      const element = markRefs.current[index];
      if (!element || mark.label === null) return [];
      const w = element.offsetWidth;
      const left = clamp(xOf(pct(mark.value)) - w / 2, 0, Math.max(0, width - w));
      return [{ index, left, right: left + w }];
    });
    const gap = 6;
    const hidden = new Set<number>();
    const kept: typeof boxes = [];
    for (const box of boxes) {
      const previous = kept[kept.length - 1];
      if (previous && box.left < previous.right + gap) hidden.add(box.index);
      else kept.push(box);
    }
    const last = boxes[boxes.length - 1];
    if (last && hidden.has(last.index)) {
      hidden.delete(last.index);
      while (kept.length > 1 && kept[kept.length - 1].right + gap > last.left)
        hidden.add(kept.pop()!.index);
    }
    const next = [...hidden].sort((a, b) => a - b).join(",");
    setCrowded((previous) => (previous === next ? previous : next));
  });
  const crowdedSet = new Set(crowded ? crowded.split(",").map(Number) : []);
  const glide = !dragging && "transition-[left,right] duration-150 ease-out motion-reduce:transition-none";

  /* Histogram -------------------------------------------------------------- */

  const buckets = React.useMemo(() => {
    if (histogram) return histogram;
    if (!samples) return null;
    const perStep = step > 0 ? Math.round(span / step) : 40;
    return bucketValues(samples, {
      min,
      max,
      bins: bins ?? clamp(perStep, 1, 40),
    });
  }, [histogram, samples, bins, min, max, step, span]);
  const peak = buckets ? Math.max(0, ...buckets) : 0;
  const barGap = buckets && width && width / buckets.length < 8 ? 1 : 2;
  const histogramOverlap = S.row / 2 - S.track / 2 - S.gap;
  const lowFraction = isRange ? p0 : 0;
  const highFraction = p1;

  /* Names ------------------------------------------------------------------ */

  const thumbName = (thumb: RangeSliderThumb) => {
    if (typeof thumbLabels === "string") return thumbLabels;
    if (thumbLabels) return thumbLabels[thumb];
    if (!isRange) return label ?? labels.value;
    const edge = thumb === 0 ? labels.minimum : labels.maximum;
    return label ? `${label} ${edge.toLowerCase()}` : edge;
  };

  const inputsAtEnd =
    showInputs && (inputPlacement ?? (isRange ? "below" : "end")) === "end";
  const inputsBelow = showInputs && !inputsAtEnd;
  const inputFormat = (value: number) => numberFormat.format(value);
  const stepInput = (thumb: RangeSliderThumb, direction: 1 | -1, large: boolean) => {
    if (
      setThumb(
        thumb,
        stepFrom(latest.current[thumb], direction, large ? big : step),
        "input",
      )
    )
      commit(thumb, "input");
  };
  const commitInput = (thumb: RangeSliderThumb, value: number) => {
    if (setThumb(thumb, value, "input")) commit(thumb, "input");
  };

  /* Render ----------------------------------------------------------------- */

  return (
    <div
      data-slot="range-slider"
      data-disabled={disabled ? "" : undefined}
      data-dragging={dragging ? "" : undefined}
      data-orientation="horizontal"
      role={isRange ? "group" : undefined}
      aria-label={isRange ? label : undefined}
      className={cn(
        "relative grid w-full min-w-0",
        inputsAtEnd
          ? "grid-cols-[minmax(0,1fr)_auto] gap-x-4"
          : "grid-cols-[minmax(0,1fr)]",
        disabled && "opacity-55",
        className,
      )}
      style={style}
      {...props}
    >
      <style href="overtrue-range-slider" precedence="default">
        {styles}
      </style>

      {buckets && (
        <div
          data-slot="range-slider-histogram"
          aria-hidden="true"
          className={cn(
            "relative col-start-1 row-start-1 touch-none select-none",
            !disabled && "cursor-pointer",
          )}
          style={{
            height: histogramHeight,
            marginBottom: -histogramOverlap,
            paddingInline: inset,
          }}
          {...pointerHandlers}
        >
          <div className="relative h-full">
            {buckets.map((count, index) => {
              const n = buckets.length;
              const a = index / n;
              const b = (index + 1) / n;
              const start = clamp((lowFraction - a) / (b - a), 0, 1);
              const end = clamp((highFraction - a) / (b - a), 0, 1);
              const state =
                end <= start ? "out" : start <= 0 && end >= 1 ? "in" : "partial";
              const height = peak > 0 && count > 0 ? (count / peak) * 100 : 0;
              const g = barGap;
              return (
                <div
                  key={index}
                  data-slot="range-slider-bar"
                  data-state={state}
                  className="absolute bottom-0 origin-bottom rounded-t-[3px] transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:animate-[range-slider-rise_700ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:transition-none"
                  style={{
                    left: `calc(${a * 100}% + ${g / 2}px)`,
                    width: `calc(${100 / n}% - ${g}px)`,
                    height: height ? `max(2px, ${height}%)` : 0,
                    animationDelay: `${Math.round(index * (360 / n))}ms`,
                  }}
                >
                  <span className="absolute inset-0 rounded-[inherit] bg-foreground/[0.10] dark:bg-foreground/[0.13]" />
                  <span
                    className={cn(
                      "absolute inset-0 rounded-[inherit] bg-[linear-gradient(to_bottom,var(--color-primary),color-mix(in_oklab,var(--color-primary)_72%,transparent))]",
                      !dragging &&
                        "transition-[clip-path] duration-150 ease-out motion-reduce:transition-none",
                    )}
                    style={{
                      // Lit share of the bucket, measured in bucket space so the edge meets the thumb exactly.
                      clipPath: `inset(0 calc(100% - ${end} * (100% + ${g}px) + ${g / 2}px) 0 calc(${start} * (100% + ${g}px) - ${g / 2}px))`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        ref={controlRef}
        data-slot="range-slider-control"
        className={cn(
          "relative z-10 col-start-1 touch-none select-none",
          buckets ? "row-start-2" : "row-start-1",
          !disabled && "cursor-pointer data-dragging:cursor-grabbing",
        )}
        data-dragging={dragging ? "" : undefined}
        style={{ height: S.row }}
        {...pointerHandlers}
      >
        <div
          data-slot="range-slider-track"
          className={cn(
            "absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.09] dark:bg-foreground/[0.12]",
            S.trackClass,
            trackClassName,
          )}
        >
          <div
            data-slot="range-slider-range"
            className={cn(
              "absolute inset-y-0 rounded-full bg-primary dark:shadow-[0_0_10px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]",
              glide,
            )}
            style={{
              left: isRange ? pos(p0) : 0,
              right: pos(1 - p1),
            }}
          />
          {markList.map((mark) => {
            const inRange = isRange
              ? mark.value >= current[0] && mark.value <= current[1]
              : mark.value <= current[0];
            return (
              <span
                key={mark.value}
                aria-hidden="true"
                data-slot="range-slider-tick"
                data-in-range={inRange ? "" : undefined}
                className={cn(
                  "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-150 motion-reduce:transition-none",
                  S.tickClass,
                  inRange ? "bg-primary-foreground/75" : "bg-foreground/25",
                )}
                style={{ left: pos(pct(mark.value)) }}
              />
            );
          })}
        </div>

        {current.map((value, index) => {
          const thumb = index as RangeSliderThumb;
          const fraction = thumb === 0 ? p0 : p1;
          const low = isRange && thumb === 1 ? current[0] + minDistance : min;
          const high = isRange && thumb === 0 ? current[1] - minDistance : max;
          const active = pressed === thumb;
          return (
            <div
              key={thumb}
              ref={(element) => {
                thumbRefs.current[thumb] = element;
              }}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-label={thumbName(thumb)}
              aria-valuemin={roundTo(Math.min(low, value), precision)}
              aria-valuemax={roundTo(Math.max(high, value), precision)}
              aria-valuenow={value}
              aria-valuetext={format(value, thumb)}
              aria-orientation="horizontal"
              aria-disabled={disabled || undefined}
              data-slot="range-slider-thumb"
              data-thumb-index={thumb}
              data-state={active ? "active" : "idle"}
              data-focus-visible={focusVisible === thumb ? "" : undefined}
              onKeyDown={(event) => onThumbKeyDown(thumb, event)}
              onFocus={(event) => {
                setTop(thumb);
                if (pointerFocus.current) return;
                let visible = false;
                try {
                  visible = event.currentTarget.matches(":focus-visible");
                } catch {
                  visible = false;
                }
                if (visible) setFocusVisible(thumb);
              }}
              onBlur={() =>
                setFocusVisible((previous) =>
                  previous === thumb ? null : previous,
                )
              }
              className={cn(
                "group/thumb absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none",
                S.thumbClass,
                !disabled && (active ? "cursor-grabbing" : "cursor-grab"),
                active ? "z-30" : top === thumb ? "z-20" : "z-10",
                glide,
                thumbClassName,
              )}
              style={{ left: pos(fraction) }}
            >
              <span
                aria-hidden="true"
                data-slot="range-slider-halo"
                className={cn(
                  "pointer-events-none absolute scale-50 rounded-full bg-primary opacity-0 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
                  S.haloClass,
                  !disabled &&
                    "group-hover/thumb:scale-100 group-hover/thumb:opacity-[0.12] group-data-focus-visible/thumb:scale-100 group-data-focus-visible/thumb:opacity-[0.16] group-data-[state=active]/thumb:scale-110 group-data-[state=active]/thumb:opacity-[0.18]",
                )}
              />
              <span
                aria-hidden="true"
                data-slot="range-slider-knob"
                className={cn(
                  "absolute inset-0 rounded-full border-2 border-primary bg-card shadow-[0_1px_2px_rgb(0_0_0/0.12),0_2px_6px_-1px_rgb(0_0_0/0.14)] transition-[transform,box-shadow] duration-150 ease-out dark:bg-foreground dark:shadow-[0_0_0_1px_rgb(0_0_0/0.3),0_2px_8px_rgb(0_0_0/0.5)] motion-reduce:transition-none",
                  !disabled &&
                    "group-hover/thumb:scale-110 group-data-focus-visible/thumb:scale-110 group-data-focus-visible/thumb:ring-2 group-data-focus-visible/thumb:ring-ring/50 group-data-[state=active]/thumb:scale-115",
                  disabled && "border-muted-foreground/60",
                )}
              />
            </div>
          );
        })}

        {tooltip !== "never" &&
          current.map((value, index) => {
            const thumb = index as RangeSliderThumb;
            const fraction = thumb === 0 ? p0 : p1;
            const open = tipVisible(thumb) && !showMerged;
            return (
              <Tip
                key={thumb}
                tipRef={(element) => {
                  tipRefs.current[thumb] = element;
                }}
                open={open}
                left={pos(fraction)}
                translate={keepInside(xOf(fraction))}
                bottom={inset + 12}
                className={glide || undefined}
              >
                {format(value, thumb)}
              </Tip>
            );
          })}
        {tooltip !== "never" && isRange && (
          <Tip
            open={showMerged}
            left={pos((p0 + p1) / 2)}
            translate={keepInside(xOf((p0 + p1) / 2))}
            bottom={inset + 12}
            className={glide || undefined}
          >
            {current[0] === current[1]
              ? format(current[0], 0)
              : `${format(current[0], 0)} – ${format(current[1], 1)}`}
          </Tip>
        )}
      </div>

      {inputsAtEnd && (
        <div
          className={cn(
            "col-start-2 flex items-center",
            buckets ? "row-start-2" : "row-start-1",
          )}
          style={{ height: S.row }}
        >
          <SliderInput
            value={current[0]}
            label={thumbName(0)}
            prefix={inputPrefix}
            suffix={inputSuffix}
            format={inputFormat}
            compact
            disabled={disabled}
            onCommit={(value) => commitInput(0, value)}
            onStep={(direction, large) => stepInput(0, direction, large)}
          />
        </div>
      )}

      {markList.length > 0 && (
        <div
          data-slot="range-slider-marks"
          aria-hidden="true"
          className={cn(
            "relative col-start-1 h-4 text-[11px] leading-4 text-muted-foreground tabular-nums",
            buckets ? "row-start-3" : "row-start-2",
            size === "sm" ? "-mt-0.5" : "-mt-1",
          )}
        >
          {markList.map((mark, index) => {
            if (mark.label === null) return null;
            const fraction = pct(mark.value);
            const active = current.includes(mark.value);
            const hidden = crowdedSet.has(index);
            return (
              <span
                key={mark.value}
                ref={(element) => {
                  markRefs.current[index] = element;
                }}
                data-slot="range-slider-mark"
                data-active={active ? "" : undefined}
                data-hidden={hidden ? "" : undefined}
                onPointerDown={(event) => {
                  if (disabled || event.button !== 0) return;
                  event.preventDefault();
                  const list = latest.current;
                  const thumb: RangeSliderThumb =
                    list.length === 2 &&
                    Math.abs(mark.value - list[1]) < Math.abs(mark.value - list[0])
                      ? 1
                      : list.length === 2 &&
                          list[0] === list[1] &&
                          mark.value > list[1]
                        ? 1
                        : 0;
                  setTop(thumb);
                  setFocusVisible(null);
                  focusThumb(thumb, true);
                  if (setThumb(thumb, mark.value, "mark")) commit(thumb, "mark");
                }}
                className={cn(
                  "absolute top-0 whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none",
                  hidden && "invisible",
                  active && "font-medium text-foreground",
                  !disabled && "cursor-pointer hover:text-foreground",
                )}
                style={{
                  left: pos(fraction),
                  translate: `${keepInside(xOf(fraction))} 0`,
                }}
              >
                {mark.label ?? format(mark.value, 0)}
              </span>
            );
          })}
        </div>
      )}

      {inputsBelow && (
        <div
          data-slot="range-slider-inputs"
          className={cn(
            "col-span-full flex items-center gap-3",
            markList.length ? "mt-3" : "mt-2",
          )}
        >
          {current.map((value, index) => {
            const thumb = index as RangeSliderThumb;
            return (
              <React.Fragment key={thumb}>
                {thumb === 1 && (
                  <span
                    aria-hidden="true"
                    className="h-px w-3 shrink-0 bg-border"
                  />
                )}
                <SliderInput
                  value={value}
                  label={thumbName(thumb)}
                  caption={
                    isRange
                      ? thumb === 0
                        ? labels.minimum
                        : labels.maximum
                      : (label ?? labels.value)
                  }
                  prefix={inputPrefix}
                  suffix={inputSuffix}
                  format={inputFormat}
                  compact={false}
                  disabled={disabled}
                  onCommit={(next) => commitInput(thumb, next)}
                  onStep={(direction, large) =>
                    stepInput(thumb, direction, large)
                  }
                />
              </React.Fragment>
            );
          })}
        </div>
      )}

      {name &&
        (isRange ? (
          <>
            <input type="hidden" name={`${name}[min]`} value={current[0]} />
            <input type="hidden" name={`${name}[max]`} value={current[1]} />
          </>
        ) : (
          <input type="hidden" name={name} value={current[0]} />
        ))}
    </div>
  );
}

function Tip({
  open,
  left,
  translate,
  bottom,
  className,
  tipRef,
  children,
}: {
  open: boolean;
  left: string;
  translate: string;
  bottom: number;
  className?: string;
  tipRef?: (element: HTMLDivElement | null) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute z-40 w-0", className)}
      style={{ left, bottom: `calc(50% + ${bottom}px)` }}
    >
      <div
        ref={tipRef}
        data-slot="range-slider-tooltip"
        data-state={open ? "open" : "closed"}
        className={cn(
          "absolute bottom-0 left-0 w-max rounded-lg border border-border/70 bg-popover/90 px-2 py-1 text-xs leading-4 font-medium whitespace-nowrap text-popover-foreground tabular-nums shadow-lg backdrop-blur-md",
          "transition-[opacity,visibility] duration-150 motion-reduce:transition-none",
          open
            ? "visible opacity-100 motion-safe:animate-[range-slider-tip_150ms_ease-out]"
            : "invisible opacity-0",
        )}
        style={{ translate: `${translate} 0` }}
      >
        {children}
      </div>
    </div>
  );
}
