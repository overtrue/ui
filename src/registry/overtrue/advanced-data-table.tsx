/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 *
 * MIT License
 *
 * Copyright (c) 2026 dashboardcn contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * ---
 *
 * Portions of this project are derived from shadcn/ui and shadcn/registry-template
 * (https://github.com/shadcn-ui/ui), Copyright (c) 2023 shadcn, licensed under the
 * MIT License. The notice above applies to those portions as well.
 */
"use client";

import * as React from "react";
import {
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  flexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnVisibilityState,
  type ReactTable,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import {
  IconArrowDown as ArrowDown,
  IconArrowUp as ArrowUp,
  IconArrowsSort as ArrowUpDown,
  IconChevronLeft as ChevronLeft,
  IconChevronRight as ChevronRight,
  IconChevronsLeft as ChevronsLeft,
  IconChevronsRight as ChevronsRight,
  IconGripVertical as GripVertical,
  IconAdjustmentsHorizontal as Settings2,
  IconX as X,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SearchField } from "./search-field";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * TanStack Table v9 is feature-gated: only what is registered here ships in
 * the bundle. Sorting, filtering, pagination, visibility, ordering, pinning,
 * and row selection cover the usual dashboard table.
 */
const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
});

type DataTableFeatures = typeof dataTableFeatures;

type DataTableColumnDef<TData extends RowData> = ColumnDef<
  DataTableFeatures,
  TData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;

/** The table instance returned by `useDataTable`. */
type DataTableInstance<TData extends RowData> = ReactTable<
  DataTableFeatures,
  TData
>;

type DataTableColumn<TData extends RowData> = Column<
  DataTableFeatures,
  TData,
  unknown
>;

type DataTableRow<TData extends RowData> = Row<DataTableFeatures, TData>;

/** Typed column helper bound to the data table's feature set. */
function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

/** Row density presets. Only the cell padding changes. */
type DataTableDensity = "compact" | "default" | "relaxed";

const densityClasses: Record<DataTableDensity, string> = {
  compact: "[&_th]:h-8 [&_td]:py-1 [&_td]:text-[0.8125rem]",
  default: "",
  relaxed: "[&_th]:h-12 [&_td]:py-3.5",
};

/* -------------------------------------------------------------------------- */
/*                                    hook                                    */
/* -------------------------------------------------------------------------- */

export interface UseDataTableOptions<TData extends RowData> {
  columns: ReadonlyArray<DataTableColumnDef<TData>>;
  data: TData[];
  /** Rows per page. Pass 0 to keep every row on a single page. */
  pageSize?: number;
  initialSorting?: SortingState;
  initialColumnVisibility?: ColumnVisibilityState;
  /**
   * Column ids held against the leading and trailing edge. Read once, on
   * mount; use `table.setColumnPinning` to change it afterwards. Pinned
   * columns should declare a `size` so the sticky offsets line up.
   */
  pinnedColumns?: Partial<ColumnPinningState>;
  /** Turn on checkbox selection, or decide per row. */
  enableRowSelection?: boolean | ((row: DataTableRow<TData>) => boolean);
  /** Stable row ids. Selection survives sorting and paging with this set. */
  getRowId?: (row: TData, index: number) => string;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
}

/**
 * Wires the table state the components below read. Call it when you want to
 * lay the pieces out yourself; `DataTable` calls it for you.
 */
