import { useMemo, useState } from "react";
import {
  IconAlertTriangle,
  IconCode,
  IconCreditCard,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { TreeView, type TreeNode } from "@/registry/overtrue/tree-view";

// Permissions for a fictional "Support lead" role.
const sensitive = new Set(["customers.export", "customers.delete", "workspace.members.roles"]);

const permissions: TreeNode[] = [
  {
    id: "billing",
    label: "Billing",
    icon: <IconCreditCard />,
    children: [
      { id: "billing.invoices", label: "View invoices" },
      { id: "billing.refunds", label: "Issue refunds" },
      { id: "billing.plan", label: "Change plan" },
      { id: "billing.payment", label: "Manage payment methods", disabled: true, badge: "Owner only" },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    icon: <IconUsers />,
    children: [
      { id: "customers.view", label: "View profiles" },
      { id: "customers.edit", label: "Edit profiles" },
      { id: "customers.export", label: "Export customer data" },
      { id: "customers.delete", label: "Delete customers" },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    icon: <IconSettings />,
    children: [
      {
        id: "workspace.members",
        label: "Members",
        children: [
          { id: "workspace.members.invite", label: "Invite members" },
          { id: "workspace.members.remove", label: "Remove members" },
          { id: "workspace.members.roles", label: "Change roles" },
        ],
      },
      {
        id: "workspace.settings",
        label: "Settings",
        children: [
          { id: "workspace.settings.edit", label: "Edit workspace settings" },
          { id: "workspace.settings.integrations", label: "Manage integrations" },
        ],
      },
    ],
  },
  {
    id: "developer",
    label: "Developer",
    icon: <IconCode />,
    children: [
      { id: "developer.keys", label: "Create API keys" },
      { id: "developer.webhooks", label: "Manage webhooks" },
      { id: "developer.logs", label: "Read request logs" },
    ],
  },
];

const leavesOf = (node: TreeNode): TreeNode[] =>
  node.children?.length ? node.children.flatMap(leavesOf) : [node];

export default function Demo() {
  const [checked, setChecked] = useState<string[]>([
    "billing.invoices",
    "billing.refunds",
    "customers",
    "customers.view",
    "customers.edit",
    "customers.export",
    "customers.delete",
    "workspace.members.invite",
    "developer.logs",
  ]);
  const granted = useMemo(() => new Set(checked), [checked]);
  const groups = permissions.map((group) => {
    const leaves = leavesOf(group).filter((leaf) => !leaf.disabled);
    return { group, total: leaves.length, on: leaves.filter((leaf) => granted.has(leaf.id)).length };
  });
  const total = groups.reduce((sum, item) => sum + item.total, 0);
  const on = groups.reduce((sum, item) => sum + item.on, 0);
  const risky = permissions
    .flatMap(leavesOf)
    .filter((leaf) => sensitive.has(leaf.id) && granted.has(leaf.id));

  // Parents show how much of their group is granted.
  const nodes = useMemo(
    () =>
      permissions.map(function withCount(node): TreeNode {
        if (!node.children) return node;
        const leaves = leavesOf(node).filter((leaf) => !leaf.disabled);
        const count = leaves.filter((leaf) => granted.has(leaf.id)).length;
        return { ...node, badge: `${count}/${leaves.length}`, children: node.children.map(withCount) };
      }),
    [granted],
  );

  return (
    <div className="@container overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <div className="grid @xl:grid-cols-[minmax(0,1fr)_224px]">
        <div className="min-w-0">
          <div className="px-4 pt-3.5 pb-2">
            <p className="text-sm leading-6 font-semibold tracking-tight">Support lead</p>
            <p className="text-[13px] leading-5 text-muted-foreground">Choose what this role can do.</p>
          </div>
          <div className="px-1.5 pb-1.5">
            <TreeView
              aria-label="Support lead permissions"
              nodes={nodes}
              checkable
              selectionMode="none"
              checked={checked}
              onCheckedChange={setChecked}
              defaultExpanded={["billing", "customers", "workspace", "workspace.members"]}
            />
          </div>
        </div>
        <div className="border-t border-border/60 bg-muted/25 px-4 py-4 @xl:border-t-0 @xl:border-l">
          <p className="text-xs text-muted-foreground">Granted</p>
          <p className="mt-0.5 text-xl font-semibold tracking-[-0.02em] tabular-nums">
            {on}
            <span className="ml-1 text-sm font-medium text-muted-foreground">of {total}</span>
          </p>
          <ul className="mt-4 space-y-3">
            {groups.map(({ group, on: count, total: size }) => (
              <li key={group.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground">{group.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {count}/{size}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                    style={{ width: `${size ? (count / size) * 100 : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div aria-live="polite" className="mt-4">
            {risky.length ? (
              <p className="flex gap-1.5 text-xs leading-[18px] text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-px size-3.5 shrink-0" stroke={1.75} aria-hidden="true" />
                <span>Sensitive: {risky.map((leaf) => leaf.label.toLowerCase()).join(", ")}.</span>
              </p>
            ) : (
              <p className="text-xs leading-[18px] text-emerald-700 dark:text-emerald-400">No sensitive access granted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
