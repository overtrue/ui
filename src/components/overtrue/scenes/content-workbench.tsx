import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { IconCalendar, IconCheck, IconStar } from "@tabler/icons-react";
import {
  EventCalendar,
  type EventCalendarEvent,
  type EventCalendarView,
} from "@/registry/overtrue/event-calendar";
import {
  FileUpload,
  type FileUploadItem,
} from "@/registry/overtrue/file-upload";
import { FileBrowser } from "@/registry/overtrue/file-browser";
import { DetailList } from "@/registry/overtrue/detail-list";
import { Steps } from "@/registry/overtrue/steps";
import { TaskChecklist } from "@/registry/overtrue/task-checklist";
import { WorkspaceEditor } from "../workspace/plugins";
import { WorkflowDialog } from "./workflows";
import { Scene, SceneCard, Action, Go, Person, Pill } from "./shared";

const calendarEvents: EventCalendarEvent[] = [
  {
    id: "planning",
    title: "Studio planning",
    start: new Date(2026, 8, 21, 9),
    end: new Date(2026, 8, 21, 10),
    color: "chart-2",
    location: "Studio / Main room",
  },
  {
    id: "review",
    title: "Visitor concept review",
    start: new Date(2026, 8, 23, 10),
    end: new Date(2026, 8, 23, 11),
    color: "primary",
    location: "Culture venue",
  },
  {
    id: "handover",
    title: "Identity handover",
    start: new Date(2026, 8, 24, 14),
    end: new Date(2026, 8, 24, 15),
    color: "chart-3",
    location: "Video call",
  },
  {
    id: "focus",
    title: "Focus afternoon",
    start: new Date(2026, 8, 25, 13),
    end: new Date(2026, 8, 25, 16),
    color: "chart-2",
    location: "Studio",
  },
];
function dateInput(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function StudioCalendar() {
  const mobile = useIsMobile();
  const [view, setView] = useState<EventCalendarView>("week");
  useEffect(() => {
    setView(mobile ? "agenda" : "week");
  }, [mobile]);
  const [events, setEvents] = useState(calendarEvents);
  const [category, setCategory] = useState("All events");
  const [draft, setDraft] = useState<{
    id?: string;
    title: string;
    date: string;
    time: string;
    duration: string;
    location: string;
  } | null>(null);
  const [notice, setNotice] = useState("");
  const begin = (
    start = new Date(2026, 8, 21, 10),
    event?: EventCalendarEvent,
  ) =>
    setDraft({
      id: event?.id,
      title: event?.title ?? "",
      date: dateInput(start),
      time: `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
      duration: String(
        event ? (event.end.getTime() - event.start.getTime()) / 60000 : 60,
      ),
      location: event?.location ?? "Studio",
    });
  const filtered = events.filter(
    (event) =>
      category === "All events" ||
      (category === "Reviews"
        ? event.title.toLowerCase().includes("review")
        : !event.title.toLowerCase().includes("review")),
  );
  return (
    <Scene
      id="fullcalendar"
      title="Studio calendar"
      description="Reviews, handovers, and protected focus time · September 2026"
      actions={
        <Action primary onClick={() => begin()}>
          New event
        </Action>
      }
    >
      <div className="scene-calendar-layout">
        <aside className="scene-product-aside">
          <SceneCard title="Calendars">
            <div className="scene-note-list">
              {["All events", "Reviews", "Team time"].map((value) => (
                <div key={value}>
                  <button
                    className="scene-calendar-filter"
                    aria-pressed={category === value}
                    onClick={() => setCategory(value)}
                  >
                    <IconCalendar size={16} />
                    {value}
                    <span>
                      {
                        events.filter(
                          (event) =>
                            value === "All events" ||
                            (value === "Reviews"
                              ? event.title.toLowerCase().includes("review")
                              : !event.title.toLowerCase().includes("review")),
                        ).length
                      }
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </SceneCard>
          <SceneCard title="Upcoming">
            <div className="scene-note-list">
              {[...filtered]
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .slice(0, 3)
                .map((event) => (
                  <div key={event.id}>
                    <button
                      className="scene-text-button"
                      onClick={() => begin(event.start, event)}
                    >
                      {event.title}
                    </button>
                    <p>
                      {event.start.toLocaleDateString("en-GB", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      ·{" "}
                      {event.start.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
            </div>
          </SceneCard>
        </aside>
        <div className="scene-product-primary">
          <EventCalendar
            events={filtered}
            defaultDate={new Date(2026, 8, 21)}
            now={new Date(2026, 8, 21, 10, 30)}
            view={view}
            onViewChange={setView}
            startHour={8}
            endHour={18}
            height={view === "agenda" ? "auto" : 650}
            weekStartsOn={1}
            locale="en-GB"
            onSlotClick={(start) => begin(start)}
            onEventClick={(event) => begin(event.start, event)}
          />
          <p role="status" className="scene-subtle">
            {notice || "Event changes are kept in this page preview."}
          </p>
        </div>
      </div>
      <WorkflowDialog
        open={!!draft}
        onOpenChange={(open) => {
          if (!open) setDraft(null);
        }}
        title={draft?.id ? "Edit event" : "New event"}
        description="Set a time and place for your team."
      >
        {draft && (
          <form
            className="scene-form"
            onSubmit={(e) => {
              e.preventDefault();
              const start = new Date(`${draft.date}T${draft.time}`);
              const item = {
                id: draft.id ?? crypto.randomUUID(),
                title: draft.title.trim(),
                start,
                end: new Date(start.getTime() + Number(draft.duration) * 60000),
                location: draft.location,
              };
              if (!item.title) return;
              setEvents((items) =>
                draft.id
                  ? items.map((event) => (event.id === draft.id ? item : event))
                  : [...items, item],
              );
              setNotice(`${item.title} ${draft.id ? "updated" : "added"}.`);
              setDraft(null);
            }}
          >
            <label>
              Event title
              <input
                required
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </label>
            <div className="scene-grid-two">
              <label>
                Date
                <input
                  type="date"
                  required
                  value={draft.date}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                />
              </label>
              <label>
                Start time
                <input
                  type="time"
                  required
                  value={draft.time}
                  onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                />
              </label>
            </div>
            <label>
              Duration
              <select
                value={draft.duration}
                onChange={(e) =>
                  setDraft({ ...draft, duration: e.target.value })
                }
              >
                {[30, 60, 90, 120, 180].map((value) => (
                  <option key={value} value={value}>
                    {value} minutes
                  </option>
                ))}
              </select>
            </label>
            <label>
              Location
              <input
                value={draft.location}
                onChange={(e) =>
                  setDraft({ ...draft, location: e.target.value })
                }
              />
            </label>
            <div className="scene-actions">
              <Action primary type="submit">
                Save event
              </Action>
              {draft.id && (
                <Action
                  onClick={() => {
                    setEvents((items) =>
                      items.filter((event) => event.id !== draft.id),
                    );
                    setNotice("Event deleted.");
                    setDraft(null);
                  }}
                >
                  Delete event
                </Action>
              )}
            </div>
          </form>
        )}
      </WorkflowDialog>
    </Scene>
  );
}

export function AssetIntake() {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [folder, setFolder] = useState("Visitor experience / Source files");
  const [saved, setSaved] = useState(false);
  return (
    <Scene
      id="dropzone"
      title="Add project files"
      description="Prepare source files for the next project review."
      actions={<Go to="/gallery">Asset library</Go>}
    >
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <SceneCard
            title="Choose files"
            description="Images, PDFs, and ZIP archives · Up to 20 MB per file"
          >
            <FileUpload
              files={files}
              onFilesChange={(items) => {
                setFiles(items);
                setSaved(false);
              }}
              accept="image/*,.pdf,.zip"
              maxSize={20 * 1024 * 1024}
              maxFiles={10}
            />
          </SceneCard>
          {files.length > 0 && (
            <SceneCard
              title="Prepared files"
              description="Files remain on your device in this preview."
            >
              <FileBrowser
                files={files.map((file) => ({
                  id: file.id,
                  name: file.name,
                  size: `${Math.round(file.size / 1024)} KB`,
                  kind: file.type.startsWith("image/") ? "image" : "file",
                  preview: file.previewUrl,
                }))}
              />
            </SceneCard>
          )}
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Destination">
            <form
              className="scene-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSaved(true);
              }}
            >
              <label>
                Project folder
                <select
                  value={folder}
                  onChange={(e) => {
                    setFolder(e.target.value);
                    setSaved(false);
                  }}
                >
                  <option>Visitor experience / Source files</option>
                  <option>Identity system / Review assets</option>
                  <option>Studio / Shared resources</option>
                </select>
              </label>
              <DetailList
                items={[
                  {
                    id: "files",
                    label: "Files selected",
                    value: String(files.length),
                  },
                  {
                    id: "size",
                    label: "Total size",
                    value: `${(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB`,
                  },
                  {
                    id: "access",
                    label: "Access",
                    value: "Project contributors",
                  },
                ]}
              />
              <Action type="submit" primary disabled={!files.length}>
                Prepare handover
              </Action>
              <p role="status">
                {saved ? `${files.length} files prepared for ${folder}.` : ""}
              </p>
            </form>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

const initialBrief =
  "<h2>Visitor experience — review brief</h2><p>Help first-time visitors find the right exhibition without asking for directions.</p><h3>What we need to decide</h3><ul><li>Choose one of the three entrance concepts.</li><li>Confirm the language and hierarchy for directional signs.</li><li>Agree on the next visitor testing session.</li></ul>";
export function BriefEditor() {
  const [title, setTitle] = useState("Visitor experience — review brief");
  const [html, setHtml] = useState(initialBrief);
  const [saved, setSaved] = useState({ title, html: initialBrief });
  const [status, setStatus] = useState("");
  const dirty = title !== saved.title || html !== saved.html;
  return (
    <Scene
      id="wysiwyg"
      title="Edit project brief"
      description="Visitor experience · Draft document"
      actions={
        <Action
          primary
          disabled={!dirty || !title.trim()}
          onClick={() => {
            setSaved({ title, html });
            setStatus("Draft saved in this preview.");
          }}
        >
          Save draft
        </Action>
      }
    >
      <div className="scene-product-grid">
        <SceneCard title="Document">
          <div className="scene-form">
            <label>
              Document title
              <input
                value={title}
                required
                onChange={(e) => {
                  setTitle(e.target.value);
                  setStatus("");
                }}
              />
            </label>
            <WorkspaceEditor
              id="project-brief-editor"
              defaultValue={initialBrief}
              onChange={(value) => {
                setHtml(value);
                setStatus("");
              }}
            />
            <div className="scene-toolbar">
              <span role="status">
                {status || (dirty ? "Unsaved changes" : "All changes saved")}
              </span>
              <Pill>Draft</Pill>
            </div>
          </div>
        </SceneCard>
        <aside className="scene-product-aside">
          <SceneCard title="Document details">
            <Person name="Maya Okafor" subtitle="Document owner" />
            <DetailList
              items={[
                {
                  id: "project",
                  label: "Project",
                  value: "Visitor experience",
                },
                { id: "version", label: "Version", value: "3 · Draft" },
                { id: "sharing", label: "Visible to", value: "Project team" },
              ]}
            />
            <Go to="/prose">Writing guide</Go>
          </SceneCard>
          <TaskChecklist
            title="Ready for review"
            items={[
              {
                id: "scope",
                title: "Name the decision to be made",
                checked: true,
              },
              {
                id: "source",
                title: "Link the supporting concepts",
                checked: false,
              },
              {
                id: "deadline",
                title: "Include a feedback deadline",
                checked: false,
              },
            ]}
          />
        </aside>
      </div>
    </Scene>
  );
}

export function ClientFeedback() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <Scene
      id="stars-rating"
      title="Project feedback"
      description="Editorial system · Completed September 18, 2026"
    >
      <div className="scene-product-grid">
        <SceneCard
          title={
            submitted ? "Thank you for the feedback" : "How did the project go?"
          }
          description="Share your experience with the delivery team."
        >
          {submitted ? (
            <div className="scene-feedback-result">
              <IconCheck size={32} />
              <h3>{rating} out of 5</h3>
              <p>{comment || "No additional comments."}</p>
              <Action onClick={() => setSubmitted(false)}>Edit feedback</Action>
            </div>
          ) : (
            <form
              className="scene-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (rating) setSubmitted(true);
              }}
            >
              <fieldset className="scene-rating">
                <legend>Overall experience</legend>
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="rating"
                      required
                      value={value}
                      checked={rating === value}
                      onChange={() => setRating(value)}
                    />
                    <IconStar
                      size={32}
                      fill={value <= rating ? "currentColor" : "none"}
                    />
                    <span className="sr-only">
                      {value} {value === 1 ? "star" : "stars"}
                    </span>
                  </label>
                ))}
              </fieldset>
              <label>
                What worked well? What could be better?
                <textarea
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Your feedback helps us improve the next project."
                />
              </label>
              <Action type="submit" primary>
                Submit feedback
              </Action>
              <small>Feedback is saved only in this preview.</small>
            </form>
          )}
        </SceneCard>
        <SceneCard title="Project summary">
          <Person name="Sofia Rossi" subtitle="Delivery lead" />
          <DetailList
            items={[
              { id: "project", label: "Project", value: "Editorial system" },
              { id: "scope", label: "Scope", value: "Templates & guidelines" },
              {
                id: "handover",
                label: "Handover",
                value: "September 18, 2026",
              },
            ]}
          />
          <Go to="/gallery">Final deliverables</Go>
        </SceneCard>
      </div>
    </Scene>
  );
}

export function LaunchChecklist({ id = "steps" }: { id?: string }) {
  const [checks, setChecks] = useState([true, true, false, false]);
  const labels = [
    "Project brief agreed",
    "Source files prepared",
    "Client approval received",
    "Handover published",
  ];
  const current = checks.findIndex((checked) => !checked);
  return (
    <Scene
      id={id}
      title="Project launch"
      description="A shared checklist from final review to client handover."
      actions={<Go to="/datagrid">Project overview</Go>}
    >
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <SceneCard title="Delivery milestones">
            <Steps
              steps={["Prepare", "Review", "Approve", "Handover"]}
              current={current === -1 ? 4 : current}
            />
          </SceneCard>
          <TaskChecklist
            title="Launch readiness"
            description="Complete each prerequisite before moving to the next stage."
            items={labels.map((title, i) => ({
              id: String(i),
              title,
              checked: checks[i],
              disabled: i > 0 && !checks[i - 1],
              description: [
                "Scope and review criteria confirmed with the client.",
                "Editable files and approved exports are in the project folder.",
                "The client has accepted the final deliverables.",
                "Share the handover and record the completion date.",
              ][i],
            }))}
            onCheckedChange={(key, checked) =>
              setChecks((items) =>
                items.map((value, i) =>
                  i === Number(key)
                    ? checked
                    : !checked && i > Number(key)
                      ? false
                      : value,
                ),
              )
            }
          />
          {checks.every(Boolean) && (
            <SceneCard title="Ready to hand over">
              <p>All launch prerequisites are complete.</p>
              <Go to="/buttons" primary>
                Prepare delivery
              </Go>
            </SceneCard>
          )}
        </div>
        <SceneCard title="Delivery owner">
          <Person name="Maya Okafor" subtitle="Visitor experience" />
          <DetailList
            items={[
              { id: "due", label: "Target date", value: "October 09" },
              {
                id: "progress",
                label: "Completed",
                value: `${checks.filter(Boolean).length} of 4 milestones`,
              },
            ]}
          />
          <Go to="/creative-review">Open review</Go>
        </SceneCard>
      </div>
    </Scene>
  );
}
