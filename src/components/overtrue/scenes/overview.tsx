import {
  CartesianGrid,
  ComposedChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ServiceStatus } from "@/registry/overtrue/service-status";
import { useSimulatedTelemetry } from "@/registry/overtrue/realtime-monitor";
import { TaskChecklist } from "@/registry/overtrue/task-checklist";
import { LiveChart } from "@/registry/overtrue/live-chart";
import { LogStream } from "@/registry/overtrue/log-stream";
import { ApprovalQueue } from "@/registry/overtrue/approval-queue";
import { TeamWorkload } from "@/registry/overtrue/team-workload";
import { AuditTrail } from "@/registry/overtrue/audit-trail";
import { workload, projectActivity } from "@/data/workspace/operations";
import { useWorkData } from "../workspace/work-data";
import { DeployPipeline } from "@/registry/overtrue/deploy-pipeline";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { MetricGroup } from "@/registry/overtrue/metric-group";
import { useState } from "react";
import { Link } from "react-router-dom";
import { revenue } from "@/data/workspace/studio";
import {
  revenueReport,
  type RevenueGrouping,
} from "@/data/workspace/revenue-report";
import {
  Scene,
  SceneCard,
  Action,
  SearchField,
  Metric,
  Pill,
  Progress,
  Person,
  Go,
  FilterTabs,
  DownloadButton,
} from "./shared";
export default function Overview({
  title = "Studio overview",
  pageId = "index",
}: {
  title?: string;
  pageId?: string;
}) {
  const [grouping, setGrouping] = useState<RevenueGrouping>("Monthly");
  const {
    tasks: work,
    approvals,
    setApprovals,
    projects,
    clients,
  } = useWorkData();
  const report = revenueReport(grouping);
  const open = work.filter((task) => task.status !== "Complete");
  const pending = approvals.filter(
    (request) => request.status === "pending",
  ).length;
  const allocated = workload.reduce((sum, member) => sum + member.allocated, 0);
  const capacity = workload.reduce((sum, member) => sum + member.capacity, 0);
  return (
    <Scene
      id={pageId}
      title={title}
      description="The work that needs your attention, and the team moving it forward."
      actions={
        <Go to="/wizard" primary>
          New project
        </Go>
      }
    >
      <div className="scene-page-tabs">
        <span aria-current="page">Overview</span>
        <Link to="/tasks-list">
          My work{" "}
          <small>
            {open.filter((task) => task.person === "Maya Okafor").length}
          </small>
        </Link>
        <Link to="/cards">Projects</Link>
        <Link to="/activity">Activity</Link>
        <span className="scene-tabs-context">September 21–25, 2026</span>
      </div>
      <MetricGroup className="mb-6 scene-overview-metrics">
        <Metric
          label="Active projects"
          value={String(
            projects.filter((project) => project.status !== "Complete").length,
          )}
          note={`${clients.length} client relationships`}
        />
        <Metric
          label="Open tasks"
          value={String(open.length)}
          note={`${work.filter((task) => task.status === "In review").length} ready for review`}
        />
        <Metric
          label="Team allocation"
          value={`${Math.round((allocated / capacity) * 100)}%`}
          note={`${capacity - allocated} hours available this week`}
        />
        <Metric
          label="September revenue"
          value={"$" + revenue[8].value.toLocaleString("en-US")}
          note="Booked & planned · USD"
        />
      </MetricGroup>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <ApprovalQueue
            description={`${pending} decisions to keep delivery moving`}
            requests={approvals}
            onDecision={(id, status) =>
              setApprovals((current) =>
                current.map((request) =>
                  request.id === id ? { ...request, status } : request,
                ),
              )
            }
          />
          <SceneCard
            title="Projects in motion"
            description="Upcoming milestones, ordered by delivery date"
            action={<Go to="/cards">All projects</Go>}
            className="scene-table-card"
          >
            <div className="scene-table-wrap">
              <table className="scene-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Owner</th>
                    <th>Progress</th>
                    <th>Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {[projects[2], projects[0], projects[1], projects[3]].map(
                    (project) => (
                      <tr key={project.id}>
                        <td>
                          <Link to={`/datagrid?project=${project.id}`}>
                            <strong>{project.name}</strong>
                          </Link>
                          <small>{project.client}</small>
                        </td>
                        <td>
                          <Person name={project.owner} />
                        </td>
                        <td>
                          <div className="scene-progress-cell">
                            <Progress value={project.progress} />
                            <small>{project.progress}%</small>
                          </div>
                        </td>
                        <td>{project.due}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </SceneCard>
          <SceneCard
            title="Revenue outlook"
            description="January–December 2026 · Booked & planned work"
            action={
              <div className="scene-report-actions">
                <FilterTabs
                  items={["Monthly", "Quarterly"]}
                  value={grouping}
                  onChange={(value) => setGrouping(value as RevenueGrouping)}
                />
                <DownloadButton
                  name={`studio-revenue-2026-${grouping.toLowerCase()}`}
                  rows={report.rows}
                />
              </div>
            }
          >
            <div className="scene-chart-summary">
              <strong>${report.total.toLocaleString("en-US")}</strong>
              <span>booked & planned for 2026</span>
            </div>
            <div
              className="showcase-revenue-chart"
              role="img"
              aria-label={`${grouping} booked and planned revenue for 2026: ${report.series.map((point) => `${point.label} $${point.value}`).join(", ")}`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={report.series}
                  margin={{ top: 15, right: 6, bottom: 0, left: -15 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--scene-line)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "var(--scene-muted)" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                    tick={{ fontSize: 11, fill: "var(--scene-muted)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--scene-surface)",
                      border: "1px solid var(--scene-line)",
                      borderRadius: 8,
                      color: "var(--scene-ink)",
                      fontSize: 12,
                    }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Bar
                    dataKey="value"
                    name="Booked & planned"
                    fill="var(--scene-accent)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="showcase-chart-legend">
              <span>
                <i />
                Booked and planned revenue
              </span>
              <small>USD · September–December includes planned work</small>
            </div>
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <TeamWorkload period="This week" members={workload.slice(0, 4)} />
          <SceneCard
            title="Next on the calendar"
            action={<Link to="/fullcalendar">View all</Link>}
          >
            <div className="scene-meeting">
              <span className="scene-date-tile">
                <b>23</b>SEP
              </span>
              <div>
                <strong>Visitor concept review</strong>
                <p>Wednesday · 10:30–11:15</p>
                <small>Maya, Ines + 2 guests</small>
              </div>
            </div>
          </SceneCard>
          <SceneCard
            title="Recent activity"
            action={<Link to="/activity">View all</Link>}
          >
            <AuditTrail events={projectActivity.slice(0, 3)} />
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
export function Customers() {
  const { clients, tasks, setTasks } = useWorkData();
  const [stage, setStage] = useState("All clients");
  const [query, setQuery] = useState("");
  const shown = clients.filter(
    (client) =>
      (stage === "All clients" || client.stage === stage) &&
      `${client.name} ${client.contact} ${client.email}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const value = clients.reduce((sum, client) => sum + client.value, 0);
  return (
    <Scene
      id="client-overview"
      title="Client relationships"
      description="The people behind the work, with a clear next step for every relationship."
      actions={
        <Go to="/form-layout" primary>
          Add a client
        </Go>
      }
    >
      <div className="scene-page-tabs">
        <span aria-current="page">Directory</span>
        <Link to="/datatables">Engagements</Link>
        <Link to="/invoice">Invoices</Link>
        <span className="scene-tabs-context">{clients.length} clients</span>
      </div>
      <MetricGroup className="mb-6">
        <Metric
          label="Client relationships"
          value={String(clients.length)}
          note={`${clients.filter((client) => client.stage === "Partner").length} long-term partners`}
        />
        <Metric
          label="Contracted work"
          value={`$${value.toLocaleString("en-US")}`}
          note="Across current engagements"
        />
        <Metric
          label="Average engagement"
          value={`$${Math.round(value / (clients.length || 1)).toLocaleString("en-US")}`}
          note="Agreed project budgets"
        />
        <Metric
          label="In the pipeline"
          value={String(
            clients.filter((client) =>
              ["Prospect", "Onboarding"].includes(client.stage),
            ).length,
          )}
          note="Prospects & onboarding"
        />
      </MetricGroup>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <div className="scene-toolbar">
            <FilterTabs
              items={["All clients", "Active", "Partner", "Prospect"]}
              value={stage}
              onChange={setStage}
            />
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Find a client…"
            />
          </div>
          <SceneCard className="scene-table-card">
            <div
              className="scene-table-wrap"
              tabIndex={0}
              role="region"
              aria-label="Client directory"
            >
              <table className="scene-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Relationship owner</th>
                    <th>Stage</th>
                    <th className="scene-number">Contract value</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <Link
                          to={`/datatables?q=${encodeURIComponent(client.name)}`}
                        >
                          <strong>{client.name}</strong>
                        </Link>
                        <small>{client.email}</small>
                      </td>
                      <td>
                        <Person name={client.contact} />
                      </td>
                      <td>
                        <Pill>{client.stage}</Pill>
                      </td>
                      <td className="scene-number">
                        ${client.value.toLocaleString("en-US")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!shown.length && (
                <p className="scene-empty">No clients in this view.</p>
              )}
            </div>
            <div className="scene-table-summary">
              {shown.length} of {clients.length} relationships
            </div>
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <TaskChecklist
            title="Follow-ups this week"
            description="Keep each conversation moving"
            items={tasks.slice(0, 3).map((task) => ({
              id: task.id,
              title: task.title,
              description: task.project,
              checked: task.status === "Complete",
              meta: task.due,
            }))}
            onCheckedChange={(id, checked) =>
              setTasks((current) =>
                current.map((task) =>
                  task.id === id
                    ? { ...task, status: checked ? "Complete" : "In progress" }
                    : task,
                ),
              )
            }
          />
          <SceneCard title="Next client review">
            <div className="scene-meeting">
              <span className="scene-date-tile">
                <b>23</b>SEP
              </span>
              <div>
                <strong>Culture venue</strong>
                <p>Visitor experience · 10:30</p>
                <small>Maya Okafor · Relationship owner</small>
              </div>
            </div>
            <Go to="/fullcalendar">Open calendar</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
export function Operations() {
  const [region, setRegion] = useState("All regions");
  const [paused, setPaused] = useState(false);
  const telemetry = useSimulatedTelemetry({ paused });
  const services = [
    { name: "Workspace API", regions: ["Europe", "Asia"], uptime: "99.99%" },
    { name: "Asset delivery", regions: ["Europe", "Asia"], uptime: "99.98%" },
    { name: "Preview builds", regions: ["Europe"], uptime: "99.96%" },
    { name: "Email delivery", regions: ["Europe"], uptime: "99.97%" },
  ].filter(
    (service) => region === "All regions" || service.regions.includes(region),
  );
  return (
    <Scene
      id="operations-overview"
      title="Operations"
      description="Service health, recent deployments, and resource usage."
      actions={<Go to="/logs">Open event log</Go>}
    >
      <div className="scene-page-tabs">
        <span aria-current="page">Overview</span>
        <Link to="/uptime">Service status</Link>
        <Link to="/logs">Events</Link>
        <Link to="/ai-usage">AI usage</Link>
        <span className="scene-tabs-context">Sample environment</span>
      </div>
      <MetricGroup className="mb-6">
        <Metric label="Availability" value="99.98%" note="Last 30 days" />
        <Metric
          label="Completed builds"
          value="248"
          note="Across all projects this month"
        />
        <Metric
          label="Median response"
          value="142 ms"
          note="Workspace API · 24 hours"
        />
        <Metric
          label="Storage used"
          value="42.8 GB"
          note="100 GB available on this plan"
        />
      </MetricGroup>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <div className="scene-telemetry-panel">
            <div className="scene-toolbar">
              <span>Workspace API · Simulated telemetry</span>
              <Action onClick={() => setPaused(!paused)}>
                {paused ? "Resume stream" : "Pause stream"}
              </Action>
            </div>
            <LiveChart
              data={telemetry.requests}
              label="API throughput"
              description="Requests per second, last 2 minutes"
              unit="req/s"
              threshold={1600}
              thresholdLabel="Autoscale"
              height={220}
            />
          </div>
          <ServiceStatus
            title="Service health"
            actions={
              <FilterTabs
                items={["All regions", "Europe", "Asia"]}
                value={region}
                onChange={setRegion}
              />
            }
            services={services.map((service, index) => ({
              id: service.name,
              name: service.name,
              status: "operational",
              samples: Array.from({ length: 30 }, (_, day) => ({
                id: String(day),
                label: `September ${day + 1}`,
                status: (day + index) % 29 === 0 ? "degraded" : "operational",
              })),
              startLabel: service.regions.join(" & "),
              endLabel: `${service.uptime} uptime`,
            }))}
          />
          <LogStream
            entries={telemetry.events}
            title="Recent events"
            height={220}
            maxEntries={80}
            live={!paused}
          />
        </div>
        <aside className="scene-product-aside">
          <DeployPipeline
            orientation="vertical"
            title="Latest deployment"
            meta="web #1284 · main · 4f9c2ab"
            stages={[
              {
                id: "build",
                label: "Build",
                jobs: [
                  {
                    id: "compile",
                    label: "Compile",
                    status: "success",
                    duration: 72000,
                    detail:
                      "Application and static assets compiled successfully.",
                  },
                ],
              },
              {
                id: "test",
                label: "Test",
                jobs: [
                  {
                    id: "unit",
                    label: "Unit tests",
                    status: "success",
                    duration: 48000,
                  },
                  {
                    id: "e2e",
                    label: "Browser checks",
                    status: "success",
                    duration: 161000,
                  },
                ],
              },
              {
                id: "scan",
                label: "Security scan",
                jobs: [
                  {
                    id: "audit",
                    label: "Dependency audit",
                    status: "success",
                    duration: 38000,
                  },
                ],
              },
              {
                id: "deploy",
                label: "Production",
                jobs: [
                  {
                    id: "production",
                    label: "Deployment",
                    status: "success",
                    duration: 54000,
                  },
                ],
              },
            ]}
          />
          <SceneCard title="Storage breakdown">
            {[
              ["Project files", 24.8],
              ["Preview environments", 11.6],
              ["Media exports", 6.4],
            ].map(([name, value]) => (
              <ResourceProgress
                key={name}
                label={String(name)}
                value={Number(value)}
                max={100}
                valueLabel={`${value} GB`}
                className="mb-6"
              />
            ))}
            <Go to="/settings-plan">Manage storage</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
