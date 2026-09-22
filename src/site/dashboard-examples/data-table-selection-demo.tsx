/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import * as React from "react";
import {
  IconDownload as Download,
  IconTrash as Trash2,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/registry/overtrue/metric-format";
import {
  DataTable,
  DataTableColumnHeader,
  createDataTableColumnHelper,
  createSelectionColumn,
} from "@/registry/overtrue/advanced-data-table";

type InvoiceRow = {
  id: string;
  customer: string;
  status: "paid" | "open" | "overdue";
  issued: string;
  amount: number;
};

const invoices: InvoiceRow[] = [
  {
    id: "INV-2601",
    customer: "Culture venue",
    status: "paid",
    issued: "2026-08-02",
    amount: 12_400,
  },
  {
    id: "INV-2602",
    customer: "Member collective",
    status: "open",
    issued: "2026-08-04",
    amount: 3_180,
  },
  {
    id: "INV-2603",
    customer: "Ceramics studio",
    status: "overdue",
    issued: "2026-07-11",
    amount: 8_960,
  },
  {
    id: "INV-2604",
    customer: "Editorial studio",
    status: "paid",
    issued: "2026-08-09",
    amount: 1_240,
  },
  {
    id: "INV-2605",
    customer: "Learning platform",
    status: "open",
    issued: "2026-08-12",
    amount: 22_500,
  },
  {
    id: "INV-2606",
    customer: "Design archive",
    status: "paid",
    issued: "2026-08-14",
    amount: 640,
  },
  {
    id: "INV-2607",
    customer: "Community gallery",
    status: "overdue",
    issued: "2026-06-28",
    amount: 15_820,
  },
  {
    id: "INV-2608",
    customer: "Independent publisher",
    status: "open",
    issued: "2026-08-19",
    amount: 4_075,
  },
];

const helper = createDataTableColumnHelper<InvoiceRow>();

const columns = helper.columns([
  createSelectionColumn<InvoiceRow>(),
  helper.accessor("id", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id}</span>
    ),
  }),
  helper.accessor("customer", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
  }),
  helper.accessor("status", {
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "paid"
            ? "secondary"
            : row.original.status === "overdue"
              ? "destructive"
              : "outline"
        }
      >
        {row.original.status}
      </Badge>
    ),
  }),
  helper.accessor("issued", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issued" />
    ),
    sortFn: "datetime",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {row.original.issued}
      </span>
    ),
  }),
  helper.accessor("amount", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" align="right" />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatNumber(row.original.amount, { format: "currency" })}
      </div>
    ),
  }),
]);

export default function DataTableSelectionDemo() {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <div className="flex w-full flex-col gap-3">
      <DataTable
        columns={columns}
        data={invoices}
        searchKey="customer"
        searchPlaceholder="Find a client invoice…"
        enableRowSelection
        getRowId={(row) => row.id}
        onRowSelectionChange={(selection) =>
          setSelected(Object.keys(selection))
        }
        selectionActions={
          <>
            <Button variant="outline" size="sm" className="h-8">
              <Download />
              Export
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Trash2 />
              Void
            </Button>
          </>
        }
        pageSize={0}
        showPagination={false}
      />
      <p className="text-muted-foreground text-sm">
        Shift-click a checkbox to select a range. Selected:{" "}
        {selected.length ? selected.join(", ") : "none"}
      </p>
    </div>
  );
}
