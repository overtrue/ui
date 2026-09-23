# Component and block boundaries

Reviewed all 65 core catalog entries by exported API, implementation, preview imports, displayed source, and Usage. The 368 extracted workspace card patterns remain blocks; they retain their business layout and demo behavior.

A component owns one UI behavior or presentation contract through data, callbacks, or composition slots. A block assembles an opinionated business region. Both are React components in code. Props, a Card wrapper, source-file size, and composition of shadcn primitives do not by themselves determine the catalog category.

## Composed blocks (13)

| Item | Why it is a block |
| --- | --- |
| `team-access` | Workspace roster, search, owner role, and controlled access changes. |
| `notification-preferences` | Fixed email channels with dirty state and async save/retry lifecycle. |
| `invoice-list` | Billing history, status filters, document links, and empty states. |
| `settings-panel` | Fixed workspace name/email form and save lifecycle; edit the block for other schemas. |
| `member-card` | Assembled identity, role, profile details, badge, and member action. |
| `task-list` | Assembled task card with due dates, comments, and completion controls. |
| `activity-feed` | Complete recent-activity card, using an avatar feed layout; Timeline remains a primitive. |
| `storage-meter` | Complete storage overview with heading, usage summary, segments, and legend. |
| `pricing-card` | Assembled plan, monthly price, feature list, and purchase action. |
| `dashboard` | Complete console with fixed navigation and fictional reports/members/settings. |
| `analytics-overview` | Complete report with period selection, traffic, sources, conversion, and CSV export. |
| `project-portfolio` | Project collection with fixed project fields, search, covers, owners, and navigation. |
| `service-status` | Service-health card combining status records, history, and incident content. |

## Components (52)

| Item | Reusable contract |
| --- | --- |
| `page-header` | A consistent place for page titles and primary actions. |
| `section-card` | A consistent heading, description, actions, and content surface for admin panels. |
| `stat-card` | A key metric with a sparkline, period comparison, and meaningful trend direction. |
| `kpi-card` | Keep the current value, comparison period, and direction together in one compact summary. |
| `metric-group` | A compact shared surface for related metrics and their context. |
| `metric-value` | Format large totals consistently while keeping the exact figure available on hover. |
| `delta-badge` | Show whether a change is helpful, harmful, or neutral in the context of the metric. |
| `metric-list` | Collect related operational measures in a scan-friendly list with compact trends. |
| `data-table` | Search, sort, and paginate. Bring your own data. |
| `advanced-data-table` | Build record views with filtering, selection, column controls, and actions close to the data. |
| `search-field` | An accessible, controlled search input with a leading search icon. |
| `filter-tabs` | Compact filter buttons with selected, count, and disabled states. |
| `period-tabs` | Give a report a clear time range without taking attention away from the numbers. |
| `command-palette` | Help people jump to a project, find a record, or start their next task from the keyboard. |
| `avatar-stack` | Put a face—or a set of initials—to your team. |
| `detail-list` | Readable label–value pairs for profiles, invoices, and project details. |
| `file-list` | Readable attachment rows with metadata, links, and caller-owned actions. |
| `timeline` | Release milestones and activity history with timestamps and optional avatars. |
| `event-timeline` | Tell the story of a project through decisions, reviews, and completed steps. |
| `status-badge` | Small signals for healthy, pending, and failed states. |
| `empty-state` | Make a quiet screen a useful next step. |
| `steps` | Give setup flows and onboarding a sense of progress. |
| `metric-chart` | An area chart with period comparison, value formatting, and an accessible summary. |
| `trend-chart` | Compare changes over time with the chart style that fits the question. |
| `bar-chart` | Organize related observations into periods and call out the group that needs attention. |
| `composed-chart` | Put actuals, targets, and supporting measures on the same reporting surface. |
| `sparkline` | A lightweight inline trend for cards and compact summaries, with a text alternative. |
| `trend-sparkline` | Add just enough history to a number without introducing a chart axis. |
| `chart-legend` | Series keys and formatted values for charts, quotas, and compact reports. |
| `ranked-list` | Compare sources, products, or regions with sorted bars, values, and share of total. |
| `bar-list` | Compare the busiest destinations or highest-volume workstreams without a full chart. |
| `distribution-bar` | Show how a total is divided among categories in a single horizontal strip. |
| `donut-chart` | Explain the makeup of a total with a center summary and a readable legend. |
| `conversion-funnel` | A readable journey through conversion stages, including overall and step conversion rates. |
| `funnel-chart` | Follow work through successive stages and see where the biggest drop occurs. |
| `resource-progress` | Labeled progress for delivery milestones, storage quotas, and resource usage. |
| `tick-bar` | Make a count or capacity visible as a series of filled marks. |
| `segmented-meter` | Place a live value against named operating ranges and highlight its current zone. |
| `radial-gauge` | Use a compact dial to summarize a target, utilization level, or service measure. |
| `activity-rings` | Track several delivery goals together, each with its own target and progress. |
| `uptime-history` | Availability over time, with a text alternative for every sample. |
| `activity-heatmap` | Reveal working-day patterns and quieter weeks across a year of activity. |
| `heatmap-chart` | Find busy periods and uneven coverage across two dimensions. |
| `dot-plot` | Compare observations using position rather than bar area. |
| `radar-chart` | Compare the shape of multiple measures across categories. |
| `scatter-chart` | Explore how two measures move together, with optional bubble size for a third. |
| `sankey-chart` | Trace how time or budget moves from one category to the next. |
| `feature-card` | An announcement or cover with a decorative corner icon, background image, and composed actions. |
| `media-card` | Image-led content with stacked and split layouts, independent body and footer slots. |
| `ribbon-card` | Highlight a plan, release, or announcement with a compact ribbon label. |
| `status-edge-card` | Give service health, warnings, and review states a quiet colored edge. |
| `corner-frame` | Give an announcement or a short project brief a restrained visual boundary. |

Slot-based card primitives (SectionCard, FeatureCard, MediaCard, RibbonCard, StatusEdgeCard) stay in Components: they do not choose business fields or actions. StatCard and KpiCard accept arbitrary metrics; their demonstration data does not make them business blocks. FileList is an attachment-list primitive with caller-owned actions. CommandPalette, tables, and charts likewise receive their content and behavior from callers.

## Documentation contract

- Preview renders the exported registry implementation with demo data and variants.
- Source displays the exact installed implementation and its local dependencies; it is not labeled as preview example code.
- Usage displays a complete minimal React component. Imports, input data, and hook scope are included and checked against the real exports by `pnpm usage:check`.
- Components use `/components/:name`; composed blocks use `/blocks/:name`. Registry types, documentation links, navigation, metadata, and sitemap use the same catalog classification. Old component URLs redirect without changing registry names or install targets.
- SettingsPanel remains an editable workspace form. Its initial values are not a generic form-schema API. Field labels use grid layout with an 8px gap to their inputs.
