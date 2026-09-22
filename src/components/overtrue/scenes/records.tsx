import { ServiceStatus as ServiceStatusBlock } from "@/registry/overtrue/service-status";
import { DetailList } from "@/registry/overtrue/detail-list";
import { useState } from "react";
import { projects, team } from "@/data/workspace/studio";
import {
  Scene,
  SceneCard,
  SearchField,
  Pill,
  Person,
  Progress,
  Action,
  DownloadButton,
  Go,
  FilterTabs,
} from "./shared";
export function Records({ id = "datatables" }: { id?: string }) {
  const [query, setQuery] = useState(""),
    [sort, setSort] = useState(false);
  const rows = projects
    .filter((p) =>
      (p.name + p.client).toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => (sort ? b.budget - a.budget : a.budget - b.budget));
  return (
    <Scene
      id={id}
      title="Project register"
      description="One reliable record of the work we’ve agreed to deliver."
      actions={
        <DownloadButton
          rows={[
            ["Project", "Client", "Budget"],
            ...rows.map((p) => [p.name, p.client, String(p.budget)]),
          ]}
        />
      }
    >
      <SceneCard
        title="Current engagements"
        description="Sample client records · September 2026"
      >
        <div className="scene-toolbar">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search projects or clients…"
          />
          <Action onClick={() => setSort(!sort)}>
            Budget: {sort ? "highest first" : "lowest first"}
          </Action>
        </div>
        <div
          className="scene-table-wrap"
          tabIndex={0}
          role="region"
          aria-label="Project register, scroll to see all columns"
        >
          <table className="scene-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Delivery</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <small>
                      {p.id} · {p.client}
                    </small>
                  </td>
                  <td>
                    <Person name={p.owner} />
                  </td>
                  <td>
                    <Pill>{p.status}</Pill>
                  </td>
                  <td>${p.budget.toLocaleString()}</td>
                  <td>{p.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <p className="scene-empty">No projects match this search.</p>
          )}
        </div>
      </SceneCard>
      <div className="scene-grid-two">
        <SceneCard title="A shared source of context">
          <p>
            The register connects each project to its owner, agreed budget, and
            next delivery date. Review it before adding new work to the
            schedule.
          </p>
        </SceneCard>
        <SceneCard title="Ready for the next review?">
          <p>
            Open the work queue to see individual deliverables and update their
            status.
          </p>
          <Go to="/tasks-list">View work queue</Go>
        </SceneCard>
      </div>
    </Scene>
  );
}
export function ProjectDetails() {
  const p = projects[0];
  return (
    <Scene
      id="datagrid"
      title={p.name}
      description="The brief, the people, and the decisions that keep this project moving."
      actions={<Go to="/tasks">Open board</Go>}
    >
      <div className="scene-grid-main">
        <SceneCard title="Project brief">
          <p>
            Help visitors feel welcome from the moment they arrive. Connect
            physical wayfinding with clear digital guidance, and make the next
            step obvious at every touchpoint.
          </p>
          <div className="scene-form-grid">
            <DetailList
              items={[
                ["Client", p.client],
                ["Project code", p.id],
                ["Discipline", p.category],
                ["Delivery", p.due + ", 2026"],
              ].map(([label, value]) => ({ id: label, label, value }))}
            />
            <DetailList
              items={[
                ["Budget", "$18,400"],
                ["Stage", "Concept review"],
                ["Started", "September 02, 2026"],
                ["Visibility", "Project team & guests"],
              ].map(([label, value]) => ({ id: label, label, value }))}
            />
          </div>
          <h3>What success looks like</h3>
          <p>
            Visitors can plan their visit, find the right entrance, and
            understand the experience without needing to ask for help.
          </p>
        </SceneCard>
        <aside>
          <SceneCard title="Project team">
            {[team[0], team[2], team[4]].map((p) => (
              <div className="scene-resource" key={p.id}>
                <Person name={p.name} subtitle={p.discipline} />
              </div>
            ))}
          </SceneCard>
          <SceneCard title="Delivery progress">
            <div className="scene-big-number">
              72<span>% complete</span>
            </div>
            <Progress value={72} />
            <p>Next milestone: client concept review.</p>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
const events = [
  ["10:42:18", "INFO", "workspace-api", "Project brief saved", "142 ms"],
  ["10:41:55", "INFO", "asset-delivery", "Identity package published", "86 ms"],
  [
    "10:40:31",
    "WARN",
    "preview-builds",
    "Build queue approaching capacity",
    "840 ms",
  ],
  ["10:39:07", "INFO", "workspace-api", "Member permissions updated", "118 ms"],
  [
    "10:37:44",
    "ERROR",
    "email-delivery",
    "Delivery deferred; retry scheduled",
    "2.1 s",
  ],
  ["10:36:12", "INFO", "preview-builds", "Preview environment ready", "12.4 s"],
  ["10:35:08", "INFO", "asset-delivery", "Image variants generated", "326 ms"],
];
export function EventLog() {
  const [filter, setFilter] = useState("All events"),
    [query, setQuery] = useState("");
  const rows = events.filter(
    (e) =>
      (filter === "All events" || e[1] === filter) &&
      e.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Scene
      id="logs"
      title="Event stream"
      description="A practical view of what your workspace services are doing."
      actions={<DownloadButton name="workspace-events" rows={events} />}
    >
      <div className="scene-toolbar">
        <FilterTabs
          items={["All events", "INFO", "WARN", "ERROR"]}
          value={filter}
          onChange={setFilter}
        />
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search events or services…"
        />
      </div>
      <SceneCard title="September 21, 2026" description="UTC · Demo event data">
        <div className="scene-table-wrap">
          <table className="scene-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Level</th>
                <th>Service & event</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e[0]}>
                  <td>
                    <code>{e[0]}</code>
                  </td>
                  <td>
                    <Pill>{e[1]}</Pill>
                  </td>
                  <td>
                    <strong>{e[3]}</strong>
                    <small>{e[2]}</small>
                  </td>
                  <td>{e[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SceneCard>
      <div className="scene-note">
        <h3>A retry is already scheduled.</h3>
        <p>
          The deferred email will be retried automatically. No workspace data
          was lost, and other services are operating normally.
        </p>
      </div>
    </Scene>
  );
}
export function ServiceStatus({ id = "uptime" }: { id?: string }) {
  const [period, setPeriod] = useState("30 days");
  return (
    <Scene
      id={id}
      title={
        id === "uptime" ? "A workspace you can count on" : "Delivery history"
      }
      description="Service health and recent events, with enough context to understand the signal."
      actions={
        <FilterTabs
          items={["7 days", "30 days", "90 days"]}
          value={period}
          onChange={setPeriod}
        />
      }
    >
      <div className="scene-status-banner">
        <span className="scene-status-dot" />
        <div>
          <strong>Everything is working as expected</strong>
          <p>No active incidents · Updated September 21, 2026 at 10:45 UTC</p>
        </div>
        <Pill>Healthy</Pill>
      </div>
      <div className="scene-grid-main">
        <div>
          <ServiceStatusBlock
            className="mb-6"
            description={"Observed over the last " + period}
            services={[
              "Workspace & projects",
              "Asset delivery",
              "Preview environments",
              "Notifications",
            ].map((name, i) => ({
              id: name,
              name,
              status: "operational",
              samples: Array.from({ length: parseInt(period) }, (_, j) => ({
                id: String(j),
                label: `${parseInt(period) - j} days ago`,
                status: i === 2 && j === 8 ? "degraded" : "operational",
              })),
              startLabel: `${period} ago`,
              endLabel: `Today · ${i === 2 ? "99.94" : "100"}%`,
            }))}
          />
          <SceneCard title="Recent incident notes">
            <div className="scene-list-row">
              <div>
                <small>SEPTEMBER 12 · 14:20 UTC</small>
                <h3>Preview builds took longer than usual</h3>
                <p>
                  A busy build queue increased waiting time for 18 minutes.
                  Additional workers cleared the queue and normal processing
                  resumed.
                </p>
              </div>
              <Pill>Resolved</Pill>
            </div>
            <div className="scene-list-row">
              <div>
                <small>SEPTEMBER 08 · 09:00 UTC</small>
                <h3>Scheduled storage maintenance</h3>
                <p>
                  Routine maintenance completed without interruption to project
                  files or asset delivery.
                </p>
              </div>
              <Pill>Complete</Pill>
            </div>
          </SceneCard>
        </div>
        <aside>
          <SceneCard title="Response time">
            <div className="scene-big-number">
              142<span>ms median</span>
            </div>
            <p>
              Measured across workspace requests. Asset downloads and preview
              builds are reported separately.
            </p>
            <Go to="/logs">Inspect event stream</Go>
          </SceneCard>
          <div className="scene-note">
            <h3>Context matters.</h3>
            <p>
              These are illustrative service records for the overtrue/ui demo, not a
              live status feed.
            </p>
          </div>
        </aside>
      </div>
    </Scene>
  );
}
