"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  IconCheck,
  IconChevronDown,
  IconLoader2,
  IconPlus,
  IconX,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

export interface MultiSelectOption {
  value: string;
  label: string;
  /** A second line under the label. */
  description?: string;
  /** A glyph shown before the label, such as an icon. */
  icon?: React.ReactNode;
  /** An image URL or node shown in a round frame, for people and teams. */
  avatar?: string | React.ReactNode;
  /** Options sharing a group render under one heading, in first-seen order. */
  group?: string;
  disabled?: boolean;
  /** Extra words the search matches. */
  keywords?: string[];
}

export type MultiSelectAction =
  | "select"
  | "remove"
  | "clear"
  | "create"
  | "select-group"
  | "clear-group";

export interface MultiSelectChangeDetails {
  action: MultiSelectAction;
  /** The options added or removed by this change. */
  options: MultiSelectOption[];
}

export interface MultiSelectOptionState {
  selected: boolean;
  active: boolean;
  disabled: boolean;
  query: string;
}

export interface MultiSelectChipState {
  disabled: boolean;
  remove: () => void;
}

export interface MultiSelectLabels {
  placeholder: string;
  listbox: string;
  empty: string;
  emptyQuery: (query: string) => string;
  loading: string;
  loadError: string;
  create: (query: string) => string;
  selectAll: string;
  clearGroup: string;
  selectGroup: (group: string, count: number) => string;
  clearGroupLabel: (group: string) => string;
  clearAll: string;
  toggle: string;
  remove: (label: string) => string;
  more: (count: number) => string;
  moreLabel: (count: number, names: string) => string;
  selected: (count: number, max?: number) => string;
  limitReached: string;
  results: (count: number) => string;
  added: (label: string) => string;
  removed: (label: string) => string;
  cleared: string;
}

export interface MultiSelectProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> {
  options?: MultiSelectOption[];
  /** Controlled selection. Leave undefined to let the component manage it. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], details: MultiSelectChangeDetails) => void;
  /** Loads options for a query. Results replace `options` while it is in use. */
  loadOptions?: (
    query: string,
    context: { signal: AbortSignal },
  ) => Promise<MultiSelectOption[]>;
  /** Debounce for `loadOptions` while typing, in milliseconds. Defaults to 200. */
  loadDelay?: number;
  /** Offer to create an option from the query when nothing matches it exactly. */
  creatable?: boolean;
  /**
   * Called with the trimmed query. Return an option, a value string, or nothing
   * to use the query as both value and label. Async results are awaited.
   */
  onCreate?: (
    query: string,
  ) =>
    | MultiSelectOption
    | string
    | void
    | Promise<MultiSelectOption | string | void>;
  /** Most options that can be selected. */
  maxSelected?: number;
  disabled?: boolean;
  placeholder?: string;
  /** Controlled or initial open state of the list. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Called as the search text changes, for filtering elsewhere. */
  onSearchChange?: (query: string) => void;
  /**
   * Render the list in place under the field, with no portal, for documentation,
   * sheets, and previews. It is positioned absolutely, so leave room below.
   */
  inline?: boolean;
  /**
   * How chips overflow: "auto" fits them on one line and folds the rest into
   * "+3"; a number shows at most that many; false wraps every chip.
   */
  collapse?: "auto" | number | false;
  /** Offer select all in group headings. Defaults to true. */
  groupSelectAll?: boolean;
  /** Keep the list open after a pick. Defaults to true. */
  keepOpen?: boolean;
  /** Replaces the search match. Defaults to every word in label, description, value, group, or keywords. */
  filter?: (option: MultiSelectOption, query: string) => boolean;
  renderOption?: (option: MultiSelectOption, state: MultiSelectOptionState) => React.ReactNode;
  /** Replaces a chip's icon and label. The remove button stays. */
  renderChip?: (option: MultiSelectOption, state: MultiSelectChipState) => React.ReactNode;
  size?: "sm" | "default";
  align?: "start" | "end";
  /** Adds one hidden input per value under this name. */
  name?: string;
  /** Marks the field invalid. */
  invalid?: boolean;
  labels?: Partial<MultiSelectLabels>;
  /** Classes for the field and the list panel. */
  fieldClassName?: string;
  contentClassName?: string;
}

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

const defaultLabels: MultiSelectLabels = {
  placeholder: "Select…",
  listbox: "Options",
  empty: "No options",
  emptyQuery: (query) => `No matches for “${query}”`,
  loading: "Loading…",
  loadError: "Couldn't load options",
  create: (query) => `Create “${query}”`,
  selectAll: "Select all",
  clearGroup: "Clear",
  selectGroup: (group, count) => `Select all ${count} in ${group}`,
  clearGroupLabel: (group) => `Clear ${group}`,
  clearAll: "Clear all",
  toggle: "Show options",
  remove: (label) => `Remove ${label}`,
  more: (count) => `+${count}`,
  moreLabel: (count, names) => `Show ${count} more: ${names}`,
  selected: (count, max) =>
    max !== undefined ? `${count} of ${max} selected` : `${count} selected`,
  limitReached: "Limit reached",
  results: (count) =>
    count === 0 ? "No results" : `${count} result${count === 1 ? "" : "s"}`,
  added: (label) => `${label} added`,
  removed: (label) => `${label} removed`,
  cleared: "Selection cleared",
};

