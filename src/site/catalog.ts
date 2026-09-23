import cards from "../blocks/catalog.json" with { type: "json" };
import { dashboardCatalog } from "./dashboard-catalog.ts";

export const cardCount = cards.length;
const items = [
  ...dashboardCatalog,
  {
    name: "integration-list",
    title: "Integration list",
    category: "Blocks",
    previewWidth: 600,
    previewHeight: 480,
    description:
      "Workspace connections with account details, async actions, and failure feedback that keeps retry within reach.",
    dependencies: ["card", "button"],
    imports: "IntegrationList, type Integration",
    exampleImports:
      'import { useState } from "react"\nimport { IconBrandGithub, IconBrandSlack, IconBrandNotion } from "@tabler/icons-react"',
    usage: `function Example() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: "github", name: "GitHub", description: "Bring pull requests and commits into your projects.", icon: <IconBrandGithub />, connected: true, account: "overtrue/ui" },
    { id: "slack", name: "Slack", description: "Send project updates to your team’s channels.", icon: <IconBrandSlack />, connected: false },
    { id: "notion", name: "Notion", description: "Keep project notes close to the work they support.", icon: <IconBrandNotion />, connected: false },
  ])
  return <div>
    <IntegrationList integrations={integrations} onConnectionChange={(id, connected) => {
      setIntegrations(current => current.map(item => item.id === id ? { ...item, connected } : item))
    }} />
    <p className="mt-3 text-xs text-muted-foreground">Interactive demo. No external accounts are connected.</p>
  </div>
}`,
    notes:
      "A controlled workspace settings block. The example only changes local state. In your application, complete authorization or disconnection in onConnectionChange, update integrations after success, and reject on failure. Each row handles its own pending and retry feedback; other rows remain usable. Without a callback, connections are read-only. Use stable service IDs and remount with a key when switching workspaces. No credentials or OAuth flow are provided by this block.",
    api: [
      [
        "integrations",
        "readonly Integration[]",
        "Stable ID, name, description, connected state, and optional icon and account label.",
      ],
      [
        "onConnectionChange",
        "(id, connected) => void | Promise<void>",
        "Request a new connection state. The caller owns authorization, persistence, and data updates.",
      ],
      ["className", "string", "Additional classes for the outer section card."],
    ],
  },
  {
    name: "team-access",
    title: "Team access",
    category: "Blocks",
    previewWidth: 600,
    previewHeight: 420,
    description:
      "A searchable team roster with read-only owner roles and editable workspace access.",
    dependencies: ["card", "input"],
    imports: "TeamAccess, type AccessMember",
    exampleImports: 'import { useState } from "react"',
    usage: `function Example() {
  const [members, setMembers] = useState<AccessMember[]>([
    { id: "chris", name: "Chris An", email: "chris@example.com", role: "Owner" },
    { id: "maya", name: "Maya Okafor", email: "maya@example.com", role: "Admin" },
    { id: "leo", name: "Leo Nakamura", email: "leo@example.com", role: "Member" },
  ])
  return <TeamAccess members={members} onRoleChange={(id, role) => {
    setMembers(current => current.map(member => member.id === id ? { ...member, role } : member))
  }} />
}`,
    notes:
      "A controlled workspace access block. Without onRoleChange, roles are read-only. Owner transfer is intentionally outside this flow. The example updates local state; enforce permissions and persist changes in your application before updating members. Search matches names and email addresses.",
    api: [
      [
        "members",
        "readonly AccessMember[]",
        "Stable ID, name, email, optional image, and Owner, Admin or Member role.",
      ],
      [
        "onRoleChange",
        "(id, role) => void",
        "Requests an Admin or Member role; the caller owns state and persistence.",
      ],
    ],
  },
  {
    name: "notification-preferences",
    title: "Notification preferences",
    category: "Blocks",
    previewWidth: 600,
    previewHeight: 440,
    description:
      "An email preferences form with per-channel switches, unsaved state, and async save feedback.",
    dependencies: ["card", "button", "switch"],
    usage: "<NotificationPreferences />",
    notes:
      "This is an email settings block, not a generic form. initialValues seed the three channels on mount; use a key when switching accounts. onSave may return a promise. While saving, edits are disabled; failures preserve the draft for retry. Without onSave, changes stay in the local demo.",
    api: [
      [
        "initialValues",
        "NotificationSettings",
        "Initial mentions, projectUpdates and weeklyDigest booleans.",
      ],
      [
        "onSave",
        "(values) => void | Promise<void>",
        "Persist preferences; reject to show retry feedback.",
      ],
    ],
  },
  {
    name: "invoice-list",
    title: "Invoice list",
    category: "Blocks",
    previewWidth: 600,
    previewHeight: 420,
    description:
      "Billing records with status filters, readable amounts, optional document links, and empty states.",
    dependencies: ["card"],
    usage: `<InvoiceList invoices={[
  { id: "INV-2026-009", description: "Studio plan", date: "Sep 1, 2026", amount: "$128.00", status: "Open" },
  { id: "INV-2026-008", description: "Studio plan", date: "Aug 1, 2026", amount: "$128.00", status: "Paid" },
  { id: "INV-2026-007", description: "Studio plan + usage", date: "Jul 1, 2026", amount: "$146.80", status: "Paid" },
]} />`,
    notes:
      "Pass dates and amounts formatted for your locale. Supply href only when a real invoice document is available; otherwise the document action is omitted. This block displays billing records and does not collect payments. Empty collections and unmatched filters have separate messages.",
    api: [
      [
        "invoices",
        "readonly Invoice[]",
        "ID, description, date, amount, Paid/Open/Overdue status, and optional document URL.",
      ],
    ],
  },
  {
    name: "stat-card",
    title: "Stat card",
    category: "Data display",
    description:
      "A key metric with a sparkline, period comparison, and meaningful trend direction.",
    dependencies: ["card"],
    usage:
      '<StatCard title="Response time" value="124 ms" change="18.4%" trend="down" positiveTrend="down" sparkline={[180, 162, 170, 148, 136, 124]} description="vs. previous period" />',
  },
  {
    name: "metric-chart",
    title: "Metric chart",
    category: "Data display",
    description:
      "An area chart with period comparison, value formatting, and an accessible summary.",
    dependencies: ["card"],
    usage:
      '<MetricChart title="Traffic" seriesLabel="Sessions" data={[{ label: "Mon", value: 1200, previous: 980 }, { label: "Tue", value: 1800, previous: 1400 }]} />',
  },
  {
    name: "data-table",
    title: "Data table",
    category: "Data display",
    description: "Search, sort, and paginate. Bring your own data.",
    dependencies: ["button", "input", "table"],
    usage:
      '<DataTable rows={[{ id: "1", name: "Maya Okafor" }]} columns={[{ key: "name", label: "Name", value: row => row.name, sortable: true }]} getRowId={row => row.id} />',
  },
  {
    name: "activity-feed",
    previewWidth: 480,
    previewHeight: 340,
    title: "Activity feed",
    category: "Blocks",
    description: "A clear timeline of what happened and who made it happen.",
    dependencies: ["card"],
    usage:
      '<ActivityFeed items={[{ id: "1", initials: "MO", content: "Olivia deployed a release.", time: "12 minutes ago" }]} />',
  },
  {
    name: "status-badge",
    title: "Status badge",
    category: "Feedback",
    description: "Small signals for healthy, pending, and failed states.",
    dependencies: [],
    usage: '<StatusBadge variant="success">Active</StatusBadge>',
  },
  {
    name: "storage-meter",
    previewWidth: 480,
    previewHeight: 340,
    title: "Storage meter",
    category: "Blocks",
    description: "See what is using your space, and how much is left.",
    dependencies: ["card"],
    usage:
      '<StorageMeter capacity={100} segments={[{ label: "Documents", value: 24, color: "var(--color-primary)" }]} />',
  },
  {
    name: "avatar-stack",
    title: "Avatar stack",
    category: "Data display",
    description: "Put a face—or a set of initials—to your team.",
    dependencies: [],
    usage:
      '<AvatarStack members={[{ id: "1", name: "Maya Okafor" }, { id: "2", name: "Leo Nakamura" }]} />',
  },
  {
    name: "page-header",
    title: "Page header",
    category: "Layout",
    description: "A consistent place for page titles and primary actions.",
    dependencies: [],
    usage:
      '<PageHeader eyebrow="Workspace" title="Team members" description="Manage access to your workspace." />',
  },
  {
    name: "empty-state",
    title: "Empty state",
    category: "Feedback",
    description: "Make a quiet screen a useful next step.",
    dependencies: [],
    usage:
      '<EmptyState title="No projects yet" description="Create your first project to get started." />',
  },
  {
    name: "steps",
    title: "Steps",
    category: "Navigation",
    description: "Give setup flows and onboarding a sense of progress.",
    dependencies: [],
    usage:
      '<Steps steps={["Account", "Workspace", "Invite team"]} current={1} />',
  },
  {
    name: "pricing-card",
    previewWidth: 480,
    previewHeight: 340,
    title: "Pricing card",
    category: "Blocks",
    description: "A considered home for plans, features, and upgrades.",
    dependencies: ["card"],
    usage:
      '<PricingCard name="Pro" price="$29" description="For growing teams." features={["Unlimited projects", "Priority support"]} action={<a href="/billing">Choose Pro</a>} />',
  },
  {
    name: "settings-panel",
    previewWidth: 480,
    previewHeight: 340,
    title: "Settings panel",
    category: "Blocks",
    description:
      "A workspace settings block with name and contact email fields, validation, and save feedback.",
    dependencies: ["card", "input", "button"],
    notes:
      "This block is a workspace form, not a general form component. Edit the installed fields and validation for your product. initialName and initialEmail seed the form on mount; use a key when switching workspaces. Pass an async onSave callback to persist changes. Without it, saving only updates the local demo. Saving requires changes and locks the fields until the request finishes. Errors preserve the entered values for retry.",
    usage:
      '<SettingsPanel initialName="Acme Studio" initialEmail="team@acme.example" />',
  },
  {
    name: "dashboard",
    title: "Dashboard",
    category: "Blocks",
    description:
      "A working console with metrics, members, activity, and settings.",
    dependencies: ["card", "button", "input", "table"],
    usage: "<Dashboard />",
  },
  {
    name: "feature-card",
    title: "Feature card",
    category: "Layout",
    description:
      "An announcement or cover with a decorative corner icon, background image, and composed actions.",
    dependencies: ["card"],
    imports: "FeatureCard, FeatureCardDecoration, FeatureCardContent",
    exampleImports:
      'import { IconGhost } from "@tabler/icons-react"\nimport { CardTitle, CardDescription } from "@/components/ui/card"\nimport { Button } from "@/components/ui/button"',
    usage:
      "<FeatureCard>\n  <FeatureCardDecoration><IconGhost /></FeatureCardDecoration>\n  <FeatureCardContent>\n    <CardTitle>Your next idea starts here</CardTitle>\n    <CardDescription>A quiet space for focused work.</CardDescription>\n    <Button>Start a project</Button>\n  </FeatureCardContent>\n</FeatureCard>",
  },
  {
    name: "media-card",
    title: "Media card",
    category: "Layout",
    description:
      "Image-led content with stacked and split layouts, independent body and footer slots.",
    dependencies: ["card"],
    imports:
      "MediaCard, MediaCardImage, MediaCardBody, MediaCardContent, MediaCardFooter",
    exampleImports:
      'import { CardTitle } from "@/components/ui/card"\nimport { Button } from "@/components/ui/button"',
    usage:
      '<MediaCard>\n  <MediaCardImage src="/project.jpg" alt="Project moodboard" />\n  <MediaCardBody>\n    <MediaCardContent><CardTitle>Visitor experience</CardTitle></MediaCardContent>\n    <MediaCardFooter><Button>View project</Button></MediaCardFooter>\n  </MediaCardBody>\n</MediaCard>',
  },
  {
    name: "detail-list",
    title: "Detail list",
    category: "Data display",
    description:
      "Readable label–value pairs for profiles, invoices, and project details.",
    dependencies: [],
    usage:
      '<DetailList items={[{ id: "location", label: "Location", value: "Lisbon, Portugal" }]} />',
  },
  {
    name: "resource-progress",
    title: "Resource progress",
    category: "Data display",
    description:
      "Labeled progress for delivery milestones, storage quotas, and resource usage.",
    dependencies: [],
    usage:
      '<ResourceProgress label="Storage used" value={42.8} max={100} valueLabel="42.8 of 100 GB" />',
  },
  {
    name: "uptime-history",
    title: "Uptime history",
    category: "Data display",
    description:
      "Availability over time, with a text alternative for every sample.",
    dependencies: [],
    usage:
      '<UptimeHistory label="Workspace API availability" samples={[{ id: "sep-21", label: "September 21", status: "operational" }]} />',
  },
  {
    name: "metric-group",
    title: "Metric group",
    category: "Data display",
    description:
      "A compact shared surface for related metrics and their context.",
    dependencies: [],
    imports: "MetricGroup, MetricGroupItem",
    usage:
      '<MetricGroup>\n  <MetricGroupItem label="Revenue" value="$36,800" context="Up 12.8% this month" />\n  <MetricGroupItem label="Active projects" value="24" context="Across six clients" />\n</MetricGroup>',
  },
  {
    name: "project-portfolio",
    title: "Project portfolio",
    category: "Blocks",
    description:
      "A searchable project collection with cover images, progress, owners, and navigation.",
    dependencies: ["card", "button", "input"],
    usage:
      '<ProjectPortfolio projects={[{ id: "PR-101", name: "Visitor experience", client: "Culture venue", category: "Experience design", image: { src: "/project.jpg", alt: "Project moodboard" }, status: { label: "In progress", variant: "info" }, progress: 72, owner: { id: "maya", name: "Maya Okafor" }, href: "/projects/PR-101" }]} />',
  },
  {
    name: "service-status",
    title: "Service status",
    category: "Blocks",
    description:
      "Service health, availability history, and a slot for period controls or incident notes.",
    dependencies: ["card"],
    usage:
      '<ServiceStatus services={[{ id: "api", name: "Workspace API", status: "operational", samples: [{ id: "sep-21", label: "September 21", status: "operational" }] }]} />',
  },
  {
    name: "sparkline",
    title: "Sparkline",
    category: "Data display",
    description:
      "A lightweight inline trend for cards and compact summaries, with a text alternative.",
    dependencies: [],
    usage:
      '<Sparkline label="Weekly sessions" data={[980, 1120, 1050, 1360, 1240, 1480, 1570]} />',
  },
  {
    name: "ranked-list",
    title: "Ranked list",
    category: "Data display",
    description:
      "Compare sources, products, or regions with sorted bars, values, and share of total.",
    dependencies: [],
    usage:
      '<RankedList label="Traffic sources" items={[{ id: "search", label: "Organic search", value: 3784 }, { id: "direct", label: "Direct", value: 2200 }]} />',
  },
  {
    name: "conversion-funnel",
    title: "Conversion funnel",
    category: "Data display",
    description:
      "A readable journey through conversion stages, including overall and step conversion rates.",
    dependencies: [],
    usage:
      '<ConversionFunnel label="Subscription conversion" stages={[{ id: "sessions", label: "Sessions", value: 8800 }, { id: "trial", label: "Started a trial", value: 528 }, { id: "paid", label: "Subscribed", value: 176 }]} />',
  },
  {
    name: "analytics-overview",
    title: "Analytics overview",
    category: "Blocks",
    description:
      "A complete acquisition report with period comparisons, traffic sources, conversion stages, and CSV export.",
    dependencies: ["card", "button"],
    usage: "<AnalyticsOverview />",
  },
  {
    name: "section-card",
    title: "Section card",
    category: "Layout",
    description:
      "A consistent heading, description, actions, and content surface for admin panels.",
    dependencies: ["card"],
    usage:
      '<SectionCard title="Project details" description="The essentials, in one place.">\n  <p>Your content goes here.</p>\n</SectionCard>',
    notes:
      "Use title and description for context, actions for controls, and children for the body. contentClassName adjusts the body spacing. All Card attributes are forwarded; no workspace CSS is required.",
    api: [
      [
        "title / description",
        "ReactNode",
        "Optional heading and supporting text.",
      ],
      ["actions", "ReactNode", "Header controls; wraps on narrow screens."],
      [
        "contentClassName",
        "string",
        "Additional classes for the content slot.",
      ],
    ],
  },
  {
    name: "ribbon-card",
    title: "Ribbon card",
    category: "Layout",
    description:
      "Highlight a plan, release, or announcement with a compact ribbon label.",
    dependencies: ["card", "badge"],
    usage:
      '<RibbonCard title="Studio plan" ribbon="Popular">\n  <p>A shared home for your growing team.</p>\n</RibbonCard>',
    notes:
      'The top ribbon sits alongside header actions and stays inside the card on mobile. Use ribbonPosition="text" to put it below the content. Supports all SectionCard props.',
    api: [
      ["ribbon", "ReactNode", "Text or an icon with an accessible label."],
      ["ribbonPosition", '"top" | "text"', "Defaults to top."],
      ["actions", "ReactNode", "Optional header controls."],
    ],
  },
  {
    name: "status-edge-card",
    title: "Status edge card",
    category: "Layout",
    description:
      "Give service health, warnings, and review states a quiet colored edge.",
    dependencies: ["card"],
    usage:
      '<StatusEdgeCard title="Action required" tone="danger" edge="start">\n  <p>Update the payment method to keep your workspace active.</p>\n</StatusEdgeCard>',
    notes:
      "Edges use logical start/end positions for RTL layouts. The stripe is decorative: always include the status in text. Success, warning, and info use your corresponding color tokens, falling back to primary when absent. Supports all SectionCard props.",
    api: [
      ["edge", '"top" | "bottom" | "start" | "end"', "Defaults to top."],
      [
        "tone",
        '"primary" | "success" | "warning" | "danger" | "info"',
        "Defaults to primary.",
      ],
      ["children", "ReactNode", "Explain the status and next action."],
    ],
  },
  {
    name: "search-field",
    title: "Search field",
    category: "Forms",
    description:
      "An accessible, controlled search input with a leading search icon.",
    dependencies: ["input"],
    exampleImports: 'import { useState } from "react"',
    usage:
      'function ProjectSearch() {\n  const [query, setQuery] = useState("")\n  return <SearchField label="Search projects" value={query} onValueChange={setQuery} placeholder="Find a project…" />\n}',
    notes:
      "label is a persistent accessible name; placeholder is only a hint. The caller filters results and owns any debounce or remote request. Native input attributes such as disabled, autoComplete, and aria-describedby are forwarded.",
    api: [
      ["label", "string", "Required accessible name."],
      [
        "value / onValueChange",
        "string / (value: string) => void",
        "Controlled search text.",
      ],
      ["containerClassName", "string", "Width or positioning of the wrapper."],
      ["className", "string", "Classes applied to the input."],
    ],
  },
  {
    name: "filter-tabs",
    title: "Filter tabs",
    category: "Navigation",
    description:
      "Compact filter buttons with selected, count, and disabled states.",
    dependencies: ["button"],
    exampleImports: 'import { useState } from "react"',
    usage:
      'function ProjectFilters() {\n  const [filter, setFilter] = useState("all")\n  return <FilterTabs label="Project status" value={filter} onValueChange={setFilter} items={[{ value: "all", label: "All projects", count: 12 }, { value: "active", label: "Active", count: 8 }]} />\n}',
    notes:
      "These controls filter one result set, so they use a named group and aria-pressed buttons. Tab and Shift+Tab move through enabled options; Enter or Space select one. Use shadcn Tabs for separate tab panels.",
    api: [
      ["label", "string", "Required accessible group name."],
      [
        "items",
        "FilterOption[]",
        "Unique value, label, optional count and disabled.",
      ],
      [
        "value / onValueChange",
        "string / (value: string) => void",
        "Selection is controlled by the caller.",
      ],
    ],
  },
  {
    name: "chart-legend",
    title: "Chart legend",
    category: "Data display",
    description:
      "Series keys and formatted values for charts, quotas, and compact reports.",
    dependencies: [],
    usage:
      '<ChartLegend layout="horizontal" items={[\n  { label: "This month", color: "var(--color-primary)", value: "$36,800" },\n  { label: "Last month", color: "var(--color-muted-foreground)", dashed: true },\n]} />',
    notes:
      "Color markers are decorative and each series has a written label. Dashed markers distinguish comparison data without relying only on color. Values accept formatted text or React content.",
    api: [
      [
        "items",
        "ChartLegendItem[]",
        "Unique labels, CSS color, optional value and dashed marker.",
      ],
      ["layout", '"horizontal" | "vertical"', "Defaults to vertical."],
      ["label", "string", "Accessible list name; defaults to Chart legend."],
    ],
  },
  {
    name: "timeline",
    title: "Timeline",
    category: "Data display",
    description:
      "Release milestones and activity history with timestamps and optional avatars.",
    dependencies: [],
    imports: "Timeline",
    usage:
      '<Timeline items={[\n  { id: "review", title: "Review approved", time: "Today, 10:24", description: "Ready for the next release." },\n  { id: "build", title: "Build completed", time: "Today, 10:12" },\n]} />',
    notes:
      "Supply stable IDs for changing feeds, dateTime for machine-readable timestamps, and description for supporting details. Image failures fall back to initials. An empty array shows emptyMessage. TimelineItem can also be composed inside your own list.",
    api: [
      [
        "items",
        "TimelineItemProps[]",
        "Title, time, optional ID, description, avatar, initials, color, dateTime.",
      ],
      ["label", "string", "Accessible ordered-list name."],
      ["emptyMessage", "string", "Message when there are no events."],
    ],
  },
  {
    name: "task-list",
    previewWidth: 480,
    previewHeight: 340,
    title: "Task list",
    category: "Blocks",
    description:
      "Compact task rows with controlled completion, due dates, and comment counts.",
    dependencies: ["card", "checkbox"],
    imports: "TaskList",
    exampleImports: 'import { useState } from "react"',
    usage:
      'function ProjectTasks() {\n  const [tasks, setTasks] = useState([{ id: "brief", title: "Review the brief", due: "Today", done: false }])\n  return <TaskList tasks={tasks} onTaskChange={(id, done) => setTasks(current => current.map(task => task.id === id ? { ...task, done } : task))} />\n}',
    notes:
      "The caller owns completion and persistence. Without onTaskChange, rows are read-only; a disabled task cannot be toggled. TaskCard is the list-item primitive for custom layouts. Stable task IDs are required.",
    api: [
      [
        "tasks",
        "TaskItem[]",
        "ID, title, optional due, progressText, comments, done and disabled.",
      ],
      [
        "onTaskChange",
        "(id: string, done: boolean) => void",
        "Called when a completion checkbox changes.",
      ],
      ["title / emptyMessage", "string", "List heading and empty-state text."],
    ],
  },
  {
    name: "file-list",
    title: "File list",
    category: "Data display",
    description:
      "Readable attachment rows with metadata, links, and caller-owned actions.",
    dependencies: [],
    usage:
      '<FileList items={[\n  { id: "brief", name: "Project brief.pdf", description: "PDF · 2.4 MB", href: "/files/brief.pdf" },\n  { id: "notes", name: "Research notes.md", description: "Markdown · 12 KB" },\n]} />',
    notes:
      "Pass real file URLs through href or supply actions such as a download link or remove button. No network requests or upload behavior are built in. An empty array shows emptyMessage; long names wrap.",
    api: [
      [
        "items",
        "FileListItem[]",
        "Stable ID, name, optional description, href, icon and actions.",
      ],
      ["label", "string", "Accessible list name."],
      ["emptyMessage", "string", "Message when no files are present."],
    ],
  },
  {
    name: "member-card",
    previewWidth: 480,
    previewHeight: 340,
    title: "Member card",
    category: "Blocks",
    description:
      "A reusable team card with avatar, role, profile details, and actions.",
    dependencies: ["card"],
    usage:
      '<MemberCard\n  member={{ id: "maya", name: "Maya Okafor" }}\n  description="Design director"\n  details={[{ id: "location", label: "Location", value: "Lisbon, Portugal" }]}\n  action={<a href="/people/maya">View profile</a>}\n/>',
    notes:
      "Composes SectionCard, AvatarStack and DetailList. Images are optional and fall back to initials. Supply badge for role or availability, details for profile fields, and action for your own navigation or controls.",
    api: [
      ["member", "TeamMember", "Stable ID, name and optional image URL."],
      [
        "description / badge",
        "string / ReactNode",
        "Role description and status indicator.",
      ],
      ["details", "DetailItem[]", "Optional label–value rows."],
      ["action", "ReactNode", "Navigation or member actions."],
    ],
  },
] as const;
// Browse from page structure and everyday records to reporting and specialized charts.
const displayOrder: readonly string[] = [
  "page-header",
  "section-card",
  "stat-card",
  "kpi-card",
  "metric-group",
  "metric-value",
  "delta-badge",
  "metric-list",
  "data-table",
  "advanced-data-table",
  "search-field",
  "filter-tabs",
  "period-tabs",
  "command-palette",
  "team-access",
  "notification-preferences",
  "integration-list",
  "invoice-list",
  "settings-panel",
  "member-card",
  "avatar-stack",
  "detail-list",
  "task-list",
  "file-list",
  "activity-feed",
  "timeline",
  "event-timeline",
  "status-badge",
  "empty-state",
  "steps",
  "metric-chart",
  "trend-chart",
  "bar-chart",
  "composed-chart",
  "sparkline",
  "trend-sparkline",
  "chart-legend",
  "ranked-list",
  "bar-list",
  "distribution-bar",
  "donut-chart",
  "conversion-funnel",
  "funnel-chart",
  "resource-progress",
  "storage-meter",
  "tick-bar",
  "segmented-meter",
  "radial-gauge",
  "activity-rings",
  "uptime-history",
  "activity-heatmap",
  "heatmap-chart",
  "dot-plot",
  "radar-chart",
  "scatter-chart",
  "sankey-chart",
  "feature-card",
  "media-card",
  "ribbon-card",
  "status-edge-card",
  "pricing-card",
  "corner-frame",
  "dashboard",
  "analytics-overview",
  "project-portfolio",
  "service-status",
];
export const catalog = [...items].sort((a, b) => {
  const rank = (name: string) => {
    const index = displayOrder.indexOf(name);
    return index < 0 ? displayOrder.length : index;
  };
  return rank(a.name) - rank(b.name);
});
export type CatalogItem = (typeof catalog)[number];
export type ItemName = CatalogItem["name"];
export function catalogPath(item: Pick<CatalogItem, "name" | "category">) {
  return `/${item.category === "Blocks" ? "blocks" : "components"}/${item.name}`;
}
export const componentCount = catalog.filter(
  (item) => item.category !== "Blocks",
).length;

export const blockCount = catalog.filter(
  (item) => item.category === "Blocks",
).length;

/** Business regions, distinct from the primitive component categories. */
export const blockCollections: readonly {
  label: string;
  names: readonly ItemName[];
}[] = [
  {
    label: "Workspace",
    names: [
      "team-access",
      "notification-preferences",
      "integration-list",
      "settings-panel",
      "member-card",
    ],
  },
  { label: "Billing", names: ["invoice-list", "pricing-card"] },
  {
    label: "Operations",
    names: ["task-list", "activity-feed", "storage-meter"],
  },
  {
    label: "Overviews",
    names: [
      "dashboard",
      "analytics-overview",
      "project-portfolio",
      "service-status",
    ],
  },
];
