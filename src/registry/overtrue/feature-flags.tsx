"use client";

import * as React from "react";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconArchive,
  IconCheck,
  IconChevronRight,
  IconCopy,
  IconFilter,
  IconLoader2,
  IconLock,
  IconPlus,
  IconRestore,
  IconSearch,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { RangeSlider } from "./range-slider";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

export type FeatureFlagStatus = "active" | "stale" | "archived";

export interface FeatureFlagEnvironment {
  id: string;
  label: string;
  /** Turning the flag on or off here asks for inline confirmation first. */
  protected?: boolean;
}

export interface FeatureFlagOwner {
  name: string;
  avatarUrl?: string;
}

/** One targeting rule. Rules are checked in order; the first match wins. */
export interface FeatureFlagRule {
  id: string;
  /** The attribute matched, such as "plan" or "country". */
  attribute: string;
  /** How it is matched, such as "is one of" or "ends with". */
  operator: string;
  values: string[];
  /** Share of matching users who get the flag, 0 to 100. Defaults to 100. */
  rollout?: number;
}

export interface FeatureFlagEnvironmentState {
  enabled: boolean;
  /** Share of everyone else, after the rules, who get the flag, 0 to 100. */
  rollout: number;
  rules?: FeatureFlagRule[];
}

export interface FeatureFlagChange {
  id: string;
  at: Date | string | number;
  actor: string;
  /** Environment id, when the change applied to one environment. */
  environment?: string;
  summary: string;
}

export interface FeatureFlag {
  id: string;
  /** The identifier your code evaluates, such as "checkout-v2". */
  key: string;
  name: string;
  description?: string;
  owner?: FeatureFlagOwner | string;
  status: FeatureFlagStatus;
  tags?: string[];
  /** Settings per environment id. Missing environments read as off at 0%. */
  environments: Record<string, FeatureFlagEnvironmentState>;
  updatedAt: Date | string | number;
  /** When the flag was last evaluated by any SDK. Shown for stale flags. */
  lastEvaluatedAt?: Date | string | number;
  /** Newest first. */
  history?: FeatureFlagChange[];
}

/** A change to one flag. Environment changes carry `environment`. */
export interface FeatureFlagPatch {
  environment?: string;
  enabled?: boolean;
  rollout?: number;
  status?: FeatureFlagStatus;
}

export interface FeatureFlagDraft {
  name: string;
  key: string;
  description: string;
}

export interface FeatureFlagsLabels {
  title: string;
  search: string;
  clearSearch: string;
  environment: string;
  newFlag: string;
  flag: string;
  owner: string;
  targeting: string;
  rollout: string;
  lastChanged: string;
  status: string;
  enabled: string;
  statuses: Record<FeatureFlagStatus, string>;
  everyone: string;
  everyoneElse: string;
  off: string;
  noOwner: string;
  saving: string;
  retry: string;
  dismiss: string;
  cancel: string;
  history: string;
  noHistory: string;
  environments: string;
  copyKey: string;
  copied: string;
  archive: string;
  restore: string;
  name: string;
  key: string;
  description: string;
  create: string;
  turnedOn: string;
  turnedOff: string;
  created: string;
  summary: (total: number, on: number, environment: string) => string;
  noResults: (query: string) => string;
  empty: string;
  targetingIn: (environment: string) => string;
  serve: (percent: number) => string;
  confirmTitle: (enabled: boolean, environment: string) => string;
  confirmBody: (flag: string, enabled: boolean) => string;
  confirmAction: (enabled: boolean) => string;
  failed: (summary: string, environment?: string) => string;
  rolledBack: string;
  rolloutChange: (from: number, to: number) => string;
  statusChange: (status: FeatureFlagStatus) => string;
  saved: (flag: string, summary: string, environment?: string) => string;
  lastEvaluated: (when: string) => string;
  toggleLabel: (flag: string, environment: string) => string;
  rolloutLabel: (flag: string, environment: string) => string;
  invalidName: string;
  invalidKey: string;
  duplicateKey: string;
}

export interface FeatureFlagsProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "onChange" | "children" | "defaultValue"
> {
  /** Controlled flags. Update them in `onChange` or when its promise resolves. */
  flags?: FeatureFlag[];
  /** Initial flags when uncontrolled; the block then applies successful changes itself. */
  defaultFlags?: FeatureFlag[];
  /**
   * Saves a change. The block shows it at once; return a promise to show a
   * spinner, and reject it to roll the change back with an inline error.
   */
  onChange?: (flag: FeatureFlag, patch: FeatureFlagPatch) => void | Promise<unknown>;
  /**
   * Creates a flag from the inline form. Return the new flag (or a promise of
   * it) to use it as is; reject to show the error in the form. Uncontrolled
   * blocks add the flag themselves.
   */
  onCreate?: (
    draft: FeatureFlagDraft,
  ) => void | FeatureFlag | Promise<FeatureFlag | void>;
  /** Defaults to Development, Staging and a protected Production. */
  environments?: FeatureFlagEnvironment[];
  environment?: string;
  defaultEnvironment?: string;
  onEnvironmentChange?: (environment: string) => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** The expanded flag showing targeting rules and history. */
  expandedId?: string | null;
  defaultExpandedId?: string | null;
  onExpandedChange?: (id: string | null) => void;
  title?: React.ReactNode;
  /** Replaces the flag count under the title. */
  description?: React.ReactNode;
  /** Extra controls beside "New flag". */
  actions?: React.ReactNode;
  /** Name recorded in history for changes made here. Defaults to "You". */
  actor?: string;
  /** Reference time for relative timestamps. Defaults to now, refreshed every minute. */
  now?: Date | number;
  /** Locale for dates. Defaults to en-US to match the default labels. */
  locale?: string;
  /** Formats "last changed" and history times. */
  formatTime?: (date: Date, now: Date) => string;
  labels?: Partial<FeatureFlagsLabels>;
}

/* ------------------------------------------------------------------------ */
/* Defaults                                                                  */
/* ------------------------------------------------------------------------ */

export const defaultFlagEnvironments: FeatureFlagEnvironment[] = [
  { id: "development", label: "Development" },
  { id: "staging", label: "Staging" },
  { id: "production", label: "Production", protected: true },
];

