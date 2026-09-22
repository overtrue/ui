"use client";
import { useState } from "react";
import {
  IconDownload as Download,
  IconChartAreaLine as ChartAreaLine,
  IconLayoutDashboard as LayoutDashboard,
  IconSettings as Settings,
  IconUsers as Users,
  IconActivity as Activity,
  IconChevronDown as ChevronDown,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "./stat-card";
import { PageHeader } from "./page-header";
import { MetricChart } from "./metric-chart";
import { ActivityFeed } from "./activity-feed";
import { DataTable, type DataColumn } from "./data-table";
import { StatusBadge } from "./status-badge";
import { SettingsPanel } from "./settings-panel";
import { AvatarStack } from "./avatar-stack";
import { cn } from "@/lib/utils";
import { AnalyticsOverview } from "./analytics-overview";

export const dashboardActivity = [
  {
    id: "1",
    initials: "MO",
    content: (
      <>
        <strong className="font-medium">Maya Okafor</strong> deployed a new
        release.
      </>
    ),
    time: "12 minutes ago",
  },
  {
    id: "2",
    initials: "LN",
    content: (
      <>
        <strong className="font-medium">Leo Nakamura</strong> invited two
        teammates.
      </>
    ),
    time: "48 minutes ago",
  },
  {
    id: "3",
    initials: "ID",
    content: (
      <>
        <strong className="font-medium">Ines Duarte</strong> upgraded to Pro.
      </>
    ),
    time: "2 hours ago",
  },
];
export const dashboardRevenue = [
  12, 18, 15, 24, 21, 32, 29, 38, 34, 46, 43, 56,
].map((value, index) => ({
  label: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][index],
  value: value * 100,
}));
export const dashboardMembers = [
  "Maya Okafor",
  "Leo Nakamura",
  "Ines Duarte",
  "Samir Haddad",
  "June Park",
  "Alina Petrova",
  "Nora Jensen",
].map((name, index) => ({
  id: String(index),
  name,
  email: name.toLowerCase().replace(" ", ".") + "@example.com",
  role: index === 0 ? "Owner" : "Member",
  status: index === 4 ? "Invited" : "Active",
}));
type Member = (typeof dashboardMembers)[number];
const columns: DataColumn<Member>[] = [
  {
    key: "name",
    label: "Member",
    value: (row) => row.name,
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <AvatarStack members={[row]} />
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      </div>
    ),
  },
  { key: "role", label: "Role", value: (row) => row.role, sortable: true },
  {
    key: "status",
    label: "Status",
    value: (row) => row.status,
    render: (row) => (
      <StatusBadge variant={row.status === "Active" ? "success" : "warning"}>
        {row.status}
      </StatusBadge>
    ),
  },
];
export function Dashboard({ compact = false }: { compact?: boolean }) {
  const [view, setView] = useState("Overview");
  const [period, setPeriod] = useState("12 months");
  const data =
    period === "6 months" ? dashboardRevenue.slice(6) : dashboardRevenue;
  function exportReport() {
    const blob = new Blob(
      [
        "Month,Revenue\n" +
          data.map((point) => `${point.label},${point.value}`).join("\n"),
      ],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob),
      link = document.createElement("a");
    link.href = url;
    link.download = "revenue-report.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-background text-foreground shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b bg-card px-5 py-3.5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-6 items-center justify-center rounded-md bg-foreground text-background">
            <LayoutDashboard className="size-3.5" />
          </span>
          Acme Studio
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:block">
            Your workspace, at a glance.
          </span>
          <AvatarStack members={dashboardMembers.slice(0, 1)} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <aside className="shrink-0 border-b bg-card p-3 md:w-44 md:border-r md:border-b-0">
          <p className="hidden px-3 pt-3 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground md:block">
            Workspace
          </p>
          <nav
            aria-label="Dashboard"
            className="flex gap-1 overflow-auto md:flex-col"
          >
            {[
              { label: "Overview", icon: LayoutDashboard },
              { label: "Analytics", icon: ChartAreaLine },
              { label: "Members", icon: Users },
              { label: "Activity", icon: Activity },
              { label: "Settings", icon: Settings },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                aria-current={view === label ? "page" : undefined}
                onClick={() => setView(label)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-medium transition-colors",
                  view === label
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 space-y-5 p-5 md:p-6">
          {view !== "Analytics" && (
            <PageHeader
              eyebrow="Workspace"
              title={view === "Overview" ? "Overview" : view}
              actions={
                view === "Overview" && (
                  <>
                    <label
                      className="sr-only"
                      htmlFor={compact ? "hero-period" : "dashboard-period"}
                    >
                      Report period
                    </label>
                    <select
                      id={compact ? "hero-period" : "dashboard-period"}
                      value={period}
                      onChange={(event) => setPeriod(event.target.value)}
                      className="h-8 rounded-md border bg-card px-2 text-xs"
                    >
                      <option>12 months</option>
                      <option>6 months</option>
                    </select>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border bg-card text-foreground hover:bg-muted"
                      onClick={exportReport}
                    >
                      <Download className="size-3.5" />
                      Export
                    </Button>
                  </>
                )
              }
            />
          )}
          {view === "Analytics" && (
            <AnalyticsOverview className="border-0 p-0 sm:p-0" />
          )}
          {view === "Overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  title="Total revenue"
                  value={period === "12 months" ? "$36,800" : "$24,600"}
                  change="12.8%"
                  trend="up"
                />
                <StatCard
                  title="Active subscribers"
                  value="2,420"
                  change="8.2%"
                  trend="up"
                />
                <StatCard
                  title="Conversion rate"
                  value="4.36%"
                  change="0.6%"
                  trend="up"
                />
              </div>
              <div className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
                <MetricChart data={data} height={compact ? 190 : 240} />
                <ActivityFeed items={dashboardActivity} />
              </div>
              {!compact && (
                <DataTable
                  title="Team members"
                  rows={dashboardMembers}
                  columns={columns}
                  getRowId={(row) => row.id}
                />
              )}
            </>
          )}
          {view === "Members" && (
            <DataTable
              title="Team members"
              rows={dashboardMembers}
              columns={columns}
              getRowId={(row) => row.id}
            />
          )}
          {view === "Activity" && <ActivityFeed items={dashboardActivity} />}
          {view === "Settings" && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}
