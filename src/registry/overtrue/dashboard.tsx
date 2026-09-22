"use client";
import { useId, useState } from "react";
import {
  IconDownload as Download,
  IconChartAreaLine as ChartAreaLine,
  IconLayoutDashboard as LayoutDashboard,
  IconSettings as Settings,
  IconUsers as Users,
  IconActivity as Activity,
  IconChevronDown as ChevronDown,
  IconArrowUpRight as ArrowUpRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { MetricGroup, MetricGroupItem } from "./metric-group";
import { MetricChart } from "./metric-chart";
import { ActivityFeed } from "./activity-feed";
import { DataTable, type DataColumn } from "./data-table";
import { StatusBadge } from "./status-badge";
import { SettingsPanel } from "./settings-panel";
import { AvatarStack, type TeamMember } from "./avatar-stack";
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
export function Dashboard({
  compact = false,
  workspaceName = "Acme Studio",
  user = dashboardMembers[0],
}: {
  compact?: boolean;
  workspaceName?: string;
  user?: TeamMember;
}) {
  const periodId = useId();
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
    <div
      data-slot="dashboard"
      className="@container/dashboard overflow-hidden rounded-xl border border-border bg-muted/30 text-foreground shadow-sm [&_[data-slot=metric-chart]]:shadow-none"
    >
      <div className="flex items-center justify-between gap-4 border-b bg-card px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <LayoutDashboard
              aria-hidden="true"
              className="size-4"
              stroke={1.7}
            />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight">
              {workspaceName}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-muted-foreground sm:block">
            {user.name}
          </span>
          <AvatarStack members={[user]} />
        </div>
      </div>
      <div className="flex flex-col @min-[56rem]/dashboard:flex-row">
        <aside className="shrink-0 border-b bg-card/60 p-2.5 @min-[56rem]/dashboard:w-44 @min-[56rem]/dashboard:border-r @min-[56rem]/dashboard:border-b-0 @min-[56rem]/dashboard:p-3">
          <p className="hidden px-3 pt-3 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground @min-[56rem]/dashboard:block">
            Workspace
          </p>
          <nav
            aria-label="Dashboard"
            className="flex gap-1 overflow-auto @min-[56rem]/dashboard:flex-col"
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
                  "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  view === label
                    ? "bg-primary/8 text-primary"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 space-y-5 p-4 sm:p-6">
          {view !== "Analytics" && (
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{view}</h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {view === "Overview"
                    ? "A little perspective on your business."
                    : `Your workspace ${view.toLowerCase()}, in one place.`}
                </p>
              </div>
              {view === "Overview" && (
                <div className="flex items-center gap-2">
                  <label className="sr-only" htmlFor={periodId}>
                    Report period
                  </label>
                  <div className="relative">
                    <select
                      id={periodId}
                      value={period}
                      onChange={(event) => setPeriod(event.target.value)}
                      className="h-8 appearance-none rounded-md border border-border bg-card py-0 pl-3 pr-8 text-xs font-medium leading-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <option>12 months</option>
                      <option>6 months</option>
                    </select>
                    <ChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                      stroke={1.7}
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-border bg-card px-3 text-xs font-medium text-foreground shadow-none hover:bg-muted"
                    onClick={exportReport}
                  >
                    <Download
                      aria-hidden="true"
                      className="size-3.5"
                      stroke={1.7}
                    />
                    Export
                  </Button>
                </div>
              )}
            </header>
          )}
          {view === "Analytics" && (
            <AnalyticsOverview className="border-0 p-0 sm:p-0" />
          )}
          {view === "Overview" && (
            <>
              <MetricGroup className="grid-cols-3">
                {[
                  {
                    label: "Revenue",
                    value: period === "12 months" ? "$36,800" : "$24,600",
                    change: "12.8%",
                  },
                  { label: "Subscribers", value: "2,420", change: "8.2%" },
                  { label: "Conversion", value: "4.36%", change: "0.6%" },
                ].map((metric) => (
                  <MetricGroupItem
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    className="px-2 py-4 sm:px-5 sm:py-5 [&>p:first-child]:text-[11px] sm:[&>p:first-child]:text-xs"
                    context={
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-0.5 font-medium text-emerald-700 dark:text-emerald-400">
                          <ArrowUpRight aria-hidden="true" className="size-3" />
                          <span className="sr-only">Increase </span>
                          {metric.change}
                        </span>
                        <span className="hidden text-[11px] sm:inline">
                          vs. last month
                        </span>
                      </span>
                    }
                  />
                ))}
              </MetricGroup>
              <div className="grid gap-5 @min-[64rem]/dashboard:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
                <MetricChart
                  data={data}
                  height={compact ? 215 : 260}
                  description="Monthly revenue · USD"
                  valueFormatter={(value) =>
                    `$${value.toLocaleString("en-US")}`
                  }
                  axisFormatter={(value) =>
                    value === 0 ? "$0" : `$${value / 1000}k`
                  }
                />
                <ActivityFeed
                  items={dashboardActivity}
                  className="shadow-none"
                />
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
          {view === "Activity" && (
            <ActivityFeed items={dashboardActivity} className="shadow-none" />
          )}
          {view === "Settings" && (
            <SettingsPanel
              initialName={workspaceName}
              initialEmail="team@example.com"
            />
          )}
        </div>
      </div>
    </div>
  );
}