function useDataTable<TData extends RowData>({
  columns,
  data,
  pageSize = 10,
  initialSorting,
  initialColumnVisibility,
  pinnedColumns,
  enableRowSelection,
  getRowId,
  onRowSelectionChange,
}: UseDataTableOptions<TData>): DataTableInstance<TData> {
  const [sorting, setSorting] = React.useState<SortingState>(
    initialSorting ?? [],
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>(initialColumnVisibility ?? {});
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    () => ({
      start: pinnedColumns?.start ?? [],
      end: pinnedColumns?.end ?? [],
    }),
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // Report the selection from an effect, not from inside the state updater:
  // the table can call the updater while it renders.
  const notify = React.useRef(onRowSelectionChange);
  const mounted = React.useRef(false);
  React.useEffect(() => {
    notify.current = onRowSelectionChange;
  });
  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    notify.current?.(rowSelection);
  }, [rowSelection]);

  return useTable({
    features: dataTableFeatures,
    data,
    columns: columns as DataTableColumnDef<TData>[],
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize > 0 ? pageSize : Number.MAX_SAFE_INTEGER,
      },
    },
    getRowId,
    enableRowSelection,
    // Shift-click extends the selection from the last row you touched.
    isRowRangeSelectionEvent: (event) =>
      Boolean((event as { shiftKey?: boolean }).shiftKey),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      columnPinning,
      rowSelection,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                                   preset                                   */
/* -------------------------------------------------------------------------- */

export interface DataTableProps<TData extends RowData>
  extends
    Omit<React.ComponentProps<"div">, "onSelect">,
    UseDataTableOptions<TData> {
  /** Column id to filter with the search input. Omit to hide the input. */
  searchKey?: string;
  searchPlaceholder?: string;
  /** Accessible name for the search field. Defaults to the column label. */
  searchLabel?: string;
  /** Extra toolbar content, rendered between the search input and view options. */
  toolbar?: React.ReactNode;
  showViewOptions?: boolean;
  showPagination?: boolean;
  pageSizeOptions?: number[];
  emptyMessage?: React.ReactNode;
  /** Swap the rows for a skeleton, e.g. on first load. */
  loading?: boolean;
  /** Keep the rows but dim them, e.g. while a filter change is in flight. */
  pending?: boolean;
  skeletonRows?: number;
  stickyHeader?: boolean;
  /** Caps the scroll area, e.g. 420 or "60vh". Pair it with stickyHeader. */
  maxHeight?: number | string;
  /** Let columns be dragged into a new order. Pass ids to limit which ones. */
  reorderable?: boolean | string[];
  density?: DataTableDensity;
  onRowClick?: (row: DataTableRow<TData>) => void;
  rowClassName?: (row: DataTableRow<TData>) => string | undefined;
  /** Anything else to put on a row, e.g. a data attribute or a handler. */
  rowProps?: (row: DataTableRow<TData>) => React.ComponentProps<"tr">;
  /** Wrap the row element, e.g. in a context menu trigger. */
  renderRow?: (
    row: DataTableRow<TData>,
    element: React.ReactElement,
  ) => React.ReactNode;
  /** Actions shown in the bar that appears while rows are selected. */
  selectionActions?: React.ReactNode;
}

/**
 * The batteries-included table: toolbar, rows, and pagination. Every part is
 * exported on its own, so reach for `useDataTable` and compose them by hand
 * when this shape is not the one you want.
 */
