"use client";

import * as React from "react";
import {
  IconAlertCircle as AlertCircle,
  IconCheck as Check,
  IconChevronRight as ChevronRight,
  IconLoader2 as Loader,
  IconMinus as Minus,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export interface TreeNodeState {
  /** 1 for root nodes. */
  level: number;
  expanded: boolean;
  selected: boolean;
  checked: TreeCheckedState;
  disabled: boolean;
  loading: boolean;
  /** The node's label matches the current filter. */
  match: boolean;
}

export interface TreeNode {
  id: string;
  /** Plain text, used for type-ahead, filtering and the accessible name. */
  label: string;
  /** An icon, or a function of the node's state, e.g. an open folder while expanded. */
  icon?: React.ReactNode | ((state: TreeNodeState) => React.ReactNode);
  children?: readonly TreeNode[];
  /** The node has children that load through `onLoadChildren` the first time it opens. */
  hasChildren?: boolean;
  /** Trailing content. Strings and numbers render as a quiet pill. */
  badge?: React.ReactNode;
  /** Can't be selected or checked. It can still be focused and expanded. */
  disabled?: boolean;
}

export type TreeCheckedState = boolean | "mixed";
export type TreeSelectionMode = "single" | "multiple" | "none";

export interface TreeViewLabels {
  tree: string;
  loading: string;
  loadingNode: (label: string) => string;
  loaded: (label: string, count: number) => string;
  loadError: string;
  loadErrorNode: (label: string) => string;
  retry: string;
  empty: string;
  noMatches: string;
  matches: (count: number) => string;
}

export interface TreeViewProps
  extends Omit<React.ComponentProps<"div">, "children" | "onSelect" | "defaultValue" | "defaultChecked" | "onChange"> {
  nodes: readonly TreeNode[];
  /** "single" (default), "multiple" with Shift and Cmd or Ctrl, or "none". */
  selectionMode?: TreeSelectionMode;
  /** Selected ids. Pass with `onSelectedChange` to control selection. */
  selected?: readonly string[];
  defaultSelected?: readonly string[];
  onSelectedChange?: (ids: string[]) => void;
  /** Called when a node is chosen by click, Enter or Space. */
  onSelect?: (node: TreeNode) => void;
  /** Expanded ids. Pass with `onExpandedChange` to control expansion. */
  expanded?: readonly string[];
  defaultExpanded?: readonly string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Show tri-state checkboxes that propagate down to children and up to parents. */
  checkable?: boolean;
  /** Fully checked ids, branches included. Pass with `onCheckedChange` to control them. */
  checked?: readonly string[];
  defaultChecked?: readonly string[];
  onCheckedChange?: (ids: string[]) => void;
  /** Loads the children of a node marked `hasChildren`. Return them, or update `nodes` yourself. */
  onLoadChildren?: (node: TreeNode) => Promise<readonly TreeNode[] | void>;
  /** Shows matching nodes and their ancestors, opened. Matches are highlighted. */
  filter?: string;
  filterFn?: (node: TreeNode, query: string) => boolean;
  /** Replace the label text; return undefined to keep it. The chevron, checkbox, icon and badge stay. */
  renderLabel?: (node: TreeNode, state: TreeNodeState) => React.ReactNode;
  /** Clicking or pressing Enter on a parent also opens or closes it. Defaults to true. */
  expandOnClick?: boolean;
  /** Vertical lines under each open parent. Defaults to true. */
  indentGuides?: boolean;
  /** Indent per level in pixels. Defaults to 16. */
  indent?: number;
  size?: "sm" | "default";
  labels?: Partial<TreeViewLabels>;
}

const LABELS: TreeViewLabels = {
  tree: "Tree",
  loading: "Loading…",
  loadingNode: (label) => `Loading ${label}`,
  loaded: (label, count) => `${label} loaded, ${count} ${count === 1 ? "item" : "items"}`,
  loadError: "Couldn't load",
  loadErrorNode: (label) => `Couldn't load ${label}`,
  retry: "Retry",
  empty: "Nothing here",
  noMatches: "No matches",
  matches: (count) => (count === 0 ? "No matches" : `${count} ${count === 1 ? "match" : "matches"}`),
};

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------------------------*/

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const EMPTY: readonly string[] = [];

const defaultFilter = (node: TreeNode, query: string) => node.label.toLowerCase().includes(query);

interface Info {
  node: TreeNode;
  parent: string | null;
  level: number;
}

interface Row {
  node: TreeNode;
  level: number;
  parent: string | null;
}

/** Fully checked ids after normalizing: a parent is checked exactly when all its children are. */
function computeChecks(
  roots: readonly TreeNode[],
  set: ReadonlySet<string>,
  childrenOf: (node: TreeNode) => readonly TreeNode[] | undefined,
) {
  const state = new Map<string, TreeCheckedState>();
  const visit = (node: TreeNode, inherited: boolean): TreeCheckedState => {
    const self = inherited || set.has(node.id);
    const kids = childrenOf(node);
    let value: TreeCheckedState = self;
    if (kids && kids.length) {
      const values = kids.map((kid) => visit(kid, self));
      value = values.every((v) => v === true) ? true : values.every((v) => v === false) ? false : "mixed";
    }
    state.set(node.id, value);
    return value;
  };
  for (const root of roots) visit(root, false);
  return state;
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  let at = lower.indexOf(query);
  if (at === -1) return text;
  const parts: React.ReactNode[] = [];
  let from = 0;
  while (at !== -1) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(
      <mark
        key={at}
        data-slot="tree-view-match"
        className="rounded-[3px] bg-amber-400/35 text-inherit dark:bg-amber-400/25"
      >
        {text.slice(at, at + query.length)}
      </mark>,
    );
    from = at + query.length;
    at = lower.indexOf(query, from);
  }
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}

