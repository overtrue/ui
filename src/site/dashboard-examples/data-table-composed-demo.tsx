/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/overtrue/analytics-card";
import {
  DataTableColumnHeader,
  DataTableContent,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableViewOptions,
  createDataTableColumnHelper,
  useDataTable,
} from "@/registry/overtrue/advanced-data-table";

type TicketRow = {
  subject: string;
  requester: string;
  status: "open" | "waiting" | "closed";
  priority: "urgent" | "high" | "normal";
  age: string;
};

const tickets: TicketRow[] = [
  {
    subject: "Confirm the invoice contact",
    requester: "M. Okafor",
    status: "open",
    priority: "high",
    age: "2h",
  },
  {
    subject: "Restore access to the client portal",
    requester: "J. Park",
    status: "open",
    priority: "urgent",
    age: "4h",
  },
  {
    subject: "Include the last milestone in the export",
    requester: "I. Duarte",
    status: "waiting",
    priority: "normal",
    age: "1d",
  },
  {
    subject: "Remove a duplicate review reminder",
    requester: "L. Nakamura",
    status: "open",
    priority: "high",
    age: "1d",
  },
  {
    subject: "Resend the project invitation",
    requester: "S. Haddad",
    status: "closed",
    priority: "normal",
    age: "3d",
  },
  {
    subject: "Chart tooltip clipped on mobile",
    requester: "A. Fontaine",
    status: "waiting",
    priority: "normal",
    age: "3d",
  },
  {
    subject: "Seat count off by one",
    requester: "K. Brennan",
    status: "closed",
    priority: "high",
    age: "5d",
  },
  {
    subject: "API key scopes not enforced",
    requester: "T. Iqbal",
    status: "open",
    priority: "urgent",
    age: "6d",
  },
  {
    subject: "Timezone wrong in digest",
    requester: "L. Moreau",
    status: "closed",
    priority: "normal",
    age: "8d",
  },
];

const helper = createDataTableColumnHelper<TicketRow>();

const columns = helper.columns([
  helper.accessor("subject", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.subject}</span>
    ),
  }),
  helper.accessor("requester", {
    header: "Requester",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.requester}</span>
    ),
  }),
  helper.accessor("status", {
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "open" ? "secondary" : "outline"}>
        {row.original.status}
      </Badge>
    ),
  }),
  helper.accessor("priority", {
    header: "Priority",
    cell: ({ row }) => (
      <span
        className={
          row.original.priority === "urgent"
            ? "text-destructive"
            : "text-muted-foreground"
        }
      >
        {row.original.priority}
      </span>
    ),
  }),
  helper.accessor("age", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" align="right" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-right tabular-nums">
        {row.original.age}
      </div>
    ),
  }),
]);

const statuses = ["open", "waiting", "closed"];

export default function DataTableComposedDemo() {
  // Own the instance, then lay the pieces out however the design calls for.
  const table = useDataTable({ columns, data: tickets, pageSize: 5 });

  const status = table.getColumn("status");
  const active = (status?.getFilterValue() as string) ?? "";

  return (
    <Card className="w-full gap-4">
      <CardHeader>
        <CardTitle> Client requests </CardTitle>
        <CardDescription>
          {" "}
          Follow up on the details holding a project back.{" "}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <DataTableToolbar>
          <DataTableSearch
            table={table}
            column="subject"
            placeholder="Search client requests…"
          />
          <div className="flex flex-wrap items-center gap-1">
            {statuses.map((value) => (
              <Button
                key={value}
                variant={active === value ? "secondary" : "ghost"}
                size="sm"
                className="h-8 capitalize"
                aria-pressed={active === value}
                onClick={() =>
                  status?.setFilterValue(active === value ? "" : value)
                }
              >
                {value}
              </Button>
            ))}
          </div>
          <DataTableViewOptions table={table} className="ml-auto" />
        </DataTableToolbar>
        <DataTableContent
          table={table}
          density="compact"
          emptyMessage="No requests match your search."
        />
      </CardContent>
      <CardFooter>
        <DataTablePagination
          table={table}
          pageSizeOptions={[5, 10, 25]}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}
