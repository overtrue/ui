"use client";

import * as React from "react";
import {
  IconCheck as Check,
  IconChevronDown as ChevronDown,
  IconChevronRight as ChevronRight,
  IconChevronUp as ChevronUp,
  IconCopy as Copy,
  IconFoldDown as FoldDown,
  IconFoldUp as FoldUp,
  IconRoute as Route,
  IconSearch as Search,
  IconX as X,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export type JsonValueType =
  | "object"
  | "array"
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "null"
  | "undefined"
  | "date"
  | "function"
  | "symbol"
  | "circular";

export interface JsonViewerLabels {
  tree: string;
  search: string;
  clearSearch: string;
  previousMatch: string;
  nextMatch: string;
  noMatches: string;
  matchCount: (current: number, total: number) => string;
  expandAll: string;
  collapseAll: string;
  copyJson: string;
  copyPath: string;
  copyValue: string;
  copied: string;
  showMore: string;
  showLess: string;
  showMoreItems: (count: number) => string;
  hiddenItems: (count: number) => string;
  keys: (count: number) => string;
  items: (count: number) => string;
  characters: (count: number) => string;
  root: string;
  statusHint: string;
}

export type JsonCopyKind = "value" | "path" | "json";

export interface JsonViewerProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "onSelect" | "children" | "defaultValue" | "onCopy"
> {
  /** Any JSON-like value. Dates, Maps, Sets, bigints and circular references are handled. */
  data: unknown;
  /** Name of the root node and the first segment of every path, e.g. "payload". */
  rootName?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Containers shallower than this start expanded. Defaults to 2. */
  defaultExpandDepth?: number;
  /** Expanded container paths. Pass with `onExpandedChange` to control expansion. */
  expanded?: readonly string[] | ReadonlySet<string>;
  /** Initially expanded paths, instead of `defaultExpandDepth`. */
  defaultExpanded?: readonly string[];
  onExpandedChange?: (expanded: string[]) => void;
  /** Shows the search field. Defaults to true. */
  showSearch?: boolean;
  /** Search text. Pass with `onSearchChange` to control it. */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** Longer strings are cut with an inline Show more. Defaults to 120 characters. */
  maxStringLength?: number;
  /** Children rendered per container before Show more. Defaults to 100. */
  pageSize?: number;
  /** Sort object keys alphabetically, or with your own comparator. */
  sortKeys?: boolean | ((a: string, b: string) => number);
  /** Selected path. Pass `null` for none; leave undefined to let the viewer manage it. */
  selectedPath?: string | null;
  defaultSelectedPath?: string | null;
  /** Called when a node is clicked, or chosen with Enter or Space. */
  onSelect?: (path: string, value: unknown) => void;
  /** Draw a leaf value yourself. Return `undefined` to keep the built-in rendering. */
  renderValue?: (value: unknown, path: string) => React.ReactNode | undefined;
  /** Copy actions on rows, in the status bar and in the toolbar. Defaults to true. */
  copyable?: boolean;
  /** Receives copied text. Without it, copies go to the clipboard. */
  onCopy?: (text: string, detail: { kind: JsonCopyKind; path: string }) => void;
  /** Expand all, Collapse all and Copy JSON. Defaults to true. */
  showToolbar?: boolean;
  /** Path, type and copy actions for the focused node. Defaults to true. */
  showStatusBar?: boolean;
  /** Extra buttons placed before the built-in toolbar actions. */
  actions?: React.ReactNode;
  /** Height limit of the tree; it scrolls beyond this. */
  maxHeight?: number | string;
  /** Formats the hint shown for ISO-8601 timestamps. */
  formatDate?: (date: Date) => string;
  labels?: Partial<JsonViewerLabels>;
}

const plural = (count: number, one: string, many: string) =>
  `${count.toLocaleString()} ${count === 1 ? one : many}`;

const LABELS: JsonViewerLabels = {
  tree: "JSON",
  search: "Search keys and values",
  clearSearch: "Clear search",
  previousMatch: "Previous match",
  nextMatch: "Next match",
  noMatches: "No matches",
  matchCount: (current, total) => `${current} of ${total}`,
  expandAll: "Expand all",
  collapseAll: "Collapse all",
  copyJson: "Copy JSON",
  copyPath: "Copy path",
  copyValue: "Copy value",
  copied: "Copied",
  showMore: "Show more",
  showLess: "Show less",
  showMoreItems: (count) => `Show ${count.toLocaleString()} more`,
  hiddenItems: (count) => `${count.toLocaleString()} hidden`,
  keys: (count) => plural(count, "key", "keys"),
  items: (count) => plural(count, "item", "items"),
  characters: (count) => plural(count, "character", "characters"),
  root: "root",
  statusHint: "Focus a node to see its path",
};

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------------------------*/

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:shadow-[0_0_14px_-2px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]";

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const subscribeNothing = () => () => {};
function useMounted() {
  return React.useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;
const ISO_DATE =
  /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;
const URL_VALUE = /^https?:\/\/[^\s"]+$/i;

/** Path of a child, e.g. `payload.items[2].sku` or `headers["content-type"]`. */
export function jsonChildPath(parent: string, key: string | number, inArray: boolean) {
  if (inArray) return `${parent}[${key}]`;
  const name = String(key);
  if (IDENTIFIER.test(name)) return parent ? `${parent}.${name}` : name;
  return `${parent}[${JSON.stringify(name)}]`;
}

function typeOf(value: unknown, ancestors: Set<object>): JsonValueType {
  if (value === null) return "null";
  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "bigint":
      return "bigint";
    case "boolean":
      return "boolean";
    case "undefined":
      return "undefined";
    case "function":
      return "function";
    case "symbol":
      return "symbol";
  }
  if (value instanceof Date) return "date";
  if (ancestors.has(value as object)) return "circular";
  if (Array.isArray(value) || value instanceof Set) return "array";
  return "object";
}

type Entry = [key: string | number, value: unknown];

function entriesOf(
  value: unknown,
  type: JsonValueType,
  sortKeys: JsonViewerProps["sortKeys"],
): Entry[] {
  if (type === "array")
    return (value instanceof Set ? [...value] : (value as unknown[])).map((child, index) => [index, child]);
  const entries: Entry[] =
    value instanceof Map
      ? [...value.entries()].map(([key, child]) => [String(key), child])
      : Object.keys(value as object).map((key) => [key, (value as Record<string, unknown>)[key]]);
  if (sortKeys) {
    const compare =
      typeof sortKeys === "function"
        ? sortKeys
        : (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });
    entries.sort((a, b) => compare(String(a[0]), String(b[0])));
  }
  return entries;
}

/** Text shown for a leaf, without string quotes. Search matches against this. */
function displayText(value: unknown, type: JsonValueType) {
  switch (type) {
    case "string":
      return JSON.stringify(value).slice(1, -1);
    case "bigint":
      return `${value as bigint}n`;
    case "date": {
      const time = (value as Date).getTime();
      return Number.isNaN(time) ? "Invalid Date" : (value as Date).toISOString();
    }
    case "function":
      return `ƒ ${(value as { name?: string }).name || "anonymous"}()`;
    case "circular":
      return "[Circular]";
    case "symbol":
      return String(value);
    default:
      return String(value);
  }
}

/** JSON.stringify that survives bigints, Maps, Sets and circular references. */
export function toJsonString(value: unknown, space = 2) {
  const stack: unknown[] = [];
  const text = JSON.stringify(
    value,
    function (this: unknown, _key, current: unknown) {
      if (typeof current === "bigint") return current.toString();
      if (current instanceof Map) return Object.fromEntries(current);
      if (current instanceof Set) return [...current];
      if (typeof current === "object" && current !== null) {
        while (stack.length && stack[stack.length - 1] !== this) stack.pop();
        if (stack.includes(current)) return "[Circular]";
        stack.push(current);
      }
      return current;
    },
    space,
  );
  return text ?? String(value);
}

function copyText(value: unknown, type: JsonValueType) {
  if (type === "object" || type === "array") return toJsonString(value);
  if (type === "string") return value as string;
  return displayText(value, type);
}

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const defaultDateFormat = (date: Date) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "long" }).format(date);

