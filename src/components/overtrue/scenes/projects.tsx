import { ProjectPortfolio } from "@/registry/overtrue/project-portfolio";
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
    </Scene>
  );
}
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
            <section key={status}>
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
