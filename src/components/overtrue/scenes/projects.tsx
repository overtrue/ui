import { ProjectPortfolio } from "@/registry/overtrue/project-portfolio";
import { GanttChart, type GanttTask } from "@/registry/overtrue/gantt-chart";
import { useState } from "react";
import { Link } from "react-router-dom";
import { KanbanBoard, type KanbanCard } from "@/registry/overtrue/kanban-board";
import {
  FilterBar,
  applyFilters,
  type Filter,
  type FilterField,
} from "@/registry/overtrue/filter-bar";
import { TeamWorkload } from "@/registry/overtrue/team-workload";
import { workload } from "@/data/workspace/operations";
import { useWorkData } from "../workspace/work-data";
import { useSearchParams } from "react-router-dom";
import { IconChevronDown } from "@tabler/icons-react";
import { tasks as initialTasks, team } from "@/data/workspace/studio";
import {
  Scene,
  SceneCard,
  FilterTabs,
  Go,
  Pill,
  Person,
  Action,
} from "./shared";
export function ProjectCards({
  id = "cards",
  title = "Project portfolio",
}: {
  id?: string;
  title?: string;
}) {
  const { projects } = useWorkData();
  const [view, setView] = useState("Portfolio");
  const [status, setStatus] = useState("Active projects");
  const shown = projects.filter(
    (project) =>
      status === "All projects" ||
      (status === "Completed"
        ? project.status === "Complete"
        : project.status !== "Complete"),
  );
  return (
    <Scene
      id={id}
      title={title}
      description="Scope, ownership, and delivery across every client engagement."
      actions={
        <Go to="/wizard" primary>
          New project
        </Go>
      }
    >
      <div className="scene-page-tabs">
        <button
          aria-current={view === "Portfolio" ? "page" : undefined}
          onClick={() => setView("Portfolio")}
        >
          Portfolio
        </button>
        <button
          aria-current={view === "Timeline" ? "page" : undefined}
          onClick={() => setView("Timeline")}
        >
          Timeline
        </button>
        <Link to="/datatables">Register</Link>
        <span className="scene-tabs-context">
          {projects.length} projects · $
          {projects
            .reduce((sum, project) => sum + project.budget, 0)
            .toLocaleString("en-US")}{" "}
          contracted
        </span>
      </div>
      {view === "Portfolio" ? (
        <>
          <div className="scene-toolbar">
            <FilterTabs
              items={["Active projects", "All projects", "Completed"]}
              value={status}
              onChange={setStatus}
            />
            <span>{shown.length} projects in this view</span>
          </div>
          <ProjectPortfolio
            description="Project owners and next delivery milestones"
            projects={shown.map((project) => ({
              ...project,
              image: {
                src: project.image,
                alt: `${project.client} project moodboard`,
              },
              status: {
                label: project.status,
                variant:
                  project.status === "Complete"
                    ? "success"
                    : project.status === "In review"
                      ? "warning"
                      : "info",
              },
              owner: {
                id: project.owner,
                name: project.owner,
                image: `/assets/overtrue/people/${team.find((person) => person.name === project.owner)?.id ?? "guest"}.svg`,
              },
              href: `#/datagrid?project=${project.id}`,
            }))}
          />
        </>
      ) : (
        <GanttChart
          className="scene-delivery-plan"
          title="Delivery plan"
          description="Milestones across active projects, September to November"
          today="2026-09-21"
          defaultZoom="week"
          tasks={deliveryPlan}
        />
      )}
    </Scene>
  );
}

