"use client";

import * as React from "react";
import {
  IconArrowDown as ArrowDown,
  IconPlayerPause as Pause,
  IconPlayerPlay as Play,
  IconSearch as Search,
  IconTextWrap as TextWrap,
  IconTrash as Trash,
  IconX as X,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  id: string;
  time: Date | number | string;
  level: LogLevel;
  /** Service, job or component that emitted the line. */
  source?: string;
  message: string;
}

export interface LogStreamProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "title"
> {
  /** Events, oldest first. Append new entries to the end. */
  entries: LogEntry[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Height of the scrolling log in pixels. */
  height?: number;
  /** Render at most this many of the newest matching rows. */
  maxEntries?: number;
  /** Follow the tail. Pass with `onFollowChange` to control it. */
  follow?: boolean;
  defaultFollow?: boolean;
  onFollowChange?: (follow: boolean) => void;
  /** Called by the clear action. Without it, clearing hides the current entries locally. */
  onClear?: () => void;
  /** A live source shows a Live/Paused badge, a follow control, and a cursor. Set false for archived logs. */
  live?: boolean;
  /** Levels shown initially. */
  defaultLevels?: LogLevel[];
  /** Initial text filter, matched against messages and sources. */
  defaultQuery?: string;
  /** Wrap long messages instead of truncating them. Rows can still be expanded one at a time. */
  defaultWrap?: boolean;
  /** Format timestamps in local time or UTC. */
  timeZone?: "local" | "utc";
}

const LEVELS: LogLevel[] = ["debug", "info", "warn", "error"];

const levelStyle: Record<LogLevel, { label: string; pill: string; dot: string }> = {
  debug: {
    label: "Debug",
    pill: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/50",
  },
  info: {
    label: "Info",
    pill: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  warn: {
    label: "Warn",
    pill: "bg-amber-500/12 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  error: {
    label: "Error",
    pill: "bg-destructive/12 text-destructive",
    dot: "bg-destructive",
  },
};

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-card";

function lastIndexOfId(entries: LogEntry[], id: string) {
  for (let i = entries.length - 1; i >= 0; i--) if (entries[i].id === id) return i;
  return -1;
}

const pad = (value: number, size = 2) => String(value).padStart(size, "0");

function formatTime(time: LogEntry["time"], zone: "local" | "utc") {
  const date = time instanceof Date ? time : new Date(time);
  if (Number.isNaN(date.getTime())) return ["--:--:--", ".---", undefined] as const;
  const utc = zone === "utc";
  const hms = `${pad(utc ? date.getUTCHours() : date.getHours())}:${pad(utc ? date.getUTCMinutes() : date.getMinutes())}:${pad(utc ? date.getUTCSeconds() : date.getSeconds())}`;
  return [hms, `.${pad(utc ? date.getUTCMilliseconds() : date.getMilliseconds(), 3)}`, date.toISOString()] as const;
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const lower = text.toLowerCase();
  const parts: React.ReactNode[] = [];
  let from = 0;
  let at = lower.indexOf(query, from);
  while (at !== -1) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(
      <mark key={at} className="rounded-[2px] bg-amber-300/50 text-inherit dark:bg-amber-400/30">
        {text.slice(at, at + query.length)}
      </mark>,
    );
    from = at + query.length;
    at = lower.indexOf(query, from);
  }
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}

interface RowProps {
  entry: LogEntry;
  query: string;
  wrap: boolean;
  expanded: boolean;
  enter: boolean;
  zone: "local" | "utc";
  onToggle: (id: string) => void;
}

const LogRow = React.memo(function LogRow({
  entry,
  query,
  wrap,
  expanded,
  enter,
  zone,
  onToggle,
}: RowProps) {
  const [hms, ms, iso] = formatTime(entry.time, zone);
  const open = wrap || expanded;
  const level = levelStyle[entry.level] ?? levelStyle.info;
  return (
    <div
      data-level={entry.level}
      data-expanded={expanded || undefined}
      onClick={wrap ? undefined : () => onToggle(entry.id)}
      className={cn(
        "relative flex items-start gap-3 px-4 py-[5px] leading-[18px]",
        entry.level === "error"
          ? "bg-destructive/[0.06] hover:bg-destructive/10 dark:bg-destructive/10 dark:hover:bg-destructive/15"
          : "hover:bg-muted/60",
        enter &&
          "transition-[opacity,translate] duration-300 ease-out starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none",
      )}
    >
      {entry.level === "error" && (
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 bg-destructive" />
      )}
      <time
        dateTime={iso}
        className="w-[84px] shrink-0 text-muted-foreground tabular-nums"
      >
        {hms}
        <span className="opacity-55">{ms}</span>
      </time>
      <span
        className={cn(
          "mt-px inline-flex h-4 w-12 shrink-0 items-center justify-center rounded-[4px] text-[10px] leading-none font-semibold tracking-wide uppercase",
          level.pill,
        )}
      >
        {entry.level}
      </span>
      {entry.source !== undefined && (
        <span className="hidden w-16 shrink-0 truncate text-muted-foreground @md/log:block" title={entry.source}>
          {entry.source}
        </span>
      )}
      <span
        className={cn(
          "min-w-0 flex-1 text-foreground",
          open ? "break-words whitespace-pre-wrap" : "truncate",
          entry.level === "debug" && "text-muted-foreground",
        )}
        title={open ? undefined : entry.message}
      >
        {entry.source !== undefined && (
          <span className="text-muted-foreground @md/log:hidden">{entry.source} · </span>
        )}
        {highlight(entry.message, query)}
      </span>
    </div>
  );
});

/** A live, terminal-style event stream that follows the tail until someone scrolls up to read. */
export function LogStream({
  entries,
  title = "Events",
  description,
  height = 320,
  maxEntries = 500,
  follow: followProp,
  defaultFollow = true,
  onFollowChange,
  onClear,
  live = true,
  defaultLevels = LEVELS,
  defaultQuery = "",
  defaultWrap = false,
  timeZone = "local",
  className,
  onKeyDown,
  ...props
}: LogStreamProps) {
  const id = React.useId();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const pausedBy = React.useRef<"scroll" | "user" | null>(null);

  const [followState, setFollowState] = React.useState(defaultFollow);
  const following = followProp ?? followState;
  const [frozen, setFrozen] = React.useState<LogEntry[] | null>(null);
  const [levels, setLevels] = React.useState<ReadonlySet<LogLevel>>(() => new Set(defaultLevels));
  const [search, setSearch] = React.useState(defaultQuery);
  const [wrap, setWrap] = React.useState(defaultWrap);
  const [expanded, setExpanded] = React.useState<ReadonlySet<string>>(() => new Set());
  const [clearedAfter, setClearedAfter] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const setFollowing = React.useCallback(
    (next: boolean, reason: "scroll" | "user" = "user") => {
      pausedBy.current = next ? null : reason;
      // Freeze what is on screen so reading is never interrupted by the stream.
      setFrozen(next ? null : entries);
      if (followProp === undefined) setFollowState(next);
      onFollowChange?.(next);
    },
    [entries, followProp, onFollowChange],
  );

  // Keep a controlled `follow={false}` frozen too.
  React.useLayoutEffect(() => {
    if (!following && !frozen) setFrozen(entries);
    if (following && frozen) setFrozen(null);
  }, [following, frozen, entries]);

  const visibleSource = React.useMemo(() => {
    const source = frozen ?? entries;
    if (clearedAfter === null) return source;
    const index = lastIndexOfId(source, clearedAfter);
    return index === -1 ? source : source.slice(index + 1);
  }, [frozen, entries, clearedAfter]);

  const query = search.trim().toLowerCase();
  const { rows, counts, matching } = React.useMemo(() => {
    const counts: Record<LogLevel, number> = { debug: 0, info: 0, warn: 0, error: 0 };
    const rows: LogEntry[] = [];
    for (const entry of visibleSource) {
      if (
        query &&
        !entry.message.toLowerCase().includes(query) &&
        !entry.source?.toLowerCase().includes(query)
      )
        continue;
      counts[entry.level] = (counts[entry.level] ?? 0) + 1;
      if (levels.has(entry.level)) rows.push(entry);
    }
    const matching = rows.length;
    return { rows: rows.length > maxEntries ? rows.slice(-maxEntries) : rows, counts, matching };
  }, [visibleSource, query, levels, maxEntries]);

  const pending = React.useMemo(() => {
    if (following || !frozen) return 0;
    const last = frozen[frozen.length - 1];
    const index = last ? lastIndexOfId(entries, last.id) : -1;
    let count = 0;
    for (let i = index + 1; i < entries.length; i++) if (levels.has(entries[i].level)) count++;
    return count;
  }, [following, frozen, entries, levels]);

  // Stay pinned to the newest row while following.
  React.useLayoutEffect(() => {
    const element = scrollRef.current;
    if (following && element) element.scrollTop = element.scrollHeight;
  }, [following, rows]);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (!element) return;
    const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
    if (following && distance > 24) setFollowing(false, "scroll");
    else if (!following && pausedBy.current === "scroll" && distance < 2) setFollowing(true);
  };

  const toggleRow = React.useCallback((rowId: string) => {
    if (window.getSelection()?.toString()) return;
    setExpanded((current) => {
      const next = new Set(current);
      if (!next.delete(rowId)) next.add(rowId);
      return next;
    });
  }, []);

  const toggleLevel = (level: LogLevel) =>
    setLevels((current) => {
      const next = new Set(current);
      if (!next.delete(level)) next.add(level);
      return next;
    });

  const clear = () => {
    setExpanded(new Set());
    if (onClear) onClear();
    else setClearedAfter(entries[entries.length - 1]?.id ?? null);
    if (!following) setFollowing(true);
  };

  const resetFilters = () => {
    setSearch("");
    setLevels(new Set(LEVELS));
  };

  const total = visibleSource.length;
  const filtered = query !== "" || levels.size < LEVELS.length;

  return (
    <div
      data-slot="log-stream"
      data-following={following || undefined}
      className={cn(
        "@container/log flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs",
        className,
      )}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        const target = event.target as HTMLElement;
        if (
          event.key === "/" &&
          !event.defaultPrevented &&
          !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
        ) {
          event.preventDefault();
          searchRef.current?.focus();
        }
      }}
      {...props}
    >
      <div className="flex items-start gap-3 px-4 pt-3.5 pb-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <p id={`${id}-title`} className="min-w-0 text-sm leading-6 font-semibold tracking-tight break-words">
              {title}
            </p>
            {live && (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-px text-[11px] leading-4 font-medium",
                  following ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400",
                )}
              >
                <span className="relative flex size-1.5" aria-hidden="true">
                  {following && (
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-70 motion-reduce:hidden" />
                  )}
                  <span
                    className={cn(
                      "relative inline-flex size-1.5 rounded-full",
                      following ? "bg-emerald-500" : "bg-amber-500",
                    )}
                  />
                </span>
                {following ? "Live" : "Paused"}
              </span>
            )}
          </div>
          {description && <p className="truncate text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-pressed={wrap}
            title="Wrap long lines"
            onClick={() => setWrap((value) => !value)}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-pressed:bg-muted aria-pressed:text-foreground motion-reduce:transition-none",
              focusRing,
            )}
          >
            <TextWrap className="size-4" aria-hidden="true" />
            <span className="sr-only">Wrap long lines</span>
          </button>
          <button
            type="button"
            title="Clear"
            onClick={clear}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground motion-reduce:transition-none",
              focusRing,
            )}
          >
            <Trash className="size-4" aria-hidden="true" />
            <span className="sr-only">Clear events</span>
          </button>
          {live && (
            <button
              type="button"
              title={following ? "Pause the tail" : "Resume following"}
              aria-label={following ? "Pause following" : "Resume following"}
              onClick={() => setFollowing(!following)}
              className={cn(
                "ml-1 inline-flex h-7 items-center gap-1.5 rounded-md border bg-card px-2 text-xs font-medium shadow-xs transition-colors hover:bg-muted motion-reduce:transition-none @md/log:px-2.5",
                focusRing,
              )}
            >
              {following ? (
                <Pause className="size-3.5" aria-hidden="true" />
              ) : (
                <Play className="size-3.5" aria-hidden="true" />
              )}
              <span className="sr-only @md/log:not-sr-only">{following ? "Pause" : "Resume"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-y bg-muted/30 px-4 py-2">
        <div role="group" aria-label="Levels" className="flex flex-wrap items-center gap-1">
          {LEVELS.map((level) => {
            const active = levels.has(level);
            return (
              <button
                key={level}
                type="button"
                aria-pressed={active}
                onClick={() => toggleLevel(level)}
                className={cn(
                  "inline-flex h-6 items-center gap-1 rounded-md border px-1.5 text-xs transition-colors motion-reduce:transition-none @md/log:gap-1.5 @md/log:px-2",
                  active
                    ? "border-border bg-card text-foreground shadow-xs"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                  focusRing,
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full",
                    active ? levelStyle[level].dot : "bg-transparent ring-1 ring-muted-foreground/50 ring-inset",
                  )}
                />
                {levelStyle[level].label}
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{counts[level]}</span>
              </button>
            );
          })}
        </div>
        <div className="relative ml-auto min-w-36 flex-1 @lg/log:max-w-60">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && search) {
                event.stopPropagation();
                setSearch("");
              }
            }}
            placeholder="Filter…"
            aria-label="Filter messages"
            spellCheck={false}
            className="h-7 w-full rounded-md border border-input bg-card pr-7 pl-7 text-xs text-foreground shadow-xs transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 motion-reduce:transition-none"
          />
          {search ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                searchRef.current?.focus();
              }}
              className={cn(
                "absolute top-1/2 right-1 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:text-foreground",
                focusRing,
              )}
            >
              <X className="size-3" aria-hidden="true" />
              <span className="sr-only">Clear filter</span>
            </button>
          ) : (
            <kbd className="pointer-events-none absolute top-1/2 right-1.5 hidden -translate-y-1/2 rounded border bg-muted px-1 font-mono text-[10px] leading-4 text-muted-foreground @md/log:block">
              /
            </kbd>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-labelledby={`${id}-title`}
          tabIndex={0}
          onScroll={handleScroll}
          className="overflow-y-auto overscroll-contain py-1.5 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
          style={{ height }}
        >
          {rows.map((entry) => (
            <LogRow
              key={entry.id}
              entry={entry}
              query={query}
              wrap={wrap}
              expanded={expanded.has(entry.id)}
              enter={mounted}
              zone={timeZone}
              onToggle={toggleRow}
            />
          ))}
          {rows.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center font-sans">
              {total === 0 ? (
                <p className="text-xs text-muted-foreground">
                  {live ? "Waiting for events…" : "No events yet."}
                </p>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">No events match these filters.</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className={cn("rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-muted", focusRing)}
                  >
                    Show all events
                  </button>
                </>
              )}
            </div>
          )}
          {rows.length > 0 && live && following && (
            <div aria-hidden="true" className="px-4 py-[5px] leading-[18px]">
              <span className="inline-block h-3.5 w-[7px] translate-y-[3px] animate-pulse bg-foreground/35 motion-reduce:animate-none" />
            </div>
          )}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-linear-to-b from-card to-transparent"
        />
        {!following && (
          <button
            type="button"
            onClick={() => setFollowing(true)}
            className={cn(
              "absolute bottom-3 left-1/2 inline-flex h-7 -translate-x-1/2 items-center gap-1.5 rounded-full bg-foreground px-3 text-xs font-medium text-background shadow-lg transition-[opacity,translate] duration-200 starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none",
              focusRing,
            )}
          >
            <ArrowDown className="size-3.5" aria-hidden="true" />
            Jump to latest
            {pending > 0 && (
              <span className="rounded-full bg-background/20 px-1.5 font-mono text-[11px] tabular-nums">
                {pending > 999 ? "999+" : pending} new
              </span>
            )}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t px-4 py-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
        <span>
          {filtered ? `${matching.toLocaleString("en-US")} of ${total.toLocaleString("en-US")}` : total.toLocaleString("en-US")}{" "}
          {total === 1 ? "event" : "events"}
          {rows.length < matching && ` · showing last ${rows.length.toLocaleString("en-US")}`}
        </span>
        <span>{timeZone === "utc" ? "UTC" : "Local time"}</span>
      </div>
    </div>
  );
}
