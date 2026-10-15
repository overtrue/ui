"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  IconBookmarks,
  IconCalendarEvent,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCircleHalf2,
  IconFilter,
  IconHash,
  IconLetterCase,
  IconPlus,
  IconSearch,
  IconToggleRight,
  IconX,
} from "@tabler/icons-react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

export type FilterFieldType = "enum" | "text" | "number" | "date" | "boolean";

export type FilterOperator =
  | "is"
  | "is-not"
  | "is-any-of"
  | "is-none-of"
  | "contains"
  | "does-not-contain"
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "before"
  | "after"
  | "within-last";

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  /** Any CSS colour, drawn as a dot when there is no icon. */
  color?: string;
}

export interface FilterField {
  /** Row property, or the key passed to `getValue`. */
  key: string;
  label: string;
  type: FilterFieldType;
  /** Choices for enum fields. Boolean fields may relabel "true" and "false". */
  options?: FilterOption[];
  icon?: React.ReactNode;
  /** Restrict or reorder the operators offered. */
  operators?: FilterOperator[];
  /** Plural noun for summaries such as "3 services". */
  plural?: string;
  /** Number fields: a unit shown after inputs and values, such as "s". */
  unit?: string;
  /** Number fields: formats values in chips. */
  format?: (value: number) => string;
  placeholder?: string;
}

/**
 * Enum: string[]. Text: string. Number: number, or [min, max] for between.
 * Date: a duration such as "7d" or "24h" for within-last, a yyyy-mm-dd day for
 * before and after, or [from, to] days for between. Boolean: boolean.
 */
export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | [number, number]
  | [string, string]
  | null;

export interface Filter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: FilterValue;
}

export interface FilterView {
  id: string;
  name: string;
  filters: Filter[];
  query?: string;
}

export interface FilterBarLabels {
  filter: string;
  addFilter: string;
  clear: string;
  search: string;
  searchFields: string;
  views: string;
  allView: string;
  saveView: string;
  viewName: string;
  save: string;
  modified: string;
  noResults: string;
  selectValue: string;
  back: string;
  yes: string;
  no: string;
  value: string;
  min: string;
  max: string;
  removeFilter: (field: string) => string;
  selected: (count: number, plural?: string) => string;
  duration: (amount: number, unit: "h" | "d" | "w" | "m") => string;
  operators: Partial<Record<FilterOperator, string>>;
}

export interface FilterBarProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> {
  fields: FilterField[];
  /** Controlled filters. Leave undefined to let the bar manage them. */
  filters?: Filter[];
  defaultFilters?: Filter[];
  onFiltersChange?: (filters: Filter[]) => void;
  /** Free-text search. The input shows when query, defaultQuery or onQueryChange is passed. */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  /** Counts per enum option, keyed by field then option value. See `facetCounts`. */
  optionCounts?: Record<string, Record<string, number>>;
  /** Saved views offered in a menu before the search input. */
  views?: FilterView[];
  activeViewId?: string | null;
  defaultActiveViewId?: string | null;
  onViewChange?: (view: FilterView | null) => void;
  /** Adds "Save as view" to the views menu. */
  onSaveView?: (name: string, state: { filters: Filter[]; query: string }) => void;
  /** Content at the end of the bar, such as a result count. */
  actions?: React.ReactNode;
  size?: "sm" | "default";
  locale?: string;
  /** Creates ids for new filters. */
  createId?: (field: FilterField) => string;
  /** Replaces the value segment of a chip. */
  renderValue?: (filter: Filter, field: FilterField) => React.ReactNode;
  labels?: Partial<FilterBarLabels>;
}

/* ------------------------------------------------------------------------ */
/* Operators and values                                                      */
/* ------------------------------------------------------------------------ */

const DEFAULT_OPERATORS: Record<FilterFieldType, FilterOperator[]> = {
  enum: ["is", "is-not", "is-any-of", "is-none-of"],
  text: ["contains", "does-not-contain", "is", "is-not"],
  number: ["eq", "neq", "gt", "gte", "lt", "lte", "between"],
  date: ["within-last", "before", "after", "between"],
  boolean: ["is"],
};

const OPERATOR_LABELS: Record<FilterOperator, string> = {
  is: "is",
  "is-not": "is not",
  "is-any-of": "is any of",
  "is-none-of": "is none of",
  contains: "contains",
  "does-not-contain": "does not contain",
  eq: "=",
  neq: "≠",
  gt: ">",
  gte: "≥",
  lt: "<",
  lte: "≤",
  between: "between",
  before: "before",
  after: "after",
  "within-last": "within the last",
};

const NUMBER_HINTS: Partial<Record<FilterOperator, string>> = {
  eq: "Equals",
  neq: "Does not equal",
  gt: "Greater than",
  gte: "At least",
  lt: "Less than",
  lte: "At most",
  between: "Between",
};

const DEFAULT_OPERATOR: Record<FilterFieldType, FilterOperator> = {
  enum: "is",
  text: "contains",
  number: "gt",
  date: "within-last",
  boolean: "is",
};

const TYPE_ICONS: Record<FilterFieldType, typeof IconHash> = {
  enum: IconCircleHalf2,
  text: IconLetterCase,
  number: IconHash,
  date: IconCalendarEvent,
  boolean: IconToggleRight,
};

const DATE_PRESETS = ["24h", "7d", "30d", "90d"];

const defaultLabels: FilterBarLabels = {
  filter: "Filter",
  addFilter: "Add filter",
  clear: "Clear",
  search: "Search",
  searchFields: "Filter by…",
  views: "Views",
  allView: "All",
  saveView: "Save as view",
  viewName: "View name",
  save: "Save",
  modified: "Modified",
  noResults: "No matches",
  selectValue: "Select…",
  back: "Back to fields",
  yes: "Yes",
  no: "No",
  value: "Value",
  min: "Min",
  max: "Max",
  removeFilter: (field) => `Remove ${field} filter`,
  selected: (count, plural) => `${count} ${plural ?? "selected"}`,
  duration: (amount, unit) => {
    const word = { h: "hour", d: "day", w: "week", m: "month" }[unit];
    return `${amount} ${word}${amount === 1 ? "" : "s"}`;
  },
  operators: {},
};

const isNegative = (operator: FilterOperator) =>
  operator === "is-not" || operator === "is-none-of";

/** Keep enum operators in step with how many values are chosen. */
function enumOperator(negative: boolean, count: number): FilterOperator {
  if (negative) return count > 1 ? "is-none-of" : "is-not";
  return count > 1 ? "is-any-of" : "is";
}