const defaultLabels: FeatureFlagsLabels = {
  title: "Feature flags",
  search: "Search flags",
  clearSearch: "Clear search",
  environment: "Environment",
  newFlag: "New flag",
  flag: "Flag",
  owner: "Owner",
  targeting: "Targeting",
  rollout: "Rollout",
  lastChanged: "Last changed",
  status: "Status",
  enabled: "On",
  statuses: { active: "Active", stale: "Stale", archived: "Archived" },
  everyone: "Everyone",
  everyoneElse: "Everyone else",
  off: "Off",
  noOwner: "No owner",
  saving: "Saving…",
  retry: "Retry",
  dismiss: "Dismiss",
  cancel: "Cancel",
  history: "Change history",
  noHistory: "No changes recorded yet.",
  environments: "Environments",
  copyKey: "Copy key",
  copied: "Copied",
  archive: "Archive flag",
  restore: "Restore",
  name: "Name",
  key: "Key",
  description: "Description",
  create: "Create flag",
  turnedOn: "Turned on",
  turnedOff: "Turned off",
  created: "Created",
  summary: (total, on, environment) =>
    `${total} ${total === 1 ? "flag" : "flags"} · ${on} on in ${environment}`,
  noResults: (query) => `No flags match “${query}”.`,
  empty: "No flags yet.",
  targetingIn: (environment) => `Targeting in ${environment}`,
  serve: (percent) => `${percent}%`,
  confirmTitle: (enabled, environment) =>
    `Turn ${enabled ? "on" : "off"} in ${environment}?`,
  confirmBody: (flag, enabled) =>
    enabled
      ? `${flag} starts serving live traffic right away.`
      : `${flag} stops for everyone right away, including targeted users.`,
  confirmAction: (enabled) => (enabled ? "Turn on" : "Turn off"),
  failed: (summary, environment) =>
    `Couldn’t save “${summary}”${environment ? ` in ${environment}` : ""}.`,
  rolledBack: "The change was rolled back.",
  rolloutChange: (from, to) => `Rollout ${from}% → ${to}%`,
  statusChange: (status) =>
    status === "archived"
      ? "Archived"
      : status === "stale"
        ? "Marked stale"
        : "Restored",
  saved: (flag, summary, environment) =>
    `${flag}: ${summary}${environment ? ` in ${environment}` : ""}.`,
  lastEvaluated: (when) => `Last evaluated ${when}`,
  toggleLabel: (flag, environment) => `${flag} in ${environment}`,
  rolloutLabel: (flag, environment) => `${flag} rollout in ${environment}`,
  invalidName: "Give the flag a name.",
  invalidKey: "Keys use lowercase letters, numbers, dashes and dots.",
  duplicateKey: "A flag with this key already exists.",
};

const STATUS_STYLES: Record<FeatureFlagStatus, { pill: string; dot: string }> = {
  active: {
    pill: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  stale: {
    pill: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  archived: {
    pill: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/60",
  },
};

const styles = `@keyframes feature-flags-in{from{opacity:0;transform:translateY(-4px)}}`;

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50";
const ghostButton = cn(
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4",
  focusRing,
);
const primaryButton = cn(
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground shadow-xs transition-colors duration-150 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none [&_svg]:size-4",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
);
const fieldInput =
  "h-9 w-full min-w-0 rounded-lg border border-input bg-card px-3 text-base text-foreground shadow-xs transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/25 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 sm:text-sm motion-reduce:transition-none";

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

const OFF: FeatureFlagEnvironmentState = { enabled: false, rollout: 0 };
const KEY_PATTERN = /^[a-z0-9]+(?:[-_.][a-z0-9]+)*$/;

const toDate = (value: Date | string | number) =>
  value instanceof Date ? value : new Date(value);

function slugify(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function ownerName(owner: FeatureFlag["owner"]) {
  return typeof owner === "string" ? owner : owner?.name;
}

function hashString(text: string) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1)
    hash = (hash * 31 + text.charCodeAt(index)) | 0;
  return Math.abs(hash);
}

function ruleText(rule: FeatureFlagRule) {
  return `${rule.attribute} ${rule.operator} ${rule.values.join(", ")}`;
}

/** The short form used in rows: "plan: Pro, Enterprise". */
function ruleShort(rule: FeatureFlagRule) {
  return `${rule.attribute}: ${rule.values.join(", ")}`;
}

/** Compact relative time: "just now", "12m ago", "3h ago", "5d ago", then a date. */
function defaultFormatTime(date: Date, now: Date, locale?: string) {
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  }).format(date);
}

function applyPatch(flag: FeatureFlag, patch: FeatureFlagPatch): FeatureFlag {
  let next = flag;
  if (
    patch.environment &&
    (patch.enabled !== undefined || patch.rollout !== undefined)
  ) {
    const current = flag.environments[patch.environment] ?? OFF;
    next = {
      ...next,
      environments: {
        ...next.environments,
        [patch.environment]: {
          ...current,
          ...(patch.enabled !== undefined ? { enabled: patch.enabled } : null),
          ...(patch.rollout !== undefined ? { rollout: patch.rollout } : null),
        },
      },
    };
  }
  if (patch.status) next = { ...next, status: patch.status };
  return next;
}

function useControllable<T>(
  controlled: T | undefined,
  initial: T,
  onChange?: (value: T) => void,
) {
  const [state, setState] = React.useState(initial);
  const value = controlled !== undefined ? controlled : state;
  const set = (next: T) => {
    if (controlled === undefined) setState(next);
    onChange?.(next);
  };
  return [value, set] as const;
}

/* ------------------------------------------------------------------------ */
/* Small parts                                                               */
/* ------------------------------------------------------------------------ */

function Avatar({ owner }: { owner: FeatureFlagOwner | string }) {
  const name = typeof owner === "string" ? owner : owner.name;
  const url = typeof owner === "string" ? undefined : owner.avatarUrl;
  if (url)
    return (
      <img
        src={url}
        alt=""
        className="size-6 shrink-0 rounded-full object-cover ring-1 ring-border/60"
      />
    );
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const chart = `var(--color-chart-${(hashString(name) % 5) + 1})`;
  return (
    <span
      aria-hidden="true"
      data-slot="feature-flag-avatar"
      className="flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] leading-none font-semibold"
      style={{
        background: `color-mix(in oklab, ${chart} 18%, transparent)`,
        color: `color-mix(in oklab, ${chart} 62%, var(--color-foreground))`,
      }}
    >
      {initials}
    </span>
  );
}

function StatusPill({
  status,
  labels,
}: {
  status: FeatureFlagStatus;
  labels: FeatureFlagsLabels;
}) {
  return (
    <span
      data-slot="feature-flag-status"
      data-status={status}
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status].pill,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", STATUS_STYLES[status].dot)}
      />
      {labels.statuses[status]}
    </span>
  );
}

