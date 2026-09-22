import { useState } from "react";
import {
  Scene,
  SceneCard,
  Action,
  Avatar,
  FilterTabs,
  Go,
  Pill,
} from "./shared";
export function Settings({
  id = "settings",
  client = false,
}: {
  id?: string;
  client?: boolean;
}) {
  const [tab, setTab] = useState("General"),
    [saved, setSaved] = useState(false),
    [fields, setFields] = useState({
      name: client ? "" : "Acme Studio",
      email: client ? "" : "hello@acme.example",
      industry: "Design & creative",
      currency: "USD — US Dollar",
      about: client
        ? ""
        : "We help thoughtful organizations turn complex questions into useful experiences.",
      timezone: "Europe / London",
      role: "Member",
    }),
    [notifications, setNotifications] = useState([true, false, true, true]),
    [twoStep, setTwoStep] = useState(true);
  const field = (key: keyof typeof fields) => ({
    value: fields[key],
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => setFields({ ...fields, [key]: event.target.value }),
  });
  return (
    <Scene
      id={id}
      title={client ? "A new client relationship" : "Workspace settings"}
      description={
        client
          ? "Start with the essentials. The details can grow with the relationship."
          : "Make this space work for the way your team works."
      }
    >
      <div className="scene-settings-layout">
        <aside>
          <FilterTabs
            items={["General", "Notifications", "Access"]}
            value={tab}
            onChange={(v) => {
              setTab(v);
              setSaved(false);
            }}
          />
          <p>Changes in this example stay in the current session.</p>
        </aside>
        <SceneCard
          title={
            client
              ? "Client details"
              : tab === "General"
                ? "The essentials"
                : tab === "Notifications"
                  ? "Less noise, more context"
                  : "Workspace access"
          }
        >
          <form
            className="scene-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
            onChange={() => setSaved(false)}
          >
            {tab === "General" ? (
              <>
                <div className="scene-signature">
                  <Avatar name="Maya Okafor" size={56} />
                  <div>
                    <strong>{client ? "New client" : "Acme Studio"}</strong>
                    <p>
                      {client
                        ? "A clear beginning"
                        : "Independent design & digital experiences"}
                    </p>
                  </div>
                </div>
                <div className="scene-form-grid">
                  <label>
                    {client ? "Client name" : "Workspace name"}
                    <input
                      required
                      {...field("name")}
                      placeholder="Company or organization"
                    />
                  </label>
                  <label>
                    Contact email
                    <input
                      type="email"
                      required
                      {...field("email")}
                      placeholder="hello@example.com"
                    />
                  </label>
                  <label>
                    Industry
                    <select {...field("industry")}>
                      <option>Design & creative</option>
                      <option>Technology</option>
                      <option>Culture & education</option>
                      <option>Retail & hospitality</option>
                    </select>
                  </label>
                  <label>
                    Default currency
                    <select {...field("currency")}>
                      <option>USD — US Dollar</option>
                      <option>EUR — Euro</option>
                      <option>GBP — British Pound</option>
                    </select>
                  </label>
                </div>
                <label>
                  About
                  <textarea {...field("about")} rows={4} />
                </label>
                <label>
                  Timezone
                  <select {...field("timezone")}>
                    <option>Europe / London</option>
                    <option>Europe / Berlin</option>
                    <option>Asia / Tokyo</option>
                  </select>
                </label>
              </>
            ) : tab === "Notifications" ? (
              <>
                {[
                  "Project mentions and direct messages",
                  "Weekly workspace digest",
                  "Client review requests",
                  "Billing and account updates",
                ].map((s, i) => (
                  <label className="scene-toggle-row" key={s}>
                    <span>
                      <strong>{s}</strong>
                      <small>
                        {i === 1
                          ? "A short summary every Monday morning."
                          : "Only updates relevant to your work."}
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      checked={notifications[i]}
                      onChange={(e) =>
                        setNotifications(
                          notifications.map((value, index) =>
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
                <div className="scene-status-banner">
                  <span className="scene-status-dot" />
                  <div>
                    <strong>Your workspace is private</strong>
                    <p>Only invited members can view projects.</p>
                  </div>
                </div>
                <label>
                  Default member role
                  <select {...field("role")}>
                    <option>Member</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                </label>
                <label className="scene-toggle-row">
                  <span>Require two-step verification</span>
                  <input
                    type="checkbox"
                    checked={twoStep}
                    onChange={(e) => setTwoStep(e.target.checked)}
                  />
                </label>
                <Go to="/users">Manage members</Go>
              </>
            )}
            <div className="scene-form-footer">
              <Action primary type="submit">
                {client ? "Save client" : "Save changes"}
              </Action>
              {saved && (
                <span role="status">
                  {client
                    ? "Client saved in this demo session."
                    : "Your changes have been saved for this session."}
                </span>
              )}
            </div>
          </form>
        </SceneCard>
      </div>
    </Scene>
  );
}
export function Wizard({ id = "wizard" }: { id?: string }) {
  const [step, setStep] = useState(0),
    [name, setName] = useState(""),
    [client, setClient] = useState("Culture venue"),
    [done, setDone] = useState(false),
    [brief, setBrief] = useState(""),
    [members, setMembers] = useState([true, true, true]);
  return (
    <Scene
      id={id}
      title={
        id === "onboarding"
          ? "A good place to begin"
          : "Make space for a new project"
      }
      description="A few clear decisions now make the rest of the work easier."
    >
      <div className="scene-wizard">
        <aside>
          <img
            src="/assets/overtrue/illustration-start.svg"
            alt="A new project taking shape"
          />
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
                src="/assets/overtrue/illustration-connected.svg"
                alt="Project ready"
              />
              <h2>{name}</h2>
              <p>Created in this demo session for {client}.</p>
              <Go to="/tasks">Open project board</Go>
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
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                    >
                      {[
                        "Culture venue",
                        "Member collective",
                        "Ceramics studio",
                        "Supply company",
                      ].map((c) => (
                        <option key={c}>{c}</option>
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
