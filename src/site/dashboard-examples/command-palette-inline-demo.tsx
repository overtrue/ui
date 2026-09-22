/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import {
  IconFileText as FileText,
  IconLayoutDashboard as LayoutDashboard,
  IconPlus as Plus,
  IconUsers as Users,
} from "@tabler/icons-react";

import {
  CommandPalette,
  type CommandPaletteGroup,
} from "@/registry/overtrue/command-palette";

const groups: CommandPaletteGroup[] = [
  {
    heading: "Suggested",
    items: [
      {
        id: "overview",
        label: "Studio overview",
        description: "Booked work and delivery",
        icon: <LayoutDashboard />,
      },
      {
        id: "customers",
        label: "Clients",
        description: "Relationships and open projects",
        icon: <Users />,
      },
      {
        id: "reports",
        label: "Delivery reports",
        description: "Milestones, capacity, and progress",
        icon: <FileText />,
      },
      {
        id: "new",
        label: "Add a client",
        description: "Start a client relationship",
        icon: <Plus />,
      },
    ],
  },
];

export default function CommandPaletteInlineDemo() {
  return (
    <CommandPalette
      variant="inline"
      groups={groups}
      className="w-full max-w-xl"
      placeholder="Find a project or client…"
      footer={
        <>
          <span> 4 shortcuts </span>
          <span> Search pages and actions </span>
        </>
      }
    />
  );
}
