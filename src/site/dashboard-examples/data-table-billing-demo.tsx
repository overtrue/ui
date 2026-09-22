import { useState } from "react";
import { IconCheck, IconRefresh } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  DataTableColumnHeader,
  createDataTableColumnHelper,
} from "@/registry/overtrue/advanced-data-table";
import { PeriodTabs } from "@/registry/overtrue/period-tabs";
import { formatNumber } from "@/registry/overtrue/metric-format";

type Invoice = {
  id: string;
  client: string;
  amount: number;
  status: "open" | "overdue" | "paid";
};
const initialInvoices: Invoice[] = [
  { id: "ST-091", client: "Culture venue", amount: 6400, status: "open" },
  { id: "ST-092", client: "Ceramics studio", amount: 2800, status: "overdue" },
  { id: "ST-093", client: "Member collective", amount: 8200, status: "paid" },
  { id: "ST-094", client: "Editorial studio", amount: 3600, status: "open" },
];
const filters = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "overdue", label: "Overdue" },
  { value: "paid", label: "Paid" },
];
const helper = createDataTableColumnHelper<Invoice>();

export default function DataTableBillingDemo() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [filter, setFilter] = useState("all");
  const [empty, setEmpty] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const outstanding = invoices
    .filter((invoice) => invoice.status !== "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const rows = empty
    ? []
    : invoices.filter(
        (invoice) => filter === "all" || invoice.status === filter,
      );
  const columns = helper.columns([
    helper.accessor("client", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Client" />
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.client}</p>
          <p className="text-xs text-muted-foreground">{row.original.id}</p>
        </div>
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
    helper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "overdue"
              ? "destructive"
              : row.original.status === "paid"
                ? "secondary"
                : "outline"
          }
        >
          {row.original.status}
        </Badge>
      ),
    }),
    helper.display({
      id: "action",
      header: "",
      cell: ({ row }) =>
        row.original.status === "paid" ? (
          <span className="text-xs text-muted-foreground">Settled</span>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Mark ${row.original.id} paid`}
            onClick={() =>
              setInvoices((current) =>
                current.map((invoice) =>
                  invoice.id === row.original.id
                    ? { ...invoice, status: "paid" }
                    : invoice,
                ),
              )
            }
          >
            <IconCheck size={14} />
            Mark paid
          </Button>
        ),
    }),
  ]);
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div aria-live="polite">
          <p className="text-sm text-muted-foreground">Unpaid balance</p>
          <p className="text-2xl font-semibold tabular-nums">
            {formatNumber(outstanding, { format: "currency" })}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInvoices(initialInvoices);
            setFilter("all");
            setEmpty(false);
            setResetCount((count) => count + 1);
          }}
        >
          <IconRefresh size={14} />
          Reset demo
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PeriodTabs
          aria-label="Invoice status"
          options={filters}
          value={filter}
          onValueChange={setFilter}
        />
        <Button
          variant="outline"
          size="sm"
          aria-pressed={empty}
          onClick={() => setEmpty((current) => !current)}
        >
          {empty ? "Show invoices" : "Preview empty state"}
        </Button>
      </div>
      <DataTable
        key={resetCount}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        searchKey="client"
        searchPlaceholder="Search studio invoices…"
        showViewOptions={false}
        pageSize={0}
        showPagination={false}
        emptyMessage="No invoices in this view. Choose another status or reset the demo."
      />
      <p className="text-sm text-muted-foreground">
        Sample records only. Marking an invoice paid updates this preview and
        its unpaid balance.
      </p>
    </div>
  );
}
