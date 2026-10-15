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
import {
  RealtimeMonitor,
  useSimulatedTelemetry,
} from "@/registry/overtrue/realtime-monitor";
import { InsightCard } from "@/registry/overtrue/insight-card";
import { DeployPipeline } from "@/registry/overtrue/deploy-pipeline";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { MetricGroup } from "@/registry/overtrue/metric-group";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projects, revenue, clients, tasks } from "@/data/workspace/studio";
import {
  revenueReport,
  type RevenueGrouping,
} from "@/data/workspace/revenue-report";
import {
  Scene,
  SceneCard,
  Metric,
  Feed,
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
  const report = revenueReport(grouping);
  const septemberChange = (revenue[8].value / revenue[7].value - 1) * 100;
  const reviews = tasks.filter((task) => task.status === "In review");
  const attention = [
    ...reviews,
    ...tasks.filter(
      (task) => task.status === "In progress" && task.priority === "High",
    ),
  ];
  return (
    <Scene
      id={pageId}
      title={title}
      description="A clear view of the work, the people, and what needs your attention."
      actions={
        <Go to="/wizard" primary>
          New project
        </Go>
      }
    >
      <div className="scene-toolbar">
        <span>Monday, September 21, 2026 · Studio snapshot</span>
      </div>
      <StudioBrief />
      <MetricGroup className="mb-6 scene-overview-metrics">
        <Metric
          label="September revenue"
          value={"$" + revenue[8].value.toLocaleString("en-US")}
          note={`${septemberChange.toFixed(1)}% vs. August · booked & planned`}
        />
        <Metric
          label="Open projects"
          value={String(
            projects.filter((project) => project.status !== "Complete").length,
          )}
          note={`across ${clients.length} client relationships`}
        />
        <Metric
          label="Team capacity"
          value="78%"
          change="22% available"
          note="for new work"
        />
        <Metric
          label="Awaiting review"
          value={String(reviews.length)}
          note="deliverable ready for review"
        />
      </MetricGroup>
      <SceneCard
        title="Needs attention"
        description="Review the handover, then focus on the next priority."
        action={<Go to="/tasks-list">Open work queue</Go>}
      >
        <ul className="scene-attention-list">
          {attention.map((task) => (
            <li key={task.id}>
              <Link to={`/tasks-list?q=${task.id}`}>
                <span>
                  <Pill>
                    {task.status === "In review"
                      ? "Ready for review"
                      : "High priority"}
                  </Pill>
                  <strong>{task.title}</strong>
                  <small>
                    {task.person} · Due {task.due}
                  </small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </SceneCard>
      <div className="scene-grid-main">
        <div>
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
                  <defs>
                    <linearGradient id="overview-revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--scene-accent)" stopOpacity={1} />
                      <stop offset="100%" stopColor="var(--scene-accent)" stopOpacity={0.55} />
                    </linearGradient>
                  </defs>
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
                      borderRadius: 10,
                      boxShadow: "0 12px 32px -12px rgb(13 20 36 / 0.3)",
                      color: "var(--scene-ink)",
                      fontSize: 12,
                    }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Bar
                    dataKey="value"
                    name="Booked & planned"
                    fill="url(#overview-revenue)"
                    radius={[6, 6, 2, 2]}
                    maxBarSize={30}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="showcase-chart-legend">
              <span>
                <i />
                Booked & planned revenue
              </span>
              <small>USD · September–December includes planned work</small>
            </div>
          </SceneCard>
          <SceneCard
            title="Projects in motion"
            description="Upcoming milestones, ordered by delivery date"
            action={<Go to="/tasks">View board</Go>}
          >
            <div className="scene-table-wrap">
              <table className="scene-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Owner</th>
                    <th>Progress</th>
                    <th>Due</th>
                  </tr>
                </thead>
                <tbody>
                  {[projects[2], projects[0], projects[1], projects[3]].map(
                    (p) => (
                      <tr key={p.id}>
                        <td>
                          <Link to="/tasks">
                            <strong>{p.name}</strong>
                          </Link>
                          <small>{p.client}</small>
                        </td>
                        <td>
                          <Person name={p.owner} />
                        </td>
                        <td>
                          <div className="scene-progress-cell">
                            <Progress value={p.progress} />
                            <small>{p.progress}%</small>
                          </div>
                        </td>
                        <td>{p.due}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </SceneCard>
        </div>
        <aside>
          <SceneCard title="Next up">
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
            <Go to="/fullcalendar">Open calendar</Go>
          </SceneCard>
          <SceneCard
            title="Studio activity"
            action={<Link to="/activity">View all</Link>}
          >
            <Feed limit={4} />
          </SceneCard>
          <div className="scene-note">
            <span className="scene-eyebrow">A little room to breathe</span>
            <h3>Protect time for the work.</h3>
            <p>
              Friday afternoons are meeting-free. Add your focus block to the
              shared calendar.
            </p>
          </div>
        </aside>
      </div>
    </Scene>
  );
}
export function Customers() {
  const [stage, setStage] = useState("All clients");
  const shown = clients.filter(
    (c) => stage === "All clients" || c.stage === stage,
  );
  return (
    <Scene
      id="client-overview"
      title="Client relationships"
      description="From the first conversation to the next chapter of working together."
      actions={
        <Go to="/form-layout" primary>
          Add a client
        </Go>
      }
    >
      <MetricGroup className="mb-6">
        <Metric
          label="Active relationships"
          value="6"
          note="4 returning · 2 new"
        />
        <Metric label="Contracted work" value="$70,600" change="+18%" />
        <Metric
          label="Average engagement"
          value="$11,767"
          note="across current projects"
        />
        <Metric label="Next renewal" value="Oct 12" note="Member collective" />
      </MetricGroup>
      <div className="scene-grid-main">
        <SceneCard title="Client directory">
          <FilterTabs
            items={["All clients", "Active", "Partner", "Prospect"]}
            value={stage}
            onChange={setStage}
          />
          <div className="scene-client-list">
            {shown.map((c) => (
              <article key={c.id}>
                <div className="scene-client-monogram">
                  {c.name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </div>
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.email}</p>
                  <Person name={c.contact} subtitle="Relationship owner" />
                </div>
                <div>
                  <Pill>{c.stage}</Pill>
                  <strong>${c.value.toLocaleString()}</strong>
                  <small>contract value</small>
                </div>
              </article>
            ))}
          </div>
        </SceneCard>
        <aside>
          <SceneCard title="Relationship health">
            <div className="scene-big-number">
              92<span>/100</span>
            </div>
            <Progress value={92} />
            <p>
              Every active client has a named owner and a review scheduled this
              month.
            </p>
          </SceneCard>
          <SceneCard title="Follow-ups this week">
            <ul className="scene-checklist">
              {tasks.slice(0, 3).map((t) => (
                <li key={t.id}>
                  <input type="checkbox" aria-label={t.title} />
                  <div>
                    <strong>{t.title}</strong>
                    <small>
                      {t.project} · {t.due}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
const briefText =
  "September is pacing at {{metric:Revenue|$5,600|neutral}} booked, {{metric:vs. August|-5.1%|negative}} with planned work still to land {{cite:1}}. The team has {{metric:Capacity|22% free|positive}} for new work {{cite:2}}. One deliverable is ready for review: the identity handover for Ceramics studio, due Sep 26 {{cite:3}}. Suggested next step: confirm the visitor arrival journey before Thursday so Maya can start the wayfinding pass.";

/** A weekly brief that thinks, then streams in; regenerate replays it. */
function StudioBrief() {
  const [run, setRun] = useState(0);
  const [status, setStatus] = useState<"thinking" | "streaming" | "done">(
    "thinking",
  );
  useEffect(() => {
    setStatus("thinking");
    const write = window.setTimeout(() => setStatus("streaming"), 900);
    const finish = window.setTimeout(() => setStatus("done"), 1000);
    return () => {
      window.clearTimeout(write);
      window.clearTimeout(finish);
    };
  }, [run]);
  return (
    <InsightCard
      key={run}
      className="scene-brief"
      title="This week at Acme Studio"
      source="Workspace brief"
      text={briefText}
      status={status}
      speed={160}
      sources={[
        { id: "1", label: "Revenue outlook", href: "#/invoice" },
        { id: "2", label: "Team calendar", href: "#/fullcalendar" },
        { id: "3", label: "Work queue", href: "#/tasks-list" },
      ]}
      onRegenerate={() => setRun((value) => value + 1)}
    />
  );
}

export function Operations() {
  const [region, setRegion] = useState("All regions");
  const [paused, setPaused] = useState(false);
  const telemetry = useSimulatedTelemetry({ paused });
  return (
    <Scene
      id="operations-overview"
      title="Operations overview"
      description="Healthy services, predictable delivery, and room for your team to grow."
      actions={<Go to="/logs">Open event log</Go>}
    >
      <div className="scene-status-banner">
        <span className="scene-status-dot" />
        <div>
          <strong>All systems operational</strong>
          <p>Last checked 30 seconds ago · No active incidents</p>
        </div>
        <Pill>Healthy</Pill>
      </div>
      <RealtimeMonitor
        data={telemetry}
        title="Workspace API"
        environment="api.acme.studio"
        paused={paused}
        onPausedChange={setPaused}
        className="scene-live-monitor"
      />
      <DeployPipeline
        className="scene-release"
        title="web #1284"
        meta="main · 4f9c2ab Cache invoice PDFs at the edge"
        stages={[
          { id: "build", label: "Build", jobs: [{ id: "compile", label: "Compile", status: "success", duration: 72000 }] },
          {
            id: "test",
            label: "Test",
            jobs: [
              { id: "unit", label: "Unit", status: "success", duration: 48000 },
              { id: "e2e", label: "E2E", status: "success", duration: 161000 },
              { id: "lint", label: "Lint", status: "success", duration: 21000 },
            ],
          },
          { id: "scan", label: "Security scan", jobs: [{ id: "audit", label: "Audit", status: "success", duration: 38000 }] },
          { id: "preview", label: "Deploy preview", jobs: [{ id: "preview-job", label: "Preview", status: "success", duration: 54000 }] },
          { id: "prod", label: "Deploy production", jobs: [{ id: "prod-job", label: "Production", status: "running", startedAt: Date.now() - 42000 }] },
        ]}
      />
      <MetricGroup className="mb-6">
        <Metric
          label="Availability"
          value="99.98%"
          note="over the last 30 days"
        />
        <Metric label="Builds completed" value="248" change="+32" />
        <Metric label="Median response" value="142 ms" change="−18 ms" />
        <Metric
          label="Storage used"
          value="42.8 GB"
          note="of 100 GB included"
        />
      </MetricGroup>
      <div className="scene-grid-main">
        <ServiceStatus
          title="Service performance"
          actions={
            <FilterTabs
              items={["All regions", "Europe", "Asia"]}
              value={region}
              onChange={setRegion}
            />
          }
          services={[
            "Workspace API",
            "Asset delivery",
            "Preview builds",
            "Email delivery",
          ].map((name, i) => ({
            id: name,
            name,
            status: "operational",
            samples: Array.from({ length: 40 }, (_, j) => ({
              id: String(j),
              label: `Day ${j + 1}`,
              status: (j + i) % 37 === 0 ? "degraded" : "operational",
            })),
            startLabel: region,
            endLabel: `${(99.96 + i * 0.01).toFixed(2)}% uptime`,
          }))}
        />
        <SceneCard title="Resource allocation">
          {[
            ["Project files", 58],
            ["Preview environments", 27],
            ["Media exports", 15],
          ].map(([name, value]) => (
            <ResourceProgress
              key={name}
              label={String(name)}
              value={Number(value)}
              className="mb-6"
            />
          ))}
          <Go to="/settings-plan">Manage storage</Go>
        </SceneCard>
      </div>
    </Scene>
  );
}
