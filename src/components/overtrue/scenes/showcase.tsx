import { FileList } from "@/registry/overtrue/file-list";
import { useState } from "react";
import {
  IconArrowUpRight,
  IconCheck,
  IconCloud,
  IconDots,
  IconFileText,
  IconPalette,
  IconShieldCheck,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";
import { projects, revenue, tasks, team } from "@/data/workspace/studio";
import {
  FeatureCard,
  FeatureCardContent,
  FeatureCardDecoration,
} from "@/registry/overtrue/feature-card";
import { MetricGroup } from "@/registry/overtrue/metric-group";
import { MetricChart } from "@/registry/overtrue/metric-chart";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { UptimeHistory } from "@/registry/overtrue/uptime-history";
import { DetailList } from "@/registry/overtrue/detail-list";
import {
  Scene,
  SceneCard,
  Metric,
  Person,
  Pill,
  Go,
  Action,
  Feed,
  FilterTabs,
} from "./shared";

export function Widgets() {
  return (
    <Scene
      id="widgets"
      title="Studio at a glance"
      description="Small, useful views of the people, projects, and resources behind the work."
      actions={<Go to="/settings">Customize workspace</Go>}
    >
      <MetricGroup className="mb-6">
        <Metric
          label="Active projects"
          value="5"
          note="2 approaching a milestone"
        />
        <Metric label="Delivered this month" value="18" change="+4" />
        <Metric
          label="Team availability"
          value="22%"
          note="35 hours next week"
        />
        <Metric
          label="Client satisfaction"
          value="4.9 / 5"
          note="from 24 project reviews"
        />
      </MetricGroup>
      <div className="scene-grid-three showcase-grid">
        <div>
          <SceneCard
            title="Project spotlight"
            action={<Pill>{projects[0].status}</Pill>}
          >
            <img
              className="showcase-cover"
              src={projects[0].image}
              alt="Visitor experience concept"
            />
            <h3>{projects[0].name}</h3>
            <p>
              A welcoming first five minutes, from the entrance to the first
              exhibition.
            </p>
            <ResourceProgress
              label="Milestones complete"
              value={4}
              max={6}
              valueLabel="4 of 6"
            />
            <div className="showcase-divider">
              <Person name={team[0].name} subtitle="Project owner" />
              <Go to="/datagrid">Details</Go>
            </div>
          </SceneCard>
          <SceneCard title="Storage">
            <div className="showcase-icon">
              <IconCloud />
            </div>
            <div className="scene-chart-summary">
              <strong>
                42.8 <small>GB</small>
              </strong>
              <span>of 100 GB available</span>
            </div>
            <ResourceProgress
              label="Project files"
              className="mb-4"
              value={26}
              max={100}
              valueLabel="26 GB"
            />
            <ResourceProgress
              label="Media & exports"
              value={16.8}
              max={100}
              valueLabel="16.8 GB"
            />
            <div className="showcase-divider">
              <small>57.2 GB free</small>
              <Go to="/settings-plan">Manage plan</Go>
            </div>
          </SceneCard>
        </div>
        <div>
          <MetricChart
            title="Booked revenue · 2026"
            data={revenue}
            height={200}
          />
          <SceneCard
            title="Your next steps"
            description="Three small things to move the work forward"
          >
            <ul className="scene-checklist">
              {tasks.slice(0, 3).map((t) => (
                <li key={t.id}>
                  <input type="checkbox" aria-label={t.title} />
                  <div>
                    <strong>{t.title}</strong>
                    <small>
                      {t.project} · {t.due}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
            <Go to="/tasks-list">View all tasks</Go>
          </SceneCard>
          <FeatureCard>
            <FeatureCardDecoration>
              <IconSparkles />
            </FeatureCardDecoration>
            <FeatureCardContent>
              <span className="scene-eyebrow">MAKE SPACE FOR FOCUS</span>
              <h2 className="text-xl font-semibold leading-snug">
                A quieter Friday.
              </h2>
              <p>
                Protect an afternoon for the work that needs your full
                attention.
              </p>
              <Go to="/fullcalendar">Plan a focus block</Go>
            </FeatureCardContent>
          </FeatureCard>
        </div>
        <div>
          <SceneCard
            title="People on this project"
            action={<Go to="/users">All members</Go>}
          >
            <div className="showcase-people">
              {team.slice(0, 4).map((p, i) => (
                <div key={p.id}>
                  <Person name={p.name} subtitle={p.role} />
                  <span
                    className={`showcase-presence ${i === 2 ? "is-away" : ""}`}
                  >
                    {i === 2 ? "Away" : "Online"}
                  </span>
                </div>
              ))}
            </div>
          </SceneCard>
          <SceneCard title="Recent activity">
            <Feed limit={3} />
          </SceneCard>
          <SceneCard title="Workspace health">
            <div className="showcase-divider">
              <IconShieldCheck size={30} />
              <Pill>Healthy</Pill>
            </div>
            <p>
              All services are running normally. Last incident resolved 12 days
              ago.
            </p>
            <Go to="/uptime">View service status</Go>
          </SceneCard>
        </div>
      </div>
    </Scene>
  );
}

function ActionCard({ index }: { index: number }) {
  const [collapsed, setCollapsed] = useState(false),
    [archived, setArchived] = useState(false),
    [pinned, setPinned] = useState(false),
    [checked, setChecked] = useState(false),
    [refreshed, setRefreshed] = useState(false);
  const project = projects[index];
  const title = [
    "Inline actions",
    "Collapsible content",
    "Context menu",
    "Selectable card",
  ][index];
  return (
    <SceneCard
      title={title}
      description={
        [
          "Keep the next step close to the work.",
          "Hide detail without leaving the page.",
          "Secondary actions stay within reach.",
          "Select records for a shared workflow.",
        ][index]
      }
      action={
        index === 1 ? (
          <button
            className="scene-button"
            aria-expanded={!collapsed}
            aria-controls="collapsible-project"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        ) : index === 2 ? (
          <details className="showcase-menu">
            <summary aria-label="Project actions">
              <IconDots size={18} />
            </summary>
            <div>
              <button onClick={() => setPinned(!pinned)}>
                {pinned ? "Unpin project" : "Pin project"}
              </button>
              <button onClick={() => setArchived(true)}>Archive project</button>
            </div>
          </details>
        ) : index === 3 ? (
          <input
            type="checkbox"
            aria-label="Select Customer onboarding"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        ) : (
          <Action onClick={() => setRefreshed(true)}>Refresh</Action>
        )
      }
    >
      {archived ? (
        <div className="showcase-empty" role="status">
          <IconCheck />
          <h3>Project archived</h3>
          <p>Restore it to return it to your active work.</p>
          <Action onClick={() => setArchived(false)}>Undo archive</Action>
        </div>
      ) : (
        <div
          id={index === 1 ? "collapsible-project" : undefined}
          hidden={collapsed}
        >
          <div className="showcase-project-heading">
            <img src={project.image} alt="" />
            <div>
              <h3>{project.name}</h3>
              <p>{project.client}</p>
              {pinned && <Pill>Pinned</Pill>}
            </div>
          </div>
          <ResourceProgress
            label="Delivery progress"
            value={project.progress}
          />
          <DetailList
            className="mt-5"
            items={[
              { id: "owner", label: "Owner", value: project.owner },
              { id: "due", label: "Next milestone", value: project.due },
              {
                id: "status",
                label: "Status",
                value: <Pill>{project.status}</Pill>,
              },
            ]}
          />
          <div className="showcase-divider">
            <span role="status">
              {checked
                ? "1 project selected"
                : refreshed
                  ? "Updated just now"
                  : "Updated 12 minutes ago"}
            </span>
            <Go to="/tasks-list">Open project</Go>
          </div>
        </div>
      )}
      {collapsed && <small>Project details are collapsed.</small>}
    </SceneCard>
  );
}
export function CardActions() {
  return (
    <Scene
      id="card-actions"
      title="Project control center"
      description="Useful card patterns, with actions that respond to the way you work."
    >
      <div className="scene-grid-two showcase-grid">
        {[0, 1, 2, 3].map((i) => (
          <ActionCard key={i} index={i} />
        ))}
      </div>
      <SceneCard
        title="A shared review"
        description="Actions can also live in the footer"
      >
        <div className="showcase-review-row">
          <Person name={team[2].name} subtitle="Research lead" />
          <p>
            “The arrival sequence is ready for a second pair of eyes. Please
            leave feedback before Wednesday’s client review.”
          </p>
          <Go to="/creative-review" primary>
            Review artwork
          </Go>
        </div>
      </SceneCard>
    </Scene>
  );
}

export function GradientCards() {
  return (
    <Scene
      id="card-gradients"
      title="A little color, with purpose"
      description="Subtle color surfaces for milestones, invitations, and useful moments of encouragement."
    >
      <div className="scene-grid-three showcase-grid">
        <FeatureCard className="showcase-tint is-blue">
          <FeatureCardDecoration>
            <IconSparkles />
          </FeatureCardDecoration>
          <FeatureCardContent>
            <span className="scene-eyebrow">WELCOME BACK, MAYA</span>
            <h2 className="text-xl font-semibold leading-snug">
              Good work is taking shape.
            </h2>
            <p>
              Two milestones are ready for your review. Start with the Visitor
              experience concepts.
            </p>
            <div className="scene-chart-summary">
              <strong>4 / 6</strong>
              <span>milestones complete</span>
            </div>
            <Go to="/tasks" primary>
              Open project board
            </Go>
          </FeatureCardContent>
        </FeatureCard>
        <FeatureCard className="showcase-tint is-green">
          <FeatureCardContent>
            <span className="showcase-icon">
              <IconCheck />
            </span>
            <h2 className="text-xl font-semibold leading-snug">
              One more project, delivered.
            </h2>
            <p>
              The Editorial system handover is complete. All 12 assets are
              approved and ready to use.
            </p>
            <Person name={team[7].name} subtitle="Content strategist" />
            <Go to="/gallery">Explore final assets</Go>
          </FeatureCardContent>
        </FeatureCard>
        <FeatureCard className="showcase-tint is-amber">
          <FeatureCardDecoration>
            <IconUsers />
          </FeatureCardDecoration>
          <FeatureCardContent>
            <span className="scene-eyebrow">BETTER TOGETHER</span>
            <h2 className="text-xl font-semibold leading-snug">
              A fresh pair of eyes.
            </h2>
            <p>
              Invite a teammate to the next review. A small conversation can
              lead to a better decision.
            </p>
            <Person name={team[2].name} subtitle="Available for a review" />
            <Go to="/users">Find a collaborator</Go>
          </FeatureCardContent>
        </FeatureCard>
        <SceneCard title="Room to grow" className="showcase-tint is-violet">
          <Pill>Studio plan</Pill>
          <div className="scene-chart-summary">
            <strong>
              $29<small> / seat / month</small>
            </strong>
          </div>
          <p>For a small team doing ambitious work.</p>
          <ul className="showcase-benefits">
            <li>
              <IconCheck />
              Unlimited projects
            </li>
            <li>
              <IconCheck />
              Team permissions
            </li>
            <li>
              <IconCheck />
              100 GB shared storage
            </li>
          </ul>
          <Go to="/pricing">Compare plans</Go>
        </SceneCard>
        <SceneCard
          title="A healthy workspace"
          className="showcase-tint is-green"
        >
          <IconShieldCheck className="showcase-large-icon" />
          <h3>Everything in its place.</h3>
          <p>
            Your workspace is private, and two-step verification is enabled for
            all administrators.
          </p>
          <DetailList
            items={[
              {
                id: "access",
                label: "Last access review",
                value: "September 18",
              },
              { id: "members", label: "Members reviewed", value: "8 of 8" },
            ]}
          />
          <Go to="/settings">Review access</Go>
        </SceneCard>
        <SceneCard
          title="Next studio session"
          className="showcase-tint is-blue"
        >
          <span className="scene-date-tile">
            <b>25</b>SEP
          </span>
          <h3>Show the work. Share the thinking.</h3>
          <p>
            Friday · 14:00–15:00
            <br />
            Studio lounge · 8 people
          </p>
          <Go to="/fullcalendar">View calendar</Go>
        </SceneCard>
      </div>
    </Scene>
  );
}

export function TextFeatures() {
  return (
    <Scene
      id="text-features"
      title="Words with a little more context"
      description="Inline styles, metadata, and readable text patterns for everyday interfaces."
    >
      <div className="scene-grid-two">
        <SceneCard
          title="Inline formatting"
          description="Add emphasis without losing the thread"
        >
          <div className="showcase-text-samples">
            <p>
              Start with <strong>one clear outcome</strong> and a shared
              understanding of what success means.
            </p>
            <p>
              Use <em>emphasis</em> for a change in tone, and{" "}
              <mark>highlight the decision</mark> that needs attention.
            </p>
            <p>
              The original deadline was <del>September 18</del>. The confirmed
              handover is <ins>September 25</ins>.
            </p>
            <p>
              Save approved work in <code>project/handover</code>, then press{" "}
              <kbd>⌘</kbd> + <kbd>Enter</kbd> to publish.
            </p>
            <p>
              <abbr title="Service level agreement">SLA</abbr> targets are
              reviewed every quarter. See the{" "}
              <a href="#/uptime">service status</a> for the latest figures.
            </p>
            <p>
              A small note can carry context.<sup>1</sup> H<sub>2</sub>O keeps a
              long workshop moving.
            </p>
            <p className="showcase-muted">
              Secondary information should be readable, even when it is quieter.
            </p>
            <blockquote>
              “A useful interface makes the next step clear.”
              <footer>— Studio working principles</footer>
            </blockquote>
          </div>
        </SceneCard>
        <SceneCard title="A practical type scale">
          <div className="showcase-type-scale">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n}>
                <span style={{ fontSize: 30 - n * 3, fontWeight: 600 }}>
                  Heading {n}
                </span>
                <small>{30 - n * 3}px / Semibold</small>
              </div>
            ))}
          </div>
          <div className="showcase-divider">
            <strong>Numbers that line up</strong>
            <small>Tabular figures</small>
          </div>
          <dl className="scene-details showcase-numbers">
            <div>
              <dt>Booked</dt>
              <dd>$32,600.00</dd>
            </div>
            <div>
              <dt>Invoiced</dt>
              <dd>$28,450.00</dd>
            </div>
            <div>
              <dt>Outstanding</dt>
              <dd>$4,150.00</dd>
            </div>
          </dl>
          <p
            className="showcase-truncate"
            title="Visitor experience — concept development, wayfinding, and final production handover"
          >
            Visitor experience — concept development, wayfinding, and final
            production handover
          </p>
          <small>
            Long labels truncate while retaining their full text on hover.
          </small>
        </SceneCard>
        <SceneCard title="Lists with a purpose">
          <div className="scene-grid-two">
            <div>
              <h3>Before a review</h3>
              <ul>
                <li>Share the brief</li>
                <li>Name the open question</li>
                <li>Set a feedback deadline</li>
              </ul>
            </div>
            <div>
              <h3>After approval</h3>
              <ol>
                <li>Prepare final exports</li>
                <li>Document the decisions</li>
                <li>Publish the handover</li>
              </ol>
            </div>
          </div>
        </SceneCard>
        <SceneCard title="Labels and links">
          <p>
            <Pill>Published</Pill>{" "}
            <small>Updated 2 hours ago · 6 min read</small>
          </p>
          <p>
            <a href="#/prose">
              Read the handover guide{" "}
              <IconArrowUpRight size={14} className="showcase-inline-icon" />
            </a>
          </p>
          <FileList
            items={[
              {
                id: "source",
                name: "Source files included",
                description:
                  "SVG, PDF, and editable design files. 24 items · 18.6 MB",
              },
            ]}
          />
        </SceneCard>
      </div>
    </Scene>
  );
}