function parseDuration(value: unknown) {
  const match = /^(\d+(?:\.\d+)?)\s*([hdwm])$/.exec(String(value ?? "").trim());
  if (!match) return null;
  const amount = Number(match[1]);
  const unit = match[2] as "h" | "d" | "w" | "m";
  const hours = { h: 1, d: 24, w: 168, m: 720 }[unit];
  return { amount, unit, ms: amount * hours * 3_600_000 };
}

/** Local midnight for yyyy-mm-dd strings; other inputs as the Date constructor reads them. */
function toTime(value: unknown): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (match) return new Date(+match[1], +match[2] - 1, +match[3]).getTime();
    return Date.parse(value);
  }
  return NaN;
}

function dayStart(value: unknown) {
  const time = toTime(value);
  if (!Number.isFinite(time)) return NaN;
  const d = new Date(time);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function nextDayStart(value: unknown) {
  const time = toTime(value);
  if (!Number.isFinite(time)) return NaN;
  const d = new Date(time);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
}

/** False for filters still waiting for a value; those never narrow results. */
export function isFilterComplete(filter: Filter) {
  const { value, operator } = filter;
  if (value === null || value === undefined) return false;
  if (operator === "between") {
    return (
      Array.isArray(value) &&
      value.length === 2 &&
      value.every((v) =>
        typeof v === "number" ? Number.isFinite(v) : Number.isFinite(toTime(v)),
      )
    );
  }
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return Number.isFinite(value);
  return true;
}

function matches(raw: unknown, filter: Filter, field: FilterField, now: number) {
  const { operator, value } = filter;
  switch (field.type) {
    case "enum": {
      const wanted = (Array.isArray(value) ? value : [value]).map(String);
      const have = (Array.isArray(raw) ? raw : [raw])
        .filter((v) => v !== null && v !== undefined)
        .map(String);
      const hit = have.some((v) => wanted.includes(v));
      return isNegative(operator) ? !hit : hit;
    }
    case "boolean": {
      const hit = Boolean(raw) === Boolean(value);
      return isNegative(operator) ? !hit : hit;
    }
    case "text": {
      const text = String(raw ?? "").toLowerCase();
      const needle = String(value).toLowerCase().trim();
      if (operator === "contains") return text.includes(needle);
      if (operator === "does-not-contain") return !text.includes(needle);
      if (operator === "is") return text === needle;
      if (operator === "is-not") return text !== needle;
      return true;
    }
    case "number": {
      const n = typeof raw === "number" ? raw : Number(raw);
      if (raw === null || raw === undefined || !Number.isFinite(n)) return false;
      if (operator === "between") {
        const [a, b] = value as [number, number];
        return n >= Math.min(a, b) && n <= Math.max(a, b);
      }
      const v = Number(value);
      if (operator === "eq") return n === v;
      if (operator === "neq") return n !== v;
      if (operator === "gt") return n > v;
      if (operator === "gte") return n >= v;
      if (operator === "lt") return n < v;
      if (operator === "lte") return n <= v;
      return true;
    }
    case "date": {
      const t = toTime(raw);
      if (!Number.isFinite(t)) return false;
      if (operator === "within-last") {
        const duration = parseDuration(value);
        return !duration || (t >= now - duration.ms && t <= now);
      }
      if (operator === "before") return t < dayStart(value);
      if (operator === "after") return t >= nextDayStart(value);
      if (operator === "between") {
        const [a, b] = (value as [string, string]).map(toTime).sort((x, y) => x - y);
        return t >= dayStart(a) && t < nextDayStart(b);
      }
      return true;
    }
  }
}

export interface ApplyFiltersOptions<T> {
  fields: readonly FilterField[];
  /** Free text. Every word must appear in the row's search text. */
  query?: string;
  /** Reads a field from a row. Defaults to `row[field]`. */
  getValue?: (row: T, field: string) => unknown;
  /** Text matched by `query`. Defaults to text and enum fields, including option labels. */
  getSearchText?: (row: T) => string;
  /** Reference time for "within the last". Defaults to now. */
  now?: Date | number;
}

/**
 * Filters rows with every operator the bar offers. Filters combine with AND;
 * values inside one enum filter combine with OR. Incomplete filters are skipped.
 */
export function applyFilters<T>(
  rows: readonly T[],
  filters: readonly Filter[],
  options: ApplyFiltersOptions<T>,
): T[] {
  const fields = new Map(options.fields.map((field) => [field.key, field]));
  const get =
    options.getValue ??
    ((row: T, key: string) => (row as Record<string, unknown>)[key]);
  const now = options.now === undefined ? Date.now() : +options.now;
  const active = filters.filter(
    (filter) => fields.has(filter.field) && isFilterComplete(filter),
  );
  const words = (options.query ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const searchText =
    options.getSearchText ??
    ((row: T) =>
      options.fields
        .filter((field) => field.type === "text" || field.type === "enum")
        .flatMap((field) => {
          const raw = get(row, field.key);
          const values = (Array.isArray(raw) ? raw : [raw]).filter(
            (v) => v !== null && v !== undefined,
          );
          return values.flatMap((v) => [
            String(v),
            field.options?.find((option) => option.value === String(v))?.label ?? "",
          ]);
        })
        .join(" "));

  return rows.filter((row) => {
    if (words.length) {
      const text = searchText(row).toLowerCase();
      if (!words.every((word) => text.includes(word))) return false;
    }
    return active.every((filter) =>
      matches(get(row, filter.field), filter, fields.get(filter.field)!, now),
    );
  });
}

/**
 * Option counts for every enum field, each computed with the other filters
 * applied but not its own, so counts show what choosing an option would add.
 */
export function facetCounts<T>(
  rows: readonly T[],
  filters: readonly Filter[],
  options: ApplyFiltersOptions<T>,
) {
  const get =
    options.getValue ??
    ((row: T, key: string) => (row as Record<string, unknown>)[key]);
  const counts: Record<string, Record<string, number>> = {};
  for (const field of options.fields) {
    if (field.type !== "enum") continue;
    const scope = applyFilters(
      rows,
      filters.filter((filter) => filter.field !== field.key),
      options,
    );
    const tally: Record<string, number> = {};
    for (const row of scope) {
      const raw = get(row, field.key);
      for (const v of Array.isArray(raw) ? raw : [raw]) {
        if (v === null || v === undefined) continue;
        tally[String(v)] = (tally[String(v)] ?? 0) + 1;
      }
    }
    counts[field.key] = tally;
  }
  return counts;
}

const comparable = (filters: readonly Filter[]) =>
  JSON.stringify(
    filters
      .filter(isFilterComplete)
      .map(({ field, operator, value }) => [field, operator, value]),
  );

/* ------------------------------------------------------------------------ */
/* Shared pieces                                                             */
/* ------------------------------------------------------------------------ */

const keyframes = `@keyframes filter-bar-in{from{opacity:0;transform:translateY(-4px) scale(.96)}to{opacity:1;transform:none}}`;

const popoverSurface =
  "z-50 rounded-xl border border-border/70 bg-popover/90 text-popover-foreground shadow-xl backdrop-blur-md outline-none origin-(--radix-popover-content-transform-origin) motion-safe:animate-[filter-bar-in_200ms_cubic-bezier(0.22,1,0.36,1)]";

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_8%,transparent)]";

