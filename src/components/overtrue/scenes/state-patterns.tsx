import { useEffect, useRef, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { IconX } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsSection } from "@/registry/overtrue/settings-section";
import { DetailList } from "@/registry/overtrue/detail-list";
import { TaskChecklist } from "@/registry/overtrue/task-checklist";
import { ApprovalQueue } from "@/registry/overtrue/approval-queue";
import { Steps } from "@/registry/overtrue/steps";
import { kickoffChecklist } from "@/data/workspace/operations";
import { useWorkData } from "../workspace/work-data";
import { WorkflowDialog } from "./workflows";
import {
  Scene,
  SceneCard,
  Action,
  Go,
  Person,
  Pill,
  SearchField,
} from "./shared";
import "driver.js/dist/driver.css";

export function PrivacyPreferences() {
  const [values, setValues] = useState({ analytics: false, preferences: true });
  const [saved, setSaved] = useState(values);
  const [status, setStatus] = useState("");
  useEffect(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("workspace-demo-consent") ?? "null",
      );
      if (
        data &&
        typeof data.analytics === "boolean" &&
        typeof data.preferences === "boolean"
      ) {
        setValues(data);
        setSaved(data);
      }
    } catch {
      /* Use the conservative default if browser storage is unavailable. */
    }
  }, []);
  function save(next = values) {
    setValues(next);
    setSaved(next);
    try {
      localStorage.setItem("workspace-demo-consent", JSON.stringify(next));
      setStatus("Preferences saved on this device.");
    } catch {
      setStatus(
        "Preferences applied for this visit. Browser storage is unavailable.",
      );
    }
  }
  return (
    <Scene
      id="cookie-banner"
      title="Privacy preferences"
      description="Control optional storage used by this workspace preview."
    >
      <div className="scene-product-grid">
        <SceneCard title="Cookie choices">
          <form
            className="scene-form"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <SettingsSection
              title="Essential"
              description="Required for workspace navigation and security."
            >
              <label className="scene-toggle-row">
                <span>Always enabled</span>
                <input type="checkbox" checked disabled />
              </label>
            </SettingsSection>
            <SettingsSection
              title="Preferences"
              description="Remember interface choices on this device."
            >
              <label className="scene-toggle-row">
                <span>Save preferences</span>
                <input
                  type="checkbox"
                  checked={values.preferences}
                  onChange={(e) => {
                    setValues({ ...values, preferences: e.target.checked });
                    setStatus("");
                  }}
                />
              </label>
            </SettingsSection>
            <SettingsSection
              title="Analytics"
              description="Allow anonymous usage measurement when an analytics service is connected."
            >
              <label className="scene-toggle-row">
                <span>Allow analytics</span>
                <input
                  type="checkbox"
                  checked={values.analytics}
                  onChange={(e) => {
                    setValues({ ...values, analytics: e.target.checked });
                    setStatus("");
                  }}
                />
              </label>
            </SettingsSection>
            <div className="scene-actions">
              <Action type="submit" primary>
                Save preferences
              </Action>
              <Action
                onClick={() => save({ analytics: false, preferences: false })}
              >
                Essential only
              </Action>
              <Action
                onClick={() => {
                  setValues(saved);
                  setStatus("");
                }}
              >
                Discard
              </Action>
            </div>
            <p role="status">{status}</p>
          </form>
        </SceneCard>
        <SceneCard title="About this preview">
          <p>
            This page stores your consent choice locally. It does not connect an
            analytics service or load advertising trackers.
          </p>
          <DetailList
            items={[
              { id: "essential", label: "Essential", value: "Enabled" },
              {
                id: "preferences",
                label: "Preferences",
                value: saved.preferences ? "Allowed" : "Disabled",
              },
              {
                id: "analytics",
                label: "Analytics",
                value: saved.analytics ? "Allowed" : "Disabled",
              },
            ]}
          />
          <Go to="/terms-of-service">Workspace terms</Go>
        </SceneCard>
      </div>
    </Scene>
  );
}

