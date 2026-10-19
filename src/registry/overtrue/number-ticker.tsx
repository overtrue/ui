"use client";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type NumberTickerFormat = "number" | "currency" | "percent" | "compact";

export interface NumberTickerProps extends Omit<
  ComponentProps<"span">,
  "children" | "prefix"
> {
  value: number;
  /** Preset Intl options. Percent expects a fraction: 0.124 renders 12.4%. */
  format?: NumberTickerFormat;
  /** Merged over the preset, e.g. `{ maximumFractionDigits: 0 }`. */
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
  /** ISO 4217 code used by the currency preset. */
  currency?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Roll duration in milliseconds. */
  duration?: number;
  /** Tint the number briefly: emerald when it rises, red when it falls. */
  highlightChanges?: boolean;
  /** Roll up from zero on first mount instead of rendering the value directly. */
  animateOnMount?: boolean;
}

// Each column is a wheel of five 0–9 runs. It rests in the middle run, so two
// rapid changes in either direction can always roll forward or backward.
const CELLS = 50;
const REST = 20;
const STAGGER = 32;
const MAX_STAGGER = 224;
const SLIDE_EASE = "cubic-bezier(0.2, 1, 0.32, 1)";
// Overshoot scales with distance, so longer rolls get a gentler curve: every
// wheel settles past its digit by about a tenth of a cell, whatever it travelled.
const SETTLE = [1.534, 1.368, 1.3, 1.262, 1.236, 1.217, 1.203, 1.191, 1.181];
const rollEase = (cells: number) =>
  `cubic-bezier(0.2, ${SETTLE[Math.min(Math.max(Math.abs(cells), 1), 9) - 1]}, 0.32, 1)`;
const SIZE_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

const presets: Record<
  NumberTickerFormat,
  (currency: string) => Intl.NumberFormatOptions
> = {
  number: () => ({}),
  currency: (currency) => ({ style: "currency", currency }),
  percent: () => ({
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }),
  compact: () => ({ notation: "compact", maximumSignificantDigits: 3 }),
};

interface TickerFormatter {
  format: Intl.NumberFormat;
  /** The locale's digit glyphs, so Arabic-Indic or Devanagari numerals roll too. */
  glyphs: string[];
  /** One padded cell per wheel position, created once and shared by every column. */
  cells: ReactNode[];
}

const formatterCache = new Map<string, TickerFormatter>();

function resolveOptions(
  format: NumberTickerFormat,
  currency: string,
  overrides: Intl.NumberFormatOptions | undefined,
): Intl.NumberFormatOptions {
  const options = { ...presets[format](currency), ...overrides };
  // Keep a preset's fixed precision from conflicting with a partial override.
  const { minimumFractionDigits: min, maximumFractionDigits: max } = options;
  if (min !== undefined && max !== undefined && min > max) {
    if (overrides?.maximumFractionDigits !== undefined)
      options.minimumFractionDigits = max;
    else options.maximumFractionDigits = min;
  }
  return options;
}

function getFormatter(
  locale: string,
  options: Intl.NumberFormatOptions,
): TickerFormatter {
  const key = `${locale}|${JSON.stringify(options)}`;
  let entry = formatterCache.get(key);
  if (!entry) {
    let format: Intl.NumberFormat;
    try {
      format = new Intl.NumberFormat(locale, options);
    } catch {
      format = new Intl.NumberFormat("en-US");
    }
    const digits = new Intl.NumberFormat(format.resolvedOptions().locale, {
      useGrouping: false,
      numberingSystem: format.resolvedOptions().numberingSystem,
    } as Intl.NumberFormatOptions);
    const glyphs = Array.from({ length: 10 }, (_, digit) =>
      digits.format(digit),
    );
    const cells = Array.from({ length: CELLS }, (_, cell) => (
      <span key={cell} className="block py-(--ticker-gap)">
        {glyphs[cell % 10]}
      </span>
    ));
    entry = { format, glyphs, cells };
    formatterCache.set(key, entry);
  }
  return entry;
}