function DataTable<TData extends RowData>({
  columns,
  data,
  pageSize = 10,
  initialSorting,
  initialColumnVisibility,
  pinnedColumns,
  enableRowSelection,
  getRowId,
  onRowSelectionChange,
  searchKey,
  searchPlaceholder = "Filter...",
  searchLabel,
  toolbar,
  showViewOptions = true,
  showPagination = true,
  pageSizeOptions,
  emptyMessage,
  loading = false,
  pending = false,
  skeletonRows,
  stickyHeader = false,
  maxHeight,
  reorderable = false,
  density = "default",
  onRowClick,
  rowClassName,
  rowProps,
  renderRow,
  selectionActions,
  className,
  ...props
}: DataTableProps<TData>) {
  const table = useDataTable({
    columns,
    data,
    pageSize,
    initialSorting,
    initialColumnVisibility,
    pinnedColumns,
    enableRowSelection,
    getRowId,
    onRowSelectionChange,
  });

  const hasToolbar = Boolean(searchKey || toolbar || showViewOptions);
  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div
      data-slot="data-table"
      className={cn("flex min-w-0 flex-col gap-4", className)}
      {...props}
    >
      {hasToolbar ? (
        <DataTableToolbar>
          {searchKey ? (
            <DataTableSearch
              table={table}
              column={searchKey}
              placeholder={searchPlaceholder}
              label={searchLabel}
              disabled={loading}
            />
          ) : null}
          {toolbar}
          {showViewOptions ? (
            <DataTableViewOptions
              table={table}
              reorderable={reorderable}
              className="ml-auto"
              disabled={loading}
            />
          ) : null}
        </DataTableToolbar>
      ) : null}
      {selectedCount > 0 ? (
        <DataTableSelectionBar table={table}>
          {selectionActions}
        </DataTableSelectionBar>
      ) : null}
      <DataTableContent
        table={table}
        loading={loading}
        pending={pending}
        skeletonRows={skeletonRows ?? Math.min(pageSize || 10, 10)}
        stickyHeader={stickyHeader}
        maxHeight={maxHeight}
        reorderable={reorderable}
        density={density}
        emptyMessage={emptyMessage}
        onRowClick={onRowClick}
        rowClassName={rowClassName}
        rowProps={rowProps}
        renderRow={renderRow}
      />
      {showPagination ? (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   toolbar                                  */
/* -------------------------------------------------------------------------- */

/** The row above the table. Anything can go in it. */
function DataTableToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-table-toolbar"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

interface DataTableSearchProps<TData extends RowData> extends Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange"
> {
  table: DataTableInstance<TData>;
  /** Column id to filter. */
  column: string;
  label?: string;
}

function columnLabel<TData extends RowData>(column: DataTableColumn<TData>) {
  if (typeof column.columnDef.header === "string")
    return column.columnDef.header;
  const label = column.id
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** An input bound to one column's filter. */
function DataTableSearch<TData extends RowData>({
  table,
  column,
  label,
  className,
  ...props
}: DataTableSearchProps<TData>) {
  const target = table.getColumn(column);
  if (!target) return null;

  return (
    <SearchField
      data-slot="data-table-search"
      label={label ?? `Search ${columnLabel(target).toLowerCase()}`}
      value={(target.getFilterValue() as string) ?? ""}
      onValueChange={(value) => target.setFilterValue(value)}
      containerClassName="min-w-0 max-w-sm flex-1 basis-48"
      className={cn("h-8", className)}
      {...props}
    />
  );
}

interface DataTableViewOptionsProps<
  TData extends RowData,
> extends React.ComponentProps<typeof Button> {
  table: DataTableInstance<TData>;
  /** Adds "move left / move right" items for the reorderable columns. */
  reorderable?: boolean | string[];
}

/** Column visibility, and column order when reordering is on. */
function DataTableViewOptions<TData extends RowData>({
  table,
  reorderable = false,
  className,
  ...props
}: DataTableViewOptionsProps<TData>) {
  const columns = table.getAllColumns().filter((column) => column.getCanHide());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("h-8 shrink-0 shadow-none", className)}
          {...props}
        >
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {columnLabel(column)}
          </DropdownMenuCheckboxItem>
        ))}
        {reorderable ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Column order</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => table.resetColumnOrder()}>
              Reset to default
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DataTableColumnHeaderProps<
  TData extends RowData,
  TValue,
> extends React.ComponentProps<"div"> {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
  align?: "left" | "right";
}

function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  align = "left",
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div
        className={cn(align === "right" && "text-right", className)}
        {...props}
      >
        {title}
      </div>
    );
  }

  const sorted = column.getIsSorted();
  const Icon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <div
      className={cn("flex", align === "right" && "justify-end", className)}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="data-[sorted=true]:text-foreground -ml-2 h-8 gap-1.5 px-2"
        data-sorted={sorted !== false}
        onClick={() => column.toggleSorting(sorted === "asc")}
      >
        {title}
        <Icon className="text-muted-foreground size-3.5" />
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  selection                                 */
/* -------------------------------------------------------------------------- */