export function SavedViews() {
  const [views, setViews] = useState([
    "Visitor journey",
    "Identity handover",
    "Member permissions",
    "Publication templates",
  ]);
  const [removed, setRemoved] = useState<{
    name: string;
    index: number;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const [generation, setGeneration] = useState(0);
  return (
    <Scene
      id="toasts"
      title="Saved work views"
      description="Keep useful filters close, and remove views you no longer need."
      actions={<Go to="/tasks-list">Task list</Go>}
    >
      <Toast.Provider duration={7000}>
        <div className="scene-product-grid">
          <SceneCard title="Your views">
            <div className="scene-record-list">
              {views.map((view, index) => (
                <div key={view}>
                  <div className="scene-record-copy">
                    <strong>{view}</strong>
                    <small>Private view · Task workspace</small>
                  </div>
                  <Go
                    to={`/tasks-list?q=${encodeURIComponent(view.toLowerCase().split(" ")[0])}`}
                  >
                    Open
                  </Go>
                  <Action
                    onClick={() => {
                      setRemoved({ name: view, index });
                      setViews((items) =>
                        items.filter((item) => item !== view),
                      );
                      setGeneration((value) => value + 1);
                      setOpen(true);
                    }}
                  >
                    Remove
                  </Action>
                </div>
              ))}
              {!views.length && (
                <p>No saved views. Open the task list to continue working.</p>
              )}
            </div>
          </SceneCard>
          <SceneCard title="View settings">
            <p>
              Removing a saved view does not remove its tasks. Use Undo in the
              notification to restore the most recently removed view.
            </p>
            <DetailList
              items={[
                { id: "owner", label: "Owner", value: "Maya Okafor" },
                { id: "visibility", label: "Visibility", value: "Only you" },
              ]}
            />
          </SceneCard>
        </div>
        <Toast.Root
          key={generation}
          className="showcase-toast"
          open={open}
          onOpenChange={setOpen}
        >
          <div>
            <Toast.Title className="showcase-toast-title">
              View removed
            </Toast.Title>
            <Toast.Description>
              {removed?.name} was removed from your saved views.
            </Toast.Description>
            <Toast.Action asChild altText="Restore the removed saved view">
              <button
                onClick={() => {
                  if (removed)
                    setViews((items) => {
                      const next = [...items];
                      next.splice(removed.index, 0, removed.name);
                      return next;
                    });
                  setRemoved(null);
                }}
              >
                Undo
              </button>
            </Toast.Action>
          </div>
          <Toast.Close aria-label="Dismiss notification">
            <IconX size={16} />
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport className="showcase-toast-viewport" />
      </Toast.Provider>
    </Scene>
  );
}

export function DataLoading({ id = "placeholder" }: { id?: string }) {
  const { projects } = useWorkData();
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [simulateError, setSimulateError] = useState(false);
  useEffect(() => {
    setState("loading");
    const timer = window.setTimeout(
      () => setState(simulateError ? "error" : "ready"),
      900,
    );
    return () => window.clearTimeout(timer);
  }, [attempt, simulateError]);
  const startup = id === "page-loader";
  return (
    <Scene
      id={id}
      title={startup ? "Opening your workspace" : "Project data"}
      description={
        startup
          ? "Prepare the project index and recent activity."
          : "Review the loaded project register, including retry and loading states."
      }
      actions={
        <Action
          disabled={state === "loading"}
          onClick={() => setAttempt((value) => value + 1)}
        >
          Refresh data
        </Action>
      }
    >
      <div className="scene-product-grid">
        <SceneCard
          title={startup ? "Workspace readiness" : "Project register"}
          action={
            <Pill>
              {state === "loading"
                ? "Loading"
                : state === "error"
                  ? "Error"
                  : "Ready"}
            </Pill>
          }
        >
          <div aria-busy={state === "loading"} aria-live="polite">
            {state === "loading" ? (
              <div className="scene-loading-rows" role="status">
                <span className="sr-only">Loading projects</span>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="size-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-4 w-3/5" />
                      <Skeleton className="mt-3 h-3 w-2/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : state === "error" ? (
              <div className="scene-feedback-result">
                <h3>Project data couldn’t load</h3>
                <p>
                  The example connection failed. Turn off the failure simulation
                  and retry.
                </p>
                <Action
                  onClick={() => {
                    setSimulateError(false);
                    setAttempt((value) => value + 1);
                  }}
                >
                  Retry connection
                </Action>
              </div>
            ) : (
              <>
                <div className="scene-record-list">
                  {projects.slice(0, 4).map((project) => (
                    <div key={project.id}>
                      <div className="scene-record-copy">
                        <strong>{project.name}</strong>
                        <small>
                          {project.owner} · {project.client}
                        </small>
                      </div>
                      <Pill>{project.status}</Pill>
                    </div>
                  ))}
                </div>
                {startup && (
                  <Go to="/" primary>
                    Open workspace
                  </Go>
                )}
              </>
            )}
          </div>
        </SceneCard>
        <SceneCard title="Connection preview">
          <label className="scene-toggle-row">
            <span>Simulate a failed request</span>
            <input
              type="checkbox"
              checked={simulateError}
              onChange={(e) => setSimulateError(e.target.checked)}
            />
          </label>
          <p>
            This example loads local records after a short delay. No remote
            request is made.
          </p>
          <Steps
            orientation="vertical"
            steps={[
              "Connect to workspace",
              "Load project records",
              "Ready to continue",
            ]}
            current={state === "ready" ? 3 : state === "loading" ? 1 : 0}
          />
        </SceneCard>
      </div>
    </Scene>
  );
}

export function ProjectInspector() {
  const { projects } = useWorkData();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const project = projects.find((item) => item.id === selected);
  return (
    <Scene
      id="offcanvas"
      title="Project quick review"
      description="Inspect a project while keeping your place in the register."
    >
      <SceneCard
        title="Active projects"
        action={
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search projects"
          />
        }
      >
        <div className="scene-record-list">
          {projects
            .filter((item) =>
              `${item.name} ${item.client}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .map((item) => (
              <div key={item.id}>
                <div className="scene-record-copy">
                  <strong>{item.name}</strong>
                  <small>
                    {item.client} · {item.owner}
                  </small>
                </div>
                <Pill>{item.status}</Pill>
                <Action onClick={() => setSelected(item.id)}>Inspect</Action>
              </div>
            ))}
        </div>
      </SceneCard>
      <WorkflowDialog
        open={!!project}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        className="scene-inspector-drawer"
        title={project?.name ?? "Project details"}
        description="Project summary and next milestone."
      >
        {project && (
          <div className="scene-product-primary">
            <Pill>{project.status}</Pill>
            <Person name={project.owner} subtitle="Project owner" />
            <DetailList
              items={[
                { id: "client", label: "Client", value: project.client },
                {
                  id: "budget",
                  label: "Budget",
                  value: `$${project.budget.toLocaleString()}`,
                },
                { id: "due", label: "Next milestone", value: project.due },
                {
                  id: "complete",
                  label: "Progress",
                  value: `${project.progress}%`,
                },
              ]}
            />
            <p>
              {project.brief ??
                "Confirm the scope, review the next deliverable, and keep the client informed of progress."}
            </p>
            <Go to={`/datagrid?project=${project.id}`} primary>
              Open full project
            </Go>
          </div>
        )}
      </WorkflowDialog>
    </Scene>
  );
}

export function GuidedWorkspace({ id = "tour" }: { id?: string }) {
  const { approvals, setApprovals } = useWorkData();
  const [checks, setChecks] = useState(kickoffChecklist);
  const driverRef = useRef<import("driver.js").Driver | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      driverRef.current?.destroy();
    };
  }, []);
  async function startTour() {
    const { driver } = await import("driver.js");
    if (!mounted.current) return;
    driverRef.current?.destroy();
    driverRef.current = driver({
      showProgress: true,
      animate: false,
      popoverClass: "workspace-tour-popover",
      steps: [
        {
          element: "#tour-project-brief",
          popover: {
            title: "Start with the project",
            description: "Keep the owner, scope, and next review date visible.",
          },
        },
        {
          element: "#tour-project-checklist",
          popover: {
            title: "Track the prerequisites",
            description: "Check off each item as the project gets ready.",
          },
        },
        {
          element: "#tour-project-approvals",
          popover: {
            title: "Resolve open decisions",
            description:
              "Approve the handover or ask for changes from the review queue.",
          },
        },
      ],
    });
    driverRef.current.drive();
  }
  return (
    <Scene
      id={id}
      title={
        id === "tour"
          ? "Get to know your workspace"
          : "Project delivery workspace"
      }
      description="Visitor experience · A complete workspace for brief, readiness, and review."
      actions={
        <Action primary onClick={startTour}>
          Take a quick tour
        </Action>
      }
    >
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <section id="tour-project-checklist">
            <TaskChecklist
              title="Project readiness"
              items={checks}
              onCheckedChange={(key, checked) =>
                setChecks((items) =>
                  items.map((item) =>
                    item.id === key ? { ...item, checked } : item,
                  ),
                )
              }
            />
          </section>
          <section id="tour-project-approvals">
            <ApprovalQueue
              requests={approvals}
              onDecision={(key, decision) =>
                setApprovals((items) =>
                  items.map((item) =>
                    item.id === key ? { ...item, status: decision } : item,
                  ),
                )
              }
            />
          </section>
        </div>
        <aside id="tour-project-brief" className="scene-product-aside">
          <SceneCard title="Project brief">
            <Person name="Maya Okafor" subtitle="Project owner" />
            <p>
              Create a welcoming arrival journey that helps first-time visitors
              find the right exhibition.
            </p>
            <DetailList
              items={[
                { id: "client", label: "Client", value: "Culture venue" },
                { id: "review", label: "Next review", value: "September 25" },
                { id: "deadline", label: "Delivery", value: "October 09" },
              ]}
            />
            <Go to="/datagrid">Full project details</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
