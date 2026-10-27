import { useState } from "react";
import { Link } from "react-router-dom";
import { SettingsSection } from "@/registry/overtrue/settings-section";
import { TeamAccess, type AccessMember } from "@/registry/overtrue/team-access";
import { AuditTrail, type AuditEvent } from "@/registry/overtrue/audit-trail";
import { team } from "@/data/workspace/studio";
import { useWorkData } from "../workspace/work-data";
import { IconCheck } from "@tabler/icons-react";
import { Scene, SceneCard, Action, Go, Pill } from "./shared";
export function Settings({
  id = "settings",
  client = false,
}: {
  id?: string;
  client?: boolean;
}) {
  const { setClients } = useWorkData();
  const defaults = {
    name: client ? "" : "Acme Studio",
    email: client ? "" : "hello@acme.example",
    contact: client ? "" : "Maya Okafor",
    industry: "Design & creative",
    currency: "USD — US Dollar",
    about: client
      ? ""
      : "We help thoughtful organizations turn complex questions into useful experiences.",
    timezone: "Europe / London",
    role: "Member",
  };
  const [tab, setTab] = useState("General");
  const [fields, setFields] = useState(defaults);
  const [notifications, setNotifications] = useState([true, false, true, true]);
  const [twoStep, setTwoStep] = useState(true);
  const [snapshot, setSnapshot] = useState({
    fields: defaults,
    notifications: [true, false, true, true],
    twoStep: true,
  });
  const [saved, setSaved] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [members, setMembers] = useState<AccessMember[]>(
    team.map((person, index) => ({
      id: person.id,
      name: person.name,
      email: person.email,
      image: `/assets/overtrue/people/${person.id}.svg`,
      role: index === 0 ? "Owner" : index === 1 ? "Admin" : "Member",
    })),
  );
  const [audit, setAudit] = useState<AuditEvent[]>([
    {
      id: "workspace-created",
      actor: "Maya Okafor",
      action: "enabled two-step verification",
      time: "September 18, 2026",
      outcome: "success",
    },
  ]);
  const dirty =
    JSON.stringify({ fields, notifications, twoStep }) !==
    JSON.stringify(snapshot);
  const field = (key: keyof typeof fields) => ({
    name: key,
    value: fields[key],
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => setFields((current) => ({ ...current, [key]: event.target.value })),
  });
  return (
    <Scene
      id={id}
      title={client ? "New client" : "Workspace settings"}
      description={
        client
          ? "Create a client record before starting an engagement."
          : "Manage your workspace identity, preferences, and team access."
      }
    >
      {!client && (
        <div className="scene-page-tabs">
          {["General", "Notifications", "Access"].map((label) => (
            <button
              key={label}
              aria-current={tab === label ? "page" : undefined}
              onClick={() => setTab(label)}
            >
              {label}
            </button>
          ))}
          <Link to="/settings-plan">Billing & plan</Link>
        </div>
      )}
      <div className="scene-settings-surface">
        <form
          className="scene-form"
          onChange={() => setSaved(false)}
          onSubmit={(event) => {
            event.preventDefault();
            setSnapshot({ fields, notifications, twoStep });
            setSaved(true);
            if (client) {
              const nextId = clientId ?? `CLIENT-${crypto.randomUUID()}`;
              setClientId(nextId);
              setClients((current) => {
                const record = {
                  id: nextId,
                  name: fields.name.trim(),
                  email: fields.email,
                  contact: fields.contact.trim(),
                  stage: "Onboarding",
                  value: 0,
                };
                return current.some((item) => item.id === nextId)
                  ? current.map((item) => (item.id === nextId ? record : item))
                  : [...current, record];
              });
            }
          }}
        >
          {tab === "General" || client ? (
            <>
              <SettingsSection
                title={client ? "Company details" : "Workspace identity"}
                description={
                  client
                    ? "The name and industry shown on projects and invoices."
                    : "Your team sees these details throughout the workspace."
                }
              >
                {!client && (
                  <div className="scene-settings-identity">
                    <span className="scene-client-monogram">AS</span>
                    <div>
                      <strong>{fields.name || "Workspace"}</strong>
                      <small>acme-studio · Team workspace</small>
                    </div>
                  </div>
                )}
                <div className="scene-form-grid">
                  <label>
                    {client ? "Client name" : "Workspace name"} *
                    <input
                      required
                      autoComplete="organization"
                      pattern=".*\S.*"
                      placeholder="Company or organization"
                      {...field("name")}
                    />
                  </label>
                  <label>
                    Industry
                    <select className="native-select" {...field("industry")}>
                      <option>Design & creative</option>
                      <option>Technology</option>
                      <option>Culture & education</option>
                      <option>Retail & hospitality</option>
                    </select>
                  </label>
                </div>
                <label className="scene-field">
                  About
                  <textarea
                    rows={3}
                    {...field("about")}
                    placeholder="A short description of the organization"
                  />
                </label>
              </SettingsSection>
              <SettingsSection
                title="Contact information"
                description="Use a shared address so important updates reach the right people."
              >
                {client && (
                  <label className="scene-field">
                    Contact name *
                    <input
                      required
                      pattern=".*\S.*"
                      autoComplete="name"
                      {...field("contact")}
                    />
                  </label>
                )}
                <label className="scene-field">
                  Contact email *
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="hello@example.com"
                    {...field("email")}
                  />
                </label>
              </SettingsSection>
              <SettingsSection
                title="Regional preferences"
                description="Defaults for schedules, reports, and new invoices."
              >
                <div className="scene-form-grid">
                  <label>
                    Timezone
                    <select className="native-select" {...field("timezone")}>
                      <option>Europe / London</option>
                      <option>Europe / Berlin</option>
                      <option>Asia / Tokyo</option>
                    </select>
                  </label>
                  <label>
                    Default currency
                    <select className="native-select" {...field("currency")}>
                      <option>USD — US Dollar</option>
                      <option>EUR — Euro</option>
                      <option>GBP — British Pound</option>
                    </select>
                  </label>
                </div>
              </SettingsSection>
            </>
          ) : tab === "Notifications" ? (
            <>
              <SettingsSection
                title="Email notifications"
                description="Choose which updates reach your inbox. Project activity is always available in the workspace."
              >
                {[
                  "Project mentions and direct messages",
                  "Weekly workspace digest",
                  "Client review requests",
                  "Billing and account updates",
                ].map((label, index) => (
                  <label className="scene-toggle-row" key={label}>
                    <span>
                      <strong>{label}</strong>
                      <small>
                        {
                          [
                            "When someone needs your input.",
                            "A short summary every Monday morning.",
                            "When a deliverable is ready for your decision.",
                            "Invoices, receipts, and changes to your plan.",
                          ][index]
                        }
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      checked={notifications[index]}
                      onChange={(event) =>
                        setNotifications((current) =>
                          current.map((value, i) =>
                            i === index ? event.target.checked : value,
                          ),
                        )
                      }
                    />
                  </label>
                ))}
              </SettingsSection>
            </>
          ) : (
            <>
              <SettingsSection
                title="Workspace security"
                description="Set the default access policy for new invitations."
              >
                <label className="scene-field">
                  Default member role
                  <select className="native-select" {...field("role")}>
                    <option>Member</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                </label>
                <label className="scene-toggle-row">
                  <span>
                    <strong>Require two-step verification</strong>
                    <small>
                      Members verify their identity before signing in.
                    </small>
                  </span>
                  <input
                    type="checkbox"
                    checked={twoStep}
                    onChange={(event) => setTwoStep(event.target.checked)}
                  />
                </label>
              </SettingsSection>
            </>
          )}
          <div className="scene-settings-save">
            <div role="status">
              {saved ? (
                <span className="scene-form-result">
                  <IconCheck size={16} />
                  {client
                    ? "Client saved in this workspace session."
                    : "Your changes have been saved in this preview."}
                </span>
              ) : dirty ? (
                "You have unsaved changes"
              ) : (
                "All changes saved"
              )}
            </div>
            <div>
              <Action
                disabled={!dirty}
                onClick={() => {
                  setFields(snapshot.fields);
                  setNotifications(snapshot.notifications);
                  setTwoStep(snapshot.twoStep);
                  setSaved(false);
                }}
              >
                Discard
              </Action>
              <Action primary type="submit" disabled={!dirty && !client}>
                {client ? "Save client" : "Save changes"}
              </Action>
            </div>
          </div>
          {saved && client && (
            <Go to="/client-overview">View client directory</Go>
          )}
        </form>
        {tab === "Access" && !client && (
          <div className="scene-product-primary mt-8">
            <TeamAccess
              members={members}
              onRoleChange={(id, role) => {
                const member = members.find((item) => item.id === id)!;
                setMembers((current) =>
                  current.map((item) =>
                    item.id === id ? { ...item, role } : item,
                  ),
                );
                setAudit((current) => [
                  {
                    id: crypto.randomUUID(),
                    actor: "Maya Okafor",
                    action: "changed access for",
                    target: member.name,
                    time: "Just now",
                    changes: [
                      { field: "Role", before: member.role, after: role },
                    ],
                  },
                  ...current,
                ]);
              }}
            />
            <SceneCard title="Access history">
              <AuditTrail events={audit} />
            </SceneCard>
          </div>
        )}
      </div>
    </Scene>
  );
}
export function Wizard({ id = "wizard" }: { id?: string }) {
  const { projects, setProjects, clients } = useWorkData();
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [step, setStep] = useState(0),
    [name, setName] = useState(""),
    [client, setClient] = useState("Culture venue"),
    [done, setDone] = useState(false),
    [brief, setBrief] = useState(""),
    [members, setMembers] = useState([true, true, true]);
  return (
    <Scene
      id={id}
      title={id === "onboarding" ? "Set up your first project" : "New project"}
      description="Define the scope, invite your team, and review before creating."
    >
      <div className="scene-wizard">
        <aside>
          <p className="scene-eyebrow">Project setup</p>
          {["The brief", "The team", "Ready to begin"].map((s, i) => (
            <div className={i === step ? "is-current" : ""} key={s}>
              <b>{i + 1}</b>
              <span>{s}</span>
            </div>
          ))}
        </aside>
        <SceneCard
          title={
            done
              ? "Your project is ready"
              : step === 0
                ? "What are we working on?"
                : step === 1
                  ? "Good work starts with the right people."
                  : "One last look."
          }
        >
          {done ? (
            <div className="scene-empty">
              <img
                src="/assets/overtrue/illustration-connected.webp"
                alt="Project ready"
              />
              <h2>{name}</h2>
              <p>Created in this demo session for {client}.</p>
              <Go to={`/datagrid?project=${createdId}`}>Open project</Go>
            </div>
          ) : (
            <form
              className="scene-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (step < 2) {
                  setStep(step + 1);
                  return;
                }
                const projectId = `PRJ-${Math.max(...projects.map((project) => Number(project.id.replace(/\D/g, "")))) + 1}`;
                setProjects((current) => [
                  ...current,
                  {
                    id: projectId,
                    name: name.trim(),
                    client,
                    owner: team[0].name,
                    category: "New engagement",
                    progress: 0,
                    budget: 0,
                    due: "To be scheduled",
                    status: "Planned",
                    image: "/assets/overtrue/project-06.webp",
                    brief,
                  },
                ]);
                setCreatedId(projectId);
                setDone(true);
              }}
            >
              {step === 0 ? (
                <>
                  <label>
                    Project name
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="For example, Visitor experience"
                    />
                  </label>
                  <label>
                    Client
                    <select
                      className="native-select"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                    >
                      {clients.map((client) => (
                        <option key={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    What does success look like?
                    <textarea
                      rows={4}
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      placeholder="Describe the outcome, not just the deliverables."
                    />
                  </label>
                </>
              ) : step === 1 ? (
                <>
                  <p>
                    Maya Okafor will be the project owner. Add the people who
                    will help shape the work.
                  </p>
                  {[
                    "Ines Duarte · Research",
                    "Leo Nakamura · Engineering",
                    "June Park · Brand design",
                  ].map((s, i) => (
                    <label className="scene-toggle-row" key={s}>
                      <span>{s}</span>
                      <input
                        type="checkbox"
                        checked={members[i]}
                        onChange={(e) =>
                          setMembers(
                            members.map((value, index) =>
                              index === i ? e.target.checked : value,
                            ),
                          )
                        }
                      />
                    </label>
                  ))}
                </>
              ) : (
                <>
                  <Pill>Ready to begin</Pill>
                  <dl className="scene-details">
                    <div>
                      <dt>Project</dt>
                      <dd>{name}</dd>
                    </div>
                    <div>
                      <dt>Client</dt>
                      <dd>{client}</dd>
                    </div>
                    <div>
                      <dt>Team</dt>
                      <dd>
                        Maya Okafor + {members.filter(Boolean).length}{" "}
                        collaborators
                      </dd>
                    </div>
                  </dl>
                  {brief && (
                    <p>
                      <strong>Success looks like:</strong> {brief}
                    </p>
                  )}
                  <p>
                    You can refine the brief and invite more people once the
                    project is open.
                  </p>
                </>
              )}
              <div className="scene-form-footer">
                {step > 0 && (
                  <Action onClick={() => setStep(step - 1)}>Back</Action>
                )}
                <Action type="submit" primary>
                  {step === 2 ? "Create project" : "Continue"}
                </Action>
              </div>
            </form>
          )}
        </SceneCard>
      </div>
    </Scene>
  );
}