/**
 * A checkbox column. Put it first in your column list and give the table a
 * `getRowId` so the selection survives sorting and paging.
 */
function createSelectionColumn<TData extends RowData>(
  overrides?: Partial<DataTableColumnDef<TData>>,
): DataTableColumnDef<TData> {
  return {
    id: "select",
    size: 36,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows on this page"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        // The handler wants the checkbox's next value and the shift key, which
        // is what turns a click into a range selection.
        onClick={(event) =>
          row.getToggleSelectedHandler()({
            target: { checked: !row.getIsSelected() },
            shiftKey: event.shiftKey,
          })
        }
        aria-label="Select row"
      />
    ),
    ...overrides,
  } as DataTableColumnDef<TData>;
}

interface DataTableSelectionBarProps<
  TData extends RowData,
> extends React.ComponentProps<"div"> {
  table: DataTableInstance<TData>;
}

/** The bar that appears once rows are selected. Children are the actions. */
function DataTableSelectionBar<TData extends RowData>({
  table,
  children,
  className,
  ...props
}: DataTableSelectionBarProps<TData>) {
  const count = table.getSelectedRowModel().rows.length;

  return (
    <div
      data-slot="data-table-selection-bar"
      className={cn(
        "bg-muted/50 flex flex-wrap items-center gap-2 rounded-md border px-3 py-2",
        className,
      )}
      {...props}
    >
      <span className="text-sm tabular-nums">
        {count} {count === 1 ? "row" : "rows"} selected
      </span>
      <div className="ml-auto flex items-center gap-2">
        {children}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() => table.resetRowSelection()}
        >
          <X />
          Clear
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   content                                  */
/* -------------------------------------------------------------------------- */

/** Moves `columnId` to the slot `targetId` currently occupies. */
function moveColumn<TData extends RowData>(
  table: DataTableInstance<TData>,
  columnId: string,
  targetId: string,
) {
  const order = table.getAllLeafColumns().map((column) => column.id);
  const from = order.indexOf(columnId);
  const to = order.indexOf(targetId);
  if (from < 0 || to < 0 || from === to) return;
  const next = order.slice();
  next.splice(from, 1);
  next.splice(to, 0, columnId);
  table.setColumnOrder(next);
}

/** Nudges `columnId` one slot left (-1) or right (1). */
function shiftColumn<TData extends RowData>(
  table: DataTableInstance<TData>,
  columnId: string,
  delta: number,
) {
  const order = table.getAllLeafColumns().map((column) => column.id);
  const from = order.indexOf(columnId);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= order.length) return;
  const next = order.slice();
  next.splice(from, 1);
  next.splice(to, 0, columnId);
  table.setColumnOrder(next);
}

/**
 * Sticky offsets and hairlines for a pinned cell. The feature computes the
 * regions; the renderer owns the CSS.
 */
function getPinnedStyle<TData extends RowData>(
  column: DataTableColumn<TData>,
  { stickyHeader = false }: { stickyHeader?: boolean } = {},
): React.CSSProperties | undefined {
  const pinned = column.getIsPinned();
  const shadows: string[] = [];
  if (stickyHeader) shadows.push("inset 0 -1px 0 0 var(--color-border)");
  if (pinned === "start" && column.getIsLastColumn("start")) {
    shadows.push("inset -1px 0 0 0 var(--color-border)");
  }
  if (pinned === "end" && column.getIsFirstColumn("end")) {
    shadows.push("inset 1px 0 0 0 var(--color-border)");
  }
  if (!pinned && !shadows.length) return undefined;

  // Auto table layout treats width as a suggestion, so pin all three: the
  // sticky offsets are computed from `size` and have to match what renders.
  const size = pinned ? column.getSize() : undefined;

  return {
    insetInlineStart:
      pinned === "start" ? `${column.getStart("start")}px` : undefined,
    insetInlineEnd:
      pinned === "end" ? `${column.getAfter("end")}px` : undefined,
    width: size,
    minWidth: size,
    maxWidth: size,
    boxShadow: shadows.length ? shadows.join(", ") : undefined,
  };
}

