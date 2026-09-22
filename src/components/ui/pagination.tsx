import * as React from "react"
import { cn } from "@/lib/utils"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page?: number
  pageCount?: number
  onPageChange?: (p: number) => void
  showEdges?: boolean
  siblings?: number
}

function pageItems(page: number, pageCount: number, siblings: number) {
  const items: (number | "…")[] = []
  const start = Math.max(1, page - siblings)
  const end = Math.min(pageCount, page + siblings)
  if (start > 1) {
    items.push(1)
    if (start > 2) items.push("…")
  }
  for (let i = start; i <= end; i++) items.push(i)
  if (end < pageCount) {
    if (end < pageCount - 1) items.push("…")
    items.push(pageCount)
  }
  return items
}

/** overtrue/ui .pagination — square-ish page links, active = primary fill */
function Pagination({
  page = 1,
  pageCount = 1,
  onPageChange,
  showEdges = true,
  siblings = 1,
  className,
  ...props
}: PaginationProps) {
  const items = pageItems(page, pageCount, siblings)
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      <ul className="flex flex-row items-center gap-1">
        {showEdges ? (
          <li>
            <button
              type="button"
              aria-label="First page"
              disabled={page <= 1}
              onClick={() => onPageChange?.(1)}
              className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-transparent px-1.5 text-[#374151] hover:bg-[#f3f4f6] disabled:opacity-40"
            >
              <IconChevronsLeft className="h-4 w-4" />
            </button>
          </li>
        ) : null}
        <li>
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange?.(Math.max(1, page - 1))}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-transparent px-1.5 text-[#374151] hover:bg-[#f3f4f6] disabled:opacity-40"
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>
        </li>
        {items.map((item, idx) =>
          item === "…" ? (
            <li key={`e-${idx}`} className="px-1 text-sm text-[#6b7280]">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange?.(item)}
                className={cn(
                  "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm font-medium",
                  item === page
                    ? "border-transparent bg-[#066fd1] text-[#f9fafb]"
                    : "border-transparent bg-transparent text-[#374151] hover:bg-[#f3f4f6]",
                )}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => onPageChange?.(Math.min(pageCount, page + 1))}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-transparent px-1.5 text-[#374151] hover:bg-[#f3f4f6] disabled:opacity-40"
          >
            <IconChevronRight className="h-4 w-4" />
          </button>
        </li>
        {showEdges ? (
          <li>
            <button
              type="button"
              aria-label="Last page"
              disabled={page >= pageCount}
              onClick={() => onPageChange?.(pageCount)}
              className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-transparent px-1.5 text-[#374151] hover:bg-[#f3f4f6] disabled:opacity-40"
            >
              <IconChevronsRight className="h-4 w-4" />
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}

export { Pagination }