export function Tracking() {
  const [period, setPeriod] = useState("30 days");
  const days = period === "30 days" ? 30 : 60;
  return (
    <Scene
      id="tracking"
      title="A record of reliability"
      description="Daily health checks, delivery activity, and the small signals that show a system is working."
      actions={
        <FilterTabs
          items={["30 days", "60 days"]}
          value={period}
          onChange={setPeriod}
        />
      }
    >
      <SceneCard
        title="Workspace availability"
        description={`Daily service checks · Last ${days} days`}
        action={<Pill>Operational</Pill>}
      >
        <div className="scene-chart-summary">
          <strong>99.95%</strong>
          <span>uptime across all services</span>
        </div>
        <UptimeHistory
          label="Daily availability history"
          samples={Array.from({ length: days }, (_, i) => ({
            id: String(i),
            label: `Day ${i + 1}`,
            status:
              i === days - 12
                ? "degraded"
                : i === days - 23
                  ? "outage"
                  : "operational",
          }))}
        />
        <div className="showcase-divider">
          <small>{days} days ago</small>
          <small>Today</small>
        </div>
      </SceneCard>
      <div className="scene-grid-two">
        {["Scheduled backups", "Preview deployments"].map((name, i) => (
          <SceneCard
            key={name}
            title={name}
            description={
              i
                ? "Every preview has a result you can inspect."
                : "A daily snapshot of your project files."
            }
          >
            <div className="scene-chart-summary">
              <strong>{i ? "248" : "30 / 30"}</strong>
              <span>
                {i ? "successful builds this month" : "snapshots completed"}
              </span>
            </div>
            <UptimeHistory
              label="Daily availability history"
              samples={Array.from({ length: days }, (_, j) => ({
                id: String(j),
                label: `${name}, day ${j + 1}`,
                status: i && j % 17 === 0 ? "degraded" : "operational",
              }))}
            />
            <div className="showcase-divider">
              <small>
                {i ? "2 builds needed a retry" : "Last backup: today at 03:00"}
              </small>
              <Go to="/logs">View logs</Go>
            </div>
          </SceneCard>
        ))}
      </div>
      <SceneCard title="Recent events">
        <div className="showcase-event">
          <span className="showcase-icon">
            <IconCheck />
          </span>
          <div>
            <strong>Asset delivery restored</strong>
            <p>
              Elevated latency in the Europe region was resolved. No files were
              lost.
            </p>
            <small>September 9 · 14:32 UTC · Duration 18 minutes</small>
          </div>
          <Pill>Resolved</Pill>
        </div>
        <div className="showcase-event">
          <span className="showcase-icon">
            <IconCloud />
          </span>
          <div>
            <strong>Scheduled storage maintenance</strong>
            <p>Capacity expanded with no interruption to the workspace.</p>
            <small>August 29 · 02:00 UTC · Duration 24 minutes</small>
          </div>
          <Pill>Complete</Pill>
        </div>
      </SceneCard>
    </Scene>
  );
}

