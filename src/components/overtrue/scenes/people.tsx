import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { TeamWorkload } from "@/registry/overtrue/team-workload";
import { AuditTrail } from "@/registry/overtrue/audit-trail";
import { DetailList } from "@/registry/overtrue/detail-list";
import { workload, projectActivity } from "@/data/workspace/operations";
import { useWorkData } from "../workspace/work-data";
import { team } from "@/data/workspace/studio";
import {
  Scene,
  SceneCard,
  Avatar,
  Invite,
  SearchField,
  Pill,
  Go,
  Progress,
  Action,
  Person,
  FilterTabs,
} from "./shared";
export function People() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("Directory");
  const [role, setRole] = useState("All members");
  const shown = team.filter(
    (person) =>
      (role === "All members" || person.role === role) &&
      `${person.name} ${person.discipline} ${person.location}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <Scene
      id="users"
      title="People"
      description="Find the right person, understand their role, and plan work around capacity."
      actions={<Invite />}
    >
      <div className="scene-page-tabs">
        <button
          aria-current={tab === "Directory" ? "page" : undefined}
          onClick={() => setTab("Directory")}
        >
          Directory
        </button>
        <button
          aria-current={tab === "Capacity" ? "page" : undefined}
          onClick={() => setTab("Capacity")}
        >
          Capacity
        </button>
        <Link to="/open-positions">Hiring</Link>
        <span className="scene-tabs-context">8 members · Europe & Asia</span>
      </div>
      <div className="scene-toolbar">
        <FilterTabs
          items={["All members", "Editor", "Member", "Viewer"]}
          value={role}
          onChange={setRole}
        />
        <SearchField
          ref={searchRef}
          value={query}
          onChange={setQuery}
          placeholder="Search people or disciplines…"
        />
      </div>
      {tab === "Directory" ? (
        <SceneCard className="scene-table-card">
          <div
            className="scene-table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Team directory"
          >
            <table className="scene-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Discipline</th>
                  <th>Location</th>
                  <th>Access</th>
                  <th>This week</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((person) => {
                  const allocation = workload.find(
                    (member) => member.id === person.id,
                  )!;
                  return (
                    <tr key={person.id}>
                      <td>
                        <Link to={`/profile?member=${person.id}`}>
                          <Person name={person.name} subtitle={person.email} />
                        </Link>
                      </td>
                      <td>{person.discipline}</td>
                      <td>{person.location}</td>
                      <td>
                        <Pill>{person.role}</Pill>
                      </td>
                      <td>
                        <span
                          className={
                            allocation.allocated > allocation.capacity
                              ? "text-destructive"
                              : ""
                          }
                        >
                          {allocation.allocated} / {allocation.capacity}h
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!shown.length && (
              <div className="scene-empty-search">
                <h3>No members found</h3>
                <p>Try a name, discipline, or city.</p>
                <Action
                  onClick={() => {
                    setQuery("");
                    setRole("All members");
                    searchRef.current?.focus();
                  }}
                >
                  Clear search
                </Action>
              </div>
            )}
          </div>
          <div className="scene-table-summary">
            <span>
              {shown.length} of {team.length} members
            </span>
            <Link to="/settings">Manage access</Link>
          </div>
        </SceneCard>
      ) : (
        <div className="scene-team-capacity">
          <TeamWorkload
            title="Team allocation"
            period="September 21–25"
            members={workload.filter((member) =>
              shown.some((person) => person.id === member.id),
            )}
          />
          <SceneCard title="Capacity planning">
            <Pill>1 over capacity</Pill>
            <h3>Make room before adding work</h3>
            <p>
              Leo is allocated 44 of 40 hours. Review the portal handover and
              move a review to a teammate with available time.
            </p>
            <Go to="/sortable">Weekly priorities</Go>
          </SceneCard>
        </div>
      )}
    </Scene>
  );
}
export function Profile() {
  const [params] = useSearchParams();
  const person =
    team.find((member) => member.id === params.get("member")) ?? team[0];
  const { projects } = useWorkData();
  const [following, setFollowing] = useState<string[]>([]);
  const ownProjects = projects.filter(
    (project) => project.owner === person.name,
  );
  const allocation = workload.find((member) => member.id === person.id)!;
  return (
    <Scene
      id="profile"
      title={person.name}
      description={`${person.discipline} · ${person.location}`}
      actions={
        <Action
          onClick={() =>
            setFollowing((current) =>
              current.includes(person.id)
                ? current.filter((id) => id !== person.id)
                : [...current, person.id],
            )
          }
        >
          {following.includes(person.id)
            ? "Following updates"
            : "Follow updates"}
        </Action>
      }
    >
      <div className="scene-page-tabs">
        <span aria-current="page">Profile</span>
        <Link to="/users">Team directory</Link>
        <span className="scene-tabs-context">
          <Pill>{person.role}</Pill>
        </span>
      </div>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <SceneCard
            title="Current projects"
            description={`${ownProjects.length} directly owned engagements`}
            className="scene-table-card"
          >
            <div
              className="scene-table-wrap"
              tabIndex={0}
              role="region"
              aria-label="Member projects"
            >
              <table className="scene-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {ownProjects.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <Link to={`/datagrid?project=${project.id}`}>
                          <strong>{project.name}</strong>
                        </Link>
                        <small>{project.client}</small>
                      </td>
                      <td>
                        <Pill>{project.status}</Pill>
                      </td>
                      <td>
                        <Progress value={project.progress} />
                      </td>
                      <td>{project.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!ownProjects.length && (
                <p className="scene-empty">
                  {person.name.split(" ")[0]} supports the studio across
                  projects. No directly owned engagements.
                </p>
              )}
            </div>
          </SceneCard>
          <SceneCard title="Recent contributions">
            <AuditTrail
              events={projectActivity.filter(
                (event) => event.actor === person.name,
              )}
            />
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <SceneCard>
            <div className="scene-member-identity">
              <Avatar name={person.name} size={64} />
              <h2>{person.name}</h2>
              <p>{person.discipline}</p>
            </div>
            <DetailList
              items={[
                { id: "email", label: "Email", value: person.email },
                { id: "location", label: "Location", value: person.location },
                {
                  id: "hours",
                  label: "Working hours",
                  value: "09:00–17:00 local",
                },
                { id: "role", label: "Access", value: person.role },
              ]}
            />
          </SceneCard>
          <TeamWorkload title="This week" members={[allocation]} />
        </aside>
      </div>
    </Scene>
  );
}
export function Activity() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Everyone");
  const events = projectActivity.filter(
    (event) =>
      (filter === "Everyone" || event.actor === team[0].name) &&
      `${event.actor} ${event.action} ${event.context}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <Scene
      id="activity"
      title="Activity"
      description="A record of changes, decisions, and deliveries across the workspace."
    >
      <div className="scene-page-tabs">
        <span aria-current="page">Workspace activity</span>
        <Link to="/logs">System events</Link>
        <span className="scene-tabs-context">Monday, September 21</span>
      </div>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <div className="scene-toolbar">
            <FilterTabs
              items={["Everyone", "My activity"]}
              value={filter}
              onChange={setFilter}
            />
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search activity…"
            />
          </div>
          <SceneCard
            title="Today"
            description={`${events.length} updates in this view`}
          >
            <AuditTrail events={events} />
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="In this feed">
            <p>
              Project updates include the person responsible, what changed, and
              when. Open a change to see its previous and current values.
            </p>
            <Go to="/settings">Notification settings</Go>
          </SceneCard>
          <SceneCard title="Next client review">
            <p>
              The Visitor experience concepts are ready. Add your feedback
              before Wednesday’s review.
            </p>
            <Go to="/creative-review">Open review</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
export function Roles() {
  const [selected, setSelected] = useState("Senior product designer");
  const [department, setDepartment] = useState("All departments");
  const roles = [
    {
      title: "Senior product designer",
      team: "Design",
      candidates: 14,
      owner: "Maya Okafor",
      description:
        "Own the design direction on client projects, run useful critiques, and help the team turn research into clear interfaces.",
    },
    {
      title: "Creative developer",
      team: "Engineering",
      candidates: 8,
      owner: "Leo Nakamura",
      description:
        "Build accessible, responsive experiences and collaborate with designers on prototypes and production delivery.",
    },
    {
      title: "Client partner",
      team: "Client services",
      candidates: 6,
      owner: "Samir Haddad",
      description:
        "Guide client relationships from initial scope through handover. Keep decisions, budgets, and delivery expectations clear.",
    },
  ];
  const role = roles.find((item) => item.title === selected)!;
  return (
    <Scene
      id="open-positions"
      title="Open positions"
      description="Hiring pipeline · 3 open roles across the studio"
      actions={<Go to="/users">Team directory</Go>}
    >
      <div className="scene-page-tabs">
        <FilterTabs
          items={[
            "All departments",
            "Design",
            "Engineering",
            "Client services",
          ]}
          value={department}
          onChange={setDepartment}
        />
      </div>
      <div className="scene-product-grid">
        <SceneCard title="Hiring overview" className="scene-table-card">
          <div
            className="scene-table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Scrollable records"
          >
            <table className="scene-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Candidates</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {roles
                  .filter(
                    (item) =>
                      department === "All departments" ||
                      item.team === department,
                  )
                  .map((item) => (
                    <tr key={item.title}>
                      <td>
                        <button
                          className="scene-text-button"
                          aria-pressed={selected === item.title}
                          onClick={() => setSelected(item.title)}
                        >
                          {item.title}
                        </button>
                        <small>Remote, Europe · Full time</small>
                      </td>
                      <td>{item.team}</td>
                      <td>{item.candidates}</td>
                      <td>
                        <Pill>Active</Pill>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </SceneCard>
        <aside className="scene-product-aside">
          <SceneCard title={role.title}>
            <Person name={role.owner} subtitle="Hiring manager" />
            <p>{role.description}</p>
            <DetailList
              items={[
                { id: "location", label: "Location", value: "Remote · Europe" },
                { id: "type", label: "Employment", value: "Full time" },
                {
                  id: "candidates",
                  label: "Candidates",
                  value: String(role.candidates),
                },
              ]}
            />
            <p className="scene-subtle">
              Fictional recruiting records. No applications are collected.
            </p>
          </SceneCard>
          <SceneCard title="Interview process">
            <ol className="scene-process-list">
              <li>Introduction with the hiring manager</li>
              <li>Portfolio or project discussion</li>
              <li>Team conversation</li>
              <li>Reference checks and offer</li>
            </ol>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
