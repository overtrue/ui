import { useState } from "react";
import {
  IconBrandGithub,
  IconBrandSlack,
  IconBrandNotion,
} from "@tabler/icons-react";
import {
  IntegrationList,
  type Integration,
} from "@/registry/overtrue/integration-list";
import { TeamAccess, type AccessMember } from "@/registry/overtrue/team-access";
import { NotificationPreferences } from "@/registry/overtrue/notification-preferences";
import { InvoiceList } from "@/registry/overtrue/invoice-list";
import type { ItemName } from "./catalog";
import { siteOwner } from "./demo-data";

export function BusinessExample({ name }: { name: ItemName }) {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "github",
      name: "GitHub",
      description: "Bring pull requests and commits into your projects.",
      icon: <IconBrandGithub />,
      connected: true,
      account: "overtrue/ui",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Send project updates to your team’s channels.",
      icon: <IconBrandSlack />,
      connected: false,
    },
    {
      id: "notion",
      name: "Notion",
      description: "Keep project notes close to the work they support.",
      icon: <IconBrandNotion />,
      connected: false,
    },
  ]);
  const [members, setMembers] = useState<AccessMember[]>([
    {
      id: "chris",
      name: "Chris An",
      image: siteOwner.image,
      email: "chris@example.com",
      role: "Owner",
    },
    {
      id: "maya",
      name: "Maya Okafor",
      email: "maya@example.com",
      role: "Admin",
    },
    {
      id: "leo",
      name: "Leo Nakamura",
      email: "leo@example.com",
      role: "Member",
    },
  ]);
  const [status, setStatus] = useState("");
  switch (name) {
    case "integration-list":
      return (
        <div className="w-full">
          <IntegrationList
            integrations={integrations}
            onConnectionChange={(id, connected) => {
              setIntegrations((current) =>
                current.map((item) =>
                  item.id === id ? { ...item, connected } : item,
                ),
              );
            }}
          />
          <p className="m-0 mt-3 text-xs leading-5 text-muted-foreground">
            Interactive demo. No external accounts are connected.
          </p>
        </div>
      );
    case "team-access":
      return (
        <div className="w-full">
          <TeamAccess
            members={members}
            onRoleChange={async (id, role) => {
              setStatus("");
              await new Promise((resolve) => setTimeout(resolve, 600));
              setMembers((current) =>
                current.map((member) =>
                  member.id === id ? { ...member, role } : member,
                ),
              );
              setStatus("Role updated in this demo.");
            }}
          />
          <p
            role="status"
            className="m-0 mt-3 min-h-5 text-xs text-muted-foreground"
          >
            {status ||
              "Interactive demo. Changes are saved locally in this preview."}
          </p>
        </div>
      );
    case "notification-preferences":
      return <NotificationPreferences />;
    case "invoice-list":
      return (
        <InvoiceList
          invoices={[
            {
              id: "INV-2026-009",
              description: "Studio plan",
              date: "Sep 1, 2026",
              amount: "$128.00",
              status: "Open",
            },
            {
              id: "INV-2026-008",
              description: "Studio plan",
              date: "Aug 1, 2026",
              amount: "$128.00",
              status: "Paid",
            },
            {
              id: "INV-2026-007",
              description: "Studio plan + usage",
              date: "Jul 1, 2026",
              amount: "$146.80",
              status: "Paid",
            },
          ]}
        />
      );
    default:
      return null;
  }
}
