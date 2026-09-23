/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  IconAdjustments,
  IconCopy,
  IconDots,
  IconTrash,
} from "@tabler/icons-react";

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
} from "@/registry/overtrue/advanced-data-table";

type KeyRow = {
  id: string;
  name: string;
  scope: "read" | "write" | "admin";
  lastUsed: string;
};
type Action = "copy" | "edit" | "revoke";

const keys: KeyRow[] = [
  {
    id: "demo_portal",
    name: "Client portal",
    scope: "admin",
    lastUsed: "2 minutes ago",
  },
  {
    id: "demo_review",
    name: "Review workspace",
    scope: "write",
    lastUsed: "1 hour ago",
  },
  {
    id: "demo_export",
    name: "Delivery report export",
    scope: "read",
    lastUsed: "Yesterday",
  },
  {
    id: "demo_publish",
    name: "Asset publishing",
    scope: "write",
    lastUsed: "3 days ago",
  },
  {
    id: "demo_partner",
    name: "Partner review space",
    scope: "read",
    lastUsed: "2 weeks ago",
  },
  {
    id: "demo_notifications",
    name: "Review notifications",
    scope: "read",
    lastUsed: "Never",
  },
];
const actions = [
  { id: "copy", label: "Copy key ID", icon: IconCopy },
  { id: "edit", label: "Edit scope", icon: IconAdjustments },
  { id: "revoke", label: "Revoke access", icon: IconTrash },
] as const;
const scopes = [
  {
    value: "read",
    label: "Read only",
    description: "View records without making changes.",
  },
  {
    value: "write",
    label: "Read and write",
    description: "View, create, and update records.",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage records, members, and workspace settings.",
  },
] as const;
const helper = createDataTableColumnHelper<KeyRow>();

function ActionItems({
  context = false,
  onAction,
}: {
  context?: boolean;
  onAction: (action: Action) => void;
}) {
  const Item = context ? ContextMenuItem : DropdownMenuItem;
  const Separator = context ? ContextMenuSeparator : DropdownMenuSeparator;
  return actions.map(({ id, label, icon: Icon }) => (
    <React.Fragment key={id}>
      {id === "revoke" && <Separator />}
      <Item
        variant={id === "revoke" ? "destructive" : "default"}
        onSelect={() => onAction(id)}
      >
        <Icon aria-hidden="true" />
        {label}
      </Item>
    </React.Fragment>
  ));
}

