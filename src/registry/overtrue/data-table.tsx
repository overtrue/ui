"use client";
import { useMemo, useState, type ReactNode } from "react";
import {
  IconArrowDown as ArrowDown,
  IconArrowUp as ArrowUp,
  IconArrowsSort as ArrowsSort,
  IconChevronLeft as ChevronLeft,
  IconChevronRight as ChevronRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { SearchField } from "./search-field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export interface DataColumn<T> {
  key: string;
  label: string;
  value: (row: T) => string | number;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
}
export function DataTable<T>({
  rows,
  columns,
  getRowId,
  title = "Records",
  pageSize = 5,
}: {
  rows: T[];
  columns: DataColumn<T>[];
  getRowId: (row: T) => string;
  title?: string;
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; direction: 1 | -1 } | null>(
    null,
  );
  const [page, setPage] = useState(0);
  const size = Number.isFinite(pageSize)
    ? Math.max(1, Math.floor(pageSize) || 5)
    : 5;
  const filtered = useMemo(() => {
    const found = rows.filter((row) =>
      columns.some((column) =>
        String(column.value(row))
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    );
    const column = columns.find((item) => item.key === sort?.key);
    if (column && sort)
      found.sort((a, b) => {
        const x = column.value(a),
          y = column.value(b);
        return (
          (typeof x === "number" && typeof y === "number"
            ? x - y
            : String(x).localeCompare(String(y))) * sort.direction
        );
      });
    return found;
  }, [rows, columns, query, sort]);
  const lastPage = Math.max(0, Math.ceil(filtered.length / size) - 1);
  const safePage = Math.min(page, lastPage);
  return (
    <section
      className="min-w-0 overflow-hidden rounded-lg border bg-card shadow-none"
      aria-label={title}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <h2 className="text-sm font-semibold text-card-foreground">{title}</h2>
        <SearchField
          label={`Search ${title.toLowerCase()}`}
          value={query}
          onValueChange={(value) => {
            setQuery(value);
            setPage(0);
          }}
          placeholder="Search records…"
          containerClassName="w-full max-w-56"
        />
      </div>
      <div className="overflow-x-auto">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  aria-sort={
                    sort?.key === column.key
                      ? sort.direction === 1
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  className="h-10 bg-muted/30 px-4 text-xs font-medium"
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSort({
                          key: column.key,
                          direction:
                            sort?.key === column.key && sort.direction === 1
                              ? -1
                              : 1,
                        });
                        setPage(0);
                      }}
                      className="-ms-2 flex items-center gap-1.5 rounded-md px-2 py-2 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {column.label}
                      {sort?.key === column.key ? (
                        sort.direction === 1 ? (
                          <ArrowUp aria-hidden="true" className="size-3" />
                        ) : (
                          <ArrowDown aria-hidden="true" className="size-3" />
                        )
                      ) : (
                        <ArrowsSort
                          aria-hidden="true"
                          className="size-3 text-muted-foreground"
                        />
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered
              .slice(safePage * size, (safePage + 1) * size)
              .map((row) => (
                <TableRow key={getRowId(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className="px-4 py-3.5 text-sm">
                      {column.render ? column.render(row) : column.value(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {!filtered.length && (
        <div role="status" className="px-4 py-10 text-center">
          <p className="m-0 text-sm font-medium">
            {query.trim() ? "No matching records." : "No records yet."}
          </p>
          <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">
            {query.trim()
              ? "Try another search or clear it to see all records."
              : "Records will appear here when they are available."}
          </p>
          {query.trim() && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 shadow-none"
              onClick={() => {
                setQuery("");
                setPage(0);
              }}
            >
              Clear search
            </Button>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {filtered.length
            ? `${safePage * size + 1}–${Math.min((safePage + 1) * size, filtered.length)}`
            : "0"}{" "}
          of {filtered.length} records
        </p>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 border-border bg-card text-foreground shadow-none hover:bg-muted"
            aria-label="Previous page"
            disabled={!safePage}
            onClick={() => setPage(safePage - 1)}
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 border-border bg-card text-foreground shadow-none hover:bg-muted"
            aria-label="Next page"
            disabled={safePage >= lastPage}
            onClick={() => setPage(safePage + 1)}
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
