/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import * as React from "react";
import {
  IconFileText as FileText,
  IconLayoutDashboard as LayoutDashboard,
  IconMoon as Moon,
  IconPlus as Plus,
  IconSearch as Search,
  IconSettings as Settings,
  IconUsers as Users,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  CommandPalette,
  CommandPaletteKbd,
  CommandPaletteShortcutKeys,
  type CommandPaletteGroup,
  useCommandPaletteShortcut,
} from "@/registry/overtrue/command-palette";

const groups: CommandPaletteGroup[] = [
  {
    heading: "Your workspace",
    items: [
      {
        id: "overview",
        label: "Studio overview",
        description: "Booked work and delivery",
        icon: <LayoutDashboard />,
        shortcut: (
          <CommandPaletteShortcutKeys
            keys={["G", "O"]}
            label="Press G then O"
          />
        ),
      },
      {
        id: "customers",
        label: "Clients",
        description: "Relationships and open projects",
        icon: <Users />,
        shortcut: (
          <CommandPaletteShortcutKeys
            keys={["G", "C"]}
            label="Press G then C"
          />
        ),
      },
      {
        id: "reports",
        label: "Delivery reports",
        description: "Milestones, capacity, and progress",
        icon: <FileText />,
      },
    ],
  },
  {
    heading: "Start something",
    items: [
      {
        id: "new",
        label: "Add a client",
        icon: <Plus />,
        shortcut: <CommandPaletteShortcutKeys keys={["C"]} label="Press C" />,
      },
      { id: "theme", label: "Switch appearance", icon: <Moon /> },
      { id: "settings", label: "Open settings", icon: <Settings /> },
    ],
  },
];

export default function CommandPaletteDemo({
  enableShortcut = true,
}: {
  enableShortcut?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [last, setLast] = React.useState<string>();
  useCommandPaletteShortcut(setOpen, enableShortcut);

  return (
    <div className="flex w-full flex-col items-center gap-4 py-8">
      <div className="relative w-full max-w-sm">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 -bottom-3 h-8 rounded-full bg-primary/20 blur-2xl"
        />
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="relative h-11 w-full justify-start gap-2.5 rounded-xl border-border/70 bg-card px-3.5 text-sm font-normal text-muted-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.14)] hover:bg-card hover:text-foreground dark:border-border/70 dark:bg-card dark:hover:bg-card dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
        >
          <Search className="size-4" />
          Find a page or action{" "}
          <span className="ms-auto flex gap-1">
            <CommandPaletteKbd>⌘</CommandPaletteKbd>
            <CommandPaletteKbd>K</CommandPaletteKbd>
          </span>
        </Button>
      </div>
      <div className="flex max-w-sm flex-wrap items-center justify-center gap-1.5">
        <span className="me-0.5 text-xs text-muted-foreground">Recent</span>
        {groups[0].items.slice(0, 2).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLast(item.label)}
            className="inline-flex h-6 items-center gap-1.5 rounded-full bg-muted/60 px-2.5 text-xs text-muted-foreground ring-1 ring-border/60 transition-colors duration-150 ring-inset hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none [&>svg]:size-3"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
      <p role="status" className="text-xs text-muted-foreground">
        {last ? `Opened ${last}` : "Press ⌘K anywhere on this page"}
      </p>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        onSelect={(item) => {
          setLast(item.label);
          setOpen(false);
        }}
      />
    </div>
  );
}