function Swatch({ option }: { option?: FilterOption }) {
  if (option?.icon)
    return (
      <span
        aria-hidden="true"
        className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4"
      >
        {option.icon}
      </span>
    );
  if (option?.color)
    return (
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full"
        style={{ background: option.color }}
      />
    );
  return null;
}

interface ListItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  swatch?: FilterOption;
  hint?: React.ReactNode;
  count?: number;
  trailing?: React.ReactNode;
}

/**
 * A listbox with an optional search box (the combobox pattern). Focus stays in
 * the input; arrows move the active option and Enter picks it.
 */
function OptionList({
  items,
  label,
  selected,
  multiple = false,
  searchable = false,
  placeholder,
  emptyText,
  onSelect,
  onEmptyBackspace,
  autoFocus = false,
  className,
}: {
  items: ListItem[];
  label: string;
  selected?: readonly string[];
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  emptyText: string;
  onSelect: (value: string) => void;
  onEmptyBackspace?: () => void;
  /** Focus the list on mount, for editors that swap in while a menu is open. */
  autoFocus?: boolean;
  className?: string;
}) {
  const id = React.useId();
  const [query, setQuery] = React.useState("");
  const listRef = React.useRef<HTMLDivElement>(null);
  const visible = query
    ? items.filter((item) =>
        item.label.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : items;
  const firstSelected = visible.findIndex((item) => selected?.includes(item.value));
  const [active, setActive] = React.useState(Math.max(0, firstSelected));
  const current = Math.min(active, visible.length - 1);
  const activeId = current >= 0 ? `${id}-${current}` : undefined;

  React.useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${current}"]`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [current]);

  React.useEffect(() => {
    if (autoFocus && !searchable) listRef.current?.focus({ preventScroll: true });
  }, [autoFocus, searchable]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = visible.length - 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(current >= last ? 0 : current + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(current <= 0 ? last : current - 1);
    } else if (
      (event.key === "Home" || event.key === "End") &&
      (!searchable || !query)
    ) {
      event.preventDefault();
      setActive(event.key === "Home" ? 0 : last);
    } else if (event.key === "Enter" || (event.key === " " && !searchable)) {
      event.preventDefault();
      if (visible[current]) onSelect(visible[current].value);
    } else if (event.key === "Backspace" && searchable && !query && onEmptyBackspace) {
      event.preventDefault();
      onEmptyBackspace();
    }
  };

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      {searchable && (
        <div className="relative border-b border-border/60">
          <IconSearch
            aria-hidden="true"
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls={`${id}-list`}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label={placeholder ?? label}
            value={query}
            placeholder={placeholder}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="h-11 w-full bg-transparent ps-9 pe-3 text-base outline-none placeholder:text-muted-foreground sm:h-10 sm:text-sm"
          />
        </div>
      )}
      <div
        ref={listRef}
        id={`${id}-list`}
        role="listbox"
        aria-label={label}
        aria-multiselectable={multiple || undefined}
        aria-activedescendant={searchable ? undefined : activeId}
        tabIndex={searchable ? -1 : 0}
        onKeyDown={searchable ? undefined : onKeyDown}
        className="max-h-72 min-h-0 overflow-y-auto p-1 outline-none"
      >
        {visible.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            {emptyText}
          </p>
        )}
        {visible.map((item, index) => {
          const checked = !!selected?.includes(item.value);
          return (
            <div
              key={item.value}
              id={`${id}-${index}`}
              role="option"
              data-index={index}
              aria-selected={checked}
              data-active={index === current ? "" : undefined}
              onMouseMove={() => index !== current && setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setActive(index);
                onSelect(item.value);
              }}
              className="flex h-10 cursor-default items-center gap-2.5 rounded-lg px-2 text-sm transition-colors duration-150 select-none data-[active]:bg-muted sm:h-8 motion-reduce:transition-none"
            >
              {multiple ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors duration-150",
                    checked
                      ? "border-primary bg-primary text-primary-foreground shadow-[0_2px_6px_-2px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]"
                      : "border-input bg-card",
                  )}
                >
                  {checked && <IconCheck className="size-3" stroke={3} />}
                </span>
              ) : null}
              {item.icon ? (
                <span
                  aria-hidden="true"
                  className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4"
                >
                  {item.icon}
                </span>
              ) : (
                <Swatch option={item.swatch} />
              )}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.hint && (
                <span className="truncate text-xs text-muted-foreground">
                  {item.hint}
                </span>
              )}
              {item.count !== undefined && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {item.count}
                </span>
              )}
              {!multiple && checked && (
                <IconCheck aria-hidden="true" className="size-4 shrink-0 text-primary" />
              )}
              {item.trailing}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: React.ReactNode; title?: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={(event) => {
        const step =
          event.key === "ArrowRight" || event.key === "ArrowDown"
            ? 1
            : event.key === "ArrowLeft" || event.key === "ArrowUp"
              ? -1
              : 0;
        if (!step) return;
        event.preventDefault();
        const index = options.findIndex((option) => option.value === value);
        const next = options[(index + step + options.length) % options.length];
        onChange(next.value);
        event.currentTarget
          .querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)
          ?.focus();
      }}
      className="flex rounded-lg bg-muted/70 p-0.5 ring-1 ring-border/50 ring-inset"
    >
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={option.title}
            title={option.title}
            data-value={option.value}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-8 min-w-0 flex-auto rounded-md px-2 text-xs whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 sm:h-7 motion-reduce:transition-none",
              focusRing,
              checked
                ? "bg-card font-medium text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.08),inset_0_1px_0_rgb(255_255_255/0.6)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

const editorInput =
  "h-10 w-full min-w-0 [appearance:textfield] rounded-lg [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border border-input bg-card px-3 text-base text-foreground shadow-xs transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/25 sm:h-9 sm:text-sm motion-reduce:transition-none [color-scheme:light] dark:[color-scheme:dark]";

/* ------------------------------------------------------------------------ */
/* Value editors                                                             */
/* ------------------------------------------------------------------------ */

interface EditorProps {
  field: FilterField;
  filter: Filter;
  labels: FilterBarLabels;
  counts?: Record<string, number>;
  onChange: (filter: Filter) => void;
  onDone: () => void;
  onBack?: () => void;
}

