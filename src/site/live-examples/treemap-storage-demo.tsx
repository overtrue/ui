import * as React from "react";
import { IconFile, IconFolder, IconRefresh } from "@tabler/icons-react";

import { Treemap, type TreemapNode } from "@/registry/overtrue/treemap";

type Folder = TreemapNode<{ files: number }>;

// The acme-studio-assets bucket. Sizes are in GB; leaves also carry a file count.
const bucket: Folder[] = [
  {
    id: "renders",
    label: "renders",
    children: [
      {
        id: "renders/2026-q3",
        label: "2026-q3",
        value: 312,
        meta: { files: 1184 },
      },
      {
        id: "renders/2026-q2",
        label: "2026-q2",
        value: 228,
        meta: { files: 962 },
      },
      {
        id: "renders/previews",
        label: "previews",
        value: 46,
        meta: { files: 12480 },
      },
    ],
  },
  {
    id: "raw-footage",
    label: "raw-footage",
    children: [
      {
        id: "raw/interviews",
        label: "interviews",
        value: 264,
        meta: { files: 418 },
      },
      { id: "raw/b-roll", label: "b-roll", value: 198, meta: { files: 1036 } },
      { id: "raw/drone", label: "drone", value: 88, meta: { files: 214 } },
    ],
  },
  {
    id: "projects",
    label: "projects",
    children: [
      {
        id: "projects/northwind",
        label: "northwind-rebrand",
        value: 186,
        meta: { files: 4212 },
      },
      {
        id: "projects/lumen",
        label: "lumen-app",
        value: 142,
        meta: { files: 9830 },
      },
      {
        id: "projects/harbor",
        label: "harbor-campaign",
        value: 98,
        meta: { files: 2140 },
      },
      {
        id: "projects/atlas",
        label: "atlas-site",
        value: 64,
        meta: { files: 6022 },
      },
    ],
  },
  {
    id: "archive",
    label: "archive",
    // Cold storage reads as neutral rather than taking the next palette colour.
    color: "var(--color-muted-foreground)",
    children: [
      { id: "archive/2024", label: "2024", value: 142, meta: { files: 18220 } },
      { id: "archive/2025", label: "2025", value: 96, meta: { files: 11408 } },
    ],
  },
  {
    id: "design-system",
    label: "design-system",
    children: [
      {
        id: "ds/illustrations",
        label: "illustrations",
        value: 14,
        meta: { files: 1212 },
      },
      { id: "ds/icons", label: "icons", value: 3.2, meta: { files: 8940 } },
      { id: "ds/fonts", label: "fonts", value: 1.1, meta: { files: 96 } },
      { id: "ds/tokens", label: "tokens", value: 0.2, meta: { files: 64 } },
    ],
  },
  { id: "exports", label: "exports", value: 38, meta: { files: 3320 } },
];

function fileCount(node: Folder): number {
  return node.children?.length
    ? node.children.reduce((sum, child) => sum + fileCount(child), 0)
    : (node.meta?.files ?? 0);
}

function formatSize(gb: number) {
  if (gb >= 1000) return `${(gb / 1000).toFixed(gb >= 10000 ? 0 : 2)} TB`;
  if (gb >= 10) return `${Math.round(gb)} GB`;
  return `${gb.toFixed(1)} GB`;
}

const count = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function TreemapStorageDemo() {
  const [path, setPath] = React.useState<string[]>([]);
  const [trail, setTrail] = React.useState<Folder[]>([]);
  const current = trail[trail.length - 1];
  const files = fileCount(current ?? { id: "", label: "", children: bucket });

  return (
    <Treemap
      title="Storage by folder"
      description={
        <>
          <span className="font-mono">
            acme-studio-assets/
            {trail.map((folder) => `${folder.label}/`).join("")}
          </span>{" "}
          · {count.format(files)} files
        </>
      }
      actions={
        path.length ? (
          <button
            type="button"
            onClick={() => {
              setPath([]);
              setTrail([]);
            }}
            className="inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <IconRefresh aria-hidden="true" size={13} />
            Reset
          </button>
        ) : null
      }
      data={bucket}
      rootLabel="acme-studio-assets"
      height={320}
      path={path}
      onPathChange={(next, nodes) => {
        setPath(next);
        setTrail(nodes);
      }}
      valueFormatter={(value) => formatSize(value)}
      renderLabel={(node, info) => {
        if (info.size === "xs") return null;
        const Icon = node.id === "exports" ? IconFile : IconFolder;
        const files = fileCount(node);
        if (info.size === "sm")
          return (
            <span className="block truncate px-1.5 pt-1 font-mono text-[10.5px] leading-4">
              {node.label}
            </span>
          );
        return (
          <span className="flex h-full min-w-0 flex-col justify-between gap-1 p-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <Icon
                aria-hidden="true"
                size={13}
                className="shrink-0 opacity-70"
              />
              <span className="truncate font-mono text-[11px] leading-4 font-medium">
                {node.label}
              </span>
            </span>
            <span className="flex min-w-0 flex-col">
              <span
                className={
                  info.size === "lg"
                    ? "text-[15px] leading-5 font-semibold tracking-tight"
                    : "text-xs leading-4 font-semibold"
                }
              >
                {info.formattedValue}
              </span>
              {info.height >= 62 ? (
                <span className="truncate text-[10.5px] leading-4 tabular-nums opacity-70">
                  {info.size === "lg"
                    ? count.format(files)
                    : compact.format(files)}{" "}
                  files
                </span>
              ) : null}
            </span>
          </span>
        );
      }}
    />
  );
}
