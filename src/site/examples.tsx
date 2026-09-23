import { BusinessExample } from "./business-examples";
import { ReusableExample } from "./reusable-examples";
import { DashboardExample } from "./dashboard-examples";
import { dashboardCatalog } from "./dashboard-catalog";
import { CompositionExample } from "./composition-examples";
import { AnalyticsExample } from "./analytics-examples";
import { useState } from "react";
import {
  IconPlus as Plus,
  IconArrowRight as ArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/registry/overtrue/stat-card";
import { StatusBadge } from "@/registry/overtrue/status-badge";
import { MetricChart } from "@/registry/overtrue/metric-chart";
import { DataTable } from "@/registry/overtrue/data-table";
import { ActivityFeed } from "@/registry/overtrue/activity-feed";
import { StorageMeter } from "@/registry/overtrue/storage-meter";
import { AvatarStack } from "@/registry/overtrue/avatar-stack";
import { PageHeader } from "@/registry/overtrue/page-header";
import { EmptyState } from "@/registry/overtrue/empty-state";
import { Steps } from "@/registry/overtrue/steps";
import { PricingCard } from "@/registry/overtrue/pricing-card";
import { SettingsPanel } from "@/registry/overtrue/settings-panel";
import {
  Dashboard,
  dashboardActivity,
  dashboardRevenue,
  dashboardMembers,
} from "@/registry/overtrue/dashboard";
import type { ItemName } from "./catalog";
export function Example({
  name,
  expanded = false,
}: {
  name: ItemName;
  expanded?: boolean;
}) {
  const [step, setStep] = useState(1);
  const [created, setCreated] = useState(false);
  const [chosen, setChosen] = useState(false);
  if (dashboardCatalog.some((item) => item.name === name))
    return <DashboardExample name={name} expanded={expanded} />;
  switch (name) {
    case "stat-card":
      return (
        <div className={expanded ? "grid gap-4 sm:grid-cols-2" : ""}>
          <StatCard
            title="Total revenue"
            value="$36,800"
            change="12.8%"
            trend="up"
            sparkline={[18, 21, 19, 26, 24, 32, 36.8]}
          />
          {expanded && (
            <>
              <StatCard
                title="Response time"
                value="124 ms"
                change="18.4%"
                trend="down"
                positiveTrend="down"
                sparkline={[180, 162, 170, 148, 136, 124]}
                description="Lower is better"
              />
              <StatCard
                title="Failed requests"
                value="28"
                change="7.7%"
                trend="up"
                positiveTrend="down"
                sparkline={[14, 18, 16, 22, 25, 28]}
                description="Needs investigation"
              />
              <StatCard
                title="Open reviews"
                value="12"
                change="0%"
                trend="neutral"
                description="Unchanged this week"
              />
            </>
          )}
        </div>
      );
    case "metric-chart":
      return (
        <MetricChart
          data={dashboardRevenue.map((point, index) => ({
            ...point,
            previous: [
              1000, 1600, 1800, 1900, 2200, 2600, 3000, 2900, 3200, 3600, 4100,
              4400,
            ][index],
          }))}
          valueFormatter={(value) => `$${value.toLocaleString("en-US")}`}
          height={200}
        />
      );
    case "data-table":
      return (
        <DataTable
          title="Team members"
          rows={dashboardMembers}
          getRowId={(row) => row.id}
          columns={[
            {
              key: "name",
              label: "Name",
              value: (row) => row.name,
              sortable: true,
            },
            {
              key: "role",
              label: "Role",
              value: (row) => row.role,
              sortable: true,
            },
            {
              key: "status",
              label: "Status",
              value: (row) => row.status,
              render: (row) => (
                <StatusBadge
                  variant={row.status === "Active" ? "success" : "warning"}
                >
                  {row.status}
                </StatusBadge>
              ),
            },
          ]}
        />
      );
    case "activity-feed":
      return <ActivityFeed items={dashboardActivity} />;
    case "status-badge":
      return (
        <div className="flex flex-wrap items-center justify-center gap-3 py-10">
          <StatusBadge variant="success">Active</StatusBadge>
          <StatusBadge variant="warning">Pending</StatusBadge>
          <StatusBadge variant="error">Failed</StatusBadge>
          <StatusBadge variant="info">In progress</StatusBadge>
          <StatusBadge>Archived</StatusBadge>
        </div>
      );
    case "storage-meter":
      return (
        <StorageMeter
          capacity={100}
          segments={[
            { label: "Documents", value: 24.5, color: "var(--color-primary)" },
            { label: "Images", value: 18.2, color: "#74a7ee" },
            { label: "Other", value: 8.4, color: "#b8d2f5" },
          ]}
        />
      );
    case "avatar-stack":
      return (
        <div className="flex flex-col items-center gap-4 py-10">
          <AvatarStack
            members={[
              {
                id: "overtrue",
                name: "Chris An (@overtrue)",
                image: "/assets/overtrue/people/overtrue.png",
              },
              ...dashboardMembers,
            ]}
          />
          <p className="text-xs text-muted-foreground">
            Chris An (@overtrue) and the team.
          </p>
        </div>
      );
    case "page-header":
      return (
        <PageHeader
          eyebrow="Workspace"
          title="Team members"
          description="The people behind your next big thing."
          actions={
            <Button onClick={() => setCreated(true)}>
              <Plus />
              {created ? "Invitation created" : "Invite member"}
            </Button>
          }
        />
      );
    case "empty-state":
      return (
        <EmptyState
          title={created ? "Your first project is ready." : "No projects yet"}
          description={
            created
              ? "This is a local demo. Connect your own project creation handler."
              : undefined
          }
          action={
            <Button onClick={() => setCreated(!created)}>
              <Plus />
              {created ? "Reset demo" : "Create project"}
            </Button>
          }
        />
      );
    case "steps":
      return (
        <div className="space-y-8 py-8">
          <Steps
            steps={["Account", "Workspace", "Invite team"]}
            current={step}
          />
          <Button
            variant="outline"
            className="border-border bg-card text-foreground hover:bg-muted"
            size="sm"
            onClick={() => setStep((step + 1) % 3)}
          >
            Next step
            <ArrowRight />
          </Button>
        </div>
      );
    case "pricing-card":
      return (
        <PricingCard
          name="Pro"
          price="$29"
          description="A little more room to grow."
          features={[
            "Unlimited projects",
            "Advanced analytics",
            "Priority support",
          ]}
          highlighted
          action={
            <Button className="w-full" onClick={() => setChosen(!chosen)}>
              {chosen ? "Selected · demo only" : "Choose Pro"}
            </Button>
          }
        />
      );
    case "team-access":
    case "notification-preferences":
    case "invoice-list":
    case "integration-list":
      return <BusinessExample name={name} />;
    case "settings-panel":
      return <SettingsPanel />;
    case "dashboard":
      return <Dashboard />;
    case "sparkline":
    case "ranked-list":
    case "conversion-funnel":
    case "analytics-overview":
      return <AnalyticsExample name={name} expanded={expanded} />;
    case "section-card":
    case "ribbon-card":
    case "status-edge-card":
    case "search-field":
    case "filter-tabs":
    case "chart-legend":
    case "timeline":
    case "task-list":
    case "file-list":
    case "member-card":
      return <ReusableExample name={name} expanded={expanded} />;
    default:
      return <CompositionExample name={name} />;
  }
}
