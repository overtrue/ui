import { NavLink } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  IconBriefcase,
  IconFileText,
  IconFolder,
  IconLayoutGrid,
  IconMail,
  IconPalette,
  IconSettings,
  IconUsers,
  IconBrandGithub,
  IconBrandFigma,
  IconBrandSlack,
  IconCreditCard,
} from "@tabler/icons-react";
import { useWorkData } from "../workspace/work-data";
import { team, documents } from "@/data/workspace/studio";
import { projectActivity } from "@/data/workspace/operations";
import { AuditTrail } from "@/registry/overtrue/audit-trail";
import { AvatarStack } from "@/registry/overtrue/avatar-stack";
import {
  IntegrationList,
  type Integration,
} from "@/registry/overtrue/integration-list";
import { SettingsSection } from "@/registry/overtrue/settings-section";
import { TaskChecklist } from "@/registry/overtrue/task-checklist";
import { DetailList } from "@/registry/overtrue/detail-list";
import { TreeView } from "@/registry/overtrue/tree-view";
import {
  Scene,
  SceneCard,
  Action,
  Go,
  Person,
  Pill,
  SearchField,
  FilterTabs,
  DownloadButton,
} from "./shared";

export function ProjectMembers() {
  const [members, setMembers] = useState(team.slice(0, 4).map((p) => p.id));
  const [query, setQuery] = useState("");
  const selected = team.filter((p) => members.includes(p.id));
  return (
    <Scene
      id="avatars"
      title="Project team"
      description="Visitor experience · Manage the people who can contribute to this project."
      actions={<Go to="/users">Workspace directory</Go>}
    >
      <div className="scene-product-grid">
        <SceneCard
          title="Contributors"
          description={`${members.length} people have project access`}
          action={
            <AvatarStack
              members={selected.map((p) => ({
                id: p.id,
                name: p.name,
                image: `/assets/overtrue/people/${p.id}.svg`,
              }))}
            />
          }
        >
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Find a teammate"
          />
          <div className="scene-record-list">
            {team
              .filter((p) =>
                `${p.name} ${p.discipline}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((p) => (
                <div key={p.id}>
                  <Person name={p.name} subtitle={p.discipline} />
                  <button
                    className="scene-button"
                    aria-pressed={members.includes(p.id)}
                    onClick={() =>
                      setMembers((current) =>
                        current.includes(p.id)
                          ? current.filter((id) => id !== p.id)
                          : [...current, p.id],
                      )
                    }
                  >
                    {members.includes(p.id) ? "Remove" : "Add to project"}
                  </button>
                </div>
              ))}
          </div>
        </SceneCard>
        <aside className="scene-product-aside">
          <SceneCard title="Project access">
            <p>
              Contributors can edit files, comment on work, and update assigned
              tasks.
            </p>
            <DetailList
              items={[
                { id: "owner", label: "Project owner", value: "Maya Okafor" },
                { id: "visibility", label: "Visibility", value: "Invite only" },
                {
                  id: "guests",
                  label: "Client guests",
                  value: "Review links only",
                },
              ]}
            />
            <Go to="/settings">Workspace permissions</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

export function StatusRegister() {
  const { projects } = useWorkData();
  const [filter, setFilter] = useState("All projects");
  const statuses = [...new Set(projects.map((p) => p.status))];
  const visible = projects.filter(
    (p) => filter === "All projects" || p.status === filter,
  );
  return (
    <Scene
      id="badges"
      title="Delivery status"
      description="Review project health and open the work that needs attention."
      actions={<Go to="/tasks">Open work board</Go>}
    >
      <div className="scene-page-tabs">
        <FilterTabs
          items={["All projects", ...statuses]}
          value={filter}
          onChange={setFilter}
        />
      </div>
      <div className="scene-product-grid">
        <SceneCard
          title={`${visible.length} projects`}
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
                  <th>Project</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Milestone</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <a href={`#/datagrid?project=${p.id}`}>{p.name}</a>
                      <small>{p.client}</small>
                    </td>
                    <td>{p.owner}</td>
                    <td>
                      <Pill>{p.status}</Pill>
                    </td>
                    <td>{p.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SceneCard>
        <SceneCard title="Status definitions">
          <div className="scene-note-list">
            {[
              [
                "In progress",
                "Work is underway with an agreed scope and owner.",
              ],
              [
                "In review",
                "Feedback or approval is needed before the next milestone.",
              ],
              ["Planned", "Scope is agreed; the team has not started yet."],
              ["Complete", "The final handover is accepted."],
            ].map(([status, copy]) => (
              <div key={status}>
                <Pill>{status}</Pill>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </SceneCard>
      </div>
    </Scene>
  );
}

export function WorkspaceConnections({ id = "social-icons" }: { id?: string }) {
  const payments = id === "payment-providers";
  const [connections, setConnections] = useState<Integration[]>(
    payments
      ? [
          {
            id: "card",
            name: "Card payments",
            description: "Accept invoice payments by credit or debit card.",
            connected: true,
            account: "Test account · USD",
            icon: <IconCreditCard />,
          },
          {
            id: "bank",
            name: "Bank transfer",
            description: "Include transfer instructions on approved invoices.",
            connected: true,
            account: "USD account ending 4821",
          },
          {
            id: "wallet",
            name: "Digital wallets",
            description: "Offer supported wallets at checkout.",
            connected: false,
          },
        ]
      : [
          {
            id: "figma",
            name: "Figma",
            description:
              "Attach design files and review links to project work.",
            connected: true,
            account: "Acme Studio",
            icon: <IconBrandFigma />,
          },
          {
            id: "github",
            name: "GitHub",
            description: "Link pull requests and releases to delivery tasks.",
            connected: true,
            account: "acme-studio",
            icon: <IconBrandGithub />,
          },
          {
            id: "slack",
            name: "Slack",
            description: "Send project activity to a shared team channel.",
            connected: false,
            icon: <IconBrandSlack />,
          },
        ],
  );
  return (
    <Scene
      id={id}
      title={payments ? "Payment methods" : "Connected apps"}
      description={
        payments
          ? "Configure the options shown on client invoices."
          : "Keep design, delivery, and team conversations connected."
      }
    >
      <nav className="scene-page-tabs">
        <NavLink end to="/settings">
          General
        </NavLink>
        <NavLink end to="/social-icons">
          Connected apps
        </NavLink>
        <NavLink end to="/payment-providers">
          Payments
        </NavLink>
      </nav>
      <div className="scene-product-grid">
        <IntegrationList
          integrations={connections}
          onConnectionChange={(key, connected) =>
            setConnections((items) =>
              items.map((item) =>
                item.id === key ? { ...item, connected } : item,
              ),
            )
          }
        />
        <aside className="scene-product-aside">
          <SceneCard
            title={payments ? "Settlement details" : "Connection permissions"}
          >
            <DetailList
              items={
                payments
                  ? [
                      { id: "currency", label: "Currency", value: "USD" },
                      {
                        id: "schedule",
                        label: "Payout schedule",
                        value: "Weekly",
                      },
                      { id: "mode", label: "Environment", value: "Test mode" },
                    ]
                  : [
                      {
                        id: "owner",
                        label: "Managed by",
                        value: "Workspace admins",
                      },
                      {
                        id: "access",
                        label: "Project access",
                        value: "Selected projects",
                      },
                      {
                        id: "mode",
                        label: "Environment",
                        value: "Demo connections",
                      },
                    ]
              }
            />
            <p>
              {payments
                ? "These payment settings are a local preview. No payment processor is connected."
                : "Connection changes are saved for this page preview. No external accounts are linked."}
            </p>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

const regions = [
  {
    id: "gb",
    name: "United Kingdom",
    flag: "🇬🇧",
    zone: "Europe/London",
    currency: "GBP",
    language: "English",
    enabled: true,
  },
  {
    id: "us",
    name: "United States",
    flag: "🇺🇸",
    zone: "America/New_York",
    currency: "USD",
    language: "English",
    enabled: true,
  },
  {
    id: "de",
    name: "Germany",
    flag: "🇩🇪",
    zone: "Europe/Berlin",
    currency: "EUR",
    language: "German",
    enabled: true,
  },
  {
    id: "jp",
    name: "Japan",
    flag: "🇯🇵",
    zone: "Asia/Tokyo",
    currency: "JPY",
    language: "Japanese",
    enabled: false,
  },
  {
    id: "cn",
    name: "China",
    flag: "🇨🇳",
    zone: "Asia/Shanghai",
    currency: "CNY",
    language: "Chinese",
    enabled: false,
  },
];
export function RegionalSettings() {
  const [markets, setMarkets] = useState(regions);
  const [defaultMarket, setDefaultMarket] = useState("gb");
  const [saved, setSaved] = useState("");
  return (
    <Scene
      id="flags"
      title="Regions & languages"
      description="Set the markets available to your client portal."
    >
      <div className="scene-product-grid">
        <SceneCard
          title="Supported markets"
          description="Enable a market before choosing it as the default."
        >
          <div className="scene-record-list">
            {markets.map((m) => (
              <div key={m.id}>
                <span className="scene-country" aria-hidden="true">
                  {m.flag}
                </span>
                <div className="scene-record-copy">
                  <strong>{m.name}</strong>
                  <small>
                    {m.language} · {m.currency}
                  </small>
                </div>
                <label className="scene-toggle-row">
                  <span className="sr-only">Enable {m.name}</span>
                  <input
                    type="checkbox"
                    checked={m.enabled}
                    disabled={m.id === defaultMarket}
                    onChange={(e) => {
                      setSaved("");
                      setMarkets((items) =>
                        items.map((item) =>
                          item.id === m.id
                            ? { ...item, enabled: e.target.checked }
                            : item,
                        ),
                      );
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </SceneCard>
        <SceneCard title="Portal defaults">
          <form
            className="scene-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved("Regional preferences saved in this preview.");
            }}
          >
            <label>
              Default market
              <select
                value={defaultMarket}
                onChange={(e) => {
                  setDefaultMarket(e.target.value);
                  setSaved("");
                }}
              >
                {markets
                  .filter((m) => m.enabled)
                  .map((m) => (
                    <option value={m.id} key={m.id}>
                      {m.name}
                    </option>
                  ))}
              </select>
            </label>
            <DetailList
              items={[
                {
                  id: "zone",
                  label: "Time zone",
                  value: markets.find((m) => m.id === defaultMarket)?.zone,
                },
                {
                  id: "date",
                  label: "Date format",
                  value: defaultMarket === "us" ? "MM/DD/YYYY" : "DD/MM/YYYY",
                },
              ]}
            />
            <Action type="submit" primary>
              Save preferences
            </Action>
            <p role="status">{saved}</p>
          </form>
        </SceneCard>
      </div>
    </Scene>
  );
}

const workspaceIcons = [
  { name: "Projects", icon: IconBriefcase },
  { name: "Files", icon: IconFolder },
  { name: "Documents", icon: IconFileText },
  { name: "Inbox", icon: IconMail },
  { name: "Team", icon: IconUsers },
  { name: "Design", icon: IconPalette },
  { name: "Workspace", icon: IconLayoutGrid },
  { name: "Settings", icon: IconSettings },
];
export function WorkspaceIdentity({ id = "icons" }: { id?: string }) {
  const [icon, setIcon] = useState("Projects");
  const [color, setColor] = useState("#4263eb");
  const [pattern, setPattern] = useState("Plain");
  const [name, setName] = useState("Visitor experience");
  const [saved, setSaved] = useState(false);
  const Icon = workspaceIcons.find((item) => item.name === icon)!.icon;
  const mode =
    id === "patterns"
      ? "Cover pattern"
      : id === "colors"
        ? "Project colors"
        : "Project identity";
  return (
    <Scene
      id={id}
      title={mode}
      description="Give project spaces a recognizable identity across the workspace."
    >
      <div className="scene-product-grid">
        <SceneCard title="Appearance">
          <form
            className="scene-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
            onChange={() => setSaved(false)}
          >
            <SettingsSection
              title="Project name"
              description="Shown in navigation, notifications, and shared links."
            >
              <label className="scene-field">
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={60}
                />
              </label>
            </SettingsSection>
            <SettingsSection
              title="Project icon"
              description="Choose a symbol the team can recognize at small sizes."
            >
              <div className="scene-icon-options">
                {workspaceIcons.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    aria-label={item.name}
                    aria-pressed={icon === item.name}
                    onClick={() => {
                      setIcon(item.name);
                      setSaved(false);
                    }}
                  >
                    <item.icon size={23} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </SettingsSection>
            <SettingsSection
              title="Accent color"
              description="Used for the project icon and cover edge."
            >
              <div className="scene-swatch-options">
                {[
                  "#4263eb",
                  "#14836b",
                  "#9b4d20",
                  "#7953ab",
                  "#b53c65",
                  "#5c6c80",
                ].map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-label={`Use ${value}`}
                    aria-pressed={color === value}
                    style={{ background: value }}
                    onClick={() => {
                      setColor(value);
                      setSaved(false);
                    }}
                  />
                ))}
              </div>
            </SettingsSection>
            {id === "patterns" && (
              <SettingsSection
                title="Cover texture"
                description="A subtle texture for this project's cover."
              >
                <FilterTabs
                  items={["Plain", "Dots", "Grid"]}
                  value={pattern}
                  onChange={(value) => {
                    setPattern(value);
                    setSaved(false);
                  }}
                />
              </SettingsSection>
            )}
            <div className="scene-actions">
              <Action type="submit" primary>
                Save appearance
              </Action>
              <span role="status">
                {saved ? "Appearance saved in this preview." : ""}
              </span>
            </div>
          </form>
        </SceneCard>
        <aside className="scene-product-aside">
          <SceneCard title="Project preview">
            <div
              className={`scene-identity-cover is-${pattern.toLowerCase()}`}
              style={{ borderTopColor: color }}
            >
              <span style={{ color }}>
                <Icon size={34} />
              </span>
            </div>
            <h3>{name || "Untitled project"}</h3>
            <p>Culture venue · Client project</p>
            <Pill>In progress</Pill>
            <div className="scene-record-list">
              <div>
                <Person name="Maya Okafor" subtitle="Project owner" />
              </div>
            </div>
          </SceneCard>
          <SceneCard title="Where it appears">
            <p>
              Your project identity appears in the sidebar, project cards, and
              activity feed. Status colors stay consistent across all projects.
            </p>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

export function ReviewBrief({ id = "accordion" }: { id?: string }) {
  const [tab, setTab] = useState("Brief");
  const [checks, setChecks] = useState([false, false, false]);
  const sections = [
    [
      "Objective",
      "Create a welcoming arrival journey that helps first-time visitors find the right exhibition without asking for directions.",
    ],
    [
      "Deliverables",
      "Entrance signage, a visitor map, and a reusable family of directional signs. Deliver editable source files and print-ready PDFs.",
    ],
    [
      "Review criteria",
      "Legible from five metres, readable in low light, and consistent with the venue’s existing visual identity. Test the visitor map with six first-time guests.",
    ],
    [
      "Scope & dependencies",
      "The venue team provides floor plans and confirms accessibility requirements. Fabrication and installation are outside this design scope.",
    ],
  ];
  return (
    <Scene
      id={id}
      title="Visitor experience"
      description="Project brief · Version 3 · Updated September 21, 2026"
      actions={<Go to="/datagrid">Project details</Go>}
    >
      <div className="scene-page-tabs">
        <FilterTabs
          items={["Brief", "Checklist", "Activity"]}
          value={tab}
          onChange={setTab}
        />
      </div>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          {tab === "Brief" ? (
            <SceneCard title="Agreed scope">
              <div className="scene-brief-sections">
                {sections.map(([title, copy], i) =>
                  id === "accordion" ? (
                    <details key={title} open={i === 0}>
                      <summary>{title}</summary>
                      <p>{copy}</p>
                    </details>
                  ) : (
                    <section key={title}>
                      <h3>{title}</h3>
                      <p>{copy}</p>
                    </section>
                  ),
                )}
              </div>
            </SceneCard>
          ) : tab === "Checklist" ? (
            <TaskChecklist
              title="Before the client review"
              items={[
                "Confirm accessibility requirements",
                "Attach concept presentation",
                "Share the review agenda",
              ].map((title, i) => ({
                id: String(i),
                title,
                checked: checks[i],
              }))}
              onCheckedChange={(key, checked) =>
                setChecks((items) =>
                  items.map((value, i) =>
                    String(i) === key ? checked : value,
                  ),
                )
              }
            />
          ) : (
            <AuditTrail events={projectActivity} />
          )}
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Review details">
            <Person name="Maya Okafor" subtitle="Project owner" />
            <DetailList
              items={[
                { id: "client", label: "Client", value: "Culture venue" },
                { id: "review", label: "Next review", value: "September 25" },
                { id: "stage", label: "Stage", value: <Pill>In review</Pill> },
              ]}
            />
            <Go to="/fullcalendar">Review schedule</Go>
          </SceneCard>
          <SceneCard title="Supporting documents">
            <div className="scene-note-list">
              {documents.slice(0, 3).map((doc, i) => (
                <div key={i}>
                  <a href={`#/prose?guide=${i}`}>{doc.title}</a>
                </div>
              ))}
            </div>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

export function WorkCollections({ id = "lists" }: { id?: string }) {
  const { tasks, setTasks, projects } = useWorkData();
  const [project, setProject] = useState(projects[0].client);
  const [query, setQuery] = useState("");
  const filtered = tasks.filter(
    (t) =>
      t.project === project &&
      t.title.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Scene
      id={id}
      title={id === "navigation" ? "Project explorer" : "My work collections"}
      description="Browse a project and work through its next deliverables."
      actions={<Go to="/cards">All projects</Go>}
    >
      <div className="scene-explorer-grid">
        <SceneCard title="Projects">
          <TreeView
            nodes={projects.map((p) => ({
              id: p.client,
              label: p.name,
              icon: <IconFolder size={17} />,
              badge: tasks.filter((t) => t.project === p.client).length,
            }))}
            selected={[project]}
            onSelect={(node) => setProject(node.id)}
          />
        </SceneCard>
        <div className="scene-product-primary">
          <SceneCard
            title={projects.find((p) => p.client === project)?.name}
            action={<Pill>{filtered.length} tasks</Pill>}
          >
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search project tasks"
            />
          </SceneCard>
          <TaskChecklist
            title="Deliverables"
            items={filtered.map((t) => ({
              id: t.id,
              title: t.title,
              description: t.project,
              meta: t.due,
              checked: t.status === "Complete",
            }))}
            onCheckedChange={(key, checked) =>
              setTasks((items) =>
                items.map((t) =>
                  t.id === key
                    ? { ...t, status: checked ? "Complete" : "In progress" }
                    : t,
                ),
              )
            }
          />
          <AuditTrail
            events={projectActivity.slice(0, 3)}
            label="Recent project activity"
          />
        </div>
      </div>
    </Scene>
  );
}

export function ProjectRegister({ id = "tables" }: { id?: string }) {
  const { projects } = useWorkData();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("name");
  const [selected, setSelected] = useState<string[]>([]);
  const rows = useMemo(
    () =>
      projects
        .filter((p) =>
          `${p.name} ${p.client}`.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "budget"
            ? b.budget - a.budget
            : a.name.localeCompare(b.name),
        ),
    [projects, query, sort],
  );
  const pageSize = id === "pagination" ? 3 : 6;
  const currentPage = Math.min(
    page,
    Math.max(0, Math.ceil(rows.length / pageSize) - 1),
  );
  const visible = rows.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );
  return (
    <Scene
      id={id}
      title="Project register"
      description="A searchable record of project owners, budgets, and delivery dates."
      actions={
        <DownloadButton
          name="projects"
          rows={[
            ["Project", "Client", "Owner", "Budget", "Status"],
            ...rows
              .filter((p) => !selected.length || selected.includes(p.id))
              .map((p) => [
                p.name,
                p.client,
                p.owner,
                String(p.budget),
                p.status,
              ]),
          ]}
        />
      }
    >
      <SceneCard
        title="Projects"
        description={`${rows.length} records`}
        className="scene-table-card"
      >
        <div className="scene-register-toolbar">
          <SearchField
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(0);
            }}
            placeholder="Search projects or clients"
          />
          <label>
            Sort by
            <select
              className="scene-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="name">Project name</option>
              <option value="budget">Budget · highest first</option>
            </select>
          </label>
        </div>
        <div
          className="scene-table-wrap"
          tabIndex={0}
          role="region"
          aria-label="Scrollable records"
        >
          <table className="scene-table">
            <thead>
              <tr>
                <th>
                  <span className="sr-only">Select</span>
                </th>
                <th>Project</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Delivery</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select ${p.name}`}
                      checked={selected.includes(p.id)}
                      onChange={(e) =>
                        setSelected((items) =>
                          e.target.checked
                            ? [...items, p.id]
                            : items.filter((key) => key !== p.id),
                        )
                      }
                    />
                  </td>
                  <td>
                    <a href={`#/datagrid?project=${p.id}`}>{p.name}</a>
                    <small>{p.client}</small>
                  </td>
                  <td>{p.owner}</td>
                  <td>
                    <Pill>{p.status}</Pill>
                  </td>
                  <td>${p.budget.toLocaleString()}</td>
                  <td>{p.due}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={6}>No projects match “{query}”.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="scene-table-summary">
          <span>
            {rows.length ? currentPage * pageSize + 1 : 0}–
            {Math.min((currentPage + 1) * pageSize, rows.length)} of{" "}
            {rows.length}
          </span>
          <div className="scene-actions">
            <Action
              disabled={!currentPage}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </Action>
            <Action
              disabled={(currentPage + 1) * pageSize >= rows.length}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </Action>
          </div>
        </div>
      </SceneCard>
    </Scene>
  );
}