const deliveryPlan: GanttTask[] = [
  {
    id: "ce-design",
    label: "Identity system",
    group: "Ceramics identity",
    owner: "June Park",
    start: "2026-08-31",
    end: "2026-09-18",
    progress: 1,
  },
  {
    id: "ce-handover",
    label: "Handover package",
    group: "Ceramics identity",
    owner: "June Park",
    start: "2026-09-19",
    end: "2026-09-28",
    progress: 0.7,
    dependsOn: ["ce-design"],
  },
  {
    id: "ce-done",
    label: "Client sign-off",
    group: "Ceramics identity",
    start: "2026-09-28",
    end: "2026-09-28",
    milestone: true,
    dependsOn: ["ce-handover"],
  },
  {
    id: "ve-research",
    label: "Visitor research",
    group: "Visitor experience",
    owner: "Maya Okafor",
    start: "2026-09-01",
    end: "2026-09-16",
    progress: 1,
  },
  {
    id: "ve-journey",
    label: "Arrival journey",
    group: "Visitor experience",
    owner: "Maya Okafor",
    start: "2026-09-17",
    end: "2026-09-25",
    progress: 0.6,
    dependsOn: ["ve-research"],
  },
  {
    id: "ve-wayfinding",
    label: "Wayfinding concepts",
    group: "Visitor experience",
    owner: "Ines Duarte",
    start: "2026-09-28",
    end: "2026-10-09",
    progress: 0.1,
    dependsOn: ["ve-journey"],
  },
  {
    id: "mp-permissions",
    label: "Permissions model",
    group: "Member portal",
    owner: "Leo Nakamura",
    start: "2026-09-10",
    end: "2026-09-25",
    progress: 0.5,
  },
  {
    id: "mp-build",
    label: "Portal build",
    group: "Member portal",
    owner: "Leo Nakamura",
    start: "2026-09-28",
    end: "2026-10-16",
    progress: 0.15,
    dependsOn: ["mp-permissions"],
  },
  {
    id: "mp-launch",
    label: "Member launch",
    group: "Member portal",
    start: "2026-10-16",
    end: "2026-10-16",
    milestone: true,
    dependsOn: ["mp-build"],
  },
];
export function TaskBoard({
  id = "tasks",
  list = false,
}: {
  id?: string;
  list?: boolean;
}) {
  const { tasks: items, setTasks: setItems, projects } = useWorkData();
  const [filter, setFilter] = useState("All work");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const states = ["Planned", "In progress", "In review", "Complete"];
  const fields: FilterField[] = [
    {
      key: "status",
      label: "Status",
      type: "enum",
      options: states.map((value) => ({ value, label: value })),
    },
    {
      key: "priority",
      label: "Priority",
      type: "enum",
      options: ["High", "Normal", "Low"].map((value) => ({
        value,
        label: value,
      })),
    },
    {
      key: "project",
      label: "Project",
      type: "enum",
      options: projects.map((project) => ({
        value: project.client,
        label: project.name,
      })),
    },
  ];
  const shown = applyFilters(
    items.filter(
      (task) => filter === "All work" || task.person === team[0].name,
    ),
    filters,
    {
      fields,
      query,
      getSearchText: (task) =>
        `${task.id} ${task.title} ${task.project} ${task.person}`,
    },
  );
  const change = (taskId: string, status: string) =>
    setItems((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status } : task)),
    );
  const cards: KanbanCard[] = shown.map((task) => ({
    id: task.id,
    title: task.title,
    column: task.status,
    labels: [task.project],
    priority:
      task.priority === "Normal"
        ? "medium"
        : (task.priority.toLowerCase() as "high" | "low"),
    assignees: [
      {
        name: task.person,
        image: `/assets/overtrue/people/${team.find((person) => person.name === task.person)?.id ?? "guest"}.svg`,
      },
    ],
    meta: (
      <>
        <span>{task.id}</span>
        <span>{task.due}</span>
      </>
    ),
  }));
  return (
    <Scene
      id={id}
      title={list ? "Work queue" : "Project board"}
      description="Plan the next step, assign an owner, and keep delivery moving."
      actions={
        <Action primary onClick={() => setAdding(!adding)}>
          Add task
        </Action>
      }
    >
      <div className="scene-page-tabs">
        <Link to="/tasks" aria-current={!list ? "page" : undefined}>
          Board
        </Link>
        <Link to="/tasks-list" aria-current={list ? "page" : undefined}>
          List
        </Link>
        <Link to="/sortable">Priorities</Link>
        <span className="scene-tabs-context">
          {items.filter((task) => task.status !== "Complete").length} open ·{" "}
          {items.filter((task) => task.status === "Complete").length} completed
        </span>
      </div>
      <div className="scene-toolbar">
        <FilterTabs
          items={["All work", "Assigned to me"]}
          value={filter}
          onChange={setFilter}
        />
        <span>{shown.length} tasks</span>
      </div>
      <FilterBar
        className="mb-5"
        fields={fields}
        filters={filters}
        onFiltersChange={setFilters}
        query={query}
        searchPlaceholder="Search tasks…"
        onQueryChange={(value) =>
          setParams(
            (current) => {
              const next = new URLSearchParams(current);
              if (value) next.set("q", value);
              else next.delete("q");
              return next;
            },
            { replace: true },
          )
        }
      />
      {adding && (
        <form
          className="scene-compose"
          onSubmit={(event) => {
            event.preventDefault();
            if (!title.trim()) return;
            setItems((current) => [
              ...current,
              {
                ...initialTasks[0],
                id: `WK-${Math.max(...current.map((task) => Number(task.id.replace(/\D/g, "")))) + 1}`,
                title: title.trim(),
                status: "Planned",
              },
            ]);
            setTitle("");
            setAdding(false);
          }}
        >
          <label>
            Task title
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs to happen next?"
            />
          </label>
          <Action type="submit" primary>
            Create task
          </Action>
          <Action onClick={() => setAdding(false)}>Cancel</Action>
        </form>
      )}
      {selected.length > 0 && list && (
        <div className="scene-selection-bar">
          <span>{selected.length} selected</span>
          <Action
            onClick={() => {
              setItems((current) =>
                current.map((task) =>
                  selected.includes(task.id)
                    ? { ...task, status: "Complete" }
                    : task,
                ),
              );
              setSelected([]);
            }}
          >
            Mark complete
          </Action>
          <Action onClick={() => setSelected([])}>Clear selection</Action>
        </div>
      )}
      {list ? (
        <SceneCard className="scene-table-card">
          <div
            className="scene-table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Work queue, scroll to see all columns"
          >
            <table className="scene-table scene-task-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      aria-label="Select all tasks"
                      checked={
                        shown.length > 0 &&
                        shown.every((task) => selected.includes(task.id))
                      }
                      onChange={(event) =>
                        setSelected(
                          event.target.checked
                            ? shown.map((task) => task.id)
                            : [],
                        )
                      }
                    />
                  </th>
                  <th>Task</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select ${task.id}`}
                        checked={selected.includes(task.id)}
                        onChange={(event) =>
                          setSelected((current) =>
                            event.target.checked
                              ? [...current, task.id]
                              : current.filter((id) => id !== task.id),
                          )
                        }
                      />
                    </td>
                    <td>
                      <strong>{task.title}</strong>
                      <small>
                        {task.id} · {task.project}
                      </small>
                    </td>
                    <td>
                      <Person name={task.person} />
                    </td>
                    <td>
                      <Pill>{task.priority}</Pill>
                    </td>
                    <td>
                      <span className="scene-select">
                        <select
                          aria-label={`Status of ${task.id}`}
                          value={task.status}
                          onChange={(event) =>
                            change(task.id, event.target.value)
                          }
                        >
                          {states.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                        <IconChevronDown aria-hidden="true" stroke={1.5} />
                      </span>
                    </td>
                    <td>{task.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="scene-table-summary">
            <span>{shown.length} tasks in this view</span>
            <span>Changes stay with your workspace session</span>
          </div>
        </SceneCard>
      ) : (
        <div className="scene-work-board">
          <KanbanBoard
            columns={states.map((status, index) => ({
              id: status,
              title: status,
              limit: index === 1 ? 4 : undefined,
            }))}
            cards={cards}
            onMove={(card, _from, to) => change(card.id, to)}
            columnWidth={248}
            onAddCard={() => setAdding(true)}
          />
        </div>
      )}
      {!shown.length && (
        <div className="scene-empty-search">
          <h3>No tasks match this view</h3>
          <p>Try another search or clear your filters.</p>
          <Action
            onClick={() => {
              setFilters([]);
              setParams({});
              setFilter("All work");
            }}
          >
            Clear filters
          </Action>
        </div>
      )}
    </Scene>
  );
}
export function PriorityQueue() {
  const { tasks, setTasks } = useWorkData();
  const items = tasks.filter((task) => task.status !== "Complete");
  const move = (index: number, delta: number) => {
    const next = [...items];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setTasks([...next, ...tasks.filter((task) => task.status === "Complete")]);
  };
  return (
    <Scene
      id="sortable"
      title="Weekly priorities"
      description="Agree the order of work before filling the team’s capacity."
    >
      <div className="scene-page-tabs">
        <Link to="/tasks">Board</Link>
        <Link to="/tasks-list">List</Link>
        <span aria-current="page">Priorities</span>
        <span className="scene-tabs-context">Week of September 21</span>
      </div>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <SceneCard
            title="This week’s focus"
            description="Move tasks to set the order for your team."
          >
            {items.map((task, index) => (
              <div className="scene-priority" key={task.id}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <div>
                  <strong>{task.title}</strong>
                  <small>
                    {task.project} · {task.person}
                  </small>
                </div>
                <Action disabled={index === 0} onClick={() => move(index, -1)}>
                  Move up
                </Action>
                <Action
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                >
                  Move down
                </Action>
              </div>
            ))}
            {!items.length && (
              <p>All tasks are complete. Add new work from the board.</p>
            )}
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <TeamWorkload members={workload.slice(0, 4)} />
          <SceneCard title="Before adding more work">
            <p>
              Leo is 4 hours over capacity. Move a handover or review to another
              owner before taking on a new delivery.
            </p>
            <Go to="/users">Review the team</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
