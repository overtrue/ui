export const productCatalog = [
  {
    name: "task-checklist",
    title: "Task checklist",
    category: "Forms",
    dependencies: [],
    previewWidth: 560,
    description:
      "Actionable checklists with completion totals, per-item saving and retry feedback.",
    imports: "TaskChecklist, type ChecklistItem",
    exampleImports: 'import { useState } from "react"',
    usage: `function Example() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "brief", title: "Confirm the project brief", checked: true },
    { id: "access", title: "Invite the delivery team", description: "Give each person the access they need.", checked: false },
  ])
  return <TaskChecklist title="Ready for kickoff" items={items} onCheckedChange={(id, checked) => {
    setItems(current => current.map(item => item.id === id ? { ...item, checked } : item))
  }} />
}`,
    notes:
      "Completion is controlled by items. Persist in onCheckedChange, then update items after success; rejected saves keep the existing state and show a retry message. Each row saves independently. Without a callback the checklist is read-only. Use a key when changing projects.",
    api: [
      [
        "items",
        "readonly ChecklistItem[]",
        "ID, title, checked, and optional description, disabled and metadata.",
      ],
      [
        "onCheckedChange",
        "(id, checked) => void | Promise<void>",
        "Request a state change; resolve after saving or reject to keep the current value.",
      ],
      [
        "title / description",
        "string",
        "Checklist heading and supporting context.",
      ],
    ],
  },
  {
    name: "approval-queue",
    title: "Approval queue",
    category: "Blocks",
    dependencies: ["button"],
    previewWidth: 760,
    description:
      "Review requests with explicit decisions, independent pending states and recoverable failures.",
    imports: "ApprovalQueue, type ApprovalRequest",
    exampleImports: 'import { useState } from "react"',
    usage: `function Example() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    { id: "REQ-104", title: "Identity handover", requestedBy: "June Park", date: "Today", category: "Deliverable", status: "pending" },
  ])
  return <ApprovalQueue requests={requests} onDecision={(id, status) => {
    setRequests(current => current.map(request => request.id === id ? { ...request, status } : request))
  }} />
}`,
    notes:
      "Applications own authorization, review context and persistence. The block never changes a request by itself. Return a promise from onDecision, then replace requests after success; rejected decisions remain pending with inline retry feedback. Without the callback, requests are read-only. Remount with a key when changing workspace.",
    api: [
      [
        "requests",
        "readonly ApprovalRequest[]",
        "ID, title, requester, date, status and optional description, category, detail and href.",
      ],
      [
        "onDecision",
        "(id, decision) => void | Promise<void>",
        "Approve or request changes; the caller owns saving and permission checks.",
      ],
      ["title / description", "string", "Queue heading and supporting text."],
    ],
  },
  {
    name: "file-browser",
    title: "File browser",
    category: "Tables & lists",
    dependencies: [],
    previewWidth: 760,
    description:
      "A compact file collection with selection, metadata, previews and real download links.",
    imports: "FileBrowser",
    exampleImports: 'import { useState } from "react"',
    usage: `function Example() {
  const [selected, setSelected] = useState<string[]>([])
  return <FileBrowser files={[
    { id: "assets", name: "Brand assets", kind: "folder", owner: "June Park", updated: "Today", size: "8 files" },
    { id: "brief", name: "Project brief.md", kind: "file", owner: "Maya Okafor", updated: "Yesterday", size: "12 KB" },
  ]} selectedIds={selected} onSelectionChange={setSelected} />
}`,
    notes:
      "This browses records; it does not upload or host files. Selection is controlled, and select-all only changes visible records. Supply onOpen for navigation or preview and downloadUrl only for an actual permitted file. Metadata is already formatted by your application. Use FileList for a short attachment list without selection or columns.",
    api: [
      [
        "files",
        "readonly BrowserFile[]",
        "ID, name, kind and optional size, updated, owner, preview, metadata and downloadUrl.",
      ],
      [
        "selectedIds / onSelectionChange",
        "readonly string[] / (ids) => void",
        "Controlled selection; records outside the current view are retained.",
      ],
      ["onOpen", "(file) => void", "Handle opening a file or folder."],
      ["empty", "string", "Message for an empty or filtered collection."],
    ],
  },
  {
    name: "audit-trail",
    title: "Audit trail",
    category: "Tables & lists",
    dependencies: [],
    previewWidth: 680,
    description:
      "A readable event history with actors, timestamps and expandable field changes.",
    usage: `<AuditTrail events={[
  { id: "evt-1", actor: "Maya Okafor", action: "updated", target: "Member portal", time: "12 minutes ago", changes: [{ field: "Status", before: "Planned", after: "In progress" }] },
  { id: "evt-2", actor: "Leo Nakamura", action: "joined the project", time: "1 hour ago", outcome: "success" },
]} />`,
    notes:
      "Pass events in the display order you need. Time strings are formatted by the caller; dateTime may contain an ISO timestamp for semantic markup. Changes use plain text and native details disclosure. This is a display component, not a secure audit store; enforce retention and access in your application.",
    api: [
      [
        "events",
        "readonly AuditEvent[]",
        "ID, actor, action, time and optional target, dateTime, image, outcome, context and field changes.",
      ],
      ["label", "string", "Accessible name for the event history."],
    ],
  },
  {
    name: "team-workload",
    title: "Team workload",
    category: "Blocks",
    dependencies: [],
    previewWidth: 520,
    description:
      "Compare allocated time with each teammate’s capacity and make overload visible.",
    usage: `<TeamWorkload period="Sep 21–25" members={[
  { id: "maya", name: "Maya Okafor", role: "Product design", allocated: 32, capacity: 40 },
  { id: "leo", name: "Leo Nakamura", role: "Engineering", allocated: 44, capacity: 40 },
  { id: "june", name: "June Park", role: "Brand design", allocated: 18, capacity: 32 },
]} />`,
    notes:
      "Allocated and capacity use the same unit. Over-capacity rows show their excess numerically as well as by color. Zero capacity remains meaningful and never divides by zero. The component displays caller-supplied allocations; it does not infer availability, holidays or assignments.",
    api: [
      [
        "members",
        "readonly WorkloadMember[]",
        "ID, name, allocated, capacity and optional role, image and href.",
      ],
      [
        "period / unit",
        "string",
        "Display period and unit; defaults to This week and h.",
      ],
      ["title", "string", "Heading for the capacity panel."],
    ],
  },
  {
    name: "settings-section",
    title: "Settings section",
    category: "Layout",
    dependencies: [],
    previewWidth: 760,
    description:
      "Group related fields beside their explanation, with room for save feedback and actions.",
    usage: `<SettingsSection title="Workspace identity" description="These details appear on shared projects.">
  <label className="grid gap-2 text-sm">Workspace name<input className="rounded-md border border-input px-3 py-2" defaultValue="Acme Studio" /></label>
</SettingsSection>`,
    notes:
      "This layout owns no form state. Use it inside your form and provide permanent field labels, validation and saving behavior. Its container query stacks explanations above fields in narrow panels. Footer accepts actions or save feedback.",
    api: [
      [
        "title / description",
        "string / ReactNode",
        "Section name and explanation.",
      ],
      ["children", "ReactNode", "Related, labeled fields."],
      ["footer", "ReactNode", "Optional section actions or status."],
    ],
  },
  {
    name: "split-view",
    title: "Split view",
    category: "Layout",
    dependencies: [],
    previewWidth: 900,
    description:
      "Keep a collection and its selected record together, with a focused mobile detail view.",
    imports: "SplitView",
    exampleImports: 'import { useState } from "react"',
    usage: `function Example() {
  const [selected, setSelected] = useState(false)
  return <SplitView selected={selected} onBack={() => setSelected(false)} listLabel="Conversations" list={
    <button className="w-full p-5 text-left" onClick={() => setSelected(true)}>Project review</button>
  }><div className="p-5">{selected ? "The review notes are ready." : "Select a conversation."}</div></SplitView>
}`,
    notes:
      "The application owns selection and record contents. On wide containers both panes stay visible; narrow containers show the list or selected detail. The back action returns focus to the list item that opened the record. Empty-detail content and actions remain application-owned.",
    api: [
      ["list / children", "ReactNode", "Collection and selected record panes."],
      [
        "selected / onBack",
        "boolean / () => void",
        "Control which pane opens on mobile.",
      ],
      [
        "listLabel / detailLabel",
        "string",
        "Accessible pane names and back-button copy.",
      ],
    ],
  },
] as const;