export default function DataTableRowActionsDemo() {
  const [rows, setRows] = React.useState(keys);
  const [selected, setSelected] = React.useState<{
    action: "edit" | "revoke";
    row: KeyRow;
  } | null>(null);
  const [scope, setScope] = React.useState<KeyRow["scope"]>("read");
  const [message, setMessage] = React.useState("");
  const container = React.useRef<HTMLDivElement>(null);
  const returnFocus = React.useRef<HTMLElement | null>(null);
  const cancel = React.useRef<HTMLButtonElement>(null);
  const dialogOpen = React.useRef(false);
  const scopeName = React.useId();

  const onAction = React.useCallback(async (action: Action, row: KeyRow) => {
    setMessage("");
    if (action === "copy") {
      try {
        await navigator.clipboard.writeText(row.id);
        setMessage(`Copied the demo key ID for ${row.name}.`);
      } catch {
        setMessage(`Copy unavailable. Key ID: ${row.id}`);
      }
      return;
    }
    returnFocus.current =
      container.current?.querySelector(`[data-key-id="${row.id}"]`) ?? null;
    dialogOpen.current = true;
    setScope(row.scope);
    setSelected({ action, row });
  }, []);
  const keepDialogFocus = React.useCallback((event: Event) => {
    if (dialogOpen.current) event.preventDefault();
  }, []);
  const columns = React.useMemo(
    () =>
      helper.columns([
        helper.accessor("name", {
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Key" />
          ),
          cell: ({ row }) => (
            <span className="font-medium">{row.original.name}</span>
          ),
        }),
        helper.accessor("scope", {
          header: "Scope",
          cell: ({ row }) => (
            <Badge
              variant={row.original.scope === "admin" ? "secondary" : "outline"}
            >
              {row.original.scope}
            </Badge>
          ),
        }),
        helper.accessor("lastUsed", {
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last used" />
          ),
          cell: ({ row }) => (
            <span className="text-muted-foreground">
              {row.original.lastUsed}
            </span>
          ),
        }),
        helper.display({
          id: "actions",
          size: 48,
          enableHiding: false,
          header: () => <span className="sr-only">Actions</span>,
          cell: ({ row }) => (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    data-key-id={row.original.id}
                    aria-label={`Open menu for ${row.original.name}`}
                  >
                    <IconDots aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-44"
                  onCloseAutoFocus={keepDialogFocus}
                >
                  <ActionItems
                    onAction={(action) => void onAction(action, row.original)}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        }),
      ]),
    [onAction, keepDialogFocus],
  );

  return (
    <div ref={container} className="flex w-full flex-col gap-3">
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        searchKey="name"
        searchPlaceholder="Search integration access…"
        searchLabel="Search integration access"
        pageSize={0}
        showPagination={false}
        renderRow={(row, element) => (
          <ContextMenu>
            <ContextMenuTrigger asChild>{element}</ContextMenuTrigger>
            <ContextMenuContent
              className="w-44"
              onCloseAutoFocus={keepDialogFocus}
            >
              <ActionItems
                context
                onAction={(action) => void onAction(action, row.original)}
              />
            </ContextMenuContent>
          </ContextMenu>
        )}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs leading-5 text-muted-foreground">
          Demo data only. Use the row menu or right-click a record.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() => {
            setRows(keys);
            setMessage("Demo records restored.");
          }}
        >
          Reset demo
        </Button>
      </div>
      <p
        role="status"
        className="m-0 min-h-5 break-words text-xs leading-5 text-muted-foreground"
      >
        {message}
      </p>
      <Dialog.Root
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl outline-none max-h-[calc(100dvh-2rem)] overflow-y-auto"
            onOpenAutoFocus={(event) => {
              if (selected?.action === "revoke") {
                event.preventDefault();
                cancel.current?.focus();
              }
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              dialogOpen.current = false;
              const target = returnFocus.current?.isConnected
                ? returnFocus.current
                : container.current?.querySelector<HTMLInputElement>(
                    'input[type="search"]',
                  );
              target?.focus({ preventScroll: true });
            }}
          >
            <Dialog.Title className="m-0 text-lg font-semibold tracking-tight">
              {selected?.action === "edit"
                ? "Edit access scope"
                : "Revoke access?"}
            </Dialog.Title>
            <Dialog.Description className="m-0 mt-2 text-sm leading-6 text-muted-foreground">
              {selected?.action === "edit"
                ? `Choose what ${selected.row.name} can do in this demo workspace.`
                : `${selected?.row.name} will be removed from this demo. You can restore it with Reset demo.`}
            </Dialog.Description>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!selected) return;
                if (selected.action === "edit") {
                  setRows((current) =>
                    current.map((row) =>
                      row.id === selected.row.id ? { ...row, scope } : row,
                    ),
                  );
                  setMessage(
                    `${selected.row.name} now has ${scope} access in this demo.`,
                  );
                } else {
                  setRows((current) =>
                    current.filter((row) => row.id !== selected.row.id),
                  );
                  setMessage(`Revoked demo access for ${selected.row.name}.`);
                }
                setSelected(null);
              }}
            >
              {selected?.action === "edit" && (
                <fieldset className="m-0 mt-5 grid gap-2 border-0 p-0">
                  <legend className="sr-only">Access scope</legend>
                  {scopes.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring"
                    >
                      <input
                        type="radio"
                        name={scopeName}
                        value={option.value}
                        checked={scope === option.value}
                        onChange={() => setScope(option.value)}
                        className="mt-1 size-4 shrink-0 accent-primary"
                      />
                      <span className="grid gap-1">
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        <span className="text-xs leading-5 text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </fieldset>
              )}
              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <Dialog.Close asChild>
                  <Button
                    ref={cancel}
                    type="button"
                    variant="outline"
                    className="shadow-none"
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  type="submit"
                  variant={
                    selected?.action === "revoke" ? "destructive" : "default"
                  }
                  disabled={
                    selected?.action === "edit" && scope === selected.row.scope
                  }
                  className="shadow-none"
                >
                  {selected?.action === "edit"
                    ? "Save changes"
                    : "Revoke access"}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
