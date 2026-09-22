/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import * as React from "react";
import { IconDots as MoreHorizontal } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataTable,
  DataTableColumnHeader,
  createDataTableColumnHelper,
  type DataTableRow,
} from "@/registry/overtrue/advanced-data-table";

type KeyRow = {
  name: string;
  scope: "read" | "write" | "admin";
  lastUsed: string;
};

const keys: KeyRow[] = [
  { name: "Client portal", scope: "admin", lastUsed: "2 minutes ago" },
  { name: "Review workspace", scope: "write", lastUsed: "1 hour ago" },
  { name: "Delivery report export", scope: "read", lastUsed: "Yesterday" },
  { name: "Asset publishing", scope: "write", lastUsed: "3 days ago" },
  { name: "Partner review space", scope: "read", lastUsed: "2 weeks ago" },
  { name: "Review notifications", scope: "read", lastUsed: "Never" },
];

/** One list of actions, rendered by whichever menu asked for it. */
const actions = [
  { label: "Copy key id" },
  { label: "Edit scope" },
  { label: "Revoke", separated: true, destructive: true },
];

function RowMenu({ row }: { row: DataTableRow<KeyRow> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          <MoreHorizontal />
          <span className="sr-only">Open menu for {row.original.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {actions.map((action) => (
          <React.Fragment key={action.label}>
            {action.separated ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem
              variant={action.destructive ? "destructive" : "default"}
            >
              {action.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const helper = createDataTableColumnHelper<KeyRow>();

const columns = helper.columns([
  helper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  }),
  helper.accessor("scope", {
    header: "Scope",
    cell: ({ row }) => (
      <Badge variant={row.original.scope === "admin" ? "secondary" : "outline"}>
        {row.original.scope}
      </Badge>
    ),
  }),
  helper.accessor("lastUsed", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last used" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.lastUsed}</span>
    ),
  }),
  helper.display({
    id: "actions",
    size: 48,
    enableHiding: false,
    header: () => <span className="sr-only"> Start something </span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <RowMenu row={row} />
      </div>
    ),
  }),
]);

export default function DataTableRowActionsDemo() {
  return (
    <div className="flex w-full flex-col gap-3">
      <DataTable
        columns={columns}
        data={keys}
        searchKey="name"
        searchPlaceholder="Search integration access…"
        pageSize={0}
        showPagination={false}
        // renderRow is the escape hatch: wrap the row in whatever you like.
        // Here it becomes a context menu trigger, so the same actions are a
        // right-click away anywhere in the row.
        renderRow={(_row, element) => (
          <ContextMenu>
            <ContextMenuTrigger asChild>{element}</ContextMenuTrigger>
            <ContextMenuContent className="w-40">
              {actions.map((action) => (
                <React.Fragment key={action.label}>
                  {action.separated ? <ContextMenuSeparator /> : null}
                  <ContextMenuItem
                    variant={action.destructive ? "destructive" : "default"}
                  >
                    {action.label}
                  </ContextMenuItem>
                </React.Fragment>
              ))}
            </ContextMenuContent>
          </ContextMenu>
        )}
      />
      <p className="text-muted-foreground text-sm">
        Right-click a row for the same actions as its ⋯ button.
      </p>
    </div>
  );
}
