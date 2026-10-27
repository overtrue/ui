"use client";

import { useId, type ReactNode } from "react";
import {
  IconFile,
  IconFolder,
  IconPhoto,
  IconDownload,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface BrowserFile {
  id: string;
  name: string;
  kind?: "file" | "folder" | "image";
  size?: string;
  updated?: string;
  owner?: string;
  downloadUrl?: string;
  preview?: string;
  metadata?: ReactNode;
}

/** Presentational file records. Applications own selection, permissions and downloads. */
export function FileBrowser({
  files,
  selectedIds,
  onSelectionChange,
  onOpen,
  empty = "No files in this collection.",
  className,
}: {
  files: readonly BrowserFile[];
  selectedIds?: readonly string[];
  onSelectionChange?: (ids: string[]) => void;
  onOpen?: (file: BrowserFile) => void;
  empty?: string;
  className?: string;
}) {
  const id = useId();
  const selection = new Set(selectedIds ?? []);
  const selectable = Boolean(onSelectionChange);
  const selectedVisible = files.filter((file) => selection.has(file.id)).length;
  const toggle = (ids: string[], checked: boolean) => {
    const next = new Set(selection);
    ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
    onSelectionChange?.([...next]);
  };
  return (
    <div
      data-slot="file-browser"
      className={cn(
        "@container min-w-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-border bg-muted/35 px-4 py-3 text-xs text-muted-foreground">
        {selectable && (
          <input
            type="checkbox"
            aria-label="Select all files"
            checked={files.length > 0 && selectedVisible === files.length}
            ref={(node) => {
              if (node)
                node.indeterminate =
                  selectedVisible > 0 && selectedVisible < files.length;
            }}
            disabled={!files.length}
            onChange={(event) =>
              toggle(
                files.map((file) => file.id),
                event.target.checked,
              )
            }
            className="size-4 shrink-0 accent-primary"
          />
        )}
        <span className="flex-1">
          {selectedVisible ? `${selectedVisible} selected` : "Name"}
        </span>
        <span className="hidden w-32 @xl:block">Last updated</span>
        <span className="hidden w-20 text-right @xl:block">Size</span>
        <span className="w-7" aria-hidden="true" />
      </div>
      <ul
        aria-label="Files"
        className="m-0 list-none divide-y divide-border p-0"
      >
        {files.map((file, index) => {
          const Icon =
            file.kind === "folder"
              ? IconFolder
              : file.kind === "image"
                ? IconPhoto
                : IconFile;
          return (
            <li
              key={file.id}
              data-slot="file-browser-item"
              data-selected={selection.has(file.id)}
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30 data-[selected=true]:bg-primary/5"
            >
              {selectable && (
                <input
                  id={`${id}-${index}`}
                  type="checkbox"
                  aria-label={`Select ${file.name}`}
                  checked={selection.has(file.id)}
                  onChange={(event) => toggle([file.id], event.target.checked)}
                  className="size-4 shrink-0 accent-primary"
                />
              )}
              <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/50 text-muted-foreground">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <Icon size={19} stroke={1.5} aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                {onOpen ? (
                  <button
                    type="button"
                    onClick={() => onOpen(file)}
                    className="block max-w-full rounded-sm text-left text-sm font-medium [overflow-wrap:anywhere] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {file.name}
                  </button>
                ) : (
                  <p className="m-0 text-sm font-medium [overflow-wrap:anywhere]">
                    {file.name}
                  </p>
                )}
                <p className="m-0 mt-1 flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                  {file.owner && <span>{file.owner}</span>}
                  <span className="@xl:hidden">
                    {[file.size, file.updated].filter(Boolean).join(" · ")}
                  </span>
                  {file.metadata}
                </p>
              </div>
              <span className="hidden w-32 shrink-0 text-xs text-muted-foreground @xl:block">
                {file.updated ?? "—"}
              </span>
              <span className="hidden w-20 shrink-0 text-right text-xs tabular-nums text-muted-foreground @xl:block">
                {file.size ?? "—"}
              </span>
              {file.downloadUrl ? (
                <a
                  href={file.downloadUrl}
                  download={file.name}
                  aria-label={`Download ${file.name}`}
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <IconDownload size={16} aria-hidden="true" />
                </a>
              ) : (
                <span className="w-7 shrink-0" />
              )}
            </li>
          );
        })}
      </ul>
      {!files.length && (
        <p className="m-0 px-5 py-10 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      )}
    </div>
  );
}