type Slot =
  | { key: string; kind: "digit"; digit: number; order: number }
  | { key: string; kind: "char"; char: string };

type Item = Slot & { phase: "idle" | "enter" | "exit" };

/**
 * Split a formatted number into keyed slots. Integer digits are keyed by place
 * value and fraction digits by position, so the ones column stays the ones
 * column when 999 becomes 1,000 and only the new leading columns enter.
 */
function toSlots(value: number, formatter: TickerFormatter) {
  if (!Number.isFinite(value)) {
    return {
      text: "—",
      slots: [{ key: "missing", kind: "char", char: "—" }] as Slot[],
    };
  }
  const parts = formatter.format.formatToParts(value);
  const isDigit = (char: string) => formatter.glyphs.includes(char);
  let integerDigits = 0;
  for (const part of parts)
    if (part.type === "integer")
      for (const char of part.value) if (isDigit(char)) integerDigits++;

  const slots: Slot[] = [];
  const seen = new Map<string, number>();
  let integerIndex = 0;
  let fractionIndex = 0;
  const pushChar = (type: string, char: string) => {
    const count = seen.get(type) ?? 0;
    seen.set(type, count + 1);
    slots.push({ key: `${type}${count}:${char}`, kind: "char", char });
  };
  for (const part of parts) {
    if (part.type === "integer" || part.type === "fraction") {
      for (const char of part.value) {
        const digit = formatter.glyphs.indexOf(char);
        if (digit < 0) pushChar(part.type, char);
        else if (part.type === "integer")
          slots.push({
            key: `i${integerDigits - 1 - integerIndex++}`,
            kind: "digit",
            digit,
            order: 0,
          });
        else
          slots.push({
            key: `f${fractionIndex++}`,
            kind: "digit",
            digit,
            order: 0,
          });
      }
    } else if (part.type === "group") {
      slots.push({
        key: `g${integerDigits - integerIndex}:${part.value}`,
        kind: "char",
        char: part.value,
      });
    } else {
      pushChar(part.type, part.value);
    }
  }
  // Stagger from the rightmost digit outward, like a carry moving left.
  let order = 0;
  for (let i = slots.length - 1; i >= 0; i--) {
    const slot = slots[i];
    if (slot.kind === "digit") slots[i] = { ...slot, order: order++ };
  }
  return { text: parts.map((part) => part.value).join(""), slots };
}

/** Keep removed slots in place for one transition so they can collapse out. */
function mergeSlots(previous: Item[], next: Slot[], animate: boolean): Item[] {
  const previousKeys = new Set(previous.map((item) => item.key));
  const live: Item[] = next.map((slot) => ({
    ...slot,
    phase: animate && !previousKeys.has(slot.key) ? "enter" : "idle",
  }));
  if (!animate) return live;
  const nextKeys = new Set(next.map((slot) => slot.key));
  const leadingExits = new Map<string, Item[]>();
  let pending: Item[] = [];
  for (const item of previous) {
    if (nextKeys.has(item.key)) {
      if (pending.length) leadingExits.set(item.key, pending);
      pending = [];
    } else if (item.phase !== "exit") {
      pending.push({ ...item, phase: "exit" });
    }
  }
  const merged: Item[] = [];
  for (const item of live) {
    const exits = leadingExits.get(item.key);
    if (exits) merged.push(...exits);
    merged.push(item);
  }
  return merged.concat(pending);
}

function zeroed(slots: Slot[]): Slot[] {
  return slots.map((slot) =>
    slot.kind === "digit" ? { ...slot, digit: 0 } : slot,
  );
}

interface TickerState {
  signature: string;
  value: number;
  items: Item[];
  direction: number;
  flash: "up" | "down" | null;
  version: number;
}