/* -------------------------------------------------------------------------------------------------
 * Flattening
 * -----------------------------------------------------------------------------------------------*/

interface Row {
  kind: "node" | "close" | "more";
  /** Unique row id; equals the node path for "node" rows. */
  id: string;
  path: string;
  parent: string | null;
  /** Container paths from the root down to the parent. */
  ancestors: string[];
  depth: number;
  key: string | number | null;
  inArray: boolean;
  type: JsonValueType;
  value: unknown;
  size: number;
  expanded: boolean;
  last: boolean;
  position: number;
  setSize: number;
  hidden: number;
}

interface FlattenOptions {
  isExpanded: (path: string, depth: number) => boolean;
  limits: ReadonlyMap<string, number>;
  pageSize: number;
  sortKeys: JsonViewerProps["sortKeys"];
}

function flatten(data: unknown, rootPath: string, rootName: string | undefined, options: FlattenOptions) {
  const rows: Row[] = [];
  const stack = new Set<object>();
  const visit = (
    value: unknown,
    key: string | number | null,
    path: string,
    parent: string | null,
    ancestors: string[],
    depth: number,
    inArray: boolean,
    last: boolean,
    position: number,
    setSize: number,
  ) => {
    const type = typeOf(value, stack);
    const container = type === "object" || type === "array";
    const entries = container ? entriesOf(value, type, options.sortKeys) : [];
    const expanded = container && entries.length > 0 && options.isExpanded(path, depth);
    rows.push({
      kind: "node",
      id: path,
      path,
      parent,
      ancestors,
      depth,
      key,
      inArray,
      type,
      value,
      size: entries.length,
      expanded,
      last,
      position,
      setSize,
      hidden: 0,
    });
    if (!expanded) return;
    stack.add(value as object);
    const limit = Math.max(options.pageSize, options.limits.get(path) ?? 0);
    const shown = Math.min(entries.length, limit);
    const childAncestors = [...ancestors, path];
    for (let index = 0; index < shown; index++) {
      const [childKey, child] = entries[index];
      visit(
        child,
        childKey,
        jsonChildPath(path, childKey, type === "array"),
        path,
        childAncestors,
        depth + 1,
        type === "array",
        index === entries.length - 1,
        index + 1,
        entries.length,
      );
    }
    if (shown < entries.length)
      rows.push({
        kind: "more",
        id: `${path}\u0000more`,
        path,
        parent: path,
        ancestors: childAncestors,
        depth: depth + 1,
        key: null,
        inArray: type === "array",
        type,
        value,
        size: entries.length,
        expanded: false,
        last: true,
        position: shown + 1,
        setSize: entries.length,
        hidden: entries.length - shown,
      });
    stack.delete(value as object);
    rows.push({
      kind: "close",
      id: `${path}\u0000close`,
      path,
      parent,
      ancestors,
      depth,
      key: null,
      inArray,
      type,
      value,
      size: entries.length,
      expanded: true,
      last,
      position,
      setSize,
      hidden: 0,
    });
  };
  visit(data, rootName ?? null, rootPath, null, [], 0, false, true, 1, 1);
  return rows;
}

