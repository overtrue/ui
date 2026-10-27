import { ServiceStatus as ServiceStatusBlock } from "@/registry/overtrue/service-status";
import { DetailList } from "@/registry/overtrue/detail-list";
import { useState } from "react";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import { TaskChecklist } from "@/registry/overtrue/task-checklist";
import { FileBrowser } from "@/registry/overtrue/file-browser";
import { AuditTrail } from "@/registry/overtrue/audit-trail";
import { projectActivity } from "@/data/workspace/operations";
import { useWorkData } from "../workspace/work-data";

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
  const { projects } = useWorkData();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState(false);
  const [status, setStatus] = useState("All projects");
  const rows = projects
    .filter(
      (project) =>
        (status === "All projects" || project.status === status) &&
        (project.name + project.client)
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => (sort ? b.budget - a.budget : a.budget - b.budget));
  return (
    <Scene
      id={id}
      title="Project register"
      description="Agreed budgets, accountable owners, and upcoming delivery dates."
      actions={
        <DownloadButton
          name="project-register"
          rows={[
            ["Project", "Client", "Budget", "Status", "Delivery"],
            ...rows.map((project) => [
              project.name,
              project.client,
              String(project.budget),
              project.status,
              project.due,
            ]),
          ]}
        />
      }
    >
      <div className="scene-page-tabs">
        <Link to="/cards">Portfolio</Link>
        <span aria-current="page">Register</span>
        <Link to="/tasks-list">Work queue</Link>
        <span className="scene-tabs-context">
          {projects.length} engagements
        </span>
      </div>
      <div className="scene-toolbar">
        <FilterTabs
          items={["All projects", "In progress", "In review", "Complete"]}
          value={status}
          onChange={setStatus}
        />
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search projects or clients…"
        />
      </div>
      <SceneCard className="scene-table-card">
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
                <th
                  className="scene-number"
                  aria-sort={sort ? "descending" : "ascending"}
                >
                  <button
                    className="scene-table-sort"
                    onClick={() => setSort(!sort)}
                  >
                    Budget {sort ? "↓" : "↑"}
                  </button>
                </th>
                <th>Delivery</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((project) => (
                <tr key={project.id}>
                  <td>
                    <Link to={`/datagrid?project=${project.id}`}>
                      <strong>{project.name}</strong>
                    </Link>
                    <small>
                      {project.id} · {project.client}
                    </small>
                  </td>
                  <td>
                    <Person name={project.owner} />
                  </td>
                  <td>
                    <Pill>{project.status}</Pill>
                  </td>
                  <td className="scene-number">
                    ${project.budget.toLocaleString("en-US")}
                  </td>
                  <td>{project.due}</td>
                  <td>
                    <div className="scene-progress-cell">
                      <Progress value={project.progress} />
                      <small>{project.progress}%</small>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <div className="scene-empty-search">
              <h3>No projects match this search</h3>
              <Action
                onClick={() => {
                  setQuery("");
                  setStatus("All projects");
                }}
              >
                Clear filters
              </Action>
            </div>
          )}
        </div>
        <div className="scene-table-summary" role="status">
          <span>
            {rows.length} of {projects.length} projects
          </span>
          <span>
            View budget{" "}
            <strong>
              $
              {rows
                .reduce((sum, project) => sum + project.budget, 0)
                .toLocaleString("en-US")}
            </strong>
          </span>
        </div>
      </SceneCard>
    </Scene>
  );
}
const projectBriefs: Record<string, string> = {
  "PRJ-241":
    "Help visitors feel welcome from the moment they arrive. Connect physical wayfinding with clear digital guidance, and make the next step obvious at every touchpoint.",
  "PRJ-242":
    "Give members one reliable place to manage their profile, discover resources, and participate in their community. Keep permissions clear for members, editors, and reviewers.",
  "PRJ-243":
    "Create a consistent identity for the studio’s next chapter. Deliver a flexible logo system, a concise brand guide, and production-ready print and digital assets.",
  "PRJ-244":
    "Understand where new customers need help. Test an onboarding journey that gets each customer to their first useful outcome with fewer hand-offs.",
  "PRJ-245":
    "Give the editorial team reusable templates for a consistent publication. Document the system so editors can publish without waiting for a designer.",
  "PRJ-246":
    "Introduce the community with a clear story and a focused launch campaign. Align the landing page, invitation, and first member experience.",
};
export function ProjectDetails() {
  const [params] = useSearchParams();
  const { projects, tasks, setTasks } = useWorkData();
  const project =
    projects.find((item) => item.id === params.get("project")) ?? projects[0];
  const [tab, setTab] = useState("Overview");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const work = tasks.filter((task) => task.project === project.client);
  const files = [
    {
      id: project.id + "-visual",
      name: `${project.name} — visual direction`,
      kind: "image" as const,
      preview: project.image,
      downloadUrl: project.image,
      updated: "Sep 21, 2026",
      owner: project.owner,
    },
    {
      id: project.id + "-brief",
      name: `${project.name} — project brief.txt`,
      owner: project.owner,
      updated: "Sep 18, 2026",
      downloadUrl: `data:text/plain;charset=utf-8,${encodeURIComponent(project.name + "\n\n" + (project.brief || projectBriefs[project.id] || "Brief to be confirmed with the project team."))}`,
    },
  ];
  const checklist = (
    <TaskChecklist
      title="Deliverables"
      description="Work assigned to this project"
      items={work.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.person,
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
  );
  return (
    <Scene
      id="datagrid"
      title={project.name}
      description={`${project.id} · ${project.client}`}
      actions={
        <Go to={`/tasks-list?q=${encodeURIComponent(project.client)}`}>
          Open work queue
        </Go>
      }
    >
      <div className="scene-page-tabs">
        {["Overview", "Deliverables", "Files", "Activity"].map((label) => (
          <button
            key={label}
            aria-current={tab === label ? "page" : undefined}
            onClick={() => setTab(label)}
          >
            {label}
          </button>
        ))}
        <span className="scene-tabs-context">
          <Pill>{project.status}</Pill>
        </span>
      </div>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          {tab === "Overview" && (
            <>
              <SceneCard title="Project brief">
                <p className="scene-project-brief">
                  {project.brief ||
                    projectBriefs[project.id] ||
                    "The project has been created. Agree the scope with the team before starting delivery."}
                </p>
                <div className="scene-project-milestones">
                  <div>
                    <small>Current phase</small>
                    <strong>
                      {project.status === "Complete"
                        ? "Delivered"
                        : project.status === "In review"
                          ? "Client review"
                          : "Design & delivery"}
                    </strong>
                  </div>
                  <div>
                    <small>Next milestone</small>
                    <strong>
                      {project.due} ·{" "}
                      {project.status === "Complete"
                        ? "Final handover"
                        : "Project review"}
                    </strong>
                  </div>
                </div>
              </SceneCard>
              {checklist}
              <SceneCard title="Recent decisions">
                <AuditTrail
                  events={projectActivity.filter(
                    (event) => event.actor === project.owner,
                  )}
                />
              </SceneCard>
            </>
          )}
          {tab === "Deliverables" && checklist}
          {tab === "Files" && (
            <FileBrowser
              files={files}
              selectedIds={selectedFiles}
              onSelectionChange={setSelectedFiles}
            />
          )}
          {tab === "Activity" && (
            <SceneCard title="Project activity">
              <AuditTrail
                events={projectActivity.filter(
                  (event) => event.actor === project.owner,
                )}
              />
            </SceneCard>
          )}
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Project details">
            <DetailList
              items={[
                {
                  id: "owner",
                  label: "Owner",
                  value: <Person name={project.owner} />,
                },
                { id: "client", label: "Client", value: project.client },
                {
                  id: "discipline",
                  label: "Discipline",
                  value: project.category,
                },
                {
                  id: "budget",
                  label: "Budget",
                  value: `$${project.budget.toLocaleString("en-US")}`,
                },
                { id: "due", label: "Delivery", value: project.due + ", 2026" },
                {
                  id: "visibility",
                  label: "Visibility",
                  value: "Project team & guests",
                },
              ]}
            />
          </SceneCard>
          <SceneCard title="Delivery progress">
            <div className="scene-big-number">
              {project.progress}
              <span>% complete</span>
            </div>
            <Progress value={project.progress} />
            <p>
              {work.filter((task) => task.status === "Complete").length} of{" "}
              {work.length} tracked deliverables completed.
            </p>
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
  const [filter, setFilter] = useState("All events");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(events[0]);
  const rows = events.filter(
    (event) =>
      (filter === "All events" || event[1] === filter) &&
      event.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Scene
      id="logs"
      title="Event log"
      description="September 21, 2026 · UTC · Sample service records"
      actions={
        <DownloadButton
          name="workspace-events"
          rows={[["Time", "Level", "Service", "Event", "Duration"], ...rows]}
        />
      }
    >
      <nav className="scene-page-tabs">
        <NavLink end to="/operations-overview">
          Operations
        </NavLink>
        <NavLink end to="/uptime">
          Availability
        </NavLink>
        <span aria-current="page">Event log</span>
      </nav>
      <div className="scene-toolbar">
        <FilterTabs
          items={["All events", "INFO", "WARN", "ERROR"]}
          value={filter}
          onChange={setFilter}
        />
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search events or services"
        />
      </div>
      <div className="scene-product-grid">
        <SceneCard
          title="Service events"
          description={`${rows.length} matching records`}
          className="scene-table-card"
        >
          <div
            className="scene-table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Scrollable records"
          >
            <table className="scene-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Level</th>
                  <th>Event</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((event) => (
                  <tr key={event[0]}>
                    <td>
                      <code>{event[0]}</code>
                    </td>
                    <td>
                      <Pill>{event[1]}</Pill>
                    </td>
                    <td>
                      <button
                        className="scene-text-button"
                        aria-pressed={selected[0] === event[0]}
                        onClick={() => setSelected(event)}
                      >
                        {event[3]}
                      </button>
                      <small>{event[2]}</small>
                    </td>
                    <td>{event[4]}</td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={4}>No events match these filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SceneCard>
        <aside className="scene-product-aside">
          <SceneCard title="Event details">
            <Pill>{selected[1]}</Pill>
            <h3>{selected[3]}</h3>
            <DetailList
              items={[
                { id: "service", label: "Service", value: selected[2] },
                {
                  id: "time",
                  label: "Recorded at",
                  value: `${selected[0]} UTC`,
                },
                { id: "duration", label: "Duration", value: selected[4] },
                { id: "level", label: "Level", value: selected[1] },
              ]}
            />
            <p>
              {selected[1] === "ERROR"
                ? "The request was deferred and a retry is scheduled. Check the next delivery event before taking action."
                : selected[1] === "WARN"
                  ? "The build queue is nearing capacity. Review active jobs and worker availability."
                  : "The service completed the operation successfully."}
            </p>
          </SceneCard>
          <SceneCard title="Related views">
            <Go to="/tracking">Scheduled job history</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
export function ServiceStatus({ id = "uptime" }: { id?: string }) {
  const [period, setPeriod] = useState("30 days");
  return (
    <Scene
      id={id}
      title={id === "uptime" ? "Service availability" : "Delivery history"}
      description="Current service state, uptime history, and incident notes."
      actions={
        <FilterTabs
          items={["7 days", "30 days", "90 days"]}
          value={period}
          onChange={setPeriod}
        />
      }
    >
      <nav className="scene-page-tabs">
        <NavLink end to="/operations-overview">
          Operations
        </NavLink>
        <span aria-current="page">Availability</span>
        <NavLink end to="/logs">
          Event log
        </NavLink>
      </nav>
      <div className="scene-status-banner">
        <span className="scene-status-dot" />
        <div>
          <strong>Everything is working as expected</strong>
          <p>No active incidents · Updated September 21, 2026 at 10:45 UTC</p>
        </div>
        <Pill>Healthy</Pill>
      </div>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
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
                status:
                  i === 2 && j === parseInt(period) - 9
                    ? "degraded"
                    : "operational",
              })),
              startLabel: `${period} ago`,
              endLabel: `Today · ${i === 2 && parseInt(period) >= 9 ? (100 - (18 / (parseInt(period) * 24 * 60)) * 100).toFixed(2) : "100"}%`,
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
        <aside className="scene-product-aside">
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
              These are illustrative service records for the overtrue/ui demo,
              not a live status feed.
            </p>
          </div>
        </aside>
      </div>
    </Scene>
  );
}
