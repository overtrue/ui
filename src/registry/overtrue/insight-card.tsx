"use client";

import * as React from "react";
import {
  IconAlertTriangle as AlertTriangle,
  IconArrowDownRight as ArrowDownRight,
  IconArrowUpRight as ArrowUpRight,
  IconCheck as Check,
  IconCopy as Copy,
  IconPlayerStopFilled as Stop,
  IconRefresh as Refresh,
  IconSparkles as Sparkles,
  IconThumbDown as ThumbDown,
  IconThumbDownFilled as ThumbDownFilled,
  IconThumbUp as ThumbUp,
  IconThumbUpFilled as ThumbUpFilled,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export type InsightStatus =
  "idle" | "thinking" | "streaming" | "done" | "error";
export type InsightTone = "positive" | "negative" | "neutral";
export type InsightFeedback = "up" | "down" | null;

/**
 * An inline token parsed from `{{kind:arg|arg|arg}}`.
 * Built in: `{{metric:Label|+12.8%}}`, `{{metric:Churn|-0.4 pts|positive}}`, `{{cite:1}}`.
 */
export interface InsightToken {
  /** The word before the colon, e.g. "metric" or "cite". */
  kind: string;
  /** First argument: the metric label or the source number / id. */
  label: string;
  /** Second argument: the metric value. */
  value?: string;
  /** Third argument when it is positive, negative or neutral; otherwise inferred from the value's sign. */
  tone: InsightTone;
  /** Which way the value moved, from its sign: drives the arrow, while tone drives the colour. */
  direction: "up" | "down" | "flat";
  /** Every argument after the colon, trimmed. */
  args: string[];
  /** The original markup. */
  raw: string;
}

export type InsightSegment = string | InsightToken;

export interface InsightSource {
  id: string;
  label: string;
  href?: string;
}

export interface InsightCardLabels {
  thinking: string;
  streaming: string;
  idle: string;
  generate: string;
  regenerate: string;
  stop: string;
  copy: string;
  copied: string;
  helpful: string;
  notHelpful: string;
  sources: string;
  feedback: string;
  error: string;
  retry: string;
}

export interface InsightCardColors {
  /** Caret, sparkle and the moving border. */
  accent?: string;
  /** Second stop of the moving border. */
  glow?: string;
  positive?: string;
  negative?: string;
}

export interface InsightCardProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "children" | "onCopy"
> {
  title?: React.ReactNode;
  /** Model, dataset or time range, shown at the top right. */
  source?: React.ReactNode;
  /** Replaces the sparkle. */
  icon?: React.ReactNode;
  /** The insight, with optional `{{kind:arg|arg}}` tokens. Append to it while streaming. */
  text?: string;
  /** Shorthand for `status="streaming"` while you append to `text`. */
  streaming?: boolean;
  /** Defaults to streaming, done or idle from `streaming`, `text` and `stream`. */
  status?: InsightStatus;
  /** Consumed internally; drives thinking, streaming, done and error. Pass a new iterable to regenerate. */
  stream?: AsyncIterable<string>;
  /** Message for the error state. */
  error?: React.ReactNode;
  sources?: InsightSource[];
  /** Shows Regenerate, and Try again in the error state. */
  onRegenerate?: () => void;
  /** Shows Stop while thinking or streaming. */
  onStop?: () => void;
  /** Called with the plain text. Without it, Copy writes to the clipboard. */
  onCopy?: (text: string) => void;
  feedback?: InsightFeedback;
  defaultFeedback?: InsightFeedback;
  onFeedback?: (feedback: InsightFeedback) => void;
  /** Render a token yourself. Return `undefined` to keep the built-in rendering. */
  renderToken?: (
    token: InsightToken,
    index: number,
  ) => React.ReactNode | undefined;
  /** Replace the token parser. */
  parse?: (text: string) => InsightSegment[];
  /** Characters per second for revealing new text. 0 shows it immediately. */
  speed?: number;
  /** Called once streamed text has fully revealed. */
  onStreamEnd?: () => void;
  /** Extra buttons after Copy. */
  actions?: React.ReactNode;
  colors?: InsightCardColors;
  labels?: Partial<InsightCardLabels>;
}

const LABELS: InsightCardLabels = {
  thinking: "Thinking…",
  streaming: "Writing…",
  idle: "No insight yet.",
  generate: "Generate",
  regenerate: "Regenerate",
  stop: "Stop",
  copy: "Copy",
  copied: "Copied",
  helpful: "Helpful",
  notHelpful: "Not helpful",
  sources: "Sources",
  feedback: "Feedback",
  error: "Couldn’t generate this insight.",
  retry: "Try again",
};

const TOKEN = /\{\{\s*([A-Za-z][\w-]*)\s*:([^{}]*?)\}\}/g;
const TONES = new Set<string>(["positive", "negative", "neutral"]);

function direction(value: string | undefined): InsightToken["direction"] {
  const sign = value?.trim()[0];
  if (sign === "+" || sign === "↑") return "up";
  if (sign === "-" || sign === "−" || sign === "↓") return "down";
  return "flat";
}

/** Split text into strings and tokens. A token cut off at the end is dropped while it streams in. */
export function parseInsight(text: string): InsightSegment[] {
  const segments: InsightSegment[] = [];
  let from = 0;
  for (const match of text.matchAll(TOKEN)) {
    if (match.index > from) segments.push(text.slice(from, match.index));
    const args = match[2].split("|").map((arg) => arg.trim());
    const [label = "", value, third] = args;
    const moved = direction(value);
    segments.push({
      kind: match[1].toLowerCase(),
      label,
      value,
      direction: moved,
      tone:
        third && TONES.has(third)
          ? (third as InsightTone)
          : moved === "up"
            ? "positive"
            : moved === "down"
              ? "negative"
              : "neutral",
      args,
      raw: match[0],
    });
    from = match.index + match[0].length;
  }
  let rest = text.slice(from);
  const open = rest.lastIndexOf("{{");
  if (open !== -1 && !rest.includes("}}", open)) rest = rest.slice(0, open);
  if (rest) segments.push(rest);
  return segments;
}

/** Plain text for copying and screen readers: metrics read "Revenue +12.8%", citations "[1]". */
export function insightToPlainText(
  text: string,
  parse: (text: string) => InsightSegment[] = parseInsight,
) {
  return parse(text)
    .map((segment) =>
      typeof segment === "string"
        ? segment
        : segment.kind === "cite"
          ? `[${segment.label}]`
          : [segment.label, segment.value].filter(Boolean).join(" "),
    )
    .join("")
    .trim();
}

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-card";

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const REDUCED = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return React.useSyncExternalStore(
    (callback) => {
      const query = window.matchMedia(REDUCED);
      query.addEventListener("change", callback);
      return () => query.removeEventListener("change", callback);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

// One reader per iterable, so StrictMode's double effects and remounts share progress.
interface StreamSession {
  text: string;
  status: "thinking" | "streaming" | "done" | "error";
  error?: unknown;
  listeners: Set<() => void>;
  stop: () => void;
}
const sessions = new WeakMap<AsyncIterable<string>, StreamSession>();

function openSession(stream: AsyncIterable<string>) {
  const existing = sessions.get(stream);
  if (existing) return existing;
  const iterator = stream[Symbol.asyncIterator]();
  let stopped = false;
  const session: StreamSession = {
    text: "",
    status: "thinking",
    listeners: new Set(),
    stop: () => {
      if (stopped) return;
      stopped = true;
      if (session.status === "thinking" || session.status === "streaming")
        session.status = "done";
      void iterator.return?.();
    },
  };
  const emit = () => session.listeners.forEach((listener) => listener());
  sessions.set(stream, session);
  void (async () => {
    try {
      while (!stopped) {
        const result = await iterator.next();
        if (stopped) return;
        if (result.done) break;
        session.text += String(result.value ?? "");
        session.status = "streaming";
        emit();
      }
      if (!stopped) {
        session.status = "done";
        emit();
      }
    } catch (error) {
      if (stopped) return;
      session.status = "error";
      session.error = error;
      emit();
    }
  })();
  return session;
}

function useStreamSession(stream: AsyncIterable<string> | undefined) {
  const [, rerender] = React.useReducer((count: number) => count + 1, 0);
  React.useEffect(() => {
    if (!stream) return;
    const session = openSession(stream);
    session.listeners.add(rerender);
    rerender();
    return () => {
      session.listeners.delete(rerender);
      // Stop reading only if nothing resubscribed (StrictMode remounts immediately).
      window.setTimeout(() => {
        if (!session.listeners.size) session.stop();
      }, 0);
    };
  }, [stream]);
  return stream ? (sessions.get(stream) ?? null) : null;
}

/** Move a reveal position past a whole token so chips appear complete. */
function snap(text: string, position: number) {
  const open = text.lastIndexOf("{{", position - 1);
  if (open === -1) return position;
  const close = text.indexOf("}}", open);
  if (close === -1) return open;
  return close + 2 > position ? close + 2 : position;
}

function useReveal(text: string, animate: boolean, speed: number) {
  const [shown, setShown] = React.useState(() => (animate ? 0 : text.length));
  const shownRef = React.useRef(shown);
  const previous = React.useRef(text);

  useIsoLayoutEffect(() => {
    const set = (value: number) => {
      shownRef.current = value;
      setShown(value);
    };
    let start = shownRef.current;
    // Replaced rather than appended: start over.
    if (!text.startsWith(previous.current.slice(0, start))) start = 0;
    previous.current = text;
    if (!animate || !(speed > 0) || !Number.isFinite(speed))
      start = text.length;
    start = Math.min(start, text.length);
    set(start);
    if (start >= text.length) return;

    let frame = 0;
    let last = performance.now();
    let carry = start;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      // Catch up when the source runs ahead, so the reveal never lags by more than ~2s.
      const backlog = text.length - carry;
      carry = Math.min(
        text.length,
        carry + (speed * Math.max(1, backlog / (speed * 2)) * dt) / 1000,
      );
      const next = snap(text, Math.floor(carry));
      if (next > shownRef.current) set(next);
      // Wait for the rest of a half-received token before going on.
      if (next < Math.floor(carry)) return;
      if (next < text.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, animate, speed]);

  return Math.min(shown, text.length);
}

const toneClass: Record<InsightTone, string> = {
  positive:
    "border-(--insight-positive)/25 bg-(--insight-positive)/8 [--chip:var(--insight-positive)]",
  negative:
    "border-(--insight-negative)/25 bg-(--insight-negative)/8 [--chip:var(--insight-negative)]",
  neutral: "border-border bg-muted/60 [--chip:var(--color-muted-foreground)]",
};

function MetricChip({ token }: { token: InsightToken }) {
  const Arrow =
    token.direction === "up"
      ? ArrowUpRight
      : token.direction === "down"
        ? ArrowDownRight
        : null;
  return (
    <span
      data-slot="insight-token"
      data-kind="metric"
      data-tone={token.tone}
      className={cn(
        "mx-px inline-flex translate-y-[-1px] items-center gap-1 rounded-md border px-1.5 align-middle text-[12.5px] leading-5 whitespace-nowrap",
        "transition-[opacity,scale] duration-300 ease-out starting:scale-90 starting:opacity-0 motion-reduce:transition-none",
        toneClass[token.tone],
      )}
    >
      {token.label && (
        <span className="font-medium text-foreground">{token.label}</span>
      )}
      {token.value && (
        <span className="inline-flex items-center gap-0.5 font-mono text-[12px] font-medium text-[color-mix(in_oklab,var(--chip)_82%,var(--color-foreground))] tabular-nums">
          {Arrow && (
            <Arrow className="size-3" aria-hidden="true" stroke={2.25} />
          )}
          {token.value}
        </span>
      )}
    </span>
  );
}

const styles = `@property --insight-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes insight-spin{to{--insight-angle:360deg}}@keyframes insight-shimmer{from{background-position:100% 0}to{background-position:-100% 0}}@keyframes insight-caret{0%,50%{opacity:1}50.01%,100%{opacity:0}}`;

const ring =
  "conic-gradient(from var(--insight-angle), transparent 0%, var(--insight-accent) 12%, var(--insight-glow) 22%, transparent 34%, transparent 50%, var(--insight-glow) 62%, var(--insight-accent) 72%, transparent 84%)";

const ringMask: React.CSSProperties = {
  padding: 1,
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
};

/**
 * An AI summary for dashboards: streams text with a caret, turns `{{metric:…}}` markup
 * into delta chips, cites numbered sources, and offers regenerate, copy and feedback.
 */
export function InsightCard({
  title = "Insight",
  source,
  icon,
  text = "",
  streaming,
  status: statusProp,
  stream,
  error,
  sources,
  onRegenerate,
  onStop,
  onCopy,
  feedback: feedbackProp,
  defaultFeedback = null,
  onFeedback,
  renderToken,
  parse = parseInsight,
  speed = 90,
  onStreamEnd,
  actions,
  colors,
  labels: labelsProp,
  className,
  style,
  ...props
}: InsightCardProps) {
  const labels = { ...LABELS, ...labelsProp };
  const reduced = useReducedMotion();
  const session = useStreamSession(stream);

  const fullText = stream ? (session?.text ?? "") : text;
  const sourceStatus: InsightStatus = stream
    ? (statusProp ?? session?.status ?? "thinking")
    : (statusProp ?? (streaming ? "streaming" : text ? "done" : "idle"));
  const active = sourceStatus === "thinking" || sourceStatus === "streaming";

  const [feedbackState, setFeedbackState] =
    React.useState<InsightFeedback>(defaultFeedback);
  const feedback = feedbackProp !== undefined ? feedbackProp : feedbackState;

  // "Live" spans one generation: from thinking/streaming until the reveal catches up.
  const [live, setLive] = React.useState(active);
  if (active && !live) {
    setLive(true);
    // Feedback belongs to the previous answer.
    setFeedbackState(null);
  }

  // Hold the reveal while thinking, so text supplied early still streams in afterwards.
  const revealText = sourceStatus === "thinking" ? "" : fullText;
  const shown = useReveal(revealText, live && !reduced, speed);
  const revealing = shown < revealText.length;
  const status: InsightStatus =
    sourceStatus === "error"
      ? "error"
      : sourceStatus === "thinking"
        ? "thinking"
        : sourceStatus === "streaming" || (live && revealing)
          ? "streaming"
          : fullText
            ? "done"
            : "idle";

  const onStreamEndRef = React.useRef(onStreamEnd);
  onStreamEndRef.current = onStreamEnd;
  React.useEffect(() => {
    if (live && !active && !revealing) {
      setLive(false);
      if (sourceStatus === "done") onStreamEndRef.current?.();
    }
  }, [live, active, revealing, sourceStatus]);

  const setFeedback = (value: InsightFeedback) => {
    const next = value === feedback ? null : value;
    if (feedbackProp === undefined) setFeedbackState(next);
    onFeedback?.(next);
  };

  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const [hoveredSource, setHoveredSource] = React.useState<string | null>(null);

  const plain = React.useMemo(
    () => insightToPlainText(fullText, parse),
    [fullText, parse],
  );
  const visible =
    shown >= fullText.length ? fullText : fullText.slice(0, shown);
  const segments = React.useMemo(() => parse(visible), [parse, visible]);

  const copy = async () => {
    if (onCopy) onCopy(plain);
    else {
      try {
        await navigator.clipboard?.writeText(plain);
      } catch {
        return;
      }
    }
    setCopied(true);
  };

  const findSource = (ref: string) => {
    if (!sources) return undefined;
    const index = /^\d+$/.test(ref)
      ? Number(ref) - 1
      : sources.findIndex((item) => item.id === ref);
    return index >= 0 && index < sources.length
      ? { source: sources[index], number: index + 1 }
      : undefined;
  };

  const renderSegment = (
    segment: InsightSegment,
    index: number,
  ): React.ReactNode => {
    if (typeof segment === "string") return segment;
    const custom = renderToken?.(segment, index);
    if (custom !== undefined) return custom;
    if (segment.kind === "metric") return <MetricChip token={segment} />;
    if (segment.kind === "cite") {
      const found = findSource(segment.label);
      const number = found?.number ?? segment.label;
      const chip = cn(
        "mx-px inline-flex h-4 min-w-4 -translate-y-px items-center justify-center rounded-[4px] bg-muted px-1 align-middle font-mono text-[10px] leading-none font-medium text-muted-foreground transition-colors",
        "transition-[opacity,background-color,color] duration-300 starting:opacity-0 motion-reduce:transition-none",
      );
      const highlight = {
        onPointerEnter: () => found && setHoveredSource(found.source.id),
        onPointerLeave: () => setHoveredSource(null),
        onFocus: () => found && setHoveredSource(found.source.id),
        onBlur: () => setHoveredSource(null),
      };
      return found?.source.href ? (
        <a
          data-slot="insight-token"
          data-kind="cite"
          href={found.source.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${labels.sources} ${number}: ${found.source.label}`}
          className={cn(
            chip,
            "hover:bg-(--insight-accent)/12 hover:text-(--insight-accent)",
            focusRing,
          )}
          {...highlight}
        >
          {number}
        </a>
      ) : (
        <span
          data-slot="insight-token"
          data-kind="cite"
          title={found?.source.label}
          className={cn(
            chip,
            found &&
              "cursor-default hover:bg-(--insight-accent)/12 hover:text-(--insight-accent)",
          )}
          {...highlight}
        >
          {number}
        </span>
      );
    }
    return (
      <span
        data-slot="insight-token"
        data-kind={segment.kind}
        className="font-medium"
      >
        {segment.label}
      </span>
    );
  };

  // Paragraphs on blank lines, line breaks on single newlines. A paragraph made only
  // of tokens becomes a row of highlights.
  const paragraphs: { nodes: React.ReactNode[]; prose: boolean }[] = [
    { nodes: [], prose: false },
  ];
  segments.forEach((segment, index) => {
    if (typeof segment !== "string") {
      paragraphs[paragraphs.length - 1].nodes.push(
        <React.Fragment key={index}>
          {renderSegment(segment, index)}
        </React.Fragment>,
      );
      return;
    }
    segment.split(/\n{2,}/).forEach((chunk, part) => {
      if (part > 0) paragraphs.push({ nodes: [], prose: false });
      chunk.split("\n").forEach((line, row) => {
        const target = paragraphs[paragraphs.length - 1];
        if (row > 0)
          target.nodes.push(<br key={`${index}-${part}-${row}-br`} />);
        if (line.trim()) target.prose = true;
        if (line)
          target.nodes.push(
            <React.Fragment key={`${index}-${part}-${row}`}>
              {line}
            </React.Fragment>,
          );
      });
    });
  });

  const busy = status === "thinking" || status === "streaming";
  const colorVars = colors
    ? ({
        ...(colors.accent && { "--insight-accent": colors.accent }),
        ...(colors.glow && { "--insight-glow": colors.glow }),
        ...(colors.positive && { "--insight-positive": colors.positive }),
        ...(colors.negative && { "--insight-negative": colors.negative }),
      } as React.CSSProperties)
    : undefined;

  const button = cn(
    "inline-flex h-7 items-center justify-center gap-1.5 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
    focusRing,
  );

  return (
    <div
      data-slot="insight-card"
      data-status={status}
      aria-busy={busy || undefined}
      className={cn(
        "@container/insight relative isolate flex min-w-0 flex-col rounded-xl border bg-card text-card-foreground shadow-xs",
        "[--insight-accent:var(--color-primary)] [--insight-glow:var(--color-chart-4)] [--insight-negative:var(--color-destructive)] [--insight-positive:var(--color-emerald-600)] dark:[--insight-positive:var(--color-emerald-400)]",
        className,
      )}
      style={{ ...colorVars, ...style }}
      {...props}
    >
      <style href="overtrue-insight-card" precedence="default">
        {styles}
      </style>

      {/* Moving border and soft glow while the model works. */}
      <span
        aria-hidden="true"
        data-slot="insight-glow"
        className={cn(
          "pointer-events-none absolute -inset-px -z-10 rounded-[inherit] blur-md transition-opacity duration-700 motion-safe:animate-[insight-spin_3.2s_linear_infinite] motion-reduce:transition-none",
          busy ? "opacity-35 dark:opacity-45" : "opacity-0",
        )}
        style={{ background: ring }}
      />
      {/* The surface sits above the glow so only its spill outside the card shows. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-5 rounded-[inherit] bg-card"
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-700 motion-safe:animate-[insight-spin_3.2s_linear_infinite] motion-reduce:transition-none",
          busy ? "opacity-100" : "opacity-0",
        )}
        style={{ ...ringMask, background: ring }}
      />
      {/* A faint wash behind the header keeps the card recognisable as generated. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-[inherit] bg-[radial-gradient(120%_100%_at_0%_0%,color-mix(in_oklab,var(--insight-accent)_9%,transparent),transparent_60%)]"
      />

      <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pt-3.5 @sm/insight:px-5 @sm/insight:pt-4">
        <div className="flex min-w-0 flex-1 basis-44 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="relative flex size-7 shrink-0 items-center justify-center rounded-lg border border-(--insight-accent)/20 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--insight-accent)_16%,var(--color-card)),color-mix(in_oklab,var(--insight-glow)_14%,var(--color-card)))] text-(--insight-accent)"
          >
            {icon ?? (
              <Sparkles
                className={cn("size-4", busy && "motion-safe:animate-pulse")}
                stroke={1.75}
              />
            )}
          </span>
          <div className="flex min-w-0 items-baseline gap-2">
            <div className="truncate text-sm leading-5 font-semibold tracking-tight">
              {title}
            </div>
            {busy && (
              <div
                data-slot="insight-progress"
                className="hidden shrink-0 bg-linear-to-r from-muted-foreground @xs/insight:block via-foreground to-muted-foreground bg-size-[200%_100%] bg-clip-text text-xs text-transparent motion-safe:animate-[insight-shimmer_1.8s_linear_infinite] motion-reduce:text-muted-foreground"
              >
                {status === "thinking" ? labels.thinking : labels.streaming}
              </div>
            )}
          </div>
        </div>
        {source && (
          <div
            data-slot="insight-source-label"
            className="flex min-w-0 items-center gap-1.5 font-mono text-[11px] leading-5 text-muted-foreground"
          >
            {source}
          </div>
        )}
      </div>

      <div className="relative px-4 pt-3 pb-4 @sm/insight:px-5">
        {status === "thinking" ? (
          <div
            data-slot="insight-skeleton"
            className="space-y-2.5 py-1"
            aria-hidden="true"
          >
            {[92, 100, 78, 56].map((width, index) => (
              <div
                key={index}
                className="h-2.5 rounded-full bg-linear-to-r from-muted via-foreground/[0.07] to-muted bg-size-[200%_100%] motion-safe:animate-[insight-shimmer_1.6s_linear_infinite] dark:via-foreground/[0.1]"
                style={{
                  width: `${width}%`,
                  animationDelay: `${index * 120}ms`,
                }}
              />
            ))}
          </div>
        ) : status === "error" ? (
          <div
            data-slot="insight-error"
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/[0.06] p-3"
          >
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-destructive"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{labels.error}</div>
              {error && (
                <div className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  {error}
                </div>
              )}
              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className={cn(
                    "mt-2 inline-flex h-7 items-center gap-1.5 rounded-md border bg-card px-2.5 text-xs font-medium shadow-xs transition-colors hover:bg-muted motion-reduce:transition-none",
                    focusRing,
                  )}
                >
                  <Refresh className="size-3.5" aria-hidden="true" />
                  {labels.retry}
                </button>
              )}
            </div>
          </div>
        ) : status === "idle" ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed px-3 py-2.5">
            <span className="text-sm text-muted-foreground">{labels.idle}</span>
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90 motion-reduce:transition-none",
                  focusRing,
                )}
              >
                <Sparkles className="size-3.5" aria-hidden="true" />
                {labels.generate}
              </button>
            )}
          </div>
        ) : (
          <div
            data-slot="insight-body"
            className="space-y-3 text-sm leading-6 text-pretty text-foreground/90"
          >
            {paragraphs.map((paragraph, index) => {
              const caret = status === "streaming" &&
                index === paragraphs.length - 1 && (
                  <span
                    aria-hidden="true"
                    data-slot="insight-caret"
                    className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] rounded-full bg-(--insight-accent) motion-safe:animate-[insight-caret_1s_linear_infinite]"
                  />
                );
              return paragraph.prose || paragraph.nodes.length === 0 ? (
                <p key={index} className="break-words">
                  {paragraph.nodes}
                  {caret}
                </p>
              ) : (
                <div
                  key={index}
                  data-slot="insight-highlights"
                  className="flex flex-wrap items-center gap-1.5 [&_[data-slot=insight-token]]:mx-0"
                >
                  {paragraph.nodes}
                  {caret}
                </div>
              );
            })}
          </div>
        )}

        {status === "done" && sources && sources.length > 0 && (
          <div
            data-slot="insight-sources"
            className="mt-3.5 flex flex-wrap items-center gap-1.5 transition-[opacity,translate] duration-500 ease-out starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none"
          >
            <span className="mr-0.5 text-xs text-muted-foreground">
              {labels.sources}
            </span>
            {sources.map((item, index) => {
              const content = (
                <>
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-[4px] bg-muted px-1 font-mono text-[10px] leading-none font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="min-w-0 truncate">{item.label}</span>
                  {item.href && (
                    <ArrowUpRight
                      className="size-3 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                </>
              );
              const chip = cn(
                "inline-flex h-6 max-w-full min-w-0 items-center gap-1.5 rounded-md border bg-card pr-2 pl-1 text-xs transition-colors motion-reduce:transition-none",
                hoveredSource === item.id &&
                  "border-(--insight-accent)/40 bg-(--insight-accent)/[0.06]",
              );
              return item.href ? (
                <a
                  key={item.id}
                  data-slot="insight-source"
                  data-active={hoveredSource === item.id || undefined}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(chip, "hover:bg-muted", focusRing)}
                >
                  {content}
                </a>
              ) : (
                <span
                  key={item.id}
                  data-slot="insight-source"
                  data-active={hoveredSource === item.id || undefined}
                  className={chip}
                >
                  {content}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {status !== "idle" && status !== "error" && (
        <div
          data-slot="insight-actions"
          className="relative mt-auto flex items-center gap-1 border-t px-2 py-1.5 @sm/insight:px-3"
        >
          {busy && onStop ? (
            <button
              type="button"
              onClick={onStop}
              className={cn(button, "px-2")}
            >
              <Stop className="size-3" aria-hidden="true" />
              {labels.stop}
            </button>
          ) : (
            onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                disabled={busy}
                aria-label={labels.regenerate}
                title={labels.regenerate}
                className={cn(button, "px-2")}
              >
                <Refresh className="size-3.5" aria-hidden="true" />
                <span className="hidden @xs/insight:inline">
                  {labels.regenerate}
                </span>
              </button>
            )
          )}
          <button
            type="button"
            onClick={copy}
            disabled={busy || !plain}
            aria-label={copied ? labels.copied : labels.copy}
            title={labels.copy}
            className={cn(button, "px-2")}
          >
            {copied ? (
              <Check
                className="size-3.5 text-(--insight-positive)"
                aria-hidden="true"
              />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            <span className="hidden @xs/insight:inline">
              {copied ? labels.copied : labels.copy}
            </span>
          </button>
          {actions}
          <div
            className="ml-auto flex items-center gap-0.5"
            role="group"
            aria-label={labels.feedback}
          >
            <button
              type="button"
              aria-pressed={feedback === "up"}
              aria-label={labels.helpful}
              title={labels.helpful}
              disabled={busy || status !== "done"}
              onClick={() => setFeedback("up")}
              className={cn(
                button,
                "size-7",
                feedback === "up" &&
                  "text-(--insight-accent) hover:text-(--insight-accent)",
              )}
            >
              {feedback === "up" ? (
                <ThumbUpFilled className="size-3.5" aria-hidden="true" />
              ) : (
                <ThumbUp className="size-3.5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              aria-pressed={feedback === "down"}
              aria-label={labels.notHelpful}
              title={labels.notHelpful}
              disabled={busy || status !== "done"}
              onClick={() => setFeedback("down")}
              className={cn(
                button,
                "size-7",
                feedback === "down" && "text-foreground",
              )}
            >
              {feedback === "down" ? (
                <ThumbDownFilled className="size-3.5" aria-hidden="true" />
              ) : (
                <ThumbDown className="size-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Announce once: the finished text, not every token. */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {status === "done"
          ? plain
          : status === "thinking"
            ? labels.thinking
            : ""}
      </div>
    </div>
  );
}