/** Grip on a reorderable header. Drag it, or focus it and press an arrow. */
function DataTableDragHandle<TData extends RowData>({
  table,
  column,
}: {
  table: DataTableInstance<TData>;
  column: DataTableColumn<TData>;
}) {
  return (
    <button
      type="button"
      aria-label={`Reorder ${column.id} column`}
      className="text-muted-foreground/50 hover:text-foreground focus-visible:ring-ring/50 -ml-1 rounded-sm outline-none focus-visible:ring-[3px]"
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        shiftColumn(table, column.id, event.key === "ArrowLeft" ? -1 : 1);
      }}
    >
      <GripVertical className="size-3.5" />
    </button>
  );
}

const skeletonWidths = [72, 44, 58, 36, 64, 48, 52];

export interface DataTableContentProps<
  TData extends RowData,
> extends React.ComponentProps<"div"> {
  table: DataTableInstance<TData>;
  loading?: boolean;
  pending?: boolean;
  skeletonRows?: number;
  stickyHeader?: boolean;
  maxHeight?: number | string;
  reorderable?: boolean | string[];
  density?: DataTableDensity;
  emptyMessage?: React.ReactNode;
  onRowClick?: (row: DataTableRow<TData>) => void;
  rowClassName?: (row: DataTableRow<TData>) => string | undefined;
  /**
   * Anything else to put on a row: a handler, a data attribute, a title.
   * Merged after the built-in props, so it wins.
   */
  rowProps?: (row: DataTableRow<TData>) => React.ComponentProps<"tr">;
  /**
   * Wrap the row element, e.g. in a context menu trigger or a link. Render
   * the element you are handed somewhere inside what you return.
   */
  renderRow?: (
    row: DataTableRow<TData>,
    element: React.ReactElement,
  ) => React.ReactNode;
}