function searchText(option: MultiSelectOption) {
  return [
    option.label,
    option.description,
    option.value,
    option.group,
    ...(option.keywords ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function defaultFilter(option: MultiSelectOption, query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const text = searchText(option);
  return words.every((word) => text.includes(word));
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Bolds the parts of a label the query matched. */
function highlight(text: string, query: string) {
  const words = query.trim().split(/\s+/).filter(Boolean).map(escapeRegExp);
  if (!words.length) return text;
  const parts = text.split(new RegExp(`(${words.join("|")})`, "gi"));
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} className="bg-transparent font-semibold text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

type Row =
  | { kind: "group"; key: string; group: string; options: MultiSelectOption[] }
  | { kind: "option"; key: string; option: MultiSelectOption }
  | { kind: "create"; key: string; query: string };

const keyframes = `@keyframes multi-select-in{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:none}}@keyframes multi-select-chip-in{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}`;

const panelSurface =
  "flex flex-col overflow-hidden rounded-xl border border-border/70 bg-popover/90 text-popover-foreground shadow-xl backdrop-blur-md outline-none motion-safe:animate-[multi-select-in_180ms_cubic-bezier(0.22,1,0.36,1)]";

function Avatar({ avatar, className }: { avatar: string | React.ReactNode; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted [&>*]:size-full",
        className,
      )}
    >
      {typeof avatar === "string" ? (
        <img src={avatar} alt="" draggable={false} className="size-full object-cover" />
      ) : (
        avatar
      )}
      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-foreground/10 ring-inset" />
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Multi-select                                                              */
/* ------------------------------------------------------------------------ */

/** A combobox for picking many values, with chips, grouped options, search, and creation. */
export function MultiSelect({
  options: optionsProp,
  value: valueProp,
  defaultValue,
  onValueChange,
  loadOptions,
  loadDelay = 200,
  creatable = false,
  onCreate,
  maxSelected,
  disabled = false,
  placeholder,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSearchChange,
  inline = false,
  collapse = "auto",
  groupSelectAll = true,
  keepOpen = true,
  filter = defaultFilter,
  renderOption,
  renderChip,
  size = "default",
  align = "start",
  name,
  invalid,
  labels: labelsProp,
  className,
  fieldClassName,
  contentClassName,
  id: idProp,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  ...props
}: MultiSelectProps) {
  const labels: MultiSelectLabels = { ...defaultLabels, ...labelsProp };
  const baseId = React.useId();
  const inputId = idProp ?? `${baseId}-input`;
  const listboxId = `${baseId}-listbox`;
  const summaryId = `${baseId}-summary`;
  const rowId = (index: number) => `${baseId}-row-${index}`;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const areaRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  /* ---- Value ---- */
  const [valueState, setValueState] = React.useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? valueState;
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const selected = React.useMemo(() => new Set(value), [value]);

  /* ---- Known options, so chips keep their labels after the list changes ---- */
  const known = React.useRef(new Map<string, MultiSelectOption>());
  const [created, setCreated] = React.useState<MultiSelectOption[]>([]);
  for (const option of optionsProp ?? []) known.current.set(option.value, option);
  for (const option of created) if (!known.current.has(option.value)) known.current.set(option.value, option);
  const optionFor = (v: string): MultiSelectOption => known.current.get(v) ?? { value: v, label: v };

  /* ---- Open ---- */
  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = !disabled && (openProp ?? openState);
  const openRef = React.useRef(open);
  openRef.current = open;
  const setOpen = (next: boolean) => {
    if (next === openRef.current || (next && disabled)) return;
    openRef.current = next;
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
    if (!next) setActiveKey(null);
  };

  /* ---- Query ---- */
  const [query, setQueryState] = React.useState("");
  const setQuery = (next: string) => {
    setQueryState(next);
    onSearchChange?.(next);
  };
  const trimmed = query.trim();

  /* ---- Async options ---- */
  const [loaded, setLoaded] = React.useState<MultiSelectOption[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [loadError, setLoadError] = React.useState(false);
  const loadRef = React.useRef(loadOptions);
  loadRef.current = loadOptions;
  const hasLoader = !!loadOptions;
  React.useEffect(() => {
    if (!hasLoader || !open) return;
    const controller = new AbortController();
    // Show the spinner while the debounce waits, so typing gets feedback at once.
    setLoading(true);
    const timer = window.setTimeout(
      async () => {
        setLoadError(false);
        try {
          const result = await loadRef.current!(trimmed, { signal: controller.signal });
          if (controller.signal.aborted) return;
          for (const option of result) known.current.set(option.value, option);
          setLoaded(result);
          setLoading(false);
        } catch {
          if (controller.signal.aborted) return;
          setLoadError(true);
          setLoading(false);
        }
      },
      trimmed ? loadDelay : 0,
    );
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [hasLoader, open, trimmed, loadDelay]);

  /* ---- Visible options ---- */
  const source = React.useMemo(() => {
    const base = hasLoader && loaded ? loaded : (optionsProp ?? []);
    const seen = new Set(base.map((option) => option.value));
    return [...base, ...created.filter((option) => !seen.has(option.value))];
  }, [hasLoader, loaded, optionsProp, created]);
  const visible =
    hasLoader && loaded
      ? source
      : trimmed
        ? source.filter((option) => filter(option, trimmed))
        : source;

  const atLimit = maxSelected !== undefined && value.length >= maxSelected;
  const exactMatch = trimmed
    ? [...known.current.values()].some(
        (option) => option.label.toLowerCase() === trimmed.toLowerCase() || option.value === trimmed,
      )
    : true;
  const canCreate = creatable && !!trimmed && !exactMatch && !loading;

  /* ---- Rows ---- */
  const { sections, rows, createRow } = React.useMemo(() => {
    const order: (string | undefined)[] = [];
    const byGroup = new Map<string | undefined, MultiSelectOption[]>();
    for (const option of visible) {
      if (!byGroup.has(option.group)) {
        byGroup.set(option.group, []);
        order.push(option.group);
      }
      byGroup.get(option.group)!.push(option);
    }
    const flat: Row[] = [];
    const list = order.map((group) => {
      const groupOptions = byGroup.get(group)!;
      let header: Row | undefined;
      if (group && groupSelectAll && groupOptions.filter((option) => !option.disabled).length > 1) {
        header = { kind: "group", key: `g:${group}`, group, options: groupOptions };
        flat.push(header);
      }
      const items = groupOptions.map((option): Row => ({ kind: "option", key: `o:${option.value}`, option }));
      flat.push(...items);
      return { group, header, items };
    });
    let create: Extract<Row, { kind: "create" }> | undefined;
    if (canCreate) {
      create = { kind: "create", key: "c", query: trimmed };
      flat.push(create);
    }
    return { sections: list, rows: flat, createRow: create };
  }, [visible, groupSelectAll, canCreate, trimmed]);

  const groupInfo = (options: MultiSelectOption[]) => {
    const selectable = options.filter((option) => !option.disabled);
    const chosen = selectable.filter((option) => selected.has(option.value)).length;
    const all = chosen === selectable.length;
    const missing = selectable.length - chosen;
    const blocked = !all && maxSelected !== undefined && value.length + missing > maxSelected;
    return { selectable, chosen, all, blocked };
  };

  const isRowDisabled = (row: Row) => {
    if (disabled) return true;
    if (row.kind === "option")
      return !!row.option.disabled || (atLimit && !selected.has(row.option.value));
    if (row.kind === "group") return groupInfo(row.options).blocked;
    return atLimit;
  };

  /* ---- Active row ---- */
  const [activeKey, setActiveKey] = React.useState<string | null>(null);
  const [engaged, setEngaged] = React.useState(false);
  const fallbackIndex = (() => {
    const option = rows.findIndex((row) => row.kind === "option" && !isRowDisabled(row));
    if (option >= 0) return option;
    return rows.findIndex((row) => !isRowDisabled(row));
  })();
  const keyedIndex = activeKey ? rows.findIndex((row) => row.key === activeKey) : -1;
  const activeIndex = keyedIndex >= 0 ? keyedIndex : fallbackIndex;
  const activeRow = activeIndex >= 0 ? rows[activeIndex] : undefined;
  const showActive = engaged && open;

  const scrollToRow = (index: number) => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-row="${index}"]`);
    if (!list || !el) return;
    // Scroll the list only, never the page.
    const label = el.previousElementSibling?.hasAttribute("data-group-label")
      ? (el.previousElementSibling as HTMLElement)
      : el;
    const top = label.offsetTop - 4;
    const bottom = el.offsetTop + el.offsetHeight + 4;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  };

  const move = (delta: number) => {
    if (!rows.length) return;
    let index = activeIndex;
    for (let step = 0; step < rows.length; step++) {
      index = (index + delta + rows.length) % rows.length;
      if (!isRowDisabled(rows[index])) break;
    }
    setActiveKey(rows[index].key);
    setEngaged(true);
    requestAnimationFrame(() => scrollToRow(index));
  };

  /* ---- Announcements ---- */
  const [announcement, setAnnouncement] = React.useState("");
  const announce = (message: string) => setAnnouncement((current) => (current === message ? `${message} ` : message));
  React.useEffect(() => {
    if (!open || !trimmed || loading) return;
    const count = rows.filter((row) => row.kind === "option").length;
    const timer = window.setTimeout(() => announce(labels.results(count)), 450);
    return () => window.clearTimeout(timer);
  }, [open, trimmed, loading, rows.length]);

  /* ---- Changes ---- */
  const commit = (next: string[], details: MultiSelectChangeDetails) => {
    valueRef.current = next;
    if (valueProp === undefined) setValueState(next);
    onValueChange?.(next, details);
  };

  const afterPick = () => {
    if (query) setQuery("");
    if (!keepOpen) setOpen(false);
  };

  const toggleOption = (option: MultiSelectOption) => {
    if (disabled || option.disabled) return;
    const current = valueRef.current;
    if (current.includes(option.value)) {
      commit(current.filter((v) => v !== option.value), { action: "remove", options: [option] });
      announce(labels.removed(option.label));
    } else {
      if (maxSelected !== undefined && current.length >= maxSelected) {
        announce(labels.limitReached);
        return;
      }
      commit([...current, option.value], { action: "select", options: [option] });
      announce(labels.added(option.label));
    }
    afterPick();
  };

  const toggleGroup = (group: string, options: MultiSelectOption[]) => {
    const info = groupInfo(options);
    const current = valueRef.current;
    if (info.all) {
      const leaving = new Set(info.selectable.map((option) => option.value));
      commit(current.filter((v) => !leaving.has(v)), { action: "clear-group", options: info.selectable });
      announce(labels.clearGroupLabel(group));
    } else {
      if (info.blocked) {
        announce(labels.limitReached);
        return;
      }
      const adding = info.selectable.filter((option) => !current.includes(option.value));
      commit([...current, ...adding.map((option) => option.value)], { action: "select-group", options: adding });
      announce(labels.selectGroup(group, info.selectable.length));
    }
  };

  const createOption = async (text: string) => {
    if (disabled || atLimit) return;
    let option: MultiSelectOption = { value: text, label: text };
    if (onCreate) {
      const result = await onCreate(text);
      if (typeof result === "string") option = { value: result, label: text };
      else if (result && typeof result === "object") option = result;
    }
    known.current.set(option.value, option);
    setCreated((list) => (list.some((item) => item.value === option.value) ? list : [...list, option]));
    const current = valueRef.current;
    if (!current.includes(option.value)) {
      if (maxSelected !== undefined && current.length >= maxSelected) return;
      commit([...current, option.value], { action: "create", options: [option] });
    }
    announce(labels.added(option.label));
    setActiveKey(`o:${option.value}`);
    afterPick();
  };

  const activate = (row: Row) => {
    if (isRowDisabled(row)) return;
    if (row.kind === "option") toggleOption(row.option);
    else if (row.kind === "group") toggleGroup(row.group, row.options);
    else void createOption(row.query);
  };

  const removeValue = (v: string) => {
    const option = optionFor(v);
    commit(valueRef.current.filter((item) => item !== v), { action: "remove", options: [option] });
    announce(labels.removed(option.label));
  };

  const clearAll = () => {
    const leaving = valueRef.current.map(optionFor);
    commit([], { action: "clear", options: leaving });
    announce(labels.cleared);
    setExpanded(false);
    inputRef.current?.focus();
  };

  /* ---- Chips ---- */
  const [expanded, setExpanded] = React.useState(false);
  const [fit, setFit] = React.useState(Number.POSITIVE_INFINITY);
  const autoCollapse = collapse === "auto" && !expanded;
  const valueKey = value.join("\u0000");
  useIsoLayoutEffect(() => {
    if (!autoCollapse) return;
    const area = areaRef.current;
    const measure = measureRef.current;
    if (!area || !measure) return;
    const compute = () => {
      const widths = Array.from(measure.querySelectorAll<HTMLElement>("[data-measure-chip]")).map(
        (el) => el.getBoundingClientRect().width,
      );
      const more = measure.querySelector<HTMLElement>("[data-measure-more]")?.getBoundingClientRect().width ?? 32;
      const available = area.clientWidth;
      const gap = 4;
      const input = 48;
      let used = 0;
      let count = 0;
      for (let i = 0; i < widths.length; i++) {
        const next = used + widths[i] + gap;
        const rest = widths.length - (i + 1);
        if (next + (rest > 0 ? more + gap : 0) + input > available) break;
        used = next;
        count = i + 1;
      }
      setFit(Math.max(1, count));
    };
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(area);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [autoCollapse, valueKey, size]);

  const wrap = collapse !== "auto" || expanded;
  const visibleCount =
    collapse === false || expanded
      ? value.length
      : collapse === "auto"
        ? Math.min(fit, value.length)
        : Math.min(Math.max(0, collapse), value.length);
  const hidden = value.slice(visibleCount);

  const chipTargets = () =>
    Array.from(fieldRef.current?.querySelectorAll<HTMLElement>("[data-chip-target]") ?? []);
  const focusChip = (index: number) => {
    const targets = chipTargets();
    if (!targets.length || index >= targets.length) inputRef.current?.focus();
    else targets[Math.max(0, index)]?.focus();
  };

  const onChipKeyDown = (event: React.KeyboardEvent<HTMLElement>, v?: string) => {
    const targets = chipTargets();
    const index = targets.indexOf(event.currentTarget);
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (index > 0) targets[index - 1].focus();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusChip(index + 1);
    } else if ((event.key === "Backspace" || event.key === "Delete") && v !== undefined) {
      event.preventDefault();
      removeValue(v);
      requestAnimationFrame(() => focusChip(event.key === "Backspace" ? index - 1 : index));
    } else if (event.key === "Escape" || event.key === "ArrowDown") {
      event.preventDefault();
      inputRef.current?.focus();
      if (event.key === "ArrowDown") setOpen(true);
    } else if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      inputRef.current?.focus();
      setQuery(query + event.key);
      setOpen(true);
    }
  };

  /* ---- Input keys ---- */
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    const input = event.currentTarget;
    const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setEngaged(true);
        if (!open) setOpen(true);
        else move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        setEngaged(true);
        if (!open) {
          setOpen(true);
          const last = [...rows].reverse().find((row) => !isRowDisabled(row));
          if (last) setActiveKey(last.key);
        } else move(-1);
        break;
      case "PageDown":
      case "PageUp":
        if (!open) return;
        event.preventDefault();
        move(event.key === "PageDown" ? 8 : -8);
        break;
      case "Enter":
        if (!open) {
          if (!query) return;
          event.preventDefault();
          setOpen(true);
          return;
        }
        event.preventDefault();
        if (activeRow) activate(activeRow);
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        } else if (query) {
          event.preventDefault();
          setQuery("");
        }
        break;
      case "Backspace":
        if (!query && atStart && value.length) {
          event.preventDefault();
          removeValue(value[value.length - 1]);
        }
        break;
      case "ArrowLeft":
        if (atStart && chipTargets().length) {
          event.preventDefault();
          const targets = chipTargets();
          targets[targets.length - 1].focus();
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  /* ---- Outside interaction for the inline list ---- */
  React.useEffect(() => {
    if (!inline || !open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  /* ---- Render pieces ---- */
  const chipHeight = size === "sm" ? "h-5" : "h-6";
  const summary = value.length
    ? `${labels.selected(value.length, maxSelected)}: ${value.map((v) => optionFor(v).label).join(", ")}`
    : "";

  const renderChipBody = (option: MultiSelectOption, remove: () => void) =>
    renderChip ? (
      renderChip(option, { disabled, remove })
    ) : (
      <>
        {option.avatar !== undefined ? (
          <Avatar avatar={option.avatar} className={size === "sm" ? "size-3.5" : "size-4"} />
        ) : option.icon ? (
          <span aria-hidden="true" className="flex size-3.5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-3.5">
            {option.icon}
          </span>
        ) : null}
        <span className="min-w-0 truncate">{option.label}</span>
      </>
    );

  const chipClass = (option: MultiSelectOption) =>
    cn(
      "inline-flex max-w-[12rem] min-w-0 shrink items-center gap-1 rounded-md bg-muted/70 pe-0.5 text-xs font-medium text-foreground ring-1 ring-border/60 transition-[background-color,box-shadow] duration-150 ring-inset dark:bg-muted motion-reduce:transition-none",
      // Keyboard focus lands on the remove button; light the whole chip.
      "has-[[data-chip-target]:focus-visible]:bg-primary/10 has-[[data-chip-target]:focus-visible]:ring-2 has-[[data-chip-target]:focus-visible]:ring-primary/40",
      option.avatar !== undefined ? "ps-1" : "ps-1.5",
      disabled && "pe-1.5",
      chipHeight,
    );

  const chips = value.slice(0, visibleCount).map((v) => {
    const option = optionFor(v);
    const remove = () => {
      removeValue(v);
      inputRef.current?.focus();
    };
    return (
      <span
        key={v}
        data-slot="multi-select-chip"
        data-value={v}
        className={cn(chipClass(option), "motion-safe:animate-[multi-select-chip-in_160ms_cubic-bezier(0.22,1,0.36,1)]")}
      >
        {renderChipBody(option, remove)}
        {!disabled && (
        <button
          type="button"
          tabIndex={-1}
          data-chip-target=""
          disabled={disabled}
          aria-label={labels.remove(option.label)}
          onMouseDown={(event) => event.preventDefault()}
          onClick={remove}
          onKeyDown={(event) => onChipKeyDown(event, v)}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-[5px] text-muted-foreground transition-colors duration-150 outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:bg-foreground/10 focus-visible:text-foreground disabled:pointer-events-none",
            size === "sm" ? "size-4" : "size-5",
          )}
        >
          <IconX aria-hidden="true" className="size-3" stroke={2.25} />
        </button>
        )}
      </span>
    );
  });

  const listContent = (
    <>
      <div
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-multiselectable="true"
        aria-label={labels.listbox}
        aria-busy={loading || undefined}
        className={cn(
          "relative max-h-72 min-h-0 overflow-y-auto overscroll-contain p-1 outline-none",
          !rows.length && "hidden",
        )}
      >
        {sections.map((section, sectionIndex) => {
          const info = section.group
            ? groupInfo(section.items.map((row) => (row as Extract<Row, { kind: "option" }>).option))
            : null;
          const headerId = `${baseId}-group-${sectionIndex}`;
          const body = section.items.map((row) => {
            const index = rows.indexOf(row);
            const option = (row as Extract<Row, { kind: "option" }>).option;
            const isSelected = selected.has(option.value);
            const isDisabled = isRowDisabled(row);
            const isActive = showActive && index === activeIndex;
            return (
              <div
                key={row.key}
                id={rowId(index)}
                role="option"
                data-row={index}
                data-slot="multi-select-option"
                aria-selected={isSelected}
                aria-disabled={isDisabled || undefined}
                data-selected={isSelected ? "" : undefined}
                data-active={isActive ? "" : undefined}
                data-disabled={isDisabled ? "" : undefined}
                onMouseMove={() => {
                  if (!isDisabled && (activeKey !== row.key || !engaged)) {
                    setActiveKey(row.key);
                    setEngaged(true);
                  }
                }}
                onClick={() => {
                  activate(row);
                  inputRef.current?.focus();
                }}
                className={cn(
                  "group/option flex cursor-default items-center gap-2.5 rounded-lg px-2 text-sm transition-colors duration-100 select-none motion-reduce:transition-none",
                  option.description ? "min-h-12 py-1.5 sm:min-h-11" : "min-h-10 py-1 sm:min-h-8",
                  "data-[active]:bg-muted data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-[background-color,border-color,box-shadow] duration-150 motion-reduce:transition-none",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-[0_1px_2px_rgb(0_0_0/0.12)] dark:shadow-[0_2px_6px_-2px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]"
                      : "border-input bg-card group-data-[active]/option:border-foreground/30",
                  )}
                >
                  {isSelected && <IconCheck className="size-3" stroke={3} />}
                </span>
                {renderOption ? (
                  <span className="flex min-w-0 flex-1 items-center gap-2.5">
                    {renderOption(option, { selected: isSelected, active: isActive, disabled: isDisabled, query: trimmed })}
                  </span>
                ) : (
                  <>
                    {option.avatar !== undefined ? (
                      <Avatar avatar={option.avatar} className={option.description ? "size-7" : "size-5"} />
                    ) : option.icon ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4",
                          option.description
                            ? "size-7 rounded-lg bg-muted/60 ring-1 ring-border/60 ring-inset"
                            : "size-4",
                        )}
                      >
                        {option.icon}
                      </span>
                    ) : null}
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate leading-5">{highlight(option.label, trimmed)}</span>
                      {option.description && (
                        <span className="truncate text-xs leading-4 text-muted-foreground">
                          {highlight(option.description, trimmed)}
                        </span>
                      )}
                    </span>
                  </>
                )}
              </div>
            );
          });
          if (!section.group) return <React.Fragment key={`section-${sectionIndex}`}>{body}</React.Fragment>;
          const header = section.header;
          const headerIndex = header ? rows.indexOf(header) : -1;
          const headerDisabled = header ? isRowDisabled(header) : true;
          const headerActive = showActive && headerIndex === activeIndex;
          return (
            <div
              key={`section-${sectionIndex}`}
              role="group"
              aria-labelledby={headerId}
              data-slot="multi-select-group"
              className={cn(sectionIndex > 0 && "mt-1 border-t border-border/60 pt-1")}
            >
              {header ? (
                <div
                  id={rowId(headerIndex)}
                  role="option"
                  data-row={headerIndex}
                  data-group-label=""
                  aria-selected={info!.all}
                  aria-disabled={headerDisabled || undefined}
                  aria-label={info!.all ? labels.clearGroupLabel(section.group) : labels.selectGroup(section.group, info!.selectable.length)}
                  data-active={headerActive ? "" : undefined}
                  data-disabled={headerDisabled ? "" : undefined}
                  onMouseMove={() => {
                    if (!headerDisabled && (activeKey !== header.key || !engaged)) {
                      setActiveKey(header.key);
                      setEngaged(true);
                    }
                  }}
                  className="group/header flex h-8 cursor-default items-center justify-between gap-2 rounded-lg ps-2 pe-1 select-none"
                >
                  <span id={headerId} className="flex min-w-0 items-baseline gap-1.5 text-xs font-medium text-muted-foreground">
                    <span className="truncate">{section.group}</span>
                    <span className="font-normal text-muted-foreground/80 tabular-nums">
                      {info!.chosen}/{info!.selectable.length}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    onClick={() => {
                      activate(header);
                      inputRef.current?.focus();
                    }}
                    className={cn(
                      "inline-flex h-6 shrink-0 items-center rounded-md px-2 text-xs font-medium transition-colors duration-100",
                      headerDisabled
                        ? "cursor-not-allowed text-muted-foreground/60"
                        : "cursor-pointer text-primary hover:bg-primary/10 group-data-[active]/header:bg-primary/10",
                    )}
                  >
                    {info!.all ? labels.clearGroup : labels.selectAll}
                  </span>
                </div>
              ) : (
                <div
                  id={headerId}
                  data-group-label=""
                  role="presentation"
                  className="flex h-8 items-center px-2 text-xs font-medium text-muted-foreground"
                >
                  {section.group}
                </div>
              )}
              {body}
            </div>
          );
        })}
        {createRow && (
          <div
            id={rowId(rows.indexOf(createRow))}
            role="option"
            aria-selected={false}
            aria-disabled={isRowDisabled(createRow) || undefined}
            data-row={rows.indexOf(createRow)}
            data-slot="multi-select-create"
            data-active={showActive && rows.indexOf(createRow) === activeIndex ? "" : undefined}
            data-disabled={isRowDisabled(createRow) ? "" : undefined}
            onMouseMove={() => {
              if (activeKey !== createRow.key || !engaged) {
                setActiveKey(createRow.key);
                setEngaged(true);
              }
            }}
            onClick={() => {
              activate(createRow);
              inputRef.current?.focus();
            }}
            className={cn(
              "flex min-h-10 cursor-default items-center gap-2.5 rounded-lg px-2 text-sm select-none sm:min-h-8",
              "data-[active]:bg-muted data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
              sections.length > 0 && "mt-1",
            )}
          >
            <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-dashed border-foreground/30 text-muted-foreground">
              <IconPlus className="size-3" stroke={2.5} />
            </span>
            <span className="min-w-0 truncate">
              {labels.create(createRow.query)}
            </span>
          </div>
        )}
      </div>
      {!rows.length && (
        <div role="status" className="flex items-center justify-center gap-2 px-3 py-6 text-center text-sm text-muted-foreground">
          {loading ? (
            <>
              <IconLoader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
              {labels.loading}
            </>
          ) : loadError ? (
            labels.loadError
          ) : trimmed ? (
            labels.emptyQuery(trimmed)
          ) : (
            labels.empty
          )}
        </div>
      )}
      {(value.length > 0 || maxSelected !== undefined) && (
        <div
          data-slot="multi-select-footer"
          className="flex h-10 shrink-0 items-center justify-between gap-3 border-t border-border/60 ps-3 pe-1.5 text-xs text-muted-foreground tabular-nums"
        >
          <span className="flex min-w-0 items-center gap-1.5 truncate">
            {labels.selected(value.length, maxSelected)}
            {atLimit && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 dark:text-amber-400">{labels.limitReached}</span>
              </>
            )}
          </span>
          {value.length > 0 && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onMouseDown={(event) => event.preventDefault()}
              onClick={clearAll}
              className="inline-flex h-7 items-center rounded-md px-2 font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
            >
              {labels.clearAll}
            </button>
          )}
        </div>
      )}
    </>
  );

  const panel = (
    <div
      ref={panelRef}
      data-slot="multi-select-content"
      data-inline={inline ? "" : undefined}
      onMouseDown={(event) => {
        // Keep focus in the input while the list is used with a pointer.
        if (!(event.target as HTMLElement).closest("input")) event.preventDefault();
      }}
      className={cn(
        panelSurface,
        inline
          ? cn("absolute top-full z-30 mt-1.5 w-full origin-top", align === "end" ? "end-0" : "start-0")
          : "max-h-[min(24rem,var(--radix-popover-content-available-height))] origin-(--radix-popover-content-transform-origin)",
        contentClassName,
      )}
    >
      {listContent}
    </div>
  );

  const field = (
    <div
      ref={fieldRef}
      data-slot="multi-select-field"
      data-state={open ? "open" : "closed"}
      data-disabled={disabled ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      onMouseDown={(event) => {
        if (disabled) return;
        const target = event.target as HTMLElement;
        if (target.closest("button")) return;
        if (target !== inputRef.current) {
          event.preventDefault();
          inputRef.current?.focus();
        }
        if (target === inputRef.current && open) return;
        setOpen(!open || target === inputRef.current);
      }}
      className={cn(
        "flex w-full min-w-0 cursor-text items-center gap-1 rounded-lg border border-input bg-card text-foreground shadow-xs transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none",
        "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 data-[state=open]:border-primary/50 data-[state=open]:ring-2 data-[state=open]:ring-primary/20",
        "data-[invalid]:border-destructive/70 data-[invalid]:ring-destructive/20 data-[invalid]:focus-within:ring-2",
        "data-[disabled]:cursor-not-allowed data-[disabled]:bg-muted/40 data-[disabled]:opacity-60 data-[disabled]:shadow-none",
        size === "sm" ? "min-h-10 py-[3px] ps-1 pe-1 sm:min-h-8" : "min-h-11 py-1 ps-1.5 pe-1 sm:min-h-9",
        fieldClassName,
      )}
    >
      <div
        ref={areaRef}
        className={cn("flex min-w-0 flex-1 items-center gap-1", wrap ? "flex-wrap" : "flex-nowrap")}
      >
        {chips}
        {hidden.length > 0 && (
          <button
            type="button"
            tabIndex={-1}
            data-chip-target=""
            data-slot="multi-select-overflow"
            aria-label={labels.moreLabel(hidden.length, hidden.map((v) => optionFor(v).label).join(", "))}
            title={hidden.map((v) => optionFor(v).label).join(", ")}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setExpanded(true);
              inputRef.current?.focus();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setExpanded(true);
                requestAnimationFrame(() => inputRef.current?.focus());
                return;
              }
              onChipKeyDown(event);
            }}
            className={cn(
              "inline-flex shrink-0 items-center rounded-md px-1.5 text-xs font-medium text-muted-foreground tabular-nums ring-1 ring-border/60 transition-colors duration-150 outline-none ring-inset hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
              chipHeight,
            )}
          >
            {labels.more(hidden.length)}
          </button>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={open && showActive && activeIndex >= 0 ? rowId(activeIndex) : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={[summary ? summaryId : "", ariaDescribedby ?? ""].filter(Boolean).join(" ") || undefined}
          aria-invalid={invalid || undefined}
          data-slot="multi-select-input"
          value={query}
          placeholder={value.length ? undefined : (placeholder ?? labels.placeholder)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveKey(null);
            setEngaged(true);
            if (!open) setOpen(true);
          }}
          onKeyDown={onInputKeyDown}
          onFocus={() => setEngaged(true)}
          className={cn(
            "min-w-12 flex-1 bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed sm:text-sm",
            chipHeight,
          )}
        />
      </div>
      <div className="flex shrink-0 items-center gap-0.5 self-start" style={{ minHeight: size === "sm" ? 20 : 24 }}>
        {loading && (
          <IconLoader2
            aria-hidden="true"
            className="mx-1 size-4 animate-spin text-muted-foreground motion-reduce:animate-none"
          />
        )}
        {value.length > 0 && !disabled && (
          <button
            type="button"
            aria-label={labels.clearAll}
            title={labels.clearAll}
            onMouseDown={(event) => event.preventDefault()}
            onClick={clearAll}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <IconX aria-hidden="true" className="size-3.5" />
          </button>
        )}
        <button
          type="button"
          tabIndex={-1}
          aria-label={labels.toggle}
          disabled={disabled}
          onMouseDown={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
            setOpen(!open);
          }}
          className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground disabled:pointer-events-none"
        >
          <IconChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 transition-transform duration-200 motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </button>
      </div>
    </div>
  );

  return (
    <div
      ref={rootRef}
      data-slot="multi-select"
      data-state={open ? "open" : "closed"}
      data-disabled={disabled ? "" : undefined}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (next && (rootRef.current?.contains(next) || panelRef.current?.contains(next))) return;
        setExpanded(false);
        setEngaged(false);
        if (query) setQuery("");
        setOpen(false);
      }}
      className={cn("relative w-full min-w-0", className)}
      {...props}
    >
      <style>{keyframes}</style>
      {name && value.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      <span id={summaryId} className="sr-only">
        {summary}
      </span>

      {/* Measures chip widths for the one-line layout. */}
      {collapse === "auto" && (
        <div
          ref={measureRef}
          aria-hidden="true"
          inert
          className="pointer-events-none invisible absolute start-0 top-0 flex h-0 items-center gap-1 overflow-hidden whitespace-nowrap"
        >
          {value.map((v) => {
            const option = optionFor(v);
            return (
              <span key={v} data-measure-chip="" className={cn(chipClass(option), "shrink-0")}>
                {renderChipBody(option, () => {})}
                <span className={size === "sm" ? "size-4" : "size-5"} />
              </span>
            );
          })}
          <span
            data-measure-more=""
            className={cn("inline-flex shrink-0 items-center rounded-md px-1.5 text-xs font-medium tabular-nums", chipHeight)}
          >
            {labels.more(value.length)}
          </span>
        </div>
      )}

      {inline ? (
        <>
          {field}
          {open && panel}
        </>
      ) : (
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Anchor asChild>{field}</PopoverPrimitive.Anchor>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              role="presentation"
              align={align}
              side="bottom"
              sideOffset={6}
              collisionPadding={8}
              onOpenAutoFocus={(event) => event.preventDefault()}
              onCloseAutoFocus={(event) => event.preventDefault()}
              onInteractOutside={(event) => {
                if (rootRef.current?.contains(event.target as Node)) event.preventDefault();
              }}
              style={{ width: "var(--radix-popover-trigger-width)" }}
              className="z-50 min-w-[min(16rem,var(--radix-popover-content-available-width))] outline-none"
            >
              {panel}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      )}

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