/** An odometer-style number: each digit rolls on its own wheel when `value` changes. */
export function NumberTicker({
  value,
  format = "number",
  formatOptions,
  locale = "en-US",
  currency = "USD",
  prefix,
  suffix,
  duration = 800,
  highlightChanges = false,
  animateOnMount = false,
  className,
  ...props
}: NumberTickerProps) {
  const reduced = usePrefersReducedMotion();
  const optionsKey = JSON.stringify(formatOptions ?? null);
  const formatter = useMemo(
    () => getFormatter(locale, resolveOptions(format, currency, formatOptions)),
    // formatOptions is compared by content so inline objects stay cheap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, format, currency, optionsKey],
  );
  const { text, slots } = useMemo(
    () => toSlots(value, formatter),
    [value, formatter],
  );

  const [armed, setArmed] = useState(!animateOnMount);
  const shown = armed ? slots : zeroed(slots);
  const signature = (armed ? "" : "0|") + shown.map(slotKey).join("|");
  const shownValue = armed ? value : 0;

  const [state, setState] = useState<TickerState>(() => ({
    signature,
    value: shownValue,
    items: shown.map((slot) => ({ ...slot, phase: "idle" })),
    direction: 0,
    flash: null,
    version: 0,
  }));
  if (state.signature !== signature) {
    const direction = Math.sign(shownValue - state.value);
    // The first roll up from zero is an entrance, not a change worth tinting.
    const entrance = state.signature.startsWith("0|");
    setState({
      signature,
      value: shownValue,
      items: mergeSlots(state.items, shown, !reduced),
      direction,
      flash:
        highlightChanges && !entrance && direction !== 0
          ? direction > 0
            ? "up"
            : "down"
          : null,
      version: state.version + 1,
    });
  }

  // Roll up from zero after the first paint (or settle at once without motion).
  useLayoutEffect(() => {
    if (armed) return;
    if (reduced) {
      setArmed(true);
      return;
    }
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setArmed(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [armed, reduced]);

  // Drop collapsed slots and fade the tint once the roll has settled.
  const { version } = state;
  const hasExits = state.items.some((item) => item.phase === "exit");
  useEffect(() => {
    if (!hasExits) return;
    const timer = window.setTimeout(
      () =>
        setState((current) =>
          current.version === version
            ? {
                ...current,
                items: current.items.filter((item) => item.phase !== "exit"),
              }
            : current,
        ),
      duration + MAX_STAGGER,
    );
    return () => window.clearTimeout(timer);
  }, [version, hasExits, duration]);
  const flashing = state.flash !== null;
  useEffect(() => {
    if (!flashing) return;
    const timer = window.setTimeout(
      () =>
        setState((current) =>
          current.version === version ? { ...current, flash: null } : current,
        ),
      Math.max(360, duration * 0.75),
    );
    return () => window.clearTimeout(timer);
  }, [version, flashing, duration]);

  const animate = !reduced;
  return (
    <span
      data-slot="number-ticker"
      data-direction={
        state.direction > 0 ? "up" : state.direction < 0 ? "down" : undefined
      }
      className={cn("inline-block whitespace-nowrap tabular-nums", className)}
      {...props}
    >
      {prefix}
      <span className="sr-only">{text}</span>
      {/* Digits always run left to right, even inside right-to-left text. */}
      <span
        aria-hidden="true"
        dir="ltr"
        data-slot="number-ticker-value"
        className={cn(
          "transition-colors motion-reduce:transition-none",
          state.flash === "up" && "text-emerald-700 dark:text-emerald-400",
          state.flash === "down" && "text-red-600 dark:text-red-400",
        )}
        style={{ transitionDuration: state.flash ? "140ms" : "900ms" }}
      >
        {state.items.map((item) => (
          <TickerSlot
            key={item.key}
            item={item}
            direction={state.direction}
            formatter={formatter}
            duration={duration}
            animate={animate}
          />
        ))}
      </span>
      {suffix}
    </span>
  );
}

function slotKey(slot: Slot) {
  return slot.kind === "digit" ? `${slot.key}=${slot.digit}` : slot.key;
}

function TickerSlot({
  item,
  direction,
  formatter,
  duration,
  animate,
}: {
  item: Item;
  direction: number;
  formatter: TickerFormatter;
  duration: number;
  animate: boolean;
}) {
  // New slots mount collapsed, then open on the next frame so the change transitions.
  const [open, setOpen] = useState(item.phase !== "enter" || !animate);
  useEffect(() => {
    if (open) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setOpen(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [open]);

  const collapsed = !open || item.phase === "exit";
  const travel = direction < 0 ? -1 : 1;
  const offset = item.phase === "exit" ? -travel : travel;
  const delay =
    item.kind === "digit" ? Math.min(item.order * STAGGER, MAX_STAGGER) : 0;
  const style: CSSProperties = {
    gridTemplateColumns: collapsed ? "0fr" : "1fr",
    opacity: collapsed ? 0 : 1,
    transform: collapsed ? `translateY(${offset * 0.42}em)` : undefined,
    transition: animate
      ? `grid-template-columns ${duration * 0.7}ms ${SIZE_EASE}, opacity ${duration * 0.5}ms ease, transform ${duration}ms ${SLIDE_EASE}`
      : "none",
  };
  return (
    <span className="inline-grid" style={style} data-phase={item.phase}>
      <span className="min-w-0 [clip-path:inset(-50%_0)]">
        {item.kind === "digit" ? (
          <DigitWheel
            digit={item.digit}
            direction={direction}
            formatter={formatter}
            duration={duration}
            delay={delay}
            animate={animate}
          />
        ) : (
          <span className="whitespace-pre">{item.char}</span>
        )}
      </span>
    </span>
  );
}

function DigitWheel({
  digit,
  direction,
  formatter,
  duration,
  delay,
  animate,
}: {
  digit: number;
  direction: number;
  formatter: TickerFormatter;
  duration: number;
  delay: number;
  animate: boolean;
}) {
  const [wheel, setWheel] = useState({
    digit,
    cell: REST + digit,
    travel: 0,
    rolling: false,
  });
  if (wheel.digit !== digit) {
    // Roll forward when the value rises and backward when it falls, wrapping
    // through 9 → 0 the way a mechanical counter carries.
    const forward = (digit - wheel.digit + 10) % 10;
    const backward = (wheel.digit - digit + 10) % 10;
    const step =
      direction > 0
        ? forward
        : direction < 0
          ? -backward
          : forward <= backward
            ? forward
            : -backward;
    let cell = wheel.cell + step;
    if (cell < 0 || cell >= CELLS) cell = REST + digit;
    setWheel(
      animate
        ? { digit, cell, travel: cell - wheel.cell, rolling: true }
        : { digit, cell: REST + digit, travel: 0, rolling: false },
    );
  }

  // Once settled, jump back to the matching cell in the middle run (same glyph).
  useEffect(() => {
    if (!wheel.rolling) return;
    const timer = window.setTimeout(
      () =>
        setWheel((current) => ({
          digit: current.digit,
          cell: REST + current.digit,
          travel: 0,
          rolling: false,
        })),
      duration + delay + 40,
    );
    return () => window.clearTimeout(timer);
  }, [wheel, duration, delay]);

  // Cells carry --ticker-gap of padding above and below, and the clipping window
  // reaches that far past the line box. At rest only padding shows in the
  // overhang; while rolling, neighbors fade through it like a real wheel.
  return (
    <span className="relative inline-block [--ticker-gap:0.2em]">
      <span className="invisible">{formatter.glyphs[digit]}</span>
      <span className="absolute inset-x-0 -inset-y-(--ticker-gap) overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_var(--ticker-gap),#000_calc(100%_-_var(--ticker-gap)),transparent)]">
        <span
          className="absolute inset-x-0 top-0 flex flex-col text-center"
          style={{
            transform: `translateY(${(-wheel.cell * 100) / CELLS}%)`,
            transition: wheel.rolling
              ? `transform ${duration}ms ${rollEase(wheel.travel)} ${delay}ms`
              : "none",
            willChange: wheel.rolling ? "transform" : undefined,
          }}
        >
          {formatter.cells}
        </span>
      </span>
    </span>
  );
}
