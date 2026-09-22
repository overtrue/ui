/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import {
  IconBell as Bell,
  IconCreditCard as CreditCard,
  IconUser as UserRound,
  IconUsers as UsersRound,
} from "@tabler/icons-react";

import {
  CommandPalette,
  CommandPaletteShortcutKeys,
  type CommandPaletteGroup,
} from "@/registry/overtrue/command-palette";

const groups: CommandPaletteGroup[] = [
  {
    heading: "Preferences",
    items: [
      {
        id: "profile",
        label: "Your profile",
        icon: <UserRound />,
        shortcut: <CommandPaletteShortcutKeys keys={["P"]} />,
      },
      {
        id: "team",
        label: "Studio members",
        icon: <UsersRound />,
        shortcut: <CommandPaletteShortcutKeys keys={["T"]} />,
      },
      {
        id: "billing",
        label: "Billing",
        icon: <CreditCard />,
        shortcut: <CommandPaletteShortcutKeys keys={["B"]} />,
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: <Bell />,
        shortcut: <CommandPaletteShortcutKeys keys={["N"]} />,
      },
    ],
  },
];

export default function CommandPaletteCompactDemo() {
  return (
    <CommandPalette
      variant="inline"
      density="compact"
      groups={groups}
      className="w-full max-w-sm"
      placeholder="Find a preference…"
      footer={null}
    />
  );
}