function TargetingSummary({
  state,
  labels,
}: {
  state: FeatureFlagEnvironmentState;
  labels: FeatureFlagsLabels;
}) {
  const rules = state.rules ?? [];
  const Icon = rules.length ? IconFilter : IconUsersGroup;
  return (
    <span
      data-slot="feature-flag-targeting"
      title={rules.map(ruleText).join("\n") || undefined}
      className="flex min-w-0 items-center gap-1.5"
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0 opacity-70" />
      <span className="truncate">
        {rules.length ? ruleShort(rules[0]) : labels.everyone}
      </span>
      {rules.length > 1 && (
        <span className="shrink-0 rounded-md bg-muted px-1 text-[11px] leading-4 font-medium tabular-nums text-muted-foreground">
          +{rules.length - 1}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Create form                                                               */
/* ------------------------------------------------------------------------ */

function CreateForm({
  labels,
  keys,
  onCancel,
  onSubmit,
}: {
  labels: FeatureFlagsLabels;
  keys: Set<string>;
  onCancel: () => void;
  onSubmit: (draft: FeatureFlagDraft) => Promise<void>;
}) {
  const id = React.useId();
  const [name, setName] = React.useState("");
  const [key, setKey] = React.useState("");
  const [keyEdited, setKeyEdited] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState<{
    field: "name" | "key" | "form";
    message: string;
  } | null>(null);
  const [busy, setBusy] = React.useState(false);
  const effectiveKey = keyEdited ? key : slugify(name);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (!name.trim()) return setError({ field: "name", message: labels.invalidName });
    if (!KEY_PATTERN.test(effectiveKey))
      return setError({ field: "key", message: labels.invalidKey });
    if (keys.has(effectiveKey))
      return setError({ field: "key", message: labels.duplicateKey });
    setError(null);
    setBusy(true);
    try {
      await onSubmit({
        name: name.trim(),
        key: effectiveKey,
        description: description.trim(),
      });
    } catch (reason) {
      setError({
        field: "form",
        message: reason instanceof Error ? reason.message : String(reason),
      });
      setBusy(false);
    }
  };

  return (
    <form
      data-slot="feature-flags-create"
      aria-label={labels.newFlag}
      onSubmit={submit}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
        }
      }}
      className="mb-1 rounded-xl bg-muted/40 p-3 ring-1 ring-border/60 ring-inset motion-safe:animate-[feature-flags-in_220ms_cubic-bezier(0.22,1,0.36,1)]"
    >
      <div className="grid gap-3 @2xl/feature-flags:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)]">
        <label className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">{labels.name}</span>
          <input
            autoFocus
            value={name}
            placeholder="New onboarding tour"
            aria-invalid={error?.field === "name" || undefined}
            aria-describedby={error?.field === "name" ? `${id}-error` : undefined}
            onChange={(event) => setName(event.target.value)}
            className={fieldInput}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">{labels.key}</span>
          <input
            value={effectiveKey}
            placeholder="new-onboarding-tour"
            spellCheck={false}
            autoComplete="off"
            aria-invalid={error?.field === "key" || undefined}
            aria-describedby={error?.field === "key" ? `${id}-error` : undefined}
            onChange={(event) => {
              setKeyEdited(true);
              setKey(event.target.value);
            }}
            className={cn(fieldInput, "font-mono sm:text-xs")}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">
            {labels.description}
          </span>
          <input
            value={description}
            placeholder="What it changes and when it can go"
            onChange={(event) => setDescription(event.target.value)}
            className={fieldInput}
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="me-auto flex min-w-0 items-center gap-1.5 text-[13px] text-rose-700 dark:text-rose-400"
          >
            <IconAlertCircle aria-hidden="true" className="size-4 shrink-0" />
            {error.message}
          </p>
        )}
        <button type="button" onClick={onCancel} className={ghostButton}>
          {labels.cancel}
        </button>
        <button type="submit" disabled={busy} className={primaryButton}>
          {busy && (
            <IconLoader2 aria-hidden="true" className="motion-safe:animate-spin" />
          )}
          {labels.create}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------------ */
/* Feature flags                                                             */
/* ------------------------------------------------------------------------ */

type PendingOp = { id: number; flagId: string; patch: FeatureFlagPatch };
type FlagError = { message: string; summary: string; patch: FeatureFlagPatch };

/**
 * A feature flag console: search, an environment switcher, per-environment
 * switches and rollout, optimistic saves that roll back on failure, and an
 * expandable row with targeting rules and change history.
 */