function opLabel(labels: FilterBarLabels, operator: FilterOperator) {
  return labels.operators[operator] ?? OPERATOR_LABELS[operator];
}

function ValueEditor(props: EditorProps) {
  const { field } = props;
  if (field.type === "enum") return <EnumEditor {...props} />;
  if (field.type === "number") return <NumberEditor {...props} />;
  if (field.type === "date") return <DateEditor {...props} />;
  if (field.type === "boolean") return <BooleanEditor {...props} />;
  return <TextEditor {...props} />;
}

function EnumEditor({ field, filter, labels, counts, onChange, onBack }: EditorProps) {
  const values = Array.isArray(filter.value) ? (filter.value as string[]) : [];
  return (
    <OptionList
      searchable
      multiple
      label={field.label}
      placeholder={`${field.label}…`}
      emptyText={labels.noResults}
      selected={values}
      onEmptyBackspace={onBack}
      items={(field.options ?? []).map((option) => ({
        value: option.value,
        label: option.label,
        swatch: option,
        count: counts ? (counts[option.value] ?? 0) : undefined,
      }))}
      onSelect={(value) => {
        const next = values.includes(value)
          ? values.filter((v) => v !== value)
          : [...values, value];
        onChange({
          ...filter,
          value: next,
          operator: enumOperator(isNegative(filter.operator), next.length),
        });
      }}
    />
  );
}

function TextEditor({ field, filter, labels, onChange, onDone }: EditorProps) {
  const operators = (field.operators ?? DEFAULT_OPERATORS.text).filter((op) =>
    ["contains", "does-not-contain", "is", "is-not"].includes(op),
  );
  return (
    <div className="flex flex-col gap-2.5 p-3">
      {operators.length > 1 && (
        <Segmented
          label={`${field.label} operator`}
          value={filter.operator}
          options={operators.map((op) => ({ value: op, label: opLabel(labels, op) }))}
          onChange={(operator) => onChange({ ...filter, operator })}
        />
      )}
      <input
        autoFocus
        aria-label={`${field.label} ${opLabel(labels, filter.operator)}`}
        value={typeof filter.value === "string" ? filter.value : ""}
        placeholder={field.placeholder ?? `${labels.value}…`}
        onChange={(event) => onChange({ ...filter, value: event.target.value })}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onDone();
          }
        }}
        className={editorInput}
      />
    </div>
  );
}

function NumberEditor({ field, filter, labels, onChange, onDone }: EditorProps) {
  const operators = (field.operators ?? DEFAULT_OPERATORS.number).filter(
    (op) => op in NUMBER_HINTS,
  );
  const between = filter.operator === "between";
  const pair = Array.isArray(filter.value)
    ? (filter.value as [number, number])
    : [typeof filter.value === "number" ? filter.value : NaN, NaN];
  const single = typeof filter.value === "number" ? filter.value : pair[0];
  const show = (n: number) => (Number.isFinite(n) ? String(n) : "");
  const read = (text: string) => (text.trim() === "" ? NaN : Number(text));
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onDone();
    }
  };
  const unit = field.unit && (
    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
      {field.unit}
    </span>
  );
  return (
    <div className="flex flex-col gap-2.5 p-3">
      <Segmented
        label={`${field.label} operator`}
        value={filter.operator}
        options={operators.map((op) => ({
          value: op,
          label: op === "between" ? opLabel(labels, op) : OPERATOR_LABELS[op],
          title: NUMBER_HINTS[op],
        }))}
        onChange={(operator) =>
          onChange({
            ...filter,
            operator,
            value:
              operator === "between"
                ? [single, Number.isFinite(pair[1]) ? pair[1] : NaN]
                : single,
          })
        }
      />
      {between ? (
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <input
              autoFocus
              type="number"
              inputMode="decimal"
              aria-label={`${field.label} ${labels.min}`}
              placeholder={labels.min}
              value={show(pair[0])}
              onChange={(event) =>
                onChange({ ...filter, value: [read(event.target.value), pair[1]] })
              }
              onKeyDown={onKeyDown}
              className={cn(editorInput, "tabular-nums", field.unit && "pe-8")}
            />
            {unit}
          </div>
          <span aria-hidden="true" className="text-muted-foreground">
            –
          </span>
          <div className="relative min-w-0 flex-1">
            <input
              type="number"
              inputMode="decimal"
              aria-label={`${field.label} ${labels.max}`}
              placeholder={labels.max}
              value={show(pair[1])}
              onChange={(event) =>
                onChange({ ...filter, value: [pair[0], read(event.target.value)] })
              }
              onKeyDown={onKeyDown}
              className={cn(editorInput, "tabular-nums", field.unit && "pe-8")}
            />
            {unit}
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            autoFocus
            type="number"
            inputMode="decimal"
            aria-label={`${field.label} ${NUMBER_HINTS[filter.operator]?.toLowerCase() ?? labels.value}`}
            placeholder={field.placeholder ?? labels.value}
            value={show(single)}
            onChange={(event) => onChange({ ...filter, value: read(event.target.value) })}
            onKeyDown={onKeyDown}
            className={cn(editorInput, "tabular-nums", field.unit && "pe-8")}
          />
          {unit}
        </div>
      )}
    </div>
  );
}

