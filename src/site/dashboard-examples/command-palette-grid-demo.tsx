/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import {
  IconCalendar as CalendarDays,
  IconChartLine as ChartNoAxesCombined,
  IconFileText as FileText,
  IconInbox as Inbox,
  IconSettings as Settings,
  IconUsers as Users,
} from "@tabler/icons-react";

import {
  CommandPalette,
  type CommandPaletteGroup,
} from "@/registry/overtrue/command-palette";

const groups: CommandPaletteGroup[] = [
  {
    heading: "Acme Studio",
    items: [
      {
        id: "inbox",
        label: "Inbox",
        description: "5 conversations",
        icon: <Inbox />,
      },
      {
        id: "calendar",
        label: "Calendar",
        description: "2 reviews today",
        icon: <CalendarDays />,
      },
      {
        id: "customers",
        label: "Clients",
        description: "12 active relationships",
        icon: <Users />,
      },
      {
        id: "reports",
        label: "Delivery reports",
        description: "Delivery and capacity",
        icon: <ChartNoAxesCombined />,
      },
      {
        id: "documents",
        label: "Documents",
        description: "Briefs and approved assets",
        icon: <FileText />,
      },
      {
        id: "settings",
        label: "Preferences",
        description: "Workspace preferences",
        icon: <Settings />,
      },
    ],
  },
];

export default function CommandPaletteGridDemo() {
  return (
    <CommandPalette
      variant="inline"
      layout="grid"
      groups={groups}
      className="w-full max-w-2xl"
      placeholder="Find a workspace tool…"
      footer={
        <>
          <span> Studio shortcuts </span>
          <span> 6 destinations </span>
        </>
      }
    />
  );
}