export function ClientForm() {
  const [saved, setSaved] = useState(false),
    [name, setName] = useState("");
  return (
    <Scene
      id="form-layout"
      title="A new client relationship"
      description="Start with the essentials. Keep contact, billing, and project context together."
    >
      <form
        className="scene-grid-main scene-form"
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
        }}
        onChange={() => setSaved(false)}
      >
        <div>
          <SceneCard
            title="01 · Organization"
            description="The details your team will use across projects and invoices"
          >
            <div className="scene-form-grid">
              <label>
                Client name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Company or organization"
                />
              </label>
              <label>
                Website
                <input type="url" placeholder="https://example.com" />
              </label>
              <label>
                Industry
                <select>
                  <option>Culture & education</option>
                  <option>Design & creative</option>
                  <option>Technology</option>
                  <option>Retail & hospitality</option>
                </select>
              </label>
              <label>
                Relationship owner
                <select>
                  {team.map((p) => (
                    <option key={p.id}>{p.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </SceneCard>
          <SceneCard
            title="02 · Primary contact"
            description="Who should we keep in the loop?"
          >
            <div className="scene-form-grid">
              <label>
                Contact name
                <input required placeholder="Full name" />
              </label>
              <label>
                Contact email
                <input type="email" required placeholder="hello@example.com" />
              </label>
              <label>
                Role
                <input placeholder="For example, Project lead" />
              </label>
              <label>
                Phone number
                <input type="tel" placeholder="+44 20 7946 0000" />
              </label>
            </div>
            <label>
              Project context
              <textarea
                rows={4}
                placeholder="What are they hoping to achieve?"
              />
            </label>
          </SceneCard>
          <SceneCard title="03 · Billing preferences">
            <div className="scene-form-grid">
              <label>
                Billing email
                <input type="email" placeholder="accounts@example.com" />
              </label>
              <label>
                Currency
                <select>
                  <option>USD — US Dollar</option>
                  <option>EUR — Euro</option>
                  <option>GBP — British Pound</option>
                </select>
              </label>
              <label>
                Payment terms
                <select>
                  <option>Net 30 days</option>
                  <option>Net 14 days</option>
                  <option>Due on receipt</option>
                </select>
              </label>
              <label>
                Tax reference
                <input placeholder="Optional" />
              </label>
            </div>
            <label className="scene-checkbox">
              <input type="checkbox" defaultChecked />
              Send a copy of invoices to the primary contact
            </label>
            <div className="scene-form-footer">
              <Action type="submit" primary>
                Save client
              </Action>
              <Go to="/client-overview">Cancel</Go>
              {saved && (
                <span role="status">{name} saved in this demo session.</span>
              )}
            </div>
          </SceneCard>
        </div>
        <aside>
          <SceneCard title="A considered beginning">
            <IconUsers className="showcase-large-icon" />
            <h3>{name || "Your next client"}</h3>
            <p>
              A shared record gives everyone the context they need to build a
              good relationship.
            </p>
            <DetailList
              items={[
                {
                  id: "status",
                  label: "Initial status",
                  value: <Pill>Prospect</Pill>,
                },
                {
                  id: "access",
                  label: "Visibility",
                  value: "Workspace members",
                },
                {
                  id: "next",
                  label: "Next step",
                  value: "Create the project brief",
                },
              ]}
            />
          </SceneCard>
          <div className="scene-note">
            <IconShieldCheck size={20} />
            <h3>Keep the right details close.</h3>
            <p>
              Use this record for project context. Store confidential documents
              in the client’s restricted project folder.
            </p>
          </div>
        </aside>
      </form>
    </Scene>
  );
}

export function Onboarding() {
  const [step, setStep] = useState(0),
    [done, setDone] = useState(false),
    [name, setName] = useState("Acme Studio"),
    [size, setSize] = useState("2–10 people"),
    [use, setUse] = useState("Client projects");
  return (
    <Scene
      id="onboarding"
      title="Make yourself at home"
      description="A few details will help shape your workspace."
    >
      <div className="scene-wizard">
        <aside>
          <img
            src="/assets/overtrue/illustration-team.svg"
            alt="A team coming together"
          />
          {["Your workspace", "Your workflow", "Ready to begin"].map(
            (label, i) => (
              <div key={label} className={i === step ? "is-current" : ""}>
                <b>{i < step ? "✓" : i + 1}</b>
                <span>{label}</span>
              </div>
            ),
          )}
        </aside>
        <SceneCard
          title={
            done
              ? "Your workspace is ready"
              : step === 0
                ? "Tell us about your team"
                : step === 1
                  ? "How will you use overtrue/ui?"
                  : "A space for your best work"
          }
        >
          {done ? (
            <div className="scene-empty">
              <img
                src="/assets/overtrue/illustration-connected.svg"
                alt="Workspace ready"
              />
              <h2 className="text-xl font-semibold leading-snug">
                Welcome to {name}
              </h2>
              <p>Your demo workspace is ready to explore.</p>
              <Go to="/" primary>
                Open workspace
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
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    >
                      {[
                        "Just me",
                        "2–10 people",
                        "11–25 people",
                        "26–50 people",
                      ].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <p>
                    You can invite teammates after setup. Only invited members
                    can access your workspace.
                  </p>
                </>
              ) : step === 1 ? (
                <fieldset className="showcase-options">
                  <legend>Choose your main focus</legend>
                  {[
                    [
                      "Client projects",
                      IconPalette,
                      "Briefs, feedback, and thoughtful delivery.",
                    ],
                    [
                      "Team operations",
                      IconUsers,
                      "People, capacity, and the work between projects.",
                    ],
                    [
                      "A little of everything",
                      IconFileText,
                      "A flexible home for a growing team.",
                    ],
                  ].map(([label, Icon, description]) => {
                    const OptionIcon = Icon as typeof IconPalette;
                    return (
                      <label key={String(label)}>
                        <input
                          type="radio"
                          name="workflow"
                          value={String(label)}
                          checked={use === label}
                          onChange={() => setUse(String(label))}
                        />
                        <OptionIcon size={24} />
                        <span>
                          <strong>{String(label)}</strong>
                          <small>{String(description)}</small>
                        </span>
                      </label>
                    );
                  })}
                </fieldset>
              ) : (
                <>
                  <Pill>Ready to begin</Pill>
                  <DetailList
                    items={[
                      { id: "workspace", label: "Workspace", value: name },
                      { id: "size", label: "Team size", value: size },
                      { id: "focus", label: "Primary focus", value: use },
                    ]}
                  />
                  <p>Everything can be adjusted later in workspace settings.</p>
                </>
              )}
              <div className="scene-form-footer">
                {step > 0 && (
                  <Action onClick={() => setStep(step - 1)}>Back</Action>
                )}
                <Action type="submit" primary>
                  {step === 2 ? "Create workspace" : "Continue"}
                </Action>
              </div>
            </form>
          )}
        </SceneCard>
      </div>
    </Scene>
  );
}