// The focus ring sits on the row, not on the item that also wraps the children.
const styles = `@keyframes tree-view-shimmer{from{transform:translateX(-100%)}to{transform:translateX(200%)}}[data-slot="tree-view-item"]:focus-visible>[data-slot="tree-view-row"]{box-shadow:0 0 0 2px color-mix(in oklab,var(--color-ring) 50%,transparent)}`;

/* -------------------------------------------------------------------------------------------------
 * Collapse: animated height through grid rows, unmounted once closed
 * -----------------------------------------------------------------------------------------------*/

type Phase = "opening" | "open" | "closing" | "closed";

function Collapse({
  open,
  animate,
  children,
  guide,
  guideActive,
}: {
  open: boolean;
  animate: boolean;
  children: React.ReactNode;
  guide: number | null;
  guideActive: boolean;
}) {
  const [phase, setPhase] = React.useState<Phase>(open ? (animate ? "opening" : "open") : "closed");
  const [previous, setPrevious] = React.useState(open);
  if (open !== previous) {
    setPrevious(open);
    setPhase(open ? "opening" : "closing");
  }

  React.useEffect(() => {
    if (phase !== "opening" && phase !== "closing") return;
    const done = phase === "opening" ? "open" : "closed";
    if (reducedMotion()) {
      setPhase(done);
      return;
    }
    // Fallback for browsers that skip the transition.
    const timer = window.setTimeout(() => setPhase(done), 320);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === "closed") return null;
  return (
    <div
      data-slot="tree-view-collapse"
      data-state={open ? "open" : "closed"}
      inert={!open || undefined}
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget || event.propertyName !== "grid-template-rows") return;
        setPhase(open ? "open" : "closed");
      }}
      className={cn(
        "relative grid transition-[grid-template-rows,opacity] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        phase === "opening" && animate && "starting:grid-rows-[0fr] starting:opacity-0",
      )}
    >
      <div className={cn("relative min-h-0", phase !== "open" && "overflow-hidden")}>
        {guide !== null && (
          <span
            aria-hidden="true"
            data-slot="tree-view-guide"
            className={cn(
              "pointer-events-none absolute top-0 bottom-1 w-px transition-colors duration-150 motion-reduce:transition-none",
              guideActive ? "bg-foreground/20" : "bg-border",
            )}
            style={{ left: guide }}
          />
        )}
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * TreeView
 * -----------------------------------------------------------------------------------------------*/

