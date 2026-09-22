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

export default function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false);
  useCommandPaletteShortcut(setOpen);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Search />
        Find a page or action{" "}
        <span className="ml-3 flex gap-1">
          <CommandPaletteKbd>⌘</CommandPaletteKbd>
          <CommandPaletteKbd>K</CommandPaletteKbd>
        </span>
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        onSelect={() => setOpen(false)}
        footer={
          <>
            <span>Navigate with ↑↓</span>
            <span>overtrue/ui</span>
          </>
        }
      />
    </>
  );
}