interface Match {
  path: string;
  /** Each ancestor container with the index of the next step inside it. */
  chain: { path: string; depth: number; index: number }[];
}

const MAX_SEARCH_NODES = 50_000;

function findMatches(data: unknown, rootPath: string, rootName: string | undefined, query: string, sortKeys: JsonViewerProps["sortKeys"]) {
  const matches: Match[] = [];
  if (!query) return matches;
  const stack = new Set<object>();
  let visited = 0;
  const visit = (value: unknown, key: string | number | null, path: string, depth: number, chain: Match["chain"]) => {
    if (++visited > MAX_SEARCH_NODES) return;
    const type = typeOf(value, stack);
    const keyHit = typeof key === "string" && key.toLowerCase().includes(query);
    const container = type === "object" || type === "array";
    const valueHit = !container && displayText(value, type).toLowerCase().includes(query);
    if (keyHit || valueHit) matches.push({ path, chain });
    if (!container) return;
    stack.add(value as object);
    entriesOf(value, type, sortKeys).forEach(([childKey, child], index) =>
      visit(child, childKey, jsonChildPath(path, childKey, type === "array"), depth + 1, [
        ...chain,
        { path, depth, index },
      ]),
    );
    stack.delete(value as object);
  };
  visit(data, rootName ?? null, rootPath, 0, []);
  return matches;
}

function collectContainers(
  data: unknown,
  rootPath: string,
  sortKeys: JsonViewerProps["sortKeys"],
  include: (path: string, depth: number) => boolean,
) {
  const paths: string[] = [];
  const stack = new Set<object>();
  let visited = 0;
  const visit = (value: unknown, path: string, depth: number) => {
    if (++visited > MAX_SEARCH_NODES) return;
    const type = typeOf(value, stack);
    if (type !== "object" && type !== "array") return;
    if (include(path, depth)) paths.push(path);
    stack.add(value as object);
    for (const [key, child] of entriesOf(value, type, sortKeys))
      visit(child, jsonChildPath(path, key, type === "array"), depth + 1);
    stack.delete(value as object);
  };
  visit(data, rootPath, 0);
  return paths;
}

/* -------------------------------------------------------------------------------------------------
 * Pieces
 * -----------------------------------------------------------------------------------------------*/

const styles = `@keyframes json-viewer-sweep{from{background-size:0% 100%}to{background-size:100% 100%}}`;

const markBase =
  "rounded-[3px] bg-no-repeat text-inherit [background-position:left] motion-safe:animate-[json-viewer-sweep_520ms_cubic-bezier(0.22,1,0.36,1)_both]";
const markIdle =
  "bg-transparent [background-image:linear-gradient(color-mix(in_oklab,var(--color-amber-400)_38%,transparent),color-mix(in_oklab,var(--color-amber-400)_38%,transparent))] dark:[background-image:linear-gradient(color-mix(in_oklab,var(--color-amber-400)_30%,transparent),color-mix(in_oklab,var(--color-amber-400)_30%,transparent))]";
const markCurrent =
  "bg-transparent text-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-amber-500)_70%,transparent)] [background-image:linear-gradient(color-mix(in_oklab,var(--color-amber-400)_75%,transparent),color-mix(in_oklab,var(--color-amber-400)_75%,transparent))] dark:[background-image:linear-gradient(color-mix(in_oklab,var(--color-amber-400)_55%,transparent),color-mix(in_oklab,var(--color-amber-400)_55%,transparent))]";

function highlight(text: string, query: string, current: boolean): React.ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  let at = lower.indexOf(query);
  if (at === -1) return text;
  const parts: React.ReactNode[] = [];
  let from = 0;
  while (at !== -1) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(
      <mark key={at} className={cn(markBase, current ? markCurrent : markIdle)}>
        {text.slice(at, at + query.length)}
      </mark>,
    );
    from = at + query.length;
    at = lower.indexOf(query, from);
  }
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}

const PAD = 10;
const INDENT = 16;

const typeClass: Partial<Record<JsonValueType, string>> = {
  string: "text-[color-mix(in_oklab,var(--color-chart-2)_70%,var(--color-foreground))]",
  date: "text-[color-mix(in_oklab,var(--color-chart-2)_70%,var(--color-foreground))]",
  number: "text-chart-1",
  bigint: "text-chart-1",
  boolean: "text-[color-mix(in_oklab,var(--color-chart-4)_70%,var(--color-foreground))]",
  null: "text-muted-foreground italic",
  undefined: "text-muted-foreground italic",
  function: "text-muted-foreground italic",
  symbol: "text-muted-foreground italic",
  circular: "text-muted-foreground italic",
};

function Guides({ row, activeContainer }: { row: Row; activeContainer: string | null }) {
  return row.ancestors.map((ancestor, level) => (
    <span
      key={level}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 w-px transition-colors duration-150 motion-reduce:transition-none",
        ancestor === activeContainer ? "bg-foreground/22" : "bg-border/80",
      )}
      style={{ left: PAD + level * INDENT + 7.5 }}
    />
  ));
}

/* -------------------------------------------------------------------------------------------------
 * JsonViewer
 * -----------------------------------------------------------------------------------------------*/

/**
 * A collapsible, searchable JSON tree for payloads, logs and trace attributes, with indent guides,
 * typed colors, copyable paths and full tree keyboard support.
 */
