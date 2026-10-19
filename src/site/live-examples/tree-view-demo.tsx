import { useMemo, useState, type ReactNode } from "react";
import {
  IconBraces,
  IconFileText,
  IconFileTypeCss,
  IconFileTypeSvg,
  IconFileTypeTs,
  IconFileTypeTsx,
  IconFolder,
  IconFolderOpen,
  IconGitBranch,
  IconMarkdown,
  IconSearch,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import { TreeView, type TreeNode } from "@/registry/overtrue/tree-view";

// A fictional web app repository with uncommitted changes.
type Change = "M" | "A" | "D";
const changes: Record<string, Change> = {
  "src/app/page.tsx": "M",
  "src/features/billing/usage-alerts.tsx": "A",
  "src/features/billing/usage-alerts.test.tsx": "A",
  "src/features/billing/invoice-table.tsx": "M",
  "src/features/billing/api.ts": "M",
  "src/features/billing/legacy-plans.ts": "D",
  "src/components/usage-meter.tsx": "A",
  "src/components/plan-badge.tsx": "M",
  "src/styles/globals.css": "M",
  "package.json": "M",
};
const changeLabel: Record<Change, string> = { M: "Modified", A: "Added", D: "Deleted" };
const changeColor: Record<Change, string> = {
  M: "text-amber-700 dark:text-amber-400",
  A: "text-emerald-700 dark:text-emerald-400",
  D: "text-rose-700 dark:text-rose-400",
};
const dotColor: Record<Change, string> = {
  M: "bg-amber-500 dark:bg-amber-400",
  A: "bg-emerald-500 dark:bg-emerald-400",
  D: "bg-rose-500 dark:bg-rose-400",
};

// Literal class names, so Tailwind can see them.
const tints: Record<number, string> = {
  1: "text-[color-mix(in_oklab,var(--color-chart-1)_78%,var(--color-muted-foreground))]",
  3: "text-[color-mix(in_oklab,var(--color-chart-3)_78%,var(--color-muted-foreground))]",
  4: "text-[color-mix(in_oklab,var(--color-chart-4)_78%,var(--color-muted-foreground))]",
  5: "text-[color-mix(in_oklab,var(--color-chart-5)_78%,var(--color-muted-foreground))]",
};
const tint = (chart: number) => tints[chart];

function fileIcon(name: string) {
  if (name.endsWith(".tsx")) return <IconFileTypeTsx className={tint(1)} />;
  if (name.endsWith(".ts")) return <IconFileTypeTs className={tint(1)} />;
  if (name.endsWith(".css")) return <IconFileTypeCss className={tint(5)} />;
  if (name.endsWith(".svg")) return <IconFileTypeSvg className={tint(4)} />;
  if (name.endsWith(".json")) return <IconBraces className={tint(3)} />;
  if (name.endsWith(".yml")) return <IconSettings className={tint(3)} />;
  if (name.endsWith(".md")) return <IconMarkdown />;
  return <IconFileText />;
}

const folderIcon = ({ expanded }: { expanded: boolean }) =>
  expanded ? <IconFolderOpen className="text-primary/80" /> : <IconFolder className="text-primary/80" />;

function changeBadge(change: Change): ReactNode {
  return (
    <span title={changeLabel[change]} className={`w-4 text-center font-mono text-[11px] font-semibold ${changeColor[change]}`}>
      {change}
      <span className="sr-only">, {changeLabel[change].toLowerCase()}</span>
    </span>
  );
}

function folderBadge(path: string): ReactNode {
  const inside = Object.entries(changes).filter(([file]) => file.startsWith(`${path}/`));
  if (!inside.length) return undefined;
  const kind: Change = inside.some(([, c]) => c === "M") ? "M" : inside[0][1];
  return (
    <span title={`${inside.length} changed`} className="flex w-4 justify-center">
      <span className={`size-1.5 rounded-full ${dotColor[kind]}`} />
      <span className="sr-only">, {inside.length} changed</span>
    </span>
  );
}

type Spec = string | [name: string, children: Spec[]] | [name: string, "lazy"];

function build(specs: Spec[], parent = ""): TreeNode[] {
  return specs.map((spec) => {
    if (typeof spec === "string") {
      const id = parent ? `${parent}/${spec}` : spec;
      return {
        id,
        label: spec,
        icon: fileIcon(spec),
        badge: changes[id] ? changeBadge(changes[id]) : undefined,
      };
    }
    const [name, children] = spec;
    const id = parent ? `${parent}/${name}` : name;
    return {
      id,
      label: name,
      icon: folderIcon,
      badge: folderBadge(id),
      ...(children === "lazy" ? { hasChildren: true } : { children: build(children, id) }),
    };
  });
}

const tree = build([
  [".github", [["workflows", ["ci.yml", "preview.yml"]]]],
  [
    "src",
    [
      ["app", ["layout.tsx", "page.tsx", "providers.tsx"]],
      ["assets", "lazy"],
      ["components", ["button.tsx", "plan-badge.tsx", "usage-meter.tsx"]],
      [
        "features",
        [
          ["auth", ["session.ts", "sso.ts"]],
          [
            "billing",
            [
              "api.ts",
              "invoice-table.tsx",
              "legacy-plans.ts",
              "usage-alerts.test.tsx",
              "usage-alerts.tsx",
            ],
          ],
        ],
      ],
      ["lib", ["analytics.ts", "format.ts"]],
      ["styles", ["globals.css"]],
    ],
  ],
  "package.json",
  "README.md",
  "tsconfig.json",
]);

// src/assets loads on first open, as it would from a git API.
const loadAssets = () =>
  new Promise<TreeNode[]>((resolve) =>
    setTimeout(() => resolve(build(["empty-state.svg", "logo.svg", "og-image.svg"], "src/assets")), 900),
  );

export default function Demo() {
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(["src/app/page.tsx"]);
  const counts = useMemo(() => {
    const values = Object.values(changes);
    return (["M", "A", "D"] as const).map((kind) => [kind, values.filter((c) => c === kind).length] as const);
  }, []);

  return (
    <div className="@container overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <div className="flex items-center gap-3 px-4 pt-3.5 pb-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm leading-6 font-semibold tracking-tight">atlas-web</p>
          <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            <IconGitBranch className="size-3.5 shrink-0" stroke={1.75} aria-hidden="true" />
            <span className="truncate font-mono">feat/usage-alerts</span>
          </p>
        </div>
        <label className="flex h-8 w-36 shrink-0 items-center gap-1.5 rounded-lg bg-muted/50 pr-1 pl-2.5 ring-1 ring-border/60 transition-[box-shadow,background-color] duration-150 ring-inset focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/30 @sm:w-48">
          <IconSearch className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Filter files</span>
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter files"
            spellCheck={false}
            className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          {filter && (
            <button
              type="button"
              onClick={() => setFilter("")}
              aria-label="Clear filter"
              className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <IconX className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </label>
      </div>
      <div className="max-h-[420px] overflow-y-auto overscroll-contain border-t border-border/60 px-1.5 py-1.5">
        <TreeView
          aria-label="Repository files"
          nodes={tree}
          filter={filter}
          selected={selected}
          onSelectedChange={setSelected}
          defaultExpanded={["src", "src/app", "src/features", "src/features/billing"]}
          onLoadChildren={loadAssets}
          renderLabel={(node) =>
            changes[node.id] === "D" ? (
              <span className="text-muted-foreground line-through decoration-muted-foreground/60">{node.label}</span>
            ) : undefined
          }
        />
      </div>
      <div className="flex h-9 items-center gap-3 border-t border-border/60 bg-muted/25 px-4 text-xs">
        <span className="min-w-0 flex-1 truncate font-mono text-foreground/85">{selected[0] ?? "No file selected"}</span>
        <span className="flex shrink-0 items-center gap-2.5 tabular-nums">
          {counts.map(([kind, count]) => (
            <span key={kind} title={changeLabel[kind]} className="inline-flex items-center gap-1">
              <span className={`font-mono text-[11px] font-semibold ${changeColor[kind]}`}>{kind}</span>
              <span className="text-muted-foreground">{count}</span>
              <span className="sr-only">{changeLabel[kind].toLowerCase()}</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