function DateEditor({ field, filter, labels, onChange, onDone }: EditorProps) {
  const operators = field.operators ?? DEFAULT_OPERATORS.date;
  const fixed: FilterOperator =
    filter.operator === "within-last" ? "after" : filter.operator;
  const [mode, setMode] = React.useState<FilterOperator>(
    operators.includes(fixed) ? fixed : "after",
  );
  const pair = Array.isArray(filter.value)
    ? (filter.value as [string, string])
    : ["", ""];
  const day =
    typeof filter.value === "string" && filter.operator !== "within-last"
      ? filter.value
      : "";
  const exact = operators.filter((op) => op !== "within-last");
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onDone();
    }
  };
  return (
    <div className="flex flex-col">
      {operators.includes("within-last") && (
        <OptionList
          autoFocus
          label={`${field.label}, ${opLabel(labels, "within-last")}`}
          emptyText={labels.noResults}
          selected={filter.operator === "within-last" ? [String(filter.value)] : []}
          items={DATE_PRESETS.map((preset) => {
            const parsed = parseDuration(preset)!;
            return {
              value: preset,
              label: `Last ${labels.duration(parsed.amount, parsed.unit)}`,
            };
          })}
          onSelect={(value) => {
            onChange({ ...filter, operator: "within-last", value });
            onDone();
          }}
        />
      )}
      {exact.length > 0 && (
        <div className="flex flex-col gap-2.5 border-t border-border/60 p-3">
          <Segmented
            label={`${field.label} operator`}
            value={mode}
            options={exact.map((op) => ({
              value: op,
              label: opLabel(labels, op).replace(/^./, (c) => c.toUpperCase()),
            }))}
            onChange={(operator) => {
              setMode(operator);
              const seed = day || pair[0];
              if (!seed) return;
              onChange({
                ...filter,
                operator,
                value: operator === "between" ? [seed, pair[1] || seed] : seed,
              });
            }}
          />
          {mode === "between" ? (
            <div className="flex items-center gap-2">
              <input
                type="date"
                aria-label={`${field.label} from`}
                value={pair[0] || day}
                onChange={(event) =>
                  onChange({
                    ...filter,
                    operator: "between",
                    value: [event.target.value, pair[1] || event.target.value],
                  })
                }
                onKeyDown={onKeyDown}
                className={cn(editorInput, "tabular-nums")}
              />
              <span aria-hidden="true" className="text-muted-foreground">
                –
              </span>
              <input
                type="date"
                aria-label={`${field.label} to`}
                value={pair[1]}
                onChange={(event) =>
                  onChange({
                    ...filter,
                    operator: "between",
                    value: [pair[0] || event.target.value, event.target.value],
                  })
                }
                onKeyDown={onKeyDown}
                className={cn(editorInput, "tabular-nums")}
              />
            </div>
          ) : (
            <input
              type="date"
              aria-label={`${field.label} ${opLabel(labels, mode)}`}
              value={day}
              onChange={(event) =>
                onChange({ ...filter, operator: mode, value: event.target.value })
              }
              onKeyDown={onKeyDown}
              className={cn(editorInput, "tabular-nums")}
            />
          )}
        </div>
      )}
    </div>
  );
}

function BooleanEditor({ field, filter, labels, onChange }: EditorProps) {
  const id = React.useId();
  const on = filter.value !== false;
  const yes = field.options?.find((o) => o.value === "true")?.label ?? labels.yes;
  const no = field.options?.find((o) => o.value === "false")?.label ?? labels.no;
  return (
    <div className="flex items-center justify-between gap-4 p-3">
      <label htmlFor={id} className="text-sm">
        {field.label}
        <span className="ms-2 text-muted-foreground">{on ? yes : no}</span>
      </label>
      <Switch
        id={id}
        autoFocus
        checked={on}
        onCheckedChange={(checked) => onChange({ ...filter, value: checked })}
      />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Chip                                                                      */
/* ------------------------------------------------------------------------ */

function describeValue(
  filter: Filter,
  field: FilterField,
  labels: FilterBarLabels,
  locale?: string,
): { text: string; swatches: FilterOption[] } {
  const { value, operator } = filter;
  if (!isFilterComplete(filter)) return { text: "", swatches: [] };
  const num = (n: number) =>
    field.format
      ? field.format(n)
      : `${new Intl.NumberFormat(locale).format(n)}${field.unit ? ` ${field.unit}` : ""}`;
  const date = (d: string) =>
    new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year:
        new Date(toTime(d)).getFullYear() === new Date().getFullYear()
          ? undefined
          : "numeric",
    }).format(new Date(toTime(d)));
  switch (field.type) {
    case "enum": {
      const values = Array.isArray(value) ? (value as string[]) : [String(value)];
      const options = values.map(
        (v) => field.options?.find((option) => option.value === v) ?? { value: v, label: v },
      );
      const joined = options.map((option) => option.label).join(", ");
      return {
        // Name up to two short values; summarize the rest as a count.
        text:
          options.length === 1 || (options.length === 2 && joined.length <= 16)
            ? joined
            : labels.selected(options.length, field.plural),
        swatches: options,
      };
    }
    case "boolean": {
      const key = value ? "true" : "false";
      return {
        text:
          field.options?.find((option) => option.value === key)?.label ??
          (value ? labels.yes : labels.no),
        swatches: [],
      };
    }
    case "number":
      return {
        text:
          operator === "between"
            ? `${num((value as [number, number])[0])} – ${num((value as [number, number])[1])}`
            : num(value as number),
        swatches: [],
      };
    case "date": {
      if (operator === "within-last") {
        const parsed = parseDuration(value);
        return {
          text: parsed ? labels.duration(parsed.amount, parsed.unit) : String(value),
          swatches: [],
        };
      }
      if (operator === "between") {
        const [a, b] = value as [string, string];
        return { text: `${date(a)} – ${date(b)}`, swatches: [] };
      }
      return { text: date(value as string), swatches: [] };
    }
    default:
      return { text: `“${String(value)}”`, swatches: [] };
  }
}

/* ------------------------------------------------------------------------ */
/* Filter bar                                                                */
/* ------------------------------------------------------------------------ */