export function JsonViewer({
  data,
  rootName,
  title,
  description,
  defaultExpandDepth = 2,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  showSearch = true,
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  maxStringLength = 120,
  pageSize = 100,
  sortKeys,
  selectedPath: selectedProp,
  defaultSelectedPath = null,
  onSelect,
  renderValue,
  copyable = true,
  onCopy,
  showToolbar = true,
  showStatusBar = true,
  actions,
  maxHeight,
  formatDate = defaultDateFormat,
  labels: labelsProp,
  className,
  onKeyDown,
  ...props
}: JsonViewerProps) {
  const labels = { ...LABELS, ...labelsProp };
  const id = React.useId();
  const mounted = useMounted();
  const rootPath = rootName ?? "";

  // Expansion: controlled as a set of paths, or uncontrolled as a base rule plus overrides.
  const controlled = React.useMemo(
    () => (expandedProp ? new Set<string>(expandedProp) : null),
    [expandedProp],
  );
  const [expansion, setExpansion] = React.useState<{
    base: "depth" | "all" | "none";
    overrides: ReadonlyMap<string, boolean>;
  }>(() =>
    defaultExpanded
      ? { base: "none", overrides: new Map(defaultExpanded.map((path) => [path, true])) }
      : { base: "depth", overrides: new Map() },
  );
  const ruleFor = React.useCallback(
    (state: typeof expansion) => (path: string, depth: number) =>
      state.overrides.get(path) ??
      (state.base === "all" || (state.base === "depth" && depth < defaultExpandDepth)),
    [defaultExpandDepth],
  );
  const isExpanded = React.useMemo(
    () => (controlled ? (path: string) => controlled.has(path) : ruleFor(expansion)),
    [controlled, expansion, ruleFor],
  );

  const commitExpansion = (next: typeof expansion) => {
    setExpansion(next);
    onExpandedChange?.(collectContainers(data, rootPath, sortKeys, ruleFor(next)));
  };
  const setPaths = (paths: { path: string; depth: number }[], value: boolean) => {
    const changed = paths.filter(({ path, depth }) => isExpanded(path, depth) !== value);
    if (!changed.length) return;
    if (controlled) {
      const next = new Set(controlled);
      for (const { path } of changed) {
        if (value) next.add(path);
        else next.delete(path);
      }
      onExpandedChange?.([...next]);
      return;
    }
    const overrides = new Map(expansion.overrides);
    for (const { path } of changed) overrides.set(path, value);
    commitExpansion({ base: expansion.base, overrides });
  };
  const expandAll = () => {
    if (controlled) onExpandedChange?.(collectContainers(data, rootPath, sortKeys, () => true));
    else commitExpansion({ base: "all", overrides: new Map() });
  };
  const collapseAll = () => {
    if (controlled) onExpandedChange?.([rootPath]);
    else commitExpansion({ base: "none", overrides: new Map([[rootPath, true]]) });
  };

  // Pagination per container, and full strings.
  const [limits, setLimits] = React.useState<ReadonlyMap<string, number>>(() => new Map());
  const [fullStrings, setFullStrings] = React.useState<ReadonlySet<string>>(() => new Set());

  // Search
  const [searchState, setSearchState] = React.useState(defaultSearch);
  const search = searchProp ?? searchState;
  const setSearch = (next: string) => {
    if (searchProp === undefined) setSearchState(next);
    onSearchChange?.(next);
  };
  const deferredSearch = React.useDeferredValue(search);
  const query = deferredSearch.trim().toLowerCase();
  const matches = React.useMemo(
    () => findMatches(data, rootPath, rootName, query, sortKeys),
    [data, rootPath, rootName, query, sortKeys],
  );
  const matchSet = React.useMemo(() => new Set(matches.map((match) => match.path)), [matches]);
  const [current, setCurrent] = React.useState(0);
  const currentMatch = matches[Math.min(current, matches.length - 1)];

  // Selection and roving focus
  const [selectedState, setSelectedState] = React.useState<string | null>(defaultSelectedPath);
  const selected = selectedProp !== undefined ? selectedProp : selectedState;
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const rows = React.useMemo(
    () => flatten(data, rootPath, rootName, { isExpanded, limits, pageSize, sortKeys }),
    [data, rootPath, rootName, isExpanded, limits, pageSize, sortKeys],
  );
  const navigable = React.useMemo(() => rows.filter((row) => row.kind !== "close"), [rows]);
  const active = navigable.find((row) => row.id === activeId) ?? null;
  const tabStop = active?.id ?? navigable[0]?.id;
  const activeContainer = active
    ? active.kind === "node" && active.expanded
      ? active.path
      : active.parent
    : null;

  const treeRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const rowRefs = React.useRef(new Map<string, HTMLDivElement>());
  const [focusRequest, setFocusRequest] = React.useState<{ id: string; tick: number } | null>(null);
  const [scrollRequest, setScrollRequest] = React.useState<{ id: string; tick: number } | null>(null);
  const scrollOnResults = React.useRef(false);

  useIsoLayoutEffect(() => {
    if (!focusRequest) return;
    rowRefs.current.get(focusRequest.id)?.focus();
  }, [focusRequest]);

  useIsoLayoutEffect(() => {
    if (!scrollRequest) return;
    const element = rowRefs.current.get(scrollRequest.id);
    const container = scrollRef.current;
    if (!element || !container) return;
    if (container.scrollHeight > container.clientHeight + 1) {
      const top = element.offsetTop - container.offsetTop;
      const bottom = top + element.offsetHeight;
      if (top < container.scrollTop + 8 || bottom > container.scrollTop + container.clientHeight - 8)
        container.scrollTop = Math.max(0, top - container.clientHeight / 2 + element.offsetHeight / 2);
    } else element.scrollIntoView({ block: "nearest" });
  }, [scrollRequest]);

  const reveal = (match: Match) => {
    setPaths(
      match.chain.filter(({ path, depth }) => !isExpanded(path, depth)).map(({ path, depth }) => ({ path, depth })),
      true,
    );
    const raise = match.chain.filter(
      ({ path, index }) => index >= Math.max(pageSize, limits.get(path) ?? 0),
    );
    if (raise.length)
      setLimits((currentLimits) => {
        const next = new Map(currentLimits);
        for (const { path, index } of raise)
          next.set(path, Math.ceil((index + 1) / pageSize) * pageSize);
        return next;
      });
    setActiveId(match.path);
    setScrollRequest({ id: match.path, tick: Date.now() });
  };

  // Open the ancestors of every match when the query changes.
  const matchKey = matches.map((match) => match.path).join("\n");
  useIsoLayoutEffect(() => {
    setCurrent(0);
    if (!matches.length) return;
    const needed = new Map<string, number>();
    for (const match of matches)
      for (const { path, depth } of match.chain) if (!isExpanded(path, depth)) needed.set(path, depth);
    if (needed.size) setPaths([...needed].map(([path, depth]) => ({ path, depth })), true);
    if (scrollOnResults.current) {
      scrollOnResults.current = false;
      reveal(matches[0]);
    }
  }, [matchKey]);

  const goToMatch = (direction: 1 | -1) => {
    if (!matches.length) return;
    const next = (Math.min(current, matches.length - 1) + direction + matches.length) % matches.length;
    setCurrent(next);
    reveal(matches[next]);
  };

  // Copying
  const [copied, setCopied] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);
  const copy = async (text: string, kind: JsonCopyKind, path: string) => {
    if (onCopy) onCopy(text, { kind, path });
    else if (!(await writeClipboard(text))) return;
    setCopied(`${kind}:${path}`);
  };

  const json = React.useMemo(() => toJsonString(data), [data]);
  const bytes = React.useMemo(() => new TextEncoder().encode(json).length, [json]);

  const select = (row: Row) => {
    if (row.kind !== "node") return;
    if (selectedProp === undefined) setSelectedState(row.path);
    onSelect?.(row.path, row.value);
  };
  const toggle = (row: Row) => {
    if (row.kind !== "node" || !row.size) return;
    setPaths([{ path: row.path, depth: row.depth }], !row.expanded);
  };
  const showMore = (row: Row) => {
    setLimits((currentLimits) => {
      const next = new Map(currentLimits);
      next.set(row.path, Math.max(pageSize, currentLimits.get(row.path) ?? 0) + pageSize);
      return next;
    });
  };
  const moveTo = (row: Row | undefined) => {
    if (!row) return;
    setActiveId(row.id);
    setFocusRequest({ id: row.id, tick: Date.now() });
  };

  const handleTreeKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    }
    const index = navigable.findIndex((row) => row.id === (active?.id ?? tabStop));
    const row = navigable[index];
    if (!row) return;
    const mod = event.metaKey || event.ctrlKey;
    let handled = true;
    switch (event.key) {
      case "ArrowDown":
        moveTo(navigable[Math.min(index + 1, navigable.length - 1)]);
        break;
      case "ArrowUp":
        moveTo(navigable[Math.max(index - 1, 0)]);
        break;
      case "PageDown":
        moveTo(navigable[Math.min(index + 10, navigable.length - 1)]);
        break;
      case "PageUp":
        moveTo(navigable[Math.max(index - 10, 0)]);
        break;
      case "Home":
        moveTo(navigable[0]);
        break;
      case "End":
        moveTo(navigable[navigable.length - 1]);
        break;
      case "ArrowRight":
        if (row.kind === "node" && row.size) {
          if (!row.expanded) toggle(row);
          else moveTo(navigable[index + 1]);
        }
        break;
      case "ArrowLeft":
        if (row.kind === "node" && row.expanded) toggle(row);
        else if (row.parent !== null) moveTo(navigable.find((item) => item.id === row.parent));
        break;
      case "Enter":
        if (row.kind === "more") showMore(row);
        else if (row.size) toggle(row);
        else select(row);
        break;
      case " ":
        if (row.kind === "more") showMore(row);
        else select(row);
        break;
      case "*": {
        const siblings = navigable.filter(
          (item) => item.kind === "node" && item.parent === row.parent && item.size && !item.expanded,
        );
        setPaths(siblings.map((item) => ({ path: item.path, depth: item.depth })), true);
        break;
      }
      case "/":
        if (showSearch) searchRef.current?.focus();
        else handled = false;
        break;
      default:
        if (mod && (event.key === "c" || event.key === "C") && copyable && row.kind === "node") {
          if (window.getSelection()?.toString()) {
            handled = false;
            break;
          }
          void copy(copyText(row.value, row.type), "value", row.path);
        } else handled = false;
    }
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  /* --------------------------------- Row rendering --------------------------------- */

  const renderLeaf = (row: Row, isCurrent: boolean) => {
    const custom = renderValue?.(row.value, row.path);
    if (custom !== undefined) return custom;
    const text = displayText(row.value, row.type);
    if (row.type === "string") {
      const raw = row.value as string;
      const full = fullStrings.has(row.path);
      const hitAt = query ? text.toLowerCase().indexOf(query) : -1;
      const long = text.length > maxStringLength;
      const cut = long && !full && !(hitAt >= maxStringLength - query.length);
      const shown = cut ? text.slice(0, maxStringLength) : text;
      const isUrl = URL_VALUE.test(raw);
      const isDate = !isUrl && ISO_DATE.test(raw) && !Number.isNaN(Date.parse(raw));
      const body = highlight(shown, query, isCurrent);
      return (
        <>
          <span className={typeClass.string}>
            <span className="opacity-55">"</span>
            {isUrl ? (
              <a
                href={raw}
                target="_blank"
                rel="noreferrer"
                tabIndex={-1}
                onClick={(event) => event.stopPropagation()}
                className="underline decoration-current/35 underline-offset-[3px] transition-[text-decoration-color] hover:decoration-current"
              >
                {body}
              </a>
            ) : isDate ? (
              <span className="underline decoration-current/30 decoration-dotted underline-offset-[3px]">{body}</span>
            ) : (
              body
            )}
            {cut && <span className="opacity-55">…</span>}
            <span className="opacity-55">"</span>
          </span>
          {isDate && mounted && (
            <span
              data-slot="json-viewer-hint"
              className="ml-2 hidden font-sans text-[11px] whitespace-nowrap text-muted-foreground group-hover/row:inline group-data-[active=true]/row:inline"
            >
              {formatDate(new Date(raw))}
            </span>
          )}
          {long && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(event) => {
                event.stopPropagation();
                setFullStrings((currentSet) => {
                  const next = new Set(currentSet);
                  if (!next.delete(row.path)) next.add(row.path);
                  return next;
                });
              }}
              aria-label={full ? labels.showLess : `${labels.showMore}, ${labels.characters(text.length - maxStringLength)}`}
              className="ml-1.5 inline-flex h-[18px] translate-y-[-1px] items-center rounded-md bg-muted px-1.5 align-middle font-sans text-[11px] font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {full ? labels.showLess : `${labels.showMore} · ${(text.length - maxStringLength).toLocaleString()}`}
            </button>
          )}
        </>
      );
    }
    if (row.type === "date") {
      const date = row.value as Date;
      return (
        <>
          <span className={cn(typeClass.date, "underline decoration-current/30 decoration-dotted underline-offset-[3px]")}>
            {highlight(text, query, isCurrent)}
          </span>
          {mounted && !Number.isNaN(date.getTime()) && (
            <span className="ml-2 hidden font-sans text-[11px] text-muted-foreground group-hover/row:inline group-data-[active=true]/row:inline">
              {formatDate(date)}
            </span>
          )}
        </>
      );
    }
    return (
      <span className={cn(typeClass[row.type], (row.type === "number" || row.type === "bigint") && "tabular-nums")}>
        {highlight(text, query, isCurrent)}
      </span>
    );
  };

  const renderRow = (row: Row) => {
    const indent = PAD + row.depth * INDENT;
    if (row.kind === "close") {
      return (
        <div
          key={row.id}
          aria-hidden="true"
          className="relative flex min-h-[22px] items-start pr-3"
          style={{ paddingLeft: indent }}
        >
          <Guides row={row} activeContainer={activeContainer} />
          <span className="w-4 shrink-0" />
          <span className="text-muted-foreground/70">
            {row.type === "array" ? "]" : "}"}
            {!row.last && ","}
          </span>
        </div>
      );
    }

    const isActive = row.id === tabStop;
    if (row.kind === "more") {
      return (
        <div
          key={row.id}
          ref={(node) => {
            if (node) rowRefs.current.set(row.id, node);
            else rowRefs.current.delete(row.id);
          }}
          role="treeitem"
          aria-level={row.depth + 1}
          aria-posinset={row.position}
          aria-setsize={row.setSize}
          aria-label={`${labels.showMoreItems(Math.min(pageSize, row.hidden))}, ${labels.hiddenItems(row.hidden)}`}
          tabIndex={isActive ? 0 : -1}
          data-slot="json-viewer-more"
          data-active={isActive && activeId !== null ? true : undefined}
          onFocus={() => setActiveId(row.id)}
          onClick={() => showMore(row)}
          className={cn(
            "group/row relative flex min-h-[26px] cursor-pointer items-center pr-3 outline-none",
            "focus-visible:bg-primary/[0.05] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset",
          )}
          style={{ paddingLeft: indent }}
        >
          <Guides row={row} activeContainer={activeContainer} />
          <span className="w-4 shrink-0" />
          <span className="inline-flex items-center gap-2 font-sans text-xs">
            <span className="rounded-md bg-muted px-1.5 py-px font-medium text-foreground/80 transition-colors group-hover/row:bg-primary/10 group-hover/row:text-primary">
              {labels.showMoreItems(Math.min(pageSize, row.hidden))}
            </span>
            <span className="text-muted-foreground tabular-nums">{labels.hiddenItems(row.hidden)}</span>
          </span>
        </div>
      );
    }

    const container = row.type === "object" || row.type === "array";
    const isMatch = matchSet.has(row.path);
    const isCurrent = isMatch && currentMatch?.path === row.path;
    const isSelected = selected === row.path;
    const keyText = row.key === null ? null : String(row.key);
    const keyHighlighted = typeof row.key === "string" && keyText !== null ? highlight(keyText, query, isCurrent) : keyText;
    const count = row.type === "array" ? labels.items(row.size) : labels.keys(row.size);
    const open = row.type === "array" ? "[" : "{";
    const close = row.type === "array" ? "]" : "}";
    const copiedValue = copied === `value:${row.path}`;
    const copiedPath = copied === `path:${row.path}`;

    return (
      <div
        key={row.id}
        ref={(node) => {
          if (node) rowRefs.current.set(row.id, node);
          else rowRefs.current.delete(row.id);
        }}
        role="treeitem"
        aria-level={row.depth + 1}
        aria-posinset={row.position}
        aria-setsize={row.setSize}
        aria-expanded={container && row.size ? row.expanded : undefined}
        aria-selected={isSelected}
        aria-label={container ? `${keyText ?? labels.root}, ${count}` : undefined}
        tabIndex={isActive ? 0 : -1}
        data-slot="json-viewer-node"
        data-type={row.type}
        data-path={row.path}
        data-match={isMatch ? (isCurrent ? "current" : "true") : undefined}
        data-selected={isSelected || undefined}
        data-active={isActive && activeId !== null ? true : undefined}
        onFocus={() => setActiveId(row.id)}
        onClick={() => {
          if (window.getSelection()?.toString()) return;
          setActiveId(row.id);
          select(row);
          if (container) toggle(row);
        }}
        className={cn(
          "group/row relative flex min-h-[22px] cursor-default items-start pr-3 outline-none",
          "hover:bg-muted/45 focus-visible:bg-primary/[0.05] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset",
          isSelected &&
            "bg-primary/[0.07] hover:bg-primary/[0.09] before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary",
          isCurrent && !isSelected && "bg-amber-400/[0.08]",
        )}
        style={{ paddingLeft: indent }}
      >
        <Guides row={row} activeContainer={activeContainer} />
        <span aria-hidden="true" className="flex h-[22px] w-4 shrink-0 items-center justify-center">
          {container && row.size > 0 && (
            <ChevronRight
              className={cn(
                "size-3.5 text-muted-foreground/80 transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:text-foreground motion-reduce:transition-none",
                row.expanded && "rotate-90",
              )}
              stroke={2}
            />
          )}
        </span>
        <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
          {keyText !== null && (
            <>
              <span
                className={cn(
                  row.inArray ? "text-muted-foreground/75 tabular-nums" : "text-foreground",
                  row.depth === 0 && "font-semibold",
                )}
              >
                {keyHighlighted}
              </span>
              <span className="text-muted-foreground/60">: </span>
            </>
          )}
          {container ? (
            row.expanded ? (
              <>
                <span className="text-muted-foreground/70">{open}</span>
                {row.type === "array" && (
                  <span className="ml-2 font-sans text-[11px] text-muted-foreground tabular-nums">{count}</span>
                )}
              </>
            ) : (
              <>
                <span className="text-muted-foreground/70">{open}</span>
                {row.size > 0 && (
                  <span className="mx-px rounded-[4px] bg-muted px-1 text-muted-foreground transition-colors group-hover/row:bg-primary/10 group-hover/row:text-primary">
                    …
                  </span>
                )}
                <span className="text-muted-foreground/70">
                  {close}
                  {!row.last && ","}
                </span>
                <span className="ml-2 font-sans text-[11px] text-muted-foreground tabular-nums">{count}</span>
              </>
            )
          ) : (
            <>
              {renderLeaf(row, isCurrent)}
              {!row.last && <span className="text-muted-foreground/70">,</span>}
            </>
          )}
        </span>
        {copyable && (
          <span
            data-slot="json-viewer-row-actions"
            className="absolute top-[2px] right-1.5 hidden items-center gap-px rounded-lg border border-border/70 bg-popover/90 p-px shadow-sm backdrop-blur-md group-hover/row:flex group-focus-visible/row:flex"
          >
            {row.path && (
              <button
                type="button"
                tabIndex={-1}
                aria-label={`${labels.copyPath} ${row.path}`}
                title={labels.copyPath}
                onClick={(event) => {
                  event.stopPropagation();
                  void copy(row.path, "path", row.path);
                }}
                className="inline-flex size-[18px] items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {copiedPath ? (
                  <Check className="size-3 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                ) : (
                  <Route className="size-3" aria-hidden="true" />
                )}
              </button>
            )}
            <button
              type="button"
              tabIndex={-1}
              aria-label={labels.copyValue}
              title={labels.copyValue}
              onClick={(event) => {
                event.stopPropagation();
                void copy(copyText(row.value, row.type), "value", row.path);
              }}
              className="inline-flex size-[18px] items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copiedValue ? (
                <Check className="size-3 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              ) : (
                <Copy className="size-3" aria-hidden="true" />
              )}
            </button>
          </span>
        )}
      </div>
    );
  };

  /* --------------------------------- Layout --------------------------------- */

  const iconButton = cn(
    "inline-flex h-7 min-w-7 items-center justify-center gap-1.5 rounded-md px-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
    focusRing,
  );
  const toolbarActions = (showToolbar || actions) && (
    <div className="flex shrink-0 items-center gap-0.5">
      {actions}
      {showToolbar && (
        <>
          <button type="button" onClick={expandAll} aria-label={labels.expandAll} title={labels.expandAll} className={iconButton}>
            <FoldDown className="size-4" aria-hidden="true" stroke={1.75} />
          </button>
          <button type="button" onClick={collapseAll} aria-label={labels.collapseAll} title={labels.collapseAll} className={iconButton}>
            <FoldUp className="size-4" aria-hidden="true" stroke={1.75} />
          </button>
          {copyable && (
            <button
              type="button"
              onClick={() => void copy(json, "json", rootPath)}
              aria-label={copied === `json:${rootPath}` ? labels.copied : labels.copyJson}
              title={labels.copyJson}
              className={iconButton}
            >
              {copied === `json:${rootPath}` ? (
                <Check className="size-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" stroke={1.75} />
              )}
              <span className="hidden @md/json:inline">
                {copied === `json:${rootPath}` ? labels.copied : labels.copyJson}
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );

  const searchField = showSearch && (
    <div
      data-slot="json-viewer-search"
      className={cn(
        "flex h-8 min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-muted/50 pr-1 pl-2.5 ring-1 ring-border/60 transition-[box-shadow,background-color] duration-150 ring-inset focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/30 focus-within:shadow-[0_0_14px_-4px_color-mix(in_oklab,var(--color-primary)_45%,transparent)] motion-reduce:transition-none",
      )}
    >
      <Search className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <input
        ref={searchRef}
        type="text"
        value={search}
        spellCheck={false}
        autoComplete="off"
        aria-label={labels.search}
        aria-controls={`${id}-tree`}
        placeholder={labels.search}
        onChange={(event) => {
          scrollOnResults.current = true;
          setSearch(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            goToMatch(event.shiftKey ? -1 : 1);
          } else if (event.key === "Escape" && search) {
            event.preventDefault();
            setSearch("");
          } else if (event.key === "ArrowDown" && currentMatch) {
            event.preventDefault();
            reveal(currentMatch);
            setFocusRequest({ id: currentMatch.path, tick: Date.now() });
          }
        }}
        className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
      />
      {query && (
        <>
          <span
            aria-live="polite"
            className={cn(
              "shrink-0 px-1 text-xs whitespace-nowrap tabular-nums",
              matches.length ? "text-muted-foreground" : "text-destructive",
            )}
          >
            {matches.length
              ? labels.matchCount(Math.min(current, matches.length - 1) + 1, matches.length)
              : labels.noMatches}
          </span>
          <span className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => goToMatch(-1)}
              disabled={!matches.length}
              aria-label={labels.previousMatch}
              title={`${labels.previousMatch} (Shift+Enter)`}
              className={cn(iconButton, "h-6 min-w-6 px-0")}
            >
              <ChevronUp className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goToMatch(1)}
              disabled={!matches.length}
              aria-label={labels.nextMatch}
              title={`${labels.nextMatch} (Enter)`}
              className={cn(iconButton, "h-6 min-w-6 px-0")}
            >
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </button>
          </span>
        </>
      )}
      {search && (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            searchRef.current?.focus();
          }}
          aria-label={labels.clearSearch}
          title={labels.clearSearch}
          className={cn(iconButton, "h-6 min-w-6 px-0")}
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );

  const meta = (
    <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">{formatBytes(bytes)}</span>
  );
  // The status bar follows focus, then the selection, then the root.
  const status =
    (active?.kind === "node" ? active : null) ??
    navigable.find((row) => row.kind === "node" && row.path === selected) ??
    navigable[0] ??
    null;
  const statusType = status
    ? status.type === "object"
      ? labels.keys(status.size)
      : status.type === "array"
        ? labels.items(status.size)
        : status.type === "string"
          ? labels.characters((status.value as string).length)
          : status.type
    : null;

  return (
    <div
      data-slot="json-viewer"
      className={cn(
        "@container/json flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
        className,
      )}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        const target = event.target as HTMLElement;
        if (
          event.key === "/" &&
          showSearch &&
          !event.defaultPrevented &&
          !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
        ) {
          event.preventDefault();
          searchRef.current?.focus();
        }
      }}
      {...props}
    >
      <style href="overtrue-json-viewer" precedence="default">
        {styles}
      </style>

      {(title || description) && (
        <div className="flex items-start gap-3 px-4 pt-3.5 pb-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-baseline gap-2">
              {title && <p className="truncate text-sm leading-6 font-semibold tracking-tight">{title}</p>}
              {meta}
            </div>
            {description && <p className="truncate text-[13px] leading-5 text-muted-foreground">{description}</p>}
          </div>
          {toolbarActions}
        </div>
      )}
      {(showSearch || (!title && !description && (showToolbar || actions))) && (
        <div
          data-slot="json-viewer-toolbar"
          className={cn("flex items-center gap-2 px-3 pb-3", title || description ? "pt-0" : "pt-3")}
        >
          {searchField || <span className="flex-1 pl-1">{meta}</span>}
          {!(title || description) && toolbarActions}
        </div>
      )}

      <div
        ref={scrollRef}
        className="relative min-h-0 flex-1 overflow-auto border-t border-border/60"
        style={{ maxHeight }}
      >
        <div
          ref={treeRef}
          id={`${id}-tree`}
          role="tree"
          aria-label={typeof title === "string" ? title : (rootName ?? labels.tree)}
          onKeyDown={handleTreeKeyDown}
          data-slot="json-viewer-tree"
          className="min-w-0 py-2 font-mono text-[12px] leading-[22px] [font-variant-ligatures:none] @md/json:text-[13px]"
        >
          {rows.map(renderRow)}
        </div>
      </div>

      {showStatusBar && (
        <div
          data-slot="json-viewer-status"
          className="flex h-9 shrink-0 items-center gap-2 border-t border-border/60 bg-muted/25 pr-1.5 pl-3"
        >
          {status ? (
            <>
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground/85 [font-variant-ligatures:none]" title={status.path}>
                {status.path || labels.root}
              </span>
              {statusType && (
                <span className="hidden shrink-0 text-[11px] text-muted-foreground tabular-nums @sm/json:inline">
                  {statusType}
                </span>
              )}
              {copyable && (
                <span className="flex shrink-0 items-center">
                  {status.path && (
                    <button
                      type="button"
                      onClick={() => void copy(status.path, "path", status.path)}
                      aria-label={copied === `path:${status.path}` ? labels.copied : labels.copyPath}
                      className={iconButton}
                    >
                      {copied === `path:${status.path}` ? (
                        <Check className="size-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                      ) : (
                        <Route className="size-3.5" aria-hidden="true" />
                      )}
                      <span className="hidden @md/json:inline">{labels.copyPath}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void copy(copyText(status.value, status.type), "value", status.path)}
                    aria-label={copied === `value:${status.path}` ? labels.copied : labels.copyValue}
                    className={iconButton}
                  >
                    {copied === `value:${status.path}` ? (
                      <Check className="size-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3.5" aria-hidden="true" />
                    )}
                    <span className="hidden @md/json:inline">{labels.copyValue}</span>
                  </button>
                </span>
              )}
            </>
          ) : (
            <span className="truncate text-xs text-muted-foreground">{labels.statusHint}</span>
          )}
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {copied ? labels.copied : ""}
      </span>
    </div>
  );
}
