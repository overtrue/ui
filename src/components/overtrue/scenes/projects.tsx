import { ProjectPortfolio } from "@/registry/overtrue/project-portfolio";
import { GanttChart, type GanttTask } from "@/registry/overtrue/gantt-chart";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IconChevronDown } from "@tabler/icons-react";
import { projects, tasks as initialTasks, team } from "@/data/workspace/studio";
import {
  Scene,
  SceneCard,
  SearchField,
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
  return (
    <Scene
      id={id}
      title={title}
      description="Thoughtful work for people building something useful."
      actions={
        <Go to="/wizard" primary>
          New project
        </Go>
      }
    >
      <ProjectPortfolio
        description="6 projects · September 2026"
        projects={projects.map((project) => ({
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
          href: "#/tasks-list",
        }))}
      />
      <GanttChart
        className="scene-delivery-plan"
        title="Delivery plan"
        description="Milestones across active projects, September to November"
        today="2026-09-21"
        defaultZoom="week"
        tasks={deliveryPlan}
      />
    </Scene>
  );
}

const deliveryPlan: GanttTask[] = [
  { id: "ce-design", label: "Identity system", group: "Ceramics identity", owner: "June Park", start: "2026-08-31", end: "2026-09-18", progress: 1 },
  { id: "ce-handover", label: "Handover package", group: "Ceramics identity", owner: "June Park", start: "2026-09-19", end: "2026-09-28", progress: 0.7, dependsOn: ["ce-design"] },
  { id: "ce-done", label: "Client sign-off", group: "Ceramics identity", start: "2026-09-28", end: "2026-09-28", milestone: true, dependsOn: ["ce-handover"] },
  { id: "ve-research", label: "Visitor research", group: "Visitor experience", owner: "Maya Okafor", start: "2026-09-01", end: "2026-09-16", progress: 1 },
  { id: "ve-journey", label: "Arrival journey", group: "Visitor experience", owner: "Maya Okafor", start: "2026-09-17", end: "2026-09-25", progress: 0.6, dependsOn: ["ve-research"] },
  { id: "ve-wayfinding", label: "Wayfinding concepts", group: "Visitor experience", owner: "Ines Duarte", start: "2026-09-28", end: "2026-10-09", progress: 0.1, dependsOn: ["ve-journey"] },
  { id: "mp-permissions", label: "Permissions model", group: "Member portal", owner: "Leo Nakamura", start: "2026-09-10", end: "2026-09-25", progress: 0.5 },
  { id: "mp-build", label: "Portal build", group: "Member portal", owner: "Leo Nakamura", start: "2026-09-28", end: "2026-10-16", progress: 0.15, dependsOn: ["mp-permissions"] },
  { id: "mp-launch", label: "Member launch", group: "Member portal", start: "2026-10-16", end: "2026-10-16", milestone: true, dependsOn: ["mp-build"] },
];
export function TaskBoard({
  id = "tasks",
  list = false,
}: {
  id?: string;
  list?: boolean;
}) {
  const [items, setItems] = useState(initialTasks),
    [filter, setFilter] = useState("All work"),
    [adding, setAdding] = useState(false),
    [title, setTitle] = useState("");
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const setQuery = (value: string) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set("q", value);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  };
  const shown = items.filter(
    (t) =>
      `${t.id} ${t.title} ${t.project}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()) &&
      (filter === "All work" || t.person === team[0].name),
  );
  const change = (id: string, status: string) =>
    setItems(items.map((t) => (t.id === id ? { ...t, status } : t)));
  return (
    <Scene
      id={id}
      title={list ? "Work queue" : "Project board"}
      description="A shared view of the next step, who owns it, and when it is due."
      actions={
        <Action primary onClick={() => setAdding(!adding)}>
          Add task
        </Action>
      }
    >
      <div className="scene-toolbar">
        <FilterTabs
          items={["All work", "Assigned to me"]}
          value={filter}
          onChange={setFilter}
        />
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search tasks…"
        />
      </div>
      {adding && (
        <form
          className="scene-compose"
          onSubmit={(e) => {
            e.preventDefault();
            setItems([
              ...items,
              {
                ...initialTasks[0],
                id: `WK-${188 + items.length}`,
                title,
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
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to happen next?"
            />
          </label>
          <Action type="submit" primary>
            Create task
          </Action>
        </form>
      )}
      {list ? (
        <SceneCard className="scene-card-table">
          <div
            className="scene-table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Work queue, scroll to see all columns"
          >
            <table className="scene-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <strong>{t.title}</strong>
                      <small>
                        {t.id} · {t.project}
                      </small>
                    </td>
                    <td>
                      <Person name={t.person} />
                    </td>
                    <td>
                      <span className="scene-select">
                        <select
                          aria-label={`Status of ${t.id}`}
                          value={t.status}
                          onChange={(e) => change(t.id, e.target.value)}
                        >
                          {[
                            "Planned",
                            "In progress",
                            "In review",
                            "Complete",
                          ].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                        <IconChevronDown aria-hidden="true" stroke={1.5} />
                      </span>
                    </td>
                    <td>{t.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SceneCard>
      ) : (
        <div className="scene-board">
          {["Planned", "In progress", "In review", "Complete"].map((status) => (
            <section key={status} data-status={status}>
              <header>
                <h2>{status}</h2>
                <span>{shown.filter((t) => t.status === status).length}</span>
              </header>
              {shown
                .filter((t) => t.status === status)
                .map((t) => (
                  <article className="scene-task" key={t.id}>
                    <div className="scene-toolbar">
                      <small>{t.id}</small>
                      <Pill>{t.priority}</Pill>
                    </div>
                    <h3>{t.title}</h3>
                    <p>{t.project}</p>
                    <Person name={t.person} />
                    <div className="scene-toolbar">
                      <small>{t.due}</small>
                      <span className="scene-select">
                        <select
                          aria-label={`Status of ${t.id}`}
                          value={t.status}
                          onChange={(e) => change(t.id, e.target.value)}
                        >
                          {[
                            "Planned",
                            "In progress",
                            "In review",
                            "Complete",
                          ].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                        <IconChevronDown aria-hidden="true" stroke={1.5} />
                      </span>
                    </div>
                  </article>
                ))}
            </section>
          ))}
        </div>
      )}
      {!shown.length && (
        <p className="scene-empty">No tasks match this search.</p>
      )}
    </Scene>
  );
}
export function PriorityQueue() {
  const [items, setItems] = useState(
    initialTasks.filter((t) => t.status !== "Complete"),
  );
  const move = (i: number, delta: number) => {
    const next = [...items];
    [next[i], next[i + delta]] = [next[i + delta], next[i]];
    setItems(next);
  };
  return (
    <Scene
      id="sortable"
      title="Weekly priorities"
      description="Order the work together before the week begins. Use the arrow controls to change the sequence."
    >
      <SceneCard title="This week’s focus">
        {items.map((t, i) => (
          <div className="scene-priority" key={t.id}>
            <b>{String(i + 1).padStart(2, "0")}</b>
            <div>
              <strong>{t.title}</strong>
              <small>
                {t.project} · {t.person}
              </small>
            </div>
            <Action disabled={i === 0} onClick={() => move(i, -1)}>
              Move up
            </Action>
            <Action
              disabled={i === items.length - 1}
              onClick={() => move(i, 1)}
            >
              Move down
            </Action>
          </div>
        ))}
      </SceneCard>
    </Scene>
  );
}