export function FeatureFlags({
  flags: flagsProp,
  defaultFlags = [],
  onChange,
  onCreate,
  environments = defaultFlagEnvironments,
  environment: environmentProp,
  defaultEnvironment,
  onEnvironmentChange,
  query: queryProp,
  defaultQuery = "",
  onQueryChange,
  expandedId: expandedProp,
  defaultExpandedId = null,
  onExpandedChange,
  title,
  description,
  actions,
  actor = "You",
  now: nowProp,
  locale = "en-US",
  formatTime,
  labels: labelsProp,
  className,
  ...props
}: FeatureFlagsProps) {
  const labels: FeatureFlagsLabels = {
    ...defaultLabels,
    ...labelsProp,
    statuses: { ...defaultLabels.statuses, ...labelsProp?.statuses },
  };
  const id = React.useId();
  const listRef = React.useRef<HTMLUListElement>(null);

  /* State ------------------------------------------------------------------ */

  const [baseState, setBaseState] = React.useState(defaultFlags);
  const base = flagsProp ?? baseState;
  const [ops, setOps] = React.useState<PendingOp[]>([]);
  const flags = React.useMemo(
    () =>
      ops.length
        ? base.map((flag) =>
            ops.reduce(
              (acc, op) => (op.flagId === flag.id ? applyPatch(acc, op.patch) : acc),
              flag,
            ),
          )
        : base,
    [base, ops],
  );
  const flagsRef = React.useRef(flags);
  flagsRef.current = flags;

  const [environment, setEnvironment] = useControllable(
    environmentProp,
    defaultEnvironment ?? environments[0]?.id ?? "",
    onEnvironmentChange,
  );
  const env =
    environments.find((item) => item.id === environment) ?? environments[0];
  const [query, setQuery] = useControllable(queryProp, defaultQuery, onQueryChange);
  const [expandedId, setExpandedId] = useControllable<string | null>(
    expandedProp,
    defaultExpandedId,
    onExpandedChange,
  );

  const [errors, setErrors] = React.useState<Record<string, FlagError>>({});
  const [confirming, setConfirming] = React.useState<{
    flagId: string;
    environment: string;
    enabled: boolean;
  } | null>(null);
  const [draft, setDraft] = React.useState<{
    flagId: string;
    environment: string;
    value: number;
  } | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const [tick, setTick] = React.useState(() => Date.now());
  const commitTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const opCounter = React.useRef(0);

  React.useEffect(() => {
    if (nowProp !== undefined) return;
    const timer = setInterval(() => setTick(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, [nowProp]);
  React.useEffect(
    () => () => {
      clearTimeout(commitTimer.current);
      clearTimeout(copyTimer.current);
    },
    [],
  );

  const now = new Date(nowProp ?? tick);
  const time = (value: Date | string | number) => {
    const date = toDate(value);
    return formatTime ? formatTime(date, now) : defaultFormatTime(date, now, locale);
  };
  const fullTime = (value: Date | string | number) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(toDate(value));
  const envLabel = (envId?: string) =>
    environments.find((item) => item.id === envId)?.label ?? envId;

  /* Saving ----------------------------------------------------------------- */

  const describe = (flag: FeatureFlag, patch: FeatureFlagPatch) => {
    if (patch.status) return labels.statusChange(patch.status);
    if (patch.enabled !== undefined)
      return patch.enabled ? labels.turnedOn : labels.turnedOff;
    if (patch.rollout !== undefined && patch.environment)
      return labels.rolloutChange(
        (flag.environments[patch.environment] ?? OFF).rollout,
        patch.rollout,
      );
    return "";
  };

  const run = async (flagId: string, patch: FeatureFlagPatch) => {
    const before = flagsRef.current.find((flag) => flag.id === flagId);
    if (!before) return;
    const summary = describe(before, patch);
    const opId = ++opCounter.current;
    setOps((list) => [...list, { id: opId, flagId, patch }]);
    setErrors(({ [flagId]: _dropped, ...rest }) => rest);
    setAnnouncement(labels.saving);
    try {
      await onChange?.(before, patch);
      if (flagsProp === undefined) {
        const entry: FeatureFlagChange = {
          id: `change-${opId}-${Date.now()}`,
          at: new Date(),
          actor,
          environment: patch.environment,
          summary,
        };
        setBaseState((list) =>
          list.map((flag) =>
            flag.id === flagId
              ? {
                  ...applyPatch(flag, patch),
                  updatedAt: entry.at,
                  history: [entry, ...(flag.history ?? [])],
                }
              : flag,
          ),
        );
      }
      setOps((list) => list.filter((op) => op.id !== opId));
      setAnnouncement(
        labels.saved(before.name, summary, envLabel(patch.environment)),
      );
    } catch (reason) {
      setOps((list) => list.filter((op) => op.id !== opId));
      const message =
        reason instanceof Error ? reason.message : reason ? String(reason) : "";
      setErrors((current) => ({
        ...current,
        [flagId]: { message, summary, patch },
      }));
      setAnnouncement("");
    }
  };

  const focusSwitch = (flagId: string) =>
    requestAnimationFrame(() =>
      listRef.current
        ?.querySelector<HTMLElement>(
          `[data-flag-id="${CSS.escape(flagId)}"] [data-slot=feature-flag-switch]`,
        )
        ?.focus(),
    );

  const toggle = (flag: FeatureFlag, enabled: boolean) => {
    if (env?.protected) {
      setConfirming({ flagId: flag.id, environment: env.id, enabled });
      return;
    }
    void run(flag.id, { environment: env?.id, enabled });
  };

  const commitRollout = (
    flagId: string,
    envId: string,
    value: number,
    delay: number,
  ) => {
    clearTimeout(commitTimer.current);
    const save = () => {
      const flag = flagsRef.current.find((item) => item.id === flagId);
      if (flag && (flag.environments[envId] ?? OFF).rollout !== value)
        void run(flagId, { environment: envId, rollout: value });
      setDraft((current) =>
        current?.flagId === flagId && current.environment === envId ? null : current,
      );
    };
    if (delay) commitTimer.current = setTimeout(save, delay);
    else save();
  };

  /* Filtering -------------------------------------------------------------- */

  const needle = query.trim().toLowerCase();
  const visible = needle
    ? flags.filter((flag) =>
        [
          flag.name,
          flag.key,
          flag.description,
          ownerName(flag.owner),
          ...(flag.tags ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(needle),
      )
    : flags;
  const onCount = flags.filter(
    (flag) => flag.status !== "archived" && flag.environments[env?.id ?? ""]?.enabled,
  ).length;
  const canCreate = !!onCreate || flagsProp === undefined;

  const createFlag = async (input: FeatureFlagDraft) => {
    const result = await onCreate?.(input);
    const created: FeatureFlag = result ?? {
      id: input.key,
      key: input.key,
      name: input.name,
      description: input.description || undefined,
      owner: actor,
      status: "active",
      environments: Object.fromEntries(
        environments.map((item) => [item.id, { enabled: false, rollout: 0 }]),
      ),
      updatedAt: new Date(),
      history: [
        {
          id: `created-${input.key}`,
          at: new Date(),
          actor,
          summary: labels.created,
        },
      ],
    };
    if (flagsProp === undefined) setBaseState((list) => [created, ...list]);
    setCreating(false);
    setQuery("");
    setExpandedId(created.id);
    setAnnouncement(labels.saved(created.name, labels.created));
  };

  /* Keyboard --------------------------------------------------------------- */

  const onToggleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const buttons = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-slot=feature-flag-toggle]",
      ) ?? [],
    );
    const index = buttons.indexOf(event.currentTarget);
    const target =
      event.key === "ArrowDown"
        ? buttons[index + 1]
        : event.key === "ArrowUp"
          ? buttons[index - 1]
          : event.key === "Home"
            ? buttons[0]
            : event.key === "End"
              ? buttons[buttons.length - 1]
              : undefined;
    if (target) {
      event.preventDefault();
      target.focus();
    }
  };

  const onEnvKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const index = environments.findIndex((item) => item.id === env?.id);
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    let next: number | null = null;
    if (delta) next = (index + delta + environments.length) % environments.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = environments.length - 1;
    if (next === null) return;
    event.preventDefault();
    setEnvironment(environments[next].id);
    const group = event.currentTarget.parentElement;
    requestAnimationFrame(() =>
      group?.querySelectorAll<HTMLButtonElement>("[role=radio]")[next!]?.focus(),
    );
  };

  /* Render ----------------------------------------------------------------- */

  const cell = "min-w-0 row-[1]";
  const wideOnly = "hidden @min-[52rem]/feature-flags:flex";

  return (
    <div
      data-slot="feature-flags"
      className={cn(
        "@container/feature-flags w-full min-w-0 rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
        className,
      )}
      {...props}
    >
      <style href="overtrue-feature-flags" precedence="default">
        {styles}
      </style>

      <header className="flex items-start justify-between gap-4 px-4 pt-4 @lg/feature-flags:px-5 @lg/feature-flags:pt-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight">
            {title ?? labels.title}
          </h2>
          <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground tabular-nums">
            {description ?? labels.summary(flags.length, onCount, env?.label ?? "")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {canCreate && (
            <button
              type="button"
              data-slot="feature-flags-new"
              aria-expanded={creating}
              onClick={() => setCreating((open) => !open)}
              className={primaryButton}
            >
              <IconPlus aria-hidden="true" />
              {labels.newFlag}
            </button>
          )}
        </div>
      </header>

      <div
        data-slot="feature-flags-toolbar"
        className="flex flex-col gap-2 px-4 pt-4 pb-3 @xl/feature-flags:flex-row @xl/feature-flags:items-center @xl/feature-flags:justify-between @lg/feature-flags:px-5"
      >
        <div className="relative w-full min-w-0 @xl/feature-flags:w-64">
          <IconSearch
            aria-hidden="true"
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            aria-label={labels.search}
            placeholder={`${labels.search}…`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.preventDefault();
                setQuery("");
              }
            }}
            className={cn(
              fieldInput,
              "ps-9 pe-8 [&::-webkit-search-cancel-button]:appearance-none",
            )}
          />
          {query && (
            <button
              type="button"
              aria-label={labels.clearSearch}
              onClick={() => setQuery("")}
              className={cn(
                "absolute end-1.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                focusRing,
              )}
            >
              <IconX aria-hidden="true" className="size-3.5" />
            </button>
          )}
        </div>

        <div
          role="radiogroup"
          aria-label={labels.environment}
          data-slot="feature-flags-environments"
          className="flex w-full rounded-lg bg-muted/60 p-0.5 ring-1 ring-border/60 ring-inset @xl/feature-flags:w-auto"
        >
          {environments.map((item) => {
            const on = item.id === env?.id;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                data-state={on ? "on" : "off"}
                onClick={() => setEnvironment(item.id)}
                onKeyDown={onEnvKeyDown}
                className={cn(
                  "flex h-8 min-w-0 flex-auto items-center justify-center gap-1.5 rounded-md px-2 text-[13px] font-medium whitespace-nowrap text-muted-foreground transition-[color,background-color,box-shadow] duration-150 hover:text-foreground motion-reduce:transition-none @md/feature-flags:px-3 @xl/feature-flags:flex-none",
                  "data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_rgb(0_0_0/0.04)] dark:data-[state=on]:bg-foreground/10 dark:data-[state=on]:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]",
                  focusRing,
                )}
              >
                {item.protected && (
                  <IconLock aria-hidden="true" className="size-3.5 shrink-0 opacity-70" />
                )}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        aria-hidden="true"
        data-slot="feature-flags-columns"
        className="hidden border-t border-border/60 px-2 @min-[52rem]/feature-flags:block"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_1.75rem_8rem_9rem_5rem_5.5rem_2.75rem] gap-x-3 px-3 pt-3 pb-1.5 text-xs whitespace-nowrap text-muted-foreground @min-[60rem]/feature-flags:grid-cols-[minmax(0,1fr)_8rem_8rem_9rem_5rem_5.5rem_2.75rem]">
          <span className="ps-6">{labels.flag}</span>
          <span className="invisible @min-[60rem]/feature-flags:visible">
            {labels.owner}
          </span>
          <span>{labels.targeting}</span>
          <span>{labels.rollout}</span>
          <span>{labels.lastChanged}</span>
          <span>{labels.status}</span>
          <span className="text-end">{labels.enabled}</span>
        </div>
      </div>

      <div className="border-t border-border/60 p-2 @min-[52rem]/feature-flags:border-t-0 @min-[52rem]/feature-flags:pt-0">
        {creating && (
          <CreateForm
            labels={labels}
            keys={new Set(flags.map((flag) => flag.key))}
            onCancel={() => setCreating(false)}
            onSubmit={createFlag}
          />
        )}

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
            <p className="text-[13px] text-muted-foreground">
              {needle ? labels.noResults(query.trim()) : labels.empty}
            </p>
            {needle && (
              <button type="button" onClick={() => setQuery("")} className={ghostButton}>
                {labels.clearSearch}
              </button>
            )}
          </div>
        ) : (
          <ul ref={listRef} data-slot="feature-flags-list" className="grid gap-0.5">
            {visible.map((flag) => {
              const state = flag.environments[env?.id ?? ""] ?? OFF;
              const expanded = expandedId === flag.id;
              const archived = flag.status === "archived";
              const saving = ops.some((op) => op.flagId === flag.id);
              const error = errors[flag.id];
              const confirm =
                confirming?.flagId === flag.id && confirming.environment === env?.id
                  ? confirming
                  : null;
              const rollout =
                draft?.flagId === flag.id && draft.environment === env?.id
                  ? draft.value
                  : state.rollout;
              const detailsId = `${id}-${flag.id}-details`;
              const owner = ownerName(flag.owner);

              return (
                <li
                  key={flag.id}
                  data-slot="feature-flag"
                  data-flag-id={flag.id}
                  data-state={expanded ? "open" : "closed"}
                  data-status={flag.status}
                  data-selected={expanded ? "" : undefined}
                  data-saving={saving ? "" : undefined}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Escape" &&
                      expanded &&
                      !confirm &&
                      !event.defaultPrevented
                    ) {
                      event.preventDefault();
                      setExpandedId(null);
                      event.currentTarget
                        .querySelector<HTMLElement>("[data-slot=feature-flag-toggle]")
                        ?.focus();
                    }
                  }}
                  className={cn(
                    "group/flag relative rounded-xl transition-[background-color,box-shadow] duration-150 motion-reduce:transition-none",
                    // Stacked rows get hairlines between them; they step aside for hovered and open rows.
                    "before:pointer-events-none before:absolute before:inset-x-3 before:-top-px before:h-px before:bg-border/60 before:transition-opacity before:duration-150 first:before:hidden hover:before:opacity-0 data-[state=open]:before:opacity-0 [:hover+&]:before:opacity-0 [[data-state=open]+&]:before:opacity-0 @min-[52rem]/feature-flags:before:hidden",
                    expanded
                      ? "bg-muted/40 ring-1 ring-border/60 ring-inset"
                      : "hover:bg-muted/50",
                    "has-[[data-slot=feature-flag-toggle]:focus-visible]:ring-2 has-[[data-slot=feature-flag-toggle]:focus-visible]:ring-primary/30",
                  )}
                >
                  <div
                    data-slot="feature-flag-row"
                    onClick={(event) => {
                      const target = event.target as HTMLElement;
                      if (
                        target.closest(
                          "button, a, input, label, [role=slider], [role=switch], [data-slot=range-slider]",
                        )
                      )
                        return;
                      setExpandedId(expanded ? null : flag.id);
                    }}
                    className="grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-3 px-3 py-3 @min-[52rem]/feature-flags:grid-cols-[minmax(0,1fr)_1.75rem_8rem_9rem_5rem_5.5rem_2.75rem] @min-[60rem]/feature-flags:grid-cols-[minmax(0,1fr)_8rem_8rem_9rem_5rem_5.5rem_2.75rem] @min-[52rem]/feature-flags:items-center @min-[52rem]/feature-flags:gap-y-0"
                  >
                    {/* Flag */}
                    <div className={cn(cell, "col-[1] flex items-start gap-2")}>
                      <IconChevronRight
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground/70 transition-transform duration-150 group-data-[state=open]/flag:rotate-90 motion-reduce:transition-none"
                      />
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          data-slot="feature-flag-toggle"
                          aria-expanded={expanded}
                          aria-controls={expanded ? detailsId : undefined}
                          onClick={() => setExpandedId(expanded ? null : flag.id)}
                          onKeyDown={onToggleKeyDown}
                          className={cn(
                            "block max-w-full truncate text-start text-sm leading-5 font-medium outline-none",
                            archived ? "text-muted-foreground" : "text-foreground",
                          )}
                        >
                          {flag.name}
                        </button>
                        {/* Wide rows: the key always shows; the description takes what is left, and wraps out of sight when that is under 6rem. */}
                        <p className="flex min-w-0 flex-col text-[13px] leading-5 text-muted-foreground @min-[52rem]/feature-flags:h-5 @min-[52rem]/feature-flags:flex-row @min-[52rem]/feature-flags:flex-wrap @min-[52rem]/feature-flags:gap-x-1.5 @min-[52rem]/feature-flags:overflow-hidden">
                          <span
                            data-slot="feature-flag-key"
                            title={flag.key}
                            className="max-w-full truncate font-mono text-xs leading-5 @min-[52rem]/feature-flags:shrink-0"
                          >
                            {flag.key}
                          </span>
                          {flag.description && (
                            <span
                              title={flag.description}
                              className="min-w-0 @max-[52rem]/feature-flags:line-clamp-2 @min-[52rem]/feature-flags:min-w-24 @min-[52rem]/feature-flags:flex-1 @min-[52rem]/feature-flags:basis-24 @min-[52rem]/feature-flags:truncate"
                            >
                              <span aria-hidden="true" className="me-1.5 hidden @min-[52rem]/feature-flags:inline">
                                ·
                              </span>
                              {flag.description}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Owner */}
                    <div className={cn(cell, wideOnly, "col-[2] items-center gap-2 text-[13px]")}>
                      {owner ? (
                        <>
                          <span title={owner} className="flex shrink-0">
                            <Avatar owner={flag.owner!} />
                          </span>
                          <span className="sr-only @min-[60rem]/feature-flags:hidden">
                            {owner}
                          </span>
                          <span className="hidden min-w-0 truncate @min-[60rem]/feature-flags:block">
                            {owner}
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">
                          <span aria-hidden="true">—</span>
                          <span className="sr-only">{labels.noOwner}</span>
                        </span>
                      )}
                    </div>

                    {/* Targeting */}
                    <div className={cn(cell, wideOnly, "col-[3] text-[13px] text-muted-foreground")}>
                      <TargetingSummary state={state} labels={labels} />
                    </div>

                    {/* Rollout */}
                    <div
                      data-slot="feature-flag-rollout"
                      className={cn(
                        "col-[1/-1] row-[3] flex max-w-md min-w-0 items-center gap-3 ps-6 @min-[52rem]/feature-flags:col-[4] @min-[52rem]/feature-flags:row-[1] @min-[52rem]/feature-flags:max-w-none @min-[52rem]/feature-flags:ps-0",
                        !state.enabled && "[&_[data-slot=range-slider]]:opacity-60",
                      )}
                    >
                      <span className="w-14 shrink-0 text-xs text-muted-foreground @min-[52rem]/feature-flags:hidden">
                        {labels.rollout}
                      </span>
                      <RangeSlider
                        size="sm"
                        min={0}
                        max={100}
                        step={1}
                        value={rollout}
                        disabled={archived}
                        thumbLabels={labels.rolloutLabel(flag.name, env?.label ?? "")}
                        formatValue={(value) => `${value}%`}
                        onValueChange={(value) =>
                          setDraft({ flagId: flag.id, environment: env.id, value })
                        }
                        onValueCommit={(value, details) =>
                          commitRollout(
                            flag.id,
                            env.id,
                            value,
                            details.source === "keyboard" ? 600 : 0,
                          )
                        }
                        className="min-w-0 flex-1"
                      />
                      <span
                        aria-hidden="true"
                        className="w-9 shrink-0 text-end text-[13px] font-medium tabular-nums"
                      >
                        {rollout}%
                      </span>
                    </div>

                    {/* Last changed */}
                    <div className={cn(cell, wideOnly, "col-[5] text-[13px] text-muted-foreground tabular-nums")}>
                      <time
                        dateTime={toDate(flag.updatedAt).toISOString()}
                        title={fullTime(flag.updatedAt)}
                        className="truncate"
                      >
                        {time(flag.updatedAt)}
                      </time>
                    </div>

                    {/* Status */}
                    <div className={cn(cell, wideOnly, "col-[6]")}>
                      <StatusPill status={flag.status} labels={labels} />
                    </div>

                    {/* Switch */}
                    <div className="relative col-[2] row-[1] flex items-center justify-end self-start @min-[52rem]/feature-flags:col-[7] @min-[52rem]/feature-flags:self-center">
                      {saving && (
                        <IconLoader2
                          aria-hidden="true"
                          data-slot="feature-flag-saving"
                          className="absolute end-full me-2 size-3.5 text-muted-foreground motion-safe:animate-spin"
                        />
                      )}
                      <Switch
                        data-slot="feature-flag-switch"
                        checked={state.enabled}
                        disabled={archived}
                        aria-label={labels.toggleLabel(flag.name, env?.label ?? "")}
                        data-confirming={confirm ? "" : undefined}
                        onCheckedChange={(checked) => toggle(flag, checked)}
                        className="data-confirming:ring-2 data-confirming:ring-amber-500/40"
                      />
                    </div>

                    {/* Compact meta lines */}
                    <div className="col-[1/-1] row-[2] grid min-w-0 gap-2 ps-6 text-[13px] text-muted-foreground @min-[52rem]/feature-flags:hidden">
                      <div className="flex min-w-0 items-center gap-3">
                        <StatusPill status={flag.status} labels={labels} />
                        <TargetingSummary state={state} labels={labels} />
                      </div>
                      <div className="flex min-w-0 items-center gap-2">
                        {owner && (
                          <>
                            <Avatar owner={flag.owner!} />
                            <span className="truncate">{owner}</span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        <time
                          dateTime={toDate(flag.updatedAt).toISOString()}
                          title={fullTime(flag.updatedAt)}
                          className="shrink-0 tabular-nums"
                        >
                          {time(flag.updatedAt)}
                        </time>
                      </div>
                    </div>
                  </div>

                  {confirm && (
                    <ConfirmStrip
                      flag={flag}
                      enabled={confirm.enabled}
                      environment={env?.label ?? ""}
                      labels={labels}
                      onCancel={() => {
                        setConfirming(null);
                        focusSwitch(flag.id);
                      }}
                      onConfirm={() => {
                        setConfirming(null);
                        void run(flag.id, {
                          environment: confirm.environment,
                          enabled: confirm.enabled,
                        });
                        focusSwitch(flag.id);
                      }}
                    />
                  )}

                  {error && (
                    <div
                      role="alert"
                      data-slot="feature-flag-error"
                      className="mx-3 mb-3 flex flex-wrap items-start gap-x-3 gap-y-2 rounded-lg bg-card px-3 py-2.5 text-[13px] leading-5 shadow-xs ring-1 ring-rose-500/30 motion-safe:animate-[feature-flags-in_200ms_cubic-bezier(0.22,1,0.36,1)] dark:ring-rose-400/30"
                    >
                      <IconAlertCircle
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-rose-700 dark:text-rose-400"
                      />
                      <p className="min-w-0 flex-1 basis-56">
                        <span className="font-medium text-rose-700 dark:text-rose-400">
                          {labels.failed(error.summary, envLabel(error.patch.environment))}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {error.message ? `${error.message} ` : ""}
                          {labels.rolledBack}
                        </span>
                      </p>
                      <div className="ms-auto -my-1 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => void run(flag.id, error.patch)}
                          className={ghostButton}
                        >
                          {labels.retry}
                        </button>
                        <button
                          type="button"
                          aria-label={labels.dismiss}
                          onClick={() =>
                            setErrors(({ [flag.id]: _dropped, ...rest }) => rest)
                          }
                          className={cn(ghostButton, "w-8 px-0")}
                        >
                          <IconX aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  )}

                  {expanded && (
                    <FlagDetails
                      id={detailsId}
                      flag={flag}
                      state={state}
                      environment={env}
                      environments={environments}
                      labels={labels}
                      copied={copied === flag.id}
                      time={time}
                      fullTime={fullTime}
                      envLabel={envLabel}
                      onEnvironment={setEnvironment}
                      onCopy={() => {
                        void navigator.clipboard?.writeText(flag.key).then(() => {
                          setCopied(flag.id);
                          setAnnouncement(labels.copied);
                          clearTimeout(copyTimer.current);
                          copyTimer.current = setTimeout(() => setCopied(null), 1600);
                        });
                      }}
                      onStatus={(status) => void run(flag.id, { status })}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Confirmation                                                              */
/* ------------------------------------------------------------------------ */

function ConfirmStrip({
  flag,
  enabled,
  environment,
  labels,
  onCancel,
  onConfirm,
}: {
  flag: FeatureFlag;
  enabled: boolean;
  environment: string;
  labels: FeatureFlagsLabels;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const id = React.useId();
  const confirmRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    confirmRef.current?.focus();
  }, []);
  return (
    <div
      role="group"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-body`}
      data-slot="feature-flag-confirm"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
        }
      }}
      className="mx-3 mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-card px-3 py-2.5 text-[13px] leading-5 shadow-xs ring-1 ring-amber-500/35 motion-safe:animate-[feature-flags-in_200ms_cubic-bezier(0.22,1,0.36,1)]"
    >
      <IconAlertTriangle
        aria-hidden="true"
        className="size-4 shrink-0 text-amber-700 dark:text-amber-400"
      />
      <p className="min-w-0 flex-1 basis-56">
        <span id={`${id}-title`} className="font-medium">
          {labels.confirmTitle(enabled, environment)}
        </span>{" "}
        <span id={`${id}-body`} className="text-muted-foreground">
          {labels.confirmBody(flag.name, enabled)}
        </span>
      </p>
      <div className="ms-auto -my-1 flex items-center gap-2">
        <button type="button" onClick={onCancel} className={ghostButton}>
          {labels.cancel}
        </button>
        <button
          ref={confirmRef}
          type="button"
          onClick={onConfirm}
          className={cn(
            primaryButton,
            !enabled &&
              "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          )}
        >
          {labels.confirmAction(enabled)}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Details                                                                   */
/* ------------------------------------------------------------------------ */

function FlagDetails({
  id,
  flag,
  state,
  environment,
  environments,
  labels,
  copied,
  time,
  fullTime,
  envLabel,
  onEnvironment,
  onCopy,
  onStatus,
}: {
  id: string;
  flag: FeatureFlag;
  state: FeatureFlagEnvironmentState;
  environment: FeatureFlagEnvironment;
  environments: FeatureFlagEnvironment[];
  labels: FeatureFlagsLabels;
  copied: boolean;
  time: (value: Date | string | number) => string;
  fullTime: (value: Date | string | number) => string;
  envLabel: (id?: string) => string | undefined;
  onEnvironment: (id: string) => void;
  onCopy: () => void;
  onStatus: (status: FeatureFlagStatus) => void;
}) {
  const rules = state.rules ?? [];
  const history = flag.history ?? [];
  const sectionTitle = "text-xs font-medium text-muted-foreground";
  return (
    <div
      id={id}
      data-slot="feature-flag-details"
      className="grid gap-x-6 gap-y-5 border-t border-border/60 px-3 pt-4 pb-3 motion-safe:animate-[feature-flags-in_220ms_cubic-bezier(0.22,1,0.36,1)] @3xl/feature-flags:mx-3 @3xl/feature-flags:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] @3xl/feature-flags:px-0 @3xl/feature-flags:ps-6"
    >
      <div className="grid min-w-0 content-start gap-5">
        <section aria-labelledby={`${id}-targeting`}>
          <h4 id={`${id}-targeting`} className={sectionTitle}>
            {labels.targetingIn(environment.label)}
          </h4>
          <ol className="mt-2 grid gap-1.5">
            {rules.map((rule, index) => (
              <li
                key={rule.id}
                data-slot="feature-flag-rule"
                className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-card px-3 py-2 text-[13px] leading-5 ring-1 ring-border/60"
              >
                <span className="text-muted-foreground">
                  {index === 0 ? "If" : "Else if"}
                </span>
                <span className="font-mono text-xs">{rule.attribute}</span>
                <span className="text-muted-foreground">{rule.operator}</span>
                {rule.values.map((value) => (
                  <span
                    key={value}
                    className="rounded-md bg-muted px-1.5 text-xs leading-5 font-medium"
                  >
                    {value}
                  </span>
                ))}
                <span
                  className={cn(
                    "ms-auto ps-2 tabular-nums",
                    state.enabled ? "font-medium" : "text-muted-foreground",
                  )}
                >
                  {state.enabled ? labels.serve(rule.rollout ?? 100) : labels.off}
                </span>
              </li>
            ))}
            <li className="flex min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-[13px] leading-5 ring-1 ring-border/60 ring-dashed">
              <IconUsersGroup
                aria-hidden="true"
                className="size-3.5 shrink-0 text-muted-foreground"
              />
              <span className="text-muted-foreground">
                {rules.length ? labels.everyoneElse : labels.everyone}
              </span>
              <span
                className={cn(
                  "ms-auto tabular-nums",
                  state.enabled ? "font-medium" : "text-muted-foreground",
                )}
              >
                {state.enabled ? labels.serve(state.rollout) : labels.off}
              </span>
            </li>
          </ol>
        </section>

        <section aria-labelledby={`${id}-environments`}>
          <h4 id={`${id}-environments`} className={sectionTitle}>
            {labels.environments}
          </h4>
          <div className="mt-2 grid gap-1.5 @md/feature-flags:grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))]">
            {environments.map((item) => {
              const itemState = flag.environments[item.id] ?? OFF;
              const current = item.id === environment.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={current}
                  onClick={() => onEnvironment(item.id)}
                  className={cn(
                    "flex min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-start text-[13px] leading-5 ring-1 transition-[background-color,box-shadow] duration-150 motion-reduce:transition-none",
                    current
                      ? "bg-card ring-primary/40"
                      : "ring-border/60 hover:bg-card",
                    focusRing,
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      itemState.enabled ? "bg-emerald-500" : "bg-muted-foreground/40",
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span className="shrink-0 text-muted-foreground tabular-nums">
                    {itemState.enabled ? labels.serve(itemState.rollout) : labels.off}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section aria-labelledby={`${id}-history`} className="min-w-0">
        <h4 id={`${id}-history`} className={sectionTitle}>
          {labels.history}
        </h4>
        {history.length === 0 ? (
          <p className="mt-2 text-[13px] text-muted-foreground">{labels.noHistory}</p>
        ) : (
          <ol className="mt-2.5">
            {history.slice(0, 5).map((change, index, list) => (
              <li
                key={change.id}
                data-slot="feature-flag-change"
                className="relative flex gap-3 pb-3 last:pb-0"
              >
                {index < list.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute start-[3.5px] top-3.5 bottom-0 w-px bg-border"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-[7px] size-2 shrink-0 rounded-full ring-2 ring-card",
                    index === 0 ? "bg-primary" : "bg-muted-foreground/40",
                  )}
                />
                <div className="min-w-0 flex-1 text-[13px] leading-5">
                  <p className="flex flex-wrap items-center gap-x-2">
                    <span className="font-medium">{change.summary}</span>
                    {change.environment && (
                      <span className="rounded-md bg-muted px-1.5 text-xs leading-5 text-muted-foreground">
                        {envLabel(change.environment)}
                      </span>
                    )}
                  </p>
                  <p className="text-muted-foreground">
                    {change.actor} ·{" "}
                    <time
                      dateTime={toDate(change.at).toISOString()}
                      title={fullTime(change.at)}
                      className="tabular-nums"
                    >
                      {time(change.at)}
                    </time>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <footer className="col-span-full flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
        {flag.status === "stale" && (
          <p className="me-auto flex min-w-0 items-center gap-1.5 text-[13px] text-amber-700 dark:text-amber-400">
            <IconAlertTriangle aria-hidden="true" className="size-4 shrink-0" />
            <span>
              {flag.lastEvaluatedAt
                ? labels.lastEvaluated(time(flag.lastEvaluatedAt))
                : labels.statuses.stale}
              . Archive it once the code path is gone.
            </span>
          </p>
        )}
        {flag.tags && flag.tags.length > 0 && flag.status !== "stale" && (
          <ul className="me-auto flex flex-wrap gap-1.5" aria-label="Tags">
            {flag.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md bg-card px-1.5 text-xs leading-5 text-muted-foreground ring-1 ring-border/60"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        <div className="ms-auto flex items-center gap-1">
          <button type="button" onClick={onCopy} className={ghostButton}>
            {copied ? (
              <IconCheck aria-hidden="true" className="text-emerald-700 dark:text-emerald-400" />
            ) : (
              <IconCopy aria-hidden="true" />
            )}
            {copied ? labels.copied : labels.copyKey}
          </button>
          {flag.status === "archived" ? (
            <button type="button" onClick={() => onStatus("active")} className={ghostButton}>
              <IconRestore aria-hidden="true" />
              {labels.restore}
            </button>
          ) : (
            <button type="button" onClick={() => onStatus("archived")} className={ghostButton}>
              <IconArchive aria-hidden="true" />
              {labels.archive}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Sample data                                                               */
/* ------------------------------------------------------------------------ */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const ago = (ms: number) => new Date(Date.now() - ms);

/** Eight fictional flags for demos, with timestamps relative to page load. */
export const sampleFlags: FeatureFlag[] = [
  {
    id: "checkout-v2",
    key: "checkout-v2",
    name: "New checkout flow",
    description: "Single-page checkout with saved wallets and address autocomplete.",
    owner: { name: "Mara Lindqvist" },
    status: "active",
    tags: ["checkout", "release"],
    environments: {
      development: { enabled: true, rollout: 100 },
      staging: { enabled: true, rollout: 100 },
      production: {
        enabled: true,
        rollout: 25,
        rules: [
          {
            id: "nordics",
            attribute: "country",
            operator: "is one of",
            values: ["SE", "NO", "DK"],
          },
          {
            id: "staff",
            attribute: "email",
            operator: "ends with",
            values: ["@acme.test"],
          },
        ],
      },
    },
    updatedAt: ago(2 * HOUR),
    history: [
      { id: "c4", at: ago(2 * HOUR), actor: "Mara Lindqvist", environment: "production", summary: "Rollout 10% → 25%" },
      { id: "c3", at: ago(1 * DAY + 3 * HOUR), actor: "Mara Lindqvist", environment: "production", summary: "Turned on" },
      { id: "c2", at: ago(3 * DAY), actor: "Dev Patel", environment: "staging", summary: "Rollout 50% → 100%" },
      { id: "c1", at: ago(9 * DAY), actor: "Mara Lindqvist", summary: "Created" },
    ],
  },
  {
    id: "ai-ticket-summaries",
    key: "ai-ticket-summaries",
    name: "AI ticket summaries",
    description: "Summarizes long support threads at the top of each ticket.",
    owner: { name: "Ikaika Kahale" },
    status: "active",
    tags: ["support", "experiment"],
    environments: {
      development: { enabled: true, rollout: 100 },
      staging: { enabled: true, rollout: 50 },
      production: {
        enabled: false,
        rollout: 0,
        rules: [
          {
            id: "paid",
            attribute: "plan",
            operator: "is one of",
            values: ["Pro", "Enterprise"],
          },
        ],
      },
    },
    updatedAt: ago(5 * HOUR),
    history: [
      { id: "a2", at: ago(5 * HOUR), actor: "Ikaika Kahale", environment: "staging", summary: "Rollout 20% → 50%" },
      { id: "a1", at: ago(4 * DAY), actor: "Ikaika Kahale", summary: "Created" },
    ],
  },
  {
    id: "usage-billing",
    key: "billing.usage-meter",
    name: "Usage-based billing",
    description: "Meters API calls and bills overage at the end of each cycle.",
    owner: { name: "Sofía Brandt" },
    status: "active",
    tags: ["billing"],
    environments: {
      development: { enabled: true, rollout: 100 },
      staging: { enabled: true, rollout: 100 },
      production: {
        enabled: false,
        rollout: 0,
        rules: [
          {
            id: "beta",
            attribute: "account",
            operator: "is one of",
            values: ["acct_4821", "acct_7730"],
          },
        ],
      },
    },
    updatedAt: ago(1 * DAY),
    history: [
      { id: "b2", at: ago(1 * DAY), actor: "Sofía Brandt", environment: "staging", summary: "Turned on" },
      { id: "b1", at: ago(12 * DAY), actor: "Sofía Brandt", summary: "Created" },
    ],
  },
  {
    id: "realtime-cursors",
    key: "realtime-cursors",
    name: "Realtime cursors",
    description: "Shows collaborators’ cursors live in shared documents.",
    owner: { name: "Léa Moreau" },
    status: "active",
    tags: ["editor"],
    environments: {
      development: { enabled: true, rollout: 100 },
      staging: {
        enabled: true,
        rollout: 20,
        rules: [
          {
            id: "beta-workspaces",
            attribute: "workspace",
            operator: "is in segment",
            values: ["Design partners"],
          },
        ],
      },
      production: { enabled: false, rollout: 0 },
    },
    updatedAt: ago(34 * MINUTE),
    history: [
      { id: "r2", at: ago(34 * MINUTE), actor: "Léa Moreau", environment: "staging", summary: "Rollout 5% → 20%" },
      { id: "r1", at: ago(2 * DAY), actor: "Léa Moreau", summary: "Created" },
    ],
  },
  {
    id: "adaptive-rate-limits",
    key: "ops.adaptive-rate-limits",
    name: "Adaptive rate limits",
    description: "Raises limits for healthy clients and sheds load during incidents.",
    owner: { name: "Tomás Ortega" },
    status: "active",
    tags: ["ops", "kill switch"],
    environments: {
      development: { enabled: true, rollout: 100 },
      staging: { enabled: true, rollout: 100 },
      production: { enabled: true, rollout: 100 },
    },
    updatedAt: ago(3 * DAY),
    history: [
      { id: "o2", at: ago(3 * DAY), actor: "Tomás Ortega", environment: "production", summary: "Rollout 50% → 100%" },
      { id: "o1", at: ago(21 * DAY), actor: "Tomás Ortega", summary: "Created" },
    ],
  },
  {
    id: "editor-dark-theme",
    key: "editor-dark-theme",
    name: "Editor dark theme",
    description: "Dark color scheme for the document editor and preview.",
    owner: { name: "Jonas Weber" },
    status: "active",
    tags: ["editor", "release"],
    environments: {
      development: { enabled: true, rollout: 100 },
      staging: { enabled: true, rollout: 100 },
      production: { enabled: true, rollout: 60 },
    },
    updatedAt: ago(6 * DAY),
    history: [
      { id: "d2", at: ago(6 * DAY), actor: "Jonas Weber", environment: "production", summary: "Rollout 30% → 60%" },
      { id: "d1", at: ago(18 * DAY), actor: "Jonas Weber", summary: "Created" },
    ],
  },
  {
    id: "legacy-search-fallback",
    key: "legacy-search-fallback",
    name: "Legacy search fallback",
    description: "Sends queries to the old search cluster when the new index times out.",
    owner: { name: "Priya Raman" },
    status: "stale",
    tags: ["search"],
    environments: {
      development: { enabled: true, rollout: 100 },
      staging: { enabled: true, rollout: 100 },
      production: { enabled: true, rollout: 100 },
    },
    updatedAt: ago(94 * DAY),
    lastEvaluatedAt: ago(41 * DAY),
    history: [
      { id: "s2", at: ago(94 * DAY), actor: "Priya Raman", environment: "production", summary: "Turned on" },
      { id: "s1", at: ago(130 * DAY), actor: "Priya Raman", summary: "Created" },
    ],
  },
  {
    id: "onboarding-checklist",
    key: "onboarding-checklist-v1",
    name: "Onboarding checklist",
    description: "First-run checklist, replaced by guided tours in March.",
    owner: { name: "Mara Lindqvist" },
    status: "archived",
    environments: {
      development: { enabled: false, rollout: 0 },
      staging: { enabled: false, rollout: 0 },
      production: { enabled: false, rollout: 0 },
    },
    updatedAt: ago(122 * DAY),
    history: [
      { id: "h2", at: ago(122 * DAY), actor: "Mara Lindqvist", summary: "Archived" },
      { id: "h1", at: ago(300 * DAY), actor: "Mara Lindqvist", summary: "Created" },
    ],
  },
];