/**
 * A hierarchical tree for files, permissions or navigation: animated expansion, indent guides,
 * single or multiple selection, tri-state checkboxes, lazy children, filtering and type-ahead.
 */
export function TreeView({
  nodes,
  selectionMode = "single",
  selected: selectedProp,
  defaultSelected = EMPTY,
  onSelectedChange,
  onSelect,
  expanded: expandedProp,
  defaultExpanded = EMPTY,
  onExpandedChange,
  checkable = false,
  checked: checkedProp,
  defaultChecked = EMPTY,
  onCheckedChange,
  onLoadChildren,
  filter = "",
  filterFn = defaultFilter,
  renderLabel,
  expandOnClick = true,
  indentGuides = true,
  indent = 16,
  size = "default",
  labels: labelsProp,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: TreeViewProps) {
  const labels = { ...LABELS, ...labelsProp };
  const id = React.useId();

  // Lazy children and their loading state.
  const [loaded, setLoaded] = React.useState<ReadonlyMap<string, readonly TreeNode[]>>(() => new Map());
  const [status, setStatus] = React.useState<ReadonlyMap<string, "loading" | "error">>(() => new Map());
  const childrenOf = React.useCallback(
    (node: TreeNode) => node.children ?? loaded.get(node.id),
    [loaded],
  );
  const isBranch = React.useCallback(
    (node: TreeNode) => {
      const kids = childrenOf(node);
      return kids ? kids.length > 0 : !!node.hasChildren;
    },
    [childrenOf],
  );

  // Index of every known node, in tree order.
  const { info, order } = React.useMemo(() => {
    const info = new Map<string, Info>();
    const order: string[] = [];
    const visit = (node: TreeNode, parent: string | null, level: number) => {
      info.set(node.id, { node, parent, level });
      order.push(node.id);
      for (const kid of childrenOf(node) ?? []) visit(kid, node.id, level + 1);
    };
    for (const root of nodes) visit(root, null, 1);
    return { info, order };
  }, [nodes, childrenOf]);

  /* ------------------------------- Controlled state ------------------------------- */

  const [expandedState, setExpandedState] = React.useState<readonly string[]>(defaultExpanded);
  const expandedList = expandedProp ?? expandedState;
  const expandedSet = React.useMemo(() => new Set(expandedList), [expandedList]);
  const setExpanded = (next: Set<string>) => {
    const list = order.filter((key) => next.has(key)).concat([...next].filter((key) => !info.has(key)));
    if (expandedProp === undefined) setExpandedState(list);
    onExpandedChange?.(list);
  };

  const [selectedState, setSelectedState] = React.useState<readonly string[]>(defaultSelected);
  const selectedList = selectionMode === "none" ? EMPTY : (selectedProp ?? selectedState);
  const selectedSet = React.useMemo(() => new Set(selectedList), [selectedList]);
  const setSelected = (ids: string[]) => {
    if (selectedProp === undefined) setSelectedState(ids);
    onSelectedChange?.(ids);
  };

  const [checkedState, setCheckedState] = React.useState<readonly string[]>(defaultChecked);
  const checkedList = checkedProp ?? checkedState;
  const checks = React.useMemo(
    () => (checkable ? computeChecks(nodes, new Set(checkedList), childrenOf) : null),
    [checkable, nodes, checkedList, childrenOf],
  );

  /* ------------------------------------ Filter ------------------------------------ */

  const query = filter.trim().toLowerCase();
  const filtering = query.length > 0;
  const { matches, keep, forced } = React.useMemo(() => {
    const matches = new Set<string>();
    const keep = new Set<string>();
    const forced = new Set<string>();
    if (!query) return { matches, keep, forced };
    for (const key of order) {
      const entry = info.get(key)!;
      if (!filterFn(entry.node, query)) continue;
      matches.add(key);
      keep.add(key);
      for (let parent = entry.parent; parent !== null; parent = info.get(parent)?.parent ?? null) {
        keep.add(parent);
        forced.add(parent);
      }
    }
    return { matches, keep, forced };
  }, [query, order, info, filterFn]);

  // Parents the person closed while filtering stay closed until the filter changes.
  const [filterClosed, setFilterClosed] = React.useState<ReadonlySet<string>>(() => new Set());
  const [lastQuery, setLastQuery] = React.useState(query);
  if (query !== lastQuery) {
    setLastQuery(query);
    setFilterClosed(new Set());
  }

  const isOpen = (node: TreeNode) =>
    isBranch(node) &&
    (expandedSet.has(node.id) || (filtering && forced.has(node.id) && !filterClosed.has(node.id)));

  /* ----------------------------------- Visible rows ----------------------------------- */

  // Children shown for a node: under a filter, only kept nodes unless an ancestor matched itself.
  const shownChildren = (node: TreeNode, insideMatch: boolean) => {
    const kids = childrenOf(node) ?? [];
    if (!filtering || insideMatch || matches.has(node.id)) return kids;
    return kids.filter((kid) => keep.has(kid.id));
  };

  const visible = React.useMemo(() => {
    const rows: Row[] = [];
    const visit = (list: readonly TreeNode[], level: number, parent: string | null, insideMatch: boolean) => {
      for (const node of list) {
        rows.push({ node, level, parent });
        if (isOpen(node)) visit(shownChildren(node, insideMatch), level + 1, node.id, insideMatch || matches.has(node.id));
      }
    };
    visit(filtering ? nodes.filter((node) => keep.has(node.id)) : nodes, 1, null, false);
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, childrenOf, expandedSet, filtering, matches, keep, forced, filterClosed, isBranch]);

  /* ------------------------------------ Focus ------------------------------------ */

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const visibleIds = React.useMemo(() => new Set(visible.map((row) => row.node.id)), [visible]);
  // The tab stop: the focused node, else its nearest visible ancestor, else the selection, else the first.
  let tabStop: string | null = null;
  for (let key = activeId; key !== null; key = info.get(key)?.parent ?? null) {
    if (visibleIds.has(key)) {
      tabStop = key;
      break;
    }
  }
  tabStop ??= selectedList.find((key) => visibleIds.has(key)) ?? visible[0]?.node.id ?? null;
  const activeParent = tabStop ? (info.get(tabStop)?.parent ?? null) : null;

  const itemRefs = React.useRef(new Map<string, HTMLLIElement>());
  const [focusRequest, setFocusRequest] = React.useState<{ id: string; tick: number } | null>(null);
  useIsoLayoutEffect(() => {
    if (focusRequest) itemRefs.current.get(focusRequest.id)?.focus();
  }, [focusRequest]);
  const focusNode = (key: string | undefined) => {
    if (!key) return;
    setActiveId(key);
    setFocusRequest({ id: key, tick: Date.now() });
  };

  // Children mounted after the first paint animate in; the initial tree renders open.
  const ready = React.useRef(false);
  React.useEffect(() => {
    ready.current = true;
  }, []);

  /* ----------------------------------- Announcements ----------------------------------- */

  const [announcement, setAnnouncement] = React.useState("");
  const announce = (text: string) => setAnnouncement((current) => (current === text ? `${text}\u00a0` : text));
  const lastAnnounced = React.useRef(query);
  React.useEffect(() => {
    if (query === lastAnnounced.current) return;
    lastAnnounced.current = query;
    if (query) announce(labels.matches(matches.size));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, matches.size]);

  /* ------------------------------------ Actions ------------------------------------ */

  const alive = React.useRef(true);
  React.useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const load = async (node: TreeNode) => {
    if (!onLoadChildren || status.get(node.id) === "loading") return;
    setStatus((current) => new Map(current).set(node.id, "loading"));
    announce(labels.loadingNode(node.label));
    try {
      const result = await onLoadChildren(node);
      if (!alive.current) return;
      if (Array.isArray(result)) setLoaded((current) => new Map(current).set(node.id, result));
      setStatus((current) => {
        const next = new Map(current);
        next.delete(node.id);
        return next;
      });
      announce(labels.loaded(node.label, Array.isArray(result) ? result.length : (node.children?.length ?? 0)));
    } catch {
      if (!alive.current) return;
      setStatus((current) => new Map(current).set(node.id, "error"));
      announce(labels.loadErrorNode(node.label));
    }
  };

  const needsLoad = (node: TreeNode) => !!node.hasChildren && !childrenOf(node) && !!onLoadChildren;

  const setOpen = (node: TreeNode, open: boolean) => {
    if (!isBranch(node)) return;
    if (open && needsLoad(node) && status.get(node.id) !== "loading") void load(node);
    if (filtering && forced.has(node.id)) {
      setFilterClosed((current) => {
        const next = new Set(current);
        if (open) next.delete(node.id);
        else next.add(node.id);
        return next;
      });
      if (!open) return;
    }
    if (expandedSet.has(node.id) === open) return;
    const next = new Set(expandedSet);
    if (open) next.add(node.id);
    else next.delete(node.id);
    setExpanded(next);
  };

  const toggleOpen = (node: TreeNode) => setOpen(node, !isOpen(node));

  const expandSiblings = (row: Row) => {
    const siblings = visible.filter((item) => item.parent === row.parent && isBranch(item.node));
    const next = new Set(expandedSet);
    for (const sibling of siblings) {
      next.add(sibling.node.id);
      if (needsLoad(sibling.node)) void load(sibling.node);
    }
    setExpanded(next);
  };

  const anchor = React.useRef<string | null>(null);
  const selectable = (node: TreeNode) => selectionMode !== "none" && !node.disabled;
  const choose = (node: TreeNode, mode: "replace" | "toggle" | "range") => {
    if (!selectable(node)) return;
    if (selectionMode === "single" || mode === "replace") {
      setSelected([node.id]);
      anchor.current = node.id;
    } else if (mode === "toggle") {
      const next = new Set(selectedSet);
      if (!next.delete(node.id)) next.add(node.id);
      setSelected(order.filter((key) => next.has(key)));
      anchor.current = node.id;
    } else {
      const ids = visible.map((row) => row.node.id);
      const from = ids.indexOf(anchor.current ?? node.id);
      const to = ids.indexOf(node.id);
      const [start, end] = from === -1 ? [to, to] : from < to ? [from, to] : [to, from];
      const range = visible.slice(start, end + 1).filter((row) => !row.node.disabled).map((row) => row.node.id);
      setSelected(range);
    }
    onSelect?.(node);
  };

  const toggleCheck = (node: TreeNode) => {
    if (!checkable || !checks || node.disabled) return;
    // Check everything that can change, unless all of it already is; locked nodes keep their state.
    const enabled = (item: TreeNode): TreeNode[] =>
      item.disabled ? [] : [item, ...(childrenOf(item) ?? []).flatMap(enabled)];
    const target = !enabled(node).every((item) => {
      const kids = childrenOf(item);
      return kids && kids.length ? true : checks.get(item.id) === true;
    });
    const next = new Set<string>();
    checks.forEach((value, key) => {
      if (value === true) next.add(key);
    });
    const apply = (item: TreeNode) => {
      if (item.disabled) return;
      if (target) next.add(item.id);
      else next.delete(item.id);
      for (const kid of childrenOf(item) ?? []) apply(kid);
    };
    apply(node);
    // A parent is checked exactly when every child is.
    const normalize = (item: TreeNode): boolean => {
      const kids = childrenOf(item);
      if (!kids || !kids.length) return next.has(item.id);
      const all = kids.map(normalize).every(Boolean);
      if (all) next.add(item.id);
      else next.delete(item.id);
      return all;
    };
    for (const root of nodes) normalize(root);
    const ids = order.filter((key) => next.has(key));
    if (checkedProp === undefined) setCheckedState(ids);
    onCheckedChange?.(ids);
  };

  /* ----------------------------------- Keyboard ----------------------------------- */

  const typeahead = React.useRef({ text: "", time: 0 });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    if (target.getAttribute("role") !== "treeitem") return;
    const current = target.getAttribute("data-node-id");
    const index = visible.findIndex((row) => row.node.id === current);
    const row = visible[index];
    if (!row) return;
    const { node } = row;
    const mod = event.metaKey || event.ctrlKey;
    let handled = true;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        const next = visible[Math.max(0, Math.min(visible.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)))];
        if (event.shiftKey && selectionMode === "multiple" && next) {
          anchor.current ??= node.id;
          choose(next.node, "range");
        }
        focusNode(next?.node.id);
        break;
      }
      case "Home":
        focusNode(visible[0]?.node.id);
        break;
      case "End":
        focusNode(visible[visible.length - 1]?.node.id);
        break;
      case "ArrowRight":
        if (isBranch(node)) {
          if (status.get(node.id) === "error") void load(node);
          else if (!isOpen(node)) setOpen(node, true);
          else if (visible[index + 1]?.parent === node.id) focusNode(visible[index + 1].node.id);
        }
        break;
      case "ArrowLeft":
        if (isOpen(node)) setOpen(node, false);
        else focusNode(row.parent ?? undefined);
        break;
      case "Enter":
        if (selectable(node)) {
          choose(node, "replace");
          if (isBranch(node) && expandOnClick) toggleOpen(node);
        } else if (isBranch(node)) toggleOpen(node);
        else if (checkable) toggleCheck(node);
        break;
      case " ":
        if (checkable) toggleCheck(node);
        else if (selectionMode === "multiple") choose(node, "toggle");
        else if (selectable(node)) choose(node, "replace");
        break;
      case "*":
        expandSiblings(row);
        break;
      default:
        if (mod && (event.key === "a" || event.key === "A") && selectionMode === "multiple") {
          setSelected(visible.filter((item) => !item.node.disabled).map((item) => item.node.id));
        } else if (event.key.length === 1 && !mod && !event.altKey && event.key !== " ") {
          const now = event.timeStamp;
          const state = typeahead.current;
          state.text = now - state.time > 600 ? event.key.toLowerCase() : state.text + event.key.toLowerCase();
          state.time = now;
          const repeated = [...state.text].every((char) => char === state.text[0]);
          const search = repeated ? state.text[0] : state.text;
          const start = repeated || state.text.length === 1 ? index + 1 : index;
          for (let step = 0; step < visible.length; step++) {
            const candidate = visible[(start + step) % visible.length];
            if (candidate.node.label.toLowerCase().startsWith(search)) {
              focusNode(candidate.node.id);
              break;
            }
          }
        } else handled = false;
    }
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  /* ------------------------------------ Render ------------------------------------ */

  const rowHeight = size === "sm" ? "h-6" : "h-7";
  const pad = 6;
  const chevronX = (level: number) => pad + (level - 1) * indent + 8;

  const renderRows = (list: readonly TreeNode[], level: number, insideMatch: boolean) =>
    list.map((node, position) => {
      const branch = isBranch(node);
      const open = isOpen(node);
      const selected = selectedSet.has(node.id);
      const checkedValue: TreeCheckedState = checks?.get(node.id) ?? false;
      const loading = status.get(node.id) === "loading";
      const failed = status.get(node.id) === "error";
      const disabled = !!node.disabled;
      const match = filtering && matches.has(node.id);
      const state: TreeNodeState = { level, expanded: open, selected, checked: checkedValue, disabled, loading, match };
      const icon = typeof node.icon === "function" ? node.icon(state) : node.icon;
      const custom = renderLabel?.(node, state);
      const isTabStop = node.id === tabStop;
      const labelId = `${id}-${node.id}-label`;
      const badgeId = `${id}-${node.id}-badge`;
      const kids = branch ? shownChildren(node, insideMatch) : [];
      const childInsideMatch = insideMatch || matches.has(node.id);

      return (
        <li
          key={node.id}
          ref={(element) => {
            if (element) itemRefs.current.set(node.id, element);
            else itemRefs.current.delete(node.id);
          }}
          role="treeitem"
          aria-level={level}
          aria-posinset={position + 1}
          aria-setsize={list.length}
          aria-expanded={branch ? open : undefined}
          aria-selected={selectionMode === "none" ? undefined : selected}
          aria-checked={checkable ? (checkedValue === "mixed" ? "mixed" : checkedValue) : undefined}
          aria-disabled={disabled || undefined}
          aria-busy={loading || undefined}
          aria-labelledby={node.badge != null ? `${labelId} ${badgeId}` : labelId}
          tabIndex={isTabStop ? 0 : -1}
          data-slot="tree-view-item"
          data-node-id={node.id}
          data-state={branch ? (open ? "open" : "closed") : undefined}
          data-selected={selected || undefined}
          data-checked={checkable ? String(checkedValue) : undefined}
          data-disabled={disabled || undefined}
          data-match={match || undefined}
          onFocus={(event) => {
            if (event.target === event.currentTarget) setActiveId(node.id);
          }}
          className="group/item outline-none"
        >
          <div
            data-slot="tree-view-row"
            data-selected={selected || undefined}
            onClick={(event) => {
              const part = (event.target as Element).closest("[data-tree-part]")?.getAttribute("data-tree-part");
              setActiveId(node.id);
              if (part === "chevron") {
                toggleOpen(node);
                return;
              }
              if (part === "checkbox") {
                toggleCheck(node);
                return;
              }
              const mod = event.metaKey || event.ctrlKey;
              if (selectable(node)) choose(node, event.shiftKey ? "range" : mod ? "toggle" : "replace");
              else if (checkable && !branch) toggleCheck(node);
              if (branch && expandOnClick && !mod && !event.shiftKey) toggleOpen(node);
            }}
            className={cn(
              "group/row relative flex cursor-default items-center gap-1.5 rounded-lg pr-2 select-none",
              rowHeight,
              size === "sm" ? "text-xs" : "text-[13px]",
              "transition-[background-color,box-shadow] duration-150 motion-reduce:transition-none",
              "hover:bg-muted/70 dark:hover:bg-muted/50",
              selected &&
                "bg-primary/[0.09] text-foreground hover:bg-primary/[0.12] dark:bg-primary/[0.16] dark:hover:bg-primary/20",
            )}
            style={{ paddingLeft: pad + (level - 1) * indent }}
          >
            <span
              data-tree-part={branch ? "chevron" : undefined}
              aria-hidden="true"
              className="flex size-4 shrink-0 items-center justify-center"
            >
              {branch &&
                (loading ? (
                  <Loader className="size-3.5 text-muted-foreground motion-safe:animate-spin" stroke={2} />
                ) : (
                  <ChevronRight
                    className={cn(
                      "size-3.5 text-muted-foreground/80 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:text-foreground motion-reduce:transition-none",
                      open && "rotate-90",
                    )}
                    stroke={2}
                  />
                ))}
            </span>
            {checkable && (
              <span
                data-tree-part="checkbox"
                data-slot="tree-view-checkbox"
                data-state={checkedValue === "mixed" ? "indeterminate" : checkedValue ? "checked" : "unchecked"}
                aria-hidden="true"
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-[5px] border shadow-xs transition-[background-color,border-color,box-shadow] duration-150 motion-reduce:transition-none",
                  checkedValue
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-card group-hover/row:border-foreground/30",
                  disabled && "opacity-50",
                )}
              >
                {checkedValue === "mixed" ? (
                  <Minus className="size-3" stroke={3} />
                ) : checkedValue ? (
                  <Check className="size-3" stroke={3} />
                ) : null}
              </span>
            )}
            {icon != null && (
              <span
                data-slot="tree-view-icon"
                aria-hidden="true"
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4",
                  selected && "text-primary",
                  disabled && "opacity-50",
                )}
              >
                {icon}
              </span>
            )}
            <span
              id={labelId}
              data-slot="tree-view-label"
              className={cn(
                "min-w-0 flex-1 truncate",
                disabled ? "text-muted-foreground" : "text-foreground",
                filtering && !match && "text-muted-foreground",
              )}
            >
              {custom !== undefined ? custom : highlight(node.label, filtering ? query : "")}
            </span>
            {node.badge != null && (
              <span id={badgeId} data-slot="tree-view-badge" className="ml-auto flex shrink-0 items-center">
                {typeof node.badge === "string" || typeof node.badge === "number" ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-muted px-1.5 text-[11px] font-medium text-muted-foreground tabular-nums">
                    {node.badge}
                  </span>
                ) : (
                  node.badge
                )}
              </span>
            )}
          </div>
          {branch && (
            <Collapse
              open={open}
              animate={ready.current}
              guide={indentGuides ? chevronX(level) - 0.5 : null}
              guideActive={activeParent === node.id}
            >
              <ul role="group" data-slot="tree-view-group">
                {loading && !kids.length ? (
                  <li
                    role="none"
                    data-slot="tree-view-loading"
                    className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", rowHeight)}
                    style={{ paddingLeft: pad + level * indent + 16 + 6 }}
                  >
                    <span className="relative flex h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                      <span className="absolute inset-y-0 w-1/2 rounded-full bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-foreground)_14%,transparent),transparent)] motion-safe:animate-[tree-view-shimmer_1.1s_ease-in-out_infinite]" />
                    </span>
                    {labels.loading}
                  </li>
                ) : failed && !kids.length ? (
                  <li
                    role="none"
                    data-slot="tree-view-error"
                    className={cn("flex items-center gap-2 text-xs", rowHeight)}
                    style={{ paddingLeft: pad + level * indent + 16 + 6 }}
                  >
                    <AlertCircle className="size-3.5 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" stroke={1.75} />
                    <span className="text-rose-700 dark:text-rose-400">{labels.loadError}</span>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => void load(node)}
                      className="rounded-md px-1.5 py-0.5 font-medium text-foreground underline decoration-foreground/30 underline-offset-2 transition-colors hover:bg-muted hover:decoration-foreground"
                    >
                      {labels.retry}
                    </button>
                  </li>
                ) : (
                  renderRows(kids, level + 1, childInsideMatch)
                )}
              </ul>
            </Collapse>
          )}
        </li>
      );
    });

  const roots = filtering ? nodes.filter((node) => keep.has(node.id)) : nodes;

  return (
    <div data-slot="tree-view" className={cn("relative min-w-0", className)} {...props}>
      <style href="overtrue-tree-view" precedence="default">
        {styles}
      </style>
      <ul
        role="tree"
        aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? labels.tree)}
        aria-labelledby={ariaLabelledBy}
        aria-multiselectable={selectionMode === "multiple" || undefined}
        data-slot="tree-view-tree"
        data-filtering={filtering || undefined}
        onKeyDown={handleKeyDown}
        className="p-1"
      >
        {roots.length ? (
          renderRows(roots, 1, false)
        ) : (
          <li role="none" data-slot="tree-view-empty" className="px-3 py-6 text-center text-[13px] text-muted-foreground">
            {filtering ? labels.noMatches : labels.empty}
          </li>
        )}
      </ul>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
