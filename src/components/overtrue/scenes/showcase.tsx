import { NavLink } from "react-router-dom";
import { useState } from "react";
import { IconCheck, IconPin, IconDots } from "@tabler/icons-react";
import { Settings } from "./settings";
import { useWorkData } from "../workspace/work-data";
import { projectActivity, workload } from "@/data/workspace/operations";
import { TaskChecklist } from "@/registry/overtrue/task-checklist";
import { ApprovalQueue } from "@/registry/overtrue/approval-queue";
import { TeamWorkload } from "@/registry/overtrue/team-workload";
import { AuditTrail } from "@/registry/overtrue/audit-trail";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { UptimeHistory } from "@/registry/overtrue/uptime-history";
import { Steps } from "@/registry/overtrue/steps";
import { DetailList } from "@/registry/overtrue/detail-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Scene,
  SceneCard,
  Person,
  Pill,
  Go,
  Action,
  FilterTabs,
} from "./shared";

export function Widgets() {
  const { tasks, setTasks, projects } = useWorkData();
  const mine = tasks.filter((task) => task.person === "Maya Okafor");
  return (
    <Scene
      id="widgets"
      title="My workspace"
      description="Your current work, team availability, and recent project updates."
      actions={<Go to="/tasks-list">All tasks</Go>}
    >
      <div className="scene-page-tabs">
        <NavLink end to="/widgets">
          My workspace
        </NavLink>
        <NavLink end to="/cards">
          Projects
        </NavLink>
        <NavLink end to="/activity">
          Activity
        </NavLink>
      </div>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <TaskChecklist
            title="Assigned to me"
            description="Keep the next deliverable moving."
            items={mine.map((task) => ({
              id: task.id,
              title: task.title,
              checked: task.status === "Complete",
              description: task.project,
              meta: task.due,
            }))}
            onCheckedChange={(key, checked) =>
              setTasks((items) =>
                items.map((task) =>
                  task.id === key
                    ? { ...task, status: checked ? "Complete" : "In progress" }
                    : task,
                ),
              )
            }
          />
          <SceneCard title="My projects" className="scene-table-card">
            <div
              className="scene-table-wrap"
              tabIndex={0}
              role="region"
              aria-label="Scrollable records"
            >
              <table className="scene-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Next milestone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projects
                    .filter((project) => project.owner === "Maya Okafor")
                    .map((project) => (
                      <tr key={project.id}>
                        <td>
                          <a href={`#/datagrid?project=${project.id}`}>
                            {project.name}
                          </a>
                          <small>{project.client}</small>
                        </td>
                        <td>{project.due}</td>
                        <td>
                          <Pill>{project.status}</Pill>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </SceneCard>
          <SceneCard title="Recent activity">
            <AuditTrail events={projectActivity.slice(0, 4)} />
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <TeamWorkload
            title="This week’s capacity"
            members={workload.slice(0, 4)}
          />
          <SceneCard title="Next review">
            <p className="scene-subtle">SEP 23 · 10:00–11:00</p>
            <h3>Visitor concept review</h3>
            <p>Culture venue · 4 participants</p>
            <Go to="/fullcalendar">Open calendar</Go>
          </SceneCard>
          <SceneCard title="Shared storage">
            <ResourceProgress
              label="Project files"
              value={42.8}
              max={100}
              valueLabel="42.8 GB of 100 GB"
            />
            <p>57.2 GB available for source files and final exports.</p>
            <Go to="/gallery">Browse files</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

export function CardActions() {
  const { projects } = useWorkData();
  const [archived, setArchived] = useState<string[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [filter, setFilter] = useState("Active projects");
  const visible = projects
    .filter(
      (project) => archived.includes(project.id) === (filter === "Archived"),
    )
    .sort(
      (a, b) => Number(pinned.includes(b.id)) - Number(pinned.includes(a.id)),
    );
  return (
    <Scene
      id="card-actions"
      title="Project shortcuts"
      description="Pin frequently used projects and keep your personal project view tidy."
      actions={<Go to="/wizard">New project</Go>}
    >
      <div className="scene-page-tabs">
        <FilterTabs
          items={["Active projects", "Archived"]}
          value={filter}
          onChange={setFilter}
        />
      </div>
      <div className="scene-grid-two">
        {visible.map((project) => (
          <SceneCard
            key={project.id}
            title={project.name}
            description={project.client}
            action={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="scene-icon-button"
                    aria-label={`Actions for ${project.name}`}
                  >
                    <IconDots size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() =>
                      setPinned((items) =>
                        items.includes(project.id)
                          ? items.filter((key) => key !== project.id)
                          : [...items, project.id],
                      )
                    }
                  >
                    {pinned.includes(project.id)
                      ? "Unpin project"
                      : "Pin project"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      setCollapsed((items) =>
                        items.includes(project.id)
                          ? items.filter((key) => key !== project.id)
                          : [...items, project.id],
                      )
                    }
                  >
                    {collapsed.includes(project.id)
                      ? "Show details"
                      : "Hide details"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      setArchived((items) =>
                        items.includes(project.id)
                          ? items.filter((key) => key !== project.id)
                          : [...items, project.id],
                      )
                    }
                  >
                    {archived.includes(project.id)
                      ? "Restore to shortcuts"
                      : "Archive shortcut"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          >
            <div className="scene-toolbar">
              <Pill>{project.status}</Pill>
              {pinned.includes(project.id) && (
                <span className="scene-subtle">
                  <IconPin size={14} /> Pinned
                </span>
              )}
            </div>
            {!collapsed.includes(project.id) && (
              <>
                <ResourceProgress
                  label="Delivery progress"
                  value={project.progress}
                />
                <div className="scene-record-list">
                  <div>
                    <Person name={project.owner} subtitle="Project owner" />
                    <span className="scene-subtle">{project.due}</span>
                  </div>
                </div>
              </>
            )}
            <Go to={`/datagrid?project=${project.id}`}>Open project</Go>
          </SceneCard>
        ))}
      </div>
      {!visible.length && (
        <SceneCard title="No archived shortcuts">
          <p>
            Archived shortcuts will appear here. The projects remain available
            in the project register.
          </p>
        </SceneCard>
      )}
    </Scene>
  );
}

export function GradientCards() {
  const { projects, approvals, setApprovals } = useWorkData();
  return (
    <Scene
      id="card-gradients"
      title="Milestone review"
      description="Project milestones and the decisions needed to reach them."
      actions={<Go to="/cards">Project portfolio</Go>}
    >
      <div className="scene-grid-three scene-milestone-grid">
        {projects.slice(0, 3).map((project, i) => (
          <SceneCard
            key={project.id}
            title={project.name}
            description={project.client}
            className={`scene-milestone-card milestone-${i}`}
          >
            <span className="scene-subtle">NEXT MILESTONE</span>
            <h3>
              {["Concept review", "Permissions release", "Final handover"][i]}
            </h3>
            <ResourceProgress
              label="Project progress"
              value={project.progress}
            />
            <div className="scene-record-list">
              <div>
                <Person name={project.owner} subtitle={project.due} />
              </div>
            </div>
            <Go to={`/datagrid?project=${project.id}`}>Review project</Go>
          </SceneCard>
        ))}
      </div>
      <div className="scene-product-grid">
        <ApprovalQueue
          requests={approvals}
          onDecision={(key, status) =>
            setApprovals((items) =>
              items.map((item) =>
                item.id === key ? { ...item, status } : item,
              ),
            )
          }
        />
        <SceneCard title="Before you approve">
          <p>
            Check the deliverable against the agreed scope, record unresolved
            questions, and confirm who owns the handover.
          </p>
          <Go to="/prose?guide=1">Review guide</Go>
        </SceneCard>
      </div>
    </Scene>
  );
}

export function TextFeatures() {
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState([
    "Use a single entrance sign to establish the hierarchy. Directional signs should repeat the destination names from the visitor map.",
  ]);
  return (
    <Scene
      id="text-features"
      title="Project decision log"
      description="Visitor experience · Decisions, rationale, and changes to the brief."
      actions={<Go to="/wysiwyg">Edit project brief</Go>}
    >
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <SceneCard
            title="Wayfinding direction approved"
            description="September 21 · Maya Okafor"
          >
            <article className="scene-article">
              <p>
                The team agreed to develop{" "}
                <strong>Direction B — a clear first step</strong>. This gives
                visitors one primary route and keeps secondary destinations
                visible without competing with the main entrance.
              </p>
              <h3>What changed</h3>
              <p>
                The review date moved from <del>September 22</del> to{" "}
                <ins>September 25</ins> so the venue team can test the map with
                six first-time visitors.
              </p>
              <blockquote>
                “The destination names need to match what visitors see on their
                tickets.”
              </blockquote>
              <h3>Actions before the review</h3>
              <ul>
                <li>Update the map labels to match the ticketing system.</li>
                <li>Check directional sign legibility at five metres.</li>
                <li>Record visitor questions during the arrival test.</li>
              </ul>
            </article>
          </SceneCard>
          <SceneCard title="Team notes">
            <div className="scene-note-list">
              {notes.map((note, i) => (
                <div key={i}>
                  <p>{note}</p>
                  <small className="scene-subtle">
                    {i === 0 ? "Ines Duarte · 10:40" : "Maya Okafor · Just now"}
                  </small>
                </div>
              ))}
            </div>
            <form
              className="scene-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (draft.trim()) {
                  setNotes((items) => [...items, draft.trim()]);
                  setDraft("");
                }
              }}
            >
              <label>
                Add a note
                <textarea
                  required
                  rows={3}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
              </label>
              <Action type="submit">Save note</Action>
            </form>
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Decision record">
            <Pill>Approved</Pill>
            <DetailList
              items={[
                { id: "owner", label: "Decision owner", value: "Maya Okafor" },
                { id: "client", label: "Client", value: "Culture venue" },
                { id: "date", label: "Recorded", value: "September 21, 2026" },
              ]}
            />
            <Go to="/datagrid">Project details</Go>
          </SceneCard>
          <AuditTrail events={projectActivity.slice(0, 3)} />
        </aside>
      </div>
    </Scene>
  );
}

export function Tracking() {
  const [period, setPeriod] = useState("30 days");
  const days = parseInt(period);
  return (
    <Scene
      id="tracking"
      title="Scheduled job history"
      description="Backups and preview deployments · Demo execution records"
      actions={
        <FilterTabs
          items={["7 days", "30 days", "60 days"]}
          value={period}
          onChange={setPeriod}
        />
      }
    >
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          {["Scheduled backups", "Preview deployments"].map((name, index) => {
            const retries = index ? Math.floor(days / 17) + 1 : 0;
            return (
              <SceneCard
                key={name}
                title={name}
                description={`Last ${days} days`}
                action={<Pill>Operational</Pill>}
              >
                <div className="scene-chart-summary">
                  <strong>
                    {days - retries} / {days}
                  </strong>
                  <span>completed on first attempt</span>
                </div>
                <UptimeHistory
                  label={`${name} run history`}
                  samples={Array.from({ length: days }, (_, i) => ({
                    id: String(i),
                    label: `${name} · ${days - i} days ago`,
                    status: index && i % 17 === 0 ? "degraded" : "operational",
                  }))}
                />
                <div className="showcase-divider">
                  <span>
                    {retries
                      ? `${retries} runs recovered after retry`
                      : "No retries needed"}
                  </span>
                  <Go to="/logs">Execution logs</Go>
                </div>
              </SceneCard>
            );
          })}
          <SceneCard title="Latest recovery">
            <Pill>Resolved</Pill>
            <h3>Preview build retried after a timeout</h3>
            <p>
              The first attempt exceeded the build time limit. The retry
              completed successfully with a fresh worker.
            </p>
            <DetailList
              items={[
                { id: "job", label: "Job", value: "preview-member-portal" },
                { id: "attempt", label: "Attempts", value: "2" },
                {
                  id: "duration",
                  label: "Final duration",
                  value: "1 min 42 sec",
                },
              ]}
            />
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Schedule">
            <DetailList
              items={[
                { id: "backup", label: "Backups", value: "Daily at 03:00 UTC" },
                {
                  id: "preview",
                  label: "Previews",
                  value: "On each project update",
                },
                {
                  id: "retention",
                  label: "Backup retention",
                  value: "30 days",
                },
              ]}
            />
          </SceneCard>
          <SceneCard title="Run status">
            <p>
              Green marks a successful first attempt. Amber means the job needed
              a retry before it completed.
            </p>
            <Go to="/uptime">Service availability</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

export function ClientForm() {
  return <Settings id="form-layout" client />;
}

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("Acme Studio");
  const [size, setSize] = useState("2–10 people");
  const [workflow, setWorkflow] = useState("Client projects");
  return (
    <Scene
      id="onboarding"
      title="Set up your workspace"
      description="A few details to prepare your team’s shared workspace."
    >
      <div className="scene-setup-grid">
        <aside>
          <Steps
            steps={[
              "Workspace details",
              "Choose a workflow",
              "Review & finish",
            ]}
            current={done ? 3 : step}
            orientation="vertical"
          />
          <p className="scene-subtle">
            You can adjust these preferences later in settings.
          </p>
        </aside>
        <SceneCard
          title={
            done
              ? "Workspace setup complete"
              : [
                  "Workspace details",
                  "How your team works",
                  "Review your setup",
                ][step]
          }
        >
          {done ? (
            <div className="scene-feedback-result">
              <IconCheck size={32} />
              <h3>{name} is ready to explore</h3>
              <p>
                Your choices have been saved in this preview. Create the first
                project to start organizing work.
              </p>
              <Go to="/wizard" primary>
                Create your first project
              </Go>
            </div>
          ) : (
            <form
              className="scene-form"
              onSubmit={(e) => {
                e.preventDefault();
                step === 2 ? setDone(true) : setStep(step + 1);
              }}
            >
              {step === 0 ? (
                <>
                  <label>
                    Workspace name
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <label>
                    Team size
                    <select
                      className="native-select"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    >
                      {[
                        "Just me",
                        "2–10 people",
                        "11–25 people",
                        "26–50 people",
                      ].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                </>
              ) : step === 1 ? (
                <fieldset className="scene-choice-fieldset">
                  <legend>Main workflow</legend>
                  {[
                    "Client projects",
                    "Internal operations",
                    "Product development",
                  ].map((value) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="workflow"
                        value={value}
                        checked={workflow === value}
                        onChange={() => setWorkflow(value)}
                      />
                      <span>{value}</span>
                    </label>
                  ))}
                </fieldset>
              ) : (
                <DetailList
                  items={[
                    { id: "name", label: "Workspace", value: name },
                    { id: "size", label: "Team size", value: size },
                    { id: "workflow", label: "Main workflow", value: workflow },
                  ]}
                />
              )}
              <div className="scene-actions">
                {step > 0 && (
                  <Action onClick={() => setStep(step - 1)}>Back</Action>
                )}
                <Action type="submit" primary>
                  {step === 2 ? "Finish setup" : "Continue"}
                </Action>
              </div>
            </form>
          )}
        </SceneCard>
      </div>
    </Scene>
  );
}

export function Compositions() {
  const { approvals, setApprovals, tasks, setTasks } = useWorkData();
  return (
    <Scene
      id="high-order"
      title="Production compositions"
      description="Connected views for delivery, approvals, and team planning."
      actions={<Go to="/">Open workspace</Go>}
    >
      <div className="scene-composition-grid">
        <div className="scene-product-primary">
          <div className="scene-composition-heading">
            <h2>Delivery checklist</h2>
            <Go to="/tasks-list">Full workspace</Go>
          </div>
          <TaskChecklist
            title="This week’s work"
            items={tasks.slice(0, 3).map((task) => ({
              id: task.id,
              title: task.title,
              checked: task.status === "Complete",
              description: task.project,
              meta: task.due,
            }))}
            onCheckedChange={(key, checked) =>
              setTasks((items) =>
                items.map((task) =>
                  task.id === key
                    ? { ...task, status: checked ? "Complete" : "In progress" }
                    : task,
                ),
              )
            }
          />
          <div className="scene-composition-heading">
            <h2>Approval workflow</h2>
            <Go to="/alerts">Review requests</Go>
          </div>
          <ApprovalQueue
            requests={approvals}
            onDecision={(key, status) =>
              setApprovals((items) =>
                items.map((item) =>
                  item.id === key ? { ...item, status } : item,
                ),
              )
            }
          />
        </div>
        <div className="scene-product-primary">
          <div className="scene-composition-heading">
            <h2>Capacity planning</h2>
            <Go to="/users">Team directory</Go>
          </div>
          <TeamWorkload members={workload.slice(0, 4)} />
          <div className="scene-composition-heading">
            <h2>Decision history</h2>
            <Go to="/activity">Activity log</Go>
          </div>
          <SceneCard title="Recent project changes">
            <AuditTrail events={projectActivity.slice(0, 3)} />
          </SceneCard>
        </div>
      </div>
    </Scene>
  );
}
