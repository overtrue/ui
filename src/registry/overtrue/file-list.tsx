import type { ReactNode } from "react";
import { IconFileText } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface FileListItem {
  id: string;
  name: string;
  description?: string;
  href?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}
/** Supply a real destination or an action; this component does not upload files. */
export function FileList({
  items,
  label = "Files",
  emptyMessage = "No files attached.",
  className,
}: {
  items: readonly FileListItem[];
  label?: string;
  emptyMessage?: string;
  className?: string;
}) {
  return items.length ? (
    <ul
      data-slot="file-list"
      aria-label={label}
      className={cn("m-0 list-none divide-y divide-border p-0", className)}
    >
      {items.map((file) => (
        <li
          key={file.id}
          className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
        >
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground [&_svg]:size-5"
          >
            {file.icon ?? <IconFileText />}
          </span>
          <div className="min-w-0 flex-1">
            {file.href ? (
              <a
                className="break-words text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                href={file.href}
              >
                {file.name}
              </a>
            ) : (
              <p className="m-0 break-words text-sm font-medium text-foreground">
                {file.name}
              </p>
            )}
            {file.description && (
              <p className="m-0 mt-1 break-words text-xs leading-5 text-muted-foreground">
                {file.description}
              </p>
            )}
          </div>
          {file.actions && (
            <div className="flex shrink-0 items-center gap-2">
              {file.actions}
            </div>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  );
}
