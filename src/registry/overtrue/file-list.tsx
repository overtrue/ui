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
      className={cn("m-0 list-none divide-y divide-border/60 p-0", className)}
    >
      {items.map((file) => (
        <li
          key={file.id}
          data-slot="file-list-item"
          className="group/file flex items-center gap-3 py-3 first:pt-0 last:pb-0"
        >
          <span
            aria-hidden="true"
            data-slot="file-list-icon"
            className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground ring-1 ring-border/60 ring-inset transition-colors duration-150 group-hover/file:text-foreground motion-reduce:transition-none [&_svg]:size-5 [&_svg]:stroke-[1.75]"
          >
            <span className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent dark:via-foreground/15" />
            {file.icon ?? <IconFileText />}
          </span>
          <div className="min-w-0 flex-1">
            {file.href ? (
              <a
                className="rounded-sm text-sm font-medium tracking-tight break-words text-foreground underline-offset-4 decoration-foreground/30 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/30"
                href={file.href}
              >
                {file.name}
              </a>
            ) : (
              <p className="m-0 text-sm font-medium tracking-tight break-words text-foreground">
                {file.name}
              </p>
            )}
            {file.description && (
              <p className="m-0 mt-0.5 text-xs leading-5 break-words text-muted-foreground tabular-nums">
                {file.description}
              </p>
            )}
          </div>
          {file.actions && (
            <div
              data-slot="file-list-actions"
              className="flex shrink-0 items-center gap-1"
            >
              {file.actions}
            </div>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p
      data-slot="file-list-empty"
      className={cn(
        "m-0 rounded-xl border border-dashed border-border/80 px-4 py-6 text-center text-[13px] text-muted-foreground",
        className,
      )}
    >
      {emptyMessage}
    </p>
  );
}