/** A query builder: free-text search, filter chips with inline editors, and saved views. */
export function FilterBar({
  fields,
  filters: filtersProp,
  defaultFilters = [],
  onFiltersChange,
  query: queryProp,
  defaultQuery,
  onQueryChange,
  showSearch: showSearchProp,
  searchPlaceholder,
  optionCounts,
  views,
  activeViewId: activeViewIdProp,
  defaultActiveViewId = null,
  onViewChange,
  onSaveView,
  actions,
  size = "default",
  locale,
  createId,
  renderValue,
  labels: labelsProp,
  className,
  ...props
}: FilterBarProps) {
  const labels: FilterBarLabels = {
    ...defaultLabels,
    ...labelsProp,
    operators: { ...defaultLabels.operators, ...labelsProp?.operators },
  };
  const barRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const filterButtonRef = React.useRef<HTMLButtonElement>(null);

  const [filtersState, setFiltersState] = React.useState<Filter[]>(defaultFilters);
  const filters = filtersProp ?? filtersState;
  const filtersRef = React.useRef(filters);
  filtersRef.current = filters;
  const commitFilters = (next: Filter[]) => {
    filtersRef.current = next;
    if (filtersProp === undefined) setFiltersState(next);
    onFiltersChange?.(next);
  };

  const [queryState, setQueryState] = React.useState(defaultQuery ?? "");
  const query = queryProp ?? queryState;
  const setQuery = (next: string) => {
    if (queryProp === undefined) setQueryState(next);
    onQueryChange?.(next);
  };
  const showSearch =
    showSearchProp ??
    (queryProp !== undefined || defaultQuery !== undefined || !!onQueryChange);

  const [viewState, setViewState] = React.useState<string | null>(defaultActiveViewId);
  const activeViewId =
    activeViewIdProp !== undefined ? activeViewIdProp : viewState;
  const activeView = views?.find((view) => view.id === activeViewId) ?? null;
  const modified =
    !!activeView &&
    (comparable(activeView.filters) !== comparable(filters) ||
      (activeView.query ?? "") !== query);

  const fieldMap = React.useMemo(
    () => new Map(fields.map((field) => [field.key, field])),
    [fields],
  );

  const [editing, setEditing] = React.useState<{
    id: string;
    part: "operator" | "value";
  } | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuField, setMenuField] = React.useState<{
    key: string;
    id: string;
  } | null>(null);

  const newId = (field: FilterField) =>
    createId?.(field) ??
    `${field.key}-${Math.random().toString(36).slice(2, 8)}`;

  const upsert = (filter: Filter) => {
    const list = filtersRef.current;
    const exists = list.some((item) => item.id === filter.id);
    commitFilters(
      exists
        ? list.map((item) => (item.id === filter.id ? filter : item))
        : [...list, filter],
    );
  };
  const prune = (id: string) => {
    const filter = filtersRef.current.find((item) => item.id === id);
    if (filter && !isFilterComplete(filter))
      commitFilters(filtersRef.current.filter((item) => item.id !== id));
  };

  const segmentSelector = "[data-chip-segment]";
  const focusAfterRemoval = (index: number) => {
    requestAnimationFrame(() => {
      const chips = barRef.current?.querySelectorAll<HTMLElement>(
        "[data-slot=filter-chip]",
      );
      const target = chips?.[Math.max(0, index - 1)] ?? null;
      const segment = target?.querySelector<HTMLElement>("[data-chip-value]");
      (segment ?? searchRef.current ?? filterButtonRef.current)?.focus();
    });
  };
  const remove = (id: string, refocus = true) => {
    const index = filtersRef.current.findIndex((item) => item.id === id);
    commitFilters(filtersRef.current.filter((item) => item.id !== id));
    if (refocus) focusAfterRemoval(index);
  };

  const clearAll = () => {
    commitFilters([]);
    if (query) setQuery("");
    requestAnimationFrame(() =>
      (searchRef.current ?? filterButtonRef.current)?.focus(),
    );
  };

  const selectView = (view: FilterView | null) => {
    commitFilters(view ? view.filters.map((filter) => ({ ...filter })) : []);
    setQuery(view?.query ?? "");
    if (activeViewIdProp === undefined) setViewState(view?.id ?? null);
    onViewChange?.(view);
  };

  const startField = (key: string) => {
    const field = fieldMap.get(key);
    if (!field) return;
    // Reopen an existing enum filter rather than stacking a second one.
    const existing =
      field.type === "enum"
        ? filtersRef.current.find(
            (filter) => filter.field === key && !isNegative(filter.operator),
          )
        : undefined;
    const id = existing?.id ?? newId(field);
    if (!existing && field.type === "boolean")
      upsert({ id, field: key, operator: "is", value: true });
    setMenuField({ key, id });
  };

  const draftFor = (key: string, id: string): Filter => {
    const field = fieldMap.get(key)!;
    return (
      filtersRef.current.find((filter) => filter.id === id) ?? {
        id,
        field: key,
        operator:
          field.operators?.find((op) =>
            DEFAULT_OPERATORS[field.type].includes(op),
          ) ?? DEFAULT_OPERATOR[field.type],
        value: field.type === "enum" ? [] : null,
      }
    );
  };

  const onChipKeyDown = (event: React.KeyboardEvent, id: string) => {
    const target = event.target as HTMLElement;
    if (!target.matches(segmentSelector)) return;
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      remove(id);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const segments = Array.from(
        barRef.current?.querySelectorAll<HTMLElement>(segmentSelector) ?? [],
      );
      const index = segments.indexOf(target);
      const next = segments[index + (event.key === "ArrowRight" ? 1 : -1)];
      if (next) {
        event.preventDefault();
        next.focus();
      }
    }
  };

  const height =
    size === "sm" ? "h-10 sm:h-8 text-[13px]" : "h-11 sm:h-9 text-sm";
  const hasFilters = filters.length > 0;

  const fieldItems: ListItem[] = fields.map((field) => {
    const Icon = TYPE_ICONS[field.type];
    return {
      value: field.key,
      label: field.label,
      icon: field.icon ?? <Icon />,
      trailing: (
        <IconChevronRight
          aria-hidden="true"
          className="size-3.5 shrink-0 text-muted-foreground/70"
        />
      ),
    };
  });

  const menuEditorField = menuField ? fieldMap.get(menuField.key) : undefined;

  return (
    <div
      ref={barRef}
      data-slot="filter-bar"
      role="group"
      aria-label={props["aria-label"] ?? "Filters"}
      className={cn("@container/filter-bar w-full min-w-0", className)}
      {...props}
    >
      <style>{keyframes}</style>
      <div className="flex min-w-0 flex-wrap items-center gap-2">

      {views && views.length > 0 && (
        <ViewsMenu
          views={views}
          active={activeView}
          modified={modified}
          labels={labels}
          height={height}
          onSelect={selectView}
          onSave={
            onSaveView
              ? (name) => onSaveView(name, { filters: filtersRef.current, query })
              : undefined
          }
        />
      )}

      {showSearch && (
        <div
          data-slot="filter-bar-search"
          className="relative w-full min-w-0 @md/filter-bar:w-56 @2xl/filter-bar:w-64"
        >
          <IconSearch
            aria-hidden="true"
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={searchRef}
            type="search"
            aria-label={labels.search}
            value={query}
            placeholder={searchPlaceholder ?? `${labels.search}…`}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Backspace" &&
                !query &&
                filtersRef.current.length
              ) {
                event.preventDefault();
                const last = filtersRef.current[filtersRef.current.length - 1];
                remove(last.id, false);
              } else if (event.key === "Escape" && query) {
                event.preventDefault();
                setQuery("");
              }
            }}
            className={cn(
              "w-full rounded-lg border border-input bg-card ps-9 pe-8 text-base text-foreground shadow-xs transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/25 sm:text-sm motion-reduce:transition-none [&::-webkit-search-cancel-button]:appearance-none",
              height,
              "sm:text-sm",
            )}
          />
          {query && (
            <button
              type="button"
              aria-label={`${labels.clear} ${labels.search.toLowerCase()}`}
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              className={cn(
                "absolute end-1.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                focusRing,
              )}
            >
              <IconX aria-hidden="true" className="size-3.5" />
            </button>
          )}
        </div>
      )}

      {filters.map((filter) => {
        const field = fieldMap.get(filter.field);
        if (!field) return null;
        const Icon = TYPE_ICONS[field.type];
        const operators = field.operators ?? DEFAULT_OPERATORS[field.type];
        const { text, swatches } = describeValue(filter, field, labels, locale);
        const operatorText = opLabel(labels, filter.operator);
        const fixedOperator = field.type === "boolean" || operators.length < 2;
        const custom = renderValue?.(filter, field);
        const valueContent = custom ?? (
          <>
            {swatches.some((s) => s.icon || s.color) && (
              <span className="flex shrink-0 items-center -space-x-1">
                {swatches.slice(0, 3).map((swatch) => (
                  <span
                    key={swatch.value}
                    className="flex items-center rounded-full bg-card p-px"
                  >
                    <Swatch option={swatch} />
                  </span>
                ))}
              </span>
            )}
            <span
              className={cn(
                "max-w-[14rem] truncate tabular-nums",
                !text && "font-normal text-muted-foreground",
              )}
            >
              {text || labels.selectValue}
            </span>
          </>
        );
        const operatorItems: ListItem[] =
          field.type === "enum"
            ? [false, true].map((negative) => {
                const op = enumOperator(
                  negative,
                  Array.isArray(filter.value) ? filter.value.length : 1,
                );
                return { value: op, label: opLabel(labels, op) };
              })
            : operators.map((op) => ({
                value: op,
                label: opLabel(labels, op),
                hint: field.type === "number" ? NUMBER_HINTS[op] : undefined,
              }));
        const segment = cn(
          "flex items-center gap-1.5 border-s border-border/60 px-2.5 transition-colors duration-150 @max-sm/filter-bar:px-2 motion-reduce:transition-none",
          "outline-none focus-visible:z-10 focus-visible:bg-primary/[0.06] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset",
        );
        return (
          <div
            key={filter.id}
            role="group"
            aria-label={`${field.label} ${operatorText} ${text || labels.selectValue}`}
            data-slot="filter-chip"
            data-field={filter.field}
            data-operator={filter.operator}
            data-incomplete={!isFilterComplete(filter) ? "" : undefined}
            onKeyDown={(event) => onChipKeyDown(event, filter.id)}
            className={cn(
              "group/chip inline-flex max-w-full min-w-0 items-stretch overflow-hidden rounded-lg border border-border/80 bg-card text-foreground",
              "shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_1px_2px_rgb(0_0_0/0.05)] transition-[border-color,box-shadow] duration-150 hover:border-border hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_2px_6px_-2px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] motion-reduce:transition-none",
              "motion-safe:animate-[filter-bar-in_220ms_cubic-bezier(0.22,1,0.36,1)]",
              height,
            )}
          >
            <span className="flex shrink-0 items-center gap-1.5 px-2.5 whitespace-nowrap text-muted-foreground @max-sm/filter-bar:px-2">
              <span
                aria-hidden="true"
                className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4"
              >
                {field.icon ?? <Icon />}
              </span>
              <span className="@max-2xs/filter-bar:sr-only">{field.label}</span>
            </span>
            {fixedOperator ? (
              <span className="flex shrink-0 items-center border-s border-border/60 px-2.5 whitespace-nowrap text-muted-foreground @max-sm/filter-bar:px-2">
                {operatorText}
              </span>
            ) : (
              <PopoverPrimitive.Root
                open={editing?.id === filter.id && editing.part === "operator"}
                onOpenChange={(open) =>
                  setEditing(open ? { id: filter.id, part: "operator" } : null)
                }
              >
                <PopoverPrimitive.Trigger asChild>
                  <button
                    type="button"
                    data-chip-segment=""
                    aria-label={`${field.label} operator, ${operatorText}`}
                    className={cn(
                      segment,
                      "shrink-0 whitespace-nowrap text-muted-foreground hover:bg-muted/70 hover:text-foreground data-[state=open]:bg-muted/70 data-[state=open]:text-foreground",
                    )}
                  >
                    {operatorText}
                  </button>
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Portal>
                  <PopoverPrimitive.Content
                    align="start"
                    sideOffset={6}
                    collisionPadding={8}
                    className={cn(popoverSurface, "w-56 overflow-hidden")}
                  >
                    <OptionList
                      label={`${field.label} operator`}
                      emptyText={labels.noResults}
                      selected={[filter.operator]}
                      items={operatorItems}
                      onSelect={(value) => {
                        const operator = value as FilterOperator;
                        const current =
                          filtersRef.current.find((f) => f.id === filter.id) ?? filter;
                        let nextValue = current.value;
                        if (field.type === "number") {
                          if (operator === "between" && !Array.isArray(nextValue))
                            nextValue = [nextValue as number, NaN];
                          else if (operator !== "between" && Array.isArray(nextValue))
                            nextValue = (nextValue as [number, number])[0];
                        }
                        if (field.type === "date") {
                          if (operator === "between" && !Array.isArray(nextValue))
                            nextValue = ["", ""];
                          else if (operator !== "between" && Array.isArray(nextValue))
                            nextValue = (nextValue as string[])[0] ?? null;
                          if (operator === "within-last" || current.operator === "within-last")
                            nextValue = operator === "within-last" ? "7d" : null;
                        }
                        upsert({ ...current, operator, value: nextValue });
                        setEditing(
                          isFilterComplete({ ...current, operator, value: nextValue })
                            ? null
                            : { id: filter.id, part: "value" },
                        );
                      }}
                    />
                  </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
              </PopoverPrimitive.Root>
            )}
            <PopoverPrimitive.Root
              open={editing?.id === filter.id && editing.part === "value"}
              onOpenChange={(open) => {
                setEditing(open ? { id: filter.id, part: "value" } : null);
                if (!open) prune(filter.id);
              }}
            >
              <PopoverPrimitive.Trigger asChild>
                <button
                  type="button"
                  data-chip-segment=""
                  data-chip-value=""
                  aria-label={`${field.label} value, ${text || labels.selectValue}`}
                  className={cn(
                    segment,
                    "min-w-0 font-medium hover:bg-muted/70 data-[state=open]:bg-muted/70",
                  )}
                >
                  {valueContent}
                </button>
              </PopoverPrimitive.Trigger>
              <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                  align="start"
                  sideOffset={6}
                  collisionPadding={8}
                  className={cn(
                    popoverSurface,
                    field.type === "enum"
                      ? "w-[min(17rem,var(--radix-popover-content-available-width))]"
                      : "w-[min(20rem,var(--radix-popover-content-available-width))]",
                    "overflow-hidden",
                  )}
                >
                  <ValueEditor
                    field={field}
                    filter={filtersRef.current.find((f) => f.id === filter.id) ?? filter}
                    labels={labels}
                    counts={optionCounts?.[field.key]}
                    onChange={upsert}
                    onDone={() => {
                      setEditing(null);
                      prune(filter.id);
                    }}
                  />
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
            <button
              type="button"
              data-chip-segment=""
              aria-label={labels.removeFilter(field.label)}
              onClick={() => remove(filter.id)}
              className={cn(
                segment,
                "justify-center px-0 text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                size === "sm" ? "w-10 sm:w-8" : "w-11 sm:w-9",
              )}
            >
              <IconX aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        );
      })}

      <PopoverPrimitive.Root
        open={menuOpen}
        onOpenChange={(open) => {
          setMenuOpen(open);
          if (!open) {
            if (menuField) prune(menuField.id);
            setMenuField(null);
          }
        }}
      >
        <PopoverPrimitive.Trigger asChild>
          <button
            ref={filterButtonRef}
            type="button"
            data-slot="filter-bar-add"
            aria-label={hasFilters ? labels.addFilter : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-dashed border-border px-3 text-muted-foreground transition-[color,background-color,border-color,box-shadow] duration-150 hover:border-solid hover:border-border hover:bg-card hover:text-foreground hover:shadow-xs data-[state=open]:border-solid data-[state=open]:bg-card data-[state=open]:text-foreground motion-reduce:transition-none",
              focusRing,
              height,
              hasFilters && "px-2.5",
            )}
          >
            {hasFilters ? (
              <IconPlus aria-hidden="true" className="size-4" />
            ) : (
              <IconFilter aria-hidden="true" className="size-4" />
            )}
            <span className={cn(hasFilters && "max-sm:sr-only")}>{labels.filter}</span>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={6}
            collisionPadding={8}
            className={cn(
              popoverSurface,
              menuEditorField && menuEditorField.type !== "enum"
                ? "w-[min(20rem,var(--radix-popover-content-available-width))]"
                : "w-[min(17rem,var(--radix-popover-content-available-width))]",
              "overflow-hidden",
            )}
          >
            {menuEditorField && menuField ? (
              <div
                key={menuField.key}
                className="flex flex-col motion-safe:animate-[filter-bar-in_180ms_cubic-bezier(0.22,1,0.36,1)]"
              >
                <div className="flex h-10 items-center gap-1 border-b border-border/60 px-1.5">
                  <button
                    type="button"
                    aria-label={labels.back}
                    onClick={() => {
                      prune(menuField.id);
                      setMenuField(null);
                    }}
                    className={cn(
                      "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      focusRing,
                    )}
                  >
                    <IconChevronLeft aria-hidden="true" className="size-4" />
                  </button>
                  <span className="text-sm font-medium">{menuEditorField.label}</span>
                  <span className="ms-auto pe-1.5 text-xs text-muted-foreground">
                    {opLabel(
                      labels,
                      draftFor(menuField.key, menuField.id).operator,
                    )}
                  </span>
                </div>
                <ValueEditor
                  field={menuEditorField}
                  filter={draftFor(menuField.key, menuField.id)}
                  labels={labels}
                  counts={optionCounts?.[menuEditorField.key]}
                  onChange={upsert}
                  onDone={() => {
                    prune(menuField.id);
                    setMenuOpen(false);
                    setMenuField(null);
                  }}
                  onBack={() => {
                    prune(menuField.id);
                    setMenuField(null);
                  }}
                />
              </div>
            ) : (
              <OptionList
                searchable
                label={labels.filter}
                placeholder={labels.searchFields}
                emptyText={labels.noResults}
                items={fieldItems}
                onSelect={startField}
              />
            )}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {(hasFilters || (showSearch && query)) && (
        <button
          type="button"
          data-slot="filter-bar-clear"
          onClick={clearAll}
          className={cn(
            "inline-flex shrink-0 items-center rounded-lg px-2.5 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground motion-reduce:transition-none",
            focusRing,
            height,
          )}
        >
          {labels.clear}
        </button>
      )}

      {actions && (
        <div className="ms-auto flex shrink-0 items-center gap-2">{actions}</div>
      )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Views                                                                     */
/* ------------------------------------------------------------------------ */

function ViewsMenu({
  views,
  active,
  modified,
  labels,
  height,
  onSelect,
  onSave,
}: {
  views: FilterView[];
  active: FilterView | null;
  modified: boolean;
  labels: FilterBarLabels;
  height: string;
  onSelect: (view: FilterView | null) => void;
  onSave?: (name: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [name, setName] = React.useState("");
  const ALL = "\u0000all";
  const save = () => {
    const trimmed = name.trim();
    if (!trimmed || !onSave) return;
    onSave(trimmed);
    setName("");
    setSaving(false);
    setOpen(false);
  };
  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSaving(false);
      }}
    >
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-slot="filter-bar-views"
          data-modified={modified ? "" : undefined}
          className={cn(
            "inline-flex max-w-full shrink-0 items-center gap-2 rounded-lg border border-input bg-card px-3 font-medium text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_1px_2px_rgb(0_0_0/0.05)] transition-[background-color,box-shadow] duration-150 hover:bg-muted/60 data-[state=open]:bg-muted/60 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] motion-reduce:transition-none",
            focusRing,
            height,
          )}
        >
          <IconBookmarks aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{active?.name ?? labels.allView}</span>
          {modified && (
            <span
              title={labels.modified}
              className="size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]"
            >
              <span className="sr-only">, {labels.modified}</span>
            </span>
          )}
          <IconChevronDown
            aria-hidden="true"
            className="size-3.5 shrink-0 text-muted-foreground"
          />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          collisionPadding={8}
          className={cn(popoverSurface, "w-64 overflow-hidden")}
        >
          <OptionList
            label={labels.views}
            emptyText={labels.noResults}
            selected={[active?.id ?? ALL]}
            items={[
              { value: ALL, label: labels.allView },
              ...views.map((view) => ({
                value: view.id,
                label: view.name,
                hint:
                  view.id === active?.id && modified ? labels.modified : undefined,
              })),
            ]}
            onSelect={(value) => {
              onSelect(views.find((view) => view.id === value) ?? null);
              setOpen(false);
            }}
          />
          {onSave && (
            <div className="border-t border-border/60 p-1">
              {saving ? (
                <form
                  className="flex items-center gap-1.5 p-1"
                  onSubmit={(event) => {
                    event.preventDefault();
                    save();
                  }}
                >
                  <input
                    autoFocus
                    aria-label={labels.viewName}
                    placeholder={labels.viewName}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={cn(editorInput, "h-9 sm:h-8")}
                  />
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className={cn(
                      "h-9 shrink-0 rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-opacity disabled:opacity-50 sm:h-8",
                      focusRing,
                    )}
                  >
                    {labels.save}
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSaving(true)}
                  className={cn(
                    "flex h-10 w-full items-center gap-2.5 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-8",
                    focusRing,
                  )}
                >
                  <IconPlus aria-hidden="true" className="size-4" />
                  {labels.saveView}
                </button>
              )}
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