/** The bordered table itself: header, rows, and their loading states. */
function DataTableContent<TData extends RowData>({
  table,
  loading = false,
  pending = false,
  skeletonRows = 8,
  stickyHeader = false,
  maxHeight,
  reorderable = false,
  density = "default",
  emptyMessage,
  onRowClick,
  rowClassName,
  rowProps,
  renderRow,
  className,
  style,
  ...props
}: DataTableContentProps<TData>) {
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [dropTarget, setDropTarget] = React.useState<string | null>(null);

  const { start, end } = table.state.columnPinning;
  const hasPinned = start.length > 0 || end.length > 0;
  const visibleColumns = table.getVisibleLeafColumns();
  const rows = table.getRowModel().rows;

  const canReorder = (column: DataTableColumn<TData>) => {
    if (!reorderable || column.getIsPinned()) return false;
    return Array.isArray(reorderable)
      ? reorderable.includes(column.id)
      : column.getCanHide();
  };

  /** Native drag and drop, so no drag library is pulled in for this. */
  const dragProps = (columnId: string): React.ComponentProps<"th"> => ({
    draggable: true,
    onDragStart: (event) => {
      setDragging(columnId);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", columnId);
    },
    onDragOver: (event) => {
      if (!dragging || dragging === columnId) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      setDropTarget(columnId);
    },
    onDragLeave: () =>
      setDropTarget((current) => (current === columnId ? null : current)),
    onDrop: (event) => {
      event.preventDefault();
      if (dragging) moveColumn(table, dragging, columnId);
      setDragging(null);
      setDropTarget(null);
    },
    onDragEnd: () => {
      setDragging(null);
      setDropTarget(null);
    },
  });

  // Pinned cells are painted opaque so rows scroll under them, which would
  // otherwise hide the row's own hover and selected colours. Move both onto
  // the cells so pinned and unpinned columns stay in step. They have to stay
  // opaque too: a translucent hover on a pinned cell lets the columns passing
  // underneath show through, so the row hover is `bg-muted/50` pre-mixed over
  // the card surface rather than blended with whatever is behind the cell.
  const rowClasses = cn(
    "group/row",
    hasPinned && "hover:bg-transparent data-[state=selected]:bg-transparent",
  );
  const cellClasses = cn(
    hasPinned && [
      "group-hover/row:bg-[color-mix(in_oklab,var(--color-muted)_50%,var(--color-card))]",
      "group-data-[state=selected]/row:bg-muted",
    ],
  );

  return (
    <div
      data-slot="data-table-content"
      aria-busy={loading || pending || undefined}
      className={cn(
        "relative min-w-0 overflow-hidden rounded-md border bg-card text-card-foreground",
        "[&>[data-slot=table-container]]:[scrollbar-width:thin] [&>[data-slot=table-container]]:[scrollbar-color:color-mix(in_oklab,var(--color-foreground)_20%,transparent)_transparent]",
        maxHeight !== undefined &&
          "[&>[data-slot=table-container]]:max-h-[var(--data-table-max-height)]",
        densityClasses[density],
        className,
      )}
      style={
        maxHeight !== undefined
          ? ({
              ...style,
              "--data-table-max-height":
                typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
            } as React.CSSProperties)
          : style
      }
      {...props}
    >
      {pending ? (
        <div
          aria-hidden
          className="bg-primary/60 absolute inset-x-0 top-0 z-40 h-0.5 animate-pulse"
        />
      ) : null}
      <Table className="whitespace-nowrap">
        <TableHeader className={cn(stickyHeader && "[&_tr]:border-b-0")}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className={cn(rowClasses, "hover:bg-transparent")}
            >
              {headerGroup.headers.map((header) => {
                const column = header.column as DataTableColumn<TData>;
                const pinned = column.getIsPinned();
                const draggable = canReorder(column);

                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    aria-sort={
                      header.isPlaceholder
                        ? undefined
                        : column.getIsSorted() === "asc"
                          ? "ascending"
                          : column.getIsSorted() === "desc"
                            ? "descending"
                            : undefined
                    }
                    data-pinned={pinned || undefined}
                    data-dragging={dragging === column.id || undefined}
                    data-drop-target={dropTarget === column.id || undefined}
                    {...(draggable ? dragProps(column.id) : null)}
                    className={cn(
                      "bg-[color-mix(in_oklab,var(--color-muted)_30%,var(--color-card))]",
                      stickyHeader && "sticky top-0 z-20",
                      pinned && "sticky z-20 overflow-hidden",
                      pinned && stickyHeader && "z-30",
                      draggable && "cursor-grab data-[dragging]:opacity-40",
                      "data-[drop-target]:bg-muted",
                    )}
                    style={getPinnedStyle(column, { stickyHeader })}
                  >
                    {header.isPlaceholder ? null : draggable ? (
                      <div className="flex items-center gap-1">
                        <DataTableDragHandle table={table} column={column} />
                        {flexRender(
                          column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    ) : (
                      flexRender(column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          className={cn(
            pending && "pointer-events-none opacity-50",
            "transition-opacity",
          )}
        >
          {loading ? (
            <DataTableSkeletonRows
              columns={visibleColumns.length}
              rows={skeletonRows}
            />
          ) : rows.length ? (
            rows.map((row) => {
              const extra = rowProps?.(row);
              const element = (
                <TableRow
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  {...extra}
                  className={cn(
                    rowClasses,
                    onRowClick && "cursor-pointer",
                    rowClassName?.(row),
                    extra?.className,
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const column = cell.column as DataTableColumn<TData>;
                    const pinned = column.getIsPinned();

                    return (
                      <TableCell
                        key={cell.id}
                        data-pinned={pinned || undefined}
                        className={cn(
                          cellClasses,
                          pinned && "bg-card sticky z-20 overflow-hidden",
                        )}
                        style={getPinnedStyle(column)}
                      >
                        {flexRender(column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );

              return (
                <React.Fragment key={row.id}>
                  {renderRow ? renderRow(row, element) : element}
                </React.Fragment>
              );
            })
          ) : null}
        </TableBody>
      </Table>
      {!loading && !rows.length && (
        <div role="status" className="px-4 py-10 text-center">
          {emptyMessage ?? (
            <>
              <p className="m-0 text-sm font-medium">
                {table.state.columnFilters.length
                  ? "No matching records."
                  : "No records yet."}
              </p>
              <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">
                {table.state.columnFilters.length
                  ? "Try changing or clearing your filters."
                  : "Records will appear here when they are available."}
              </p>
              {table.state.columnFilters.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4 shadow-none"
                  onClick={() => {
                    table.resetColumnFilters();
                    table.setPageIndex(0);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  skeletons                                 */
/* -------------------------------------------------------------------------- */

function DataTableSkeletonRows({
  columns,
  rows,
}: {
  columns: number;
  rows: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <TableCell key={columnIndex}>
              <Skeleton
                className="h-4"
                style={{
                  width: `${
                    skeletonWidths[
                      (rowIndex + columnIndex) % skeletonWidths.length
                    ]
                  }%`,
                }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export interface DataTableSkeletonProps extends React.ComponentProps<"div"> {
  columns: number;
  rows?: number;
  showToolbar?: boolean;
  showPagination?: boolean;
}

/**
 * A standalone placeholder for when the columns are not known yet, e.g. a
 * Suspense fallback. Once you have a table instance, `loading` on
 * `DataTableContent` renders the same rows under the real header.
 */
function DataTableSkeleton({
  columns,
  rows = 8,
  showToolbar = true,
  showPagination = true,
  className,
  ...props
}: DataTableSkeletonProps) {
  return (
    <div
      data-slot="data-table-skeleton"
      aria-busy
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {showToolbar ? (
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-full max-w-sm" />
          <Skeleton className="ml-auto h-8 w-20" />
        </div>
      ) : null}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-3.5 w-16" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <DataTableSkeletonRows columns={columns} rows={rows} />
          </TableBody>
        </Table>
      </div>
      {showPagination ? (
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-8 w-48" />
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 pagination                                 */
/* -------------------------------------------------------------------------- */

interface DataTablePaginationProps<
  TData extends RowData,
> extends React.ComponentProps<"div"> {
  table: DataTableInstance<TData>;
  /** Adds a rows-per-page menu. */
  pageSizeOptions?: number[];
}

function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.state.pagination;
  const total = table.getFilteredRowModel().rows.length;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "@container/table-pagination flex min-w-0 flex-wrap items-center justify-between gap-3",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p
          className="m-0 whitespace-nowrap text-muted-foreground text-xs tabular-nums"
          aria-live="polite"
        >
          {total ? `${from}–${to} of ${total}` : "0 records"}
        </p>
        {pageSizeOptions?.length ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 tabular-nums"
              >
                {pageSize} per page
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36">
              {pageSizeOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={option === pageSize}
                  onCheckedChange={() => table.setPageSize(option)}
                  className="tabular-nums"
                >
                  {option} per page
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden size-8 shadow-none @min-[20rem]/table-pagination:inline-flex"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="First page"
        >
          <ChevronsLeft />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 shrink-0 shadow-none"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        <span className="whitespace-nowrap text-muted-foreground px-2 text-xs tabular-nums">
          Page {pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 shrink-0 shadow-none"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden size-8 shadow-none @min-[20rem]/table-pagination:inline-flex"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Last page"
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}

export {
  DataTable,
  DataTableColumnHeader,
  DataTableContent,
  DataTablePagination,
  DataTableSearch,
  DataTableSelectionBar,
  DataTableSkeleton,
  DataTableToolbar,
  DataTableViewOptions,
  createDataTableColumnHelper,
  createSelectionColumn,
  dataTableFeatures,
  moveColumn,
  shiftColumn,
  useDataTable,
  type DataTableColumnDef,
  type DataTableDensity,
  type DataTableFeatures,
  type DataTableInstance,
  type DataTableRow,
};
