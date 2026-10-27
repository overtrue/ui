import { useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import {
  IconCheck,
  IconDots,
  IconPlus,
  IconX,
  IconArrowRight,
  IconShieldCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TaskChecklist } from "@/registry/overtrue/task-checklist";
import { ApprovalQueue } from "@/registry/overtrue/approval-queue";
import {
  FileUpload,
  type FileUploadItem,
} from "@/registry/overtrue/file-upload";
import { MultiSelect } from "@/registry/overtrue/multi-select";
import { SettingsSection } from "@/registry/overtrue/settings-section";
import { AuditTrail } from "@/registry/overtrue/audit-trail";
import { Steps } from "@/registry/overtrue/steps";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { DetailList } from "@/registry/overtrue/detail-list";
import { kickoffChecklist } from "@/data/workspace/operations";
import { team } from "@/data/workspace/studio";
import { useWorkData } from "../workspace/work-data";
import {
  Scene,
  SceneCard,
  Action,
  Go,
  Pill,
  Person,
  FilterTabs,
  SearchField,
  DownloadButton,
} from "./shared";

export function WorkflowDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className = "",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  const returnFocus = useRef<HTMLElement | null>(null);
  const content = useRef<HTMLDivElement>(null);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <div className="overtrue-workspace workspace-portal">
          <Dialog.Overlay className="workspace-dialog-overlay" />
          <Dialog.Content
            ref={content}
            className={`scene scene-workflow-dialog ${className}`}
            onOpenAutoFocus={(event) => {
              returnFocus.current =
                document.activeElement instanceof HTMLElement
                  ? document.activeElement
                  : null;
              const field = content.current?.querySelector<HTMLElement>(
                "input,select,textarea",
              );
              if (field) {
                event.preventDefault();
                field.focus();
              }
            }}
            onCloseAutoFocus={(event) => {
              if (returnFocus.current?.isConnected) {
                event.preventDefault();
                returnFocus.current.focus();
              }
            }}
          >
            <Dialog.Title className="scene-dialog-title">{title}</Dialog.Title>
            <Dialog.Description className="scene-dialog-description">
              {description}
            </Dialog.Description>
            <Dialog.Close
              className="scene-dialog-close"
              aria-label="Close dialog"
            >
              <IconX size={18} />
            </Dialog.Close>
            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function DeliveryActions() {
  const [checks, setChecks] = useState(kickoffChecklist);
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const complete = checks.every((item) => item.checked);
  return (
    <Scene
      id="buttons"
      title="Prepare a delivery"
      description="Finish the checks, review the handover, and prepare the client package."
      actions={<Go to="/gallery">View project files</Go>}
    >
      <div className="scene-page-tabs">
        <span aria-current="page">Handover</span>
        <Link to="/creative-review">Review</Link>
        <Link to="/datagrid?project=PRJ-243">Project details</Link>
        <span className="scene-tabs-context">Ceramics identity · PRJ-243</span>
      </div>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <SceneCard
            title="Client handover"
            description="Identity system · Version 1.4"
            action={<Pill>{ready ? "Ready" : "Draft"}</Pill>}
          >
            <div className="scene-delivery-cover">
              <img
                src="/assets/overtrue/studio-space.png"
                alt="Ceramics identity project"
              />
              <div>
                <h3>A complete identity, ready to use</h3>
                <p>
                  Brand guidelines, master artwork, and approved digital exports
                  for Ceramics studio.
                </p>
                <Person
                  name="June Park"
                  subtitle="Prepared by · Brand design"
                />
              </div>
            </div>
            <div className="scene-action-footer">
              <Action
                onClick={() => {
                  setSaved(true);
                  setReady(false);
                }}
              >
                Save draft
              </Action>
              <Action
                primary
                disabled={!complete}
                onClick={() => {
                  setReady(true);
                  setSaved(false);
                }}
              >
                <IconCheck size={16} />
                Prepare delivery
              </Action>
            </div>
            <p className="scene-inline-status" role="status">
              {ready
                ? "The handover is ready in this preview. No files have been sent."
                : saved
                  ? "Draft saved for this session."
                  : "Complete the checklist before preparing the package."}
            </p>
          </SceneCard>
          <TaskChecklist
            title="Before you hand over"
            items={checks}
            onCheckedChange={(id, checked) => {
              setReady(false);
              setSaved(false);
              setChecks((current) =>
                current.map((item) =>
                  item.id === id ? { ...item, checked } : item,
                ),
              );
            }}
          />
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Package details">
            <DetailList
              items={[
                {
                  id: "version",
                  label: "Version",
                  value: "1.4 · Approved artwork",
                },
                {
                  id: "files",
                  label: "Contents",
                  value: "12 files · Print & digital",
                },
                { id: "review", label: "Reviewer", value: "Maya Okafor" },
              ]}
            />
            <div className="mt-5">
              <DownloadButton
                name="ceramics-handover-manifest"
                rows={[
                  ["File", "Format"],
                  ["Brand guidelines", "PDF"],
                  ["Master artwork", "SVG"],
                  ["Digital exports", "PNG"],
                ]}
              />
            </div>
          </SceneCard>
          <SceneCard title="Need another review?">
            <p>
              Share the current direction with the project team before preparing
              the final package.
            </p>
            <Go to="/creative-review">Open artwork review</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

export function RequestForm() {
  const { projects } = useWorkData();
  const [project, setProject] = useState(projects[0].id);
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("1200");
  const [priority, setPriority] = useState("Normal");
  const [reviewers, setReviewers] = useState([team[0].id]);
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  return (
    <Scene
      id="form-elements"
      title="Purchase request"
      description="Give approvers the context they need to make a clear decision."
    >
      <form
        className="scene-product-grid scene-form"
        onChange={() => setSubmitted(false)}
        onSubmit={(event) => {
          event.preventDefault();
          if (reviewers.length) setSubmitted(true);
        }}
      >
        <div className="scene-product-primary">
          <SceneCard
            title="Request details"
            description="Required fields are marked with an asterisk."
          >
            <div className="scene-form">
              <label>
                Request title *
                <input
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="For example, prototype materials"
                />
              </label>
              <div className="scene-form-grid">
                <label>
                  Project
                  <select
                    className="native-select"
                    value={project}
                    onChange={(event) => setProject(event.target.value)}
                  >
                    {projects.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Estimated amount (USD) *
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                  />
                </label>
              </div>
              <label>
                Business reason *
                <textarea
                  required
                  rows={4}
                  placeholder="What will this purchase help the team deliver?"
                />
              </label>
              <fieldset className="scene-choice-fieldset">
                <legend>Priority</legend>
                {["Normal", "High", "Urgent"].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="priority"
                      value={value}
                      checked={priority === value}
                      onChange={() => setPriority(value)}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </fieldset>
            </div>
          </SceneCard>
          <SceneCard
            title="Supporting files"
            description="Quotes, specifications, or reference images. Files stay in this browser."
          >
            <FileUpload
              files={files}
              onFilesChange={setFiles}
              accept="image/*,.pdf"
              maxFiles={4}
              maxSize={10 * 1024 * 1024}
              hint="Images or PDF · Up to 10 MB each · 4 files maximum"
            />
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Approval">
            <div className="scene-form">
              <div>
                <label className="scene-field-label" id="request-reviewers">
                  Reviewers *
                </label>
                <MultiSelect
                  aria-labelledby="request-reviewers"
                  options={team.map((person) => ({
                    value: person.id,
                    label: person.name,
                    description: person.discipline,
                  }))}
                  value={reviewers}
                  onValueChange={(values) => {
                    setReviewers(values);
                    setSubmitted(false);
                  }}
                />
              </div>
              <DetailList
                items={[
                  {
                    id: "project",
                    label: "Project",
                    value: projects.find((item) => item.id === project)?.name,
                  },
                  {
                    id: "amount",
                    label: "Requested",
                    value: `$${(Number(budget) || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                  },
                  { id: "priority", label: "Priority", value: priority },
                ]}
              />
              <label className="scene-toggle-row">
                <span>I confirm this request is within the project scope.</span>
                <input type="checkbox" required />
              </label>
              <Action primary type="submit" disabled={!reviewers.length}>
                Prepare request
                <IconArrowRight size={16} />
              </Action>
              <p className="scene-inline-status" role="status">
                {submitted
                  ? `“${title}” is ready for ${reviewers.length} reviewers in this preview.`
                  : "This sample prepares a local request. Nothing is sent."}
              </p>
            </div>
          </SceneCard>
        </aside>
      </form>
    </Scene>
  );
}

export function ProjectMenus() {
  const { projects, setProjects } = useWorkData();
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const shown = projects.filter((project) =>
    `${project.name} ${project.client}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <Scene
      id="dropdowns"
      title="Project actions"
      description="Keep frequent actions close to each record and secondary actions in its menu."
    >
      <div className="scene-toolbar">
        <span>{shown.length} projects</span>
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Find a project…"
        />
      </div>
      <SceneCard className="scene-table-card">
        <div
          className="scene-table-wrap"
          tabIndex={0}
          role="region"
          aria-label="Project actions"
        >
          <table className="scene-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Delivery</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((project) => (
                <tr key={project.id}>
                  <td>
                    <Link to={`/datagrid?project=${project.id}`}>
                      <strong>{project.name}</strong>
                    </Link>
                    <small>{project.client}</small>
                  </td>
                  <td>
                    <Person name={project.owner} />
                  </td>
                  <td>
                    <Pill>{project.status}</Pill>
                  </td>
                  <td>{project.due}</td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="scene-icon-action"
                          aria-label={`Actions for ${project.name}`}
                        >
                          <IconDots size={18} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link to={`/datagrid?project=${project.id}`}>
                            Open project
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/tasks-list?q=${encodeURIComponent(project.client)}`}
                          >
                            View deliverables
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={() => {
                            setProjects((current) =>
                              current.map((item) =>
                                item.id === project.id
                                  ? {
                                      ...item,
                                      status:
                                        project.status === "Complete"
                                          ? "In progress"
                                          : "Complete",
                                      progress:
                                        project.status === "Complete" ? 0 : 100,
                                    }
                                  : item,
                              ),
                            );
                            setNotice(
                              `${project.name} ${project.status === "Complete" ? "reopened" : "completed"}.`,
                            );
                          }}
                        >
                          {project.status === "Complete"
                            ? "Reopen project"
                            : "Mark complete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!shown.length && (
            <p className="scene-empty">No projects match your search.</p>
          )}
        </div>
      </SceneCard>
      <p role="status" className="scene-inline-status">
        {notice}
      </p>
    </Scene>
  );
}

export function ReviewDialogs() {
  const [dialog, setDialog] = useState<"invite" | "archive" | null>(null);
  const [email, setEmail] = useState("");
  const [archived, setArchived] = useState(false);
  const [notice, setNotice] = useState("");
  return (
    <Scene
      id="modals"
      title="Project sharing"
      description="Make access and project changes with the right amount of context."
    >
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <SceneCard
            title="Visitor experience"
            description="Culture venue · Shared with 3 people"
            action={<Pill>{archived ? "Archived" : "In progress"}</Pill>}
          >
            <div className="scene-resource">
              <Person name="Maya Okafor" subtitle="Project owner" />
              <Pill>Owner</Pill>
            </div>
            {[team[1], team[2]].map((person) => (
              <div className="scene-resource" key={person.id}>
                <Person name={person.name} subtitle={person.email} />
                <Pill>Editor</Pill>
              </div>
            ))}
            <div className="scene-action-footer">
              <Action primary onClick={() => setDialog("invite")}>
                <IconPlus size={16} />
                Invite collaborator
              </Action>
            </div>
          </SceneCard>
          <SceneCard
            title="Archive project"
            description="Keep completed work available for reference."
          >
            <p>
              Archiving closes the project to new work. Its files and history
              remain available to the team.
            </p>
            <Action
              onClick={() =>
                archived
                  ? (setArchived(false),
                    setNotice("Project restored in this preview."))
                  : setDialog("archive")
              }
            >
              {archived ? "Restore project" : "Archive project"}
            </Action>
          </SceneCard>
          <p role="status" className="scene-inline-status">
            {notice}
          </p>
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Access policy">
            <IconShieldCheck size={28} stroke={1.4} />
            <h3>Private to this project</h3>
            <p>
              Only invited members can view files and conversations. Guests can
              review deliverables without accessing other projects.
            </p>
            <Go to="/settings">Workspace access</Go>
          </SceneCard>
        </aside>
      </div>
      <WorkflowDialog
        open={dialog === "invite"}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Invite a collaborator"
        description="Prepare a project invitation for a teammate or client."
      >
        <form
          className="scene-form"
          onSubmit={(event) => {
            event.preventDefault();
            setNotice(`Invitation prepared for ${email}. No email was sent.`);
            setDialog(null);
          }}
        >
          <label>
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
            />
          </label>
          <label>
            Project role
            <select className="native-select">
              <option>Reviewer — comment on shared work</option>
              <option>Editor — manage deliverables</option>
            </select>
          </label>
          <div className="scene-action-footer">
            <Action onClick={() => setDialog(null)}>Cancel</Action>
            <Action primary type="submit">
              Prepare invitation
            </Action>
          </div>
        </form>
      </WorkflowDialog>
      <WorkflowDialog
        open={dialog === "archive"}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Archive Visitor experience?"
        description="The project will move out of active work. You can restore it later."
      >
        <div className="scene-dialog-callout">
          <IconAlertTriangle size={20} />
          <p>Make sure all open deliverables have an owner before archiving.</p>
        </div>
        <div className="scene-action-footer">
          <Action onClick={() => setDialog(null)}>Keep project</Action>
          <Action
            primary
            onClick={() => {
              setArchived(true);
              setDialog(null);
              setNotice("Project archived in this preview.");
            }}
          >
            Archive project
          </Action>
        </div>
      </WorkflowDialog>
    </Scene>
  );
}

export function ReviewQueue() {
  const { approvals, setApprovals } = useWorkData();
  const [dismissed, setDismissed] = useState(false);
  return (
    <Scene
      id="alerts"
      title="Review center"
      description="Decisions and issues that need your attention before work can continue."
    >
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          {!dismissed && (
            <div className="scene-attention-banner" role="status">
              <IconAlertTriangle size={20} />
              <div>
                <strong>One teammate is over capacity</strong>
                <p>
                  Leo has 44 hours allocated this week. Review the plan before
                  accepting another milestone.
                </p>
                <Link to="/users">Review team capacity</Link>
              </div>
              <button
                className="scene-icon-action"
                aria-label="Dismiss capacity notice"
                onClick={() => setDismissed(true)}
              >
                <IconX size={16} />
              </button>
            </div>
          )}
          <ApprovalQueue
            requests={approvals}
            onDecision={(id, status) =>
              setApprovals((current) =>
                current.map((item) =>
                  item.id === id ? { ...item, status } : item,
                ),
              )
            }
          />
          <SceneCard title="Decision history">
            <AuditTrail
              events={approvals
                .filter((item) => item.status !== "pending")
                .map((item) => ({
                  id: item.id,
                  actor: "Maya Okafor",
                  action:
                    item.status === "approved"
                      ? "approved"
                      : "requested changes to",
                  target: item.title,
                  time: "This session",
                  outcome: item.status === "approved" ? "success" : "warning",
                }))}
            />
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Before approving">
            <p>
              Confirm the deliverables match the agreed scope, the right people
              have reviewed them, and the client has a clear next step.
            </p>
            <Go to="/creative-review">Review artwork</Go>
          </SceneCard>
          <SceneCard title="Notification preferences">
            <p>Choose which review requests appear in your inbox.</p>
            <Go to="/settings">Manage notifications</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

export function ProjectLabels() {
  const { projects } = useWorkData();
  const [selected, setSelected] = useState(projects[0].id);
  const [labels, setLabels] = useState<Record<string, string[]>>({
    [projects[0].id]: ["design", "client-review"],
  });
  const [options, setOptions] = useState([
    { value: "design", label: "Design" },
    { value: "research", label: "Research" },
    { value: "client-review", label: "Client review" },
    { value: "handover", label: "Handover" },
    { value: "blocked", label: "Blocked" },
  ]);
  return (
    <Scene
      id="tags"
      title="Project labels"
      description="Use a small shared vocabulary to organize work across the studio."
    >
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <SceneCard title="Label an engagement">
            <div className="scene-form">
              <label>
                Project
                <select
                  className="native-select"
                  value={selected}
                  onChange={(event) => setSelected(event.target.value)}
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <label id="project-labels" className="scene-field-label">
                  Labels
                </label>
                <MultiSelect
                  aria-labelledby="project-labels"
                  options={options}
                  value={labels[selected] ?? []}
                  onValueChange={(value) =>
                    setLabels((current) => ({ ...current, [selected]: value }))
                  }
                  creatable
                  onCreate={(label) => {
                    const option = {
                      value: label.toLowerCase().replaceAll(" ", "-"),
                      label,
                    };
                    setOptions((current) => [...current, option]);
                    return option;
                  }}
                />
              </div>
            </div>
          </SceneCard>
          <SceneCard title="Across your projects">
            {projects.map((project) => (
              <div className="scene-list-row" key={project.id}>
                <div>
                  <strong>{project.name}</strong>
                  <small>{project.client}</small>
                </div>
                <div className="scene-label-list">
                  {(labels[project.id] ?? []).length ? (
                    labels[project.id].map((value) => (
                      <span className="scene-tag" key={value}>
                        {
                          options.find((option) => option.value === value)
                            ?.label
                        }
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No labels
                    </span>
                  )}
                </div>
              </div>
            ))}
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Shared labels">
            <p>
              Labels describe the work. Use status for its current stage and
              priority for what should happen first.
            </p>
            <p>{options.length} labels available in this workspace.</p>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

export function DeliveryProgress() {
  const [checks, setChecks] = useState(kickoffChecklist);
  const done = checks.filter((item) => item.checked).length;
  return (
    <Scene
      id="progress"
      title="Launch readiness"
      description="Track the checks that turn a finished design into a reliable handover."
    >
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <SceneCard
            title="Member portal launch"
            description="Target delivery · October 16, 2026"
          >
            <Steps
              steps={["Scope", "Build", "Review", "Handover"]}
              current={done === checks.length ? 3 : 2}
              className="my-5"
            />
            <div className="scene-readiness-total">
              <strong>{Math.round((done / checks.length) * 100)}%</strong>
              <span>
                {done} of {checks.length} launch checks complete
              </span>
            </div>
            <ResourceProgress
              label="Launch checklist"
              value={done}
              max={checks.length}
            />
          </SceneCard>
          <TaskChecklist
            title="Launch checks"
            items={checks}
            onCheckedChange={(id, checked) =>
              setChecks((current) =>
                current.map((item) =>
                  item.id === id ? { ...item, checked } : item,
                ),
              )
            }
          />
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Delivery owner">
            <Person name="Leo Nakamura" subtitle="Engineering" />
            <div className="mt-6">
              <DetailList
                items={[
                  { id: "review", label: "Next review", value: "September 25" },
                  { id: "launch", label: "Release", value: "October 16" },
                  {
                    id: "audience",
                    label: "Audience",
                    value: "Member collective",
                  },
                ]}
              />
            </div>
          </SceneCard>
          <SceneCard title="Release criteria">
            <p>
              All checks must be complete before the team schedules the final
              handover. A completed checklist moves the plan to the handover
              phase.
            </p>
            <Go to="/tasks">Open project board</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

export function ProjectPreferences({
  id = "segmented-control",
}: {
  id?: string;
}) {
  const [view, setView] = useState("Weekly");
  const [visibility, setVisibility] = useState("Team only");
  const [density, setDensity] = useState("Comfortable");
  const [saved, setSaved] = useState(false);
  return (
    <Scene
      id={id}
      title="View preferences"
      description="Set useful defaults for the way your team reviews project work."
    >
      <div className="scene-settings-surface">
        <SettingsSection
          title="Planning window"
          description="Choose how much work to see at once."
        >
          <FilterTabs
            items={["Daily", "Weekly", "Monthly"]}
            value={view}
            onChange={(value) => {
              setView(value);
              setSaved(false);
            }}
          />
          <p className="scene-preference-hint">
            {view === "Daily"
              ? "Focus on today's deadlines and handovers."
              : view === "Weekly"
                ? "See upcoming milestones and team capacity for the week."
                : "Plan larger milestones across the month."}
          </p>
        </SettingsSection>
        <SettingsSection
          title="Default visibility"
          description="Who can see a newly created project."
        >
          <FilterTabs
            items={["Team only", "Team & guests"]}
            value={visibility}
            onChange={(value) => {
              setVisibility(value);
              setSaved(false);
            }}
          />
          <p className="scene-preference-hint">
            {visibility === "Team only"
              ? "Only workspace members can view the project."
              : "Invited clients can also review shared work."}
          </p>
        </SettingsSection>
        <SettingsSection
          title="Row density"
          description="Adjust the amount of space in project lists."
        >
          <FilterTabs
            items={["Comfortable", "Compact"]}
            value={density}
            onChange={(value) => {
              setDensity(value);
              setSaved(false);
            }}
          />
          <div
            className={`scene-density-preview ${density === "Compact" ? "is-compact" : ""}`}
          >
            {["Visitor experience", "Member portal", "Ceramics identity"].map(
              (name) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <span>In progress</span>
                </div>
              ),
            )}
          </div>
        </SettingsSection>
        <div className="scene-settings-save">
          <span role="status">
            {saved
              ? "Preferences saved for this preview."
              : "Preview your choices before saving."}
          </span>
          <Action primary onClick={() => setSaved(true)}>
            Save preferences
          </Action>
        </div>
      </div>
    </Scene>
  );
}
